'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
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
  pages?: number;
  language?: string;
  published_date?: string;
  rating?: number;
}

export default function EbookDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    }

    if (params.id) {
      fetchEbook(params.id as string);
    }
  }, [params.id]);

  const fetchEbook = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setEbook(data);
      
      // Check if book is premium and user doesn't have subscription
      if (data?.is_premium && !hasActiveSubscription()) {
        setShowPricingModal(true);
      }
    } catch (error: any) {
      console.error('Error fetching ebook:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleReadNow = () => {
    if (ebook?.is_premium && !hasActiveSubscription()) {
      setShowPricingModal(true);
    } else {
      // Navigate to reader
      router.push(`/reader/${ebook?.id}`);
    }
  };

  const handleAddToReadlist = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Add to readlist logic
    try {
      const { error } = await supabase
        .from('readlist')
        .insert([
          {
            user_id: user.id,
            ebook_id: ebook?.id,
          },
        ]);

      if (error) throw error;
      alert('Added to readlist!');
    } catch (error: any) {
      console.error('Error adding to readlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="h-8 w-1/2 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="md:col-span-2 space-y-4">
              <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Book Not Found</h2>
          <Link
            href="/browse"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Browse all books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* Header */}
      <nav className="border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold text-sm">E</div>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Ebookin</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="hidden md:flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
              >
                {isDarkMode ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    {user?.email?.substring(0, 2).toUpperCase()}
                  </button>
                  {showProfileMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                      <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-slate-800 py-2 shadow-xl border border-gray-200 dark:border-slate-700 z-20">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          Profile
                        </Link>
                        <Link
                          href="/browse"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          Browse
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-slate-700 shadow-2xl">
                {ebook.is_premium && (
                  <div className="absolute top-4 left-4 z-10 rounded-full bg-purple-600 px-4 py-2 text-sm font-bold text-white shadow-lg">
                    PREMIUM
                  </div>
                )}
                <img
                  src={ebook.cover || '/placeholder-book.jpg'}
                  alt={ebook.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                {ebook.category}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {ebook.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              by {ebook.author}
            </p>

            {ebook.rating && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(ebook.rating || 0)
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {ebook.rating?.toFixed(1)} / 5.0
                </span>
              </div>
            )}

            <div className="flex gap-4 mb-8">
              <button
                onClick={handleReadNow}
                className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                {ebook.is_premium && !hasActiveSubscription() ? 'Upgrade to Read' : 'Read Now'}
              </button>
              <button
                onClick={handleAddToReadlist}
                className="px-8 py-3 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-lg transition-all"
              >
                Add to Readlist
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {ebook.pages && (
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{ebook.pages}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pages</p>
                </div>
              )}
              {ebook.language && (
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white uppercase">{ebook.language}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Language</p>
                </div>
              )}
              {ebook.price !== undefined && (
                <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {ebook.is_premium ? `$${ebook.price}` : 'FREE'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                </div>
              )}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About this book</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {ebook.description || 'No description available.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => {
          setShowPricingModal(false);
          router.push('/browse');
        }}
        bookTitle={ebook.title}
        redirectTo={`/reader/${ebook.id}`}
      />
    </div>
  );
}
