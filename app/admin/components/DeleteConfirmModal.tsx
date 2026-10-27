'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { Product } from '../../lib/productTypes';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: Product | null;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  product,
}: DeleteConfirmModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden p-6 text-white text-center">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-serif font-bold text-white mb-2">
          Delete Product?
        </h3>
        <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
          Are you sure you want to delete <strong className="text-zinc-200">{product.name}</strong> from the catalog? This action will remove it from all category pages and search results.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-lg shadow-rose-950"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
