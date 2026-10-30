import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { CONTACT_DETAILS } from "./lib/contactDetails";
import { SITE_URL } from "./lib/siteUrl";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Playfair Display", "Georgia", "serif"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Inter", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "T&D Ladies Fashion | Women's Boutique in Lagos, Nigeria",
  description:
    "Shop women's clothing, designer gowns, skirts and blouses, bags, and shoes at T&D Ladies Fashion in Lagos, Nigeria. Browse new arrivals and order online.",
  keywords: [
    "women's fashion Nigeria",
    "buy clothes online Nigeria",
    "online clothing store Nigeria",
    "fashion boutique Lagos",
    "women's clothing Lagos",
    "Nigerian fashion boutique",
    "buy gowns online Nigeria",
    "wedding guest dresses Lagos",
    "occasion wear Nigeria",
    "skirts and blouses Nigeria",
    "women's handbags Nigeria",
    "ladies shoes online Nigeria",
    "ready-to-wear fashion Lagos",
    "T&D Ladies Fashion",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/new_logo.png",
    shortcut: "/new_logo.png",
    apple: "/new_logo.png",
  },
  openGraph: {
    title: "T&D Ladies Fashion | Women's Boutique in Lagos, Nigeria",
    description:
      "Shop women's clothing, designer gowns, skirts and blouses, bags, and shoes at T&D Ladies Fashion in Lagos, Nigeria.",
    url: SITE_URL,
    siteName: "T&D Ladies Fashion",
    images: [
      {
        url: "/hero.jpeg",
        width: 719,
        height: 1280,
        alt: "T&D Ladies Fashion new arrivals",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "T&D Ladies Fashion | Women's Boutique in Lagos, Nigeria",
    description:
      "Shop women's clothing, gowns, bags, and shoes from T&D Ladies Fashion in Lagos, Nigeria.",
    images: ["/hero.jpeg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const businessStructuredData = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "T&D Ladies Fashion",
    url: SITE_URL,
    image: `${SITE_URL}/hero.jpeg`,
    email: CONTACT_DETAILS.email,
    telephone: CONTACT_DETAILS.phoneHref,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    currenciesAccepted: "NGN",
  };

  return (
    <html
      lang="en-NG"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-zinc-50 text-zinc-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessStructuredData) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
