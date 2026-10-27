'use client';

import React, { useState, useEffect } from 'react';
import { X, Trash2, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import type { Product, CategoryInfo } from '../../lib/productTypes';
import { cleanProductDescription, cleanProductDetails, cleanProductFabric } from '../../lib/productCopy';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'> & { id?: string | number }) => void;
  initialProduct?: Product | null;
  categories: CategoryInfo[];
}

const CATEGORY_SIZE_PRESETS: Record<string, string[]> = {
  clothes: ['Nigeria 8 / UK 8', 'Nigeria 10 / UK 10', 'Nigeria 12 / UK 12', 'Nigeria 14 / UK 14', 'Nigeria 16 / UK 16', 'Custom Fitting'],
  shoes: ['Nigeria 37 / UK 4', 'Nigeria 38 / UK 5', 'Nigeria 39 / UK 6', 'Nigeria 40 / UK 7', 'Nigeria 41 / UK 8'],
  sandals: ['Nigeria 37 / UK 4', 'Nigeria 38 / UK 5', 'Nigeria 39 / UK 6', 'Nigeria 40 / UK 7', 'Nigeria 41 / UK 8'],
  slippers: ['Nigeria 37 / UK 4', 'Nigeria 38 / UK 5', 'Nigeria 39 / UK 6', 'Nigeria 40 / UK 7', 'Nigeria 41 / UK 8'],
  handbags: ['One Size'],
};

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  initialProduct,
  categories,
}: ProductFormModalProps) {
  const isEditing = !!initialProduct;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Clothes (Skirts & Blouses)');
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || 'clothes');
  const [rawPrice, setRawPrice] = useState<number>(45000);
  const [image, setImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [badge, setBadge] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [description, setDescription] = useState('');
  const [fabric, setFabric] = useState('');
  
  // Array items
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState('');
  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState('');
  const [details, setDetails] = useState<string[]>([]);
  const [detailInput, setDetailInput] = useState('');

  const [activeTab, setActiveTab] = useState<'basics' | 'media' | 'specs'>('basics');
  const [error, setError] = useState('');

  // Populate or reset form
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setSlug(initialProduct.slug);
      setCategory(initialProduct.category);
      setCategorySlug(initialProduct.categorySlug);
      setRawPrice(initialProduct.rawPrice || 0);
      setImage(initialProduct.image);
      setGallery(initialProduct.gallery || [initialProduct.image]);
      setBadge(initialProduct.badge || '');
      setIsNew(!!initialProduct.isNew);
      setDescription(cleanProductDescription(initialProduct.description, initialProduct.name) || '');
      setFabric(cleanProductFabric(initialProduct.fabric) || '');
      setSizes(initialProduct.categorySlug === 'bags' ? [] : initialProduct.sizes || []);
      setColors(initialProduct.categorySlug === 'bags' ? [] : initialProduct.colors || []);
      setDetails(cleanProductDetails(initialProduct.details));
    } else {
      const defaultCat = categories[0] || { name: 'Clothes (Skirts & Blouses)', slug: 'clothes' };
      setName('');
      setSlug('');
      setCategory(defaultCat.name);
      setCategorySlug(defaultCat.slug);
      setRawPrice(45000);
      setImage('');
      setGallery([]);
      setBadge('');
      setIsNew(false);
      setDescription('');
      setFabric('');
      setSizes([]);
      setColors([]);
      setDetails([]);
    }
    setSizeInput('');
    setColorInput('');
    setDetailInput('');
    setError('');
    setActiveTab('basics');
  }, [initialProduct, isOpen, categories]);

  // Auto-generate slug when name changes in create mode
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
    }
  };

  // Bags do not have size or color variants.
  const handleCategoryChange = (selectedCatName: string) => {
    setCategory(selectedCatName);
    const match = categories.find(c => c.name.toLowerCase() === selectedCatName.toLowerCase());
    const newSlug = match ? match.slug : selectedCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setCategorySlug(newSlug);

    if (newSlug === 'bags') {
      setSizes([]);
      setColors([]);
      setSizeInput('');
      setColorInput('');
    }
  };

  // Remove gallery image
  const handleRemoveGalleryImage = (index: number) => {
    const removedImage = gallery[index];
    const remainingImages = gallery.filter((_, i) => i !== index);
    setGallery(remainingImages);
    if (removedImage === image) {
      setImage(remainingImages[0] || '');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (files.length === 0) return;

    if (files.some((file) => !file.type.startsWith('image/'))) {
      setError('Please select image files only.');
      setActiveTab('media');
      return;
    }

    setIsUploading(true);
    setError('');
    const uploadedUrls: string[] = [];
    
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      setImage((currentImage) => currentImage || uploadedUrls[0]);
      setGallery((currentGallery) => [...uploadedUrls, ...currentGallery]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(`Upload failed: ${message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Add Size
  const handleAddSize = () => {
    if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
      setSizes([...sizes, sizeInput.trim()]);
      setSizeInput('');
    }
  };

  // Remove Size
  const handleRemoveSize = (sz: string) => {
    setSizes(sizes.filter(s => s !== sz));
  };

  // Add Color
  const handleAddColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput.trim())) {
      setColors([...colors, colorInput.trim()]);
      setColorInput('');
    }
  };

  // Remove Color
  const handleRemoveColor = (col: string) => {
    setColors(colors.filter(c => c !== col));
  };

  // Add Detail bullet point
  const handleAddDetail = () => {
    if (detailInput.trim()) {
      setDetails([...details, detailInput.trim()]);
      setDetailInput('');
    }
  };

  // Remove Detail bullet point
  const handleRemoveDetail = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Product name is required');
      setActiveTab('basics');
      return;
    }

    if (!image.trim()) {
      setError('Main product image is required');
      setActiveTab('media');
      return;
    }

    const formattedPrice = `₦${rawPrice.toLocaleString()}`;
    const finalGallery = gallery.length > 0 ? gallery : [image];

    onSave({
      id: initialProduct?.id,
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      categorySlug,
      rawPrice: Number(rawPrice) || 0,
      price: formattedPrice,
      image: image.trim(),
      gallery: finalGallery,
      badge: badge.trim(),
      isNew,
      description: description.trim(),
      fabric: fabric.trim(),
      sizes: categorySlug === 'bags' ? [] : sizes,
      colors: categorySlug === 'bags' ? [] : colors,
      details,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center" style={{ color: '#D4AF37' }}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-playfair text-xl font-bold text-white">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-xs text-zinc-400">
                {isEditing ? `Modify details for ${initialProduct?.name}` : 'Create a new piece and categorize it'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 px-6 bg-zinc-950/30">
          {[
            { id: 'basics', label: '1. Basic Info & Category' },
            { id: 'media', label: '2. Images & Gallery' },
            { id: 'specs', label: '3. Sizes, Colors & Details' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-gold-500 text-gold-400 bg-gold-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
              style={activeTab === tab.id ? { borderColor: '#D4AF37', color: '#D4AF37' } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: Basics & Category */}
          {activeTab === 'basics' && (
            <div className="space-y-5">
              
              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-gold-500 focus:outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                    Badge / Tag
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-gold-500 focus:outline-none cursor-pointer"
                  >
                    <option value="">No Badge</option>
                    <option value="Trending">Trending</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Popular">Popular</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Exclusive">Exclusive</option>
                  </select>
                </div>
              </div>

              {/* Product Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Royal Emerald Velvet Gown"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. royal-emerald-velvet-gown"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-mono focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Price & New Arrival Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                    Price (in Naira ₦) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₦</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="500"
                      value={rawPrice}
                      onChange={(e) => setRawPrice(Number(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm font-semibold focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                  <span className="text-[11px] text-zinc-400 mt-1 block">
                    Displays as: <strong className="text-gold-400" style={{ color: '#D4AF37' }}>₦{rawPrice.toLocaleString()}</strong>
                  </span>
                </div>

                <div className="pt-3 sm:pt-0">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-zinc-800/60 border border-zinc-700/60 hover:bg-zinc-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">Mark as New Arrival</p>
                      <p className="text-[11px] text-zinc-400">Featured in New Arrivals section on the homepage</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the silhouette, styling, drape, occasion fit, and luxury details..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:border-gold-500 focus:outline-none"
                />
              </div>

            </div>
          )}

          {/* TAB 2: Images & Gallery */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              
              {/* Product image upload */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Product Images *
                </label>
                <label className="mt-2 inline-flex cursor-pointer items-center rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:bg-zinc-700">
                  {isUploading ? 'Uploading images...' : 'Upload images'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isUploading}
                    onChange={handleImageUpload}
                    className="sr-only"
                  />
                </label>
                <p className="mt-2 text-[11px] text-zinc-500">The first uploaded image becomes the main product image. URLs are added automatically.</p>
              </div>

              {/* Image Preview */}
              <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2">Main Cover Preview</p>
                  <div className="relative aspect-3/4 w-full rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center">
                    {image ? (
                      <img src={image} alt="Preview" className="w-full h-full object-cover object-center scale-[1.12]" />
                    ) : (
                      <div className="text-center p-4 text-zinc-500">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <span className="text-xs">No image set</span>
                      </div>
                    )}
                  </div>
              </div>

              {/* Uploaded gallery images */}
              <div className="pt-4 border-t border-zinc-800">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Uploaded Gallery Images
                </label>
                {/* Gallery thumbnail strip */}
                <div className="flex flex-wrap gap-3">
                  {gallery.map((imgUrl, i) => (
                    <div key={i} className={`relative w-16 h-20 rounded-lg bg-zinc-800 border overflow-hidden group ${imgUrl === image ? 'border-gold-400 ring-2 ring-gold-400/50' : 'border-zinc-700'}`}>
                      <button
                        type="button"
                        onClick={() => setImage(imgUrl)}
                        className="w-full h-full"
                        title={imgUrl === image ? 'Cover image' : 'Set as cover image'}
                      >
                        <img src={imgUrl} alt={`${imgUrl === image ? 'Cover' : 'Gallery'} image ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                      {imgUrl === image && (
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 px-1 py-0.5 text-[9px] font-semibold text-white text-center pointer-events-none">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(i)}
                        className="absolute top-1 right-1 z-10 rounded-full bg-black/75 p-1 text-rose-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black hover:text-rose-300"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Sizes, Colors & Specifications */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              
              {/* Fabric Specification */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Fabric Composition / Materials
                </label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="e.g. 100% Pure Silk Charmeuse, Duchess Satin, Genuine Italian Suede..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Sizes */}
              {categorySlug !== 'bags' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Available Sizes ({sizes.length})
                  </label>
                  {categorySlug && CATEGORY_SIZE_PRESETS[categorySlug] && (
                    <button
                      type="button"
                      onClick={() => setSizes(CATEGORY_SIZE_PRESETS[categorySlug])}
                      className="text-[11px] underline hover:text-white"
                      style={{ color: '#D4AF37' }}
                    >
                      Reset to {category} Presets
                    </button>
                  )}
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    placeholder="Add custom size (e.g. UK 18, EU 42, XXL)..."
                    className="flex-1 px-3.5 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-gold-500 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSize();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-3.5 py-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 rounded-lg text-xs font-semibold uppercase tracking-wider"
                  >
                    Add Size
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sizes.map((sz) => (
                    <span
                      key={sz}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-200"
                    >
                      {sz}
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(sz)}
                        className="text-zinc-400 hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              )}

              {/* Colors / Patterns */}
              {categorySlug !== 'bags' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Colors / Patterns ({colors.length})
                </label>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    placeholder="Add color (e.g. Emerald Gold, Onyx Black, Champagne)..."
                    className="flex-1 px-3.5 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-gold-500 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddColor();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3.5 py-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 rounded-lg text-xs font-semibold uppercase tracking-wider"
                  >
                    Add Color
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {colors.map((col) => (
                    <span
                      key={col}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-200"
                    >
                      {col}
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(col)}
                        className="text-zinc-400 hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              )}

              {/* Bullet Detail Points */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                  Product Details & Features ({details.length})
                </label>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={detailInput}
                    onChange={(e) => setDetailInput(e.target.value)}
                    placeholder="Add a bullet point feature (e.g. Hand-beaded lace with crystal sheen)..."
                    className="flex-1 px-3.5 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:border-gold-500 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDetail();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddDetail}
                    className="px-3.5 py-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 rounded-lg text-xs font-semibold uppercase tracking-wider"
                  >
                    Add Feature
                  </button>
                </div>

                <ul className="space-y-1.5">
                  {details.map((dt, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between px-3 py-2 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-xs text-zinc-200"
                    >
                      <span>• {dt}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDetail(i)}
                        className="text-zinc-400 hover:text-rose-400 ml-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <div className="flex gap-3">
              {activeTab !== 'basics' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'specs') setActiveTab('media');
                    else if (activeTab === 'media') setActiveTab('basics');
                  }}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                >
                  Previous
                </button>
              )}

              {activeTab !== 'specs' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'basics') setActiveTab('media');
                    else if (activeTab === 'media') setActiveTab('specs');
                  }}
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-zinc-800 text-gold-400 hover:bg-zinc-700 border border-zinc-700 transition-colors"
                  style={{ color: '#D4AF37' }}
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-zinc-950 transition-all shadow-lg hover:shadow-gold-500/20 transform active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #C5A028 50%, #a18143 100%)' }}
                >
                  {isEditing ? 'Save Changes' : 'Create Product'}
                </button>
              )}
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
