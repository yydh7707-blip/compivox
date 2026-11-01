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
  const cfg = loadConfig({ jwtKey: "x".repeat(48), publicUrl: "http://localhost", resendCooldownSec: 0, ...over });
  const db = openDb(":memory:");
  const provider = new FakeProvider();
  const mails = [];
  const mailer = { configured: true, fail: false, async send(to, subject, text) { if (this.fail) throw new Error("smtp"); mails.push({ to, subject, text }); } };
  const state = { turnstileOk: true };
  const handler = createApp({
    db, cfg, mailer,
    risk: new IpRiskAssessmentService(db, cfg, provider),
    verifyTurnstile: async () => ({ success: state.turnstileOk }),
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
  const lastCode = () => /(\d{6})/.exec(mails.at(-1).text)[1];
  return { call, db, mails, mailer, provider, state, cfg, lastCode, close: () => { server.closeAllConnections(); server.close(); } };
}

export const PW = "Str0ng-Pass-123";
export async function registerAndVerify(t, email = "a@example.com") {
  const r = await t.call("POST", "/api/auth/register", { email, password: PW, confirmPassword: PW, turnstileToken: "ok" });
  if (r.status !== 200) throw new Error("register failed " + JSON.stringify(r.json));
  const v = await t.call("POST", "/api/auth/email/verify", { email, code: t.lastCode() });
  if (v.status !== 200) throw new Error("verify failed");
}
export async function login(t, email = "a@example.com", client = "desktop") {
  const r = await t.call("POST", "/api/auth/login", { email, password: PW, client, turnstileToken: "ok" });
  return r;
}
