import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthenticatedRequest, withAuth } from '@/lib/auth-middleware';

async function handler(req: AuthenticatedRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id: bookId } = await context.params;
        const firebaseUid = req.user?.firebaseUid;

        if (!firebaseUid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { firebaseUid }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if book exists
        const book = await prisma.ebook.findUnique({
            where: { id: bookId }
        });

        if (!book) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        // Anti-spam: Check if user already read this book in the last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentRead = await prisma.bookActivity.findFirst({
            where: {
                bookId,
                userId: user.id,
                type: 'READ',
                createdAt: { gte: twentyFourHoursAgo }
            }
        });

        if (recentRead) {
            return NextResponse.json({ success: true, message: 'Read already logged recently' });
        }

        // Start a transaction to log activity and update totalReads
        await prisma.$transaction([
            prisma.bookActivity.create({
                data: {
                    bookId,
                    userId: user.id,
                    type: 'READ'
                }
            }),
            prisma.ebook.update({
                where: { id: bookId },
                data: { totalReads: { increment: 1 } }
            })
        ]);

        // Invalidate recommendations cache for this user
        try {
            const { revalidateTag } = await import('next/cache');
            revalidateTag(`recommendations-${user.id}`);
        } catch (e) {
            console.error('Failed to revalidate cache:', e);
        }

        // Trigger trending recalculation asynchronously
        fetch(`${req.nextUrl.origin}/api/trending/recalculate?bookId=${bookId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).catch(() => { });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error logging read activity:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export const POST = withAuth(handler);
export const dynamic = 'force-dynamic';
