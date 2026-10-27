import { Metadata } from 'next';
import GownsPage, { metadata as gownsMetadata } from '../gowns/page';

export const metadata: Metadata = {
  ...gownsMetadata,
  title: 'Luxury Gowns & Evening Dresses | T&D Boutique Lagos (Worldwide Delivery)',
  alternates: {
    canonical: '/gowns',
  },
};

export default GownsPage;
