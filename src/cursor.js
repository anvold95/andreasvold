/* ─────────────────────────────────────────────
   fun cursor — sparkles · glow · register marks
   ───────────────────────────────────────────── */
(function () {
  const MODES = ['sparkles', 'glow', 'marks', 'off'];
  const LABELS = {
    sparkles: '✦ sparkles',
    glow:     '✺ glow',
    marks:    '+ marks',
    off:      '○ off',
  };

  // ── canvas ──
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function size() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  window.addEventListener('resize', size);

  // ── state ──
  let mode = 'sparkles';
  let mx = -100, my = -100;          // mouse
  let gx = -100, gy = -100;          // smoothed (glow)
  const particles = [];               // {x,y,vx,vy,life,maxLife,kind,color}

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;

    if (mode === 'sparkles') {
      if (Math.random() < 0.45) spawnSparkle();
    } else if (mode === 'marks') {
      if (Math.random() < 0.18) spawnMark();
    }
  });

  function spawnSparkle() {
    particles.push({
      kind: 'sparkle',
      x: mx + (Math.random() - 0.5) * 14,
      y: my + (Math.random() - 0.5) * 14,
      vx: (Math.random() - 0.5) * 0.6,
      vy: 0.4 + Math.random() * 0.8,
      rot: Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 0.08,
      size: 2 + Math.random() * 4,
      life: 0,
      maxLife: 700 + Math.random() * 600,
    });
  }
  function spawnMark() {
    const colors = ['#00b1e8','#ec008c','#ffd600','#f2f2f2']; // CMYK + K
    particles.push({
      kind: 'mark',
      x: mx + (Math.random() - 0.5) * 30,
      y: my + (Math.random() - 0.5) * 30,
      vx: 0, vy: 0,
      size: 6 + Math.random() * 4,
      life: 0,
      maxLife: 900 + Math.random() * 500,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  // ── render loop ──
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(40, now - last);
    last = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mode === 'glow') {
      // smooth follow with spring
      gx += (mx - gx) * 0.18;
      gy += (my - gy) * 0.18;
      // soft warm glow halo
      const r1 = ctx.createRadialGradient(gx, gy, 0, gx, gy, 80);
      r1.addColorStop(0,   'rgba(255,220,180,0.55)');
      r1.addColorStop(0.35,'rgba(255,200,140,0.18)');
      r1.addColorStop(1,   'rgba(255,200,140,0)');
      ctx.fillStyle = r1;
      ctx.fillRect(gx - 80, gy - 80, 160, 160);
      // inner bright dot
      const r2 = ctx.createRadialGradient(gx, gy, 0, gx, gy, 14);
      r2.addColorStop(0,'rgba(255,255,240,0.95)');
      r2.addColorStop(1,'rgba(255,255,240,0)');
      ctx.fillStyle = r2;
      ctx.fillRect(gx - 14, gy - 14, 28, 28);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) { particles.splice(i, 1); continue; }
      const t = p.life / p.maxLife;
      const alpha = 1 - t;
      p.x += p.vx * dt * 0.06;
      p.y += p.vy * dt * 0.06;

      if (p.kind === 'sparkle') {
        p.rot += p.vrot;
        const s = p.size * (1 - t * 0.4);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `rgba(255,250,220,${alpha})`;
        // 4-point star
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(0.3, -0.3, s, 0);
        ctx.quadraticCurveTo(0.3, 0.3, 0, s);
        ctx.quadraticCurveTo(-0.3, 0.3, -s, 0);
        ctx.quadraticCurveTo(-0.3, -0.3, 0, -s);
        ctx.closePath();
        ctx.fill();
        // tiny center
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (p.kind === 'mark') {
        const s = p.size;
        const a = alpha * 0.9;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = a;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
        ctx.moveTo(0, -s); ctx.lineTo(0, s);
        ctx.stroke();
        ctx.restore();
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  // (mode picker removed — sparkles only)
})();
