import { useEffect } from 'react';
import { getSettings } from '../utils/contentStore';

export default function SiteFavicon() {
  useEffect(() => {
    const logo = getSettings()?.logo;
    if (!logo) return;
    let link = document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = logo;
    let apple = document.querySelector('link[rel="apple-touch-icon"]');
    if (!apple) {
      apple = document.createElement('link');
      apple.rel = 'apple-touch-icon';
      document.head.appendChild(apple);
    }
    apple.href = logo;
  }, []);
  return null;
}