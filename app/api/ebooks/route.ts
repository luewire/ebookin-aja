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
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          }
        }
      }),
      prisma.ebook.count({ where }),
    ]);

    const ebooksWithRating = ebooks.map((ebook: any) => {
      const totalRatings = ebook.reviews?.length || 0;
      const avgRating = totalRatings > 0 
        ? ebook.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / totalRatings 
        : 0;

      return {
        id: ebook.id,
        title: ebook.title,
        author: ebook.author,
        description: ebook.description,
        coverUrl: ebook.coverUrl,
        categoryId: ebook.categoryId,
        isPremium: ebook.isPremium,
        category: ebook.category.name,
        avgRating: parseFloat(avgRating.toFixed(1)),
        ratingCount: totalRatings
      };
    });

    return NextResponse.json(
      {
        ebooks: ebooksWithRating,
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

export const dynamic = 'force-dynamic';
