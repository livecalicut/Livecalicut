'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  X,
  Layers,
  ArrowRight,
  Phone,
  Image as ImageIcon,
  Sliders,
  Sparkle,
  Settings2,
  FileText,
  RotateCcw,
  Check,
} from 'lucide-react';
import {
  AdminPageHeader,
  DataTable,
  IconButton,
  Modal,
  StatusBadge,
  primaryButtonClass,
  secondaryButtonClass,
  type Column,
} from '@/components/admin/data-table';
import { toast } from '@/lib/toast';
import { PromotedSlider } from '@/lib/services/promoted-sliders.service';

const inputClass =
  'h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:outline-none';

const EMPTY_SLIDER: Partial<PromotedSlider> = {
  section: 'featured',
  brandName: '',
  brandTag: 'SPONSORED',
  headline: '',
  dealHighlight: 'Special Offer',
  subtext: '',
  bottomStrip: '10% Instant Bank Discount on Cards',
  bankIconText: 'SPECIAL',
  image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
  href: '/business',
  phone: '',
  badgeText: 'HOT DEAL',
  badgeColor: 'amber',
  is_active: true,
};

interface SettingsState {
  enabled: boolean;
  show_creative_banner: boolean;
  banner_headline: string;
  banner_subtext: string;
  banner_badge: string;
  banner_cta_text: string;
  banner_cta_url: string;
}

