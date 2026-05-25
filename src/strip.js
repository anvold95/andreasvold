/* ─────────────────────────────────────────────
   plate scroller — arrows + dots
   ───────────────────────────────────────────── */
(function () {
  const strip = document.querySelector('.plates-strip');
  const nav   = document.querySelector('.strip-nav');
  if (!strip || !nav) return;

  const plates = Array.from(strip.querySelectorAll('.plate'));
  if (plates.length < 2) { nav.style.display = 'none'; return; }

  const prev = nav.querySelector('[data-prev]');
  const next = nav.querySelector('[data-next]');
  const dotsHost = nav.querySelector('.pages');
  const counter = nav.querySelector('.counter');

  // build dots
  plates.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'dot';
    d.addEventListener('click', () => goTo(i));
    dotsHost.appendChild(d);
  });
  const dots = Array.from(dotsHost.querySelectorAll('.dot'));

  function currentIndex() {
    const rect = strip.getBoundingClientRect();
    const centre = rect.left + rect.width / 2;
    let best = 0, bestDist = Infinity;
    plates.forEach((p, i) => {
      const pr = p.getBoundingClientRect();
      const pc = pr.left + pr.width / 2;
      const d = Math.abs(pc - centre);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  function update() {
    const i = currentIndex();
    dots.forEach((d, n) => d.classList.toggle('active', n === i));
    if (counter) counter.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(plates.length).padStart(2, '0');
    if (prev) prev.disabled = i <= 0;
    if (next) next.disabled = i >= plates.length - 1;
  }

  function goTo(i) {
    i = Math.max(0, Math.min(plates.length - 1, i));
    plates[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }

  prev && prev.addEventListener('click', () => goTo(currentIndex() - 1));
  next && next.addEventListener('click', () => goTo(currentIndex() + 1));

  let raf = 0;
  strip.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  });

  // arrow keys
  window.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(currentIndex() + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(currentIndex() - 1); }
  });

  update();
})();
