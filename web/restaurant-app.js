import QRCode from "qrcode";

const STORAGE_KEY = "compivox-kitchen-demo-v1";
const STAFF_ID = "staff";
const STAFF_PASSWORD = "compivox-demo";
const ICON_SRC = "/compivox-icon.png";
const STATUS = {
  received: { label: "주문 접수", short: "접수", tone: "neutral" },
  queued: { label: "조리 대기", short: "대기", tone: "warn" },
  preparing: { label: "조리 중", short: "조리 중", tone: "warn" },
  ready: { label: "준비 완료", short: "준비 완료", tone: "good" },
  delivered: { label: "전달 완료", short: "전달 완료", tone: "neutral" },
  canceled: { label: "주문 취소", short: "취소", tone: "bad" }
};
const FLOW = ["received", "queued", "preparing", "ready", "delivered"];
const NAV_ITEMS = [
  ["dashboard", "대시보드"],
  ["orders", "주문 관리"],
  ["tables", "테이블 관리"],
  ["tags", "NFC 태그"],
  ["settings", "식당 설정"]
];

const app = document.getElementById("app");
const toastEl = document.getElementById("toast");
let data = loadData();
let routeFilter = "all";
let customerError = "";
let modalAction = null;
let toastTimer;

function uid(prefix) {
  const value = globalThis.crypto?.randomUUID?.().replaceAll("-", "").slice(0, 14)
    ?? Math.random().toString(36).slice(2, 16);
  return `${prefix}-${value}`;
}

function seedData() {
  const now = Date.now();
  return {
    restaurant: { name: "오후식당", notice: "음식이 준비되면 이 페이지에서 알려드릴게요." },
    authenticated: false,
    tables: [
      { id: "table-01", number: "01", closed: false },
      { id: "table-02", number: "02", closed: false },
      { id: "table-03", number: "03", closed: false },
      { id: "table-04", number: "04", closed: false }
    ],
    tags: [
      { id: "tag-01", token: "cvx-table-01-demo", tableId: "table-01", active: true, createdAt: new Date(now - 86400000 * 4).toISOString() },
      { id: "tag-02", token: "cvx-table-02-demo", tableId: "table-02", active: true, createdAt: new Date(now - 86400000 * 3).toISOString() },
      { id: "tag-03", token: "cvx-table-03-demo", tableId: "table-03", active: true, createdAt: new Date(now - 86400000 * 2).toISOString() }
    ],
    orders: [
      { id: "order-204", orderNo: "CV-204", tableId: "table-01", items: [{ name: "트러플 크림 파스타", quantity: 1 }, { name: "레몬 에이드", quantity: 1 }], status: "preparing", expectedMinutes: 8, expectedAt: new Date(now + 8 * 60000).toISOString(), createdAt: new Date(now - 9 * 60000).toISOString(), updatedAt: new Date(now - 1 * 60000).toISOString() },
      { id: "order-205", orderNo: "CV-205", tableId: "table-01", items: [{ name: "버섯 리조또", quantity: 2 }], status: "queued", expectedMinutes: 14, expectedAt: new Date(now + 14 * 60000).toISOString(), createdAt: new Date(now - 3 * 60000).toISOString(), updatedAt: new Date(now - 2 * 60000).toISOString() },
      { id: "order-206", orderNo: "CV-206", tableId: "table-02", items: [{ name: "바질 토마토 파스타", quantity: 1 }], status: "ready", expectedMinutes: 0, expectedAt: null, createdAt: new Date(now - 17 * 60000).toISOString(), updatedAt: new Date(now - 2 * 60000).toISOString() },
      { id: "order-207", orderNo: "CV-207", tableId: "table-03", items: [{ name: "오늘의 수프", quantity: 1 }, { name: "사워도우", quantity: 1 }], status: "received", expectedMinutes: 12, expectedAt: new Date(now + 12 * 60000).toISOString(), createdAt: new Date(now - 1 * 60000).toISOString(), updatedAt: new Date(now - 1 * 60000).toISOString() },
      { id: "order-198", orderNo: "CV-198", tableId: "table-04", items: [{ name: "그릴드 치킨 플레이트", quantity: 1 }], status: "delivered", expectedMinutes: 0, expectedAt: null, createdAt: new Date(now - 3600000).toISOString(), updatedAt: new Date(now - 2800000).toISOString() }
    ]
  };
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.orders) && Array.isArray(parsed.tables) && Array.isArray(parsed.tags)) return parsed;
    }
  } catch (error) {
    console.warn("Could not load local demo data.", error);
  }
  const initial = seedData();
  persist(initial);
  return initial;
}

function persist(next = data) {
  data = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Could not save local demo data.", error);
    showToast("이 브라우저에 데모 데이터를 저장하지 못했습니다.");
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  })[char]);
}

function formatTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: true }).format(date);
}

function relativeTime(value) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  return minutes < 1 ? "방금 업데이트했어요" : `${minutes}분 전에 업데이트했어요`;
}

function tableById(id) {
  return data.tables.find((table) => table.id === id);
}

function tableNumber(id) {
  return tableById(id)?.number ?? "—";
}

function isActiveOrder(order) {
  return !["delivered", "canceled"].includes(order.status);
}

function currentOrders(tableId) {
  return data.orders.filter((order) => order.tableId === tableId && isActiveOrder(order));
}

function tableStatus(table) {
  if (table.closed) return { label: "이용 종료", tone: "neutral" };
  const orders = currentOrders(table.id);
  if (!orders.length) return { label: "이용 가능", tone: "neutral" };
  if (orders.some((order) => order.status === "ready")) return { label: "준비 완료", tone: "good" };
  return { label: "주문 진행 중", tone: "warn" };
}

function statusTag(status) {
  const item = STATUS[status] ?? STATUS.received;
  return `<span class="tag ${item.tone}">${item.label}</span>`;
}

function brand(extraClass = "") {
  return `<a class="brand ${extraClass}" href="/" aria-label="COMPIVOX 홈"><span class="brand-mark"><img src="${ICON_SRC}" alt=""></span><span>COMPIVOX</span></a>`;
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
}

