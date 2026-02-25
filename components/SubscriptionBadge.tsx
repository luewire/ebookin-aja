'use client';

import { useState } from 'react';

export interface SubscriptionData {
  status: string;
  planName?: string;
  price?: string;
}

interface SubscriptionBadgeProps {
  subscription: SubscriptionData | null;
  daysRemaining: number | null;
}

export default function SubscriptionBadge({ subscription, daysRemaining }: SubscriptionBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!subscription || subscription.status !== 'ACTIVE') {
    return (
      <div
        className="relative px-4 py-3 rounded-xl"
        style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Free Plan</span>
        </div>
        <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>
          Upgrade untuk akses penuh
        </p>
        <a
          href="/pricing"
          className="block w-full text-center px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition-all duration-300"
          style={{
            backgroundColor: 'var(--accent)',
            boxShadow: 'none',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          Upgrade Now
        </a>

        {/* Hover tooltip */}
        {showTooltip && (
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap animate-fade-in"
            style={{ backgroundColor: 'var(--bg-overlay)', color: 'var(--accent)', border: '1px solid var(--border)' }}
          >
            Upgrade for full access →
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="px-4 py-3 rounded-xl animate-glow"
      style={{
        background: 'linear-gradient(135deg, var(--accent-muted), var(--bg-elevated))',
        border: '1px solid var(--border-accent)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-5 h-5" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <span className="text-sm font-bold" style={{ color: 'var(--accent-soft)' }}>
          {subscription.planName || 'Premium'} ✦
        </span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: 'var(--text-secondary)' }}>
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
        <span className="font-semibold" style={{ color: 'var(--accent)' }}>
          {subscription.price}
        </span>
      </div>
    </div>
  );
}
