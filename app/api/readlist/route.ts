import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

async function getHandler(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ebookId = searchParams.get('ebookId');
    const userId = req.user!.id;

    if (ebookId) {
      // Check if specific book is in readlist
      const item = await prisma.readlist.findUnique({
        where: {
          userId_ebookId: {
            userId,
            ebookId,
          },
        },
      });
      return NextResponse.json(item || null);
    } 
    
    // Get all readlist items
    const items = await prisma.readlist.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        ebookId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        ebook: {
          select: {
            id: true,
            title: true,
            author: true,
            coverUrl: true,
            categoryId: true,
            category: {
              select: {
                name: true
              }
            },
            isPremium: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Map category to string for backward compatibility
    const mappedItems = items.map(item => ({
      ...item,
      ebook: {
        ...item.ebook,
        category: item.ebook.category.name
      }
    }));
    
    return NextResponse.json(mappedItems);
  } catch (error) {
    console.error('Readlist GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch readlist' }, { status: 500 });
  }
}

async function postHandler(req: AuthenticatedRequest) {
  try {
    const { ebookId, status } = await req.json();
    const userId = req.user!.id;

    if (!ebookId) {
        return NextResponse.json({ error: 'Ebook ID required' }, { status: 400 });
    }

    const item = await prisma.readlist.upsert({
      where: {
        userId_ebookId: {
          userId,
          ebookId,
        },
      },
      update: { status: status || 'WANT_TO_READ' },
      create: {
        userId,
        ebookId,
        status: status || 'WANT_TO_READ',
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Readlist POST error:', error);
    return NextResponse.json({ error: 'Failed to add to readlist' }, { status: 500 });
  }
}

async function deleteHandler(req: AuthenticatedRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const ebookId = searchParams.get('ebookId');
        const userId = req.user!.id;

        if (!ebookId) {
             return NextResponse.json({ error: 'Ebook ID required' }, { status: 400 });
        }

        await prisma.readlist.delete({
            where: {
                userId_ebookId: {
                    userId,
                    ebookId
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Readlist DELETE error:', error);
        return NextResponse.json({ error: 'Failed to remove from readlist' }, { status: 500 });
    }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
export const DELETE = withAuth(deleteHandler);
