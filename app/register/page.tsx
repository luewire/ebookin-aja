'use client';

import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (!username) {
        setUsernameAvailable(null);
        return;
      }

      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        setUsernameAvailable(false);
        return;
      }

      setCheckingUsername(true);
      try {
        const response = await fetch(`/api/user/check-username?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        setUsernameAvailable(data.available);
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    };

    const timer = setTimeout(checkUsername, 500);
    return () => clearTimeout(timer);
  }, [username]);

  // Check email availability
  useEffect(() => {
    const checkEmail = async () => {
      if (!email) {
        setEmailAvailable(null);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailAvailable(false);
        return;
      }

      setCheckingEmail(true);
      try {
        const response = await fetch(`/api/user/check-email?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        setEmailAvailable(data.available);
      } catch (error) {
        console.error('Error checking email:', error);
        setEmailAvailable(null);
      } finally {
        setCheckingEmail(false);
      }
    };

    const timer = setTimeout(checkEmail, 500);
    return () => clearTimeout(timer);
  }, [email]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    if (usernameAvailable === false) {
      setError('Username is not available');
      setLoading(false);
      return;
    }

    if (emailAvailable === false) {
      setError('Email is already registered');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      const idToken = await userCredential.user.getIdToken();

      try {
        const response = await fetch('/api/auth/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken,
            username: username,
            name: fullName
          }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          console.error('Sync failed', response.status, body);
        }
      } catch (syncErr) {
        console.error('Sync call error:', syncErr);
      }

      setSuccess(true);
      setTimeout(() => router.push('/pricing?redirect=/browse'), 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters long.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError(error.message || 'Failed to register. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      const idToken = await userCredential.user.getIdToken();

      try {
        const response = await fetch('/api/auth/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken,
            name: userCredential.user.displayName
          }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          console.error('Sync failed', response.status, body);
        }
      } catch (syncErr) {
        console.error('Sync call error:', syncErr);
      }

      setSuccess(true);
      setTimeout(() => router.push('/pricing?redirect=/browse'), 2000);
    } catch (error: any) {
      console.error('Google sign-up error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-up cancelled');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups for this site.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with the same email address.');
      } else {
        setError(error.message || 'Failed to sign up with Google');
      }
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  };

  const getValidationBorderColor = (value: string, isValid: boolean | null) => {
    if (!value) return 'var(--border)';
    if (isValid === true) return '#22c55e';
    if (isValid === false) return 'var(--accent)';
    return 'var(--border)';
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Left Decorative Panel */}
      <div className="hidden lg:flex lg:w-[40%] relative flex-col items-center justify-center p-12 overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div
          className="absolute bottom-20 left-[-60px] w-[250px] h-[250px] opacity-15"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-soft))',
            clipPath: 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
          }}
        />
        <div
          className="absolute top-32 right-[-40px] w-[180px] h-[180px] opacity-10"
          style={{
            background: 'var(--accent)',
            clipPath: 'circle(50% at 50% 50%)',
          }}
        />

        <div className="relative z-10 text-center max-w-sm">
          <blockquote className="text-3xl font-display italic leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            &ldquo;The more that you read, the more things you will know. The more that you learn, the more places you&apos;ll go.&rdquo;
          </blockquote>
          <p className="mt-6 text-sm font-medium tracking-wider uppercase" style={{ color: 'var(--text-tertiary)' }}>
            — Dr. Seuss
          </p>
        </div>

        <div className="absolute bottom-8 flex items-center gap-2">
          <Image src="/logo.svg" alt="Ebookin Logo" width={24} height={24} className="h-6 w-6" />
          <span className="text-sm font-display font-bold tracking-wide" style={{ color: 'var(--text-tertiary)' }}>Ebookin Aja</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 lg:px-12">
          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <Image src="/logo.svg" alt="Ebookin Logo" width={28} height={28} className="h-7 w-7" />
            <span className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>Ebookin</span>
          </Link>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Already a member?</span>
            <Link
              href="/login"
              className="btn-primary rounded-xl px-5 py-2 text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Centered Form */}
        <div className="flex flex-1 items-center justify-center px-6 py-8 lg:px-12">
          <div className="w-full max-w-lg animate-fade-in-up">
            <div className="rounded-2xl px-8 py-10" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Join Ebookin</h2>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Start your reading journey today</p>
              </div>

              {success && (
                <div className="mb-6 p-4 rounded-xl text-center animate-scale-fade-in" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))', border: '1px solid rgba(34,197,94,0.3)' }}>
                  <p className="text-sm font-semibold" style={{ color: '#22c55e' }}>Account created! Redirecting...</p>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleRegister}>
                {error && (
                  <div className="rounded-lg p-4 animate-shake" style={{ backgroundColor: 'var(--accent-muted)', border: '1px solid var(--border-accent)' }}>
                    <p className="text-sm font-medium text-center" style={{ color: 'var(--accent)' }}>{error}</p>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                    placeholder="Jane Doe"
                  />
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-sm" style={{ color: 'var(--text-tertiary)' }}>@</span>
                    <input
                      id="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="block w-full rounded-xl pl-8 pr-10 py-3 text-sm outline-none transition-all duration-300"
                      style={{ ...inputStyle, borderColor: getValidationBorderColor(username, usernameAvailable) }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = getValidationBorderColor(username, usernameAvailable))}
                      placeholder="username"
                      minLength={3}
                      maxLength={20}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {checkingUsername ? (
                        <svg className="animate-spin h-4 w-4" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : username && usernameAvailable === true ? (
                        <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : username && usernameAvailable === false ? (
                        <svg className="h-4 w-4" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : null}
                    </div>
                  </div>
                  {username && usernameAvailable === false && (
                    <p className="mt-1 text-xs" style={{ color: 'var(--accent)' }}>Username already taken</p>
                  )}
                  {username && usernameAvailable === true && (
                    <p className="mt-1 text-xs text-green-500">Username available</p>
                  )}
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>3-20 characters, letters, numbers, and underscore only</p>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-xl px-4 pr-10 py-3 text-sm outline-none transition-all duration-300"
                      style={{ ...inputStyle, borderColor: getValidationBorderColor(email, emailAvailable) }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = getValidationBorderColor(email, emailAvailable))}
                      placeholder="jane@example.com"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {checkingEmail ? (
                        <svg className="animate-spin h-4 w-4" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : email && emailAvailable === true ? (
                        <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : email && emailAvailable === false ? (
                        <svg className="h-4 w-4" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : null}
                    </div>
                  </div>
                  {email && emailAvailable === false && (
                    <p className="mt-1 text-xs" style={{ color: 'var(--accent)' }}>Email is already registered</p>
                  )}
                  {email && emailAvailable === true && (
                    <p className="mt-1 text-xs text-green-500">Email available</p>
                  )}
                </div>

                {/* Password Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-xl px-4 pr-10 py-3 text-sm outline-none transition-all duration-300"
                        style={{
                          ...inputStyle,
                          borderColor: password ? (password.length >= 6 ? '#22c55e' : 'var(--accent)') : 'var(--border)',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = password ? (password.length >= 6 ? '#22c55e' : 'var(--accent)') : 'var(--border)')}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 transition-all"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {showPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          ) : (
                            <>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                    {password && password.length < 6 && (
                      <p className="mt-1 text-xs" style={{ color: 'var(--accent)' }}>Min 6 characters</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Confirm</label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full rounded-xl px-4 pr-10 py-3 text-sm outline-none transition-all duration-300"
                        style={{
                          ...inputStyle,
                          borderColor: confirmPassword ? (confirmPassword === password && password.length >= 6 ? '#22c55e' : 'var(--accent)') : 'var(--border)',
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                        onBlur={(e) => (e.currentTarget.style.borderColor = confirmPassword ? (confirmPassword === password && password.length >= 6 ? '#22c55e' : 'var(--accent)') : 'var(--border)')}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 transition-all"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {showConfirmPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          ) : (
                            <>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                      <p className="mt-1 text-xs" style={{ color: 'var(--accent)' }}>Passwords don&apos;t match</p>
                    )}
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="h-4 w-4 rounded"
                      style={{ accentColor: 'var(--accent)' }}
                    />
                  </div>
                  <label htmlFor="terms" className="ml-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    I agree to the{' '}
                    <Link href="/" className="font-medium" style={{ color: 'var(--accent)' }}>Terms of Service</Link>{' '}
                    and{' '}
                    <Link href="/" className="font-medium" style={{ color: 'var(--accent)' }}>Privacy Policy</Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center items-center gap-2 rounded-xl px-4 py-3 text-base font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--accent)',
                    boxShadow: loading ? 'none' : 'var(--shadow-accent)',
                  }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    <>
                      Create Account
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full" style={{ borderTop: '1px solid var(--border)' }}></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-4" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-tertiary)' }}>Or Continue With</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className="flex w-full justify-center items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold transition-colors" style={{ color: 'var(--accent)' }}>
                    Sign in
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer className="py-4 px-6 text-center">
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            © 2026 Ebookin Aja. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
