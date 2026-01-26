'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import useEmblaCarousel from 'embla-carousel-react';

interface Ebook {
  id: string;
  title: string;
  author: string;
  cover: string;
  category: string;
  status: string;
  view_count: number;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta_label: string;
  cta_link: string;
  image_url: string;
  order_position: number;
}

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [trendingBooks, setTrendingBooks] = useState<Ebook[]>([]);
  const [lastRead, setLastRead] = useState<Ebook[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, []);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!loading) {
      fetchBooks();
      fetchBanners();
    }
  }, [user, loading, router]);

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
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order_position', { ascending: true });
      
      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const { data } = await supabase
        .from('ebooks')
        .select('*')
        .eq('status', 'Published')
        .order('view_count', { ascending: false })
        .limit(10);
      
      if (data) {
        setTrendingBooks(data.slice(0, 6));
        setLastRead(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Banner Carousel */}
        {banners.length > 0 ? (
          <div className="relative mb-12 overflow-hidden rounded-2xl">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {banners.map((banner) => (
                  <div key={banner.id} className="relative min-w-0 flex-[0_0_100%]">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-10 text-white shadow-2xl transition-all duration-300">
                      {/* Background Image */}
                      {banner.image_url && (
                        <div className="absolute inset-0">
                          <img 
                            src={banner.image_url} 
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
                            href={banner.cta_link}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold hover:bg-blue-700 transition-colors"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                            {banner.cta_label}
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

        {/* Last Read Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors">
              <svg className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last Read
            </h3>
            <Link href="/profile" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              View all activity
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {lastRead.length > 0 ? lastRead.map((book) => {
              const progress = Math.floor(Math.random() * 40) + 30;
              return (
                <Link key={book.id} href={`/ebooks/${book.id}`} className="group">
                  <div className="relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
                    <div className="absolute right-2 top-2 z-10 rounded bg-white/95 dark:bg-slate-800/95 px-2 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm backdrop-blur transition-colors">
                      {progress}% READ
                    </div>
                    <div className="aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      {book.cover ? (
                        <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                      <div 
                        className="h-full bg-blue-600 transition-all" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <h4 className="mt-2 line-clamp-1 text-sm font-semibold text-gray-900">{book.title}</h4>
                  <p className="text-xs text-gray-600">{book.author}</p>
                </Link>
              );
            }) : (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="group">
                  <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">
                    <div className="aspect-[3/4] w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg className="h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2 h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="mt-1 h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))
            )}
          </div>
        </section>

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
                    <div className="aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600">
                      {book.cover ? (
                        <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
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
                <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-200 dark:bg-slate-700 transition-colors">
                  {book?.cover ? (
                    <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
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
            <Link href="/profile" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              View all categories
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[
              { name: 'Fiction', icon: '✨', color: 'from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30', textColor: 'text-blue-700 dark:text-blue-400', borderColor: 'border-blue-100/50 dark:border-blue-800/50' },
              { name: 'Science', icon: '🔬', color: 'from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30', textColor: 'text-green-700 dark:text-green-400', borderColor: 'border-green-100/50 dark:border-green-800/50' },
              { name: 'History', icon: '🏛️', color: 'from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/30', textColor: 'text-yellow-700 dark:text-yellow-400', borderColor: 'border-yellow-100/50 dark:border-yellow-800/50' },
              { name: 'Mystery', icon: '🔍', color: 'from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30', textColor: 'text-purple-700 dark:text-purple-400', borderColor: 'border-purple-100/50 dark:border-purple-800/50' },
              { name: 'Fantasy', icon: '👑', color: 'from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/30', textColor: 'text-pink-700 dark:text-pink-400', borderColor: 'border-pink-100/50 dark:border-pink-800/50' },
              { name: 'Biography', icon: '👤', color: 'from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30', textColor: 'text-indigo-700 dark:text-indigo-400', borderColor: 'border-indigo-100/50 dark:border-indigo-800/50' },
              { name: 'Philosophy', icon: '🧠', color: 'from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30', textColor: 'text-orange-700 dark:text-orange-400', borderColor: 'border-orange-100/50 dark:border-orange-800/50' },
              { name: 'View All', icon: '⋯', color: 'from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800', textColor: 'text-gray-700 dark:text-gray-300', borderColor: 'border-gray-200/50 dark:border-slate-700/50' },
            ].map((category) => (
              <Link
                key={category.name}
                href="/profile"
                className={`flex flex-col items-center justify-center gap-3 rounded-xl bg-gradient-to-br ${category.color} border ${category.borderColor} p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-md`}
              >
                <span className="text-4xl">{category.icon}</span>
                <span className={`text-sm font-semibold ${category.textColor}`}>{category.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-6">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <Image src="/logo.svg" alt="Ebookin Logo" width={48} height={48} className="h-12 w-12 invert dark:invert-0 transition-all duration-300 group-hover:scale-110 group-hover:brightness-125 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" priority />
            </Link>

            {/* Navigation Links */}
            <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              <Link href="/" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors tracking-wide uppercase">
                About
              </Link>
              <Link href="/" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors tracking-wide uppercase">
                Privacy Policy
              </Link>
              <Link href="/" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors tracking-wide uppercase">
                Terms of Service
              </Link>
              <Link href="/" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors tracking-wide uppercase">
                Contact
              </Link>
            </nav>

            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-all duration-200 hover:scale-110">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 dark:hover:text-blue-500 transition-all duration-200 hover:scale-110">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </Link>
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-all duration-200 hover:scale-110">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-gray-200 dark:border-slate-800 pt-6">
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 tracking-wider uppercase">
              © 2026 EBOOKIN AJA. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
