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
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [socialList, setSocialList] = useState<any[]>([]);
  const [loadingSocial, setLoadingSocial] = useState(false);
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

  const fetchSocialList = async (type: 'followers' | 'following') => {
    if (!profileData.username && !user?.uid) return;

    setLoadingSocial(true);
    setSocialList([]);
    try {
      const token = await user?.getIdToken();
      const identifier = profileData.username || user?.uid;
      const response = await fetch(`/api/users/${identifier}/${type}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (response.ok) {
        const data = await response.json();
        setSocialList(data || []);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoadingSocial(false);
    }
  };

  const openSocialModal = (type: 'followers' | 'following') => {
    if (type === 'followers') setShowFollowersModal(true);
    else setShowFollowingModal(true);
    fetchSocialList(type);
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
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
          <div className="rounded-2xl p-8 animate-pulse border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-white/5" />
              <div className="flex-1 space-y-4 w-full text-center sm:text-left">
                <div className="h-8 w-48 mx-auto sm:mx-0 rounded-lg bg-white/5" />
                <div className="h-4 w-64 mx-auto sm:mx-0 rounded-lg bg-white/5" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Profile Header Card */}
        <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl border animate-fade-in-up"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>

          {/* Decorative background gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-20 blur-3xl rounded-full"
            style={{ background: 'var(--accent)', marginRight: '-10%', marginTop: '-10%' }}></div>

          <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-center md:items-end">
            {/* Avatar Section */}
            <div className="relative shrink-0 group">
              <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full p-1 border-2"
                style={{ borderColor: 'var(--accent)', background: 'linear-gradient(135deg, var(--accent), var(--accent-glow))' }}>
                <div className="h-full w-full rounded-full overflow-hidden flex items-center justify-center text-white text-4xl sm:text-5xl font-bold font-display"
                  style={{ backgroundColor: '#13131a' }}>
                  {profileData.photoUrl || user?.photoURL ? (
                    <Image
                      src={profileData.photoUrl || user?.photoURL || ''}
                      alt="Profile Picture"
                      width={160}
                      height={160}
                      className="h-full w-full object-cover"
                      priority
                    />
                  ) : (
                    getInitials(profileData.name || user?.displayName || user?.email || '')
                  )}
                </div>
              </div>

              {profileData.subscription?.status === 'ACTIVE' && (
                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full shadow-lg border-2 border-[#13131a]"
                  style={{ backgroundColor: 'var(--accent)' }} title="Premium Member" aria-label="Premium Member Badge">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              )}
            </div>

            {/* User Meta info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  {profileData.name || getUserName()}
                </h1>
                <div className="flex justify-center md:justify-start gap-2">
                  <Link href="/settings?tab=profile"
                    className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border flex items-center gap-2 hover:scale-105"
                    aria-label="Edit Profile Settings"
                    style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Settings
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                {profileData.username && (<span>@{profileData.username}</span>)}
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Joined {joinDate}
                </span>
              </div>

              <p className="text-base leading-relaxed max-w-xl mx-auto md:mx-0" style={{ color: 'var(--text-secondary)' }}>
                {profileData.bio || 'Add a bio to let others know what you are reading.'}
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 divide-x border-t" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--border)' }}>
            <div className="text-center group py-4 transition-colors hover:bg-white/5">
              <span className="block text-2xl font-bold font-display group-hover:scale-110 transition-transform" style={{ color: 'var(--text-primary)' }}>
                {profileData.stats?.booksRead || completedCount}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--text-secondary)' }}>Books Read</span>
            </div>
            <button className="text-center group py-4 transition-colors hover:bg-white/5 outline-none" onClick={() => openSocialModal('followers')} aria-label={`View ${profileData.stats?.followers || 0} Followers`}>
              <span className="block text-2xl font-bold font-display group-hover:scale-110 transition-transform" style={{ color: 'var(--text-primary)' }}>
                {profileData.stats?.followers || 0}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--text-secondary)' }}>Followers</span>
            </button>
            <button className="text-center group py-4 transition-colors hover:bg-white/5 outline-none" onClick={() => openSocialModal('following')} aria-label={`View ${profileData.stats?.following || 0} Following`}>
              <span className="block text-2xl font-bold font-display group-hover:scale-110 transition-transform" style={{ color: 'var(--text-primary)' }}>
                {profileData.stats?.following || 0}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--text-secondary)' }}>Following</span>
            </button>
          </div>
        </div>

        {/* ═══ Reading Goal Section ═══ */}
        <div className="mb-16 animate-fade-in-up stagger-1 p-8 rounded-3xl border border-dashed flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(244, 63, 94, 0.02)' }}>
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Yearly Reading Goal</h3>
            <p className="text-sm opacity-60" style={{ color: 'var(--text-secondary)' }}>You have completed {completedCount} books out of your {yearGoal} goal.</p>
          </div>
          <div className="flex-1 w-full max-w-md">
            <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
              <span>Progress</span>
              <span>{Math.round((completedCount / yearGoal) * 100)}%</span>
            </div>
            <div className="h-4 w-full rounded-full overflow-hidden p-0.5" style={{ backgroundColor: 'var(--bg-elevated)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.min(100, (completedCount / yearGoal) * 100)}%`,
                  background: 'linear-gradient(to right, var(--accent-glow), var(--accent))',
                  boxShadow: '0 0 10px var(--accent-glow)'
                }}
              />
            </div>
          </div>
        </div>

        {/* ═══ Library Tabs ═══ */}
        <div className="flex items-center gap-8 mb-10 overflow-x-auto pb-4 px-2 scrollbar-hide">
          {[
            { id: 'all', label: 'All Books', count: readlistItems.length },
            { id: 'reading', label: 'Currently Reading', count: readlistItems.filter(i => i.status === 'READING').length },
            { id: 'completed', label: 'Finished', count: completedCount },
            { id: 'wantToRead', label: 'Readlist', count: readlistItems.filter(i => i.status === 'WANT_TO_READ').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="group whitespace-nowrap flex items-center gap-3 transition-all px-1"
            >
              <span className={`text-base font-bold transition-all origin-left ${activeTab === tab.id ? 'scale-110' : 'opacity-50'}`}
                style={{ color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {tab.label}
              </span>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black transition-all ${activeTab === tab.id ? 'bg-[var(--accent)] text-white' : 'bg-white/5 opacity-30 text-[var(--text-secondary)]'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ═══ Library Grid ═══ */}
        {filteredItems.length === 0 ? (
          <div className="rounded-3xl p-16 text-center border-2 border-dashed animate-fade-in"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <div className="mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--bg-elevated)' }}>
              <svg className="h-10 w-10 opacity-20" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Your shelf is empty</h3>
            <p className="text-sm opacity-60 mb-8 max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>Explore thousands of ebooks and start building your personal library today.</p>
            <Link href="/" className="px-8 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 20px var(--accent-glow)' }}>
              Explore Library
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 animate-fade-in">
            {filteredItems.map((item, idx) => (
              <Link
                key={item.id}
                href={`/ebooks/${item.ebookId}`}
                className="group relative flex flex-col h-full animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Book Cover Container */}
                <div className="relative aspect-[3/4.5] w-full overflow-hidden rounded-2xl shadow-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-rose-900/20"
                  style={{ backgroundColor: 'var(--bg-elevated)' }}>
                  <img
                    src={item.ebook.coverUrl || '/placeholder-book.jpg'}
                    alt={item.ebook.title}
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                  />

                  {/* Status Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                    <span className="inline-block w-full py-1.5 rounded-lg text-center text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                      Quick Read
                    </span>
                  </div>

                  {/* Status Badge Pin */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 pointer-events-none">
                    {item.status === 'FINISHED' ? (
                      <span className="p-1.5 rounded-lg backdrop-blur-md shadow-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.9)' }}>
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </span>
                    ) : item.status === 'READING' ? (
                      <span className="p-1.5 rounded-lg backdrop-blur-md shadow-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.9)' }}>
                        <svg className="w-3 h-3 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="pt-4 flex-1">
                  <h3 className="text-sm font-bold font-display line-clamp-1 mb-1 transition-colors group-hover:text-[var(--accent)]" style={{ color: 'var(--text-primary)' }}>
                    {item.ebook.title}
                  </h3>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-medium opacity-50 truncate" style={{ color: 'var(--text-secondary)' }}>{item.ebook.author}</p>
                    {item.ebook.isPremium && (
                      <span className="text-[9px] font-black uppercase tracking-tighter" style={{ color: 'var(--accent)' }}>Premium</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ═══ Social Modals ═══ */}
      {(showFollowersModal || showFollowingModal) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setShowFollowersModal(false); setShowFollowingModal(false); }} />
          <div className="relative w-full max-w-md max-h-[80vh] overflow-hidden rounded-3xl border shadow-2xl animate-scale-up"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>

            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                {showFollowersModal ? 'Followers' : 'Following'}
              </h2>
              <button
                onClick={() => { setShowFollowersModal(false); setShowFollowingModal(false); }}
                className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="overflow-y-auto p-4 max-h-[calc(80vh-80px)] scrollbar-hide">
              {loadingSocial ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin mb-4" style={{ borderColor: 'var(--accent) transparent var(--accent) transparent' }}></div>
                  <p className="text-xs font-bold opacity-50" style={{ color: 'var(--text-secondary)' }}>Fetching list...</p>
                </div>
              ) : socialList.length === 0 ? (
                <div className="text-center py-12 opacity-50" style={{ color: 'var(--text-secondary)' }}>
                  <p className="text-sm font-medium">No one here yet.</p>
                </div>
              ) : (
                <div className="grid gap-2">
                  {socialList.map((socialUser, idx) => (
                    <Link
                      key={socialUser.id}
                      href={`/user/${socialUser.username || socialUser.id}`}
                      className="flex items-center gap-4 p-3 rounded-2xl transition-all hover:bg-white/5 border border-transparent hover:border-white/5 animate-fade-in-up"
                      style={{ animationDelay: `${idx * 50}ms` }}
                      onClick={() => { setShowFollowersModal(false); setShowFollowingModal(false); }}
                    >
                      <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center font-bold text-white text-lg shrink-0"
                        style={{ backgroundColor: 'var(--bg-elevated)' }}>
                        {socialUser.photoUrl ? (
                          <img src={socialUser.photoUrl} alt={socialUser.name} className="h-full w-full object-cover" />
                        ) : (
                          socialUser.name?.[0] || socialUser.username?.[0] || 'U'
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{socialUser.name || 'Anonymous User'}</h4>
                        <p className="text-[10px] font-medium opacity-50" style={{ color: 'var(--text-secondary)' }}>@{socialUser.username || 'user'}</p>
                      </div>
                      <svg className="w-4 h-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
