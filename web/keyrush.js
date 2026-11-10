const API = "/api/keyrush";
const ICON = "/compivox-icon.png";
const app = document.getElementById("app");
const toast = document.getElementById("toast");
const state = {
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
  renderToken: 0,
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
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  })[char]);
}

function formatNumber(value, digits = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("ko-KR", { maximumFractionDigits: digits }) : "0";
}

function formatDuration(ms) {
  return `${(Math.max(0, Number(ms) || 0) / 1000).toFixed(1)}s`;
}

function formatDate(timestamp) {
  const date = new Date(Number(timestamp) * 1000);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date)
    : "—";
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
      ...(options.body ? { "content-type": "application/json" } : {}),
      ...options.headers,
    },
  });
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(response.ok ? "서버 응답을 읽을 수 없어요." : `서버 오류가 발생했어요 (${response.status}).`);
  }
  if (!response.ok) {
    const messages = {
      login_required: "기록을 저장하려면 먼저 로그인해 주세요.",
      owner_required: "소유자 계정만 사용할 수 있는 기능이에요.",
      invalid_credentials: "아이디나 비밀번호를 확인해 주세요.",
      username_taken: "이미 사용 중인 아이디예요.",
      invalid_username: "아이디는 영문 소문자, 숫자, 밑줄로 3~20자 입력해 주세요.",
      invalid_nickname: "닉네임은 2~20자로 입력해 주세요.",
      invalid_password: "비밀번호는 10자 이상으로 입력해 주세요.",
      owner_already_claimed: "소유자 계정 등록이 이미 완료되었어요.",
      pattern_incomplete: "맵 패턴을 끝까지 입력하지 못했어요.",
      map_not_found: "맵을 찾을 수 없거나 비공개 상태예요.",
      rate_limited: "요청이 잠시 많아요. 조금 뒤에 다시 시도해 주세요.",
      run_expired: "플레이 시간이 만료되었어요. 맵에서 다시 시작해 주세요.",
      run_already_finished: "이미 제출된 플레이 기록이에요.",
    };
    throw new Error(messages[body?.error] ?? `요청을 완료하지 못했어요 (${body?.error ?? response.status}).`);
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
  return `<a class="brand" href="#/" aria-label="Compivox KeyRush 홈"><span class="brand-mark"><img src="${ICON}" alt=""></span><span>COMPIVOX <span style="color:var(--accent-bright)">KEYRUSH</span></span></a>`;
}

function header(active = "") {
  return `<header class="topbar">
    ${brand()}
    <nav class="nav" aria-label="주요 메뉴">
      <a href="#/maps" ${active === "maps" ? 'aria-current="page"' : ""}>맵</a>
      <a href="#/rankings" ${active === "rankings" ? 'aria-current="page"' : ""}>랭킹</a>
      ${state.user ? `<a href="#/profile" ${active === "profile" ? 'aria-current="page"' : ""}>프로필</a>` : ""}
      ${state.user?.role === "owner" ? `<a href="#/admin" ${active === "admin" ? 'aria-current="page"' : ""}>관리</a>` : ""}
      <a href="#/settings" ${active === "settings" ? 'aria-current="page"' : ""}>설정</a>
    </nav>
    <div class="top-actions">${state.user
      ? `<a class="user-chip" href="#/profile" title="${esc(state.user.username)}">${esc(state.user.nickname)}</a><button class="btn btn-quiet btn-sm" data-action="logout">로그아웃</button>`
      : `<a class="btn btn-secondary btn-sm" href="#/account">로그인</a>`}
    </div>
  </header>`;
}

function shell(content, active = "") {
  return `<div class="shell">${header(active)}<main class="wrap">${content}</main>
    <footer class="site-footer">
      ${brand()}
      <p>짧은 한 판으로 만드는 나만의 키 리듬.</p>
      <nav class="footer-links" aria-label="안내">
        <a href="/faq">자주 묻는 질문</a>
        <a href="/service-information">서비스 안내</a>
        <a href="/terms">이용약관</a>
        <a href="/privacy">개인정보 처리방침</a>
      </nav>
      <span class="footer-copy">© ${new Date().getFullYear()} COMPIVOX</span>
    </footer>
  </div>`;
}

function mapCard(map, editable = false) {
  const difficulty = { easy: "EASY", normal: "NORMAL", hard: "HARD", expert: "EXPERT" }[map.difficulty] ?? map.difficulty;
  return `<article class="map-card">
    <div class="map-card-top"><span class="difficulty">${difficulty}</span>${editable ? `<span class="difficulty">${map.published ? "PUBLISHED" : "DRAFT"}</span>` : ""}</div>
    <h3>${esc(map.title)}</h3>
    <p>${esc(map.description)}</p>
    <div class="map-meta"><span>${map.bpm} BPM</span><span>${map.pattern.length} keys</span><span>${map.keyset}</span></div>
    <a class="btn btn-secondary btn-sm" style="margin-top:14px" href="#/${editable ? "editor" : "map"}/${encodeURIComponent(map.id)}">${editable ? "맵 편집" : "맵 확인"}</a>
  </article>`;
}

