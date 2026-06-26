/**
 * Vladyslav Kikhtenko — editorial portfolio
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

async function copyText(text, label) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta); ta.focus(); ta.select();
      const ok = document.execCommand('copy'); ta.remove();
      if (!ok) throw new Error('copy failed');
    }
    showToast(`${label || 'Copied'} copied`);
  } catch (e) {
    showToast('Copy blocked — use the link');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initCarousel();
  initReveal();
  initCopy();
  initClock();
  initYear();
});

/* theme toggle (two versions) */
function initTheme() {
  const btn = document.getElementById('themeBtn');
  const root = document.documentElement;
  if (!root.getAttribute('data-theme')) root.setAttribute('data-theme', 'light');
  if (!btn) return;
  const label = () => btn.setAttribute('aria-label',
    root.getAttribute('data-theme') === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  label();
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    label();
    document.dispatchEvent(new CustomEvent('themechange'));
  });
}

/* mobile nav */
function initMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('topnav');
  if (!btn || !nav) return;
  btn.setAttribute('aria-expanded', 'false');
  const set = (open) => {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  btn.addEventListener('click', () => set(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
}

/* project carousel */
function initCarousel() {
  const stage = document.getElementById('stage');
  const slides = [...document.querySelectorAll('.slide')];
  const dotsWrap = document.getElementById('dots');
  const counter = document.getElementById('counter');
  if (!stage || slides.length === 0) return;
  const root = document.documentElement;
  let i = 0;
  const n = slides.length;

  const tintAttr = () => root.getAttribute('data-theme') === 'dark' ? 'data-tint-dark' : 'data-tint-light';
  const applyTint = () => stage.style.setProperty('--tint', slides[i].getAttribute(tintAttr()));

  const dots = slides.map((s, idx) => {
    const b = document.createElement('button');
    b.className = 'dot' + (idx === 0 ? ' on' : '');
    b.textContent = ('0' + (idx + 1)).slice(-2);
    b.setAttribute('aria-label', 'Project ' + (idx + 1));
    b.addEventListener('click', () => go(idx));
    dotsWrap && dotsWrap.appendChild(b);
    return b;
  });

  function go(to) {
    if (to === i) return;
    const prev = slides[i];
    i = (to + n) % n;
    slides.forEach(s => s.classList.remove('active', 'leaving'));
    prev.classList.add('leaving');
    slides[i].classList.add('active');
    applyTint();
    dots.forEach((d, x) => d.classList.toggle('on', x === i));
    if (counter) counter.textContent = ('0' + (i + 1)).slice(-2) + ' / 0' + n;
  }
  const next = () => go(i + 1);
  const prev = () => go(i - 1);

  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  nextBtn && nextBtn.addEventListener('click', next);
  prevBtn && prevBtn.addEventListener('click', prev);
  applyTint();
  document.addEventListener('themechange', applyTint);

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  let x0 = null;
  stage.addEventListener('pointerdown', e => { x0 = e.clientX; });
  stage.addEventListener('pointerup', e => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    x0 = null;
  });

  // soft parallax on the active slide artwork (desktop, motion-on)
  if (!prefersReducedMotion() && window.matchMedia('(pointer:fine)').matches) {
    stage.addEventListener('pointermove', e => {
      const ghost = slides[i].querySelector('.ghost');
      if (!ghost) return;
      const r = stage.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      ghost.style.transform = `translate(${dx * 18}px, ${dy * 18}px)`;
    });
  }
}

/* reveal on scroll */
function initReveal() {
  const els = [...document.querySelectorAll('.rv')];
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

/* copy buttons */
function initCopy() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => copyText(btn.getAttribute('data-copy'), btn.getAttribute('data-copy-label')));
  });
}

/* Berlin local time — a small human touch */
function initClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' });
  const tick = () => { el.innerHTML = 'Germany · <b>' + fmt.format(new Date()) + '</b> local'; };
  tick();
  setInterval(tick, 30000);
}

function initYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
