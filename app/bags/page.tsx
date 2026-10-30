import { Metadata } from 'next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CategoryView from '../categories/[slug]/CategoryView';
import { cloudinaryImage } from '../lib/cloudinaryImages';
import { SITE_URL } from '../lib/siteUrl';

export const metadata: Metadata = {
  title: 'Luxury Bags & Handbags | T&D Boutique Abuja',
  description:
    'Explore curated luxury bags and statement handbags from T&D Boutique Abuja. Shop outstanding handbag styles with nationwide delivery in Nigeria and worldwide shipping.',
  keywords: ['luxury bags abuja', 'handbags nigeria', 'designer bags abuja', 'buy bags online nigeria', 'boutique handbags'],
  alternates: {
    canonical: '/bags',
  },
  openGraph: {
    title: 'Luxury Bags & Handbags | T&D Boutique Abuja',
    description: 'Curated handbag collection with boutique styling and worldwide delivery.',
    url: '/bags',
    siteName: 'T&D Ladies Fashion Boutique',
    locale: 'en_NG',
    type: 'website',
    images: [{ url: cloudinaryImage('bags/bags_image_1.jpeg'), width: 900, height: 1200, alt: 'Luxury Bags Collection' }],
  },
};

export default function BagsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['CollectionPage', 'ClothingStore'],
    name: 'Luxury Bags Collection — T&D Boutique Abuja',
    description: 'Luxury handbags and statement bags curated in Abuja, Nigeria.',
    url: `${SITE_URL}/bags`,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <div className="bg-zinc-50 pt-28 md:pt-32 pb-20 flex-grow">
        <CategoryView
          currentSlug="bags"
          categoryTitle="Luxury Bags"
          categoryDescription="Statement handbags and elevated carryalls curated for the T&D Boutique collection. Shop in Abuja and enjoy express worldwide shipping."
        />
      </div>
      <Footer />
    </main>
  );
}
