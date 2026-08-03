import { useEffect } from 'react';
import { getSettings } from '../utils/contentStore';

export function applyFavicon(logo) {
  if (!logo) return;
  const head = document.head;

  // Remove any static favicon links so the logo takes over in the
  // address bar / browser tab (data-URL PNG).
  head.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach((l) => {
    if (l.getAttribute('href') !== logo) l.remove();
  });

  // Prepend a primary favicon so it is prioritized by the browser.
  let primary = head.querySelector(`link[rel="icon"][href="${logo}"]`);
  if (!primary) {
    primary = document.createElement('link');
    primary.rel = 'icon';
    primary.type = 'image/png';
    primary.href = logo;
    head.appendChild(primary);
  }

  // Also update the apple touch icon used when the site is added to a home screen.
  let apple = head.querySelector('link[rel="apple-touch-icon"]');
  if (!apple) {
    apple = document.createElement('link');
    apple.rel = 'apple-touch-icon';
    head.appendChild(apple);
  }
  apple.href = logo;
}

export default function SiteFavicon() {
  useEffect(() => {
    const s = getSettings();
    const assets = (s.brand && s.brand.assets) || {};
    applyFavicon(assets.favicon || s.logo);
  }, []);
  return null;
}