import { now, event } from "./db.js";
import {
  sha256, randomToken, signJwt, verifyJwt, hmac,
  hashPassword, verifyPassword, passwordProblem
} from "./crypto.js";
import { normalizeIp, resolveClientIp } from "./ip.js";

export class ApiError extends Error {
  constructor(status, code, extra = {}) { super(code); this.status = status; this.code = code; this.extra = extra; }
}

const DUMMY_HASH = hashPassword("compivox-dummy-password");
const DEVICE_RE = /^[A-Za-z0-9_-]{16,64}$/;
const normalizeUsername = (value) => String(value || "").trim().toLowerCase();
const validUsername = (value) => /^[a-z0-9_.-]{3,32}$/.test(value);

export function createServices({ db, cfg, risk }) {
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

  // Human checks are verified and consumed by the Cloudflare Worker before this private origin is reached.
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
  svc.requireIpVerification = (ctx, token) => {
    if (!ctx.ip || !ctx.trusted || !svc.checkIpToken(token, ctx.ip)) {
      throw new ApiError(403, "ip_verification_required");
    }
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

  const userByUsername = (username) => db.prepare("SELECT * FROM users WHERE username=? COLLATE NOCASE OR email=? COLLATE NOCASE").get(username, username);
  svc.userByUsername = userByUsername;

  svc.register = async (ctx, b) => {
    const username = normalizeUsername(b.username || b.id);
    if (!validUsername(username)) throw new ApiError(400, "invalid_username");
    if (b.password !== b.confirmPassword) throw new ApiError(400, "password_mismatch");
    const pp = passwordProblem(b.password, username);
    if (pp) throw new ApiError(400, pp);
    svc.limit(`reg:ip:${ctx.ip}`, 10, 3600);
    await svc.turnstile(b.turnstileToken, ctx.ip);
    svc.requireIpVerification(ctx, b.ipToken);
    svc.limit(`reg:user:${username}`, 5, 3600);
    if (userByUsername(username)) throw new ApiError(409, "username_taken");
    const email = `cvx-${randomToken(12)}@users.compivox.invalid`;
    const r = db.prepare("INSERT INTO users(username,email,password_hash,email_verified,created_at) VALUES(?,?,?,1,?)")
      .run(username, email, hashPassword(b.password), now());
    const user = { id: Number(r.lastInsertRowid), username, email, email_verified: 1 };
    db.prepare("INSERT INTO user_entitlements(user_id,plan,source,updated_at) VALUES(?,?,?,?)").run(user.id, "FREE", "default", now());
    event(db, user.id, "register", ctx.ip);
    return { s: newSession(user, "web", ctx), user, client: "web" };
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
    const username = normalizeUsername(b.username || b.id || b.email);
    const client = b.client === "desktop" ? "desktop" : "web";
    if ((!validUsername(username) && !/^[^\s@]+@[^\s@]+$/.test(username)) || typeof b.password !== "string" || b.password.length > 128) throw new ApiError(400, "invalid_credentials");
    svc.limit(`login:ip:${ctx.ip}`, client === "desktop" ? 20 : 30, 900);
    svc.requireIpVerification(ctx, b.ipToken);
    if (svc.isLocked(`loginfail:${username}`, 5)) throw new ApiError(429, "account_temporarily_locked");
    if (client === "web") await svc.turnstile(b.turnstileToken, ctx.ip);
    const user = userByUsername(username);
    const ok = verifyPassword(b.password, user ? user.password_hash : DUMMY_HASH) && !!user;
    const log = (reason, success) => db.prepare("INSERT INTO login_history(user_id,email,ip,client,success,reason,created_at) VALUES(?,?,?,?,?,?,?)")
      .run(user?.id ?? null, username, ctx.ip, client, success, reason, now());
    if (!ok) {
      svc.hit(`loginfail:${username}`, 5, 900);
      log("bad_credentials", 0);
      throw new ApiError(401, "invalid_credentials");
    }
    if (user.status !== "active") { log("suspended", 0); throw new ApiError(403, "account_suspended"); }
    svc.clear(`loginfail:${username}`);
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
    if (!user || user.status !== "active") throw new ApiError(401, "invalid_refresh");
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

  svc.isAdmin = (user) => cfg.adminUsers.includes(user.username) || cfg.adminEmails.includes(user.email);

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

  svc.userView = (user) => ({ id: user.id, username: user.username, email: user.username, emailVerified: true, status: user.status, createdAt: user.created_at, admin: svc.isAdmin(user) });

  return svc;
}
