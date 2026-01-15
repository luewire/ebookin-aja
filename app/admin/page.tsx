'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.email !== 'admin@admin.com') {
        router.push('/unauthorized');
      }
    }
  }, [user, loading]);

  if (loading || !user || user.email !== 'admin@admin.com') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">🛡️ Admin Panel</h1>
            <Link
              href="/profile"
              className="min-h-[44px] flex items-center justify-center rounded-lg px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              ← Back to Profile
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Admin Dashboard</h2>
          <p className="mt-2 text-base text-gray-600">Manage ebooks and view platform statistics</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link
            href="/admin/ebooks"
            className="group overflow-hidden rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-xl"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 text-3xl">
              📚
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
              Manage Ebooks
            </h3>
            <p className="text-base text-gray-600">
              Add, edit, or remove ebooks from the platform
            </p>
          </Link>

          <Link
            href="/admin/stats"
            className="group overflow-hidden rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-xl"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-green-100 text-3xl">
              📊
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-green-600">
              View Statistics
            </h3>
            <p className="text-base text-gray-600">
              View reading sessions and user engagement metrics
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
