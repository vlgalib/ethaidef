// components/AlertBox.tsx
'use client';

import { ReactNode } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertBoxProps {
  type: AlertType;
  title?: string;
  children: ReactNode;
  className?: string;
}

const alertStyles: Record<AlertType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-orange-50 border-orange-200 text-orange-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
};

const iconMap: Record<AlertType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
};

export function AlertBox({ type, title, children, className = '' }: AlertBoxProps) {
  return (
    <div className={`p-6 rounded-lg border ${alertStyles[type]} ${className}`}>
      {title && (
        <h3 className="text-xl font-semibold mb-3">
          {iconMap[type]} {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export function AlertContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`space-y-2 text-gray-700 ${className}`}>
      {children}
    </div>
  );
}

export function AlertNote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`p-3 bg-white rounded border mt-4 ${className}`}>
      <p className="text-sm text-gray-600">{children}</p>
    </div>
  );
}