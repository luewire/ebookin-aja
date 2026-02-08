'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import EpubReader from '@/components/EpubReader';

interface Ebook {
    id: string;
    title: string;
    author: string;
    pdfUrl?: string; // Using pdfUrl as the source for now, effectively treated as epubUrl
}

export default function ReaderPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [ebook, setEbook] = useState<Ebook | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (params.id) {
            fetchEbook(params.id as string);
        }
    }, [params.id]);

    const fetchEbook = async (id: string) => {
        try {
            const { auth } = await import('@/lib/firebase');
            const token = await auth.currentUser?.getIdToken();

            if (!token) {
                router.push(`/login?redirect=/reader/${id}`);
                return;
            }

            const response = await fetch(`/api/ebooks/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to fetch ebook');
                return;
            }

            // Check if user has subscription to access ebook
            if (data.requiresSubscription) {
                setError("You need a premium subscription to read this book.");
                return;
            }

            setEbook(data.ebook);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <div className="text-xl text-gray-600 dark:text-gray-400">Loading Book...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 gap-4">
                <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!ebook?.pdfUrl) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 gap-4">
                <p className="text-xl text-gray-600 dark:text-gray-400">Book file not found.</p>
                <button
                    onClick={() => router.push(`/ebooks/${params.id}`)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Back to Book Details
                </button>
            </div>
        );
    }

    return (
        <EpubReader
            bookUrl={ebook.pdfUrl}
            bookTitle={ebook.title}
            bookId={ebook.id}
            onClose={() => router.back()}
        />
    );
}
