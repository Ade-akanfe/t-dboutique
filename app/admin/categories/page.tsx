'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X, ImageIcon, AlertCircle } from 'lucide-react';
import { supabase } from '@/app/lib/supabaseClient';
import type { CategoryInfo } from '@/app/lib/productTypes';

type ManagedCategory = CategoryInfo & { id: string };

export default function CategoryManagement() {
  const [categories, setCategories] = useState<ManagedCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ManagedCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;
      setCategories((data || []).map(({ id, name, slug, description, banner_image }) => ({
        id,
        name,
        slug,
        description,
        bannerImage: banner_image,
      })));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (cat?: ManagedCategory) => {
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
      setSlug(cat.slug);
      setDescription(cat.description);
      setBannerImage(cat.bannerImage);
    } else {
      setEditingCategory(null);
      setName('');
      setSlug('');
      setDescription('');
      setBannerImage('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingCategory) {
        const { error: updateError } = await supabase
          .from('categories')
          .update({ name, slug, description, banner_image: bannerImage })
          .eq('id', editingCategory.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('categories')
          .insert({ name, slug, description, banner_image: bannerImage });
        if (insertError) throw insertError;
      }
      await fetchCategories();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Products assigned to this category will remain but their category reference may become invalid.')) return;

    try {
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;
      await fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen text-zinc-400">
      Loading categories...
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-white">Category Management</h1>
          <p className="text-zinc-400">Create and organize product categories for the boutique</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-black font-bold rounded-lg transition-colors"
          style={{ backgroundColor: '#D4AF37' }}
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-950/50 border border-rose-800 text-rose-300 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.slug} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-gold-500/50 transition-all">
            <div className="aspect-video bg-zinc-800 relative overflow-hidden">
              {cat.bannerImage ? (
                <img src={cat.bannerImage} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(cat)} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{cat.description}</p>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>Slug: {cat.slug}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden text-white">
            <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/60 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Category Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-gold-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">URL Slug</label>
                <input
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-gold-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-gold-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Banner Image URL</label>
                <input
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-gold-500 outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-black font-bold transition-colors"
                  style={{ backgroundColor: '#D4AF37' }}
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
