'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
          <div className="h-10 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-4 animate-pulse">
                <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-700 mb-4" />
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700 mb-2" />
                <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Readlist</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You have {filteredWishlist.length} books in your list
          </p>
        </div>

        {/* Tabs & Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 border-b border-gray-200 dark:border-slate-700 w-full sm:w-auto">
            <button
              onClick={() => { setActiveTab('WANT_TO_READ'); setCurrentPage(1); }}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'WANT_TO_READ'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Want to Read
            </button>
            <button
              onClick={() => { setActiveTab('FINISHED'); setCurrentPage(1); }}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'FINISHED'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Finished
            </button>
          </div>

          <button className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
        </div>

        {/* Books Grid */}
        {paginatedItems.length === 0 ? (
          <div className="rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-12 text-center">
            <div className="mb-4 text-5xl">📚</div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              No books in this category
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Start adding books to your readlist
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-200"
            >
              Browse Library
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
              {paginatedItems.map((item) => (
                <div key={item.id} className="group">
                  <Link href={`/ebooks/${item.ebookId}`} className="block mb-3">
                    <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-slate-700 shadow-md group-hover:shadow-xl transition-all duration-300">
                      <img
                        src={item.ebook.coverUrl || '/placeholder-book.jpg'}
                        alt={item.ebook.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  
                  <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                    {item.ebook.title}
                  </h3>
                  <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">{item.ebook.author}</p>
                  
                  {/* Progress indicator */}
                  {item.progress !== undefined && item.progress > 0 && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {item.progress >= 100 ? 'Completed' : `${Math.round(item.progress)}% read`}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            item.progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                          } transition-all duration-300`}
                          style={{ width: `${Math.min(item.progress, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Link
                    href={`/ebooks/${item.ebookId}`}
                    className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-200"
                  >
                    {(item.progress || 0) >= 100 ? 'Read Again' : 'Read Now'}
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
    </div>
  );
}
