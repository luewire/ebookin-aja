import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge Middleware for route protection
 * Runs on Vercel Edge Runtime - cannot use Prisma here
 * This provides basic client-side redirect logic
 * Server-side validation happens in API routes using withAuth/withAdmin
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes - always allow
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/unauthorized'];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // API routes are protected by withAuth/withAdmin middleware in route handlers
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // For protected pages, let the client-side AuthProvider handle auth state
  // This middleware just ensures consistent routing structure
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/admin/:path*',
    '/ebooks/:path*',
    '/reader/:path*',
    '/readlist/:path*',
    '/settings/:path*',
    '/login',
    '/register',
    '/api/:path*',
  ],
};
