"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-100 py-10 text-stone-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link
              href="/"
              aria-label="T&D Ladies Fashion home"
              className="mb-6 inline-flex items-center gap-3 group"
            >
              <Image
                src="/new_logo.png"
                alt="T&D Ladies Fashion Logo"
                width={96}
                height={96}
                className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
              />
              <span className="flex flex-col font-playfair leading-none tracking-tight">
                <span className="text-lg font-bold text-stone-950 sm:text-xl">
                  T<span className="text-purple-800">&amp;</span>D
                </span>
                <span className="md:mt-1 whitespace-nowrap text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-amber-700 sm:text-xs sm:tracking-[0.2em]">
                  Ladies Fashion
                </span>
                <span 
                  aria-hidden="true"
                  className="mt-1 h-px w-8 bg-gradient-to-r from-purple-800 via-amber-500 to-purple-800 sm:w-10"
                />
              </span>
            </Link>
            <p className="max-w-xs text-sm font-inter leading-relaxed text-stone-600">
              Redefining modern elegance. Premium collections curated for women
              with a style of their own.
            </p>
          </div>

          <div>
            <h4 className="mb-6 font-playfair text-lg text-stone-900">Shop</h4>
            <ul className="space-y-4 text-sm font-inter">
              <li>
                <Link
                  href="/gowns"
                  className="transition-colors hover:text-stone-950"
                >
                  Designer Gowns
                </Link>
              </li>
              <li>
                <Link
                  href="/clothes"
                  className="transition-colors hover:text-stone-950"
                >
                  Clothes (Skirts &amp; Blouses)
                </Link>
              </li>
              <li>
                <Link
                  href="/bags"
                  className="transition-colors hover:text-stone-950"
                >
                  Bags
                </Link>
              </li>
              <li>
                <Link
                  href="/shoes"
                  className="transition-colors hover:text-stone-950"
                >
                  Shoes
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/all"
                  className="transition-colors hover:text-stone-950"
                >
                  All Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/#new-arrivals"
                  className="transition-colors hover:text-stone-950"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-playfair text-lg text-stone-900">
              Customer Care
            </h4>
            <ul className="space-y-4 text-sm font-inter">
              <li>
                <Link
                  href="/size-guide"
                  className="flex items-center gap-1.5 transition-colors hover:text-stone-950"
                  style={{ color: "#8a6b18" }}
                >
                  📏 Size &amp; Fit Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="transition-colors hover:text-stone-950"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="transition-colors hover:text-stone-950"
                >
                  Worldwide Shipping &amp; Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/account#orders"
                  className="transition-colors hover:text-stone-950"
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-playfair text-lg text-stone-900">
              Newsletter
            </h4>
            <p className="mb-4 text-sm font-inter text-stone-600">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-900 transition-colors placeholder:text-stone-400 focus:border-stone-500 focus:outline-none"
              />
              <button
                type="submit"
                className="whitespace-nowrap bg-stone-800 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-stone-300 pt-8 md:flex-row">
          <p className="text-xs font-inter text-stone-500">
            &copy; {new Date().getFullYear()} T and D Ladies Fashion. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            {/* Social Icons (Placeholders) */}
            <a
              href="#"
              className="text-stone-500 transition-colors hover:text-stone-950"
              aria-label="Instagram"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#"
              className="text-stone-500 transition-colors hover:text-stone-950"
              aria-label="Twitter"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
