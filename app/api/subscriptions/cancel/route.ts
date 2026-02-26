import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';
import { cancelSubscription } from '@/lib/subscription';

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

        // Find user
        const user = await prisma.user.findUnique({
            where: { firebaseUid: decodedToken.uid }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Cancel the subscription
        await cancelSubscription(user.id);

        return NextResponse.json({ success: true, message: 'Subscription cancelled successfully' });
    } catch (error: any) {
        console.error('Error cancelling subscription:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
