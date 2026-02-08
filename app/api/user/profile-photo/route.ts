/**
 * User Profile Photo Upload API
 * 
 * Endpoints:
 * - POST: Upload new profile photo (replaces existing)
 * - DELETE: Remove profile photo
 * 
 * Security: Requires authentication
 * File: Max 2MB, jpg/png/webp
 * Storage: Cloudinary (folder: profiles/)
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';
import {
  replaceImage,
  deleteFromCloudinary,
  getFileFromFormData,
  createUploadError,
} from '@/lib/file-upload';

/**
 * POST /api/user/profile-photo
 * Upload or replace user's profile photo
 * 
 * Accepts: FormData with:
 * - photo (File, required - max 2MB, jpg/png/webp)
 * 
 * Returns: { user: { id, name, email, photoUrl } }
 */
async function postHandler(req: AuthenticatedRequest) {
  try {
    const userId = req.user!.id;

    // Get FormData
    const formData = await req.formData();
    const photoFile = getFileFromFormData(formData, 'photo');

    if (!photoFile) {
      return NextResponse.json(
        { error: 'Photo file is required' },
        { status: 400 }
      );
    }

    // Get current user to check for existing photo
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { photoUrl: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    try {
      // Upload new photo and delete old one (if exists)
      const uploadResult = await replaceImage(
        photoFile,
        currentUser.photoUrl,
        {
          folder: 'profiles',
          maxSizeMB: 2,
          transformation: {
            width: 400,
            height: 400,
            crop: 'fill',
            quality: 'auto',
          },
        }
      );

      // Update user's photoUrl in database
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { photoUrl: uploadResult.secure_url },
        select: {
          id: true,
          name: true,
          email: true,
          photoUrl: true,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Profile photo updated',
          user: updatedUser,
        },
        { status: 200 }
      );
    } catch (uploadError: any) {
      return NextResponse.json(
        createUploadError(uploadError, 400),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Profile photo upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile photo' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/profile-photo
 * Remove user's profile photo
 * 
 * Returns: { success: true, message: 'Profile photo removed' }
 */
async function deleteHandler(req: AuthenticatedRequest) {
  try {
    const userId = req.user!.id;

    // Get current user's photo URL
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { photoUrl: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.photoUrl) {
      return NextResponse.json(
        { error: 'No profile photo to delete' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(user.photoUrl);
    } catch (error) {
      // Log but don't fail the operation
      console.error('Failed to delete photo from Cloudinary:', error);
    }

    // Remove photoUrl from database
    await prisma.user.update({
      where: { id: userId },
      data: { photoUrl: null },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Profile photo removed',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile photo delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete profile photo' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(postHandler);
export const DELETE = withAuth(deleteHandler);

export const dynamic = 'force-dynamic';
