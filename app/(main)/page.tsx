'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface Ebook {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  category: string;
  isPremium: boolean;
  pdfUrl?: string;
}

interface ReadingProgress {
  [bookId: string]: number;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  ctaLabel: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
  priority: number;
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

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [trendingBooks, setTrendingBooks] = useState<Ebook[]>([]);
  const [lastRead, setLastRead] = useState<Ebook[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [continueReading, setContinueReading] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Derived state for quick lookup
  const readingProgressMap = continueReading.reduce((acc, item) => ({...acc, [item.id]: item.progress}), {} as Record<string, number>);

  // Fetch continue reading list from API
  const fetchContinueReading = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/reading-progress', {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      
      if (response.ok) {
          const data = await response.json();
          // Map the API response structure to what the UI expects
          const formatted = data.map((item: any) => ({
              ...item.ebook,
              progress: item.progress
          }));
          setContinueReading(formatted);
      }
    } catch (error) {
        console.error("Error fetching continue reading:", error);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchBooks();
      fetchBanners();
      fetchCategories();
    }
  }, [loading, router]);

  useEffect(() => {
    if (user && !loading) {
        fetchContinueReading();
    }
  }, [user, loading]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    // Auto-scroll every 5 seconds
    const autoScroll = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(autoScroll);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      if (!response.ok) throw new Error('Failed to fetch banners');
      
      const data = await response.json();
      setBanners(data.banners || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/ebooks?limit=10');
      if (!response.ok) throw new Error('Failed to fetch ebooks');
      
      const data = await response.json();
      if (data.ebooks) {
        setTrendingBooks(data.ebooks.slice(0, 6));
        setLastRead(data.ebooks.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      setCategories(data.categories.filter((cat: Category) => cat.isActive));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
          <div className="h-10 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 animate-pulse">
                <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-700 mb-4" />
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700 mb-2" />
                <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Banner Carousel */}
        {banners.length > 0 ? (
          <div className="relative mb-12 overflow-hidden rounded-2xl">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {banners.map((banner) => (
                  <div key={banner.id} className="relative min-w-0 flex-[0_0_100%]">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-10 text-white shadow-2xl transition-all duration-300">
                      {/* Background Image */}
                      {banner.imageUrl && (
                        <div className="absolute inset-0">
                          <img 
                            src={banner.imageUrl} 
                            alt={banner.title}
                            className="h-full w-full object-cover opacity-30"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50"></div>
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="relative z-10 max-w-2xl">
                        <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-4">
                          Featured
                        </span>
                        <h2 className="mb-2 text-4xl font-bold leading-tight lg:text-5xl">
                          {banner.title}
                        </h2>
                        <p className="mb-6 text-xl text-gray-300 leading-relaxed">
                          {banner.subtitle}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <Link
                            href={banner.ctaLink || '/pricing'}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold hover:bg-blue-700 transition-colors"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                            {banner.ctaLabel || 'Learn More'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === selectedIndex 
                        ? 'w-8 bg-white' 
                        : 'w-2 bg-white/50 hover:bg-white/75'
                    }`}
                    onClick={() => emblaApi?.scrollTo(index)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Fallback static banner when no banners in database
          <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-10 text-white shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-blue-500/20 to-transparent"></div>
            </div>
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-4">
                Editor's Choice
              </span>
              <h2 className="mb-2 text-4xl font-bold leading-tight lg:text-5xl">
                Welcome to Ebookin
              </h2>
              <h3 className="mb-4 text-3xl font-bold italic text-blue-400 lg:text-4xl">
                Your Digital Library
              </h3>
              <p className="mb-6 text-base leading-relaxed text-gray-300">
                Discover thousands of ebooks across all genres.<br/>
                Start your reading journey today with our Premium membership.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold hover:bg-blue-700"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Continue Reading Section */}
        {continueReading.length > 0 && (
          <section className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
                <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Continue Reading
              </h3>
              <Link href="/readlist" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                View all activity
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {continueReading.map((book) => (
                <Link key={book.id} href={`/ebooks/${book.id}`} className="group">
                  <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
                    <div className="absolute right-2 top-2 z-10 rounded bg-white/95 dark:bg-slate-800/95 px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm backdrop-blur transition-colors">
                      {Math.round(book.progress)}% READ
                    </div>
                    <div className="aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500">
                          <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-slate-700">
                      <div 
                        className="h-full bg-blue-600 transition-all" 
                        style={{ width: `${book.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <h4 className="mt-2 line-clamp-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{book.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{book.author}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending Books Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
              <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Trending Books
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {trendingBooks.length > 0 ? trendingBooks.map((book) => {
              const rating = (Math.random() * 1 + 4).toFixed(1);
              const reviews = Math.floor(Math.random() * 5000) + 500;
              return (
                <Link key={book.id} href={`/ebooks/${book.id}`} className="group">
                  <div className="overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-sm transition-transform hover:scale-105 hover:shadow-md">
                    <div className="aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 relative">
                      {readingProgressMap[book.id] > 0 && (
                        <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md border border-white/20 shadow-lg">
                          <p className="text-[10px] font-bold text-white tracking-wider">
                            {readingProgressMap[book.id]}% READ
                          </p>
                        </div>
                      )}
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500">
                          <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <h4 className="mt-2 line-clamp-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{book.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{book.author}</p>
                  <div className="mt-1 flex items-center gap-1">
                    <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{rating}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({reviews})</span>
                  </div>
                </Link>
              );
            }) : (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className="overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                    <div className="aspect-[3/4] w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                      <svg className="h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2 h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="mt-1 h-3 bg-gray-100 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recommended Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">Recommended for you</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">Based on your recent reads in Philosophy and Sci-Fi</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(lastRead.length > 0 ? lastRead.slice(0, 3) : Array.from({ length: 3 })).map((book: any, index) => (
              <div key={book?.id || index} className="flex gap-4 rounded-lg bg-white dark:bg-slate-800 p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-200 dark:bg-slate-700 transition-colors">
                  {book?.id && readingProgressMap[book.id] > 0 && (
                    <div className="absolute top-1 right-1 z-10 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded border border-white/20 shadow-sm">
                      <p className="text-[9px] font-bold text-white">
                        {readingProgressMap[book.id]}%
                      </p>
                    </div>
                  )}
                  {book?.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors">{book?.title || 'Sample Book Title'}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{book?.author || 'Author Name'}</p>
                  <div className="mt-1 flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <Link
                    href={book?.id ? `/ebooks/${book.id}` : '/register'}
                    className="mt-auto text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    GET BOOK →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Explore by Category
            </h3>
            <Link href="/browse" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              View all categories
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category, index) => {
              const colorSchemes = [
                { color: 'from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30', textColor: 'text-blue-700 dark:text-blue-400', borderColor: 'border-blue-100/50 dark:border-blue-800/50', icon: '✨' },
                { color: 'from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30', textColor: 'text-green-700 dark:text-green-400', borderColor: 'border-green-100/50 dark:border-green-800/50', icon: '🔬' },
                { color: 'from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/30', textColor: 'text-yellow-700 dark:text-yellow-400', borderColor: 'border-yellow-100/50 dark:border-yellow-800/50', icon: '🏛️' },
                { color: 'from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30', textColor: 'text-purple-700 dark:text-purple-400', borderColor: 'border-purple-100/50 dark:border-purple-800/50', icon: '🔍' },
                { color: 'from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/30', textColor: 'text-pink-700 dark:text-pink-400', borderColor: 'border-pink-100/50 dark:border-pink-800/50', icon: '👑' },
                { color: 'from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30', textColor: 'text-indigo-700 dark:text-indigo-400', borderColor: 'border-indigo-100/50 dark:border-indigo-800/50', icon: '👤' },
                { color: 'from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30', textColor: 'text-orange-700 dark:text-orange-400', borderColor: 'border-orange-100/50 dark:border-orange-800/50', icon: '🧠' },
              ];
              const scheme = colorSchemes[index % colorSchemes.length];
              
              return (
                <Link
                  key={category.id}
                  href={`/browse?category=${encodeURIComponent(category.name)}`}
                  className={`flex flex-col items-center justify-center gap-3 rounded-xl bg-gradient-to-br ${scheme.color} border ${scheme.borderColor} p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-md`}
                >
                  <span className="text-4xl">{scheme.icon}</span>
                  <span className={`text-sm font-semibold ${scheme.textColor}`}>{category.name}</span>
                  {category._count && category._count.ebooks > 0 && (
                    <span className="text-xs opacity-70">{category._count.ebooks} books</span>
                  )}
                </Link>
              );
            })}
            <Link
              href="/browse"
              className="flex flex-col items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800 border border-gray-200/50 dark:border-slate-700/50 p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <span className="text-4xl">⋯</span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">View All</span>
            </Link>
          </div>
        </section>
    </div>
  );
}
