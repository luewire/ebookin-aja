'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface ReadlistItem {
  id: string;
  userId: string;
  ebookId: string;
  status: 'WANT_TO_READ' | 'READING' | 'FINISHED';
  createdAt: string;
  updatedAt: string;
  ebook: {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    category: string;
    isPremium: boolean;
  };
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [readlistItems, setReadlistItems] = useState<ReadlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'reading' | 'completed' | 'wantToRead'>('all');
  const [profileData, setProfileData] = useState<{
    name: string | null;
    username: string | null;
    bio: string | null;
    reading_goal: number | null;
    photoUrl: string | null;
    subscription?: {
      status: string;
      planName: string;
    } | null;
    stats?: {
      followers: number;
      following: number;
      booksRead: number;
    };
  }>({ name: null, username: null, bio: null, reading_goal: null, photoUrl: null, subscription: null });
  const [editMode, setEditMode] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Fetch profile data on mount and when window gains focus
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user) {
      fetchReadlist();
      fetchProfileData();
    }
  }, [authLoading, user]);

  // Refetch data when window/tab gains focus (e.g., after navigating from settings)
  useEffect(() => {
    const handleFocus = () => {
      if (!authLoading && user) {
        fetchProfileData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [authLoading, user]);

  const fetchProfileData = async () => {
    try {
      // Load from database via API
      const token = await user?.getIdToken();
      if (token) {
        const response = await fetch('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
          cache: 'no-store' // Always fetch fresh data
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setProfileData({
              name: data.user.name || null,
              username: data.user.username || null,
              bio: data.user.bio || null,
              reading_goal: data.user.readingGoal || null,
              photoUrl: data.user.photoUrl || null,
              subscription: data.user.subscription || null,
              stats: data.user.stats
            });
            return;
          }
        }
      }

      // Fallback to user metadata if API fails
      setProfileData({
        name: user?.displayName || user?.email?.split('@')[0] || null,
        username: null,
        bio: null,
        reading_goal: 25,
        photoUrl: user?.photoURL || null
      });
    } catch (error: any) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchReadlist = async () => {
    try {
      const token = await user?.getIdToken();
      if (!token) return;

      const response = await fetch('/api/readlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setReadlistItems(data || []);
      }
    } catch (error: any) {
      console.error('Error fetching readlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Starting logout process...');

      // Sign out from Firebase
      await signOut(auth);

      // Clear localStorage (except dark mode preference)
      const darkMode = localStorage.getItem('darkMode');
      localStorage.clear();
      if (darkMode) {
        localStorage.setItem('darkMode', darkMode);
      }

      // Clear session storage
      sessionStorage.clear();

      console.log('Logout complete, redirecting...');

      // Redirect to home
      window.location.replace('/');

    } catch (error) {
      console.error('Error logging out:', error);
      window.location.replace('/');
    }
  };

  const getInitials = (text: string) => {
    if (!text) return 'U';
    const words = text.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return text.substring(0, 2).toUpperCase();
  };

  const getUserName = () => {
    return profileData.name || user?.displayName || user?.email?.split('@')[0] || 'User';
  };

  const handleEditProfile = () => {
    setEditUsername(profileData.name || getUserName());
    setEditBio(profileData.bio || '');
    setEditMode(true);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser!, {
        displayName: editUsername,
      });

      // Update local state
      setProfileData({
        ...profileData,
        username: editUsername,
        bio: editBio,
      });

      setEditMode(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const filteredItems = readlistItems.filter(item => {
    if (activeTab === 'reading') return item.status === 'READING';
    if (activeTab === 'completed') return item.status === 'FINISHED';
    if (activeTab === 'wantToRead') return item.status === 'WANT_TO_READ';
    return true;
  });

  const completedCount = readlistItems.filter(item => item.status === 'FINISHED').length;
  const yearGoal = profileData.reading_goal || 25;
  const joinDate = user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-64 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
          <div className="flex items-center gap-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-6 py-4 shadow-lg">
            <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="relative">
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-xl overflow-hidden">
              {profileData.photoUrl || user?.photoURL ? (
                <img src={profileData.photoUrl || user?.photoURL || ''} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                getInitials(profileData.name || user?.displayName || user?.email || '')
              )}
            </div>
          </div>

          <div className="flex-1 w-full">
            {!editMode ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                      {profileData.name || getUserName()}
                      {profileData.subscription?.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wide">
                          Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600 uppercase tracking-wider">
                          Free
                        </span>
                      )}
                    </h1>
                    {profileData.username && (
                      <p className="text-base text-gray-500 dark:text-gray-400 mt-1.5">@{profileData.username}</p>
                    )}
                  </div>
                  <Link
                    href="/settings?tab=profile"
                    className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors w-fit"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </Link>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                  {profileData.bio || 'No bio yet. Click Edit Profile to add one!'}
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    disabled={saving}
                    className="rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-4">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Joined {joinDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-900 dark:text-gray-100">2026 Goal: {completedCount} of {yearGoal} books</span>
                <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (completedCount / yearGoal) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Social Stats Row */}
            {profileData.stats && (
              <div className="flex gap-8 mt-6 pt-6 border-t border-gray-100 dark:border-slate-700">
                <div>
                  <span className="block text-xl font-bold text-gray-900 dark:text-gray-100 leading-none">{profileData.stats.followers}</span>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Followers</span>
                </div>
                <div>
                  <span className="block text-xl font-bold text-gray-900 dark:text-gray-100 leading-none">{profileData.stats.following}</span>
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Following</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* My Library Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">My Library</h2>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-gray-200 dark:border-slate-700 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
            >
              All Books
            </button>
            <button
              onClick={() => setActiveTab('reading')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reading'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
            >
              Currently Reading
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'completed'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab('wantToRead')}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'wantToRead'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
            >
              Want to read
            </button>
          </div>

          {/* Books Grid */}
          {filteredItems.length === 0 ? (
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-12 text-center">
              <div className="mb-4 text-5xl">📚</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {activeTab === 'reading'
                  ? 'No books in progress'
                  : activeTab === 'completed'
                    ? 'No completed books yet'
                    : activeTab === 'wantToRead'
                      ? 'No books in your Want to read list'
                      : 'No books in your library'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {activeTab === 'wantToRead'
                  ? 'Add books to your Want to read list to keep track of what you want to read next.'
                  : 'Start reading to build your collection'}
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-200"
              >
                Explore Library
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {filteredItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/ebooks/${item.ebookId}`}
                  className="group"
                >
                  <div className="mb-3 aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-slate-700 shadow-md group-hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-600">
                    <img
                      src={item.ebook.coverUrl || '/placeholder-book.jpg'}
                      alt={item.ebook.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                    {item.ebook.title}
                  </h3>
                  <p className="mb-2 text-xs text-gray-600 dark:text-gray-400">{item.ebook.author}</p>

                  {/* Status Badge */}
                  <div className="mb-2">
                    {item.status === 'FINISHED' ? (
                      <span className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-1 text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">
                        COMPLETED
                      </span>
                    ) : item.status === 'READING' ? (
                      <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-1 text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                        READING
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-gray-100 dark:bg-slate-700 px-2 py-1 text-[10px] font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                        WANT TO READ
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
