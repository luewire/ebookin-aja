import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';
import { hasActiveSubscription } from '@/lib/subscription';

/**
 * POST /api/reading-sessions
 * Start or update a reading session
 * Tracks user engagement with ebooks
 */
async function postHandler(req: AuthenticatedRequest) {
  try {
    const { ebookId } = await req.json();
    const userId = req.user!.id;

    if (!ebookId) {
      return NextResponse.json(
        { error: 'ebookId is required' },
        { status: 400 }
      );
    }

    // Check if ebook exists and is active
    const ebook = await prisma.ebook.findUnique({
      where: { id: ebookId, isActive: true },
      select: { isPremium: true },
    });

    if (!ebook) {
      return NextResponse.json(
        { error: 'Ebook not found' },
        { status: 404 }
      );
    }

    // Check subscription for premium ebooks
    if (ebook.isPremium) {
      const hasAccess = await hasActiveSubscription(userId);
      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Premium subscription required' },
          { status: 403 }
        );
      }
    }

    // Create or update reading log
    const readingLog = await prisma.readingLog.upsert({
      where: {
        userId_ebookId: {
          userId,
          ebookId,
        },
      },
      create: {
        userId,
        ebookId,
        startedAt: new Date(),
        lastReadAt: new Date(),
      },
      update: {
        lastReadAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        readingLog: {
          id: readingLog.id,
          startedAt: readingLog.startedAt,
          lastReadAt: readingLog.lastReadAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reading session error:', error);
    return NextResponse.json(
      { error: 'Failed to track reading session' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/reading-sessions
 * Get user's reading history
 */
async function getHandler(req: AuthenticatedRequest) {
  try {
    const userId = req.user!.id;

    const readingLogs = await prisma.readingLog.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        ebookId: true,
        startedAt: true,
        lastReadAt: true,
        ebook: {
          select: {
            id: true,
            title: true,
            author: true,
            coverUrl: true,
            categoryId: true,
            category: {
              select: {
                name: true
              }
            },
          },
        },
      },
      orderBy: { lastReadAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(
      {
        readingLogs: readingLogs.map(log => ({
          id: log.id,
          startedAt: log.startedAt,
          lastReadAt: log.lastReadAt,
          ebook: {
            ...log.ebook,
            category: log.ebook.category.name
          },
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get reading sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reading history' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(postHandler);
export const GET = withAuth(getHandler);

export const dynamic = 'force-dynamic';
