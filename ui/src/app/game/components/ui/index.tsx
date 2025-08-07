import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import React from "react";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function Button({
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = ''
}: ButtonProps) {
  const baseClasses = 'font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-green-500 to-blue-500 text-white',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'error' | 'info';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const baseClasses = 'rounded-2xl shadow-xl p-6';

  const variantClasses = {
    default: 'bg-white',
    success: 'bg-green-50 border-2 border-green-200',
    error: 'bg-red-50 border-2 border-red-200',
    info: 'bg-blue-50 border-2 border-blue-200'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className={`w-full bg-gray-200 rounded-full h-3 ${className}`}>
      <div
        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <FontAwesomeIcon
        icon={faSpinner}
        className={`animate-spin ${sizeClasses[size]} text-blue-500`}
      />
    </div>
  );
}
