'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dbPhotoUrl, setDbPhotoUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for enhanced navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ all: true })
      });

      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Fetch profile photo from database
  const fetchProfilePhoto = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      });

      if (response.ok) {
        const data = await response.json();
        setDbPhotoUrl(data.user?.photoUrl || null);
      }
    } catch (error) {
      console.error('Error fetching profile photo:', error);
    }
  };

  // Initial fetches
  useEffect(() => {
    if (user) {
      fetchProfilePhoto();
      fetchNotifications();
      // Poll notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    } else {
      setDbPhotoUrl(null);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);

  // Refetch photo when window gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        fetchProfilePhoto();
        fetchNotifications();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  // Handle Search Navigation
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      router.push(`/search?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, router]);

  const handleLogout = async () => {
    try {
      setShowProfileMenu(false);
      setShowMobileMenu(false);
      setShowNotifications(false);
      await signOut(auth);
      const theme = localStorage.getItem('theme');
      localStorage.clear();
      if (theme) {
        localStorage.setItem('theme', theme);
      }
      sessionStorage.clear();
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
      router.push('/');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'FOLLOW': return (
        <svg className="h-5 w-5" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      );
      case 'MUTUAL_FOLLOW': return (
        <svg className="h-5 w-5" style={{ color: 'var(--accent-soft)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
      default: return (
        <svg className="h-5 w-5" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      );
    }
  };

  return (
    <>
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'var(--nav-bg-scrolled)' : 'var(--bg-base)',
          borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo + Nav Links */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <Image src="/logo.svg" alt="Ebookin Logo" width={32} height={32} className="h-8 w-8 transition-all duration-300 group-hover:scale-110 logo-filter" priority />
                <span className="text-xl font-bold font-display tracking-wide" style={{ color: 'var(--text-primary)' }}>Ebookin</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="/" className="nav-link text-sm font-medium tracking-wide" style={{ color: 'var(--text-secondary)' }}>Library</Link>
                <Link href="/browse" className="nav-link text-sm font-medium tracking-wide" style={{ color: 'var(--text-secondary)' }}>Explore</Link>
                <Link href="/readlist" className="nav-link text-sm font-medium tracking-wide" style={{ color: 'var(--text-secondary)' }}>My Readlist</Link>
              </div>
            </div>

            {/* Right: Search + Actions */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="hidden sm:block relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search books or users..."
                  aria-label="Search books or users"
                  className="rounded-full border px-4 py-2 pl-10 text-sm transition-all duration-300 outline-none"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: searchFocused ? 'var(--accent)' : 'var(--border)',
                    color: 'var(--text-primary)',
                    width: searchFocused ? '320px' : '240px',
                    boxShadow: searchFocused ? '0 0 0 3px var(--accent-glow)' : 'none',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                    }
                  }}
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5" style={{ color: searchFocused ? 'var(--accent)' : 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>


              {/* Notifications Bell */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                    className="rounded-full p-2 transition-all duration-300 relative group"
                    style={{ color: 'var(--text-secondary)' }}
                    title="Notifications"
                    aria-label="View notifications"
                  >
                    <svg className="h-5 w-5 transition-colors group-hover:text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: 'var(--accent)' }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                      <div className="absolute right-0 mt-3 w-80 md:w-96 rounded-2xl shadow-2xl z-20 animate-slide-down origin-top-right overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                        <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border)' }}>
                          <h3 className="font-bold font-display text-lg" style={{ color: 'var(--text-primary)' }}>Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}
                              className="text-xs font-semibold hover:underline"
                              style={{ color: 'var(--accent)' }}
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                        <div className="max-h-[70vh] overflow-y-auto">
                          {notifications.length > 0 ? (
                            <div>
                              {notifications.map((notification) => (
                                <div
                                  key={notification.id}
                                  className="p-4 flex gap-3 transition-colors relative cursor-pointer"
                                  onClick={() => setShowNotifications(false)}
                                  style={{
                                    borderBottom: '1px solid var(--border)',
                                    backgroundColor: !notification.isRead ? 'var(--accent-muted)' : 'transparent',
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-overlay)')}
                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = !notification.isRead ? 'var(--accent-muted)' : 'transparent')}
                                >
                                  {!notification.isRead && (
                                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></span>
                                  )}
                                  <div className="mt-1 flex-shrink-0">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                      {notification.title}
                                    </p>
                                    <p className="text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                      {notification.message}
                                    </p>
                                    <p className="text-[10px] mt-1.5 uppercase font-medium tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                                      {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                              <div className="h-16 w-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                <svg className="h-8 w-8" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                              </div>
                              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>No notifications yet</p>
                              <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>We&apos;ll notify you when something important happens.</p>
                            </div>
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <div className="p-3 text-center" style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
                            <button className="text-xs font-bold transition-colors" style={{ color: 'var(--text-tertiary)' }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-tertiary)')}
                            >
                              View All Notifications
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Mobile Menu Toggle */}
              {user && (
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg transition-all"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {showMobileMenu ? (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              )}

              {/* Profile / Auth Buttons */}
              {user ? (
                <div className="hidden md:block relative">
                  <button
                    onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white text-sm font-bold transition-all duration-300 overflow-hidden"
                    aria-label="Toggle profile menu"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent), var(--accent-soft))',
                      boxShadow: '0 0 0 2px transparent',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px transparent')}
                  >
                    {dbPhotoUrl || user.photoURL ? (
                      <img
                        src={dbPhotoUrl || user.photoURL || ''}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}</span>
                    )}
                  </button>
                  {showProfileMenu && (
                    <>
                      <div className="fixed inset-0 z-10 animate-fade-in" onClick={() => setShowProfileMenu(false)}></div>
                      <div className="absolute right-0 mt-3 w-64 rounded-2xl shadow-2xl z-20 animate-slide-down origin-top-right overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>

                        {/* User Info Header */}
                        <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, var(--accent-muted) 0%, transparent 100%)' }}>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-white text-sm" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-soft))' }}>
                              {dbPhotoUrl || user.photoURL ? (
                                <img src={dbPhotoUrl || user.photoURL || ''} alt="Profile" className="h-full w-full object-cover" />
                              ) : (
                                user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                {user.displayName || user.email?.split('@')[0] || 'User'}
                              </p>
                              <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-1.5 space-y-0.5">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 group"
                            style={{ color: 'var(--text-secondary)' }}
                            onClick={() => setShowProfileMenu(false)}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                          >
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </span>
                            <span className="font-medium">Profile</span>
                          </Link>

                          {(user.email === 'admin@admin.com' || user.role === 'ADMIN' || user.role === 'Admin') && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 group"
                              style={{ color: 'var(--text-secondary)' }}
                              onClick={() => setShowProfileMenu(false)}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                            >
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                              </span>
                              <span className="font-medium">Admin Panel</span>
                            </Link>
                          )}

                          <Link
                            href="/settings"
                            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 group"
                            style={{ color: 'var(--text-secondary)' }}
                            onClick={() => setShowProfileMenu(false)}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                          >
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </span>
                            <span className="font-medium">Settings</span>
                          </Link>

                          <div className="my-1.5 border-t" style={{ borderColor: 'var(--border)' }}></div>

                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 group"
                            style={{ color: 'var(--accent)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-muted)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--accent-muted)' }}>
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            </span>
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="btn-ghost rounded-xl px-4 py-2 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary rounded-xl px-4 py-2 text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Full-Screen Overlay Menu */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-[60]" style={{ backgroundColor: 'var(--bg-base)' }}>
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <Link href="/" className="flex items-center gap-2" onClick={() => setShowMobileMenu(false)}>
                <Image src="/logo.svg" alt="Ebookin Logo" width={32} height={32} className="h-8 w-8 logo-filter" priority />
                <span className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>Ebookin</span>
              </Link>
              <button onClick={() => setShowMobileMenu(false)} style={{ color: 'var(--text-secondary)' }}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Search */}
            <div className="px-6 py-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books or users..."
                  className="w-full rounded-xl px-4 py-3 pl-10 text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5" style={{ color: 'var(--text-tertiary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Mobile Links */}
            <div className="flex-1 px-6 py-4 space-y-1">
              {[
                { href: '/', label: 'Library', delay: 'stagger-1' },
                { href: '/browse', label: 'Explore', delay: 'stagger-2' },
                { href: '/readlist', label: 'My Readlist', delay: 'stagger-3' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`animate-fade-in-up ${link.delay} block px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300`}
                  style={{ color: 'var(--text-primary)', opacity: 0 }}
                  onClick={() => setShowMobileMenu(false)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-overlay)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {link.label}
                </Link>
              ))}

              {user && (
                <>
                  <hr className="my-3" style={{ borderColor: 'var(--border)' }} />
                  {[
                    { href: '/profile', label: 'Profile', delay: 'stagger-4' },
                    ...((user.email === 'admin@admin.com' || user.role === 'ADMIN' || user.role === 'Admin')
                      ? [{ href: '/admin', label: 'Admin Panel', delay: 'stagger-5' }]
                      : []),
                    { href: '/settings', label: 'Settings', delay: 'stagger-6' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`animate-fade-in-up ${link.delay} block px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300`}
                      style={{ color: 'var(--text-secondary)', opacity: 0 }}
                      onClick={() => setShowMobileMenu(false)}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-overlay)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <button
                    onClick={handleLogout}
                    className="animate-fade-in-up stagger-7 block w-full text-left px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300"
                    style={{ color: 'var(--accent)', opacity: 0 }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
