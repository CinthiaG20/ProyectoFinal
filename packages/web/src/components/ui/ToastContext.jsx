import { createContext, useCallback, useContext, useState } from 'react';
import Toast from './Toast.jsx';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, { type = 'info', duration = 4000 } = {}) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((t) => [...t, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, duration);
    }
  }, []);

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ push, remove }}>
      {children}
      <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 9999 }}>
        {toasts.map((t) => (
          <Toast key={t.id} id={t.id} type={t.type} onClose={() => remove(t.id)}>
            {t.message}
          </Toast>
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

export default ToastContext;
