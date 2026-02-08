import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/ebooks
 * Public endpoint to list active ebooks
 * Free ebooks visible to all, premium requires authentication (check client-side)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const premiumOnly = searchParams.get('premiumOnly') === 'true';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { isActive: true };
    
    if (category) {
      // Find category by name
      const categoryRecord = await prisma.category.findFirst({
        where: { name: category }
      });
      if (categoryRecord) {
        where.categoryId = categoryRecord.id;
      }
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (premiumOnly) {
      where.isPremium = true;
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
          categoryId: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          isPremium: true,
          // Don't expose pdfUrl publicly - handle in individual ebook endpoint
        },
      }),
      prisma.ebook.count({ where }),
    ]);

    return NextResponse.json(
      {
        ebooks: ebooks.map((ebook: any) => ({
          ...ebook,
          category: ebook.category.name // Return category name for backward compatibility
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

export const dynamic = 'force-dynamic';
