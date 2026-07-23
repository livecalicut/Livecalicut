'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { fetchAdminNewsAction } from './actions';
import { Card } from '@/components/ui/card';
import { Newspaper, Plus, Search, XCircle, X, Loader2 } from 'lucide-react';
import { toast } from '@/lib/toast';

export default function AdminNewsPage() {
  const [search, setSearch] = useState('');
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Write Article Modal
  const [showModal, setShowModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('News Editorial');
  const [formAuthor, setFormAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    const res = await fetchAdminNewsAction();
    if (res.success) {
      setNewsArticles(res.data || []);
    }
    setLoading(false);
  };

  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent) {
      toast.error('Validation', 'Title and article body are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          summary: formSummary,
          content: formContent,
          category: formCategory,
          author: formAuthor,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to publish');

      toast.success('Published!', `"${formTitle}" is now live on the city feed.`);
      setShowModal(false);
      setFormTitle('');
      setFormSummary('');
      setFormContent('');
      setFormCategory('News Editorial');
      setFormAuthor('');
      loadNews();
    } catch (err: any) {
      toast.error('Publish Failed', err.message || 'Could not publish article.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const action = currentStatus === 'published' ? 'reject' : 'approve';
    const res = await fetch('/api/v1/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'news', entityId: id, action })
    });
    if (res.ok) loadNews();
  };

  const deleteNews = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) return;
    const res = await fetch('/api/v1/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'news', entityId: id, hardDelete: true })
    });
    if (res.ok) loadNews();
  };

  const filteredNews = newsArticles.filter((n) => n.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'News & Editorial' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
                <Newspaper className="w-7 h-7 text-[#2563EB]" />
                <span>Kozhikode News & Editorial Desk</span>
              </h1>
              <p className="text-sm text-[#6B7280]">Publish civic announcements, manage local breaking news, and curate editorial features</p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Write New Article
            </button>
          </div>

          {/* Search Card */}
          <Card className="p-4 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search headline..."
                className="w-full pl-10 pr-4 h-[38px] rounded-xl border border-[#D1D5DB] bg-white text-xs text-[#111827] font-semibold focus:border-[#2563EB] focus:outline-none placeholder:text-[#9CA3AF]"
              />
            </div>
            <span className="text-xs font-bold text-[#6B7280]">Articles: {filteredNews.length}</span>
          </Card>

          {/* News Table Card */}
          <Card className="p-0 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Headline / Category</th>
                    <th className="py-3.5 px-4">Author</th>
                    <th className="py-3.5 px-4">Published Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Editorial Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-8 text-[#6B7280]">Loading news...</td></tr>
                  ) : filteredNews.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <div className="space-y-2">
                          <Newspaper className="w-10 h-10 text-[#D1D5DB] mx-auto" />
                          <p className="text-[#6B7280] font-semibold text-sm">No articles published yet</p>
                          <p className="text-[#9CA3AF] text-xs">Click "Write New Article" to publish the first city news update.</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredNews.map((n) => (
                    <tr key={n.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 font-semibold">
                        <p className="font-bold text-[#111827] font-sans">{n.title}</p>
                        <p className="text-[11px] text-[#6B7280]">{n.news_categories?.name || 'General'}</p>
                      </td>
                      <td className="py-4 px-4 text-[#4B5563] font-medium">{n.profiles?.full_name || n.author || 'Editorial Team'}</td>
                      <td className="py-4 px-4 text-[#6B7280] font-medium">
                        {new Date(n.published_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            n.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {n.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => toggleStatus(n.id, n.status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            n.status === 'published'
                              ? 'border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100'
                              : 'border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {n.status === 'published' ? 'Archive Story' : 'Publish Story'}
                        </button>
                        <button
                          onClick={() => deleteNews(n.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>

      {/* Modal: Write New Article */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#111827] flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[#2563EB]" /> Write & Publish Article
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#6B7280] hover:bg-[#F3F4F6] p-1.5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#2563EB] font-semibold">
              📡 Once published, this article immediately appears in the "Today in Kozhikode" section on the homepage.
            </div>

            <form onSubmit={handlePublishArticle} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">Article Headline *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Kozhikode Smart City Project Phase 3 Launched"
                  className="w-full h-11 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="News Editorial">News Editorial</option>
                    <option value="Cyberpark Expansion">Cyberpark Expansion</option>
                    <option value="Cultural Festival">Cultural Festival</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Business">Business</option>
                    <option value="Government">Government</option>
                    <option value="Health">Health</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">Author Name</label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="e.g. LiveCalicut Editorial"
                    className="w-full h-11 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">Short Summary (shown in timeline)</label>
                <input
                  type="text"
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="One-line summary that appears below the headline in the homepage feed..."
                  className="w-full h-11 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4B5563] uppercase tracking-wider">Full Article Content *</label>
                <textarea
                  required
                  rows={8}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Write the full article body here. Include all details, quotes, and context..."
                  className="w-full px-3 py-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF] resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-bold text-[#4B5563] hover:bg-[#F3F4F6] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
                  ) : (
                    <><Newspaper className="w-4 h-4" /> Publish to City Feed</>
                  )}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
