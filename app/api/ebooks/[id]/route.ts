import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';
import { hasActiveSubscription } from '@/lib/subscription';

/**
 * GET /api/ebooks/[id]
 * Get single ebook details with access control
 * Premium ebooks require active subscription
 */
async function getHandler(req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) {
  // Extract ID from params
  const { id: ebookId } = await params;
  
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
        categoryId: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        isPremium: true,
      },
    });

    if (!ebook) {
      return NextResponse.json(
        { error: 'Ebook not found' },
        { status: 404 }
      );
    }

    // All ebooks require subscription to access
    // Check if user has active subscription
    const hasAccess = await hasActiveSubscription(userId);
    
    if (!hasAccess) {
      // User can see ebook details but cannot access the file
      return NextResponse.json(
        {
          ebook: {
            ...ebook,
            category: ebook.category.name, // Return category name
            pdfUrl: null, // Hide PDF URL for non-subscribers
          },
          requiresSubscription: true,
        },
        { status: 200 } // Return 200, let client handle subscription prompt
      );
    }

    // User has subscription, return full ebook data including file URL
    return NextResponse.json({ 
      ebook: {
        ...ebook,
        category: ebook.category.name // Return category name
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Get ebook error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ebook' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler);
