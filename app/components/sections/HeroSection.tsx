"use client";

import { motion } from "motion/react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="hero-section relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-white">
      {/* Background Image / Video Placeholder */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
          alt="Boutique Fashion Banner"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="hero-content max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-white font-semibold tracking-[0.2em] text-sm md:text-base uppercase mb-4 block">
              Spring / Summer 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white leading-tight mb-6">
              Redefining <br className="hidden md:block" />
              <span className="italic font-light">Modern Elegance</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-10 max-w-lg font-inter text-lg font-light text-zinc-200 md:text-xl"
          >
            Discover exclusive collections designed for the modern woman. Step into a world of premium style at T&amp;D Ladies Fashion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button className="bg-white text-black font-semibold px-8 py-4 text-sm tracking-widest uppercase hover:bg-zinc-200 transition-colors duration-300">
              Shop Collection
            </button>
            <button className="bg-transparent border border-white text-white font-semibold px-8 py-4 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300">
              View Lookbook
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-white text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-12 bg-white/50"
        />
      </motion.div>
    </section>
  );
}
