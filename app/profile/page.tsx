'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

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
  const [activeTab, setActiveTab] = useState<'all' | 'reading' | 'completed'>('all');
  const [profileData, setProfileData] = useState<{
    username: string | null;
    bio: string | null;
    reading_goal: number | null;
  }>({ username: null, bio: null, reading_goal: null });
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user) {
      fetchReadingSessions();
      fetchProfileData();
    }
  }, [authLoading, user]);

  const fetchProfileData = async () => {
    try {
      // Load from user metadata
      const metadata = user?.user_metadata || {};
      setProfileData({
        username: metadata.username || null,
        bio: metadata.bio || null,
        reading_goal: metadata.reading_goal || null
      });
    } catch (error: any) {
      console.error('Error fetching profile data:', error);
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
    try {
      console.log('Profile logout started...');
      
      // Sign out with local scope
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.error('Logout error:', error);
      }
      
      // Clear all auth storage
      Object.keys(localStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('auth') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();
      
      // Force redirect
      setTimeout(() => {
        window.location.replace('/');
      }, 100);
    } catch (error) {
      console.error('Error logging out:', error);
      window.location.replace('/');
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const getUserName = () => {
    return user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';
  };

  const filteredSessions = readingSessions.filter(session => {
    if (activeTab === 'reading') return session.progress > 0 && session.progress < 100;
    if (activeTab === 'completed') return session.progress >= 100;
    return true;
  });

  const completedCount = readingSessions.filter(s => s.progress >= 100).length;
  const yearGoal = profileData.reading_goal || 25;
  const joinDate = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 dark:border-slate-600 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start gap-6">
          <div className="relative">
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-xl overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                getInitials(user?.email || '')
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{profileData.username || getUserName()}</h1>
              <Link href="/settings" className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors w-fit">
                Edit Profile
              </Link>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
              {profileData.bio || 'Avid reader and enthusiast. Exploring the intersection of literature and human consciousness.'}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Joined {joinDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900 dark:text-gray-100">2026 Goal: {completedCount} of {yearGoal} books</span>
                <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (completedCount / yearGoal) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Library Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">My Library</h2>
          
          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200 dark:border-slate-700 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              All Books
            </button>
            <button
              onClick={() => setActiveTab('reading')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'reading'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Currently Reading
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'completed'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Books Grid */}
          {filteredSessions.length === 0 ? (
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-12 text-center">
              <div className="mb-4 text-5xl">📚</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {activeTab === 'reading' ? 'No books in progress' : 
                 activeTab === 'completed' ? 'No completed books yet' : 
                 'No books in your library'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Start reading to build your collection
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-200"
              >
                Explore Library
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {filteredSessions.map((session) => (
                <Link
                  key={session.id}
                  href={`/ebooks/${session.ebook_id}`}
                  className="group"
                >
                  <div className="mb-3 aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-slate-700 shadow-md group-hover:shadow-xl transition-all duration-300">
                    <img
                      src={session.ebook.cover || '/placeholder-book.jpg'}
                      alt={session.ebook.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                    {session.ebook.title}
                  </h3>
                  <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">{session.ebook.author}</p>
                  
                  {/* Status Badge */}
                  <div className="mb-2">
                    {session.progress >= 100 ? (
                      <span className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                        COMPLETED
                      </span>
                    ) : session.progress > 0 ? (
                      <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
                        READING
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-gray-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-400">
                        NOT STARTED
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {session.progress > 0 && session.progress < 100 && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all duration-500"
                          style={{ width: `${Math.min(100, session.progress)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{Math.round(session.progress)}%</p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
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
