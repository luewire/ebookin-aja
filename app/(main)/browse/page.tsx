'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
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
  avgRating?: number;
  ratingCount?: number;
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
  const [searchFocused, setSearchFocused] = useState(false);
  const itemsPerPage = 12;
  const router = useRouter();

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '400px', // trigger 400px before reaching the bottom
  });

  // When intersection observer triggers, load more
  useEffect(() => {
    if (inView) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [inView]);

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

  // Instead of limiting by page, we slice from 0 to current Items limit
  const currentLimit = currentPage * itemsPerPage;
  const paginatedEbooks = filteredEbooks.slice(0, currentLimit);
  const hasMore = currentLimit < filteredEbooks.length;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar skeleton */}
            <div className="hidden lg:block space-y-4">
              <div className="h-14 rounded-xl skeleton animate-pulse" />
              <div className="space-y-2 mt-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 rounded-lg skeleton animate-pulse" />
                ))}
              </div>
            </div>

            {/* Cards skeleton */}
            <div className="lg:col-span-3">
              <div className="h-12 w-64 rounded-xl skeleton mt-2 mb-8 animate-pulse" />
              <div className="h-12 w-full rounded-xl skeleton mb-8 animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-2xl p-4 skeleton animate-pulse">
                    <div className="aspect-[2/3] w-full rounded-xl bg-[var(--bg-elevated)] mb-4" />
                    <div className="h-4 w-3/4 rounded bg-[var(--bg-elevated)] mb-2" />
                    <div className="h-3 w-1/2 rounded bg-[var(--bg-elevated)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6 animate-fade-in-up">
            {/* Categories */}
            <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <h3 className="flex items-center gap-2 text-lg font-bold font-display mb-6" style={{ color: 'var(--text-primary)' }}>
                <svg className="h-5 w-5" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 relative group overflow-hidden"
                  style={{
                    backgroundColor: !selectedCategory ? 'var(--accent-glow)' : 'transparent',
                    color: !selectedCategory ? 'var(--accent)' : 'var(--text-secondary)'
                  }}
                >
                  {!selectedCategory && <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: 'var(--accent)' }} />}
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: !selectedCategory ? 'var(--accent)' : 'var(--text-tertiary)' }} />
                  <span className="font-medium group-hover:text-[var(--text-primary)] transition-colors">All Categories</span>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-300 relative group overflow-hidden"
                    style={{
                      backgroundColor: selectedCategory === category.name ? 'var(--accent-glow)' : 'transparent',
                      color: selectedCategory === category.name ? 'var(--accent)' : 'var(--text-secondary)'
                    }}
                  >
                    {selectedCategory === category.name && <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: 'var(--accent)' }} />}
                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: selectedCategory === category.name ? 'var(--accent)' : 'var(--text-tertiary)' }} />
                    <span className="font-medium group-hover:text-[var(--text-primary)] transition-colors">{category.name}</span>
                    {category._count && category._count.ebooks > 0 && (
                      <span className="ml-auto text-xs opacity-70 px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-overlay)' }}>{category._count.ebooks}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>


            {/* Upgrade Banner (Only for non-premium users) */}
            {user?.plan !== 'Premium' && (
              <div className="rounded-2xl relative overflow-hidden p-6 shadow-accent animate-fade-in-up" style={{ background: 'linear-gradient(135deg, var(--accent-muted) 0%, var(--bg-surface) 100%)', border: '1px solid var(--border-accent)' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] rounded-full filter blur-[60px] opacity-20 -mr-10 -mt-10"></div>
                <h3 className="text-lg font-bold font-display mb-2" style={{ color: 'var(--text-primary)' }}>UPGRADE</h3>
                <p className="text-sm mb-5 font-medium" style={{ color: 'var(--text-secondary)' }}>Get Unlimited Access to Premium E-books</p>
                <button
                  onClick={() => setShowPricingModal(true)}
                  className="w-full rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 relative group overflow-hidden"
                  style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                >
                  <span className="relative z-10">Go Premium</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-wide mb-3" style={{ color: 'var(--text-primary)' }}>Discover New Books</h1>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
              Explore thousands of titles curated just for you.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-[var(--accent)] opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500"></div>
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300" style={{ color: searchFocused ? 'var(--accent)' : 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by title, author, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full rounded-2xl pl-14 pr-6 py-4 text-base transition-all duration-300 outline-none relative z-10"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: searchFocused ? '1px solid var(--accent)' : '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  boxShadow: searchFocused ? '0 0 0 4px var(--accent-glow)' : 'var(--shadow-sm)'
                }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="rounded-xl px-5 py-3 text-sm font-medium transition-colors outline-none cursor-pointer appearance-none pr-10"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${encodeURIComponent('#5C5B6E')}' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px'
              }}
            >
              <option value="">All Genres</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="rounded-xl px-5 py-3 text-sm font-medium transition-colors outline-none cursor-pointer appearance-none pr-10"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${encodeURIComponent('#5C5B6E')}' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px'
              }}
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="id">Indonesian</option>
            </select>

            <div className="ml-auto text-sm font-medium px-4 py-2 rounded-xl" style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--text-secondary)' }}>
              Showing <span style={{ color: 'var(--text-primary)' }}>{paginatedEbooks.length}</span> of <span style={{ color: 'var(--text-primary)' }}>{filteredEbooks.length}</span>
            </div>
          </div>

          {/* Books Grid */}
          {paginatedEbooks.length === 0 ? (
            <div className="rounded-2xl border p-16 text-center shadow-sm" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
              <div className="mb-6 mx-auto w-20 h-20 rounded-full flex items-center justify-center animate-float" style={{ backgroundColor: 'var(--bg-overlay)' }}>
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="mb-3 text-2xl font-bold font-display tracking-wide" style={{ color: 'var(--text-primary)' }}>No books found</h3>
              <p className="text-base" style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or search query to find what you're looking for.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {paginatedEbooks.map((ebook, index) => (
                  <div
                    key={ebook.id}
                    className="group flex flex-col rounded-2xl p-4 card-hover animate-fade-in-up"
                    style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', animationDelay: `${index * 50}ms` }}
                  >
                    {/* Reading Progress Badge & Premium Badge */}
                    <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 items-end">
                      {ebook.isPremium ? (
                        <div className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider text-white shadow-lg backdrop-blur-md" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #fb7185 100%)' }}>
                          PREMIUM
                        </div>
                      ) : (
                        <div className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider text-white shadow-lg backdrop-blur-md" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)' }}>
                          FREE
                        </div>
                      )}
                      {readingProgress[ebook.id] > 0 && (
                        <div className="rounded-full px-3 py-1 border shadow-lg backdrop-blur-md" style={{ backgroundColor: 'rgba(13, 13, 18, 0.75)', borderColor: 'var(--border-accent)' }}>
                          <p className="text-[10px] font-bold tracking-wider" style={{ color: 'var(--accent-soft)' }}>
                            {readingProgress[ebook.id] >= 100 ? 'FINISHED' : `${readingProgress[ebook.id]}% READ`}
                          </p>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/ebooks/${ebook.id}`}
                      className="block mb-4 relative overflow-hidden rounded-xl aspect-[2/3]"
                      onClick={(e) => handleBookClick(e, ebook)}
                    >
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 duration-300" />
                      <img
                        src={ebook.coverUrl || '/placeholder-book.jpg'}
                        alt={ebook.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col">
                      <h3 className="mb-1 text-base font-bold font-display leading-tight line-clamp-2 transition-colors group-hover:text-[var(--accent)]" style={{ color: 'var(--text-primary)' }}>
                        {ebook.title}
                      </h3>
                      <p className="mb-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                        {ebook.author}
                      </p>

                      {/* Rating Summary */}
                      <div className="flex items-center gap-1.5 mt-auto mb-4">
                        <svg className="h-4 w-4 fill-current" style={{ color: 'var(--accent)' }} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                          {ebook.avgRating ? ebook.avgRating.toFixed(1) : '0.0'}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          ({ebook.ratingCount || 0})
                        </span>
                      </div>

                      <Link
                        href={`/ebooks/${ebook.id}`}
                        className="flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 relative group/btn overflow-hidden"
                        style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--text-primary)' }}
                      >
                        <span className="relative z-10 transition-colors group-hover/btn:text-white">Read Now</span>
                        <div className="absolute inset-0 block opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'var(--accent)' }}></div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Infinite Scroll Trigger */}
              {hasMore && (
                <div ref={ref} className="flex justify-center items-center py-10 w-full mt-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
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
