import test from "node:test";
import assert from "node:assert/strict";
import { startServer, registerAccount, login } from "./helpers.js";
import { resolveClientIp, normalizeIp, isCloudflareIp } from "../src/ip.js";

const DEV1 = "device-aaaaaaaaaaaa-1";
const DEV2 = "device-aaaaaaaaaaaa-2";
const DEV3 = "device-aaaaaaaaaaaa-3";
const DEV4 = "device-aaaaaaaaaaaa-4";

async function ipToken(t) {
  const chk = await t.call("GET", "/api/security/ip-check");
  const v = await t.call("POST", "/api/security/ip-verify", { ip: chk.json.ip, turnstileToken: "ok" });
  return v;
}
const auth = (r) => ({ authorization: `Bearer ${r.json.accessToken}` });

test("ip-check reports observed ip; ip-verify rejects mismatch and accepts match", async () => {
  const t = await startServer();
  const chk = await t.call("GET", "/api/security/ip-check");
  assert.equal(chk.json.ip, "127.0.0.1");
  assert.equal(chk.json.ipVersion, 4);
  assert.equal((await t.call("POST", "/api/security/ip-verify", { ip: "203.0.113.25", turnstileToken: "ok" })).json.error, "ip_mismatch");
  const ok = await t.call("POST", "/api/security/ip-verify", { ip: "127.0.0.1", turnstileToken: "ok" });
  assert.equal(ok.status, 200);
  assert.ok(ok.json.ipToken);
  t.close();
});

test("spoofed forwarding headers are ignored in direct mode", async () => {
  const t = await startServer();
  const r = await t.call("GET", "/api/security/ip-check", null, { "x-forwarded-for": "9.9.9.9", "cf-connecting-ip": "8.8.8.8" });
  assert.equal(r.json.ip, "127.0.0.1");
  t.close();
});

test("ip resolution: cloudflare mode needs a Cloudflare edge, render mode uses trusted hop, ipv6 normalization", () => {
  const mk = (peer, h) => ({ socket: { remoteAddress: peer }, headers: h });
  const cf = { ipTrust: "cloudflare", trustedHops: 1 };
  assert.deepEqual(resolveClientIp(mk("10.0.0.1", { "cf-connecting-ip": "1.2.3.4", "x-forwarded-for": "172.64.0.5" }), cf), { ip: "1.2.3.4", trusted: true, source: "cf-connecting-ip" });
  const spoof = resolveClientIp(mk("10.0.0.1", { "cf-connecting-ip": "1.2.3.4", "x-forwarded-for": "6.6.6.6" }), cf);
  assert.equal(spoof.trusted, false);
  assert.notEqual(spoof.ip, "1.2.3.4");
  const direct = resolveClientIp(mk("5.5.5.5", { "cf-connecting-ip": "1.2.3.4" }), cf);
  assert.equal(direct.trusted, false);
  const render = resolveClientIp(mk("10.0.0.1", { "x-forwarded-for": "7.7.7.7, 10.1.1.1" }), { ipTrust: "render", trustedHops: 2 });
  assert.equal(render.ip, "7.7.7.7");
  assert.equal(normalizeIp("::ffff:1.2.3.4"), "1.2.3.4");
  assert.equal(normalizeIp("2001:DB8::1"), "2001:db8:0:0:0:0:0:1");
  assert.equal(normalizeIp("2001:0db8:0:0:0:0:0:1"), "2001:db8:0:0:0:0:0:1");
  assert.equal(isCloudflareIp("104.16.1.1"), true);
  assert.equal(isCloudflareIp("8.8.8.8"), false);
  assert.equal(isCloudflareIp("2606:4700::1"), true);
});

test("account access depends on matching server-observed IP, not network-risk policy", async () => {
  const t = await startServer();
  await registerAccount(t);
  t.db.exec("DELETE FROM ip_risk_assessments");
  t.provider.flags = { vpn: true };
  assert.equal((await login(t)).status, 200);
  t.provider.flags = { mobile: true };
  assert.equal((await login(t)).status, 200);
  t.provider.flags = {};
  t.provider.available = false;
  assert.equal((await login(t)).status, 200);
  t.close();
});

test("admin policy change turns mobile ALLOW", async () => {
  const t = await startServer({ adminUsers: ["alpha"] });
  await registerAccount(t);
  const s = await login(t);
  t.provider.flags = { mobile: true };
  const put = await t.call("PUT", "/api/admin/settings", { policies: { mobile: "ALLOW" } }, auth(s));
  assert.equal(put.status, 200);
  t.db.exec("DELETE FROM ip_risk_assessments");
  assert.equal((await login(t)).status, 200);
  await registerAccount(t, "beta");
  const nb = await login(t, "beta");
  assert.equal((await t.call("GET", "/api/admin/settings", null, auth(nb))).status, 403);
  t.close();
});

