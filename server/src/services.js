import { now, event } from "./db.js";
import {
  sha256, randomToken, randomCode, signJwt, verifyJwt, safeEqual, hmac,
  hashPassword, verifyPassword, passwordProblem, normalizeEmail, validEmail, maskEmail
} from "./crypto.js";
import { normalizeIp, resolveClientIp } from "./ip.js";
import { verificationEmail, resetEmail } from "./mailer.js";

export class ApiError extends Error {
  constructor(status, code, extra = {}) { super(code); this.status = status; this.code = code; this.extra = extra; }
}

const DUMMY_HASH = hashPassword("compivox-dummy-password");
const DEVICE_RE = /^[A-Za-z0-9_-]{16,64}$/;

export function createServices({ db, cfg, mailer, risk, verifyTurnstile }) {
  const svc = {};

  svc.hit = (key, max, windowSec) => {
    const t = now();
    const row = db.prepare("SELECT count,reset_at FROM rate_limits WHERE key=?").get(key);
    if (!row || row.reset_at <= t) {
      db.prepare("INSERT OR REPLACE INTO rate_limits(key,count,reset_at) VALUES(?,?,?)").run(key, 1, t + windowSec);
      return true;
    }
    if (row.count >= max) return false;
    db.prepare("UPDATE rate_limits SET count=count+1 WHERE key=?").run(key);
    return true;
  };
  svc.limit = (key, max, windowSec) => {
    if (!svc.hit(key, max, windowSec)) throw new ApiError(429, "rate_limited");
  };
  svc.isLocked = (key, max) => {
    const row = db.prepare("SELECT count,reset_at FROM rate_limits WHERE key=?").get(key);
    return !!row && row.reset_at > now() && row.count >= max;
  };
  svc.clear = (key) => db.prepare("DELETE FROM rate_limits WHERE key=?").run(key);

  // Visual-only: the widget is shown in the UI, but the server does not verify the token.
  svc.turnstile = async () => {};

  svc.settingNum = (key, dflt) => {
    const r = db.prepare("SELECT value FROM settings WHERE key=?").get(key);
    const n = r ? parseInt(r.value, 10) : NaN;
    return Number.isFinite(n) ? n : dflt;
  };

  svc.ipToken = (ip) => signJwt({ p: "ipv", ip }, cfg.jwtKey, 600);
  svc.checkIpToken = (token, ip) => {
    const b = verifyJwt(token, cfg.jwtKey);
    return !!b && b.p === "ipv" && b.ip === ip;
  };

  svc.client = (req) => {
    const c = resolveClientIp(req, cfg);
    return c;
  };

  // Blocks BLOCK-policy networks; CHALLENGE networks must present a valid ipToken.
  svc.accessGate = async (ctx, ipToken) => {
    if (!ctx.ip) throw new ApiError(400, "ip_unavailable");
    const a = await risk.assess(ctx.ip);
    ctx.risk = a;
    if (a.action === "BLOCK") { event(db, null, "network_blocked", ctx.ip, a.reasons.join(",")); throw new ApiError(403, "network_blocked", { reasons: a.reasons }); }
    if (a.action === "CHALLENGE" && !(ctx.trusted && svc.checkIpToken(ipToken, ctx.ip))) {
      throw new ApiError(403, "ip_verification_required", { reasons: a.reasons });
    }
    return a;
  };

  const issueCode = (userId, purpose, ttl) => {
    const code = randomCode();
    db.prepare("UPDATE email_verification_tokens SET used=1 WHERE user_id=? AND purpose=? AND used=0").run(userId, purpose);
    db.prepare("INSERT INTO email_verification_tokens(user_id,purpose,code_hash,expires_at,created_at) VALUES(?,?,?,?,?)")
      .run(userId, purpose, sha256(`${userId}:${purpose}:${code}`), now() + ttl, now());
    return code;
  };
  const consumeCode = (userId, purpose, code) => {
    const row = db.prepare("SELECT * FROM email_verification_tokens WHERE user_id=? AND purpose=? AND used=0 ORDER BY id DESC LIMIT 1").get(userId, purpose);
    if (!row) throw new ApiError(400, "code_invalid");
    if (row.expires_at < now()) throw new ApiError(410, "code_expired");
    if (row.attempts >= cfg.codeMaxAttempts) throw new ApiError(429, "too_many_attempts");
    if (!/^\d{6}$/.test(String(code)) || !safeEqual(row.code_hash, sha256(`${userId}:${purpose}:${code}`))) {
      db.prepare("UPDATE email_verification_tokens SET attempts=attempts+1 WHERE id=?").run(row.id);
      throw new ApiError(400, "code_invalid");
    }
    db.prepare("UPDATE email_verification_tokens SET used=1 WHERE id=?").run(row.id);
  };

  svc.sendCode = async (user, purpose) => {
    const ttl = purpose === "verify" ? cfg.codeTtlSec : 600;
    const code = issueCode(user.id, purpose, ttl);
    const mail = (purpose === "verify" ? verificationEmail : resetEmail)(code, Math.round(ttl / 60));
    try {
      await mailer.send(user.email, mail.subject, mail.text, mail.html);
    } catch (e) {
      db.prepare("UPDATE email_verification_tokens SET used=1 WHERE user_id=? AND purpose=? AND used=0").run(user.id, purpose);
      throw new ApiError(502, e.message === "mail_not_configured" ? "email_not_configured" : "email_send_failed");
    }
  };

  const userByEmail = (email) => db.prepare("SELECT * FROM users WHERE email=?").get(email);
  svc.userByEmail = userByEmail;

  svc.register = async (ctx, b) => {
    const email = normalizeEmail(b.email);
    if (!validEmail(email)) throw new ApiError(400, "invalid_email");
    if (b.password !== b.confirmPassword) throw new ApiError(400, "password_mismatch");
    const pp = passwordProblem(b.password, email);
    if (pp) throw new ApiError(400, pp);
    svc.limit(`reg:ip:${ctx.ip}`, 10, 3600);
    await svc.turnstile(b.turnstileToken, ctx.ip);
    await svc.accessGate(ctx, b.ipToken);
    const existing = userByEmail(email);
    if (existing) {
      // Same response either way so registration cannot be used to enumerate accounts.
      if (!existing.email_verified && svc.hit(`resend:${email}`, 1, cfg.resendCooldownSec)) {
        try { await svc.sendCode(existing, "verify"); } catch { /* not revealed */ }
      }
      return { status: "verification_sent", email: maskEmail(email) };
    }
    svc.limit(`reg:email:${email}`, 5, 3600);
    const r = db.prepare("INSERT INTO users(email,password_hash,created_at) VALUES(?,?,?)").run(email, hashPassword(b.password), now());
    const user = { id: Number(r.lastInsertRowid), email };
    db.prepare("INSERT INTO user_entitlements(user_id,plan,source,updated_at) VALUES(?,?,?,?)").run(user.id, "FREE", "default", now());
    svc.hit(`resend:${email}`, 1, cfg.resendCooldownSec);
    try { await svc.sendCode(user, "verify"); }
    catch (e) { db.prepare("DELETE FROM users WHERE id=?").run(user.id); throw e; }
    event(db, user.id, "register", ctx.ip);
    return { status: "verification_sent", email: maskEmail(email) };
  };

  svc.verifyEmail = (ctx, b) => {
    const email = normalizeEmail(b.email);
    svc.limit(`verify:ip:${ctx.ip}`, 30, 900);
    const user = userByEmail(email);
    if (!user) throw new ApiError(400, "code_invalid");
    consumeCode(user.id, "verify", b.code);
    db.prepare("UPDATE users SET email_verified=1 WHERE id=?").run(user.id);
    event(db, user.id, "email_verified", ctx.ip);
    return { status: "verified" };
  };

  svc.resend = async (ctx, b) => {
    const email = normalizeEmail(b.email);
    if (!validEmail(email)) throw new ApiError(400, "invalid_email");
    svc.limit(`resend:ip:${ctx.ip}`, 10, 3600);
    await svc.turnstile(b.turnstileToken, ctx.ip);
    const user = userByEmail(email);
    if (user && !user.email_verified) {
      if (!svc.hit(`resend:${email}`, 1, cfg.resendCooldownSec)) throw new ApiError(429, "resend_cooldown");
      svc.limit(`resend:day:${email}`, 10, 86400);
      await svc.sendCode(user, "verify");
    }
    return { status: "verification_sent", email: maskEmail(email) };
  };

  svc.forgot = async (ctx, b) => {
    const email = normalizeEmail(b.email);
    if (!validEmail(email)) throw new ApiError(400, "invalid_email");
    svc.limit(`forgot:ip:${ctx.ip}`, 10, 3600);
    await svc.turnstile(b.turnstileToken, ctx.ip);
    const user = userByEmail(email);
    if (user && svc.hit(`forgot:${email}`, 1, cfg.resendCooldownSec)) {
      svc.limit(`forgot:day:${email}`, 10, 86400);
      await svc.sendCode(user, "reset");
    }
    return { status: "reset_sent" };
  };

  svc.reset = (ctx, b) => {
    const email = normalizeEmail(b.email);
    svc.limit(`reset:ip:${ctx.ip}`, 20, 900);
    const user = userByEmail(email);
    if (!user) throw new ApiError(400, "code_invalid");
    const pp = passwordProblem(b.newPassword, email);
    if (pp) throw new ApiError(400, pp);
    consumeCode(user.id, "reset", b.code);
    db.prepare("UPDATE users SET password_hash=?, email_verified=1 WHERE id=?").run(hashPassword(b.newPassword), user.id);
    db.prepare("UPDATE user_sessions SET revoked=1 WHERE user_id=?").run(user.id);
    event(db, user.id, "password_reset", ctx.ip);
    return { status: "password_changed" };
  };

  const newSession = (user, client, ctx, family) => {
    const refresh = randomToken(48);
    const t = now();
    const r = db.prepare("INSERT INTO user_sessions(user_id,family,refresh_hash,client,ip,user_agent,created_at,last_used_at,expires_at) VALUES(?,?,?,?,?,?,?,?,?)")
      .run(user.id, family || randomToken(12), sha256(refresh), client, ctx.ip, (ctx.ua || "").slice(0, 200), t, t, t + cfg.refreshTtlSec);
    const sid = Number(r.lastInsertRowid);
    const access = signJwt({ sub: user.id, sid }, cfg.jwtKey, cfg.accessTtlSec);
    return { access, refresh, sid };
  };
  svc.newSession = newSession;

  svc.login = async (ctx, b) => {
    const email = normalizeEmail(b.email);
    const client = b.client === "desktop" ? "desktop" : "web";
    if (!validEmail(email) || typeof b.password !== "string" || b.password.length > 128) throw new ApiError(400, "invalid_credentials");
    svc.limit(`login:ip:${ctx.ip}`, client === "desktop" ? 20 : 30, 900);
    if (svc.isLocked(`loginfail:${email}`, 5)) throw new ApiError(429, "account_temporarily_locked");
    // Desktop clients cannot render Turnstile; they rely on the stricter per-email and per-IP throttles above.
    if (client === "web") await svc.turnstile(b.turnstileToken, ctx.ip);
    await svc.accessGate(ctx, b.ipToken);
    const user = userByEmail(email);
    const ok = verifyPassword(b.password, user ? user.password_hash : DUMMY_HASH) && !!user;
    const log = (reason, success) => db.prepare("INSERT INTO login_history(user_id,email,ip,client,success,reason,created_at) VALUES(?,?,?,?,?,?,?)")
      .run(user?.id ?? null, email, ctx.ip, client, success, reason, now());
    if (!ok) {
      svc.hit(`loginfail:${email}`, 5, 900);
      log("bad_credentials", 0);
      throw new ApiError(401, "invalid_credentials");
    }
    if (user.status !== "active") { log("suspended", 0); throw new ApiError(403, "account_suspended"); }
    if (!user.email_verified) { log("unverified", 0); throw new ApiError(403, "email_not_verified"); }
    svc.clear(`loginfail:${email}`);
    log("ok", 1);
    const s = newSession(user, client, ctx);
    return { s, user, client };
  };

  svc.refresh = (ctx, token) => {
    if (!token || typeof token !== "string") throw new ApiError(401, "invalid_refresh");
    const row = db.prepare("SELECT * FROM user_sessions WHERE refresh_hash=?").get(sha256(token));
    if (!row) throw new ApiError(401, "invalid_refresh");
    if (row.rotated) {
      // A rotated token being replayed means it was copied: kill the whole family.
      db.prepare("UPDATE user_sessions SET revoked=1 WHERE family=?").run(row.family);
      event(db, row.user_id, "refresh_reuse_detected", ctx.ip);
      throw new ApiError(401, "invalid_refresh");
    }
    if (row.revoked || row.expires_at < now()) throw new ApiError(401, "invalid_refresh");
    const user = db.prepare("SELECT * FROM users WHERE id=?").get(row.user_id);
    if (!user || user.status !== "active" || !user.email_verified) throw new ApiError(401, "invalid_refresh");
    db.prepare("UPDATE user_sessions SET rotated=1, revoked=1 WHERE id=?").run(row.id);
    const s = newSession(user, row.client, ctx, row.family);
    return { s, user, client: row.client };
  };

  svc.authenticate = (req) => {
    const h = req.headers.authorization || "";
    const m = /^Bearer (.+)$/.exec(h);
    const body = m && verifyJwt(m[1], cfg.jwtKey);
    if (!body || !body.sid) throw new ApiError(401, "unauthorized");
    const sess = db.prepare("SELECT * FROM user_sessions WHERE id=? AND revoked=0 AND expires_at>?").get(body.sid, now());
    if (!sess || sess.user_id !== body.sub) throw new ApiError(401, "unauthorized");
    const user = db.prepare("SELECT * FROM users WHERE id=?").get(body.sub);
    if (!user || user.status !== "active") throw new ApiError(401, "unauthorized");
    db.prepare("UPDATE user_sessions SET last_used_at=? WHERE id=?").run(now(), sess.id);
    return { user, sid: sess.id };
  };

  svc.isAdmin = (user) => !!user.email_verified && cfg.adminEmails.includes(user.email);

  svc.plan = (user) => {
    const e = db.prepare("SELECT * FROM user_entitlements WHERE user_id=?").get(user.id);
    const active = e && e.plan === "PRO" && (!e.expires_at || e.expires_at > now());
    const plan = active ? "PRO" : "FREE";
    const month = new Date().toISOString().slice(0, 7);
    const used = db.prepare("SELECT COUNT(*) c FROM build_usage WHERE user_id=? AND month=?").get(user.id, month).c;
    return {
      plan,
      source: e?.source ?? "default",
      expiresAt: e?.expires_at ?? null,
      limits: plan === "PRO"
        ? { monthlyBuilds: null, advancedSettings: true, batchBuild: true, buildProfiles: true, detailedDiagnostics: true, advancedPackaging: true }
        : { monthlyBuilds: cfg.freeMonthlyBuilds, advancedSettings: false, batchBuild: false, buildProfiles: false, detailedDiagnostics: false, advancedPackaging: false },
      buildsUsedThisMonth: used,
      billing: "not_connected"
    };
  };

  svc.ipLimit = (ip) => {
    const ex = db.prepare("SELECT max_devices FROM ip_exceptions WHERE ip=?").get(ip);
    return ex ? ex.max_devices : svc.settingNum("limit.perIp", cfg.maxDevicesPerIp);
  };

  svc.registerDevice = (ctx, user, b) => {
    if (!user.email_verified) throw new ApiError(403, "email_not_verified");
    if (!ctx.ip || !ctx.trusted) throw new ApiError(403, "ip_untrusted");
    if (!DEVICE_RE.test(String(b.deviceId || ""))) throw new ApiError(400, "invalid_device_id");
    if (!svc.checkIpToken(b.ipToken, ctx.ip)) throw new ApiError(403, "ip_verification_required");
    const name = String(b.name || "My PC").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 60) || "My PC";
    const t = now();
    const mine = db.prepare("SELECT * FROM devices WHERE user_id=? AND device_id=?").get(user.id, b.deviceId);
    if (mine) {
      db.prepare("UPDATE devices SET last_seen_at=?, name=? WHERE id=?").run(t, name, mine.id);
      return { status: "already_registered" };
    }
    const count = db.prepare("SELECT COUNT(*) c FROM devices WHERE user_id=?").get(user.id).c;
    if (count >= svc.settingNum("limit.perAccount", cfg.maxDevicesPerAccount)) throw new ApiError(403, "account_device_limit");
    const known = db.prepare("SELECT 1 FROM device_registrations WHERE ip=? AND device_id=?").get(ctx.ip, b.deviceId);
    if (!known) {
      const n = db.prepare("SELECT COUNT(*) c FROM device_registrations WHERE ip=? AND created_at>?").get(ctx.ip, t - 90 * 86400).c;
      if (n >= svc.ipLimit(ctx.ip)) {
        event(db, user.id, "ip_device_limit", ctx.ip);
        throw new ApiError(403, "ip_device_limit");
      }
      db.prepare("INSERT INTO device_registrations(ip,device_id,first_user_id,created_at) VALUES(?,?,?,?)").run(ctx.ip, b.deviceId, user.id, t);
    }
    db.prepare("INSERT INTO devices(user_id,device_id,name,registered_ip,created_at,last_seen_at) VALUES(?,?,?,?,?,?)").run(user.id, b.deviceId, name, ctx.ip, t, t);
    event(db, user.id, "device_registered", ctx.ip, b.deviceId.slice(0, 8));
    return { status: "registered" };
  };

  svc.userView = (user) => ({ id: user.id, email: user.email, emailVerified: !!user.email_verified, status: user.status, createdAt: user.created_at, admin: svc.isAdmin(user) });

  return svc;
}