function renderHome() {
  const featured = state.maps.slice(0, 3);
  const content = `<section class="hero">
      <div class="hero-copy"><span class="eyebrow">COMPIVOX · SINGLE PLAYER RHYTHM</span>
        <h1>Find your<br><span>key rhythm.</span></h1>
        <p>공식 맵을 플레이하며 속도와 정확도를 함께 키워요. 키보드와 터치, 각 입력 방식에 맞는 랭킹에서 기록을 경쟁할 수 있어요.</p>
        <div class="hero-actions"><a class="btn btn-primary" href="#/maps">플레이 시작 <span aria-hidden="true">→</span></a><a class="btn btn-secondary" href="#/rankings">랭킹 보기</a></div>
      </div>
      <div class="hero-art" aria-hidden="true"><div class="hero-key">K</div></div>
    </section>
    <section class="home-path" aria-labelledby="homePathTitle">
      <div class="home-section-head">
        <span class="eyebrow">YOUR NEXT ROUND</span>
        <h2 id="homePathTitle">시작은 간단하게, 기록은 확실하게</h2>
        <p>맵 도전부터 랭킹 확인까지 한 흐름으로 이어져요.</p>
      </div>
      <div class="path-grid">
        <article class="path-card"><span class="path-number">01</span><div><h3>맵 고르기</h3><p>패턴과 BPM을 확인하고 오늘의 도전을 선택해요.</p></div></article>
        <article class="path-card"><span class="path-number">02</span><div><h3>리듬에 맞춰 입력</h3><p>키보드 또는 터치로 화면에 나오는 키를 입력해요.</p></div></article>
        <article class="path-card"><span class="path-number">03</span><div><h3>기록 확인하기</h3><p>완료한 플레이는 검증 후 개인 기록과 랭킹에 반영돼요.</p></div></article>
      </div>
    </section>
    <section class="home-modes" aria-label="플레이 방식">
      <a class="mode-card" href="#/maps" data-action="set-mode" data-mode="keyboard">
        <span class="mode-icon" aria-hidden="true">⌨</span>
        <span><strong>Keyboard</strong><small>빠른 입력과 정확도를 겨뤄요</small></span>
        <span class="mode-arrow" aria-hidden="true">↗</span>
      </a>
      <a class="mode-card" href="#/maps" data-action="set-mode" data-mode="touch">
        <span class="mode-icon touch-icon" aria-hidden="true">●</span>
        <span><strong>Touch</strong><small>모바일에서도 바로 플레이해요</small></span>
        <span class="mode-arrow" aria-hidden="true">↗</span>
      </a>
    </section>
    <section class="hero-stats" aria-label="내 KeyRush 기록">
      <div class="stat"><div class="stat-label">공식 맵</div><div class="stat-value">${state.maps.length}</div></div>
      <div class="stat"><div class="stat-label">내 플레이</div><div class="stat-value">${state.profile ? formatNumber(state.profile.stats.plays) : "—"}</div></div>
      <div class="stat"><div class="stat-label">개인 최고 점수</div><div class="stat-value">${state.profile ? formatNumber(state.profile.stats.bestScore) : "—"}</div></div>
    </section>
    ${state.mapError ? `<div class="notice error">${esc(state.mapError)} · 서버 연결을 확인한 뒤 새로고침해 주세요.</div>` : ""}
    ${state.sessionError ? `<div class="notice error">${esc(state.sessionError)} · 계정 상태를 확인하지 못했어요.</div>` : ""}
    <div class="section-head"><div><span class="eyebrow">OFFICIAL MAPS</span><h2>오늘의 리듬을 골라요</h2><p>기록은 실제 완료한 플레이에서만 저장돼요.</p></div><a class="text-link" href="#/maps">모든 맵 보기 →</a></div>
    ${featured.length ? `<div class="map-grid">${featured.map((map) => mapCard(map)).join("")}</div>` : `<div class="panel empty">공개된 맵이 아직 없어요.</div>`}`;
  app.innerHTML = shell(content);
}

