import { useState } from 'react';

export default function TagsPanel({ tags, onChange }) {
  const [input, setInput] = useState('');

  const addTag = (val) => {
    const vals = val.split(',').map((t) => t.trim()).filter(Boolean);
    const updated = [...tags];
    vals.forEach((t) => {
      if (t && !updated.includes(t)) updated.push(t);
    });
    onChange(updated);
  };

  const removeTag = (idx) => {
    const updated = tags.filter((_, i) => i !== idx);
    onChange(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input.replace(/,/g, ''));
      setInput('');
    }
  };

  return (
    <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="px-4 py-3 border-b border-wp-border flex justify-between items-center cursor-pointer">
        <h3 className="text-xs font-semibold text-[#1d2327] flex items-center gap-1.5"><span>🏷</span> Tags</h3>
      </div>
      <div className="p-4">
        <div className="border border-wp-border p-1.5 min-h-[36px] flex flex-wrap gap-1 items-center cursor-text">
          {tags.map((tag, idx) => (
            <span key={idx} className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-wp-blue text-[0.7rem] font-semibold rounded">
              {tag}
              <button className="bg-none border-none text-wp-blue cursor-pointer text-sm p-0 leading-none" onClick={() => removeTag(idx)}>×</button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add tag then press Enter or comma"
            className="border-none outline-none font-sans text-xs flex-1 min-w-[80px]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <p className="text-[0.68rem] text-text-light mt-1">
          Separate tags with commas or press Enter. e.g. Nepal Law, Company Registration, FDI
        </p>
      </div>
    </div>
  );
}