function renderLanding() {
  const orders = data.orders.filter(isActiveOrder).slice(0, 3);
  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        ${brand()}
        <div class="topbar-right">
          <span class="demo-stamp">INTERACTIVE DEMO</span>
          <a class="topbar-link" href="#/staff/login">직원 로그인</a>
        </div>
      </header>
      <main class="landing">
        <section class="landing-copy">
          <span class="landing-kicker">RESTAURANT ORDER EXPERIENCE</span>
          <h1 class="landing-title">Kitchen,<br><span>in sync.</span></h1>
          <p class="landing-lead">NFC 태그를 한 번 터치하면 주문 상태와 예상 준비 시간을 바로 확인할 수 있어요. 앱 설치나 회원가입 없이 편하게 이용해 보세요.</p>
          <div class="landing-actions">
            <a class="btn btn-primary" href="?tag=cvx-table-01-demo">고객 화면 미리보기 <span aria-hidden="true">↗</span></a>
            <a class="btn btn-secondary" href="#/staff/login">직원 관리 화면 <span aria-hidden="true">→</span></a>
          </div>
          <div class="landing-meta"><span><strong>01</strong> NFC 접속</span><span><strong>02</strong> 주문번호 확인</span><span><strong>03</strong> 실시간 상태</span></div>
        </section>
        <aside class="demo-preview" aria-label="주문 현황 미리보기">
          <div class="preview-head"><div><div class="eyebrow">LIVE KITCHEN</div><div class="panel-title" style="margin-top:7px">${escapeHtml(data.restaurant.name)}</div></div><span class="demo-stamp">DEMO DATA</span></div>
          <div class="preview-orders">${orders.map((order, index) => `
            <a class="preview-order" href="?tag=${encodeURIComponent(data.tags.find((tag) => tag.tableId === order.tableId)?.token ?? "")}&order=${encodeURIComponent(order.orderNo)}">
              <span class="preview-index">${String(index + 1).padStart(2, "0")}</span>
              <span class="preview-order-main"><span class="preview-order-name">${escapeHtml(order.items.map((item) => item.name).join(" · "))}</span><span class="preview-order-sub">T${escapeHtml(tableNumber(order.tableId))} · ${escapeHtml(STATUS[order.status].label)}</span></span>
              <span class="preview-eta">${order.status === "ready" ? "완료" : `${Math.max(1, Math.ceil((new Date(order.expectedAt ?? Date.now()).getTime() - Date.now()) / 60000))}분`}</span>
            </a>`).join("")}</div>
          <div class="preview-bottom"><span>모든 상태는 데모 브라우저에서 동기화됩니다</span><span class="preview-bars"><i class="active"></i><i class="active"></i><i></i><i></i></span></div>
        </aside>
      </main>
      <footer class="customer-footer">COMPIVOX · A calmer way to wait. &nbsp;·&nbsp; 화면과 주문은 테스트 데이터로 보여드리고 있어요.</footer>
    </div>`;
}

function renderCustomer() {
  const params = new URLSearchParams(location.search);
  const token = params.get("tag") ?? "";
  const tag = data.tags.find((item) => item.token === token && item.active);
  const table = tag ? tableById(tag.tableId) : null;
  const orderNo = params.get("order")?.trim().toUpperCase() ?? "";
  const order = orderNo ? data.orders.find((item) => item.orderNo.toUpperCase() === orderNo && item.tableId === table?.id) : null;

  if (!token || !table) {
    app.innerHTML = customerShell(`<section class="panel customer-empty"><span class="demo-stamp">DEMO EXPERIENCE</span><h2 style="margin-top:17px">테이블 NFC 태그를 스캔해 주세요</h2><p>테이블에 부착된 COMPIVOX 태그를 휴대폰으로 터치하면 주문 확인 페이지가 열려요.</p><div class="landing-actions" style="justify-content:center"><a class="btn btn-secondary customer-switch" href="/">서비스 소개</a></div></section>`);
    return;
  }

  const tagUrl = new URL("/", location.origin);
  tagUrl.searchParams.set("tag", tag.token);
  const matchingOrder = order && order.tableId === table.id ? order : null;
  let content = "";
  if (!matchingOrder) {
    const submitted = orderNo !== "";
    content = `
      <section class="panel order-lookup">
        <p class="eyebrow">ORDER LOOKUP</p>
        <h2 class="panel-title" style="margin-top:8px;font-size:18px">주문번호를 입력해 주세요</h2>
        <p class="panel-subtitle" style="margin-top:7px">같은 테이블의 주문을 구분할 수 있도록 영수증에서 주문번호를 확인해 주세요.</p>
        <form class="lookup-form" data-form="lookup">
          <label class="sr-only" for="order-code">주문번호</label>
          <input class="field mono" id="order-code" name="orderNo" placeholder="예: CV-204" autocomplete="off" value="${escapeHtml(orderNo)}" required>
          <button class="btn btn-primary" type="submit">주문 확인</button>
        </form>
        <p class="lookup-error">${submitted ? "주문번호를 찾지 못했어요. 영수증의 번호를 다시 확인해 주세요." : escapeHtml(customerError)}</p>
      </section>
      <p class="notice">${escapeHtml(data.restaurant.notice)}</p>`;
  } else {
    content = renderCustomerOrder(matchingOrder, table);
  }

  app.innerHTML = customerShell(`
    <div class="eyebrow">ORDER STATUS</div>
    <h1 class="restaurant-name">${escapeHtml(data.restaurant.name)}</h1>
    <div class="table-line"><span>테이블 ${escapeHtml(table.number)}</span><span aria-hidden="true">·</span><span>${escapeHtml(formatTime(new Date().toISOString()))}에 방문하셨어요</span></div>
    ${content}
    <p class="notice">예상 시간은 주문량과 조리 상황에 따라 달라질 수 있어요.</p>
    <a class="topbar-link customer-switch" href="${escapeHtml(tagUrl.pathname + tagUrl.search)}">다른 주문번호 확인</a>
  `);
}

function customerShell(content) {
  return `<div class="customer-shell">
    <header class="customer-top">${brand()}<span class="demo-stamp">DEMO</span></header>
    <main class="customer-main">${content}</main>
    <footer class="customer-footer">주문 상태가 바뀌면 이 페이지에 바로 표시돼요.<br>COMPIVOX에서 편하게 확인해 보세요.</footer>
  </div>`;
}

function renderCustomerOrder(order, table) {
  const statusIndex = FLOW.indexOf(order.status);
  const remaining = order.expectedAt ? Math.max(0, Math.ceil((new Date(order.expectedAt).getTime() - Date.now()) / 60000)) : 0;
  const expectedAt = order.expectedAt ? new Date(order.expectedAt).getTime() : 0;
  const duration = Math.max(1, Number(order.expectedMinutes) || 1) * 60000;
  const startsAt = expectedAt ? expectedAt - duration : 0;
  const progress = expectedAt ? Math.max(0, Math.min(1, (Date.now() - startsAt) / duration)) : 0;
  const canceled = order.status === "canceled";
  const eta = order.status === "ready" || order.status === "delivered"
    ? order.status === "ready" ? "준비 완료" : "전달 완료"
    : `약 ${remaining}분 남았어요`;
  const track = FLOW.map((status, index) => {
    const complete = !canceled && index < statusIndex;
    const current = !canceled && index === statusIndex;
    return `<li class="status-step ${complete ? "done" : ""} ${current ? "current" : ""}">
      <span class="status-dot">${complete ? `<img src="${ICON_SRC}" alt="">` : current ? "•" : ""}</span>
      <span>${STATUS[status].label}</span>
      <small>${current ? "현재 상태" : complete ? "완료" : ""}</small>
    </li>`;
  }).join("");
  return `<section class="panel order-card">
    <p class="order-code">주문번호 &nbsp;<strong class="mono">${escapeHtml(order.orderNo)}</strong></p>
    <ul class="order-items">${order.items.map((item) => `<li class="order-item"><span>${escapeHtml(item.name)}</span><span>× ${item.quantity}</span></li>`).join("")}</ul>
    <div class="eta-box"><div><div class="eta-caption">${order.status === "ready" ? "PICKUP" : order.status === "delivered" ? "COMPLETED" : "ESTIMATED TIME"}</div><div class="eta-value">${canceled ? "주문이 취소되었어요" : eta}</div></div>${!canceled && isActiveOrder(order) && expectedAt ? `<div class="eta-progress" data-eta-progress data-start-at="${startsAt}" data-ends-at="${expectedAt}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(progress * 100)}" aria-label="예상 준비까지 ${remaining}분 남았어요"><span class="eta-progress-time" data-eta-time style="left:${Math.max(5, Math.min(95, progress * 100))}%">${remaining}분 남았어요</span><span class="eta-progress-track" aria-hidden="true"><span class="eta-progress-fill" data-eta-fill style="width:${progress * 100}%"></span></span><span class="eta-progress-caption">이 시간쯤 준비돼요<br><strong>${escapeHtml(formatTime(order.expectedAt))}</strong></span></div>` : `<div class="eta-clock">${canceled ? "직원에게 문의해 주세요" : `예상 완료 시간이에요<br><strong>${escapeHtml(formatTime(order.expectedAt))}</strong>`}</div>`}</div>
    ${order.status === "ready" ? `<div class="ready-banner" role="status"><img class="complete-mark" src="${ICON_SRC}" alt=""><strong>주문하신 음식이 준비되었어요</strong></div>` : ""}
    ${order.status === "delivered" ? `<div class="ready-banner" role="status"><img class="complete-mark" src="${ICON_SRC}" alt=""><strong>음식을 전달해 드렸어요</strong><span>맛있게 드세요.</span></div>` : ""}
    ${canceled ? `<div class="ready-banner" role="status" style="border-color:#E7C7C2;background:var(--danger-bg);color:var(--danger)"><strong>주문이 취소되었어요</strong><span>결제나 주문 관련 문의는 직원에게 말씀해 주세요.</span></div>` : ""}
    <ol class="status-track" aria-label="주문 진행 상태">${track}</ol>
    <div class="updated-at"><span>테이블 ${escapeHtml(table.number)} · ${statusTag(order.status)}</span><span>${escapeHtml(relativeTime(order.updatedAt))}</span></div>
  </section>`;
}

function updateCustomerEtaProgress() {
  document.querySelectorAll("[data-eta-progress]").forEach((progress) => {
    const startsAt = Number(progress.dataset.startAt);
    const endsAt = Number(progress.dataset.endsAt);
    const duration = Math.max(1, endsAt - startsAt);
    const remaining = Math.max(0, endsAt - Date.now());
    const ratio = Math.max(0, Math.min(1, (Date.now() - startsAt) / duration));
    progress.style.setProperty("--progress", String(ratio));
    progress.querySelector("[data-eta-fill]").style.width = `${ratio * 100}%`;
    const remainingMinutes = Math.ceil(remaining / 60000);
    progress.querySelector("[data-eta-time]").style.left = `${Math.max(5, Math.min(95, ratio * 100))}%`;
    progress.querySelector("[data-eta-time]").textContent = `${remainingMinutes}분 남았어요`;
    progress.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
    progress.setAttribute("aria-label", `예상 준비까지 ${remainingMinutes}분`);
  });
}

function routeName() {
  const match = location.hash.match(/^#\/staff(?:\/([a-z]+))?/);
  return match ? match[1] || "dashboard" : null;
}

function navigate(route) {
  location.hash = route ? `#/staff/${route}` : "";
  if (!route && location.hash) location.hash = "";
  render();
}

