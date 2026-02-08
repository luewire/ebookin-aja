'use client';

import { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';


function PricingContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const redirectTo = searchParams.get('redirect') || '/browse';

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

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
      badge: null,
      discount: 'Hemat Rp5.000'
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    
    // Redirect to subscription creation API
    router.push(`/api/subscriptions/create?plan=${planId}&redirect=${redirectTo}`);
  };

  const handleSkip = () => {
    router.push(redirectTo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors">
      {/* Skip Button - Top Left */}
      {user && (
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors font-medium"
          >
            Lewati
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Pilih paket yang tepat untuk Anda
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Dapatkan akses tak terbatas ke ribuan e-book, konten eksklusif, dan baca secara offline.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-2xl scale-105 border-2 border-blue-400'
                  : 'bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold mb-2 ${
                  plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl font-bold ${
                    plan.highlighted ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}>
                    {plan.price}
                  </span>
                  <span className={`text-lg ${
                    plan.highlighted ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {plan.priceDetail}
                  </span>
                </div>
                {plan.discount && (
                  <p className={`text-sm mt-2 ${
                    plan.highlighted ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {plan.discount}
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.highlighted ? 'text-white' : 'text-green-500 dark:text-green-400'
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
                    <span className={`text-sm ${
                      plan.highlighted ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={selectedPlan === plan.id}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
                } ${
                  selectedPlan === plan.id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {selectedPlan === plan.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  plan.highlighted ? `Pilih ${plan.name}` : 'Mulai Sekarang'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="text-center space-y-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">
              Sudah memiliki akun?
            </p>
            <button
              onClick={() => router.push('/login')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:border-gray-400 dark:hover:border-slate-500 hover:shadow-md transition-all duration-200"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Lanjutkan dengan Google
            </button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} Ebookin. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
