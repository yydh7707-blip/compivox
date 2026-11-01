// Polar checkout creation and server-side payment verification.
import { now } from "./db.js";
import { ApiError } from "./services.js";

const API = { production: "https://api.polar.sh", sandbox: "https://sandbox-api.polar.sh" };

export function createBilling({ db, cfg, fetchImpl = fetch }) {
  const configured = () => !!(cfg.polarAccessToken && cfg.polarProductId);
  const base = () => API[cfg.polarServer] || API.production;

  async function polar(method, path, body) {
    if (!configured()) throw new ApiError(503, "billing_not_configured");
    const res = await fetchImpl(base() + path, {
      method,
      headers: { authorization: "Bearer " + cfg.polarAccessToken, "content-type": "application/json" },
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(502, "polar_error");
    return data;
  }

  // returnPath must be a same-site relative path so the return URL cannot be abused.
  function safeReturnPath(p) {
    return typeof p === "string" && /^\/(?!\/)[\w\-/?=&%.]*$/.test(p) ? p : "/";
  }

  async function createCheckout(user, returnPath) {
    const origin = new URL(cfg.publicUrl).origin;
    const checkout = await polar("POST", "/v1/checkouts/", {
      products: [cfg.polarProductId],
      success_url: origin + "/success?checkout_id={CHECKOUT_ID}",
      return_url: origin + safeReturnPath(returnPath),
      metadata: { userId: String(user.id) }
    });
    return { url: checkout.url };
  }

  // Grants PRO only after Polar confirms the checkout succeeded for this product and user.
  async function verifyCheckout(user, checkoutId) {
    if (typeof checkoutId !== "string" || !/^[0-9a-f-]{36}$/i.test(checkoutId)) throw new ApiError(400, "checkout_invalid");
    const checkout = await polar("GET", "/v1/checkouts/" + checkoutId);
    if (checkout.status !== "succeeded") throw new ApiError(402, "payment_not_completed");
    if (checkout.product_id !== cfg.polarProductId) throw new ApiError(400, "product_mismatch");
    if (!checkout.metadata || String(checkout.metadata.userId) !== String(user.id)) throw new ApiError(403, "checkout_owner_mismatch");

    const existing = db.prepare("SELECT user_id FROM billing_checkouts WHERE checkout_id=?").get(checkoutId);
    if (existing && existing.user_id !== user.id) throw new ApiError(409, "checkout_already_used");
    const t = now();
    if (!existing) db.prepare("INSERT INTO billing_checkouts(checkout_id, user_id, created_at) VALUES(?,?,?)").run(checkoutId, user.id, t);
    db.prepare(`INSERT INTO user_entitlements(user_id, plan, source, expires_at, updated_at) VALUES(?, 'PRO', 'polar', NULL, ?)
      ON CONFLICT(user_id) DO UPDATE SET plan='PRO', source='polar', expires_at=NULL, updated_at=excluded.updated_at`).run(user.id, t);
    return { plan: "PRO" };
  }

  return { configured, createCheckout, verifyCheckout, safeReturnPath };
}
