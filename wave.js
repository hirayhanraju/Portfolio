/* Soft animated gradient wave for the Home hero (canvas, no libraries) */
(function () {
  const cv = document.getElementById('wave');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Low internal resolution + CSS upscaling = naturally soft, cheap to draw
  const W = 220, H = 140;
  cv.width = W; cv.height = H;

  const stops = [            // position across the ribbon, top -> bottom
    [0.00, 'rgba(255,236,170,0)'],
    [0.20, 'rgba(255,226,160,.85)'],  // warm yellow
    [0.42, 'rgba(255,170,190,.95)'],  // pink
    [0.66, 'rgba(176,160,255,.95)'],  // lavender
    [0.84, 'rgba(150,185,255,.55)'],  // soft blue
    [1.00, 'rgba(150,185,255,0)']
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
      const center = H * 0.36
        + Math.sin(u * 5.2 + s * 0.55) * H * 0.16
        + Math.sin(u * 2.3 - s * 0.35 + 1.3) * H * 0.10;
      const thick = H * (0.30 + 0.08 * Math.sin(u * 3.1 + s * 0.4));
      const top = center - thick / 2;
      const g = ctx.createLinearGradient(0, top, 0, top + thick);
      for (const [p, c] of stops) g.addColorStop(p, c);
      ctx.fillStyle = g;
      ctx.fillRect(x, top, 1.6, thick);
    }
  }

  let raf, visible = true;
  const loop = t => { frame(t); raf = requestAnimationFrame(loop); };
  const play = () => { cancelAnimationFrame(raf); if (reduce || !visible || document.hidden) { frame(8000); return; } raf = requestAnimationFrame(loop); };
  new IntersectionObserver(e => { visible = e[0].isIntersecting; play(); }).observe(cv);
  document.addEventListener('visibilitychange', play);
  play();
})();
