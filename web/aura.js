(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var root = document.documentElement;
  var tx = 0, ty = 0, cx = 0, cy = 0, queued = false;

  function frame() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    root.style.setProperty('--mx', cx.toFixed(2) + 'px');
    root.style.setProperty('--my', cy.toFixed(2) + 'px');
    if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
      requestAnimationFrame(frame);
    } else {
      queued = false;
    }
  }

  window.addEventListener('pointermove', function (e) {
    tx = (e.clientX / window.innerWidth - 0.5) * 80;
    ty = (e.clientY / window.innerHeight - 0.5) * 60;
    if (!queued) {
      queued = true;
      requestAnimationFrame(frame);
    }
  }, { passive: true });
})();
