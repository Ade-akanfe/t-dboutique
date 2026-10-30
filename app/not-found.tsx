import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <section
          aria-labelledby="not-found-title"
          className="relative w-full max-w-6xl overflow-hidden border border-stone-200 bg-white"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border border-amber-200/70 sm:-right-16 sm:-top-40 sm:h-[30rem] sm:w-[30rem]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-purple-200/60 sm:-right-4 sm:-top-28 sm:h-96 sm:w-96"
          />

          <div className="relative grid min-h-[30rem] items-center gap-8 px-6 py-14 sm:px-12 sm:py-16 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-20">
            <div className="text-center lg:text-left">
              <p className="mb-2 font-playfair text-[7rem] leading-none tracking-[-0.08em] text-purple-900 sm:text-[10rem]">
                404
              </p>
              <div className="mx-auto mt-5 flex w-fit items-center gap-3 lg:mx-0">
                <span className="h-px w-10 bg-amber-500" />
                <span className="font-inter text-xs font-semibold uppercase tracking-[0.3em] text-amber-800">
                  A little lost?
                </span>
                <span className="h-px w-10 bg-amber-500" />
              </div>
            </div>

            <div className="max-w-lg text-center lg:text-left">
              <p className="mb-4 font-inter text-sm font-medium uppercase tracking-[0.22em] text-purple-800">
                T&amp;D Ladies Fashion
              </p>
              <h1
                id="not-found-title"
                className="font-playfair text-3xl leading-tight text-stone-950 sm:text-4xl"
              >
                This page missed its fitting.
              </h1>
              <p className="mx-auto mt-5 max-w-md font-inter text-base leading-7 text-stone-600 lg:mx-0">
                The page you&apos;re looking for may have moved or is no longer
                available. Let&apos;s find something lovely for you instead.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Link
                  href="/categories/all"
                  className="inline-flex items-center justify-center gap-2 bg-purple-900 px-6 py-3 font-inter text-sm font-semibold text-white transition-colors hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-900"
                >
                  Explore the collection
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 border border-stone-300 px-6 py-3 font-inter text-sm font-semibold text-stone-800 transition-colors hover:border-stone-500 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-900"
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
