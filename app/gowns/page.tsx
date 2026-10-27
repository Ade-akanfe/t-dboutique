import { Metadata } from 'next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CategoryView from '../categories/[slug]/CategoryView';
import { cloudinaryImage } from '../lib/cloudinaryImages';

export const metadata: Metadata = {
  title: 'Designer Gowns & Luxury Evening Dresses | T&D Boutique Lagos (Worldwide Delivery)',
  description:
    'Shop luxury designer gowns, evening wear, and Nigerian couture dresses at T&D Boutique Lagos. Handcrafted luxury, custom fittings, and premium fabrics with doorstep delivery across Nigeria and worldwide express delivery to the UK, US, Canada, Europe & Africa.',
  keywords: [
    'designer gowns lagos',
    'evening dresses nigeria',
    'nigerian boutique gowns',
    'luxury gown store lagos',
    'buy gowns online nigeria',
    'wedding guest dresses lagos',
    'cocktail dresses nigeria',
    'prom dresses lagos',
    'nigerian couture gowns',
    'worldwide delivery nigerian fashion',
    'uk delivery nigerian boutique',
    't&d fashion boutique lagos',
  ],
  alternates: {
    canonical: '/gowns',
  },
  openGraph: {
    title: 'Designer Gowns & Luxury Dresses | T&D Ladies Fashion Lagos',
    description:
      'Explore our exclusive gown collection from T&D Collections and international designer labels. Shop from Lagos with express worldwide delivery.',
    url: '/gowns',
    siteName: 'T&D Ladies Fashion Boutique',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: cloudinaryImage('product-383.jpg'),
        width: 800,
        height: 1066,
        alt: 'T&D Boutique Designer Gowns Lagos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Designer Gowns & Luxury Dresses | T&D Boutique Lagos',
    description:
      'Luxury gowns with doorstep delivery across Nigeria and worldwide express delivery to UK, US, Canada & globally.',
    images: [cloudinaryImage('product-383.jpg')],
  },
};

export default function GownsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['CollectionPage', 'ClothingStore'],
    name: 'Designer Gowns Collection — T&D Boutique Lagos',
    description:
      'Luxury designer gowns and evening dresses handcrafted in Lagos, Nigeria with worldwide express shipping.',
    url: 'https://tdfashiontrend.com/gowns',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lagos',
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
          currentSlug="gowns"
          categoryTitle="Designer Gowns"
          categoryDescription="Exquisite gown collections celebrating modern elegance, red carpet glam, and contemporary Nigerian couture. Fast doorstep delivery across Nigeria & express worldwide shipping."
        />
      </div>
      <Footer />
    </main>
  );
}
