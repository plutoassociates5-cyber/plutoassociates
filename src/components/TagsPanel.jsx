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
    <div className="side-panel">
      <div className="side-panel-head">
        <h3><span className="ph-icon">🏷</span> Tags</h3>
      </div>
      <div className="side-panel-body">
        <div className="tags-wrap">
          {tags.map((tag, idx) => (
            <span key={idx} className="tag-chip">
              {tag}
              <button className="remove" onClick={() => removeTag(idx)}>×</button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add tag then press Enter or comma"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <p className="tag-suggest" style={{ fontSize: '0.68rem', color: 'var(--text-light)', marginTop: '0.35rem' }}>
          Separate tags with commas or press Enter. e.g. Nepal Law, Company Registration, FDI
        </p>
      </div>
    </div>
  );
}