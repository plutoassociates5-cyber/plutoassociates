import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((msg, type) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-10 right-4 z-[99999]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-5 py-3.5 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] text-xs font-medium mb-2 max-w-[350px] ${t.type === 'err' ? 'border-l-4 border-l-accent-red' : t.type === 'info' ? 'border-l-4 border-l-wp-blue' : 'border-l-4 border-l-accent-green'}`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
