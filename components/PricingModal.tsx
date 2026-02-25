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
      badge: 'POPULAR',
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

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(redirectTo || '/order')}`);
      return;
    }

    onClose();
    router.push(`/order?plan=${planId}`);
  };

  const handleViewAllPlans = () => {
    const redirect = redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : '';
    router.push(`/pricing${redirect}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dark Backdrop with Blur */}
      <div
        className="fixed inset-0 transition-opacity"
        style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-5xl rounded-[20px] shadow-2xl animate-scale-fade-in"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full transition-colors z-10"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-overlay)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8 sm:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-soft))' }}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3" style={{ color: 'var(--text-primary)' }}>
                Upgrade untuk Membaca
              </h2>
              {bookTitle && (
                <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>
                  <span className="font-semibold" style={{ color: 'var(--accent)' }}>{bookTitle}</span> adalah konten premium
                </p>
              )}
              <p style={{ color: 'var(--text-secondary)' }}>
                Dapatkan akses tak terbatas ke ribuan e-book premium, highlight & catatan, dan sinkronisasi di semua perangkat
              </p>

              {error && (
                <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--accent-muted)', border: '1px solid var(--border-accent)' }}>
                  <p className="text-sm" style={{ color: 'var(--accent)' }}>{error}</p>
                </div>
              )}
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-6 transition-all duration-300 ${plan.highlighted ? 'scale-105' : ''}`}
                  style={{
                    backgroundColor: plan.highlighted ? 'transparent' : 'var(--bg-elevated)',
                    border: plan.highlighted ? '2px solid var(--border-accent)' : '1px solid var(--border)',
                    boxShadow: plan.highlighted ? 'var(--shadow-accent)' : 'none',
                    background: plan.highlighted ? 'linear-gradient(180deg, var(--accent-muted), var(--bg-elevated))' : undefined,
                  }}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="text-xs font-bold px-3 py-1 rounded-full text-white shadow-md" style={{ backgroundColor: 'var(--accent)' }}>
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        {plan.price}
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {plan.priceDetail}
                      </span>
                    </div>
                    {plan.discount && (
                      <p className="text-xs mt-2" style={{ color: 'var(--accent-soft)' }}>
                        {plan.discount}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 flex-shrink-0 mt-0.5"
                          style={{ color: 'var(--accent)' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300"
                    style={{
                      backgroundColor: plan.highlighted ? 'var(--accent)' : 'transparent',
                      color: plan.highlighted ? '#fff' : 'var(--accent)',
                      border: plan.highlighted ? 'none' : '1px solid var(--border-accent)',
                      boxShadow: plan.highlighted ? 'var(--shadow-accent)' : 'none',
                    }}
                  >
                    {plan.highlighted ? 'Pilih Paket Ini' : 'Mulai Sekarang'}
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button
                onClick={handleViewAllPlans}
                className="text-sm font-medium hover:underline transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                Lihat semua paket dan detail lengkap →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
