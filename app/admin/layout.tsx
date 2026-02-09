'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (loading) return;

      if (!user) {
        router.push('/login');
        return;
      }

      // Always allow super admin
      if (user.email === 'admin@admin.com') {
        setIsAuthorized(true);
        setCheckingAuth(false);
        return;
      }

      // Check for ADMIN custom claim logic
      try {
        // Force token refresh to get latest claims
        const tokenResult = await user.getIdTokenResult(true);
        const role = tokenResult.claims.role;

        if (role === 'ADMIN' || role === 'Admin') {
          setIsAuthorized(true);
        } else {
          console.log('User role not authorized:', role);
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('Error checking admin permissions:', error);
        router.push('/unauthorized');
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAccess();
  }, [user, loading, router]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (loading || checkingAuth || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        {/* Skeleton Loading Animation */}
        <div className="w-full max-w-7xl px-8 space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                  <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
                </div>
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-2"></div>
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2"></div>
                  </div>
                  <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar - Tidak akan reload */}
      <AdminSidebar />

      <div className="ml-20">
        {/* Top Header - Tidak akan reload */}
        <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Real-time platform performance and reading metrics across your library.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {darkMode ? (
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* User Avatar */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{user?.displayName || 'Admin'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">Super Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white font-bold shadow-sm">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Admin" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (user?.displayName || 'A').substring(0, 2).toUpperCase()
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - HANYA bagian ini yang akan reload */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
