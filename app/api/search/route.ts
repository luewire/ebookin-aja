import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

async function handler(req: AuthenticatedRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');
        const tab = searchParams.get('tab') || 'books'; // 'books' or 'people'
        const skip = parseInt(searchParams.get('skip') || '0');
        const take = parseInt(searchParams.get('take') || '10');
        const userId = req.user?.id;

        console.log(`Search Request: q="${query}", tab="${tab}", userId="${userId}"`);

        if (!query || query.length < 2) {
            return NextResponse.json({
                books: [],
                users: [],
                totalBooks: 0,
                totalUsers: 0
            });
        }

        const [booksCount, usersCount] = await Promise.all([
            prisma.ebook.count({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { author: { contains: query, mode: 'insensitive' } },
                    ],
                    isActive: true,
                },
            }),
            prisma.user.count({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { username: { contains: query, mode: 'insensitive' } },
                    ],
                    NOT: userId ? { id: userId } : undefined,
                },
            }),
        ]);

        let books: any[] = [];
        let users: any[] = [];

        if (tab === 'books') {
            books = await prisma.ebook.findMany({
                where: {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { author: { contains: query, mode: 'insensitive' } },
                    ],
                    isActive: true,
                },
                select: {
                    id: true,
                    title: true,
                    author: true,
                    coverUrl: true,
                    category: { select: { name: true } },
                },
                skip,
                take,
            });
        } else if (tab === 'people') {
            const { PrismaClient } = require('@prisma/client');
            const localPrisma = new PrismaClient();
            try {
                // Fetch people via RAW SQL to avoid relation issues with stale client
                // We'll fetch basic info first, then augment with follow status
                const sqlQuery = `
                    SELECT id, name, username, "photoUrl", bio 
                    FROM "User" 
                    WHERE (name ILIKE $1 OR username ILIKE $1)
                    ${userId ? 'AND id <> $2' : ''}
                    ORDER BY id
                    LIMIT $${userId ? 3 : 2} OFFSET $${userId ? 4 : 3}
                `;

                const queryParams = userId ? [`%${query}%`, userId, take, skip] : [`%${query}%`, take, skip];
                users = await localPrisma.$queryRawUnsafe(sqlQuery, ...queryParams);

                // Augment with follow states via RAW SQL
                if (userId && users.length > 0) {
                    const augmentedUsers = [];
                    for (const u of users) {
                        const followRes: any[] = await localPrisma.$queryRawUnsafe(
                            `SELECT * FROM "Follow" WHERE "followerId" = $1 AND "followingId" = $2`,
                            userId, u.id
                        );
                        const followerRes: any[] = await localPrisma.$queryRawUnsafe(
                            `SELECT * FROM "Follow" WHERE "followerId" = $1 AND "followingId" = $2`,
                            u.id, userId
                        );

                        augmentedUsers.push({
                            ...u,
                            isFollowing: followRes.length > 0,
                            isFollower: followerRes.length > 0,
                            isMutual: followRes.length > 0 && followerRes.length > 0
                        });
                    }
                    users = augmentedUsers;
                } else {
                    users = users.map((u: any) => ({
                        ...u,
                        isFollowing: false,
                        isFollower: false,
                        isMutual: false
                    }));
                }
            } catch (err: any) {
                console.error('Prisma search RAW SQL error:', err.message);
                users = [];
            } finally {
                await localPrisma.$disconnect();
            }
        }

        return NextResponse.json({
            books: books.map(b => ({
                id: b.id,
                title: b.title,
                author: b.author,
                coverUrl: b.coverUrl,
                category: b.category?.name || 'Uncategorized'
            })),
            users: users, // Already formatted above
            totalBooks: booksCount,
            totalUsers: usersCount,
        });
    } catch (error: any) {
        console.error('Final Search API error:', error);
        return NextResponse.json({ error: error.message || 'Failed to search' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        return withAuth(handler)(req as any, {} as any);
    }
    // For non-auth requests, we still need to provide a mock request object that handler expects
    return handler({ url: req.url } as any);
}
