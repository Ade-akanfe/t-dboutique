-- =====================================================
-- T&D Boutique — Supabase Database Schema
-- Run this in Supabase SQL Editor (one time setup)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────
-- 1. CATEGORIES TABLE
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  banner_image TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────
-- 2. PRODUCTS TABLE
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  price         TEXT NOT NULL,
  raw_price     NUMERIC(10,2) NOT NULL DEFAULT 0,
  image         TEXT NOT NULL DEFAULT '',
  gallery       TEXT[] DEFAULT '{}',
  category      TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  badge         TEXT,
  is_new        BOOLEAN DEFAULT FALSE,
  description   TEXT,
  details       TEXT[] DEFAULT '{}',
  sizes         TEXT[] DEFAULT '{}',
  colors        TEXT[] DEFAULT '{}',
  fabric        TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────
-- 3. ORDERS TABLE
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_phone   TEXT,
  customer_address TEXT,
  total_amount     NUMERIC(10,2) NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ──────────────────────────────────────────
-- 4. ORDER ITEMS TABLE
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    TEXT NOT NULL,
  product_name  TEXT NOT NULL,
  product_image TEXT NOT NULL DEFAULT '',
  quantity      INT NOT NULL DEFAULT 1,
  price         NUMERIC(10,2) NOT NULL,
  size          TEXT,
  color         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────
-- 5. ROW LEVEL SECURITY
-- ──────────────────────────────────────────

-- Categories: public read, auth admin write
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Authenticated write categories" ON categories;
CREATE POLICY "Public read categories"  ON categories FOR SELECT USING (true);
CREATE POLICY "Authenticated write categories" ON categories FOR ALL USING (auth.role() = 'authenticated');

-- Products: public read, auth admin write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Authenticated write products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Authenticated write products" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Orders: auth admin only
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated manage orders" ON orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
CREATE POLICY "Authenticated manage orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
-- Allow anonymous order inserts (customers placing orders)
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Order Items: same as orders
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated manage order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can insert order items" ON order_items;
CREATE POLICY "Authenticated manage order items" ON order_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Anyone can insert order items" ON order_items FOR INSERT WITH CHECK (true);

-- ──────────────────────────────────────────
-- 6. SEED INITIAL CATEGORIES
-- ──────────────────────────────────────────
-- Product images are uploaded by authenticated admins and publicly readable.
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete product images" ON storage.objects;
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated update product images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated delete product images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');