function requireStaffPage(page) {
  if (page === "login") {
    renderLogin();
    return;
  }
  if (!data.authenticated) {
    location.hash = "#/staff/login";
    renderLogin();
    return;
  }
  renderStaff(page);
}

function renderLogin(errorMessage = "") {
  app.innerHTML = `<div class="staff-shell">
    <header class="staff-topbar"><div class="staff-brand-side">${brand()}<span class="restaurant-chip">직원 워크스페이스</span></div><a class="topbar-link" href="/">고객 페이지 보기</a></header>
    <main class="login-wrap"><section class="panel login-card">
      ${brand()}
      <div class="eyebrow">STAFF ACCESS</div>
      <h1>다시 만나서 반가워요</h1>
      <p>식당 주문과 테이블을 관리하려면 직원 계정으로 로그인하세요.</p>
      <form class="login-form" data-form="login">
        <div><label class="label" for="staff-id">아이디</label><input class="field" id="staff-id" name="username" autocomplete="username" value="${escapeHtml(new URLSearchParams(location.search).get("id") ?? "")}" required></div>
        <div><label class="label" for="staff-password">비밀번호</label><input class="field" id="staff-password" type="password" name="password" autocomplete="current-password" required></div>
        <div class="login-err" role="alert">${escapeHtml(errorMessage)}</div>
        <button class="btn btn-primary btn-wide" type="submit">로그인 <span aria-hidden="true">→</span></button>
      </form>
      <div class="login-demo"><strong>미리보기 데모 계정</strong><br>아이디 <code>staff</code> · 비밀번호 <code>compivox-demo</code><br>데모용 로컬 로그인이며 실제 계정 인증과 연결되어 있지 않습니다.</div>
    </section></main>
  </div>`;
}

