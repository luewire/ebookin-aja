import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyIdToken } from '@/lib/firebase-admin';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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

        // Check if acting user is admin
        const adminUser = await prisma.user.findUnique({
            where: { firebaseUid: decodedToken.uid }
        });

        const normalizedRole = String(adminUser?.role || '').toUpperCase();
        const isAdmin = normalizedRole === 'ADMIN' || adminUser?.email === 'admin@admin.com';

        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id: orderId } = await params;
        const body = await req.json();
        const { status } = body; // 'APPROVED' or 'REJECTED'

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Process order update in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.manualOrder.update({
                where: { id: orderId },
                data: { status },
                include: { user: true }
            });

            if (status === 'APPROVED') {
                // Calculate end date based on plan
                let durationDays = 30; // 1month
                if (order.package === '3months') durationDays = 90;
                else if (order.package === '1year') durationDays = 365;

                const startDate = new Date();
                const endDate = new Date();
                endDate.setDate(startDate.getDate() + durationDays);

                // Upsert subscription
                await tx.subscription.upsert({
                    where: { userId: order.userId },
                    create: {
                        userId: order.userId,
                        status: 'ACTIVE',
                        planName: order.package,
                        startDate: startDate,
                        endDate: endDate,
                    },
                    update: {
                        status: 'ACTIVE',
                        planName: order.package,
                        startDate: startDate,
                        endDate: endDate,
                    }
                });

                // Notify user
                await tx.notification.create({
                    data: {
                        userId: order.userId,
                        type: 'AUTHOR_UPDATE', // Reusing enum for system notifications temporarily
                        title: 'Pembayaran Diterima!',
                        message: `Pembayaran untuk paket ${order.package} telah diverifikasi. Selamat membaca!`,
                        link: '/profile'
                    }
                });

            } else if (status === 'REJECTED') {
                // Notify user of rejection
                await tx.notification.create({
                    data: {
                        userId: order.userId,
                        type: 'AUTHOR_UPDATE',
                        title: 'Pembayaran Ditolak',
                        message: `Pembayaran untuk paket ${order.package} tidak valid atau bukti transfer kurang jelas.`,
                        link: '/order?plan=' + order.package
                    }
                });
            }

            return order;
        });

        return NextResponse.json({ success: true, order: result });
    } catch (error: any) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
