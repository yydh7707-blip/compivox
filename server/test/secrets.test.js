import test from "node:test";
import assert from "node:assert/strict";
import { redact, secretValues } from "../src/secrets.js";
import { startServer } from "./helpers.js";

test("ip-verify requires a valid Turnstile token server-side", async () => {
  const t = await startServer();
  const bad = await t.call("POST", "/api/security/ip-verify", { ip: "127.0.0.1", turnstileToken: "" });
  assert.notEqual(bad.status, 200);
  t.close();
});

test("ip-verify fails when Turnstile rejects the token", async () => {
  const t = await startServer();
  t.state.turnstileOk = false;
  const r = await t.call("POST", "/api/security/ip-verify", { ip: "127.0.0.1", turnstileToken: "forged" });
  assert.notEqual(r.status, 200);
  assert.equal(r.json.ipToken, undefined);
  t.close();
});

test("redact masks configured secret values and credential-looking fields", () => {
  const secret = "supersecretvalue123";
  const out = redact(`failed with ${secret} token=abc123 password: hunter2`, [secret]);
  assert.ok(!out.includes(secret));
  assert.ok(!out.includes("abc123"));
  assert.ok(!out.includes("hunter2"));
});

test("secretValues ignores empty and very short values", () => {
  const vals = secretValues({ jwtKey: "", turnstileSecret: "short", smtp: { pass: "" }, ipApiKey: "longenoughtoken" });
  assert.deepEqual(vals, ["longenoughtoken"]);
});
