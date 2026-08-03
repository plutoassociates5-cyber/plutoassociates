import { useState } from 'react';
import { readFileAsDataUrl, isSvg } from '../../../utils/image';
import { useToast } from '../../../context/ToastContext';
import ImageResizeModal from '../ImageResizeModal';

export function Section({ title, desc, children, className = '' }) {
  return (
    <div className={`bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4 lg:p-5 ${className}`}>
      <div className="mb-4 pb-2 border-b border-wp-border">
        <div className="text-sm font-semibold text-[#1d2327]">{title}</div>
        {desc && <div className="text-[0.7rem] text-text-light mt-1">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

export function Grid({ children, cols = 2, className = '' }) {
  return <div className={`grid grid-cols-1 gap-4 ${cols === 3 ? 'md:grid-cols-3' : 'sm:grid-cols-2'} ${className}`}>{children}</div>;
}

export function Field({ label, hint, children }) {
  return (
    <label className="block min-w-0">
      <span className="text-xs font-semibold text-[#333] flex justify-between items-center mb-1.5">
        {label}
        {hint && <em className="not-italic font-normal text-text-light text-[0.65rem]">{hint}</em>}
      </span>
      {children}
    </label>
  );
}

const INPUT =
  'w-full border border-wp-border px-2.5 py-2 font-sans text-xs outline-none focus:border-wp-blue focus:shadow-[0_0_0_1px_#0073aa] bg-white text-[#1d2327] disabled:opacity-50 disabled:bg-wp-gray';

export function TextInput({ value, onChange, placeholder, type = 'text', disabled }) {
  return <input type={type} className={INPUT} value={value ?? ''} placeholder={placeholder} disabled={disabled} onChange={(e) => onChange(e.target.value)} />;
}

export function TextArea({ value, onChange, placeholder, rows = 3, disabled }) {
  return <textarea className={INPUT + ' resize-y'} rows={rows} value={value ?? ''} placeholder={placeholder} disabled={disabled} onChange={(e) => onChange(e.target.value)} />;
}

export function Select({ value, onChange, options, disabled }) {
  return (
    <select className={INPUT + ' cursor-pointer'} value={value ?? ''} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
    </select>
  );
}

export function Slider({ label, value, onChange, min, max, step = 1, unit = 'px', disabled }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input type="range" min={min} max={max} step={step} value={value} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 cursor-pointer" />
        <span className="w-14 text-right text-xs font-semibold text-wp-blue shrink-0">{value}{unit}</span>
      </div>
    </Field>
  );
}

export function Toggle({ label, hint, checked, onChange, disabled }) {
  return (
    <label className={`flex items-center justify-between gap-3 bg-[#f6f7f8] border border-wp-border rounded px-3 py-2 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
      <span className="text-xs font-semibold text-[#333]">
        {label}
        {hint && <small className="block font-normal text-text-light text-[0.65rem] mt-0.5">{hint}</small>}
      </span>
      <input type="checkbox" checked={!!checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 cursor-pointer" />
    </label>
  );
}

export function ColorField({ label, value, onChange, presets, disabled }) {
  const hex = toHex(value);
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <span className="w-9 h-9 rounded border border-wp-border shrink-0" style={{ background: value || 'transparent' }} />
        <input type="color" value={hex} disabled={disabled} onChange={(e) => onChange(e.target.value)} className="w-9 h-9 border border-wp-border cursor-pointer shrink-0" />
        <input className={INPUT} value={value ?? ''} disabled={disabled} onChange={(e) => onChange(e.target.value)} placeholder="#0a1628" />
      </div>
      {presets && (
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {presets.map((p) => (
            <button key={p} type="button" disabled={disabled} onClick={() => onChange(p)} className="w-6 h-6 rounded-full border border-wp-border cursor-pointer p-0" title={p} style={{ background: p }} />
          ))}
        </div>
      )}
    </Field>
  );
}

export function Segmented({ label, value, onChange, options, disabled }) {
  return (
    <div>
      {label && <span className="text-xs font-semibold text-[#333] block mb-1.5">{label}</span>}
      <div className="flex gap-1.5 flex-wrap">
        {options.map((o) => (
          <button key={o.value} type="button" disabled={disabled} onClick={() => onChange(o.value)} className={`px-3 py-1.5 text-xs font-semibold cursor-pointer border ${value === o.value ? 'bg-wp-blue text-white border-wp-blue' : 'bg-white text-[#555] border-wp-border hover:bg-wp-gray disabled:opacity-50'}`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AssetUpload({ label, value, onChange, disabled, aspect = 'any', hint }) {
  const { toast } = useToast();
  const [pending, setPending] = useState(null);
  const onUpload = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f || !f.type.startsWith('image/')) return;
    if (f.size > 3 * 1024 * 1024) { toast('Image must be under 3MB.', 'err'); return; }
    const dataUrl = await readFileAsDataUrl(f);
    if (isSvg(dataUrl) || aspect !== 'logo') { onChange(dataUrl); return; }
    setPending(dataUrl);
  };
  return (
    <div className="flex items-center gap-3">
      {value ? (
        <span className="w-11 h-11 rounded border border-wp-border shrink-0 bg-wp-gray overflow-hidden flex items-center justify-center">
          <img src={value} alt="" className="max-w-full max-h-full object-contain" />
        </span>
      ) : (
        <span className="w-11 h-11 rounded border border-wp-border border-dashed shrink-0 bg-wp-gray text-text-light flex items-center justify-center text-[0.65rem]">none</span>
      )}
      <div className="min-w-0">
        <label className="bg-wp-blue text-white px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-[#005a87] inline-block disabled:opacity-50">
          {label || 'Upload'}
          <input type="file" accept="image/*" hidden disabled={disabled} onChange={onUpload} />
        </label>
        {value && (
          <button type="button" disabled={disabled} className="ml-2 text-[0.68rem] text-accent-red bg-transparent border-none cursor-pointer p-0 font-sans disabled:opacity-50" onClick={() => onChange('')}>
            remove
          </button>
        )}
        {hint && <div className="text-[0.62rem] text-text-light mt-1">{hint}</div>}
      </div>
      <ImageResizeModal
        src={pending}
        name="Adjust image size"
        defaults={{ imgMaxWidth: 1200, imgQuality: 85 }}
        onApply={({ dataUrl }) => { onChange(dataUrl); setPending(null); }}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}

function toHex(value) {
  if (typeof value !== 'string') return '#ffffff';
  const m = value.match(/^#([0-9a-f]{6})$/i);
  if (m) return value;
  const rgba = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgba) {
    return '#' + [rgba[1], rgba[2], rgba[3]].map((n) => Math.min(255, Math.max(0, Number(n))).toString(16).padStart(2, '0')).join('');
  }
  return '#ffffff';
}
