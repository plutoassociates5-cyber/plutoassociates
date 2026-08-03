import { useState } from 'react';
import { getSettings, saveSettings } from '../../utils/contentStore';
import { applyFavicon } from '../SiteFavicon';
import { useToast } from '../../context/ToastContext';
import { readFileAsDataUrl, isSvg } from '../../utils/image';
import ImageResizeModal from './ImageResizeModal';
import SmartLogo from '../SmartLogo';

export default function SiteSettings() {
  const { toast } = useToast();
  const [s, setS] = useState(getSettings);
  const [pendingLogo, setPendingLogo] = useState(null);

  const set = (key, value) => setS((prev) => ({ ...prev, [key]: value }));
  const setSocial = (key, value) => setS((prev) => ({ ...prev, social: { ...prev.social, [key]: value } }));

  const onLogo = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f || !f.type.startsWith('image/')) return;
    if (f.size > 3 * 1024 * 1024) { toast('Logo must be under 3MB.', 'err'); return; }
    const dataUrl = await readFileAsDataUrl(f);
    if (isSvg(dataUrl)) { set('logo', dataUrl); return; }
    setPendingLogo(dataUrl);
  };

  const applyLogo = ({ dataUrl }) => { set('logo', dataUrl); setPendingLogo(null); };

  const save = () => {
    try {
      const before = (window.localStorage.getItem('pa_site') || '').length;
      saveSettings(s);
      applyFavicon(s.logo);
      const baked = new Date().toLocaleTimeString();
      toast(`✓ Site settings saved (${baked}). The website will reflect these changes immediately.`);
    } catch (err) {
      toast(`⚠️ Could not save — storage is full. Reduce photo sizes and try again.`, 'err');
    }
  };

  const input = 'w-full border border-wp-border px-2.5 py-2 font-sans text-xs outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa]';
  const Row = ({ label, hint, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-start py-3 border-b border-light-gray last:border-none">
      <div className="text-xs font-semibold text-[#333] pt-1">{label}{hint && <small className="block font-normal text-text-light mt-0.5 text-[0.68rem]">{hint}</small>}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">Site Settings</h1>
        <button className="bg-wp-blue text-white border-none px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-[#005a87]" onClick={save}>💾 Save Settings</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-sm font-semibold text-[#1d2327] mb-4 pb-3 border-b border-wp-border">🏢 Company</h2>
          <Row label="Site Name"><input className={input} value={s.name} onChange={(e) => set('name', e.target.value)} /></Row>
          <Row label="Tagline"><input className={input} value={s.tagline} onChange={(e) => set('tagline', e.target.value)} /></Row>
          <Row label="Logo" hint="PNG/SVG, up to 3MB. Shown in a round badge and auto-fitted.">
            <div className="flex items-center gap-3">
              <SmartLogo src={s.logo} config={s.logoConfig} size={64} eager />
              <label className="bg-wp-blue text-white px-3 py-1.5 text-xs font-semibold cursor-pointer">Upload<input type="file" accept="image/*" hidden onChange={onLogo} /></label>
            </div>
          </Row>
          <Row label="Copyright" hint="Use {year} for current year">
            <input className={input} value={s.copyright} onChange={(e) => set('copyright', e.target.value)} />
          </Row>
          <Row label="Footer Description">
            <textarea className={input} rows="3" value={s.footerAbout} onChange={(e) => set('footerAbout', e.target.value)} />
          </Row>
        </div>

        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-sm font-semibold text-[#1d2327] mb-4 pb-3 border-b border-wp-border">📞 Contact</h2>
          <Row label="Address"><input className={input} value={s.address} onChange={(e) => set('address', e.target.value)} /></Row>
          <Row label="Phone"><input className={input} value={s.phone} onChange={(e) => set('phone', e.target.value)} /></Row>
          <Row label="WhatsApp Number" hint="Digits only, with country code"><input className={input} value={s.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} /></Row>
          <Row label="Email"><input className={input} value={s.email} onChange={(e) => set('email', e.target.value)} /></Row>
          <Row label="Google Maps Embed URL"><input className={input} value={s.mapsEmbed} onChange={(e) => set('mapsEmbed', e.target.value)} /></Row>
          <Row label="Office Hours"><input className={input} value={s.hours} onChange={(e) => set('hours', e.target.value)} /></Row>
          <Row label="Saturday Hours"><input className={input} value={s.hoursSat} onChange={(e) => set('hoursSat', e.target.value)} /></Row>
        </div>

        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-sm font-semibold text-[#1d2327] mb-4 pb-3 border-b border-wp-border">🔗 Social Links</h2>
          <Row label="Facebook"><input className={input} value={s.social?.facebook || ''} onChange={(e) => setSocial('facebook', e.target.value)} /></Row>
          <Row label="LinkedIn"><input className={input} value={s.social?.linkedin || ''} onChange={(e) => setSocial('linkedin', e.target.value)} /></Row>
          <Row label="Twitter / X"><input className={input} value={s.social?.twitter || ''} onChange={(e) => setSocial('twitter', e.target.value)} /></Row>
          <Row label="Instagram"><input className={input} value={s.social?.instagram || ''} onChange={(e) => setSocial('instagram', e.target.value)} /></Row>
          <Row label="YouTube"><input className={input} value={s.social?.youtube || ''} onChange={(e) => setSocial('youtube', e.target.value)} /></Row>
        </div>

        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-sm font-semibold text-[#1d2327] mb-4 pb-3 border-b border-wp-border">🖼️ Image Settings</h2>
          <p className="text-xs text-text-body mb-4 bg-wp-gray/60 p-3 rounded">Applied automatically to all newly uploaded photos (logo, team, media, article images) to keep storage small. You can still fine-tune before saving.</p>
          <Row label="Default Max Width (px)" hint="Largest width any uploaded photo is allowed to keep">
            <input className={input} type="number" min="100" value={s.imgMaxWidth ?? 1600} onChange={(e) => set('imgMaxWidth', parseInt(e.target.value) || 1600)} />
          </Row>
          <Row label="Default Quality (%)" hint="JPG compression quality for resized photos">
            <input className={input} type="number" min="20" max="100" value={s.imgQuality ?? 85} onChange={(e) => set('imgQuality', parseInt(e.target.value) || 85)} />
          </Row>
        </div>
      </div>

      <ImageResizeModal
        src={pendingLogo}
        name="Adjust logo size"
        defaults={{ imgMaxWidth: s.imgMaxWidth || 1600, imgQuality: s.imgQuality ?? 85 }}
        onApply={applyLogo}
        onCancel={() => setPendingLogo(null)}
      />
    </>
  );
}