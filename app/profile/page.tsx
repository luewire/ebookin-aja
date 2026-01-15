'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ReadingSession {
  id: string;
  ebook_id: string;
  progress: number;
  last_read: string;
  ebook: {
    title: string;
    author: string;
    cover: string;
    category: string;
  };
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [readingSessions, setReadingSessions] = useState<ReadingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user) {
      fetchReadingSessions();
      loadDarkMode();
    }
  }, [authLoading, user]);

  const loadDarkMode = () => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
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

  const fetchReadingSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('reading_sessions')
        .select(`
          id,
          ebook_id,
          progress,
          last_read,
          ebooks (
            id,
            title,
            author,
            cover,
            category
          )
        `)
        .eq('user_id', user?.id)
        .order('last_read', { ascending: false });

      if (error) throw error;
      
      const sessions = data?.map((session: any) => ({
        id: session.id,
        ebook_id: session.ebook_id,
        progress: session.progress,
        last_read: session.last_read,
        ebook: session.ebooks
      })) || [];
      
      setReadingSessions(sessions);
    } catch (error: any) {
      console.error('Error fetching reading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 dark:border-slate-600 border-t-blue-600"></div>
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
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold text-sm">L</div>
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 hidden sm:block">Ebookin</span>
            </Link>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleDarkMode}
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-95"
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

              {user?.email === 'admin@admin.com' && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-2 rounded-lg px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="hidden md:inline">Admin</span>
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950 px-3 sm:px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="relative">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg ring-4 ring-white dark:ring-slate-800">
                {getInitials(user?.email || '')}
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-green-500 border-3 border-white dark:border-slate-900 shadow-md"></div>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-400 mx-auto sm:mx-0">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Active Reader
                </span>
              </div>
              <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">{user?.email}</p>
              
              <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto sm:mx-0">
                <div className="rounded-lg bg-white dark:bg-slate-800 p-3 sm:p-4 border border-gray-200 dark:border-slate-700 transition-colors">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{readingSessions.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Books</div>
                </div>
                <div className="rounded-lg bg-white dark:bg-slate-800 p-3 sm:p-4 border border-gray-200 dark:border-slate-700 transition-colors">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {readingSessions.filter(s => s.progress >= 100).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Finished</div>
                </div>
                <div className="rounded-lg bg-white dark:bg-slate-800 p-3 sm:p-4 border border-gray-200 dark:border-slate-700 transition-colors">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {readingSessions.filter(s => s.progress > 0 && s.progress < 100).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Reading</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Activity */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Reading Activity</h2>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <span className="hidden sm:inline">Browse Library</span>
              <span className="sm:hidden">Browse</span>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {readingSessions.length === 0 ? (
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 sm:p-12 text-center transition-colors">
              <div className="mb-4 text-4xl sm:text-6xl">📚</div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">No reading history yet</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">Start reading books to track your progress here</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-200 hover:shadow-lg active:scale-95"
              >
                Explore Books
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {readingSessions.map((session) => (
                <div
                  key={session.id}
                  className="group flex flex-col overflow-hidden rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-gray-200 dark:bg-slate-700">
                    <img
                      src={session.ebook.cover || '/placeholder-book.jpg'}
                      alt={session.ebook.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="mb-1 text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                      {session.ebook.title}
                    </h3>
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{session.ebook.author}</p>
                    <span className="mb-3 inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 w-fit">
                      {session.ebook.category}
                    </span>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Progress</span>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{Math.min(100, Math.round(session.progress))}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                          style={{ width: `${Math.min(100, session.progress)}%` }}
                        />
                      </div>
                    </div>
                    
                    <Link
                      href={`/ebooks/${session.ebook_id}`}
                      className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-200 active:scale-95"
                    >
                      {session.progress >= 100 ? 'Read Again' : 'Continue Reading'}
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
