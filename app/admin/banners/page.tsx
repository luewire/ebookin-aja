'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta_label: string;
  cta_link: string;
  image_url: string;
  order_position: number;
  is_active: boolean;
  created_at: string;
}

export default function ManageBannersPage() {
  const { user, loading: authLoading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    cta_label: '',
    cta_link: '',
    image_url: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [setupError, setSetupError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.email !== 'admin@admin.com') {
        router.push('/unauthorized');
      } else {
        fetchBanners();
      }
    }
  }, [user, authLoading]);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('order_position', { ascending: true });

      if (error) {
        // Check if table doesn't exist
        if (error.code === '42P01' || error.code === 'PGRST205' || error.message?.includes('does not exist') || error.message?.includes('schema cache')) {
          console.warn('Banners table not found. Please run database/banners_table.sql in Supabase.');
          setSetupError(true);
          setBanners([]);
        } else {
          throw error;
        }
      } else {
        setSetupError(false);
        setBanners(data || []);
      }
    } catch (error: any) {
      console.error('Error fetching banners:', error);

      // Handle the case where the error is an HTML response causing JSON parse to fail
      if (error.message?.includes('Unexpected token') && error.message?.includes('<')) {
        setSetupError(true);
      } else {
        setSetupError(true);
      }
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = async (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId === null || draggedId === id) return;

    const newBanners = [...banners];
    const draggedIndex = newBanners.findIndex(b => b.id === draggedId);
    const targetIndex = newBanners.findIndex(b => b.id === id);

    const [removed] = newBanners.splice(draggedIndex, 1);
    newBanners.splice(targetIndex, 0, removed);

    // Update order positions
    const updatedBanners = newBanners.map((b, i) => ({ ...b, order_position: i + 1 }));
    setBanners(updatedBanners);

    // Update in database
    try {
      for (const banner of updatedBanners) {
        await supabase
          .from('banners')
          .update({ order_position: banner.order_position })
          .eq('id', banner.id);
      }
    } catch (error) {
      console.error('Error updating banner order:', error);
      fetchBanners(); // Revert on error
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchBanners();
    } catch (error: any) {
      console.error('Error toggling banner status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchBanners();
    } catch (error: any) {
      console.error('Error deleting banner:', error);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error
    setUploadError('');

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      setUploadError('File size must be less than 2MB');
      e.target.value = '';
      return;
    }

    // Check file type - recommend .webp
    const allowedTypes = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please use WebP, JPEG, JPG, or PNG format');
      e.target.value = '';
      return;
    }

    // Show warning if not .webp
    if (file.type !== 'image/webp') {
      setUploadError('⚠️ For better performance, we recommend using .webp format');
    }

    setSelectedFile(file);
    await uploadImageToSupabase(file);
  };

  const uploadImageToSupabase = async (file: File) => {
    setUploadingImage(true);
    setUploadError('');

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `banner-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      console.log('🔄 Uploading to bucket: images');
      console.log('📁 File path:', filePath);
      console.log('📦 File size:', file.size, 'bytes');
      console.log('🏷️  File type:', file.type);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Upload error:', error);
        
        // Provide more specific error messages
        if (error.message.includes('not found') || error.message.includes('Bucket not found')) {
          throw new Error('Storage bucket "images" not found. Please create it in Supabase Dashboard (Storage → New Bucket → name: "images", Public: ✅)');
        } else if (error.message.includes('policy') || error.message.includes('permission')) {
          throw new Error('Permission denied. Make sure RLS policies are configured (run database/storage_bucket.sql)');
        } else if (error.message.includes('size')) {
          throw new Error('File too large. Maximum size is 2MB.');
        }
        throw error;
      }

      console.log('✅ Upload successful:', data);

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      console.log('🔗 Public URL:', publicUrl);

      // Update form data with image URL
      setFormData({ ...formData, image_url: publicUrl });
      setUploadError('');
      setSelectedFile(null);

      // Show success message briefly
      const successMsg = '✓ Image uploaded successfully!';
      setUploadError(successMsg);
      setTimeout(() => {
        setUploadError('');
      }, 3000);
    } catch (error: any) {
      console.error('💥 Upload failed:', error);

      let message = error.message || 'Failed to upload image.';

      // Handle the "Unexpected token <" error which means HTML was returned instead of JSON
      if (message.includes('Unexpected token') && message.includes('<')) {
        message = '🚨 Storage Error: Got HTML instead of JSON. This means:\n' +
                 '1. Bucket "images" doesn\'t exist → Create it in Dashboard\n' +
                 '2. Bucket exists but not public → Enable "Public bucket"\n' +
                 '3. RLS policies missing → Run database/storage_bucket.sql\n' +
                 '4. Wrong Supabase URL/Key → Check .env.local';
      }

      setUploadError(message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBanner) {
        // Update existing banner
        const { error } = await supabase
          .from('banners')
          .update({
            title: formData.title,
            subtitle: formData.subtitle,
            cta_label: formData.cta_label,
            cta_link: formData.cta_link,
            image_url: formData.image_url,
          })
          .eq('id', editingBanner.id);

        if (error) throw error;
      } else {
        // Create new banner
        const maxOrder = banners.length > 0 ? Math.max(...banners.map(b => b.order_position)) : 0;
        const { error } = await supabase
          .from('banners')
          .insert([{
            ...formData,
            order_position: maxOrder + 1,
            is_active: true,
          }]);

        if (error) throw error;
      }

      setShowModal(false);
      setEditingBanner(null);
      setFormData({ title: '', subtitle: '', cta_label: '', cta_link: '', image_url: '' });
      fetchBanners();
    } catch (error: any) {
      console.error('Error saving banner:', error);
      alert('Error saving banner: ' + error.message);
    }
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      cta_label: banner.cta_label,
      cta_link: banner.cta_link,
      image_url: banner.image_url,
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({ title: '', subtitle: '', cta_label: '', cta_link: '', image_url: '' });
    setSelectedFile(null);
    setUploadError('');
    setShowModal(true);
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="Ebookin Logo" width={32} height={32} className="h-8 w-8 invert dark:invert-0 transition-all" priority />
                <span className="font-bold text-xl tracking-tight">Ebookin</span>
              </Link>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">Admin Panel</span>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-sm font-medium text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {darkMode ? (
                  <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <div className="pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-200 text-sm font-semibold text-orange-700 border border-slate-200 dark:border-slate-700">
                  A
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/admin" className="hover:text-indigo-600">ADMIN</Link>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-900 dark:text-white font-medium">MANAGE HERO BANNERS</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Manage Hero Banners</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Configure and organize the hero banners displayed on your homepage.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview Site
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Publish Changes
            </button>
          </div>
        </div>

        {/* Database Setup Warning */}
        {setupError && (
          <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-1">Database Setup Required</h3>
                <p className="text-sm text-amber-800 dark:text-amber-300 mb-3">
                  The banners table hasn't been created yet. Follow these steps:
                </p>
                <ol className="text-sm text-amber-800 dark:text-amber-300 space-y-1 ml-4 list-decimal">
                  <li>Open your Supabase project dashboard</li>
                  <li>Go to <span className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">SQL Editor</span></li>
                  <li>Execute the SQL in <span className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">database/banners_table.sql</span></li>
                  <li>Execute the SQL in <span className="font-mono bg-amber-100 dark:bg-amber-900/40 px-1 rounded">database/storage_bucket.sql</span></li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Active Banners */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Active Banners</h2>
              <span className="text-sm text-slate-500 dark:text-slate-400">Drag to reorder</span>
            </div>

            {banners.map((banner) => (
              <div
                key={banner.id}
                draggable
                onDragStart={() => handleDragStart(banner.id)}
                onDragOver={(e) => handleDragOver(e, banner.id)}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-lg transition-shadow cursor-move"
              >
                <div className="flex items-start gap-4">
                  {/* Drag Handle */}
                  <div className="flex flex-col gap-1 pt-1 text-slate-400">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="8" cy="6" r="1.5" />
                      <circle cx="16" cy="6" r="1.5" />
                      <circle cx="8" cy="12" r="1.5" />
                      <circle cx="16" cy="12" r="1.5" />
                      <circle cx="8" cy="18" r="1.5" />
                      <circle cx="16" cy="18" r="1.5" />
                    </svg>
                  </div>

                  {/* Banner Preview */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{banner.title}</h3>
                          <button
                            onClick={() => handleToggleActive(banner.id, banner.is_active)}
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${banner.is_active
                              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}
                          >
                            {banner.is_active ? 'Active' : 'Inactive'}
                          </button>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{banner.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(banner)}
                          className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{banner.cta_label}</span>
                      </div>
                      <span className="text-slate-400">→</span>
                      <span className="text-indigo-600 dark:text-indigo-400">{banner.cta_link}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Upload New Banner Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Upload New Banner</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Banner Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Enter title..."
                    className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Enter subtitle..."
                    className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      CTA Label
                    </label>
                    <input
                      type="text"
                      value={formData.cta_label}
                      onChange={(e) => setFormData({ ...formData, cta_label: e.target.value })}
                      required
                      placeholder="e.g., Learn More"
                      className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      CTA Link
                    </label>
                    <input
                      type="text"
                      value={formData.cta_link}
                      onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                      required
                      placeholder="/page"
                      className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Banner Image *
                  </label>

                  {/* File Upload Area */}
                  <div className="relative">
                    <input
                      type="file"
                      id="banner-upload"
                      accept="image/webp,image/jpeg,image/jpg,image/png"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="banner-upload"
                      className={`block border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${uploadingImage
                        ? 'border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600'
                        }`}
                    >
                      {uploadingImage ? (
                        <div className="flex flex-col items-center">
                          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-indigo-600 mb-3"></div>
                          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Uploading...</p>
                        </div>
                      ) : formData.image_url ? (
                        <div className="flex flex-col items-center">
                          <div className="mb-3 relative w-full h-32 rounded-lg overflow-hidden">
                            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">✓ Image uploaded</p>
                          <p className="text-xs text-slate-500">Click to change image</p>
                        </div>
                      ) : (
                        <>
                          <svg className="mx-auto h-12 w-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">
                            WebP recommended, max 2MB
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-600">
                            (1920x600px recommended)
                          </p>
                        </>
                      )}
                    </label>
                  </div>

                  {/* Upload Error/Success Message */}
                  {uploadError && (
                    <div className={`mt-3 p-3 rounded-lg ${uploadError.includes('✓')
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                      : uploadError.includes('⚠️')
                        ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                      }`}>
                      <p className={`text-sm ${uploadError.includes('✓')
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : uploadError.includes('⚠️')
                          ? 'text-amber-700 dark:text-amber-300'
                          : 'text-red-700 dark:text-red-300'
                        }`}>
                        {uploadError}
                      </p>
                      {(uploadError.includes('Storage bucket') || uploadError.includes('storage_bucket.sql')) && (
                        <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                          <p className="font-semibold mb-1">Quick Fix:</p>
                          <ol className="list-decimal ml-4 space-y-0.5">
                            <li>Open Supabase Dashboard → SQL Editor</li>
                            <li>Run: <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">database/storage_bucket.sql</code></li>
                            <li>Try uploading again</li>
                          </ol>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Or manual URL input */}
                  <div className="mt-3">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">Or paste URL</span>
                      </div>
                    </div>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.webp"
                      className="mt-3 w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingBanner ? 'Update Banner' : 'Add Banner'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
