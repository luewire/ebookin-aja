import { NextRequest, NextResponse } from 'next/server';
import { verifyCallback } from '@/lib/ipaymu';
import { prisma } from '@/lib/prisma';
import { activateSubscription, cancelSubscription } from '@/lib/subscription';

/**
 * POST /api/webhooks/ipaymu
 * Handle iPaymu payment notification webhook
 * 
 * This endpoint must be registered in iPaymu Dashboard:
 * Settings > Integration > Callback URL
 * 
 * Security: Verifies signature from iPaymu before processing
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // Get signature from header
    const receivedSignature = req.headers.get('signature') || '';

    const {
      reference_id,
      status,
      status_code,
      transaction_id,
      via,
      channel,
      amount,
      fee,
      buyer_name,
      buyer_email,
      buyer_phone,
    } = payload;

    // Log webhook received
    console.log('[iPaymu Webhook] Received:', {
      reference_id,
      status,
      status_code,
      transaction_id,
    });

    // Verify signature
    const isValid = verifyCallback(payload, receivedSignature);

    if (!isValid) {
      console.error('[iPaymu Webhook] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      );
    }

    // Find subscription by orderId (reference_id)
    const subscription = await prisma.subscription.findUnique({
      where: { orderId: reference_id },
      include: { user: true },
    });

    if (!subscription) {
      console.error('[iPaymu Webhook] Subscription not found:', reference_id);
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Process transaction status
    // iPaymu status codes:
    // 0 = pending
    // 1 = paid/success
    // 2 = expired
    // 3 = failed
    // 4 = refund
    let newStatus: 'PENDING' | 'SETTLEMENT' | 'EXPIRE' | 'CANCEL' | 'DENY' = 'PENDING';
    let shouldActivate = false;
    let shouldCancel = false;

    if (status_code === 1 || status === 'berhasil' || status === 'success') {
      newStatus = 'SETTLEMENT';
      shouldActivate = true;
    } else if (status_code === 0 || status === 'pending') {
      newStatus = 'PENDING';
    } else if (status_code === 2 || status === 'expired') {
      newStatus = 'EXPIRE';
      shouldCancel = true;
    } else if (status_code === 3 || status === 'failed') {
      newStatus = 'DENY';
      shouldCancel = true;
    } else if (status_code === 4 || status === 'refund') {
      newStatus = 'CANCEL';
      shouldCancel = true;
    }

    // Update or create transaction record
    await prisma.transaction.upsert({
      where: { orderId: reference_id },
      create: {
        subscriptionId: subscription.id,
        orderId: reference_id,
        transactionStatus: newStatus,
        grossAmount: parseInt(amount || '0'),
        paymentType: via || channel,
        transactionTime: new Date(),
        settlementTime: newStatus === 'SETTLEMENT' ? new Date() : null,
        webhookPayload: payload,
      },
      update: {
        transactionStatus: newStatus,
        paymentType: via || channel,
        settlementTime: newStatus === 'SETTLEMENT' ? new Date() : null,
        webhookPayload: payload,
      },
    });

    // Activate subscription if payment successful
    if (shouldActivate) {
      await activateSubscription(
        subscription.userId,
        subscription.planName,
        reference_id,
        parseInt(amount || '0')
      );

      console.log('[iPaymu Webhook] Subscription activated:', {
        userId: subscription.userId,
        orderId: reference_id,
      });
    }

    // Cancel subscription if payment failed/expired
    if (shouldCancel) {
      await cancelSubscription(subscription.userId);

      console.log('[iPaymu Webhook] Subscription cancelled:', {
        userId: subscription.userId,
        orderId: reference_id,
      });
    }

    // Update subscription transaction reference
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { transactionId: transaction_id },
    });

    return NextResponse.json(
      { success: true, message: 'Webhook processed' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[iPaymu Webhook] Error:', error);

    // Return 200 to prevent iPaymu from retrying
    return NextResponse.json(
      { success: false, message: 'Error processing webhook' },
      { status: 200 }
    );
  }
}

// Allow POST without authentication (iPaymu webhook)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
