import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

interface CreateSessionBody {
  userId: string;
  ebookId: string;
}

interface EndSessionBody {
  sessionId: string;
}

// POST /api/reading-sessions - Start a new reading session
export async function POST(request: NextRequest) {
  try {
    const body: CreateSessionBody = await request.json();
    const { userId, ebookId } = body;

    // Validate required fields
    if (!userId || !ebookId) {
      return NextResponse.json(
        { error: 'userId and ebookId are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Check for existing active session (no end_time)
    const { data: activeSession } = await supabase
      .from('reading_sessions')
      .select('id')
      .eq('user_id', userId)
      .eq('ebook_id', ebookId)
      .is('end_time', null)
      .single();

    if (activeSession) {
      return NextResponse.json(
        {
          error: 'Active reading session already exists for this ebook',
          sessionId: activeSession.id,
        },
        { status: 409 }
      );
    }

    // Create new reading session
    const now = new Date().toISOString();
    const { data: newSession, error } = await supabase
      .from('reading_sessions')
      .insert({
        user_id: userId,
        ebook_id: ebookId,
        start_time: now,
        created_at: now,
      })
      .select('id, start_time')
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create reading session' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        sessionId: newSession.id,
        startTime: newSession.start_time,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating reading session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/reading-sessions - End a reading session
export async function PATCH(request: NextRequest) {
  try {
    const body: EndSessionBody = await request.json();
    const { sessionId } = body;

    // Validate sessionId
    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Find active session (no end_time)
    const { data: session, error: fetchError } = await supabase
      .from('reading_sessions')
      .select('id, start_time')
      .eq('id', sessionId)
      .is('end_time', null)
      .single();

    if (fetchError || !session) {
      return NextResponse.json(
        { error: 'Active reading session not found' },
        { status: 404 }
      );
    }

    // Calculate duration in seconds
    const endTime = new Date();
    const startTime = new Date(session.start_time);
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    // Validate session (minimum 20 minutes = 1200 seconds)
    const isValid = durationSeconds >= 1200;

    // Update session
    const { error: updateError } = await supabase
      .from('reading_sessions')
      .update({
        end_time: endTime.toISOString(),
        duration_seconds: durationSeconds,
        is_valid: isValid,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);

    if (updateError) {
      console.error('Database error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update reading session' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        sessionId,
        durationSeconds,
        durationMinutes: Math.round(durationSeconds / 60),
        isValid,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error ending reading session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
