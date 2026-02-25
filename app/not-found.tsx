import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="text-center animate-fade-in-up max-w-md">
        {/* 404 Gradient Text */}
        <h1
          className="text-[120px] sm:text-[160px] font-bold font-display leading-none mb-4 animate-float"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-soft))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>

        <h2 className="text-2xl font-bold font-display mb-3" style={{ color: 'var(--text-primary)' }}>
          Page Not Found
        </h2>
        <p className="text-base mb-8 italic font-display" style={{ color: 'var(--text-secondary)' }}>
          &ldquo;Looks like this page ran off with a good book.&rdquo;
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn-primary rounded-xl px-6 py-3 text-sm">
            Go Home
          </Link>
          <Link href="/browse" className="btn-ghost rounded-xl px-6 py-3 text-sm">
            Browse Books
          </Link>
        </div>
      </div>
    </div>
  );
}
