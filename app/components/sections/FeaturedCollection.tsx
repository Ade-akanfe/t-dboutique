"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useProducts } from "../../context/ProductContext";
import ProductCard from "../products/ProductCard";

export default function FeaturedCollection() {
  const { products, isLoaded } = useProducts();
  const featuredItems = isLoaded
    ? products
        .filter((product) => typeof product.id === "string" && product.badge?.trim().toLowerCase() === "trending")
        .sort((a, b) => (Date.parse(b.createdAt || "") || 0) - (Date.parse(a.createdAt || "") || 0))
        .slice(0, 4)
    : [];

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
              <span className="italic font-light text-amber-900">
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
              className="text-sm font-medium tracking-wider uppercase pb-1 hover:opacity-70 transition-opacity border-b text-amber-900 border-amber-500"
             
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
              className="h-full"
            >
              <ProductCard product={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
