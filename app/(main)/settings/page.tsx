'use client';

import { useEffect, useState } from 'react';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function SettingsPage() {
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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
  }, []);

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
      const metadata = user.user_metadata || {};
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
          <div className={`flex items-center gap-3 rounded-lg px-6 py-4 shadow-lg ${isError
            ? 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
            : 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800'
            }`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isError
              ? 'bg-red-100 dark:bg-red-900'
              : 'bg-green-100 dark:bg-green-900'
              }`}>
              {isError ? (
                <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div>
              <p className={`text-sm font-semibold ${isError
                ? 'text-red-900 dark:text-red-100'
                : 'text-green-900 dark:text-green-100'
                }`}>{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">SETTINGS</h3>
              </div>

              <nav className="p-2">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  General
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Account Security
                </button>

                <button
                  onClick={() => setActiveTab('billing')}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'billing'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Billing
                </button>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <button
                    onClick={async () => {
                      try {
                        console.log('Settings logout started...');
                        const { error } = await supabase.auth.signOut({ scope: 'local' });
                        if (error) {
                          console.error('Logout error:', error);
                        }
                        // Clear all auth storage
                        Object.keys(localStorage).forEach(key => {
                          if (key.includes('supabase') || key.includes('auth') || key.includes('sb-')) {
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
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Form */}
          <main className="flex-1">
            {activeTab === 'settings' && (
              <div className="rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">General Settings</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account settings and preferences.</p>
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 px-4 py-3 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Your email address cannot be changed.</p>
                </div>

                {/* Language */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Language
                  </label>
                  <select className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Bahasa Indonesia</option>
                    <option>Español</option>
                  </select>
                </div>

                {/* Appearance */}
                <div className="mb-8">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">APPEARANCE</h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Dark Mode</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isDarkMode}
                        onChange={(e) => {
                          const newMode = e.target.checked;
                          setIsDarkMode(newMode);
                          localStorage.setItem('darkMode', String(newMode));
                          if (newMode) {
                            document.documentElement.classList.add('dark');
                          } else {
                            document.documentElement.classList.remove('dark');
                          }
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Notifications */}
                <div className="mb-8">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">NOTIFICATIONS</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Email Notifications</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Receive updates about your reading progress</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Push Notifications</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Get notified about new releases</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Profile</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Update your personal information and profile settings.</p>
                </div>

                {/* Profile Picture */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Profile Picture</label>
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden flex-shrink-0">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        displayName?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-3 mb-3">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/webp,image/jpeg,image/jpg,image/png"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="profile-photo-upload"
                          />
                          <span className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Upload New
                          </span>
                        </label>
                        <button
                          onClick={handleRemoveImage}
                          className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          <strong>Requirements:</strong> Max 2MB • WebP (recommended), JPEG, PNG • 400x400px optimal
                        </p>
                      </div>
                      {uploadError && (
                        <div className={`mt-2 p-2 rounded-lg text-xs ${uploadError.startsWith('✅') || uploadError.startsWith('✓')
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : uploadError.startsWith('❌')
                            ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          }`}>
                          {uploadError}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 px-4 py-3 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Your email address cannot be changed.</p>
                </div>

                {/* Username */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="text-gray-500 dark:text-gray-400 text-base">@</span>
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="username"
                      minLength={3}
                      maxLength={20}
                      className={`w-full rounded-lg border ${username && username !== originalUsername && usernameAvailable === false
                        ? 'border-red-300 dark:border-red-600'
                        : username && username !== originalUsername && usernameAvailable === true
                          ? 'border-green-300 dark:border-green-600'
                          : 'border-gray-300 dark:border-slate-600'
                        } bg-white dark:bg-slate-900 pl-10 pr-10 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors`}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {checkingUsername ? (
                        <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
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
                    <p className="mt-2 text-xs text-red-600 dark:text-red-400">Username already taken</p>
                  )}
                  {username && username !== originalUsername && usernameAvailable === true && (
                    <p className="mt-2 text-xs text-green-600 dark:text-green-400">Username available</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Your unique @username (3-20 characters, letters, numbers, underscore only).</p>
                </div>

                {/* Display Name */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Your display name shown publicly on your profile.</p>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Avid reader and philosophy enthusiast. Exploring the intersection of quantum mechanics and human consciousness."
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors resize-none"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Brief description for your profile. Maximum 200 characters.</p>
                </div>

                {/* Annual Reading Goal */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Annual Reading Goal
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={readingGoal}
                      onChange={(e) => setReadingGoal(e.target.value)}
                      min="1"
                      max="999"
                      className="w-24 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">BOOKS</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Account Security Tab */}
            {activeTab === 'security' && (
              <div className="rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Account Security</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your password and security preferences to keep your account safe.</p>
                </div>

                {/* Success/Error Message */}
                {showSuccessMessage && (
                  <div className={`mb-6 rounded-lg border p-4 ${isError
                    ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
                    : 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
                    }`}>
                    <p className={`text-sm font-medium text-center ${isError
                      ? 'text-red-800 dark:text-red-200'
                      : 'text-green-800 dark:text-green-200'
                      }`}>
                      {successMessage}
                    </p>
                  </div>
                )}

                {/* Change Password Section */}
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-8">
                    <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">CHANGE PASSWORD</h2>

                    {passwordError && (
                      <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 p-4">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">{passwordError}</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`w-full rounded-lg border ${passwordError && passwordError.toLowerCase().includes('current password')
                              ? 'border-red-300 dark:border-red-600'
                              : 'border-gray-300 dark:border-slate-600'
                              } bg-white dark:bg-slate-900 pl-4 pr-11 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110"
                          >
                            {showCurrentPassword ? (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                        {passwordError && passwordError.toLowerCase().includes('current password') && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">Current password is incorrect</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              required
                              minLength={6}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="••••••••"
                              className={`w-full rounded-lg border ${newPassword && newPassword.length < 6
                                ? 'border-red-300 dark:border-red-600'
                                : newPassword && newPassword.length >= 6
                                  ? 'border-green-300 dark:border-green-600'
                                  : 'border-gray-300 dark:border-slate-600'
                                } bg-white dark:bg-slate-900 pl-4 pr-11 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110"
                            >
                              {showNewPassword ? (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {newPassword && newPassword.length < 6 && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">Minimum 6 characters</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              required
                              minLength={6}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="••••••••"
                              className={`w-full rounded-lg border ${confirmPassword && confirmPassword !== newPassword
                                ? 'border-red-300 dark:border-red-600'
                                : confirmPassword && confirmPassword === newPassword && newPassword.length >= 6
                                  ? 'border-green-300 dark:border-green-600'
                                  : 'border-gray-300 dark:border-slate-600'
                                } bg-white dark:bg-slate-900 pl-4 pr-11 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 hover:scale-110"
                            >
                              {showConfirmPassword ? (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                          {confirmPassword && confirmPassword !== newPassword && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400">Passwords don't match</p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Password must be at least 6 characters long.</p>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="mb-8 pb-8 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-1">Two-Factor Authentication</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={twoFactorEnabled}
                          onChange={handleTwoFactorToggle}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {passwordLoading ? 'Updating...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={passwordLoading}
                      className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Billing and Subscription</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your subscription plans and payment history.</p>
                </div>

                {/* Current Plan */}
                <div className="mb-8">
                  <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">Current Plan</h2>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">1 Year Premium Plan</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Next billing date: October 24, 2024</p>
                      </div>
                    </div>
                    <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                      Upgrade Plan
                    </button>
                  </div>
                </div>

                {/* Cancel Subscription */}
                <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
                  <button className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    Cancel Subscription
                  </button>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">If you cancel, you'll still have access until the end of your billing cycle.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
