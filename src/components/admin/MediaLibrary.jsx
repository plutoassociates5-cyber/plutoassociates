import { useMemo, useRef, useState } from 'react';
import { getMedia, saveMedia, uid } from '../../utils/contentStore';
import { getArticles } from '../../utils/storage';
import { useToast } from '../../context/ToastContext';

const MB = 1024 * 1024;
const MAX = 2.5 * MB;

export default function MediaLibrary() {
  const { toast } = useToast();
  const [items, setItems] = useState(getMedia);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('all');
  const [drop, setDrop] = useState(false);
  const fileRef = useRef(null);

  const folders = useMemo(() => [...new Set(items.map((i) => i.folder).filter(Boolean))], [items]);

  const filtered = useMemo(() => items.filter((i) => {
    const inFolder = folder === 'all' || i.folder === folder;
    const q = search.toLowerCase();
    const match = !q || (i.name || '').toLowerCase().includes(q);
    return inFolder && match;
  }), [items, folder, search]);

  const countUsage = (id) => getArticles().filter((a) => a.featuredImage === id || (a.content || '').includes(id)).length;

  const handleFiles = (list) => {
    const valid = Array.from(list).filter((f) => f.type.startsWith('image/'));
    if (valid.length === 0) { toast('Only image files are supported.', 'err'); return; }
    let added = 0;
    valid.forEach((file) => {
      if (file.size > MAX) { toast(`"${file.name}" is larger than 2.5MB.`, 'err'); return; }
      const reader = new FileReader();
      reader.onload = () => {
        const item = {
          id: uid('m'),
          name: file.name.replace(/\.[^.]+$/, ''),
          type: file.type,
          size: file.size,
          dataUrl: reader.result,
          folder: folder === 'all' ? '' : folder,
          alt: '',
          addedAt: new Date().toISOString(),
        };
        const next = [item].concat(getMedia());
        saveMedia(next);
        setItems(next);
        added += 1;
      };
      reader.readAsDataURL(file);
    });
    setTimeout(() => { if (added) toast(`✓ ${added} image${added === 1 ? '' : 's'} uploaded.`); }, 50);
  };

  const rename = (id) => {
    const name = prompt('Rename asset:');
    if (!name) return;
    persist(items.map((i) => (i.id === id ? { ...i, name, folder: i.folder } : i)));
    toast('✓ Renamed.');
  };

  const setAlt = (id) => {
    const alt = prompt('Alt text (for SEO & accessibility):');
    if (alt == null) return;
    persist(items.map((i) => (i.id === id ? { ...i, alt } : i)));
    toast('✓ Alt text saved.');
  };

  const moveFolder = (id) => {
    const f = prompt('Folder name (empty = root):');
    if (f == null) return;
    persist(items.map((i) => (i.id === id ? { ...i, folder: f.trim() } : i)));
  };

  const del = (id) => {
    if (!confirm('Delete this asset? This cannot be undone.')) return;
    persist(items.filter((i) => i.id !== id));
    toast('Asset deleted.');
  };

  const persist = (list) => { saveMedia(list); setItems(list); };
  const input = 'border border-wp-border px-2.5 py-2 font-sans text-xs outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa]';

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-xl lg:text-2xl text-[#1d2327] font-normal font-sans">Media Library</h1>
        <button className="bg-wp-blue text-white border-none px-3.5 py-1.5 text-xs font-semibold cursor-pointer font-sans hover:bg-[#005a87]" onClick={() => fileRef.current.click()}>+ Upload Images</button>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex gap-1 flex-wrap">
          {['all', ...folders].map((f) => (
            <button key={f} className={`px-3 py-1.5 text-xs font-semibold cursor-pointer border ${folder === f ? 'bg-wp-blue text-white border-wp-blue' : 'bg-white border-wp-border text-[#555]'}`} onClick={() => setFolder(f)}>{f === 'all' ? 'All' : f}</button>
          ))}
        </div>
        <input className={input + ' w-[200px]'} placeholder="Search assets…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDrop(true); }}
        onDragLeave={() => setDrop(false)}
        onDrop={(e) => { e.preventDefault(); setDrop(false); handleFiles(e.dataTransfer.files); }}
        className={`border-2 border-dashed ${drop ? 'border-wp-blue bg-blue-50' : 'border-wp-border'} rounded-md p-8 mb-6 text-center transition-colors`}
      >
        <div className="text-3xl mb-2">🖼️</div>
        <p className="text-sm text-text-body mb-1">Drag & drop images here, or <a className="text-wp-blue cursor-pointer" onClick={() => fileRef.current.click()}>browse</a></p>
        <p className="text-xs text-text-light">PNG, JPG, WebP · up to 2.5MB each · auto-optimized storage</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((i) => (
          <div key={i.id} className="bg-white border border-light-gray rounded-md overflow-hidden group">
            <div className="relative aspect-square bg-light-gray overflow-hidden">
              <img src={i.dataUrl} alt={i.alt || i.name} loading="lazy" className="w-full h-full object-cover" />
              <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-[0.6rem] rounded">{i.folder || 'root'}</span>
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 py-1.5 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-white text-[0.62rem] cursor-pointer bg-transparent border-none" onClick={() => setAlt(i.id)}>Alt</button>
                <button className="text-white text-[0.62rem] cursor-pointer bg-transparent border-none" onClick={() => rename(i.id)}>Rename</button>
                <button className="text-white text-[0.62rem] cursor-pointer bg-transparent border-none" onClick={() => moveFolder(i.id)}>Folder</button>
                <button className="text-accent-red text-[0.62rem] cursor-pointer bg-transparent border-none" onClick={() => del(i.id)}>Delete</button>
              </div>
            </div>
            <div className="p-2">
              <p className="text-[0.68rem] font-medium text-[#1d2327] truncate" title={i.name}>{i.name}</p>
              <p className="text-[0.6rem] text-text-light">{(i.size / 1024).toFixed(1)} KB · used {countUsage(i.id)}×</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-center py-16 text-text-light text-sm">No assets found.</div>}
      </div>
    </>
  );
}