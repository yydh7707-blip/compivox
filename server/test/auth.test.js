import test from "node:test";
import assert from "node:assert/strict";
import { startServer, currentIpToken, registerAccount, login, PW } from "./helpers.js";

test("signup and login require the user to confirm the server-observed IP", async () => {
  const t = await startServer();
  const body = { username: "alpha", password: PW, confirmPassword: PW, termsAccepted: true, privacyAcknowledged: true };
  const required = await t.call("POST", "/api/auth/register", body);
  assert.equal(required.status, 403);
  assert.equal(required.json.error, "ip_verification_required");

  const check = await t.call("GET", "/api/security/ip-check");
  assert.equal(check.json.ip, "127.0.0.1");
  const mismatch = await t.call("POST", "/api/security/ip-verify", { ip: "203.0.113.1" });
  assert.equal(mismatch.json.error, "ip_mismatch");
  const token = await currentIpToken(t);
  const created = await t.call("POST", "/api/auth/register", { ...body, ipToken: token });
  assert.equal(created.status, 201);
  assert.equal(created.json.user.username, "alpha");
  assert.ok(created.json.accessToken);
  assert.match(created.headers.get("set-cookie"), /HttpOnly; SameSite=Strict/);

  const noToken = await t.call("POST", "/api/auth/login", { username: "alpha", password: PW });
  assert.equal(noToken.json.error, "ip_verification_required");
  assert.equal((await login(t)).status, 200);
  t.close();
});

test("ID, password and duplicate validation", async () => {
  const t = await startServer();
  const ipToken = await currentIpToken(t);
  const base = { username: "alpha", password: PW, confirmPassword: PW, termsAccepted: true, privacyAcknowledged: true, ipToken };
  assert.equal((await t.call("POST", "/api/auth/register", { ...base, username: "no" })).json.error, "invalid_username");
  assert.equal((await t.call("POST", "/api/auth/register", { ...base, termsAccepted: false })).json.error, "terms_acceptance_required");
  assert.equal((await t.call("POST", "/api/auth/register", { ...base, privacyAcknowledged: false })).json.error, "privacy_acknowledgment_required");
  assert.equal((await t.call("POST", "/api/auth/register", { ...base, confirmPassword: "different" })).json.error, "password_mismatch");
  assert.equal((await t.call("POST", "/api/auth/register", { ...base, password: "short", confirmPassword: "short" })).json.error, "password_too_short");
  assert.equal((await t.call("POST", "/api/auth/register", base)).status, 201);
  assert.equal((await t.call("POST", "/api/auth/register", { ...base, username: "ALPHA" })).json.error, "username_taken");
  assert.equal(t.db.prepare("SELECT COUNT(*) c FROM users").get().c, 1);
  const acceptance = t.db.prepare("SELECT terms_version,privacy_version,accepted_at FROM policy_acceptances").get();
  assert.equal(acceptance.terms_version, "2026-11-02");
  assert.equal(acceptance.privacy_version, "2026-11-02");
  assert.ok(acceptance.accepted_at > 0);
  t.close();
});

test("login lockout, refresh rotation and logout", async () => {
  const t = await startServer();
  await registerAccount(t);
  for (let i = 0; i < 5; i++) {
    assert.equal((await login(t, "alpha", "desktop", "Wrong-Pass-999")).json.error, "invalid_credentials");
  }
  assert.equal((await login(t)).json.error, "account_temporarily_locked");
  t.db.exec("DELETE FROM rate_limits");
  const ok = await login(t);
  const r1 = ok.json.refreshToken;
  const rot = await t.call("POST", "/api/auth/refresh", { refreshToken: r1 });
  assert.equal(rot.status, 200);
  assert.notEqual(rot.json.refreshToken, r1);
  const replay = await t.call("POST", "/api/auth/refresh", { refreshToken: r1 });
  assert.equal(replay.status, 401);
  assert.equal((await t.call("POST", "/api/auth/refresh", { refreshToken: rot.json.refreshToken })).status, 401);
  const again = await login(t);
  const auth = { authorization: `Bearer ${again.json.accessToken}` };
  assert.equal((await t.call("POST", "/api/auth/logout", {}, auth)).status, 200);
  assert.equal((await t.call("GET", "/api/auth/me", null, auth)).status, 401);
  t.close();
});

test("web login sets a refresh cookie; suspended accounts cannot log in", async () => {
  const t = await startServer();
  await registerAccount(t);
  const ipToken = await currentIpToken(t);
  const web = await t.call("POST", "/api/auth/login", { username: "alpha", password: PW, client: "web", ipToken });
  assert.equal(web.status, 200);
  assert.match(web.headers.get("set-cookie"), /HttpOnly; SameSite=Strict/);
  assert.equal(web.json.refreshToken, undefined);
  t.db.exec("UPDATE users SET status='suspended'");
  assert.equal((await login(t)).json.error, "account_suspended");
  t.close();
});

test("existing accounts must accept current policies before using authenticated APIs", async () => {
  const t = await startServer();
  await registerAccount(t);
  t.db.exec("UPDATE policy_acceptances SET terms_version='2025-01-01',privacy_version='2025-01-01'");

  const loginResult = await login(t, "alpha", "web");
  assert.equal(loginResult.status, 200);
  assert.equal(loginResult.json.policyAcceptanceRequired, true);
  const auth = { authorization: "Bearer " + loginResult.json.accessToken };
  assert.equal((await t.call("GET", "/api/auth/me", null, auth)).json.error, "policy_acceptance_required");
  assert.equal((await t.call("POST", "/api/auth/policy-acceptance", { termsAccepted: true }, auth)).json.error, "privacy_acknowledgment_required");

  const accepted = await t.call("POST", "/api/auth/policy-acceptance", { termsAccepted: true, privacyAcknowledged: true }, auth);
  assert.equal(accepted.status, 200);
  assert.equal(accepted.json.policyAcceptanceRequired, false);
  assert.equal((await t.call("GET", "/api/auth/me", null, auth)).status, 200);
  assert.equal((await login(t, "alpha", "web")).json.policyAcceptanceRequired, false);
  assert.equal(t.db.prepare("SELECT COUNT(*) c FROM policy_acceptances").get().c, 2);
  t.close();
});

test("email verification and email password recovery endpoints are retired", async () => {
  const t = await startServer();
  assert.equal((await t.call("POST", "/api/auth/email/verify", {})).status, 410);
  assert.equal((await t.call("POST", "/api/auth/email/resend", {})).status, 410);
  assert.equal((await t.call("POST", "/api/auth/password/forgot", {})).status, 410);
  assert.equal((await t.call("POST", "/api/auth/password/reset", {})).status, 410);
  t.close();
});
