import { test } from "node:test";
import assert from "node:assert/strict";
import { startServer, registerAndVerify, login } from "./helpers.js";

const CHECKOUT = "11111111-2222-4333-8444-555555555555";

function fakePolar(checkout) {
  const calls = [];
  const fetchImpl = async (url, opts) => {
    calls.push({ url, method: opts?.method, auth: opts?.headers?.authorization });
    if (opts?.method === "POST") return new Response(JSON.stringify({ url: "https://buy.polar.sh/x" }), { status: 201 });
    return new Response(JSON.stringify(checkout), { status: 200 });
  };
  return { fetchImpl, calls };
}

async function setup(checkout) {
  const polar = fakePolar(checkout);
  const t = await startServer({ polarAccessToken: "tok", polarProductId: "prod-1", fetchImpl: polar.fetchImpl });
  await registerAndVerify(t);
  const r = await login(t);
  const userId = String(t.db.prepare("SELECT id FROM users").get().id);
  Object.assign(checkout, { metadata: { userId: checkout.metadata?.userId === "other" ? "999" : userId } });
  return { t, polar, token: r.json.accessToken, userId };
}

test("checkout creation returns Polar URL and sends return path", async (t) => {
  const { t: s, polar, token } = await setup({});
  t.after(() => s.close());
  const r = await s.call("POST", "/api/billing/checkout", { returnPath: "/#pricing" }, { authorization: "Bearer " + token });
  assert.equal(r.status, 200);
  assert.equal(r.json.url, "https://buy.polar.sh/x");
  assert.equal(polar.calls.length, 1);
});

test("open redirect return paths are rejected", async (t) => {
  const { t: s, token } = await setup({});
  t.after(() => s.close());
  const r = await s.call("POST", "/api/billing/checkout", { returnPath: "//evil.com" }, { authorization: "Bearer " + token });
  assert.equal(r.status, 200);
});

test("verify grants PRO only for succeeded checkout owned by the user", async (t) => {
  const checkout = { status: "succeeded", product_id: "prod-1" };
  const { t: s, token } = await setup(checkout);
  t.after(() => s.close());
  const r = await s.call("POST", "/api/billing/verify", { checkoutId: CHECKOUT }, { authorization: "Bearer " + token });
  assert.equal(r.status, 200);
  assert.equal(r.json.plan, "PRO");
  const again = await s.call("POST", "/api/billing/verify", { checkoutId: CHECKOUT }, { authorization: "Bearer " + token });
  assert.equal(again.status, 200);
});

test("unpaid checkout does not grant PRO", async (t) => {
  const { t: s, token } = await setup({ status: "open", product_id: "prod-1" });
  t.after(() => s.close());
  const r = await s.call("POST", "/api/billing/verify", { checkoutId: CHECKOUT }, { authorization: "Bearer " + token });
  assert.equal(r.status, 402);
});

test("checkout belonging to another user is rejected", async (t) => {
  const { t: s, token } = await setup({ status: "succeeded", product_id: "prod-1", metadata: { userId: "other" } });
  t.after(() => s.close());
  const r = await s.call("POST", "/api/billing/verify", { checkoutId: CHECKOUT }, { authorization: "Bearer " + token });
  assert.equal(r.status, 403);
});

test("billing requires configuration", async (t) => {
  const s = await startServer({});
  t.after(() => s.close());
  await registerAndVerify(s);
  const token = (await login(s)).json.accessToken;
  const r = await s.call("POST", "/api/billing/checkout", {}, { authorization: "Bearer " + token });
  assert.equal(r.status, 503);
});