function renderStaff(page) {
  const titles = {
    dashboard: ["OVERVIEW", "좋은 서비스는 주방에서 시작됩니다", "오늘의 주문과 조리 흐름을 한눈에 확인하세요."],
    orders: ["ORDER MANAGEMENT", "주문 관리", "새 주문을 등록하고 개별 준비 상태를 업데이트합니다."],
    tables: ["FLOOR PLAN", "테이블 관리", "테이블 상태와 현재 진행 중인 주문을 확인합니다."],
    tags: ["NFC MANAGEMENT", "NFC 태그", "테이블별 연결 주소를 복사하거나 QR 코드로 확인합니다."],
    settings: ["RESTAURANT", "식당 설정", "고객 페이지에 표시할 식당 정보와 안내를 관리합니다."]
  };
  const [eyebrow, title, lead] = titles[page] ?? titles.dashboard;
  const totalActive = data.orders.filter(isActiveOrder).length;
  const readyCount = data.orders.filter((order) => order.status === "ready").length;
  const todayCount = data.orders.filter((order) => new Date(order.createdAt).toDateString() === new Date().toDateString()).length;
  app.innerHTML = `<div class="staff-shell">
    <header class="staff-topbar">
      <div class="staff-brand-side">${brand()}<span class="restaurant-chip">${escapeHtml(data.restaurant.name)}</span></div>
      <div class="staff-top-actions"><span class="demo-stamp">LOCAL DEMO</span><button class="btn btn-quiet btn-sm" data-action="logout">로그아웃</button></div>
    </header>
    <div class="staff-layout">
      <nav class="sidebar" aria-label="관리 메뉴">
        <div class="sidebar-label">WORKSPACE</div>
        ${NAV_ITEMS.map(([key, label]) => `<a class="side-link ${page === key ? "active" : ""}" href="#/staff/${key}" ${page === key ? 'aria-current="page"' : ""}><span class="side-icon" aria-hidden="true"><img src="${ICON_SRC}" alt=""></span>${label}</a>`).join("")}
        <div class="sidebar-bottom"><a class="side-link" href="?tag=${encodeURIComponent(data.tags[0]?.token ?? "")}"><span class="side-icon" aria-hidden="true"><img src="${ICON_SRC}" alt=""></span>고객 화면 미리보기</a></div>
      </nav>
      <main class="staff-main"><div class="staff-content">
        <div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1 class="page-title">${title}</h1><p class="page-lead">${lead}</p></div>
        ${page === "orders" ? `<button class="btn btn-primary" data-action="focus-new-order">＋ 새 주문 등록</button>` : ""}
      </div>
      ${page === "dashboard" ? renderDashboard(totalActive, readyCount, todayCount) : ""}
      ${page === "orders" ? renderOrders() : ""}
      ${page === "tables" ? renderTables() : ""}
      ${page === "tags" ? renderTags() : ""}
      ${page === "settings" ? renderSettings() : ""}
      </div></main>
    </div>
    ${modalAction ? renderModal() : ""}
  </div>`;
  if (page === "tags") drawQrCodes();
}

