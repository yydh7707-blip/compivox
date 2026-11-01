(function () {
  "use strict";
  var LSK = "compivox-lang-v2";
  var lang = "en";
  try { lang = localStorage.getItem(LSK) === "ko" ? "ko" : "en"; } catch (_) {}

  var D = {
    en: {
      home: "Home", signin: "Sign in", signinSub: "Use your COMPIVOX account.", email: "Email", password: "Password", confirm: "Confirm password",
      remember: "Keep me signed in on this browser", noacc: "Create an account", forgot: "Forgot password?", haveacc: "I already have an account",
      register: "Create account", registerSub: "One account for the website and the Windows app.", pwHint: "At least 10 characters, with letters and numbers.",
      verify: "Verify your email", verifySent: "We sent a 6-digit code to", verifyBtn: "Verify", resend: "Resend code", changeEmail: "Use a different email",
      codeSent: "A new code was sent.", verified: "Email verified. You can sign in now.",
      forgotT: "Reset password", forgotSub: "We will email you a 6-digit code.", sendCode: "Send code", resetT: "Choose a new password", newPw: "New password", resetBtn: "Reset password",
      resetOk: "Password changed. Please sign in.", back: "Back to sign in",
      ts_checking: "Checking…", ts_verified: "Verified", ts_failed: "Verification failed. Retry.", ts_expired: "Expired. Retry.", ts_na: "Human verification is not configured on this server.",
      ipT: "Confirm your network", ipBody: "Your current IP address is shown below. Type it to confirm and continue.", ipYour: "Your IP", ipType: "Type your IP address", ipBtn: "Confirm network",
      overview: "Overview", account: "My Account", devices: "My Devices", security: "Security", plan: "My Plan", downloads: "Downloads", settings: "Settings", signout: "Sign out",
      emailL: "Email", status: "Status", verifiedL: "Verified", yes: "Yes", no: "No", planL: "Plan", devCount: "Devices", builds: "Builds this month", unlimited: "Unlimited",
      noDevices: "No devices registered yet.", remove: "Remove", linkT: "Register this device", linkBody: "Complete the check below to link the device from the COMPIVOX app.",
      deviceName: "Device name", linkBtn: "Register device", linked: "Device registered. Return to the app.", removed: "Device removed.",
      sessions: "Active sessions", revoke: "Sign out", current: "This session", changePw: "Change password", curPw: "Current password", save: "Save", pwChanged: "Password changed.",
      recentLogins: "Recent sign-ins", success: "Success", failure: "Failed", billingNote: "Billing is not connected yet. PRO is granted manually by an administrator.", free: "FREE", pro: "PRO",
      dlBody: "Download the Windows app from the home page.", dlBtn: "Go to downloads", lang: "Language", langBody: "Use the KO / EN switch at the top of the page.", loading: "Loading…",
      e_default: "Something went wrong. Please try again.", e_invalid_credentials: "Email or password is incorrect.", e_email_not_verified: "Please verify your email first.",
      e_account_temporarily_locked: "Too many attempts. Try again later.", e_rate_limited: "Too many requests. Please wait a moment.", e_code_invalid: "The code is incorrect.",
      e_code_expired: "The code has expired. Request a new one.", e_too_many_attempts: "Too many incorrect codes. Request a new one.", e_invalid_email: "Enter a valid email address.",
      e_password_mismatch: "Passwords do not match.", e_turnstile_required: "Complete the human verification first.", e_turnstile_failed: "Human verification failed. Retry.",
      e_turnstile_not_configured: "Human verification is not configured on this server.", e_network_blocked: "This network is not allowed. Disable VPN/proxy and try again.",
      e_ip_mismatch: "That IP does not match your current IP.", e_account_device_limit: "Device limit reached for your account.", e_ip_device_limit: "Device limit reached for this network.",
      e_resend_cooldown: "Please wait before requesting another code.", e_account_suspended: "This account is suspended.", e_ip_untrusted: "Your IP address could not be determined.",
      e_password_short: "Password is too short.", e_password_weak: "Password is too weak.", e_email_in_use: "Could not create the account.", e_bad_origin: "Request rejected."
    },
    ko: {
      home: "홈", signin: "로그인", signinSub: "COMPIVOX 계정으로 로그인하세요.", email: "이메일", password: "비밀번호", confirm: "비밀번호 확인",
      remember: "이 브라우저에서 로그인 유지", noacc: "계정 만들기", forgot: "비밀번호를 잊으셨나요?", haveacc: "이미 계정이 있어요",
      register: "계정 만들기", registerSub: "웹사이트와 Windows 앱을 하나의 계정으로.", pwHint: "10자 이상, 영문과 숫자를 포함하세요.",
      verify: "이메일 인증", verifySent: "6자리 코드를 보냈습니다:", verifyBtn: "인증하기", resend: "코드 다시 보내기", changeEmail: "다른 이메일 사용",
      codeSent: "새 코드를 보냈습니다.", verified: "이메일이 인증되었습니다. 이제 로그인할 수 있습니다.",
      forgotT: "비밀번호 재설정", forgotSub: "이메일로 6자리 코드를 보내드립니다.", sendCode: "코드 보내기", resetT: "새 비밀번호 설정", newPw: "새 비밀번호", resetBtn: "비밀번호 재설정",
      resetOk: "비밀번호가 변경되었습니다. 로그인해 주세요.", back: "로그인으로 돌아가기",
      ts_checking: "확인 중…", ts_verified: "확인됨", ts_failed: "확인 실패. 다시 시도하세요.", ts_expired: "만료되었습니다. 다시 시도하세요.", ts_na: "이 서버에는 사람 확인이 설정되어 있지 않습니다.",
      ipT: "네트워크 확인", ipBody: "현재 IP 주소가 아래에 표시됩니다. 입력해서 확인하고 계속하세요.", ipYour: "내 IP", ipType: "IP 주소 입력", ipBtn: "네트워크 확인",
      overview: "개요", account: "내 계정", devices: "내 기기", security: "보안", plan: "내 요금제", downloads: "다운로드", settings: "설정", signout: "로그아웃",
      emailL: "이메일", status: "상태", verifiedL: "인증됨", yes: "예", no: "아니오", planL: "요금제", devCount: "기기", builds: "이번 달 빌드", unlimited: "무제한",
      noDevices: "등록된 기기가 없습니다.", remove: "해제", linkT: "이 기기 등록", linkBody: "아래 확인을 완료하면 COMPIVOX 앱의 기기가 연결됩니다.",
      deviceName: "기기 이름", linkBtn: "기기 등록", linked: "기기가 등록되었습니다. 앱으로 돌아가세요.", removed: "기기를 해제했습니다.",
      sessions: "활성 세션", revoke: "로그아웃", current: "현재 세션", changePw: "비밀번호 변경", curPw: "현재 비밀번호", save: "저장", pwChanged: "비밀번호가 변경되었습니다.",
      recentLogins: "최근 로그인", success: "성공", failure: "실패", billingNote: "결제는 아직 연결되어 있지 않습니다. PRO는 관리자가 수동으로 부여합니다.", free: "FREE", pro: "PRO",
      dlBody: "Windows 앱은 홈 화면에서 내려받을 수 있습니다.", dlBtn: "다운로드로 이동", lang: "언어", langBody: "페이지 상단의 KO / EN 전환을 사용하세요.", loading: "불러오는 중…",
      e_default: "문제가 발생했습니다. 다시 시도해 주세요.", e_invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.", e_email_not_verified: "먼저 이메일을 인증해 주세요.",
      e_account_temporarily_locked: "시도 횟수가 너무 많습니다. 잠시 후 다시 시도하세요.", e_rate_limited: "요청이 너무 많습니다. 잠시 기다려 주세요.", e_code_invalid: "코드가 올바르지 않습니다.",
      e_code_expired: "코드가 만료되었습니다. 새 코드를 요청하세요.", e_too_many_attempts: "잘못된 코드 입력이 너무 많습니다. 새 코드를 요청하세요.", e_invalid_email: "올바른 이메일을 입력하세요.",
      e_password_mismatch: "비밀번호가 일치하지 않습니다.", e_turnstile_required: "먼저 사람 확인을 완료하세요.", e_turnstile_failed: "사람 확인에 실패했습니다. 다시 시도하세요.",
      e_turnstile_not_configured: "이 서버에는 사람 확인이 설정되어 있지 않습니다.", e_network_blocked: "허용되지 않는 네트워크입니다. VPN/프록시를 끄고 다시 시도하세요.",
      e_ip_mismatch: "입력한 IP가 현재 IP와 다릅니다.", e_account_device_limit: "계정의 기기 등록 한도에 도달했습니다.", e_ip_device_limit: "이 네트워크의 기기 등록 한도에 도달했습니다.",
      e_resend_cooldown: "다음 코드를 요청하기 전에 잠시 기다려 주세요.", e_account_suspended: "정지된 계정입니다.", e_ip_untrusted: "IP 주소를 확인할 수 없습니다.",
      e_password_short: "비밀번호가 너무 짧습니다.", e_password_weak: "비밀번호가 너무 약합니다.", e_email_in_use: "계정을 만들 수 없습니다.", e_bad_origin: "요청이 거부되었습니다."
    }
  };
  function t(k) { return D[lang][k] || D.en[k] || k; }
  function errMsg(code) { return t("e_" + code) !== "e_" + code ? t("e_" + code) : t("e_default"); }

  var app = document.getElementById("app");
  var cfg = { turnstileSiteKey: null };
  var access = null;
  var me = null;
  var state = { view: "login", email: "", ipToken: null, tab: "overview", pending: null };
  var qs = new URLSearchParams(location.search);

  function el(tag, attrs) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k.indexOf("on") === 0) n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k]);
    });
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return n;
  }

  function toast(msg) {
    var n = el("div", { class: "toast", role: "status" }, msg);
    document.body.appendChild(n);
    setTimeout(function () { n.remove(); }, 3200);
  }

  async function api(method, path, body, opts) {
    var headers = { "content-type": "application/json" };
    if (access) headers.authorization = "Bearer " + access;
    var res = await fetch("/api" + path, { method: method, headers: headers, body: body ? JSON.stringify(body) : undefined, credentials: "same-origin" });
    var data = {};
    try { data = await res.json(); } catch (_) {}
    if (res.status === 401 && !(opts && opts.noRefresh) && access) {
      if (await refresh()) return api(method, path, body, { noRefresh: true });
    }
    if (!res.ok) { var e = new Error(data.error || "error"); e.code = data.error || "error"; e.status = res.status; throw e; }
    return data;
  }

  async function refresh() {
    try {
      var res = await fetch("/api/auth/refresh", { method: "POST", headers: { "content-type": "application/json" }, body: "{}", credentials: "same-origin" });
      if (!res.ok) { access = null; return false; }
      var d = await res.json();
      access = d.accessToken; me = d;
      return true;
    } catch (_) { return false; }
  }

  /* Turnstile */
  var tsLoading = null;
  function loadTurnstile() {
    if (window.turnstile) return Promise.resolve();
    if (tsLoading) return tsLoading;
    tsLoading = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
    return tsLoading;
  }
  function turnstileBox() {
    var box = el("div", { class: "ts-box" });
    var stateEl = el("div", { class: "ts-state" }, "");
    var h = { token: null, node: el("div", null, box, stateEl), reset: function () { h.token = null; if (h.id != null && window.turnstile) try { window.turnstile.reset(h.id); } catch (_) {} } };
    function set(cls, key) { stateEl.className = "ts-state " + cls; stateEl.textContent = t(key); }
    if (!cfg.turnstileSiteKey) { set("failed", "ts_na"); return h; }
    set("", "ts_checking");
    loadTurnstile().then(function () {
      h.id = window.turnstile.render(box, {
        sitekey: cfg.turnstileSiteKey,
        callback: function (tok) { h.token = tok; set("verified", "ts_verified"); },
        "error-callback": function () { h.token = null; set("failed", "ts_failed"); },
        "expired-callback": function () { h.token = null; set("failed", "ts_expired"); }
      });
    }).catch(function () { set("failed", "ts_failed"); });
    return h;
  }

  /* Views */
  function field(label, type, name, extra) {
    var input = el("input", Object.assign({ type: type, name: name, required: "required", autocomplete: type === "password" ? "current-password" : "email" }, extra || {}));
    return { node: el("label", { class: "field" }, el("span", null, label), input), input: input };
  }

  function panel(title, sub) {
    var alertEl = el("div", { class: "alert", role: "alert" });
    var p = el("div", { class: "panel" }, el("h1", null, title), sub ? el("p", { class: "sub" }, sub) : null, alertEl);
    p.alert = alertEl;
    p.say = function (msg, kind) { alertEl.className = "alert " + (kind || "err"); alertEl.textContent = msg || ""; };
    return p;
  }

  function mount(node) { app.replaceChildren(el("div", { class: "auth-wrap" }, node)); }

  function link(text, fn) { return el("button", { type: "button", class: "btn ghost small", onclick: fn }, text); }

  async function guarded(p, btn, fn) {
    btn.disabled = true;
    try { await fn(); }
    catch (e) {
      if (e.code === "ip_verification_required") { showIp(p, fn); }
      else p.say(errMsg(e.code));
    }
    btn.disabled = false;
  }

  function showIp(p, retry) {
    var wrap = el("div", { class: "ip-box" });
    var ipVal = el("b", null, "…");
    var inp = el("input", { type: "text", placeholder: t("ipType"), autocomplete: "off" });
    var ts = turnstileBox();
    var btn = el("button", { type: "button", class: "btn primary block" }, t("ipBtn"));
    wrap.append(el("h3", null, t("ipT")), el("p", null, t("ipBody")), el("p", null, t("ipYour") + ": ", ipVal), el("label", { class: "field" }, el("span", null, t("ipType")), inp), ts.node, btn);
    p.insertBefore(wrap, p.alert.nextSibling);
    api("GET", "/security/ip-check").then(function (d) { ipVal.textContent = d.ip; inp.value = d.ip; }).catch(function (e) { p.say(errMsg(e.code)); });
    btn.addEventListener("click", async function () {
      btn.disabled = true;
      try {
        var r = await api("POST", "/security/ip-verify", { ip: inp.value.trim(), turnstileToken: ts.token });
        state.ipToken = r.ipToken; wrap.remove(); p.say("");
        await retry();
      } catch (e) { p.say(errMsg(e.code)); ts.reset(); }
      btn.disabled = false;
    });
  }

  function viewLogin(notice) {
    var p = panel(t("signin"), t("signinSub"));
    var em = field(t("email"), "email", "email", { value: state.email });
    var pw = field(t("password"), "password", "password");
    var ts = turnstileBox();
    var btn = el("button", { type: "submit", class: "btn primary block" }, t("signin"));
    var form = el("form", { novalidate: "novalidate" }, em.node, pw.node, ts.node, btn);
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      state.email = em.input.value.trim();
      guarded(p, btn, async function () {
        var d = await api("POST", "/auth/login", { email: state.email, password: pw.input.value, client: "web", turnstileToken: ts.token, ipToken: state.ipToken }, { noRefresh: true });
        access = d.accessToken; me = d; state.ipToken = null;
        enterDash();
      }).then(function () { ts.reset(); }).catch(function () {});
    });
    var errHook = p.say;
    p.say = function (m, k) { errHook(m, k); };
    p.append(form, el("div", { class: "row-links" }, link(t("noacc"), function () { state.view = "register"; render(); }), link(t("forgot"), function () { state.view = "forgot"; render(); })));
    mount(p);
    if (notice) p.say(notice, "ok");
    // an unverified account goes to the verification step
    var orig = p.say;
    p.say = function (m, k) { orig(m, k); if (m === t("e_email_not_verified")) { state.view = "verify"; setTimeout(render, 600); } };
  }

  function viewRegister() {
    var p = panel(t("register"), t("registerSub"));
    var em = field(t("email"), "email", "email", { value: state.email });
    var pw = field(t("password"), "password", "password", { autocomplete: "new-password" });
    var pw2 = field(t("confirm"), "password", "confirm", { autocomplete: "new-password" });
    var ts = turnstileBox();
    var btn = el("button", { type: "submit", class: "btn primary block" }, t("register"));
    var form = el("form", { novalidate: "novalidate" }, em.node, pw.node, pw2.node, el("p", { class: "sub" }, t("pwHint")), ts.node, btn);
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      state.email = em.input.value.trim();
      guarded(p, btn, async function () {
        await api("POST", "/auth/register", { email: state.email, password: pw.input.value, confirmPassword: pw2.input.value, turnstileToken: ts.token, ipToken: state.ipToken });
        state.ipToken = null; state.view = "verify"; render();
      }).then(function () { ts.reset(); });
    });
    p.append(form, el("div", { class: "row-links" }, link(t("haveacc"), function () { state.view = "login"; render(); })));
    mount(p);
  }

  function otpBoxes(onDone) {
    var wrap = el("div", { class: "otp" });
    var inputs = [];
    for (var i = 0; i < 6; i++) {
      (function (i) {
        var inp = el("input", { type: "text", inputmode: "numeric", maxlength: "1", autocomplete: i === 0 ? "one-time-code" : "off", "aria-label": "digit " + (i + 1) });
        inp.addEventListener("input", function () {
          inp.value = inp.value.replace(/\D/g, "").slice(0, 1);
          if (inp.value && i < 5) inputs[i + 1].focus();
          if (value().length === 6) onDone();
        });
        inp.addEventListener("keydown", function (e) {
          if (e.key === "Backspace" && !inp.value && i > 0) { inputs[i - 1].focus(); inputs[i - 1].value = ""; }
        });
        inp.addEventListener("paste", function (e) {
          var txt = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, 6);
          if (!txt) return;
          e.preventDefault();
          txt.split("").forEach(function (ch, j) { inputs[j].value = ch; });
          inputs[Math.min(txt.length, 5)].focus();
          if (txt.length === 6) onDone();
        });
        inputs.push(inp); wrap.appendChild(inp);
      })(i);
    }
    function value() { return inputs.map(function (x) { return x.value; }).join(""); }
    wrap.value = value; wrap.focus = function () { inputs[0].focus(); };
    wrap.clear = function () { inputs.forEach(function (x) { x.value = ""; }); inputs[0].focus(); };
    return wrap;
  }

  function maskEmail(e) {
    var parts = e.split("@");
    if (parts.length !== 2) return e;
    return parts[0].slice(0, 2) + "***@" + parts[1];
  }

  function viewVerify() {
    var p = panel(t("verify"), t("verifySent") + " " + maskEmail(state.email));
    var busy = false;
    async function submit() {
      if (busy || otp.value().length !== 6) return;
      busy = true;
      try {
        await api("POST", "/auth/email/verify", { email: state.email, code: otp.value() });
        state.view = "login"; state.notice = t("verified"); render();
      } catch (e) { p.say(errMsg(e.code)); otp.clear(); }
      busy = false;
    }
    var otp = otpBoxes(submit);
    var btn = el("button", { type: "button", class: "btn primary block", onclick: submit }, t("verifyBtn"));
    var resendBtn = link(t("resend"), async function () {
      resendBtn.disabled = true;
      try { await api("POST", "/auth/email/resend", { email: state.email }); p.say(t("codeSent"), "ok"); }
      catch (e) { p.say(errMsg(e.code)); }
      setTimeout(function () { resendBtn.disabled = false; }, 30000);
    });
    p.append(otp, btn, el("div", { class: "row-links" }, resendBtn, link(t("changeEmail"), function () { state.view = "register"; render(); })));
    mount(p);
    otp.focus();
  }

  function viewForgot() {
    var p = panel(t("forgotT"), t("forgotSub"));
    var em = field(t("email"), "email", "email", { value: state.email });
    var ts = turnstileBox();
    var btn = el("button", { type: "submit", class: "btn primary block" }, t("sendCode"));
    var form = el("form", { novalidate: "novalidate" }, em.node, ts.node, btn);
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      state.email = em.input.value.trim();
      guarded(p, btn, async function () {
        await api("POST", "/auth/password/forgot", { email: state.email, turnstileToken: ts.token });
        state.view = "reset"; render();
      }).then(function () { ts.reset(); });
    });
    p.append(form, el("div", { class: "row-links" }, link(t("back"), function () { state.view = "login"; render(); })));
    mount(p);
  }

  function viewReset() {
    var p = panel(t("resetT"), t("verifySent") + " " + maskEmail(state.email));
    var otp = otpBoxes(function () {});
    var pw = field(t("newPw"), "password", "new", { autocomplete: "new-password" });
    var btn = el("button", { type: "submit", class: "btn primary block" }, t("resetBtn"));
    var form = el("form", { novalidate: "novalidate" }, otp, pw.node, el("p", { class: "sub" }, t("pwHint")), btn);
    form.addEventListener("submit", async function (ev) {
      ev.preventDefault();
      btn.disabled = true;
      try {
        await api("POST", "/auth/password/reset", { email: state.email, code: otp.value(), newPassword: pw.input.value });
        state.view = "login"; state.notice = t("resetOk"); render();
      } catch (e) { p.say(errMsg(e.code)); }
      btn.disabled = false;
    });
    p.append(form, el("div", { class: "row-links" }, link(t("back"), function () { state.view = "login"; render(); })));
    mount(p);
    otp.focus();
  }

  /* Dashboard */
  var TABS = ["overview", "account", "devices", "security", "plan", "downloads", "settings"];

  function enterDash() { state.view = "dash"; state.tab = qs.get("device") ? "devices" : state.tab; render(); }

  function viewDash() {
    var content = el("section", { class: "dash-main" });
    var side = el("nav", { class: "side", "aria-label": "Account" });
    TABS.forEach(function (k) {
      side.appendChild(el("button", { type: "button", "aria-current": state.tab === k ? "page" : false, onclick: function () { state.tab = k; render(); } }, t(k)));
    });
    side.appendChild(el("div", { class: "spacer" }));
    side.appendChild(el("button", { type: "button", onclick: signOut }, t("signout")));
    app.replaceChildren(el("div", { class: "dash" }, side, el("div", { class: "dash-body", style: "padding:28px 24px" }, content)));
    content.appendChild(el("p", null, t("loading")));
    var fn = TAB_FN[state.tab];
    fn(content).catch(function (e) {
      if (e.status === 401) { access = null; state.view = "login"; render(); return; }
      content.replaceChildren(el("div", { class: "alert err" }, errMsg(e.code)));
    });
  }

  async function signOut() {
    try { await api("POST", "/auth/logout", {}, { noRefresh: true }); } catch (_) {}
    access = null; me = null; state.view = "login"; render();
  }

  function stat(label, value) { return el("div", { class: "stat" }, el("small", null, label), el("b", null, value)); }
  function planName(p) { return p.plan === "PRO" ? t("pro") : t("free"); }
  function buildsText(p) { return p.limits && p.limits.monthlyBuilds === null ? t("unlimited") : String(p.buildsUsedThisMonth) + " / " + String(p.limits ? p.limits.monthlyBuilds : "?"); }
  function fmt(ts) { return ts ? new Date(ts * (ts < 1e12 ? 1000 : 1)).toLocaleString(lang === "ko" ? "ko-KR" : "en-US") : "—"; }

  var TAB_FN = {
    overview: async function (c) {
      var d = await api("GET", "/dashboard/overview");
      c.replaceChildren(el("h1", null, t("overview")), el("div", { class: "stat-grid" },
        stat(t("emailL"), d.user.email), stat(t("verifiedL"), d.security.emailVerified ? t("yes") : t("no")),
        stat(t("planL"), planName(d.plan)), stat(t("devCount"), d.devices.count + " / " + d.devices.limit), stat(t("builds"), buildsText(d.plan))));
    },
    account: async function (c) {
      var d = await api("GET", "/auth/me");
      c.replaceChildren(el("h1", null, t("account")), el("div", { class: "stat-grid" }, stat(t("emailL"), d.user.email), stat(t("verifiedL"), d.user.emailVerified ? t("yes") : t("no")), stat(t("planL"), planName(d.plan))));
    },
    devices: async function (c) {
      var d = await api("GET", "/devices");
      var rows = el("div", { class: "rows" });
      d.devices.forEach(function (x) {
        rows.appendChild(el("div", { class: "row" }, el("div", { class: "grow" }, el("b", null, x.name), el("small", null, fmt(x.last_seen_at))),
          el("button", { class: "btn danger small", type: "button", onclick: async function () {
            try { await api("DELETE", "/devices/" + x.id); toast(t("removed")); render(); } catch (e) { toast(errMsg(e.code)); }
          } }, t("remove"))));
      });
      c.replaceChildren(el("h1", null, t("devices") + " (" + d.devices.length + "/" + d.limit + ")"), d.devices.length ? rows : el("p", null, t("noDevices")));
      var devId = qs.get("device");
      if (devId) c.appendChild(linkPanel(devId, qs.get("name") || "My PC"));
    },
    security: async function (c) {
      var s = await api("GET", "/auth/sessions");
      var l = await api("GET", "/dashboard/security");
      var rows = el("div", { class: "rows" });
      s.sessions.forEach(function (x) {
        rows.appendChild(el("div", { class: "row" }, el("div", { class: "grow" }, el("b", null, x.client + (x.current ? " · " + t("current") : "")), el("small", null, fmt(x.last_used_at) + " · " + (x.ip || ""))),
          x.current ? null : el("button", { class: "btn ghost small", type: "button", onclick: async function () { await api("DELETE", "/auth/sessions/" + x.id); render(); } }, t("revoke"))));
      });
      var hist = el("div", { class: "rows" });
      l.recentLogins.slice(0, 8).forEach(function (x) { hist.appendChild(el("div", { class: "row" }, el("div", { class: "grow" }, el("b", null, x.success ? t("success") : t("failure")), el("small", null, fmt(x.created_at) + " · " + (x.ip || ""))))); });
      var cur = field(t("curPw"), "password", "cur", { autocomplete: "current-password" });
      var nw = field(t("newPw"), "password", "new", { autocomplete: "new-password" });
      var msg = el("div", { class: "alert", role: "alert" });
      var btn = el("button", { type: "submit", class: "btn primary" }, t("save"));
      var form = el("form", { class: "panel", style: "max-width:420px", novalidate: "novalidate" }, el("h2", null, t("changePw")), msg, cur.node, nw.node, btn);
      form.addEventListener("submit", async function (ev) {
        ev.preventDefault(); btn.disabled = true;
        try { await api("POST", "/auth/password/change", { currentPassword: cur.input.value, newPassword: nw.input.value }); msg.className = "alert ok"; msg.textContent = t("pwChanged"); cur.input.value = ""; nw.input.value = ""; }
        catch (e) { msg.className = "alert err"; msg.textContent = errMsg(e.code); }
        btn.disabled = false;
      });
      c.replaceChildren(el("h1", null, t("security")), el("h2", null, t("sessions")), rows, el("h2", { style: "margin-top:24px" }, t("recentLogins")), hist, el("div", { style: "margin-top:24px" }, form));
    },
    plan: async function (c) {
      var d = await api("GET", "/dashboard/plan");
      c.replaceChildren(el("h1", null, t("plan")), el("div", { class: "stat-grid" }, stat(t("planL"), planName(d.plan || d)), stat(t("builds"), buildsText(d.plan || d))), el("p", { class: "alert info" }, t("billingNote")));
    },
    downloads: async function (c) {
      c.replaceChildren(el("h1", null, t("downloads")), el("p", null, t("dlBody")), el("a", { class: "btn primary", href: "/#download" }, t("dlBtn")));
    },
    settings: async function (c) {
      c.replaceChildren(el("h1", null, t("settings")), el("h2", null, t("lang")), el("p", null, t("langBody")));
    }
  };

  function linkPanel(deviceId, name) {
    var p = panel(t("linkT"), t("linkBody"));
    p.style.marginTop = "24px";
    var nm = field(t("deviceName"), "text", "name", { value: name, maxlength: "60", autocomplete: "off" });
    var ts = turnstileBox();
    var btn = el("button", { type: "button", class: "btn primary block" }, t("linkBtn"));
    btn.addEventListener("click", function () {
      guarded(p, btn, async function () {
        await api("POST", "/devices/register", { deviceId: deviceId, name: nm.input.value, turnstileToken: ts.token, ipToken: state.ipToken });
        state.ipToken = null; p.say(t("linked"), "ok");
      }).then(function () { ts.reset(); });
    });
    p.append(nm.node, ts.node, btn);
    return p;
  }

  function render() {
    document.documentElement.lang = lang;
    document.title = "COMPIVOX — " + t("signin");
    document.querySelectorAll("[data-i18n]").forEach(function (n) { n.textContent = t(n.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-lang-btn]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-lang-btn") === lang ? "true" : "false"); });
    var v = state.view;
    if (v === "dash") return viewDash();
    var notice = state.notice; state.notice = null;
    if (v === "register") return viewRegister();
    if (v === "verify") return viewVerify();
    if (v === "forgot") return viewForgot();
    if (v === "reset") return viewReset();
    return viewLogin(notice);
  }

  document.querySelectorAll("[data-lang-btn]").forEach(function (b) {
    b.addEventListener("click", function () {
      lang = b.getAttribute("data-lang-btn");
      try { localStorage.setItem(LSK, lang); } catch (_) {}
      render();
    });
  });

  (async function init() {
    try { cfg = await (await fetch("/api/config")).json(); } catch (_) {}
    if (await refresh()) state.view = "dash";
    if (state.view === "dash" && qs.get("device")) state.tab = "devices";
    render();
  })();
})();
