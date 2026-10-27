'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Plus,
  Sparkles,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { useProducts, Product, CategoryInfo } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import AuthGuard from './components/AuthGuard';
import AdminHeader from './components/AdminHeader';
import ProductFormModal from './components/ProductFormModal';
import CategoryModal from './components/CategoryModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

function AdminPageInner() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    isLoaded,
  } = useProducts();
  const { user, signOut } = useAuth();

  // Search & Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-desc' | 'price-asc' | 'name'>('newest');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Category product counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    categories.forEach((cat) => {
      counts[cat.slug] = products.filter(
        (p) => p.categorySlug.toLowerCase() === cat.slug.toLowerCase() || p.category.toLowerCase().includes(cat.slug.toLowerCase())
      ).length;
    });
    return counts;
  }, [products, categories]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) =>
          p.categorySlug.toLowerCase() === selectedCategory.toLowerCase() ||
          p.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.fabric && p.fabric.toLowerCase().includes(q)) ||
          (p.colors && p.colors.some((c) => c.toLowerCase().includes(q)))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.rawPrice - b.rawPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.rawPrice - a.rawPrice);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => (Date.parse(b.createdAt || '') || 0) - (Date.parse(a.createdAt || '') || 0));
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id'> & { id?: string | number }) => {
    if (productData.id) {
      const ok = await updateProduct(productData.id, productData);
      if (ok) toast.success(`Updated "${productData.name}" successfully!`, { icon: '✨' });
      else toast.error('Failed to update product.');
    } else {
      const result = await addProduct(productData);
      if (result) toast.success(`Added "${productData.name}" to ${productData.category}!`, { icon: '🛍️' });
      else toast.error('Failed to add product. Check if the slug already exists.');
    }
  };

  const handleDuplicateProduct = async (prod: Product) => {
    const timestamp = Date.now();
    const duplicated: Omit<Product, 'id'> = {
      ...prod,
      name: `${prod.name} (Copy)`,
      slug: `${prod.slug}-copy-${timestamp.toString().slice(-4)}`,
      badge: 'New Arrival',
      isNew: true,
    };
    const result = await addProduct(duplicated);
    if (result) toast.success(`Duplicated "${prod.name}"!`, { icon: '📋' });
    else toast.error('Failed to duplicate product.');
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      const ok = await deleteProduct(productToDelete.id);
      if (ok) toast.success(`Deleted "${productToDelete.name}" from catalog.`, { icon: '🗑️' });
      else toast.error('Failed to delete product.');
      setProductToDelete(null);
    }
  };

  const handleAddCategory = async (newCat: CategoryInfo) => {
    const success = await addCategory(newCat);
    if (success) {
      toast.success(`Created category "${newCat.name}"!`, { icon: '📁' });
    } else {
      toast.error('Category already exists.');
    }
  };

  const handleDeleteCategory = async (catSlug: string) => {
    await deleteCategory(catSlug);
    toast.success('Category removed.', { icon: '🗑️' });
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully.');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-inter">
      
      <AdminHeader
        onOpenProductModal={handleOpenCreateModal}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        userEmail={user?.email}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Category Navigation Pills */}
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                selectedCategory === 'all'
                  ? 'text-zinc-950 border-transparent shadow-md'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
              style={
                selectedCategory === 'all'
                  ? { background: 'linear-gradient(135deg, #D4AF37 0%, #a18143 100%)' }
                  : {}
              }
            >
              <span>All Categories</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                selectedCategory === 'all' ? 'bg-zinc-950/20 text-zinc-950' : 'bg-zinc-800 text-zinc-300'
              }`}>
                {categoryCounts.all || 0}
              </span>
            </button>

            {categories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.slug.toLowerCase();
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                    isActive
                      ? 'text-zinc-950 border-transparent shadow-md'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                  }`}
                  style={
                    isActive
                      ? { background: 'linear-gradient(135deg, #D4AF37 0%, #a18143 100%)' }
                      : {}
                  }
                >
                  <span>{cat.name}</span>
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                    isActive ? 'bg-zinc-950/20 text-zinc-950' : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {categoryCounts[cat.slug] || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search, Sort, View Filters Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 shadow-sm">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, fabric, colors..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-white placeholder-zinc-500 focus:border-gold-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Controls: Sort & View Toggle */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="newest">Newest & Featured</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-zinc-800 text-gold-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                style={viewMode === 'table' ? { color: '#D4AF37' } : {}}
                title="Table View"
                aria-label="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-zinc-800 text-gold-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
                style={viewMode === 'grid' ? { color: '#D4AF37' } : {}}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Empty Catalog State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/60 rounded-2xl border border-zinc-800 p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto" style={{ color: '#D4AF37' }}>
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif text-white font-bold">No Products Found</h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              {searchQuery
                ? `No products match "${searchQuery}". Try clearing search or selecting a different category.`
                : 'There are currently no products in this category.'}
            </p>
            <div className="flex justify-center gap-3 pt-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:bg-zinc-700"
                >
                  Clear Search
                </button>
              )}
              <button
                onClick={handleOpenCreateModal}
                className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-md"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #a18143 100%)' }}
              >
                + Add Product
              </button>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          
          /* TABLE VIEW */
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-zinc-950/80 text-[11px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th className="py-4 px-4 sm:px-6">Piece / Item</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Badges & Specs</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/70 font-inter">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-800/40 transition-colors group">
                      
                      {/* Product details & thumbnail */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-12 h-14 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0 border border-zinc-700">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {product.isNew && (
                              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-zinc-900" title="New Arrival" />
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/products/${product.slug}`}
                              target="_blank"
                              className="font-serif font-bold text-sm text-white hover:text-gold-400 transition-colors flex items-center gap-1.5"
                            >
                              {product.name}
                              <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100" />
                            </Link>
                            <p className="text-[11px] text-zinc-500 font-mono mt-0.5">/{product.slug}</p>
                            {product.fabric && (
                              <p className="text-[11px] text-zinc-400 truncate max-w-xs">{product.fabric}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-800 border border-zinc-700 text-zinc-200 capitalize">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-sm" style={{ color: '#D4AF37' }}>
                          {product.price}
                        </span>
                        <span className="block text-[10px] text-zinc-500">In Stock</span>
                      </td>

                      {/* Badges & Sizes */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {product.badge && (
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-zinc-950 shadow-sm"
                                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #a18143 100%)' }}
                              >
                                {product.badge}
                              </span>
                            )}
                            {product.isNew && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                                New
                              </span>
                            )}
                          </div>
                          {product.sizes && (
                            <p className="text-[10px] text-zinc-400 truncate max-w-xs">
                              Sizes: {product.sizes.slice(0, 3).join(', ')}{product.sizes.length > 3 ? ` +${product.sizes.length - 3}` : ''}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/products/${product.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                            title="View on store"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDuplicateProduct(product)}
                            className="p-2 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-gold-400 hover:bg-zinc-700 transition-colors"
                            title="Duplicate product"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-2 rounded-lg bg-zinc-800/80 text-zinc-300 hover:text-gold-400 hover:bg-zinc-700 transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-2 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="py-3 px-6 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span>Showing {filteredProducts.length} of {products.length} products</span>
              <span className="capitalize">{selectedCategory === 'all' ? 'All Collections' : selectedCategory}</span>
            </div>
          </div>
        ) : (
          
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group hover:border-zinc-700 transition-all"
              >
                <div>
                  {/* Card Cover Image */}
                  <div className="relative aspect-[3/4] w-full bg-zinc-800 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badge */}
                    {product.badge && (
                      <div
                        className="absolute top-3 left-3 text-zinc-950 text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full shadow-md pointer-events-none"
                        style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #a18143 100%)' }}
                      >
                        {product.badge}
                      </div>
                    )}

                    {/* New tag */}
                    {product.isNew && (
                      <div className="absolute top-3 right-3 bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full backdrop-blur-md">
                        New
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="p-4 space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      {product.category}
                    </p>
                    <h4 className="font-serif font-bold text-base text-white line-clamp-1 group-hover:text-gold-400 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-sm font-bold" style={{ color: '#D4AF37' }}>
                      {product.price}
                    </p>
                    {product.fabric && (
                      <p className="text-xs text-zinc-400 truncate">{product.fabric}</p>
                    )}
                  </div>
                </div>

                {/* Card Action Toolbar */}
                <div className="p-3 border-t border-zinc-800 bg-zinc-950/50 flex items-center justify-between gap-2">
                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    title="View Product Page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicateProduct(product)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-gold-400 hover:bg-zinc-800 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="p-2 rounded-lg text-zinc-300 hover:text-gold-400 hover:bg-zinc-800 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setProductToDelete(product)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
        categories={categories}
      />

      {/* Category Modal (Create / Delete Categories) */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
        product={productToDelete}
      />

    </div>
  );
}

// Protected export — redirects to /admin/login if not authenticated
export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminPageInner />
    </AuthGuard>
  );
}
