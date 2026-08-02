import { useState } from 'react';
import { getTags, saveTags, slugify, uid } from '../../utils/contentStore';
import { useToast } from '../../context/ToastContext';

export default function TagsManager() {
  const { toast } = useToast();
  const [tags, setTags] = useState(getTags);
  const [name, setName] = useState('');

  const add = (e) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    if (tags.some((t) => t.name.toLowerCase() === n.toLowerCase())) {
      toast('That tag already exists.', 'err');
      return;
    }
    const tag = { id: uid('t'), name: n, slug: slugify(n) };
    const list = tags.concat(tag);
    saveTags(list);
    setTags(list);
    setName('');
    toast('✓ Tag added.');
  };

  const del = (id) => {
    saveTags(tags.filter((t) => t.id !== id));
    setTags(tags.filter((t) => t.id !== id));
    toast('Tag deleted.');
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">Tags</h1>
      </div>

      <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 max-w-[720px]">
        <form onSubmit={add} className="flex gap-2 mb-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add a new tag…"
            className="flex-1 border border-wp-border px-2.5 py-2 font-sans text-xs outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa]"
          />
          <button className="bg-wp-blue text-white border-none px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-[#005a87]">+ Add Tag</button>
        </form>

        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t.id} className="inline-flex items-center gap-2 bg-wp-gray border border-wp-border px-3 py-1.5 text-xs text-[#333]">
              #{t.name}
              <button className="text-accent-red cursor-pointer border-none bg-transparent font-semibold text-[0.75rem]" onClick={() => del(t.id)} title="Delete tag">×</button>
            </span>
          ))}
          {tags.length === 0 && <span className="text-xs text-text-light">No tags yet.</span>}
        </div>
      </div>
    </>
  );
}