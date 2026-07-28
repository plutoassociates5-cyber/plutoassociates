import { useState } from 'react';

export default function Modal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;

  return (
    <div className="modal-bg" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-btns">
          <button style={{ background: '#f0f0f0', color: '#333' }} onClick={onCancel}>
            Cancel
          </button>
          <button style={{ background: 'var(--red)', color: '#fff' }} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}