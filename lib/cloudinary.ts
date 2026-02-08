/**
 * Cloudinary Configuration
 * 
 * This file configures the Cloudinary client for file uploads.
 * Used for banner images and user profile photos.
 * 
 * @see https://cloudinary.com/documentation/node_integration
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS
});

/**
 * Validate Cloudinary configuration
 * Call this to ensure all required env vars are set
 */
export function validateCloudinaryConfig(): boolean {
  const required = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `Missing Cloudinary configuration: ${missing.join(', ')}`
    );
    return false;
  }

  return true;
}

/**
 * Extract public_id from Cloudinary URL
 * Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/filename.jpg
 * Returns: folder/filename
 * 
 * @param url - Full Cloudinary URL
 * @returns public_id or null if invalid URL
 */
export function extractPublicId(url: string): string | null {
  try {
    if (!url || !url.includes('cloudinary.com')) {
      return null;
    }

    // Match the pattern after /upload/ or /upload/v1234567890/
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting public_id from URL:', error);
    return null;
  }
}

/**
 * Get optimized Cloudinary URL with transformations
 * 
 * @param publicId - Cloudinary public_id
 * @param width - Target width
 * @param height - Target height
 * @param quality - Quality (1-100), default 'auto'
 * @returns Optimized URL
 */
export function getOptimizedUrl(
  publicId: string,
  width?: number,
  height?: number,
  quality: string | number = 'auto'
): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality,
    fetch_format: 'auto', // Auto-select best format (WebP, AVIF, etc.)
    secure: true,
  });
}

export default cloudinary;
