import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', durationMs = 3500) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, durationMs);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Render Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '380px',
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => {
          const bg =
            t.type === 'success'
              ? '#10b981'
              : t.type === 'error'
              ? '#ef4444'
              : t.type === 'warning'
              ? '#f59e0b'
              : '#3b82f6';

          const icon =
            t.type === 'success' ? (
              <CheckCircle size={18} />
            ) : t.type === 'error' ? (
              <AlertCircle size={18} />
            ) : t.type === 'warning' ? (
              <AlertTriangle size={18} />
            ) : (
              <Info size={18} />
            );

          return (
            <div
              key={t.id}
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                background: bg,
                color: '#ffffff',
                padding: '0.85rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                fontSize: '0.9rem',
                fontWeight: 600,
                animation: 'slideInRight 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {icon}
                <span>{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  display: 'flex',
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
