import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

async function handler(req: AuthenticatedRequest) {

    try {
        const { followingId } = await req.json();
        const followerId = req.user!.id;


        // Use a fresh PrismaClient to avoid staleness issues in dev environment
        const { PrismaClient } = require('@prisma/client');
        const localPrisma = new PrismaClient();

        try {
            if (!followingId) {
                return NextResponse.json({ error: 'Following ID required' }, { status: 400 });
            }

            if (followerId === followingId) {
                return NextResponse.json({ error: 'You cannot follow yourself' }, { status: 400 });
            }

            // NEW ROBUST RAW SQL CORE (Bypasses stale Prisma client)

            // 1. Check if already following
            const existingFollows: any[] = await localPrisma.$queryRawUnsafe(
                `SELECT * FROM "Follow" WHERE "followerId" = $1 AND "followingId" = $2`,
                followerId, followingId
            );

            if (existingFollows.length > 0) {
                // Action: Unfollow
                await localPrisma.$executeRawUnsafe(
                    `DELETE FROM "Follow" WHERE "followerId" = $1 AND "followingId" = $2`,
                    followerId, followingId
                );
                return NextResponse.json({ status: 'unfollowed' });
            } else {
                // Action: Follow
                await localPrisma.$executeRawUnsafe(
                    `INSERT INTO "Follow" ("followerId", "followingId", "createdAt") VALUES ($1, $2, NOW())`,
                    followerId, followingId
                );

                // Fetch follower name for notification
                const followerData: any[] = await localPrisma.$queryRawUnsafe(
                    `SELECT name, username FROM "User" WHERE id = $1`,
                    followerId
                );
                const followerName = followerData[0]?.name || followerData[0]?.username || 'Someone';

                // Create notification for the followed user
                await localPrisma.$executeRawUnsafe(
                    `INSERT INTO "Notification" ("id", "userId", "type", "title", "message", "isRead", "createdAt") 
                     VALUES ($1, $2, 'FOLLOW', $3, $4, false, NOW())`,
                    `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    followingId,
                    'New Follower',
                    `${followerName} started following you`
                );

                // Check for mutual follow
                const mutualFollows: any[] = await localPrisma.$queryRawUnsafe(
                    `SELECT * FROM "Follow" WHERE "followerId" = $1 AND "followingId" = $2`,
                    followingId, followerId
                );

                const isMutual = mutualFollows.length > 0;

                if (isMutual) {
                    await localPrisma.$executeRawUnsafe(
                        `INSERT INTO "Notification" ("id", "userId", "type", "title", "message", "isRead", "createdAt") 
                         VALUES ($1, $2, 'MUTUAL_FOLLOW', $3, $4, false, NOW())`,
                        `notif_${Date.now()}_m_${Math.random().toString(36).substr(2, 9)}`,
                        followingId,
                        'New Friend',
                        `You and ${followerName} are now friends!`
                    );
                }

                return NextResponse.json({
                    status: isMutual ? 'mutual' : 'followed'
                });
            }
        } finally {
            await localPrisma.$disconnect();
        }
    } catch (error: any) {
        console.error('Follow error:', error);
        return NextResponse.json({ error: 'Failed to toggle follow', details: error.message }, { status: 500 });
    }
}

export const POST = withAuth(handler);
