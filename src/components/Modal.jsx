import { useState } from 'react';

export default function Modal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[90000] flex items-center justify-center" onClick={onCancel}>
      <div className="bg-white max-w-[420px] w-[90%] p-6 lg:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base text-[#1d2327] mb-2">{title}</h3>
        <p className="text-xs text-text-light mb-6">{message}</p>
        <div className="flex gap-2 justify-end">
          <button className="px-5 py-2 font-sans text-xs font-semibold cursor-pointer border-none" style={{ background: '#f0f0f0', color: '#333' }} onClick={onCancel}>
            Cancel
          </button>
          <button className="px-5 py-2 font-sans text-xs font-semibold cursor-pointer border-none text-white" style={{ background: 'var(--color-accent-red)' }} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
