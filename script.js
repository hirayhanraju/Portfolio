(function () {
  const root = document.documentElement;

  /* Theme */
  const setTheme = dark => { root.classList.toggle('rr-dark', dark); try { localStorage.setItem('rr-theme', dark ? 'dark' : 'light'); } catch (e) {} };
  document.querySelectorAll('[data-theme-toggle]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault(); setTheme(!root.classList.contains('rr-dark'));
  }));

  /* Toast */
  const toast = document.createElement('div');
  toast.className = 'toast'; document.body.appendChild(toast);
  let tt;
  const say = msg => { toast.textContent = msg; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 1800); };

  /* Copy mail */
  document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const v = b.dataset.copy;
    try { await navigator.clipboard.writeText(v); say('Email copied'); } catch (e) { say(v); }
  }));

  /* Entrance */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .08 });
  document.querySelectorAll('.rise').forEach((el, i) => { el.style.transitionDelay = Math.min(i, 4) * 60 + 'ms'; io.observe(el); });

  /* "See project" cursor */
  const see = document.querySelector('.see');
  if (see) {
    let x = 0, y = 0, cx = 0, cy = 0, raf;
    const loop = () => { cx += (x - cx) * .25; cy += (y - cy) * .25; see.style.left = cx + 'px'; see.style.top = cy + 'px'; raf = requestAnimationFrame(loop); };
    document.querySelectorAll('.project .shot').forEach(s => {
      s.addEventListener('mouseenter', e => { x = cx = e.clientX; y = cy = e.clientY; see.classList.add('show'); cancelAnimationFrame(raf); loop(); });
      s.addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
      s.addEventListener('mouseleave', () => { see.classList.remove('show'); cancelAnimationFrame(raf); });
    });
  }

  /* Kind words */
  const data = window.KIND_WORDS;
  const card = document.querySelector('.kind');
  if (data && card) {
    let cur = 0;
    const avs = [...card.querySelectorAll('.av')];
    const q = card.querySelector('blockquote'), nm = card.querySelector('.cap b'), rl = card.querySelector('.cap span'), fig = card.querySelector('.fig');
    const ov = document.querySelector('.overlay');
    const mTxt = ov.querySelector('.txt'), mAv = ov.querySelector('.who .av'), mNm = ov.querySelector('.who b'), mRl = ov.querySelector('.who span'), mCt = ov.querySelector('.count');
    const avHTML = d => d.img ? `<img src="${d.img}" alt="" onerror="this.parentNode.textContent='${d.initials}'">` : d.initials;
    const show = i => {
      cur = (i + data.length) % data.length; const d = data[cur];
      avs.forEach((a, k) => a.classList.toggle('on', k === cur));
      q.textContent = '“' + d.short + '”'; nm.textContent = d.name; rl.textContent = d.role;
      fig.classList.remove('fade'); void fig.offsetWidth; fig.classList.add('fade');
      mTxt.innerHTML = d.full.map(p => `<p>${p}</p>`).join('');
      mAv.innerHTML = avHTML(d); mNm.textContent = d.name; mRl.textContent = d.role;
      mCt.textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(data.length).padStart(2, '0');
    };
    avs.forEach((a, k) => { a.innerHTML = avHTML(data[k]); a.addEventListener('click', () => show(k)); });
    const open = () => { ov.classList.add('open'); ov.setAttribute('aria-hidden', 'false'); ov.querySelector('[data-next]').focus({ preventScroll: true }); };
    const close = () => { ov.classList.remove('open'); ov.setAttribute('aria-hidden', 'true'); };
    card.querySelector('.readfull').addEventListener('click', open);
    ov.querySelector('[data-prev]').addEventListener('click', () => show(cur - 1));
    ov.querySelector('[data-next]').addEventListener('click', () => show(cur + 1));
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    addEventListener('keydown', e => {
      if (!ov.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(cur + 1);
      if (e.key === 'ArrowLeft') show(cur - 1);
    });
    show(0);

    /* Auto-rotate every 3s. Pauses only while a mouse hovers the card (desktop) or the popup is open. */
    const DUR = 3000, bar = card.querySelector('.prog i');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    let timer, hovering = false;
    const runBar = () => { if (!bar) return; bar.classList.remove('run'); void bar.offsetWidth; bar.style.setProperty('--dur', DUR + 'ms'); bar.classList.add('run'); };
    const stop = () => { clearInterval(timer); if (bar) bar.classList.remove('run'); };
    const start = () => {
      stop(); if (reduce || hovering || ov.classList.contains('open') || document.hidden) return;
      runBar(); timer = setInterval(() => { show(cur + 1); runBar(); }, DUR);
    };
    if (canHover) {
      card.addEventListener('mouseenter', () => { hovering = true; stop(); });
      card.addEventListener('mouseleave', () => { hovering = false; start(); });
    }
    avs.forEach(a => a.addEventListener('click', start));
    new MutationObserver(start).observe(ov, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', start);
    start();
  }
})();

/* Case study TOC scrollspy */
(function () {
  const links = [...document.querySelectorAll('.toc a')];
  if (!links.length) return;
  const secs = links.map(a => document.querySelector(a.getAttribute('href')));
  const set = id => links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + id));
  const spy = () => {
    let cur = secs[0].id;
    secs.forEach(s => { if (s.getBoundingClientRect().top < innerHeight * .3) cur = s.id; });
    if (innerHeight + scrollY >= document.body.scrollHeight - 4) cur = secs[secs.length - 1].id;
    set(cur);
  };
  links.forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  addEventListener('scroll', spy, { passive: true }); spy();
})();

