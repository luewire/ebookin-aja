import { NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/recommendation';
import { verifyAuthToken } from '@/lib/auth-middleware';

export async function GET(req: Request) {
    try {
        let userId = null;

        // Try to get the user from the auth token, but don't fail if they aren't logged in
        const authHeader = req.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split('Bearer ')[1];
            const decodedToken = await verifyAuthToken(token);

            if (decodedToken && decodedToken.uid) {
                // To get the local Prisma user ID
                const { prisma } = await import('@/lib/prisma');
                const user = await prisma.user.findUnique({
                    where: { firebaseUid: decodedToken.uid },
                    select: { id: true },
                });

                if (user) {
                    userId = user.id;
                }
            }
        }

        // Get recommendations (passes userId if valid, or null for fallback)
        const recommendations = await getRecommendations(userId);

        // Cache for 1 hour, revalidate on demand using tag
        const cacheTag = userId ? `recommendations-${userId}` : 'recommendations-guest';

        const responseData = NextResponse.json(recommendations);

        // Use Next.js fetch cache configuration
        responseData.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59');

        return responseData;
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
