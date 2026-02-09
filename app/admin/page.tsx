'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { formatDistanceToNow } from 'date-fns';

interface OverviewData {
  overview: {
    totalUsers: { current: number; vsLastMonth: string };
    totalBooksRead: { current: number; vsLastWeek: string };
    activeSessions: { current: number };
  };
  recentEvents: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    createdAt: string;
  }>;
  health: {
    status: string;
    latency: string;
    uptime: string;
  };
}

export default function AdminPage() {
  const { user } = useAuth();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      const token = await user?.getIdToken();
      if (!token) return;

      const response = await fetch('/api/admin/overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch overview data');
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOverview();
      // Auto refresh every 30 seconds for real-time feel
      const interval = setInterval(fetchOverview, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse" />
          <div className="h-64 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
        Error loading overview: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* Title Section */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Live Insights Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time platform performance and reading metrics across your library.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Registered Users */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${Number(data?.overview.totalUsers.vsLastMonth) >= 0 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' : 'text-rose-600 bg-rose-50 dark:bg-rose-900/30'}`}>
                {Number(data?.overview.totalUsers.vsLastMonth) >= 0 ? '+' : ''}{data?.overview.totalUsers.vsLastMonth}% vs last month
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Registered Users</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{data?.overview.totalUsers.current.toLocaleString()}</p>
          </div>

          {/* Total Books Read */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${Number(data?.overview.totalBooksRead.vsLastWeek) >= 0 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' : 'text-rose-600 bg-rose-50 dark:bg-rose-900/30'}`}>
                {Number(data?.overview.totalBooksRead.vsLastWeek) >= 0 ? '+' : ''}{data?.overview.totalBooksRead.vsLastWeek}% vs last week
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Books Read</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{data?.overview.totalBooksRead.current.toLocaleString()}</p>
          </div>

          {/* Active Reading Sessions */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE NOW
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Active Reading Sessions</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{data?.overview.activeSessions.current.toLocaleString()}</p>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Recent Platform Events */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Platform Events</h3>
                <Link href="/admin/activity" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All Activity</Link>
              </div>
              
              <div className="space-y-4">
                {data?.recentEvents.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No recent events found.</p>
                ) : (
                  data?.recentEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        event.type === 'SUBSCRIPTION' ? 'bg-emerald-500' :
                        event.type === 'USER_REGISTER' ? 'bg-blue-500' :
                        event.type === 'SYSTEM' ? 'bg-rose-500' : 'bg-slate-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{event.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{event.description}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Platform Health */}
          <div className="lg:col-span-1">
            <div className={`rounded-xl p-6 text-white h-full transition-colors duration-500 ${
              data?.health.status === 'ok' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-rose-500 to-orange-600'
            }`}>
              <h3 className="text-lg font-semibold mb-4">Platform Health</h3>
              <p className="text-sm text-indigo-100 mb-6">
                {data?.health.status === 'ok' ? 'All systems operational.' : 'Some systems experiencing issues.'} Network latency {data?.health.latency}.
              </p>
              
              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-indigo-100">System Uptime</span>
                    <span className="font-semibold">{data?.health.uptime}</span>
                  </div>
                  <div className="h-2 bg-indigo-400/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: data?.health.uptime }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-indigo-400/30">
                <span className="text-sm text-indigo-100">
                  {data?.health.status === 'ok' ? 'All systems operational' : 'System warning'}
                </span>
                <svg className={`w-5 h-5 ${data?.health.status === 'ok' ? 'text-white' : 'text-rose-200 animate-pulse'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {data?.health.status === 'ok' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  )}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/ebooks" className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
            <svg className="w-8 h-8 text-indigo-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">Manage Ebooks</p>
          </Link>

          <Link href="/admin/banners" className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
            <svg className="w-8 h-8 text-indigo-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">Manage Banners</p>
          </Link>

          <Link href="/admin/users" className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
            <svg className="w-8 h-8 text-indigo-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">User Management</p>
          </Link>

          <Link href="/admin/stats" className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
            <svg className="w-8 h-8 text-indigo-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">Statistics</p>
          </Link>
        </div>
    </div>
  );
}

