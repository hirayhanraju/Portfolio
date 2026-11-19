/* Soft animated gradient wave for the Home hero (canvas, no libraries) */
(function () {
  const cv = document.getElementById('wave');
  if (!cv) return;
  const ctx = cv.getContext('2d');
    // Low internal resolution + CSS upscaling = naturally soft, cheap to draw
  const W = 220, H = 140;
  cv.width = W; cv.height = H;

  const stops = [            // position across the ribbon, top -> bottom (soft, many stops)
    [0.00, 'rgba(255,238,190,0)'],
    [0.12, 'rgba(255,232,180,.45)'],
    [0.26, 'rgba(255,214,176,.75)'],  // peach
    [0.40, 'rgba(255,184,198,.85)'],  // pink
    [0.54, 'rgba(226,170,236,.85)'],  // orchid
    [0.68, 'rgba(184,166,255,.80)'],  // lavender
    [0.82, 'rgba(160,188,255,.50)'],  // soft blue
    [1.00, 'rgba(160,188,255,0)']
  ];

  function frame(t) {
    const s = t / 1000;
    ctx.clearRect(0, 0, W, H);
    // faint blue wash at the very top
    const wash = ctx.createLinearGradient(0, 0, 0, H);
    wash.addColorStop(0, 'rgba(205,220,255,.55)');
    wash.addColorStop(.55, 'rgba(205,220,255,0)');
    ctx.fillStyle = wash; ctx.fillRect(0, 0, W, H);

    for (let x = 0; x < W; x++) {
      const u = x / W;
      // gentle: small up/down so the ribbon drifts rather than waves
      const center = H * 0.28
        + Math.sin(u * 3.8 + s * 0.85) * H * 0.095
        + Math.sin(u * 1.9 - s * 0.55 + 1.3) * H * 0.055;
      const thick = H * (0.38 + 0.03 * Math.sin(u * 2.4 + s * 0.35));
      const top = center - thick / 2;
      const g = ctx.createLinearGradient(0, top, 0, top + thick);
      for (const [p, c] of stops) g.addColorStop(p, c);
      ctx.fillStyle = g;
      ctx.fillRect(x, top, 1.6, thick);
    }
  }

  let raf, visible = true;
  const loop = t => { frame(t); raf = requestAnimationFrame(loop); };
  const play = () => { cancelAnimationFrame(raf); if (!visible || document.hidden) { frame(8000); return; } raf = requestAnimationFrame(loop); };
  new IntersectionObserver(e => { visible = e[0].isIntersecting; play(); }).observe(cv);
  document.addEventListener('visibilitychange', play);
  play();
})();
