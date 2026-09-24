// Add confirmed shows here using ISO dates. Past shows are hidden automatically.
// Example: { date: '2027-05-22', venue: 'Venue name', place: 'Southsea', url: 'https://...' }
const gigs = [];

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
    const link = gig.url && safeLink(gig.url);
    return `<article class="gig-row"><time datetime="${gig.date}">${date}</time><div><h3>${escapeHTML(gig.venue)}</h3><p>${escapeHTML(gig.place || '')}</p></div>${link ? `<a href="${escapeHTML(link)}" target="_blank" rel="noopener noreferrer">Details ↗</a>` : ''}</article>`;
  }).join('');
}
const preview = document.querySelector('[data-gigs-preview]');
if (preview && upcoming.length) {
  const gig = upcoming[0];
  preview.innerHTML = `<span class="preview-label">Next up</span><div class="preview-gig"><time datetime="${gig.date}">${dateFormat.format(new Date(`${gig.date}T12:00:00Z`))}</time><div><strong>${escapeHTML(gig.venue)}</strong><span>${escapeHTML(gig.place || '')}</span></div></div>`;
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
