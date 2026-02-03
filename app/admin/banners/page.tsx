'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/lib/firebase';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  ctaLabel: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
  priority: number;
  isActive: boolean;
  createdAt: string;
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
    ctaLabel: '',
    ctaLink: '',
    imageUrl: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const getAuthToken = async () => {
    if (!user) return null;
    return await auth.currentUser?.getIdToken();
  };

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
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/api/admin/banners', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }

      const data = await response.json();
      setBanners(data.banners || []);
    } catch (error: any) {
      console.error('Error fetching banners:', error);
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

    // Update priority positions (higher number = higher priority)
    const updatedBanners = newBanners.map((b, i) => ({ ...b, priority: newBanners.length - i }));
    setBanners(updatedBanners);

    // Update in database
    try {
      const token = await getAuthToken();
      if (!token) return;

      // Update each banner's priority
      for (const banner of updatedBanners) {
        await fetch('/api/admin/banners', {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: banner.id,
            priority: banner.priority
          })
        });
      }
    } catch (error) {
      console.error('Error updating banner order:', error);
      fetchBanners(); // Revert on error
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/api/admin/banners', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          isActive: !currentStatus
        })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle banner status');
      }

      fetchBanners();
    } catch (error: any) {
      console.error('Error toggling banner status:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/api/admin/banners?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete banner');
      }

      fetchBanners();
    } catch (error: any) {
      console.error('Error deleting banner:', error);
      alert('Error: ' + error.message);
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
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setUploadingImage(true);
    setUploadError('');

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
      setUploadError('✓ Image uploaded successfully!');
      setTimeout(() => setUploadError(''), 3000);
    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadError(error.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const payload = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        ctaLabel: formData.ctaLabel || null,
        ctaLink: formData.ctaLink || null,
        imageUrl: formData.imageUrl || null,
      };

      if (editingBanner) {
        // Update existing banner
        const response = await fetch('/api/admin/banners', {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: editingBanner.id,
            ...payload
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update banner');
        }
      } else {
        // Create new banner
        const maxPriority = banners.length > 0 ? Math.max(...banners.map(b => b.priority)) : 0;
        const response = await fetch('/api/admin/banners', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...payload,
            priority: maxPriority + 1,
            isActive: true
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create banner');
        }
      }

      setShowModal(false);
      setEditingBanner(null);
      setFormData({ title: '', subtitle: '', ctaLabel: '', ctaLink: '', imageUrl: '' });
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
      subtitle: banner.subtitle || '',
      ctaLabel: banner.ctaLabel || '',
      ctaLink: banner.ctaLink || '',
      imageUrl: banner.imageUrl || '',
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({ title: '', subtitle: '', ctaLabel: '', ctaLink: '', imageUrl: '' });
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
    <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

        {/* Banners List - no setupError needed anymore */}
        <div className="space-y-4">
          {banners.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-slate-600 dark:text-slate-400 mb-4">No banners yet. Create your first banner to get started.</p>
              <button 
                onClick={openCreateModal}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                Create First Banner
              </button>
            </div>
          ) : (
            banners.map((banner) => (
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

                  {/* Banner Preview Image */}
                  {banner.imageUrl && (
                    <div className="w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Banner Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{banner.title}</h3>
                          <button
                            onClick={() => handleToggleActive(banner.id, banner.isActive)}
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              banner.isActive
                                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </div>
                        {banner.subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{banner.subtitle}</p>}
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

                    {banner.ctaLabel && banner.ctaLink && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{banner.ctaLabel}</span>
                        </div>
                        <span className="text-slate-400">→</span>
                        <span className="text-indigo-600 dark:text-indigo-400">{banner.ctaLink}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
    </div>
  );
}