test("device registration: ip limit, account limit, duplicates, release", async () => {
  const t = await startServer({ maxDevicesPerIp: 3, maxDevicesPerAccount: 5 });
  await registerAccount(t, "alpha");
  await registerAccount(t, "beta");
  const a = await login(t, "alpha");
  const b = await login(t, "beta");
  const reg = async (s, id) => {
    const tok = await ipToken(t);
    return t.call("POST", "/api/devices/register", { deviceId: id, name: "PC", ipToken: tok.json.ipToken, turnstileToken: "ok" }, auth(s));
  };
  assert.equal((await reg(a, DEV1)).json.status, "registered");
  assert.equal((await reg(a, DEV1)).json.status, "already_registered");
  assert.equal((await reg(a, DEV2)).json.status, "registered");
  assert.equal((await reg(b, DEV3)).json.status, "registered");
  const over = await reg(b, DEV4);
  assert.equal(over.json.error, "ip_device_limit");
  const noTok = await t.call("POST", "/api/devices/register", { deviceId: DEV4, ipToken: "bad", turnstileToken: "ok" }, auth(b));
  assert.equal(noTok.json.error, "ip_verification_required");
  const list = await t.call("GET", "/api/devices", null, auth(a));
  assert.equal(list.json.devices.length, 2);
  // user removal frees the account slot but the ip registration stays counted
  await t.call("DELETE", `/api/devices/${list.json.devices[0].id}`, null, auth(a));
  assert.equal((await reg(b, DEV4)).json.error, "ip_device_limit");
  t.db.prepare("INSERT INTO ip_exceptions(ip,max_devices,created_at) VALUES('127.0.0.1',10,1)").run();
  assert.equal((await reg(b, DEV4)).json.status, "registered");
  t.close();
});

test("account device limit and ip change does not drop existing devices", async () => {
  const t = await startServer({ maxDevicesPerIp: 10, maxDevicesPerAccount: 1 });
  await registerAccount(t);
  const a = await login(t);
  const tok = await ipToken(t);
  const body = (id) => ({ deviceId: id, name: "PC", ipToken: tok.json.ipToken, turnstileToken: "ok" });
  assert.equal((await t.call("POST", "/api/devices/register", body(DEV1), auth(a))).status, 200);
  assert.equal((await t.call("POST", "/api/devices/register", body(DEV2), auth(a))).json.error, "account_device_limit");
  t.db.exec("UPDATE devices SET registered_ip='198.51.100.9'");
  const st = await t.call("POST", "/api/devices/status", { deviceId: DEV1 }, auth(a));
  assert.equal(st.json.registered, true);
  t.close();
});

test("build authorization needs a registered device and enforces FREE monthly limit; PRO is unlimited", async () => {
  const t = await startServer({ freeMonthlyBuilds: 2, adminUsers: ["alpha"] });
  await registerAccount(t);
  const a = await login(t);
  assert.equal((await t.call("POST", "/api/builds/authorize", { deviceId: DEV1 }, auth(a))).json.error, "device_not_registered");
  const tok = await ipToken(t);
  await t.call("POST", "/api/devices/register", { deviceId: DEV1, name: "PC", ipToken: tok.json.ipToken, turnstileToken: "ok" }, auth(a));
  assert.equal((await t.call("POST", "/api/builds/authorize", { deviceId: DEV1, project: "x" }, auth(a))).json.remaining, 1);
  assert.equal((await t.call("POST", "/api/builds/authorize", { deviceId: DEV1 }, auth(a))).json.remaining, 0);
  assert.equal((await t.call("POST", "/api/builds/authorize", { deviceId: DEV1 }, auth(a))).json.error, "build_limit_reached");
  await t.call("PUT", "/api/admin/users/plan", { username: "alpha", plan: "PRO" }, auth(a));
  const ok = await t.call("POST", "/api/builds/authorize", { deviceId: DEV1 }, auth(a));
  assert.equal(ok.json.plan, "PRO");
  assert.equal(ok.json.remaining, null);
  const plan = await t.call("GET", "/api/dashboard/plan", null, auth(a));
  assert.equal(plan.json.billing, "not_connected");
  t.close();
});

test("rejects oversized and malformed bodies, unknown routes", async () => {
  const t = await startServer();
  assert.equal((await t.call("POST", "/api/auth/login", { username: "alpha", password: "x".repeat(20000) })).status, 413);
  assert.equal((await t.call("GET", "/api/nope")).status, 404);
  assert.equal((await t.call("GET", "/api/auth/login")).status, 405);
  t.close();
});
