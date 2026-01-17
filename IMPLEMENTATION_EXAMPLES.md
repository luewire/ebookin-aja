# 📚 Implementation Examples

Contoh-contoh implementasi fitur pricing/subscription di berbagai halaman.

## 1. Protected Route/Page

Membuat halaman yang hanya bisa diakses oleh user dengan subscription aktif.

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasActiveSubscription } from '@/lib/subscription';
import PricingModal from '@/components/PricingModal';

export default function PremiumContentPage() {
  const router = useRouter();
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check subscription on page load
    if (!hasActiveSubscription()) {
      setShowPricingModal(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Your premium content here */}
      <h1>Premium Content</h1>
      
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => router.push('/browse')}
        bookTitle="Premium Content"
        redirectTo="/premium-content"
      />
    </div>
  );
}
```

## 2. Conditional Rendering Based on Subscription

Tampilkan konten berbeda untuk free vs premium users.

```tsx
import { hasActiveSubscription } from '@/lib/subscription';
import SubscriptionBadge from '@/components/SubscriptionBadge';

export default function DashboardPage() {
  const isPremium = hasActiveSubscription();

  return (
    <div className="p-8">
      {/* Subscription Badge */}
      <div className="mb-6">
        <SubscriptionBadge />
      </div>

      {/* Conditional Content */}
      {isPremium ? (
        <div className="space-y-4">
          <h2>Welcome Premium Member! 🎉</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Premium features */}
            <FeatureCard title="Unlimited Access" />
            <FeatureCard title="Offline Reading" />
            <FeatureCard title="Exclusive Content" />
          </div>
        </div>
      ) : (
        <div className="text-center p-12 bg-gray-100 dark:bg-slate-800 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get unlimited access to all features
          </p>
          <a
            href="/pricing"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Plans
          </a>
        </div>
      )}
    </div>
  );
}
```

## 3. API Route Protection (Server-Side)

Protect API routes dengan check subscription.

```typescript
// app/api/premium-content/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get user from session/auth
  const user = await getUser(request);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // Check subscription from database
  const subscription = await getSubscriptionFromDB(user.id);
  
  if (!subscription || subscription.status !== 'active') {
    return NextResponse.json(
      { error: 'Premium subscription required' },
      { status: 403 }
    );
  }

  // Check expiry
  if (new Date(subscription.expiryDate) < new Date()) {
    return NextResponse.json(
      { error: 'Subscription expired' },
      { status: 403 }
    );
  }

  // Return premium content
  return NextResponse.json({
    data: 'Your premium content here'
  });
}
```

## 4. Book List with Premium Badge

Tampilkan list buku dengan indicator premium dan handle click.

```tsx
'use client';

import { useState } from 'react';
import { hasActiveSubscription } from '@/lib/subscription';
import PricingModal from '@/components/PricingModal';

interface Book {
  id: string;
  title: string;
  cover: string;
  is_premium: boolean;
}

export default function BookList({ books }: { books: Book[] }) {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleBookClick = (book: Book) => {
    if (book.is_premium && !hasActiveSubscription()) {
      setSelectedBook(book);
      setShowPricingModal(true);
    } else {
      // Navigate to book
      window.location.href = `/books/${book.id}`;
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            onClick={() => handleBookClick(book)}
            className="cursor-pointer group"
          >
            <div className="relative">
              {book.is_premium && (
                <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  PREMIUM
                </span>
              )}
              <img
                src={book.cover}
                alt={book.title}
                className="w-full rounded-lg group-hover:shadow-xl transition-shadow"
              />
            </div>
            <h3 className="mt-2 font-semibold">{book.title}</h3>
          </div>
        ))}
      </div>

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        bookTitle={selectedBook?.title}
        redirectTo={selectedBook ? `/books/${selectedBook.id}` : undefined}
      />
    </>
  );
}
```

## 5. Profile Page with Subscription Management

Tampilkan info subscription di profile dan allow management.

```tsx
'use client';

import { useEffect, useState } from 'react';
import { 
  getSubscription, 
  getDaysRemaining, 
  getPlanDetails,
  cancelSubscription 
} from '@/lib/subscription';