export default function AdminPromotedSlidersPage() {
  const [sliders, setSliders] = useState<PromotedSlider[]>([]);
  const [settings, setSettings] = useState<SettingsState>({
    enabled: true,
    show_creative_banner: true,
    banner_headline: 'Spotlight Your Brand Across Kozhikode',
    banner_subtext:
      'Put your business directly in front of thousands of verified Kozhikode shoppers, diners & clients daily. Premium homepage visibility, high-intent category reach, and instant direct WhatsApp inquiries.',
    banner_badge: 'FEATURE YOUR BUSINESS',
    banner_cta_text: 'Promote Your Business',
    banner_cta_url: '/merchant',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [editing, setEditing] = useState<Partial<PromotedSlider> | null>(null);
  const [viewing, setViewing] = useState<PromotedSlider | null>(null);
  const [sectionFilter, setSectionFilter] = useState<'all' | 'featured' | 'explore'>('all');
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [editingCopy, setEditingCopy] = useState<SettingsState>(settings);

  const loadSliders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/admin/promoted-sliders');
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to load sliders');
      }
      setSliders(json.sliders || []);
      if (json.settings) {
        setSettings(json.settings);
        setEditingCopy(json.settings);
      }
    } catch (err: any) {
      toast.error('Could not load sliders', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSliders();
  }, [loadSliders]);

  const updateSectionSettings = async (updates: Partial<SettingsState>) => {
    const next = { ...settings, ...updates };
    setSettings(next);
    setSavingSettings(true);
    try {
      const res = await fetch('/api/v1/admin/promoted-sliders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to update settings');
      toast.success('Homepage section settings saved!');
    } catch (err: any) {
      toast.error('Failed to save settings', err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveCreativeCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSectionSettings(editingCopy);
    setShowCopyModal(false);
  };

  const toggleActive = async (slider: PromotedSlider) => {
    const nextState = !slider.is_active;
    const prev = sliders;
    setSliders(sliders.map((s) => (s.id === slider.id ? { ...s, is_active: nextState } : s)));

    try {
      const res = await fetch('/api/v1/admin/promoted-sliders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: slider.id, is_active: nextState }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Update failed');
      toast.success(nextState ? 'Slider activated' : 'Slider deactivated');
    } catch (err: any) {
      setSliders(prev);
      toast.error('Failed to update status', err.message);
    }
  };

  const deleteSlider = async (id: string) => {
    if (!confirm('Are you sure you want to remove this promoted slider?')) return;
    const prev = sliders;
    setSliders(sliders.filter((s) => s.id !== id));

    try {
      const res = await fetch(`/api/v1/admin/promoted-sliders?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Delete failed');
      toast.success('Promoted slider deleted successfully');
    } catch (err: any) {
      setSliders(prev);
      toast.error('Failed to delete slider', err.message);
    }
  };

  const clearAllSliders = async () => {
    if (
      !confirm(
        'Are you sure you want to delete ALL slider cards? The homepage will immediately display the creative merchant copy banner.'
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/promoted-sliders?action=clear_all', { method: 'POST' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Clear failed');
      setSliders([]);
      toast.success('All sliders removed! Creative copy banner is now active.');
    } catch (err: any) {
      toast.error('Failed to clear sliders', err.message);
    } finally {
      setLoading(false);
    }
  };

  const seedSampleSliders = async () => {
    if (!confirm('Seed demo slider cards? This will add 16 sample promotional cards to the database.')) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/promoted-sliders?action=seed', { method: 'POST' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Seed failed');
      setSliders(json.sliders || []);
      toast.success('Sample sliders loaded successfully!');
    } catch (err: any) {
      toast.error('Failed to seed sliders', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.brandName?.trim() || !editing.headline?.trim()) {
      toast.error('Validation Error', 'Brand name and headline are required.');
      return;
    }

    setSaving(true);
    try {
      const isNew = !editing.id;
      const res = await fetch('/api/v1/admin/promoted-sliders', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Save failed');

      toast.success(isNew ? 'Promoted slider created!' : 'Promoted slider updated!');
      setEditing(null);
      loadSliders();
    } catch (err: any) {
      toast.error('Could not save slider', err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredSliders = sliders.filter((s) => {
    if (sectionFilter === 'all') return true;
    return s.section === sectionFilter;
  });

  const columns: Column<PromotedSlider>[] = [
    {
      key: 'brandName',
      header: 'Promoted Card',
      sortValue: (s) => s.brandName,
      cell: (s) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt={s.brandName} className="w-full h-full object-cover" />
            <span className="absolute bottom-0 right-0 px-1 py-0.2 bg-black/80 text-[8px] font-black text-amber-400">
              AD
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs text-[#111827] uppercase tracking-wide truncate">
                {s.brandName}
              </span>
              {s.badgeText && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-100 text-amber-900">
                  {s.badgeText}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 truncate font-semibold">{s.headline}</p>
            <p className="text-[11px] text-amber-600 font-bold truncate">{s.dealHighlight}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'section',
      header: 'Placement Section',
      sortValue: (s) => s.section,
      cell: (s) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
            s.section === 'featured'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          <Layers className="w-3 h-3" />
          {s.section === 'featured' ? 'After Featured Listings' : 'After Explore Calicut'}
        </span>
      ),
    },
    {
      key: 'bottomStrip',
      header: 'Deal / Bank Strip',
      hideOnMobile: true,
      cell: (s) => (
        <div className="text-xs text-[#111827] max-w-xs truncate">
          <span className="font-semibold text-slate-700">{s.bottomStrip}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (s) => (s.is_active ? 1 : 0),
      cell: (s) => (
        <button
          onClick={() => toggleActive(s)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
            s.is_active
              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {s.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{s.is_active ? 'Active' : 'Draft / Off'}</span>
        </button>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (s) => (
        <div className="flex items-center justify-end gap-1">
          <IconButton label="Preview card" onClick={() => setViewing(s)}>
            <Eye className="w-4 h-4" />
          </IconButton>
          <IconButton label="Edit slider" onClick={() => setEditing(s)}>
            <Edit2 className="w-4 h-4" />
          </IconButton>
          <IconButton label="Delete slider" tone="danger" onClick={() => deleteSlider(s.id)}>
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Promoted Slider Carousels"
        description="Add, edit, remove, and customize the 2-Row x 2-Column promotional banners shown on the homepage."
        count={sliders.length}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Homepage</span>
            </Link>
            <button
              onClick={() => setEditing({ ...EMPTY_SLIDER })}
              className={primaryButtonClass}
            >
              <Plus className="h-4 w-4" /> Add Promoted Slider
            </button>
          </div>
        }
      />

      {/* HOMEPAGE SECTION CONTROLS & CREATIVE BANNER SETTINGS CARD */}
      <div className="mb-6 rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0">
              <Settings2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 leading-tight">
                Homepage Showcase Controls & Creative Fallback Copy
              </h3>
              <p className="text-xs text-slate-500">
                Control section visibility on live site and customize the creative marketing copy shown when no sliders are added.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setEditingCopy(settings);
                setShowCopyModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Edit Creative Copy</span>
            </button>

            {sliders.length > 0 ? (
              <button
                onClick={clearAllSliders}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete All Sliders</span>
              </button>
            ) : (
              <button
                onClick={seedSampleSliders}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Seed Sample Sliders</span>
              </button>
            )}
          </div>
        </div>

        {/* 2 Interactive Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Master Section Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900">Homepage Showcase Master Switch</p>
              <p className="text-[11px] text-slate-500">
                {settings.enabled
                  ? 'Active on homepage (displays slider or creative copy)'
                  : 'Completely removed from homepage'}
              </p>
            </div>
            <button
              disabled={savingSettings}
              onClick={() => updateSectionSettings({ enabled: !settings.enabled })}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                settings.enabled
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {settings.enabled ? 'Enabled' : 'Hidden'}
            </button>
          </div>

          {/* Fallback Creative Copy Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900">Empty State: Creative Marketing Copy</p>
              <p className="text-[11px] text-slate-500">
                {settings.show_creative_banner
                  ? 'Show creative ad copy banner when 0 sliders exist'
                  : 'Hide section completely when 0 sliders exist'}
              </p>
            </div>
            <button
              disabled={savingSettings}
              onClick={() => updateSectionSettings({ show_creative_banner: !settings.show_creative_banner })}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                settings.show_creative_banner
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {settings.show_creative_banner ? 'Show Copy' : 'Hide Section'}
            </button>
          </div>
        </div>

        {/* Informative notification if 0 sliders */}
        {sliders.length === 0 && (
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-center gap-2.5 text-xs text-amber-900 font-semibold">
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>0 Promoted Sliders Added:</strong> The homepage is currently displaying the creative merchant spotlight banner (&quot;{settings.banner_headline}&quot;). Click &quot;Add Promoted Slider&quot; whenever you want to feature a brand card!
            </span>
          </div>
        )}
      </div>

      {/* Section Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap pb-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
          Filter Section:
        </span>
        {[
          { key: 'all', label: `All Sections (${sliders.length})` },
          {
            key: 'featured',
            label: `After Featured Listings (${sliders.filter((s) => s.section === 'featured').length})`,
          },
          {
            key: 'explore',
            label: `After Explore Calicut (${sliders.filter((s) => s.section === 'explore').length})`,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSectionFilter(tab.key as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              sectionFilter === tab.key
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DataTable<PromotedSlider>
        rows={filteredSliders}
        columns={columns}
        getRowId={(s: PromotedSlider) => s.id}
        loading={loading}
        emptyMessage="No promoted sliders currently added. The homepage is displaying the creative merchant spotlight banner. Click 'Add Promoted Slider' to create a card anytime."
        searchPlaceholder="Search by brand name, headline, or deal..."
        searchText={(s: PromotedSlider) => `${s.brandName} ${s.headline} ${s.dealHighlight} ${s.subtext} ${s.bottomStrip}`}
      />

      {/* EDIT CREATIVE COPY MODAL */}
      <Modal open={showCopyModal} onClose={() => setShowCopyModal(false)} size="lg">
        <div className="bg-white p-6 rounded-2xl space-y-5 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-lg font-black text-slate-900">Edit Creative Fallback Banner Copy</h3>
              <p className="text-xs text-slate-500">
                Customize the copy shown on the homepage when no individual merchant sliders are active.
              </p>
            </div>
            <button
              onClick={() => setShowCopyModal(false)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveCreativeCopy} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                Badge Text
              </label>
              <input
                value={editingCopy.banner_badge}
                onChange={(e) => setEditingCopy({ ...editingCopy, banner_badge: e.target.value })}
                className={inputClass}
                placeholder="e.g. FEATURE YOUR BUSINESS"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                Main Headline
              </label>
              <input
                value={editingCopy.banner_headline}
                onChange={(e) => setEditingCopy({ ...editingCopy, banner_headline: e.target.value })}
                className={inputClass}
                placeholder="e.g. Spotlight Your Brand Across Kozhikode"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                Subtext Description
              </label>
              <textarea
                rows={3}
                value={editingCopy.banner_subtext}
                onChange={(e) => setEditingCopy({ ...editingCopy, banner_subtext: e.target.value })}
                className="w-full p-2.5 text-sm rounded-xl border border-[#E5E7EB] bg-white text-[#111827] focus:border-[#2563EB] focus:outline-none"
                placeholder="Describe why merchants should promote on LiveCalicut..."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Primary Button Text
                </label>
                <input
                  value={editingCopy.banner_cta_text}
                  onChange={(e) => setEditingCopy({ ...editingCopy, banner_cta_text: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Promote Your Business"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Primary Button Link URL
                </label>
                <input
                  value={editingCopy.banner_cta_url}
                  onChange={(e) => setEditingCopy({ ...editingCopy, banner_cta_url: e.target.value })}
                  className={inputClass}
                  placeholder="/merchant or /advertise"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => setShowCopyModal(false)}
                className={secondaryButtonClass}
              >
                Cancel
              </button>
              <button type="submit" disabled={savingSettings} className={primaryButtonClass}>
                {savingSettings ? 'Saving...' : 'Save Creative Copy'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* CREATE & EDIT MODAL */}
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        size="lg"
      >
        {editing && (
          <div className="bg-white p-6 rounded-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editing.id ? 'Edit Promoted Slider' : 'Add New Promoted Slider'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure brand, offer details, bank strips, and placement on the 2x2 homepage carousels.
                </p>
              </div>
              <button
                onClick={() => setEditing(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Placement Section on Homepage *
                  </label>
                  <select
                    value={editing.section || 'featured'}
                    onChange={(e) => setEditing({ ...editing, section: e.target.value as any })}
                    className={inputClass}
                    required
                  >
                    <option value="featured">Section 1: After Featured Listings</option>
                    <option value="explore">Section 2: After Explore Calicut</option>
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Choose which homepage carousel this banner will appear in.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Brand / Business Name *
                  </label>
                  <input
                    required
                    value={editing.brandName || ''}
                    onChange={(e) => setEditing({ ...editing, brandName: e.target.value })}
                    placeholder="e.g. PARAGON RESTAURANT, HILITE MALL, ADIDAS"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Brand Tagline Pill
                  </label>
                  <input
                    value={editing.brandTag || ''}
                    onChange={(e) => setEditing({ ...editing, brandTag: e.target.value })}
                    placeholder="e.g. CALICUT ICON, PREMIER SHOPPING, SINCE 1949"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Badge Text (Top Right on Image)
                  </label>
                  <input
                    value={editing.badgeText || ''}
                    onChange={(e) => setEditing({ ...editing, badgeText: e.target.value })}
                    placeholder="e.g. BIG BANG SALE, FESTIVE OFFER, EXCLUSIVE"
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Main Headline *
                  </label>
                  <input
                    required
                    value={editing.headline || ''}
                    onChange={(e) => setEditing({ ...editing, headline: e.target.value })}
                    placeholder="e.g. Classic Malabar Biriyani & Seafood Feast"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Deal / Price Highlight Tag *
                  </label>
                  <input
                    required
                    value={editing.dealHighlight || ''}
                    onChange={(e) => setEditing({ ...editing, dealHighlight: e.target.value })}
                    placeholder="e.g. Flat 20% Off, Min. 50% Off, From ₹18,999"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Bank / Icon Pill Text
                  </label>
                  <input
                    value={editing.bankIconText || ''}
                    onChange={(e) => setEditing({ ...editing, bankIconText: e.target.value })}
                    placeholder="e.g. SBI / HDFC, NO-COST EMI, BEST RATE"
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Bottom Deal / Bank Offer Strip Text *
                  </label>
                  <input
                    required
                    value={editing.bottomStrip || ''}
                    onChange={(e) => setEditing({ ...editing, bottomStrip: e.target.value })}
                    placeholder="e.g. 10% Instant Discount on UPI & Card Orders"
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Subtext Description
                  </label>
                  <textarea
                    rows={2}
                    value={editing.subtext || ''}
                    onChange={(e) => setEditing({ ...editing, subtext: e.target.value })}
                    placeholder="e.g. Authentic Dum Biriyani & Karimeen Pollichathu delivered hot across Calicut"
                    className="w-full p-2.5 text-sm rounded-xl border border-[#E5E7EB] bg-white text-[#111827] focus:border-[#2563EB] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Image URL *
                  </label>
                  <input
                    required
                    value={editing.image || ''}
                    onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or /heroes/city-market.jpg"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Click URL / Destination Link
                  </label>
                  <input
                    value={editing.href || ''}
                    onChange={(e) => setEditing({ ...editing, href: e.target.value })}
                    placeholder="/business/paragon or /offers"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Phone Desk (Optional)
                  </label>
                  <input
                    value={editing.phone || ''}
                    onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                    placeholder="+91 495 276 8888"
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="sliderActive"
                    checked={editing.is_active !== false}
                    onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="sliderActive" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Publish this card live on the homepage carousel immediately
                  </label>
                </div>
              </div>

              {/* LIVE CARD PREVIEW (Luxury White Card) */}
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Live Card Preview (How it appears in 2x2 carousel):
                </p>
                <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-md overflow-hidden max-w-xl relative">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />
                  <div className="p-4 flex items-stretch justify-between gap-3 text-slate-900">
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-[11px] text-amber-700 uppercase tracking-wider">
                          {editing.brandName || 'BRAND NAME'}
                        </span>
                        {editing.brandTag && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200/60 text-[9px] font-bold">
                            {editing.brandTag}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-slate-900 line-clamp-2">
                        {editing.headline || 'Headline of the promotion appears here'}
                      </h4>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-xs font-black text-amber-800">
                        {editing.dealHighlight || 'Special Offer Highlight'}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {editing.subtext || 'Brief details and delivery / guarantee info'}
                      </p>
                    </div>
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={editing.image || '/heroes/city-market.jpg'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {editing.badgeText && (
                        <span className="absolute top-1 right-1 px-1 py-0.2 rounded bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[8px] uppercase">
                          {editing.badgeText}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-50 px-3.5 py-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      {editing.bankIconText && (
                        <span className="px-1 py-0.2 rounded bg-white text-slate-950 font-black text-[9px] uppercase border border-slate-200">
                          {editing.bankIconText}
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-slate-700 truncate">
                        {editing.bottomStrip || '10% Instant Bank Discount'}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-500 font-black text-[9px] border border-slate-300/60">
                      AD
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className={secondaryButtonClass}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={primaryButtonClass}
                >
                  {saving ? 'Saving...' : editing.id ? 'Save Changes' : 'Create Promoted Slider'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* VIEW DETAILS MODAL */}
      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        size="md"
      >
        {viewing && (
          <div className="bg-white p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900">Promoted Slider Preview</h3>
              <button
                onClick={() => setViewing(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-md overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />
              <div className="p-4 flex items-stretch justify-between gap-3 text-slate-900">
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-amber-700 uppercase tracking-wider">
                      {viewing.brandName}
                    </span>
                    {viewing.brandTag && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200/60 text-[9px] font-bold">
                        {viewing.brandTag}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-black text-slate-900">{viewing.headline}</h4>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-xs font-black text-amber-800">
                    {viewing.dealHighlight}
                  </div>
                  <p className="text-xs text-slate-500">{viewing.subtext}</p>
                </div>
                <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={viewing.image} alt="" className="w-full h-full object-cover" />
                  {viewing.badgeText && (
                    <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[9px] uppercase">
                      {viewing.badgeText}
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {viewing.bankIconText && (
                    <span className="px-1.5 py-0.2 rounded bg-white text-slate-950 font-black text-[9px] uppercase border border-slate-200">
                      {viewing.bankIconText}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-slate-700">
                    {viewing.bottomStrip}
                  </span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-500 font-black text-[9px] border border-slate-300/60">
                  AD
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-500 uppercase block">Placement</span>
                <span className="font-bold text-slate-900">
                  {viewing.section === 'featured' ? 'After Featured Listings' : 'After Explore Calicut'}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase block">Status</span>
                <span className="font-bold text-slate-900">
                  {viewing.is_active ? 'Active & Live' : 'Inactive / Draft'}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase block">Destination Link</span>
                <Link href={viewing.href} target="_blank" className="text-blue-600 font-bold underline truncate block">
                  {viewing.href}
                </Link>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase block">Contact Phone</span>
                <span className="font-bold text-slate-900">{viewing.phone || 'None'}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const s = viewing;
                  setViewing(null);
                  setEditing(s);
                }}
                className={primaryButtonClass}
              >
                <Edit2 className="w-4 h-4" /> Edit this Slider
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
