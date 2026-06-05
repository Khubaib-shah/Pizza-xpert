import React, { ReactNode } from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Info } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  const isDanger = type === 'danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        {isDanger ? (
          <div className="w-12 h-12 rounded-full bg-burgundy/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-tomato" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-cheese/10 flex items-center justify-center">
            <Info className="w-6 h-6 text-cheese" />
          </div>
        )}

        <div className="text-sm text-cream/70 leading-relaxed font-sans">
          {message}
        </div>

        <div className="flex justify-end gap-3 w-full pt-4 mt-2 border-t border-charcoal-border">
          <Button variant="secondary" onClick={onClose} disabled={isLoading} className="flex-1">
            {cancelText}
          </Button>
          <Button 
            variant={isDanger ? 'primary' : 'primary'} 
            onClick={onConfirm} 
            disabled={isLoading}
            className={`flex-1 ${isDanger ? 'bg-burgundy hover:bg-tomato text-white border-none' : ''}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
