const gigs = [
  { date: '2026-10-18', venue: 'The Golden Eagle', place: 'Southsea', time: '4pm', url: 'https://www.goldeneaglesouthsea.co.uk/', photo: 'assets/gallery/golden-eagle-02.webp' }
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
  list.innerHTML = upcoming.map((gig, index) => {
    const date = new Date(`${gig.date}T12:00:00Z`);
    const month = new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'Europe/London' }).format(date);
    const day = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'Europe/London' }).format(date);
    const venueLink = gig.url && safeLink(gig.url);
    return `<article class="gig-poster"><div class="gig-poster-info"><p class="gig-kicker">${index ? 'COMING UP' : 'NEXT UP'} · LIVE IN ${escapeHTML(gig.place || 'PORTSMOUTH').toUpperCase()}</p><div class="gig-poster-date"><time datetime="${gig.date}"><strong>${date.getUTCDate()}</strong><span>${month}<small>${date.getUTCFullYear()}</small></span></time><span class="gig-weekday">${day}</span></div><h2>${escapeHTML(gig.venue)}</h2><p class="gig-place">${escapeHTML(gig.place || 'Portsmouth')}</p>${gig.time ? `<p class="gig-time">${escapeHTML(gig.time)}</p>` : ''}<div class="gig-poster-links">${venueLink ? `<a href="${escapeHTML(venueLink)}" target="_blank" rel="noopener noreferrer">FIND THE VENUE →</a>` : ''}<a href="https://www.facebook.com/harbourtownband1" target="_blank" rel="noopener noreferrer">GIG UPDATES →</a></div></div>${gig.photo ? `<div class="gig-poster-photo"><img src="${escapeHTML(gig.photo)}" alt="Harbour Town performing at ${escapeHTML(gig.venue)}" loading="lazy"></div>` : ''}</article>`;
  }).join('');
}
if (list && !upcoming.length) {
  list.innerHTML = '<p class="no-gigs">New dates will appear here. Follow us on <a href="https://www.facebook.com/harbourtownband1" target="_blank" rel="noopener noreferrer">Facebook</a> for updates.</p>';
  document.querySelector('.gigs-intro h2').innerHTML = 'More dates<br><em>soon.</em>';
}
const preview = document.querySelector('[data-gigs-preview]');
if (preview) {
  preview.innerHTML = upcoming.slice(0, 2).map(gig => {
    const formatted = dateFormat.format(new Date(`${gig.date}T12:00:00Z`));
    const short = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'Europe/London' }).format(new Date(`${gig.date}T12:00:00Z`));
    const [day, month] = short.split(' ');
    return `<div class="ribbon-gig"><time datetime="${gig.date}" aria-label="${formatted}">${day}<span>${month}</span></time><div><strong>${escapeHTML(gig.venue)}</strong><small>${escapeHTML(gig.place || '')}${gig.time ? ' · Around 4pm' : ''}</small></div></div>`;
  }).join('') || '<span class="ribbon-empty">New gigs will appear here.</span>';
  if (!upcoming.length) document.querySelector('.ribbon-heading small').textContent = 'NEW DATES SOON';
}

