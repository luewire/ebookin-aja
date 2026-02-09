import { NextRequest, NextResponse } from 'next/server';
import { withAdmin, AuthenticatedRequest } from '@/lib/auth-middleware';
import { adminAuth } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/users
 * List all users from Firebase Authentication + Prisma Subscription Data
 */
async function getHandler(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '1000');
    const search = searchParams.get('search') || '';

    // 1. Fetch all users from Firebase Authentication
    const listUsersResult = await adminAuth.listUsers(limit);

    // 2. Fetch all subscriptions and user data from Prisma
    // We fetch all because getting individual subs for 1000 users in a loop is slow.
    // In a larger scale app, we would paginate via DB, but here the source of truth for list is Firebase.
    const firebaseUids = listUsersResult.users.map(u => u.uid);
    
    // Fetch both subscriptions and user profiles
    const [subscriptions, userProfiles] = await Promise.all([
      prisma.subscription.findMany({
        where: {
          user: {
            firebaseUid: {
              in: firebaseUids
            }
          },
          status: 'ACTIVE'
        },
        include: {
          user: {
            select: {
              firebaseUid: true
            }
          }
        }
      }),
      prisma.user.findMany({
        where: {
          firebaseUid: {
            in: firebaseUids
          }
        },
        select: {
          firebaseUid: true,
          username: true,
          name: true
        }
      })
    ]);

    // Map subscriptions by firebaseUid for O(1) lookup
    const subMap = new Map();
    subscriptions.forEach(sub => {
      if (sub.user?.firebaseUid) {
        subMap.set(sub.user.firebaseUid, sub.planName);
      }
    });

    // Map user profiles by firebaseUid for O(1) lookup
    const userProfileMap = new Map();
    userProfiles.forEach(profile => {
      userProfileMap.set(profile.firebaseUid, profile);
    });

    // 3. Transform and Merge
    let users = listUsersResult.users.map((firebaseUser) => {
      // Get user profile from database
      const userProfile = userProfileMap.get(firebaseUser.uid);
      
      // Use username from database if available, fallback to display name or email
      const username = userProfile?.username ||
        firebaseUser.displayName ||
        firebaseUser.email?.split('@')[0] ||
        'Unknown User';

      // Determine role from custom claims or email
      let role = 'Reader';
      if (firebaseUser.customClaims?.role) {
        role = firebaseUser.customClaims.role === 'ADMIN' ? 'Admin' : 'Reader';
      } else if (firebaseUser.email === 'admin@admin.com') {
        role = 'Admin';
      }

      // Determine Plan
      // If found in active subscriptions, use planName (e.g., 'premium'), otherwise 'Free'
      const planName = subMap.get(firebaseUser.uid);
      const plan = planName ? 'Premium' : 'Free';

      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        username: username,
        avatar_url: firebaseUser.photoURL || '',
        role: role,
        plan: plan, // New field
        created_at: firebaseUser.metadata.creationTime || new Date().toISOString(),
        status: firebaseUser.disabled ? 'banned' : 'active' as 'active' | 'inactive' | 'banned',
      };
    });

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter((user) =>
        user.email.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower) ||
        user.plan.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json(
      {
        users,
        pagination: {
          page: 1,
          limit,
          total: users.length,
          totalPages: 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users from Firebase Authentication' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users
 * Update user custom claims (role), status (ban/unban), or plan
 */
async function patchHandler(req: AuthenticatedRequest) {
  try {
    const { userId, role, action, plan } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Handle Role Update
    if (role) {
      if (role !== 'USER' && role !== 'ADMIN') {
        // The frontend sends 'Admin' or 'Reader' (User) typically? 
        // Actually based on previous code: body.role = selectedUser.role === 'Admin' ? 'ADMIN' : 'USER';
        return NextResponse.json(
          { error: 'Invalid role. Must be USER or ADMIN' },
          { status: 400 }
        );
      }
      await adminAuth.setCustomUserClaims(userId, { role });
      // Also update Prisma User role to keep in sync if needed
      try {
        await prisma.user.update({
          where: { firebaseUid: userId },
          data: { role: role }
        });
      } catch (e) {
        console.warn("Failed to sync role to Prisma", e);
      }
    }

    // Handle Plan Update
    if (plan) {
      // plan is expected to be 'Free' or 'Premium'
      if (plan === 'Premium') {
        // Create or update subscription to ACTIVE
        // First ensure User exists in Prisma
        const firebaseUser = await adminAuth.getUser(userId);
        let userParams: any = {
          firebaseUid: userId,
          email: firebaseUser.email || userId + "@placeholder.com", // Fallback
          name: firebaseUser.displayName || "User",
        }

        // Upsert User
        const dbUser = await prisma.user.upsert({
          where: { firebaseUid: userId },
          create: userParams,
          update: {},
        });

        // Upsert Subscription
        const now = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        await prisma.subscription.upsert({
          where: { userId: dbUser.id },
          create: {
            userId: dbUser.id,
            status: 'ACTIVE',
            planName: 'premium',
            startDate: now,
            endDate: oneMonthLater, // Give 1 month for manual upgrade
            orderId: `MANUAL_${Date.now()}`
          },
          update: {
            status: 'ACTIVE',
            planName: 'premium',
            startDate: now,
            endDate: oneMonthLater,
          }
        });
      } else if (plan === 'Free') {
        // Cancel subscription
        // We need to find the user id in prisma first
        const dbUser = await prisma.user.findUnique({
          where: { firebaseUid: userId }
        });

        if (dbUser) {
          await prisma.subscription.updateMany({
            where: { userId: dbUser.id },
            data: { status: 'CANCELLED', endDate: new Date() }
          });
        }
      }
    }

    // Handle Status Update (Ban/Unban/Activate)
    if (action) {
      if (action === 'ban') {
        await adminAuth.updateUser(userId, { disabled: true });
      } else if (action === 'unban' || action === 'activate') {
        await adminAuth.updateUser(userId, { disabled: false });
      }
    }

    // Get updated user info to return
    const user = await adminAuth.getUser(userId);
    let currentRole = 'Reader';
    if (user.customClaims?.role) {
      currentRole = user.customClaims.role === 'ADMIN' ? 'Admin' : 'Reader';
    } else if (user.email === 'admin@admin.com') {
      currentRole = 'Admin';
    }

    // Check plan again
    const dbUser = await prisma.user.findUnique({
      where: { firebaseUid: userId },
      include: { subscription: true }
    });

    // Logic: Active subscription = Premium
    const currentPlan = (dbUser?.subscription?.status === 'ACTIVE') ? 'Premium' : 'Free';

    return NextResponse.json({
      user: {
        id: user.uid,
        email: user.email,
        username: user.displayName || user.email?.split('@')[0],
        avatar_url: user.photoURL || '',
        role: currentRole,
        plan: currentPlan,
        created_at: user.metadata.creationTime,
        status: user.disabled ? 'banned' : 'active',
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users
 * Delete a user from Firebase Authentication
 */
async function deleteHandler(req: AuthenticatedRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    if (userId === req.user!.firebaseUid) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Get user email before deletion
    const user = await adminAuth.getUser(userId);

    // Delete user from Firebase Authentication
    await adminAuth.deleteUser(userId);

    // Prisma Cascade delete should handle DB cleanup if Foreign Keys are set correctly
    // But we check just in case. 
    // Schema says: user User @relation(fields: [userId], references: [id], onDelete: Cascade)
    // So deleting User row deletes Subscription.
    // However, we are deleting from Firebase. We should also delete from Prisma User table explicitly.
    try {
      await prisma.user.delete({
        where: { firebaseUid: userId }
      });
    } catch (e) {
      // Ignore if user not in DB
    }

    return NextResponse.json(
      { success: true, message: `User ${user.email} deleted` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

export const GET = withAdmin(getHandler);
export const PATCH = withAdmin(patchHandler);
export const DELETE = withAdmin(deleteHandler);

export const dynamic = 'force-dynamic';
