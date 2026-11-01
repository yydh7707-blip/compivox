import test from "node:test";
import assert from "node:assert/strict";
import { startServer, registerAndVerify, login, PW } from "./helpers.js";

test("register sends a code, verify enables login", async () => {
  const t = await startServer();
  const r = await t.call("POST", "/api/auth/register", { email: "A@Example.com", password: PW, confirmPassword: PW, turnstileToken: "ok" });
  assert.equal(r.status, 200);
  assert.equal(r.json.email, "a***@example.com");
  assert.equal(t.mails.length, 1);
  assert.equal(t.mails[0].to, "a@example.com");
  const un = await login(t);
  assert.equal(un.status, 403);
  assert.equal(un.json.error, "email_not_verified");
  const v = await t.call("POST", "/api/auth/email/verify", { email: "a@example.com", code: t.lastCode() });
  assert.equal(v.status, 200);
  const ok = await login(t);
  assert.equal(ok.status, 200);
  assert.ok(ok.json.accessToken && ok.json.refreshToken);
  const me = await t.call("GET", "/api/auth/me", null, { authorization: `Bearer ${ok.json.accessToken}` });
  assert.equal(me.json.user.emailVerified, true);
  assert.equal(me.json.plan.plan, "FREE");
  t.close();
});

test("validation: bad email, mismatch, weak password, duplicates, turnstile", async () => {
  const t = await startServer();
  const base = { email: "a@example.com", password: PW, confirmPassword: PW, turnstileToken: "ok" };
  assert.equal((await t.call("POST", "/api/auth/register", { ...base, email: "nope" })).json.error, "invalid_email");
  assert.equal((await t.call("POST", "/api/auth/register", { ...base, confirmPassword: "x" })).json.error, "password_mismatch");
  assert.equal((await t.call("POST", "/api/auth/register", { ...base, password: "short", confirmPassword: "short" })).json.error, "password_too_short");
  t.state.turnstileOk = false;
  assert.equal((await t.call("POST", "/api/auth/register", base)).json.error, "turnstile_failed");
  t.state.turnstileOk = true;
  assert.equal((await t.call("POST", "/api/auth/register", { ...base, turnstileToken: "" })).json.error, "turnstile_required");
  assert.equal((await t.call("POST", "/api/auth/register", base)).status, 200);
  const dup = await t.call("POST", "/api/auth/register", base);
  assert.equal(dup.status, 200);
  assert.equal(t.db.prepare("SELECT COUNT(*) c FROM users").get().c, 1);
  t.close();
});

test("email send failure is reported and leaves no user", async () => {
  const t = await startServer();
  t.mailer.fail = true;
  const r = await t.call("POST", "/api/auth/register", { email: "a@example.com", password: PW, confirmPassword: PW, turnstileToken: "ok" });
  assert.equal(r.status, 502);
  assert.equal(r.json.error, "email_send_failed");
  assert.equal(t.db.prepare("SELECT COUNT(*) c FROM users").get().c, 0);
  t.close();
});

test("code: wrong, expired, reused, attempts exceeded", async () => {
  const t = await startServer();
  const email = "a@example.com";
  await t.call("POST", "/api/auth/register", { email, password: PW, confirmPassword: PW, turnstileToken: "ok" });
  const good = t.lastCode();
  const wrong = good === "000000" ? "111111" : "000000";
  assert.equal((await t.call("POST", "/api/auth/email/verify", { email, code: wrong })).json.error, "code_invalid");
  t.db.exec("UPDATE email_verification_tokens SET expires_at=1");
  assert.equal((await t.call("POST", "/api/auth/email/verify", { email, code: good })).json.error, "code_expired");
  await t.call("POST", "/api/auth/email/resend", { email, turnstileToken: "ok" });
  const c2 = t.lastCode();
  assert.equal((await t.call("POST", "/api/auth/email/verify", { email, code: c2 })).status, 200);
  assert.equal((await t.call("POST", "/api/auth/email/verify", { email, code: c2 })).json.error, "code_invalid");

  await t.call("POST", "/api/auth/register", { email: "b@example.com", password: PW, confirmPassword: PW, turnstileToken: "ok" });
  const g = t.lastCode();
  const w = g === "000000" ? "111111" : "000000";
  for (let i = 0; i < 5; i++) await t.call("POST", "/api/auth/email/verify", { email: "b@example.com", code: w });
  const locked = await t.call("POST", "/api/auth/email/verify", { email: "b@example.com", code: g });
  assert.equal(locked.json.error, "too_many_attempts");
  t.close();
});

