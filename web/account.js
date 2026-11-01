(function () {
  "use strict";
  var LSK = "compivox-lang-v2";
  var lang = "en";
  try { lang = localStorage.getItem(LSK) === "ko" ? "ko" : "en"; } catch (_) {}

  var D = {
    en: {
      home: "Home", signin: "Sign in", signinSub: "Use your COMPIVOX ID.", username: "COMPIVOX ID", password: "Password", confirm: "Confirm password",
      remember: "Keep me signed in on this browser", noacc: "Create an account", haveacc: "I already have an account",
      register: "Create account", registerSub: "Create an ID for the website and Windows app.", pwHint: "ID: 3–32 letters, numbers, dots, underscores or hyphens. Password: at least 10 characters.",
      newPw: "New password", ts_verified: "Verified", ts_prompt: "Verify you are human", ts_required: "Complete the verification first.",
      ipT: "Confirm your network", ipBody: "Your current IP address is shown below. Type it to confirm and continue.", ipYour: "Your IP", ipType: "Type your IP address", ipBtn: "Confirm network",
      overview: "Overview", account: "My Account", devices: "My Devices", security: "Security", plan: "My Plan", downloads: "Downloads", settings: "Settings", signout: "Sign out",
      emailL: "COMPIVOX ID", planL: "Plan", devCount: "Devices", builds: "Builds this month", unlimited: "Unlimited",
      noDevices: "No devices registered yet.", remove: "Remove", linkT: "Register this device", linkBody: "Complete the check below to link the device from the COMPIVOX app.",
      deviceName: "Device name", linkBtn: "Register device", linked: "Device registered. Return to the app.", removed: "Device removed.",
      sessions: "Active sessions", revoke: "Sign out", current: "This session", changePw: "Change password", curPw: "Current password", save: "Save", pwChanged: "Password changed.",
      recentLogins: "Recent sign-ins", success: "Success", failure: "Failed", billingNote: "Billing is not connected yet. PRO is granted manually by an administrator.", free: "FREE", pro: "PRO",
      dlBody: "Download the Windows app from the home page.", dlBtn: "Go to downloads", lang: "Language", langBody: "Use the KO / EN switch at the top of the page.", loading: "Loading…",
      e_default: "Something went wrong. Please try again.", e_invalid_credentials: "ID or password is incorrect.",
      e_account_temporarily_locked: "Too many attempts. Try again later.", e_rate_limited: "Too many requests. Please wait a moment.",
      e_invalid_username: "Use 3–32 letters, numbers, dots, underscores or hyphens for your ID.", e_username_taken: "That ID is already in use.",
      e_password_mismatch: "Passwords do not match.", e_turnstile_required: "Complete the verification first.",
      e_network_blocked: "This network is not allowed. Disable VPN/proxy and try again.",
      e_ip_mismatch: "That IP does not match your current IP.", e_account_device_limit: "Device limit reached for your account.", e_ip_device_limit: "Device limit reached for this network.",
      e_account_suspended: "This account is suspended.", e_ip_untrusted: "Your IP address could not be determined.",
      e_password_too_short: "Password must be at least 10 characters.", e_password_too_long: "Password is too long.",
      e_password_too_common: "Choose a less common password.", e_password_too_simple: "Use a mix of letters, numbers and symbols.",
      e_password_contains_username: "Your password cannot contain your ID.", e_bad_origin: "Request rejected."
    },
    ko: {
      home: "홈", signin: "로그인", signinSub: "COMPIVOX 아이디로 로그인하세요.", username: "COMPIVOX 아이디", password: "비밀번호", confirm: "비밀번호 확인",
      remember: "이 브라우저에서 로그인 유지", noacc: "계정 만들기", haveacc: "이미 계정이 있어요",
      register: "계정 만들기", registerSub: "웹사이트와 Windows 앱에서 사용할 아이디를 만드세요.", pwHint: "아이디: 영문, 숫자, 점, 밑줄, 하이픈 3~32자. 비밀번호: 10자 이상.",
      newPw: "새 비밀번호", ts_verified: "확인됨", ts_prompt: "사람인지 확인하세요", ts_required: "먼저 인증을 완료하세요.",
      ipT: "네트워크 확인", ipBody: "현재 IP 주소가 아래에 표시됩니다. 입력해서 확인하고 계속하세요.", ipYour: "내 IP", ipType: "IP 주소 입력", ipBtn: "네트워크 확인",
      overview: "개요", account: "내 계정", devices: "내 기기", security: "보안", plan: "내 요금제", downloads: "다운로드", settings: "설정", signout: "로그아웃",
      emailL: "COMPIVOX 아이디", planL: "요금제", devCount: "기기", builds: "이번 달 빌드", unlimited: "무제한",
      noDevices: "등록된 기기가 없습니다.", remove: "해제", linkT: "이 기기 등록", linkBody: "아래 확인을 완료하면 COMPIVOX 앱의 기기가 연결됩니다.",
      deviceName: "기기 이름", linkBtn: "기기 등록", linked: "기기가 등록되었습니다. 앱으로 돌아가세요.", removed: "기기를 해제했습니다.",
      sessions: "활성 세션", revoke: "로그아웃", current: "현재 세션", changePw: "비밀번호 변경", curPw: "현재 비밀번호", save: "저장", pwChanged: "비밀번호가 변경되었습니다.",
      recentLogins: "최근 로그인", success: "성공", failure: "실패", billingNote: "결제는 아직 연결되어 있지 않습니다. PRO는 관리자가 수동으로 부여합니다.", free: "FREE", pro: "PRO",
      dlBody: "Windows 앱은 홈 화면에서 내려받을 수 있습니다.", dlBtn: "다운로드로 이동", lang: "언어", langBody: "페이지 상단의 KO / EN 전환을 사용하세요.", loading: "불러오는 중…",
      e_default: "문제가 발생했습니다. 다시 시도해 주세요.", e_invalid_credentials: "아이디 또는 비밀번호가 올바르지 않습니다.",
      e_account_temporarily_locked: "시도 횟수가 너무 많습니다. 잠시 후 다시 시도하세요.", e_rate_limited: "요청이 너무 많습니다. 잠시 기다려 주세요.",
      e_invalid_username: "아이디는 영문, 숫자, 점, 밑줄, 하이픈으로 3~32자 입력하세요.", e_username_taken: "이미 사용 중인 아이디입니다.",
      e_password_mismatch: "비밀번호가 일치하지 않습니다.", e_turnstile_required: "인증을 완료하세요.",
      e_network_blocked: "허용되지 않는 네트워크입니다. VPN/프록시를 끄고 다시 시도하세요.",
      e_ip_mismatch: "입력한 IP가 현재 IP와 다릅니다.", e_account_device_limit: "계정의 기기 등록 한도에 도달했습니다.", e_ip_device_limit: "이 네트워크의 기기 등록 한도에 도달했습니다.",
      e_account_suspended: "정지된 계정입니다.", e_ip_untrusted: "IP 주소를 확인할 수 없습니다.",
      e_password_too_short: "비밀번호는 10자 이상이어야 합니다.", e_password_too_long: "비밀번호가 너무 깁니다.",
      e_password_too_common: "더 안전한 비밀번호를 선택하세요.", e_password_too_simple: "영문, 숫자, 기호를 섞어 입력하세요.",
      e_password_contains_username: "비밀번호에 아이디를 포함할 수 없습니다.", e_bad_origin: "요청이 거부되었습니다."
    }
  };
  function t(k) { return D[lang][k] || D.en[k] || k; }
  function errMsg(code) { return t("e_" + code) !== "e_" + code ? t("e_" + code) : t("e_default"); }

  var app = document.getElementById("app");
  var access = null;
  var me = null;
  var state = { view: "login", username: "", ipToken: null, tab: "overview" };
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

  /* Visual Cloudflare-style check; account access is protected by the server-verified IP step. */
  function turnstileBox() {
    var box = el("div", { class: "ts-box" });
    var stateEl = el("div", { class: "ts-state", "aria-live": "polite" }, "");
    var visualCheck = null;
    var h = { token: null, node: el("div", { class: "ts-wrap" }, box, stateEl), reset: function () {
      h.token = null;
      if (visualCheck) { visualCheck.setAttribute("aria-pressed", "false"); visualCheck.querySelector(".ts-checkbox").textContent = ""; }
      set("", null);
    } };
    function set(cls, key) { stateEl.className = "ts-state " + cls; stateEl.textContent = key ? t(key) : ""; }
    visualCheck = el("button", { type: "button", class: "ts-visual-check", "aria-pressed": "false", onclick: function () {
      h.token = h.token ? null : "visual";
      visualCheck.setAttribute("aria-pressed", h.token ? "true" : "false");
      visualCheck.querySelector(".ts-checkbox").textContent = h.token ? "✓" : "";
      set(h.token ? "verified" : "", h.token ? "ts_verified" : null);
    } },
    el("span", { class: "ts-checkbox", "aria-hidden": "true" }),
    el("span", { class: "ts-prompt" }, t("ts_prompt")),
    el("span", { class: "ts-brand" },
      el("svg", { viewBox: "0 0 64 40", "aria-hidden": "true" },
        el("path", { d: "M32 2 4 14l7 10 5 1-4 8h19l4-7 6 1-2-9 10-5z", fill: "#f38020" }),
        el("path", { d: "m36 17 20-7-3 9-15 5z", fill: "#faad3f" })),
      el("span", null, "Cloudflare"),
      el("small", null, "Privacy · Terms")));
    box.appendChild(visualCheck);
    set("", null);
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
    var inp = el("input", { type: "text", placeholder: t("ipType"), autocomplete: "off", inputmode: "text" });
    var ts = turnstileBox();
    var btn = el("button", { type: "button", class: "btn primary block" }, t("ipBtn"));
    wrap.append(el("h3", null, t("ipT")), el("p", null, t("ipBody")), el("p", null, t("ipYour") + ": ", ipVal), el("label", { class: "field" }, el("span", null, t("ipType")), inp), ts.node, btn);
    p.insertBefore(wrap, p.alert.nextSibling);
    api("GET", "/security/ip-check").then(function (d) { ipVal.textContent = d.ip; }).catch(function (e) { p.say(errMsg(e.code)); });
    btn.addEventListener("click", async function () {
      btn.disabled = true;
      try {
        if (!ts.token) throw new Error("verification_required");
        var r = await api("POST", "/security/ip-verify", { ip: inp.value.trim(), turnstileToken: ts.token });
        state.ipToken = r.ipToken; wrap.remove(); p.say("");
        await retry();
      } catch (e) { p.say(e.message === "verification_required" ? t("ts_required") : errMsg(e.code)); ts.reset(); }
      btn.disabled = false;
    });
  }

  function viewLogin(notice) {
    var p = panel(t("signin"), t("signinSub"));
    var em = field(t("username"), "text", "username", { value: state.username, maxlength: "254", autocomplete: "username" });
    var pw = field(t("password"), "password", "password");
    var ts = turnstileBox();
    var btn = el("button", { type: "submit", class: "btn primary block" }, t("signin"));
    var form = el("form", { novalidate: "novalidate" }, em.node, pw.node, ts.node, btn);
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      state.username = em.input.value.trim();
      if (!ts.token) { p.say(t("ts_required")); return; }
      guarded(p, btn, async function () {
        var d = await api("POST", "/auth/login", { username: state.username, password: pw.input.value, client: "web", turnstileToken: ts.token, ipToken: state.ipToken }, { noRefresh: true });
        access = d.accessToken; me = d; state.ipToken = null;
        enterDash();
        ts.reset();
      }).catch(function () {});
    });
    p.append(form, el("div", { class: "row-links" }, link(t("noacc"), function () { state.view = "register"; render(); })));
    mount(p);
    if (notice) p.say(notice, "ok");
  }

  function viewRegister() {
    var p = panel(t("register"), t("registerSub"));
    var em = field(t("username"), "text", "username", { value: state.username, maxlength: "32", autocomplete: "username" });
    var pw = field(t("password"), "password", "password", { autocomplete: "new-password" });
    var pw2 = field(t("confirm"), "password", "confirm", { autocomplete: "new-password" });
    var ts = turnstileBox();
    var btn = el("button", { type: "submit", class: "btn primary block" }, t("register"));
    var form = el("form", { novalidate: "novalidate" }, em.node, pw.node, pw2.node, el("p", { class: "sub" }, t("pwHint")), ts.node, btn);
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      state.username = em.input.value.trim();
      if (!ts.token) { p.say(t("ts_required")); return; }
      guarded(p, btn, async function () {
        var d = await api("POST", "/auth/register", { username: state.username, password: pw.input.value, confirmPassword: pw2.input.value, turnstileToken: ts.token, ipToken: state.ipToken });
        access = d.accessToken; me = d; state.ipToken = null; ts.reset(); enterDash();
      });
    });
    p.append(form, el("div", { class: "row-links" }, link(t("haveacc"), function () { state.view = "login"; render(); })));
    mount(p);
  }

  /* Dashboard */
  var TABS = ["overview", "account", "devices", "security", "plan", "downloads", "settings"];

  function enterDash() { state.view = "dash"; state.tab = qs.get("device") ? "devices" : state.tab; render(); maybeHandoff(); }

  /* Desktop app login: ?desktop=<port>&state=<nonce> → send a one-time code back to 127.0.0.1 */
  var handoffStarted = false;
  function maybeHandoff() {
    var port = qs.get("desktop"), st = qs.get("state");
    if (handoffStarted || !/^\d{2,5}$/.test(port || "") || !/^[A-Za-z0-9_-]{16,128}$/.test(st || "")) return;
    handoffStarted = true;
    var box = document.createElement("div");
    box.id = "handoff-status";
    box.setAttribute("role", "status");
    box.style.cssText = "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#08090d;color:#e5c98a;font:600 16px system-ui,sans-serif;z-index:9999;padding:24px;text-align:center";
    box.textContent = "COMPIVOX 앱으로 돌아가는 중입니다…";
    document.body.appendChild(box);
    api("POST", "/auth/desktop-handoff", {}).then(function (d) {
      location.replace("http://127.0.0.1:" + port + "/callback?code=" + encodeURIComponent(d.code) + "&state=" + encodeURIComponent(st));
    }).catch(function () {
      handoffStarted = false;
      box.textContent = "앱 연결에 실패했습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.";
    });
  }

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
        stat(t("emailL"), d.user.username), stat(t("planL"), planName(d.plan)),
        stat(t("devCount"), d.devices.count + " / " + d.devices.limit), stat(t("builds"), buildsText(d.plan))));
    },
    account: async function (c) {
      var d = await api("GET", "/auth/me");
      c.replaceChildren(el("h1", null, t("account")), el("div", { class: "stat-grid" }, stat(t("emailL"), d.user.username), stat(t("planL"), planName(d.plan))));
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
    if (await refresh()) state.view = "dash";
    if (state.view === "dash" && qs.get("device")) state.tab = "devices";
    render();
    if (state.view === "dash") maybeHandoff();
  })();
})();
