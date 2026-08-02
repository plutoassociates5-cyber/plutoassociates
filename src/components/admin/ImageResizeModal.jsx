import { useEffect, useMemo, useState } from 'react';
import { loadImage, resizeDataUrl, isSvg, inferMimeType } from '../../utils/image';

export default function ImageResizeModal({ src, name = '', defaults = {}, onApply, onCancel }) {
  const [dims, setDims] = useState(null);
  const [width, setWidth] = useState(defaults.imgMaxWidth || 1600);
  const [quality, setQuality] = useState(defaults.imgQuality ?? 85);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!src || isSvg(src)) { setDims(null); return undefined; }
    let alive = true;
    loadImage(src)
      .then((img) => { if (alive) setDims({ w: img.naturalWidth, h: img.naturalHeight }); })
      .catch(() => {});
    return () => { alive = false; };
  }, [src]);

  useEffect(() => {
    if (dims && dims.w > 0) setWidth(dims.w);
  }, [dims]);

  const aspect = useMemo(() => (dims && dims.h ? dims.w / dims.h : 1), [dims]);
  const outH = Math.round(width / aspect);
  const isPng = inferMimeType(src || '') === 'image/png';

  const doResize = async () => {
    setBusy(true);
    try {
      const res = await resizeDataUrl(src, {
        maxWidth: width,
        maxHeight: width / aspect,
        quality: quality / 100,
      });
      onApply({ dataUrl: res.dataUrl, resized: !res.skipped, width: res.width, height: res.height });
    } catch {
      onApply({ dataUrl: src, resized: false });
    } finally {
      setBusy(false);
    }
  };

  if (!src) return null;
  const svg = isSvg(src);

  return (
    <div className="fixed inset-0 z-[20000] bg-black/60 flex items-center justify-center p-4" onClick={() => onCancel?.()}>
      <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center px-5 py-4 border-b border-wp-border">
          <h3 className="text-sm font-semibold text-[#1d2327]">{name || 'Adjust photo size'}</h3>
          <button className="bg-transparent border-none text-xl text-text-light cursor-pointer leading-none" onClick={onCancel}>✕</button>
        </div>

        <div className="p-5">
          {svg ? (
            <p className="text-xs text-text-body bg-wp-gray p-3 rounded">This is an SVG (vector) image — it stays crisp at any size, so no resizing is needed.</p>
          ) : (
            <>
              <div className="bg-wp-gray/60 border border-wp-border rounded-md p-3 mb-4 flex items-center justify-center" style={{ maxHeight: 220 }}>
                <img src={src} alt="preview" className="max-w-full max-h-[200px] object-contain" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <label className="text-xs font-semibold text-[#333] w-24">Width (px)</label>
                <input
                  type="number" min="1" value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
                  className="flex-1 border border-wp-border px-2.5 py-1.5 font-sans text-xs outline-none focus:border-wp-blue"
                />
              </div>
              <div className="flex items-center gap-2 mb-4 text-[0.7rem] text-text-body pl-24">
                Height auto-adjusts to {outH}px (aspect {aspect.toFixed(2)} preserved).
              </div>

              <div className="flex items-center gap-2 mb-2">
                <label className="text-xs font-semibold text-[#333] w-24">Quality</label>
                <input
                  type="range" min="20" max="100" value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="flex-1"
                  disabled={isPng}
                />
                <span className="text-xs font-semibold text-wp-blue w-10 text-right shrink-0">{quality}%</span>
              </div>
              <p className="text-[0.68rem] text-text-light mb-4 pl-6">
                {dims ? `Original ${dims.w}×${dims.h} → output ${width}×${outH}` : 'Loading original dimensions…'}
              </p>
            </>
          )}

          <div className="flex justify-end gap-2 flex-wrap pt-2">
            <button
              onClick={() => onApply({ dataUrl: src, resized: false })}
              className="border border-wp-border px-4 py-2 text-xs font-semibold cursor-pointer bg-white hover:bg-wp-gray"
              disabled={busy}
            >
              Use original
            </button>
            {!svg && (
              <button
                onClick={doResize}
                disabled={busy}
                className="bg-wp-blue text-white border-none px-5 py-2 text-xs font-semibold cursor-pointer hover:bg-[#005a87] disabled:opacity-60"
              >
                {busy ? 'Resizing…' : 'Apply resize'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}