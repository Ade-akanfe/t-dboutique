import { Metadata } from 'next';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductPageClient from './ProductPageClient';
import { createPublicSupabaseClient } from '../../lib/publicSupabase';
import { toCloudinaryImageUrl } from '../../lib/cloudinaryImages';
import { SITE_URL } from '../../lib/siteUrl';

// Dynamic SEO Metadata for Each Product
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createPublicSupabaseClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('name, category, description, price, image')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Failed to load product metadata from Supabase:', error.message);
  }

  const formattedTitle = product?.name || slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
  const description =
    product
      ? `Shop ${product.name} at T&D Ladies Fashion, a Abuja, Nigeria boutique. ${product.description || `Price: ${product.price}. Order online for delivery across Nigeria.`}`
          .slice(0, 160)
      : 'Shop women’s fashion, gowns, clothing, bags, and shoes from T&D Ladies Fashion in Abuja, Nigeria.';

  return {
    title: `${formattedTitle} | T&D Ladies Fashion Nigeria`,
    description,
    alternates: {
      canonical: `/products/${encodeURIComponent(slug)}`,
    },
    keywords: product
      ? [
          product.name,
          `${product.name} Nigeria`,
          `${product.category} online Nigeria`,
          'buy clothes online Nigeria',
          'fashion boutique Abuja',
          'T&D Ladies Fashion',
        ]
      : ['women’s fashion Nigeria', 'fashion boutique Abuja', 'T&D Ladies Fashion'],
    ...(product && {
      openGraph: {
        title: `${product.name} | T&D Ladies Fashion Nigeria`,
        description,
        url: `${SITE_URL}/products/${encodeURIComponent(slug)}`,
        siteName: 'T&D Ladies Fashion',
        locale: 'en_NG',
        images: [
          {
            url: toCloudinaryImageUrl(product.image),
            width: 800,
            height: 1000,
            alt: product.name,
          },
        ],
      },
    }),
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <main className="flex min-h-screen flex-col w-full overflow-x-hidden">
      <Navbar />
      <ProductPageClient slug={slug} />
      <Footer />
    </main>
  );
}
