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
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      setDarkMode(true);
      document.documentElement.removeAttribute('data-theme');
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

      // Check DB role from AuthProvider context (populated from /api/auth/me)
      if (String(user.role || '').toUpperCase() === 'ADMIN') {
        setIsAuthorized(true);
        setCheckingAuth(false);
        return;
      }

      // Fallback: check Firebase custom claims (force token refresh)
      try {
        const tokenResult = await user.getIdTokenResult(true);
        const role = tokenResult.claims.role;

        if (String(role || '').toUpperCase() === 'ADMIN') {
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
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  if (loading || checkingAuth || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center transition-colors duration-300" style={{ backgroundColor: 'var(--bg-base)' }}>
        {/* Skeleton Loading Animation */}
        <div className="w-full max-w-7xl px-8 space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }}></div>
            <div className="flex-1">
              <div className="h-6 w-48 rounded animate-pulse mb-2" style={{ backgroundColor: 'var(--bg-overlay)' }}></div>
              <div className="h-4 w-32 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }}></div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl p-6 border transition-colors duration-300" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }}></div>
                  <div className="h-6 w-24 rounded-full animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }}></div>
                </div>
                <div className="h-4 w-32 rounded animate-pulse mb-2" style={{ backgroundColor: 'var(--bg-overlay)' }}></div>
                <div className="h-8 w-24 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }}></div>
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="rounded-xl border overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }}></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 rounded animate-pulse w-3/4" style={{ backgroundColor: 'var(--bg-overlay)' }}></div>
                    <div className="h-3 rounded animate-pulse w-1/2" style={{ backgroundColor: 'var(--bg-overlay)' }}></div>
                  </div>
                  <div className="w-20 h-8 rounded animate-pulse" style={{ backgroundColor: 'var(--bg-overlay)' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Sidebar - Tidak akan reload */}
      <AdminSidebar />

      <div className="ml-20">
        {/* Top Header - Tidak akan reload */}
        <header className="sticky top-0 z-40 border-b transition-colors duration-300" style={{ backgroundColor: 'var(--nav-bg-scrolled)', borderColor: 'var(--border)', backdropFilter: 'blur(12px)' }}>
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Real-time platform performance and reading metrics across your library.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: 'var(--text-secondary)' }}
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
              <div className="flex items-center gap-3 pl-4 border-l" style={{ borderColor: 'var(--border)' }}>
                <div className="text-right">
                  <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{user?.displayName || 'Admin'}</p>
                  <p className="text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>Super Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-soft))' }}>
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
