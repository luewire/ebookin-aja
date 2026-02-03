import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/stats
 * Get dashboard statistics for admin
 * 
 * Returns:
 * - Total registered users
 * - Active subscribers
 * - Total ebooks
 * - Active reading sessions (last 30 min)
 * - Recent events
 * - Revenue stats
 */
async function handler(req: AuthenticatedRequest) {
  try {
    // Execute all queries in parallel for performance
    const [
      totalUsers,
      activeSubscribers,
      totalEbooks,
      activeEbooks,
      recentEvents,
      revenueStats,
      activeReadingSessions,
    ] = await Promise.all([
      // Total registered users
      prisma.user.count(),

      // Active subscribers
      prisma.subscription.count({
        where: {
          status: 'ACTIVE',
          endDate: {
            gt: new Date(),
          },
        },
      }),

      // Total ebooks
      prisma.ebook.count(),

      // Active ebooks
      prisma.ebook.count({
        where: { isActive: true },
      }),

      // Recent events (last 20)
      prisma.adminEvent.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          title: true,
          description: true,
          metadata: true,
          createdAt: true,
        },
      }),

      // Revenue statistics
      prisma.transaction.aggregate({
        where: {
          transactionStatus: 'SETTLEMENT',
        },
        _sum: {
          grossAmount: true,
        },
        _count: {
          id: true,
        },
      }),

      // Active reading sessions (last 30 minutes)
      prisma.readingLog.count({
        where: {
          lastReadAt: {
            gte: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          },
        },
      }),
    ]);

    // Get total books read (unique user-ebook combinations)
    const totalBooksRead = await prisma.readingLog.count();

    // Get subscription breakdown
    const subscriptionBreakdown = await prisma.subscription.groupBy({
      by: ['planName'],
      where: {
        status: 'ACTIVE',
      },
      _count: {
        id: true,
      },
    });

    // Get user growth (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsersLast30Days = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json(
      {
        stats: {
          users: {
            total: totalUsers,
            newLast30Days: newUsersLast30Days,
            activeSubscribers,
          },
          ebooks: {
            total: totalEbooks,
            active: activeEbooks,
            totalReads: totalBooksRead,
          },
          readingSessions: {
            active: activeReadingSessions,
          },
          revenue: {
            total: revenueStats._sum.grossAmount || 0,
            transactionCount: revenueStats._count.id,
          },
          subscriptions: {
            breakdown: subscriptionBreakdown.map((item: { planName: string; _count: { id: number } }) => ({
              plan: item.planName,
              count: item._count.id,
            })),
          },
        },
        recentEvents,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(handler);

// Disable caching for real-time stats
export const dynamic = 'force-dynamic';
