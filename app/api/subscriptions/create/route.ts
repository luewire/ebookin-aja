import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { createSnapToken, getPlanDetails } from '@/lib/midtrans';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/subscriptions/create
 * Create a new subscription payment
 */
async function createHandler(req: AuthenticatedRequest) {
  try {
    const { planName } = await req.json();
    const userId = req.user!.id;
    const userEmail = req.user!.email;

    // Validate plan
    const planDetails = getPlanDetails(planName);
    if (!planDetails) {
      return NextResponse.json(
        { error: 'Invalid plan name' },
        { status: 400 }
      );
    }

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findUnique({
      where: { userId },
      select: { status: true, endDate: true },
    });

    if (
      existingSubscription?.status === 'ACTIVE' &&
      existingSubscription.endDate &&
      new Date() < existingSubscription.endDate
    ) {
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 }
      );
    }

    // Generate unique order ID
    const orderId = `SUB-${userId}-${Date.now()}`;

    // Create or update subscription record (PENDING status)
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        status: 'PENDING',
        planName,
        orderId,
        grossAmount: planDetails.price,
      },
      update: {
        status: 'PENDING',
        planName,
        orderId,
        grossAmount: planDetails.price,
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        subscriptionId: (await prisma.subscription.findUnique({ where: { userId } }))!.id,
        orderId,
        transactionStatus: 'PENDING',
        grossAmount: planDetails.price,
      },
    });

    // Get user name for Midtrans
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    // Create Midtrans Snap token
    const snapResponse = await createSnapToken({
      orderId,
      grossAmount: planDetails.price,
      customerDetails: {
        email: userEmail,
        firstName: user?.name || userEmail.split('@')[0],
      },
      itemDetails: [
        {
          id: planName,
          name: planDetails.name,
          price: planDetails.price,
          quantity: 1,
        },
      ],
    });

    return NextResponse.json(
      {
        snapToken: snapResponse.token,
        orderId,
        grossAmount: planDetails.price,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription payment' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(createHandler);
