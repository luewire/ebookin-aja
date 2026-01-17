'use client';

import { useEffect, useState } from 'react';
import { getSubscription, getDaysRemaining, getPlanDetails } from '@/lib/subscription';

export default function SubscriptionBadge() {
  const [subscription, setSubscription] = useState<any>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    const sub = getSubscription();
    setSubscription(sub);
    
    if (sub) {
      const days = getDaysRemaining();
      setDaysRemaining(days);
    }
  }, []);

  if (!subscription || subscription.status !== 'active') {
    return (
      <div className="px-4 py-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg border border-gray-200 dark:border-slate-600">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Free Plan</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Upgrade untuk akses penuh
        </p>
        <a
          href="/pricing"
          className="block w-full text-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs font-semibold rounded-lg transition-all"
        >
          Upgrade Now
        </a>
      </div>
    );
  }

  const planDetails = getPlanDetails(subscription.plan);

  return (
    <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <span className="text-sm font-bold text-blue-900 dark:text-blue-300">
          {planDetails?.name || 'Premium'} Plan
        </span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400">
          {daysRemaining !== null && (
            <>
              {daysRemaining > 0 ? (
                <>{daysRemaining} hari tersisa</>
              ) : (
                <>Akan segera berakhir</>
              )}
            </>
          )}
        </span>
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {planDetails?.price}
        </span>
      </div>
    </div>
  );
}