export default function ProfileSubscriptionSection() {
  const [subscription, setSubscription] = useState<any>(null);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const sub = getSubscription();
    setSubscription(sub);
    
    if (sub) {
      setDaysLeft(getDaysRemaining());
    }
  }, []);

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel your subscription?')) {
      cancelSubscription();
      setSubscription(null);
      alert('Subscription cancelled');
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  if (!subscription || subscription.status !== 'active') {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-4">Subscription</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You don't have an active subscription
        </p>
        <button
          onClick={handleUpgrade}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Get Premium
        </button>
      </div>
    );
  }

  const planDetails = getPlanDetails(subscription.plan);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Active Subscription</h3>
        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
          Active
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Plan:</span>
          <span className="font-semibold">{planDetails?.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Price:</span>
          <span className="font-semibold">{planDetails?.price}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Days Left:</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {daysLeft} days
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Expires:</span>
          <span className="font-semibold">
            {new Date(subscription.expiryDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleUpgrade}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Upgrade Plan
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
```

## 6. Download Button with Premium Check

Button download yang check subscription sebelum allow download.

```tsx
'use client';

import { useState } from 'react';
import { hasActiveSubscription } from '@/lib/subscription';
import PricingModal from '@/components/PricingModal';

interface DownloadButtonProps {
  bookId: string;
  bookTitle: string;
  isPremium: boolean;
}

export default function DownloadButton({ 
  bookId, 
  bookTitle, 
  isPremium 
}: DownloadButtonProps) {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    // Check if premium book and no subscription
    if (isPremium && !hasActiveSubscription()) {
      setShowPricingModal(true);
      return;
    }

    // Proceed with download
    setDownloading(true);
    try {
      const response = await fetch(`/api/download/${bookId}`);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${bookTitle}.pdf`;
      a.click();
      
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Downloading...
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </>
        )}
      </button>

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        bookTitle={bookTitle}
        redirectTo={`/books/${bookId}`}
      />
    </>
  );
}
```

## 7. Middleware Protection

Protect routes using Next.js middleware.

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get subscription from cookie or header
  const subscription = request.cookies.get('subscription')?.value;
  
  // Protected routes that require subscription
  const protectedRoutes = ['/reader', '/download', '/premium'];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!subscription) {
      // Redirect to pricing
      return NextResponse.redirect(
        new URL('/pricing?redirect=' + request.nextUrl.pathname, request.url)
      );
    }

    // Check if subscription is valid
    try {
      const subData = JSON.parse(subscription);
      
      if (subData.status !== 'active') {
        return NextResponse.redirect(new URL('/pricing', request.url));
      }

      if (new Date(subData.expiryDate) < new Date()) {
        return NextResponse.redirect(new URL('/pricing', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/reader/:path*', '/download/:path*', '/premium/:path*'],
};
```

## 8. Server Component with Subscription Check

Server component yang check subscription dari database.

```tsx
// app/premium/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getSubscriptionFromDB } from '@/lib/database';

export default async function PremiumPage() {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect('/login');
  }

  const subscription = await getSubscriptionFromDB(session.user.id);
  
  if (!subscription || subscription.status !== 'active') {
    redirect('/pricing?redirect=/premium');
  }

  // Check expiry
  if (new Date(subscription.expiryDate) < new Date()) {
    redirect('/pricing?redirect=/premium');
  }

  return (
    <div>
      <h1>Premium Content</h1>
      {/* Your premium content here */}
    </div>
  );
}
```

---

## 📝 Notes

- Semua contoh di atas menggunakan `localStorage` untuk demo
- Untuk production, replace dengan:
  - Database queries
  - API calls
  - Cookies/Session
  - Server-side validation

## 🔗 Related Files

- `/lib/subscription.ts` - Utility functions
- `/components/PricingModal.tsx` - Modal component
- `/components/SubscriptionBadge.tsx` - Badge component
- `/app/pricing/page.tsx` - Pricing page

## 🎯 Best Practices

1. Always check subscription on server-side for security
2. Use client-side check for UX (show/hide UI elements)
3. Cache subscription data to avoid repeated checks
4. Handle expired subscriptions gracefully
5. Provide clear upgrade paths for free users
6. Show subscription status prominently
7. Make cancellation easy (but confirm first)
8. Log subscription events for analytics

---

**Need more examples? Check the actual implementation files!**
