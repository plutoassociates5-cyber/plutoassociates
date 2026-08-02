import { useRef, useState } from 'react';
import { getSettings } from '../utils/contentStore';
import { readFileAsDataUrl } from '../utils/image';
import ImageResizeModal from './admin/ImageResizeModal';

export default function FeaturedImagePanel({ image, onChange, alt, onAltChange }) {
  const [url, setUrl] = useState(image || '');
  const fileRef = useRef(null);
  const site = getSettings();
  const [pending, setPending] = useState(null);

  const handleFile = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) { alert('Please choose an image file.'); return; }
    if (f.size > 8 * 1024 * 1024) { alert('Image must be under 8MB.'); return; }
    const dataUrl = await readFileAsDataUrl(f);
    setPending(dataUrl);
  };

  const applyResize = ({ dataUrl }) => { setUrl(dataUrl); onChange(dataUrl); setPending(null); };

  const handleUrl = () => {
    const u = prompt('Enter image URL:', 'https://');
    if (u) {
      setUrl(u);
      onChange(u);
    }
  };

  const handleRemove = () => {
    setUrl('');
    onChange(null);
    if (onAltChange) onAltChange('');
  };

  if (!url) {
    return (
      <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3 border-b border-wp-border flex justify-between items-center">
          <h3 className="text-xs font-semibold text-[#1d2327] flex items-center gap-1.5"><span>🖼</span> Featured Image</h3>
        </div>
        <div className="p-4">
          <div className="border-2 border-dashed border-wp-border p-6 lg:p-8 text-center cursor-pointer transition-all duration-150 hover:border-wp-blue hover:bg-blue-50" onClick={() => fileRef.current && fileRef.current.click()}>
            <div style={{ fontSize: '2rem' }}>🖼</div>
            <p className="mb-2">Click to upload from computer</p>
            <span className="inline-block text-xs bg-wp-blue text-white px-3 py-1.5 font-semibold">Upload Image</span>
          </div>
          <div className="mt-3 text-center">
            <a onClick={handleUrl} className="text-[0.72rem] text-wp-blue cursor-pointer no-underline">or paste an image URL</a>
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
        </div>
        <ImageResizeModal
          src={pending}
          name="Adjust featured image"
          defaults={{ imgMaxWidth: site.imgMaxWidth || 1600, imgQuality: site.imgQuality ?? 85 }}
          onApply={applyResize}
          onCancel={() => setPending(null)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="px-4 py-3 border-b border-wp-border flex justify-between items-center">
        <h3 className="text-xs font-semibold text-[#1d2327] flex items-center gap-1.5"><span>🖼</span> Featured Image</h3>
      </div>
      <div className="p-4">
        <div className="w-full border border-wp-border">
          <img src={url} alt={alt || 'Featured'} className="w-full block" onClick={() => fileRef.current && fileRef.current.click()} style={{ cursor: 'pointer' }} />
        </div>
        <div className="mt-2 flex gap-2 flex-wrap">
          <button onClick={() => fileRef.current && fileRef.current.click()} className="text-[0.72rem] text-wp-blue cursor-pointer no-underline bg-transparent border-none font-semibold">Upload from computer</button>
          <a onClick={handleUrl} className="text-[0.72rem] text-wp-blue cursor-pointer no-underline">Paste URL</a>
          <a className="text-accent-red text-[0.72rem] cursor-pointer no-underline" onClick={handleRemove}>Remove</a>
        </div>
        <label className="block text-[0.7rem] font-semibold text-[#333] mb-1 mt-4">Alt Text <span className="font-normal text-text-light">(accessibility & SEO)</span></label>
        <input
          type="text"
          value={alt || ''}
          onChange={(e) => onAltChange && onAltChange(e.target.value)}
          placeholder="Describe the image for search engines"
          className="w-full border border-wp-border px-2.5 py-2 font-sans text-xs outline-none focus:border-wp-blue"
        />
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
      <ImageResizeModal
        src={pending}
        name="Adjust featured image"
        defaults={{ imgMaxWidth: site.imgMaxWidth || 1600, imgQuality: site.imgQuality ?? 85 }}
        onApply={applyResize}
        onCancel={() => setPending(null)}
      />
      </div>
    </div>
  );
}