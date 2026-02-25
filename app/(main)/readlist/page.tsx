'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Ebook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  category: string;
  description?: string;
  isPremium?: boolean;
}

interface Wishlist {
  id: string;
  ebookId: string;
  status: string;
  createdAt: string;
  ebook: Ebook;
  progress?: number;
}

export default function ReadlistPage() {
  const { user, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'WANT_TO_READ' | 'FINISHED' | 'all'>('WANT_TO_READ');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user) {
      fetchWishlist();
    }
  }, [authLoading, user]);

  const fetchWishlist = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();

      const response = await fetch('/api/readlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: Wishlist[] = await response.json();

        // Merge with local reading progress
        const updatedData = data.map(item => {
          const storageKey = `reading-progress-${user.uid}-${item.ebookId}`;
          const localData = localStorage.getItem(storageKey);
          let progress = 0;

          if (localData) {
            try {
              const parsed = JSON.parse(localData);
              if (parsed.progress) {
                progress = parsed.progress;
              }
            } catch (e) {
              // Ignore parse error
            }
          }

          return {
            ...item,
            progress
          };
        });

        setWishlist(updatedData);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWishlist = wishlist.filter(item => {
    // Determine status primarily by progress first, then by DB status
    const progress = item.progress || 0;
    const isFinished = progress >= 100;

    if (activeTab === 'all') return true;

    if (activeTab === 'FINISHED') {
      return isFinished || item.status === 'FINISHED';
    }

    if (activeTab === 'WANT_TO_READ') {
      return !isFinished && item.status !== 'FINISHED';
    }

    return item.status === activeTab;
  });

  const totalPages = Math.ceil(filteredWishlist.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredWishlist.slice(startIndex, startIndex + itemsPerPage);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
          <div className="h-12 w-1/3 rounded-xl skeleton animate-pulse" />
          <div className="flex gap-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
            <div className="h-8 w-24 rounded-lg skeleton animate-pulse" />
            <div className="h-8 w-24 rounded-lg skeleton animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="rounded-2xl p-4 skeleton animate-pulse">
                <div className="aspect-[2/3] w-full rounded-xl bg-[var(--bg-elevated)] mb-4" />
                <div className="h-4 w-3/4 rounded bg-[var(--bg-elevated)] mb-2" />
                <div className="h-3 w-1/2 rounded bg-[var(--bg-elevated)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold font-display tracking-wide mb-3" style={{ color: 'var(--text-primary)' }}>My Readlist</h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            You have {filteredWishlist.length} {filteredWishlist.length === 1 ? 'book' : 'books'} in your list
          </p>
        </div>

        {/* Tabs & Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-6 border-b w-full sm:w-auto overflow-x-auto hide-scrollbar" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => { setActiveTab('WANT_TO_READ'); setCurrentPage(1); }}
              aria-label="View books I want to read"
              className={`pb-4 text-base font-medium border-b-2 transition-all whitespace-nowrap relative top-[1px]`}
              style={{
                borderColor: activeTab === 'WANT_TO_READ' ? 'var(--accent)' : 'transparent',
                color: activeTab === 'WANT_TO_READ' ? 'var(--accent)' : 'var(--text-secondary)'
              }}
            >
              Want to Read
            </button>
            <button
              onClick={() => { setActiveTab('FINISHED'); setCurrentPage(1); }}
              aria-label="View finished books"
              className={`pb-4 text-base font-medium border-b-2 transition-all whitespace-nowrap relative top-[1px]`}
              style={{
                borderColor: activeTab === 'FINISHED' ? 'var(--accent)' : 'transparent',
                color: activeTab === 'FINISHED' ? 'var(--accent)' : 'var(--text-secondary)'
              }}
            >
              Finished
            </button>
            <button
              onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
              aria-label="View all books in my list"
              className={`pb-4 text-base font-medium border-b-2 transition-all whitespace-nowrap relative top-[1px]`}
              style={{
                borderColor: activeTab === 'all' ? 'var(--accent)' : 'transparent',
                color: activeTab === 'all' ? 'var(--accent)' : 'var(--text-secondary)'
              }}
            >
              All Books
            </button>
          </div>

          {/* Filter button - kept for future functionality */}
          <button
            aria-label="Filter readlist"
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors group"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <svg className="h-4 w-4 transition-colors group-hover:text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
        </div>

        {/* Books Grid */}
        {paginatedItems.length === 0 ? (
          <div className="rounded-2xl border p-16 text-center shadow-sm animate-fade-in-up" style={{ animationDelay: '200ms', backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="mb-6 mx-auto w-20 h-20 rounded-full flex items-center justify-center animate-float" style={{ backgroundColor: 'var(--bg-overlay)' }}>
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="mb-3 text-2xl font-bold font-display tracking-wide" style={{ color: 'var(--text-primary)' }}>
              No books in this category
            </h3>
            <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
              Start adding books to your readlist
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold transition-all duration-300 relative overflow-hidden group/btn hover:-translate-y-1"
              style={{ backgroundColor: 'var(--accent)', color: 'white', boxShadow: '0 4px 14px 0 rgba(244, 63, 94, 0.39)' }}
            >
              <span className="relative z-10">Browse Library</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              {paginatedItems.map((item, index) => (
                <div key={item.id} className="group flex flex-col rounded-2xl p-4 card-hover animate-fade-in-up" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', animationDelay: `${(index % 10) * 50}ms` }}>
                  <Link href={`/ebooks/${item.ebookId}`} className="block mb-4 relative overflow-hidden rounded-xl aspect-[2/3]" aria-label={`View details for ${item.ebook.title}`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 duration-300" />
                    <Image
                      src={item.ebook.coverUrl || '/placeholder-book.jpg'}
                      alt={`${item.ebook.title} cover`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col">
                    <h3 className="mb-1 text-base font-bold font-display leading-tight line-clamp-2 transition-colors group-hover:text-[var(--accent)]" style={{ color: 'var(--text-primary)' }}>
                      {item.ebook.title}
                    </h3>
                    <p className="mb-4 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                      {item.ebook.author}
                    </p>

                    {/* Progress indicator */}
                    <div className="mt-auto mb-4">
                      {item.progress !== undefined && item.progress > 0 ? (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: 'var(--text-secondary)' }}>
                              {item.progress >= 100 ? 'Completed' : 'Reading'}
                            </span>
                            <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                              {Math.round(item.progress)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                            <div
                              className="h-full transition-all duration-500 rounded-full"
                              style={{
                                width: `${Math.min(item.progress, 100)}%`,
                                backgroundColor: item.progress >= 100 ? 'var(--text-primary)' : 'var(--accent)'
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: 'var(--text-secondary)' }}>Not Started</span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/ebooks/${item.ebookId}`}
                      className="flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 relative group/btn overflow-hidden"
                      style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--text-primary)' }}
                    >
                      <span className="relative z-10 transition-colors group-hover/btn:text-white">
                        {(item.progress || 0) >= 100 ? 'Read Again' : ((item.progress || 0) > 0 ? 'Continue Reading' : 'Start Reading')}
                      </span>
                      <div className="absolute inset-0 block opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'var(--accent)' }}></div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 py-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                  className="flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group border"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <svg className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      aria-label={`Go to page ${pageNum}`}
                      aria-current={isActive ? 'page' : undefined}
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-base font-bold transition-all duration-300 border"
                      style={{
                        backgroundColor: isActive ? 'var(--accent)' : 'var(--bg-surface)',
                        borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                        color: isActive ? 'white' : 'var(--text-secondary)',
                        boxShadow: isActive ? 'var(--shadow-accent)' : 'none'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                  className="flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed group border"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
