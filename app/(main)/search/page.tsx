'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

interface SearchResult {
    books: any[];
    users: any[];
    totalBooks: number;
    totalUsers: number;
}

function SearchPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();

    const query = searchParams.get('q') || '';
    const initialTab = (searchParams.get('tab') as 'books' | 'people') || 'books';

    const [activeTab, setActiveTab] = useState<'books' | 'people'>(initialTab);
    const [results, setResults] = useState<SearchResult>({
        books: [],
        users: [],
        totalBooks: 0,
        totalUsers: 0
    });
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [booksSkip, setBooksSkip] = useState(0);
    const [peopleSkip, setPeopleSkip] = useState(0);
    const TAKE = 10;

    const fetchResults = useCallback(async (isLoadMore = false) => {
        if (!query || query.length < 2) return;

        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
            setError(null);
        }

        try {
            const skip = activeTab === 'books' ? (isLoadMore ? booksSkip + TAKE : 0) : (isLoadMore ? peopleSkip + TAKE : 0);
            const token = await user?.getIdToken();

            const response = await fetch(
                `/api/search?q=${encodeURIComponent(query)}&tab=${activeTab}&skip=${skip}&take=${TAKE}`,
                {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                }
            );

            if (response.ok) {
                const data = await response.json();

                if (isLoadMore) {
                    setResults(prev => ({
                        ...data,
                        books: activeTab === 'books' ? [...prev.books, ...data.books] : prev.books,
                        users: activeTab === 'people' ? [...prev.users, ...data.users] : prev.users
                    }));

                    if (activeTab === 'books') setBooksSkip(skip);
                    else setPeopleSkip(skip);
                } else {
                    setResults(data);
                    setBooksSkip(0);
                    setPeopleSkip(0);
                }
            } else {
                setError('Failed to fetch search results');
            }
        } catch (err) {
            console.error('Search fetch error:', err);
            setError('An error occurred while searching');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [query, activeTab, user, booksSkip, peopleSkip]);

    useEffect(() => {
        fetchResults();
    }, [query, activeTab]);

    const handleTabChange = (tab: 'books' | 'people') => {
        setActiveTab(tab);
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        router.push(`/search?${params.toString()}`);
    };

    const handleToggleFollow = async (userId: string) => {
        if (!user) {
            router.push('/login');
            return;
        }

        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/users/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ followingId: userId }),
            });

            if (response.ok) {
                const data = await response.json();
                const isFollowing = data.status === 'followed' || data.status === 'mutual';
                const isMutual = data.status === 'mutual';

                setResults(prev => ({
                    ...prev,
                    users: prev.users.map(u =>
                        u.id === userId ? { ...u, isFollowing, isMutual } : u
                    )
                }));
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Search Results for "{query}"
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Found <span className="font-bold text-gray-900 dark:text-gray-100">{results.totalBooks}</span> books and <span className="font-bold text-gray-900 dark:text-gray-100">{results.totalUsers}</span> people matching your query
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 dark:border-slate-800 mb-8 overflow-x-auto pb-px">
                <button
                    onClick={() => handleTabChange('books')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'books'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    Books
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'books' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 dark:bg-slate-800'}`}>
                        {results.totalBooks}
                    </span>
                </button>
                <button
                    onClick={() => handleTabChange('people')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'people'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    People
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'people' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 dark:bg-slate-800'}`}>
                        {results.totalUsers}
                    </span>
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin h-10 w-10 text-blue-600 border-4 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400 animate-pulse">Searching for "{query}"...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/20 rounded-2xl p-8 text-center">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <button onClick={() => fetchResults()} className="mt-4 text-sm font-bold text-red-700 dark:text-red-300 underline underline-offset-4">Try Again</button>
                </div>
            ) : activeTab === 'books' ? (
                <div className="space-y-8">
                    {results.books.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {results.books.map((book) => (
                                    <Link key={book.id} href={`/ebooks/${book.id}`} className="group">
                                        <div className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-slate-800 shadow-sm group-hover:shadow-xl transition-all duration-300 mb-3 border border-gray-100 dark:border-slate-700">
                                            <img src={book.coverUrl || '/placeholder-book.jpg'} alt={book.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        </div>
                                        <div className="px-1">
                                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{book.category}</span>
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 transition-colors mt-0.5">{book.title}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{book.author}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            {results.books.length < results.totalBooks && (
                                <div className="flex justify-center pt-8">
                                    <button
                                        onClick={() => fetchResults(true)}
                                        disabled={loadingMore}
                                        className="px-8 py-3 rounded-full bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {loadingMore && <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full"></div>}
                                        Load More Books
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                            <p className="text-gray-500 dark:text-gray-400">No books found matching your query.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-8">
                    {results.users.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {results.users.map((u) => (
                                    <div key={u.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-4 mb-4">
                                            <Link href={`/user/${u.username || u.id}`} className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden shadow-lg shadow-blue-500/10">
                                                {u.photoUrl ? (
                                                    <img src={u.photoUrl} alt={u.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span>{u.name?.[0] || u.username?.[0] || 'U'}</span>
                                                )}
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/user/${u.username || u.id}`} className="block group">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 transition-colors">
                                                            {u.name || 'Anonymous User'}
                                                        </h3>
                                                        {u.isMutual && (
                                                            <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded font-bold">Friend</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{u.username || 'user'}</p>
                                                </Link>
                                                {u.favoriteGenre && (
                                                    <span className="inline-block mt-2 text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                        {u.favoriteGenre}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-6 h-8 italic">
                                            {u.bio ? `"${u.bio}"` : "This reader hasn't shared a bio yet."}
                                        </p>

                                        <button
                                            onClick={() => handleToggleFollow(u.id)}
                                            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${u.isFollowing
                                                ? 'bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-600'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/10'
                                                }`}
                                        >
                                            {u.isFollowing ? (u.isMutual ? 'Friend' : 'Following') : 'Follow'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {results.users.length < results.totalUsers && (
                                <div className="flex justify-center pt-8">
                                    <button
                                        onClick={() => fetchResults(true)}
                                        disabled={loadingMore}
                                        className="px-8 py-3 rounded-full bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {loadingMore && <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full"></div>}
                                        Load More People
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                            <p className="text-gray-500 dark:text-gray-400">No people found matching your query.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
                        <div className="h-12 bg-gray-200 dark:bg-slate-700 rounded mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded"></div>
                            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}
