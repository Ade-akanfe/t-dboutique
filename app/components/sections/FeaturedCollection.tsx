"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/features/cartSlice";
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";
import { Product } from "../../context/ProductContext";
import { useProducts } from "../../context/ProductContext";

export default function FeaturedCollection() {
  const dispatch = useDispatch();
  const { products, isLoaded } = useProducts();
  const featuredItems = isLoaded
    ? products
        .filter((product) => typeof product.id === "string" && product.badge?.trim().toLowerCase() === "trending")
        .sort((a, b) => (Date.parse(b.createdAt || "") || 0) - (Date.parse(a.createdAt || "") || 0))
        .slice(0, 4)
    : [];

  const handleAddToCart = (item: Product) => {
    dispatch(addToCart({ ...item }));
    toast.success(`${item.name} added to cart!`, {
      icon: "🛍️",
    });
  };

  return (
    <section id="collections" className="py-16 md:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-zinc-900 mb-4">
              Trending{" "}
              <span className="italic font-light" style={{ color: "#D4AF37" }}>
                Now
              </span>
            </h2>
            <p className="text-zinc-600 font-inter">
              Curated essentials that embody effortless style and unparalleled
              craftsmanship.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 md:mt-0"
          >
            <Link
              href="/categories/all"
              className="text-sm font-medium tracking-wider uppercase pb-1 hover:opacity-70 transition-opacity border-b"
              style={{ color: "#D4AF37", borderColor: "#D4AF37" }}
            >
              View All Products
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group flex flex-col justify-between"
            >
              <div>
                {/* Fixed smaller height on mobile with Link */}
                <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-zinc-100 rounded-xl">
                  <Link
                    href={`/products/${item.slug}`}
                    className="relative block w-full h-full"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.18]"
                    />
                  </Link>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                  {/* Add to Cart overlay button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white text-xs tracking-widest uppercase opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 px-4 py-2 rounded-sm font-semibold whitespace-nowrap"
                    style={{
                      background: "linear-gradient(135deg, #D4AF37, #a18143)",
                    }}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">
                    {item.category}
                  </p>
                  <Link href={`/products/${item.slug}`} className="block group">
                    <h3 className="text-sm md:text-base font-playfair text-zinc-900 mb-1 group-hover:text-gold-500 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>
                </div>
              </div>
              <div className="text-center mt-1">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#D4AF37" }}
                >
                  {item.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
