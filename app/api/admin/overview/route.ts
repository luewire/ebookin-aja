import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminAuth } from '@/lib/firebase-admin';
import { startOfDay, subDays, subMonths } from 'date-fns';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedToken.uid },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date();
    const today = startOfDay(now);
    const lastWeek = subDays(now, 7);
    const lastMonth = subMonths(now, 1);

    // 1. Live Insights Overview
    const [
      totalUsers,
      usersLastWeek,
      usersLastMonth,
      totalBooksRead,
      booksReadLastWeek,
      activeSessionsToday
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { lt: lastWeek } } }),
      prisma.user.count({ where: { createdAt: { lt: lastMonth } } }),
      prisma.readlist.count({ where: { status: 'FINISHED' } }),
      prisma.readlist.count({ where: { status: 'FINISHED', updatedAt: { lt: lastWeek } } }),
      prisma.readingLog.count({ where: { lastReadAt: { gte: today } } })
    ]);

    // 2. Recent Platform Events
    const recentEvents = await prisma.adminEvent.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    // 3. Platform Health (Mock for now but via API)
    const health = {
      status: 'ok',
      latency: Math.floor(Math.random() * 50) + 10 + 'ms',
      uptime: '99.9%'
    };

    return NextResponse.json({
      overview: {
        totalUsers: {
          current: totalUsers,
          vsLastMonth: usersLastMonth > 0 ? ((totalUsers - usersLastMonth) / usersLastMonth * 100).toFixed(1) : 0
        },
        totalBooksRead: {
          current: totalBooksRead,
          vsLastWeek: booksReadLastWeek > 0 ? ((totalBooksRead - booksReadLastWeek) / booksReadLastWeek * 100).toFixed(1) : 0
        },
        activeSessions: {
          current: activeSessionsToday
        }
      },
      recentEvents,
      health
    });
  } catch (error) {
    console.error('Admin Overview Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
