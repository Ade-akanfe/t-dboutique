'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Plus, FolderPlus, ExternalLink, Package, Layers, TrendingUp, LogOut } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

interface AdminHeaderProps {
  onOpenProductModal: () => void;
  onOpenCategoryModal: () => void;
  userEmail?: string;
  onSignOut: () => void;
}

export default function AdminHeader({
  onOpenProductModal,
  onOpenCategoryModal,
  userEmail,
  onSignOut,
}: AdminHeaderProps) {
  const { products, categories } = useProducts();

  const totalValue = products.reduce((sum, p) => sum + (p.rawPrice || 0), 0);
  const newArrivalsCount = products.filter(p => p.isNew).length;

  return (
    <header className="relative overflow-hidden border-b border-zinc-800/80 bg-zinc-950 px-4 pb-8 pt-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top_left,rgba(212,175,55,0.10),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="T&D Ladies Fashion"
              width={112}
              height={95}
              className="h-20 w-auto shrink-0 object-contain"
            />
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Store operations</span>
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400">Live</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-playfair text-2xl font-bold tracking-tight text-white sm:text-3xl">T&amp;D Ladies Fashion</h1>
                <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300">Admin</span>
              </div>
              <p className="mt-1 text-xs text-zinc-400 sm:text-sm">Manage products, categories, and the visual storefront.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:items-end">
            <div className="flex items-center justify-between gap-3 xl:justify-end">
              <div className="flex min-w-0 items-center gap-2 text-xs text-zinc-500">
                <span className="h-2 w-2 shrink-0 rounded-full bg-gold-400" />
                <span className="truncate">{userEmail}</span>
              </div>
              <button
                id="admin-sign-out"
                onClick={onSignOut}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-400 transition-all hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700/80 bg-zinc-900 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 shadow-sm transition-all hover:bg-zinc-800 hover:text-white"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Storefront
            </Link>

            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700/80 bg-zinc-900 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 shadow-sm transition-all hover:bg-zinc-800 hover:text-white"
            >
              <Package className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
              Orders
            </Link>

            <button
              onClick={onOpenCategoryModal}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-200 shadow-sm transition-all hover:bg-zinc-700"
            >
              <FolderPlus className="w-4 h-4 text-gold-400" style={{ color: '#D4AF37' }} />
              Add Category
            </button>

            <button
              onClick={onOpenProductModal}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-lg transition-all hover:shadow-gold-500/20 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #C5A028 50%, #a18143 100%)' }}
            >
              <Plus className="w-4 h-4 text-zinc-950 stroke-3" />
              Add Product
            </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Total Products */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-4 shadow-sm sm:p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Total Products</p>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">{products.length}</h3>
              <p className="text-[11px] text-zinc-500 mt-1">Live in store catalog</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center" style={{ color: '#D4AF37' }}>
              <Package className="w-5 h-5" />
            </div>
          </div>

          {/* Total Categories */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-4 shadow-sm sm:p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Active Categories</p>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">{categories.length}</h3>
              <p className="text-[11px] text-zinc-500 mt-1">Clothing collection</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          {/* New Arrivals */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-4 shadow-sm sm:p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">New Arrivals</p>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">{newArrivalsCount}</h3>
              <p className="text-[11px] text-zinc-500 mt-1">Highlighted pieces</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          {/* Catalog Value */}
          <div className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-4 shadow-sm sm:p-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">Catalog Value</p>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white truncate" style={{ color: '#D4AF37' }}>
                ₦{totalValue.toLocaleString()}
              </h3>
              <p className="text-[11px] text-zinc-500 mt-1">Total inventory pricing</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center" style={{ color: '#D4AF37' }}>
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
