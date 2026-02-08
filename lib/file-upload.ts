/**
 * File Upload Utilities
 * 
 * Reusable functions for handling file uploads to Cloudinary.
 * Includes validation, upload, delete, and security checks.
 * 
 * Usage:
 * - Banner images: max 2MB, jpg/png/webp
 * - Profile photos: max 2MB, jpg/png/webp
 */

import cloudinary, { extractPublicId, validateCloudinaryConfig } from './cloudinary';
import { UploadApiResponse } from 'cloudinary';

/**
 * Allowed image MIME types
 */
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

/**
 * Allowed file extensions
 */
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Upload options interface
 */
export interface UploadOptions {
  folder: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
  transformation?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
  };
}

/**
 * Validate image file
 * 
 * @param file - File or Blob to validate
 * @param maxSizeMB - Maximum file size in MB (default: 2)
 * @param allowedTypes - Allowed MIME types (default: jpg, png, webp)
 * @returns Validation result with error message if invalid
 */
export function validateImage(
  file: File | Blob,
  maxSizeMB: number = 2,
  allowedTypes: string[] = ALLOWED_IMAGE_TYPES
): ValidationResult {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`,
    };
  }

  // Check MIME type
  if (file.type && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Additional check for file extension if File object
  if (file instanceof File) {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return {
        valid: false,
        error: `Invalid file extension. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Convert File/Blob to base64 data URI for Cloudinary upload
 * Server-side version using Buffer (works in Node.js)
 * 
 * @param file - File or Blob to convert
 * @returns Promise resolving to base64 data URI
 */
export async function fileToDataUri(file: File | Blob): Promise<string> {
  try {
    // Get file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Convert to Buffer (Node.js)
    const buffer = Buffer.from(arrayBuffer);
    
    // Get MIME type
    const mimeType = file.type || 'image/jpeg';
    
    // Convert to base64 data URI
    const base64 = buffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    throw new Error('Failed to convert file to data URI: ' + (error as Error).message);
  }
}

/**
 * Upload file to Cloudinary
 * 
 * @param file - File or Blob to upload
 * @param options - Upload options (folder, maxSize, etc.)
 * @returns Promise resolving to Cloudinary upload response
 * @throws Error if validation fails or upload fails
 */
export async function uploadToCloudinary(
  file: File | Blob,
  options: UploadOptions
): Promise<UploadApiResponse> {
  // Validate Cloudinary config
  if (!validateCloudinaryConfig()) {
    throw new Error('Cloudinary is not properly configured');
  }

  // Validate file
  const validation = validateImage(file, options.maxSizeMB, options.allowedTypes);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  try {
    // Convert file to data URI
    const dataUri = await fileToDataUri(file);

    // Prepare upload options
    const uploadOptions: any = {
      folder: options.folder,
      resource_type: 'image',
      // Auto-convert to WebP for better compression if possible
      format: 'webp',
      // Apply transformations if provided
      transformation: options.transformation || {
        quality: 'auto',
        fetch_format: 'auto',
      },
      // Generate unique filename
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, uploadOptions);

    return result;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(
      `Failed to upload file to Cloudinary: ${error.message || 'Unknown error'}`
    );
  }
}

/**
 * Delete file from Cloudinary
 * 
 * @param imageUrl - Full Cloudinary URL or public_id
 * @returns Promise resolving to deletion result
 * @throws Error if deletion fails
 */
export async function deleteFromCloudinary(
  imageUrl: string
): Promise<{ success: boolean; message: string }> {
  // Validate Cloudinary config
  if (!validateCloudinaryConfig()) {
    throw new Error('Cloudinary is not properly configured');
  }

  try {
    // Extract public_id from URL
    const publicId = extractPublicId(imageUrl);
    
    if (!publicId) {
      console.warn('Could not extract public_id from URL:', imageUrl);
      return {
        success: false,
        message: 'Invalid Cloudinary URL format',
      };
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      return {
        success: true,
        message: 'File deleted successfully',
      };
    } else if (result.result === 'not found') {
      // File doesn't exist, consider it successful (already deleted)
      return {
        success: true,
        message: 'File already deleted or not found',
      };
    } else {
      return {
        success: false,
        message: `Deletion failed: ${result.result}`,
      };
    }
  } catch (error: any) {
    console.error('Cloudinary delete error:', error);
    throw new Error(
      `Failed to delete file from Cloudinary: ${error.message || 'Unknown error'}`
    );
  }
}

/**
 * Replace existing image with new one
 * Uploads new image and deletes old one (if exists)
 * 
 * @param file - New file to upload
 * @param oldImageUrl - URL of old image to delete (optional)
 * @param options - Upload options
 * @returns Promise resolving to new Cloudinary upload response
 */
export async function replaceImage(
  file: File | Blob,
  oldImageUrl: string | null | undefined,
  options: UploadOptions
): Promise<UploadApiResponse> {
  // Upload new image first
  const uploadResult = await uploadToCloudinary(file, options);

  // If upload successful and old image exists, delete it
  if (oldImageUrl) {
    try {
      await deleteFromCloudinary(oldImageUrl);
    } catch (error) {
      // Log error but don't fail the operation
      console.error('Failed to delete old image:', error);
    }
  }

  return uploadResult;
}

/**
 * Get file from FormData
 * 
 * @param formData - FormData object
 * @param fieldName - Field name containing the file
 * @returns File or null if not found
 */
export function getFileFromFormData(
  formData: FormData,
  fieldName: string = 'file'
): File | null {
  const file = formData.get(fieldName);
  
  if (!file || typeof file === 'string') {
    return null;
  }
  
  return file as File;
}

/**
 * Create error response for file upload errors
 * 
 * @param error - Error object or message
 * @param statusCode - HTTP status code
 * @returns Error details object
 */
export function createUploadError(
  error: any,
  statusCode: number = 500
): { error: string; details?: string; statusCode: number } {
  const message = error instanceof Error ? error.message : String(error);
  
  return {
    error: 'File upload failed',
    details: message,
    statusCode,
  };
}
