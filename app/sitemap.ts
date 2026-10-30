import { MetadataRoute } from 'next';
import { toCloudinaryImageUrl } from './lib/cloudinaryImages';
import { createPublicSupabaseClient } from './lib/publicSupabase';
import { SITE_URL } from './lib/siteUrl';

const PAGE_SIZE = 1000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicSupabaseClient();
  const [categoriesResult, products] = await Promise.all([
    supabase.from('categories').select('slug').order('slug', { ascending: true }),
    (async () => {
      const allProducts: {
        slug: string;
        created_at: string | null;
        image: string | null;
        gallery: string[] | null;
      }[] = [];

      for (let from = 0; ; from += PAGE_SIZE) {
        const { data, error } = await supabase
          .from('products')
          .select('slug, created_at, image, gallery')
          .order('slug', { ascending: true })
          .range(from, from + PAGE_SIZE - 1);

        if (error) {
          console.error('Failed to load product URLs for sitemap:', error.message);
          throw new Error('Failed to load products for sitemap.');
        }

        allProducts.push(...(data ?? []));
        if (!data || data.length < PAGE_SIZE) break;
      }

      return allProducts;
    })(),
  ]);

  if (categoriesResult.error) {
    console.error('Failed to load category URLs for sitemap:', categoriesResult.error.message);
    throw new Error('Failed to load categories for sitemap.');
  }

  const staticRoutes = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/gowns`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/clothes`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/bags`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/shoes`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/categories/all`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/size-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  const canonicalCategoryPaths = new Set([
    'all',
    'bags',
    'clothes',
    'gowns',
    'shoes',
  ]);
  const categoryRoutes = (categoriesResult.data ?? [])
    .filter((category) => !canonicalCategoryPaths.has(category.slug.toLowerCase()))
    .map((category) => ({
      url: `${SITE_URL}/categories/${encodeURIComponent(category.slug)}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  const productRoutes = products.map((product) => {
    const images = [product.image, ...(product.gallery ?? [])]
      .filter((image): image is string => Boolean(image))
      .map(toCloudinaryImageUrl)
      .map((image) => new URL(image, SITE_URL).toString());

    return {
      url: `${SITE_URL}/products/${encodeURIComponent(product.slug)}`,
      ...(product.created_at ? { lastModified: new Date(product.created_at) } : {}),
      ...(images.length > 0 ? { images: [...new Set(images)] } : {}),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
