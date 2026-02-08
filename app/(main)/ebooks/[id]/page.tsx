'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import PricingModal from '@/components/PricingModal';

interface Ebook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  category: string;
  description: string;
  pdfUrl?: string;
  isPremium?: boolean;
  isActive?: boolean;
}

export default function EbookDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInReadlist, setIsInReadlist] = useState(false);
  const [addingToReadlist, setAddingToReadlist] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchEbook(params.id as string);
      checkIfInReadlist(params.id as string);
    }
  }, [params.id]);

  const fetchEbook = async (id: string) => {
    try {
      // Get Firebase auth token
      const { auth } = await import('@/lib/firebase');
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        // If not authenticated, redirect to login
        router.push(`/login?redirect=/ebooks/${id}`);
        return;
      }

      const response = await fetch(`/api/ebooks/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch ebook');
      }

      // Check subscription status
      const hasActiveSub = await checkSubscription();
      
      setEbook(data.ebook);
      setImageError(false);

      console.log('Ebook loaded:', {
        id: data.ebook?.id,
        title: data.ebook?.title,
        hasSubscription: hasActiveSub,
        hasPdfUrl: !!data.ebook?.pdfUrl
      });
    } catch (error: any) {
      console.error('Error fetching ebook:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async (): Promise<boolean> => {
    try {
      const { auth } = await import('@/lib/firebase');
      const token = await auth.currentUser?.getIdToken();

      if (!token) return false;

      const response = await fetch('/api/subscriptions/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Subscription API response:', data);
        const hasActive = data.hasSubscription || false; // Fixed: use 'hasSubscription' not 'hasActiveSubscription'
        setHasSubscription(hasActive);
        return hasActive;
      }
      return false;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  };





  const handleReadNow = async () => {
    if (!ebook) return;

    // Re-check subscription to ensure latest status
    const currentHasSub = await checkSubscription();
    
    console.log('Read Now clicked:', {
      userRole: user?.role,
      userPlan: user?.plan,
      hasSubscription: currentHasSub,
      ebookId: ebook.id
    });

    // Check if user has subscription or is Admin
    if (user?.role === 'Admin' || currentHasSub || user?.plan === 'Premium') {
      // User has access, go to reader
      router.push(`/reader/${ebook.id}`);
    } else {
      // User needs subscription, show pricing modal
      console.log('User needs subscription, showing modal');
      setShowPricingModal(true);
    }
  };

  const checkIfInReadlist = async (ebookId: string) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      
      const response = await fetch(`/api/readlist?ebookId=${ebookId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsInReadlist(!!data);
      }
    } catch (error) {
      console.error('Error checking readlist:', error);
    }
  };

  const handleAddToReadlist = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setAddingToReadlist(true);

    try {
      const token = await user.getIdToken();
      
      if (isInReadlist) {
        // Remove from readlist
        const response = await fetch(`/api/readlist?ebookId=${ebook!.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsInReadlist(false);
          showToast('Dihapus dari readlist', 'success');
        }
      } else {
        // Add to readlist
        const response = await fetch('/api/readlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            ebookId: ebook!.id,
            status: 'WANT_TO_READ',
          }),
        });

        if (response.ok) {
          setIsInReadlist(true);
          showToast('Ditambahkan ke readlist!', 'success');
        } else {
          const data = await response.json();
          if (data.error === 'Already in readlist') {
            setIsInReadlist(true);
            showToast('Sudah ada di readlist', 'info');
          } else {
            throw new Error(data.error);
          }
        }
      }
    } catch (error) {
      console.error('Error managing readlist:', error);
      showToast('Gagal mengupdate readlist', 'error');
    } finally {
      setAddingToReadlist(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' :
      'bg-blue-500'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
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


      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-slate-700 shadow-2xl">

                <img
                  src={!imageError && ebook.coverUrl ? ebook.coverUrl : '/placeholder-book.svg'}
                  alt={ebook.title}
                  onError={() => setImageError(true)}
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

            <div className="flex gap-4 mb-8">
              {/* All ebooks require subscription - button always visible */}
              <button
                onClick={handleReadNow}
                className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                📖 Read Now
              </button>
              <button
                onClick={handleAddToReadlist}
                disabled={addingToReadlist}
                className={`px-8 py-3 border-2 font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isInReadlist
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-600 text-green-700 dark:text-green-400'
                    : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-400'
                } ${addingToReadlist ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {addingToReadlist ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : isInReadlist ? (
                  <>
                    ✓ In Readlist
                  </>
                ) : (
                  <>
                    📚 Add to Readlist
                  </>
                )}
              </button>
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
