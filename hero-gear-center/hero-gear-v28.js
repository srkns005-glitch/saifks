/* Backward-compatible bridge for browsers that cached an older HTML build. */
(() => {
  if (document.querySelector('script[data-hero-gear-current]')) return;
  const script = document.createElement('script');
  script.src = './hero-gear-v31.js?v=20260930-stable-language';
  script.dataset.heroGearCurrent = 'true';
  document.head.appendChild(script);
})();