const slides = [...document.querySelectorAll('.hero-slide')];
const hero = document.querySelector('.full-hero');
if (hero) {
  const updateHeroHeight = () => {
    const header = document.querySelector('.site-header');
    const ribbon = document.querySelector('.gig-ribbon');
    const occupied = (header?.getBoundingClientRect().height || 0) + (ribbon?.getBoundingClientRect().height || 0);
    hero.style.setProperty('--top-stack-height', `${occupied}px`);
  };
  updateHeroHeight();
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(updateHeroHeight);
    observer.observe(document.querySelector('.site-header'));
    observer.observe(document.querySelector('.gig-ribbon'));
  } else window.addEventListener('resize', updateHeroHeight);
}
const revealTargets = document.querySelectorAll('.record-copy, .record-grid .full-album, .about-home-grid > *, .watch-grid > *, .photo-home-head, .photo-home-grid a');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealTargets.forEach(element => element.classList.add('will-reveal'));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });
  revealTargets.forEach(element => revealObserver.observe(element));
}
const homeStory = document.querySelector('.home-story');
if (homeStory) {
  const svg = homeStory.querySelector('.story-route');
  const dots = svg.querySelector('.story-route__dots');
  const progress = svg.querySelector('.story-route__progress');
  const traveller = svg.querySelector('.story-route__traveller');
  const markers = [...homeStory.querySelectorAll('.story-marker')];
  let routeFrame = 0;
  let length = 0;
  const drawRoute = () => {
    const storyRect = homeStory.getBoundingClientRect();
    const points = markers.map(marker => {
      const rect = marker.getBoundingClientRect();
      const section = marker.closest('section').getBoundingClientRect();
      return {
        x: rect.left - storyRect.left + rect.width / 2,
        y: rect.top - storyRect.top + rect.height / 2,
        sectionTop: section.top - storyRect.top,
        side: rect.left - storyRect.left + rect.width / 2 < storyRect.width / 2 ? 30 : storyRect.width - 30
      };
    });
    svg.setAttribute('viewBox', `0 0 ${storyRect.width} ${storyRect.height}`);
    if (points.length < 2) return;
    let path = `M ${points[0].side} ${points[0].y}`;
    for (let index = 0; index < points.length - 1; index++) {
      const point = points[index];
      const next = points[index + 1];
      const boundary = next.sectionTop;
      path += ` L ${point.side} ${boundary - 115}`;
      path += ` C ${point.side} ${boundary - 35}, ${next.side} ${boundary + 35}, ${next.side} ${boundary + 115}`;
      path += ` L ${next.side} ${next.y}`;
    }
    dots.setAttribute('d', path);
    progress.setAttribute('d', path);
    length = progress.getTotalLength();
    updateRoute();
  };
  const updateRoute = () => {
    routeFrame = 0;
    if (!length) return;
    const bounds = homeStory.getBoundingClientRect();
    const travelled = Math.max(0, Math.min(1, (window.innerHeight * .55 - bounds.top) / bounds.height));
    const position = Math.min(length, travelled * length);
    progress.style.strokeDasharray = `${position} ${length + 1}`;
    const point = progress.getPointAtLength(position);
    traveller.setAttribute('cx', point.x);
    traveller.setAttribute('cy', point.y);
  };
  const requestRoute = () => {
    if (!routeFrame) routeFrame = requestAnimationFrame(updateRoute);
  };
  drawRoute();
  window.addEventListener('load', drawRoute);
  window.addEventListener('resize', drawRoute);
  window.addEventListener('scroll', requestRoute, { passive: true });
}
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

const galleryDialog = document.querySelector('.gallery-dialog');
const galleryButtons = [...document.querySelectorAll('[data-gallery-open]')];
if (galleryDialog && galleryButtons.length && typeof galleryDialog.showModal === 'function') {
  const photo = galleryDialog.querySelector('img');
  const caption = galleryDialog.querySelector('figcaption');
  let selected = 0;
  let opener;
  const showPhoto = index => {
    selected = (index + galleryButtons.length) % galleryButtons.length;
    const source = galleryButtons[selected].querySelector('img');
    photo.src = source.src;
    photo.alt = source.alt;
    caption.textContent = `${source.closest('.gallery-group').querySelector('h2').textContent} · ${selected + 1} / ${galleryButtons.length}`;
  };
  galleryButtons.forEach((button, index) => button.addEventListener('click', () => {
    opener = button;
    showPhoto(index);
    galleryDialog.showModal();
  }));
  galleryDialog.querySelector('.gallery-close').addEventListener('click', () => galleryDialog.close());
  galleryDialog.querySelector('.gallery-prev').addEventListener('click', () => showPhoto(selected - 1));
  galleryDialog.querySelector('.gallery-next').addEventListener('click', () => showPhoto(selected + 1));
  galleryDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(selected - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(selected + 1); }
  });
  galleryDialog.addEventListener('click', event => { if (event.target === galleryDialog) galleryDialog.close(); });
  galleryDialog.addEventListener('close', () => opener?.focus());
}
