import { MetadataRoute } from 'next';
import { createPublicSupabaseClient } from './lib/publicSupabase';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tdfashiontrend.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicSupabaseClient();
  const { data: products, error } = await supabase
    .from('products')
    .select('slug, created_at');
  if (error) {
    console.error('Failed to load product URLs for sitemap:', error.message);
    throw new Error('Failed to load products for sitemap.');
  }

  const staticRoutes = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/gowns`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/gown`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/clothes`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cloth`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/bags`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/shoes`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/categories/all`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/size-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  const productRoutes = (products ?? []).map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: product.created_at ? new Date(product.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
