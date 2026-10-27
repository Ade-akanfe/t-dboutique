'use client';

import Link from 'next/link';
import { useProducts } from '../../context/ProductContext';

export default function CategorySection() {
  const { categories, isLoaded } = useProducts();
  const categoriesWithImages = isLoaded
    ? categories.filter(
        (category) =>
          category.slug.toLowerCase() !== 'pants' &&
          category.bannerImage.trim().length > 0
      )
    : [];

  return (
    <section id="categories" className="py-10 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-zinc-900 mb-3">Shop by Category</h2>
            <p className="text-zinc-500 max-w-2xl">
              Discover our exquisite collections tailored for your unique style.
            </p>
          </div>
        </div>

        {/* Two columns on smaller screens and four equal category cards on large screens */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {categoriesWithImages.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-zinc-100"
            >
              <img
                src={category.bannerImage}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              {/* Gold gradient overlay */}
              <div
                className="absolute inset-0 opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)' }}
              />

              {/* Gold top-left accent line */}
              <div
                className="absolute top-3 left-3 w-8 h-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ background: '#D4AF37' }}
              />

              <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col justify-end">
                <h3 className="text-base md:text-xl font-serif text-white mb-1 leading-tight">{category.name}</h3>
                <span
                  className="text-xs font-medium uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"
                  style={{ color: '#D4AF37' }}
                >
                  Shop
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
        {isLoaded && categoriesWithImages.length === 0 && (
          <p className="mt-6 text-center text-sm text-zinc-500">
            No categories with uploaded images are available yet.
          </p>
        )}
      </div>
    </section>
  );
}
