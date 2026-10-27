'use client';

import React, { useState } from 'react';
import { X, FolderPlus, Sparkles, Trash2 } from 'lucide-react';
import type { CategoryInfo } from '../../lib/productTypes';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryInfo[];
  onAddCategory: (category: CategoryInfo) => void;
  onDeleteCategory: (slug: string) => void;
}

export default function CategoryModal({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onDeleteCategory,
}: CategoryModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [error, setError] = useState('');

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }
    const cleanSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (categories.some(c => c.slug.toLowerCase() === cleanSlug.toLowerCase())) {
      setError('A category with this slug already exists');
      return;
    }

    onAddCategory({
      name: name.trim(),
      slug: cleanSlug,
      description: description.trim() || `Explore the exclusive ${name.trim()} collection at T&D Ladies Fashion.`,
      bannerImage: bannerImage.trim(),
    });

    setName('');
    setSlug('');
    setDescription('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center" style={{ color: '#D4AF37' }}>
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-playfair text-xl font-bold text-white">
                Manage Boutique Categories
              </h2>
              <p className="text-xs text-zinc-400">
                Organize your collections and catalog departments
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Add Category Section */}
          <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5" style={{ color: '#D4AF37' }}>
              <Sparkles className="w-3.5 h-3.5" />
              Create New Category
            </h3>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded border border-rose-900">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Traditional Accessories"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="traditional-accessories"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-mono focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Category Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary for category banner..."
                  className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Banner Image URL
                </label>
                <input
                  type="text"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  placeholder="Paste the uploaded image URL"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm font-mono focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-950 transition-all shadow-md active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #C5A028 50%, #a18143 100%)' }}
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>

          {/* Existing Categories List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Existing Categories ({categories.length})
            </h3>
            <div className="divide-y divide-zinc-800 rounded-xl border border-zinc-800 bg-zinc-950/30 overflow-hidden">
              {categories.map((cat) => (
                <div key={cat.slug} className="p-3.5 flex items-center justify-between gap-4 hover:bg-zinc-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700">
                      <img src={cat.bannerImage} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{cat.name}</h4>
                      <p className="text-xs text-zinc-400 font-mono">/categories/{cat.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDeleteCategory(cat.slug)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
