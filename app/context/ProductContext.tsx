'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toCloudinaryImageUrl } from '../lib/cloudinaryImages';
import { parseSizes } from '../lib/productSizes';
import type { CategoryInfo, Product } from '../lib/productTypes';

export type { CategoryInfo, Product } from '../lib/productTypes';

// ─── DB row → app type converters ────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: row.price,
    rawPrice: row.raw_price,
    image: toCloudinaryImageUrl(row.image),
    gallery: (row.gallery ?? []).map(toCloudinaryImageUrl),
    category: row.category,
    categorySlug: row.category_slug,
    badge: row.badge ?? undefined,
    isNew: row.is_new ?? false,
    description: row.description ?? undefined,
    details: row.details ?? [],
    sizes: (row.sizes ?? []).flatMap((size: string) => parseSizes(size)),
    colors: row.colors ?? [],
    fabric: row.fabric ?? undefined,
    createdAt: row.created_at ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCategory(row: any): CategoryInfo {
  return {
    name: row.name,
    slug: row.slug,
    description: row.description,
    bannerImage: toCloudinaryImageUrl(row.banner_image),
  };
}

// ─── Context type ─────────────────────────────────────────────────────────────

interface ProductContextType {
  products: Product[];
  categories: CategoryInfo[];
  isLoaded: boolean;
  addProduct: (productData: Omit<Product, 'id'> & { id?: string | number }) => Promise<Product | null>;
  updateProduct: (id: string | number, updatedData: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string | number) => Promise<boolean>;
  addCategory: (categoryData: CategoryInfo) => Promise<boolean>;
  deleteCategory: (slug: string) => Promise<boolean>;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (categorySlug: string) => Product[];
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Fetch products from Supabase ───────────────────────────────────────────
  const refreshProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load products from Supabase:', error.message);
      setProducts([]);
    } else {
      setProducts((data ?? []).map(rowToProduct));
    }
  }, []);

  // ── Fetch categories from Supabase ─────────────────────────────────────────
  const refreshCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Failed to load categories from Supabase:', error.message);
      setCategories([]);
    } else if (data && data.length > 0) {
      setCategories(data.map(rowToCategory));
    } else {
      setCategories([]);
    }
  }, []);

  // Initial load
  useEffect(() => {
    Promise.all([refreshProducts(), refreshCategories()]).finally(() =>
      setIsLoaded(true)
    );
  }, [refreshProducts, refreshCategories]);

  // ── CRUD — Products ────────────────────────────────────────────────────────

  const addProduct = useCallback(
    async (productData: Omit<Product, 'id'> & { id?: string | number }): Promise<Product | null> => {
      const slug =
        productData.slug ||
        productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      let categorySlug = productData.categorySlug;
      if (!categorySlug) {
        const match = categories.find(
          (c) => c.name.toLowerCase() === productData.category.toLowerCase()
        );
        categorySlug = match
          ? match.slug
          : productData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }

      const insertRow = {
        slug,
        name: productData.name,
        price: productData.price,
        raw_price: productData.rawPrice,
        image: productData.image,
        gallery: productData.gallery ?? [],
        category: productData.category,
        category_slug: categorySlug,
        badge: productData.badge ?? null,
        is_new: productData.isNew ?? false,
        description: productData.description ?? null,
        details: productData.details ?? [],
        sizes: productData.sizes ?? [],
        colors: productData.colors ?? [],
        fabric: productData.fabric ?? null,
      };

      const { data, error } = await supabase
        .from('products')
        .insert(insertRow)
        .select()
        .single();

      if (error) {
        console.error('Failed to add product:', error.message);
        return null;
      }

      const newProduct = rowToProduct(data);
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    },
    [categories]
  );

  const updateProduct = useCallback(
    async (id: string | number, updatedData: Partial<Product>): Promise<boolean> => {
      // Promote a static fallback product to a real Supabase row on first edit.
      if (typeof id === 'number') {
        const currentProduct = products.find((p) => String(p.id) === String(id));
        if (!currentProduct) return false;

        const product = { ...currentProduct, ...updatedData };
        const row = {
          slug: product.slug,
          name: product.name,
          price: product.price,
          raw_price: product.rawPrice,
          image: product.image,
          gallery: product.gallery ?? [],
          category: product.category,
          category_slug: product.categorySlug,
          badge: product.badge ?? null,
          is_new: product.isNew ?? false,
          description: product.description ?? null,
          details: product.details ?? [],
          sizes: product.sizes ?? [],
          colors: product.colors ?? [],
          fabric: product.fabric ?? null,
        };

        const { data, error } = await supabase
          .from('products')
          .upsert(row, { onConflict: 'slug' })
          .select()
          .single();

        if (error || !data) {
          console.error('Failed to save fallback product:', error?.message);
          return false;
        }

        const savedProduct = rowToProduct(data);
        setProducts((prev) => prev.map((p) => (String(p.id) === String(id) ? savedProduct : p)));
        return true;
      }

      const updateRow: Record<string, unknown> = {};
      if (updatedData.name !== undefined) updateRow.name = updatedData.name;
      if (updatedData.slug !== undefined) updateRow.slug = updatedData.slug;
      if (updatedData.price !== undefined) updateRow.price = updatedData.price;
      if (updatedData.rawPrice !== undefined) updateRow.raw_price = updatedData.rawPrice;
      if (updatedData.image !== undefined) updateRow.image = updatedData.image;
      if (updatedData.gallery !== undefined) updateRow.gallery = updatedData.gallery;
      if (updatedData.category !== undefined) updateRow.category = updatedData.category;
      if (updatedData.categorySlug !== undefined) updateRow.category_slug = updatedData.categorySlug;
      if (updatedData.badge !== undefined) updateRow.badge = updatedData.badge;
      if (updatedData.isNew !== undefined) updateRow.is_new = updatedData.isNew;
      if (updatedData.description !== undefined) updateRow.description = updatedData.description;
      if (updatedData.details !== undefined) updateRow.details = updatedData.details;
      if (updatedData.sizes !== undefined) updateRow.sizes = updatedData.sizes;
      if (updatedData.colors !== undefined) updateRow.colors = updatedData.colors;
      if (updatedData.fabric !== undefined) updateRow.fabric = updatedData.fabric;

      const { error } = await supabase
        .from('products')
        .update(updateRow)
        .eq('id', String(id));

      if (error) {
        console.error('Failed to update product:', error.message);
        return false;
      }

      setProducts((prev) =>
        prev.map((p) =>
          String(p.id) === String(id) ? { ...p, ...updatedData } : p
        )
      );
      return true;
    },
    [products]
  );

  const deleteProduct = useCallback(async (id: string | number): Promise<boolean> => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', String(id));

    if (error) {
      console.error('Failed to delete product:', error.message);
      return false;
    }

    setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
    return true;
  }, []);

  // ── CRUD — Categories ──────────────────────────────────────────────────────

  const addCategory = useCallback(
    async (categoryData: CategoryInfo): Promise<boolean> => {
      const exists = categories.some(
        (c) => c.slug.toLowerCase() === categoryData.slug.toLowerCase()
      );
      if (exists) return false;

      const { error } = await supabase.from('categories').insert({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        banner_image: categoryData.bannerImage,
      });

      if (error) {
        console.error('Failed to add category:', error.message);
        return false;
      }

      setCategories((prev) => [...prev, categoryData]);
      return true;
    },
    [categories]
  );

  const deleteCategory = useCallback(async (slug: string): Promise<boolean> => {
    const { error } = await supabase.from('categories').delete().eq('slug', slug);

    if (error) {
      console.error('Failed to delete category:', error.message);
      return false;
    }

    setCategories((prev) =>
      prev.filter((c) => c.slug.toLowerCase() !== slug.toLowerCase())
    );
    return true;
  }, []);

  // ── Query helpers ──────────────────────────────────────────────────────────

  const getProductBySlug = useCallback(
    (slug: string): Product | undefined => {
      const normalized = slug.toLowerCase();
      return products.find(
        (p) =>
          p.slug.toLowerCase() === normalized ||
          p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === normalized
      );
    },
    [products]
  );

  const getProductsByCategory = useCallback(
    (categorySlug: string): Product[] => {
      const normalized = categorySlug.toLowerCase();
      if (normalized === 'all') return products;
      return products.filter(
        (p) =>
          p.categorySlug.toLowerCase() === normalized ||
          p.category.toLowerCase().includes(normalized)
      );
    },
    [products]
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        isLoaded,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        getProductBySlug,
        getProductsByCategory,
        refreshProducts,
        refreshCategories,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
