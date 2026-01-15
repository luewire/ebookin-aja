'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Ebook {
  id: string;
  title: string;
  author: string;
  cover: string;
  category: string;
  description: string;
  content: string;
  created_at: string;
}

export default function AdminEbooksPage() {
  const { user, loading: authLoading } = useAuth();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover: '',
    category: '',
    description: '',
    content: '',
  });
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.email !== 'admin@admin.com') {
        router.push('/unauthorized');
      } else {
        fetchEbooks();
      }
    }
  }, [user, authLoading]);

  const fetchEbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEbooks(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('ebooks')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ebooks')
          .insert([formData]);

        if (error) throw error;
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        author: '',
        cover: '',
        category: '',
        description: '',
        content: '',
      });
      fetchEbooks();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ebook: Ebook) => {
    setEditingId(ebook.id);
    setFormData({
      title: ebook.title,
      author: ebook.author,
      cover: ebook.cover,
      category: ebook.category,
      description: ebook.description,
      content: ebook.content,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ebook?')) return;

    try {
      const { error } = await supabase
        .from('ebooks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchEbooks();
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (authLoading || (loading && ebooks.length === 0) || !user || user.email !== 'admin@admin.com') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">📚 Manage Ebooks</h1>
            <Link
              href="/admin"
              className="min-h-[44px] flex items-center justify-center rounded-lg px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              ← Back to Admin
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">All Ebooks</h2>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                title: '',
                author: '',
                cover: '',
                category: '',
                description: '',
                content: '',
              });
            }}
            className="min-h-[44px] flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-base font-semibold text-white hover:bg-blue-700"
          >
            + Add New Ebook
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4">
            <p className="text-base text-red-800">{error}</p>
          </div>
        )}

        {showForm && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Ebook' : 'Add New Ebook'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-base font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700">Author</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700">Cover URL</label>
                  <input
                    type="url"
                    required
                    value={formData.cover}
                    onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700">Content (HTML)</label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-base font-mono focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="min-h-[44px] flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-base font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="min-h-[44px] flex items-center justify-center rounded-lg bg-gray-200 px-6 py-2 text-base font-semibold text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {ebooks.map((ebook) => (
            <div key={ebook.id} className="rounded-lg bg-white p-6 shadow-md">
              <div className="flex items-start gap-4">
                <img
                  src={ebook.cover}
                  alt={ebook.title}
                  className="h-32 w-24 rounded object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{ebook.title}</h3>
                  <p className="text-base text-gray-600">by {ebook.author}</p>
                  <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                    {ebook.category}
                  </span>
                  <p className="mt-2 text-base text-gray-700 line-clamp-2">{ebook.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(ebook)}
                    className="min-h-[44px] flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ebook.id)}
                    className="min-h-[44px] flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-base font-medium text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {ebooks.length === 0 && !showForm && (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <div className="mb-4 text-6xl">📚</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No ebooks yet</h3>
            <p className="text-base text-gray-600">Click "Add New Ebook" to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}
