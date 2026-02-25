import { prisma } from '@/lib/prisma';

export interface RecommendedBook {
    id: string;
    title: string;
    author: string;
    coverUrl: string | null;
    category: string;
    isPremium: boolean;
    avgRating?: number;
    ratingCount?: number;
}

export interface RecommendationResult {
    books: RecommendedBook[];
    topGenres: string[];
}

/**
 * Get the last `limit` books the user has read
 */
async function getUserReadHistory(userId: string, limit: number = 5) {
    const readHistory = await prisma.bookActivity.findMany({
        where: {
            userId,
            type: 'READ',
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: limit,
        include: {
            book: {
                include: {
                    category: true,
                },
            },
        },
    });

    return readHistory.map(activity => activity.book);
}

/**
 * Extract and sort genres based on frequency in the read books
 */
function extractTopGenres(books: any[]): string[] {
    const genreCounts: Record<string, number> = {};

    books.forEach(book => {
        if (book.category && book.category.name) {
            genreCounts[book.category.name] = (genreCounts[book.category.name] || 0) + 1;
        }
    });

    // Sort by frequency descending
    return Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([genre]) => genre)
        .slice(0, 3); // Take top 3 genres max
}

/**
 * Get recommended books based on specific genres, excluding already read books
 */
async function getBooksByGenres(genres: string[], excludeBookIds: string[], limit: number = 6): Promise<RecommendedBook[]> {
    if (genres.length === 0) return [];

    const books = await prisma.ebook.findMany({
        where: {
            isActive: true,
            id: {
                notIn: excludeBookIds,
            },
            category: {
                name: {
                    in: genres,
                },
            },
        },
        orderBy: [
            { averageRating: 'desc' },
            { totalReads: 'desc' },
        ],
        take: limit,
        include: {
            category: { select: { name: true } },
        },
    });

    return books.map(formatBookData);
}

/**
 * Get popular books (fallback when no history or not enough recommendations)
 */
async function getFallbackBooks(excludeBookIds: string[], limit: number = 6): Promise<RecommendedBook[]> {
    const books = await prisma.ebook.findMany({
        where: {
            isActive: true,
            id: {
                notIn: excludeBookIds,
            },
        },
        orderBy: [
            { trendingScore: 'desc' },
            { averageRating: 'desc' },
            { totalReads: 'desc' },
        ],
        take: limit,
        include: {
            category: { select: { name: true } },
        },
    });

    return books.map(formatBookData);
}

/**
 * Helper to format raw database book into the required frontend interface
 */
function formatBookData(book: any): RecommendedBook {
    return {
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        category: book.category?.name || 'Uncategorized',
        isPremium: book.isPremium,
        avgRating: book.averageRating,
        ratingCount: book.totalRatings,
    };
}

/**
 * Main function to generate recommendations for a user
 */
export async function getRecommendations(userId?: string | null): Promise<RecommendationResult> {
    const RECOMMENDATION_LIMIT = 6;
    let excludeBookIds: string[] = [];
    let topGenres: string[] = [];
    let recommendedBooks: RecommendedBook[] = [];

    // If user is provided, get personalized recommendations
    if (userId) {
        // 1. Get user's read history
        const readBooks = await getUserReadHistory(userId, 10); // Look at last 10 reads for better genre mapping

        if (readBooks.length > 0) {
            // Include these in the exclude list so we don't recommend books they've already read
            excludeBookIds = readBooks.map((book: any) => book.id);

            // 2. Extract top genres
            topGenres = extractTopGenres(readBooks);

            // 3. Get books by these genres
            if (topGenres.length > 0) {
                recommendedBooks = await getBooksByGenres(topGenres, excludeBookIds, RECOMMENDATION_LIMIT);
            }
        }
    }

    // 4. If we don't have enough recommendations (or user is null/new), grab fallbacks
    if (recommendedBooks.length < RECOMMENDATION_LIMIT) {
        const remainingSlots = RECOMMENDATION_LIMIT - recommendedBooks.length;

        // Add already found recommendations to the exclude list so we don't get duplicates
        const currentRecIds = recommendedBooks.map(b => b.id);
        const fullExcludeList = [...excludeBookIds, ...currentRecIds];

        const fallbackBooks = await getFallbackBooks(fullExcludeList, remainingSlots);

        recommendedBooks = [...recommendedBooks, ...fallbackBooks];
    }

    return {
        books: recommendedBooks,
        topGenres,
    };
}
