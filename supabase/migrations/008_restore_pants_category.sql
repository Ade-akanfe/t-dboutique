INSERT INTO categories (name, slug, description, banner_image)
VALUES (
  'Pants',
  'pants',
  'Elegant and stylish pants and trousers for every occasion.',
  ''
)
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
