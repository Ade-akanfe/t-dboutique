'use client';

import React from 'react';
import Link from 'next/link';
import ProductDetailView from './ProductDetailView';
import { useProducts } from '../../context/ProductContext';

interface ProductPageClientProps {
  slug: string;
}

export default function ProductPageClient({
  slug,
}: ProductPageClientProps) {
  const { getProductBySlug, products, isLoaded } = useProducts();

  // Find live product
  const currentProduct = isLoaded ? getProductBySlug(slug) : undefined;

  if (!currentProduct && isLoaded) {
    return (
      <div className="flex-grow flex items-center justify-center pt-32 pb-20 px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
          <h1 className="text-3xl font-serif text-zinc-900 mb-3">Product Not Found</h1>
          <p className="text-sm text-zinc-500 mb-6">
            We couldn&apos;t find the product you were looking for. It may have been relocated or updated.
          </p>
          <Link
            href="/categories/all"
            className="inline-block py-3 px-6 rounded-lg text-sm font-semibold uppercase tracking-wider text-zinc-900 transition-all shadow-md"
            style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #a18143 100%)' }}
          >
            Browse All Collections
          </Link>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    // Loading state before client hydration
    return (
      <div className="flex-grow flex items-center justify-center pt-32 pb-20 px-4">
        <div className="w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const related = products
    .filter((p) => p.categorySlug === currentProduct.categorySlug && String(p.id) !== String(currentProduct.id))
    .slice(0, 4);

  return (
    <div className="bg-zinc-50 pt-28 md:pt-32 pb-20 flex-grow">
      <ProductDetailView product={currentProduct} relatedProducts={related} />
    </div>
  );
}
