import { Metadata } from 'next';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductPageClient from './ProductPageClient';
import { createPublicSupabaseClient } from '../../lib/publicSupabase';
import { toCloudinaryImageUrl } from '../../lib/cloudinaryImages';

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
    product?.description ||
    (product
      ? `Discover ${product.name} at T&D Ladies Fashion. Price: ${product.price}.`
      : 'Discover luxury fashion pieces at T&D Ladies Fashion Boutique Lagos.');

  return {
    title: `${formattedTitle} | T&D Ladies Fashion`,
    description,
    ...(product && {
      keywords: [product.name, product.category, 'Nigerian boutique', 'luxury fashion Lagos'],
      openGraph: {
        title: `${product.name} | T&D Ladies Fashion`,
        description,
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
