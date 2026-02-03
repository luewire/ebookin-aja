import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/auth/sync
 * Syncs Firebase user with PostgreSQL database
 * Called after user signs up or logs in via Firebase
 */
export async function POST(req: NextRequest) {
  try {
    const { idToken, name } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      );
    }

    // Verify Firebase token
    const decodedToken = await verifyIdToken(idToken);
    if (!decodedToken) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { uid, email } = decodedToken;

    if (!email) {
      return NextResponse.json(
        { error: 'Email not found in token' },
        { status: 400 }
      );
    }

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { firebaseUid: uid },
      create: {
        firebaseUid: uid,
        email,
        name: name || email.split('@')[0],
        role: 'USER',
      },
      update: {
        email,
        ...(name && { name }),
      },
      select: {
        id: true,
        firebaseUid: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // Log system event for new users
    const isNewUser = new Date(user.createdAt).getTime() > Date.now() - 5000; // Created within last 5 seconds
    if (isNewUser) {
      await prisma.adminEvent.create({
        data: {
          type: 'audit',
          title: 'New User Registered',
          description: `New user registered: ${user.email}`,
          metadata: { userId: user.id, email: user.email },
        },
      });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Auth sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
}
