'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createAdmin = async () => {
    setLoading(true);
    setStatus('Creating admin account...');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@admin.com',
        password: 'admin123',
        options: {
          data: {
            username: 'admin',
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setStatus('✅ Admin account already exists! You can login now.');
        } else {
          setStatus('❌ Error: ' + error.message);
        }
        setLoading(false);
        return;
      }

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setStatus('✅ Admin account already exists! You can login now.');
      } else {
        setStatus('✅ Admin account created successfully!');
      }

      setTimeout(() => router.push('/login'), 3000);
    } catch (err: any) {
      setStatus('❌ Error: ' + err.message);
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
                <p>After creating the admin account, you need to verify the email.</p>
                <p className="font-semibold">To skip email verification:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Go to <a href="https://supabase.com/dashboard" target="_blank" className="underline">Supabase Dashboard</a></li>
                  <li>Select your project</li>
                  <li>Go to Authentication → Providers → Email</li>
                  <li>Disable "Confirm email"</li>
                  <li>Click Save</li>
                </ol>
                <p className="mt-2">Or check your email inbox for confirmation link.</p>
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
