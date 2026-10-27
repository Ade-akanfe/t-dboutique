const CLOUDINARY_UPLOAD_URL = 'https://res.cloudinary.com/plgkusx1/image/upload/';
const OPTIMIZED_TRANSFORM = 'f_auto,q_auto,c_limit,w_1200/';
const CATEGORY_IMAGE_PATHS = {
  bags: `${CLOUDINARY_UPLOAD_URL}v1793089392/`,
  shoes: `${CLOUDINARY_UPLOAD_URL}v1793089643/`,
};

function categoryImageUrl(source: string): string | undefined {
  const image = /(?:^|\/)((bags|shoes)_image_[^/?#]+)$/i.exec(source);
  if (!image) return undefined;

  const filename = image[1].replace(/\.jpeg$/i, '.jpg');
  const category = image[2].toLowerCase();
  if (category !== 'bags' && category !== 'shoes') return undefined;
  const path = CATEGORY_IMAGE_PATHS[category];
  return `${path}${filename}`;
}

export function cloudinaryImage(publicId: string): string {
  const categoryUrl = categoryImageUrl(publicId);
  if (categoryUrl) return categoryUrl;

  const normalizedPublicId = publicId.replace(/^\//, '');
  return `${CLOUDINARY_UPLOAD_URL}${OPTIMIZED_TRANSFORM}${normalizedPublicId}`;
}

export function toCloudinaryImageUrl(source: string): string {
  const categoryUrl = categoryImageUrl(source);
  if (categoryUrl) return categoryUrl;

  if (source.startsWith(CLOUDINARY_UPLOAD_URL)) {
    if (source.startsWith(`${CLOUDINARY_UPLOAD_URL}${OPTIMIZED_TRANSFORM}`)) return source;
    if (source.startsWith(`${CLOUDINARY_UPLOAD_URL}f_auto,q_auto/`)) {
      return source.replace(`${CLOUDINARY_UPLOAD_URL}f_auto,q_auto/`, `${CLOUDINARY_UPLOAD_URL}${OPTIMIZED_TRANSFORM}`);
    }
    return source.replace(CLOUDINARY_UPLOAD_URL, `${CLOUDINARY_UPLOAD_URL}${OPTIMIZED_TRANSFORM}`);
  }

  const categoryImage = /^\/(bags|shoes)\/(.+)$/.exec(source);
  if (categoryImage) {
    return cloudinaryImage(categoryImage[2]);
  }

  const assetPrefix = '/assets/images/';
  if (!source.startsWith(assetPrefix)) return source;

  const [folder, ...pathParts] = source.slice(assetPrefix.length).split('/');
  const filename = pathParts.at(-1);
  if (!filename) return source;

  let publicId = filename.replace(/\.(?:jpe?g|png|webp)$/i, '');
  if (folder === 'batch4_images' && !publicId.endsWith('_batch_4')) publicId += '_batch_4';
  if (folder === 'batch5_images' && !publicId.endsWith('_batch_5')) publicId += '_batch_5';

  return cloudinaryImage(`${publicId}.jpg`);
}