import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ isOpen, onClose, onConfirm, title, message }) {
  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // createPortal renders the modal directly into document.body!
  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      {/* Frosted Glass Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Dialog (Pop-in animation) */}
      <div className="relative bg-surface rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-page-enter border border-border">
        <h3 className="text-2xl font-serif font-bold text-text-primary mb-3">
          {title}
        </h3>
        <p className="text-text-secondary mb-8">
          {message}
        </p>
        
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-full font-medium text-text-secondary hover:text-text-primary hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-5 py-2 rounded-full font-medium bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body // <-- This is the magic portal destination
  );
}