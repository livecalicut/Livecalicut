'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { FolderTree, Plus, Search, Layers, X, Edit3, Loader2 } from 'lucide-react';
import { toast } from '@/lib/toast';

interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  module: string;
  table: string;
  count: number;
}

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNode, setEditingNode] = useState<CategoryNode | null>(null);

  const [formName, setFormName] = useState('');
  const [formModule, setFormModule] = useState('businesses'); // 'businesses' | 'jobs' | 'marketplace' | 'properties'
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTaxonomy();
  }, []);

  const fetchTaxonomy = async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      const [bizRes, jobsRes, marketRes, propRes] = await Promise.all([
        supabase.from('business_categories').select('id, name, slug').is('deleted_at', null),
        supabase.from('job_categories').select('id, name, slug').is('deleted_at', null),
        supabase.from('marketplace_categories').select('id, name, slug').is('deleted_at', null),
        supabase.from('property_categories').select('id, name, slug').is('deleted_at', null),
      ]);

      const nodes: CategoryNode[] = [
        ...(bizRes.data || []).map((c) => ({ ...c, module: 'Commercial Outlets', table: 'business_categories', count: 0 })),
        ...(jobsRes.data || []).map((c) => ({ ...c, module: 'Cyberpark Jobs', table: 'job_categories', count: 0 })),
        ...(marketRes.data || []).map((c) => ({ ...c, module: 'Classifieds Market', table: 'marketplace_categories', count: 0 })),
        ...(propRes.data || []).map((c) => ({ ...c, module: 'Real Estate', table: 'property_categories', count: 0 })),
      ];

      setCategories(nodes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    setSubmitting(true);
    const supabase = createClient();
    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    let tableName = 'business_categories';
    if (formModule === 'jobs') tableName = 'job_categories';
    if (formModule === 'marketplace') tableName = 'marketplace_categories';
    if (formModule === 'properties') tableName = 'property_categories';

    try {
      const { error } = await supabase.from(tableName).insert({ name: formName, slug });
      if (error) throw error;
      toast.success('Category Added', `Created "${formName}" in ${formModule}`);
      setShowCreateModal(false);
      setFormName('');
      fetchTaxonomy();
    } catch (err: any) {
      toast.error('Error', err.message || 'Could not create category node');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNode || !formName) return;

    setSubmitting(true);
    const supabase = createClient();
    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
      const { error } = await supabase.from(editingNode.table).update({ name: formName, slug }).eq('id', editingNode.id);
      if (error) throw error;
      toast.success('Category Updated', `Updated node to "${formName}"`);
      setShowEditModal(false);
      setEditingNode(null);
      setFormName('');
      fetchTaxonomy();
    } catch (err: any) {
      toast.error('Error', err.message || 'Could not update category node');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.module.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Categories Taxonomy' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
                <FolderTree className="w-7 h-7 text-[#2563EB]" />
                <span>Categories & Taxonomy Tree Manager</span>
              </h1>
              <p className="text-sm text-[#6B7280]">Manage primary categories, subcategory structures, display ordering & icon taxonomy</p>
            </div>

            <button
              onClick={() => {
                setFormName('');
                setFormModule('businesses');
                setShowCreateModal(true);
              }}
              className="h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Create Category Node
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
                placeholder="Search category node..."
                className="w-full pl-10 pr-4 h-[38px] rounded-xl border border-[#D1D5DB] bg-white text-xs text-[#111827] font-semibold focus:border-[#2563EB] focus:outline-none placeholder:text-[#9CA3AF]"
              />
            </div>
            <span className="text-xs font-bold text-[#6B7280]">Taxonomy Nodes: {filteredCategories.length}</span>
          </Card>

          {/* Categories Grid */}
          {loading ? (
            <div className="text-center py-12 text-[#6B7280] text-sm font-medium">Loading category taxonomy nodes...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-[#6B7280] text-sm font-medium">No category nodes found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((c) => (
                <Card key={`${c.table}-${c.id}`} className="p-5 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs space-y-3 hover:border-blue-200 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-[10px] text-[#2563EB] border-blue-200 bg-blue-50 font-bold uppercase">
                      {c.module}
                    </Badge>
                    <h4 className="text-base font-bold text-[#111827] font-sans">{c.name}</h4>
                    <p className="text-[11px] text-[#6B7280] font-mono">slug: /{c.slug}</p>
                  </div>

                  <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#2563EB]">Active Node</span>
                    <button
                      onClick={() => {
                        setEditingNode(c);
                        setFormName(c.name);
                        setShowEditModal(true);
                      }}
                      className="text-[#6B7280] hover:text-[#2563EB] font-bold inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Node
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal: Create Category Node */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-white rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#111827]">Create Category Node</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-[#6B7280] hover:bg-[#F3F4F6] p-1.5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4B5563]">Target Vertical Module</label>
                <select
                  value={formModule}
                  onChange={(e) => setFormModule(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="businesses">Commercial Outlets</option>
                  <option value="jobs">Cyberpark Jobs</option>
                  <option value="marketplace">Classifieds Market</option>
                  <option value="properties">Real Estate Listings</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4B5563]">Category Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Seafood & Beach Cafes"
                  className="w-full h-10 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-bold text-[#4B5563] hover:bg-[#F3F4F6] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create Node
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Modal: Edit Category Node */}
      {showEditModal && editingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-white rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#111827]">Edit Category Node</h2>
              <button onClick={() => setShowEditModal(false)} className="text-[#6B7280] hover:bg-[#F3F4F6] p-1.5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditNode} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4B5563]">Module</label>
                <input
                  type="text"
                  disabled
                  value={editingNode.module}
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-sm text-[#6B7280] font-semibold cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4B5563]">Category Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-bold text-[#4B5563] hover:bg-[#F3F4F6] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
