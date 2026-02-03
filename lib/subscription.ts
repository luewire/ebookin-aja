/**
 * Server-side subscription utilities for production use
 * This file contains business logic for subscription management
 */

import { prisma } from '@/lib/prisma';
import { SubscriptionStatus } from '@prisma/client';

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  planName: string;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
}

/**
 * Check if user has an active subscription (SERVER-SIDE ONLY)
 * Production-ready: queries database, not client storage
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: {
        status: true,
        endDate: true,
      },
    });

    if (!subscription || subscription.status !== 'ACTIVE') {
      return false;
    }

    // Check if subscription has expired
    if (subscription.endDate && new Date() > subscription.endDate) {
      // Auto-expire the subscription
      await prisma.subscription.update({
        where: { userId },
        data: { status: 'EXPIRED' },
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

/**
 * Get user's subscription details (SERVER-SIDE ONLY)
 */
export async function getUserSubscription(userId: string): Promise<SubscriptionInfo | null> {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: {
        status: true,
        planName: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!subscription) {
      return null;
    }

    // Check and update if expired
    const isActive = subscription.status === 'ACTIVE' &&
      (!subscription.endDate || new Date() <= subscription.endDate);

    if (!isActive && subscription.status === 'ACTIVE') {
      await prisma.subscription.update({
        where: { userId },
        data: { status: 'EXPIRED' },
      });
    }

    return {
      ...subscription,
      isActive: isActive && subscription.status === 'ACTIVE',
    };
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
}

/**
 * Calculate subscription end date based on plan
 */
export function calculateEndDate(planName: string, startDate: Date = new Date()): Date {
  const endDate = new Date(startDate);
  
  switch (planName) {
    case '1month':
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case '3months':
      endDate.setMonth(endDate.getMonth() + 3);
      break;
    case '1year':
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    default:
      endDate.setMonth(endDate.getMonth() + 1);
  }
  
  return endDate;
}

/**
 * Activate subscription (called from webhook handler)
 */
export async function activateSubscription(
  userId: string,
  planName: string,
  orderId: string,
  grossAmount: number
): Promise<void> {
  const startDate = new Date();
  const endDate = calculateEndDate(planName, startDate);

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      status: 'ACTIVE',
      planName,
      startDate,
      endDate,
      orderId,
      grossAmount,
    },
    update: {
      status: 'ACTIVE',
      planName,
      startDate,
      endDate,
      orderId,
      grossAmount,
    },
  });

  // Log admin event
  await prisma.adminEvent.create({
    data: {
      type: 'subscription',
      title: 'Subscription Activated',
      description: `User subscription activated: ${planName}`,
      metadata: { userId, orderId, planName },
    },
  });
}

/**
 * Cancel subscription (called from webhook or admin action)
 */
export async function cancelSubscription(userId: string): Promise<void> {
  await prisma.subscription.update({
    where: { userId },
    data: { status: 'CANCELLED' },
  });

  // Log admin event
  await prisma.adminEvent.create({
    data: {
      type: 'subscription',
      title: 'Subscription Cancelled',
      description: `User subscription cancelled`,
      metadata: { userId },
    },
  });
}
