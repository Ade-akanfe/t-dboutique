'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, Sparkles, Search } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from '../../components/products/ProductCard';

interface CategoryViewProps {
  currentSlug: string;
  categoryTitle: string;
  categoryDescription: string;
}

export default function CategoryView({
  currentSlug,
  categoryTitle,
  categoryDescription,
}: CategoryViewProps) {
  const { categories, getProductsByCategory, isLoaded } = useProducts();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const sourceProducts = useMemo(
    () => (isLoaded ? getProductsByCategory(currentSlug) : []),
    [isLoaded, currentSlug, getProductsByCategory]
  );

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let result = [...sourceProducts];

    // Filter by search query if any
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
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
      case 'newest':
        result.sort((a, b) => (Date.parse(b.createdAt || '') || 0) - (Date.parse(a.createdAt || '') || 0));
        break;
      case 'featured':
      default:
        // default ordering
        break;
    }

    return result;
  }, [sourceProducts, searchQuery, sortBy]);

  return (
    <div id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Breadcrumb */}
      <nav className="flex mb-3 text-xs md:text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/categories/all" className="hover:text-zinc-900 transition-colors">Categories</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900 font-medium capitalize">{categoryTitle}</span>
      </nav>

      {/* Header Banner */}
      <div className="mb-5 border-b border-zinc-200 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider mb-3" style={{ borderColor: 'rgba(212, 175, 55, 0.3)', color: '#a18143', background: 'rgba(212, 175, 55, 0.05)' }}>
              <Sparkles className="w-3 h-3 text-xs md:text-sm" style={{ color: '#D4AF37' }} />
              Exclusive Boutique Collection
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-zinc-900 mb-3 capitalize">
              {categoryTitle}
            </h1>
            <p className="text-sm md:text-lg text-zinc-600">
              {categoryDescription}
            </p>
          </div>

          <div className="text-xs md:text-sm text-zinc-500 font-medium whitespace-nowrap bg-white px-4 py-2 rounded-lg border border-zinc-200 shadow-sm self-start md:self-auto">
            Showing <span className="font-bold text-zinc-900">{filteredProducts.length}</span> piece{filteredProducts.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          <Link
            href="/categories/all"
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 border ${
              currentSlug === 'all'
                ? 'text-white border-transparent shadow-sm'
                : 'bg-white text-zinc-700 border-zinc-200 hover:border-gold-400'
            }`}
            style={
              currentSlug === 'all'
                ? { background: 'linear-gradient(135deg, #D4AF37 0%, #a18143 100%)' }
                : {}
            }
          >
            All Products
          </Link>
          {categories.map((cat) => {
            const isActive = currentSlug.toLowerCase() === cat.slug.toLowerCase();
            return (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? 'text-white border-transparent shadow-sm'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-gold-400'
                }`}
                style={
                  isActive
                    ? { background: 'linear-gradient(135deg, #D4AF37 0%, #a18143 100%)' }
                    : {}
                }
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
        
        {/* Search within category */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search within ${categoryTitle.toLowerCase()}...`}
            className="w-full pl-10 pr-4 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-gold-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 uppercase tracking-wider font-semibold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Sort:
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs md:text-sm text-zinc-800 outline-none focus:border-gold-500 transition-colors cursor-pointer"
          >
            <option value="featured">Featured Collection</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">New Arrivals First</option>
          </select>
        </div>
      </div>

      {/* Product Grid — 2 columns on mobile, 4 on desktop */}
      {!isLoaded ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200">
          <p className="text-sm text-zinc-500">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200">
          <p className="text-lg font-serif text-zinc-800 mb-2">No pieces found</p>
          <p className="text-sm text-zinc-500 mb-6">Try adjusting your search terms or browse another category.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-6 py-2 border rounded-md text-xs font-semibold uppercase tracking-wider transition-colors"
            style={{ borderColor: '#D4AF37', color: '#a18143' }}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
