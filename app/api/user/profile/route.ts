import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

// GET - Get user profile
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // Get user from database with counts
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        photoUrl: true,
        bio: true,
        readingGoal: true,
        createdAt: true,
        readlist: {
          select: { id: true },
        },
        subscription: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get follower/following counts using localPrisma for robustness
    let followerCount = 0;
    let followingCount = 0;

    const { PrismaClient } = require('@prisma/client');
    const localPrisma = new PrismaClient();

    try {
      // Fetch counts via RAW SQL for robustness
      // @ts-ignore
      const followerRes: any[] = await localPrisma.$queryRawUnsafe(
        `SELECT COUNT(*)::int as count FROM "Follow" WHERE "followingId" = $1`,
        user.id
      );
      followerCount = followerRes[0]?.count || 0;

      // @ts-ignore
      const followingRes: any[] = await localPrisma.$queryRawUnsafe(
        `SELECT COUNT(*)::int as count FROM "Follow" WHERE "followerId" = $1`,
        user.id
      );
      followingCount = followingRes[0]?.count || 0;
    } catch (err) {
      console.warn('Social stats RAW SQL fetch failed in private profile API:', err);
    } finally {
      await localPrisma.$disconnect();
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        stats: {
          followers: followerCount,
          following: followingCount,
          booksRead: user.readlist.length,
        }
      }
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    const body = await req.json();
    const { username, name, bio, readingGoal } = body;

    // Validate username if provided
    if (username !== undefined) {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (username && !usernameRegex.test(username)) {
        return NextResponse.json(
          { error: 'Username must be 3-20 characters (letters, numbers, underscore only)' },
          { status: 400 }
        );
      }

      // Check if username is already taken by another user
      if (username) {
        const existingUser = await prisma.user.findUnique({
          where: { username: username.toLowerCase() }
        });

        if (existingUser && existingUser.firebaseUid !== firebaseUid) {
          return NextResponse.json(
            { error: 'Username already taken' },
            { status: 409 }
          );
        }
      }
    }

    // Validate readingGoal if provided
    if (readingGoal !== undefined && readingGoal !== null) {
      const goalNum = parseInt(readingGoal);
      if (isNaN(goalNum) || goalNum < 0) {
        return NextResponse.json(
          { error: 'Invalid reading goal' },
          { status: 400 }
        );
      }
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { firebaseUid },
      data: {
        username: username !== undefined ? (username ? username.toLowerCase() : null) : undefined,
        name: name !== undefined ? name : undefined,
        bio: bio !== undefined ? bio : undefined,
        readingGoal: readingGoal !== undefined ? (readingGoal ? parseInt(readingGoal) : null) : undefined,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        photoUrl: true,
        bio: true,
        readingGoal: true,
      }
    });

    return NextResponse.json({
      success: true,
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile', details: error.message },
      { status: 500 }
    );
  }
}
