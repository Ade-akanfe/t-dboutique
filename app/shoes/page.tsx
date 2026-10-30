import { Metadata } from 'next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CategoryView from '../categories/[slug]/CategoryView';
import { cloudinaryImage } from '../lib/cloudinaryImages';
import { SITE_URL } from '../lib/siteUrl';

export const metadata: Metadata = {
  title: 'Luxury Shoes & Footwear | T&D Boutique Abuja',
  description:
    'Shop luxury footwear and statement shoes from T&D Boutique Abuja. Discover elegant shoe styles with fast delivery across Nigeria and worldwide shipping.',
  keywords: ['luxury shoes abuja', 'designer shoes nigeria', 'fashion footwear abuja', 'buy shoes online nigeria', 'boutique heels'],
  alternates: {
    canonical: '/shoes',
  },
  openGraph: {
    title: 'Luxury Shoes & Footwear | T&D Boutique Abuja',
    description: 'Curated designer shoes collection with boutique styling and worldwide delivery.',
    url: '/shoes',
    siteName: 'T&D Ladies Fashion Boutique',
    locale: 'en_NG',
    type: 'website',
    images: [{ url: cloudinaryImage('shoes/shoes_image_1.jpeg'), width: 900, height: 1200, alt: 'Luxury Shoes Collection' }],
  },
};

export default function ShoesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['CollectionPage', 'ClothingStore'],
    name: 'Luxury Shoes Collection — T&D Boutique Abuja',
    description: 'Luxury footwear and statement shoes curated in Abuja, Nigeria.',
    url: `${SITE_URL}/shoes`,
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
          currentSlug="shoes"
          categoryTitle="Luxury Shoes"
          categoryDescription="Elegant footwear styles curated to complete the T&D Boutique look. Doorstep delivery in Abuja and express worldwide shipping available."
        />
      </div>
      <Footer />
    </main>
  );
}