test("login: wrong password, lockout, refresh rotation and reuse detection, logout", async () => {
  const t = await startServer();
  await registerAndVerify(t);
  const bad = () => t.call("POST", "/api/auth/login", { email: "a@example.com", password: "Wrong-Pass-999", client: "desktop" });
  for (let i = 0; i < 5; i++) assert.equal((await bad()).json.error, "invalid_credentials");
  assert.equal((await bad()).json.error, "account_temporarily_locked");
  t.db.exec("DELETE FROM rate_limits");
  const ok = await login(t);
  const r1 = ok.json.refreshToken;
  const rot = await t.call("POST", "/api/auth/refresh", { refreshToken: r1 });
  assert.equal(rot.status, 200);
  assert.notEqual(rot.json.refreshToken, r1);
  const replay = await t.call("POST", "/api/auth/refresh", { refreshToken: r1 });
  assert.equal(replay.status, 401);
  const dead = await t.call("POST", "/api/auth/refresh", { refreshToken: rot.json.refreshToken });
  assert.equal(dead.status, 401);
  const again = await login(t);
  const lo = await t.call("POST", "/api/auth/logout", {}, { authorization: `Bearer ${again.json.accessToken}` });
  assert.equal(lo.status, 200);
  assert.equal((await t.call("GET", "/api/auth/me", null, { authorization: `Bearer ${again.json.accessToken}` })).status, 401);
  t.close();
});

test("suspended account cannot log in; web login needs turnstile and sets cookie", async () => {
  const t = await startServer();
  await registerAndVerify(t);
  const w = await t.call("POST", "/api/auth/login", { email: "a@example.com", password: PW, client: "web", turnstileToken: "ok" });
  assert.equal(w.status, 200);
  assert.match(w.headers.get("set-cookie"), /HttpOnly; SameSite=Strict/);
  assert.equal(w.json.refreshToken, undefined);
  t.state.turnstileOk = false;
  assert.equal((await t.call("POST", "/api/auth/login", { email: "a@example.com", password: PW, client: "web", turnstileToken: "bad" })).json.error, "turnstile_failed");
  t.db.exec("UPDATE users SET status='suspended'");
  assert.equal((await login(t)).json.error, "account_suspended");
  t.close();
});

test("password reset is one-time and revokes sessions; no account enumeration", async () => {
  const t = await startServer();
  await registerAndVerify(t);
  const s = await login(t);
  const unknown = await t.call("POST", "/api/auth/password/forgot", { email: "none@example.com", turnstileToken: "ok" });
  assert.equal(unknown.status, 200);
  const n = t.mails.length;
  await t.call("POST", "/api/auth/password/forgot", { email: "a@example.com", turnstileToken: "ok" });
  assert.equal(t.mails.length, n + 1);
  const code = t.lastCode();
  const NEW = "Another-Str0ng-1";
  assert.equal((await t.call("POST", "/api/auth/password/reset", { email: "a@example.com", code, newPassword: NEW })).status, 200);
  assert.equal((await t.call("POST", "/api/auth/password/reset", { email: "a@example.com", code, newPassword: NEW })).status, 400);
  assert.equal((await t.call("GET", "/api/auth/me", null, { authorization: `Bearer ${s.json.accessToken}` })).status, 401);
  const l = await t.call("POST", "/api/auth/login", { email: "a@example.com", password: NEW, client: "desktop" });
  assert.equal(l.status, 200);
  t.close();
});
