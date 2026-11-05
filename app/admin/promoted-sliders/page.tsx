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
  CheckCircle2,
  X,
  Layers,
  ArrowRight,
  Phone,
  Image as ImageIcon,
  Settings2,
  FileText,
  RotateCcw,
} from 'lucide-react';
import {
  AdminPageHeader,
  DataTable,
  IconButton,
  Modal,
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
  image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1600&auto=format&fit=crop&q=80',
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
      'Put your business directly in front of 50,000+ verified Kozhikode shoppers, diners & clients daily. Prime full-width banner visibility with direct WhatsApp leads.',
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
      toast.success('Homepage banner settings saved!');
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
      toast.success(nextState ? 'Banner activated' : 'Banner deactivated');
    } catch (err: any) {
      setSliders(prev);
      toast.error('Failed to update status', err.message);
    }
  };

  const deleteSlider = async (id: string) => {
    if (!confirm('Are you sure you want to remove this promotional banner?')) return;
    const prev = sliders;
    setSliders(sliders.filter((s) => s.id !== id));

    try {
      const res = await fetch(`/api/v1/admin/promoted-sliders?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Delete failed');
      toast.success('Promotional banner deleted successfully');
    } catch (err: any) {
      setSliders(prev);
      toast.error('Failed to delete banner', err.message);
    }
  };

  const clearAllSliders = async () => {
    if (
      !confirm(
        'Are you sure you want to delete ALL banners? The homepage will immediately display the creative spotlight banner.'
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
      toast.success('All banners removed! Creative banner copy is now active.');
    } catch (err: any) {
      toast.error('Failed to clear banners', err.message);
    } finally {
      setLoading(false);
    }
  };

  const seedSampleSliders = async () => {
    if (!confirm('Seed demo full-width banners? This will add sample promotional banners to test the 2-second slider.')) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/promoted-sliders?action=seed', { method: 'POST' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Seed failed');
      setSliders(json.sliders || []);
      toast.success('Sample promotional banners loaded successfully!');
    } catch (err: any) {
      toast.error('Failed to seed banners', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.image?.trim()) {
      toast.error('Validation Error', 'Banner image URL is required.');
      return;
    }

    setSaving(true);
    try {
      const isNew = !editing.id;
      const res = await fetch('/api/v1/admin/promoted-sliders', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editing,
          brandName: editing.brandName || 'PROMOTED BRAND',
          headline: editing.headline || 'Special Festive Promotion',
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Save failed');

      toast.success(isNew ? 'Promotional banner created!' : 'Promotional banner updated!');
      setEditing(null);
      loadSliders();
    } catch (err: any) {
      toast.error('Could not save banner', err.message);
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
      header: 'Full Banner Preview',
      sortValue: (s) => s.brandName,
      cell: (s) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-28 h-14 rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shrink-0 aspect-[16/8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt={s.brandName} className="w-full h-full object-cover" />
            <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-black/80 text-[8px] font-black text-amber-400 rounded">
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
            {s.dealHighlight && (
              <p className="text-[11px] text-amber-600 font-bold truncate">{s.dealHighlight}</p>
            )}
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
      key: 'href',
      header: 'Target Link',
      hideOnMobile: true,
      cell: (s) => (
        <div className="text-xs text-[#111827] max-w-xs truncate">
          <Link href={s.href} target="_blank" className="text-blue-600 hover:underline font-semibold">
            {s.href}
          </Link>
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
          <IconButton label="Preview banner" onClick={() => setViewing(s)}>
            <Eye className="w-4 h-4" />
          </IconButton>
          <IconButton label="Edit banner" onClick={() => setEditing(s)}>
            <Edit2 className="w-4 h-4" />
          </IconButton>
          <IconButton label="Delete banner" tone="danger" onClick={() => deleteSlider(s.id)}>
            <Trash2 className="w-4 h-4" />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Promoted Banner Carousels"
        description="Upload and manage full-width Flipkart/Amazon style advertising banners that automatically slide from right to left every 2 seconds."
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
              <Plus className="h-4 w-4" /> Add Full Banner
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
                Homepage Banner Carousel Controls (2-Sec Auto Slide)
              </h3>
              <p className="text-xs text-slate-500">
                Control banner visibility on live site and customize the creative fallback banner shown when no custom banners are added.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => {
                setEditingCopy(settings);
                setShowCopyModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Edit Creative Banner Copy</span>
            </button>

            {sliders.length > 0 ? (
              <button
                onClick={clearAllSliders}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete All Banners</span>
              </button>
            ) : (
              <button
                onClick={seedSampleSliders}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Seed Sample Banners</span>
              </button>
            )}
          </div>
        </div>

        {/* 2 Interactive Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Master Section Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900">Homepage Banner Carousel Master Switch</p>
              <p className="text-[11px] text-slate-500">
                {settings.enabled
                  ? 'Active on homepage (slides banners or creative banner every 2s)'
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
              <p className="text-xs font-bold text-slate-900">Empty State: Creative Ad Banner</p>
              <p className="text-[11px] text-slate-500">
                {settings.show_creative_banner
                  ? 'Show creative full-width banner when 0 custom banners exist'
                  : 'Hide section completely when 0 custom banners exist'}
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
              {settings.show_creative_banner ? 'Show Creative Banner' : 'Hide Section'}
            </button>
          </div>
        </div>

        {/* Informative notification if 0 sliders */}
        {sliders.length === 0 && (
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-center gap-2.5 text-xs text-amber-900 font-semibold">
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>0 Custom Banners Added:</strong> The homepage is currently displaying the creative full-width spotlight banner (&quot;{settings.banner_headline}&quot;). Click &quot;Add Full Banner&quot; or &quot;Seed Sample Banners&quot; to test the 2-second slider!
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
          { key: 'all', label: `All Banners (${sliders.length})` },
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
        emptyMessage="No promotional banners currently added. The homepage is displaying the creative full-width spotlight banner. Click 'Add Full Banner' to upload a banner anytime."
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
                Customize the copy shown in the full-width creative banner when no individual banners are added.
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
                {savingSettings ? 'Saving...' : 'Save Creative Banner'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* CREATE & EDIT BANNER MODAL */}
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
                  {editing.id ? 'Edit Full Promotional Banner' : 'Add New Full Promotional Banner'}
                </h3>
                <p className="text-xs text-slate-500">
                  Upload wide Flipkart/Amazon style banner images that auto-slide right to left every 2 seconds.
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
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Banner Image URL (Full Graphic Banner) *
                  </label>
                  <input
                    required
                    value={editing.image || ''}
                    onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... (Recommended: 1600x600 or 1200x500)"
                    className={inputClass}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Upload a wide banner image just like Flipkart / Amazon promo banners.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Target Link URL (When clicked) *
                  </label>
                  <input
                    required
                    value={editing.href || ''}
                    onChange={(e) => setEditing({ ...editing, href: e.target.value })}
                    placeholder="/business/paragon or WhatsApp link"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Placement Section *
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Brand / Merchant Name (Alt text & Caption)
                  </label>
                  <input
                    value={editing.brandName || ''}
                    onChange={(e) => setEditing({ ...editing, brandName: e.target.value })}
                    placeholder="e.g. PARAGON RESTAURANT, HILITE MALL"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Badge Tag (e.g. BIG BANG, FESTIVE)
                  </label>
                  <input
                    value={editing.badgeText || ''}
                    onChange={(e) => setEditing({ ...editing, badgeText: e.target.value })}
                    placeholder="e.g. BIG BANG SALE, FESTIVE OFFER"
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Headline (Optional text overlay)
                  </label>
                  <input
                    value={editing.headline || ''}
                    onChange={(e) => setEditing({ ...editing, headline: e.target.value })}
                    placeholder="Leave empty if banner image already has headline graphic"
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
                    Publish this banner live in the 2-second carousel immediately
                  </label>
                </div>
              </div>

              {/* LIVE FULL BANNER PREVIEW (Flipkart Style) */}
              <div className="pt-2 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Live Banner Preview (Flipkart / Amazon Full-Width Style):
                </p>
                <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/90 shadow-md aspect-[16/7] sm:aspect-[21/8] min-h-[160px] max-w-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editing.image || 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1600&auto=format&fit=crop&q=80'}
                    alt=""
                    className="w-full h-full object-cover object-center"
                  />
                  {editing.badgeText && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[9px] uppercase tracking-wider shadow">
                      {editing.badgeText}
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.2 rounded bg-black/70 text-white/90 font-black text-[9px] tracking-wider uppercase border border-white/20">
                    AD
                  </span>
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
                  {saving ? 'Saving...' : editing.id ? 'Save Changes' : 'Create Promotional Banner'}
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
        size="lg"
      >
        {viewing && (
          <div className="bg-white p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900">Promotional Banner Preview</h3>
              <button
                onClick={() => setViewing(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/90 shadow-md aspect-[16/7] sm:aspect-[21/8]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={viewing.image} alt="" className="w-full h-full object-cover" />
              {viewing.badgeText && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-amber-500 text-white font-black text-[10px] uppercase">
                  {viewing.badgeText}
                </span>
              )}
              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-white font-black text-[10px] border border-white/20">
                AD
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-500 uppercase block">Brand Name</span>
                <span className="font-bold text-slate-900">{viewing.brandName}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase block">Placement</span>
                <span className="font-bold text-slate-900">
                  {viewing.section === 'featured' ? 'After Featured Listings' : 'After Explore Calicut'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-bold text-slate-500 uppercase block">Destination Link</span>
                <Link href={viewing.href} target="_blank" className="text-blue-600 font-bold underline truncate block">
                  {viewing.href}
                </Link>
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
                <Edit2 className="w-4 h-4" /> Edit this Banner
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
