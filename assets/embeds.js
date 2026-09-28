document.addEventListener('click', event => {
  const button = event.target.closest('[data-load-embed]');
  if (!button) return;
  const choice = button.closest('[data-embed-src]');
  if (!choice) return;
  const iframe = document.createElement('iframe');
  iframe.src = choice.dataset.embedSrc;
  iframe.title = choice.dataset.embedTitle;
  iframe.loading = 'eager';
  iframe.allow = choice.dataset.embedProvider === 'YouTube'
    ? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    : 'autoplay';
  if (choice.dataset.embedProvider === 'YouTube') iframe.allowFullscreen = true;
  choice.replaceWith(iframe);
});
