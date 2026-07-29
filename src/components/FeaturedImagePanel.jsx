import { useState } from 'react';

export default function FeaturedImagePanel({ image, onChange }) {
  const [url, setUrl] = useState(image || '');

  const handleClick = () => {
    const u = prompt('Enter image URL:', 'https://');
    if (u) {
      setUrl(u);
      onChange(u);
    }
  };

  const handleRemove = () => {
    setUrl('');
    onChange(null);
  };

  if (!url) {
    return (
      <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 border-b border-wp-border flex justify-between items-center cursor-pointer">
          <h3 className="text-xs font-semibold text-[#1d2327] flex items-center gap-1.5"><span>🖼</span> Featured Image</h3>
        </div>
        <div className="p-4">
          <div className="border-2 border-dashed border-wp-border p-6 lg:p-8 text-center cursor-pointer transition-all duration-150 hover:border-wp-blue hover:bg-blue-50" onClick={handleClick}>
            <div style={{ fontSize: '2rem' }}>🖼</div>
            <p>Click to enter image URL</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="px-4 py-3 border-b border-wp-border flex justify-between items-center cursor-pointer">
        <h3 className="text-xs font-semibold text-[#1d2327] flex items-center gap-1.5"><span>🖼</span> Featured Image</h3>
      </div>
      <div className="p-4">
        <div className="w-full border border-wp-border">
          <img src={url} alt="Featured" className="w-full block" />
        </div>
        <div className="mt-2 flex gap-2">
          <a onClick={handleClick} className="text-[0.72rem] text-wp-blue cursor-pointer no-underline">Change image</a>
          <a className="text-accent-red text-[0.72rem] cursor-pointer no-underline" onClick={handleRemove}>Remove</a>
        </div>
      </div>
    </div>
  );
}
