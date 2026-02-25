'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';

export default function SetupPage() {
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    setError('');
    setStatus('Creating admin account...');

    try {
      // Create admin user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        'admin@admin.com',
        'Admin12345'
      );

      await updateProfile(userCredential.user, {
        displayName: 'Admin',
      });

      setStatus('Syncing with backend...');

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
          username: 'admin',
          name: 'Admin',
          role: 'ADMIN',
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to sync admin user');
      }

      setSuccess(true);
      setStatus('Admin account created successfully!');
    } catch (err: any) {
      console.error('Setup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Admin account already exists. You can login with admin@admin.com.');
      } else {
        setError(err.message || 'Setup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Image src="/logo.svg" alt="Ebookin Logo" width={48} height={48} className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold font-display mb-2" style={{ color: 'var(--text-primary)' }}>Initial Setup</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Create the initial admin account for Ebookin Aja.</p>
        </div>

        <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          {/* Info Box */}
          <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: 'var(--accent-muted)', border: '1px solid var(--border-accent)' }}>
            <div className="flex gap-3">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--accent)' }}>Admin Credentials</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Email: <strong>admin@admin.com</strong><br />
                  Password: <strong>Admin12345</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          {status && !error && (
            <div className="rounded-lg p-3 mb-4 text-center" style={{ backgroundColor: success ? 'rgba(34,197,94,0.1)' : 'var(--bg-elevated)' }}>
              <p className="text-sm" style={{ color: success ? '#22c55e' : 'var(--text-secondary)' }}>{status}</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg p-3 mb-4 animate-shake" style={{ backgroundColor: 'var(--accent-muted)', border: '1px solid var(--border-accent)' }}>
              <p className="text-sm text-center" style={{ color: 'var(--accent)' }}>{error}</p>
            </div>
          )}

          <button
            onClick={handleSetup}
            disabled={loading || success}
            className="flex w-full justify-center items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--accent)',
              boxShadow: (loading || success) ? 'none' : 'var(--shadow-accent)',
            }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Setting up...
              </span>
            ) : success ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Setup Complete
              </span>
            ) : (
              'Create Admin Account'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
