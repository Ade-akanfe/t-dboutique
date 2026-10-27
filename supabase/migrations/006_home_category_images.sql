UPDATE categories
SET banner_image = 'https://res.cloudinary.com/plgkusx1/image/upload/f_auto,q_auto,c_limit,w_1200/v1792748135/home/TandD/boutique/uploads/fazhywqw1eri9rmrraee.jpg'
WHERE slug = 'clothes';

UPDATE categories
SET banner_image = 'https://res.cloudinary.com/plgkusx1/image/upload/f_auto,q_auto,c_limit,w_1200/v1792747658/home/TandD/boutique/uploads/vmwjww3fjtgz9d2lsi4j.jpg'
WHERE slug = 'shoes';

UPDATE categories
SET banner_image = 'https://res.cloudinary.com/plgkusx1/image/upload/f_auto,q_auto,c_limit,w_1200/v1792744489/home/TandD/boutique/uploads/bbhaynpi3p8crfil2hqd.jpg'
WHERE slug = 'bags';

DELETE FROM categories
WHERE slug = 'pants';
