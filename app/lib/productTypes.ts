export interface Product {
  id: number | string;
  slug: string;
  name: string;
  price: string;
  rawPrice: number;
  image: string;
  gallery?: string[];
  category: string;
  categorySlug: string;
  badge?: string;
  isNew?: boolean;
  description?: string;
  details?: string[];
  sizes?: string[];
  colors?: string[];
  fabric?: string;
  createdAt?: string;
}

export interface CategoryInfo {
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
}
