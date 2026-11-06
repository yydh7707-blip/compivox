(() => {
  // keyrush.js
  var API = "/api/keyrush";
  var ICON = "/compivox-icon.png";
  var app = document.getElementById("app");
  var toast = document.getElementById("toast");
  var state = {
    user: null,
    maps: [],
    adminMaps: [],
    rankings: [],
    rankingMap: "",
    rankingMode: "keyboard",
    profile: null,
    profileUsername: "",
    authMode: "login",
    preferredMode: localStorage.getItem("keyrush-mode") === "touch" ? "touch" : "keyboard",
    settings: loadSettings(),
    apiError: "",
    mapError: "",
    sessionError: "",
    game: null,
    result: null,
    ghost: null,
    editorError: "",
    toastTimer: 0,
    countdownTimer: 0,
    ghostTimer: 0,
    renderToken: 0
  };
  function loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem("keyrush-settings") ?? "{}");
      return { sound: saved.sound === true, hints: saved.hints !== false };
    } catch (error) {
      console.warn("Could not read local KeyRush settings.", error);
      return { sound: false, hints: true };
    }
  }
  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }
  function formatNumber(value, digits = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number.toLocaleString("ko-KR", { maximumFractionDigits: digits }) : "0";
  }
  function formatDuration(ms) {
    return `${(Math.max(0, Number(ms) || 0) / 1e3).toFixed(1)}s`;
  }
  function formatDate(timestamp) {
    const date = new Date(Number(timestamp) * 1e3);
    return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date) : "\u2014";
  }
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }
  async function api(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      credentials: "same-origin",
      ...options,
      headers: {
        ...options.body ? { "content-type": "application/json" } : {},
        ...options.headers
      }
    });
    let body;
    try {
      body = await response.json();
    } catch {
      throw new Error(response.ok ? "\uC11C\uBC84 \uC751\uB2F5\uC744 \uC77D\uC744 \uC218 \uC5C6\uC5B4\uC694." : `\uC11C\uBC84 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694 (${response.status}).`);
    }
    if (!response.ok) {
      const messages = {
        login_required: "\uAE30\uB85D\uC744 \uC800\uC7A5\uD558\uB824\uBA74 \uBA3C\uC800 \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694.",
        owner_required: "\uC18C\uC720\uC790 \uACC4\uC815\uB9CC \uC0AC\uC6A9\uD560 \uC218 \uC788\uB294 \uAE30\uB2A5\uC774\uC5D0\uC694.",
        invalid_credentials: "\uC544\uC774\uB514\uB098 \uBE44\uBC00\uBC88\uD638\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.",
        username_taken: "\uC774\uBBF8 \uC0AC\uC6A9 \uC911\uC778 \uC544\uC774\uB514\uC608\uC694.",
        invalid_username: "\uC544\uC774\uB514\uB294 \uC601\uBB38 \uC18C\uBB38\uC790, \uC22B\uC790, \uBC11\uC904\uB85C 3~20\uC790 \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
        invalid_nickname: "\uB2C9\uB124\uC784\uC740 2~20\uC790\uB85C \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
        invalid_password: "\uBE44\uBC00\uBC88\uD638\uB294 10\uC790 \uC774\uC0C1\uC73C\uB85C \uC785\uB825\uD574 \uC8FC\uC138\uC694.",
        owner_already_claimed: "\uC18C\uC720\uC790 \uACC4\uC815 \uB4F1\uB85D\uC774 \uC774\uBBF8 \uC644\uB8CC\uB418\uC5C8\uC5B4\uC694.",
        pattern_incomplete: "\uB9F5 \uD328\uD134\uC744 \uB05D\uAE4C\uC9C0 \uC785\uB825\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694.",
        map_not_found: "\uB9F5\uC744 \uCC3E\uC744 \uC218 \uC5C6\uAC70\uB098 \uBE44\uACF5\uAC1C \uC0C1\uD0DC\uC608\uC694.",
        rate_limited: "\uC694\uCCAD\uC774 \uC7A0\uC2DC \uB9CE\uC544\uC694. \uC870\uAE08 \uB4A4\uC5D0 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.",
        run_expired: "\uD50C\uB808\uC774 \uC2DC\uAC04\uC774 \uB9CC\uB8CC\uB418\uC5C8\uC5B4\uC694. \uB9F5\uC5D0\uC11C \uB2E4\uC2DC \uC2DC\uC791\uD574 \uC8FC\uC138\uC694.",
        run_already_finished: "\uC774\uBBF8 \uC81C\uCD9C\uB41C \uD50C\uB808\uC774 \uAE30\uB85D\uC774\uC5D0\uC694."
      };
      throw new Error(messages[body?.error] ?? `\uC694\uCCAD\uC744 \uC644\uB8CC\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694 (${body?.error ?? response.status}).`);
    }
    return body;
  }
  function routeInfo() {
    const hash = location.hash.replace(/^#\/?/, "");
    const [path, query = ""] = hash.split("?");
    const parts = path.split("/").filter(Boolean);
    return { page: parts[0] || "home", id: parts[1] || "", params: new URLSearchParams(query) };
  }
  function go(page) {
    location.hash = page === "home" ? "#/" : `#/${page}`;
  }
  function brand() {
    return `<a class="brand" href="#/" aria-label="Compivox KeyRush \uD648"><span class="brand-mark"><img src="${ICON}" alt=""></span><span>COMPIVOX <span style="color:var(--accent-bright)">KEYRUSH</span></span></a>`;
  }
  function header(active = "") {
    return `<header class="topbar">
    ${brand()}
    <nav class="nav" aria-label="\uC8FC\uC694 \uBA54\uB274">
      <a href="#/maps" ${active === "maps" ? 'aria-current="page"' : ""}>\uB9F5</a>
      <a href="#/rankings" ${active === "rankings" ? 'aria-current="page"' : ""}>\uB7AD\uD0B9</a>
      ${state.user ? `<a href="#/profile" ${active === "profile" ? 'aria-current="page"' : ""}>\uD504\uB85C\uD544</a>` : ""}
      ${state.user?.role === "owner" ? `<a href="#/admin" ${active === "admin" ? 'aria-current="page"' : ""}>\uAD00\uB9AC</a>` : ""}
      <a href="#/settings" ${active === "settings" ? 'aria-current="page"' : ""}>\uC124\uC815</a>
    </nav>
    <div class="top-actions">${state.user ? `<a class="user-chip" href="#/profile" title="${esc(state.user.username)}">${esc(state.user.nickname)}</a><button class="btn btn-quiet btn-sm" data-action="logout">\uB85C\uADF8\uC544\uC6C3</button>` : `<a class="btn btn-secondary btn-sm" href="#/account">\uB85C\uADF8\uC778</a>`}
    </div>
  </header>`;
  }
  function shell(content, active = "") {
    return `<div class="shell">${header(active)}<main class="wrap">${content}</main></div>`;
  }
  function mapCard(map, editable = false) {
    const difficulty = { easy: "EASY", normal: "NORMAL", hard: "HARD", expert: "EXPERT" }[map.difficulty] ?? map.difficulty;
    return `<article class="map-card">
    <div class="map-card-top"><span class="difficulty">${difficulty}</span>${editable ? `<span class="difficulty">${map.published ? "PUBLISHED" : "DRAFT"}</span>` : ""}</div>
    <h3>${esc(map.title)}</h3>
    <p>${esc(map.description)}</p>
    <div class="map-meta"><span>${map.bpm} BPM</span><span>${map.pattern.length} keys</span><span>${map.keyset}</span></div>
    <a class="btn btn-secondary btn-sm" style="margin-top:14px" href="#/${editable ? "editor" : "map"}/${encodeURIComponent(map.id)}">${editable ? "\uB9F5 \uD3B8\uC9D1" : "\uB9F5 \uD655\uC778"}</a>
  </article>`;
  }
  function renderHome() {
    const featured = state.maps.slice(0, 3);
    const content = `<section class="hero">
      <div class="hero-copy"><span class="eyebrow">COMPIVOX \xB7 SINGLE PLAYER RHYTHM</span>
        <h1>Find your<br><span>key rhythm.</span></h1>
        <p>\uACF5\uC2DD \uB9F5\uC744 \uD50C\uB808\uC774\uD558\uBA70 \uC18D\uB3C4\uC640 \uC815\uD655\uB3C4\uB97C \uD568\uAED8 \uD0A4\uC6CC\uC694. \uD0A4\uBCF4\uB4DC\uC640 \uD130\uCE58, \uAC01 \uC785\uB825 \uBC29\uC2DD\uC5D0 \uB9DE\uB294 \uB7AD\uD0B9\uC5D0\uC11C \uAE30\uB85D\uC744 \uACBD\uC7C1\uD560 \uC218 \uC788\uC5B4\uC694.</p>
        <div class="hero-actions"><a class="btn btn-primary" href="#/maps">\uD50C\uB808\uC774 \uC2DC\uC791 <span aria-hidden="true">\u2192</span></a><a class="btn btn-secondary" href="#/rankings">\uB7AD\uD0B9 \uBCF4\uAE30</a></div>
      </div>
      <div class="hero-art" aria-hidden="true"><div class="hero-key">K</div></div>
    </section>
    <section class="hero-stats" aria-label="\uB0B4 KeyRush \uAE30\uB85D">
      <div class="stat"><div class="stat-label">\uACF5\uC2DD \uB9F5</div><div class="stat-value">${state.maps.length}</div></div>
      <div class="stat"><div class="stat-label">\uB0B4 \uD50C\uB808\uC774</div><div class="stat-value">${state.profile ? formatNumber(state.profile.stats.plays) : "\u2014"}</div></div>
      <div class="stat"><div class="stat-label">\uAC1C\uC778 \uCD5C\uACE0 \uC810\uC218</div><div class="stat-value">${state.profile ? formatNumber(state.profile.stats.bestScore) : "\u2014"}</div></div>
    </section>
    ${state.mapError ? `<div class="notice error">${esc(state.mapError)} \xB7 \uC11C\uBC84 \uC5F0\uACB0\uC744 \uD655\uC778\uD55C \uB4A4 \uC0C8\uB85C\uACE0\uCE68\uD574 \uC8FC\uC138\uC694.</div>` : ""}
    ${state.sessionError ? `<div class="notice error">${esc(state.sessionError)} \xB7 \uACC4\uC815 \uC0C1\uD0DC\uB97C \uD655\uC778\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694.</div>` : ""}
    <div class="section-head"><div><span class="eyebrow">OFFICIAL MAPS</span><h2>\uC624\uB298\uC758 \uB9AC\uB4EC\uC744 \uACE8\uB77C\uC694</h2><p>\uAE30\uB85D\uC740 \uC2E4\uC81C \uC644\uB8CC\uD55C \uD50C\uB808\uC774\uC5D0\uC11C\uB9CC \uC800\uC7A5\uB3FC\uC694.</p></div><a class="text-link" href="#/maps">\uBAA8\uB4E0 \uB9F5 \uBCF4\uAE30 \u2192</a></div>
    ${featured.length ? `<div class="map-grid">${featured.map((map) => mapCard(map)).join("")}</div>` : `<div class="panel empty">\uACF5\uAC1C\uB41C \uB9F5\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694.</div>`}`;
    app.innerHTML = shell(content);
  }
  function renderMaps() {
    app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">OFFICIAL MAPS</span><h1 class="page-title">\uB9F5 \uC120\uD0DD</h1><p class="page-lead">\uAC01 \uB9F5\uC758 \uD328\uD134\uACFC \uB09C\uC774\uB3C4\uB97C \uD655\uC778\uD558\uACE0 \uC6D0\uD558\uB294 \uC785\uB825 \uBC29\uC2DD\uC73C\uB85C \uD50C\uB808\uC774\uD574\uC694.</p></div><div class="mode-switch" aria-label="\uC785\uB825 \uBC29\uC2DD"><button data-action="set-mode" data-mode="keyboard" class="${state.preferredMode === "keyboard" ? "active" : ""}">Keyboard</button><button data-action="set-mode" data-mode="touch" class="${state.preferredMode === "touch" ? "active" : ""}">Touch</button></div></div>
    ${state.maps.length ? `<div class="map-grid">${state.maps.map((map) => mapCard(map)).join("")}</div>` : `<div class="panel empty">${state.mapError ? esc(state.mapError) : "\uACF5\uC2DD \uB9F5\uC744 \uBD88\uB7EC\uC624\uACE0 \uC788\uC5B4\uC694."}</div>`}`, "maps");
  }
  function renderMap(id) {
    const map = state.maps.find((item) => item.id === id);
    if (!map) {
      app.innerHTML = shell(`<div class="panel empty">${esc(state.mapError || "\uB9F5 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uACE0 \uC788\uC5B4\uC694.")} <a class="text-link" href="#/maps">\uB9F5 \uBAA9\uB85D\uC73C\uB85C \uB3CC\uC544\uAC00\uAE30</a></div>`, "maps");
      return;
    }
    app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">${esc(map.difficulty)} \xB7 OFFICIAL MAP</span><h1 class="page-title">${esc(map.title)}</h1><p class="page-lead">${esc(map.description)}</p></div><a class="btn btn-quiet btn-sm" href="#/maps">\u2190 \uB9F5 \uBAA9\uB85D</a></div>
    <section class="panel panel-pad">
      <div class="hero-stats" style="margin-top:0"><div class="stat"><div class="stat-label">\uB09C\uC774\uB3C4</div><div class="stat-value">${esc(map.difficulty.toUpperCase())}</div></div><div class="stat"><div class="stat-label">\uD15C\uD3EC</div><div class="stat-value">${map.bpm} BPM</div></div><div class="stat"><div class="stat-label">\uD328\uD134 \uAE38\uC774</div><div class="stat-value">${map.pattern.length} keys</div></div></div>
      <p class="notice">\uC0AC\uC6A9 \uD0A4: <strong>${esc([...map.keyset].join(" \xB7 "))}</strong><br>\uB7AD\uD0B9 \uAE30\uB85D\uC744 \uB0A8\uAE30\uB824\uBA74 \uACC4\uC815\uC73C\uB85C \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694. \uD0A4\uBCF4\uB4DC\uC640 \uD130\uCE58 \uB7AD\uD0B9\uC740 \uB530\uB85C \uC9D1\uACC4\uB3FC\uC694.</p>
      <div class="hero-actions"><button class="btn btn-primary" data-action="play-map" data-id="${esc(map.id)}" data-mode="keyboard">\u2328 \uD0A4\uBCF4\uB4DC\uB85C \uD50C\uB808\uC774</button><button class="btn btn-secondary" data-action="play-map" data-id="${esc(map.id)}" data-mode="touch">\uD130\uCE58\uB85C \uD50C\uB808\uC774</button><a class="btn btn-quiet" href="#/rankings?map=${encodeURIComponent(map.id)}">\uC774 \uB9F5 \uB7AD\uD0B9</a></div>
    </section>`, "maps");
  }
  function renderAccount() {
    const register = state.authMode === "register";
    app.innerHTML = shell(`<div class="auth-wrap"><section class="panel panel-pad auth-card">
    <span class="eyebrow">PLAYER ACCOUNT</span><h1 class="page-title" style="font-size:30px">${register ? "\uAE30\uB85D\uC744 \uC800\uC7A5\uD574\uC694" : "\uB2E4\uC2DC \uB9CC\uB098\uC11C \uBC18\uAC00\uC6CC\uC694"}</h1>
    <p class="page-lead">\uACC4\uC815\uC740 \uD50C\uB808\uC774 \uAE30\uB85D\uACFC \uC785\uB825 \uBC29\uC2DD\uBCC4 \uB7AD\uD0B9\uC744 \uC800\uC7A5\uD558\uB294 \uB370 \uC0AC\uC6A9\uB3FC\uC694.</p>
    <div class="auth-switch"><button class="${!register ? "active" : ""}" data-action="auth-mode" data-mode="login">\uB85C\uADF8\uC778</button><button class="${register ? "active" : ""}" data-action="auth-mode" data-mode="register">\uACC4\uC815 \uB9CC\uB4E4\uAE30</button></div>
    <form data-form="account" data-mode="${register ? "register" : "login"}" class="field-grid">
      <div class="field full"><label for="username">\uC544\uC774\uB514</label><input class="input" id="username" name="username" autocomplete="username" minlength="3" maxlength="20" required></div>
      ${register ? `<div class="field full"><label for="nickname">\uB2C9\uB124\uC784</label><input class="input" id="nickname" name="nickname" maxlength="20" required></div>` : ""}
      <div class="field full"><label for="password">\uBE44\uBC00\uBC88\uD638</label><input class="input" id="password" name="password" type="password" autocomplete="${register ? "new-password" : "current-password"}" minlength="${register ? 10 : 1}" maxlength="128" required>${register ? `<p class="field-hint">10\uC790 \uC774\uC0C1\uC73C\uB85C \uC124\uC815\uD574 \uC8FC\uC138\uC694.</p>` : ""}</div>
      ${register ? `<div class="field full"><label for="owner-claim">\uC18C\uC720\uC790 \uB4F1\uB85D \uCF54\uB4DC <span style="color:var(--muted)">(\uC120\uD0DD)</span></label><input class="input" id="owner-claim" name="ownerClaim" type="password" autocomplete="off"><p class="field-hint">\uC77C\uBC18 \uAC00\uC785\uC5D0\uB294 \uD544\uC694\uD558\uC9C0 \uC54A\uC544\uC694. \uC11C\uBC84\uC5D0 \uC124\uC815\uB41C 1\uD68C\uC6A9 \uCF54\uB4DC\uAC00 \uC788\uC5B4\uC57C \uC18C\uC720\uC790 \uAD8C\uD55C\uC744 \uBC1B\uC744 \uC218 \uC788\uC5B4\uC694.</p></div>` : ""}
      <div class="field full"><button class="btn btn-primary" style="width:100%" type="submit">${register ? "\uACC4\uC815 \uB9CC\uB4E4\uAE30" : "\uB85C\uADF8\uC778"}</button></div>
    </form>
    ${state.apiError ? `<div class="notice error">${esc(state.apiError)}</div>` : ""}
    <p class="field-hint">\uBE44\uBC00\uBC88\uD638\uB294 \uBE0C\uB77C\uC6B0\uC800 \uBC16\uC73C\uB85C \uC804\uC1A1\uB418\uC5B4 \uC11C\uBC84\uC5D0\uC11C \uBCF4\uD638\uB41C \uBC29\uC2DD\uC73C\uB85C \uCC98\uB9AC\uB3FC\uC694.</p>
  </section></div>`);
  }
  function renderRankings() {
    const mapOptions = `<option value="">\uC804\uCCB4 \uB9F5 \uC885\uD569 \uB7AD\uD0B9</option>${state.maps.map((map) => `<option value="${esc(map.id)}" ${state.rankingMap === map.id ? "selected" : ""}>${esc(map.title)}</option>`).join("")}`;
    const rows = state.rankings.map((item, index) => `<tr><td class="rank-number">${index + 1}</td><td><a class="rank-name" href="#/profiles/${encodeURIComponent(item.username)}">${esc(item.nickname)}</a><div class="field-hint">@${esc(item.username)}</div></td><td>${formatNumber(item.score)}</td><td>${formatNumber(item.accuracy, 2)}%</td><td>${formatNumber(item.wpm, 1)}</td><td>${item.mode === "touch" ? "Touch" : "Keyboard"}</td><td>${formatDate(item.created_at)}</td></tr>`).join("");
    app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">REAL PLAYER RECORDS</span><h1 class="page-title">\uB7AD\uD0B9</h1><p class="page-lead">\uC800\uC7A5\uB41C \uC644\uB8CC \uAE30\uB85D\uB9CC \uD45C\uC2DC\uD574\uC694. \uC810\uC218\uB294 \uC785\uB825 \uC774\uBCA4\uD2B8\uB97C \uC11C\uBC84\uC5D0\uC11C \uAC80\uC99D\uD574 \uACC4\uC0B0\uD574\uC694.</p></div><div class="mode-switch"><button data-action="rank-mode" data-mode="keyboard" class="${state.rankingMode === "keyboard" ? "active" : ""}">Keyboard</button><button data-action="rank-mode" data-mode="touch" class="${state.rankingMode === "touch" ? "active" : ""}">Touch</button></div></div>
    <section class="panel panel-pad">
      ${state.apiError ? `<div class="notice error">${esc(state.apiError)}</div>` : ""}
      <div class="field" style="max-width:320px;margin-bottom:15px"><label for="ranking-map">\uB7AD\uD0B9 \uBC94\uC704</label><select class="select" id="ranking-map" data-change="ranking-map">${mapOptions}</select></div>
      <div class="ranking-scroll"><table class="ranking-table"><thead><tr><th>\uC21C\uC704</th><th>\uD50C\uB808\uC774\uC5B4</th><th>\uC810\uC218</th><th>\uC815\uD655\uB3C4</th><th>WPM</th><th>\uC785\uB825</th><th>\uAE30\uB85D\uC77C</th></tr></thead><tbody>${rows || `<tr><td colspan="7"><div class="empty">\uC544\uC9C1 \uC800\uC7A5\uB41C \uAE30\uB85D\uC774 \uC5C6\uC5B4\uC694. \uBA3C\uC800 \uB9F5\uC744 \uD50C\uB808\uC774\uD574 \uBCF4\uC138\uC694.</div></td></tr>`}</tbody></table></div>
    </section>`, "rankings");
  }
  function renderProfile() {
    const profile = state.profile;
    if (!profile) {
      app.innerHTML = shell(`<div class="panel empty">${state.apiError ? esc(state.apiError) : "\uD504\uB85C\uD544\uC744 \uBD88\uB7EC\uC624\uACE0 \uC788\uC5B4\uC694."}</div>`, "profile");
      return;
    }
    const { user, stats, maps } = profile;
    const ranks = profile.ranks ?? {};
    app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">PLAYER PROFILE</span><h1 class="page-title">${esc(user.nickname)}</h1><p class="page-lead">@${esc(user.username)} \xB7 ${user.role === "owner" ? "\uB9F5 \uC81C\uC791\uC790" : "KeyRush \uD50C\uB808\uC774\uC5B4"}</p></div></div>
    <div class="hero-stats" style="grid-template-columns:repeat(auto-fit,minmax(135px,1fr));margin:0 0 20px">
      <div class="stat"><div class="stat-label">\uC644\uB8CC \uD50C\uB808\uC774</div><div class="stat-value">${formatNumber(stats.plays)}</div></div>
      <div class="stat"><div class="stat-label">\uCD5C\uACE0 \uC810\uC218</div><div class="stat-value">${formatNumber(stats.bestScore)}</div></div>
      <div class="stat"><div class="stat-label">\uD3C9\uADE0 \uC815\uD655\uB3C4</div><div class="stat-value">${formatNumber(stats.averageAccuracy, 1)}%</div></div>
      <div class="stat"><div class="stat-label">Keyboard \uC885\uD569 \uC21C\uC704</div><div class="stat-value">${ranks.keyboard ? `#${formatNumber(ranks.keyboard)}` : "\u2014"}</div></div>
      <div class="stat"><div class="stat-label">Touch \uC885\uD569 \uC21C\uC704</div><div class="stat-value">${ranks.touch ? `#${formatNumber(ranks.touch)}` : "\u2014"}</div></div>
    </div>
    <section class="panel panel-pad"><div class="section-head" style="margin:0 0 12px"><div><span class="eyebrow">PERSONAL BEST</span><h2>\uB9F5\uBCC4 \uCD5C\uACE0 \uAE30\uB85D</h2></div></div>
      ${maps.length ? `<div class="ranking-scroll"><table class="ranking-table"><thead><tr><th>\uB9F5</th><th>\uC810\uC218</th><th>\uC815\uD655\uB3C4</th><th>WPM</th><th>\uC785\uB825</th><th>\uAE30\uB85D\uC77C</th></tr></thead><tbody>${maps.map((item) => `<tr><td class="rank-name">${esc(item.title)}</td><td>${formatNumber(item.score)}</td><td>${formatNumber(item.accuracy, 2)}%</td><td>${formatNumber(item.wpm, 1)}</td><td>${item.mode === "touch" ? "Touch" : "Keyboard"}</td><td>${formatDate(item.created_at)}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty">\uC544\uC9C1 \uAC1C\uC778 \uAE30\uB85D\uC774 \uC5C6\uC5B4\uC694. \uB9F5\uC744 \uC644\uB8CC\uD558\uBA74 \uC5EC\uAE30\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC5B4\uC694.</div>`}
    </section>`, "profile");
  }
  function renderPublicProfile() {
    if (!state.profile) {
      app.innerHTML = shell(`<div class="panel empty">${state.apiError ? esc(state.apiError) : "\uD504\uB85C\uD544\uC744 \uBD88\uB7EC\uC624\uACE0 \uC788\uC5B4\uC694."}</div>`);
      return;
    }
    renderProfile();
  }
  function renderSettings() {
    app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">PREFERENCES</span><h1 class="page-title">\uC124\uC815</h1><p class="page-lead">\uAE30\uAE30\uBCC4 \uD50C\uB808\uC774 \uD658\uACBD\uC744 \uC870\uC815\uD574\uC694.</p></div></div>
    <section class="panel panel-pad">
      <div class="field-grid">
        <div class="field"><label for="preferred-mode">\uAE30\uBCF8 \uC785\uB825 \uBC29\uC2DD</label><select id="preferred-mode" class="select"><option value="keyboard" ${state.preferredMode === "keyboard" ? "selected" : ""}>Keyboard</option><option value="touch" ${state.preferredMode === "touch" ? "selected" : ""}>Touch</option></select></div>
        <div class="field"><label for="sound-setting">\uC785\uB825\uC74C</label><select id="sound-setting" class="select"><option value="off" ${!state.settings.sound ? "selected" : ""}>\uAEBC\uC9D0</option><option value="on" ${state.settings.sound ? "selected" : ""}>\uCF1C\uC9D0</option></select></div>
        <div class="field full"><label><input id="hints-setting" type="checkbox" ${state.settings.hints ? "checked" : ""}> \uB2E4\uC74C \uC785\uB825 \uD78C\uD2B8\uB97C \uD45C\uC2DC\uD574\uC694</label><p class="field-hint">\uC124\uC815\uC740 \uC774 \uBE0C\uB77C\uC6B0\uC800\uC5D0 \uC800\uC7A5\uB3FC\uC694. \uD50C\uB808\uC774 \uAE30\uB85D\uACFC \uB7AD\uD0B9\uC740 \uC11C\uBC84 \uACC4\uC815\uC5D0 \uC800\uC7A5\uB3FC\uC694.</p></div>
      </div>
      <div class="form-actions"><button class="btn btn-primary" data-action="save-settings">\uC124\uC815 \uC800\uC7A5</button></div>
    </section>`, "settings");
  }
  function renderAdmin() {
    if (state.user?.role !== "owner") {
      app.innerHTML = shell(`<div class="panel empty">\uB9F5 \uAD00\uB9AC \uD398\uC774\uC9C0\uB294 \uC18C\uC720\uC790 \uACC4\uC815\uB9CC \uC774\uC6A9\uD560 \uC218 \uC788\uC5B4\uC694.</div>`, "admin");
      return;
    }
    const rows = state.adminMaps.map((map) => `<article class="admin-map-row"><div><h3>${esc(map.title)}</h3><p>${esc(map.id)} \xB7 ${map.pattern.length} keys \xB7 ${map.bpm} BPM \xB7 ${map.published ? "\uACF5\uAC1C" : "\uBE44\uACF5\uAC1C"}</p></div><div class="admin-actions"><button class="btn btn-secondary btn-sm" data-action="test-map" data-id="${esc(map.id)}">\uD14C\uC2A4\uD2B8</button><a class="btn btn-secondary btn-sm" href="#/editor/${encodeURIComponent(map.id)}">\uD3B8\uC9D1</a><button class="btn btn-quiet btn-sm" data-action="publish-map" data-id="${esc(map.id)}" data-published="${map.published ? "true" : "false"}">${map.published ? "\uBE44\uACF5\uAC1C" : "\uACF5\uAC1C"}</button><button class="btn btn-danger btn-sm" data-action="delete-map" data-id="${esc(map.id)}">\uC0AD\uC81C</button></div></article>`).join("");
    app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">OWNER ONLY</span><h1 class="page-title">\uB9F5 \uAD00\uB9AC</h1><p class="page-lead">\uACF5\uC2DD \uB9F5\uC744 \uC81C\uC791\xB7\uC218\uC815\uD558\uACE0 \uACF5\uAC1C \uC5EC\uBD80\uB97C \uAD00\uB9AC\uD574\uC694. \uAD8C\uD55C\uC740 \uC11C\uBC84\uC5D0\uC11C \uD655\uC778\uB3FC\uC694.</p></div><a class="btn btn-primary" href="#/editor/new">\uC0C8 \uB9F5 \uB9CC\uB4E4\uAE30</a></div>
    ${state.apiError ? `<div class="notice error">${esc(state.apiError)}</div>` : ""}
    <section class="admin-map-list">${rows || `<div class="panel empty">\uB9F5 \uBAA9\uB85D\uC774 \uBE44\uC5B4 \uC788\uC5B4\uC694.</div>`}</section>`, "admin");
  }
  function renderEditor(id) {
    if (state.user?.role !== "owner") {
      app.innerHTML = shell(`<div class="panel empty">\uB9F5 \uD3B8\uC9D1\uC740 \uC18C\uC720\uC790 \uACC4\uC815\uB9CC \uC774\uC6A9\uD560 \uC218 \uC788\uC5B4\uC694.</div>`);
      return;
    }
    const map = id === "new" ? {
      id: "",
      title: "",
      description: "",
      difficulty: "normal",
      bpm: 90,
      keyset: "ASDFJKL",
      pattern: "",
      published: false
    } : state.adminMaps.find((item) => item.id === id);
    if (!map) {
      app.innerHTML = shell(`<div class="panel empty">\uB9F5 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uACE0 \uC788\uC5B4\uC694.</div>`, "admin");
      return;
    }
    const chunks = [...map.pattern].slice(0, 64).map((key) => `<span>${esc(key)}</span>`).join("");
    app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">OWNER MAP EDITOR</span><h1 class="page-title">${id === "new" ? "\uC0C8 \uACF5\uC2DD \uB9F5" : esc(map.title)}</h1><p class="page-lead">\uB9F5 \uD328\uD134\uC740 \uC120\uD0DD\uD55C \uD0A4\uB85C\uB9CC \uAD6C\uC131\uB3FC\uC694. \uACF5\uAC1C\uB41C \uBC84\uC804\uB9CC \uBAA8\uB4E0 \uD50C\uB808\uC774\uC5B4\uC758 \uB9F5 \uBAA9\uB85D\uACFC \uB7AD\uD0B9\uC5D0 \uB098\uD0C0\uB098\uC694.</p></div><a class="btn btn-quiet btn-sm" href="#/admin">\u2190 \uB9F5 \uAD00\uB9AC</a></div>
    ${state.editorError ? `<div class="notice error">${esc(state.editorError)}</div>` : ""}
    <form class="panel panel-pad" data-form="map-editor" data-id="${esc(id)}">
      <div class="field-grid">
        <div class="field"><label for="map-id">\uB9F5 ID</label><input class="input" id="map-id" name="id" value="${esc(map.id)}" pattern="[a-z0-9]+(-[a-z0-9]+)*" maxlength="48" ${id === "new" ? "required" : "readonly"}></div>
        <div class="field"><label for="map-title">\uB9F5 \uC774\uB984</label><input class="input" id="map-title" name="title" value="${esc(map.title)}" maxlength="60" required></div>
        <div class="field full"><label for="map-description">\uC124\uBA85</label><textarea class="textarea" id="map-description" name="description" maxlength="300">${esc(map.description)}</textarea></div>
        <div class="field"><label for="map-difficulty">\uB09C\uC774\uB3C4</label><select class="select" id="map-difficulty" name="difficulty"><option value="easy" ${map.difficulty === "easy" ? "selected" : ""}>Easy</option><option value="normal" ${map.difficulty === "normal" ? "selected" : ""}>Normal</option><option value="hard" ${map.difficulty === "hard" ? "selected" : ""}>Hard</option><option value="expert" ${map.difficulty === "expert" ? "selected" : ""}>Expert</option></select></div>
        <div class="field"><label for="map-bpm">BPM</label><input class="input" id="map-bpm" name="bpm" type="number" min="30" max="240" value="${map.bpm}" required></div>
        <div class="field"><label for="map-keyset">\uC0AC\uC6A9 \uD0A4 (\uC911\uBCF5 \uC5C6\uC774 3~12\uAC1C)</label><input class="input" id="map-keyset" name="keyset" value="${esc(map.keyset)}" minlength="3" maxlength="12" pattern="[A-Za-z]{3,12}" required></div>
        <div class="field full"><label for="map-pattern">\uD0A4 \uC785\uB825 \uD328\uD134 (8~240\uC790)</label><textarea class="textarea" id="map-pattern" name="pattern" minlength="8" maxlength="240" required>${esc(map.pattern)}</textarea><p class="field-hint">\uC0AC\uC6A9 \uD0A4\uC14B\uC5D0 \uD3EC\uD568\uB41C \uC54C\uD30C\uBCB3\uB9CC \uC785\uB825\uD574\uC694. \uACF5\uBC31\uC740 \uD328\uD134\uC5D0\uC11C \uC81C\uC678\uB3FC\uC694.</p><div class="pattern-preview" data-pattern-preview>${chunks || `<span>\uD328\uD134 \uBBF8\uB9AC\uBCF4\uAE30</span>`}</div></div>
        <div class="field full"><label><input type="checkbox" name="published" ${map.published ? "checked" : ""}> \uC800\uC7A5 \uD6C4 \uACF5\uAC1C\uD574\uC694</label></div>
      </div>
      <div class="form-actions"><button class="btn btn-secondary" type="button" data-action="test-editor" data-id="${esc(id)}">\uD14C\uC2A4\uD2B8 \uD50C\uB808\uC774</button><button class="btn btn-primary" type="submit">\uB9F5 \uC800\uC7A5</button></div>
    </form>`, "admin");
  }
  function renderGame() {
    const game = state.game;
    if (!game) {
      go("maps");
      return;
    }
    const sequence = renderSequence(game);
    const touchKeys = game.mode === "touch" ? `<div class="virtual-keyboard" aria-label="\uAC00\uC0C1 \uD0A4\uBCF4\uB4DC">${[...game.keyset].map((key) => `<button class="virtual-key" type="button" data-virtual-key="${esc(key)}" aria-label="${esc(key)}">${esc(key)}</button>`).join("")}</div>` : "";
    app.innerHTML = `<main class="game-wrap">
    <div class="game-top"><div><span class="eyebrow">${game.testOnly ? "OWNER TEST PLAY" : game.mode === "touch" ? "TOUCH RANKING" : "KEYBOARD RANKING"}</span><h1>${esc(game.map.title)}</h1></div><button class="btn btn-quiet btn-sm" data-action="quit-game">\uB098\uAC00\uAE30</button></div>
    <div class="game-hud">
      <div class="hud-item"><div class="hud-label">\uC810\uC218</div><div class="hud-value" data-hud="score">0</div></div>
      <div class="hud-item"><div class="hud-label">\uC815\uD655\uB3C4</div><div class="hud-value" data-hud="accuracy">\u2014</div></div>
      <div class="hud-item"><div class="hud-label">\uCF64\uBCF4</div><div class="hud-value" data-hud="combo">0</div></div>
      <div class="hud-item"><div class="hud-label">\uACBD\uACFC \uC2DC\uAC04</div><div class="hud-value" data-hud="time">0.0s</div></div>
    </div>
    <section class="panel play-panel" aria-live="polite">
      ${game.phase === "countdown" ? `<div><div class="eyebrow">GET READY</div><div class="countdown" data-countdown>${game.countdown}</div><div class="target-label">\uC7A0\uC2DC \uD6C4 \uC2DC\uC791\uD574\uC694</div></div>` : game.phase === "failed" ? `<div><div class="eyebrow">SAVE FAILED</div><div class="target-char" style="font-size:38px">\uAE30\uB85D\uC744 \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC5B4\uC694</div><p class="page-lead">${esc(game.error)}</p><button class="btn btn-primary" data-action="retry-finish">\uB2E4\uC2DC \uC81C\uCD9C</button></div>` : game.phase === "finished" ? `<div><div class="eyebrow">COMPLETE</div><div class="target-char" style="font-size:38px">\uD50C\uB808\uC774 \uC644\uB8CC</div></div>` : `<div class="play-core"><div class="target-label">TYPE THE NEXT KEY</div><div class="target-char" data-target>${esc(game.pattern[game.index] ?? "\u2713")}</div><div class="sequence-preview" data-sequence>${sequence}</div><div class="game-progress"><span data-progress style="width:${game.index / game.pattern.length * 100}%"></span></div><p class="game-hint">${state.settings.hints ? "\uD654\uBA74\uC5D0 \uB098\uC628 \uD0A4\uB97C \uC785\uB825\uD574\uC694. \uD2C0\uB9B0 \uC785\uB825\uC740 \uAE30\uB85D\uC5D0 \uBC18\uC601\uB3FC\uC694." : "\uD654\uBA74\uC758 \uD0A4\uB97C \uC785\uB825\uD574\uC694."}</p></div>`}
    </section>
    <div class="game-status" data-game-status role="status">${game.status ? esc(game.status) : ""}</div>
    ${touchKeys}
  </main>`;
    if (game.phase === "countdown") runCountdown();
    if (game.phase === "playing") startElapsedClock();
  }
  function renderSequence(game) {
    const start = Math.max(0, game.index - 3);
    const end = Math.min(game.pattern.length, game.index + 7);
    return [...game.pattern.slice(start, end)].map((key, offset) => {
      const index = start + offset;
      const status = index < game.index ? "past" : index === game.index ? "next" : "future";
      return `<span class="${status}">${esc(key)}</span>`;
    }).join("");
  }
  function runCountdown() {
    clearInterval(state.countdownTimer);
    state.countdownTimer = setInterval(() => {
      if (!state.game || state.game.phase !== "countdown") {
        clearInterval(state.countdownTimer);
        return;
      }
      state.game.countdown -= 1;
      const node = document.querySelector("[data-countdown]");
      if (node) {
        node.textContent = state.game.countdown > 0 ? state.game.countdown : "GO";
        node.classList.remove("countdown");
        void node.offsetWidth;
        node.classList.add("countdown");
      }
      if (state.game.countdown <= 0) {
        clearInterval(state.countdownTimer);
        state.game.phase = "playing";
        state.game.startedAt = Date.now();
        state.game.status = "";
        renderGame();
      }
    }, 750);
  }
  function startElapsedClock() {
    clearInterval(state.game.clock);
    state.game.clock = setInterval(() => {
      if (!state.game || state.game.phase !== "playing") return;
      const time = document.querySelector('[data-hud="time"]');
      if (time) time.textContent = formatDuration(Date.now() - state.game.startedAt);
    }, 100);
  }
  function paintGame(missed = false) {
    const game = state.game;
    if (!game || game.phase !== "playing") return;
    const accuracy = game.events.length ? game.index / game.events.length * 100 : 100;
    const target = document.querySelector("[data-target]");
    const progress = document.querySelector("[data-progress]");
    const sequence = document.querySelector("[data-sequence]");
    const score = document.querySelector('[data-hud="score"]');
    const accuracyNode = document.querySelector('[data-hud="accuracy"]');
    const combo = document.querySelector('[data-hud="combo"]');
    const status = document.querySelector("[data-game-status]");
    if (target) {
      target.textContent = game.pattern[game.index] ?? "\u2713";
      target.classList.toggle("miss", missed);
      if (missed) setTimeout(() => target.classList.remove("miss"), 220);
    }
    if (progress) progress.style.width = `${game.index / game.pattern.length * 100}%`;
    if (sequence) sequence.innerHTML = renderSequence(game);
    if (score) score.textContent = formatNumber(game.index * 100);
    if (accuracyNode) accuracyNode.textContent = `${formatNumber(accuracy, 1)}%`;
    if (combo) combo.textContent = formatNumber(game.combo);
    if (status) status.textContent = game.status;
  }
  function playInputTone(correct) {
    if (!state.settings.sound) return;
    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = correct ? 560 : 190;
      gain.gain.setValueAtTime(0.035, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(1e-3, context.currentTime + 0.075);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.08);
      oscillator.addEventListener("ended", () => context.close(), { once: true });
    } catch (error) {
      console.warn("Could not play KeyRush input sound.", error);
    }
  }
  function processGameKey(rawKey) {
    const game = state.game;
    if (!game || game.phase !== "playing") return;
    const key = String(rawKey).toUpperCase();
    if (key.length !== 1 || !game.keyset.includes(key)) return;
    const atMs = Math.max(0, Math.round(Date.now() - game.startedAt));
    const correct = key === game.pattern[game.index];
    game.events.push({ key, atMs });
    if (correct) {
      game.index += 1;
      game.combo += 1;
      game.maxCombo = Math.max(game.maxCombo, game.combo);
      game.status = "";
    } else {
      game.combo = 0;
      game.status = `\uB2E4\uC74C \uD0A4\uB294 ${game.pattern[game.index]}\uC608\uC694.`;
    }
    playInputTone(correct);
    const button = document.querySelector(`[data-virtual-key="${key}"]`);
    if (button) {
      button.classList.add("pressed");
      setTimeout(() => button.classList.remove("pressed"), 100);
    }
    if (game.index >= game.pattern.length) {
      paintGame();
      finishGame();
    } else {
      paintGame(!correct);
    }
  }
  async function finishGame() {
    const game = state.game;
    if (!game || game.phase !== "playing") return;
    clearInterval(game.clock);
    game.phase = "submitting";
    game.status = "\uAE30\uB85D\uC744 \uAC80\uC99D\uD558\uACE0 \uC788\uC5B4\uC694\u2026";
    const button = document.querySelector("[data-virtual-key]");
    if (button) {
      const keyboard = document.querySelector(".virtual-keyboard");
      if (keyboard) keyboard.remove();
    }
    const status = document.querySelector("[data-game-status]");
    if (status) status.textContent = game.status;
    try {
      const before = state.profile?.maps?.find(
        (item) => (item.map_id ?? item.mapId) === game.map.id && item.mode === game.mode
      );
      const result = await api(`/runs/${encodeURIComponent(game.runId)}/finish`, {
        method: "POST",
        body: JSON.stringify({ events: game.events })
      });
      state.result = { ...result, previousBest: Number(before?.score ?? 0) };
      game.phase = "finished";
      const requests = [
        api(`/ghost?mapId=${encodeURIComponent(game.map.id)}&mode=${encodeURIComponent(game.mode)}`).then((response) => {
          state.ghost = response.ghost;
        }).catch((error) => {
          state.ghost = null;
          console.warn("Could not load KeyRush ghost replay.", error);
        })
      ];
      if (state.user && !game.testOnly) {
        requests.push(api("/profile").then((response) => {
          state.profile = response;
        }).catch((error) => console.warn("Could not refresh KeyRush profile.", error)));
      }
      await Promise.all(requests);
      go("result");
    } catch (error) {
      game.phase = "failed";
      game.error = error.message;
      renderGame();
    }
  }
  function ghostMarks(events, duration) {
    if (!events?.length) return "";
    return events.map((event) => {
      const position = Math.min(100, Math.max(0, Number(event.atMs) / duration * 100));
      return `<i class="ghost-mark ${event.correct === false ? "missed" : ""}" style="left:${position}%" title="${esc(event.key)} \xB7 ${formatDuration(event.atMs)}"></i>`;
    }).join("");
  }
  function renderResult() {
    const result = state.result;
    const game = state.game;
    if (!result || !game) {
      app.innerHTML = shell(`<div class="panel empty">\uC644\uB8CC\uB41C \uD50C\uB808\uC774 \uACB0\uACFC\uAC00 \uC5C6\uC5B4\uC694. <a class="text-link" href="#/maps">\uB9F5\uC73C\uB85C \uC774\uB3D9</a></div>`);
      return;
    }
    const newRecord = !game.testOnly && result.score > result.previousBest;
    const ghostEvents = state.ghost?.events ?? [];
    const replayDuration = Math.max(
      1e3,
      ...game.events.map((event) => Number(event.atMs) || 0),
      ...ghostEvents.map((event) => Number(event.atMs) || 0)
    );
    app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">${game.testOnly ? "TEST PLAY \xB7 NOT SAVED" : "PLAY COMPLETE"}</span><h1 class="page-title ${newRecord ? "new-record" : ""}">${game.testOnly ? "\uD14C\uC2A4\uD2B8 \uC644\uB8CC" : newRecord ? "\uC0C8\uB85C\uC6B4 \uAC1C\uC778 \uAE30\uB85D!" : "\uD50C\uB808\uC774 \uC644\uB8CC"}</h1><p class="page-lead">${esc(game.map.title)} \xB7 ${game.mode === "touch" ? "Touch Ranking" : "Keyboard Ranking"}${game.testOnly ? " \xB7 \uD14C\uC2A4\uD2B8 \uACB0\uACFC\uB294 \uB7AD\uD0B9\uC5D0 \uC800\uC7A5\uB418\uC9C0 \uC54A\uC544\uC694." : ""}</p></div><a class="btn btn-quiet btn-sm" href="#/maps">\uB9F5 \uBAA9\uB85D</a></div>
    <section class="panel panel-pad">
      <div class="result-grid">
        <div class="result-stat"><span>\uC810\uC218</span><strong>${formatNumber(result.score)}</strong></div>
        <div class="result-stat"><span>\uC815\uD655\uB3C4</span><strong>${formatNumber(result.accuracy, 2)}%</strong></div>
        <div class="result-stat"><span>\uD3C9\uADE0 \uC18D\uB3C4</span><strong>${formatNumber(result.wpm, 1)} <small style="font-size:12px">WPM</small></strong></div>
        <div class="result-stat"><span>\uCD5C\uACE0 \uCF64\uBCF4</span><strong>${formatNumber(result.maxCombo)}</strong></div>
      </div>
      <p class="notice">\uC644\uB8CC \uC2DC\uAC04 ${formatDuration(result.elapsedMs)} \xB7 ${result.testOnly ? "\uC774 \uD50C\uB808\uC774\uB294 \uC800\uC7A5\uB418\uC9C0 \uC54A\uC558\uC5B4\uC694." : "\uC810\uC218\uB294 \uC11C\uBC84\uC5D0\uC11C \uC785\uB825 \uAE30\uB85D\uC744 \uAC80\uC99D\uD574 \uACC4\uC0B0\uD588\uC5B4\uC694."}</p>
      ${game.testOnly ? "" : `<div class="section-head" style="margin-top:27px"><div><span class="eyebrow">GHOST REPLAY</span><h2>\uC0C1\uC704 \uAE30\uB85D\uACFC \uD50C\uB808\uC774 \uD0C0\uC774\uBC0D \uBE44\uAD50</h2><p>\uB9C9\uB300 \uC704\uCE58\uB294 \uAC01 \uAE30\uB85D\uC5D0\uC11C \uC785\uB825\uD55C \uC2DC\uC810\uC744 \uBCF4\uC5EC\uC918\uC694.</p></div></div>
      ${state.ghost ? `<div class="ghost-lanes"><div class="ghost-lane ghost"><span>${esc(state.ghost.nickname)} \xB7 ${formatNumber(state.ghost.score)}</span><div class="ghost-track">${ghostMarks(ghostEvents, replayDuration)}<i class="ghost-playhead" data-playhead="ghost"></i></div></div><div class="ghost-lane"><span>\uB098 \xB7 ${formatNumber(result.score)}</span><div class="ghost-track">${ghostMarks(game.events, replayDuration)}<i class="ghost-playhead" data-playhead="player"></i></div></div></div><div class="replay-controls"><button class="btn btn-secondary btn-sm" data-action="play-ghost">\u25B6 \uACE0\uC2A4\uD2B8 \uB9AC\uD50C\uB808\uC774</button><span data-replay-status role="status">\uCD1D ${formatDuration(replayDuration)} \xB7 \uC785\uB825 \uC774\uBCA4\uD2B8 ${game.events.length}\uAC1C</span></div>` : `<div class="empty">\uC774 \uC785\uB825 \uBC29\uC2DD\uC758 \uC0C1\uC704 \uAE30\uB85D\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694. \uB0B4 \uAE30\uB85D\uC774 \uCCAB \uBC88\uC9F8 \uACE0\uC2A4\uD2B8\uAC00 \uB420 \uC218 \uC788\uC5B4\uC694.</div>`}`}
      <div class="hero-actions"><button class="btn btn-primary" data-action="${game.testOnly ? "test-map" : "play-again"}" data-id="${esc(game.map.id)}" data-mode="${esc(game.mode)}">${game.testOnly ? "\uB2E4\uC2DC \uD14C\uC2A4\uD2B8" : "\uB2E4\uC2DC \uD50C\uB808\uC774"}</button>${game.testOnly ? `<a class="btn btn-secondary" href="#/editor/${encodeURIComponent(game.map.id)}">\uB9F5 \uD3B8\uC9D1\uC73C\uB85C</a>` : `<a class="btn btn-secondary" href="#/rankings?map=${encodeURIComponent(game.map.id)}">\uB9F5 \uB7AD\uD0B9 \uBCF4\uAE30</a>`}</div>
    </section>`);
  }
  function playGhostReplay() {
    const game = state.game;
    const ghostEvents = state.ghost?.events ?? [];
    if (!game || !ghostEvents.length) {
      showToast("\uC7AC\uC0DD\uD560 \uACE0\uC2A4\uD2B8 \uAE30\uB85D\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694.");
      return;
    }
    clearInterval(state.ghostTimer);
    const duration = Math.max(
      1e3,
      ...game.events.map((event) => Number(event.atMs) || 0),
      ...ghostEvents.map((event) => Number(event.atMs) || 0)
    );
    const startedAt = performance.now();
    const status = document.querySelector("[data-replay-status]");
    const button = document.querySelector('[data-action="play-ghost"]');
    for (const playhead of document.querySelectorAll("[data-playhead]")) playhead.style.left = "0%";
    if (button) button.disabled = true;
    state.ghostTimer = setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAt) / duration);
      for (const playhead of document.querySelectorAll("[data-playhead]")) {
        playhead.style.left = `${progress * 100}%`;
      }
      if (status) status.textContent = progress < 1 ? `\uB9AC\uD50C\uB808\uC774 \uC7AC\uC0DD \uC911 \xB7 ${formatDuration(progress * duration)} / ${formatDuration(duration)}` : `\uC7AC\uC0DD \uC644\uB8CC \xB7 ${game.events.length}\uAC1C \uC785\uB825\uC744 \uBE44\uAD50\uD588\uC5B4\uC694.`;
      if (progress >= 1) {
        clearInterval(state.ghostTimer);
        state.ghostTimer = 0;
        if (button) button.disabled = false;
      }
    }, 16);
  }
  function collectMapForm(form) {
    const data = new FormData(form);
    return {
      id: String(data.get("id") ?? "").trim(),
      title: String(data.get("title") ?? "").trim(),
      description: String(data.get("description") ?? "").trim(),
      difficulty: String(data.get("difficulty") ?? "normal"),
      bpm: Number(data.get("bpm")),
      keyset: String(data.get("keyset") ?? "").replace(/\s/g, "").toUpperCase(),
      pattern: String(data.get("pattern") ?? "").replace(/\s/g, "").toUpperCase(),
      published: data.has("published")
    };
  }
  async function saveMap(form) {
    const id = form.dataset.id;
    const map = collectMapForm(form);
    const path = id === "new" ? "/admin/maps" : `/admin/maps/${encodeURIComponent(id)}`;
    await api(path, { method: "POST", body: JSON.stringify(map) });
    await loadAdminMaps();
    return map;
  }
  async function startGame(mapId, mode, testOnly = false) {
    if (!state.user) {
      state.apiError = "\uB7AD\uD0B9 \uAE30\uB85D\uC744 \uB0A8\uAE30\uB824\uBA74 \uACC4\uC815\uC73C\uB85C \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694.";
      state.authMode = "login";
      go("account");
      return;
    }
    const map = [...state.maps, ...state.adminMaps].find((item) => item.id === mapId);
    if (!map) {
      showToast("\uB9F5 \uC815\uBCF4\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC5B4\uC694.");
      go(testOnly ? "admin" : "maps");
      return;
    }
    try {
      const response = await api("/runs", {
        method: "POST",
        body: JSON.stringify({ mapId, mode, testOnly })
      });
      clearInterval(state.countdownTimer);
      state.game = {
        runId: response.runId,
        map,
        mode,
        testOnly,
        pattern: response.map.pattern,
        keyset: response.map.keyset,
        events: [],
        index: 0,
        combo: 0,
        maxCombo: 0,
        phase: "countdown",
        countdown: 3,
        startedAt: 0,
        status: "",
        clock: 0
      };
      state.result = null;
      state.ghost = null;
      location.hash = "#/play";
    } catch (error) {
      showToast(error.message);
    }
  }
  async function loadAdminMaps() {
    const response = await api("/admin/maps");
    state.adminMaps = response.maps ?? [];
  }
  async function loadRankings() {
    const query = new URLSearchParams({ mode: state.rankingMode });
    if (state.rankingMap) query.set("mapId", state.rankingMap);
    const response = await api(`/rankings?${query}`);
    state.rankings = response.rankings ?? [];
  }
  async function renderRoute() {
    const token = ++state.renderToken;
    const route = routeInfo();
    state.apiError = "";
    if (route.page !== "result") {
      clearInterval(state.ghostTimer);
      state.ghostTimer = 0;
    }
    if (state.game && route.page !== "play" && route.page !== "result") {
      clearInterval(state.game.clock);
      clearInterval(state.countdownTimer);
      state.game = null;
    }
    switch (route.page) {
      case "home":
        renderHome();
        break;
      case "maps":
        renderMaps();
        break;
      case "map":
        renderMap(decodeURIComponent(route.id));
        break;
      case "account":
        renderAccount();
        break;
      case "rankings":
        state.rankingMap = route.params.get("map") ?? "";
        state.rankingMode = route.params.get("mode") === "touch" ? "touch" : state.rankingMode;
        try {
          await loadRankings();
        } catch (error) {
          state.apiError = error.message;
          state.rankings = [];
        }
        if (token === state.renderToken) renderRankings();
        break;
      case "profile":
      case "profiles":
        try {
          state.profile = route.page === "profiles" && route.id ? await api(`/profiles/${encodeURIComponent(decodeURIComponent(route.id))}`) : state.user ? await api("/profile") : null;
          if (!state.profile) {
            state.apiError = "\uD504\uB85C\uD544\uC744 \uD655\uC778\uD558\uB824\uBA74 \uBA3C\uC800 \uB85C\uADF8\uC778\uD574 \uC8FC\uC138\uC694.";
            state.authMode = "login";
            if (route.page === "profile") {
              go("account");
              return;
            }
          }
        } catch (error) {
          state.apiError = error.message;
          state.profile = null;
        }
        if (token === state.renderToken) route.page === "profiles" ? renderPublicProfile() : renderProfile();
        break;
      case "settings":
        renderSettings();
        break;
      case "admin":
        if (state.user?.role === "owner") {
          try {
            await loadAdminMaps();
          } catch (error) {
            state.apiError = error.message;
          }
        }
        if (token === state.renderToken) renderAdmin();
        break;
      case "editor":
        if (state.user?.role === "owner") {
          try {
            await loadAdminMaps();
          } catch (error) {
            state.apiError = error.message;
          }
        }
        if (token === state.renderToken) renderEditor(decodeURIComponent(route.id));
        break;
      case "play":
        renderGame();
        break;
      case "result":
        renderResult();
        break;
      default:
        go("home");
    }
  }
  async function refreshSession() {
    try {
      const response = await api("/auth/me");
      state.user = response.user;
      state.sessionError = "";
    } catch (error) {
      state.sessionError = error.message;
    }
  }
  async function refreshMaps() {
    try {
      const response = await api("/maps");
      state.maps = response.maps ?? [];
      state.mapError = "";
    } catch (error) {
      state.mapError = error.message;
    }
  }
  async function handleAccount(form) {
    const data = new FormData(form);
    const mode = form.dataset.mode;
    const payload = {
      username: String(data.get("username") ?? "").trim().toLowerCase(),
      password: String(data.get("password") ?? "")
    };
    if (mode === "register") {
      payload.nickname = String(data.get("nickname") ?? "").trim();
      payload.ownerClaim = String(data.get("ownerClaim") ?? "");
    }
    try {
      const response = await api(`/auth/${mode}`, { method: "POST", body: JSON.stringify(payload) });
      state.user = response.user;
      state.apiError = "";
      if (state.user) {
        try {
          state.profile = await api("/profile");
        } catch (error) {
          console.warn("Could not load the new KeyRush profile.", error);
        }
      }
      showToast(mode === "register" ? "\uACC4\uC815\uC744 \uB9CC\uB4E4\uC5C8\uC5B4\uC694." : "\uB85C\uADF8\uC778\uD588\uC5B4\uC694.");
      go("home");
    } catch (error) {
      state.apiError = error.message;
      renderAccount();
    }
  }
  function updatePatternPreview() {
    const form = document.querySelector('[data-form="map-editor"]');
    const preview = document.querySelector("[data-pattern-preview]");
    if (!form || !preview) return;
    const pattern = String(new FormData(form).get("pattern") ?? "").replace(/\s/g, "").toUpperCase();
    const keys = [...pattern].slice(0, 64);
    preview.innerHTML = keys.length ? keys.map((key) => `<span>${esc(key)}</span>`).join("") : "<span>\uD328\uD134 \uBBF8\uB9AC\uBCF4\uAE30</span>";
  }
  async function handleAction(button) {
    const action = button.dataset.action;
    const id = button.dataset.id ?? "";
    switch (action) {
      case "auth-mode":
        state.authMode = button.dataset.mode;
        state.apiError = "";
        renderAccount();
        break;
      case "set-mode":
        state.preferredMode = button.dataset.mode;
        localStorage.setItem("keyrush-mode", state.preferredMode);
        renderMaps();
        break;
      case "rank-mode":
        state.rankingMode = button.dataset.mode;
        await renderRoute();
        break;
      case "play-map":
        await startGame(id, button.dataset.mode ?? state.preferredMode);
        break;
      case "play-again":
        await startGame(id, button.dataset.mode ?? state.preferredMode);
        break;
      case "test-map":
        await startGame(id, button.dataset.mode ?? state.preferredMode, true);
        break;
      case "play-ghost":
        playGhostReplay();
        break;
      case "logout":
        try {
          await api("/auth/logout", { method: "POST", body: "{}" });
          state.user = null;
          state.profile = null;
          showToast("\uB85C\uADF8\uC544\uC6C3\uD588\uC5B4\uC694.");
          go("home");
        } catch (error) {
          showToast(error.message);
        }
        break;
      case "save-settings":
        state.preferredMode = document.querySelector("#preferred-mode")?.value === "touch" ? "touch" : "keyboard";
        state.settings.sound = document.querySelector("#sound-setting")?.value === "on";
        state.settings.hints = Boolean(document.querySelector("#hints-setting")?.checked);
        localStorage.setItem("keyrush-mode", state.preferredMode);
        localStorage.setItem("keyrush-settings", JSON.stringify(state.settings));
        showToast("\uC124\uC815\uC744 \uC800\uC7A5\uD588\uC5B4\uC694.");
        break;
      case "publish-map":
        try {
          const published = button.dataset.published !== "true";
          await api(`/admin/maps/${encodeURIComponent(id)}/publish`, {
            method: "POST",
            body: JSON.stringify({ published })
          });
          await loadAdminMaps();
          renderAdmin();
          showToast(published ? "\uB9F5\uC744 \uACF5\uAC1C\uD588\uC5B4\uC694." : "\uB9F5\uC744 \uBE44\uACF5\uAC1C\uB85C \uC804\uD658\uD588\uC5B4\uC694.");
        } catch (error) {
          state.apiError = error.message;
          renderAdmin();
        }
        break;
      case "delete-map":
        if (!window.confirm("\uC774 \uB9F5\uC744 \uACF5\uAC1C \uBAA9\uB85D\uC5D0\uC11C \uC228\uAE30\uACE0 \uC774\uD6C4 \uD50C\uB808\uC774\uB97C \uB9C9\uC744\uAE4C\uC694? \uAE30\uC874 \uAE30\uB85D\uC740 \uB7AD\uD0B9\uC5D0\uC11C \uC81C\uC678\uB3FC\uC694.")) break;
        try {
          await api(`/admin/maps/${encodeURIComponent(id)}/delete`, { method: "POST", body: "{}" });
          await loadAdminMaps();
          await refreshMaps();
          renderAdmin();
          showToast("\uB9F5\uC744 \uC0AD\uC81C\uD588\uC5B4\uC694.");
        } catch (error) {
          state.apiError = error.message;
          renderAdmin();
        }
        break;
      case "test-editor": {
        const form = document.querySelector('[data-form="map-editor"]');
        if (!form?.reportValidity()) break;
        try {
          const map = await saveMap(form);
          showToast("\uB9F5\uC744 \uC800\uC7A5\uD588\uC5B4\uC694. \uD14C\uC2A4\uD2B8\uB97C \uC2DC\uC791\uD574\uC694.");
          await startGame(map.id, state.preferredMode, true);
        } catch (error) {
          state.editorError = error.message;
          renderEditor(form.dataset.id);
        }
        break;
      }
      case "quit-game":
        if (state.game && state.game.phase === "playing" && !window.confirm("\uC9C0\uAE08 \uB098\uAC00\uBA74 \uC774\uBC88 \uD50C\uB808\uC774 \uAE30\uB85D\uC740 \uC800\uC7A5\uB418\uC9C0 \uC54A\uC544\uC694. \uB098\uAC08\uAE4C\uC694?")) break;
        if (state.game) clearInterval(state.game.clock);
        clearInterval(state.countdownTimer);
        state.game = null;
        go("maps");
        break;
      case "retry-finish":
        if (state.game) {
          state.game.phase = "playing";
          await finishGame();
        }
        break;
    }
  }
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    await handleAction(button);
  });
  document.addEventListener("pointerdown", (event) => {
    const keyButton = event.target.closest("[data-virtual-key]");
    if (!keyButton) return;
    event.preventDefault();
    processGameKey(keyButton.dataset.virtualKey);
  });
  document.addEventListener("click", (event) => {
    const keyButton = event.target.closest("[data-virtual-key]");
    if (keyButton && event.detail === 0) processGameKey(keyButton.dataset.virtualKey);
  });
  document.addEventListener("change", async (event) => {
    if (event.target.matches('[data-change="ranking-map"]')) {
      state.rankingMap = event.target.value;
      await renderRoute();
    }
  });
  document.addEventListener("input", (event) => {
    if (event.target.matches("#map-pattern")) updatePatternPreview();
  });
  document.addEventListener("submit", async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.matches('[data-form="account"]')) {
      event.preventDefault();
      await handleAccount(form);
    }
    if (form.matches('[data-form="map-editor"]')) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      try {
        await saveMap(form);
        state.editorError = "";
        showToast("\uACF5\uC2DD \uB9F5\uC744 \uC800\uC7A5\uD588\uC5B4\uC694.");
        go("admin");
      } catch (error) {
        state.editorError = error.message;
        renderEditor(form.dataset.id);
      }
    }
  });
  document.addEventListener("keydown", (event) => {
    const route = routeInfo();
    if (route.page !== "play" || !state.game || state.game.mode !== "keyboard") return;
    if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
    if (event.target instanceof HTMLElement && (event.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName))) return;
    const key = event.key.toUpperCase();
    if (state.game.keyset.includes(key)) {
      event.preventDefault();
      processGameKey(key);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      const exitButton = document.querySelector('[data-action="quit-game"]');
      exitButton?.click();
    }
  });
  window.addEventListener("hashchange", () => {
    void renderRoute();
  });
  async function initialize() {
    await Promise.all([refreshSession(), refreshMaps()]);
    if (state.user) {
      try {
        state.profile = await api("/profile");
      } catch (error) {
        console.warn("Could not load the KeyRush profile.", error);
      }
    }
    await renderRoute();
  }
  void initialize();
})();
