import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/banners
 * Public endpoint to get active banners
 */
export async function GET(req: NextRequest) {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      take: 10,
      select: {
        id: true,
        title: true,
        subtitle: true,
        ctaLabel: true,
        ctaLink: true,
        imageUrl: true,
        priority: true,
      },
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

export const dynamic = 'force-dynamic';
