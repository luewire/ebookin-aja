'use client';

import { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

function PricingContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessingGoogle, setIsProcessingGoogle] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/browse';

  const plans = [
    {
      id: '1month',
      name: '1 Bulan',
      price: 'Rp25.000',
      priceDetail: '/bln',
      features: [
        'Personalized Recommendations',
        'Highlight & Catatan',
        'Sinkronisasi multi perangkat'
      ],
      badge: null,
      discount: null
    },
    {
      id: '1year',
      name: '1 Tahun',
      price: 'Rp240.000',
      priceDetail: '/thn',
      features: [
        'Personalized Recommendations',
        'Highlight & Catatan',
        'Sinkronisasi multi perangkat',
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
        'Sinkronisasi multi perangkat'
      ],
      badge: null,
      discount: 'Hemat Rp5.000'
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);

    // Redirect to manual QRIS order page
    router.push(`/order?plan=${planId}&redirect=${redirectTo}`);
  };

  const handleSkip = () => {
    router.push(redirectTo);
  };

  const handleGoogleLogin = async () => {
    setIsProcessingGoogle(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      // Ensure user is synced
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: token,
          name: result.user.displayName,
          photoUrl: result.user.photoURL,
        }),
      });
      // Do nothing more, state changed
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsProcessingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500" style={{ backgroundColor: 'var(--bg-base)' }}>

      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ background: 'var(--accent)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ background: 'var(--accent)' }} />

      {/* Skip Button - Top Left */}
      {(user || redirectTo !== '/browse') && (
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={handleSkip}
            className="text-sm font-medium transition-colors hover:underline px-4 py-2 rounded-full"
            style={{ color: 'var(--text-secondary)', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
          >
            Lewati
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-6xl relative z-10">

        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Pilih paket yang <span style={{ color: 'var(--accent)' }}>tepat untuk Anda</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Dapatkan pengalaman membaca premium tanpa batas. Akses ribuan judul buku, fitur eksklusif, dan sinkronisasi otomatis.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 flex flex-col transition-all duration-500 animate-fade-in-up stagger-${index + 1}
                ${plan.highlighted ? 'md:scale-105 z-10 shadow-2xl relative' : 'hover:-translate-y-2'}`}
              style={{
                backgroundColor: plan.highlighted ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                border: plan.highlighted ? '2px solid var(--accent)' : '1px solid var(--border)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
              }}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-full text-center z-20">
                  <span className="inline-block text-xs font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider text-white"
                    style={{ backgroundColor: 'var(--accent)' }}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-8 pt-4">
                <h3 className="text-xl font-bold mb-4 font-display" style={{ color: 'var(--text-primary)' }}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                    {plan.price}
                  </span>
                  <span className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
                    {plan.priceDetail}
                  </span>
                </div>
                <div className="h-6">
                  {plan.discount && (
                    <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ color: 'var(--accent)', backgroundColor: 'var(--accent-muted)' }}>
                      {plan.discount}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3 group">
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110"
                      style={{ color: 'var(--accent)' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={selectedPlan === plan.id || (!user && isProcessingGoogle)}
                className={`w-full py-3.5 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group
                  ${selectedPlan === plan.id ? 'opacity-70 cursor-wait' : 'hover:opacity-90 active:scale-[0.98]'}`}
                style={{
                  backgroundColor: plan.highlighted ? 'var(--accent)' : 'var(--bg-elevated)',
                  color: plan.highlighted ? '#ffffff' : 'var(--text-primary)',
                  border: plan.highlighted ? 'none' : '1px solid var(--border)'
                }}
              >
                {selectedPlan === plan.id ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    {plan.highlighted ? `Pilih ${plan.name}` : 'Mulai Sekarang'}
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer Auth Section */}
        {!user && (
          <div className="text-center max-w-md mx-auto animate-fade-in-up stagger-4 p-8 rounded-3xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <p className="font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
              Masuk untuk melanjutkan langganan
            </p>
            <button
              onClick={handleGoogleLogin}
              disabled={isProcessingGoogle}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
            >
              {isProcessingGoogle ? (
                <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Lanjutkan dengan Google
                </>
              )}
            </button>
            <p className="text-xs mt-4" style={{ color: 'var(--text-tertiary)' }}>
              Atau <Link href="/login" className="font-semibold transition-colors hover:underline" style={{ color: 'var(--accent)' }}>Masuk Email</Link>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center transition-colors" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="h-8 w-8 animate-spin rounded-full border-4" style={{ borderColor: 'var(--bg-elevated)', borderTopColor: 'var(--accent)' }}></div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}

