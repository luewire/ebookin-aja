import { prisma } from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  // Fetch public data on the server for instant LCP
  const [banners, trendingDb, categoriesDb] = await Promise.all([
    prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { priority: 'desc' }
    }),
    prisma.ebook.findMany({
      where: { isActive: true, trendingScore: { gte: 0 } },
      orderBy: [{ trendingScore: 'desc' }, { priority: 'desc' }, { createdAt: 'desc' }],
      take: 6,
      select: {
        id: true, title: true, author: true, coverUrl: true, categoryId: true, isPremium: true,
        category: { select: { name: true } },
        reviews: { select: { rating: true } }
      }
    }),
    prisma.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { ebooks: { where: { isActive: true } } } } }
    })
  ]);

  // Format data
  const trendingBooks = trendingDb.map((ebook: any) => {
    const totalRatings = ebook.reviews?.length || 0;
    const avgRating = totalRatings > 0 ? ebook.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / totalRatings : 0;
    return {
      ...ebook,
      category: ebook.category?.name || '',
      avgRating: parseFloat(avgRating.toFixed(1)),
      ratingCount: totalRatings
    };
  });

  return (
    <HomeClient
      initialBanners={banners}
      initialTrendingBooks={trendingBooks}
      initialCategories={categoriesDb}
    />
  );
}

export const revalidate = 1800; // ISR cache for 30 minutes
