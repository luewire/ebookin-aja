import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';
import cloudinary from 'cloudinary';
import { adminStorage } from '@/lib/firebase-admin';
import { supabaseAdmin } from '@/lib/supabase';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      // Find category by name
      const categoryRecord = await prisma.category.findFirst({
        where: { name: category }
      });
      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      }
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
          publicId: true, // Include publicId
          categoryId: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
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
          category: ebook.category.name, // Return category name for backward compatibility
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
  } catch (error: unknown) {
    console.error('Get ebooks error:', error);
    const code = error && typeof error === 'object' && 'code' in error ? (error as { code?: string }).code : '';
    const status = String(code).startsWith('P1') ? 503 : 500; // P1xxx = connection/schema
    return NextResponse.json(
      { error: status === 503 ? 'Service temporarily unavailable' : 'Failed to fetch ebooks' },
      { status }
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
      publicId,
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

    // Find category by name
    const categoryRecord = await prisma.category.findFirst({
      where: { name: category }
    });

    if (!categoryRecord) {
      return NextResponse.json(
        { error: `Category "${category}" not found` },
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
        publicId,
        categoryId: categoryRecord.id,
        isPremium: isPremium ?? true,
        isActive: isActive ?? true,
        priority: priority ?? 0,
      },
      select: {
        id: true,
        title: true,
        author: true,
        description: true,
        coverUrl: true,
        pdfUrl: true,
        publicId: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        isPremium: true,
        isActive: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
      }
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

    return NextResponse.json({ 
      ebook: {
        ...ebook,
        category: ebook.category.name // Return category name
      }
    }, { status: 201 });
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
    const { id, category, ...otherUpdates } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ebook id is required' },
        { status: 400 }
      );
    }

    const updates: any = { ...otherUpdates };

    // If category is provided, look up its ID
    if (category) {
      const categoryRecord = await prisma.category.findFirst({
        where: { name: category }
      });

      if (!categoryRecord) {
        return NextResponse.json(
          { error: `Category "${category}" not found` },
          { status: 400 }
        );
      }

      updates.categoryId = categoryRecord.id;
    }

    const ebook = await prisma.ebook.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        title: true,
        author: true,
        description: true,
        coverUrl: true,
        pdfUrl: true,
        publicId: true,
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        isPremium: true,
        isActive: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
      }
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

    return NextResponse.json({ 
      ebook: {
        ...ebook,
        category: ebook.category.name // Return category name
      }
    }, { status: 200 });
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
      select: { title: true, publicId: true, pdfUrl: true },
    });

    if (!ebook) {
      return NextResponse.json(
        { error: 'Ebook not found' },
        { status: 404 }
      );
    }

    // Delete from storage (Supabase, Firebase, or Cloudinary)
    if (ebook.publicId) {
      try {
        if (ebook.pdfUrl?.includes('supabase.co')) {
          // It's in Supabase Storage
          if (!supabaseAdmin) {
            console.warn('Supabase not configured, skipping storage deletion');
          } else {
            const { error } = await supabaseAdmin.storage
              .from('ebooks')
              .remove([ebook.publicId]);
            if (error) throw error;
            console.log(`Deleted file from Supabase: ${ebook.publicId}`);
          }
        } else if (ebook.publicId.startsWith('ebooks/')) {
          // It's in Firebase Storage
          const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.replace(/^gs:\/\//, '');
          const bucket = adminStorage.bucket(bucketName);
          const file = bucket.file(ebook.publicId);
          await file.delete();
          console.log(`Deleted file from Firebase: ${ebook.publicId}`);
        } else {
          // Assume it's in Cloudinary
          await cloudinary.v2.uploader.destroy(ebook.publicId, { resource_type: 'raw' });
          console.log(`Deleted file from Cloudinary: ${ebook.publicId}`);
        }
      } catch (storageError) {
        console.error('Failed to delete file from storage:', storageError);
        // Continue with database deletion even if storage deletion fails
      }
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
