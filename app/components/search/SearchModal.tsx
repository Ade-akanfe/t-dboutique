'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '../../context/ProductContext';

interface SearchModalProps {
  initialQuery?: string;
  onClose: () => void;
}

export default function SearchModal({ initialQuery = '', onClose }: SearchModalProps) {
  const { products, categories } = useProducts();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim().length > 0
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        (p.fabric && p.fabric.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  useEffect(() => {
    const focusTimeout = window.setTimeout(() => inputRef.current?.focus(), 100);
    return () => window.clearTimeout(focusTimeout);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-5 py-4 border-b border-zinc-100 gap-3">
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: '#D4AF37' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search clothing..."
            className="flex-1 text-base text-zinc-900 placeholder-zinc-400 outline-none font-inter"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 transition-colors flex-shrink-0"
            aria-label="Close search"
          >
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim() === '' && (
            <div className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Browse Categories</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    onClick={onClose}
                    className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 hover:text-white"
                    style={{ borderColor: '#D4AF37', color: '#a18143' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#D4AF37'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a18143'; }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {query.trim().length > 0 && results.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="text-zinc-500 text-sm">No results for <span className="font-semibold text-zinc-900">&quot;{query}&quot;</span></p>
              <p className="text-zinc-400 text-xs mt-1">Try searching by product name or category.</p>
            </div>
          )}

          {results.length > 0 && (
            <ul className="py-2 divide-y divide-zinc-100">
              {results.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-zinc-100 rounded-md overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400 uppercase tracking-wider">{item.category}</p>
                        <p className="text-sm font-serif font-medium text-zinc-900 group-hover:text-gold-500 transition-colors">
                          {item.name}
                        </p>
                        <p className="text-xs font-semibold" style={{ color: '#D4AF37' }}>
                          {item.price}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#D4AF37' }}>
                      View Piece →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-zinc-50 bg-zinc-50 flex items-center gap-4">
          <span className="text-xs text-zinc-400">Press <kbd className="px-1.5 py-0.5 bg-white border border-zinc-200 rounded text-zinc-600 text-xs font-mono">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
