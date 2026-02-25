'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

interface UserProfile {
    id: string;
    name: string;
    username: string;
    photoUrl: string;
    bio: string;
    favoriteGenre?: string;
    isFollowing: boolean;
    isFollower: boolean;
    isMutual: boolean;
    stats: {
        followers: number;
        following: number;
        booksRead: number;
    };
    readlist: any[];
    subscription?: {
        status: string;
        planName: string;
    } | null;
    createdAt?: string;
    readingGoal?: number;
}

export default function UserProfilePage() {
    const params = useParams();
    const pathname = usePathname();
    const router = useRouter();
    const { user: currentUser } = useAuth();

    // Robust username extraction
    const rawUsername = params?.username as string;
    const pathSegments = pathname.split('/');
    const usernameFromPath = pathSegments[pathSegments.length - 1];
    const username = rawUsername || (usernameFromPath !== 'user' ? usernameFromPath : null);

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [followLoading, setFollowLoading] = useState(false);
    const [followError, setFollowError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'reading' | 'completed' | 'wantToRead'>('all');

    // Social Modal State
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [socialList, setSocialList] = useState<any[]>([]);
    const [loadingSocial, setLoadingSocial] = useState(false);

    const fetchProfile = async () => {
        if (!username || username === 'undefined') return;

        console.log(`Fetching profile for: "${username}" (extracted from path: "${usernameFromPath}", params: "${rawUsername}")`);

        setLoading(true);
        setError(null);
        try {
            const token = await currentUser?.getIdToken();
            const response = await fetch(`/api/users/${username}/profile`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            } else if (response.status === 404) {
                router.push('/404');
            } else {
                const errorData = await response.json().catch(() => ({}));
                setError(errorData.error || `Failed to load profile (${response.status})`);
            }
        } catch (error: any) {
            console.error('Error fetching profile:', error);
            setError(error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (username && username !== 'undefined') {
            fetchProfile();
        } else if (!loading) {
            // If username is truly missing after load
            setLoading(false);
            if (!username) setError('User not specified in URL');
        }
    }, [username, currentUser]);

    const handleToggleFollow = async () => {
        if (!currentUser) {
            router.push('/login');
            return;
        }

        if (!profile) return;

        setFollowLoading(true);
        setFollowError(null);

        try {
            const token = await currentUser.getIdToken();
            const response = await fetch('/api/users/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ followingId: profile.id }),
            });

            if (response.ok) {
                const data = await response.json();

                // data.status: 'followed' | 'mutual' | 'unfollowed'
                const isFollowing = data.status === 'followed' || data.status === 'mutual';
                const isMutual = data.status === 'mutual';

                setProfile((prev) =>
                    prev ? {
                        ...prev,
                        isFollowing,
                        isMutual,
                        stats: {
                            ...prev.stats,
                            followers: isFollowing
                                ? (prev.isFollowing ? prev.stats.followers : prev.stats.followers + 1)
                                : (prev.isFollowing ? prev.stats.followers - 1 : prev.stats.followers)
                        }
                    } : null
                );
            } else {
                const errorData = await response.json().catch(() => ({}));
                setFollowError(errorData.error || 'Failed to update follow status');
            }
        } catch (error: any) {
            setFollowError('An unexpected error occurred');
        } finally {
            setFollowLoading(false);
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

    const filteredItems = profile?.readlist.filter(item => {
        if (activeTab === 'reading') return item.status === 'READING';
        if (activeTab === 'completed') return item.status === 'FINISHED';
        if (activeTab === 'wantToRead') return item.status === 'WANT_TO_READ';
        return true;
    }) || [];

    const completedCount = profile?.readlist.filter(item => item.status === 'FINISHED').length || 0;
    const yearGoal = profile?.readingGoal || 25;
    const joinDate = profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';

    const openSocialModal = (type: 'followers' | 'following') => {
        if (type === 'followers') setShowFollowersModal(true);
        else setShowFollowingModal(true);
        fetchSocialUsers(type);
    };

    const fetchSocialUsers = async (type: 'followers' | 'following') => {
        setSocialList([]);
        setLoadingSocial(true);
        try {
            const token = await currentUser?.getIdToken();
            const response = await fetch(`/api/users/${username}/${type}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });
            if (response.ok) {
                const data = await response.json();
                setSocialList(data);
            }
        } catch (err) {
            console.error(`Error fetching ${type}:`, err);
        } finally {
            setLoadingSocial(false);
        }
    };

    const handleListToggleFollow = async (userId: string) => {
        if (!currentUser) {
            router.push('/login');
            return;
        }

        try {
            const token = await currentUser.getIdToken();
            const response = await fetch('/api/users/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ followingId: userId }),
            });

            if (response.ok) {
                const data = await response.json();
                const isFollowing = data.status === 'followed' || data.status === 'mutual';
                const isMutual = data.status === 'mutual';

                setSocialList(prev => prev.map(u =>
                    u.id === userId ? { ...u, isFollowing, isMutual } : u
                ));

                // Stats are updated in the profile state automatically when someone follows/unfollows
                // which is handled in handleToggleFollow. 
                // In a list, we might want to refresh profile stats if we are viewing the current profile's social lists.
                if (profile && (showFollowersModal || showFollowingModal)) {
                    // Update profile stats if needed
                }
            }
        } catch (err) {
            console.error('Error toggling follow in list:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="flex flex-col items-center gap-6">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-transparent shadow-2xl"
                        style={{ borderColor: 'var(--accent) transparent var(--accent) transparent' }}></div>
                    <p className="font-bold tracking-widest uppercase text-xs opacity-50 animate-pulse" style={{ color: 'var(--text-secondary)' }}>
                        Invoking Profile...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="max-w-md w-full rounded-3xl p-10 shadow-2xl border text-center animate-fade-in"
                    style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full mb-6"
                        style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)' }}>
                        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>Oops! Lost in the Stacks</h2>
                    <p className="text-sm opacity-60 mb-8 leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
                        {error}
                    </p>
                    <button
                        onClick={fetchProfile}
                        className="w-full py-4 text-white rounded-2xl font-bold transition-all shadow-xl hover:scale-105"
                        style={{ backgroundColor: 'var(--accent)', boxShadow: '0 20px 40px -10px var(--accent-glow)' }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) return null;

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
                                    {profile.photoUrl ? (
                                        <img src={profile.photoUrl} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        getInitials(profile.name || profile.username || '')
                                    )}
                                </div>
                            </div>

                            {profile.subscription?.status === 'ACTIVE' && (
                                <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full shadow-lg border-2 border-[#13131a]"
                                    style={{ backgroundColor: 'var(--accent)' }} title="Premium Member">
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
                                    {profile.name || 'Reader'}
                                </h1>
                                <div className="flex justify-center md:justify-start gap-2">
                                    {currentUser?.dbId === profile.id ? (
                                        <Link href="/settings?tab=profile"
                                            className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border flex items-center gap-2 hover:scale-105"
                                            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            Settings
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleToggleFollow}
                                            disabled={followLoading}
                                            className="px-8 py-2 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:scale-105 disabled:opacity-50"
                                            style={profile.isFollowing ? {
                                                backgroundColor: 'var(--bg-elevated)',
                                                border: '1px solid var(--border)',
                                                color: 'var(--text-secondary)'
                                            } : {
                                                backgroundColor: 'var(--accent)',
                                                color: 'white',
                                                boxShadow: '0 10px 20px -5px var(--accent-glow)'
                                            }}
                                        >
                                            {followLoading ? (
                                                <div className="h-4 w-4 animate-spin border-2 border-t-transparent rounded-full mx-auto" style={{ borderColor: 'currentColor transparent currentColor transparent' }}></div>
                                            ) : profile.isFollowing ? (
                                                profile.isMutual ? 'Mutual' : 'Following'
                                            ) : (
                                                'Follow'
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-y-2 gap-x-6 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                                {profile.username && (<span>@{profile.username}</span>)}
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Joined {joinDate}
                                </span>
                            </div>

                            <p className="text-base leading-relaxed max-w-xl mx-auto md:mx-0" style={{ color: 'var(--text-secondary)' }}>
                                {profile.bio || 'This reader is currently keeping their reading journey a mystery.'}
                            </p>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-3 divide-x border-t py-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--border)' }}>
                        <div className="text-center group cursor-pointer transition-colors hover:bg-white/5">
                            <span className="block text-2xl font-bold font-display group-hover:scale-110 transition-transform" style={{ color: 'var(--text-primary)' }}>
                                {profile.stats.booksRead || completedCount}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--text-secondary)' }}>Books Read</span>
                        </div>
                        <div className="text-center group cursor-pointer transition-colors hover:bg-white/5" onClick={() => openSocialModal('followers')}>
                            <span className="block text-2xl font-bold font-display group-hover:scale-110 transition-transform" style={{ color: 'var(--text-primary)' }}>
                                {profile.stats.followers}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--text-secondary)' }}>Followers</span>
                        </div>
                        <div className="text-center group cursor-pointer transition-colors hover:bg-white/5" onClick={() => openSocialModal('following')}>
                            <span className="block text-2xl font-bold font-display group-hover:scale-110 transition-transform" style={{ color: 'var(--text-primary)' }}>
                                {profile.stats.following}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: 'var(--text-secondary)' }}>Following</span>
                        </div>
                    </div>
                </div>

                {/* ═══ Library Section ═══ */}
                <div className="mt-16">
                    <div className="flex items-center gap-8 mb-10 overflow-x-auto pb-4 px-2 scrollbar-hide">
                        {[
                            { id: 'all', label: 'All Books', count: profile.readlist.length },
                            { id: 'reading', label: 'Currently Reading', count: profile.readlist.filter(i => i.status === 'READING').length },
                            { id: 'completed', label: 'Finished', count: completedCount },
                            { id: 'wantToRead', label: 'Readlist', count: profile.readlist.filter(i => i.status === 'WANT_TO_READ').length }
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

                    {/* Books Grid */}
                    {filteredItems.length === 0 ? (
                        <div className="rounded-3xl p-16 text-center border-2 border-dashed animate-fade-in"
                            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                            <div className="mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                <svg className="h-10 w-10 opacity-20" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Shelf is empty</h3>
                            <p className="text-sm opacity-60 max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>This reader hasn't added any books to this section yet.</p>
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
                                    <div className="relative aspect-[3/4.5] w-full overflow-hidden rounded-2xl shadow-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-rose-900/20"
                                        style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                        <img
                                            src={item.ebook.coverUrl || '/placeholder-book.jpg'}
                                            alt={item.ebook.title}
                                            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                        <div className="absolute top-2 right-2 pointer-events-none">
                                            {item.status === 'FINISHED' ? (
                                                <span className="p-1.5 rounded-lg backdrop-blur-md shadow-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(16, 185, 129, 0.9)' }}>
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                </span>
                                            ) : item.status === 'READING' ? (
                                                <span className="p-1.5 rounded-lg backdrop-blur-md shadow-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(59, 130, 246, 0.9)' }}>
                                                    <svg className="w-3 h-3 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="pt-4 flex-1">
                                        <h3 className="text-sm font-bold font-display line-clamp-1 mb-1 transition-colors group-hover:text-[var(--accent)]" style={{ color: 'var(--text-primary)' }}>
                                            {item.ebook.title}
                                        </h3>
                                        <p className="text-[11px] font-medium opacity-50 truncate" style={{ color: 'var(--text-secondary)' }}>{item.ebook.author}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ Social Modals ═══ */}
            {(showFollowersModal || showFollowingModal) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <div className="absolute inset-0" onClick={() => { setShowFollowersModal(false); setShowFollowingModal(false); }}></div>
                    <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border animate-scale-up"
                        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                        <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                            <h2 className="text-xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                                {showFollowersModal ? 'Followers' : 'Following'}
                            </h2>
                            <button onClick={() => { setShowFollowersModal(false); setShowFollowingModal(false); }} className="p-2 rounded-full hover:bg-white/10 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                            {loadingSocial ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent mb-4" style={{ borderColor: 'var(--accent) transparent var(--accent) transparent' }}></div>
                                    <p className="text-xs font-bold uppercase tracking-widest opacity-40">Collecting Data...</p>
                                </div>
                            ) : socialList.length === 0 ? (
                                <div className="py-20 text-center opacity-40">
                                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    <p className="font-bold">No data found</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {socialList.map((u) => (
                                        <div key={u.id} className="flex items-center gap-4 p-3 rounded-2xl transition-all border border-transparent hover:border-white/5 hover:bg-white/5 group">
                                            <Link href={`/user/${u.username || u.id}`} className="h-12 w-12 rounded-full overflow-hidden bg-[#13131a] border border-white/10 flex items-center justify-center font-bold text-lg">
                                                {u.photoUrl ? <img src={u.photoUrl} alt={u.name} className="h-full w-full object-cover" /> : getInitials(u.name || u.username || '')}
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/user/${u.username || u.id}`} className="block">
                                                    <h3 className="font-bold truncate group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-primary)' }}>{u.name || u.username}</h3>
                                                    <p className="text-xs opacity-50 truncate" style={{ color: 'var(--text-secondary)' }}>@{u.username}</p>
                                                </Link>
                                            </div>
                                            {currentUser?.dbId !== u.id && (
                                                <button
                                                    onClick={() => handleListToggleFollow(u.id)}
                                                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${u.isFollowing ? 'bg-white/5 text-[var(--text-secondary)] border border-white/10' : 'bg-[var(--accent)] text-white shadow-lg shadow-rose-900/20'}`}
                                                >
                                                    {u.isFollowing ? (u.isMutual ? 'Mutual' : 'Following') : 'Follow'}
                                                </button>
                                            )}
                                        </div>
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

function getInitials(name: string) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}
