'use client';

import { useState, useEffect, Suspense } from 'react';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validCode, setValidCode] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    // Verify the password reset code
    const verifyCode = async () => {
      if (!oobCode) {
        setError('Invalid or missing reset code');
        setVerifying(false);
        return;
      }

      try {
        await verifyPasswordResetCode(auth, oobCode);
        setValidCode(true);
      } catch (error: any) {
        console.error('Code verification error:', error);
        if (error.code === 'auth/invalid-action-code') {
          setError('Invalid or expired reset link. Please request a new one.');
        } else {
          setError('Failed to verify reset code');
        }
      } finally {
        setVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!oobCode) {
      setError('Invalid reset code');
      return;
    }

    setLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else if (error.code === 'auth/invalid-action-code') {
        setError('Invalid or expired reset link. Please request a new one.');
      } else {
        setError(error.message || 'Failed to reset password');
      }
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-base text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (error && !validCode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-lg bg-red-50 p-6 text-center">
          <div className="mb-4 text-4xl">❌</div>
          <h3 className="mb-2 text-xl font-semibold text-red-900">Invalid Reset Link</h3>
          <p className="mb-4 text-base text-red-700">{error}</p>
          <Link
            href="/forgot-password"
            className="text-base text-blue-600 hover:text-blue-500"
          >
            Request a new reset link →
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md rounded-lg bg-green-50 p-6 text-center">
          <div className="mb-4 text-4xl">✅</div>
          <h3 className="mb-2 text-xl font-semibold text-green-900">Password Reset Successful!</h3>
          <p className="text-base text-green-700">
            Your password has been updated. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Set new password</h2>
          <p className="mt-2 text-base text-gray-600">
            Enter your new password below
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-center">
              <p className="text-base font-medium text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-base font-medium text-gray-700">
                New Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full min-h-[44px] items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-base text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
