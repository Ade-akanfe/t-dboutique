'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useProducts } from '../../context/ProductContext';
import ProductCard from '../products/ProductCard';

export default function NewArrivalsSection() {
  const { products, isLoaded } = useProducts();

  const newArrivals = useMemo(() => {
    if (!isLoaded) return [];
    return products
      .filter((product) => typeof product.id === 'string' && product.isNew)
      .sort(
        (a, b) =>
          (Date.parse(b.createdAt ?? '') || 0) -
          (Date.parse(a.createdAt ?? '') || 0)
      )
      .slice(0, 8);
  }, [isLoaded, products]);

  return (
    <section id="new-arrivals" className="py-10 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-zinc-900 mb-3">
            New <span className="italic font-light" style={{ color: '#D4AF37' }}>Arrivals</span>
          </h2>
          <p className="text-zinc-500 mx-auto">
            Discover the latest products added to our collection.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} showBadge={false} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/categories/all"
            className="inline-flex items-center justify-center px-8 py-3 border text-base font-medium rounded-md transition-all duration-300 hover:text-white"
            style={{ borderColor: '#D4AF37', color: '#D4AF37' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#D4AF37')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
