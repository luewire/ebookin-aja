import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { getUserSubscription } from '@/lib/subscription';

/**
 * GET /api/subscriptions/status
 * Get user's current subscription status
 */
async function statusHandler(req: AuthenticatedRequest) {
  try {
    const userId = req.user!.id;

    const subscription = await getUserSubscription(userId);

    if (!subscription) {
      return NextResponse.json(
        {
          hasSubscription: false,
          subscription: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        hasSubscription: subscription.isActive,
        subscription: {
          status: subscription.status,
          planName: subscription.planName,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          isActive: subscription.isActive,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get subscription status error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription status' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(statusHandler);
