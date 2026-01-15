'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface ReadingSession {
  id: string;
  user_id: string;
  ebook_id: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
  is_valid: boolean;
  ebook_title?: string;
  user_email?: string;
}

interface Stats {
  totalSessions: number;
  validSessions: number;
  totalReadingTime: number;
  avgReadingTime: number;
  uniqueReaders: number;
}

export default function AdminStatsPage() {
  const { user, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    validSessions: 0,
    totalReadingTime: 0,
    avgReadingTime: 0,
    uniqueReaders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.email !== 'admin@admin.com') {
        router.push('/unauthorized');
      } else {
        fetchStats();
      }
    }
  }, [user, authLoading]);

  const fetchStats = async () => {
    try {
      // Fetch all reading sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('reading_sessions')
        .select('*')
        .order('start_time', { ascending: false })
        .limit(100);

      if (sessionsError) throw sessionsError;

      // Fetch ebook titles and user emails for display
      const sessionsWithDetails = await Promise.all(
        (sessionsData || []).map(async (session) => {
          const { data: ebookData } = await supabase
            .from('ebooks')
            .select('title')
            .eq('id', session.ebook_id)
            .single();

          return {
            ...session,
            ebook_title: ebookData?.title || 'Unknown',
            user_email: session.user_id,
          };
        })
      );

      setSessions(sessionsWithDetails);

      // Calculate stats
      const totalSessions = sessionsWithDetails.length;
      const validSessions = sessionsWithDetails.filter(s => s.is_valid).length;
      const totalReadingTime = sessionsWithDetails.reduce((sum, s) => sum + s.duration_seconds, 0);
      const avgReadingTime = totalSessions > 0 ? totalReadingTime / totalSessions : 0;
      const uniqueReaders = new Set(sessionsWithDetails.map(s => s.user_id)).size;

      setStats({
        totalSessions,
        validSessions,
        totalReadingTime,
        avgReadingTime,
        uniqueReaders,
      });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (authLoading || loading || !user || user.email !== 'admin@admin.com') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">📊 Statistics</h1>
            <Link
              href="/admin"
              className="min-h-[44px] flex items-center justify-center rounded-lg px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              ← Back to Admin
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Platform Statistics</h2>
          <p className="mt-2 text-base text-gray-600">View reading sessions and engagement metrics</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4">
            <p className="text-base text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="text-sm font-medium text-gray-600">Total Sessions</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalSessions}</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="text-sm font-medium text-gray-600">Valid Sessions</div>
            <div className="mt-2 text-3xl font-bold text-green-600">{stats.validSessions}</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="text-sm font-medium text-gray-600">Total Reading Time</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{formatDuration(stats.totalReadingTime)}</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="text-sm font-medium text-gray-600">Avg Session Time</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{formatDuration(Math.floor(stats.avgReadingTime))}</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="text-sm font-medium text-gray-600">Unique Readers</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">{stats.uniqueReaders}</div>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="rounded-lg bg-white shadow-md">
          <div className="border-b px-6 py-4">
            <h3 className="text-xl font-semibold text-gray-900">Recent Reading Sessions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ebook</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Start Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Duration</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-base text-gray-900">{session.ebook_title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{session.user_id.slice(0, 8)}...</td>
                    <td className="px-6 py-4 text-base text-gray-600">{formatDate(session.start_time)}</td>
                    <td className="px-6 py-4 text-base text-gray-900">{formatDuration(session.duration_seconds)}</td>
                    <td className="px-6 py-4">
                      {session.is_valid ? (
                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                          Valid
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                          Invalid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sessions.length === 0 && (
            <div className="p-12 text-center">
              <div className="mb-4 text-6xl">📊</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No reading sessions yet</h3>
              <p className="text-base text-gray-600">Sessions will appear here once users start reading</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
