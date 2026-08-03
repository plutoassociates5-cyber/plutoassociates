/**
 * SmartLogo — a reusable, intelligent brand mark.
 *
 * Any logo uploaded through the admin portal is automatically:
 *   - detected for aspect ratio, transparency and background brightness
 *   - fitted inside a premium circular badge with `object-fit: contain`
 *   - padded proportionally so it never touches the border or gets cropped
 *   - kept pixel-sharp (no upscaling, retina-friendly)
 *
 * The same component is used in the header, sticky header, mobile drawer,
 * footer and admin previews — logo logic is never duplicated.
 */
import { useState } from 'react';
import { getSettings } from '../utils/contentStore';
import { normalizeLogoConfig } from '../utils/logoDefaults';

const VARIANTS = { nav: 80, sticky: 58, footer: 72, mobile: 54, badge: 84 };

const ASSET_KEYS = {
  nav: 'logo', sticky: 'logoSticky', footer: 'logoFooter', print: 'logoPrint',
  email: 'logoEmail', dark: 'logoDark', light: 'logoLight', badge: 'logo', default: 'logo',
};

/**
 * Minimum internal padding (as % of the badge diameter) that guarantees the
 * whole rectangular image — including its corners — stays inside the circle.
 * Square images need the most (~15%), extreme landscape/portrait need less.
 */
function idealPaddingPct(aspect) {
  const q = Math.max(aspect, 1 / aspect);
  return 50 * (1 - 1 / Math.sqrt(1 + 1 / (q * q)));
}

/** Analyse a loaded image: aspect ratio, transparency and background brightness. */
function analyzeImage(img) {
  return new Promise((resolve) => {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return resolve({ aspect: 1, transparent: true, light: true });
    try {
      const SW = 24;
      const canvas = document.createElement('canvas');
      canvas.width = SW;
      canvas.height = SW;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return resolve({ aspect: w / h, transparent: true, light: true });
      ctx.drawImage(img, 0, 0, SW, SW);
      const data = ctx.getImageData(0, 0, SW, SW).data;
      let transparent = 0;
      let lum = 0;
      let opaque = 0;
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3];
        if (a < 200) {
          transparent += 1;
        } else {
          lum += (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
          opaque += 1;
        }
      }
      const total = SW * SW;
      const isTransparent = transparent / total > 0.06;
      const avg = opaque ? lum / opaque : 0.9;
      resolve({ aspect: w / h, transparent: isTransparent, light: avg > 0.45 });
    } catch {
      resolve({ aspect: w / h, transparent: true, light: true });
    }
  });
}

function sizeCss(size) {
  if (typeof size === 'number') return size + 'px';
  return size; // allow CSS lengths / vars like "var(--logo-base)"
}

export default function SmartLogo({
  src,
  alt,
  variant = 'badge',
  size,
  config,
  className = '',
  eager = false,
}) {
  const site = getSettings();
  const cfg = normalizeLogoConfig(config || site.logoConfig);
  const assets = (site.brand && site.brand.assets) || {};
  const assetKey = ASSET_KEYS[variant] || 'logo';
  const logo = src || assets[assetKey] || site.logo || assets.logo || '';
  const [analysis, setAnalysis] = useState(null);
  const [failed, setFailed] = useState(false);

  const D = typeof size === 'number' ? size : size || cfg.size || VARIANTS[variant] || 80;
  const aspect = analysis ? analysis.aspect : 1.3;
  const basePx = typeof D === 'number' ? D : cfg.size || VARIANTS[variant] || 80;

  // Square/portrait logos fill the circle (circular crop); landscape wordmarks
  // stay fully visible. Until the image loads, assume landscape (safest).
  const fitMode = cfg.fit === 'contain' || cfg.fit === 'cover' ? cfg.fit : (aspect < 1.15 ? 'cover' : 'contain');
  const useCover = fitMode === 'cover';

  const pct =
    useCover || !cfg.autoPad
      ? useCover ? 0 : (cfg.padding / Math.max(1, basePx)) * 100
      : Math.min(30, Math.max(idealPaddingPct(aspect) * 1.12, (cfg.padding / Math.max(1, basePx)) * 100));

  const hasLogo = Boolean(logo);
  const showFallback = !hasLogo || failed;

  let bg = cfg.background;
  if (!bg) {
    if (analysis && !analysis.transparent) {
      bg = analysis.light ? 'rgba(10,22,40,0.12)' : 'rgba(255,255,255,0.92)';
    } else {
      bg = 'rgba(255,255,255,0.08)';
    }
  }

  const badgeStyle = {
    width: sizeCss(D),
    height: sizeCss(D),
    fontSize: sizeCss(D),
    borderRadius: cfg.radius + '%',
    background: bg,
    border: cfg.borderWidth > 0 ? cfg.borderWidth + 'px solid ' + cfg.borderColor : 'none',
    boxShadow: cfg.shadow ? '0 6px 20px rgba(0,0,0,0.25)' : 'none',
  };

  const imgStyle = {
    padding: pct + '%',
    objectFit: useCover ? 'cover' : 'contain',
    objectPosition: 'center',
  };

  return (
    <span className={'pluto-logo ' + className} style={badgeStyle} role="img" aria-label={alt || site.name + ' logo'}>
      {showFallback ? (
        <span className="pluto-logo-fallback" aria-hidden="true">PA</span>
      ) : (
        <img
          src={logo}
          alt=""
          className="pluto-logo-img"
          style={imgStyle}
          onLoad={(e) => {
            setFailed(false);
            analyzeImage(e.currentTarget).then(setAnalysis).catch(() => {});
          }}
          onError={() => setFailed(true)}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
        />
      )}
    </span>
  );
}
