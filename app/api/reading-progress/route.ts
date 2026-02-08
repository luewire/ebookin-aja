import { NextResponse } from 'next/server';
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';
import { prisma } from '@/lib/prisma';

async function getHandler(req: AuthenticatedRequest) {
  try {
    const userId = req.user!.id;
    const { searchParams } = new URL(req.url);
    const ebookId = searchParams.get('ebookId');

    if (ebookId) {
      // Get progress for specific book
      const progress = await prisma.readingProgress.findUnique({
        where: {
          userId_ebookId: {
            userId,
            ebookId,
          },
        },
      });
      return NextResponse.json(progress || { progress: 0, currentLocation: null });
    }

    // Get "Continue Reading" list (progress > 0 and < 100)
    // Ordered by updatedAt desc (most recently read first)
    const readingList = await prisma.readingProgress.findMany({
      where: {
        userId,
        progress: {
            gt: 0,
            lt: 100 
        }
      },
      select: {
        id: true,
        userId: true,
        ebookId: true,
        currentLocation: true,
        progress: true,
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
      orderBy: { updatedAt: 'desc' },
      take: 10
    });

    // Map category to string for backward compatibility
    const mappedList = readingList.map(item => ({
      ...item,
      ebook: {
        ...item.ebook,
        category: item.ebook.category.name
      }
    }));

    return NextResponse.json(mappedList);
  } catch (error) {
    console.error('Reading progress GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch reading progress' }, { status: 500 });
  }
}

async function postHandler(req: AuthenticatedRequest) {
  try {
    const userId = req.user!.id;
    const { ebookId, currentLocation, progress } = await req.json();

    if (!ebookId) {
        return NextResponse.json({ error: 'Ebook ID required' }, { status: 400 });
    }

    const currentProgress = parseFloat(progress);

    // Transaction to update progress and potentially readlist
    await prisma.$transaction(async (tx) => {
        // 1. Upsert ReadingProgress
        await tx.readingProgress.upsert({
            where: {
                userId_ebookId: {
                    userId,
                    ebookId
                }
            },
            create: {
                userId,
                ebookId,
                currentLocation,
                progress: currentProgress
            },
            update: {
                currentLocation,
                progress: currentProgress
            }
        });

        // 2. If finished (>= 100%), update Readlist status to FINISHED
        if (currentProgress >= 100) {
            await tx.readlist.upsert({
                where: {
                    userId_ebookId: {
                        userId,
                        ebookId
                    }
                },
                create: {
                    userId,
                    ebookId,
                    status: 'FINISHED'
                },
                update: {
                    status: 'FINISHED'
                }
            });
        }
        // 3. If started & not finished, ensure it's at least READING (updates WANT_TO_READ)
        else if (currentProgress > 0) {
             const existingReadlist = await tx.readlist.findUnique({
                 where: { userId_ebookId: { userId, ebookId } }
             });

             // If not in readlist, add it. If it is WANT_TO_READ, upgrade to READING.
             if (!existingReadlist) {
                 await tx.readlist.create({
                     data: {
                         userId,
                         ebookId,
                         status: 'READING'
                     }
                 });
             } else if (existingReadlist.status === 'WANT_TO_READ') {
                 await tx.readlist.update({
                     where: { id: existingReadlist.id },
                     data: { status: 'READING' }
                 });
             }
        }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reading progress POST error:', error);
    return NextResponse.json({ error: 'Failed to save reading progress' }, { status: 500 });
  }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
