const feedback = document.querySelector('[data-feedback]');
const report = (message, error = false) => { if (feedback) { feedback.textContent = message; feedback.classList.toggle('is-error', error); } };
const login = document.querySelector('[data-login]');
login?.addEventListener('submit', async event => {
  event.preventDefault();
  report('Signing in…');
  try {
    const response = await fetch('/api/session', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'login', password: login.elements.password.value }) });
    const result = await response.json();
    if (!response.ok) throw Error(result.error || 'Unable to sign in.');
    location.reload();
  } catch (error) { report(error.message, true); }
});
const list = document.querySelector('[data-editor-list]');
if (list) {
  let gigs = [];
  let changed = false;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const field = (name, label, value, type = 'text', required = false) => `<label>${label}<input name="${name}" type="${type}" value="${escape(value)}" ${required ? 'required' : ''}></label>`;
  const render = () => {
    list.innerHTML = gigs.map((gig, index) => `<article class="manage-card${gig.archived ? ' is-archived' : ''}" data-index="${index}"><div class="manage-card-head"><h2>${escape(gig.venue || 'New gig')}</h2><span>${gig.archived ? 'Archived' : 'Scheduled'}</span></div><div class="manage-fields">${field('date', 'Date', gig.date, 'date', true)}${field('venue', 'Venue', gig.venue, 'text', true)}${field('place', 'Town / area', gig.place, 'text', true)}${field('time', 'Time (optional)', gig.time)}${field('url', 'Venue link (optional)', gig.url, 'url')}${field('photo', 'Photo path (optional)', gig.photo)}</div><div class="manage-card-actions"><label><input name="archived" type="checkbox" ${gig.archived ? 'checked' : ''}> Archive this gig</label><button type="button" data-remove="${index}">Remove gig</button></div></article>`).join('') || '<p>No gigs yet. Add the first one above.</p>';
  };
  const collect = () => {
    gigs = [...list.querySelectorAll('.manage-card')].map(card => {
      const get = name => card.querySelector(`[name="${name}"]`).value.trim();
      return { date: get('date'), venue: get('venue'), place: get('place'), time: get('time'), url: get('url'), photo: get('photo'), archived: card.querySelector('[name="archived"]').checked };
    });
  };
  fetch('/api/gigs', { cache: 'no-store' }).then(response => { if (!response.ok) throw Error('Unable to load gigs.'); return response.json(); }).then(data => { gigs = data; render(); }).catch(error => report(error.message, true));
  list.addEventListener('input', () => { changed = true; });
  list.addEventListener('change', event => { changed = true; if (event.target.name === 'archived') { const card = event.target.closest('.manage-card'); card.classList.toggle('is-archived', event.target.checked); card.querySelector('.manage-card-head span').textContent = event.target.checked ? 'Archived' : 'Scheduled'; } });
  list.addEventListener('click', event => {
    const button = event.target.closest('[data-remove]');
    if (!button) return;
    collect();
    gigs.splice(Number(button.dataset.remove), 1);
    changed = true;
    render();
  });
  document.querySelector('[data-add]').addEventListener('click', () => {
    collect();
    gigs.unshift({ date: '', venue: '', place: '', time: '', url: '', photo: '', archived: false });
    changed = true;
    render();
    list.querySelector('[name="date"]')?.focus();
  });
  document.querySelector('[data-save]').addEventListener('click', async () => {
    if (![...list.querySelectorAll('input[required]')].every(input => input.reportValidity())) return;
    collect();
    report('Saving…');
    try {
      const response = await fetch('/api/gigs', { method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(gigs) });
      const result = await response.json();
      if (!response.ok) throw Error(result.error || 'Unable to save gigs.');
      gigs = result.gigs;
      changed = false;
      render();
      report('Saved. Check the gigs page to see the update.');
    } catch (error) { report(error.message, true); }
  });
  document.querySelector('[data-logout]').addEventListener('click', async () => {
    if (changed && !confirm('You have unsaved changes. Sign out anyway?')) return;
    await fetch('/api/session', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) });
    location.reload();
  });
  window.addEventListener('beforeunload', event => { if (changed) { event.preventDefault(); event.returnValue = ''; } });
}
