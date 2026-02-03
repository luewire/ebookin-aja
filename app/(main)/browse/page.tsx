'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PricingModal from '@/components/PricingModal';
import { hasActiveSubscription } from '@/lib/subscription';

interface Ebook {
  id: string;
  title: string;
  author: string;
  cover: string;
  category: string;
  description: string;
  price?: number;
  is_premium?: boolean;
}

const categories = [
  'Fiction',
  'Non-Fiction',
  'Mystery & Thriller',
  'Science Fiction',
  'Fantasy',
  'Biography',
  'Philosophy',
  'History',
  'Business & Economics',
  'Health & Wellness'
];

export default function BrowsePage() {
  const { user } = useAuth();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Ebook | null>(null);
  const itemsPerPage = 12;
  const router = useRouter();

  useEffect(() => {
    fetchEbooks();
  }, []);

  const fetchEbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEbooks(data || []);
    } catch (error: any) {
      console.error('Error fetching ebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEbooks = ebooks.filter(ebook => {
    const matchesCategory = !selectedCategory || ebook.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ebook.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || ebook.category === selectedGenre;
    const matchesPrice = !selectedPrice || 
      (selectedPrice === 'free' && !ebook.is_premium) ||
      (selectedPrice === 'premium' && ebook.is_premium);
    
    return matchesCategory && matchesSearch && matchesGenre && matchesPrice;
  });

  const handleBookClick = (e: React.MouseEvent, ebook: Ebook) => {
    // If book is premium and user doesn't have subscription, show pricing modal
    if (ebook.is_premium && !hasActiveSubscription()) {
      e.preventDefault();
      setSelectedBook(ebook);
      setShowPricingModal(true);
    }
  };

  const totalPages = Math.ceil(filteredEbooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEbooks = filteredEbooks.slice(startIndex, startIndex + itemsPerPage);

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
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className={`h-2 w-2 rounded-full ${selectedCategory === category ? 'bg-blue-600' : 'bg-gray-400 dark:bg-gray-600'}`} />
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div className="rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Format
                </h3>
                <div className="space-y-2">
                  <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                    E-book
                  </button>
                  <button className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                    <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-600" />
                    Audiobook
                  </button>
                </div>
              </div>

              {/* Upgrade Banner */}
              <div className="rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white">
                <h3 className="text-lg font-bold mb-2">UPGRADE</h3>
                <p className="text-sm mb-4 opacity-90">Unlimited Reading</p>
                <button className="w-full rounded-lg bg-white text-blue-600 px-4 py-2 text-sm font-semibold hover:shadow-lg transition-all">
                  Go Premium
                </button>
              </div>
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
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="">Price</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
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
                      {/* Badge */}
                      {ebook.is_premium && (
                        <div className="absolute top-2 left-2 z-10 rounded-full bg-purple-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                          PREMIUM
                        </div>
                      )}
                      {!ebook.is_premium && (
                        <div className="absolute top-2 left-2 z-10 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                          FREE
                        </div>
                      )}

                      <Link 
                        href={`/ebooks/${ebook.id}`} 
                        className="block mb-3"
                        onClick={(e) => handleBookClick(e, ebook)}
                      >
                        <div className="aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-slate-700 shadow-md group-hover:shadow-xl transition-all duration-300">
                          <img
                            src={ebook.cover || '/placeholder-book.jpg'}
                            alt={ebook.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>
                      
                      <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                        {ebook.title}
                      </h3>
                      <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">{ebook.author}</p>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {ebook.is_premium ? `$${ebook.price || 12.99}` : 'FREE'}
                        </span>
                      </div>

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
      </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        bookTitle={selectedBook?.title}
        redirectTo={selectedBook ? `/ebooks/${selectedBook.id}` : undefined}
      />
  );
}
