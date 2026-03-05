'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import dynamic from 'next/dynamic';

const EpubReader = dynamic(() => import('@/components/EpubReader'), {
    ssr: false,
    loading: () => (
        <div className="flex h-screen items-center justify-center animate-fade-in-up" style={{ backgroundColor: 'var(--bg-base)' }}>
            <div className="animate-pulse flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="h-16 w-16 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--bg-elevated)', borderTopColor: 'var(--accent)' }}></div>
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: 'var(--accent)' }}></div>
                </div>
                <div className="text-xl font-display font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>Starting Reader...</div>
            </div>
        </div>
    )
});

interface Ebook {
    id: string;
    title: string;
    author: string;
    pdfUrl?: string; // Using pdfUrl as the source for now, effectively treated as epubUrl
}

export default function ReaderPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [ebook, setEbook] = useState<Ebook | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Wait for Firebase auth to finish initializing before fetching
        if (authLoading) return;
        if (params.id) {
            fetchEbook(params.id as string);
        }
    }, [params.id, authLoading]);

    const fetchEbook = async (id: string) => {
        try {
            const { auth } = await import('@/lib/firebase');

            // Wait for Firebase auth to finish initializing (new tab race condition fix)
            const token = await new Promise<string | null>((resolve) => {
                const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
                    unsubscribe();
                    if (currentUser) {
                        const t = await currentUser.getIdToken();
                        resolve(t);
                    } else {
                        resolve(null);
                    }
                });
            });

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
            <div className="flex h-screen items-center justify-center animate-fade-in-up" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="animate-pulse flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="h-16 w-16 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--bg-elevated)', borderTopColor: 'var(--accent)' }}></div>
                        <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: 'var(--accent)' }}></div>
                    </div>
                    <div className="text-xl font-display font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>Loading Book...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-6 px-4 text-center animate-fade-in-up" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)' }}>
                    <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Oops! Something went wrong</h2>
                    <p className="text-base max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>{error}</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="px-8 py-3 rounded-xl font-bold transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-lg"
                    style={{ backgroundColor: 'var(--accent)', color: 'white', boxShadow: '0 4px 14px 0 rgba(244, 63, 94, 0.39)' }}
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!ebook?.pdfUrl) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-6 px-4 text-center animate-fade-in-up" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    <svg className="h-10 w-10" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-2xl font-display font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Book Not Found</h2>
                    <p className="text-base max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>We couldn't locate the file for this book. It might have been removed or is temporarily unavailable.</p>
                </div>
                <button
                    onClick={() => router.push(`/ebooks/${params.id}`)}
                    className="px-8 py-3 rounded-xl font-bold transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-lg"
                    style={{ backgroundColor: 'var(--accent)', color: 'white', boxShadow: '0 4px 14px 0 rgba(244, 63, 94, 0.39)' }}
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
            onClose={() => {
                // Reader opens in a new tab — close it. Fall back to ebook detail if close fails.
                if (window.history.length <= 1) {
                    window.close();
                    // Fallback if window.close() is blocked by browser
                    setTimeout(() => router.replace(`/ebooks/${params.id}`), 300);
                } else {
                    router.back();
                }
            }}
        />
    );
}