function renderMaps() {
  app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">OFFICIAL MAPS</span><h1 class="page-title">맵 선택</h1><p class="page-lead">각 맵의 패턴과 난이도를 확인하고 원하는 입력 방식으로 플레이해요.</p></div><div class="mode-switch" aria-label="입력 방식"><button data-action="set-mode" data-mode="keyboard" class="${state.preferredMode === "keyboard" ? "active" : ""}">Keyboard</button><button data-action="set-mode" data-mode="touch" class="${state.preferredMode === "touch" ? "active" : ""}">Touch</button></div></div>
    ${state.maps.length ? `<div class="map-grid">${state.maps.map((map) => mapCard(map)).join("")}</div>` : `<div class="panel empty">${state.mapError ? esc(state.mapError) : "공식 맵을 불러오고 있어요."}</div>`}`, "maps");
}

function renderMap(id) {
  const map = state.maps.find((item) => item.id === id);
  if (!map) {
    app.innerHTML = shell(`<div class="panel empty">${esc(state.mapError || "맵 정보를 불러오고 있어요.")} <a class="text-link" href="#/maps">맵 목록으로 돌아가기</a></div>`, "maps");
    return;
  }
  app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">${esc(map.difficulty)} · OFFICIAL MAP</span><h1 class="page-title">${esc(map.title)}</h1><p class="page-lead">${esc(map.description)}</p></div><a class="btn btn-quiet btn-sm" href="#/maps">← 맵 목록</a></div>
    <section class="panel panel-pad">
      <div class="hero-stats" style="margin-top:0"><div class="stat"><div class="stat-label">난이도</div><div class="stat-value">${esc(map.difficulty.toUpperCase())}</div></div><div class="stat"><div class="stat-label">템포</div><div class="stat-value">${map.bpm} BPM</div></div><div class="stat"><div class="stat-label">패턴 길이</div><div class="stat-value">${map.pattern.length} keys</div></div></div>
      <p class="notice">사용 키: <strong>${esc([...map.keyset].join(" · "))}</strong><br>랭킹 기록을 남기려면 계정으로 로그인해 주세요. 키보드와 터치 랭킹은 따로 집계돼요.</p>
      <div class="hero-actions"><button class="btn btn-primary" data-action="play-map" data-id="${esc(map.id)}" data-mode="keyboard">⌨ 키보드로 플레이</button><button class="btn btn-secondary" data-action="play-map" data-id="${esc(map.id)}" data-mode="touch">터치로 플레이</button><a class="btn btn-quiet" href="#/rankings?map=${encodeURIComponent(map.id)}">이 맵 랭킹</a></div>
    </section>`, "maps");
}

function renderAccount() {
  const register = state.authMode === "register";
  app.innerHTML = shell(`<div class="auth-wrap"><section class="panel panel-pad auth-card">
    <span class="eyebrow">PLAYER ACCOUNT</span><h1 class="page-title" style="font-size:30px">${register ? "기록을 저장해요" : "다시 만나서 반가워요"}</h1>
    <p class="page-lead">계정은 플레이 기록과 입력 방식별 랭킹을 저장하는 데 사용돼요.</p>
    <div class="auth-switch"><button class="${!register ? "active" : ""}" data-action="auth-mode" data-mode="login">로그인</button><button class="${register ? "active" : ""}" data-action="auth-mode" data-mode="register">계정 만들기</button></div>
    <form data-form="account" data-mode="${register ? "register" : "login"}" class="field-grid">
      <div class="field full"><label for="username">아이디</label><input class="input" id="username" name="username" autocomplete="username" minlength="3" maxlength="20" required></div>
      ${register ? `<div class="field full"><label for="nickname">닉네임</label><input class="input" id="nickname" name="nickname" maxlength="20" required></div>` : ""}
      <div class="field full"><label for="password">비밀번호</label><input class="input" id="password" name="password" type="password" autocomplete="${register ? "new-password" : "current-password"}" minlength="${register ? 10 : 1}" maxlength="128" required>${register ? `<p class="field-hint">10자 이상으로 설정해 주세요.</p>` : ""}</div>
      ${register ? `<div class="field full"><label for="owner-claim">소유자 등록 코드 <span style="color:var(--muted)">(선택)</span></label><input class="input" id="owner-claim" name="ownerClaim" type="password" autocomplete="off"><p class="field-hint">일반 가입에는 필요하지 않아요. 서버에 설정된 1회용 코드가 있어야 소유자 권한을 받을 수 있어요.</p></div>` : ""}
      <div class="field full"><button class="btn btn-primary" style="width:100%" type="submit">${register ? "계정 만들기" : "로그인"}</button></div>
    </form>
    ${state.apiError ? `<div class="notice error">${esc(state.apiError)}</div>` : ""}
    <p class="field-hint">비밀번호는 브라우저 밖으로 전송되어 서버에서 보호된 방식으로 처리돼요.</p>
  </section></div>`);
}

