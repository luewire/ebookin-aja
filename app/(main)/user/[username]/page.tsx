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

    const [view, setView] = useState<'profile' | 'followers' | 'following'>('profile');
    const [socialUsers, setSocialUsers] = useState<any[]>([]);
    const [socialLoading, setSocialLoading] = useState(false);

    const fetchSocialUsers = async (type: 'followers' | 'following') => {
        setSocialLoading(true);
        try {
            const token = await currentUser?.getIdToken();
            const response = await fetch(`/api/users/${username}/${type}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            });
            if (response.ok) {
                const data = await response.json();
                setSocialUsers(data);
            }
        } catch (err) {
            console.error(`Error fetching ${type}:`, err);
        } finally {
            setSocialLoading(false);
        }
    };

    const handleViewChange = (newView: 'profile' | 'followers' | 'following') => {
        setView(newView);
        if (newView !== 'profile') {
            fetchSocialUsers(newView);
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

                setSocialUsers(prev => prev.map(u =>
                    u.id === userId ? { ...u, isFollowing, isMutual } : u
                ));

                // Also update profile stats if viewing followers/following of currently viewing profile
                if (profile && (view === 'followers' || view === 'following')) {
                    // This is subtle - we only increment/decrement if the user being updated is NOT the profile itself
                    // But in a list, we are toggling follow on OTHER users.
                }
            }
        } catch (err) {
            console.error('Error toggling follow in list:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-lg"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">
                <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-xl border border-red-50 dark:border-red-900/20 text-center animate-fade-in">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-6">
                        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-3 tracking-tight">Oops! Something went wrong</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed italic">
                        {error}
                    </p>
                    <button
                        onClick={fetchProfile}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-95"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Breadcrumb if in list view */}
            {view !== 'profile' && (
                <button
                    onClick={() => setView('profile')}
                    className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                >
                    <svg className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Profile
                </button>
            )}

            {view === 'profile' ? (
                <>
                    {/* Profile Header */}
                    <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <div className="relative">
                                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-xl overflow-hidden">
                                    {profile.photoUrl ? (
                                        <img src={profile.photoUrl} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        getInitials(profile.name || profile.username || '')
                                    )}
                                </div>
                                {profile.isMutual && (
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full shadow-lg border-2 border-white dark:border-slate-800">
                                        Friend
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                                            {profile.name || 'Reader'}
                                            {profile.subscription?.status === 'ACTIVE' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm border border-amber-200/50 uppercase tracking-wider">
                                                    Premium
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600 uppercase tracking-wider">
                                                    Free
                                                </span>
                                            )}
                                        </h1>
                                        <p className="text-base text-gray-500 dark:text-gray-400 mt-1.5">@{profile.username}</p>
                                    </div>

                                    {/* Action Button: Edit Profile if own, Follow if others */}
                                    {currentUser?.dbId === profile.id ? (
                                        <Link
                                            href="/settings?tab=profile"
                                            className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors w-fit"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit Profile
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleToggleFollow}
                                            disabled={followLoading}
                                            className={`flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-bold transition-all duration-300 w-fit ${profile.isFollowing
                                                ? 'bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-600 shadow-sm'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                                }`}
                                        >
                                            {followLoading ? (
                                                <div className="h-4 w-4 animate-spin border-2 border-t-transparent rounded-full mx-auto"></div>
                                            ) : profile.isFollowing ? (
                                                profile.isMutual ? 'Friend' : 'Following'
                                            ) : (
                                                'Follow'
                                            )}
                                        </button>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                                    {profile.bio || (currentUser?.dbId === profile.id ? 'No bio yet. Click Edit Profile to add one!' : 'This reader is currently keeping their reading journey a mystery.')}
                                </p>

                                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mt-4">
                                    <div className="flex items-center gap-2">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>Joined {joinDate}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                            {new Date().getFullYear()} Goal: {completedCount} of {yearGoal} books
                                        </span>
                                        <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(100, (completedCount / yearGoal) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Social Stats Row */}
                                <div className="flex gap-8 mt-6 pt-6 border-t border-gray-100 dark:border-slate-700">
                                    <button
                                        onClick={() => handleViewChange('followers')}
                                        className="text-left group"
                                    >
                                        <span className="block text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors leading-none">{profile.stats.followers}</span>
                                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Followers</span>
                                    </button>
                                    <button
                                        onClick={() => handleViewChange('following')}
                                        className="text-left group"
                                    >
                                        <span className="block text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors leading-none">{profile.stats.following}</span>
                                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Following</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Library Section */}
                        <div className="mt-10">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Reading Library</h2>

                            {/* Tabs */}
                            <div className="flex items-center gap-6 border-b border-gray-200 dark:border-slate-700 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
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
                                <div className="rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-dashed border-gray-200 dark:border-slate-700 p-12 text-center">
                                    <div className="mb-4 text-4xl">📚</div>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {activeTab === 'reading'
                                            ? 'No books in progress'
                                            : activeTab === 'completed'
                                                ? 'No completed books yet'
                                                : activeTab === 'wantToRead'
                                                    ? 'No books in your Want to read list'
                                                    : 'No books here yet'}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Keep exploring to build this collection!
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                                    {filteredItems.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/ebooks/${item.ebookId}`}
                                            className="group"
                                        >
                                            <div className="mb-3 aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-slate-700 shadow-sm group-hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-slate-600">
                                                <img
                                                    src={item.ebook.coverUrl || '/placeholder-book.jpg'}
                                                    alt={item.ebook.title}
                                                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                {item.ebook.title}
                                            </h3>
                                            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.ebook.author}</p>

                                            {/* Status Badge */}
                                            <div className="mb-2">
                                                {item.status === 'FINISHED' ? (
                                                    <span className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-[9px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">
                                                        COMPLETED
                                                    </span>
                                                ) : item.status === 'READING' ? (
                                                    <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-[9px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                                                        READING
                                                    </span>
                                                ) : (
                                                    <span className="inline-block rounded-full bg-gray-100 dark:bg-slate-700 px-2 py-0.5 text-[9px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
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
                </>
            ) : (
                /* Followers / Following List View */
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 min-h-[400px]">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                        {view === 'followers' ? 'Followers' : 'Following'}
                        <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                            {view === 'followers' ? profile.stats.followers : profile.stats.following}
                        </span>
                    </h2>

                    {socialLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="h-10 w-10 animate-spin border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading {view}...</p>
                        </div>
                    ) : socialUsers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="h-20 w-20 bg-gray-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-4 text-3xl">
                                {view === 'followers' ? '👥' : '🚶'}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {view === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                                {view === 'followers' ? 'When people follow this reader, they will appear here.' : 'When this reader follows people, they will appear here.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {socialUsers.map((u) => (
                                <div key={u.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-blue-100 dark:hover:border-blue-900/30 hover:bg-blue-50/10 dark:hover:bg-blue-900/5 transition-all group">
                                    <Link href={`/user/${u.username || u.id}`} className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                                        {u.photoUrl ? (
                                            <img src={u.photoUrl} alt={u.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span>{u.name?.[0] || u.username?.[0] || 'U'}</span>
                                        )}
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/user/${u.username || u.id}`} className="block truncate">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 transition-colors">
                                                    {u.name || 'Reader'}
                                                </h3>
                                                {u.isMutual && (
                                                    <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Friend</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">@{u.username}</p>
                                        </Link>
                                        {u.bio && <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-1 italic">"{u.bio}"</p>}
                                    </div>
                                    {currentUser?.dbId !== u.id && (
                                        <button
                                            onClick={() => handleListToggleFollow(u.id)}
                                            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${u.isFollowing
                                                ? 'bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-600'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                                }`}
                                        >
                                            {u.isFollowing ? (u.isMutual ? 'Friend' : 'Following') : 'Follow'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );

}
