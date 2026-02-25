import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

async function getHandler(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: ebookId } = await params;
    const { searchParams } = new URL(req.url);
    const userOnly = searchParams.get('userOnly') === 'true';

    if (userOnly) {
      // This should be authenticated request
      const authHeader = req.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await (await import('@/lib/firebase-admin')).adminAuth.verifyIdToken(token);

      const user = await prisma.user.findUnique({
        where: { firebaseUid: decodedToken.uid }
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const review = await prisma.review.findUnique({
        where: {
          userId_ebookId: {
            userId: user.id,
            ebookId,
          }
        },
        include: {
          user: {
            select: {
              name: true,
              photoUrl: true,
            }
          }
        }
      });

      return NextResponse.json(review || null);
    }

    // Get all reviews
    const reviews = await prisma.review.findMany({
      where: { ebookId },
      include: {
        user: {
          select: {
            name: true,
            photoUrl: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

async function postHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.user!.id;
    const { id: ebookId } = await params;
    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const review = await prisma.review.upsert({
      where: {
        userId_ebookId: {
          userId,
          ebookId,
        }
      },
      update: {
        rating,
        comment,
      },
      create: {
        userId,
        ebookId,
        rating,
        comment,
      }
    });

    // --- NEW TRENDING ACTIVITY LOGIC ---
    let activityType: 'POSITIVE_RATING' | 'NEUTRAL_RATING' | 'NEGATIVE_RATING';
    if (rating >= 4) activityType = 'POSITIVE_RATING';
    else if (rating === 3) activityType = 'NEUTRAL_RATING';
    else activityType = 'NEGATIVE_RATING';

    // Delete any old rating activities for this user/book to avoid duplicate metrics if they changed their rating
    await prisma.bookActivity.deleteMany({
      where: {
        userId,
        bookId: ebookId,
        type: { in: ['POSITIVE_RATING', 'NEUTRAL_RATING', 'NEGATIVE_RATING'] }
      }
    });

    // Create new rating activity
    await prisma.bookActivity.create({
      data: {
        bookId: ebookId,
        userId,
        type: activityType
      }
    });

    // Update Ebook Aggregate Metrics
    const allReviews = await prisma.review.findMany({ where: { ebookId } });
    const totalRatings = allReviews.length;
    const averageRating = totalRatings > 0 ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings) : 0;
    const positiveRatings = allReviews.filter(r => r.rating >= 4).length;
    const negativeRatings = allReviews.filter(r => r.rating <= 2).length;

    await prisma.ebook.update({
      where: { id: ebookId },
      data: {
        totalRatings,
        averageRating: parseFloat(averageRating.toFixed(1)), // rounding to 1 decimal
        positiveRatings,
        negativeRatings
      }
    });

    // Trigger trending recalculation asynchronously
    fetch(`${req.nextUrl.origin}/api/trending/recalculate?bookId=${ebookId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => { });
    // -----------------------------------

    return NextResponse.json(review);
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

export const GET = getHandler;
export const POST = withAuth(postHandler);
