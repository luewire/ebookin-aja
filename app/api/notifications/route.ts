import { NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';

// Fresh PrismaClient to avoid staleness issues
const { PrismaClient } = require('@prisma/client');

async function getNotifications(req: AuthenticatedRequest) {
    const userId = req.user!.id;
    const localPrisma = new PrismaClient();

    try {
        // Fetch notifications via RAW SQL
        const notifications = await localPrisma.$queryRawUnsafe(
            `SELECT * FROM "Notification" WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 50`,
            userId
        );

        return NextResponse.json(notifications);
    } catch (error: any) {
        console.error('Fetch notifications error:', error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    } finally {
        await localPrisma.$disconnect();
    }
}

async function markAsRead(req: AuthenticatedRequest) {
    const userId = req.user!.id;
    const localPrisma = new PrismaClient();

    try {
        const { notificationId, all } = await req.json();

        if (all) {
            await localPrisma.$executeRawUnsafe(
                `UPDATE "Notification" SET "isRead" = true WHERE "userId" = $1`,
                userId
            );
        } else if (notificationId) {
            await localPrisma.$executeRawUnsafe(
                `UPDATE "Notification" SET "isRead" = true WHERE "id" = $1 AND "userId" = $2`,
                notificationId, userId
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Mark as read error:', error);
        return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
    } finally {
        await localPrisma.$disconnect();
    }
}

export const GET = withAuth(getNotifications);
export const PATCH = withAuth(markAsRead);
