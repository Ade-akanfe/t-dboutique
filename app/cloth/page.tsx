import { Metadata } from 'next';
import ClothesPage, { metadata as clothesMetadata } from '../clothes/page';

export const metadata: Metadata = {
  ...clothesMetadata,
  title: "Women's Clothing & Skirts | T&D Boutique Lagos (Worldwide Delivery)",
  alternates: {
    canonical: '/clothes',
  },
};

export default ClothesPage;
