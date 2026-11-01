(() => {
  const EN = {
    skip: "Skip to content",
    "nav.intro": "About", "nav.how": "How it works", "nav.support": "Support", "nav.features": "Features", "nav.pricing": "Pricing", "nav.faq": "FAQ",
    "hero.eyebrow": "Windows project build tool",
    "hero.sub": "Turn your projects into Windows apps, more simply.",
    "hero.desc": "Turn your development projects into Windows applications with a streamlined building and packaging experience.",
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
    "price.body": "Pricing and PRO benefits are not finalized yet. We will publish them here once they are confirmed.",
    "price.free.p": "Price to be announced", "price.pro.p": "Coming soon",
    "price.free.1": "Basic project analysis", "price.free.2": "Builds for supported languages",
    "price.pro.1": "Additional features will be confirmed at launch",
    "faq.title": "Frequently asked questions",
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
    "faq.a6": "PRO benefits are not finalized yet. Once confirmed, they will be described in the Pricing section.",
    "dl.title": "Start with COMPIVOX today",
    "dl.body": "The download link will be connected when the official release file is ready.",
    "dl.support": "Contact and support",
    "foot.intro": "Package your projects as Windows apps, simply.",
    "foot.links": "Links", "foot.download": "Download", "foot.legal": "Legal", "foot.terms": "Terms of Service (coming soon)",
    "foot.privacy": "Privacy Policy (coming soon)", "foot.contact": "Contact"
  };

  const root = document.documentElement;
  const KEY = "compivox-lang";
  const INTRO_KEY = "compivox-intro-seen";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const nodes = [...document.querySelectorAll("[data-i18n]")];
  nodes.forEach((el) => { el.dataset.ko = el.textContent; });

  function setLang(lang) {
    const isEn = lang === "en";
    root.lang = isEn ? "en" : "ko";
    nodes.forEach((el) => {
      const key = el.dataset.i18n;
      el.textContent = isEn && EN[key] ? EN[key] : el.dataset.ko;
    });
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.langBtn === (isEn ? "en" : "ko")));
    });
    try { localStorage.setItem(KEY, isEn ? "en" : "ko"); } catch (_) {}
  }

  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.langBtn));
  });

  let saved = "ko";
  try { saved = localStorage.getItem(KEY) || "ko"; } catch (_) {}
  setLang(saved);

  let introSeen = false;
  try { introSeen = sessionStorage.getItem(INTRO_KEY) === "1"; } catch (_) {}
  if (introSeen || reduceMotion) {
    root.classList.add("intro-done");
  } else {
    root.classList.add("intro-run");
    try { sessionStorage.setItem(INTRO_KEY, "1"); } catch (_) {}
  }

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
