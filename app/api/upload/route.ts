import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          asset_folder: 'home/TandD/boutique/uploads',
          folder: 'home/TandD/boutique/uploads',
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as any);
        }
      );
      uploadStream.end(buffer);
    });

    // To save on Vercel Image Optimization and Cloudinary tokens:
    // We return a URL that already includes optimization parameters.
    // 'f_auto' = best format for browser (WebP/AVIF)
    // 'q_auto' = best quality/size balance
    const optimizedUrl = uploadResponse.secure_url
      .replace('/upload/', '/upload/f_auto,q_auto,c_limit,w_1200/');

    return NextResponse.json({ 
      url: optimizedUrl, 
      public_id: uploadResponse.public_id 
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
