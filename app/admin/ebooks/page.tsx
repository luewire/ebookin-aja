'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/lib/firebase';

interface Ebook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  category: string;
  description: string;
  pdfUrl: string;
  publicId?: string; // Add publicId
  isActive: boolean;
  isPremium: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export default function ManageEbooksPage() {
  const { user, loading: authLoading } = useAuth();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('Status');
  const [showModal, setShowModal] = useState(false);
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingEpub, setUploadingEpub] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [coverUrl, setCoverUrl] = useState<string>(''); // State for cover URL
  const [epubUrl, setEpubUrl] = useState<string>(''); // State for EPUB URL
  const [epubFileName, setEpubFileName] = useState<string>('');
  const [uploadedEpubPublicId, setUploadedEpubPublicId] = useState<string>(''); // State for publicId
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
        fetchEbooks();
        fetchCategories();
      }
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (editingEbook) {
      setCoverPreview(editingEbook.coverUrl || '');
      setCoverUrl(editingEbook.coverUrl || '');
      setEpubUrl(editingEbook.pdfUrl || ''); // Reset EPUB URL on edit
      if (editingEbook.pdfUrl && (editingEbook.pdfUrl.includes('/uploads/') || editingEbook.pdfUrl.includes('supabase.co'))) {
        setEpubFileName('Book file attached');
      }
    } else {
      setCoverPreview('');
      setCoverUrl('');
      setEpubUrl(''); // Reset EPUB URL
      setEpubFileName('');
    }
  }, [editingEbook]);

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

  const fetchEbooks = async () => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch('/api/admin/ebooks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch ebooks');
      }

      const data = await response.json();
      setEbooks(data.ebooks || []);
    } catch (error: any) {
      console.error('Error fetching ebooks:', error);
      setEbooks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ebook?')) return;

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`/api/admin/ebooks?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete ebook');
      }

      fetchEbooks();
    } catch (error: any) {
      console.error('Error deleting ebook:', error);
      alert('Failed to delete ebook');
    }
  };

  const handleCoverUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only WebP, JPEG, JPG, and PNG are allowed.');
      return;
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 2MB limit');
      return;
    }

    setUploadingCover(true);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload cover image');
      }

      const data = await response.json();
      console.log('Cover uploaded successfully:', data);
      setCoverPreview(data.url);
      setCoverUrl(data.url); // Update state for form submission
    } catch (error: any) {
      console.error('Error uploading cover:', error);
      alert('Failed to upload cover image');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleEpubUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.epub')) {
      alert('Invalid file type. Only EPUB files are allowed.');
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 50MB limit');
      return;
    }

    setUploadingEpub(true);
    setEpubFileName(file.name);

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'epub');

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload EPUB file');
      }

      const data = await response.json();

      // Save URL and publicId to state
      setEpubUrl(data.url);
      setUploadedEpubPublicId(data.publicId);
      
      // Update hidden input manually as fallback
      const contentInput = document.querySelector('input[name="content"]') as HTMLInputElement;
      if (contentInput) {
        contentInput.value = data.url;
      }
    } catch (error: any) {
      console.error('Error uploading EPUB:', error);
      alert('Failed to upload EPUB file');
      setEpubFileName('');
    } finally {
      setUploadingEpub(false);
    }
  };

  const filteredEbooks = ebooks.filter(ebook => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ebook.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || ebook.category === categoryFilter;
    const matchesStatus = statusFilter === 'Status' ||
      (statusFilter === 'Published' && ebook.isActive) ||
      (statusFilter === 'Draft' && !ebook.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Manage Ebooks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add, edit, and organize your platform's library of digital titles.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Ebook
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
        >
          <option>All Categories</option>
          {categories.filter(c => c.isActive).map((category) => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
        >
          <option>Status</option>
          <option>Published</option>
          <option>Draft</option>
        </select>
      </div>

      {/* Ebooks Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">COVER</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">TITLE & DESCRIPTION</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">AUTHOR</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CATEGORY</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredEbooks.map((ebook) => (
              <tr key={ebook.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="h-16 w-12 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    {ebook.coverUrl ? (
                      <img src={ebook.coverUrl} alt={ebook.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">No cover</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900 dark:text-white mb-1">{ebook.title}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{ebook.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{ebook.author}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                    {ebook.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {ebook.isActive ? (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      Published
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                      <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                      Draft
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingEbook(ebook);
                        setShowModal(true);
                      }}
                      className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(ebook.id)}
                      className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing 1-5 of {ebooks.length} books
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              &larr;
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded">1</button>
            <button className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors">2</button>
            <button className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors">3</button>
            <span className="px-2">...</span>
            <button className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors">12</button>
            <button className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Ebook Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingEbook ? 'Edit Ebook' : 'Add New Ebook'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingEbook(null);
                    setCoverPreview('');
                    setEpubFileName('');
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                const ebookData: any = {
                  title: formData.get('title') as string,
                  author: formData.get('author') as string,
                  coverUrl: formData.get('cover') as string,
                  category: formData.get('category') as string,
                  description: formData.get('description') as string,
                  pdfUrl: epubUrl || formData.get('content') as string, // Prioritize state
                  publicId: uploadedEpubPublicId || editingEbook?.publicId, // Include publicId
                  isActive: formData.get('status') === 'active',
                  isPremium: true,
                  priority: 0,
                };

                console.log('Submitting ebook data:', ebookData);

                if (editingEbook) {
                  ebookData.id = editingEbook.id;
                }

                try {
                  const token = await getAuthToken();
                  if (!token) throw new Error('Not authenticated');

                  const method = editingEbook ? 'PATCH' : 'POST';
                  const url = editingEbook
                    ? `/api/admin/ebooks?id=${editingEbook.id}`
                    : '/api/admin/ebooks';

                  const response = await fetch(url, {
                    method,
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ebookData)
                  });

                  if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Save ebook error:', errorData);
                    throw new Error(errorData.error || 'Failed to save ebook');
                  }

                  const result = await response.json();
                  console.log('Ebook saved successfully:', result);

                  setShowModal(false);
                  setEditingEbook(null);
                  setCoverPreview('');
                  setCoverUrl('');
                  setEpubUrl(''); // Reset EPUB URL
                  setEpubFileName('');
                  setUploadedEpubPublicId(''); // Reset publicId
                  fetchEbooks();
                } catch (error: any) {
                  console.error('Error saving ebook:', error);
                }
              }}
              className="px-6 py-6 space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingEbook?.title || ''}
                    className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="Enter book title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    required
                    defaultValue={editingEbook?.author || ''}
                    className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="Enter author name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    defaultValue={editingEbook?.category || ''}
                    className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Select category</option>
                    {categories.filter(c => c.isActive).map((category) => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    required
                    defaultValue={editingEbook?.isActive ? 'active' : 'draft'}
                    className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Cover Image
                </label>
                <div className="space-y-3">
                  {/* Cover Preview */}
                  {(coverPreview || editingEbook?.coverUrl) && (
                    <div className="relative w-32 h-44 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img
                        src={coverPreview || editingEbook?.coverUrl}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* File Input */}
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {uploadingCover ? 'Uploading...' : 'Choose Cover Image'}
                      </div>
                      <input
                        type="file"
                        accept="image/webp,image/jpeg,image/jpg,image/png"
                        className="hidden"
                        disabled={uploadingCover}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleCoverUpload(file);
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Supported: WebP, JPEG, PNG (max 2MB)
                  </p>
                </div>
                <input
                  type="hidden"
                  name="cover"
                  value={coverUrl}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  defaultValue={editingEbook?.description || ''}
                  className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Enter a brief description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  EPUB File *
                </label>
                <div className="space-y-3">
                  {/* EPUB File Info */}
                  {(epubFileName || editingEbook?.pdfUrl) && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                      <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100 flex-1">
                        {epubFileName || 'EPUB file uploaded'}
                      </span>
                    </div>
                  )}

                  {/* File Input */}
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {uploadingEpub ? 'Uploading...' : 'Upload EPUB File'}
                      </div>
                      <input
                        type="file"
                        accept=".epub,application/epub+zip"
                        className="hidden"
                        disabled={uploadingEpub}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleEpubUpload(file);
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload your ebook in EPUB format (max 50MB)
                  </p>
                </div>
                <input
                  type="hidden"
                  name="content"
                  defaultValue={editingEbook?.pdfUrl || ''}
                  required
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingEbook(null);
                    setCoverPreview('');
                    setCoverUrl('');
                    setEpubUrl('');
                    setEpubFileName('');
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingEbook ? 'Save Changes' : 'Add Ebook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
