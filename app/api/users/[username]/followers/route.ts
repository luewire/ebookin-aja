import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const resolvedParams = await params;
        const username = resolvedParams.username;

        if (!username) {
            return NextResponse.json({ error: 'Username required' }, { status: 400 });
        }

        // Find user first
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: { equals: username, mode: 'insensitive' } },
                    { id: username },
                ],
            },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { PrismaClient } = require('@prisma/client');
        const localPrisma = new PrismaClient();

        try {
            // Fetch users who are following this user
            const followers: any[] = await localPrisma.$queryRawUnsafe(
                `SELECT u.id, u.name, u.username, u.bio, u."photoUrl", u."favoriteGenre"
                 FROM "User" u
                 JOIN "Follow" f ON u.id = f."followerId"
                 WHERE f."followingId" = $1
                 ORDER BY f."createdAt" DESC`,
                user.id
            );

            // Get current user ID to check follow status
            const authHeader = req.headers.get('Authorization');
            let currentUserId: string | null = null;
            if (authHeader?.startsWith('Bearer ')) {
                const { verifyIdToken } = require('@/lib/firebase-admin');
                const token = authHeader.substring(7);
                const decodedToken = await verifyIdToken(token);
                if (decodedToken) {
                    const loggedInUser = await prisma.user.findUnique({
                        where: { firebaseUid: decodedToken.uid },
                        select: { id: true }
                    });
                    currentUserId = loggedInUser?.id || null;
                }
            }

            // Enrich with social context for the current user
            const enrichedFollowers = await Promise.all(followers.map(async (follower) => {
                let isFollowing = false;
                let isMutual = false;

                if (currentUserId) {
                    // Check if current user follows this follower
                    const followRes: any[] = await localPrisma.$queryRawUnsafe(
                        `SELECT * FROM "Follow" WHERE "followerId" = $1 AND "followingId" = $2`,
                        currentUserId, follower.id
                    );
                    isFollowing = followRes.length > 0;

                    if (isFollowing) {
                        // Check if they also follow current user
                        const mutualRes: any[] = await localPrisma.$queryRawUnsafe(
                            `SELECT * FROM "Follow" WHERE "followerId" = $1 AND "followingId" = $2`,
                            follower.id, currentUserId
                        );
                        isMutual = mutualRes.length > 0;
                    }
                }

                return {
                    ...follower,
                    isFollowing,
                    isMutual
                };
            }));

            return NextResponse.json(enrichedFollowers);
        } finally {
            await localPrisma.$disconnect();
        }
    } catch (error: any) {
        console.error('Followers API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
