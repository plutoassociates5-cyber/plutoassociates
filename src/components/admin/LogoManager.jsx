import { useState } from 'react';
import { getSettings, saveSettings } from '../../utils/contentStore';
import { LOGO_CONFIG_DEFAULTS, normalizeLogoConfig } from '../../utils/logoDefaults';
import { readFileAsDataUrl, isSvg } from '../../utils/image';
import { useToast } from '../../context/ToastContext';
import { applyFavicon } from '../SiteFavicon';
import SmartLogo from '../SmartLogo';
import ImageResizeModal from './ImageResizeModal';

const BG_PRESETS = [
  { label: 'Auto', value: '' },
  { label: 'White', value: '#ffffff' },
  { label: 'Navy', value: 'rgba(10,22,40,0.9)' },
  { label: 'None', value: 'transparent' },
];

function Control({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-[#333] flex justify-between items-center mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Slider({ label, k, cfg, setCfg, min, max, step = 1, unit = 'px' }) {
  return (
    <Control label={label}>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} step={step} value={cfg[k]} onChange={(e) => setCfg({ ...cfg, [k]: Number(e.target.value) })} className="flex-1 cursor-pointer" />
        <span className="w-12 text-right text-xs font-semibold text-wp-blue shrink-0">{cfg[k]}{unit}</span>
      </div>
    </Control>
  );
}

function Toggle({ label, hint, k, cfg, setCfg }) {
  return (
    <label className="flex items-center justify-between gap-3 bg-[#f6f7f8] border border-wp-border rounded px-3 py-2 cursor-pointer">
      <span className="text-xs font-semibold text-[#333]">{label}{hint && <small className="block font-normal text-text-light text-[0.65rem] mt-0.5">{hint}</small>}</span>
      <input type="checkbox" checked={!!cfg[k]} onChange={(e) => setCfg({ ...cfg, [k]: e.target.checked })} className="w-4 h-4 cursor-pointer" />
    </label>
  );
}

function Preview({ label, note, size, dark, src, cfg, name, tagline }) {
  return (
    <div className={`rounded-xl p-6 flex items-center gap-4 border ${dark ? 'bg-navy border-navy-light' : 'bg-white border-wp-border'}`}>
      <SmartLogo src={src} config={cfg} size={size} eager />
      <div className="min-w-0">
        <div className={`font-serif font-bold truncate ${dark ? 'text-white' : 'text-navy'} ${size > 68 ? 'text-xl' : 'text-lg'}`}>{name}</div>
        <div className="text-[0.6rem] font-medium uppercase tracking-[0.14em] text-text-light mt-0.5 truncate">{tagline}</div>
        <div className="text-[0.6rem] text-text-light mt-2">{label} · {note}</div>
      </div>
    </div>
  );
}

export default function LogoManager() {
  const { toast } = useToast();
  const [settings, setSettings] = useState(getSettings);
  const [logo, setLogo] = useState(settings.logo || '');
  const [cfg, setCfg] = useState(() => normalizeLogoConfig(settings.logoConfig));
  const [pending, setPending] = useState(null);

  const base = cfg.size;
  const sizes = {
    desktop: base,
    sticky: Math.round(base * 0.72),
    tablet: Math.round(base * 0.8),
    mobile: Math.round(base * 0.68),
    footer: Math.round(base * 0.9),
  };

  const onUpload = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f || !f.type.startsWith('image/')) return;
    if (f.size > 3 * 1024 * 1024) { toast('Logo must be under 3MB.', 'err'); return; }
    const dataUrl = await readFileAsDataUrl(f);
    if (isSvg(dataUrl)) { setLogo(dataUrl); return; }
    setPending(dataUrl);
  };

  const save = () => {
    try {
      const current = getSettings();
      saveSettings({ ...current, logo, logoConfig: cfg });
      applyFavicon(logo);
      toast('✓ Logo saved. The website updates instantly.');
    } catch {
      toast('⚠️ Could not save — storage full. Reduce the image and try again.', 'err');
    }
  };

  const reset = () => {
    setCfg({ ...LOGO_CONFIG_DEFAULTS });
    toast('Logo settings reset to defaults.');
  };

  const input = 'w-full border border-wp-border px-2.5 py-2 font-sans text-xs outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa]';

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">Logo & Branding</h1>
          <p className="text-xs text-text-light mt-1">Upload any logo — the site auto-fits it into a premium circle everywhere. No cropping or CSS needed.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white text-[#333] border border-wp-border px-3.5 py-2 text-xs font-semibold cursor-pointer hover:bg-wp-gray" onClick={reset}>↺ Reset to Defaults</button>
          <button className="bg-wp-blue text-white border-none px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-[#005a87]" onClick={save}>💾 Save Logo</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Controls */}
        <div className="flex flex-col gap-4">
          <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4">
            <div className="text-xs font-semibold text-[#1d2327] mb-3 pb-2 border-b border-wp-border">📤 Upload Logo</div>
            <div className="flex items-center gap-3 mb-2">
              <SmartLogo src={logo} config={cfg} size={64} eager />
              <label className="bg-wp-blue text-white px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-[#005a87]">
                Upload logo
                <input type="file" accept="image/*" hidden onChange={onUpload} />
              </label>
            </div>
            <p className="text-[0.65rem] text-text-light">PNG / SVG / WEBP / JPG, transparent or not. Square, portrait, landscape — all supported.</p>
            {logo && (
              <button className="mt-2 text-[0.68rem] text-accent-red bg-transparent border-none cursor-pointer p-0 font-sans" onClick={() => setLogo('')}>Remove logo (show "PA" fallback)</button>
            )}
          </div>

          <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4 flex flex-col gap-4">
            <div className="text-xs font-semibold text-[#1d2327] pb-2 border-b border-wp-border">⚙️ Display</div>
            <Slider label="Circle size" k="size" cfg={cfg} setCfg={setCfg} min={40} max={140} />
            <Slider label="Internal padding" k="padding" cfg={cfg} setCfg={setCfg} min={0} max={40} />
            <Toggle label="Auto fit" k="autoFit" hint="Scale image to fit, never stretch or crop" cfg={cfg} setCfg={setCfg} />
            <Toggle label="Auto padding" k="autoPad" hint="Adapt padding to image shape so it never touches the border" cfg={cfg} setCfg={setCfg} />
            <Toggle label="Soft shadow" k="shadow" hint="Professional drop shadow under the badge" cfg={cfg} setCfg={setCfg} />
          </div>

          <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4 flex flex-col gap-4">
            <div className="text-xs font-semibold text-[#1d2327] pb-2 border-b border-wp-border">🎨 Circle Style</div>
            <Slider label="Border width" k="borderWidth" cfg={cfg} setCfg={setCfg} min={0} max={8} />
            <Control label="Border color">
              <div className="flex items-center gap-2">
                <input className={input} value={cfg.borderColor} onChange={(e) => setCfg({ ...cfg, borderColor: e.target.value })} placeholder="hex or rgba(…)" />
                <input type="color" value={toHex(cfg.borderColor)} onChange={(e) => setCfg({ ...cfg, borderColor: e.target.value })} className="w-9 h-9 border border-wp-border cursor-pointer shrink-0" />
              </div>
            </Control>
            <Control label="Badge background">
              <div className="flex flex-wrap gap-1.5">
                {BG_PRESETS.map((p) => (
                  <button key={p.label} onClick={() => setCfg({ ...cfg, background: p.value })} className={`px-2.5 py-1.5 text-[0.68rem] font-semibold cursor-pointer border ${cfg.background === p.value ? 'bg-wp-blue text-white border-wp-blue' : 'bg-white text-[#555] border-wp-border hover:bg-wp-gray'}`}>
                    {p.label}
                  </button>
                ))}
                <input className={input + ' w-28'} value={/^#|rgba|^rgb/.test(cfg.background) && cfg.background !== 'transparent' ? cfg.background : ''} onChange={(e) => setCfg({ ...cfg, background: e.target.value })} placeholder="custom…" />
              </div>
            </Control>
          </div>
        </div>

        {/* Live previews */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#1d2327]">Live preview — updates as you adjust</h2>
            <span className="text-[0.65rem] text-text-light">No page refresh needed</span>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Preview label="Desktop header" note={`${sizes.desktop}px circle`} size={sizes.desktop} dark src={logo} cfg={cfg} name={settings.name} tagline={settings.tagline} />
            <Preview label="Sticky header" note={`${sizes.sticky}px circle`} size={sizes.sticky} dark src={logo} cfg={cfg} name={settings.name} tagline={settings.tagline} />
            <Preview label="Tablet header" note={`${sizes.tablet}px circle`} size={sizes.tablet} dark src={logo} cfg={cfg} name={settings.name} tagline={settings.tagline} />
            <Preview label="Mobile header" note={`${sizes.mobile}px circle`} size={sizes.mobile} dark src={logo} cfg={cfg} name={settings.name} tagline={settings.tagline} />
            <Preview label="Footer" note={`${sizes.footer}px circle`} size={sizes.footer} dark src={logo} cfg={cfg} name={settings.name} tagline={settings.tagline} />
            <Preview label="Light page" note={`${sizes.desktop}px circle on white`} size={sizes.desktop} src={logo} cfg={cfg} name={settings.name} tagline={settings.tagline} />
          </div>
        </div>
      </div>

      <ImageResizeModal
        src={pending}
        name="Adjust logo size"
        defaults={{ imgMaxWidth: getSettings().imgMaxWidth || 1600, imgQuality: getSettings().imgQuality ?? 85 }}
        onApply={({ dataUrl }) => { setLogo(dataUrl); setPending(null); }}
        onCancel={() => setPending(null)}
      />
    </>
  );
}

function toHex(value) {
  if (typeof value !== 'string') return '#ffffff';
  const m = value.match(/^#([0-9a-f]{6})$/i);
  if (m) return value;
  const rgba = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgba) {
    return '#' + [rgba[1], rgba[2], rgba[3]].map((n) => Math.min(255, Math.max(0, Number(n))).toString(16).padStart(2, '0')).join('');
  }
  return '#ffffff';
}
