(function () {
  var root = document.documentElement;
  var seen = false, reduce = false;
  try {
    seen = sessionStorage.getItem("compivox-intro-seen") === "1";
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (_) {}
  if (seen || reduce) {
    root.classList.add("intro-done");
  } else {
    root.classList.add("intro-run");
    try { sessionStorage.setItem("compivox-intro-seen", "1"); } catch (_) {}
  }
})();
