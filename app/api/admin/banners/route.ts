import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

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
 * Create a new banner
 */
async function postHandler(req: AuthenticatedRequest) {
  try {
    const {
      title,
      subtitle,
      ctaLabel,
      ctaLink,
      imageUrl,
      isActive,
      priority,
    } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: 'title is required' },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle,
        ctaLabel,
        ctaLink,
        imageUrl,
        isActive: isActive ?? true,
        priority: priority ?? 0,
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
 * Update a banner
 */
async function patchHandler(req: AuthenticatedRequest) {
  try {
    const { id, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'banner id is required' },
        { status: 400 }
      );
    }

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
 * Delete a banner
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

    const banner = await prisma.banner.findUnique({
      where: { id },
      select: { title: true },
    });

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    await prisma.banner.delete({
      where: { id },
    });

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
