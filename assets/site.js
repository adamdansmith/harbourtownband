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

const renderGigs = entries => {
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/London' });
const validGigs = entries.filter(gig => /^\d{4}-\d{2}-\d{2}$/.test(gig.date));
const upcoming = validGigs
  .filter(gig => !gig.archived && gig.date >= today)
  .sort((a, b) => a.date.localeCompare(b.date));
const archived = validGigs
  .filter(gig => gig.archived || gig.date < today)
  .sort((a, b) => b.date.localeCompare(a.date));
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
    if (index) return `<article class="gig-card"><div class="gig-card-date"><time datetime="${gig.date}"><strong>${date.getUTCDate()}</strong><span>${month}</span></time><small>${date.getUTCFullYear()}</small></div><div class="gig-card-body"><p class="gig-card-when">${day}${gig.time ? ` <span aria-hidden="true">·</span> ${escapeHTML(gig.time)}` : ''}</p><h2>${escapeHTML(gig.venue)}</h2><p class="gig-card-place">${escapeHTML(gig.place || 'Portsmouth')}</p><div class="gig-card-links">${venueLink ? `<a href="${escapeHTML(venueLink)}" target="_blank" rel="noopener noreferrer">FIND THE VENUE →</a>` : ''}<a href="https://www.facebook.com/harbourtownband1" target="_blank" rel="noopener noreferrer">GIG UPDATES →</a></div></div></article>`;
    return `<article class="gig-poster"><div class="gig-poster-info"><p class="gig-kicker">NEXT UP · LIVE IN ${escapeHTML(gig.place || 'PORTSMOUTH').toUpperCase()}</p><div class="gig-poster-date"><time datetime="${gig.date}"><strong>${date.getUTCDate()}</strong><span>${month}<small>${date.getUTCFullYear()}</small></span></time></div><p class="gig-when"><span>${day}</span>${gig.time ? `<span>${escapeHTML(gig.time)}</span>` : ''}</p><h2>${escapeHTML(gig.venue)}</h2><p class="gig-place">${escapeHTML(gig.place || 'Portsmouth')}</p><div class="gig-poster-links">${venueLink ? `<a href="${escapeHTML(venueLink)}" target="_blank" rel="noopener noreferrer">FIND THE VENUE →</a>` : ''}<a href="https://www.facebook.com/harbourtownband1" target="_blank" rel="noopener noreferrer">GIG UPDATES →</a></div></div>${gig.photo ? `<div class="gig-poster-photo"><img src="${escapeHTML(gig.photo)}" alt="Harbour Town performing at ${escapeHTML(gig.venue)}" loading="lazy"></div>` : ''}</article>`;
  }).join('');
}
if (list && !upcoming.length) {
  list.innerHTML = '<p class="no-gigs">New dates will appear here. Follow us on <a href="https://www.facebook.com/harbourtownband1" target="_blank" rel="noopener noreferrer">Facebook</a> for updates.</p>';
  document.querySelector('.gigs-intro h2').innerHTML = 'More dates<br><em>soon.</em>';
}
const archive = document.querySelector('[data-gigs-archive]');
if (archive) {
  archive.hidden = archived.length === 0;
  if (!archived.length) archive.open = false;
  archive.querySelector('[data-archive-count]').textContent = `${archived.length} ${archived.length === 1 ? 'gig' : 'gigs'}`;
  archive.querySelector('[data-archive-list]').innerHTML = archived.length
    ? archived.map(gig => {
      const date = new Date(`${gig.date}T12:00:00Z`);
      return `<li class="archive-gig"><time datetime="${gig.date}">${dateFormat.format(date)}</time><div><strong>${escapeHTML(gig.venue)}</strong><span>${escapeHTML(gig.place || 'Portsmouth')}${gig.time ? ` · ${escapeHTML(gig.time)}` : ''}</span></div></li>`;
    }).join('')
    : '';
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

};
renderGigs(gigs);
fetch('/api/gigs', { cache: 'no-store' })
  .then(response => { if (!response.ok) throw Error('Gig storage unavailable'); return response.json(); })
  .then(data => { if (Array.isArray(data)) renderGigs(data); })
  .catch(() => { /* Keep the confirmed dates bundled with the static site. */ });

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
const storyHeadings = document.querySelectorAll('.home-story h2');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  storyHeadings.forEach(heading => heading.classList.add('story-enter'));
  const headingObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      headingObserver.unobserve(entry.target);
    });
  }, { threshold: .2, rootMargin: '0px 0px -25px 0px' });
  storyHeadings.forEach(heading => headingObserver.observe(heading));
}
const innerTargets = document.querySelectorAll('.subhero-copy h1, .member-profile, .gallery-group-heading, .gallery-item, .video-item, .music-album-grid > *, .gig-poster, .contact-page-grid > *');
const innerStops = [...document.querySelectorAll('.inner-stop')];
if (innerStops.length) {
  let stopFrame = 0;
  const updateInnerStops = () => {
    stopFrame = 0;
    innerStops.forEach(stop => stop.classList.toggle('is-passed', stop.getBoundingClientRect().top <= innerHeight * .55));
  };
  const requestInnerStops = () => {
    if (!stopFrame) stopFrame = requestAnimationFrame(updateInnerStops);
  };
  updateInnerStops();
  window.addEventListener('scroll', requestInnerStops, { passive: true });
  window.addEventListener('resize', requestInnerStops);
}
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  innerTargets.forEach(element => element.classList.add(element.matches('.subhero-copy h1') ? 'inner-enter' : 'inner-reveal'));
  const innerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      innerObserver.unobserve(entry.target);
    });
  }, { threshold: .06, rootMargin: '0px 0px -20px 0px' });
  innerTargets.forEach(element => innerObserver.observe(element));
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
