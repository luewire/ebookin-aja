import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

interface TrendingEbook {
  rank: number;
  ebookId: string;
  title: string;
  author: string;
  cover: string;
  category: string;
  statistics: {
    averageDuration: number;
    averageDurationMinutes: number;
    totalSessions: number;
    totalDurationHours: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();

    // Query to get aggregated session statistics with ebook details
    const { data, error } = await supabase.rpc('get_trending_ebooks', {
      limit_count: 10
    });

    if (error) {
      console.error('Database error:', error);
      
      // Fallback: manual aggregation if RPC function doesn't exist
      const { data: sessions, error: sessionsError } = await supabase
        .from('reading_sessions')
        .select(`
          ebook_id,
          duration_seconds,
          ebooks (
            id,
            title,
            author,
            cover,
            category
          )
        `)
        .eq('is_valid', true)
        .not('duration_seconds', 'is', null);

      if (sessionsError) {
        throw sessionsError;
      }

      // Manual aggregation
      const ebookStats = new Map<string, {
        ebook: any;
        totalDuration: number;
        totalSessions: number;
        durations: number[];
      }>();

      sessions?.forEach((session: any) => {
        const ebookId = session.ebook_id;
        if (!ebookStats.has(ebookId)) {
          ebookStats.set(ebookId, {
            ebook: session.ebooks,
            totalDuration: 0,
            totalSessions: 0,
            durations: [],
          });
        }
        const stats = ebookStats.get(ebookId)!;
        stats.totalDuration += session.duration_seconds;
        stats.totalSessions += 1;
        stats.durations.push(session.duration_seconds);
      });

      // Convert to array and calculate averages
      const trendingData = Array.from(ebookStats.entries())
        .map(([ebookId, stats]) => {
          const averageDuration = stats.totalDuration / stats.totalSessions;
          return {
            ebook_id: ebookId,
            title: stats.ebook.title,
            author: stats.ebook.author,
            cover: stats.ebook.cover,
            category: stats.ebook.category,
            average_duration: averageDuration,
            total_sessions: stats.totalSessions,
            total_duration: stats.totalDuration,
          };
        })
        .sort((a, b) => b.average_duration - a.average_duration)
        .slice(0, 10);

      const trendingEbooks: TrendingEbook[] = trendingData.map((item, index) => ({
        rank: index + 1,
        ebookId: item.ebook_id,
        title: item.title,
        author: item.author,
        cover: item.cover,
        category: item.category,
        statistics: {
          averageDuration: Math.round(item.average_duration),
          averageDurationMinutes: Math.round((item.average_duration / 60) * 100) / 100,
          totalSessions: item.total_sessions,
          totalDurationHours: Math.round((item.total_duration / 3600) * 100) / 100,
        },
      }));

      return NextResponse.json(
        {
          message: 'Trending ebooks retrieved successfully',
          count: trendingEbooks.length,
          data: trendingEbooks,
          generatedAt: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    // Format response from RPC function
    const trendingEbooks: TrendingEbook[] = data.map((item: any, index: number) => ({
      rank: index + 1,
      ebookId: item.ebook_id,
      title: item.title,
      author: item.author,
      cover: item.cover,
      category: item.category,
      statistics: {
        averageDuration: item.average_duration,
        averageDurationMinutes: item.average_duration_minutes,
        totalSessions: item.total_sessions,
        totalDurationHours: item.total_duration_hours,
      },
    }));

    return NextResponse.json(
      {
        message: 'Trending ebooks retrieved successfully',
        count: trendingEbooks.length,
        data: trendingEbooks,
        generatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching trending ebooks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
