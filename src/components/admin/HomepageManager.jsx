import { useState } from 'react';
import { getHomepage, saveHomepage } from '../../utils/contentStore';
import { useToast } from '../../context/ToastContext';

export default function HomepageManager() {
  const { toast } = useToast();
  const [hp, setHp] = useState(getHomepage);

  const setHero = (k, v) => setHp((prev) => ({ ...prev, hero: { ...prev.hero, [k]: v } }));
  const setStat = (i, k, v) => setHp((prev) => ({ ...prev, stats: prev.stats.map((s, idx) => (idx === i ? { ...s, [k]: v } : s)) }));
  const setServicesSection = (k, v) => setHp((prev) => ({ ...prev, servicesSection: { ...prev.servicesSection, [k]: v } }));

  const save = () => { saveHomepage(hp); toast('✓ Homepage saved. The public homepage is updated immediately.'); };

  const input = 'w-full border border-wp-border px-2.5 py-2 font-sans text-xs outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa]';
  const Row = ({ label, hint, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 items-start py-3 border-b border-light-gray last:border-none">
      <div className="text-xs font-semibold text-[#333] pt-1">{label}{hint && <small className="block font-normal text-text-light mt-0.5 text-[0.68rem]">{hint}</small>}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">Homepage Manager</h1>
        <button className="bg-wp-blue text-white border-none px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-[#005a87]" onClick={save}>💾 Save Homepage</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-sm font-semibold text-[#1d2327] mb-4 pb-3 border-b border-wp-border">🦸 Hero Section</h2>
          <Row label="Badge"><input className={input} value={hp.hero.badge} onChange={(e) => setHero('badge', e.target.value)} /></Row>
          <Row label="Headline"><textarea className={input} rows="2" value={hp.hero.headline} onChange={(e) => setHero('headline', e.target.value)} /></Row>
          <Row label="Subheadline"><textarea className={input} rows="3" value={hp.hero.subheadline} onChange={(e) => setHero('subheadline', e.target.value)} /></Row>
          <Row label="Primary Button" hint="Links to /contact">
            <input className={input} value={hp.hero.ctaPrimary} onChange={(e) => setHero('ctaPrimary', e.target.value)} />
          </Row>
          <Row label="Secondary Button" hint="Links to /practice-areas">
            <input className={input} value={hp.hero.ctaSecondary} onChange={(e) => setHero('ctaSecondary', e.target.value)} />
          </Row>
        </div>

        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-sm font-semibold text-[#1d2327] mb-4 pb-4 border-b border-wp-border">📊 Statistics</h2>
          <div className="flex flex-col gap-3">
            {hp.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 border border-light-gray p-3">
                <div>
                  <label className="block text-[0.65rem] font-semibold text-text-light mb-1">Value</label>
                  <input className={input} value={s.value} onChange={(e) => setStat(i, 'value', e.target.value)} />
                </div>
                <div>
                  <label className="block text-[0.65rem] font-semibold text-text-light mb-1">Label</label>
                  <input className={input} value={s.label} onChange={(e) => setStat(i, 'label', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[0.68rem] text-text-light mt-3">These appear in the dark statistics band on the homepage.</p>
        </div>

        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-sm font-semibold text-[#1d2327] mb-4 pb-3 border-b border-wp-border">🛠️ Our Services Section</h2>
          <Row label="Show section">
            <label className="flex items-center gap-2 text-xs text-[#333] cursor-pointer">
              <input type="checkbox" checked={hp.servicesSection.visible} onChange={(e) => setServicesSection('visible', e.target.checked)} className="w-4 h-4 accent-[#0073aa]" />
              Display on the public homepage
            </label>
          </Row>
          <Row label="Title"><input className={input} value={hp.servicesSection.title} onChange={(e) => setServicesSection('title', e.target.value)} /></Row>
          <Row label="Subtitle"><textarea className={input} rows="2" value={hp.servicesSection.subtitle} onChange={(e) => setServicesSection('subtitle', e.target.value)} /></Row>
          <Row label="Button label" hint="Links to /services">
            <input className={input} value={hp.servicesSection.ctaLabel} onChange={(e) => setServicesSection('ctaLabel', e.target.value)} />
          </Row>
        </div>
      </div>
    </>
  );
}