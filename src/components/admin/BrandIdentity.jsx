import { useMemo, useRef, useState } from 'react';
import { getSettings, deepClone, BRAND_SEED } from '../../utils/contentStore';
import { applyBrandVars } from '../../utils/brandVars';
import { useBrand } from '../../context/BrandContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BRAND_PRESETS, applyPreset } from '../../utils/brandPresets';
import BrandAssetsTab from './brand/BrandAssetsTab';
import BrandAppearanceTab from './brand/BrandAppearanceTab';
import BrandLayoutTab from './brand/BrandLayoutTab';
import BrandInfoTab from './brand/BrandInfoTab';
import BrandSeoTab from './brand/BrandSeoTab';
import BrandPreviewTab from './brand/BrandPreviewTab';

const HIST_KEY = 'pa_brand_history';
const MAX_HISTORY = 20;

const TABS = [
  { id: 'assets', label: 'Brand Assets', icon: '🖼' },
  { id: 'colors', label: 'Brand Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '🔤' },
  { id: 'header', label: 'Header', icon: '🧭' },
  { id: 'footer', label: 'Footer', icon: '🦶' },
  { id: 'contact', label: 'Contact Info', icon: '📞' },
  { id: 'office', label: 'Office Info', icon: '🏢' },
  { id: 'social', label: 'Social Media', icon: '🌐' },
  { id: 'seo', label: 'SEO Identity', icon: '🚀' },
  { id: 'preview', label: 'Live Preview', icon: '👁' },
];

export default function BrandIdentity() {
  const { settings, saveWhole, resetBrand } = useBrand();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState('assets');
  const [draft, setDraft] = useState(() => deepClone(getSettings()));
  const [showHistory, setShowHistory] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const fileRef = useRef(null);

  const canEdit = !user || user.role === 'super' || !user.role;

  const setBrand = (section, key, value) => {
    setDraft((d) => {
      const next = deepClone(d);
      if (!next.brand[section]) next.brand[section] = {};
      next.brand[section][key] = value;
      return next;
    });
  };

  const setRoot = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const setSocial = (key, value) =>
    setDraft((d) => ({ ...d, social: { ...d.social, [key]: value } }));

  const changedSummary = useMemo(() => {
    const before = settings.brand || {};
    const after = draft.brand || {};
    return Object.keys(after).filter((k) => JSON.stringify(after[k]) !== JSON.stringify(before[k]));
  }, [draft, settings]);

  const save = () => {
    if (!canEdit) return;
    try {
      pushHistory(settings, changedSummary);
      saveWhole(draft);
      applyBrandVars(draft);
      toast('✓ Brand identity saved. The whole site updates instantly.');
    } catch {
      toast('⚠️ Could not save — storage full. Reduce images and try again.', 'err');
    }
  };

  const reset = () => {
    if (!canEdit) return;
    if (!window.confirm('Reset ALL brand settings to factory defaults?')) return;
    resetBrand();
    setDraft(deepClone(getSettings()));
    toast('Brand reset to defaults.');
  };

  const applyPresetNow = (id) => {
    const preset = BRAND_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setDraft((d) => {
      const next = deepClone(d);
      next.brand = applyPreset(next.brand, preset);
      return next;
    });
    setShowPresets(false);
    toast(`Preset "${preset.name}" applied — review then save.`);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft.brand, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pluto-brand-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const imported = JSON.parse(r.result);
        if (!imported || typeof imported !== 'object') throw new Error('bad');
        setDraft((d) => {
          const next = deepClone(d);
          next.brand = deepMergeBrand(draft.brand, imported);
          return next;
        });
        toast('✓ Brand JSON imported — review then save.');
      } catch {
        toast('⚠️ Invalid brand JSON file.', 'err');
      }
    };
    r.readAsText(f);
  };

  const renderTab = () => {
    const b = draft.brand;
    const common = { canEdit };
    switch (tab) {
      case 'assets': return <BrandAssetsTab b={b} set={setBrand} {...common} />;
      case 'colors': return <BrandAppearanceTab b={b} set={setBrand} focus="colors" {...common} />;
      case 'typography': return <BrandAppearanceTab b={b} set={setBrand} focus="typography" {...common} />;
      case 'header': return <BrandLayoutTab b={b} set={setBrand} focus="header" {...common} />;
      case 'footer': return <BrandLayoutTab b={b} set={setBrand} focus="footer" {...common} />;
      case 'contact': return <BrandInfoTab d={draft} set={setBrand} setRoot={setRoot} setSocial={setSocial} focus="contact" {...common} />;
      case 'office': return <BrandInfoTab d={draft} set={setBrand} setRoot={setRoot} setSocial={setSocial} focus="office" {...common} />;
      case 'social': return <BrandInfoTab d={draft} set={setBrand} setRoot={setRoot} setSocial={setSocial} focus="social" {...common} />;
      case 'seo': return <BrandSeoTab d={draft} set={setBrand} {...common} />;
      case 'preview': return <BrandPreviewTab d={draft} />;
      default: return null;
    }
  };

  return (
    <>
      <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">Brand Identity Manager</h1>
          <p className="text-xs text-text-light mt-1">
            One place to control every brand asset, color, font, layout, contact, social & SEO setting.
          </p>
          {!canEdit && (
            <p className="text-[0.7rem] text-accent-red mt-1 font-semibold">🔒 You are a read-only editor. Changes are disabled.</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <button className="bg-white text-[#333] border border-wp-border px-3.5 py-2 text-xs font-semibold cursor-pointer hover:bg-wp-gray" onClick={() => setShowPresets((v) => !v)}>
              ✨ Presets
            </button>
            {showPresets && (
              <div className="absolute right-0 top-11 z-20 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-wp-border w-64 p-2 flex flex-col gap-1">
                <div className="text-[0.65rem] font-semibold text-text-light px-2 pb-1 pt-1">Quick brand styles</div>
                {BRAND_PRESETS.map((p) => (
                  <button key={p.id} className="text-left px-2.5 py-2 text-xs hover:bg-wp-gray cursor-pointer flex items-center gap-2 border-0 bg-transparent" onClick={() => applyPresetNow(p.id)}>
                    <span className="flex gap-1 shrink-0">
                      <span className="w-3 h-3 rounded-full border border-wp-border" style={{ background: p.colors.primary }} />
                      <span className="w-3 h-3 rounded-full border border-wp-border" style={{ background: p.colors.accent }} />
                    </span>
                    <span>
                      <span className="font-semibold text-[#1d2327] block">{p.name}</span>
                      <span className="text-[0.62rem] text-text-light block">{p.tagline}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="bg-white text-[#333] border border-wp-border px-3.5 py-2 text-xs font-semibold cursor-pointer hover:bg-wp-gray" onClick={exportJson}>
            ⬇ Export
          </button>
          <button className="bg-white text-[#333] border border-wp-border px-3.5 py-2 text-xs font-semibold cursor-pointer hover:bg-wp-gray" onClick={() => fileRef.current && fileRef.current.click()}>
            ⬆ Import
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importJson} />
          <button className="bg-white text-[#333] border border-wp-border px-3.5 py-2 text-xs font-semibold cursor-pointer hover:bg-wp-gray" onClick={() => setShowHistory(true)}>
            🕘 History
          </button>
          <button className="bg-white text-[#333] border border-wp-border px-3.5 py-2 text-xs font-semibold cursor-pointer hover:bg-wp-gray" onClick={reset}>
            ↺ Reset
          </button>
          <button className="bg-wp-blue text-white border-none px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-[#005a87] disabled:opacity-40 disabled:cursor-not-allowed" onClick={save} disabled={!canEdit}>
            💾 Save Changes
          </button>
        </div>
      </div>

      {changedSummary.length > 0 && (
        <div className="mb-4 flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 px-4 py-2 rounded">
          <span className="text-xs text-amber-800">Unsaved changes in: <b>{changedSummary.join(', ')}</b></span>
          <button className="text-xs font-semibold text-wp-blue bg-transparent border-0 cursor-pointer" onClick={save}>Save now</button>
        </div>
      )}

      {/* Tab bar */}
      <div className="mb-5 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-wp-border overflow-x-auto">
        <div className="flex min-w-max">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-3 text-xs font-semibold cursor-pointer border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id ? 'border-wp-blue text-wp-blue bg-wp-gray/50' : 'border-transparent text-[#555] hover:bg-wp-gray'
              }`}
            >
              <span className="mr-1.5">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-full">{renderTab()}</div>

      <HistoryModal open={showHistory} onClose={() => setShowHistory(false)} current={settings} onRestore={(snapshot) => {
        setDraft(deepClone(snapshot));
        setShowHistory(false);
        toast('Snapshot loaded into the editor — review then save.');
      }} />

      {!canEdit && (
        <div className="fixed inset-0 bg-transparent" aria-hidden="true" />
      )}
    </>
  );
}

function pushHistory(prevSettings, summary) {
  let hist = [];
  try { hist = JSON.parse(localStorage.getItem(HIST_KEY)) || []; } catch { /* ignore */ }
  hist.unshift({
    ts: Date.now(),
    user: (typeof localStorage !== 'undefined' ? (() => { try { return JSON.parse(localStorage.getItem('mlp_creds')).n || 'Admin'; } catch { return 'Admin'; } })() : 'Admin'),
    summary: summary.length ? summary.join(', ') : 'minor tweaks',
    snapshot: deepClone(prevSettings),
  });
  hist = hist.slice(0, MAX_HISTORY);
  localStorage.setItem(HIST_KEY, JSON.stringify(hist));
}

function HistoryModal({ open, onClose, onRestore, current }) {
  const [list, setList] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HIST_KEY)) || []; } catch { return []; }
  });
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full max-w-lg max-h-[70vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-wp-border">
          <h3 className="text-sm font-semibold text-[#1d2327]">Version history</h3>
          <button className="text-text-light text-lg cursor-pointer bg-transparent border-0" onClick={onClose}>×</button>
        </div>
        <div className="overflow-y-auto p-3 flex flex-col gap-2 flex-1">
          {list.length === 0 && <div className="text-xs text-text-light p-4 text-center">No saved versions yet. Save changes to create a snapshot.</div>}
          {list.map((h, i) => (
            <div key={h.ts + '-' + i} className="border border-wp-border rounded px-3 py-2.5 flex items-center justify-between gap-3 bg-wp-gray/40">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#1d2327]">
                  {new Date(h.ts).toLocaleString()}
                  {i === 0 && <span className="ml-2 text-[0.6rem] text-wp-blue border border-wp-blue/40 px-1.5 py-0.5 rounded-full">latest</span>}
                </div>
                <div className="text-[0.65rem] text-text-light mt-0.5 truncate">by {h.user} · changed: {h.summary}</div>
              </div>
              <button className="text-xs font-semibold text-wp-blue bg-transparent border border-wp-blue/40 px-2.5 py-1.5 cursor-pointer hover:bg-wp-gray shrink-0" onClick={() => onRestore(h.snapshot)}>
                Restore
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function deepMergeBrand(base, override) {
  const out = deepClone(base || BRAND_SEED);
  for (const k of Object.keys(override || {})) {
    const v = override[k];
    if (v && typeof v === 'object' && !Array.isArray(v) && out[k] && typeof out[k] === 'object') {
      out[k] = { ...out[k], ...v };
    } else {
      out[k] = deepClone(v);
    }
  }
  return out;
}