function renderRankings() {
  const mapOptions = `<option value="">전체 맵 종합 랭킹</option>${state.maps.map((map) => `<option value="${esc(map.id)}" ${state.rankingMap === map.id ? "selected" : ""}>${esc(map.title)}</option>`).join("")}`;
  const rows = state.rankings.map((item, index) => `<tr><td class="rank-number">${index + 1}</td><td><a class="rank-name" href="#/profiles/${encodeURIComponent(item.username)}">${esc(item.nickname)}</a><div class="field-hint">@${esc(item.username)}</div></td><td>${formatNumber(item.score)}</td><td>${formatNumber(item.accuracy, 2)}%</td><td>${formatNumber(item.wpm, 1)}</td><td>${item.mode === "touch" ? "Touch" : "Keyboard"}</td><td>${formatDate(item.created_at)}</td></tr>`).join("");
  app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">REAL PLAYER RECORDS</span><h1 class="page-title">랭킹</h1><p class="page-lead">저장된 완료 기록만 표시해요. 점수는 입력 이벤트를 서버에서 검증해 계산해요.</p></div><div class="mode-switch"><button data-action="rank-mode" data-mode="keyboard" class="${state.rankingMode === "keyboard" ? "active" : ""}">Keyboard</button><button data-action="rank-mode" data-mode="touch" class="${state.rankingMode === "touch" ? "active" : ""}">Touch</button></div></div>
    <section class="panel panel-pad">
      ${state.apiError ? `<div class="notice error">${esc(state.apiError)}</div>` : ""}
      <div class="field" style="max-width:320px;margin-bottom:15px"><label for="ranking-map">랭킹 범위</label><select class="select" id="ranking-map" data-change="ranking-map">${mapOptions}</select></div>
      <div class="ranking-scroll"><table class="ranking-table"><thead><tr><th>순위</th><th>플레이어</th><th>점수</th><th>정확도</th><th>WPM</th><th>입력</th><th>기록일</th></tr></thead><tbody>${rows || `<tr><td colspan="7"><div class="empty">아직 저장된 기록이 없어요. 먼저 맵을 플레이해 보세요.</div></td></tr>`}</tbody></table></div>
    </section>`, "rankings");
}

function renderProfile() {
  const profile = state.profile;
  if (!profile) {
    app.innerHTML = shell(`<div class="panel empty">${state.apiError ? esc(state.apiError) : "프로필을 불러오고 있어요."}</div>`, "profile");
    return;
  }
  const { user, stats, maps } = profile;
  const ranks = profile.ranks ?? {};
  app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">PLAYER PROFILE</span><h1 class="page-title">${esc(user.nickname)}</h1><p class="page-lead">@${esc(user.username)} · ${user.role === "owner" ? "맵 제작자" : "KeyRush 플레이어"}</p></div></div>
    <div class="hero-stats" style="grid-template-columns:repeat(auto-fit,minmax(135px,1fr));margin:0 0 20px">
      <div class="stat"><div class="stat-label">완료 플레이</div><div class="stat-value">${formatNumber(stats.plays)}</div></div>
      <div class="stat"><div class="stat-label">최고 점수</div><div class="stat-value">${formatNumber(stats.bestScore)}</div></div>
      <div class="stat"><div class="stat-label">평균 정확도</div><div class="stat-value">${formatNumber(stats.averageAccuracy, 1)}%</div></div>
      <div class="stat"><div class="stat-label">Keyboard 종합 순위</div><div class="stat-value">${ranks.keyboard ? `#${formatNumber(ranks.keyboard)}` : "—"}</div></div>
      <div class="stat"><div class="stat-label">Touch 종합 순위</div><div class="stat-value">${ranks.touch ? `#${formatNumber(ranks.touch)}` : "—"}</div></div>
    </div>
    <section class="panel panel-pad"><div class="section-head" style="margin:0 0 12px"><div><span class="eyebrow">PERSONAL BEST</span><h2>맵별 최고 기록</h2></div></div>
      ${maps.length ? `<div class="ranking-scroll"><table class="ranking-table"><thead><tr><th>맵</th><th>점수</th><th>정확도</th><th>WPM</th><th>입력</th><th>기록일</th></tr></thead><tbody>${maps.map((item) => `<tr><td class="rank-name">${esc(item.title)}</td><td>${formatNumber(item.score)}</td><td>${formatNumber(item.accuracy, 2)}%</td><td>${formatNumber(item.wpm, 1)}</td><td>${item.mode === "touch" ? "Touch" : "Keyboard"}</td><td>${formatDate(item.created_at)}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty">아직 개인 기록이 없어요. 맵을 완료하면 여기서 확인할 수 있어요.</div>`}
    </section>`, "profile");
}

function renderPublicProfile() {
  if (!state.profile) {
    app.innerHTML = shell(`<div class="panel empty">${state.apiError ? esc(state.apiError) : "프로필을 불러오고 있어요."}</div>`);
    return;
  }
  renderProfile();
}

function renderSettings() {
  app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">PREFERENCES</span><h1 class="page-title">설정</h1><p class="page-lead">기기별 플레이 환경을 조정해요.</p></div></div>
    <section class="panel panel-pad">
      <div class="field-grid">
        <div class="field"><label for="preferred-mode">기본 입력 방식</label><select id="preferred-mode" class="select"><option value="keyboard" ${state.preferredMode === "keyboard" ? "selected" : ""}>Keyboard</option><option value="touch" ${state.preferredMode === "touch" ? "selected" : ""}>Touch</option></select></div>
        <div class="field"><label for="sound-setting">입력음</label><select id="sound-setting" class="select"><option value="off" ${!state.settings.sound ? "selected" : ""}>꺼짐</option><option value="on" ${state.settings.sound ? "selected" : ""}>켜짐</option></select></div>
        <div class="field full"><label><input id="hints-setting" type="checkbox" ${state.settings.hints ? "checked" : ""}> 다음 입력 힌트를 표시해요</label><p class="field-hint">설정은 이 브라우저에 저장돼요. 플레이 기록과 랭킹은 서버 계정에 저장돼요.</p></div>
      </div>
      <div class="form-actions"><button class="btn btn-primary" data-action="save-settings">설정 저장</button></div>
    </section>`, "settings");
}

