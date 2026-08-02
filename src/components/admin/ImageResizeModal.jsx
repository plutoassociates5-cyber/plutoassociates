import { useEffect, useMemo, useState } from 'react';
import { loadImage, resizeDataUrl, isSvg, inferMimeType } from '../../utils/image';

let previewSeq = 0;

export default function ImageResizeModal({ src, name = '', defaults = {}, onApply, onCancel }) {
  const [dims, setDims] = useState(null);
  const [width, setWidth] = useState(defaults.imgMaxWidth || 1600);
  const [quality, setQuality] = useState(defaults.imgQuality ?? 85);
  const [preview, setPreview] = useState({ dataUrl: src, w: null, h: null, synth: false });

  useEffect(() => {
    if (!src || isSvg(src)) { setDims(null); setPreview({ dataUrl: src, w: null, h: null, synth: false }); return undefined; }
    let alive = true;
    loadImage(src)
      .then((img) => { if (alive) { setDims({ w: img.naturalWidth, h: img.naturalHeight }); setWidth(img.naturalWidth); } })
      .catch(() => {});
    return () => { alive = false; };
  }, [src]);

  const aspect = useMemo(() => (dims && dims.h ? dims.w / dims.h : 1), [dims]);
  const outH = Math.round(width / aspect);
  const isPng = inferMimeType(src || '') === 'image/png';

  const up = dims && dims.w ? width > dims.w : false;
  const down = dims && dims.w ? width < dims.w : false;
  const same = dims && dims.w ? width === dims.w : false;

  useEffect(() => {
    if (!src || isSvg(src) || !dims) return undefined;
    const seq = ++previewSeq;
    const timer = setTimeout(async () => {
      try {
        const res = await resizeDataUrl(src, { maxWidth: width, maxHeight: width / aspect, quality: quality / 100 });
        if (seq === previewSeq) setPreview({ dataUrl: res.dataUrl, w: res.width, h: res.height, synth: true });
      } catch {
        if (seq === previewSeq) setPreview({ dataUrl: src, w: dims.w, h: dims.h, synth: false });
      }
    }, 90);
    return () => { clearTimeout(timer); };
  }, [src, dims, width, aspect, quality]);

  const apply = () => onApply({ dataUrl: preview.dataUrl, resized: up || down, width: preview.w, height: preview.h });

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
            <p className="text-xs text-text-body bg-wp-gray p-3 rounded">This is an SVG (vector) — it stays crisp at any size, so no resizing is needed.</p>
          ) : (
            <>
              <div className="bg-[#f0f1f2] border border-wp-border rounded-md p-3 mb-3 flex items-center justify-center gap-3" style={{ minHeight: 180 }}>
                <div className="flex-1 text-center">
                  <div className="text-[0.62rem] text-text-light mb-1">Original</div>
                  <div className="bg-white border border-wp-border p-1" style={{ maxHeight: 150 }}>
                    <img src={src} alt="original" className="max-w-full max-h-[130px] object-contain mx-auto" />
                  </div>
                  <div className="text-[0.62rem] text-text-body mt-1">{dims ? `${dims.w}×${dims.h}` : '…'}</div>
                </div>
                <div className="text-wp-blue text-lg font-semibold">→</div>
                <div className="flex-1 text-center">
                  <div className="text-[0.687rem] text-text-light mb-1">Adjusted (live)</div>
                  <div className="bg-white border border-wp-border p-1" style={{ minHeight: 150 }}>
                    <img key={preview.dataUrl} src={preview.dataUrl} alt="preview" className="max-w-full max-h-[130px] object-contain mx-auto" />
                  </div>
                  <div className="text-[0.62rem] text-text-body mt-1">
                    {width}×{outH}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`px-2 py-0.5 rounded text-[0.62rem] font-semibold ${up ? 'bg-blue-100 text-wp-blue' : 'bg-wp-gray text-text-light'}`}>↑ upscale</span>
                <span className={`px-2 py-0.5 rounded text-[0.62rem] font-semibold ${down ? 'bg-amber-100 text-[#b45309]' : 'bg-wp-gray text-text-light'}`}>↓ downscale</span>
                <span className={`px-2 py-0.5 rounded text-[0.62rem] font-semibold ${same ? 'bg-green-100 text-green-700' : 'bg-wp-gray text-text-light'}`}>same size</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <label className="text-xs font-semibold text-[#333] w-24">Width (px)</label>
                <input
                  type="range" min="100" max={(dims && dims.w ? dims.w : 1600) * 3} value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
                  className="flex-1"
                />
                <input
                  type="number" min="1" value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
                  className="w-20 border border-wp-border px-2 py-1.5 font-sans text-xs outline-none focus:border-wp-blue"
                />
              </div>
              <div className="text-[0.7rem] text-text-body mb-3 pl-24">Height auto-adjusts to {outH}px (aspect {aspect.toFixed(2)} preserved).</div>

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
            </>
          )}

          <div className="flex justify-end gap-2 flex-wrap pt-2 border-t border-wp-border mt-2">
            <button
              onClick={() => onApply({ dataUrl: src, resized: false })}
              className="border border-wp-border px-4 py-2 text-xs font-semibold cursor-pointer bg-white hover:bg-wp-gray"
            >
              Use original
            </button>
            {!svg && (
              <button onClick={apply} className="bg-wp-blue text-white border-none px-5 py-2 text-xs font-semibold cursor-pointer hover:bg-[#005a87]">
                Apply resized
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}