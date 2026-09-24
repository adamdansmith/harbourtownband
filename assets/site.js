// DESIGN PREVIEW ONLY. Replace these examples with confirmed gigs before publishing.
// Keep demo: true on examples so visitors can see they are not real events.
const gigs = [
  { date: '2026-11-14', venue: 'The Golden Eagle', place: 'Southsea', demo: true },
  { date: '2026-12-05', venue: 'The Barley Mow', place: 'Southsea', demo: true }
];

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');
if (menuButton && nav) {
  const closeMenu = () => {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('.menu-label').textContent = 'Menu';
  };
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => { if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });
}

const upcoming = gigs
  .filter(gig => /^\d{4}-\d{2}-\d{2}$/.test(gig.date) && gig.date >= new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/London' }))
  .sort((a, b) => a.date.localeCompare(b.date));
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' });
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const safeLink = url => { try { const parsed = new URL(url); return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : null; } catch { return null; } };
const list = document.querySelector('[data-gigs-list]');
if (list && upcoming.length) {
  list.innerHTML = upcoming.map(gig => {
    const date = dateFormat.format(new Date(`${gig.date}T12:00:00Z`));
    const link = gig.url && !gig.demo && safeLink(gig.url);
    return `<article class="gig-row${gig.demo ? ' is-demo' : ''}"><time datetime="${gig.date}">${date}</time><div><h3>${escapeHTML(gig.venue)}</h3><p>${escapeHTML(gig.place || '')}</p>${gig.demo ? '<span class="demo-tag">Example date · not a real gig</span>' : ''}</div>${link ? `<a href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">Details ↗</a>` : ''}</article>`;
  }).join('');
}
const preview = document.querySelector('[data-gigs-preview]');
if (preview) {
  preview.innerHTML = upcoming.slice(0, 2).map(gig => {
    const formatted = dateFormat.format(new Date(`${gig.date}T12:00:00Z`));
    const short = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'Europe/London' }).format(new Date(`${gig.date}T12:00:00Z`));
    const [day, month] = short.split(' ');
    return `<div class="ribbon-gig"><time datetime="${gig.date}" aria-label="${formatted}">${day}<span>${month}</span></time><div><strong>${escapeHTML(gig.venue)}</strong><small>${escapeHTML(gig.place || '')}${gig.demo ? ' · Example' : ''}</small></div></div>`;
  }).join('') || '<span class="ribbon-empty">New gigs will appear here.</span>';
}

const slides = [...document.querySelectorAll('.hero-slide')];
if (slides.length > 1) {
  let active = 0;
  let timer;
  const count = document.getElementById('slideCount');
  const showSlide = index => {
    slides[active].classList.remove('active');
    active = (index + slides.length) % slides.length;
    slides[active].classList.add('active');
    if (count) count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };
  const start = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(active + 1), 7500);
  };
  document.getElementById('prevSlide')?.addEventListener('click', () => { showSlide(active - 1); start(); });
  document.getElementById('nextSlide')?.addEventListener('click', () => { showSlide(active + 1); start(); });
  start();
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
