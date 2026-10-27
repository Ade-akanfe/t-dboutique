'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past 320px (beyond header / initial hero viewport)
      if (window.scrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToCategories = () => {
    const catSection = document.getElementById('categories');
    if (catSection) {
      catSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8 group">
      {/* Tooltip on hover */}
      <div className="absolute bottom-full right-0 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        <div className="bg-zinc-900/95 text-white text-[11px] font-medium tracking-wide py-1 px-2.5 rounded-md border border-[#D4AF37]/40 shadow-md backdrop-blur-xs flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          Back to Categories
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={handleScrollToCategories}
        aria-label="Scroll to categories"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-950/90 text-white border border-[#D4AF37]/60 hover:border-[#D4AF37] hover:bg-zinc-900 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        style={{
          boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.4), 0 0 12px 1px rgba(212, 175, 55, 0.25)',
        }}
      >
        <ArrowUp className="w-5 h-5 text-[#D4AF37] group-hover:-translate-y-0.5 transition-transform duration-200" />
      </button>
    </div>
  );
}
