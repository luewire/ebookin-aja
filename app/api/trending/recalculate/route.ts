import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const bookId = searchParams.get('bookId');

        // Filter for activities within the last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // Function to calculate trending score for a single book
        const recalculateForBook = async (id: string) => {
            const book = await prisma.ebook.findUnique({
                where: { id },
                select: { priority: true }
            });

            if (!book) return;

            const activities = await prisma.bookActivity.groupBy({
                by: ['type'],
                where: {
                    bookId: id,
                    createdAt: { gte: sevenDaysAgo }
                },
                _count: {
                    _all: true
                }
            });

            let views = 0;
            let reads = 0;
            let positiveRatings = 0;
            let neutralRatings = 0;
            let negativeRatings = 0;

            activities.forEach((act: any) => {
                if (act.type === 'VIEW') views = act._count._all;
                if (act.type === 'READ') reads = act._count._all;
                if (act.type === 'POSITIVE_RATING') positiveRatings = act._count._all;
                if (act.type === 'NEUTRAL_RATING') neutralRatings = act._count._all;
                if (act.type === 'NEGATIVE_RATING') negativeRatings = act._count._all;
            });

            const totalRatings = positiveRatings + neutralRatings + negativeRatings;

            // Formula:
            // (views_7hari * 1) + (reads_7hari * 3) + (positiveRatings_7hari * 5) - (negativeRatings_7hari * 4) + (totalRatings_7hari * 2) + (priority * 10)
            const trendingScore =
                (views * 1) +
                (reads * 3) +
                (positiveRatings * 5) -
                (negativeRatings * 4) +
                (totalRatings * 2) +
                (book.priority * 10);

            await prisma.ebook.update({
                where: { id },
                data: { trendingScore }
            });
        };

        if (bookId) {
            await recalculateForBook(bookId);
            return NextResponse.json({ success: true, message: `Recalculated trending score for book ${bookId}` });
        } else {
            // Recalculate all active books
            const books = await prisma.ebook.findMany({
                where: { isActive: true },
                select: { id: true }
            });

            for (const book of books) {
                await recalculateForBook(book.id);
            }

            return NextResponse.json({ success: true, message: `Recalculated trending scores for ${books.length} books` });
        }
    } catch (error) {
        console.error('Error recalculating trending score:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
