import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

async function handler(req: AuthenticatedRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');
        const userId = req.user!.id;

        if (!query || query.length < 2) {
            return NextResponse.json([]);
        }

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { username: { contains: query, mode: 'insensitive' } },
                ],
                NOT: { id: userId },
            },
            select: {
                id: true,
                name: true,
                username: true,
                photoUrl: true,
                followers: {
                    where: { followerId: userId }
                },
                following: {
                    where: { followingId: userId }
                }
            },
            take: 10,
        });

        const result = users.map(u => ({
            id: u.id,
            name: u.name,
            username: u.username,
            photoUrl: u.photoUrl,
            isFollowing: u.followers.length > 0,
            isFollower: u.following.length > 0,
            isMutual: u.followers.length > 0 && u.following.length > 0
        }));

        return NextResponse.json(result);
    } catch (error) {
        console.error('User search error:', error);
        return NextResponse.json({ error: 'Failed to search users' }, { status: 500 });
    }
}

export const GET = withAuth(handler);
