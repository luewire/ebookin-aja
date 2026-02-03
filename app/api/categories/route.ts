import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/categories
 * Get all unique ebook categories
 */
export async function GET(req: NextRequest) {
  try {
    // Get distinct categories from active ebooks
    const categories = await prisma.ebook.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return NextResponse.json(
      {
        categories: categories.map((c: { category: string }) => c.category),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