function renderAdmin() {
  if (state.user?.role !== "owner") {
    app.innerHTML = shell(`<div class="panel empty">맵 관리 페이지는 소유자 계정만 이용할 수 있어요.</div>`, "admin");
    return;
  }
  const rows = state.adminMaps.map((map) => `<article class="admin-map-row"><div><h3>${esc(map.title)}</h3><p>${esc(map.id)} · ${map.pattern.length} keys · ${map.bpm} BPM · ${map.published ? "공개" : "비공개"}</p></div><div class="admin-actions"><button class="btn btn-secondary btn-sm" data-action="test-map" data-id="${esc(map.id)}">테스트</button><a class="btn btn-secondary btn-sm" href="#/editor/${encodeURIComponent(map.id)}">편집</a><button class="btn btn-quiet btn-sm" data-action="publish-map" data-id="${esc(map.id)}" data-published="${map.published ? "true" : "false"}">${map.published ? "비공개" : "공개"}</button><button class="btn btn-danger btn-sm" data-action="delete-map" data-id="${esc(map.id)}">삭제</button></div></article>`).join("");
  app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">OWNER ONLY</span><h1 class="page-title">맵 관리</h1><p class="page-lead">공식 맵을 제작·수정하고 공개 여부를 관리해요. 권한은 서버에서 확인돼요.</p></div><a class="btn btn-primary" href="#/editor/new">새 맵 만들기</a></div>
    ${state.apiError ? `<div class="notice error">${esc(state.apiError)}</div>` : ""}
    <section class="admin-map-list">${rows || `<div class="panel empty">맵 목록이 비어 있어요.</div>`}</section>`, "admin");
}

function renderEditor(id) {
  if (state.user?.role !== "owner") {
    app.innerHTML = shell(`<div class="panel empty">맵 편집은 소유자 계정만 이용할 수 있어요.</div>`);
    return;
  }
  const map = id === "new" ? {
    id: "", title: "", description: "", difficulty: "normal", bpm: 90, keyset: "ASDFJKL", pattern: "", published: false
  } : state.adminMaps.find((item) => item.id === id);
  if (!map) {
    app.innerHTML = shell(`<div class="panel empty">맵 정보를 불러오고 있어요.</div>`, "admin");
    return;
  }
  const chunks = [...map.pattern].slice(0, 64).map((key) => `<span>${esc(key)}</span>`).join("");
  app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">OWNER MAP EDITOR</span><h1 class="page-title">${id === "new" ? "새 공식 맵" : esc(map.title)}</h1><p class="page-lead">맵 패턴은 선택한 키로만 구성돼요. 공개된 버전만 모든 플레이어의 맵 목록과 랭킹에 나타나요.</p></div><a class="btn btn-quiet btn-sm" href="#/admin">← 맵 관리</a></div>
    ${state.editorError ? `<div class="notice error">${esc(state.editorError)}</div>` : ""}
    <form class="panel panel-pad" data-form="map-editor" data-id="${esc(id)}">
      <div class="field-grid">
        <div class="field"><label for="map-id">맵 ID</label><input class="input" id="map-id" name="id" value="${esc(map.id)}" pattern="[a-z0-9]+(-[a-z0-9]+)*" maxlength="48" ${id === "new" ? "required" : "readonly"}></div>
        <div class="field"><label for="map-title">맵 이름</label><input class="input" id="map-title" name="title" value="${esc(map.title)}" maxlength="60" required></div>
        <div class="field full"><label for="map-description">설명</label><textarea class="textarea" id="map-description" name="description" maxlength="300">${esc(map.description)}</textarea></div>
        <div class="field"><label for="map-difficulty">난이도</label><select class="select" id="map-difficulty" name="difficulty"><option value="easy" ${map.difficulty === "easy" ? "selected" : ""}>Easy</option><option value="normal" ${map.difficulty === "normal" ? "selected" : ""}>Normal</option><option value="hard" ${map.difficulty === "hard" ? "selected" : ""}>Hard</option><option value="expert" ${map.difficulty === "expert" ? "selected" : ""}>Expert</option></select></div>
        <div class="field"><label for="map-bpm">BPM</label><input class="input" id="map-bpm" name="bpm" type="number" min="30" max="240" value="${map.bpm}" required></div>
        <div class="field"><label for="map-keyset">사용 키 (중복 없이 3~12개)</label><input class="input" id="map-keyset" name="keyset" value="${esc(map.keyset)}" minlength="3" maxlength="12" pattern="[A-Za-z]{3,12}" required></div>
        <div class="field full"><label for="map-pattern">키 입력 패턴 (8~240자)</label><textarea class="textarea" id="map-pattern" name="pattern" minlength="8" maxlength="240" required>${esc(map.pattern)}</textarea><p class="field-hint">사용 키셋에 포함된 알파벳만 입력해요. 공백은 패턴에서 제외돼요.</p><div class="pattern-preview" data-pattern-preview>${chunks || `<span>패턴 미리보기</span>`}</div></div>
        <div class="field full"><label><input type="checkbox" name="published" ${map.published ? "checked" : ""}> 저장 후 공개해요</label></div>
      </div>
      <div class="form-actions"><button class="btn btn-secondary" type="button" data-action="test-editor" data-id="${esc(id)}">테스트 플레이</button><button class="btn btn-primary" type="submit">맵 저장</button></div>
    </form>`, "admin");
}

