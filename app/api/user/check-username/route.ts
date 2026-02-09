import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Check if username is available
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json({ 
        available: false,
        error: 'Username must be 3-20 characters (letters, numbers, underscore only)' 
      }, { status: 400 });
    }

    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: { id: true }
    });

    return NextResponse.json({
      available: !existingUser,
      username: username.toLowerCase()
    });
  } catch (error: any) {
    console.error('Error checking username:', error);
    return NextResponse.json(
      { error: 'Failed to check username', details: error.message },
      { status: 500 }
    );
  }
}