-- ──────────────────────────────────────────
-- 7. SEED INITIAL CATEGORIES
-- ──────────────────────────────────────────
INSERT INTO categories (name, slug, description, banner_image) VALUES
  ('Gowns',                  'gowns',    'Breathtaking evening gowns, Aso-Ebi masterpieces, and statement silhouettes tailored with timeless Nigerian elegance.', '/assets/images/gowns/gown1.jpeg'),
  ('Shoes',                  'shoes',    'Handcrafted luxury heels, stylish pointed mules, and premium footwear designed for comfort and confidence.', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'),
  ('Sandals',                'sandals',  'Chic strappy sandals, crystal-embellished flats, and versatile day-to-evening footwear.', 'https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=800&auto=format&fit=crop'),
  ('Slippers',               'slippers', 'Luxurious slide slippers, plush velvet house mules, and artisanal casual flats for everyday refinement.', 'https://images.unsplash.com/photo-1588661661153-dfbc227582b6?q=80&w=800&auto=format&fit=crop'),
  ('Handbags',               'handbags', 'Structured leather totes, elegant evening clutches, and minimalist crossbodies made from genuine leather.', 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop'),
  ('Clothes (Skirts & Blouses)', 'clothes', 'Sophisticated 2-piece skirt and blouse sets, tailored Ankara coordinates, and contemporary luxury separates.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- ──────────────────────────────────────────
-- 8. SEED INITIAL PRODUCTS (subset of static data)
-- ──────────────────────────────────────────
INSERT INTO products (slug, name, price, raw_price, image, gallery, category, category_slug, badge, is_new, description, details, sizes, colors, fabric) VALUES
  ('ankara-infused-evening-gown', 'Ankara Infused Evening Gown', '₦45,000', 45000, '/assets/images/gowns/gown1.jpeg', ARRAY['/assets/images/gowns/gown1.jpeg','/assets/images/gowns/gown2.jpeg','/assets/images/gowns/gown3.jpeg'], 'Gowns', 'gowns', 'Trending', true, 'A showstopping evening gown blending authentic vibrant African wax prints with modern haute couture draping.', ARRAY['Tailored mermaid silhouette with delicate train','Sweetheart neckline with reinforced internal boning','High-grade Nigerian Ankara cotton & silk lining','Concealed back zipper with hook-and-eye closure','Dry clean only'], ARRAY['UK 8 / US 4','UK 10 / US 6','UK 12 / US 8','UK 14 / US 10','UK 16 / US 12','Custom Fitting'], ARRAY['Emerald & Gold Wax','Royal Blue & Crimson'], 'Authentic Ankara Wax Print & Silk Chiffon'),
  ('elegant-lace-overlay-gown', 'Elegant Lace Overlay Gown', '₦65,000', 65000, '/assets/images/gowns/gown2.jpeg', ARRAY['/assets/images/gowns/gown2.jpeg','/assets/images/gowns/gown1.jpeg','/assets/images/gowns/gown3.jpeg'], 'Gowns', 'gowns', 'Bestseller', true, 'Crafted with exquisite French cordonnet lace with shimmering metallic threads.', ARRAY['Hand-beaded lace overlay with subtle crystal sheen','Fitted corset bodice with structured cups','Floor-sweeping flared hem with horsehair trim','Includes matching detachable sheer cape'], ARRAY['UK 8 / US 4','UK 10 / US 6','UK 12 / US 8','UK 14 / US 10','UK 16 / US 12','Custom Fitting'], ARRAY['Champagne Gold','Rose Quartz'], 'Premium French Cord Lace & Duchess Satin'),
  ('sleek-silk-statement-gown', 'Sleek Silk Statement Gown', '₦55,000', 55000, '/assets/images/gowns/gown3.jpeg', NULL, 'Gowns', 'gowns', 'Popular', true, 'Minimalist luxury at its finest. Cut on the bias from liquid silk charmeuse.', ARRAY['Bias-cut body skimming silhouette','Draped cowl neckline with delicate spaghetti straps','Side thigh-high slit for ease of movement','Fully lined in pure silk crepe'], ARRAY['UK 8 / US 4','UK 10 / US 6','UK 12 / US 8','UK 14 / US 10','UK 16 / US 12'], ARRAY['Onyx Black','Rich Emerald','Tuscan Gold'], '100% Pure Silk Charmeuse'),
  ('suede-pointed-mules', 'Suede Pointed Mules', '₦150,000', 150000, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop', NULL, 'Shoes', 'shoes', 'Bestseller', false, 'Supple Italian suede mules shaped with a razor-sharp pointed toe and architectural block heel.', ARRAY['Heel height: 75mm / 3 inches','Pointed closed toe silhouette','Padded memory foam insole for all-day comfort','Handcrafted genuine leather sole'], ARRAY['EU 37 / UK 4','EU 38 / UK 5','EU 39 / UK 6','EU 40 / UK 7','EU 41 / UK 8'], ARRAY['Onyx Black','Warm Taupe','Tan'], '100% Genuine Italian Calf Suede'),
  ('crystal-embellished-block-heels', 'Crystal Embellished Block Heels', '₦125,000', 125000, 'https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=800&auto=format&fit=crop', NULL, 'Shoes', 'shoes', 'Luxury', false, 'Statement occasion heels adorned with light-catching crystal clusters.', ARRAY['Heel height: 85mm / 3.3 inches','Secure adjustable ankle strap with gold buckle','Anti-slip leather outsole'], ARRAY['EU 37 / UK 4','EU 38 / UK 5','EU 39 / UK 6','EU 40 / UK 7','EU 41 / UK 8'], ARRAY['Gold Metallic','Silver Crystal'], 'Metallic Leather & Swarovski Crystal Accents'),
  ('braided-gold-strap-sandals', 'Braided Gold Strap Sandals', '₦68,000', 68000, 'https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=800&auto=format&fit=crop', NULL, 'Sandals', 'sandals', 'Popular', false, 'Hand-braided metallic leather straps weave across the foot in an effortless, elevated flat sandal.', ARRAY['Flat heel: 10mm','Hand-woven tubular leather cords','Flexible leather sole'], ARRAY['EU 37 / UK 4','EU 38 / UK 5','EU 39 / UK 6','EU 40 / UK 7','EU 41 / UK 8'], ARRAY['Gold Gilt','Bronze'], 'Soft Nappa Leather'),
  ('embroidered-velvet-mules', 'Embroidered Velvet Mules', '₦52,000', 52000, 'https://images.unsplash.com/photo-1588661661153-dfbc227582b6?q=80&w=800&auto=format&fit=crop', NULL, 'Slippers', 'slippers', 'Bestseller', false, 'Plush velvet slide mules detailed with gold bullion wire embroidery.', ARRAY['Quilted satin insole','Gold hand-embroidered crest motif','Non-slip outdoor rubber sole'], ARRAY['EU 37 / UK 4','EU 38 / UK 5','EU 39 / UK 6','EU 40 / UK 7','EU 41 / UK 8'], ARRAY['Royal Emerald','Burgundy Wine','Jet Black'], 'Cotton Velvet & Gold Bullion Thread'),
  ('classic-leather-tote', 'Classic Leather Tote', '₦250,000', 250000, 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop', NULL, 'Handbags', 'handbags', 'Bestseller', false, 'An expansive everyday tote crafted from textured grain leather with room for a 14-inch laptop.', ARRAY['Dimensions: 38cm W x 28cm H x 14cm D','Reinforced dual shoulder straps','Internal zippered divider pocket and key leash','Protective metal feet at base'], ARRAY['One Size'], ARRAY['Cognac Tan','Midnight Black','Burgundy'], '100% Genuine Grain Calfskin'),
  ('adire-wrap-blouse-peplum-skirt', 'Adire Wrap Blouse & Peplum Skirt', '₦65,000', 65000, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop', NULL, 'Clothes', 'clothes', 'Trending', false, 'A striking 2-piece ensemble crafted from authentic hand-dyed Nigerian Adire silk.', ARRAY['Includes wrap peplum blouse and high-waist pencil skirt','Authentic hand-dyed Indigo Adire patterns','Blouse features adjustable inner and outer tie sash','Skirt with rear center slit and invisible zipper'], ARRAY['UK 8 / US 4','UK 10 / US 6','UK 12 / US 8','UK 14 / US 10','UK 16 / US 12','Custom Fitting'], ARRAY['Indigo & Cobalt Blue','Terracotta & Gold'], 'Hand-Dyed Adire Silk & Cotton Blend')
ON CONFLICT (slug) DO NOTHING;
