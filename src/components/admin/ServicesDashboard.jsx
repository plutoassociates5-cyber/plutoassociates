/**
 * Services dashboard — the CMS "All Services" screen: search, filter, sort,
 * bulk actions, duplicate, archive/restore, reorder, and quick publish states.
 */
import { useMemo, useState } from 'react';
import { getServices, getServiceCategories, saveServices, deleteServices, duplicateService, bulkUpdate } from '../../services/store';
import { useToast } from '../../context/ToastContext';

const STATUS_LABEL = { draft: 'Draft', published: 'Published', archived: 'Archived', scheduled: 'Scheduled' };

export default function ServicesDashboard({ onEdit, onAdd }) {
  const { toast } = useToast();
  const [services, setServices] = useState(getServices);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('menu');
  const [sel, setSel] = useState([]);
  const [dragIdx, setDragIdx] = useState(null);
  const cats = getServiceCategories();

  const refresh = () => setServices(getServices());
  const persist = (list) => { saveServices(list); setServices(getServices()); };

  const filtered = useMemo(() => {
    let list = services.slice();
    const needle = q.toLowerCase();
    if (needle) list = list.filter((s) => (s.name + ' ' + (s.shortDescription || '') + ' ' + (s.tags || []).join(' ') + ' ' + (s.category || '')).toLowerCase().includes(needle));
    if (cat) list = list.filter((s) => s.category === cat);
    if (status) list = list.filter((s) => s.status === status);
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'updated') list.sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
    else list.sort((a, b) => (a.menuOrder ?? 999) - (b.menuOrder ?? 999));
    return list;
  }, [services, q, cat, status, sort]);

  const count = (st) => services.filter((s) => s.status === st).length;

  const toggle = (id) => setSel((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = (list) => {
    const ids = list.map((s) => s.id);
    setSel((prev) => (ids.every((x) => prev.includes(x)) ? [] : ids));
  };

  const move = (from, to) => {
    const list = [...services];
    const [it] = list.splice(from, 1);
    list.splice(to, 0, it);
    const ordered = list.map((s, i) => ({ ...s, menuOrder: i + 1 }));
    persist(ordered);
  };

  const handler = (fn, msg) => { fn(); refresh(); if (msg) toast(msg); };

  const bulk = (action) => {
    if (!sel.length) { toast('Select services first.', 'err'); return; }
    if (action === 'delete') {
      if (!confirm(`Delete ${sel.length} service(s)? This cannot be undone.`)) return;
      handler(() => deleteServices(sel), `Deleted ${sel.length} service(s).`);
    } else if (action === 'publish') {
      handler(() => bulkUpdate(sel, { status: 'published' }), `Published ${sel.length} service(s).`);
    } else if (action === 'draft') {
      handler(() => bulkUpdate(sel, { status: 'draft' }), `Set ${sel.length} to draft.`);
    }
    setSel([]);
  };

  const onDrop = (target) => {
    if (dragIdx == null || dragIdx === target) { setDragIdx(null); return; }
    move(dragIdx, target);
    setDragIdx(null);
  };

  const rowSel = (id) => sel.includes(id);

  const th = 'px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border bg-[#f0f0f1]';
  const sticky = 'bg-wp-gray';

  return (
    <div>
      <div className="flex justify-between items-center mb-5 flex-wrap gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans mb-1">Services</h1>
          <div className="text-xs text-text-light flex gap-4">
            <span>{services.length} total</span>
            <span className="text-accent-green">{count('published')} published</span>
            <span className="text-accent-orange">{count('draft')} drafts</span>
            <span className="text-text-light">{count('archived')} archived</span>
          </div>
        </div>
        <button className="bg-wp-blue text-white border-none px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-[#005a87]" onClick={onAdd}>+ Add Service</button>
      </div>

      <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap gap-3 p-4 border-b border-wp-border items-center">
          <input className="border border-wp-border px-3 py-2 text-xs outline-none focus:border-wp-blue w-56" placeholder="Search services…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="border border-wp-border px-2 py-2 text-xs outline-none cursor-pointer text-[#333]" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All categories</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select className="border border-wp-border px-2 py-2 text-xs outline-none cursor-pointer text-[#333]" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select className="border border-wp-border px-2 py-2 text-xs outline-none cursor-pointer text-[#333]" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="menu">Sort: menu order</option>
            <option value="name">Sort: name</option>
            <option value="updated">Sort: last updated</option>
          </select>
          <div className="flex items-center ml-auto gap-2">
            <button className={`px-3 py-1.5 text-xs font-semibold cursor-pointer border ${sel.length ? 'border-wp-blue text-wp-blue hover:bg-blue-50' : 'border-wp-border text-[#999] cursor-not-allowed'}`} disabled={!sel.length} onClick={() => bulk('publish')}>Publish</button>
            <button className={`px-3 py-1.5 text-xs font-semibold cursor-pointer border ${sel.length ? 'border-wp-border hover:bg-wp-gray' : 'border-wp-border text-[#999] cursor-not-allowed'}`} disabled={!sel.length} onClick={() => bulk('draft')}>Draft</button>
            <button className={`px-3 py-1.5 text-xs font-semibold cursor-pointer border border-accent-red text-accent-red hover:bg-red-50 ${sel.length ? '' : 'opacity-40 cursor-not-allowed'}`} disabled={!sel.length} onClick={() => bulk('delete')}>Delete</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className={th}><input type="checkbox" checked={filtered.length > 0 && filtered.every((s) => rowSel(s.id))} onChange={() => toggleAll(filtered)} /></th>
                <th className={th}>Service</th>
                <th className={th}>Category</th>
                <th className={th}>Status</th>
                <th className={'text-center ' + th}>Order</th>
                <th className={'text-right ' + th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id}
                  draggable
                  onDragStart={() => setDragIdx(filtered.indexOf(s))}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(filtered.indexOf(s))}
                  className={`border-b border-light-gray group ${dragIdx === filtered.indexOf(s) ? 'opacity-50' : ''}`}
                >
                  <td className="px-4 py-3"><input type="checkbox" checked={sel.includes(s.id)} onChange={() => toggle(s.id)} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-lg bg-wp-gray/60 border border-wp-border flex items-center justify-center text-lg shrink-0">{s.icon || '💼'}</span>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#1d2327] truncate max-w-[260px]" title={s.name}>{s.name}</div>
                        <div className="text-[0.62rem] text-text-light mt-0.5">{s.featured ? '⭐ Featured · ' : ''}{s.showHome ? 'Homepage · ' : ''}{s.showMenu ? 'Menu · ' : ''}/services/{s.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-body">{cats.find((c) => c.id === s.category)?.name || s.category || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[0.62rem] font-semibold ${s.status === 'published' ? 'bg-green-100 text-green-700' : s.status === 'draft' ? 'bg-amber-100 text-amber-700' : s.status === 'archived' ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-wp-blue'}`}>{STATUS_LABEL[s.status] || s.status}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex gap-1">
                      <button className="border border-wp-border px-1.5 rounded text-[#555] cursor-pointer bg-white hover:bg-wp-gray" disabled={i === 0} onClick={() => move(filtered.indexOf(s), filtered.indexOf(s) - 1)}>↑</button>
                      <button className="border border-wp-border px-1.5 rounded text-[#555] cursor-pointer bg-white hover:bg-wp-gray" disabled={i === filtered.length - 1} onClick={() => move(filtered.indexOf(s), filtered.indexOf(s) + 1)}>↓</button>
                      <span className="text-[0.62rem] text-text-light self-center w-4 text-center">{s.menuOrder}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button className="text-wp-blue cursor-pointer mr-2.5 bg-transparent border-none text-xs" onClick={() => onEdit(s.id)}>Edit</button>
                    <a className="text-wp-blue cursor-pointer mr-2.5 no-underline text-xs" href={`/services/${s.slug}`} target="_blank" rel="noopener noreferrer">View</a>
                    <button className="text-text-body cursor-pointer mr-2.5 bg-transparent border-none text-xs" onClick={() => handler(() => duplicateService(s.id), 'Duplicate created.')}>Duplicate</button>
                    <button className="text-text-body cursor-pointer mr-2.5 bg-transparent border-none text-xs" onClick={() => handler(() => bulkUpdate([s.id], { status: s.status === 'archived' ? 'draft' : 'archived' }), s.status === 'archived' ? 'Restored.' : 'Archived.')}>{s.status === 'archived' ? 'Restore' : 'Archive'}</button>
                    <button className="text-accent-red cursor-pointer bg-transparent border-none text-xs" onClick={() => { if (confirm(`Delete “${s.name}”?`)) handler(() => deleteServices([s.id]), 'Deleted.'); }}>Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-12 text-center text-text-light">No services found. Add one to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}