'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createAdmin = async () => {
    setLoading(true);
    setStatus('Creating admin account...');

    try {
      // Create admin user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        'admin@admin.com',
        'admin123'
      );

      // Update profile with username
      await updateProfile(userCredential.user, {
        displayName: 'admin',
      });

      // Get Firebase ID token
      const idToken = await userCredential.user.getIdToken();

      // Sync with backend database
      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idToken,
          name: 'admin' 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync user data');
      }

      // Update admin role in database
      const updateRoleResponse = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({ 
          userId: userCredential.user.uid,
          role: 'ADMIN' 
        }),
      });

      if (!updateRoleResponse.ok) {
        console.warn('Failed to update admin role');
      }

      setStatus('✅ Admin account created successfully!');
      setTimeout(() => router.push('/login'), 3000);
    } catch (error: any) {
      console.error('Admin setup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setStatus('✅ Admin account already exists! You can login now.');
      } else {
        setStatus('❌ Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Admin Setup</h2>
          <p className="mt-2 text-base text-gray-600">
            Click below to create the admin account
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="space-y-4">
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
              <h3 className="mb-2 font-semibold text-yellow-900">⚠️ Important</h3>
              <div className="space-y-2 text-sm text-yellow-800">
                <p>This will create an admin account using Firebase Authentication.</p>
                <p className="font-semibold">Make sure Firebase is properly configured:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Check your .env file has all Firebase credentials</li>
                  <li>Firebase project must have Email/Password authentication enabled</li>
                  <li>Google Sign-In provider should also be enabled (optional)</li>
                </ol>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-900">Admin Credentials</h3>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Email:</strong> admin@admin.com</p>
                <p><strong>Username:</strong> admin</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
            </div>

            <button
              onClick={createAdmin}
              disabled={loading}
              className="flex w-full min-h-[44px] items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Admin Account'}
            </button>

            {status && (
              <div className={`rounded-lg p-4 text-center text-base font-medium ${
                status.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {status}
              </div>
            )}

            <div className="text-center">
              <a href="/" className="text-base text-blue-600 hover:text-blue-500">
                ← Back to home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
