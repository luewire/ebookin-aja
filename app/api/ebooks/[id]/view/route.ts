import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyIdToken } from '@/lib/firebase-admin';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Need to await params in Next.js 15+
) {
    try {
        const { id: bookId } = await params;

        // Check if book exists
        const book = await prisma.ebook.findUnique({
            where: { id: bookId }
        });

        if (!book) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        // Attempt to get user ID from auth header if present
        let userId: string | null = null;
        const authHeader = req.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.split('Bearer ')[1];
            try {
                const decodedToken = await verifyIdToken(token);
                if (decodedToken) {
                    const user = await prisma.user.findUnique({
                        where: { firebaseUid: decodedToken.uid }
                    });
                    if (user) {
                        userId = user.id;
                    }
                }
            } catch (e) {
                // Silently ignore auth errors for guest views
            }
        }

        // Anti-spam: Check if user already viewed this book in the last 1 hour
        if (userId) {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
            const recentView = await prisma.bookActivity.findFirst({
                where: {
                    bookId,
                    userId,
                    type: 'VIEW',
                    createdAt: { gte: oneHourAgo }
                }
            });

            if (recentView) {
                return NextResponse.json({ success: true, message: 'View already logged recently' });
            }
        }

        // Start a transaction to log activity and update totalViews
        await prisma.$transaction([
            prisma.bookActivity.create({
                data: {
                    bookId,
                    userId, // Can be null for guests
                    type: 'VIEW'
                }
            }),
            prisma.ebook.update({
                where: { id: bookId },
                data: { totalViews: { increment: 1 } }
            })
        ]);

        // Optional: Trigger trending recalculation asynchronously here
        // But since view is very frequent, we might want to do it via cron or sparingly.
        // We'll call it asynchronously without awaiting so response is fast.
        fetch(`${req.nextUrl.origin}/api/trending/recalculate?bookId=${bookId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).catch(() => { }); // Fire and forget

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error logging view activity:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
