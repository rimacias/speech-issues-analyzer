import { ReactNode, ButtonHTMLAttributes } from 'react';
import { FaSpinner } from 'react-icons/fa';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'relative flex justify-center items-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 border border-transparent',
    secondary: 'text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500 border border-gray-300 shadow-sm',
    outline: 'text-blue-600 bg-transparent hover:bg-blue-50 focus:ring-blue-500 border border-blue-600'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-sm min-h-[40px]',
    lg: 'px-6 py-3 text-base min-h-[48px]'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center">
          <FaSpinner className="animate-spin h-5 w-5 mr-2" />
          {loadingText || 'Loading...'}
        </div>
      ) : (
        children
      )}
    </button>
  );
}