function renderDashboard(totalActive, readyCount, todayCount) {
  const queued = data.orders.filter((order) => order.status === "received" || order.status === "queued").length;
  const cooking = data.orders.filter((order) => order.status === "preparing").length;
  const metrics = [
    ["진행 중 주문", totalActive, "현재 접수된 주문"],
    ["조리 대기", queued, "다음 작업 대기"],
    ["조리 중", cooking, "주방에서 준비 중"],
    ["준비 완료", readyCount, "픽업 대기"],
    ["오늘 주문", todayCount, "오늘 접수된 전체 주문"]
  ];
  const latest = [...data.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  return `<section class="metric-grid">${metrics.map(([label, value, note]) => `<article class="metric-card"><div class="metric-label">${label}</div><div class="metric-value">${value}</div><div class="metric-note">${note}</div></article>`).join("")}</section>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-head"><div><h2 class="panel-title">최근 주문</h2><p class="panel-subtitle">최근 접수된 주문의 현재 상태</p></div><a class="btn btn-quiet btn-sm" href="#/staff/orders">전체 보기 →</a></div>
        <div class="panel-body order-list">${latest.length ? latest.map(renderOrderRow).join("") : `<div class="empty-state">아직 등록된 주문이 없습니다.</div>`}</div>
      </section>
      <section class="panel"><div class="panel-head"><div><h2 class="panel-title">주방 현황</h2><p class="panel-subtitle">테이블별 진행 상황</p></div></div>
        <div class="panel-body">${data.tables.map((table) => {
          const count = currentOrders(table.id).length;
          const status = tableStatus(table);
          return `<div class="order-row" style="grid-template-columns:1fr auto"><div class="order-row-main"><div class="order-row-code">테이블 ${escapeHtml(table.number)}</div><div class="order-row-items">${count ? `${count}건의 주문 진행 중` : "진행 중인 주문 없음"}</div></div><span class="tag ${status.tone}">${escapeHtml(status.label)}</span></div>`;
        }).join("")}</div>
      </section>
    </div>`;
}

function renderOrderRow(order) {
  return `<div class="order-row">
    <div class="order-row-main"><div class="order-row-code mono">${escapeHtml(order.orderNo)}</div><div class="order-row-items">${escapeHtml(formatTime(order.createdAt))}</div></div>
    <div class="order-row-main"><div class="order-row-items">${escapeHtml(order.items.map((item) => `${item.name} ×${item.quantity}`).join(" · "))}</div></div>
    <div class="order-row-table">테이블 ${escapeHtml(tableNumber(order.tableId))} · ${statusTag(order.status)}</div>
    <div class="order-row-actions"><button class="btn btn-secondary btn-sm" data-action="advance" data-id="${escapeHtml(order.id)}">다음 단계</button></div>
  </div>`;
}

function renderOrders() {
  const filter = routeFilter;
  const filtered = [...data.orders].filter((order) => filter === "all" || order.status === filter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const tabs = [["all", "전체"], ...Object.entries(STATUS).map(([key, item]) => [key, item.short])];
  return `<section class="panel order-form" id="new-order">
      <div class="panel-head" style="padding:0 0 17px;border:0"><div><h2 class="panel-title">새 주문 등록</h2><p class="panel-subtitle">주문번호는 생성 후 고객 조회에 사용됩니다.</p></div><span class="demo-stamp">LOCAL DEMO</span></div>
      <form class="order-form-grid" data-form="new-order">
        <div class="form-field"><label class="label" for="order-table">테이블 번호</label><select class="field" id="order-table" name="tableId" required>${data.tables.filter((table) => !table.closed).map((table) => `<option value="${escapeHtml(table.id)}">테이블 ${escapeHtml(table.number)}</option>`).join("")}</select></div>
        <div class="form-field"><label class="label" for="order-items">주문 메뉴</label><textarea class="field" id="order-items" name="items" placeholder="메뉴명, 수량 (한 줄에 하나씩)&#10;트러플 크림 파스타, 1&#10;레몬 에이드, 2" required></textarea></div>
        <div class="form-field"><label class="label" for="order-eta">예상 준비 시간 (분)</label><input class="field" id="order-eta" name="minutes" type="number" min="1" max="180" value="12" required></div>
        <div class="form-field"><button class="btn btn-primary" type="submit">주문 접수하기 <span aria-hidden="true">→</span></button></div>
      </form>
    </section>
    <div class="orders-toolbar"><div class="status-tabs" role="tablist" aria-label="주문 상태 필터">${tabs.map(([key, label]) => `<button class="status-tab ${filter === key ? "active" : ""}" role="tab" aria-selected="${filter === key}" data-action="filter-orders" data-filter="${key}">${label}${key === "all" ? ` · ${data.orders.length}` : ` · ${data.orders.filter((order) => order.status === key).length}`}</button>`).join("")}</div><span class="muted small">${filtered.length}건</span></div>
    <section class="panel orders-table">
      <div class="table-header"><span>주문번호</span><span>메뉴</span><span>테이블</span><span>상태 / 예상</span><span>작업</span></div>
      ${filtered.length ? filtered.map(renderOrderCard).join("") : `<div class="empty-state">선택한 상태의 주문이 없습니다.</div>`}
    </section>`;
}

function renderOrderCard(order) {
  const remaining = order.expectedAt ? Math.max(0, Math.ceil((new Date(order.expectedAt).getTime() - Date.now()) / 60000)) : null;
  const next = FLOW[FLOW.indexOf(order.status) + 1];
  const tag = data.tags.find((item) => item.tableId === order.tableId && item.active);
  const publicLink = new URL("/", location.origin);
  if (tag) {
    publicLink.searchParams.set("tag", tag.token);
    publicLink.searchParams.set("order", order.orderNo);
  }
  return `<article class="table-order" data-order-card="${escapeHtml(order.id)}">
    <div class="table-cell"><strong class="mono">${escapeHtml(order.orderNo)}</strong><small>${escapeHtml(formatTime(order.createdAt))}</small></div>
    <div class="table-cell">${order.items.map((item) => `<strong>${escapeHtml(item.name)} <span class="muted">× ${item.quantity}</span></strong>`).join("")}</div>
    <div class="table-cell">테이블 ${escapeHtml(tableNumber(order.tableId))}</div>
    <div class="table-cell">${statusTag(order.status)}${remaining !== null && isActiveOrder(order) ? `<small>예상 ${remaining ? `약 ${remaining}분` : "곧 완료"}</small>` : ""}</div>
    <div class="table-order-actions">
      ${next ? `<button class="btn btn-secondary btn-sm" data-action="advance" data-id="${escapeHtml(order.id)}">${next === "ready" ? "준비 완료" : next === "delivered" ? "전달 완료" : "다음 단계"}</button>` : ""}
      ${isActiveOrder(order) ? `<button class="btn btn-quiet btn-sm" data-action="edit-eta" data-id="${escapeHtml(order.id)}">시간</button><button class="btn btn-quiet btn-sm" data-action="copy-order-link" data-url="${escapeHtml(publicLink.href)}" ${tag ? "" : "disabled"}>고객 링크</button><button class="btn btn-danger btn-sm" data-action="cancel-order" data-id="${escapeHtml(order.id)}">취소</button>` : ""}
    </div>
  </article>`;
}

function renderTables() {
  return `<div class="orders-toolbar"><p class="panel-subtitle">진행 중인 주문 상태로 테이블 이용 현황이 자동 표시됩니다.</p><button class="btn btn-primary" data-action="add-table">＋ 테이블 추가</button></div>
    <div class="table-grid">${data.tables.length ? data.tables.map((table) => {
      const status = tableStatus(table);
      const orders = currentOrders(table.id);
      const tag = data.tags.find((item) => item.tableId === table.id && item.active);
      return `<article class="panel table-card">
        <div class="table-card-top"><div><div class="eyebrow">TABLE</div><div class="table-number">테이블 ${escapeHtml(table.number)}</div><div class="table-card-meta">${orders.length ? `${orders.length}건 주문 · ${orders.map((order) => escapeHtml(order.orderNo)).join(", ")}` : "현재 주문 없음"}</div></div><span class="tag ${status.tone}">${status.label}</span></div>
        <form class="table-card-actions" data-form="rename-table" data-id="${escapeHtml(table.id)}"><input class="field" aria-label="테이블 번호" name="number" value="${escapeHtml(table.number)}" maxlength="8" style="width:92px;min-height:34px;padding:6px 9px"><button class="btn btn-secondary btn-sm" type="submit">번호 저장</button>
          <button class="btn btn-quiet btn-sm" type="button" data-action="toggle-table" data-id="${escapeHtml(table.id)}">${table.closed ? "이용 재개" : "이용 종료"}</button>
          <button class="btn btn-danger btn-sm" type="button" data-action="delete-table" data-id="${escapeHtml(table.id)}" ${orders.length ? "disabled title=\"진행 중인 주문이 있습니다\"" : ""}>삭제</button>
          ${tag ? `<a class="btn btn-quiet btn-sm" href="#/staff/tags">NFC 보기</a>` : `<button class="btn btn-quiet btn-sm" type="button" data-action="make-tag" data-id="${escapeHtml(table.id)}">NFC 만들기</button>`}
        </form>
      </article>`;
    }).join("") : `<div class="panel empty-state">등록된 테이블이 없습니다. 테이블을 추가해 주세요.</div>`}</div>`;
}

function renderTags() {
  const options = data.tables.map((table) => `<option value="${escapeHtml(table.id)}">테이블 ${escapeHtml(table.number)}</option>`).join("");
  return `<section class="panel panel-pad" style="margin-bottom:17px">
      <div class="panel-head" style="padding:0 0 15px;border:0"><div><h2 class="panel-title">테이블 NFC 태그 생성</h2><p class="panel-subtitle">태그에는 주문별 정보 대신 테이블 연결 URL을 기록합니다.</p></div></div>
      <form class="lookup-form" data-form="new-tag"><label class="sr-only" for="tag-table">테이블</label><select class="field" id="tag-table" name="tableId" required>${options}</select><button class="btn btn-primary" type="submit">태그 생성</button></form>
    <p class="notice">태그 URL을 복사해 NFC 스티커에 URI 레코드로 기록하세요. QR 코드는 화면에서 로컬로 생성됩니다.</p>
  </section>
    <div>${data.tags.length ? data.tags.map((tag) => {
      const table = tableById(tag.tableId);
      const url = new URL("/", location.origin);
      url.searchParams.set("tag", tag.token);
      return `<article class="panel tag-card">
        <div><div class="table-card-top"><div><div class="eyebrow">NFC TAG · ${escapeHtml(tag.id)}</div><h2 class="panel-title" style="margin-top:8px;font-size:17px">테이블 ${escapeHtml(table?.number ?? "삭제됨")}</h2></div>${tag.active ? `<span class="tag good">사용 중</span>` : `<span class="tag neutral">비활성</span>`}</div>
          <code class="tag-url">${escapeHtml(url.href)}</code>
          <div class="tag-actions"><button class="btn btn-secondary btn-sm" data-action="copy-tag-url" data-url="${escapeHtml(url.href)}">주소 복사</button><a class="btn btn-quiet btn-sm" href="${escapeHtml(url.href)}" target="_blank" rel="noopener">고객 페이지 열기</a><button class="btn btn-quiet btn-sm" data-action="toggle-tag" data-id="${escapeHtml(tag.id)}">${tag.active ? "비활성화" : "활성화"}</button><button class="btn btn-danger btn-sm" data-action="delete-tag" data-id="${escapeHtml(tag.id)}">삭제</button></div>
        </div><canvas class="qr-canvas" width="264" height="264" data-qr="${escapeHtml(url.href)}" aria-label="테이블 ${escapeHtml(table?.number ?? "")} NFC 주소 QR 코드"></canvas>
      </article>`;
    }).join("") : `<div class="panel empty-state">등록된 NFC 태그가 없습니다. 테이블을 선택해 첫 태그를 만드세요.</div>`}</div>`;
}

function drawQrCodes() {
  document.querySelectorAll("canvas[data-qr]").forEach((canvas) => {
    QRCode.toCanvas(canvas, canvas.dataset.qr, {
      width: 264, margin: 2,
      color: { dark: "#17191c", light: "#ffffff" },
      errorCorrectionLevel: "M"
    }).catch((error) => {
      console.error("Could not render the table QR code.", error);
      canvas.insertAdjacentHTML("afterend", `<p class="small muted">QR을 생성할 수 없습니다. 연결 주소를 복사해 주세요.</p>`);
    });
  });
}

function renderSettings() {
  return `<div class="settings-grid">
    <section class="panel panel-pad"><h2 class="panel-title">고객 페이지 정보</h2><p class="panel-subtitle" style="margin-bottom:20px">테이블 NFC를 스캔했을 때 고객 화면에 표시됩니다.</p>
      <form class="form-grid" data-form="settings">
        <div class="form-field full"><label class="label" for="restaurant-name">식당 이름</label><input class="field" id="restaurant-name" name="name" maxlength="50" value="${escapeHtml(data.restaurant.name)}" required></div>
        <div class="form-field full"><label class="label" for="restaurant-notice">고객 안내 문구</label><textarea class="field" id="restaurant-notice" name="notice" maxlength="180">${escapeHtml(data.restaurant.notice)}</textarea></div>
        <div class="form-field full"><button class="btn btn-primary" type="submit">변경사항 저장</button></div>
      </form>
    </section>
    <section class="panel panel-pad"><h2 class="panel-title">데모 데이터</h2><p class="panel-subtitle">현재 화면은 이 브라우저에 저장되는 테스트 데이터로 동작합니다.</p>
      <div class="setting-note">다른 기기·브라우저와 주문 상태를 공유하지 않습니다. 실제 식당 운영을 위해서는 직원 인증, 서버 API, 데이터베이스, 실시간 동기화 및 고객 주문 토큰이 별도로 필요합니다.</div>
      <button class="btn btn-danger" style="margin-top:16px" data-action="reset-demo">데모 데이터 초기화</button>
    </section>
  </div>
  <section class="panel panel-pad" style="margin-top:16px"><h2 class="panel-title">연동 상태</h2><p class="panel-subtitle" style="margin-top:6px">백엔드 · 연결 안 됨 &nbsp; / &nbsp; 데이터 저장 · 현재 브라우저 로컬 저장소 &nbsp; / &nbsp; NFC · URL 기록 방식</p></section>`;
}

function renderModal() {
  const content = modalAction.type === "eta"
    ? `<form class="modal-form" data-form="edit-eta" data-id="${escapeHtml(modalAction.orderId)}"><label class="label" for="edit-eta-minutes">예상 준비 시간 (분)</label><input class="field" id="edit-eta-minutes" name="minutes" type="number" min="1" max="180" value="${escapeHtml(modalAction.minutes)}" required><div class="modal-actions"><button class="btn btn-quiet" type="button" data-action="close-modal">취소</button><button class="btn btn-primary" type="submit">시간 저장</button></div></form>`
    : `<div class="modal-actions"><button class="btn btn-quiet" data-action="close-modal">취소</button><button class="btn btn-danger" data-action="confirm-modal">확인</button></div>`;
  return `<div class="modal-backdrop" role="presentation"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">${escapeHtml(modalAction.title)}</h2><p>${escapeHtml(modalAction.message)}</p>${content}</section></div>`;
}

function render() {
  const route = routeName();
  if (route) {
    requireStaffPage(route);
    return;
  }
  if (new URLSearchParams(location.search).has("tag")) {
    renderCustomer();
    return;
  }
  renderLanding();
}

function updateOrder(order, status) {
  if (!order) return;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  if (status === "preparing") {
    order.expectedAt = new Date(Date.now() + Math.max(1, order.expectedMinutes) * 60000).toISOString();
  }
  if (status === "ready" || status === "delivered" || status === "canceled") order.expectedAt = null;
  persist();
  render();
}

function parseItems(text) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    let name = line;
    let quantity = 1;
    const suffix = line.match(/^(.*?)\s*[x×]\s*(\d+)\s*$/i);
    const comma = line.match(/^(.*?)[,\t|]\s*(\d+)\s*$/);
    if (suffix) { name = suffix[1].trim(); quantity = Number(suffix[2]); }
    else if (comma) { name = comma[1].trim(); quantity = Number(comma[2]); }
    return { name: name.slice(0, 80), quantity: Math.min(99, Math.max(1, quantity)) };
  }).filter((item) => item.name);
}

