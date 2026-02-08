import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { createPayment, getPlanDetails } from '@/lib/ipaymu';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/subscriptions/create
 * Create a new subscription payment with iPaymu
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

    // Get user name for iPaymu
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    // Create iPaymu payment
    const paymentResponse = await createPayment({
      orderId,
      amount: planDetails.price,
      customerDetails: {
        name: user?.name || userEmail.split('@')[0],
        email: userEmail,
      },
      product: [planDetails.name],
      qty: [1],
      price: [planDetails.price],
    });

    console.log('[API] iPaymu payment response:', paymentResponse);

    // iPaymu might return Data or data, Url or url
    const paymentData = paymentResponse.Data || paymentResponse.data;
    const paymentUrl = paymentData?.Url || paymentData?.url;
    const sessionId = paymentData?.SessionID || paymentData?.sessionId;

    if (!paymentUrl) {
      console.error('[API] No payment URL in response:', paymentResponse);
      throw new Error('Payment URL not received from iPaymu');
    }

    return NextResponse.json(
      {
        paymentUrl,
        sessionId,
        orderId,
        grossAmount: planDetails.price,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Create subscription error:', error);
    console.error('Error details:', error.message, error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription payment' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(createHandler);
