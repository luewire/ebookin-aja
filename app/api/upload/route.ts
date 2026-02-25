import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * POST /api/upload
 * Upload a file
 * Images and EPUBs both go to Cloudinary
 */
async function handler(req: AuthenticatedRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'epub' or default (image)

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Handle EPUB files - Upload to Supabase Storage
    if (type === 'epub') {
      // Validate file type
      if (!file.name.endsWith('.epub')) {
        return NextResponse.json(
          { error: 'Invalid file type. Only EPUB files are allowed.' },
          { status: 400 }
        );
      }

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'File size exceeds 50MB limit' },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary as raw file
      try {
        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.v2.uploader.upload_stream(
            {
              resource_type: 'raw',
              folder: 'ebook-files',
              public_id: `${Date.now()}-${file.name.replace(/\\s+/g, '_')}`
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          ).end(buffer);
        });

        return NextResponse.json({
          url: result.secure_url,
          publicId: result.public_id
        }, { status: 200 });
      } catch (error: any) {
        console.error('Cloudinary upload error:', error);
        return NextResponse.json(
          { error: `Failed to upload to Cloudinary: ${error.message || 'Unknown error'}` },
          { status: 500 }
        );
      }
    }

    // Handle image files (default) - Upload to Cloudinary
    // Validate file type
    const allowedTypes = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only WebP, JPEG, JPG, and PNG are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 2MB limit' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine folder
    const folderName = type === 'payment' ? 'payment-proofs' : (type === 'avatar' ? 'avatars' : 'ebook-covers');

    // Upload to Cloudinary
    try {
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: folderName,
            public_id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
            transformation: [
              { width: 800, height: 1200, crop: 'limit' },
              { quality: 'auto:good' }
            ]
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });

      return NextResponse.json({
        url: result.secure_url,
        publicId: result.public_id
      }, { status: 200 });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload to Cloudinary' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);

export const dynamic = 'force-dynamic';
