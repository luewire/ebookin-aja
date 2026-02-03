import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';
import { hasActiveSubscription } from '@/lib/subscription';

/**
 * GET /api/ebooks/[id]
 * Get single ebook details with access control
 * Premium ebooks require active subscription
 */
async function getHandler(req: AuthenticatedRequest) {
  // Extract ID from URL
  const ebookId = req.url.split('/').pop();
  
  if (!ebookId) {
    return NextResponse.json(
      { error: 'Ebook ID is required' },
      { status: 400 }
    );
  }

  try {
    const userId = req.user!.id;

    // Fetch ebook
    const ebook = await prisma.ebook.findUnique({
      where: { id: ebookId, isActive: true },
      select: {
        id: true,
        title: true,
        author: true,
        description: true,
        coverUrl: true,
        pdfUrl: true,
        category: true,
        isPremium: true,
      },
    });

    if (!ebook) {
      return NextResponse.json(
        { error: 'Ebook not found' },
        { status: 404 }
      );
    }

    // Check access for premium ebooks
    if (ebook.isPremium) {
      const hasAccess = await hasActiveSubscription(userId);
      
      if (!hasAccess) {
        return NextResponse.json(
          {
            error: 'Premium subscription required',
            ebook: {
              ...ebook,
              pdfUrl: null, // Hide PDF URL
            },
            requiresSubscription: true,
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ ebook }, { status: 200 });
  } catch (error) {
    console.error('Get ebook error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ebook' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler);
