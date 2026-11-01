import http from "node:http";
import { loadConfig } from "../src/config.js";
import { openDb } from "../src/db.js";
import { IIpRiskProvider, IpRiskAssessmentService } from "../src/risk.js";
import { createApp } from "../src/app.js";

class FakeProvider extends IIpRiskProvider {
  constructor() { super(); this.flags = {}; this.available = true; }
  get name() { return "fake"; }
  async assess() {
    if (!this.available) return { available: false, provider: "fake", error: "down" };
    return { available: true, provider: "fake", flags: { mobile: false, vpn: false, proxy: false, tor: false, datacenter: false, abuser: false, ...this.flags }, asn: "AS1", org: "Test" };
  }
}

export async function startServer(over = {}) {
  const cfg = loadConfig({ jwtKey: "x".repeat(48), publicUrl: "http://localhost", ...over });
  const db = openDb(":memory:");
  const provider = new FakeProvider();
  const handler = createApp({
    db, cfg,
    risk: new IpRiskAssessmentService(db, cfg, provider),
    fetchImpl: over.fetchImpl,
    webRoot: "."
  });
  const server = http.createServer(handler);
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  async function call(method, path, body, headers = {}) {
    const res = await fetch(base + path, { method, headers: { "content-type": "application/json", ...headers }, body: body ? JSON.stringify(body) : undefined });
    const text = await res.text();
    let json = null; try { json = JSON.parse(text); } catch {}
    return { status: res.status, json, headers: res.headers };
  }
  return { call, db, provider, cfg, close: () => { server.closeAllConnections(); server.close(); } };
}

export const PW = "Str0ng-Pass-123";
export async function currentIpToken(t) {
  const check = await t.call("GET", "/api/security/ip-check");
  if (check.status !== 200) throw new Error("ip check failed " + JSON.stringify(check.json));
  const verified = await t.call("POST", "/api/security/ip-verify", { ip: check.json.ip, turnstileToken: "visual" });
  if (verified.status !== 200) throw new Error("ip verify failed " + JSON.stringify(verified.json));
  return verified.json.ipToken;
}
export async function registerAccount(t, username = "alpha") {
  const ipToken = await currentIpToken(t);
  const r = await t.call("POST", "/api/auth/register", { username, password: PW, confirmPassword: PW, turnstileToken: "visual", ipToken });
  if (r.status !== 201) throw new Error("register failed " + JSON.stringify(r.json));
  return r;
}
export async function login(t, username = "alpha", client = "desktop", password = PW) {
  const ipToken = await currentIpToken(t);
  const r = await t.call("POST", "/api/auth/login", { username, password, client, turnstileToken: "visual", ipToken });
  return r;
}
