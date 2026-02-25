/**
 * Fraud Detection Service
 * Prevents duplicate payments and rate-limits order submissions
 */

import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

/**
 * Generate SHA256 hash from image URL content for duplicate detection
 */
export async function generateImageHash(imageUrl: string): Promise<string> {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('Failed to fetch image');

        const buffer = await response.arrayBuffer();
        const hash = crypto.createHash('sha256').update(Buffer.from(buffer)).digest('hex');
        return hash;
    } catch (error) {
        console.error('[FraudDetection] Image hash generation failed:', error);
        // Return a random hash so we don't block the order, just can't detect duplicates
        return crypto.randomUUID();
    }
}

/**
 * Check if the same image has been used before
 */
export async function checkDuplicateImage(imageHash: string, excludeOrderId?: string): Promise<{
    isDuplicate: boolean;
    existingOrderId?: string;
}> {
    const where: any = {
        imageHash,
        status: { in: ['AUTO_APPROVED', 'APPROVED'] },
    };

    if (excludeOrderId) {
        where.id = { not: excludeOrderId };
    }

    const existing = await prisma.manualOrder.findFirst({
        where,
        select: { id: true },
    });

    return {
        isDuplicate: !!existing,
        existingOrderId: existing?.id,
    };
}

/**
 * Check rate limiting: max 1 order per hour per user
 */
export async function checkRateLimit(userId: string): Promise<{
    isLimited: boolean;
    minutesRemaining?: number;
}> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const recentOrder = await prisma.manualOrder.findFirst({
        where: {
            userId,
            createdAt: { gte: oneHourAgo },
        },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
    });

    if (recentOrder) {
        const elapsed = Date.now() - recentOrder.createdAt.getTime();
        const remaining = Math.ceil((60 * 60 * 1000 - elapsed) / 60000);
        return { isLimited: true, minutesRemaining: remaining };
    }

    return { isLimited: false };
}

/**
 * Check if the same OCR text was already used in a previous approved order
 */
export async function checkDuplicateOcrText(extractedText: string, excludeOrderId?: string): Promise<{
    isDuplicate: boolean;
}> {
    if (!extractedText || extractedText.trim().length < 20) {
        return { isDuplicate: false };
    }

    const where: any = {
        ocrExtractedText: extractedText.trim(),
        status: { in: ['AUTO_APPROVED', 'APPROVED'] },
    };

    if (excludeOrderId) {
        where.id = { not: excludeOrderId };
    }

    const existing = await prisma.manualOrder.findFirst({
        where,
        select: { id: true },
    });

    return { isDuplicate: !!existing };
}

export interface FraudCheckResult {
    passed: boolean;
    reason?: string;
    imageHash: string;
}

/**
 * Run all fraud checks
 */
export async function runFraudChecks(
    userId: string,
    imageUrl: string,
    extractedText?: string
): Promise<FraudCheckResult> {
    // 1. Rate limit check
    const rateLimit = await checkRateLimit(userId);
    if (rateLimit.isLimited) {
        return {
            passed: false,
            reason: `Anda baru saja mengirim order. Silakan tunggu ${rateLimit.minutesRemaining} menit lagi.`,
            imageHash: '',
        };
    }

    // 2. Image hash check
    const imageHash = await generateImageHash(imageUrl);
    const duplicateImage = await checkDuplicateImage(imageHash);
    if (duplicateImage.isDuplicate) {
        return {
            passed: false,
            reason: 'Bukti pembayaran ini sudah pernah digunakan sebelumnya.',
            imageHash,
        };
    }

    // 3. OCR text duplicate check
    if (extractedText) {
        const duplicateText = await checkDuplicateOcrText(extractedText);
        if (duplicateText.isDuplicate) {
            return {
                passed: false,
                reason: 'Transaksi dengan detail yang sama sudah pernah diverifikasi.',
                imageHash,
            };
        }
    }

    return { passed: true, imageHash };
}
