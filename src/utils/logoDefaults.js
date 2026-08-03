/**
 * Shared default configuration for the Smart Logo component.
 * Stored as `settings.logoConfig` so the admin can tune it without touching CSS.
 */
export const LOGO_CONFIG_DEFAULTS = {
  size: 80,            // base circle diameter in px (drives header/sticky/footer sizes)
  padding: 10,         // manual internal padding in px (also the floor when autoPad is on)
  autoFit: true,       // scale any uploaded image to fit without distortion
  autoPad: true,       // compute padding from the image aspect ratio to avoid border contact
  borderWidth: 1,      // circle border thickness in px
  borderColor: 'rgba(255,255,255,0.20)',
  shadow: true,        // soft professional shadow
  background: '',      // '' = auto-detect; otherwise a CSS color
  radius: 50,          // circle roundness in % (50 = perfect circle)
};

export function normalizeLogoConfig(cfg) {
  const d = LOGO_CONFIG_DEFAULTS;
  const c = cfg && typeof cfg === 'object' ? cfg : {};
  const num = (v, fb) => (typeof v === 'number' && isFinite(v) ? v : fb);
  return {
    size: Math.min(140, Math.max(40, num(c.size, d.size))),
    padding: Math.min(40, Math.max(0, num(c.padding, d.padding))),
    autoFit: c.autoFit !== false,
    autoPad: c.autoPad !== false,
    borderWidth: Math.min(8, Math.max(0, num(c.borderWidth, d.borderWidth))),
    borderColor: c.borderColor || d.borderColor,
    shadow: c.shadow !== false,
    background: c.background || '',
    radius: Math.min(50, Math.max(0, num(c.radius, d.radius))),
  };
}
