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
  avgRating?: number;
  ratingCount?: number;
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
  imagePosition: number;
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

interface HomeClientProps {
  initialBanners: Banner[];
  initialTrendingBooks: Ebook[];
  initialFreeBooks: Ebook[];
  initialPremiumBooks: Ebook[];
  initialCategories: Category[];
}

export default function HomeClient({ initialBanners, initialTrendingBooks, initialFreeBooks, initialPremiumBooks, initialCategories }: HomeClientProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [trendingBooks, setTrendingBooks] = useState<Ebook[]>(initialTrendingBooks);
  const freeBooks = initialFreeBooks;
  const premiumBooks = initialPremiumBooks;
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [continueReading, setContinueReading] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const [recommendations, setRecommendations] = useState<Ebook[]>([]);
  const [recommendationGenres, setRecommendationGenres] = useState<string[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  const readingProgressMap = continueReading.reduce((acc, item) => ({ ...acc, [item.id]: item.progress }), {} as Record<string, number>);

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const headers: Record<string, string> = {};
      if (user) {
        try {
          const token = await user.getIdToken();
          headers['Authorization'] = `Bearer ${token}`;
        } catch { /* ignore if token error */ }
      }
      const response = await fetch('/api/recommendations', { headers });
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.books || []);
        setRecommendationGenres(data.topGenres || []);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

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
      fetchRecommendations();
    }
  }, [loading, router, user]);

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

    const autoScroll = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(autoScroll);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);



  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
          <div className="skeleton h-[300px] rounded-2xl" />
          <div className="skeleton h-8 w-48 rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="skeleton aspect-[3/4] rounded-xl" />
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ═══ Hero Banner Carousel ═══ */}
      {banners.length > 0 ? (
        <div className="relative mb-12 overflow-hidden rounded-2xl">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {banners.map((banner) => (
                <div key={banner.id} className="relative min-w-0 flex-[0_0_100%]">
                  <div className="relative overflow-hidden rounded-2xl p-10 text-white shadow-2xl" style={{ backgroundColor: 'var(--bg-surface)', minHeight: '320px' }}>
                    {/* Background Image */}
                    {banner.imageUrl && (
                      <div className="absolute inset-0">
                        <Image
                          src={banner.imageUrl}
                          alt={banner.title}
                          fill
                          className="object-cover opacity-25"
                          style={{ objectPosition: `center ${banner.imagePosition || 50}%` }}
                          priority={selectedIndex === 0}
                          sizes="100vw"
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--bg-base) 30%, transparent 100%)' }}></div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="relative z-10 max-w-2xl">
                      <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-4" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-dot"></span>
                        Featured
                      </span>
                      <h2 className="mb-3 text-4xl font-bold font-display leading-tight lg:text-5xl" style={{ color: 'var(--text-primary)' }}>
                        {banner.title}
                      </h2>
                      <p className="mb-6 text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {banner.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={banner.ctaLink || '/pricing'}
                          className="btn-primary flex items-center gap-2 text-sm"
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

          {/* Navigation Dots — Rose */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  className="h-2 rounded-full transition-all"
                  aria-label={`Go to slide ${index + 1}`}
                  style={{
                    width: index === selectedIndex ? '32px' : '8px',
                    backgroundColor: index === selectedIndex ? 'var(--accent)' : 'var(--text-tertiary)',
                  }}
                  onClick={() => emblaApi?.scrollTo(index)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        // Fallback static banner
        <div className="relative mb-12 overflow-hidden rounded-2xl p-10 shadow-2xl" style={{ backgroundColor: 'var(--bg-surface)', minHeight: '320px' }}>
          {/* Abstract rose shape */}
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-10" style={{ background: 'linear-gradient(to left, var(--accent), transparent)' }}></div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide mb-4" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-dot"></span>
              Editor&apos;s Choice
            </span>
            <h2 className="mb-2 text-4xl font-bold font-display leading-tight lg:text-5xl" style={{ color: 'var(--text-primary)' }}>
              Welcome to Ebookin
            </h2>
            <h3 className="mb-4 text-3xl font-bold italic font-display lg:text-4xl" style={{ color: 'var(--accent)' }}>
              Your Digital Library
            </h3>
            <p className="mb-6 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Discover thousands of ebooks across all genres.<br />
              Start your reading journey today with our Premium membership.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="btn-primary flex items-center gap-2 text-sm">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Continue Reading ═══ */}
      {continueReading.length > 0 && (
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
              <svg className="h-6 w-6" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Continue Reading
            </h3>
            <Link href="/readlist" className="text-sm font-medium transition-colors" style={{ color: 'var(--accent)' }}>
              View all activity
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {continueReading.map((book) => (
              <Link key={book.id} href={`/ebooks/${book.id}`} className="group">
                <div className="relative overflow-hidden rounded-xl card-hover" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <div className="absolute right-2 top-2 z-10 rounded-lg px-2 py-1 text-xs font-semibold backdrop-blur" style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'var(--accent-soft)' }}>
                    {Math.round(book.progress)}% READ
                  </div>
                  <div className="aspect-[3/4] w-full overflow-hidden relative" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    {book.coverUrl ? (
                      <Image
                        src={book.coverUrl}
                        alt={`${book.title} cover`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center" style={{ color: 'var(--text-tertiary)' }}>
                        <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* Rose progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: 'var(--bg-overlay)' }}>
                    <div className="h-full transition-all" style={{ width: `${book.progress}%`, backgroundColor: 'var(--accent)' }}></div>
                  </div>
                </div>
                <h4 className="mt-2 line-clamp-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{book.title}</h4>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{book.author}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ Trending Books ═══ */}
      <section className="mb-12">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>TRENDING</span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, var(--accent-muted), transparent)' }}></div>
          </div>
          <h3 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Popular Reads</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trendingBooks.length > 0 ? trendingBooks.map((book, index) => (
            <div
              key={book.id}
              className="group flex flex-col rounded-2xl p-4 card-hover animate-fade-in-up"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 items-end">
                {book.isPremium ? (
                  <div className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider text-white shadow-lg backdrop-blur-md" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #fb7185 100%)' }}>
                    PREMIUM
                  </div>
                ) : (
                  <div className="rounded-full px-3 py-1 text-[10px] font-bold tracking-wider text-white shadow-lg backdrop-blur-md" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)' }}>
                    FREE
                  </div>
                )}
                {readingProgressMap[book.id] > 0 && (
                  <div className="rounded-full px-3 py-1 border shadow-lg backdrop-blur-md" style={{ backgroundColor: 'rgba(13, 13, 18, 0.75)', borderColor: 'var(--border-accent)' }}>
                    <p className="text-[10px] font-bold tracking-wider" style={{ color: 'var(--accent-soft)' }}>
                      {readingProgressMap[book.id] >= 100 ? 'FINISHED' : `${readingProgressMap[book.id]}% READ`}
                    </p>
                  </div>
                )}
              </div>

              <Link
                href={`/ebooks/${book.id}`}
                className="block mb-4 relative overflow-hidden rounded-xl aspect-[2/3]"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 duration-300" />
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={`${book.title} cover`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-tertiary)' }}>
                    <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
              </Link>

              <div className="flex-1 flex flex-col">
                <h3 className="mb-1 text-base font-bold font-display leading-tight line-clamp-2 transition-colors group-hover:text-[var(--accent)]" style={{ color: 'var(--text-primary)' }}>
                  {book.title}
                </h3>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  {book.author}
                </p>

                <div className="flex items-center gap-1.5 mt-auto mb-4">
                  <svg className="h-4 w-4 fill-current" style={{ color: 'var(--accent)' }} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {book.avgRating ? book.avgRating.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    ({book.ratingCount || 0})
                  </span>
                </div>

                <Link
                  href={`/ebooks/${book.id}`}
                  className="flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 relative group/btn overflow-hidden"
                  style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--text-primary)' }}
                >
                  <span className="relative z-10 transition-colors group-hover/btn:text-white">Read Now</span>
                  <div className="absolute inset-0 block opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'var(--accent)' }}></div>
                </Link>
              </div>
            </div>
          )) : (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="overflow-hidden rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <div className="aspect-[3/4] w-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    <svg className="h-16 w-16" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 skeleton h-4 w-3/4 rounded"></div>
                <div className="mt-1 skeleton h-3 w-1/2 rounded"></div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ═══ Recommended ═══ */}
      <section className="mb-12">
        <div className="mb-6">
          <h3 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Recommended for you</h3>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            {recommendationGenres.length > 0
              ? `Based on your recent reads in ${recommendationGenres.join(' and ')}`
              : 'Popular books you might like'}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loadingRecommendations
            ? Array.from({ length: 6 }).map((_, index) => (
              <div key={`loading-rec-${index}`} className="flex gap-4 rounded-xl p-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg skeleton" />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))
            : recommendations.map((book: any, index) => (
              <div key={book?.id || index} className="flex gap-4 rounded-xl p-4 transition-all duration-300 card-hover" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                  {book?.id && readingProgressMap[book.id] > 0 && (
                    <div className="absolute top-1 right-1 z-10 px-1.5 py-0.5 rounded border shadow-sm" style={{ backgroundColor: 'rgba(0,0,0,0.6)', borderColor: 'var(--border)' }}>
                      <p className="text-[9px] font-bold" style={{ color: 'var(--accent-soft)' }}>
                        {readingProgressMap[book.id]}%
                      </p>
                    </div>
                  )}
                  {book?.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center" style={{ color: 'var(--text-tertiary)' }}>
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{book?.title || 'Sample Book Title'}</h4>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{book?.author || 'Author Name'}</p>
                  <div className="mt-1 flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="h-3 w-3" style={{ color: star <= (book?.avgRating || 0) ? '#eab308' : 'var(--text-tertiary)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <Link
                    href={book?.id ? `/ebooks/${book.id}` : '/register'}
                    className="mt-auto text-sm font-semibold transition-colors"
                    style={{ color: 'var(--accent)' }}
                  >
                    GET BOOK →
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ═══ Free Books ═══ */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold tracking-wider text-white" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)' }}>
              FREE
            </span>
            Free Books
          </h3>
          <Link href="/browse" className="text-sm font-medium transition-colors" style={{ color: 'var(--accent)' }}>
            View all free
          </Link>
        </div>
        {freeBooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {freeBooks.map((book) => (
              <Link key={book.id} href={`/ebooks/${book.id}`} className="group">
                <div className="overflow-hidden rounded-xl card-hover" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <div className="aspect-[3/4] w-full overflow-hidden relative" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    {book.coverUrl ? (
                      <Image
                        src={book.coverUrl}
                        alt={`${book.title} cover`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center" style={{ color: 'var(--text-tertiary)' }}>
                        <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <h4 className="mt-2 line-clamp-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{book.title}</h4>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{book.author}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Belum ada buku free tersedia saat ini.</p>
          </div>
        )}
      </section>

      {/* ═══ Premium Books ═══ */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold tracking-wider text-white" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #fb7185 100%)' }}>
              PREMIUM
            </span>
            Premium Books
          </h3>
          <Link href="/browse" className="text-sm font-medium transition-colors" style={{ color: 'var(--accent)' }}>
            View all premium
          </Link>
        </div>
        {premiumBooks.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {premiumBooks.map((book) => (
              <Link key={book.id} href={`/ebooks/${book.id}`} className="group">
                <div className="overflow-hidden rounded-xl card-hover" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <div className="aspect-[3/4] w-full overflow-hidden relative" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    {book.coverUrl ? (
                      <Image
                        src={book.coverUrl}
                        alt={`${book.title} cover`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center" style={{ color: 'var(--text-tertiary)' }}>
                        <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <h4 className="mt-2 line-clamp-1 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{book.title}</h4>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{book.author}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Belum ada buku premium tersedia saat ini.</p>
          </div>
        )}
      </section>

      {/* ═══ Categories ═══ */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            <svg className="h-6 w-6" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Explore by Category
          </h3>
          <Link href="/browse" className="text-sm font-medium transition-colors" style={{ color: 'var(--accent)' }}>
            View all categories
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => {
            const icons = ['✨', '🔬', '🏛️', '🔍', '👑', '👤', '🧠'];
            return (
              <Link
                key={category.id}
                href={`/browse?category=${encodeURIComponent(category.name)}`}
                aria-label={`Browse items in category: ${category.name}`}
                className="flex flex-col items-center justify-center gap-3 rounded-xl p-6 text-center transition-all duration-300 card-hover"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <span className="text-4xl">{icons[index % icons.length]}</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{category.name}</span>
                {category._count && category._count.ebooks > 0 && (
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{category._count.ebooks} books</span>
                )}
              </Link>
            );
          })}
          <Link
            href="/browse"
            className="flex flex-col items-center justify-center gap-3 rounded-xl p-6 text-center transition-all duration-300 card-hover"
            style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <span className="text-4xl">⋯</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>View All</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
