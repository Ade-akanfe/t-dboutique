'use client';

import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/features/cartSlice';
import toast from 'react-hot-toast';
import { ShoppingBag } from 'lucide-react';

interface Product {
  id: number | string;
  slug: string;
  name: string;
  price: string;
  image: string;
  category: string;
}

export default function AddToCartButton({ product }: { product: Product }) {
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addToCart({ ...product }));
    toast.success(`${product.name} added to cart!`, { icon: '🛍️' });
  };

  return (
    <button
      onClick={handleAdd}
      className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white text-xs tracking-widest uppercase opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 px-4 py-2 rounded-sm font-semibold whitespace-nowrap"
      style={{ background: 'linear-gradient(135deg, #D4AF37, #a18143)' }}
    >
      <ShoppingBag className="w-3.5 h-3.5" />
      Add to Cart
    </button>
  );
}
