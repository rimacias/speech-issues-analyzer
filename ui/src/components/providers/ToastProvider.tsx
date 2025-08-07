"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Toast, { ToastType, ToastProps } from '@/components/ui/Toast';

interface ToastData {
  id: string;
  type: ToastType;
  title?: string;
  message: ReactNode;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastData, 'id'>) => void;
  success: (message: ReactNode, title?: string, duration?: number) => void;
  error: (message: ReactNode, title?: string, duration?: number) => void;
  warning: (message: ReactNode, title?: string, duration?: number) => void;
  info: (message: ReactNode, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      ...toast,
      id,
    };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const success = useCallback((message: ReactNode, title?: string, duration = 5000) => {
    showToast({ type: 'success', message, title, duration });
  }, [showToast]);

  const error = useCallback((message: ReactNode, title?: string, duration = 7000) => {
    showToast({ type: 'error', message, title, duration });
  }, [showToast]);

  const warning = useCallback((message: ReactNode, title?: string, duration = 6000) => {
    showToast({ type: 'warning', message, title, duration });
  }, [showToast]);

  const info = useCallback((message: ReactNode, title?: string, duration = 5000) => {
    showToast({ type: 'info', message, title, duration });
  }, [showToast]);

  const value: ToastContextType = {
    showToast,
    success,
    error,
    warning,
    info,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-0 right-0 z-50 p-6 space-y-4 max-w-sm w-full">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
