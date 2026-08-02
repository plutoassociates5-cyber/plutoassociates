/**
 * Create / edit a service — a full, WordPress-style form with rich content
 * editing, images, FAQs, structured blocks (why/process/documents/timeline/
 * pricing), SEO and auto-draft. Saving persists through the services store
 * (swappable to a backend via the data adapter).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  getServices, getServiceCategories, addServiceCategory, upsertService, slugify, uniqueSlug,
} from '../../services/store';
import { getSettings } from '../../utils/contentStore';
import { readFileAsDataUrl, isSvg } from '../../utils/image';
import { useToast } from '../../context/ToastContext';
import RichTextEditor from './RichTextEditor';
import ImageResizeModal from './ImageResizeModal';

const DRAFT_KEY = (id) => `pluto_service_draft_${id || 'new'}`;
const input = 'w-full border border-wp-border px-2.5 py-2 font-sans text-xs outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa]';
const lbl = 'block text-xs font-semibold text-[#333] mb-1';

function Section({ title, children }) {
  return (
    <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="px-4 py-3 border-b border-wp-border"><h3 className="text-xs font-semibold text-[#1d2327]">{title}</h3></div>
      <div className="p-4 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 bg-[#f6f7f8] border border-wp-border rounded px-3 py-2 cursor-pointer">
      <span className="text-xs font-semibold text-[#333]">{label}</span>
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 cursor-pointer" />
    </label>
  );
}

function ListField({ items, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-2">
      {(items || []).map((it, i) => (
        <div key={i} className="flex gap-2 items-start">
          <textarea rows="2" className={input} value={it} placeholder={placeholder} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? e.target.value : x)))} />
          <button className="shrink-0 text-accent-red px-1 text-sm border-none bg-transparent cursor-pointer" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>✕</button>
        </div>
      ))}
      <button className="self-start border border-wp-border px-3 py-1.5 text-xs font-semibold cursor-pointer bg-white hover:bg-wp-gray" onClick={() => onChange([...(items || []), ''])}>+ Add</button>
    </div>
  );
}

function KeyValueField({ items, onChange, keyLabel, valLabel }) {
  return (
    <div className="flex flex-col gap-2">
      {(items || []).map((it, i) => (
        <div key={i} className="flex gap-2 items-start">
          <input className={input} placeholder={keyLabel} value={it[0] || ''} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? [e.target.value, x[1]] : x)))} />
          <input className={input} placeholder={valLabel} value={it[1] || ''} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? [x[0], e.target.value] : x)))} />
          <button className="shrink-0 text-accent-red px-1 text-sm border-none bg-transparent cursor-pointer" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>✕</button>
        </div>
      ))}
      <button className="bg-white border border-wp-border self-start px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-wp-gray" onClick={() => onChange([...(items || []), ['', '']])}>+ Add</button>
    </div>
  );
}

function FaqField({ items, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      {(items || []).map((it, i) => (
        <div key={i} className="border border-wp-border rounded p-3 flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <span className="text-[0.6rem] text-text-light">Q{i + 1}</span>
            <input className={input} value={it.q || ''} placeholder="Question" onChange={(e) => onChange(items.map((x, idx) => (idx === i ? { ...x, q: e.target.value } : x)))} />
            <button className="shrink-0 text-accent-red px-1 border-none bg-transparent cursor-pointer" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>✕</button>
          </div>
          <textarea rows="2" className={input} placeholder="Answer" value={it.a || ''} onChange={(e) => onChange(items.map((x, idx) => (idx === i ? { ...x, a: e.target.value } : x)))} />
        </div>
      ))}
      <button className="bg-white border border-wp-border self-start px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-wp-gray" onClick={() => onChange([...(items || []), { q: '', a: '' }])}>+ Add FAQ</button>
    </div>
  );
}

function ImageField({ value, onChange, hint }) {
  const [pending, setPending] = useState(null);
  return (
    <div>
      <div className="text-[0.7rem] text-text-light mb-1.5">{hint}</div>
      <div className="flex items-start gap-4">
        <div className="w-24 h-16 bg-wp-gray/50 border border-wp-border rounded overflow-hidden shrink-0 flex items-center justify-center">
          {value ? <img src={value} alt="" className="w-full h-full object-cover" /> : <span className="text-[0.6rem] text-text-light">No image</span>}
        </div>
        <div className="flex-1 min-w-0">
          <label className="inline-block bg-wp-blue text-white px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-[#005a87]">
            Upload
            <input type="file" accept="image/*" hidden onChange={async (e) => {
              const f = e.target.files && e.target.files[0];
              e.target.value = '';
              if (!f || !f.type.startsWith('image/')) return;
              const d = await readFileAsDataUrl(f);
              if (isSvg(d)) { onChange(d); return; }
              setPending(d);
            }} />
          </label>
          <input className={input + ' mt-2'} placeholder="Or paste image URL…" value={value || ''} onChange={(e) => onChange(e.target.value)} />
        </div>
      </div>
      <ImageResizeModal
        src={pending}
        name="Adjust image"
        defaults={getSettings()}
        onApply={({ dataUrl }) => { onChange(dataUrl); setPending(null); }}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}

const ICONS = ['⚖️', '🏢', '🌐', '✅', '📝', '🤝', '🔀', '🔍', '📊', '👥', '💡', '💻', '🏠', '🏦', '🛡️', '📜', '💼', '🔒', '🏗️', '📚'];
const comp = (list) => list.slice(0, 1);

export default function ServiceEditor({ editId, onNavigate }) {
  const { toast } = useToast();
  const all = getServices();
  const existing = editId ? all.find((x) => x.id === editId) : null;

  const [s, setS] = useState(existing || {
    id: '', name: '', slug: '', shortDescription: '', content: '',
    icon: '⚖️', category: '', bannerImage: '', featuredImage: '', ogImage: '',
    twitterCard: '', gallery: [], why: ['', '', ''], process: ['', '', '', ''],
    faqs: [], documents: '', timeline: [], pricing: '', related: [], tags: [],
    ctaLabel: 'Schedule Consultation', contactLabel: 'Contact Us', status: 'draft',
    scheduledAt: '', featured: false, showHome: false, showMenu: false, menuOrder: 1,
    seoTitle: '', seoDescription: '', keywords: '', canonical: '', schemaJson: '',
    author: 'Adv. Sudeep Nepal', updatedAt: new Date().toISOString().split('T')[0],
  });
  const [draftSavedAt, setDraftSavedAt] = useState(null);
  const [preview, setPreview] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [catNew, setCatNew] = useState('');
  const [newCatVal, setNewCatVal] = useState('');
  const lastSnapshot = useRef('');

  const cats = getServiceCategories();
  const currentSlug = slugTouched && s.slug ? s.slug : uniqueSlug(s.name || 'service', all, s.id);

  const set = (k, v) => setS((prev) => ({ ...prev, [k]: v }));

  const onName = (v) => {
    setS((prev) => {
      const n = { ...prev, name: v };
      if (!slugTouched && v.trim()) n.slug = slugify(v);
      return n;
    });
  };

  const persistDraft = () => {
    localStorage.setItem(DRAFT_KEY(s.id), JSON.stringify(s));
    setDraftSavedAt(new Date());
  };

  useEffect(() => {
    const timer = setInterval(persistDraft, 30000);
    window.addEventListener('beforeunload', persistDraft);
    return () => { clearInterval(timer); window.removeEventListener('beforeunload', persistDraft); };
  }, [s]);

  const save = (status) => {
    if (!s.name.trim()) { toast('Service name is required.', 'err'); return; }
    const rec = { ...s, status, slug: currentSlug, updatedAt: new Date().toISOString().split('T')[0] };
    upsertService(rec);
    localStorage.removeItem(DRAFT_KEY(s.id));
    toast(status === 'draft' ? '✓ Draft saved.' : status === 'archived' ? 'Archived.' : '✓ Service published.');
  };

  const addCat = () => {
    if (!newCatVal.trim()) return;
    addServiceCategory(newCatVal.trim());
    set('category', slugify(newCatVal.trim()));
    setNewCatVal('');
  };

  const relatedSet = new Set(s.related || []);
  const toggleRelated = (id) => {
    const next = new Set(s.related || []);
    if (next.has(id)) next.delete(id); else next.add(id);
    set('related', Array.from(next));
  };
  const setCatN = (e) => set('category', e.target.value);
  const setStatus = (v) => set('status', v);

  const previewOpen = preview;
  const closePreview = () => setPreview(false);

  return (
    <>
      <div className="sticky top-0 z-[50] -mx-4 px-4 py-3 bg-[#f0f0f1]/95 backdrop-blur border-b border-wp-border mb-6 flex justify-between items-center gap-3 flex-wrap rounded-b">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans m-0">{editId ? 'Edit Service' : 'Add New Service'}</h1>
          {draftSavedAt && <span className="hidden sm:inline text-[0.68rem] text-text-light">Auto-saved {new Date(draftSavedAt).toLocaleTimeString()}</span>}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="bg-white text-[#333] border border-wp-border px-3.5 py-1.5 text-xs font-semibold cursor-pointer hover:bg-wp-gray" onClick={() => setPreview(true)}>Preview</button>
          <button className="bg-white text-[#1d2327] border-2 border-wp-blue px-3.5 py-1.5 text-xs font-semibold cursor-pointer hover:bg-blue-50" onClick={() => save('draft')}>💾 Save Draft</button>
          <button className="bg-wp-blue text-white border-none px-3.5 py-1.5 text-xs font-semibold cursor-pointer hover:bg-[#005a87]" onClick={() => save('published')}>✓ Publish</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-6 items-start">
        <div className="flex flex-col gap-4">
          <Section title="Title & Permalink">
            <input
              className="font-serif text-xl font-semibold border-b-2 border-light-gray px-0 py-2 text-[#1d2327] outline-none bg-transparent focus:border-wp-blue"
              value={s.name} onChange={(e) => onName(e.target.value)} placeholder="Service name…"
            />
            <div className="text-[0.72rem] text-text-light flex items-center gap-1.5 flex-wrap">
              <strong>Permalink:</strong>
              <span>https://plutoassociates.com/</span>
              <input
                className="border border-wp-border px-1.5 py-0.5 text-[0.72rem] outline-none focus:border-wp-blue min-w-[150px]"
                value={currentSlug}
                onFocus={() => { setSlugTouched(true); }}
                onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }}
              />
              <button className="bg-wp-gray border border-wp-border px-2.5 py-0.5 text-[0.7rem] cursor-pointer" onClick={() => { set('slug', slugify(s.name)); setSlugTouched(true); }}>Regenerate</button>
            </div>
          </Section>

          <Section title="Short Description">
            <textarea className={input} rows="3" value={s.shortDescription || ''} onChange={(e) => set('shortDescription', e.target.value)} placeholder="Short summary shown on cards & in meta." />
          </Section>

          <Section title="Description">
            <RichTextEditor value={s.content || ''} onChange={(html) => set('content', html)} />
          </Section>

          <Section title="Why Choose Pluto Associates">
            <ListField items={s.why} onChange={(list) => set('why', list)} placeholder="A reason a client should choose us…" />
          </Section>

          <Section title="Our Process">
            <ListField items={s.process} onChange={(list) => set('process', list)} placeholder="Step of the engagement…" />
          </Section>

          <Section title="Required Documents">
            <textarea rows="3" className={input} value={s.documents || ''} onChange={(e) => set('documents', e.target.value)} placeholder="What clients should bring / provide." />
          </Section>

          <Section title="Timeline">
            <KeyValueField items={s.timeline} onChange={(list) => set('timeline', list)} keyLabel="Phase" valLabel="Timeline / details" />
          </Section>

          <Section title="Pricing (optional)">
            <input className={input} value={s.pricing || ''} onChange={(e) => set('pricing', e.target.value)} placeholder='e.g. Starting from NPR 25,000, or "By engagement"' />
          </Section>

          <Section title="Frequently Asked Questions">
            <FaqField items={s.faqs} onChange={(list) => set('faqs', list)} />
          </Section>

          <Section title="Related Services">
            <div className="flex flex-wrap gap-2">
              {all.filter((x) => x.id !== s.id).map((x) => (
                <button key={x.id} className={`px-3 py-1.5 text-xs font-semibold cursor-pointer border ${relatedIds.has(x.id) ? 'bg-wp-blue text-white border-wp-blue' : 'bg-white text-[#555] border-wp-border hover:bg-wp-gray'}`} onClick={() => toggleRelated(x.id)}>{x.name}</button>
              ))}
            </div>
          </Section>
        </div>

        <div className="flex flex-col gap-4">
          <Section title="Publish">
            <div className="grid grid-cols-2 gap-2 text-[0.72rem] font-semibold">
              {[['draft', 'Draft'], ['published', 'Published'], ['archived', 'Archived'], ['scheduled', 'Scheduled']].map(([k, label]) => (
                <label key={k} className={`flex items-center gap-2 px-3 py-2 border rounded cursor-pointer capitalize ${s.status === k ? 'border-wp-blue bg-blue-50' : 'border-wp-border bg-white'}`}>
                  <input type="radio" name="status" checked={s.status === k} onChange={() => setStatus(k)} /> {label}
                </label>
              ))}
            </div>
            {s.status === 'scheduled' && (
              <input type="datetime-local" value={s.scheduledAt || ''} onChange={(e) => set('scheduledAt', e.target.value)} className={input} />
            )}
            <Toggle label="Featured service" checked={s.featured} onChange={(v) => set('featured', v)} />
            <Toggle label="Show on homepage" checked={s.showHome} onChange={(v) => set('showHome', v)} />
            <Toggle label="Show in menu" checked={s.showMenu} onChange={(v) => set('showMenu', v)} />
          </Section>

          <Section title="Menu & Buttons">
            <label className="block">
              <span className={lbl}>Display order (menus + grids)</span>
              <input type="number" className={input} value={s.menuOrder} onChange={(e) => set('menuOrder', parseInt(e.target.value) || 1)} />
            </label>
            <label className="block">
              <span className={lbl}>CTA button label</span>
              <input className={input} value={s.ctaLabel || ''} onChange={(e) => set('ctaLabel', e.target.value)} />
            </label>
            <label className="block">
              <span className={lbl}>Contact button label</span>
              <input className={input} value={s.contactLabel || ''} onChange={(e) => set('contactLabel', e.target.value)} />
            </label>
          </Section>

          <Section title="Category & Tags">
            <div>
              <span className={lbl}>Category</span>
              <select className={input} value={s.category} onChange={(e) => set('category', e.target.value)}>
                <option value="">— select —</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="flex gap-2 mt-2">
                <input className={input} value={newCatVal} onChange={(e) => setNewCatVal(e.target.value)} placeholder="New category…" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCat(); } }} />
                <button className="border border-wp-border px-2 text-xs cursor-pointer bg-white hover:bg-wp-gray" onClick={addCat}>Add</button>
              </div>
            </div>
            <div>
              <span className={lbl}>Tags</span>
              <input className={input} value={(s.tags || []).join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))} placeholder="Comma separated" />
            </div>
          </Section>

          <Section title="Icon">
            <div className="flex flex-wrap gap-2">
              {ICONS.map((ic) => (
                <button key={ic} className={`w-9 h-9 rounded border text-lg flex items-center justify-center cursor-pointer ${s.icon === ic ? 'border-wp-blue bg-blue-50' : 'border-wp-border bg-white hover:bg-wp-gray'}`} onClick={() => set('icon', ic)}>{ic}</button>
              ))}
            </div>
          </Section>

          <Section title="Images">
            <ImageField value={s.bannerImage} onChange={(v) => set('bannerImage', v)} hint="Banner image (hero background)" />
            <ImageField value={s.featuredImage} onChange={(v) => set('featuredImage', v)} hint="Featured image (cards / Open Graph)" />
          </Section>

          <Section title="SEO">
            <label className="block"><span className={lbl}>SEO Title</span><input className={input} value={s.seoTitle || ''} onChange={(e) => set('seoTitle', e.target.value)} /></label>
            <label className="block"><span className={lbl}>Meta Description</span><textarea className={input} rows="2" value={s.seoDescription || ''} onChange={(e) => set('seoDescription', e.target.value)} /></label>
            <label className="block"><span className={lbl}>Keywords</span><input className={input} value={s.keywords || ''} onChange={(e) => set('keywords', e.target.value)} /></label>
            <label className="block"><span className={lbl}>Canonical URL</span><input className={input} value={s.canonical || ''} onChange={(e) => set('canonical', e.target.value)} /></label>
            <label className="block"><span className={lbl}>Open Graph image</span><input className={input} value={s.ogImage || ''} onChange={(e) => set('ogImage', e.target.value)} /></label>
            <label className="block"><span className={lbl}>Author</span><input className={input} value={s.author || ''} onChange={(e) => set('author', e.target.value)} /></label>
            <label className="block"><span className={lbl}>Schema JSON (optional)</span><textarea className={input + ' font-mono'} rows="3" value={s.schemaJson || ''} onChange={(e) => set('schemaJson', e.target.value)} /></label>
          </Section>
        </div>
      </div>
    </>
  );
}