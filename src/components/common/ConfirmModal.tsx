import React, { useEffect, useCallback } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal: React.FC = () => {
  const { confirmModal, closeConfirmModal } = useCatalog();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeConfirmModal();
      }
    },
    [closeConfirmModal]
  );

  useEffect(() => {
    if (confirmModal.isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [confirmModal.isOpen, handleKeyDown]);

  if (!confirmModal.isOpen) return null;

  return (
    <div
      id="confirm-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      onClick={closeConfirmModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        id="confirm-modal-box"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 id="confirm-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
              {confirmModal.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {confirmModal.message}
            </p>
          </div>

          <button
            onClick={closeConfirmModal}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={closeConfirmModal}
            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {confirmModal.cancelText || 'Cancel'}
          </button>
          <button
            type="button"
            onClick={() => {
              confirmModal.onConfirm();
              closeConfirmModal();
            }}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm transition-colors ${
              confirmModal.isDestructive !== false
                ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                : 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800'
            }`}
          >
            {confirmModal.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
