'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ExternalLink,
  Store,
  Clock,
  Sparkles,
  Percent,
  CheckCircle2,
  X,
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
import { Offer } from '@/lib/services/offers.service';

const inputClass =
  'h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:outline-none';

const EMPTY_OFFER: Partial<Offer> = {
  title: '',
  business_name: '',
  discount: '',
  code: '',
  category: 'Retail & Shopping',
  location: 'Calicut',
  valid_till: 'Ongoing',
  link: '/business',
  description: '',
  is_active: true,
  is_featured: false,
};

const CATEGORIES = [
  'Retail & Shopping',
  'Dining & Cafés',
  'Healthcare & Clinics',
  'Lifestyle & Wellness',
  'Home & Interior',
  'Education & Training',
  'Automotive',
  'Professional Services',
];

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Partial<Offer> | null>(null);
  const [viewing, setViewing] = useState<Offer | null>(null);

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/admin/offers');
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to load offers');
      }
      setOffers(json.offers || []);
    } catch (err: any) {
      toast.error('Could not load offers', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const toggleActive = async (offer: Offer) => {
    const nextState = !offer.is_active;
    const prev = offers;
    setOffers(offers.map((o) => (o.id === offer.id ? { ...o, is_active: nextState } : o)));

    try {
      const res = await fetch('/api/v1/admin/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: offer.id, is_active: nextState }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Update failed');
      toast.success(nextState ? 'Offer activated' : 'Offer deactivated');
    } catch (err: any) {
      setOffers(prev);
      toast.error('Failed to toggle status', err.message);
    }
  };

  const deleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this offer?')) return;
    const prev = offers;
    setOffers(offers.filter((o) => o.id !== id));

    try {
      const res = await fetch(`/api/v1/admin/offers?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Delete failed');
      toast.success('Offer deleted');
    } catch (err: any) {
      setOffers(prev);
      toast.error('Failed to delete offer', err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.title || !editing.business_name || !editing.discount) {
      toast.error('Please fill required fields', 'Title, Merchant Name, and Discount are required.');
      return;
    }

    setSaving(true);
    try {
      const isExisting = Boolean(editing.id);
      const res = await fetch('/api/v1/admin/offers', {
        method: isExisting ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Save failed');

      toast.success(isExisting ? 'Offer updated successfully' : 'Offer created successfully');
      setEditing(null);
      loadOffers();
    } catch (err: any) {
      toast.error('Failed to save offer', err.message);
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<Offer>[] = [
    {
      key: 'business',
      header: 'Merchant & Offer',
      cell: (item) => (
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Store className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
            <span className="truncate">{item.business_name}</span>
          </div>
          <p className="truncate text-xs font-semibold text-slate-700">{item.title}</p>
          <p className="text-[11px] text-slate-400">{item.location}</p>
        </div>
      ),
    },
    {
      key: 'discount',
      header: 'Discount & Code',
      cell: (item) => (
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 font-extrabold text-xs">
            <Percent className="w-3 h-3" /> {item.discount}
          </span>
          {item.code && (
            <p className="font-mono text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              CODE: {item.code}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'valid_till',
      header: 'Validity',
      hideOnMobile: true,
      cell: (item) => (
        <span className="flex items-center gap-1 text-xs text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          {item.valid_till || 'Ongoing'}
        </span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      hideOnMobile: true,
      cell: (item) => (
        <span className="text-xs font-medium text-slate-600">{item.category}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (item) => (
        <StatusBadge
          status={item.is_active ? 'Active' : 'Inactive'}
          tone={item.is_active ? 'green' : 'gray'}
        />
      ),
    },
  ];

  const activeCount = offers.filter((o) => o.is_active).length;

  return (
    <>
      <AdminPageHeader
        title="Offers & Discounts"
        description="Manage promotional vouchers, seasonal discounts, and merchant deals shown to Calicut residents."
        count={offers.length}
        actions={
          <button
            type="button"
            onClick={() => setEditing({ ...EMPTY_OFFER })}
            className={primaryButtonClass}
          >
            <Plus className="h-4 w-4" /> Add Offer
          </button>
        }
      />

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Deals</p>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">{offers.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Live Active Deals</p>
            <h3 className="text-xl font-extrabold text-emerald-600 mt-0.5">{activeCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Public Live URL</p>
            <a
              href="/offers"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline mt-1"
            >
              <span>View /offers Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* DataTable */}
      <DataTable<Offer>
        rows={offers}
        columns={columns}
        getRowId={(item) => item.id}
        loading={loading}
        emptyMessage="No offers found. Click 'Add Offer' above to publish your first merchant deal."
        rowLabel={(item) => item.title}
        onView={setViewing}
        onEdit={(item) => setEditing({ ...item })}
        onDelete={(item) => deleteOffer(item.id)}
        rowActions={(item) => (
          <>
            <IconButton
              label={item.is_active ? 'Deactivate' : 'Activate'}
              onClick={() => toggleActive(item)}
            >
              {item.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </IconButton>
          </>
        )}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        size="md"
        labelledBy="offer-modal-title"
      >
        {editing && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
              <h2 id="offer-modal-title" className="text-base font-bold text-[#111827]">
                {editing.id ? 'Edit Offer' : 'Create New Merchant Offer'}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F1F5F9]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 space-y-4 text-sm max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Merchant / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.business_name || ''}
                    onChange={(e) => setEditing({ ...editing, business_name: e.target.value })}
                    placeholder="e.g. Ziacare, Decolink Interio"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Offer Title / Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.title || ''}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder="e.g. Flat 20% Off on Premium Sanitary Pads"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discount Badge Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.discount || ''}
                    onChange={(e) => setEditing({ ...editing, discount: e.target.value })}
                    placeholder="e.g. 20% OFF or FREE CONSULT"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Promo Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={editing.code || ''}
                    onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. ZIA2026"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editing.category || CATEGORIES[0]}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className={inputClass}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Locality / Ward
                  </label>
                  <input
                    type="text"
                    value={editing.location || ''}
                    onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                    placeholder="e.g. Elathur, Nadakkavu, Calicut"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Validity</label>
                  <input
                    type="text"
                    value={editing.valid_till || ''}
                    onChange={(e) => setEditing({ ...editing, valid_till: e.target.value })}
                    placeholder="e.g. Valid till 30 Nov 2026"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Link / Store URL
                  </label>
                  <input
                    type="text"
                    value={editing.link || ''}
                    onChange={(e) => setEditing({ ...editing, link: e.target.value })}
                    placeholder="e.g. /business/ziacare"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Offer Description & Terms
                </label>
                <textarea
                  rows={3}
                  value={editing.description || ''}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Mention terms, counter redemption details, or applicable items..."
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white p-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={editing.is_active !== false}
                    onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                    className="rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB] h-4 w-4"
                  />
                  <span>Active &amp; Visible to Citizens</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(editing.is_featured)}
                    onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                    className="rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB] h-4 w-4"
                  />
                  <span>Featured Deal</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#E5E7EB] px-6 py-4">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className={secondaryButtonClass}
              >
                Cancel
              </button>
              <button type="submit" disabled={saving} className={primaryButtonClass}>
                {saving ? 'Saving...' : editing.id ? 'Save Changes' : 'Create Offer'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        size="sm"
        labelledBy="offer-view-title"
      >
        {viewing && (
          <>
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
              <h2 id="offer-view-title" className="text-base font-bold text-[#111827]">
                {viewing.title}
              </h2>
              <button
                type="button"
                onClick={() => setViewing(null)}
                aria-label="Close"
                className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F1F5F9]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <dl className="grid grid-cols-3 gap-x-4 gap-y-3 px-6 py-5 text-sm">
              <dt className="text-xs font-bold text-[#6B7280]">Merchant</dt>
              <dd className="col-span-2 font-semibold text-[#111827]">{viewing.business_name}</dd>
              <dt className="text-xs font-bold text-[#6B7280]">Discount</dt>
              <dd className="col-span-2 font-bold text-rose-600">{viewing.discount}</dd>
              <dt className="text-xs font-bold text-[#6B7280]">Promo Code</dt>
              <dd className="col-span-2 font-mono font-bold text-[#111827]">
                {viewing.code || 'None'}
              </dd>
              <dt className="text-xs font-bold text-[#6B7280]">Locality</dt>
              <dd className="col-span-2 text-[#111827]">{viewing.location}</dd>
              <dt className="text-xs font-bold text-[#6B7280]">Validity</dt>
              <dd className="col-span-2 text-[#111827]">{viewing.valid_till}</dd>
              <dt className="text-xs font-bold text-[#6B7280]">Link</dt>
              <dd className="col-span-2 break-all text-[#2563EB]">{viewing.link}</dd>
              <dt className="text-xs font-bold text-[#6B7280]">Status</dt>
              <dd className="col-span-2">
                <StatusBadge
                  status={viewing.is_active ? 'Active' : 'Inactive'}
                  tone={viewing.is_active ? 'green' : 'gray'}
                />
              </dd>
            </dl>
          </>
        )}
      </Modal>
    </>
  );
}

