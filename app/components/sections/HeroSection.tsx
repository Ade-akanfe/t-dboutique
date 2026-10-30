"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section className="min-h-dvh overflow-hidden bg-[#f7f5f1] pt-24 text-zinc-950 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative h-[52svh] min-h-[22rem] max-h-[34rem] w-full bg-white lg:h-auto lg:min-h-[calc(100svh-6rem)] lg:max-h-none">
        <Image
          src="/hero.jpeg"
          alt="T&D Ladies Fashion look featuring a red top, denim detail, and handbag"
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-contain"
        />
      </div>

      <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:justify-start lg:px-14 lg:py-16 xl:px-20">
        <div className="w-full max-w-xl text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#9b1820] sm:text-sm">
              New arrivals
            </p>
            <h1 className="font-sans text-[clamp(2.8rem,10vw,4.2rem)] font-black uppercase leading-[0.94] tracking-[-0.06em] sm:text-6xl lg:text-[clamp(4rem,6vw,6.25rem)]">
              Find your
              <br />
              <span className="text-[#9b1820]">signature style</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-zinc-700 sm:text-lg lg:mx-0"
          >
            Discover occasion-ready gowns, effortless everyday fashion, and
            standout accessories, thoughtfully selected by T&amp;D Ladies
            Fashion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-5 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link
              href="/categories/all"
              className="inline-flex min-h-12 items-center justify-center gap-3 bg-[#9b1820] px-8 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#7e1219] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9b1820]"
            >
              Shop the collection <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/#new-arrivals"
              className="text-sm font-semibold text-zinc-700 underline decoration-zinc-400 underline-offset-4 transition-colors hover:text-[#9b1820]"
            >
              Explore new arrivals
            </Link>
          </motion.div>

          <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500 sm:text-sm">
            Gowns <span className="px-1.5 text-[#9b1820]">·</span> Clothing{" "}
            <span className="px-1.5 text-[#9b1820]">·</span> Bags{" "}
            <span className="px-1.5 text-[#9b1820]">·</span> Shoes
          </p>
        </div>
      </div>
    </section>
  );
}
