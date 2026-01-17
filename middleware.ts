import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Just pass through, let client-side AuthProvider handle redirects
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/admin/:path*', '/ebooks/:path*', '/readlist/:path*', '/login', '/register'],
};
