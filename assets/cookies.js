(() => {
  const storageKey = 'ht_cookie_choice_v1';
  let choice;
  try { choice = localStorage.getItem(storageKey); } catch { /* A choice can still be used for this page. */ }
  const media = [...document.querySelectorAll('[data-media-src]')];
  const loadMedia = () => {
    media.forEach(slot => {
      if (!slot.isConnected) return;
      const frame = document.createElement('iframe');
      frame.src = slot.dataset.mediaSrc;
      frame.title = slot.dataset.mediaTitle;
      frame.loading = 'lazy';
      frame.allow = slot.dataset.mediaProvider === 'YouTube'
        ? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        : 'autoplay';
      if (slot.dataset.mediaProvider === 'YouTube') frame.allowFullscreen = true;
      slot.replaceWith(frame);
    });
  };
  if (choice === 'all') loadMedia();

  const banner = document.createElement('section');
  banner.className = 'cookie-banner';
  banner.setAttribute('aria-label', 'Cookie choices');
  banner.innerHTML = `<div class="cookie-banner-copy"><strong>Cookies on Harbour Town</strong><p>We do not use tracking cookies. Bandcamp and YouTube players may use cookies if you choose to load them.</p><details><summary>Cookie details</summary><p>We do not use advertising or analytics cookies. Your choice is saved on this device. Media providers may use cookies when their players load: <a href="https://bandcamp.com/privacy" target="_blank" rel="noopener noreferrer">Bandcamp</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">YouTube</a>. <a href="privacy.html">Privacy &amp; cookies</a>.</p></details></div><div class="cookie-banner-actions"><button type="button" data-choice="essential">Essential only</button><button type="button" data-choice="all">Yes, accept all</button></div>`;
  document.body.append(banner);
  banner.hidden = choice === 'all' || choice === 'essential';

  const saveChoice = next => {
    const wasAll = choice === 'all';
    choice = next;
    try { localStorage.setItem(storageKey, next); } catch { /* Choice remains active on this page. */ }
    banner.hidden = true;
    if (next === 'all') loadMedia();
    else if (wasAll) location.reload();
  };
  document.addEventListener('click', event => {
    const selected = event.target.closest('[data-choice], [data-cookie-choice]');
    if (selected) {
      saveChoice(selected.dataset.choice || selected.dataset.cookieChoice);
      const feedback = document.querySelector('[data-cookie-feedback]');
      if (feedback) feedback.textContent = choice === 'all' ? 'Media cookies accepted.' : 'Essential cookies only.';
    }
    if (event.target.closest('[data-cookie-settings]')) banner.hidden = false;
    if (event.target.closest('[data-allow-media]')) saveChoice('all');
  });
})();
