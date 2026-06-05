import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  className = '',
}: ModalProps) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full m-4',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className={`bg-charcoal-black border border-charcoal-border rounded-2xl w-full flex flex-col max-h-[90vh] ${maxWidthClasses[maxWidth]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex justify-between items-center p-5 border-b border-charcoal-800 shrink-0">
            {title && (
              <h2 className="text-sm font-display font-medium text-white uppercase tracking-wider">
                {title}
              </h2>
            )}
            {onClose && (
              <button 
                onClick={onClose} 
                className="text-cream/50 hover:text-white transition-colors p-1 rounded hover:bg-white/5 ml-auto"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
