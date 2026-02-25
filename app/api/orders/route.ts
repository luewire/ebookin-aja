import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyIdToken } from '@/lib/firebase-admin';
import { validatePaymentProof } from '@/lib/ocrValidation';
import { runFraudChecks } from '@/lib/fraudDetection';

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await verifyIdToken(token);
        if (!decodedToken) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // Find user in DB
        const user = await prisma.user.findUnique({
            where: { firebaseUid: decodedToken.uid }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
        }

        const body = await req.json();
        const { package: planName, amount, proofOfPayment } = body;

        if (!planName || !amount || !proofOfPayment) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // ========== FRAUD CHECKS ==========
        // Run initial fraud checks (rate limit + duplicate image) BEFORE OCR to save API calls
        const initialFraudCheck = await runFraudChecks(user.id, proofOfPayment);

        if (!initialFraudCheck.passed) {
            return NextResponse.json({
                error: initialFraudCheck.reason,
                fraudDetected: true
            }, { status: 429 });
        }

        // ========== OCR VALIDATION ==========
        let ocrResult;
        try {
            ocrResult = await validatePaymentProof(proofOfPayment, planName);
        } catch (ocrError: any) {
            console.error('[Order] OCR validation error:', ocrError);
            // If OCR fails entirely, create order as PENDING
            ocrResult = null;
        }

        // ========== POST-OCR FRAUD CHECK ==========
        // Check OCR text duplicate if we have extracted text
        if (ocrResult?.extractedText) {
            const textDupCheck = await runFraudChecks(user.id, proofOfPayment, ocrResult.extractedText);
            if (!textDupCheck.passed && textDupCheck.reason?.includes('detail yang sama')) {
                // Don't block, just force PENDING for admin review
                if (ocrResult) {
                    ocrResult.autoApprove = false;
                    ocrResult.reason = 'Terdeteksi transaksi serupa. Menunggu verifikasi admin.';
                }
            }
        }

        // ========== DETERMINE STATUS ==========
        const autoApproved = ocrResult?.autoApprove === true;
        const status = autoApproved ? 'AUTO_APPROVED' : 'PENDING';

        // ========== CREATE ORDER + ACTIVATE SUBSCRIPTION ==========
        const result = await prisma.$transaction(async (tx) => {
            // Create ManualOrder with OCR data
            const order = await tx.manualOrder.create({
                data: {
                    userId: user.id,
                    package: planName,
                    amount: parseInt(amount, 10),
                    proofOfPayment,
                    status,
                    ocrExtractedText: ocrResult?.extractedText || null,
                    ocrValidationResult: ocrResult?.validationDetail || null,
                    ocrRejectionReason: autoApproved ? null : (ocrResult?.reason || 'OCR tidak tersedia, menunggu verifikasi admin.'),
                    imageHash: initialFraudCheck.imageHash || null,
                }
            });

            // If auto-approved, activate subscription immediately
            if (autoApproved) {
                let durationDays = 30;
                if (planName === '3months') durationDays = 90;
                else if (planName === '1year') durationDays = 365;

                const startDate = new Date();
                const endDate = new Date();
                endDate.setDate(startDate.getDate() + durationDays);

                await tx.subscription.upsert({
                    where: { userId: user.id },
                    create: {
                        userId: user.id,
                        status: 'ACTIVE',
                        planName,
                        startDate,
                        endDate,
                    },
                    update: {
                        status: 'ACTIVE',
                        planName,
                        startDate,
                        endDate,
                    }
                });

                // Notify user of auto-approval
                await tx.notification.create({
                    data: {
                        userId: user.id,
                        type: 'SUBSCRIPTION',
                        title: 'Pembayaran Terverifikasi Otomatis! ✅',
                        message: `Pembayaran untuk paket ${planName} telah terverifikasi secara otomatis. Selamat membaca!`,
                        link: '/browse'
                    }
                });
            }

            return order;
        });

        return NextResponse.json({
            success: true,
            order: result,
            autoApproved,
            message: autoApproved
                ? 'Pembayaran terverifikasi otomatis! Subscription Anda langsung aktif.'
                : (ocrResult?.reason || 'Menunggu verifikasi admin (maks 1x24 jam).')
        });
    } catch (error: any) {
        console.error('Error creating manual order:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await verifyIdToken(token);
        if (!decodedToken) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { firebaseUid: decodedToken.uid }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const orders = await prisma.manualOrder.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ orders });
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
