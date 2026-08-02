import { useState } from 'react';
import { getPracticeAreas, savePracticeAreas, slugify, uid } from '../../utils/contentStore';
import { useToast } from '../../context/ToastContext';

export default function PracticeAreasManager() {
  const { toast } = useToast();
  const [areas, setAreas] = useState(getPracticeAreas);
  const [form, setForm] = useState(null);

  const save = (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast('Title is required.', 'err'); return; }
    const next = { ...form, id: form.id || uid('pa'), title: form.title.trim(), slug: slugify(form.slug || form.title) };
    const list = areas.filter((a) => a.id !== next.id).concat(next);
    savePracticeAreas(list);
    setAreas(list);
    setForm(null);
    toast('✓ Practice area saved.');
  };

  const move = (id, dir) => {
    const idx = areas.findIndex((a) => a.id === id);
    const target = idx + dir;
    if (target < 0 || target >= areas.length) return;
    const list = areas.slice();
    [list[idx], list[target]] = [list[target], list[idx]];
    savePracticeAreas(list);
    setAreas(list);
  };

  const del = (id) => {
    if (!confirm('Delete this practice area?')) return;
    savePracticeAreas(areas.filter((a) => a.id !== id));
    setAreas(areas.filter((a) => a.id !== id));
    toast('Practice area deleted.');
  };

  const input = 'w-full border border-wp-border px-2.5 py-2 font-sans text-xs outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa]';

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">Practice Areas</h1>
        {!form && <button className="bg-wp-blue text-white border-none px-3.5 py-1.5 text-xs font-semibold cursor-pointer font-sans hover:bg-[#005a87]" onClick={() => setForm({ id: '', title: '', slug: '', icon: '📁', desc: '' })}>+ Add Practice Area</button>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-x-auto lg:col-span-2">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border w-14">Order</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Title</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Slug</th>
                <th className="bg-wp-gray px-4 py-2.5 text-right font-semibold text-[#333] text-xs border-b border-wp-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((a, idx) => (
                <tr key={a.id} className="border-b border-light-gray">
                  <td className="px-4 py-3 text-text-light">{idx + 1}</td>
                  <td className="px-4 py-3 font-semibold text-[#1d2327]">{a.icon} {a.title}</td>
                  <td className="px-4 py-3 text-text-light">{a.slug}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <a className="text-text-light cursor-pointer mr-2" onClick={() => move(a.id, -1)}>↑</a>
                    <a className="text-text-light cursor-pointer mr-3" onClick={() => move(a.id, 1)}>↓</a>
                    <a className="text-wp-blue cursor-pointer mr-3" onClick={() => setForm(a)}>Edit</a>
                    <a className="text-accent-red cursor-pointer" onClick={() => del(a.id)}>Delete</a>
                  </td>
                </tr>
              ))}
              {areas.length === 0 && <tr><td colSpan="4" className="px-4 py-10 text-center text-text-light">No practice areas.</td></tr>}
            </tbody>
          </table>
        </div>

        {form && (
          <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 h-fit">
            <h2 className="text-base text-[#1d2327] mb-4">{form.id ? 'Edit' : 'Add'} Practice Area</h2>
            <form onSubmit={save} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">Title</label>
                <input className={input} value={form.title} onChange={(e) => { const v = e.target.value; setForm({ ...form, title: v, slug: form.autoSlug ? slugify(v) : form.slug }); }} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">Slug</label>
                <input className={input} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value, autoSlug: false })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">Icon</label>
                <input className={input} value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">Description</label>
                <textarea className={input} rows="4" value={form.desc || ''} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-wp-blue text-white border-none py-2 px-5 font-sans text-xs font-semibold cursor-pointer hover:bg-[#005a87]">Save</button>
                <button type="button" className="border border-wp-border px-4 py-2 text-xs font-semibold cursor-pointer bg-white" onClick={() => setForm(null)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}