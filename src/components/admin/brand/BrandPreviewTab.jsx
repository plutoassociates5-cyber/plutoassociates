import { brandVarsFor } from '../../../utils/brandVars';
import { normalizeLogoConfig } from '../../../utils/logoDefaults';
import SmartLogo from '../../SmartLogo';

const NAV_LINKS = ['Home', 'About', 'Practice Areas', 'Services', 'Insights', 'Contact'];

export default function BrandPreviewTab({ d }) {
  const b = d.brand || {};
  const vars = brandVarsFor(d);
  const logoCfg = normalizeLogoConfig(d.logoConfig);
  const logoAssets = b.assets || {};
  const primaryLogo = logoAssets.logo || d.logo || '';
  const footerLogo = logoAssets.logoFooter || primaryLogo;
  const hours = b.office.hours || d.hours || '';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#1d2327]">Live preview — updates instantly as you edit any tab</h2>
        <span className="text-[0.65rem] text-text-light">Desktop · tablet · mobile</span>
      </div>

      <div className="flex flex-col gap-4">
        <Frame label="Desktop" vars={vars} logoCfg={logoCfg} b={b} d={d} primaryLogo={primaryLogo} footerLogo={footerLogo} hours={hours} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Frame label="Tablet" vars={vars} logoCfg={logoCfg} b={b} d={d} primaryLogo={primaryLogo} footerLogo={footerLogo} hours={hours} compact />
          <Frame label="Mobile" vars={vars} logoCfg={logoCfg} b={b} d={d} primaryLogo={primaryLogo} footerLogo={footerLogo} hours={hours} mobile />
        </div>
      </div>
    </div>
  );
}

function Frame({ label, vars, logoCfg, b, d, primaryLogo, footerLogo, hours, compact, mobile }) {
  const headerBg = b.colors.header || '#0a1628';
  const headerH = mobile ? b.header.mobileHeight : compact ? 72 : b.header.height;
  const logoSize = mobile ? Math.round(b.header.logoSize * 0.68) : compact ? 62 : b.header.logoSize;
  const showNav = !mobile && !compact;
  return (
    <div>
      <div className="text-[0.65rem] font-semibold text-text-light mb-1.5 tracking-wide">{label}</div>
      <div className="rounded-xl border border-wp-border bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.08)]" style={vars}>
        {/* header */}
        <div className="flex items-center gap-3 px-4 lg:px-6" style={{ background: headerBg, height: headerH }}>
          <SmartLogo src={primaryLogo} config={logoCfg} size={logoSize} eager />
          <div className="min-w-0">
            <div className="font-serif font-bold truncate text-white" style={{ fontSize: mobile ? 13 : 16, fontFamily: 'var(--brand-font-heading)' }}>
              {d.name || 'Pluto Associates'}
            </div>
            <div className="text-[0.55rem] font-medium uppercase tracking-[0.14em] truncate" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {d.tagline || 'Advocates & Legal Consultants'}
            </div>
          </div>
          {showNav && (
            <div className="ml-auto hidden lg:flex items-center gap-6 text-white/85">
              {NAV_LINKS.map((n) => (
                <span key={n} className="text-xs font-medium cursor-pointer">{n}</span>
              ))}
            </div>
          )}
          {showNav && (
            <button className="ml-2 px-3 py-1.5 text-xs font-semibold rounded cursor-pointer border-0" style={{ background: b.colors.button, color: readable(b.colors.button) }}>
              Contact
            </button>
          )}
          {mobile && (
            <div className="ml-auto text-white/80 text-xl leading-none">☰</div>
          )}
        </div>

        {/* hero strip */}
        <div className="py-6 px-4 lg:px-6" style={{ background: 'var(--brand-background)' }}>
          <div className="text-lg font-bold mb-1" style={{ color: 'var(--brand-text)', fontFamily: 'var(--brand-font-heading)', fontWeight: 'var(--brand-heading-weight)' }}>
            {d.name || 'Pluto Associates'}
          </div>
          <div className="text-xs mb-3" style={{ color: 'var(--brand-text-body)' }}>
            {d.footerAbout || 'Expert legal solutions across corporate law, FDI, litigation and more.'}
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1.5 rounded text-xs font-semibold" style={{ background: 'var(--brand-button)', color: readable(b.colors.button) }}>Book consultation</span>
            <span className="px-3 py-1.5 rounded text-xs font-semibold border" style={{ color: 'var(--brand-link)', borderColor: 'var(--brand-border)' }}>Practice areas</span>
          </div>
          <div className="flex gap-4 mt-4">
            <Swatch label="Primary" color={b.colors.primary} />
            <Swatch label="Secondary" color={b.colors.secondary} />
            <Swatch label="Accent" color={b.colors.accent} />
          </div>
        </div>

        {/* footer */}
        <div className="px-4 lg:px-6 py-5" style={{ background: b.colors.footer || '#0a1628', color: '#fff' }}>
          <div className="flex items-center gap-3 mb-3">
            <SmartLogo src={footerLogo} config={logoCfg} size={Math.round(logoSize * 0.85)} eager />
            <div className="text-xs font-semibold" style={{ fontFamily: 'var(--brand-font-heading)' }}>{d.name || 'Pluto Associates'}</div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[0.65rem] text-white/75">
            <div>
              <div className="text-white/95 font-semibold mb-1">Contact</div>
              <div>{d.phone || ''}</div>
              <div>{d.email || ''}</div>
              <div>{b.office.street || d.address || ''}</div>
            </div>
            <div>
              <div className="text-white/95 font-semibold mb-1">Hours</div>
              <div>{hours || d.hours || ''}</div>
              <div>© {new Date().getFullYear()} {d.name || 'Pluto Associates'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Swatch({ label, color }) {
  return (
    <span className="flex items-center gap-1.5 text-[0.62rem] text-text-light">
      <span className="w-3.5 h-3.5 rounded-full border border-wp-border" style={{ background: color }} />
      {label}
    </span>
  );
}

function readable(hex) {
  if (!hex || typeof hex !== 'string') return '#fff';
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return '#fff';
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#0a1628' : '#ffffff';
}
