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

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    name: string;
    photoUrl?: string;
  };
}

interface ReviewModalProps {
  ebookId: string;
  ebookTitle: string;
  existingReview: Review | null;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

function ReviewModal({ ebookId, ebookTitle, existingReview, onClose, onSubmit }: ReviewModalProps) {
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) return;

    setSubmitting(true);
    try {
      await onSubmit(rating, comment.trim());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {existingReview ? 'Edit Review' : 'Write a Review'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">{ebookTitle}</h4>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this book..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {comment.length}/500 characters
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || rating < 1}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
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
  const [readlistStatus, setReadlistStatus] = useState<string | null>(null);
  const [addingToReadlist, setAddingToReadlist] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [canReview, setCanReview] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchEbook(params.id as string);
      checkIfInReadlist(params.id as string);
      checkReadingProgress(params.id as string);
      checkUserReview(params.id as string);
    }
  }, [params.id, user]);

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
        if (data) {
          setReadlistStatus(data.status);
        } else {
          setReadlistStatus(null);
        }
      }
    } catch (error) {
      console.error('Error checking readlist:', error);
    }
  };

  const checkReadingProgress = async (ebookId: string) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();

      const response = await fetch(`/api/reading-progress?ebookId=${ebookId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const progress = data.progress || 0;
        setReadingProgress(progress);
        setCanReview(progress >= 80); // User can review if progress >= 80%
      }
    } catch (error) {
      console.error('Error checking reading progress:', error);
    }
  };

  const checkUserReview = async (ebookId: string) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();

      const response = await fetch(`/api/ebooks/${ebookId}/reviews?userOnly=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const review = await response.json();
        setUserReview(review);
      }
    } catch (error) {
      console.error('Error checking user review:', error);
    }
  };

  const handleUpdateReadlist = async (status: string | null) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setAddingToReadlist(true);
    setShowStatusDropdown(false);

    try {
      const token = await user.getIdToken();

      if (!status) {
        // Remove from readlist
        const response = await fetch(`/api/readlist?ebookId=${ebook!.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsInReadlist(false);
          setReadlistStatus(null);
          showToast('Dihapus dari readlist', 'success');
        }
      } else {
        // Add to or update readlist
        const response = await fetch('/api/readlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            ebookId: ebook!.id,
            status: status,
          }),
        });

        if (response.ok) {
          setIsInReadlist(true);
          setReadlistStatus(status);
          showToast(`Status diperbarui ke ${status.replace(/_/g, ' ')}!`, 'success');
        } else {
          const data = await response.json();
          throw new Error(data.error);
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
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${type === 'success' ? 'bg-green-500' :
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
              <div className="relative flex-1 md:flex-none">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  disabled={addingToReadlist}
                  className={`w-full px-8 py-3 border-2 font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 ${isInReadlist
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
                      ✓ {readlistStatus?.replace(/_/g, ' ')}
                      <svg className={`h-4 w-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      📚 Add to Readlist
                      <svg className={`h-4 w-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>

                {showStatusDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                    <button
                      onClick={() => handleUpdateReadlist('WANT_TO_READ')}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${readlistStatus === 'WANT_TO_READ' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      Want to read
                    </button>
                    <button
                      onClick={() => handleUpdateReadlist('READING')}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${readlistStatus === 'READING' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      Currently Reading
                    </button>
                    <button
                      onClick={() => handleUpdateReadlist('FINISHED')}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors ${readlistStatus === 'FINISHED' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                    >
                      Completed
                    </button>
                    {isInReadlist && (
                      <>
                        <div className="border-t border-gray-100 dark:border-slate-700 my-1" />
                        <button
                          onClick={() => handleUpdateReadlist(null)}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Remove from Readlist
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>



            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About this book</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {ebook.description || 'No description available.'}
              </p>
            </div>

            {/* Reading Progress & Review Section */}
            {user && (
              <div className="mt-8 p-6 bg-gray-50 dark:bg-slate-800 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Reading Progress</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{readingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(readingProgress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {canReview ? (
                  <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">Write a Review</h4>
                      {userReview && (
                        <span className="text-sm text-green-600 dark:text-green-400">✓ Already reviewed</span>
                      )}
                    </div>
                    
                    {userReview ? (
                      <div className="bg-white dark:bg-slate-700 p-4 rounded-lg border border-gray-200 dark:border-slate-600">
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-5 h-5 ${i < userReview.rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(userReview.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {userReview.comment && (
                          <p className="text-gray-700 dark:text-gray-300 text-sm">{userReview.comment}</p>
                        )}
                        <button
                          onClick={() => setShowReviewModal(true)}
                          className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Edit Review
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      >
                        ✍️ Write Review
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                    <div className="text-center py-4">
                      <div className="text-gray-500 dark:text-gray-400 mb-2">
                        📖 Read at least 80% to write a review
                      </div>
                      <div className="text-sm text-gray-400 dark:text-gray-500">
                        {80 - readingProgress}% more to go
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
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

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          ebookId={ebook.id}
          ebookTitle={ebook.title}
          existingReview={userReview}
          onClose={() => setShowReviewModal(false)}
          onSubmit={async (rating: number, comment: string) => {
            try {
              const token = await user!.getIdToken();
              
              const response = await fetch(`/api/ebooks/${ebook.id}/reviews`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ rating, comment }),
              });

              if (response.ok) {
                const newReview = await response.json();
                setUserReview({
                  id: newReview.id,
                  rating: newReview.rating,
                  comment: newReview.comment,
                  createdAt: newReview.createdAt,
                  user: {
                    name: user!.displayName || 'Anonymous',
                    photoUrl: user!.photoURL || undefined,
                  },
                });
                setShowReviewModal(false);
                showToast('Review submitted successfully!', 'success');
              } else {
                throw new Error('Failed to submit review');
              }
            } catch (error) {
              console.error('Error submitting review:', error);
              showToast('Failed to submit review', 'error');
            }
          }}
        />
      )}
    </div>
  );
}
