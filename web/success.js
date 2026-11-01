// Reads checkout_id from /success?checkout_id=... and asks the server to verify it with Polar.
(function () {
  var status = document.getElementById("status");
  var detail = document.getElementById("detail");
  var checkoutId = new URLSearchParams(location.search).get("checkout_id");

  function fail(msg) {
    status.textContent = "Could not activate PRO";
    detail.textContent = msg;
  }

  async function run() {
    if (!checkoutId || !/^[0-9a-f-]{36}$/i.test(checkoutId)) return fail("The payment reference is missing or invalid.");
    var access = await window.compivoxBilling.freshAccess();
    if (!access) { location.href = "/account.html"; return; }
    var res = await fetch("/api/billing/verify", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + access },
      body: JSON.stringify({ checkoutId: checkoutId })
    });
    var data = await res.json().catch(function () { return {}; });
    if (res.ok && data.plan === "PRO") {
      status.textContent = "PRO is active";
      detail.textContent = "Thank you. Your PRO license is now linked to this account.";
    } else {
      var reasons = {
        payment_not_completed: "The payment has not completed yet. If you paid, refresh in a moment.",
        checkout_owner_mismatch: "This payment belongs to a different account.",
        checkout_already_used: "This payment has already been applied to another account.",
        billing_not_configured: "Billing is not configured yet."
      };
      fail(reasons[data.error] || "Verification failed. Please contact support.");
    }
  }

  run().catch(function () { fail("Network error. Please refresh the page."); });
})();
