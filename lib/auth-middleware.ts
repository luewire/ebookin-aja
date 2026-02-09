import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from '@/lib/firebase-admin';
import { prisma } from '@/lib/prisma';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    firebaseUid: string;
    email: string;
    role: string;
  };
  decodedToken?: any;
}

/**
 * Verify Firebase token and return decoded token
 */
export async function verifyAuthToken(token: string) {
  try {
    const decodedToken = await verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Middleware to verify Firebase token and fetch user from database
 * Use this in API routes that require authentication
 */
export function withAuth(
  handler: (req: AuthenticatedRequest, context: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: any) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Missing or invalid authorization header' },
          { status: 401 }
        );
      }

      const token = authHeader.split('Bearer ')[1];
      
      // Verify Firebase token
      const decodedToken = await verifyIdToken(token);
      if (!decodedToken) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Fetch or create user in database
      let user = await prisma.user.findUnique({
        where: { firebaseUid: decodedToken.uid },
        select: {
          id: true,
          firebaseUid: true,
          email: true,
          role: true,
        },
      });

      // Auto-sync user if not exists
      if (!user) {
        const email = decodedToken.email || `${decodedToken.uid}@firebase.local`;
        user = await prisma.user.create({
          data: {
            firebaseUid: decodedToken.uid,
            email,
            name: decodedToken.name || email.split('@')[0],
            role: 'USER',
          },
          select: {
            id: true,
            firebaseUid: true,
            email: true,
            role: true,
          },
        });
      }

      // Attach user to request
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = user;
      authenticatedReq.decodedToken = decodedToken;

      return handler(authenticatedReq, context);
    } catch (error: unknown) {
      console.error('Auth middleware error:', error);

      // Prisma/DB errors → 503 so client can show "service unavailable"
      const isPrisma = error && typeof error === 'object' && 'code' in error && String((error as { code?: string }).code).startsWith('P');
      if (isPrisma) {
        return NextResponse.json(
          { error: 'Service temporarily unavailable' },
          { status: 503 }
        );
      }

      // Token/auth-related message → 401
      const msg = error instanceof Error ? error.message : '';
      if (/token|unauthorized|invalid|expired|credential/i.test(msg)) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware to verify user is an admin
 * Use this in API routes that require admin access
 */
export function withAdmin(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: any) => {
    // First authenticate
    const authMiddleware = withAuth(async (authReq: AuthenticatedRequest) => {
      // Then check admin role
      // Allow if role is ADMIN OR if email is admin@admin.com (fallback)
      // OR if the token claims say ADMIN
      const tokenRole = authReq.decodedToken?.role;
      const isAdminByDb = authReq.user?.role === 'ADMIN';
      const isAdminByEmail = authReq.user?.email === 'admin@admin.com';
      const isAdminByToken = tokenRole === 'ADMIN' || tokenRole === 'Admin';
      
      if (!isAdminByDb && !isAdminByEmail && !isAdminByToken) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
      return handler(authReq);
    });
    
    return authMiddleware(req, context);
  };
}