function renderGame() {
  const game = state.game;
  if (!game) {
    go("maps");
    return;
  }
  const sequence = renderSequence(game);
  const touchKeys = game.mode === "touch"
    ? `<div class="virtual-keyboard" aria-label="가상 키보드">${[...game.keyset].map((key) => `<button class="virtual-key" type="button" data-virtual-key="${esc(key)}" aria-label="${esc(key)}">${esc(key)}</button>`).join("")}</div>`
    : "";
  app.innerHTML = `<main class="game-wrap">
    <div class="game-top"><div><span class="eyebrow">${game.testOnly ? "OWNER TEST PLAY" : game.mode === "touch" ? "TOUCH RANKING" : "KEYBOARD RANKING"}</span><h1>${esc(game.map.title)}</h1></div><button class="btn btn-quiet btn-sm" data-action="quit-game">나가기</button></div>
    <div class="game-hud">
      <div class="hud-item"><div class="hud-label">점수</div><div class="hud-value" data-hud="score">0</div></div>
      <div class="hud-item"><div class="hud-label">정확도</div><div class="hud-value" data-hud="accuracy">—</div></div>
      <div class="hud-item"><div class="hud-label">콤보</div><div class="hud-value" data-hud="combo">0</div></div>
      <div class="hud-item"><div class="hud-label">경과 시간</div><div class="hud-value" data-hud="time">0.0s</div></div>
    </div>
    <section class="panel play-panel" aria-live="polite">
      ${game.phase === "countdown" ? `<div><div class="eyebrow">GET READY</div><div class="countdown" data-countdown>${game.countdown}</div><div class="target-label">잠시 후 시작해요</div></div>` : game.phase === "failed" ? `<div><div class="eyebrow">SAVE FAILED</div><div class="target-char" style="font-size:38px">기록을 저장하지 못했어요</div><p class="page-lead">${esc(game.error)}</p><button class="btn btn-primary" data-action="retry-finish">다시 제출</button></div>` : game.phase === "finished" ? `<div><div class="eyebrow">COMPLETE</div><div class="target-char" style="font-size:38px">플레이 완료</div></div>` : `<div class="play-core"><div class="target-label">TYPE THE NEXT KEY</div><div class="target-char" data-target>${esc(game.pattern[game.index] ?? "✓")}</div><div class="sequence-preview" data-sequence>${sequence}</div><div class="game-progress"><span data-progress style="width:${(game.index / game.pattern.length) * 100}%"></span></div><p class="game-hint">${state.settings.hints ? "화면에 나온 키를 입력해요. 틀린 입력은 기록에 반영돼요." : "화면의 키를 입력해요."}</p></div>`}
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
  const accuracy = game.events.length
    ? (game.index / game.events.length) * 100
    : 100;
  const target = document.querySelector("[data-target]");
  const progress = document.querySelector("[data-progress]");
  const sequence = document.querySelector("[data-sequence]");
  const score = document.querySelector('[data-hud="score"]');
  const accuracyNode = document.querySelector('[data-hud="accuracy"]');
  const combo = document.querySelector('[data-hud="combo"]');
  const status = document.querySelector("[data-game-status]");
  if (target) {
    target.textContent = game.pattern[game.index] ?? "✓";
    target.classList.toggle("miss", missed);
    if (missed) setTimeout(() => target.classList.remove("miss"), 220);
  }
  if (progress) progress.style.width = `${(game.index / game.pattern.length) * 100}%`;
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
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.075);
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
    game.status = `다음 키는 ${game.pattern[game.index]}예요.`;
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
  game.status = "기록을 검증하고 있어요…";
  const button = document.querySelector("[data-virtual-key]");
  if (button) {
    const keyboard = document.querySelector(".virtual-keyboard");
    if (keyboard) keyboard.remove();
  }
  const status = document.querySelector("[data-game-status]");
  if (status) status.textContent = game.status;
  try {
    const before = state.profile?.maps?.find((item) =>
      (item.map_id ?? item.mapId) === game.map.id && item.mode === game.mode,
    );
    const result = await api(`/runs/${encodeURIComponent(game.runId)}/finish`, {
      method: "POST",
      body: JSON.stringify({ events: game.events }),
    });
    state.result = { ...result, previousBest: Number(before?.score ?? 0) };
    game.phase = "finished";
    const requests = [
      api(`/ghost?mapId=${encodeURIComponent(game.map.id)}&mode=${encodeURIComponent(game.mode)}`)
        .then((response) => { state.ghost = response.ghost; })
        .catch((error) => { state.ghost = null; console.warn("Could not load KeyRush ghost replay.", error); }),
    ];
    if (state.user && !game.testOnly) {
      requests.push(api("/profile").then((response) => { state.profile = response; })
        .catch((error) => console.warn("Could not refresh KeyRush profile.", error)));
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
    const position = Math.min(100, Math.max(0, (Number(event.atMs) / duration) * 100));
    return `<i class="ghost-mark ${event.correct === false ? "missed" : ""}" style="left:${position}%" title="${esc(event.key)} · ${formatDuration(event.atMs)}"></i>`;
  }).join("");
}

function renderResult() {
  const result = state.result;
  const game = state.game;
  if (!result || !game) {
    app.innerHTML = shell(`<div class="panel empty">완료된 플레이 결과가 없어요. <a class="text-link" href="#/maps">맵으로 이동</a></div>`);
    return;
  }
  const newRecord = !game.testOnly && result.score > result.previousBest;
  const ghostEvents = state.ghost?.events ?? [];
  const replayDuration = Math.max(1000,
    ...game.events.map((event) => Number(event.atMs) || 0),
    ...ghostEvents.map((event) => Number(event.atMs) || 0),
  );
  app.innerHTML = shell(`<div class="page-head"><div><span class="eyebrow">${game.testOnly ? "TEST PLAY · NOT SAVED" : "PLAY COMPLETE"}</span><h1 class="page-title ${newRecord ? "new-record" : ""}">${game.testOnly ? "테스트 완료" : newRecord ? "새로운 개인 기록!" : "플레이 완료"}</h1><p class="page-lead">${esc(game.map.title)} · ${game.mode === "touch" ? "Touch Ranking" : "Keyboard Ranking"}${game.testOnly ? " · 테스트 결과는 랭킹에 저장되지 않아요." : ""}</p></div><a class="btn btn-quiet btn-sm" href="#/maps">맵 목록</a></div>
    <section class="panel panel-pad">
      <div class="result-grid">
        <div class="result-stat"><span>점수</span><strong>${formatNumber(result.score)}</strong></div>
        <div class="result-stat"><span>정확도</span><strong>${formatNumber(result.accuracy, 2)}%</strong></div>
        <div class="result-stat"><span>평균 속도</span><strong>${formatNumber(result.wpm, 1)} <small style="font-size:12px">WPM</small></strong></div>
        <div class="result-stat"><span>최고 콤보</span><strong>${formatNumber(result.maxCombo)}</strong></div>
      </div>
      <p class="notice">완료 시간 ${formatDuration(result.elapsedMs)} · ${result.testOnly ? "이 플레이는 저장되지 않았어요." : "점수는 서버에서 입력 기록을 검증해 계산했어요."}</p>
      ${game.testOnly ? "" : `<div class="section-head" style="margin-top:27px"><div><span class="eyebrow">GHOST REPLAY</span><h2>상위 기록과 플레이 타이밍 비교</h2><p>막대 위치는 각 기록에서 입력한 시점을 보여줘요.</p></div></div>
      ${state.ghost ? `<div class="ghost-lanes"><div class="ghost-lane ghost"><span>${esc(state.ghost.nickname)} · ${formatNumber(state.ghost.score)}</span><div class="ghost-track">${ghostMarks(ghostEvents, replayDuration)}<i class="ghost-playhead" data-playhead="ghost"></i></div></div><div class="ghost-lane"><span>나 · ${formatNumber(result.score)}</span><div class="ghost-track">${ghostMarks(game.events, replayDuration)}<i class="ghost-playhead" data-playhead="player"></i></div></div></div><div class="replay-controls"><button class="btn btn-secondary btn-sm" data-action="play-ghost">▶ 고스트 리플레이</button><span data-replay-status role="status">총 ${formatDuration(replayDuration)} · 입력 이벤트 ${game.events.length}개</span></div>` : `<div class="empty">이 입력 방식의 상위 기록이 아직 없어요. 내 기록이 첫 번째 고스트가 될 수 있어요.</div>`}`}
      <div class="hero-actions"><button class="btn btn-primary" data-action="${game.testOnly ? "test-map" : "play-again"}" data-id="${esc(game.map.id)}" data-mode="${esc(game.mode)}">${game.testOnly ? "다시 테스트" : "다시 플레이"}</button>${game.testOnly ? `<a class="btn btn-secondary" href="#/editor/${encodeURIComponent(game.map.id)}">맵 편집으로</a>` : `<a class="btn btn-secondary" href="#/rankings?map=${encodeURIComponent(game.map.id)}">맵 랭킹 보기</a>`}</div>
    </section>`);
}

function playGhostReplay() {
    const game = state.game;
    const ghostEvents = state.ghost?.events ?? [];
    if (!game || !ghostEvents.length) {
      showToast("재생할 고스트 기록이 아직 없어요.");
      return;
    }
    clearInterval(state.ghostTimer);
    const duration = Math.max(1000,
      ...game.events.map((event) => Number(event.atMs) || 0),
      ...ghostEvents.map((event) => Number(event.atMs) || 0),
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
      if (status) status.textContent = progress < 1
        ? `리플레이 재생 중 · ${formatDuration(progress * duration)} / ${formatDuration(duration)}`
        : `재생 완료 · ${game.events.length}개 입력을 비교했어요.`;
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
    published: data.has("published"),
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
    state.apiError = "랭킹 기록을 남기려면 계정으로 로그인해 주세요.";
    state.authMode = "login";
    go("account");
    return;
  }
  const map = [...state.maps, ...state.adminMaps].find((item) => item.id === mapId);
  if (!map) {
    showToast("맵 정보를 찾을 수 없어요.");
    go(testOnly ? "admin" : "maps");
    return;
  }
  try {
    const response = await api("/runs", {
      method: "POST",
      body: JSON.stringify({ mapId, mode, testOnly }),
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
      clock: 0,
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
        state.profile = route.page === "profiles" && route.id
          ? await api(`/profiles/${encodeURIComponent(decodeURIComponent(route.id))}`)
          : state.user ? await api("/profile") : null;
        if (!state.profile) {
          state.apiError = "프로필을 확인하려면 먼저 로그인해 주세요.";
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
    password: String(data.get("password") ?? ""),
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
    showToast(mode === "register" ? "계정을 만들었어요." : "로그인했어요.");
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
  preview.innerHTML = keys.length
    ? keys.map((key) => `<span>${esc(key)}</span>`).join("")
    : "<span>패턴 미리보기</span>";
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
        showToast("로그아웃했어요.");
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
      showToast("설정을 저장했어요.");
      break;
    case "publish-map":
      try {
        const published = button.dataset.published !== "true";
        await api(`/admin/maps/${encodeURIComponent(id)}/publish`, {
          method: "POST",
          body: JSON.stringify({ published }),
        });
        await loadAdminMaps();
        renderAdmin();
        showToast(published ? "맵을 공개했어요." : "맵을 비공개로 전환했어요.");
      } catch (error) {
        state.apiError = error.message;
        renderAdmin();
      }
      break;
    case "delete-map":
      if (!window.confirm("이 맵을 공개 목록에서 숨기고 이후 플레이를 막을까요? 기존 기록은 랭킹에서 제외돼요.")) break;
      try {
        await api(`/admin/maps/${encodeURIComponent(id)}/delete`, { method: "POST", body: "{}" });
        await loadAdminMaps();
        await refreshMaps();
        renderAdmin();
        showToast("맵을 삭제했어요.");
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
        showToast("맵을 저장했어요. 테스트를 시작해요.");
        await startGame(map.id, state.preferredMode, true);
      } catch (error) {
        state.editorError = error.message;
        renderEditor(form.dataset.id);
      }
      break;
    }
    case "quit-game":
      if (state.game && state.game.phase === "playing" &&
        !window.confirm("지금 나가면 이번 플레이 기록은 저장되지 않아요. 나갈까요?")) break;
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
      showToast("공식 맵을 저장했어요.");
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
  if (event.target instanceof HTMLElement &&
    (event.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName))) return;
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

window.addEventListener("hashchange", () => { void renderRoute(); });

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
