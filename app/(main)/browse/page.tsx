'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PricingModal from '@/components/PricingModal';

interface ReadingProgress {
  [bookId: string]: number;
}

// Note: You'll need to configure Supabase client or use your API
// This is a placeholder - replace with your actual data fetching method
const fetchEbooksFromAPI = async () => {
  const response = await fetch('/api/ebooks');
  if (!response.ok) throw new Error('Failed to fetch ebooks');
  return response.json();
};

interface Ebook {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  category: string;
  description: string;
  price?: number;
  isPremium?: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  isActive: boolean;
  _count?: {
    ebooks: number;
  };
}

export default function BrowsePage() {
  const { user } = useAuth();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Ebook | null>(null);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress>({});
  const [banners, setBanners] = useState<any[]>([]);
  const itemsPerPage = 12;
  const router = useRouter();

  // Get reading progress from localStorage
  const getReadingProgress = useCallback(() => {
    if (!user) return;
    
    try {
      const progress: ReadingProgress = {};
      const prefix = `reading-progress-${user.uid}-`;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const bookId = key.replace(prefix, '');
          const storageValue = localStorage.getItem(key);
          if (storageValue) {
            try {
              const parsed = JSON.parse(storageValue);
              if (parsed.progress) {
                progress[bookId] = parsed.progress;
              }
            } catch (e) {
              // Ignore
            }
          }
        }
      }
      
      setReadingProgress(progress);
    } catch (error) {
      console.error('Error reading progress:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchEbooks();
    fetchCategories();
    fetchBanners();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      // Only show active categories
      setCategories(data.categories.filter((cat: Category) => cat.isActive));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      if (response.ok) {
        const data = await response.json();
        setBanners(data.banners || []);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  useEffect(() => {
    if (user) {
      getReadingProgress();
    }
  }, [user, getReadingProgress]);

  const fetchEbooks = async () => {
    try {
      const data = await fetchEbooksFromAPI();
      console.log('API Response:', data);
      setEbooks(Array.isArray(data.ebooks) ? data.ebooks : []);
    } catch (error: any) {
      console.error('Error fetching ebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveSubscription = () => {
    // Check if user has active subscription
    // Replace with your actual subscription check logic
    return (user as any)?.subscriptionStatus === 'active';
  };

  const filteredEbooks = ebooks.filter(ebook => {
    const matchesCategory = !selectedCategory || ebook.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ebook.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || ebook.category === selectedGenre;
    const matchesPrice = !selectedPrice || 
      (selectedPrice === 'free' && !ebook.isPremium) ||
      (selectedPrice === 'premium' && ebook.isPremium);
    
    return matchesCategory && matchesSearch && matchesGenre && matchesPrice;
  });

  const handleBookClick = (e: React.MouseEvent, ebook: Ebook) => {
    // If book is premium and user doesn't have subscription, show pricing modal
    if (ebook.isPremium && !hasActiveSubscription()) {
      e.preventDefault();
      setSelectedBook(ebook);
      setShowPricingModal(true);
    }
  };

  const totalPages = Math.ceil(filteredEbooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEbooks = filteredEbooks.slice(startIndex, startIndex + itemsPerPage);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar skeleton */}
            <div className="space-y-4">
              <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>

            {/* Cards skeleton */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>
    );
  }

  // Main content
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Categories */}
            <div className="rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedCategory
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className={`h-2 w-2 rounded-full ${!selectedCategory ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-600'}`} />
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.name
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className={`h-2 w-2 rounded-full ${selectedCategory === category.name ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-600'}`} />
                      {category.name}
                      {category._count && category._count.ebooks > 0 && (
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{category._count.ebooks}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>


              {/* Upgrade Banner (Only for non-premium users) */}
              {user?.plan !== 'Premium' && (
                <div className="rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white shadow-lg">
                  <h3 className="text-lg font-bold mb-2">UPGRADE</h3>
                  <p className="text-sm mb-4 opacity-100 font-medium">Get Unlimited Access to Premium E-books</p>
                  <button 
                    onClick={() => setShowPricingModal(true)}
                    className="w-full rounded-lg bg-white text-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    Go Premium
                  </button>
                </div>
              )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Discover New Books</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Explore thousands of titles curated just for you.
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by title, author, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-12 pr-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">Genre</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">Language</option>
                <option value="en">English</option>
                <option value="id">Indonesian</option>
              </select>

              <div className="ml-auto text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredEbooks.length)} of {filteredEbooks.length} results
              </div>
            </div>

            {/* Books Grid */}
            {paginatedEbooks.length === 0 ? (
              <div className="rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-12 text-center">
                <div className="mb-4 text-5xl">📚</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">No books found</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                  {paginatedEbooks.map((ebook) => (
                    <div key={ebook.id} className="group relative">
                      {/* Reading Progress Badge */}
                      {readingProgress[ebook.id] > 0 && (
                        <div className="absolute top-2 right-2 z-10 rounded-full bg-black/70 backdrop-blur-sm px-3 py-1 border border-white/20 shadow-lg">
                          <p className="text-xs font-bold text-white tracking-wider">
                            {readingProgress[ebook.id] >= 100 ? 'FINISHED' : `${readingProgress[ebook.id]}% READ`}
                          </p>
                        </div>
                      )}

                      <Link 
                        href={`/ebooks/${ebook.id}`} 
                        className="block mb-3"
                        onClick={(e) => handleBookClick(e, ebook)}
                      >
                        <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-slate-700 shadow-md group-hover:shadow-xl transition-all duration-300">
                          <img
                            src={ebook.coverUrl || '/placeholder-book.jpg'}
                            alt={ebook.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>
                      
                      <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                        {ebook.title}
                      </h3>
                      <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">{ebook.author}</p>
                      
                      <Link
                        href={`/ebooks/${ebook.id}`}
                        className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-200"
                      >
                        Read Now
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
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {totalPages > 5 && (
                      <>
                        <span className="text-gray-500">...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                            currentPage === totalPages
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        bookTitle={selectedBook?.title || ''}
        redirectTo={selectedBook ? `/ebooks/${selectedBook.id}` : undefined}
      />
    </div>
  );
}
