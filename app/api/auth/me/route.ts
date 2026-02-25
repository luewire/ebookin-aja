import { NextResponse } from 'next/server';
import { AuthenticatedRequest, withAuth } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';
import { checkAndNotifySubscriptionExpiry } from '@/lib/subscription';

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

    let plan = 'Free';
    let subscription = user.subscription;

    if (subscription && subscription.status === 'ACTIVE') {
      // Always perform the check to create notifications if needed
      if (subscription.endDate) {
        await checkAndNotifySubscriptionExpiry(user.id, subscription.endDate, subscription.planName);
      }

      if (subscription.endDate && new Date(subscription.endDate) < new Date()) {
        // Expired
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: 'EXPIRED' }
        });
        subscription.status = 'EXPIRED';
      } else {
        plan = 'Premium';
      }
    }

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
