'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/features/cartSlice';
import toast from 'react-hot-toast';
import { ShoppingBag } from 'lucide-react';
import { Product, useProducts } from '../../context/ProductContext';

export default function NewArrivalsSection() {
  const dispatch = useDispatch();
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

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({ ...product }));
    toast.success(`${product.name} added to cart!`, { icon: '🛍️' });
  };

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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((product) => (
            <div key={product.id} className="group">
              {/* Fixed height on mobile to prevent excessive scroll */}
              <div className="relative aspect-[3/4] bg-zinc-100 mb-5 overflow-hidden rounded-xl">
                <Link href={`/products/${product.slug}`} className="absolute inset-0 block">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain object-center  group-hover:scale-[1.18] transition-transform duration-700 ease-in-out"
                  />
                </Link>
                {/* Add to Cart on hover */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white text-xs tracking-widest uppercase opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 px-5 py-2.5 rounded-sm font-semibold whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #a18143)' }}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Add to Cart
                </button>
              </div>
              <div className="flex flex-col items-center text-center">
                <p className="text-xs text-zinc-400 mb-1 uppercase tracking-wider">{product.category}</p>
                <Link href={`/products/${product.slug}`} className="block group">
                  <h3 className="text-sm md:text-base font-serif text-zinc-900 mb-1 group-hover:text-gold-500 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="font-semibold text-sm" style={{ color: '#D4AF37' }}>{product.price}</p>
              </div>
            </div>
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
