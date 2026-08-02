import { useMemo, useState } from 'react';
import { getCategories, saveCategories, slugify, uid } from '../../utils/contentStore';
import { useToast } from '../../context/ToastContext';

export default function CategoriesManager() {
  const { toast } = useToast();
  const [cats, setCats] = useState(getCategories);
  const [form, setForm] = useState(null);

  const counts = useMemo(() => {
    const articles = JSON.parse(localStorage.getItem('pluto_articles')) || [];
    return cats.reduce((acc, c) => {
      acc[c.id] = articles.filter((a) => a.category === c.id).length;
      return acc;
    }, {});
  }, [cats]);

  const save = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast('Name is required.', 'err'); return; }
    const next = {
      id: form.id || uid('c'),
      name: form.name.trim(),
      slug: slugify(form.slug || form.name),
    };
    const list = cats.filter((c) => c.id !== next.id).concat(next);
    saveCategories(list);
    setCats(list);
    setForm(null);
    toast('✓ Category saved.');
  };

  const del = (id) => {
    saveCategories(cats.filter((c) => c.id !== id));
    setCats(cats.filter((c) => c.id !== id));
    toast('Category deleted.');
  };

  const input = (cls = '') =>
    'w-full border border-wp-border px-2.5 py-2 font-sans text-xs outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa] ' + cls;

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">Categories</h1>
        {!form && <button className="bg-wp-blue text-white border-none px-3.5 py-1.5 text-xs font-semibold cursor-pointer font-sans hover:bg-[#005a87]" onClick={() => setForm({ id: '', name: '', slug: '' })}>+ Add Category</button>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden lg:col-span-2">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Name</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Slug</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Articles</th>
                <th className="bg-wp-gray px-4 py-2.5 text-right font-semibold text-[#333] text-xs border-b border-wp-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((c) => (
                <tr key={c.id} className="border-b border-light-gray">
                  <td className="px-4 py-3 font-semibold text-[#1d2327]">{c.name}</td>
                  <td className="px-4 py-3 text-text-light">{c.slug}</td>
                  <td className="px-4 py-3"><span className="inline-block px-2 py-0.5 bg-gray-100 text-[#555] text-[0.68rem] rounded">{counts[c.id] || 0}</span></td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <a className="text-wp-blue cursor-pointer mr-3" onClick={() => setForm(c)}>Edit</a>
                    <a className="text-accent-red cursor-pointer" onClick={() => del(c.id)}>Delete</a>
                  </td>
                </tr>
              ))}
              {cats.length === 0 && (
                <tr><td colSpan="4" className="px-4 py-10 text-center text-text-light">No categories yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {form && (
          <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 h-fit">
            <h2 className="text-base text-[#1d2327] mb-4">{form.id ? 'Edit' : 'Add'} Category</h2>
            <form onSubmit={save} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">Name</label>
                <input className={input()} value={form.name} onChange={(e) => { const v = e.target.value; setForm({ ...form, name: v, slug: form.autoSlug ? slugify(v) : form.slug }); }} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">Slug</label>
                <input className={input()} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value, autoSlug: false })} />
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