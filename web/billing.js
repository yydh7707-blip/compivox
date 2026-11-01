// Shared helpers for Polar checkout: obtains a fresh access token from the refresh cookie.
(function () {
  async function freshAccess() {
    var res = await fetch("/api/auth/refresh", { method: "POST", headers: { "content-type": "application/json" }, body: "{}", credentials: "same-origin" });
    if (!res.ok) return null;
    return (await res.json()).accessToken;
  }

  async function startCheckout(button) {
    button.disabled = true;
    try {
      var access = await freshAccess();
      if (!access) { location.href = "/account.html"; return; }
      var res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: "Bearer " + access },
        body: JSON.stringify({ returnPath: location.pathname + location.search })
      });
      var data = await res.json().catch(function () { return {}; });
      if (!res.ok || !data.url) throw new Error(data.error || "checkout_failed");
      location.href = data.url;
    } catch (e) {
      button.disabled = false;
      button.textContent = "Payment unavailable, try again later";
    }
  }

  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest && ev.target.closest("[data-buy-pro]");
    if (btn) startCheckout(btn);
  });

  window.compivoxBilling = { freshAccess: freshAccess };
})();
