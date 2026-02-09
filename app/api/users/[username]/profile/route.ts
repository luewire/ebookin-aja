import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyIdToken } from '@/lib/firebase-admin';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const resolvedParams = await params;
        const rawUsername = resolvedParams?.username;

        if (!rawUsername) {
            return NextResponse.json({ error: 'Username required' }, { status: 400 });
        }
        const username = rawUsername.trim();

        // Get current user if authenticated (optional for public profile)
        const authHeader = req.headers.get('Authorization');
        let currentUserId: string | null = null;
        if (authHeader?.startsWith('Bearer ')) {
            try {
                const token = authHeader.substring(7);
                const decodedToken = await verifyIdToken(token);
                if (decodedToken) {
                    const loggedInUser = await prisma.user.findUnique({
                        where: { firebaseUid: decodedToken.uid },
                        select: { id: true }
                    });
                    currentUserId = loggedInUser?.id || null;
                }
            } catch (e: any) {
                // Silently ignore auth errors for public profile
            }
        }

        const targetUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: { equals: username, mode: 'insensitive' } },
                    { id: username },
                ],
            },
            include: {
                readlist: {
                    include: {
                        ebook: {
                            select: {
                                id: true,
                                title: true,
                                author: true,
                                coverUrl: true,
                            },
                        },
                    },
                },
                subscription: true,
            },
        });

        if (!targetUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Robust check for social stats using a fresh client to handle schema sync issues
        let followerCount = 0;
        let followingCount = 0;
        let isFollowing = false;
        let isFollower = false;

        const { PrismaClient } = require('@prisma/client');
        const localPrisma = new PrismaClient();

        // Robust check for social stats using RAW SQL to handle stale client issues
        try {
            // @ts-ignore
            const followerRes: any[] = await localPrisma.$queryRawUnsafe(
                `SELECT COUNT(*)::int as count FROM "Follow" WHERE "followingId" = $1`,
                targetUser.id
            );
            followerCount = followerRes[0]?.count || 0;

            // @ts-ignore
            const followingRes: any[] = await localPrisma.$queryRawUnsafe(
                `SELECT COUNT(*)::int as count FROM "Follow" WHERE "followerId" = $1`,
                targetUser.id
            );
            followingCount = followingRes[0]?.count || 0;

            if (currentUserId) {
                // Check if I follow them
                const followRes: any[] = await localPrisma.$queryRawUnsafe(
                    `SELECT * FROM "Follow" WHERE "followerId" = $1 AND "followingId" = $2`,
                    currentUserId, targetUser.id
                );
                isFollowing = followRes.length > 0;

                // Check if they follow me
                const followerResMe: any[] = await localPrisma.$queryRawUnsafe(
                    `SELECT * FROM "Follow" WHERE "followerId" = $1 AND "followingId" = $2`,
                    targetUser.id, currentUserId
                );
                isFollower = followerResMe.length > 0;
            }
        } catch (err: any) {
            console.error('Social stats RAW SQL error in profile API:', err);
        } finally {
            await localPrisma.$disconnect();
        }

        return NextResponse.json({
            id: targetUser.id,
            firebaseUid: targetUser.firebaseUid,
            name: targetUser.name,
            username: targetUser.username,
            photoUrl: targetUser.photoUrl,
            bio: targetUser.bio,
            createdAt: targetUser.createdAt,
            readingGoal: (targetUser as any).readingGoal || 25,
            isFollowing,
            isFollower,
            isMutual: isFollowing && isFollower,
            stats: {
                followers: followerCount,
                following: followingCount,
                booksRead: targetUser.readlist.length,
            },
            readlist: targetUser.readlist,
        });
    } catch (error: any) {
        console.error('Profile API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
