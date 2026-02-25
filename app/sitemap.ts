import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ebookin-aja.vercel.app';

    // Get all active ebooks
    const ebooks = await prisma.ebook.findMany({
        where: { isActive: true },
        select: { id: true, updatedAt: true },
    });

    const ebookUrls = ebooks.map((ebook) => ({
        url: `${baseUrl}/ebooks/${ebook.id}`,
        lastModified: ebook.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Get all active categories
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        select: { name: true, updatedAt: true },
    });

    const categoryUrls = categories.map((cat) => ({
        url: `${baseUrl}/browse?category=${encodeURIComponent(cat.name)}`,
        lastModified: cat.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/browse`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...ebookUrls,
        ...categoryUrls,
    ];
}
