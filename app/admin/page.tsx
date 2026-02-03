'use client';

import Link from 'next/link';

export default function AdminPage() {
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
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                +12% vs last month
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Registered Users</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">12,842</p>
          </div>

          {/* Total Books Read */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                +8.4% vs last week
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Books Read</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">45,210</p>
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
            <p className="text-3xl font-bold text-slate-900 dark:text-white">1,402</p>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Recent Platform Events */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Platform Events</h3>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All Activity</button>
              </div>
              
              <div className="space-y-4">
                {/* Event 1 */}
                <div className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">New Subscription</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Premium plan purchased by user #9041</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">2 minutes ago</p>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="flex items-start gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Content Audit Complete</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Quality check finalized for 12 new titles</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">1 hour ago</p>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">System Alert</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Minor latency spike in European region</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Platform Health */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white h-full">
              <h3 className="text-lg font-semibold mb-4">Platform Health</h3>
              <p className="text-sm text-indigo-100 mb-6">All systems operational. Network latency 24ms.</p>
              
              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-indigo-100">System Status</span>
                    <span className="font-semibold">99.9%</span>
                  </div>
                  <div className="h-2 bg-indigo-400/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '99.9%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-indigo-400/30">
                <span className="text-sm text-indigo-100">All systems operational</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

