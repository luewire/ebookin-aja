import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/ebooks
 * List all ebooks for admin management
 */
async function getHandler(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) {
      where.category = category;
    }

    const [ebooks, total] = await Promise.all([
      prisma.ebook.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          title: true,
          author: true,
          description: true,
          coverUrl: true,
          pdfUrl: true,
          category: true,
          isPremium: true,
          isActive: true,
          priority: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { readingLogs: true },
          },
        },
      }),
      prisma.ebook.count({ where }),
    ]);

    return NextResponse.json(
      {
        ebooks: ebooks.map((ebook: any) => ({
          ...ebook,
          readCount: ebook._count.readingLogs,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get ebooks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ebooks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/ebooks
 * Create a new ebook
 */
async function postHandler(req: AuthenticatedRequest) {
  try {
    const {
      title,
      author,
      description,
      coverUrl,
      pdfUrl,
      category,
      isPremium,
      isActive,
      priority,
    } = await req.json();

    if (!title || !author || !category) {
      return NextResponse.json(
        { error: 'title, author, and category are required' },
        { status: 400 }
      );
    }

    const ebook = await prisma.ebook.create({
      data: {
        title,
        author,
        description,
        coverUrl,
        pdfUrl,
        category,
        isPremium: isPremium ?? true,
        isActive: isActive ?? true,
        priority: priority ?? 0,
      },
    });

    // Log admin action
    await prisma.adminEvent.create({
      data: {
        type: 'audit',
        title: 'Ebook Created',
        description: `New ebook created: ${title}`,
        metadata: { ebookId: ebook.id, adminId: req.user!.id },
      },
    });

    return NextResponse.json({ ebook }, { status: 201 });
  } catch (error) {
    console.error('Create ebook error:', error);
    return NextResponse.json(
      { error: 'Failed to create ebook' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/ebooks
 * Update an ebook
 */
async function patchHandler(req: AuthenticatedRequest) {
  try {
    const { id, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ebook id is required' },
        { status: 400 }
      );
    }

    const ebook = await prisma.ebook.update({
      where: { id },
      data: updates,
    });

    // Log admin action
    await prisma.adminEvent.create({
      data: {
        type: 'audit',
        title: 'Ebook Updated',
        description: `Ebook updated: ${ebook.title}`,
        metadata: { ebookId: id, adminId: req.user!.id },
      },
    });

    return NextResponse.json({ ebook }, { status: 200 });
  } catch (error) {
    console.error('Update ebook error:', error);
    return NextResponse.json(
      { error: 'Failed to update ebook' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/ebooks
 * Delete an ebook
 */
async function deleteHandler(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ebook id is required' },
        { status: 400 }
      );
    }

    const ebook = await prisma.ebook.findUnique({
      where: { id },
      select: { title: true },
    });

    if (!ebook) {
      return NextResponse.json(
        { error: 'Ebook not found' },
        { status: 404 }
      );
    }

    await prisma.ebook.delete({
      where: { id },
    });

    // Log admin action
    await prisma.adminEvent.create({
      data: {
        type: 'audit',
        title: 'Ebook Deleted',
        description: `Ebook deleted: ${ebook.title}`,
        metadata: { ebookId: id, adminId: req.user!.id },
      },
    });

    return NextResponse.json(
      { success: true, message: 'Ebook deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete ebook error:', error);
    return NextResponse.json(
      { error: 'Failed to delete ebook' },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
export const PATCH = withAdmin(patchHandler);
export const DELETE = withAdmin(deleteHandler);

export const dynamic = 'force-dynamic';
