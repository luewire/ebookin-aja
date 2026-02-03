import { NextRequest, NextResponse } from 'next/server';
import { verifySignature } from '@/lib/midtrans';
import { prisma } from '@/lib/prisma';
import { activateSubscription, cancelSubscription } from '@/lib/subscription';

/**
 * POST /api/webhooks/midtrans
 * Handle Midtrans payment notification webhook
 * 
 * This endpoint must be registered in Midtrans Dashboard:
 * Settings > Configuration > Payment Notification URL
 * 
 * Security: Verifies signature from Midtrans before processing
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
      transaction_time,
      settlement_time,
      transaction_id,
    } = payload;

    // Log webhook received
    console.log('[Midtrans Webhook] Received:', {
      order_id,
      transaction_status,
      fraud_status,
    });

    // Verify signature
    const isValid = verifySignature(
      order_id,
      status_code,
      gross_amount,
      signature_key
    );

    if (!isValid) {
      console.error('[Midtrans Webhook] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      );
    }

    // Find subscription by orderId
    const subscription = await prisma.subscription.findUnique({
      where: { orderId: order_id },
      include: { user: true },
    });

    if (!subscription) {
      console.error('[Midtrans Webhook] Subscription not found:', order_id);
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Process transaction status
    let newStatus: 'PENDING' | 'SETTLEMENT' | 'EXPIRE' | 'CANCEL' | 'DENY' = 'PENDING';
    let shouldActivate = false;
    let shouldCancel = false;

    if (transaction_status === 'capture') {
      if (fraud_status === 'accept') {
        newStatus = 'SETTLEMENT';
        shouldActivate = true;
      }
    } else if (transaction_status === 'settlement') {
      newStatus = 'SETTLEMENT';
      shouldActivate = true;
    } else if (transaction_status === 'pending') {
      newStatus = 'PENDING';
    } else if (
      transaction_status === 'deny' ||
      transaction_status === 'cancel'
    ) {
      newStatus = transaction_status === 'deny' ? 'DENY' : 'CANCEL';
      shouldCancel = true;
    } else if (transaction_status === 'expire') {
      newStatus = 'EXPIRE';
      shouldCancel = true;
    }

    // Update or create transaction record
    await prisma.transaction.upsert({
      where: { orderId: order_id },
      create: {
        subscriptionId: subscription.id,
        orderId: order_id,
        transactionStatus: newStatus,
        grossAmount: parseInt(gross_amount),
        paymentType: payment_type,
        transactionTime: transaction_time ? new Date(transaction_time) : null,
        settlementTime: settlement_time ? new Date(settlement_time) : null,
        webhookPayload: payload,
      },
      update: {
        transactionStatus: newStatus,
        paymentType: payment_type,
        transactionTime: transaction_time ? new Date(transaction_time) : null,
        settlementTime: settlement_time ? new Date(settlement_time) : null,
        webhookPayload: payload,
      },
    });

    // Activate subscription if payment successful
    if (shouldActivate) {
      await activateSubscription(
        subscription.userId,
        subscription.planName,
        order_id,
        parseInt(gross_amount)
      );

      console.log('[Midtrans Webhook] Subscription activated:', {
        userId: subscription.userId,
        orderId: order_id,
      });
    }

    // Cancel subscription if payment failed/expired
    if (shouldCancel) {
      await cancelSubscription(subscription.userId);

      console.log('[Midtrans Webhook] Subscription cancelled:', {
        userId: subscription.userId,
        orderId: order_id,
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
    console.error('[Midtrans Webhook] Error:', error);
    
    // Return 200 to prevent Midtrans from retrying
    // Log error for manual investigation
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 200 }
    );
  }
}

// Allow POST without authentication (Midtrans webhook)
// Signature verification provides security
export const dynamic = 'force-dynamic';
