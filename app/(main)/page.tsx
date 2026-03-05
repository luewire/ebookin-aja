import { prisma } from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';

function isDatabaseUnavailableError(error: unknown) {
  const errorMessage = error instanceof Error ? error.message : '';
  return errorMessage.includes("Can't reach database server") || errorMessage.includes('P1001');
}

async function getActiveBanners() {
  try {
    return await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { priority: 'desc' }
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return [];
    }

    throw error;
  }
}

async function getActiveCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { ebooks: { where: { isActive: true } } } } }
    });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return [];
    }

    throw error;
  }
}

async function getTrendingBooks() {
  try {
    return await prisma.ebook.findMany({
      where: { isActive: true, trendingScore: { gte: 0 } },
      orderBy: [{ trendingScore: 'desc' }, { priority: 'desc' }, { createdAt: 'desc' }],
      take: 6,
      select: {
        id: true, title: true, author: true, coverUrl: true, categoryId: true, isPremium: true,
        category: { select: { name: true } },
        reviews: { select: { rating: true } }
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '';
    const isMissingPriorityColumn = errorMessage.includes('priority');
    const isDatabaseUnavailable = isDatabaseUnavailableError(error);

    if (isDatabaseUnavailable) {
      return [];
    }

    if (!isMissingPriorityColumn) {
      throw error;
    }

    return prisma.ebook.findMany({
      where: { isActive: true, trendingScore: { gte: 0 } },
      orderBy: [{ trendingScore: 'desc' }, { createdAt: 'desc' }],
      take: 6,
      select: {
        id: true, title: true, author: true, coverUrl: true, categoryId: true, isPremium: true,
        category: { select: { name: true } },
        reviews: { select: { rating: true } }
      }
    });
  }
}

async function getBooksByTier(isPremium: boolean) {
  try {
    return await prisma.ebook.findMany({
      where: { isActive: true, isPremium },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      take: 6,
      select: {
        id: true, title: true, author: true, coverUrl: true, categoryId: true, isPremium: true,
        category: { select: { name: true } },
        reviews: { select: { rating: true } }
      }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '';
    const isMissingPriorityColumn = errorMessage.includes('priority');

    if (isDatabaseUnavailableError(error)) {
      return [];
    }

    if (!isMissingPriorityColumn) {
      throw error;
    }

    return prisma.ebook.findMany({
      where: { isActive: true, isPremium },
      orderBy: [{ createdAt: 'desc' }],
      take: 6,
      select: {
        id: true, title: true, author: true, coverUrl: true, categoryId: true, isPremium: true,
        category: { select: { name: true } },
        reviews: { select: { rating: true } }
      }
    });
  }
}

function formatBooks(books: any[]) {
  return books.map((ebook: any) => {
    const totalRatings = ebook.reviews?.length || 0;
    const avgRating = totalRatings > 0 ? ebook.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / totalRatings : 0;
    return {
      ...ebook,
      category: ebook.category?.name || '',
      avgRating: parseFloat(avgRating.toFixed(1)),
      ratingCount: totalRatings
    };
  });
}

export default async function Home() {
  let banners: any[] = [];
  let trendingDb: any[] = [];
  let freeDb: any[] = [];
  let premiumDb: any[] = [];
  let categoriesDb: any[] = [];

  try {
    [banners, trendingDb, freeDb, premiumDb, categoriesDb] = await Promise.all([
      getActiveBanners(),
      getTrendingBooks(),
      getBooksByTier(false),
      getBooksByTier(true),
      getActiveCategories()
    ]);
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }
  }

  const trendingBooks = formatBooks(trendingDb);
  const freeBooks = formatBooks(freeDb);
  const premiumBooks = formatBooks(premiumDb);

  return (
    <HomeClient
      initialBanners={banners}
      initialTrendingBooks={trendingBooks}
      initialFreeBooks={freeBooks}
      initialPremiumBooks={premiumBooks}
      initialCategories={categoriesDb}
    />
  );
}

export const revalidate = 1800; // ISR cache for 30 minutes
