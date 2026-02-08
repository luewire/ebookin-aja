'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle?: string;
  redirectTo?: string;
}

export default function PricingModal({ isOpen, onClose, bookTitle, redirectTo }: PricingModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // If user is already premium or admin, don't show the modal
  // Note: We might want to allow them to see it if they explicitly navigated to /pricing, 
  // but this modal is usually a "Paywall" popup. 
  if (user?.plan === 'Premium' || user?.role === 'Admin') {
    return null;
  }

  const plans = [
    {
      id: '1month',
      name: '1 Bulan',
      price: 'Rp25.000',
      priceDetail: '/bln',
      features: [
        'Personalized Recommendations',
        'Highlight & Catatan',
        'Sinkronisasi across devices'
      ]
    },
    {
      id: '1year',
      name: '1 Tahun',
      price: 'Rp240.000',
      priceDetail: '/thn',
      features: [
        'Personalized Recommendations',
        'Highlight & Catatan',
        'Sinkronisasi across devices',
        'Akses eksklusif rilis baru'
      ],
      badge: 'BEST VALUE',
      discount: 'Hemat Rp60.000 (20% off)',
      highlighted: true
    },
    {
      id: '3months',
      name: '3 Bulan',
      price: 'Rp70.000',
      priceDetail: '/3 bln',
      features: [
        'Personalized Recommendations',
        'Highlight & Catatan',
        'Sinkronisasi across devices'
      ],
      discount: 'Hemat Rp5.000'
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push(`/login?redirect=${encodeURIComponent(redirectTo || '/profile')}`);
      return;
    }

    setSelectedPlan(planId);
    setLoading(true);
    setError(null);

    try {
      // Get Firebase auth token
      const { auth } = await import('@/lib/firebase');
      const token = await auth.currentUser?.getIdToken();

      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      // Call API to create iPaymu payment
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ planName: planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment');
      }

      // Redirect to iPaymu payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('Payment URL not received');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Terjadi kesalahan saat membuat pembayaran');
      setSelectedPlan(null);
      setLoading(false);
    }
  };

  const handleViewAllPlans = () => {
    const redirect = redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : '';
    router.push(`/pricing${redirect}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-5xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl transform transition-all animate-fade-in-up">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors z-10"
          >
            <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8 sm:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Upgrade untuk Membaca
              </h2>
              {bookTitle && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{bookTitle}</span> adalah konten premium
                </p>
              )}
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Dapatkan akses tak terbatas ke ribuan e-book premium, highlight & catatan, dan sinkronisasi di semua perangkat
              </p>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-xl p-6 transition-all duration-300 ${plan.highlighted
                    ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-xl scale-105 border-2 border-blue-400'
                    : 'bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg'
                    }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className={`text-lg font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'
                      }`}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={`text-3xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}>
                        {plan.price}
                      </span>
                      <span className={`text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        {plan.priceDetail}
                      </span>
                    </div>
                    {plan.discount && (
                      <p className={`text-xs mt-2 ${plan.highlighted ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'
                        }`}>
                        {plan.discount}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-white' : 'text-green-500 dark:text-green-400'
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className={`text-sm ${plan.highlighted ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={loading || selectedPlan === plan.id}
                    className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md'
                      } ${(loading || selectedPlan === plan.id) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {selectedPlan === plan.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mengarahkan ke Pembayaran...
                      </span>
                    ) : (
                      plan.highlighted ? 'Pilih Paket' : 'Mulai Sekarang'
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={handleViewAllPlans}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Lihat semua paket dan detail lengkap →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
