'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/features/cartSlice';
import toast from 'react-hot-toast';
import type { Product } from '../../lib/productTypes';
import { parseSizes } from '../../lib/productSizes';
import { ShoppingBag, MessageSquare, ShieldCheck, Truck, ChevronRight, ChevronLeft, Minus, Plus, Maximize2, X } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { cleanProductDescription, cleanProductDetails, cleanProductFabric } from '../../lib/productCopy';
import { CONTACT_DETAILS } from '../../lib/contactDetails';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailView({ product: initialProduct, relatedProducts: initialRelated }: ProductDetailViewProps) {
  const dispatch = useDispatch();
  const { getProductBySlug, products, isLoaded } = useProducts();

  // Retrieve live updated product from ProductContext if available
  const product = useMemo(() => {
    if (isLoaded && initialProduct?.slug) {
      const live = getProductBySlug(initialProduct.slug);
      if (live) return live;
    }
    return initialProduct;
  }, [isLoaded, initialProduct, getProductBySlug]);

  const relatedProducts = useMemo(() => {
    if (isLoaded && product) {
      return products
        .filter((p) => p.categorySlug === product.categorySlug && String(p.id) !== String(product.id))
        .slice(0, 4);
    }
    return initialRelated;
  }, [isLoaded, product, products, initialRelated]);
  
  const images = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  const productSizes = useMemo(() => {
    return product.categorySlug === 'bags'
      ? []
      : (product.sizes ?? []).flatMap((s) => parseSizes(s));
  }, [product.categorySlug, product.sizes]);
  const hasColorOptions = product.categorySlug !== 'bags' && Boolean(product.colors?.length);
  const productDetails = cleanProductDetails(product.details);
  const productFabric = cleanProductFabric(product.fabric);
  const productDescription = cleanProductDescription(product.description, product.name);
  const hasProductDetails = Boolean(productDetails.length || productFabric);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(images[0] || product.image);
  const [selectedSize, setSelectedSize] = useState(() => {
    if (product.categorySlug === 'bags') return '';
    const parsed = (product.sizes ?? []).flatMap((s) => parseSizes(s));
    return parsed[0] || '';
  });
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'sizing' | 'delivery'>(() => {
    if (cleanProductDetails(initialProduct.details).length || cleanProductFabric(initialProduct.fabric)) {
      return 'details';
    }
    return initialProduct.categorySlug !== 'bags' && initialProduct.sizes?.length ? 'sizing' : 'delivery';
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const visibleActiveTab = activeTab === 'details' && !hasProductDetails
    ? productSizes.length > 0 ? 'sizing' : 'delivery'
    : activeTab === 'sizing' && productSizes.length === 0
      ? hasProductDetails ? 'details' : 'delivery'
      : activeTab;
  const activeSize = productSizes.includes(selectedSize) ? selectedSize : productSizes[0] || '';

  const handleNextImage = () => {
    const nextIdx = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIdx);
    setSelectedImage(images[nextIdx]);
  };

  const handlePrevImage = () => {
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIdx);
    setSelectedImage(images[prevIdx]);
  };

  const handleAddToCart = () => {
    const hasSizeOptions = productSizes.length > 0;
    const variantLabel = [hasSizeOptions && activeSize, hasColorOptions && selectedColor]
      .filter(Boolean)
      .join('-');

    for (let i = 0; i < quantity; i++) {
      dispatch(
        addToCart({
          id: variantLabel ? `${product.id}-${variantLabel}` : product.id,
          productId: product.id,
          slug: product.slug,
          name: variantLabel ? `${product.name} (${variantLabel.replace('-', ', ')})` : product.name,
          price: product.price,
          image: selectedImage,
          category: product.category,
          ...(hasSizeOptions ? { size: activeSize } : {}),
          ...(hasColorOptions ? { color: selectedColor } : {}),
        })
      );
    }
    toast.success(`${quantity}x ${product.name} added to your cart!`, {
      icon: '🛍️',
      duration: 4000,
    });
  };

  const productPageUrl = `/products/${product.slug}`;

  const whatsappMessage = encodeURIComponent(
    [
      '🛍️ *Order Inquiry — T&D Boutique*',
      '',
      `*Item:* ${product.name}`,
      `*Category:* ${product.category}`,
      `*Price:* ${product.price}`,
      ...(productSizes.length > 0 ? [`*Size:* ${activeSize}`] : []),
      ...(hasColorOptions ? [`*Colour:* ${selectedColor}`] : []),
      `*Quantity:* ${quantity}`,
      ...(productDetails.length > 0 ? ['', `*Details:*\n${productDetails.map((detail) => `• ${detail}`).join('\n')}`] : []),
      ...(productFabric ? [`*Fabric:* ${productFabric}`] : []),
      '',
      '*Product Image:*',
      selectedImage,
      '',
      '*View Product Page:*',
      productPageUrl,
      '',
      'Please confirm availability and delivery timeline. Thank you! 🙏',
    ].join('\n')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs md:text-sm text-zinc-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <Link href="/categories/all" className="hover:text-zinc-900 transition-colors">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <Link href={`/categories/${product.categorySlug}`} className="hover:text-zinc-900 transition-colors capitalize">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-zinc-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-3">
        
        {/* Left Column: Image Gallery & Slideshow */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Hero Slideshow Image */}
          <div className="relative aspect-[3/4] max-h-[600px] w-full bg-zinc-100 rounded-2xl overflow-hidden shadow-sm border border-zinc-200/80 group">
            <img
              src={selectedImage}
              alt={`${product.name} - View ${currentIndex + 1}`}
              className="object-contain object-center w-full h-full scale-[1.08] transition-all duration-500 ease-out"
            />

            {/* Badge */}
            {product.badge && (
              <div
                className="absolute top-4 left-4 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-3.5 rounded-full shadow-md pointer-events-none z-10"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #a18143 100%)' }}
              >
                {product.badge}
              </div>
            )}

            {/* Angle & Index Indicator */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 text-white backdrop-blur-md">
                Image
              </span>
              <span className="px-2 py-1 rounded-full text-[11px] font-bold bg-white/90 text-zinc-900 backdrop-blur-md shadow-sm">
                {currentIndex + 1} / {images.length}
              </span>
            </div>

            {/* Slideshow Previous / Next Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 text-zinc-900 flex items-center justify-center shadow-lg backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 text-zinc-900 flex items-center justify-center shadow-lg backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Fullscreen Expand Trigger */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 text-zinc-800 shadow-md backdrop-blur-md opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:opacity-100 hover:bg-white transition-all z-10"
              aria-label="View fullscreen image"
              title="Expand image"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Preview Strip Directly Below Main Image */}
          {images.length > 1 && (
            <div className="pt-2">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, idx) => {
                  const isSelected = selectedImage === img;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(img);
                        setCurrentIndex(idx);
                      }}
                      onMouseEnter={() => {
                        setSelectedImage(img);
                        setCurrentIndex(idx);
                      }}
                      className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-zinc-900 ring-2 ring-gold-400 shadow-md scale-[1.03]'
                          : 'border-zinc-200 opacity-60 hover:opacity-100 hover:border-zinc-400'
                      }`}
                      style={isSelected ? { borderColor: '#18181b', outlineColor: '#D4AF37' } : {}}
                      aria-label={`Preview angle ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Active check indicator badge */}
                      {isSelected && (
                        <div
                          className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white"
                          style={{ background: '#D4AF37' }}
                        >
                          <span className="text-[9px] font-bold">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Details, Options & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          
          {/* Header */}
          <div className="border-b border-zinc-200 pb-6 mb-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
              <span>{product.category}</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                In Stock & Ready to Ship
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-zinc-900 font-bold mb-3 leading-tight">
              {product.name}
            </h1>
            <p className="text-2xl md:text-3xl font-bold font-playfair" style={{ color: '#D4AF37' }}>
              {product.price}
            </p>
          </div>

          {/* Short Description */}
          {productDescription && (
            <p className="text-zinc-600 text-sm leading-relaxed mb-6 font-inter">
              {productDescription}
            </p>
          )}

          {/* Color Selector */}
          {hasColorOptions && (
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 mb-2.5">
                Color / Pattern: <span className="font-normal text-zinc-900">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors?.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-medium border transition-all ${
                      selectedColor === col
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                        : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {productSizes.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    Select Size: <span className="font-normal text-zinc-900">{activeSize}</span>
                  </label>
                </div>
                <Link
                  href="/size-guide"
                  target="_blank"
                  className="text-xs font-medium underline transition-colors cursor-pointer shrink-0"
                  style={{ color: '#a18143' }}
                >
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {productSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`min-w-[4rem] py-2 px-3.5 rounded-lg text-xs font-medium border transition-all text-center cursor-pointer ${
                      activeSize === sz
                        ? 'border-gold-500 bg-gold-50 text-zinc-900 font-semibold ring-1 ring-gold-400 shadow-xs'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                    }`}
                    style={activeSize === sz ? { borderColor: '#D4AF37', backgroundColor: 'rgba(212, 175, 55, 0.08)' } : {}}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 mb-8 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-zinc-300 rounded-lg bg-white px-2 py-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-zinc-500 hover:text-zinc-900 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-zinc-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-zinc-500 hover:text-zinc-900 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-lg font-semibold text-xs md:text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 text-zinc-900 shadow-md hover:shadow-lg transform active:scale-[0.99]"
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #C5A028 50%, #a18143 100%)' }}
              >
                <ShoppingBag className="w-4 h-4"/>
                <span>Add to Shopping Bag</span>
              </button>
            </div>

            {/* Direct WhatsApp Order Button */}
            <a
              href={`https://wa.me/${CONTACT_DETAILS.whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 shadow-sm hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
            >
              <MessageSquare className="w-4 h-4" />
              Order / Inquire on WhatsApp
            </a>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-zinc-100/70 rounded-xl border border-zinc-200/70 text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold-500 flex-shrink-0" style={{ color: '#D4AF37' }} />
              <span>Fast Nationwide Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-500 flex-shrink-0" style={{ color: '#D4AF37' }} />
              <span>100% Authentic Quality</span>
            </div>
          </div>

        </div>
      </div>

      {/* Full-Width Interactive Info Tabs (Positioned Below Everything) */}
      <div className="mb-14 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm">
        {/* Tab Buttons */}
        <div className="flex justify-between sm:justify-start border-b border-zinc-200 mb-6 sm:gap-10">
          {[
            ...(hasProductDetails ? [{ id: 'details', label: 'Details' }] : []),
            ...(productSizes.length > 0 ? [{ id: 'sizing', label: 'Sizing' }] : []),
            { id: 'delivery', label: 'Delivery' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex-1 sm:flex-initial text-center sm:text-left pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
                visibleActiveTab === tab.id
                  ? 'border-gold-500 text-zinc-900'
                  : 'border-transparent text-zinc-400 hover:text-zinc-700'
              }`}
              style={visibleActiveTab === tab.id ? { borderColor: '#D4AF37' } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stable Fixed Height Content Box (Prevents Page Resizing Jumps) */}
        <div className="text-xs sm:text-sm text-zinc-600 leading-relaxed min-h-[140px] flex flex-col justify-start">
          {visibleActiveTab === 'details' && hasProductDetails && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#a18143' }}>
                Details & Fabric Specifications
              </h4>
              {productFabric && (
                <p><strong className="text-zinc-900">Fabric Composition:</strong> {productFabric}</p>
              )}
              {productDetails.length > 0 && (
                <ul className="list-disc list-inside space-y-1.5 text-zinc-600">
                  {productDetails.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {visibleActiveTab === 'sizing' && productSizes.length > 0 && (
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#a18143' }}>
                  Available Sizes
                </h4>
              </div>
              <ul className="list-disc list-inside space-y-1.5 text-zinc-600">
                {productSizes.map((size) => <li key={size}>{size}</li>)}
              </ul>
            </div>
          )}

          {visibleActiveTab === 'delivery' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#a18143' }}>
                Shipping, Delivery & Returns
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                  <p className="font-semibold text-zinc-900 mb-0.5">Abuja Delivery</p>
                  <p className="text-zinc-500 text-xs">24–48 hours direct to your doorstep via reliable dispatch.</p>
                </div>
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                  <p className="font-semibold text-zinc-900 mb-0.5">Nationwide (Other States)</p>
                  <p className="text-zinc-500 text-xs">2–4 business days via DHL Express / GIG Logistics.</p>
                </div>
              </div>
              <p className="text-xs text-zinc-400">
                Exchanges are accepted within 48 hours of receipt in unworn original condition with tags attached.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-zinc-200 pt-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif text-zinc-900">You May Also Adore</h2>
              <p className="text-zinc-500 text-sm mt-1 ">Curated pairings from our {product.category} collection.</p>
            </div>
            <Link
              href={`/categories/${product.categorySlug}`}
              className="hidden md:inline-flex text-xs font-semibold uppercase tracking-wider hover:underline"
              style={{ color: '#a18143' }}
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                href={`/products/${rel.slug}`}
                className="group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 sm:h-64 md:aspect-[3/4] md:h-auto bg-zinc-100 mb-3 overflow-hidden rounded-xl">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    {rel.badge && (
                      <div
                        className="absolute top-2.5 left-2.5 text-white text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #a18143 100%)' }}
                      >
                        {rel.badge}
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 uppercase tracking-wider">{rel.category}</p>
                  <h4 className="text-sm font-serif text-zinc-900 group-hover:text-zinc-700 transition-colors line-clamp-1">
                    {rel.name}
                  </h4>
                </div>
                <p className="text-sm font-bold mt-1" style={{ color: '#D4AF37' }}>
                  {rel.price}
                </p>
              </Link>
            ))}
          </div>

          {/* Mobile-Only View More Button */}
          <div className="mt-8 text-center md:hidden">
            <Link
              href={`/categories/${product.categorySlug}`}
              className="inline-flex items-center justify-center w-full py-3 px-6 border text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 active:scale-[0.99]"
              style={{ borderColor: '#D4AF37', color: '#a18143', background: 'rgba(212, 175, 55, 0.06)' }}
            >
              View More from {product.category} →
            </Link>
          </div>
        </div>
      )}

      {/* Fullscreen Big Screen Image Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          {/* Modal Header */}
          <div className="flex items-center justify-between z-10">
            <div>
              <h3 className="text-white font-serif text-lg md:text-xl font-medium">{product.name}</h3>
              <p className="text-xs text-gold-400 font-semibold" style={{ color: '#D4AF37' }}>
                Image {currentIndex + 1} of {images.length}
              </p>
            </div>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/25 transition-colors"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Big Center Image View */}
          <div className="relative flex-1 flex items-center justify-center max-h-[78vh] my-auto">
            {images.length > 1 && (
              <button
                onClick={handlePrevImage}
                className="absolute left-2 sm:left-6 p-3 rounded-full bg-white/15 text-white hover:bg-white/30 backdrop-blur-md transition-all active:scale-95 z-20"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={selectedImage}
              alt={product.name}
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
            />

            {images.length > 1 && (
              <button
                onClick={handleNextImage}
                className="absolute right-2 sm:right-6 p-3 rounded-full bg-white/15 text-white hover:bg-white/30 backdrop-blur-md transition-all active:scale-95 z-20"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Modal Bottom Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex justify-center gap-3 overflow-x-auto py-2 z-10">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(img);
                    setCurrentIndex(idx);
                  }}
                  className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === img
                      ? 'border-gold-400 ring-2 ring-gold-400/50 scale-105'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                  style={selectedImage === img ? { borderColor: '#D4AF37' } : {}}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
