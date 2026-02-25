import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    // Read route params
    const { id } = await params;

    // Fetch data
    const ebook = await prisma.ebook.findUnique({
        where: { id, isActive: true },
        select: { title: true, author: true, description: true, coverUrl: true }
    });

    if (!ebook) {
        return {
            title: 'Book Not Found',
        };
    }

    const ogUrl = new URL(`/api/og`, process.env.NEXT_PUBLIC_APP_URL || 'https://ebookin-aja.vercel.app');
    ogUrl.searchParams.set('title', ebook.title);
    ogUrl.searchParams.set('author', ebook.author);
    if (ebook.coverUrl) {
        ogUrl.searchParams.set('cover', ebook.coverUrl);
    }

    return {
        title: ebook.title,
        description: ebook.description || `Baca ${ebook.title} karya ${ebook.author} di Ebookin Aja.`,
        openGraph: {
            title: `${ebook.title} - Ebookin Aja`,
            description: ebook.description || `Baca ${ebook.title} karya ${ebook.author}`,
            images: [
                {
                    url: ogUrl.toString(),
                    width: 1200,
                    height: 630,
                    alt: `${ebook.title} cover preview`
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: ebook.title,
            description: ebook.description || `Baca ${ebook.title} karya ${ebook.author}`,
            images: [ogUrl.toString()],
        }
    };
}

export default function EbookLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
