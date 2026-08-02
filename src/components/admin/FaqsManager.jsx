import { useState } from 'react';
import { getFaqs, saveFaqs, getPracticeAreas, uid } from '../../utils/contentStore';
import { useToast } from '../../context/ToastContext';

export default function FaqsManager() {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState(getFaqs);
  const areas = getPracticeAreas();
  const [form, setForm] = useState(null);

  const save = (e) => {
    e.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) { toast('Question and answer are required.', 'err'); return; }
    const next = {
      id: form.id || uid('f'),
      area: form.area,
      question: form.question.trim(),
      answer: form.answer.trim(),
      order: form.order,
    };
    const list = faqs.filter((x) => x.id !== next.id).concat(next).sort((a, b) => a.order - b.order);
    saveFaqs(list);
    setFaqs(list);
    setForm(null);
    toast('✓ FAQ saved.');
  };

  const del = (id) => {
    saveFaqs(faqs.filter((x) => x.id !== id));
    setFaqs(faqs.filter((x) => x.id !== id));
    toast('FAQ deleted.');
  };

  const input = 'w-full border border-wp-border px-2.5 py-2 font-sans text-xs outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa]';

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">FAQs</h1>
        {!form && <button className="bg-wp-blue text-white border-none px-3.5 py-1.5 text-xs font-semibold cursor-pointer font-sans hover:bg-[#005a87]" onClick={() => setForm({ id: '', area: 'general', question: '', answer: '', order: faqs.length + 1 })}>+ Add FAQ</button>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-auto lg:col-span-2">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border w-12">#</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Practice Area</th>
                <th className="bg-wp-gray px-4 py-2.5 text-left font-semibold text-[#333] text-xs border-b border-wp-border">Question</th>
                <th className="bg-wp-gray px-4 py-2.5 text-right font-semibold text-[#333] text-xs border-b border-wp-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((f) => (
                <tr key={f.id} className="border-b border-light-gray">
                  <td className="px-4 py-3 text-text-light">{f.order}</td>
                  <td className="px-4 py-3 text-[#555]">{f.area === 'general' ? 'General' : (areas.find((a) => a.id === f.area)?.title || f.area)}</td>
                  <td className="px-4 py-3 font-medium text-[#1d2327] max-w-[280px] truncate">{f.question}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <a className="text-wp-blue cursor-pointer mr-3" onClick={() => setForm(f)}>Edit</a>
                    <a className="text-accent-red cursor-pointer" onClick={() => del(f.id)}>Delete</a>
                  </td>
                </tr>
              ))}
              {faqs.length === 0 && <tr><td colSpan="4" className="px-4 py-10 text-center text-text-light">No FAQs yet.</td></tr>}
            </tbody>
          </table>
        </div>

        {form && (
          <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 h-fit">
            <h2 className="text-base text-[#1d2327] mb-4">{form.id ? 'Edit' : 'Add'} FAQ</h2>
            <form onSubmit={save} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">Practice Area</label>
                <select className={input} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}>
                  <option value="general">General</option>
                  {areas.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">Question</label>
                <input className={input} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">Answer</label>
                <textarea className={input} rows="4" value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#333] mb-1.5">Display Order</label>
                <input className={input} type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 1 })} />
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