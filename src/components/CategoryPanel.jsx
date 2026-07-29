import { useState } from 'react';
import { slugify } from '../utils/storage';
import { useToast } from '../context/ToastContext';

const DEFAULT_CATEGORIES = [
  { val: 'general', label: 'General' },
  { val: 'fdi', label: 'FDI & Investment' },
  { val: 'corporate', label: 'Corporate Law' },
  { val: 'labor', label: 'Labor & Employment' },
  { val: 'energy', label: 'Energy Law' },
  { val: 'tax', label: 'Taxation' },
  { val: 'ip', label: 'Intellectual Property' },
  { val: 'litigation', label: 'Litigation' },
  { val: 'banking-finance', label: 'Banking & Finance' },
  { val: 'real-estate', label: 'Real Estate' },
  { val: 'family-law', label: 'Family Law' },
  { val: 'criminal-law', label: 'Criminal Law' },
];

export default function CategoryPanel({ category, onChange }) {
  const { toast } = useToast();
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState('');

  const handleAdd = () => {
    if (!newCat.trim()) return;
    const val = slugify(newCat);
    setCategories((prev) => [...prev, { val, label: newCat.trim() }]);
    onChange(val);
    setNewCat('');
    setShowAdd(false);
    toast('Category added!', 'info');
  };

  return (
    <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="px-4 py-3 border-b border-wp-border flex justify-between items-center cursor-pointer">
        <h3 className="text-xs font-semibold text-[#1d2327] flex items-center gap-1.5"><span>🗂</span> Categories</h3>
      </div>
      <div className="p-4">
        <div className="max-h-[150px] overflow-y-auto border border-wp-border p-2 mb-3">
          {categories.map((c) => (
            <div key={c.val} className="flex items-center gap-1.5 py-1 text-xs">
              <input
                type="checkbox"
                checked={category === c.val}
                onChange={() => onChange(c.val)}
              />
              <span>{c.label}</span>
            </div>
          ))}
        </div>
        <button className="text-xs text-wp-blue cursor-pointer bg-none border-none font-sans mb-2 p-0" onClick={() => setShowAdd(!showAdd)}>
          + Add New Category
        </button>
        {showAdd && (
          <div style={{ display: 'block' }}>
            <input
              type="text"
              placeholder="New category name"
              className="w-full border border-wp-border px-2 py-1.5 text-xs font-sans outline-none mb-1.5"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            />
            <button className="bg-wp-gray border border-wp-border px-3 py-1 text-xs cursor-pointer font-sans" onClick={handleAdd}>Add</button>
          </div>
        )}
      </div>
    </div>
  );
}
