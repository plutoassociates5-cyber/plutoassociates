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
    <div className="side-panel">
      <div className="side-panel-head">
        <h3><span className="ph-icon">🗂</span> Categories</h3>
      </div>
      <div className="side-panel-body">
        <div className="cat-list">
          {categories.map((c) => (
            <div key={c.val} className="cat-item">
              <input
                type="checkbox"
                checked={category === c.val}
                onChange={() => onChange(c.val)}
              />
              <span>{c.label}</span>
            </div>
          ))}
        </div>
        <button className="add-cat-toggle" onClick={() => setShowAdd(!showAdd)}>
          + Add New Category
        </button>
        {showAdd && (
          <div className="add-cat-form" style={{ display: 'block' }}>
            <input
              type="text"
              placeholder="New category name"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            />
            <button onClick={handleAdd}>Add</button>
          </div>
        )}
      </div>
    </div>
  );
}