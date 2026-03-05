import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyIdToken } from '@/lib/firebase-admin';

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

        // Check if acting user is admin
        const adminUser = await prisma.user.findUnique({
            where: { firebaseUid: decodedToken.uid }
        });

        const normalizedRole = String(adminUser?.role || '').toUpperCase();
        const isAdmin = normalizedRole === 'ADMIN' || adminUser?.email === 'admin@admin.com';

        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const orders = await prisma.manualOrder.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        username: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            // OCR fields are included by default (not in a relation)
        });

        return NextResponse.json({ orders });
    } catch (error: any) {
        console.error('Error fetching admin orders:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
