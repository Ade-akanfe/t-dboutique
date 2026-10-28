import { Metadata } from 'next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import SizeGuideContent from './SizeGuideContent';

export const metadata: Metadata = {
  title: 'Size Guide & Fit Chart | T&D Boutique Lagos — Worldwide Delivery',
  description:
    'Comprehensive women\'s size guide and international conversion chart for T&D Boutique Lagos, Nigeria. Accurate UK, US, Turkey/EU sizing, Free Size flexible fit details, and measurement tips with worldwide express shipping.',
  keywords: [
    'size guide nigeria',
    'dress size chart lagos',
    'uk to us dress sizes',
    'free size meaning nigeria boutique',
    'turkey size 42 in uk',
    'nigerian boutique sizing',
    't&d boutique lagos size guide',
    'worldwide delivery nigerian fashion',
  ],
  openGraph: {
    title: 'Size Guide & Measurement Chart | T&D Ladies Fashion Lagos',
    description:
      'Find your exact fit with our comprehensive UK, US, Turkey, and Free Size guide. Worldwide express delivery available from Lagos, Nigeria.',
    images: [{ url: '/new_logo.png', width: 1380, height: 1301 }],
  },
};

export default function SizeGuidePage() {
  return (
    <main className="flex min-h-screen flex-col w-full overflow-x-hidden bg-zinc-50">
      <Navbar />
      <div className="pt-28 md:pt-32 pb-20 flex-grow">
        <SizeGuideContent />
      </div>
      <Footer />
    </main>
  );
}
