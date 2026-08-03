export const GOOGLE_FONT_MAP = {
  "'Playfair Display', Georgia, serif": 'Playfair+Display:wght@400;500;600;700',
  "'Inter', -apple-system, sans-serif": 'Inter:wght@300;400;500;600;700',
  "'Merriweather', Georgia, serif": 'Merriweather:wght@300;400;700;900',
  "'Lora', Georgia, serif": 'Lora:wght@400;500;600;700',
  "'Crimson Text', Georgia, serif": 'Crimson+Text:wght@400;600;700',
  "'Source Serif 4', Georgia, serif": 'Source+Serif+4:wght@400;600;700',
  "'Libre Baskerville', Georgia, serif": 'Libre+Baskerville:wght@400;700',
  "'DM Sans', sans-serif": 'DM+Sans:wght@400;500;700',
  "'Poppins', sans-serif": 'Poppins:wght@300;400;500;600;700',
  "'Roboto', sans-serif": 'Roboto:wght@300;400;500;700',
  "'Open Sans', sans-serif": 'Open+Sans:wght@300;400;600;700',
  "'Lato', sans-serif": 'Lato:wght@300;400;700',
  "'Montserrat', sans-serif": 'Montserrat:wght@300;400;500;600;700',
  "'Georgia', serif": null,
  "'Arial', sans-serif": null,
  "system-ui, sans-serif": null,
};

export const FONT_OPTIONS = [
  { label: 'Playfair Display (Serif)', stack: "'Playfair Display', Georgia, serif" },
  { label: 'Merriweather (Serif)', stack: "'Merriweather', Georgia, serif" },
  { label: 'Lora (Serif)', stack: "'Lora', Georgia, serif" },
  { label: 'Crimson Text (Serif)', stack: "'Crimson Text', Georgia, serif" },
  { label: 'Source Serif 4 (Serif)', stack: "'Source Serif 4', Georgia, serif" },
  { label: 'Libre Baskerville (Serif)', stack: "'Libre Baskerville', Georgia, serif" },
  { label: 'Georgia (Serif)', stack: "'Georgia', serif" },
  { label: 'Inter (Sans)', stack: "'Inter', -apple-system, sans-serif" },
  { label: 'DM Sans (Sans)', stack: "'DM Sans', sans-serif" },
  { label: 'Poppins (Sans)', stack: "'Poppins', sans-serif" },
  { label: 'Roboto (Sans)', stack: "'Roboto', sans-serif" },
  { label: 'Open Sans (Sans)', stack: "'Open Sans', sans-serif" },
  { label: 'Lato (Sans)', stack: "'Lato', sans-serif" },
  { label: 'Montserrat (Sans)', stack: "'Montserrat', sans-serif" },
  { label: 'System UI', stack: "system-ui, sans-serif" },
];

let injected = new Set();

function ensureGoogleFonts(fonts) {
  if (typeof document === 'undefined') return;
  const families = (fonts || []).map((f) => GOOGLE_FONT_MAP[f]).filter(Boolean);
  const missing = families.filter((f) => !injected.has(f));
  if (!missing.length) return;
  injected = new Set([...injected, ...missing]);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${missing.join('&family=')}&display=swap`;
  document.head.appendChild(link);
}

export function brandVarsFor(settings) {
  const vars = {};
  const b = (settings && settings.brand) || {};
  const c = b.colors || {};
  const put = (k, v) => {
    if (v !== undefined && v !== null && v !== '') vars[k] = String(v);
  };
  put('--brand-primary', c.primary);
  put('--brand-secondary', c.secondary);
  put('--brand-accent', c.accent);
  put('--brand-background', c.background);
  put('--brand-surface', c.surface);
  put('--brand-surface-alt', c.surfaceAlt);
  put('--brand-header', c.header);
  put('--brand-footer', c.footer);
  put('--brand-button', c.button);
  put('--brand-button-hover', c.buttonHover);
  put('--brand-link', c.link);
  put('--brand-link-hover', c.linkHover);
  put('--brand-border', c.border);
  put('--brand-text', c.text);
  put('--brand-text-body', c.textBody);
  put('--brand-muted', c.muted);
  put('--brand-success', c.success);
  put('--brand-warning', c.warning);
  put('--brand-error', c.error);
  put('--brand-info', c.info);
  put('--brand-dark-bg', c.darkBg);
  put('--brand-dark-surface', c.darkSurface);
  put('--brand-dark-text', c.darkText);
  const t = b.typography || {};
  put('--brand-font-heading', t.headingFont);
  put('--brand-font-body', t.bodyFont);
  put('--brand-font-nav', t.navFont);
  put('--brand-font-button', t.buttonFont);
  put('--brand-heading-weight', t.headingWeight);
  put('--brand-body-weight', t.bodyWeight);
  put('--brand-heading-scale', t.headingSize);
  put('--brand-paragraph-scale', t.paragraphSize);
  put('--brand-letter-spacing', t.letterSpacing + 'px');
  put('--brand-line-height', t.lineHeight);
  const h = b.header || {};
  put('--brand-header-h', h.height + 'px');
  put('--brand-sticky-h', h.stickyHeight + 'px');
  put('--brand-mobile-h', h.mobileHeight + 'px');
  put('--logo-base', h.logoSize + 'px');
  put('--logo-size-sticky', h.stickyLogoSize + 'px');
  const o = b.office || {};
  put('--brand-latitude', o.latitude);
  put('--brand-longitude', o.longitude);
  return vars;
}

export function applyBrandVars(settings) {
  if (typeof document === 'undefined') return;
  const vars = brandVarsFor(settings);
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  const t = (settings && settings.brand && settings.brand.typography) || {};
  ensureGoogleFonts([t.headingFont, t.bodyFont, t.navFont, t.buttonFont]);
}

export function clearBrandVars() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const keys = [
    '--brand-primary', '--brand-secondary', '--brand-accent', '--brand-background',
    '--brand-surface', '--brand-surface-alt', '--brand-header', '--brand-footer',
    '--brand-button', '--brand-button-hover', '--brand-link', '--brand-link-hover',
    '--brand-border', '--brand-text', '--brand-text-body', '--brand-muted',
    '--brand-success', '--brand-warning', '--brand-error', '--brand-info',
    '--brand-dark-bg', '--brand-dark-surface', '--brand-dark-text',
    '--brand-font-heading', '--brand-font-body', '--brand-font-nav', '--brand-font-button',
    '--brand-heading-weight', '--brand-body-weight', '--brand-heading-scale',
    '--brand-paragraph-scale', '--brand-letter-spacing', '--brand-line-height',
    '--brand-header-h', '--brand-sticky-h', '--brand-mobile-h',
    '--logo-base', '--logo-size-sticky', '--brand-latitude', '--brand-longitude',
  ];
  keys.forEach((k) => root.style.removeProperty(k));
}
