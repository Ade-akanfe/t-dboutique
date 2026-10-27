'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { removeFromCart, updateQuantity, clearCart } from '../../store/features/cartSlice';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import CheckoutDialog from './CheckoutDialog';
import { parseMoneyAmount } from '../../lib/money';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const parsedPrices = items.map((item) => parseMoneyAmount(item.price));
  const hasInvalidPrice = parsedPrices.some((price) => price === null);
  const total = items.reduce((sum, item, index) => sum + (parsedPrices[index] ?? 0) * item.quantity, 0);

  const formattedTotal = hasInvalidPrice
    ? 'Price unavailable'
    : `₦${total.toLocaleString('en-NG')}`;

  return (
    <>
      <CheckoutDialog
        isOpen={isCheckoutOpen}
        items={items}
        onClose={() => setIsCheckoutOpen(false)}
      />
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-gold-500" style={{ color: '#D4AF37' }} />
            <h2 className="text-xl font-playfair font-bold text-zinc-900">Your Cart</h2>
            {items.length > 0 && (
              <span className="text-xs font-bold text-white bg-zinc-900 rounded-full w-5 h-5 flex items-center justify-center">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-zinc-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-20">
              <ShoppingBag className="w-16 h-16 text-zinc-200" />
              <p className="text-zinc-500 text-lg font-playfair">Your cart is empty</p>
              <p className="text-zinc-400 text-sm">Add some beautiful pieces to get started!</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 border border-gold-400 text-gold-600 rounded-md hover:bg-gold-50 transition-colors text-sm font-medium"
                style={{ borderColor: '#D4AF37', color: '#a18143' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-4 border-b border-zinc-100">
                  <div className="w-20 h-24 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">{item.category}</p>
                    <h4 className="text-sm font-semibold text-zinc-900 font-playfair leading-snug mb-1 truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm font-bold text-zinc-900 mb-3">{item.price}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-zinc-200 rounded-full">
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                          disabled={item.quantity <= 1}
                          className="p-1.5 hover:bg-zinc-100 rounded-full disabled:opacity-40 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-zinc-100 space-y-4 bg-zinc-50">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-sm">Subtotal</span>
              <span className="text-lg font-bold font-playfair text-zinc-900">{formattedTotal}</span>
            </div>
            {hasInvalidPrice && (
              <p role="alert" className="text-sm text-red-600">
                We couldn&apos;t read a price in your cart. Remove the affected item and add it again.
              </p>
            )}
            <button
              onClick={() => setIsCheckoutOpen(true)}
              disabled={hasInvalidPrice}
              className="w-full py-3.5 rounded-md font-semibold text-sm tracking-wider uppercase transition-all duration-200 text-zinc-900"
              style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #C5A028 50%, #a18143 100%)' }}
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => dispatch(clearCart())}
              className="w-full py-2 text-xs text-zinc-400 hover:text-zinc-700 transition-colors uppercase tracking-wider"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
