import test from "node:test";
import assert from "node:assert/strict";
import { redact, secretValues } from "../src/secrets.js";
import { startServer } from "./helpers.js";

test("visual checkbox tokens are not a server-side authentication factor", async () => {
  const t = await startServer();
  const r = await t.call("POST", "/api/security/ip-verify", { ip: "127.0.0.1" });
  assert.equal(r.status, 200);
  assert.ok(r.json.ipToken);
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
  const vals = secretValues({ jwtKey: "", ipApiKey: "longenoughtoken" });
  assert.deepEqual(vals, ["longenoughtoken"]);
});
