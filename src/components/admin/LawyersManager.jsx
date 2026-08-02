import { useState } from 'react';
import { getLawyers, saveLawyers, getPracticeAreas, uid, getSettings } from '../../utils/contentStore';
import { useToast } from '../../context/ToastContext';
import { readFileAsDataUrl } from '../../utils/image';
import ImageResizeModal from './ImageResizeModal';

export default function LawyersManager() {
  const { toast } = useToast();
  const [lawyers, setLawyers] = useState(getLawyers);
  const areas = getPracticeAreas();
  const [form, setForm] = useState(null);
  const [pendingImg, setPendingImg] = useState(null);
  const site = getSettings();

  const onImage = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 2500000) { toast('Image must be under 2.5MB.', 'err'); return; }
    const dataUrl = await readFileAsDataUrl(file);
    setPendingImg(dataUrl);
  };

  const applyImg = ({ dataUrl }) => { setForm((f) => ({ ...f, img: dataUrl })); setPendingImg(null); };

  const save = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast('Name is required.', 'err'); return; }
    const next = { ...form, id: form.id || uid('l'), name: form.name.trim() };
    delete next.autoSlug;
    const list = lawyers.filter((l) => l.id !== next.id).concat(next);
    saveLawyers(list);
    setLawyers(list);
    setForm(null);
    toast('✓ Lawyer saved.');
  };

  const del = (id) => {
    if (!confirm('Delete this lawyer?')) return;
    saveLawyers(lawyers.filter((l) => l.id !== id));
    setLawyers(lawyers.filter((l) => l.id !== id));
    toast('Lawyer deleted.');
  };

  const input = 'w-full border border-wp-border px-2.5 py-2 font-sans text-xs outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa]';

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">Lawyers / Team</h1>
        {!form && <button className="bg-wp-blue text-white border-none px-3.5 py-1.5 text-xs font-semibold cursor-pointer font-sans hover:bg-[#005a87]" onClick={() => setForm({ id: '', img: '', name: '', designation: '', bio: '', email: '', phone: '', linkedin: '', focus: '', featured: false })}>+ Add Lawyer</button>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-x-auto lg:col-span-2">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Name</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Designation</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Featured</th>
                <th className="bg-wp-gray px-4 py-2.5 text-right font-semibold text-[#333] text-xs border-b border-wp-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lawyers.map((l) => (
                <tr key={l.id} className="border-b border-light-gray">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {l.img && <img src={l.img} alt={l.name} className="w-9 h-9 rounded-full object-cover shrink-0" />}
                      <span className="font-semibold text-[#1d2327]">{l.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-body">{l.designation}</td>
                  <td className="px-4 py-3">{l.featured ? '⭐' : '—'}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <a className="text-wp-blue cursor-pointer mr-3" onClick={() => setForm({ ...l, autoSlug: false })}>Edit</a>
                    <a className="text-accent-red cursor-pointer" onClick={() => del(l.id)}>Delete</a>
                  </td>
                </tr>
              ))}
              {lawyers.length === 0 && <tr><td colSpan="4" className="px-4 py-10 text-center text-text-light">No lawyers yet.</td></tr>}
            </tbody>
          </table>
        </div>

        {form && (
          <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 h-fit max-h-[80vh] overflow-y-auto">
            <h2 className="text-base text-[#1d2327] mb-4">{form.id ? 'Edit' : 'Add'} Lawyer</h2>
            <form onSubmit={save} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <img src={form.img || ''} alt="" className="w-14 h-14 rounded-full object-cover bg-light-gray" />
                <label className="bg-wp-gray border border-wp-border px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-light-gray">
                  Upload Photo
                  <input type="file" accept="image/*" hidden onChange={onImage} />
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#333] mb-1.5">Name</label>
                  <input className={input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#333] mb-1.5">Designation</label>
                  <input className={input} value={form.designation || ''} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#333] mb-1.5">Email</label>
                  <input className={input} value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#333] mb-1.5">Phone</label>
                  <input className={input} value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">Focus / Specialization</label>
                <input className={input} value={form.focus || ''} onChange={(e) => setForm({ ...form, focus: e.target.value })} placeholder="e.g. Corporate Law, Litigation" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">Bio / Summary</label>
                <textarea className={input} rows="4" value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">LinkedIn URL</label>
                <input className={input} value={form.linkedin || ''} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#333]">
                <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Featured member
              </label>
              <div className="flex gap-2">
                <button type="submit" className="bg-wp-blue text-white border-none py-2 px-5 font-sans text-xs font-semibold cursor-pointer hover:bg-[#005a87]">Save</button>
                <button type="button" className="border border-wp-border px-4 py-2 text-xs font-semibold cursor-pointer bg-white" onClick={() => setForm(null)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>

      <ImageResizeModal
        src={pendingImg}
        name="Adjust team photo"
        defaults={{ imgMaxWidth: site.imgMaxWidth || 1600, imgQuality: site.imgQuality ?? 85 }}
        onApply={applyImg}
        onCancel={() => setPendingImg(null)}
      />
    </>
  );
}