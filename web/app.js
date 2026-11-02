(() => {
  const KO = {
    skip: "본문으로 건너뛰기",
    "nav.intro": "소개", "nav.how": "사용 방법", "nav.support": "지원 기술", "nav.features": "기능", "nav.pricing": "요금제", "nav.faq": "FAQ", "nav.security": "보안", "nav.account": "로그인",
    "sec.label": "계정 및 보안", "sec.title": "웹사이트와 앱을 하나의 계정으로",
    "sec.body": "같은 계정으로 웹사이트와 Windows 앱에 로그인합니다. 모든 권한 확인은 서버에서 이루어집니다.",
    "sec.1.t": "아이디 계정", "sec.1.d": "이메일을 받지 않고 아이디와 비밀번호로 가입합니다. 가입과 로그인에는 현재 IP 확인 절차가 있습니다.",
    "sec.2.t": "Cloudflare Turnstile", "sec.2.d": "회원가입, 로그인 등 민감한 작업에서 자동화된 요청을 줄이기 위해 Turnstile을 사용합니다.",
    "sec.3.t": "IP 및 네트워크 확인", "sec.3.d": "IP 주소는 접속 보안, 네트워크 위험 평가, 기기 등록 제한에 사용됩니다. 신원을 증명하는 수단이 아닌 추가 확인 절차입니다.",
    "sec.4.t": "기기 관리", "sec.4.d": "설치마다 무작위 기기 ID가 만들어지며, 대시보드에서 내 기기를 확인하고 해제할 수 있습니다.",
    "lang.label": "언어",
    "hero.eyebrow": "Windows 프로젝트 빌드 도구",
    "hero.w1": "한계를", "hero.w2": "넘어", "hero.w3": "빌드하세요.",
    "hero.aria": "한계를 넘어 빌드하세요.",
    "hero.desc": "간결한 빌드와 패키징 경험으로 개발 프로젝트를 Windows 애플리케이션으로 바꿔 보세요.",
    "hero.download": "COMPIVOX 다운로드", "hero.explore": "기능 살펴보기",
    "intro.label": "COMPIVOX 소개",
    "intro.title": "프로젝트를 분석하고, 알맞게 빌드하고, EXE로 묶습니다",
    "intro.body": "COMPIVOX는 단순히 파일 확장자를 바꾸는 도구가 아닙니다. 프로젝트의 언어와 구조를 분석하고, 필요한 빌드 환경이 갖춰져 있는지 확인한 뒤, 적절한 도구로 Windows 실행 파일을 생성하고 패키징합니다.",
    "how.label": "사용 방법", "how.title": "다섯 단계로 끝납니다",
    "how.s1.t": "프로젝트 가져오기", "how.s1.d": "프로젝트 파일 또는 폴더를 선택합니다.",
    "how.s2.t": "환경 분석", "how.s2.d": "프로젝트 언어, 구조, 의존성 및 필요한 빌드 환경을 분석합니다.",
    "how.s3.t": "빌드 설정", "how.s3.d": "EXE 이름, 아이콘, 아키텍처 등 지원되는 옵션을 설정합니다.",
    "how.s4.t": "앱 빌드", "how.s4.d": "적절한 빌드 도구를 사용해 프로젝트를 빌드합니다.",
    "how.s5.t": "실행 파일 내보내기", "how.s5.d": "생성된 결과물을 확인하고 저장합니다.",
    "support.label": "지원 기술", "support.title": "현재 구현 상태를 그대로 표시합니다",
    "support.body": "아직 구현되지 않은 기술은 지원된다고 표시하지 않습니다.",
    "badge.supported": "지원", "badge.partial": "부분 지원", "badge.planned": "예정",
    "tech.python": "PyInstaller / Nuitka", "tech.dotnet": "dotnet publish", "tech.cpp": "MSVC / CMake", "tech.java": "JDK + jpackage",
    "tech.web": "HTML/CSS/JS 프로젝트 · WebView2 또는 Electron 호스트", "tech.spa": "프로젝트 빌드 후 데스크톱 호스트로 감싸기",
    "tech.netfx": "환경 조건에 따라 제한됨", "tech.php": "런타임 호스트 방식 (실험적)",
    "feat.label": "기능", "feat.title": "빌드 전 과정을 한 화면에서",
    "feat.1.t": "자동 프로젝트 분석", "feat.1.d": "폴더를 읽어 언어와 프로젝트 구조를 판별합니다.",
    "feat.2.t": "빌드 환경 감지", "feat.2.d": "필요한 SDK와 도구가 설치되어 있는지 확인합니다.",
    "feat.3.t": "의존성 점검", "feat.3.d": "빌드 전에 누락된 의존성을 알려줍니다.",
    "feat.4.t": "빌드 설정", "feat.4.d": "EXE 이름, 아이콘, 아키텍처를 지정합니다.",
    "feat.5.t": "EXE 패키징", "feat.5.d": "선택한 도구로 Windows 실행 파일을 생성합니다.",
    "feat.6.t": "빌드 기록", "feat.6.d": "지난 빌드 결과와 로그를 다시 확인할 수 있습니다.",
    "feat.7.t": "결과물 검증", "feat.7.d": "생성된 EXE가 올바른 Windows 실행 파일인지 확인합니다.",
    "price.label": "요금제", "price.title": "FREE와 PRO",
    "price.body": "온라인 결제는 연결되어 있지 않습니다. PRO는 관리자가 수동으로 부여합니다.",
    "price.free.p": "무료 · 월 기본 10회 빌드", "price.pro.p": "관리자 수동 부여 · 결제 미연동",
    "price.free.1": "기본 프로젝트 분석", "price.free.2": "지원되는 언어의 빌드",
    "price.pro.1": "PRO 권한은 관리자가 수동으로 부여합니다. 온라인 결제는 연결되지 않았습니다.",
    "faq.label": "FAQ", "faq.title": "자주 묻는 질문",
    "faq.q1": "COMPIVOX는 무엇인가요?",
    "faq.a1": "프로젝트를 분석하고 필요한 빌드 환경을 확인한 뒤, Windows EXE를 생성하고 패키징하는 데스크톱 프로그램입니다.",
    "faq.q2": "어떤 파일을 지원하나요?",
    "faq.a2": "Python, C#/.NET, C/C++, Java, Go, Rust 프로젝트는 지원됩니다. JavaScript/TypeScript 웹 프로젝트와 React/Vue/Svelte는 부분 지원이며, 일부 확장자는 단독 프로그램이 아닌 리소스로 취급됩니다.",
    "faq.q3": "모든 프로젝트를 EXE로 만들 수 있나요?",
    "faq.a3": "아니요. 지원 상태가 지원 또는 부분 지원인 프로젝트만 빌드할 수 있으며, 프로젝트 구조에 따라 실패할 수 있습니다.",
    "faq.q4": "빌드 도구가 설치되어 있지 않으면 어떻게 하나요?",
    "faq.a4": "분석 화면에서 필요한 도구가 표시됩니다. 안내에 따라 해당 도구를 설치한 뒤 다시 분석하면 됩니다.",
    "faq.q5": "생성된 EXE는 어디에 저장되나요?",
    "faq.a5": "기본적으로 문서 폴더의 DEX Output 폴더에 저장되며, 설정에서 변경할 수 있습니다.",
    "faq.q6": "무료 버전과 PRO 버전의 차이는 무엇인가요?",
    "faq.a6": "기본 FREE는 월 10회 빌드 한도가 있으며 설정에 따라 변경될 수 있습니다. PRO는 관리자가 수동으로 부여하고 온라인 결제는 아직 연결되지 않았습니다.",
    "dl.title": "지금 COMPIVOX를 시작하세요",
    "dl.body": "공식 다운로드 페이지에서 Windows 설치 파일을 받을 수 있습니다.",
    "dl.support": "문의 및 지원",
    "foot.intro": "프로젝트를 Windows 앱으로 간단하게 패키징합니다.",
    "foot.links": "링크", "foot.download": "다운로드", "foot.legal": "법적 고지",
    "foot.terms": "이용약관", "foot.privacy": "개인정보 처리방침", "foot.contact": "문의",
    "foot.service": "서비스 운영 및 개발 안내", "foot.law": "미성년자·법률 안내", "foot.faq": "자주 묻는 질문",
    "foot.copy": "© 2026 COMPIVOX. 모든 권리 보유."
  };

  const EN = {
    skip: "Skip to content",
    "nav.intro": "About", "nav.how": "How it works", "nav.support": "Support", "nav.features": "Features", "nav.pricing": "Pricing", "nav.faq": "FAQ", "nav.security": "Security", "nav.account": "Sign in",
    "sec.label": "Accounts & security", "sec.title": "One account for the website and the app",
    "sec.body": "Sign in to COMPIVOX on the web or in the Windows app with the same account. Every permission check happens on our server.",
    "sec.1.t": "ID-based accounts", "sec.1.d": "Create an account with an ID and password; no email is requested. Sign-up and sign-in include a current-IP confirmation step.",
    "sec.2.t": "Cloudflare Turnstile", "sec.2.d": "Turnstile is used to reduce automated requests on sign-up, sign-in and other sensitive actions.",
    "sec.3.t": "IP and network checks", "sec.3.d": "Your IP address is used for access security, network risk assessment and device registration limits. It is an extra check, not proof of identity.",
    "sec.4.t": "Device management", "sec.4.d": "Each installation gets a random Device ID. You can see and remove your devices from your dashboard.",
    "hero.eyebrow": "Windows project build tool",
    "hero.desc": "Transform your development projects into Windows applications with a streamlined build and packaging experience.",
    "hero.download": "Download COMPIVOX", "hero.explore": "Explore Features",
    "intro.label": "About COMPIVOX",
    "intro.title": "Analyze a project, build it correctly, and package it as an EXE",
    "intro.body": "COMPIVOX is more than a file-extension converter. It analyzes your project's language and structure, checks that the required build environment is available, and then creates and packages a Windows executable with a suitable tool.",
    "how.label": "How it works", "how.title": "Five steps to finish",
    "how.s1.t": "Import Project", "how.s1.d": "Select a project file or folder.",
    "how.s2.t": "Analyze Environment", "how.s2.d": "Check the project language, structure, dependencies, and required build tools.",
    "how.s3.t": "Configure Build", "how.s3.d": "Set the EXE name, icon, architecture, and other supported options.",
    "how.s4.t": "Build Application", "how.s4.d": "Build the project with the appropriate build tool.",
    "how.s5.t": "Export Executable", "how.s5.d": "Review the output and save it.",
    "support.label": "Supported technologies", "support.title": "We show the current implementation status as it is",
    "support.body": "Technologies that are not yet implemented are not marked as supported.",
    "badge.supported": "Supported", "badge.partial": "Partial Support", "badge.planned": "Planned",
    "tech.python": "PyInstaller / Nuitka", "tech.dotnet": "dotnet publish", "tech.cpp": "MSVC / CMake", "tech.java": "JDK + jpackage",
    "tech.web": "HTML/CSS/JS projects · WebView2 or Electron host", "tech.spa": "Build the project, then wrap it in a desktop host",
    "tech.netfx": "Limited depending on the environment", "tech.php": "Runtime host approach (experimental)",
    "feat.label": "Features", "feat.title": "The whole build process in one place",
    "feat.1.t": "Automatic project analysis", "feat.1.d": "Reads the folder and identifies the language and project structure.",
    "feat.2.t": "Build environment detection", "feat.2.d": "Checks whether the required SDKs and tools are installed.",
    "feat.3.t": "Dependency checking", "feat.3.d": "Shows missing dependencies before the build starts.",
    "feat.4.t": "Build configuration", "feat.4.d": "Set the EXE name, icon, and architecture.",
    "feat.5.t": "EXE packaging", "feat.5.d": "Creates a Windows executable with the selected tool.",
    "feat.6.t": "Build history", "feat.6.d": "Review past build results and logs.",
    "feat.7.t": "Output verification", "feat.7.d": "Checks that the generated EXE is a valid Windows executable.",
    "price.label": "Pricing", "price.title": "FREE and PRO",
    "price.body": "Online payment is not connected. PRO access is granted manually by an administrator.",
    "price.free.p": "Free · 10 builds per month by default", "price.pro.p": "Manually granted · no billing",
    "price.free.1": "Basic project analysis", "price.free.2": "Builds for supported languages",
    "price.pro.1": "PRO access is granted manually. Online billing is not connected.",
    "faq.title": "Frequently asked questions", "faq.label": "FAQ",
    "lang.label": "Language",
    "hero.w1": "Build", "hero.w2": "beyond", "hero.w3": "limits.", "hero.aria": "Build beyond limits.",
    "foot.copy": "© 2026 COMPIVOX. All rights reserved.",
    "faq.q1": "What is COMPIVOX?",
    "faq.a1": "It is a desktop program that analyzes a project, checks the required build environment, and then creates and packages a Windows EXE.",
    "faq.q2": "Which files are supported?",
    "faq.a2": "Python, C#/.NET, C/C++, Java, Go, and Rust projects are supported. JavaScript/TypeScript web projects and React/Vue/Svelte are partially supported. Some extensions are treated as resources rather than standalone programs.",
    "faq.q3": "Can every project be turned into an EXE?",
    "faq.a3": "No. Only projects with Supported or Partial Support status can be built, and a build can still fail depending on the project structure.",
    "faq.q4": "What if the build tools are not installed?",
    "faq.a4": "The analysis screen shows which tools are missing. Install them as guided, then analyze again.",
    "faq.q5": "Where is the generated EXE saved?",
    "faq.a5": "By default it is saved in the DEX Output folder inside your Documents folder. You can change this in Settings.",
    "faq.q6": "What is the difference between FREE and PRO?",
    "faq.a6": "FREE defaults to 10 builds per month, subject to configuration. PRO is granted manually; online billing is not connected.",
    "dl.title": "Start with COMPIVOX today",
    "dl.body": "Get the Windows installer from the official download page.",
    "dl.support": "Contact and support",
    "foot.intro": "Package your projects as Windows apps, simply.",
    "foot.links": "Links", "foot.download": "Download", "foot.legal": "Legal",     "foot.terms": "Terms of Service",
        "foot.privacy": "Privacy Policy", "foot.contact": "Contact",
    "foot.service": "Service information", "foot.law": "Legal information", "foot.faq": "FAQ"
  };

  const root = document.documentElement;
  const KEY = "compivox-lang-v2";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const nodes = [...document.querySelectorAll("[data-i18n]")];
  const heroWords = [...document.querySelectorAll(".hero-title .word")];
  const dict = { en: EN, ko: KO };

  function setLang(lang) {
    const isEn = lang === "en";
    const t = dict[isEn ? "en" : "ko"];
    root.lang = isEn ? "en" : "ko";
    nodes.forEach((el) => {
      const val = t[el.dataset.i18n];
      if (val !== undefined) el.textContent = val;
    });
    heroWords.forEach((el, i) => {
      const val = t["hero.w" + (i + 1)];
      if (val !== undefined) el.textContent = val;
    });
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) heroTitle.setAttribute("aria-label", t["hero.aria"]);
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.langBtn === (isEn ? "en" : "ko")));
    });
    try { localStorage.setItem(KEY, isEn ? "en" : "ko"); } catch (_) {}
  }

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.langBtn));
  });

  let saved = "en";
  try { saved = localStorage.getItem(KEY) || "en"; } catch (_) {}
  setLang(saved);

  root.classList.add("reveal-ready");
  const targets = document.querySelectorAll(".section:not(.hero) > *");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
      io.observe(el);
    });
  } else {
    root.classList.remove("reveal-ready");
  }
})();
