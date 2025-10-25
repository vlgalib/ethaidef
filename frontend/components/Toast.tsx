// components/Toast.tsx
'use client';

import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const toastStyles: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-500 text-green-800',
  error: 'bg-red-50 border-red-500 text-red-800',
  warning: 'bg-orange-50 border-orange-500 text-orange-800',
  info: 'bg-blue-50 border-blue-500 text-blue-800'
};

const iconMap: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
};

function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div 
      className={`
        relative p-4 rounded-lg border-l-4 shadow-lg max-w-md w-full
        ${toastStyles[toast.type]}
      `}
      style={{
        animation: 'toast-slide-in 0.3s ease-out forwards'
      }}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <span className="text-lg">{iconMap[toast.type]}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          {toast.title && (
            <p className="text-sm font-semibold mb-1">
              {toast.title}
            </p>
          )}
          <p className="text-sm">
            {toast.message}
          </p>
        </div>
        
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <span className="sr-only">Close</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Progress bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-bl-lg"
        style={{
          width: '100%',
          animation: `toast-shrink ${toast.duration || 5000}ms linear forwards`
        }}>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message: string, title?: string) => {
    addToast({ type: 'success', message, title });
  };

  const showError = (message: string, title?: string) => {
    addToast({ type: 'error', message, title });
  };

  const showWarning = (message: string, title?: string) => {
    addToast({ type: 'warning', message, title });
  };

  const showInfo = (message: string, title?: string) => {
    addToast({ type: 'info', message, title });
  };

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}