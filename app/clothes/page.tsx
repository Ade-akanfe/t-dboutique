import { Metadata } from 'next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CategoryView from '../categories/[slug]/CategoryView';
import { cloudinaryImage } from '../lib/cloudinaryImages';
import { SITE_URL } from '../lib/siteUrl';

export const metadata: Metadata = {
  title: "Women's Clothes, Skirts & Blouses | T&D Boutique Abuja (Worldwide Delivery)",
  description:
    "Shop premium women's skirts, blouses, two-piece sets, and luxury clothing looks at T&D Boutique Abuja, Nigeria. Contemporary African couture and curated European labels with fast nationwide delivery in Nigeria and worldwide express shipping to the UK, US, Canada, Europe & Africa.",
  keywords: [
    'womens clothes abuja',
    'skirts and blouses nigeria',
    'nigerian boutique clothing',
    'luxury skirts abuja',
    'designer tops and blouses nigeria',
    'two piece outfits abuja',
    'boutique in abuja nigeria',
    'buy clothes online nigeria',
    'worldwide delivery nigerian clothing',
    'uk shipping nigerian boutique',
    't&d fashion trend boutique',
  ],
  alternates: {
    canonical: '/clothes',
  },
  openGraph: {
    title: "Women's Luxury Clothes & Skirts | T&D Ladies Fashion Abuja",
    description:
      'Curated skirts, blouses, and designer sets from T&D Collections. Handcrafted luxury with fast delivery in Nigeria and worldwide express shipping.',
    url: '/clothes',
    siteName: 'T&D Ladies Fashion Boutique',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: cloudinaryImage('product-01.jpg'),
        width: 800,
        height: 1066,
        alt: 'T&D Boutique Women Clothes Abuja',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Women's Clothes & Skirts | T&D Boutique Abuja",
    description:
      "Shop luxury women's clothing from Abuja, Nigeria. Fast doorstep delivery nationwide and worldwide express shipping.",
    images: [cloudinaryImage('product-01.jpg')],
  },
};

export default function ClothesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['CollectionPage', 'ClothingStore'],
    name: "Women's Clothing Collection — T&D Boutique Abuja",
    description:
      "Exclusive skirts, blouses, and fashion looks crafted and curated in Abuja, Nigeria with worldwide express delivery.",
    url: `${SITE_URL}/clothes`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abuja',
      addressCountry: 'NG',
    },
    currenciesAccepted: 'NGN, USD, GBP, EUR',
    areaServed: [
      { '@type': 'Country', name: 'Nigeria' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'United States' },
      { '@type': 'Country', name: 'Canada' },
      { '@type': 'Country', name: 'Worldwide' },
    ],
  };

  return (
    <main className="flex min-h-screen flex-col w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <div className="bg-zinc-50 pt-28 md:pt-32 pb-20 flex-grow">
        <CategoryView
          currentSlug="clothes"
          categoryTitle="Clothes (Skirts & Blouses)"
          categoryDescription="Contemporary clothing looks from T&D Collections and selected international designer labels. Doorstep dispatch in Abuja, nationwide delivery across Nigeria & express worldwide shipping."
        />
      </div>
      <Footer />
    </main>
  );
}
