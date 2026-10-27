INSERT INTO categories (name, slug, description, banner_image)
VALUES (
  'Bags',
  'bags',
  'Luxury handbag styles and statement carryalls curated from the latest T&D Boutique collection.',
  'https://res.cloudinary.com/plgkusx1/image/upload/f_auto,q_auto,c_limit,w_1200/v1792744489/home/TandD/boutique/uploads/bbhaynpi3p8crfil2hqd.jpg'
)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  banner_image = EXCLUDED.banner_image;
