import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Check if email is available
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        available: false,
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    // Check if email exists in database
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true }
    });

    return NextResponse.json({
      available: !existingUser,
      email: email.toLowerCase()
    });
  } catch (error: any) {
    console.error('Error checking email:', error);
    return NextResponse.json(
      { error: 'Failed to check email', details: error.message },
      { status: 500 }
    );
  }
}
