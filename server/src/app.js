import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { now, event } from "./db.js";
import { ApiError, createServices } from "./services.js";
import { normalizeIp } from "./ip.js";
import { randomToken } from "./crypto.js";
import { loadPolicies } from "./risk.js";

const SUPPORT = {
  supported: ["Python", "C#/.NET", "C/C++", "Java", "Go", "Rust"],
  partial: ["JavaScript/TypeScript (web)", "React / Vue / Svelte", ".NET Framework", "Windows Script (.bat/.cmd/.ps1)"],
  planned: ["PHP", "Ruby"]
};

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json" };

const SEC_HEADERS = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "content-security-policy": "default-src 'self'; script-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'"
};

function send(res, status, obj, extra = {}) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...SEC_HEADERS, ...extra });
  res.end(body);
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > 16 * 1024) throw new ApiError(413, "payload_too_large");
    chunks.push(c);
  }
  if (!size) return {};
  try {
    const v = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!v || typeof v !== "object" || Array.isArray(v)) throw 0;
    return v;
  } catch { throw new ApiError(400, "invalid_json"); }
}

function parseCookies(req) {
  const out = {};
  for (const p of String(req.headers.cookie || "").split(";")) {
    const i = p.indexOf("=");
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  }
  return out;
}

export function createApp(deps) {
  const { db, cfg, risk } = deps;
  const svc = createServices(deps);
  const secure = cfg.publicUrl.startsWith("https://");
  const COOKIE = "cvx_rt";
  // One-time codes that hand a browser login back to the desktop app (in memory, short-lived).
  const HANDOFF_TTL_MS = 120_000;
  const handoffs = new Map();
  const webRoot = resolve(deps.webRoot || "../web");

  const setRefreshCookie = (token, maxAge) =>
    `${COOKIE}=${encodeURIComponent(token)}; Path=/api/auth; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;

  const sessionResponse = ({ s, user, client }) => {
    const body = { accessToken: s.access, expiresIn: cfg.accessTtlSec, user: svc.userView(user), plan: svc.plan(user) };
    if (client === "desktop") body.refreshToken = s.refresh;
    const headers = client === "web" ? { "set-cookie": setRefreshCookie(s.refresh, cfg.refreshTtlSec) } : {};
    return { body, headers };
  };

  const checkOrigin = (req) => {
    const o = req.headers.origin;
    if (o && o !== new URL(cfg.publicUrl).origin) throw new ApiError(403, "bad_origin");
  };

  const routes = {
    "GET /api/health": async () => ({ status: "ok", service: "compivox-api" }),
    "GET /api/support": async () => SUPPORT,
    "GET /api/config": async () => ({ turnstileSiteKey: cfg.turnstileSiteKey || null, turnstileConfigured: !!deps.verifyTurnstile, emailConfigured: deps.mailer.configured, riskProvider: risk.provider.name }),

    "POST /api/auth/register": async (c) => svc.register(c.ctx, c.body),
    "POST /api/auth/email/verify": async (c) => svc.verifyEmail(c.ctx, c.body),
    "POST /api/auth/email/resend": async (c) => svc.resend(c.ctx, c.body),
    "POST /api/auth/email/send-verification": async (c) => svc.resend(c.ctx, c.body),
    "POST /api/auth/password/forgot": async (c) => svc.forgot(c.ctx, c.body),
    "POST /api/auth/password/reset": async (c) => svc.reset(c.ctx, c.body),

    "POST /api/auth/login": async (c) => {
      const r = await svc.login(c.ctx, c.body);
      const { body, headers } = sessionResponse(r);
      return { __status: 200, __headers: headers, ...body };
    },
    "POST /api/auth/refresh": async (c) => {
      const cookies = parseCookies(c.req);
      const fromBody = typeof c.body.refreshToken === "string";
      if (!fromBody) checkOrigin(c.req);
      const r = svc.refresh(c.ctx, fromBody ? c.body.refreshToken : cookies[COOKIE]);
      const { body, headers } = sessionResponse(r);
      return { __status: 200, __headers: headers, ...body };
    },
    "POST /api/auth/desktop-handoff": async (c) => {
      const { user } = svc.authenticate(c.req);
      const s = svc.newSession(user, "desktop", c.ctx);
      const code = randomToken(32);
      handoffs.set(sha(code), { s, user, expires: Date.now() + HANDOFF_TTL_MS });
      return { code, expiresIn: HANDOFF_TTL_MS / 1000 };
    },
    "POST /api/auth/desktop-exchange": async (c) => {
      const key = sha(String(c.body.code || ""));
      const h = handoffs.get(key);
      handoffs.delete(key);
      if (!h || h.expires < Date.now()) throw new ApiError(400, "code_invalid");
      const { body } = sessionResponse({ s: h.s, user: h.user, client: "desktop" });
      return { __status: 200, ...body };
    },
    "POST /api/auth/logout": async (c) => {
      let sid = null;
      try { sid = svc.authenticate(c.req).sid; } catch { /* idempotent */ }
      if (sid) db.prepare("UPDATE user_sessions SET revoked=1 WHERE id=?").run(sid);
      const rt = parseCookies(c.req)[COOKIE] || c.body.refreshToken;
      if (rt) db.prepare("UPDATE user_sessions SET revoked=1 WHERE refresh_hash=?").run(sha(rt));
      return { __headers: { "set-cookie": setRefreshCookie("", 0) }, status: "signed_out" };
    },
    "GET /api/auth/me": async (c) => {
      const { user } = svc.authenticate(c.req);
      const devices = db.prepare("SELECT COUNT(*) c FROM devices WHERE user_id=?").get(user.id).c;
      return { user: svc.userView(user), plan: svc.plan(user), deviceCount: devices, deviceLimit: svc.settingNum("limit.perAccount", cfg.maxDevicesPerAccount) };
    },
    "POST /api/auth/password/change": async (c) => {
      const { user, sid } = svc.authenticate(c.req);
      svc.limit(`pwchange:${user.id}`, 5, 900);
      const { verifyPassword, hashPassword, passwordProblem } = await import("./crypto.js");
      if (!verifyPassword(String(c.body.currentPassword || ""), user.password_hash)) throw new ApiError(401, "invalid_credentials");
      const pp = passwordProblem(c.body.newPassword, user.email);
      if (pp) throw new ApiError(400, pp);
      db.prepare("UPDATE users SET password_hash=? WHERE id=?").run(hashPassword(c.body.newPassword), user.id);
      db.prepare("UPDATE user_sessions SET revoked=1 WHERE user_id=? AND id<>?").run(user.id, sid);
      event(db, user.id, "password_changed", c.ctx.ip);
      return { status: "password_changed" };
    },
    "GET /api/auth/sessions": async (c) => {
      const { user, sid } = svc.authenticate(c.req);
      const rows = db.prepare("SELECT id,client,ip,user_agent,created_at,last_used_at FROM user_sessions WHERE user_id=? AND revoked=0 AND expires_at>? ORDER BY last_used_at DESC").all(user.id, now());
      return { sessions: rows.map((r) => ({ ...r, current: r.id === sid })) };
    },
    "DELETE /api/auth/sessions/:id": async (c) => {
      const { user } = svc.authenticate(c.req);
      db.prepare("UPDATE user_sessions SET revoked=1 WHERE id=? AND user_id=?").run(Number(c.params.id), user.id);
      return { status: "revoked" };
    },

    "GET /api/security/ip-check": async (c) => {
      svc.limit(`ipcheck:${c.ctx.ip}`, 60, 600);
      const a = await risk.assess(c.ctx.ip);
      return { ip: c.ctx.ip, ipVersion: c.ctx.ip.includes(":") ? 6 : 4, trusted: c.ctx.trusted, action: a.action, assessed: a.assessed };
    },
    "POST /api/security/ip-verify": async (c) => {
      svc.limit(`ipverify:${c.ctx.ip}`, 20, 900);
      if (!c.ctx.ip || !c.ctx.trusted) throw new ApiError(403, "ip_untrusted");
      const typed = normalizeIp(c.body.ip);
      if (!typed || typed !== c.ctx.ip) throw new ApiError(400, "ip_mismatch");
      const a = await risk.assess(c.ctx.ip);
      if (a.action === "BLOCK") throw new ApiError(403, "network_blocked", { reasons: a.reasons });
      return { status: "verified", ipToken: svc.ipToken(c.ctx.ip), validForSec: 600 };
    },
    "GET /api/security/network-risk": async (c) => {
      const { user } = svc.authenticate(c.req);
      svc.limit(`netrisk:${user.id}`, 30, 600);
      return await risk.assess(c.ctx.ip);
    },

    "GET /api/devices": async (c) => {
      const { user } = svc.authenticate(c.req);
      const rows = db.prepare("SELECT id,device_id,name,registered_ip,created_at,last_seen_at FROM devices WHERE user_id=? ORDER BY created_at").all(user.id);
      return { devices: rows, limit: svc.settingNum("limit.perAccount", cfg.maxDevicesPerAccount) };
    },
    "POST /api/devices/register": async (c) => {
      const { user } = svc.authenticate(c.req);
      svc.limit(`devreg:${user.id}`, 20, 3600);
      await svc.turnstile(c.body.turnstileToken, c.ctx.ip);
      await svc.accessGate(c.ctx, c.body.ipToken);
      return svc.registerDevice(c.ctx, user, c.body);
    },
    "POST /api/devices/status": async (c) => {
      const { user } = svc.authenticate(c.req);
      const d = db.prepare("SELECT id,name,last_seen_at FROM devices WHERE user_id=? AND device_id=?").get(user.id, String(c.body.deviceId || ""));
      if (d) db.prepare("UPDATE devices SET last_seen_at=? WHERE id=?").run(now(), d.id);
      return { registered: !!d, name: d?.name ?? null };
    },
    "DELETE /api/devices/:id": async (c) => {
      const { user } = svc.authenticate(c.req);
      const r = db.prepare("DELETE FROM devices WHERE id=? AND user_id=?").run(Number(c.params.id), user.id);
      if (!r.changes) throw new ApiError(404, "not_found");
      event(db, user.id, "device_removed", c.ctx.ip);
      return { status: "removed" };
    },

    "GET /api/dashboard/overview": async (c) => {
      const { user } = svc.authenticate(c.req);
      const devices = db.prepare("SELECT COUNT(*) c FROM devices WHERE user_id=?").get(user.id).c;
      const builds = db.prepare("SELECT project,created_at FROM build_usage WHERE user_id=? ORDER BY id DESC LIMIT 5").all(user.id);
      const logins = db.prepare("SELECT COUNT(*) c FROM login_history WHERE user_id=? AND success=0 AND created_at>?").get(user.id, now() - 7 * 86400).c;
      return { user: svc.userView(user), plan: svc.plan(user), devices: { count: devices, limit: svc.settingNum("limit.perAccount", cfg.maxDevicesPerAccount) }, recentBuilds: builds, security: { emailVerified: !!user.email_verified, failedLoginsLast7Days: logins } };
    },
    "GET /api/dashboard/plan": async (c) => svc.plan(svc.authenticate(c.req).user),
    "GET /api/dashboard/security": async (c) => {
      const { user } = svc.authenticate(c.req);
      const logins = db.prepare("SELECT ip,client,success,reason,created_at FROM login_history WHERE user_id=? ORDER BY id DESC LIMIT 10").all(user.id);
      return { emailVerified: !!user.email_verified, recentLogins: logins };
    },

    "POST /api/builds/authorize": async (c) => {
      const { user } = svc.authenticate(c.req);
      if (!user.email_verified) throw new ApiError(403, "email_not_verified");
      const deviceId = String(c.body.deviceId || "");
      const dev = db.prepare("SELECT id FROM devices WHERE user_id=? AND device_id=?").get(user.id, deviceId);
      if (!dev) throw new ApiError(403, "device_not_registered");
      const p = svc.plan(user);
      if (p.limits.monthlyBuilds !== null && p.buildsUsedThisMonth >= p.limits.monthlyBuilds) throw new ApiError(403, "build_limit_reached", { limit: p.limits.monthlyBuilds });
      const month = new Date().toISOString().slice(0, 7);
      db.prepare("INSERT INTO build_usage(user_id,device_id,month,project,created_at) VALUES(?,?,?,?,?)").run(user.id, deviceId, month, String(c.body.project || "").slice(0, 80), now());
      db.prepare("UPDATE devices SET last_seen_at=? WHERE id=?").run(now(), dev.id);
      return { allowed: true, plan: p.plan, remaining: p.limits.monthlyBuilds === null ? null : p.limits.monthlyBuilds - p.buildsUsedThisMonth - 1 };
    },

    "GET /api/admin/settings": async (c) => {
      adminOnly(c);
      return { policies: loadPolicies(db, cfg), maxDevicesPerIp: svc.settingNum("limit.perIp", cfg.maxDevicesPerIp), maxDevicesPerAccount: svc.settingNum("limit.perAccount", cfg.maxDevicesPerAccount), exceptions: db.prepare("SELECT ip,max_devices,note FROM ip_exceptions").all() };
    },
    "PUT /api/admin/settings": async (c) => {
      adminOnly(c);
      const set = db.prepare("INSERT OR REPLACE INTO settings(key,value) VALUES(?,?)");
      for (const k of ["mobile", "vpn", "proxy", "tor", "datacenter", "unavailable"]) {
        const v = c.body.policies?.[k];
        if (v !== undefined) { if (!["ALLOW", "CHALLENGE", "BLOCK"].includes(v)) throw new ApiError(400, "invalid_policy"); set.run(`policy.${k}`, v); }
      }
      for (const [bk, sk] of [["maxDevicesPerIp", "limit.perIp"], ["maxDevicesPerAccount", "limit.perAccount"]]) {
        if (c.body[bk] !== undefined) { const n = Number(c.body[bk]); if (!Number.isInteger(n) || n < 1 || n > 100) throw new ApiError(400, "invalid_limit"); set.run(sk, String(n)); }
      }
      return { status: "saved" };
    },
    "GET /api/admin/devices": async (c) => {
      adminOnly(c);
      const ip = normalizeIp(c.url.searchParams.get("ip"));
      const rows = ip
        ? db.prepare("SELECT d.id,d.device_id,d.name,d.registered_ip,u.email FROM devices d JOIN users u ON u.id=d.user_id WHERE d.registered_ip=?").all(ip)
        : db.prepare("SELECT d.id,d.device_id,d.name,d.registered_ip,u.email FROM devices d JOIN users u ON u.id=d.user_id ORDER BY d.id DESC LIMIT 100").all();
      return { devices: rows, ipRegistrations: ip ? db.prepare("SELECT device_id,created_at FROM device_registrations WHERE ip=?").all(ip) : [] };
    },
    "DELETE /api/admin/devices/:id": async (c) => {
      adminOnly(c);
      const d = db.prepare("SELECT * FROM devices WHERE id=?").get(Number(c.params.id));
      if (!d) throw new ApiError(404, "not_found");
      db.prepare("DELETE FROM devices WHERE id=?").run(d.id);
      db.prepare("DELETE FROM device_registrations WHERE device_id=? AND ip=?").run(d.device_id, d.registered_ip);
      return { status: "released" };
    },
    "PUT /api/admin/ip-exceptions": async (c) => {
      adminOnly(c);
      const ip = normalizeIp(c.body.ip);
      const n = Number(c.body.maxDevices);
      if (!ip || !Number.isInteger(n) || n < 1 || n > 1000) throw new ApiError(400, "invalid_input");
      db.prepare("INSERT OR REPLACE INTO ip_exceptions(ip,max_devices,note,created_at) VALUES(?,?,?,?)").run(ip, n, String(c.body.note || "").slice(0, 120), now());
      return { status: "saved" };
    },
    "PUT /api/admin/users/plan": async (c) => {
      adminOnly(c);
      const u = svc.userByEmail(String(c.body.email || "").trim().toLowerCase());
      if (!u || !["FREE", "PRO"].includes(c.body.plan)) throw new ApiError(400, "invalid_input");
      db.prepare("INSERT OR REPLACE INTO user_entitlements(user_id,plan,source,expires_at,updated_at) VALUES(?,?,?,?,?)").run(u.id, c.body.plan, "admin", c.body.expiresAt ? Number(c.body.expiresAt) : null, now());
      return { status: "saved" };
    }
  };

  function adminOnly(c) {
    const { user } = svc.authenticate(c.req);
    if (!svc.isAdmin(user)) throw new ApiError(403, "forbidden");
    c.user = user;
  }

  const compiled = Object.entries(routes).map(([k, fn]) => {
    const [method, path] = k.split(" ");
    const keys = [];
    const re = new RegExp("^" + path.replace(/:([a-z]+)/g, (_, n) => { keys.push(n); return "([^/]+)"; }) + "$");
    return { method, re, keys, fn };
  });

  async function serveStatic(req, res, pathname) {
    let rel = decodeURIComponent(pathname);
    if (rel.endsWith("/")) rel += "index.html";
    if (!extname(rel)) rel += ".html";
    const file = resolve(webRoot, "." + rel);
    if (file !== webRoot && !file.startsWith(webRoot + sep)) { res.writeHead(403, SEC_HEADERS); return res.end(); }
    try {
      const data = await readFile(file);
      const ext = extname(file);
      res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream", "cache-control": ext === ".html" ? "no-cache" : "public, max-age=3600", ...SEC_HEADERS });
      res.end(req.method === "HEAD" ? undefined : data);
    } catch {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8", ...SEC_HEADERS });
      res.end("Not found");
    }
  }

  return async function handler(req, res) {
    const url = new URL(req.url, "http://x");
    const pathname = url.pathname;
    if (!pathname.startsWith("/api/")) {
      if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405, SEC_HEADERS); return res.end(); }
      return serveStatic(req, res, pathname);
    }
    try {
      let match = null;
      let pathMatched = false;
      for (const r of compiled) {
        const m = r.re.exec(pathname);
        if (!m) continue;
        pathMatched = true;
        if (r.method === req.method) { match = { r, params: Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])])) }; break; }
      }
      if (!match) throw new ApiError(pathMatched ? 405 : 404, pathMatched ? "method_not_allowed" : "not_found");
      const ci = svc.client(req);
      const ctx = { ip: ci.ip, trusted: ci.trusted, ua: req.headers["user-agent"] };
      if (req.method !== "GET" && !ctx.ip) throw new ApiError(400, "ip_unavailable");
      const body = req.method === "GET" || req.method === "DELETE" ? {} : await readJson(req);
      const out = await match.r.fn({ req, res, ctx, body, params: match.params, url });
      const { __status, __headers, ...payload } = out;
      send(res, __status || 200, payload, __headers || {});
    } catch (e) {
      if (e instanceof ApiError) {
        send(res, e.status, { error: e.code, ...e.extra }, e.status === 429 ? { "retry-after": "60" } : {});
      } else {
        console.error("unhandled", e?.message);
        send(res, 500, { error: "server_error" });
      }
    }
  };
}

import { sha256 as sha } from "./crypto.js";
