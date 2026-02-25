'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import Image from 'next/image';

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
    const initialTab = (searchParams.get('tab') as 'all' | 'books' | 'people') || 'all';

    const [activeTab, setActiveTab] = useState<'all' | 'books' | 'people'>(initialTab);
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
    const TAKE = 12;

    const fetchResults = useCallback(async (isLoadMore = false) => {
        if (!query || query.length < 2) return;

        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
            setError(null);
        }

        try {
            const skip = isLoadMore
                ? (activeTab === 'books' ? booksSkip + TAKE : peopleSkip + TAKE)
                : 0;

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
                    else if (activeTab === 'people') setPeopleSkip(skip);
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

    const handleTabChange = (tab: 'all' | 'books' | 'people') => {
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
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="mb-12 animate-fade-in-up">
                    <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
                        Results for <span style={{ color: 'var(--accent)' }}>"{query}"</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></span>
                            {results.totalBooks} books found
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--accent-glow)' }}></span>
                            {results.totalUsers} people found
                        </span>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-4 sm:gap-8 border-b mb-10 overflow-x-auto pb-px scrollbar-hide animate-fade-in-up stagger-1" style={{ borderColor: 'var(--border)' }}>
                    {[
                        { id: 'all', label: 'All Results', count: -1 },
                        { id: 'books', label: 'Books', count: results.totalBooks },
                        { id: 'people', label: 'People', count: results.totalUsers }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id as any)}
                            aria-label={`View ${tab.label} ${tab.count >= 0 ? `(${tab.count})` : ''}`}
                            className={`flex items-center gap-3 px-2 py-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 origin-left hover:opacity-100 ${activeTab === tab.id
                                ? 'border-[var(--accent)] text-[var(--text-primary)] scale-105'
                                : 'border-transparent text-[var(--text-secondary)] opacity-50'
                                }`}
                        >
                            {tab.label}
                            {tab.count >= 0 && (
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all ${activeTab === tab.id ? 'bg-[var(--accent)] text-white' : 'bg-white/5'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
                            <div className="h-12 w-12 rounded-full border-4 border-t-transparent animate-spin mb-6" style={{ borderColor: 'var(--accent) transparent var(--accent) transparent' }}></div>
                            <p className="text-sm font-bold opacity-50" style={{ color: 'var(--text-secondary)' }}>Searching across our library...</p>
                        </div>
                    ) : error ? (
                        <div className="rounded-3xl p-12 text-center border-2 border-dashed animate-fade-in" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                            <div className="mx-auto h-20 w-16 mb-6 opacity-20">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Search Interrupted</h3>
                            <p className="text-sm opacity-60 mb-8 max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>{error}</p>
                            <button onClick={() => fetchResults()} className="px-8 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-105" style={{ backgroundColor: 'var(--accent)' }}>
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-16">

                            {/* BOOKS SECTION (Always visible if All or Books tab) */}
                            {(activeTab === 'all' || activeTab === 'books') && results.books.length > 0 && (
                                <section className="animate-fade-in-up">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                                            {activeTab === 'all' ? 'Books Recommendations' : `Books (${results.totalBooks})`}
                                        </h2>
                                        {activeTab === 'all' && results.totalBooks > 6 && (
                                            <button onClick={() => handleTabChange('books')} className="text-xs font-bold uppercase tracking-widest transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text-tertiary)' }}>
                                                View all books
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8">
                                        {results.books.map((book, idx) => (
                                            <Link
                                                key={book.id}
                                                href={`/ebooks/${book.id}`}
                                                className="group animate-fade-in-up"
                                                style={{ animationDelay: `${idx * 50}ms` }}
                                                aria-label={`View details for ${book.title}`}
                                            >
                                                <div className="relative aspect-[3/4.5] w-full overflow-hidden rounded-2xl shadow-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-rose-900/20" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                                    <Image
                                                        src={book.coverUrl || '/placeholder-book.jpg'}
                                                        alt={`${book.title} cover`}
                                                        fill
                                                        className="object-cover transition-all duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent z-10">
                                                        <span className="text-[10px] font-black uppercase tracking-tighter text-white/70">{book.category}</span>
                                                    </div>
                                                </div>
                                                <div className="pt-3">
                                                    <h3 className="text-sm font-bold font-display line-clamp-1 mb-0.5" style={{ color: 'var(--text-primary)' }}>{book.title}</h3>
                                                    <p className="text-[11px] font-medium opacity-50 truncate" style={{ color: 'var(--text-secondary)' }}>{book.author}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    {activeTab === 'books' && results.books.length < results.totalBooks && (
                                        <div className="flex justify-center pt-16">
                                            <button onClick={() => fetchResults(true)} disabled={loadingMore} className="group flex items-center gap-3 px-8 py-4 rounded-3xl font-bold text-sm border transition-all hover:scale-105" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                                                {loadingMore ? <div className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full"></div> : <span>Load More Books</span>}
                                            </button>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* PEOPLE SECTION (Always visible if All or People tab) */}
                            {(activeTab === 'all' || activeTab === 'people') && results.users.length > 0 && (
                                <section className="animate-fade-in-up stagger-2">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                                            {activeTab === 'all' ? 'People You Might Know' : `People (${results.totalUsers})`}
                                        </h2>
                                        {activeTab === 'all' && results.totalUsers > 6 && (
                                            <button onClick={() => handleTabChange('people')} className="text-xs font-bold uppercase tracking-widest transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text-tertiary)' }}>
                                                View all people
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {results.users.map((u, idx) => (
                                            <div key={u.id} className="relative group p-6 rounded-3xl border transition-all duration-300 hover:shadow-2xl animate-fade-in-up"
                                                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', animationDelay: `${idx * 100}ms` }}>
                                                <Link href={`/user/${u.username || u.id}`} className="flex items-center gap-4 mb-4 group/info">
                                                    <div className="h-16 w-16 rounded-full p-1 border flex-shrink-0 transition-transform group-hover/info:scale-105" style={{ borderColor: 'var(--accent)' }}>
                                                        <div className="h-full w-full rounded-full overflow-hidden flex items-center justify-center font-bold text-white text-xl" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                                            {u.photoUrl ? (
                                                                <img src={u.photoUrl} alt={u.name} className="h-full w-full object-cover" />
                                                            ) : (
                                                                u.name?.[0] || u.username?.[0] || 'U'
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <h3 className="font-bold text-lg truncate group-hover/info:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-primary)' }}>{u.name || 'Anonymous Reader'}</h3>
                                                            {u.isMutual && <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-lg font-black uppercase tracking-tighter">Mutual</span>}
                                                        </div>
                                                        <p className="text-xs font-medium opacity-50" style={{ color: 'var(--text-secondary)' }}>@{u.username || 'user'}</p>
                                                    </div>
                                                </Link>
                                                <p className="text-xs leading-relaxed mb-6 h-8 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                                                    {u.bio || "This writer is still working on their story..."}
                                                </p>
                                                <button onClick={() => handleToggleFollow(u.id)}
                                                    className={`w-full py-3 rounded-2xl text-xs font-bold transition-all ${u.isFollowing
                                                        ? 'border opacity-80'
                                                        : 'text-white'
                                                        }`}
                                                    style={{
                                                        backgroundColor: u.isFollowing ? 'transparent' : 'var(--accent)',
                                                        borderColor: u.isFollowing ? 'var(--border)' : 'transparent',
                                                        color: u.isFollowing ? 'var(--text-primary)' : 'white',
                                                        boxShadow: u.isFollowing ? 'none' : '0 10px 20px -5px var(--accent-glow)'
                                                    }}>
                                                    {u.isFollowing ? (u.isMutual ? 'Mutual' : 'Following') : '+ Follow'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {activeTab === 'people' && results.users.length < results.totalUsers && (
                                        <div className="flex justify-center pt-16">
                                            <button onClick={() => fetchResults(true)} disabled={loadingMore} className="group flex items-center gap-3 px-8 py-4 rounded-3xl font-bold text-sm border transition-all hover:scale-105" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                                                {loadingMore ? <div className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full"></div> : <span>Load More People</span>}
                                            </button>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* EMPTY STATE */}
                            {results.totalBooks === 0 && results.totalUsers === 0 && (
                                <div className="rounded-3xl p-24 text-center border-2 border-dashed animate-fade-in" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                                    <div className="mx-auto h-24 w-24 rounded-full flex items-center justify-center mb-8" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                        <svg className="h-10 w-10 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>No matches found</h3>
                                    <p className="text-base opacity-60 mb-10 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>We couldn't find any books or authors matching "{query}". Try checking your spelling or use different keywords.</p>
                                    <Link href="/" className="px-10 py-4 rounded-3xl font-black text-sm text-white transition-all hover:scale-105 shadow-2xl" style={{ backgroundColor: 'var(--accent)', boxShadow: '0 20px 40px -10px var(--accent-glow)' }}>
                                        Back to Library
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="animate-pulse">
                        <div className="h-12 bg-white/5 rounded-3xl w-1/3 mb-10"></div>
                        <div className="h-16 bg-white/5 rounded-3xl mb-12"></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-[3/4.5] bg-white/5 rounded-3xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}

export const dynamic = 'force-dynamic';
