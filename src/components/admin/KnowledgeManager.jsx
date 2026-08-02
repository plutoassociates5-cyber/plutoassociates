import { useMemo, useRef, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { getAllFaqCategories } from '../../knowledge/faqCategories';
import { generateFaqs } from '../../knowledge/faqGenerator';
import {
  getFaqList, upsert, setStatuses, removeFaqs, duplicate,
  detectDuplicates, searchFaqs,
} from '../../knowledge/faqEngine';

const STATUS_LABEL = { draft: 'Draft', published: 'Published', archived: 'Archived', scheduled: 'Scheduled' };

function emptyFaq(category = 'general') {
  return { category, question: '', answer: '', keywords: [], status: 'draft', searchWeight: 5, publishAt: '', featured: false };
}

export default function KnowledgeManager() {
  const { toast } = useToast();
  const [list, setList] = useState(getFaqList);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [status, setStatus] = useState('');
  const [sel, setSel] = useState([]);
  const [editing, setEditing] = useState(null);
  const [growing, setGrowing] = useState(false);
  const [dups, setDups] = useState([]);
  const fileRef = useRef(null);
  const cats = getAllFaqCategories();

  const refresh = (n) => { setList(n || getFaqList()); };

  const filtered = useMemo(() => {
    let next = list;
    if (q.trim()) next = searchFaqs(list, q);
    if (cat) next = next.filter((f) => f.category === cat);
    if (status) next = next.filter((f) => f.status === status);
    return next.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [list, q, cat, status]);

  const count = (st) => list.filter((f) => f.status === st).length;

  const toggleSel = (id) => setSel((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleAll = () => {
    const ids = filtered.map((f) => f.id);
    setSel((p) => (ids.every((x) => p.includes(x)) ? [] : ids));
  };

  const run = (fn, msg) => { const n = fn(); refresh(n); if (msg) toast(msg); };

  const setBulk = (st) => {
    if (!sel.length) { toast('Select FAQ(s) first.', 'err'); return; }
    run(() => setStatuses(sel, st), `${sel.length} set to ${st}.`);
    setSel([]);
  };
  const delBulk = () => {
    if (!sel.length) { toast('Select FAQ(s) first.', 'err'); return; }
    if (!confirm(`Delete ${sel.length} FAQ(s)? This cannot be undone.`)) return;
    run(() => removeFaqs(sel), `Deleted ${sel.length} FAQ(s).`);
    setSel([]);
  };

  const openDups = () => {
    const q0 = (editing && editing.question) || '';
    setDups(detectDuplicates(q0));
  };

  const saveEditing = (e) => {
    e.preventDefault();
    if (!editing?.question?.trim() || !editing?.answer?.trim()) { toast('Question and answer are required.', 'err'); return; }
    const dups = detectDuplicates(editing.question.trim());
    if (dups.length && editing.id) {
      const excludeSelf = dups.filter((d) => d.id !== editing.id);
      if (excludeSelf.length) {
        if (!confirm(`A similar question already exists ("${excludeSelf[0].question}"). Save anyway?`)) return;
      }
    }
    run(() => upsert({ ...editing, keywords: String(editing.keywords || '').split(',').map((k) => k.trim()).filter(Boolean) }), 'FAQ saved.');
    setEditing(null);
  };

  const exportJson = () => {
    const data = JSON.stringify(list, null, 2);
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'pluto-faqs.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arr = JSON.parse(reader.result);
        if (!Array.isArray(arr)) throw new Error('Not an array');
        const next = list.concat(arr.map((r) => ({ ...emptyFaq(), ...r })));
        toast(`Imported ${arr.length} FAQ(s).`);
        refresh(next);
      } catch (err) { toast('Import failed: ' + err.message, 'err'); }
    };
    reader.readAsText(file);
  };

  const GenerateModal = () => {
    const [g, seG] = useState({ category: 'general', count: 5, topic: '' });
    const [drafts, setDrafts] = useState([]);
    const [picked, setPicked] = useState({});
    const gen = () => {
      const out = generateFaqs({ category: g.category, count: g.count, topic: g.topic });
      setDrafts(out);
      setPicked(out.reduce((m, _, i) => ({ ...m, [i]: true }), {}));
    };
    const savePicked = () => {
      const chosen = drafts.filter((_, i) => picked[i]);
      const next = chosen.map((d) => ({
        ...emptyFaq(g.category), ...d,
      }));
      run(() => {
        let result = getFaqList();
        next.forEach((f) => { result = upsert(f); });
        return result;
      }, `Saved ${next.length} generated FAQ(s) as drafts.`);
      setDrafts([]); setGrowing(false);
    };
    return (
      <div className="fixed inset-0 bg-navy/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-auto rounded-lg shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-wp-border">
            <h2 className="text-base font-semibold text-[#1d2327]">AI FAQ Generator</h2>
            <button onClick={() => setGrowing(false)} className="text-2xl leading-none text-text-light cursor-pointer bg-transparent border-none">&times;</button>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-3 mb-4">
              <label className="flex flex-col text-xs font-semibold text-[#333]">
                Generate by practice area / category
                <select className="mt-1 border border-wp-border px-2 py-2 text-xs outline-none" value={g.category} onChange={(e) => seG({ ...g, category: e.target.value })}>
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label className="flex flex-col text-xs font-semibold text-[#333]">
                Number of FAQs
                <select className="mt-1 border border-wp-border px-2 py-2 text-xs outline-none" value={g.count} onChange={(e) => seG({ ...g, count: Number(e.target.value) })}>
                  {[5, 10, 20].map((n) => <option key={n} value={n}>{n}</option>)}
                  <option value={-1}>Custom</option>
                </select>
              </label>
              <label className="flex flex-col text-xs font-semibold text-[#333] flex-1 min-w-[180px]">
                Keyword / specific topic (optional)
                <input className="mt-1 border border-wp-border px-2 py-2 text-xs outline-none" value={g.topic} onChange={(e) => seG({ ...g, topic: e.target.value })} placeholder="e.g. register a company" />
              </label>
              <button onClick={gen} className="self-end bg-navy text-white px-4 py-2 text-xs font-semibold cursor-pointer border-none">Generate</button>
            </div>

            {drafts.length > 0 && (
              <div>
                <label className="flex items-center gap-2 text-xs mb-2 cursor-pointer">
                  <input type="checkbox" checked={drafts.every((_, i) => picked[i])} onChange={() => setPicked(drafts.every((_, i) => picked[i]) ? {} : drafts.reduce((m, _, i) => ({ ...m, [i]: true }), {}))} />
                  <span className="font-semibold">Select save/preview {drafts.length} draft(s)</span>
                </label>
                <div className="flex flex-col gap-2">
                  {drafts.map((d, i) => (
                    <label key={i} className="flex items-start gap-2 border border-wp-border rounded p-3 cursor-pointer">
                      <input type="checkbox" checked={!!picked[i]} onChange={() => setPicked((p) => ({ ...p, [i]: !p[i] }))} />
                      <div>
                        <div className="text-sm font-medium text-[#1d2327]">{d.question}</div>
                        <div className="text-xs text-text-body mt-1 line-clamp-2">{d.answer}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={savePicked} className="bg-wp-blue text-white px-4 py-2 text-xs font-semibold cursor-pointer border-none">Save selected as drafts</button>
                  <button onClick={() => { setDrafts([]); setGrowing(false); }} className="border border-wp-border px-4 py-2 text-xs cursor-pointer bg-white">Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">Knowledge Centre</h1>
          <div className="text-xs text-text-light mt-1">
            {list.length} FAQs · {count('published')} published · {count('draft')} drafts · {count('archived')} archived
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing(emptyFaq())} className="bg-wp-blue text-white px-3.5 py-1.5 text-xs font-semibold border-none cursor-pointer hover:bg-[#005a87]">+ Add FAQ</button>
          <button onClick={() => setGrowing(true)} className="bg-navy text-white px-3.5 py-1.5 text-xs font-semibold border-none cursor-pointer">✨ AI Generate</button>
          <button onClick={exportJson} className="bg-white border border-wp-border px-3.5 py-1.5 text-xs font-semibold cursor-pointer">Export</button>
          <button onClick={() => fileRef.current?.click()} className="bg-white border border-wp-border px-3.5 py-1.5 text-xs font-semibold cursor-pointer">Import</button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) importJson(f); e.target.value = ''; }} />
        </div>
      </div>

      <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap gap-3 p-4 items-center border-b border-wp-border">
          <input className="border border-wp-border px-3 py-2 text-xs outline-none focus:border-wp-blue w-64" placeholder="Search knowledge centre…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="border border-wp-border px-2 py-2 text-xs outline-none text-[#333]" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All categories</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="border border-wp-border px-2 py-2 text-xs outline-none text-[#333]" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {Object.keys(STATUS_LABEL).map((k) => <option key={k} value={k}>{STATUS_LABEL[k]}</option>)}
          </select>
          <div className="flex ml-auto gap-2">
            <button className={`px-3 py-1.5 text-xs font-semibold border ${sel.length ? 'border-wp-blue text-wp-blue cursor-pointer hover:bg-blue-50' : 'border-wp-border text-[#999] cursor-not-allowed'}`} disabled={!sel.length} onClick={() => setBulk('published')}>Publish</button>
            <button className={`px-3 py-1.5 text-xs font-semibold border ${sel.length ? 'border-wp-border cursor-pointer hover:bg-wp-gray' : 'border-wp-border text-[#999] cursor-not-allowed'}`} disabled={!sel.length} onClick={() => setBulk('draft')}>Draft</button>
            <button className={`px-3 py-1.5 text-xs font-semibold border border-accent-red text-accent-red ${sel.length ? 'cursor-pointer hover:bg-red-50' : 'opacity-40 cursor-not-allowed'}`} disabled={!sel.length} onClick={() => setBulk('archived')}>Archive</button>
            <button className={`px-3 py-1.5 text-xs font-semibold border border-accent-red text-accent-red ${sel.length ? 'cursor-pointer hover:bg-red-50' : 'opacity-40 cursor-not-allowed'}`} disabled={!sel.length} onClick={delBulk}>Delete</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="bg-wp-gray px-4 py-2.5 border-b border-wp-border"><input type="checkbox" checked={filtered.length > 0 && filtered.every((f) => sel.includes(f.id))} onChange={toggleAll} /></th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] border-b border-wp-border">Question</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] border-b border-wp-border">Category</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] border-b border-wp-border">Status</th>
                <th className="bg-wp-gray px-4 py-2.5 text-right font-semibold text-[#333] border-b border-wp-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} className="border-b border-light-gray">
                  <td className="px-4 py-3"><input type="checkbox" checked={sel.includes(f.id)} onChange={() => toggleSel(f.id)} /></td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#1d2327] max-w-[340px]">{f.question}</div>
                    <div className="text-[0.62rem] text-text-light mt-0.5">/faq#{f.slug} · {f.author}</div>
                  </td>
                  <td className="px-4 py-3 text-[#555]">{getCategoryName(f.category)}</td>
                  <td className="px-4 py-3"><StatusBadge st={f.status} schedule={f.status === 'scheduled' ? f.duedAt : ''} /></td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button className="text-wp-blue cursor-pointer mr-2.5 bg-transparent border-none" onClick={() => setEditing({ ...f, keywords: (f.keywords || []).join(', ') })}>Edit</button>
                    <a className="text-wp-blue cursor-pointer mr-2.5 no-underline" href={'/faq#' + f.slug} target="_blank" rel="noreferrer">Preview</a>
                    <button className="text-text-body cursor-pointer mr-2.5 bg-transparent border-none" onClick={() => run(() => duplicate([f.id]), 'Duplicated as draft.')}>Duplicate</button>
                    <button className="text-accent-red cursor-pointer mr-2.5 bg-transparent border-none" onClick={() => run(() => setStatuses([f.id], f.status === 'archived' ? 'draft' : 'archived'), f.status === 'archived' ? 'Restored.' : 'Archived.')}>{f.status === 'archived' ? 'Restore' : 'Archive'}</button>
                    <button className="text-accent-red cursor-pointer bg-transparent border-none" onClick={() => { if (confirm(`Delete this FAQ?`)) run(() => removeFaqs([f.id]), 'Deleted.'); }}>Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="5" className="px-4 py-10 text-center text-text-light">No FAQs found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <EditPanel
          value={editing}
          setValue={setEditing}
          cats={cats}
          dups={dups}
          openDups={openDups}
          setDups={setDups}
          onSave={saveEditing}
          onCancel={() => setEditing(null)}
        />
      )}
      {growing && <GenerateModal />}
    </>
  );
}

function getCategoryName(id) {
  return (getAllFaqCategories().find((c) => c.id === id) || {}).name || id || 'General';
}

function StatusBadge({ st, scheduleAt }) {
  const map = { published: 'bg-green-100 text-green-700', draft: 'bg-amber-100 text-amber-700', archived: 'bg-gray-200 text-gray-600', scheduled: 'bg-blue-100 text-wp-blue' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[0.62rem] font-semibold ${map[st] || 'bg-gray-100 text-gray-700'}`}>
      {STATUS_LABEL[st] || st}{st === 'scheduled' && scheduleAt ? ` · ${scheduleAt.slice(0, 10)}` : ''}
    </span>
  );
}

function EditPanel(props) {
  const f = props.value;
  const set = props.setValue;
  const inputCls = 'w-full border border-wp-border px-2.5 py-2 font-sans text-xs outline-none focus:border-wp-blue';
  return (
    <div className="fixed inset-0 bg-navy/50 z-40 flex items-start justify-center p-4 overflow-auto">
      <form onSubmit={props.onSave} className="bg-white w-full max-w-3xl rounded-lg shadow-xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-wp-border">
          <h2 className="text-base font-semibold text-[#1d2327]">{f.id ? 'Edit FAQ' : 'New FAQ'}</h2>
          <button onClick={props.onCancel} className="text-2xl leading-none text-text-light cursor-pointer bg-transparent border-none">&times;</button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#333] mb-1.5">Question</label>
            <input className={inputCls} value={f.question} onChange={(e) => props.set({ ...f, question: e.target.value })} />
            <button type="button" onClick={props.openDups} className="mt-1.5 text-[0.68rem] text-wp-blue cursor-pointer bg-transparent border-none">Check for duplicates</button>
            {props.dups.length > 0 && (
              <div className="mt-1 text-xs text-accent-red bg-red-50 border border-red-200 rounded px-3 py-2">
                Possible duplicate: <b>{props.dups[0].question}</b> (<label>{props.dups[0].similarity}% similar{props.dups.length > 1 ? `, +${props.dups.length - 1} more` : ''}</label>)
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#333] mb-1.5">Answer</label>
            <textarea className={inputCls + ' min-h-[160px]'} rows="7" value={f.answer} onChange={(e) => props.set({ ...f, answer: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1.5">Category</label>
            <select className={inputCls} value={f.category} onChange={(e) => props.set({ ...f, category: e.target.value })}>
              {props.cats.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1.5">Keywords (comma separated)</label>
            <input className={inputCls} value={f.keywords || ''} onChange={(e) => props.set({ ...f, keywords: e.target.value })} placeholder="trademark nepal, register trademark" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1.5">Status</label>
            <select className={inputCls} value={f.status} onChange={(e) => props.set({ ...f, status: e.target.value })}>
              {Object.keys(STATUS_LABEL).map((k) => <option key={k} value={k}>{STATUS_LABEL[k]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1.5">Schedule publish (if scheduled)</label>
            <input type="datetime-local" className={inputCls} value={f.publishAt || ''} onChange={(e) => props.set({ ...f, publishAt: e.target.value, status: e.target.value ? 'scheduled' : f.status })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#333] mb-1.5">Search weight</label>
            <input type="number" className={inputCls} value={f.searchWeight ?? 0} onChange={(e) => props.set({ ...f, searchWeight: Number(e.target.value) || 0 })} />
          </div>
          <div className="flex items-center gap-2 h-[38px]">
            <input type="checkbox" checked={!!f.featured} onChange={(e) => props.set({ ...f, featured: e.target.checked })} />
            <label className="text-xs font-semibold text-[#333]">Featured FAQ</label>
          </div>
          <div className="md:col-span-2 flex gap-2 border-t border-wp-border pt-4">
            <button type="submit" className="bg-wp-blue text-white px-5 py-2 text-xs font-semibold cursor-pointer border-none hover:bg-[#005a87]">Save FAQ</button>
            <button type="button" onClick={props.onCancel} className="border border-wp-border px-4 py-2 text-xs cursor-pointer bg-white">Cancel</button>
          </div>
        </div>
      </form>
    </div>
  );
}