function makeOrder(form) {
  const values = new FormData(form);
  const items = parseItems(String(values.get("items") ?? ""));
  const table = tableById(String(values.get("tableId") ?? ""));
  const minutes = Math.max(1, Math.min(180, Number(values.get("minutes")) || 12));
  if (!table || table.closed || !items.length) {
    showToast("이용 가능한 테이블과 메뉴를 확인해 주세요.");
    return;
  }
  let orderNo;
  do { orderNo = `CV-${String(Math.floor(100 + Math.random() * 900))}`; }
  while (data.orders.some((order) => order.orderNo === orderNo));
  const now = new Date();
  data.orders.unshift({
    id: uid("order"),
    orderNo,
    tableId: table.id,
    items,
    status: "received",
    expectedMinutes: minutes,
    expectedAt: new Date(now.getTime() + minutes * 60000).toISOString(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  });
  persist();
  routeFilter = "all";
  render();
  showToast(`${orderNo} 주문을 등록했습니다.`);
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast("연결 주소를 복사했습니다.");
  } catch (error) {
    console.warn("Clipboard API unavailable; using selection fallback.", error);
    const input = document.createElement("textarea");
    input.value = value;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    showToast(copied ? "연결 주소를 복사했습니다." : "주소를 직접 선택해 복사해 주세요.");
  }
}

