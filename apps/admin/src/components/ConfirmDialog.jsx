import React from 'react';

export default function ConfirmDialog({ open, onConfirm, onCancel, message }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-primary-dark rounded-xl shadow-lg p-6 max-w-xs w-full flex flex-col items-center">
        <div className="text-base text-center text-black dark:text-white mb-4">{message}</div>
        <div className="flex gap-4 mt-2">
          <button
            className="px-4 py-2 rounded bg-accent dark:bg-accent-dark text-white font-semibold hover:bg-highlight dark:hover:bg-highlight-dark focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark"
            onClick={onConfirm}
          >
            Kontynuuj
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark"
            onClick={onCancel}
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
}
