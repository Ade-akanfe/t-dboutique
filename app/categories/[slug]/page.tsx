import { Metadata } from 'next';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import CategoryView from './CategoryView';
import { cloudinaryImage } from '../../lib/cloudinaryImages';

function canonicalCategorySlug(slug: string): string {
  const s = slug.toLowerCase().trim();
  if (s === 'gown' || s === 'gowns') return 'gowns';
  if (s === 'cloth' || s === 'clothes') return 'clothes';
  return s;
}

// SEO Meta Data Generation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const canonical = canonicalCategorySlug(slug);

  if (canonical === 'gowns') {
    return {
      title: 'Designer Gowns & Luxury Evening Dresses | T&D Boutique Abuja (Worldwide Delivery)',
      description:
        'Shop luxury designer gowns, evening wear, and Nigerian couture dresses at T&D Boutique Abuja. Handcrafted luxury, custom fittings, and premium fabrics with doorstep delivery across Nigeria and worldwide express delivery to the UK, US, Canada, Europe & Africa.',
      keywords: [
        'designer gowns abuja',
        'evening dresses nigeria',
        'nigerian boutique gowns',
        'luxury gown store abuja',
        'buy gowns online nigeria',
        'wedding guest dresses abuja',
        'worldwide delivery nigerian fashion',
        't&d boutique gowns',
      ],
      alternates: {
        canonical: '/gowns',
      },
      openGraph: {
        title: 'Designer Gowns & Luxury Dresses | T&D Ladies Fashion Abuja',
        description:
          'Explore our exclusive gown collection from T&D Collections and international labels. Express worldwide delivery from Abuja, Nigeria.',
        images: [{ url: cloudinaryImage('product-383.jpg'), width: 800, height: 1066 }],
      },
    };
  }

  if (canonical === 'clothes') {
    return {
      title: "Women's Clothes, Skirts & Blouses | T&D Boutique Abuja (Worldwide Delivery)",
      description:
        "Shop premium women's skirts, blouses, two-piece sets, and luxury clothing looks at T&D Boutique Abuja, Nigeria. Contemporary African couture and curated European labels with fast nationwide delivery in Nigeria and worldwide express shipping.",
      keywords: [
        'womens clothes abuja',
        'skirts and blouses nigeria',
        'nigerian boutique clothing',
        'luxury skirts abuja',
        'designer tops and blouses nigeria',
        'buy clothes online nigeria',
        'worldwide delivery nigerian clothing',
        't&d ladies fashion boutique',
      ],
      alternates: {
        canonical: '/clothes',
      },
      openGraph: {
        title: "Women's Luxury Clothes & Skirts | T&D Ladies Fashion Abuja",
        description:
          'Curated skirts, blouses, and designer sets from T&D Collections. Handcrafted luxury with fast delivery in Nigeria and worldwide express shipping.',
        images: [{ url: cloudinaryImage('product-01.jpg'), width: 800, height: 1066 }],
      },
    };
  }

  const formattedTitle =
    canonical === 'all'
      ? 'All Categories & Collections'
      : slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');

  return {
    title: `${formattedTitle} | T&D Boutique Abuja (Worldwide Delivery)`,
    description:
      `Explore our latest ${formattedTitle} collection at T&D Ladies Fashion Boutique Abuja. Handcrafted luxury, modern Nigerian couture, and worldwide express delivery.`,
    keywords: [slug, 'fashion', 'boutique', 'T&D Fashion', 'Nigerian fashion', 'Abuja boutique', 'luxury clothing', 'worldwide delivery'],
    alternates: {
      canonical: `/categories/${canonical}`,
    },
    openGraph: {
      title: `${formattedTitle} | T&D Ladies Fashion`,
      description: `Discover exclusive ${formattedTitle} designs at T&D Ladies Fashion Boutique Abuja.`,
      images: [
        {
          url: '/new_logo.png',
          width: 1380,
          height: 1301,
        },
      ],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const canonical = canonicalCategorySlug(slug);

  let categoryTitle = 'All Products';
  let categoryDescription = 'Browse our complete catalog of tailored clothing, designer gowns, and contemporary Nigerian fashion.';

  if (canonical === 'gowns') {
    categoryTitle = 'Designer Gowns';
    categoryDescription = 'Exquisite gown collections celebrating modern elegance, red carpet glam, and contemporary Nigerian couture. Fast doorstep delivery across Nigeria & express worldwide shipping.';
  } else if (canonical === 'clothes') {
    categoryTitle = 'Clothes (Skirts & Blouses)';
    categoryDescription = 'Contemporary clothing looks from T&D Collections and selected international designer labels. Doorstep dispatch in Abuja, nationwide delivery across Nigeria & express worldwide shipping.';
  }

  return (
    <main className="flex min-h-screen flex-col w-full overflow-x-hidden">
      <Navbar />
      <div className="bg-zinc-50 pt-28 md:pt-32 pb-20 flex-grow">
        <CategoryView
          currentSlug={canonical}
          categoryTitle={categoryTitle}
          categoryDescription={categoryDescription}
        />
      </div>
      <Footer />
    </main>
  );
}
