"use client";

import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";
import type { Product } from "../../lib/productTypes";
import { addToCart } from "../../store/features/cartSlice";

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
}

export default function ProductCard({
  product,
  showBadge = true,
}: ProductCardProps) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product }));
    toast.success(`${product.name} added to cart!`, { icon: "🛍️" });
  };

  return (
    <article className="group flex h-full flex-col">
      <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-xl bg-zinc-100">
        <Link
          href={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.08]"
          />
        </Link>

        {showBadge && product.badge && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#a18143] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm md:text-xs">
            {product.badge}
          </span>
        )}

        <div className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <button
          type="button"
          onClick={handleAddToCart}
          className="invisible absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 translate-y-3 items-center gap-2 whitespace-nowrap rounded-sm bg-gradient-to-br from-[#D4AF37] to-[#a18143] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white opacity-0 transition-all duration-300 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a18143] group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          Add to Cart
        </button>
      </div>

      <div className="flex flex-1 flex-col">
        <p className="mb-1 text-[11px] uppercase tracking-wider text-zinc-400 md:text-xs">
          {product.category}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-medium leading-snug text-zinc-900 transition-colors hover:text-gold-500 md:text-base"
        >
          {product.name}
        </Link>

        {product.sizes && product.sizes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.sizes.map((size) => (
              <span
                key={size}
                className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        <p className="mt-auto border-t border-zinc-100 pt-2 text-sm font-bold text-[#D4AF37] md:mt-3 md:text-base">
          {product.price}
        </p>
      </div>
    </article>
  );
}
