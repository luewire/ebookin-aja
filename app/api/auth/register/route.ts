/**
 * NOTE: User registration is handled by Firebase Auth on the client side.
 * After Firebase authentication, use /api/auth/sync to sync with PostgreSQL.
 * 
 * This route is kept for backward compatibility or custom registration flows.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'Please use Firebase Authentication and then sync with /api/auth/sync',
      hint: 'Client should: 1) Sign up with Firebase Auth, 2) Get ID token, 3) Call /api/auth/sync',
    },
    { status: 400 }
  );
}
