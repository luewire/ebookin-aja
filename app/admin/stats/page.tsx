'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

interface StatsData {
  stats: {
    users: { total: number; newLast30Days: number; activeSubscribers: number };
    ebooks: { total: number; active: number; totalReads: number };
    readingSessions: { active: number };
    revenue: { total: number; transactionCount: number };
    subscriptions: { breakdown: { plan: string; count: number }[] };
  };
  recentEvents: {
    id: string;
    type: string;
    title: string;
    description: string;
    createdAt: string;
  }[];
}

// Additional trending/order stats
interface ExtraStats {
  pendingOrders: number;
  autoApprovedOrders: number;
  totalOrders: number;
  topTrending: { id: string; title: string; trendingScore: number; totalViews: number; totalReads: number }[];
}

export default function AdminStatsPage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<StatsData | null>(null);
  const [extraStats, setExtraStats] = useState<ExtraStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const getAuthToken = async () => {
    if (!user) return null;
    return await auth.currentUser?.getIdToken();
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        const isAdmin = user.role === 'Admin' || user.role === 'ADMIN' || user.email === 'admin@admin.com';
        if (!isAdmin) {
          router.push('/unauthorized');
        } else {
          fetchAllStats();
        }
      }
    }
  }, [user, authLoading]);

  const fetchAllStats = async () => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      // Fetch main stats
      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch stats');
      const statsData = await res.json();
      setData(statsData);

      // Fetch extra order + trending stats
      try {
        const ordersRes = await fetch('/api/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          const orders = ordersData.orders || [];
          setExtraStats({
            totalOrders: orders.length,
            pendingOrders: orders.filter((o: any) => o.status === 'PENDING').length,
            autoApprovedOrders: orders.filter((o: any) => o.status === 'AUTO_APPROVED').length,
            topTrending: [], // Will be populated if we add a trending API
          });
        }
      } catch { }

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'Admin' || user?.role === 'ADMIN' || user?.email === 'admin@admin.com';

  if (authLoading || loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4" style={{ borderColor: 'var(--bg-elevated)', borderTopColor: 'var(--accent)' }}></div>
      </div>
    );
  }

  const s = data?.stats;

  // Card component
  const StatCard = ({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) => (
    <div className="p-5 rounded-2xl transition-all hover:scale-[1.02]" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '18', color }}>
          {icon}
        </div>
        <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
      </div>
      <div className="text-3xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>{value}</div>
      {sub && <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{sub}</p>}
    </div>
  );

  const getEventIcon = (type: string) => {
    if (type.includes('USER')) return '👤';
    if (type.includes('EBOOK') || type.includes('BOOK')) return '📚';
    if (type.includes('ORDER') || type.includes('PAYMENT')) return '💳';
    if (type.includes('SUBSCRIPTION')) return '⭐';
    return '📌';
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-muted)' }}>
            <svg className="w-5 h-5" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Statistics</h1>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Platform analytics & metrics overview</p>
          </div>
        </div>
        <button
          onClick={fetchAllStats}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          label="Total Users"
          value={s?.users.total || 0}
          sub={`+${s?.users.newLast30Days || 0} bulan ini`}
          color="#6366f1"
        />
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          label="Total Ebooks"
          value={s?.ebooks.total || 0}
          sub={`${s?.ebooks.active || 0} aktif`}
          color="#10b981"
        />
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
          label="Active Subscribers"
          value={s?.users.activeSubscribers || 0}
          color="#f59e0b"
        />
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
          label="Active Readers"
          value={s?.readingSessions.active || 0}
          sub="30 menit terakhir"
          color="#ec4899"
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          label="Total Orders"
          value={extraStats?.totalOrders || 0}
          sub={`${extraStats?.pendingOrders || 0} pending`}
          color="#8b5cf6"
        />
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Auto-Approved"
          value={extraStats?.autoApprovedOrders || 0}
          sub="by OCR system"
          color="#22c55e"
        />
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          label="Total Revenue"
          value={`Rp${((s?.revenue.total || 0) / 1000).toFixed(0)}K`}
          sub={`${s?.revenue.transactionCount || 0} transaksi`}
          color="#0ea5e9"
        />
        <StatCard
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>}
          label="Total Reads"
          value={s?.ebooks.totalReads || 0}
          color="#f43f5e"
        />
      </div>

      {/* Subscription Breakdown + Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription Breakdown */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <h2 className="text-lg font-bold font-display mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span>⭐</span> Subscription Plans
          </h2>
          <div className="space-y-3">
            {(s?.subscriptions.breakdown || []).length === 0 ? (
              <p className="text-sm py-4 text-center" style={{ color: 'var(--text-tertiary)' }}>Belum ada subscriber aktif</p>
            ) : (
              s?.subscriptions.breakdown.map((item, i) => {
                const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];
                const planLabels: Record<string, string> = { '1month': '1 Bulan', '3months': '3 Bulan', '1year': '1 Tahun' };
                const total = s.subscriptions.breakdown.reduce((sum, b) => sum + b.count, 0);
                const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;

                return (
                  <div key={item.plan} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{planLabels[item.plan] || item.plan}</span>
                      <span className="font-bold" style={{ color: colors[i % colors.length] }}>{item.count} <span className="text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>({pct}%)</span></span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: colors[i % colors.length] }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="lg:col-span-2 rounded-2xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="text-lg font-bold font-display flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span>📋</span> Recent Activity
            </h2>
            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-tertiary)' }}>
              Last 20
            </span>
          </div>
          <div className="divide-y max-h-[400px] overflow-y-auto" style={{ divideColor: 'var(--border)' }}>
            {(data?.recentEvents || []).length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-4xl mb-2">📊</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>No events yet</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Activity will show up here</p>
              </div>
            ) : (
              data?.recentEvents.map((event) => (
                <div key={event.id} className="px-6 py-3 flex items-start gap-3 hover:bg-[var(--bg-elevated)] transition-colors">
                  <span className="text-lg mt-0.5">{getEventIcon(event.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{event.title}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>{event.description}</p>
                  </div>
                  <span className="text-xs whitespace-nowrap flex-shrink-0" style={{ color: 'var(--text-tertiary)' }}>
                    {new Date(event.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
