'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-scale-in" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>
              {existingReview ? 'Edit Review' : 'Write a Review'}
            </h3>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-black/10"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{ebookTitle}</h4>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} out of 5 stars`}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <svg
                      className={`w-8 h-8 transition-colors ${star <= rating
                        ? 'fill-current'
                        : ''
                        }`}
                      style={{ color: star <= rating ? 'var(--accent)' : 'var(--border)' }}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                Comment (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this book..."
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors border"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
                rows={4}
                maxLength={500}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
              <div className="text-xs mt-2 font-medium" style={{ color: 'var(--text-tertiary)' }}>
                {comment.length}/500 characters
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-bold border transition-colors hover:opacity-80"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || rating < 1}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                style={{ backgroundColor: 'var(--accent)', boxShadow: '0 4px 14px 0 rgba(244, 63, 94, 0.39)' }}
              >
                <span className="relative z-10">{submitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
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
      logViewActivity(params.id as string);
    }
  }, [params.id, user]);

  const logViewActivity = async (id: string) => {
    try {
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (user) {
        const { auth } = await import('@/lib/firebase');
        const token = await auth.currentUser?.getIdToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
      // Fire and forget
      fetch(`/api/ebooks/${id}/view`, { method: 'POST', headers }).catch(() => { });
    } catch (e) {
      // ignore
    }
  };

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
        // Got subscription response
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

    const isFreeBook = ebook.isPremium === false;

    // Check if user has subscription, is Admin, or the book is free
    if (isFreeBook || user?.role === 'Admin' || currentHasSub || user?.plan === 'Premium') {
      // User has access, go to reader
      router.push(`/reader/${ebook.id}`);
    } else {
      // User needs subscription, show pricing modal

      // User needs subscription, showing modal
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
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="h-10 w-2/3 md:w-1/2 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)' }} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-96 rounded-2xl" style={{ backgroundColor: 'var(--bg-elevated)' }} />
            <div className="md:col-span-2 space-y-6">
              <div className="h-8 w-3/4 rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }} />
              <div className="h-5 w-1/3 rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }} />
              <div className="space-y-3 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-3 w-full rounded" style={{ backgroundColor: 'var(--bg-elevated)' }} />
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
      <div className="flex min-h-[70vh] items-center justify-center animate-fade-in-up" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="text-center">
          <h2 className="text-4xl font-bold font-display tracking-wide mb-4" style={{ color: 'var(--text-primary)' }}>Book Not Found</h2>
          <Link
            href="/browse"
            className="text-lg font-semibold hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            ← Explore all books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Decorative Blur */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 pointer-events-none" style={{ backgroundColor: 'var(--accent)' }}></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 pointer-events-none" style={{ backgroundColor: 'var(--accent-soft)' }}></div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 relative z-10 animate-fade-in-up">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          {/* Book Cover */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="sticky top-24">
              <div className="relative aspect-[2/3] w-full max-w-[300px] mx-auto overflow-hidden rounded-2xl shadow-2xl transition-transform hover:scale-[1.02]" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <Image
                  src={!imageError && ebook.coverUrl ? ebook.coverUrl : '/placeholder-book.svg'}
                  alt={`Cover of ${ebook.title}`}
                  fill
                  priority
                  onError={() => setImageError(true)}
                  className="object-cover"
                  sizes="(max-width: 768px) 300px, 400px"
                />
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="flex-1 w-full md:w-2/3 lg:w-3/4">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border" style={{ backgroundColor: 'var(--accent-muted)', color: 'var(--accent)', borderColor: 'var(--accent-muted)' }}>
                {ebook.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
              {ebook.title}
            </h1>

            <p className="text-xl md:text-2xl font-medium mb-10" style={{ color: 'var(--text-secondary)' }}>
              by {ebook.author}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={handleReadNow}
                aria-label={`Read ${ebook.title} now`}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl px-10 py-4 text-base font-bold text-white transition-all hover:scale-[1.02] group relative overflow-hidden"
                style={{ backgroundColor: 'var(--accent)', boxShadow: '0 8px 20px 0 rgba(244, 63, 94, 0.4)' }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  Read Now
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>

              <div className="relative flex-1 sm:flex-none">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  disabled={addingToReadlist}
                  aria-label={isInReadlist ? `Change readlist status: ${readlistStatus?.replace(/_/g, ' ')}` : "Add book to your readlist"}
                  className="w-full h-full flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-bold transition-all border hover:scale-[1.02]"
                  style={{
                    backgroundColor: isInReadlist ? 'var(--bg-overlay)' : 'transparent',
                    borderColor: isInReadlist ? 'var(--accent)' : 'var(--border)',
                    color: isInReadlist ? 'var(--accent)' : 'var(--text-primary)',
                    opacity: addingToReadlist ? 0.5 : 1,
                    cursor: addingToReadlist ? 'not-allowed' : 'pointer'
                  }}
                >
                  {addingToReadlist ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
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
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                      Add to Readlist
                      <svg className={`h-4 w-4 transition-transform ml-1 ${showStatusDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>

                {showStatusDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full min-w-[220px] rounded-xl shadow-2xl z-50 overflow-hidden py-2 animate-scale-in" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <button
                      onClick={() => handleUpdateReadlist('WANT_TO_READ')}
                      aria-label="Set status to Want to Read"
                      className="w-full text-left px-5 py-3 text-sm font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                      style={{ color: readlistStatus === 'WANT_TO_READ' ? 'var(--accent)' : 'var(--text-primary)' }}
                    >
                      Want to read
                    </button>
                    <button
                      onClick={() => handleUpdateReadlist('READING')}
                      aria-label="Set status to Currently Reading"
                      className="w-full text-left px-5 py-3 text-sm font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                      style={{ color: readlistStatus === 'READING' ? 'var(--accent)' : 'var(--text-primary)' }}
                    >
                      Currently Reading
                    </button>
                    <button
                      onClick={() => handleUpdateReadlist('FINISHED')}
                      aria-label="Set status to Completed"
                      className="w-full text-left px-5 py-3 text-sm font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                      style={{ color: readlistStatus === 'FINISHED' ? 'var(--accent)' : 'var(--text-primary)' }}
                    >
                      Completed
                    </button>
                    {isInReadlist && (
                      <>
                        <div className="my-1 border-t" style={{ borderColor: 'var(--border)' }} />
                        <button
                          onClick={() => handleUpdateReadlist(null)}
                          aria-label="Remove this book from your readlist"
                          className="w-full text-left px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          Remove from Readlist
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-2xl font-bold font-display tracking-wide mb-6" style={{ color: 'var(--text-primary)' }}>About this book</h3>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {ebook.description || 'No description available.'}
              </p>
            </div>

            {/* Reading Progress & Review Section */}
            {user && (
              <div className="mt-12 rounded-2xl p-8" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <h3 className="text-xl font-bold font-display mb-6" style={{ color: 'var(--text-primary)' }}>Your Journey</h3>

                <div className="mb-8">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Reading Progress</span>
                    <span className="text-lg font-bold font-display" style={{ color: 'var(--accent)' }}>{readingProgress}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(readingProgress, 100)}%`, backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--accent-glow)' }}
                    ></div>
                  </div>
                </div>

                {canReview ? (
                  <div className="pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Your Review</h4>
                      {userReview && (
                        <span className="text-sm font-semibold flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Reviewed
                        </span>
                      )}
                    </div>

                    {userReview ? (
                      <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-5 h-5 ${i < userReview.rating ? 'fill-current text-yellow-500' : ''}`} style={{ color: i >= userReview.rating ? 'var(--border)' : undefined }} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                            {new Date(userReview.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {userReview.comment && (
                          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>"{userReview.comment}"</p>
                        )}
                        <button
                          onClick={() => setShowReviewModal(true)}
                          className="text-sm font-bold hover:underline"
                          style={{ color: 'var(--accent)' }}
                        >
                          ✎ Edit Review
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="w-full py-4 px-6 rounded-xl font-bold transition-all border hover:scale-[1.01]"
                        style={{ backgroundColor: 'transparent', borderColor: 'var(--accent)', color: 'var(--accent)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--accent)'; }}
                      >
                        ✍️ Share Your Thoughts
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex flex-col flex-sm-row items-center justify-between gap-4 py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center opacity-50" style={{ backgroundColor: 'var(--bg-overlay)' }}>
                          <span className="text-xl">✍️</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Write a review</p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Read at least 80% to unlock</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                        {80 - readingProgress}% more needed
                      </span>
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
