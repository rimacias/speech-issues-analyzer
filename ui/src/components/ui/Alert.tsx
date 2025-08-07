import { ReactNode } from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

interface AlertProps {
  type?: 'error' | 'success' | 'info' | 'warning';
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Alert({
  type = 'info',
  title,
  children,
  className = ''
}: AlertProps) {
  const icons = {
    error: FaExclamationTriangle,
    success: FaCheckCircle,
    info: FaInfoCircle,
    warning: FaExclamationTriangle
  };

  const styles = {
    error: 'bg-red-50 border-red-400 text-red-700',
    success: 'bg-green-50 border-green-400 text-green-700',
    info: 'bg-blue-50 border-blue-400 text-blue-700',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-700'
  };

  const IconComponent = icons[type];

  return (
    <div className={`border-l-4 p-4 ${styles[type]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <IconComponent className="h-5 w-5" />
        </div>
        <div className="ml-3">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
