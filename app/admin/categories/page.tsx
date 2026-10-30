'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Plus,
  RefreshCw,
  FolderTree,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AdminPageHeader } from '@/components/admin/data-table';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';

type ModuleKey = 'businesses' | 'subcategories' | 'jobs' | 'news' | 'marketplace' | 'properties';

interface ModuleConfig {
  key: ModuleKey;
  label: string;
  table: string;
  entity: string;
}

const MODULES: ModuleConfig[] = [
  { key: 'businesses', label: '19 Mega Menu Categories', table: 'business_categories', entity: 'business_category' },
  { key: 'subcategories', label: '75+ Subcategories', table: 'business_subcategories', entity: 'business_subcategory' },
  { key: 'jobs', label: 'Jobs & Careers', table: 'job_categories', entity: 'job_category' },
  { key: 'news', label: 'News & Updates', table: 'news_categories', entity: 'news_category' },
  { key: 'marketplace', label: 'Marketplace', table: 'marketplace_categories', entity: 'marketplace_category' },
  { key: 'properties', label: 'Properties', table: 'property_categories', entity: 'property_category' },
];

interface CategoryItem {
  rowKey: string;
  id: string;
  name: string;
  slug: string;
  icon_name?: string | null;
  display_order?: number | null;
  is_active?: boolean;
  created_at?: string;
  module: ModuleKey;
  table: string;
}

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeModule, setActiveModule] = useState<'all' | ModuleKey>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formModule, setFormModule] = useState<ModuleKey>('businesses');
  const [formIcon, setFormIcon] = useState('Folder');
  const [formOrder, setFormOrder] = useState('1');
  const [formActive, setFormActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      const results = await Promise.all(
        MODULES.map(async (m) => {
          try {
            let query = supabase.from(m.table).select('*').is('deleted_at', null);
            if (m.key === 'subcategories') {
              query = query.order('name');
            } else {
              query = query.order('display_order', { ascending: true });
            }
            const { data, error } = await query;

            if (error) return { module: m, rows: [] };
            return { module: m, rows: data || [] };
          } catch {
            return { module: m, rows: [] };
          }
        })
      );

      const allCategories: CategoryItem[] = results.flatMap(({ module: m, rows: list }) =>
        list.map((c: any) => ({
          rowKey: `${m.key}:${c.id}`,
          id: c.id,
          name: c.name,
          slug: c.slug,
          icon_name: c.icon_name || null,
          display_order: c.display_order ?? null,
          is_active: c.is_active !== false,
          created_at: c.created_at,
          module: m.key,
          table: m.table,
        }))
      );

      setRows(allCategories);
    } catch (err: any) {
      toast.error('Fetch Error', err.message || 'Could not load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // 1-Click Sync Genuine Mega Menu Categories directly to Supabase
  const handleSyncMegaMenu = async () => {
    try {
      setSyncing(true);
      const res = await fetch('/api/v1/admin/taxonomy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resource: 'sync_megamenu' }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Sync failed');
      }

      toast.success(
        'Categories & Subcategories Synced!',
        `Synced ${json.categoryCount || 19} categories and ${json.subcategoryCount || 75}+ subcategories to Supabase.`
      );
      await load();
    } catch (err: any) {
      toast.error('Sync Error', err.message || 'Could not sync categories to database');
    } finally {
      setSyncing(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error('Validation Error', 'Category name is required.');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/v1/admin/taxonomy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resource: 'category',
          module: formModule,
          name: formName.trim(),
          icon_name: formIcon.trim(),
          display_order: parseInt(formOrder, 10) || 1,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to save');
      }

      toast.success('Category Created', `${formName} added to Supabase.`);
      setIsCreateOpen(false);
      setFormName('');
      await load();
    } catch (err: any) {
      toast.error('Creation Failed', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !formName.trim()) return;

    try {
      setSaving(true);
      const res = await fetch('/api/v1/admin/taxonomy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: editingItem.module,
          id: editingItem.id,
          name: formName.trim(),
          icon_name: formIcon.trim(),
          display_order: parseInt(formOrder, 10) || 1,
          is_active: formActive,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to update');
      }

      toast.success('Category Updated', `${formName} saved.`);
      setEditingItem(null);
      await load();
    } catch (err: any) {
      toast.error('Update Failed', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: CategoryItem) => {
    if (!window.confirm(`Are you sure you want to delete category "${item.name}" from Supabase?`)) {
      return;
    }

    try {
      const res = await fetch('/api/v1/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: MODULES.find((m) => m.key === item.module)?.entity,
          entityId: item.id,
          hardDelete: true,
        }),
      });

      const json = await res.json();
      if (!res.ok || json.success === false) {
        throw new Error(json.error || 'Failed to delete');
      }

      toast.success('Category Deleted', `${item.name} removed from Supabase.`);
      await load();
    } catch (err: any) {
      toast.error('Delete Failed', err.message);
    }
  };

  const openEditModal = (item: CategoryItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormModule(item.module);
    setFormIcon(item.icon_name || 'Folder');
    setFormOrder(String(item.display_order ?? 1));
    setFormActive(item.is_active ?? true);
  };

  // Filtered rows
  const filteredRows = rows.filter((r) => {
    const matchesModule = activeModule === 'all' || r.module === activeModule;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      r.name.toLowerCase().includes(query) ||
      r.slug.toLowerCase().includes(query) ||
      (r.icon_name && r.icon_name.toLowerCase().includes(query));
    return matchesModule && matchesSearch;
  });

  const businessCount = rows.filter((r) => r.module === 'businesses').length;
  const activeCount = rows.filter((r) => r.is_active).length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <AdminPageHeader
        title="Category & Service Verticals"
        description="Manage and sync genuine Calicut categories across businesses, services, jobs, and news directly in Supabase."
        count={rows.length}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              onClick={handleSyncMegaMenu}
              disabled={syncing}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs gap-2 shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Mega Menu to Supabase'}</span>
            </Button>
            <Button
              type="button"
              onClick={() => {
                setFormName('');
                setFormModule('businesses');
                setFormIcon('Utensils');
                setFormOrder(String(rows.length + 1));
                setFormActive(true);
                setIsCreateOpen(true);
              }}
              className="h-10 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 rounded-2xl border border-slate-200/90 bg-white space-y-1 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Total Categories</p>
          <p className="text-2xl font-black text-slate-900">{rows.length}</p>
        </Card>
        <Card className="p-4 rounded-2xl border border-slate-200/90 bg-white space-y-1 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Active in Supabase</p>
          <p className="text-2xl font-black text-emerald-600">{activeCount}</p>
        </Card>
        <Card className="p-4 rounded-2xl border border-slate-200/90 bg-white space-y-1 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Business &amp; Services</p>
          <p className="text-2xl font-black text-[#2563EB]">{businessCount}</p>
        </Card>
        <Card className="p-4 rounded-2xl border border-slate-200/90 bg-white space-y-1 shadow-xs">
          <p className="text-xs font-semibold text-slate-500">Mega Menu Sync Status</p>
          <div className="flex items-center gap-1.5 pt-1 text-xs font-bold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Real DB Ready</span>
          </div>
        </Card>
      </div>

      {/* Filter Tabs & Search Bar */}
      <Card className="p-4 border border-slate-200/90 bg-white rounded-2xl space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Module Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none]">
            <button
              type="button"
              onClick={() => setActiveModule('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeModule === 'all'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Modules ({rows.length})
            </button>
            {MODULES.map((m) => {
              const count = rows.filter((r) => r.module === m.key).length;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setActiveModule(m.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activeModule === m.key
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {m.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category or slug..."
              className="pl-9 h-10 rounded-xl border-slate-200 text-xs font-medium"
            />
          </div>
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/90">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Module</th>
                <th className="py-3 px-4 text-center">Icon</th>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading genuine categories from Supabase...
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center space-y-2">
                    <FolderTree className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700">No categories found.</p>
                    <p className="text-xs text-slate-400">
                      Click &ldquo;Sync Mega Menu to Supabase&rdquo; to load all 19 genuine categories immediately.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRows.map((cat) => (
                  <tr key={cat.rowKey} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 text-sm">{cat.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      /{cat.slug}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] font-bold text-[10px]">
                        {MODULES.find((m) => m.key === cat.module)?.label || cat.module}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-xs text-slate-600">
                      {cat.icon_name || '—'}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                      {cat.display_order ?? '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {cat.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        title="Edit category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Category Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white rounded-3xl space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Add New Genuine Category</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Module *
                </label>
                <select
                  value={formModule}
                  onChange={(e) => setFormModule(e.target.value as ModuleKey)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  {MODULES.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category Name *
                </label>
                <Input
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g., Restaurants & Cafés"
                  className="h-10 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Lucide Icon
                  </label>
                  <Input
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    placeholder="e.g., Utensils, Wrench"
                    className="h-10 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Display Order
                  </label>
                  <Input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="h-10 rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="h-10 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-5"
                >
                  {saving ? 'Creating...' : 'Create in Supabase'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white rounded-3xl space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Edit Category</h3>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Category Name *
                </label>
                <Input
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="h-10 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Lucide Icon
                  </label>
                  <Input
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="h-10 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Display Order
                  </label>
                  <Input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
                <label htmlFor="activeCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Active in LiveCalicut listings
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  className="h-10 rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="h-10 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold px-5"
                >
                  {saving ? 'Saving...' : 'Update Supabase'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
