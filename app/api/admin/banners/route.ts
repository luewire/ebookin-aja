import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  replaceImage,
  getFileFromFormData,
  createUploadError,
} from '@/lib/file-upload';

/**
 * GET /api/admin/banners
 * List all banners
 */
async function getHandler(req: AuthenticatedRequest) {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ banners }, { status: 200 });
  } catch (error) {
    console.error('Get banners error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/banners
 * Create a new banner with image upload
 * 
 * Accepts: FormData with fields:
 * - title (required)
 * - subtitle (optional)
 * - ctaLabel (optional)
 * - ctaLink (optional)
 * - image (File, optional - max 2MB, jpg/png/webp)
 * - isActive (optional, default: true)
 * - priority (optional, default: 0)
 */
async function postHandler(req: AuthenticatedRequest) {
  try {
    const formData = await req.formData();
    
    // Extract text fields
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string | null;
    const ctaLabel = formData.get('ctaLabel') as string | null;
    const ctaLink = formData.get('ctaLink') as string | null;
    const isActive = formData.get('isActive') === 'false' ? false : true;
    const priority = parseInt(formData.get('priority') as string) || 0;

    // Validation
    if (!title) {
      return NextResponse.json(
        { error: 'title is required' },
        { status: 400 }
      );
    }

    // Handle image upload (optional)
    let imageUrl: string | null = null;
    const imageFile = getFileFromFormData(formData, 'image');

    if (imageFile) {
      try {
        const uploadResult = await uploadToCloudinary(imageFile, {
          folder: 'banners',
          maxSizeMB: 2,
          transformation: {
            width: 1920,
            height: 600,
            crop: 'fill',
            quality: 'auto',
          },
        });

        imageUrl = uploadResult.secure_url;
      } catch (uploadError: any) {
        return NextResponse.json(
          createUploadError(uploadError, 400),
          { status: 400 }
        );
      }
    }

    // Create banner in database
    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        ctaLabel,
        ctaLink,
        imageUrl,
        isActive,
        priority,
      },
    });

    // Log admin action
    await prisma.adminEvent.create({
      data: {
        type: 'audit',
        title: 'Banner Created',
        description: `New banner created: ${title}`,
        metadata: { bannerId: banner.id, adminId: req.user!.id },
      },
    });

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    console.error('Create banner error:', error);
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/banners
 * Update a banner (with optional image replacement)
 * 
 * Accepts: FormData with fields:
 * - id (required)
 * - title (optional)
 * - subtitle (optional)
 * - ctaLabel (optional)
 * - ctaLink (optional)
 * - image (File, optional - replaces existing image)
 * - isActive (optional)
 * - priority (optional)
 */
async function patchHandler(req: AuthenticatedRequest) {
  try {
    const formData = await req.formData();
    
    // Get banner ID
    const id = formData.get('id') as string;
    
    if (!id) {
      return NextResponse.json(
        { error: 'banner id is required' },
        { status: 400 }
      );
    }

    // Get existing banner
    const existingBanner = await prisma.banner.findUnique({
      where: { id },
      select: { imageUrl: true, title: true },
    });

    if (!existingBanner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updates: any = {};
    
    if (formData.has('title')) updates.title = formData.get('title') as string;
    if (formData.has('subtitle')) updates.subtitle = formData.get('subtitle') as string | null;
    if (formData.has('ctaLabel')) updates.ctaLabel = formData.get('ctaLabel') as string | null;
    if (formData.has('ctaLink')) updates.ctaLink = formData.get('ctaLink') as string | null;
    if (formData.has('isActive')) updates.isActive = formData.get('isActive') === 'true';
    if (formData.has('priority')) updates.priority = parseInt(formData.get('priority') as string);

    // Handle image replacement
    const imageFile = getFileFromFormData(formData, 'image');
    
    if (imageFile) {
      try {
        // Upload new image and delete old one
        const uploadResult = await replaceImage(
          imageFile,
          existingBanner.imageUrl,
          {
            folder: 'banners',
            maxSizeMB: 2,
            transformation: {
              width: 1920,
              height: 600,
              crop: 'fill',
              quality: 'auto',
            },
          }
        );

        updates.imageUrl = uploadResult.secure_url;
      } catch (uploadError: any) {
        return NextResponse.json(
          createUploadError(uploadError, 400),
          { status: 400 }
        );
      }
    }

    // Update banner
    const banner = await prisma.banner.update({
      where: { id },
      data: updates,
    });

    // Log admin action
    await prisma.adminEvent.create({
      data: {
        type: 'audit',
        title: 'Banner Updated',
        description: `Banner updated: ${banner.title}`,
        metadata: { bannerId: id, adminId: req.user!.id },
      },
    });

    return NextResponse.json({ banner }, { status: 200 });
  } catch (error) {
    console.error('Update banner error:', error);
    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/banners
 * Delete a banner and its image from Cloudinary
 */
async function deleteHandler(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'banner id is required' },
        { status: 400 }
      );
    }

    // Get banner with image URL
    const banner = await prisma.banner.findUnique({
      where: { id },
      select: { title: true, imageUrl: true },
    });

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    // Delete from database first
    await prisma.banner.delete({
      where: { id },
    });

    // Delete image from Cloudinary (if exists)
    if (banner.imageUrl) {
      try {
        await deleteFromCloudinary(banner.imageUrl);
      } catch (error) {
        // Log but don't fail the operation
        console.error('Failed to delete banner image from Cloudinary:', error);
      }
    }

    // Log admin action
    await prisma.adminEvent.create({
      data: {
        type: 'audit',
        title: 'Banner Deleted',
        description: `Banner deleted: ${banner.title}`,
        metadata: { bannerId: id, adminId: req.user!.id },
      },
    });

    return NextResponse.json(
      { success: true, message: 'Banner deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete banner error:', error);
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
export const PATCH = withAdmin(patchHandler);
export const DELETE = withAdmin(deleteHandler);

export const dynamic = 'force-dynamic';
