'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { showModernConfirm, showModernToast } from '@/lib/modern-feedback';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  ctaLabel: string | null;
  ctaLink: string | null;
  imageUrl: string | null;
  imagePosition: number;
  priority: number;
  isActive: boolean;
}

export default function ManageBannersPage() {
  const { user, loading: authLoading } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePosition, setImagePosition] = useState(50);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    ctaLabel: '',
    ctaLink: '',
  });
  const router = useRouter();

  const getAuthToken = async () => {
    if (!user) return null;
    return await auth.currentUser?.getIdToken();
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
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
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as { error?: string }).error || 'Failed to fetch banners');
      }
      const data = await response.json();
      setBanners(data.banners || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadMessage('');

    // Validate size
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setUploadMessage(`❌ File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max 2MB allowed.`);
      e.target.value = '';
      return;
    }

    // Validate type
    const allowedTypes = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setUploadMessage('❌ Invalid format. Use WebP, JPEG, or PNG');
      e.target.value = '';
      return;
    }

    // Show info
    const sizeKB = (file.size / 1024).toFixed(0);
    const format = file.type.split('/')[1].toUpperCase();
    if (file.type === 'image/webp') {
      setUploadMessage(`✅ ${sizeKB}KB - ${format} format (optimal!)`);
    } else {
      setUploadMessage(`ℹ️ ${sizeKB}KB - ${format} format. WebP recommended for better compression.`);
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setUploadMessage('❌ Title is required');
      return;
    }

    setUploading(true);
    setUploadMessage('');

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      if (formData.subtitle) formDataToSend.append('subtitle', formData.subtitle);
      if (formData.ctaLabel) formDataToSend.append('ctaLabel', formData.ctaLabel);
      if (formData.ctaLink) formDataToSend.append('ctaLink', formData.ctaLink);
      if (selectedFile) formDataToSend.append('image', selectedFile);
      formDataToSend.append('imagePosition', imagePosition.toString());

      if (editingBanner) {
        formDataToSend.append('id', editingBanner.id);
        const response = await fetch('/api/admin/banners', {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formDataToSend
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.details || error.error || 'Failed to update');
        }
      } else {
        formDataToSend.append('isActive', 'true');
        const response = await fetch('/api/admin/banners', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formDataToSend
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.details || error.error || 'Failed to create');
        }
      }

      setShowModal(false);
      setEditingBanner(null);
      setFormData({ title: '', subtitle: '', ctaLabel: '', ctaLink: '' });
      setSelectedFile(null);
      setImagePosition(50);
      setUploadMessage('');
      fetchBanners();
    } catch (error: any) {
      setUploadMessage('❌ ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showModernConfirm({
      title: 'Delete banner?',
      message: 'This banner will be deleted permanently.',
      confirmText: 'Delete Banner',
      cancelText: 'Cancel',
      danger: true,
    });
    if (!confirmed) return;

    try {
      const token = await getAuthToken();
      await fetch(`/api/admin/banners?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchBanners();
      showModernToast('Banner deleted', 'success');
    } catch (error) {
      showModernToast('Failed to delete banner', 'error');
    }
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setFormData({ title: '', subtitle: '', ctaLabel: '', ctaLink: '' });
    setSelectedFile(null);
    setImagePosition(50);
    setUploadMessage('');
    setShowModal(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      ctaLabel: banner.ctaLabel || '',
      ctaLink: banner.ctaLink || '',
    });
    setSelectedFile(null);
    setImagePosition(banner.imagePosition || 50);
    setUploadMessage('');
    setShowModal(true);
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center transition-colors duration-300" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--accent)' }}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading banners...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Manage Banners</h1>
            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Upload and manage promotional banners</p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Banner
          </button>
        </div>

        {/* Banners List */}
        <div className="space-y-4">
          {banners.length === 0 ? (
            <div className="rounded-xl border p-12 text-center transition-colors duration-300" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
              <svg className="mx-auto h-16 w-16 mb-4" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>No banners yet</p>
              <button onClick={openCreateModal} className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 font-medium transition-opacity">
                Create First Banner
              </button>
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner.id} className="rounded-xl border p-4 hover:shadow-lg transition-all duration-300" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-start gap-4">
                  {banner.imageUrl && (
                    <img src={banner.imageUrl} alt={banner.title} className="w-32 h-20 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{banner.title}</h3>
                    {banner.subtitle && <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{banner.subtitle}</p>}
                    {banner.ctaLabel && (
                      <div className="mt-2 flex items-center gap-2 text-sm" style={{ color: 'var(--accent)' }}>
                        <span>🔗 {banner.ctaLabel}</span>
                        {banner.ctaLink && <span style={{ color: 'var(--text-secondary)' }}>→ {banner.ctaLink}</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(banner)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(banner.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-surface)' }}>
              <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {editingBanner ? 'Edit Banner' : 'Create Banner'}
                  </h2>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:opacity-75 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Banner Image {editingBanner && '(leave empty to keep current image)'}
                  </label>

                  {selectedFile ? (
                    <div className="rounded-xl overflow-hidden border-2 border-indigo-400" style={{ borderColor: 'var(--accent)' }}>
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                          style={{ objectPosition: `center ${imagePosition}%` }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setUploadMessage('');
                            const input = document.getElementById('banner-upload') as HTMLInputElement;
                            if (input) input.value = '';
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="px-4 py-2 text-xs flex items-center justify-between" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{selectedFile.name}</span>
                        <label htmlFor="banner-upload" className="cursor-pointer font-medium hover:underline" style={{ color: 'var(--accent)' }}>
                          Ganti Gambar
                        </label>
                      </div>
                    </div>
                  ) : editingBanner?.imageUrl ? (
                    <div className="rounded-xl overflow-hidden border-2 border-dashed" style={{ borderColor: 'var(--border)' }}>
                      <img
                        src={editingBanner.imageUrl}
                        alt="Current"
                        className="w-full h-48 object-cover"
                        style={{ objectPosition: `center ${imagePosition}%` }}
                      />
                      <div className="px-4 py-2 text-xs flex items-center justify-between" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Gambar saat ini</span>
                        <label htmlFor="banner-upload" className="cursor-pointer font-medium hover:underline" style={{ color: 'var(--accent)' }}>
                          Ganti Gambar
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
                      <label htmlFor="banner-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                            <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-indigo-600 dark:text-indigo-400 font-medium">Klik untuk pilih gambar banner</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">WebP, JPEG, atau PNG (maks 2MB)</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/webp,image/jpeg,image/jpg,image/png"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="banner-upload"
                  />

                  {/* Image Position Slider */}
                  {(selectedFile || editingBanner?.imageUrl) && (
                    <div className="mt-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          📐 Atur Posisi Gambar
                        </label>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                          {imagePosition === 0 ? 'Atas' : imagePosition === 50 ? 'Tengah' : imagePosition === 100 ? 'Bawah' : `${imagePosition}%`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Atas</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={imagePosition}
                          onChange={(e) => setImagePosition(Number(e.target.value))}
                          className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                          style={{ accentColor: 'var(--accent)' }}
                        />
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Bawah</span>
                      </div>
                      <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>
                        Geser slider untuk mengatur bagian gambar yang terlihat di homepage
                      </p>
                    </div>
                  )}

                  {/* Upload Info */}
                  <div className="mt-3 bg-slate-50 dark:bg-slate-900 rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-slate-600 dark:text-slate-300">
                        <p className="font-medium mb-1">Image Requirements:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• <strong>Format:</strong> WebP (recommended), JPEG, PNG</li>
                          <li>• <strong>Max Size:</strong> 2MB</li>
                          <li>• <strong>Recommended Size:</strong> 1920 x 600 pixels</li>
                          <li>• <strong>Why WebP?</strong> 25-35% smaller file size, better performance</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {uploadMessage && (
                    <div className={`mt-3 p-3 rounded-lg text-sm ${uploadMessage.startsWith('✅') || uploadMessage.startsWith('✓')
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : uploadMessage.startsWith('❌')
                        ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      }`}>
                      {uploadMessage}
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Summer Sale 2026"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Get 50% off all ebooks"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">CTA Label</label>
                    <input
                      type="text"
                      value={formData.ctaLabel}
                      onChange={(e) => setFormData({ ...formData, ctaLabel: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., Shop Now"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">CTA Link</label>
                    <input
                      type="text"
                      value={formData.ctaLink}
                      onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., /browse"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Uploading...
                      </>
                    ) : (
                      <>{editingBanner ? 'Update Banner' : 'Create Banner'}</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
