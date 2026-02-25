'use client';

import { Suspense, useEffect, useState } from 'react';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function SettingsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('settings');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [originalUsername, setOriginalUsername] = useState('');
  const [bio, setBio] = useState('');
  const [readingGoal, setReadingGoal] = useState('25');
  const [profileImage, setProfileImage] = useState<string | null>(null); // Preview URL
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Actual file to upload
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Two-factor authentication state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Appearance state
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    const prefersDark = theme !== 'light';
    setIsDark(prefersDark);
    if (!prefersDark) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };


  useEffect(() => {
    // Check for tab parameter in URL
    const tab = searchParams.get('tab');
    if (tab && ['settings', 'profile', 'security', 'billing'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  // Check username availability when changed
  useEffect(() => {
    const checkUsername = async () => {
      // Don't check if username hasn't changed or is empty
      if (!username || username === originalUsername) {
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
  }, [username, originalUsername]);

  const loadProfileData = async () => {
    if (!user) return;

    try {
      // Load from database via API
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        const response = await fetch('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setDisplayName(data.user.name || user.email?.split('@')[0] || '');
            setUsername(data.user.username || '');
            setOriginalUsername(data.user.username || '');
            setBio(data.user.bio || '');
            setReadingGoal(data.user.readingGoal?.toString() || '25');
            setProfileImage(data.user.photoUrl || null);
            return;
          }
        }
      }

      // Fallback to user metadata if API fails
      setDisplayName(user.displayName || user.email?.split('@')[0] || '');
      setUsername('');
      setOriginalUsername('');
      setBio('');
      setReadingGoal('25');
      setProfileImage(user.photoURL || null);
    } catch (error) {
      console.error('Error loading profile:', error);
      setDisplayName(user.displayName || user.email?.split('@')[0] || '');
      setUsername('');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    // Validate username if changed
    if (username && username !== originalUsername && usernameAvailable === false) {
      setSuccessMessage('Username is not available');
      setIsError(true);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      return;
    }

    setLoading(true);
    try {
      let photoURL = user.photoURL; // Keep existing photo URL

      // Only upload if a NEW file is selected
      if (selectedFile && selectedFile instanceof File) {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error('Not authenticated');

        const formData = new FormData();
        formData.append('photo', selectedFile); // Changed from 'image' to 'photo'

        const response = await fetch('/api/user/profile-photo', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.details || error.error || 'Upload failed');
        }

        const data = await response.json();
        photoURL = data.photoUrl;

        // Update local preview immediately
        setProfileImage(photoURL);
      } else if (profileImage === null) {
        // User removed the photo
        photoURL = null;
      }

      // Update Firebase profile (this will trigger navbar/profile refresh)
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName || user.email?.split('@')[0] || '',
          photoURL: photoURL
        });

        // Force reload the user to refresh everywhere
        await auth.currentUser.reload();
      }

      // Save username, name, bio and reading_goal to database via API route
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        const profileResponse = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username || null,
            name: displayName,
            bio: bio,
            readingGoal: readingGoal ? parseInt(readingGoal) : null,
          }),
        });

        if (!profileResponse.ok) {
          const error = await profileResponse.json();
          throw new Error(error.details || error.error || 'Failed to save profile data');
        }

        // Update original username after successful save
        setOriginalUsername(username);
      }

      setSuccessMessage('Profile updated successfully!');
      setIsError(false);
      setShowSuccessMessage(true);
      setSelectedFile(null);
      setUploadError('');

      // Reload page to refresh all components with new photo
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setSuccessMessage('Failed to save profile: ' + (error.message || 'Unknown error'));
      setIsError(true);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (!newPassword) {
      setPasswordError('New password is required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    setPasswordLoading(true);

    try {
      // Firebase requires re-authentication before password change
      if (!user || !user.email) {
        throw new Error('User not authenticated');
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      // Re-authenticate user
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setSuccessMessage('Password updated successfully!');
      setIsError(false);
      setShowSuccessMessage(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error: any) {
      console.error('Password update error:', error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setPasswordError('Current password is incorrect');
      } else if (error.code === 'auth/weak-password') {
        setPasswordError('Password must be at least 6 characters long');
      } else if (error.code === 'auth/requires-recent-login') {
        setPasswordError('Please log out and log in again to change your password');
      } else {
        setPasswordError(error.message || 'Failed to update password');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleTwoFactorToggle = () => {
    // Note: Full 2FA implementation requires additional setup with Firebase
    // This is a placeholder that shows the UI works
    const newState = !twoFactorEnabled;
    setTwoFactorEnabled(newState);

    setSuccessMessage(newState ? '2FA enabled (Feature coming soon)' : '2FA disabled');
    setIsError(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    // Validate size (max 2MB for Cloudinary)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(`❌ File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max 2MB allowed.`);
      e.target.value = '';
      return;
    }

    // Validate type
    const allowedTypes = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('❌ Invalid format. Use WebP, JPEG, or PNG');
      e.target.value = '';
      return;
    }

    // Show file info
    const sizeKB = (file.size / 1024).toFixed(0);
    const format = file.type.split('/')[1].toUpperCase();
    if (file.type === 'image/webp') {
      setUploadError(`✅ ${sizeKB}KB - ${format} format (optimal!)`);
    } else {
      setUploadError(`ℹ️ ${sizeKB}KB - ${format} format. WebP recommended for better compression.`);
    }

    setSelectedFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = async () => {
    if (!user) return;

    // If there's a photo URL from Cloudinary, delete it via API
    if (profileImage && profileImage.includes('cloudinary.com')) {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (token) {
          await fetch('/api/user/profile-photo', {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        }
      } catch (error) {
        console.error('Failed to delete photo:', error);
      }
    }

    setProfileImage(null);
    setSelectedFile(null);
    setUploadError('');

    // Update Firebase profile to remove photo
    try {
      await updateProfile(user, {
        displayName: username || user.email?.split('@')[0] || '',
        photoURL: null
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div>

      {/* Success Notification */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
          <div className="flex items-center gap-3 rounded-2xl px-6 py-4 shadow-accent border" style={{
            backgroundColor: isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
            borderColor: isError ? 'rgba(239, 68, 68, 0.2)' : 'var(--border-accent)'
          }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{
              backgroundColor: isError ? 'rgba(239, 68, 68, 0.2)' : 'var(--accent-glow)'
            }}>
              {isError ? (
                <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-10 text-center animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-wide mb-4" style={{ color: 'var(--text-primary)' }}>Account Settings</h1>
            <p className="text-base" style={{ color: 'var(--text-secondary)' }}>Manage your preferences, profile, and security.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Sidebar */}
            <aside className="w-full md:w-64 flex-shrink-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="rounded-2xl overflow-hidden p-2" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>

                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative group overflow-hidden"
                    style={{
                      backgroundColor: activeTab === 'settings' ? 'var(--accent-glow)' : 'transparent',
                      color: activeTab === 'settings' ? 'var(--accent)' : 'var(--text-secondary)'
                    }}
                  >
                    {activeTab === 'settings' && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full" style={{ backgroundColor: 'var(--accent)' }} />}
                    <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="transition-colors group-hover:text-[var(--text-primary)]">General</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative group overflow-hidden"
                    style={{
                      backgroundColor: activeTab === 'profile' ? 'var(--accent-glow)' : 'transparent',
                      color: activeTab === 'profile' ? 'var(--accent)' : 'var(--text-secondary)'
                    }}
                  >
                    {activeTab === 'profile' && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full" style={{ backgroundColor: 'var(--accent)' }} />}
                    <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="transition-colors group-hover:text-[var(--text-primary)]">Profile</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative group overflow-hidden"
                    style={{
                      backgroundColor: activeTab === 'security' ? 'var(--accent-glow)' : 'transparent',
                      color: activeTab === 'security' ? 'var(--accent)' : 'var(--text-secondary)'
                    }}
                  >
                    {activeTab === 'security' && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full" style={{ backgroundColor: 'var(--accent)' }} />}
                    <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="transition-colors group-hover:text-[var(--text-primary)]">Account Security</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('billing')}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative group overflow-hidden"
                    style={{
                      backgroundColor: activeTab === 'billing' ? 'var(--accent-glow)' : 'transparent',
                      color: activeTab === 'billing' ? 'var(--accent)' : 'var(--text-secondary)'
                    }}
                  >
                    {activeTab === 'billing' && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full" style={{ backgroundColor: 'var(--accent)' }} />}
                    <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="transition-colors group-hover:text-[var(--text-primary)]">Billing</span>
                  </button>

                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <button
                      onClick={async () => {
                        try {
                          console.log('Settings logout started...');
                          await auth.signOut();
                          // Clear all auth storage
                          Object.keys(localStorage).forEach(key => {
                            if (key.includes('firebase') || key.includes('auth')) {
                              localStorage.removeItem(key);
                            }
                          });
                          sessionStorage.clear();
                          setTimeout(() => {
                            window.location.replace('/');
                          }, 100);
                        } catch (error) {
                          console.error('Error logging out:', error);
                          window.location.replace('/');
                        }
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-[rgba(239,68,68,0.1)] transition-colors group"
                    >
                      <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </nav>
              </div>
            </aside>

            {/* Main Form */}
            <main className="flex-1 w-full animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              {activeTab === 'settings' && (
                <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold font-display tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>General Info</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Basic information about your account.</p>
                  </div>

                  {/* Email */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full rounded-xl px-4 py-3 text-base cursor-not-allowed border"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-secondary)'
                      }}
                    />
                    <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>Your email address cannot be changed.</p>
                  </div>

                  {/* Language */}
                  <div className="mb-8 pb-8 border-b" style={{ borderColor: 'var(--border)' }}>
                    <label className="block text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>
                      Language
                    </label>
                    <select
                      className="w-full rounded-xl px-4 py-3 text-base outline-none transition-all border focus:ring-1"
                      style={{
                        backgroundColor: 'var(--bg-base)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Bahasa Indonesia</option>
                      <option>Español</option>
                    </select>
                  </div>

                  {/* Appearance / Theme Toggle */}
                  <div className="mb-8 pb-8 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>Dark Mode</h3>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Switch between light and dark themes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={isDark}
                          onChange={toggleTheme}
                        />
                        <div className="w-12 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)] transition-colors" style={{ backgroundColor: 'var(--bg-elevated)' }}></div>
                      </label>
                    </div>
                  </div>



                  {/* Notifications */}
                  <div className="mb-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>Email Notifications</h3>
                          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Updates about your reading progress</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-12 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)] transition-colors" style={{ backgroundColor: 'var(--bg-elevated)' }}></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold tracking-wide" style={{ color: 'var(--text-primary)' }}>Push Notifications</h3>
                          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Get notified about new releases</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-12 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)] transition-colors" style={{ backgroundColor: 'var(--bg-elevated)' }}></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 mt-8 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="rounded-xl px-8 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                      style={{ backgroundColor: 'var(--accent)', boxShadow: '0 4px 14px 0 rgba(244, 63, 94, 0.39)' }}
                    >
                      <span className="relative z-10">{loading ? 'Saving...' : 'Save Changes'}</span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="rounded-xl px-6 py-3 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold font-display tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>Profile</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Update your personal information and profile settings.</p>
                  </div>

                  {/* Profile Picture */}
                  <div className="mb-8 pb-8 border-b" style={{ borderColor: 'var(--border)' }}>
                    <label className="block text-sm font-bold mb-4 tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>Profile Picture</label>
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      <div className="h-24 w-24 rounded-full flex items-center justify-center text-white text-3xl font-display font-bold font-serif overflow-hidden flex-shrink-0 shadow-lg border-2" style={{ borderColor: 'var(--border-accent)', background: 'linear-gradient(135deg, var(--accent) 0%, #b81d4a 100%)' }}>
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          displayName?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex gap-3 mb-4">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/webp,image/jpeg,image/jpg,image/png"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="profile-photo-upload"
                            />
                            <span className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 shadow-accent overflow-hidden relative group" style={{ backgroundColor: 'var(--accent)' }}>
                              <span className="relative z-10 flex items-center gap-2">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Upload New
                              </span>
                              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            </span>
                          </label>
                          <button
                            onClick={handleRemoveImage}
                            className="rounded-xl border px-5 py-2.5 text-sm font-bold transition-colors hover:bg-opacity-80" style={{
                              backgroundColor: 'transparent',
                              borderColor: 'var(--border)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            <strong style={{ color: 'var(--text-primary)' }}>Requirements:</strong> Max 2MB • WebP (recommended), JPEG, PNG • 400x400px optimal
                          </p>
                        </div>
                        {uploadError && (
                          <div className={`mt-3 p-3 rounded-xl text-xs border ${uploadError.startsWith('✅') || uploadError.startsWith('✓')
                            ? 'bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.2)] text-[#10b981]'
                            : uploadError.startsWith('❌')
                              ? 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)] text-[#ef4444]'
                              : 'bg-[rgba(244,63,94,0.1)] border-[rgba(244,63,94,0.2)] text-[var(--accent)]'
                            }`}>
                            {uploadError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full rounded-xl border px-4 py-3 text-base cursor-not-allowed"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-secondary)'
                      }}
                    />
                    <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>Your email address cannot be changed.</p>
                  </div>

                  {/* Username */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>
                      Username
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <span className="text-base" style={{ color: 'var(--text-secondary)' }}>@</span>
                      </div>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        placeholder="username"
                        minLength={3}
                        maxLength={20}
                        className={`w-full rounded-xl border px-10 py-3 text-base outline-none transition-colors ${username && username !== originalUsername && usernameAvailable === false
                          ? 'border-red-500'
                          : username && username !== originalUsername && usernameAvailable === true
                            ? 'border-green-500'
                            : 'focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]'
                          }`}
                        style={{
                          backgroundColor: 'var(--bg-base)',
                          color: 'var(--text-primary)',
                          borderColor: (username && username !== originalUsername && usernameAvailable !== null) ? undefined : 'var(--border)'
                        }}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        {checkingUsername ? (
                          <svg className="animate-spin h-5 w-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : username && username !== originalUsername && usernameAvailable === true ? (
                          <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : username && username !== originalUsername && usernameAvailable === false ? (
                          <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : null}
                      </div>
                    </div>
                    {username && username !== originalUsername && usernameAvailable === false && (
                      <p className="mt-2 text-xs text-red-500">Username already taken</p>
                    )}
                    {username && username !== originalUsername && usernameAvailable === true && (
                      <p className="mt-2 text-xs text-green-500">Username available</p>
                    )}
                    <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>Your unique @username (3-20 characters, letters, numbers, underscore only).</p>
                  </div>

                  {/* Display Name */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border px-4 py-3 text-base outline-none focus:ring-1 transition-colors"
                      style={{
                        backgroundColor: 'var(--bg-base)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>Your display name shown publicly on your profile.</p>
                  </div>

                  {/* Bio */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Avid reader and philosophy enthusiast. Exploring the intersection of quantum mechanics and human consciousness."
                      rows={4}
                      className="w-full rounded-xl border px-4 py-3 text-base outline-none focus:ring-1 transition-colors resize-none"
                      style={{
                        backgroundColor: 'var(--bg-base)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    />
                    <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>Brief description for your profile. Maximum 200 characters.</p>
                  </div>

                  {/* Annual Reading Goal */}
                  <div className="mb-8">
                    <label className="block text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>
                      Annual Reading Goal
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={readingGoal}
                        onChange={(e) => setReadingGoal(e.target.value)}
                        min="1"
                        max="999"
                        className="w-24 rounded-xl border px-4 py-3 text-base outline-none focus:ring-1 transition-colors"
                        style={{
                          backgroundColor: 'var(--bg-base)',
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <span className="text-sm font-bold tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>BOOKS</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 mt-8 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="rounded-xl px-8 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden shadow-accent"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      <span className="relative z-10">{loading ? 'Saving...' : 'Save Changes'}</span>
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="rounded-xl px-6 py-3 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border hover:bg-opacity-80"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Account Security Tab */}
              {activeTab === 'security' && (
                <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold font-display tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>Account Security</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage your password and security preferences to keep your account safe.</p>
                  </div>

                  {/* Success/Error Message */}
                  {showSuccessMessage && (
                    <div className={`mb-8 rounded-xl p-4 border ${isError
                      ? 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)]'
                      : 'bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.2)]'
                      }`}>
                      <p className={`text-sm font-bold text-center ${isError
                        ? 'text-[#ef4444]'
                        : 'text-[#10b981]'
                        }`}>
                        {successMessage}
                      </p>
                    </div>
                  )}

                  {/* Change Password Section */}
                  <form onSubmit={handlePasswordChange}>
                    <div className="mb-10">
                      <h2 className="text-sm font-bold tracking-wide uppercase mb-6" style={{ color: 'var(--text-primary)' }}>Change Password</h2>

                      {passwordError && (
                        <div className="mb-6 rounded-xl border p-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                          <p className="text-sm font-bold" style={{ color: '#ef4444' }}>{passwordError}</p>
                        </div>
                      )}

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>Current Password</label>
                          <div className="relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              required
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="••••••••"
                              className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors ${passwordError && passwordError.toLowerCase().includes('current password')
                                ? 'border-red-500'
                                : 'focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)]'
                                }`}
                              style={{
                                backgroundColor: 'var(--bg-base)',
                                color: 'var(--text-primary)',
                                borderColor: (passwordError && passwordError.toLowerCase().includes('current password')) ? undefined : 'var(--border)'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-4 transition-all duration-200 hover:scale-110" style={{ color: 'var(--text-secondary)' }}
                            >
                              {showCurrentPassword ? (
                                <svg className="h-5 w-5 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {passwordError && passwordError.toLowerCase().includes('current password') && (
                            <p className="mt-2 text-xs" style={{ color: '#ef4444' }}>Current password is incorrect</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>New Password</label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? "text" : "password"}
                                required
                                minLength={6}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors ${newPassword && newPassword.length < 6
                                  ? 'border-red-500'
                                  : newPassword && newPassword.length >= 6
                                    ? 'border-green-500'
                                    : 'focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)]'
                                  }`}
                                style={{
                                  backgroundColor: 'var(--bg-base)',
                                  color: 'var(--text-primary)',
                                  borderColor: (newPassword ? undefined : 'var(--border)')
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 transition-all duration-200 hover:scale-110" style={{ color: 'var(--text-secondary)' }}
                              >
                                {showNewPassword ? (
                                  <svg className="h-5 w-5 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                  </svg>
                                ) : (
                                  <svg className="h-5 w-5 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                            {newPassword && newPassword.length < 6 && (
                              <p className="mt-2 text-xs" style={{ color: '#ef4444' }}>Minimum 6 characters</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-bold mb-2 tracking-wide uppercase" style={{ color: 'var(--text-primary)' }}>Confirm New Password</label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                minLength={6}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full rounded-xl border px-4 py-3 text-base outline-none transition-colors ${confirmPassword && confirmPassword !== newPassword
                                  ? 'border-red-500'
                                  : confirmPassword && confirmPassword === newPassword && newPassword.length >= 6
                                    ? 'border-green-500'
                                    : 'focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)]'
                                  }`}
                                style={{
                                  backgroundColor: 'var(--bg-base)',
                                  color: 'var(--text-primary)',
                                  borderColor: (confirmPassword ? undefined : 'var(--border)')
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 transition-all duration-200 hover:scale-110" style={{ color: 'var(--text-secondary)' }}
                              >
                                {showConfirmPassword ? (
                                  <svg className="h-5 w-5 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                  </svg>
                                ) : (
                                  <svg className="h-5 w-5 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                            {confirmPassword && confirmPassword !== newPassword && (
                              <p className="mt-2 text-xs" style={{ color: '#ef4444' }}>Passwords don't match</p>
                            )}
                          </div>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Password must be at least 6 characters long.</p>
                      </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="mb-10 pb-8 border-b" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-sm font-bold tracking-wide uppercase mb-1" style={{ color: 'var(--text-primary)' }}>Two-Factor Authentication</h2>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Add an extra layer of security to your account.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={twoFactorEnabled}
                            onChange={handleTwoFactorToggle}
                            className="sr-only peer"
                          />
                          <div className="w-12 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)] transition-colors" style={{ backgroundColor: 'var(--bg-elevated)' }}></div>
                        </label>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mt-8 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="rounded-xl px-8 py-3 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden shadow-accent"
                        style={{ backgroundColor: 'var(--accent)' }}
                      >
                        <span className="relative z-10">{passwordLoading ? 'Updating...' : 'Update Password'}</span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={passwordLoading}
                        className="rounded-xl px-6 py-3 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border hover:bg-opacity-80"
                        style={{
                          backgroundColor: 'transparent',
                          borderColor: 'var(--border)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold font-display tracking-wide mb-2" style={{ color: 'var(--text-primary)' }}>Billing & Subscription</h2>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage your subscription plans and payment history.</p>
                  </div>

                  {/* Current Plan */}
                  <div className="mb-8">
                    <h3 className="text-sm font-bold tracking-wide uppercase mb-4" style={{ color: 'var(--text-primary)' }}>Current Plan</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-xl border relative overflow-hidden group" style={{
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border)'
                    }}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)] opacity-5 rounded-bl-full transition-transform group-hover:scale-110"></div>
                      <div className="flex items-center gap-5 mb-4 sm:mb-0 relative z-10">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl shadow-accent shadow-lg" style={{ background: 'linear-gradient(135deg, var(--accent) 0%, #b81d4a 100%)' }}>
                          <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Premium Annual Plan</h4>
                          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Next billing date: October 24, 2024</p>
                        </div>
                      </div>
                      <button className="rounded-xl px-6 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 shadow-accent relative z-10" style={{ backgroundColor: 'var(--accent)' }}>
                        Manage Plan
                      </button>
                    </div>
                  </div>

                  {/* Cancel Subscription */}
                  <div className="pt-8 mt-8 border-t" style={{ borderColor: 'var(--border)' }}>
                    <button className="text-sm font-bold text-[#ef4444] hover:text-white transition-colors">
                      Cancel Subscription
                    </button>
                    <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>If you cancel, you'll still have access to premium features until the end of your billing cycle.</p>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-10 w-48 rounded-xl mb-4" style={{ backgroundColor: 'var(--bg-elevated)' }}></div>
          <div className="h-6 w-64 rounded-xl mb-10" style={{ backgroundColor: 'var(--bg-elevated)' }}></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 h-96 rounded-2xl" style={{ backgroundColor: 'var(--bg-surface)' }}></div>
            <div className="flex-1 h-[600px] rounded-2xl" style={{ backgroundColor: 'var(--bg-surface)' }}></div>
          </div>
        </div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
