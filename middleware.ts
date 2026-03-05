import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { runtimeConfig } from '@/lib/runtime-config';

type RateLimitEntry = {
    count: number;
    resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

const publicCachedApiPrefixes = ['/api/ebooks', '/api/categories', '/api/banners'];

function getClientIp(req: NextRequest) {
    const forwardedFor = req.headers.get('x-forwarded-for');
    if (forwardedFor) {
        return forwardedFor.split(',')[0]?.trim() || 'unknown';
    }
    return req.headers.get('x-real-ip') || 'unknown';
}

function applyApiCachingHeaders(req: NextRequest, response: NextResponse) {
    if (!runtimeConfig.cache.enabled || req.method !== 'GET') return response;

    const isPublicCachedApi = publicCachedApiPrefixes.some((prefix) => req.nextUrl.pathname.startsWith(prefix));
    if (!isPublicCachedApi) return response;

    response.headers.set(
        'Cache-Control',
        `public, max-age=${runtimeConfig.cache.publicApiMaxAge}, s-maxage=${runtimeConfig.cache.publicApiSMaxAge}, stale-while-revalidate=${runtimeConfig.cache.publicApiStaleWhileRevalidate}`
    );
    return response;
}

function enforceApiRateLimit(req: NextRequest) {
    if (!runtimeConfig.rateLimit.enabled || !req.nextUrl.pathname.startsWith('/api/')) {
        return null;
    }

    const ip = getClientIp(req);
    const now = Date.now();
    const windowMs = runtimeConfig.rateLimit.windowMs;
    const maxRequests = runtimeConfig.rateLimit.maxRequests;
    const key = `${ip}:${req.nextUrl.pathname}`;

    const current = rateLimitStore.get(key);
    if (!current || current.resetAt <= now) {
        rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
        return null;
    }

    if (current.count >= maxRequests) {
        const retryAfter = Math.ceil((current.resetAt - now) / 1000);
        const response = NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            { status: 429 }
        );
        response.headers.set('Retry-After', String(retryAfter));
        return response;
    }

    current.count += 1;
    rateLimitStore.set(key, current);
    return null;
}

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
        const rateLimited = enforceApiRateLimit(req);
        if (rateLimited) {
            return rateLimited;
        }

        return applyApiCachingHeaders(req, NextResponse.next());
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
