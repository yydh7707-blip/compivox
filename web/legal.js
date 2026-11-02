(() => {
  const list = document.getElementById("legal-toc-list");
  if (!list) return;

  const sections = [...document.querySelectorAll(".legal-section[id]")];
  const items = new Map();
  for (const section of sections) {
    const heading = section.querySelector("h2");
    if (!heading) continue;
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${section.id}`;
    link.textContent = heading.textContent.replace(/^(?:제\d+조\s*|\d+[.)]\s*)/, "");
    item.append(link);
    list.append(item);
    items.set(section, item);
  }

  if (!("IntersectionObserver" in window)) {
    if (sections.length) items.get(sections[0])?.setAttribute("aria-current", "location");
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const item of items.values()) item.removeAttribute("aria-current");
      items.get(entry.target)?.setAttribute("aria-current", "location");
    }
  }, { rootMargin: "-15% 0px -70% 0px" });
  sections.forEach((section) => observer.observe(section));
})();
