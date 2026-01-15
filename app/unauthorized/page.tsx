'use client';

import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 text-6xl">🚫</div>
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Access Denied</h1>
        <p className="mb-8 text-lg text-gray-600">
          You don't have permission to access this page. Only admin users can access the admin panel.
        </p>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Go to Profile
        </Link>
      </div>
    </div>
  );
}
