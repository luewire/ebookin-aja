'use client';

import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Decorative geometric shapes */}
      <div
        className="absolute top-20 left-10 w-40 h-40 opacity-5"
        style={{
          background: 'var(--accent)',
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        }}
      />
      <div
        className="absolute bottom-20 right-10 w-32 h-32 opacity-5"
        style={{
          background: 'var(--accent-soft)',
          clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
        }}
      />

      <div className="text-center animate-fade-in-up max-w-md relative z-10">
        <h1
          className="text-[100px] sm:text-[140px] font-bold font-display leading-none mb-4"
          style={{ color: 'var(--accent)' }}
        >
          403
        </h1>

        <h2 className="text-2xl font-bold font-display mb-3" style={{ color: 'var(--text-primary)' }}>
          Access Denied
        </h2>
        <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
          You don&apos;t have permission to access this page. Please login or contact support if you believe this is an error.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn-primary rounded-xl px-6 py-3 text-sm">
            Go Home
          </Link>
          <Link href="/login" className="btn-ghost rounded-xl px-6 py-3 text-sm">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
