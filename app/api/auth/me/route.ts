import { NextResponse } from 'next/server';
import { AuthenticatedRequest, withAuth } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

async function handler(req: AuthenticatedRequest) {
  try {
    const firebaseUid = req.user?.firebaseUid;

    if (!firebaseUid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const plan = user.subscription?.status === 'ACTIVE' ? 'Premium' : 'Free';
    // Also consider role === 'ADMIN' as having access, but "Plan" itself is technically separate.
    // However, usually Admins have premium access. 
    // Let's return what we found.

    return NextResponse.json({
      user: {
        ...user,
        plan,
      },
    });
  } catch (error) {
    console.error('Error fetching me:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = withAuth(handler);
export const dynamic = 'force-dynamic';