function handleSubmit(event) {
  const form = event.target.closest("form[data-form]");
  if (!form) return;
  event.preventDefault();
  const kind = form.dataset.form;
  if (kind === "lookup") {
    const orderNo = String(new FormData(form).get("orderNo") ?? "").trim().toUpperCase();
    customerError = "";
    const url = new URL(location.href);
    url.searchParams.set("order", orderNo);
    location.href = url.pathname + url.search;
    return;
  }
  if (kind === "login") {
    const values = new FormData(form);
    const username = String(values.get("username") ?? "").trim().toLowerCase();
    const password = String(values.get("password") ?? "");
    if (username !== STAFF_ID || password !== STAFF_PASSWORD) {
      renderLogin("아이디 또는 비밀번호를 확인해 주세요.");
      return;
    }
    data.authenticated = true;
    persist();
    navigate("dashboard");
    showToast("데모 워크스페이스에 로그인했습니다.");
    return;
  }
  if (kind === "new-order") { makeOrder(form); return; }
  if (kind === "edit-eta") {
    const order = data.orders.find((item) => item.id === form.dataset.id);
    const minutes = Number(new FormData(form).get("minutes"));
    if (!order) { modalAction = null; render(); return; }
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
      showToast("1~180분 사이의 숫자를 입력해 주세요.");
      return;
    }
    order.expectedMinutes = minutes;
    order.expectedAt = new Date(Date.now() + minutes * 60000).toISOString();
    order.updatedAt = new Date().toISOString();
    modalAction = null;
    persist();
    render();
    showToast(`예상 시간을 약 ${minutes}분으로 변경했습니다.`);
    return;
  }
  if (kind === "settings") {
    const values = new FormData(form);
    data.restaurant.name = String(values.get("name") ?? "").trim().slice(0, 50) || "COMPIVOX Restaurant";
    data.restaurant.notice = String(values.get("notice") ?? "").trim().slice(0, 180);
    persist();
    render();
    showToast("식당 정보를 저장했습니다.");
    return;
  }
  if (kind === "rename-table") {
    const table = tableById(form.dataset.id);
    const number = String(new FormData(form).get("number") ?? "").trim().slice(0, 8);
    if (!number || data.tables.some((item) => item.id !== table?.id && item.number.toLowerCase() === number.toLowerCase())) {
      showToast("비어 있거나 중복되지 않는 테이블 번호를 입력해 주세요.");
      return;
    }
    if (table) table.number = number;
    persist();
    render();
    showToast("테이블 번호를 변경했습니다.");
    return;
  }
  if (kind === "new-tag") {
    const tableId = String(new FormData(form).get("tableId") ?? "");
    if (!tableById(tableId)) { showToast("테이블을 먼저 추가해 주세요."); return; }
    data.tags.push({ id: uid("tag"), token: uid("cvx"), tableId, active: true, createdAt: new Date().toISOString() });
    persist();
    render();
    showToast("NFC 연결 태그를 만들었습니다.");
  }
}

function handleClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "logout") {
    data.authenticated = false;
    persist();
    navigate("login");
    return;
  }
  if (action === "focus-new-order") {
    document.getElementById("new-order")?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("order-items")?.focus({ preventScroll: true });
    return;
  }
  if (action === "filter-orders") {
    routeFilter = button.dataset.filter;
    renderStaff("orders");
    return;
  }
  if (action === "advance") {
    const order = data.orders.find((item) => item.id === id);
    const next = order && FLOW[FLOW.indexOf(order.status) + 1];
    if (next) updateOrder(order, next);
    return;
  }
  if (action === "cancel-order") {
    modalAction = { title: "주문을 취소할까요?", message: "취소한 주문은 활성 주문 목록과 고객 페이지에서 취소 상태로 표시됩니다.", run: () => {
      const order = data.orders.find((item) => item.id === id);
      updateOrder(order, "canceled");
      showToast("주문을 취소했습니다.");
    } };
    render();
    return;
  }
  if (action === "edit-eta") {
    const order = data.orders.find((item) => item.id === id);
    if (!order) return;
    modalAction = { type: "eta", title: "예상 준비 시간 변경", message: "고객 화면에 표시할 예상 시간을 입력하세요. 1~180분 사이로 설정할 수 있습니다.", orderId: id, minutes: order.expectedMinutes || 10 };
    render();
    return;
  }
  if (action === "copy-order-link" || action === "copy-tag-url") {
    if (button.dataset.url) void copyText(button.dataset.url);
    return;
  }
  if (action === "add-table") {
    const used = new Set(data.tables.map((table) => table.number));
    let next = 1;
    while (used.has(String(next).padStart(2, "0"))) next += 1;
    data.tables.push({ id: uid("table"), number: String(next).padStart(2, "0"), closed: false });
    persist();
    render();
    showToast(`테이블 ${String(next).padStart(2, "0")}을 추가했습니다.`);
    return;
  }
  if (action === "toggle-table") {
    const table = tableById(id);
    if (!table) return;
    if (!table.closed && currentOrders(id).length) { showToast("진행 중인 주문이 있어 이용을 종료할 수 없습니다."); return; }
    table.closed = !table.closed;
    persist();
    render();
    return;
  }
  if (action === "delete-table") {
    if (currentOrders(id).length) { showToast("진행 중인 주문이 있는 테이블은 삭제할 수 없습니다."); return; }
    modalAction = { title: "테이블을 삭제할까요?", message: "해당 테이블에 연결된 NFC 태그도 함께 삭제됩니다.", run: () => {
      data.tables = data.tables.filter((table) => table.id !== id);
      data.tags = data.tags.filter((tag) => tag.tableId !== id);
      persist();
      render();
      showToast("테이블을 삭제했습니다.");
    } };
    render();
    return;
  }
  if (action === "make-tag") {
    data.tags.push({ id: uid("tag"), token: uid("cvx"), tableId: id, active: true, createdAt: new Date().toISOString() });
    persist();
    navigate("tags");
    showToast("NFC 연결 태그를 만들었습니다.");
    return;
  }
  if (action === "toggle-tag") {
    const tag = data.tags.find((item) => item.id === id);
    if (tag) tag.active = !tag.active;
    persist();
    render();
    showToast(tag?.active ? "태그를 활성화했습니다." : "태그를 비활성화했습니다.");
    return;
  }
  if (action === "delete-tag") {
    modalAction = { title: "NFC 태그를 삭제할까요?", message: "이 태그의 고객 연결 주소는 더 이상 사용할 수 없습니다.", run: () => {
      data.tags = data.tags.filter((tag) => tag.id !== id);
      persist();
      render();
      showToast("NFC 태그를 삭제했습니다.");
    } };
    render();
    return;
  }
  if (action === "reset-demo") {
    modalAction = { title: "데모 데이터를 초기화할까요?", message: "테이블, 태그, 주문과 식당 설정이 처음 상태로 돌아갑니다.", run: () => {
      const authenticated = data.authenticated;
      data = seedData();
      data.authenticated = authenticated;
      persist();
      render();
      showToast("초기 데모 데이터를 불러왔습니다.");
    } };
    render();
    return;
  }
  if (action === "close-modal") {
    modalAction = null;
    render();
    return;
  }
  if (action === "confirm-modal") {
    const pending = modalAction;
    modalAction = null;
    pending?.run();
    return;
  }
  if (event.target.classList.contains("modal-backdrop")) {
    modalAction = null;
    render();
  }
}

app.addEventListener("click", handleClick);
app.addEventListener("submit", handleSubmit);
window.addEventListener("hashchange", render);
window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEY || !event.newValue) return;
  try {
    const updated = JSON.parse(event.newValue);
    if (Array.isArray(updated.orders) && Array.isArray(updated.tables) && Array.isArray(updated.tags)) {
      data = updated;
      render();
    }
  } catch (error) {
    console.warn("Ignored invalid cross-tab demo update.", error);
  }
});
window.addEventListener("popstate", render);
setInterval(() => {
  if (new URLSearchParams(location.search).has("tag")) updateCustomerEtaProgress();
}, 1000);

setInterval(() => {
  if (new URLSearchParams(location.search).has("tag")) renderCustomer();
}, 30000);

render();
