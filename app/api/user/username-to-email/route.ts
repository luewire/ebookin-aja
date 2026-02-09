import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Get email from username
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username } = body;
    
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 });
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      select: { email: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ email: user.email });
  } catch (error: any) {
    console.error('Error getting email from username:', error);
    return NextResponse.json(
      { error: 'Failed to get email', details: error.message },
      { status: 500 }
    );
  }
}
