'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, Star, X } from 'lucide-react';
import { fetchAdminPlacesAction } from './actions';
import {
  AdminEntityTable,
  AdminPageHeader,
  Modal,
  StatusBadge,
  formatDate,
  primaryButtonClass,
  secondaryButtonClass,
  type Column,
  type TableFilter,
} from '@/components/admin/data-table';
import { toast } from '@/lib/toast';

type Place = {
  id: string;
  title?: string | null;
  name?: string | null;
  status: string;
  is_featured?: boolean;
  is_free_entry?: boolean;
  entry_fee?: number | string | null;
  opening_hours?: string | null;
  rating_avg?: number | string | null;
  cover_image?: string | null;
  created_at: string;
  place_categories?: { name: string } | null;
  areas?: { name: string } | null;
  [key: string]: any;
};

// The Explore tables may not be migrated yet; treat that as "no data".
const isMissingTable = (msg?: string) => !!msg && /does not exist|schema cache|could not find/i.test(msg);

const placeName = (p: Place) => p.title || p.name || 'Untitled place';

const entryFee = (p: Place) => {
  if (p.is_free_entry || p.entry_fee === 0 || p.entry_fee === '0') return 'Free';
  if (p.entry_fee === null || p.entry_fee === undefined || p.entry_fee === '') return '—';
  return Number.isFinite(Number(p.entry_fee)) ? `₹${Number(p.entry_fee).toLocaleString('en-IN')}` : String(p.entry_fee);
};

const columns: Column<Place>[] = [
  {
    key: 'title',
    header: 'Place',
    sortValue: (p) => placeName(p),
    cell: (p) => (
      <div className="flex min-w-0 items-center gap-3">
        {p.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.cover_image} alt="" className="h-10 w-10 shrink-0 rounded-lg border border-[#E5E7EB] object-cover" />
        ) : (
          <div className="h-10 w-10 shrink-0 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC]" />
        )}
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate font-semibold text-[#111827]">
            {placeName(p)}
            {p.is_featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
          </p>
          <p className="text-[11px] text-[#6B7280]">{p.place_categories?.name || 'Uncategorized'}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'area',
    header: 'Area',
    hideOnMobile: true,
    sortValue: (p) => p.areas?.name ?? p.location,
    cell: (p) => p.areas?.name || p.location || '—',
  },
  { key: 'entry_fee', header: 'Entry', hideOnMobile: true, cell: entryFee },
  {
    key: 'rating',
    header: 'Rating',
    hideOnMobile: true,
    sortValue: (p) => Number(p.rating_avg) || 0,
    cell: (p) => (Number(p.rating_avg) > 0 ? Number(p.rating_avg).toFixed(1) : '—'),
  },
  { key: 'status', header: 'Status', sortValue: (p) => p.status, cell: (p) => <StatusBadge status={p.status} /> },
  {
    key: 'created_at',
    header: 'Added',
    hideOnMobile: true,
    sortValue: (p) => p.created_at,
    cell: (p) => formatDate(p.created_at),
  },
];

const PLACE_CATEGORIES = [
  'Beaches & Waterfronts',
  'Historical Sites & Forts',
  'Heritage Landmarks',
  'Nature & Eco Tourism',
  'Shopping & Markets',
  'Religious & Spiritual',
  'Parks & Gardens',
  'Museums & Art Galleries',
  'Food & Culinary Tourism',
  'Adventure & Sports',
  'Waterfalls & Hills',
  'Family & Kids',
];

const EMPTY_FORM = {
  name: '',
  category: PLACE_CATEGORIES[0],
  location: '',
  address: '',
  description: '',
  open_hours: '',
  entry_fee: '',
  best_time_to_visit: '',
  phone: '',
  website: '',
  tips: '',
};

const inputClass =
  'h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:outline-none';
const labelClass = 'mb-1 block text-xs font-semibold text-[#374151]';

export default function AdminTourismPage() {
  const [rows, setRows] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = useCallback(async () => {
    const res = await fetchAdminPlacesAction();
    if (res.success) {
      setRows((res.data as Place[]) || []);
      setUnavailable(false);
    } else if (isMissingTable(res.error)) {
      setRows([]);
      setUnavailable(true);
    } else {
      toast.error('Could not load places', res.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filters = useMemo<TableFilter<Place>[]>(() => {
    const categories = Array.from(
      new Set(rows.map((p) => p.place_categories?.name).filter((n): n is string => !!n))
    ).sort();
    return [
      {
        key: 'status',
        label: 'Statuses',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
        match: (p, v) => p.status === v,
      },
      {
        key: 'category',
        label: 'Categories',
        options: categories.map((c) => ({ value: c, label: c })),
        match: (p, v) => p.place_categories?.name === v,
      },
      {
        key: 'featured',
        label: 'Listings',
        options: [
          { value: 'featured', label: 'Featured' },
          { value: 'standard', label: 'Standard' },
        ],
        match: (p, v) => (v === 'featured' ? !!p.is_featured : !p.is_featured),
      },
    ];
  }, [rows]);

  const set = (key: keyof typeof EMPTY_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const closeAdd = () => {
    setAdding(false);
    setForm(EMPTY_FORM);
  };

  const addPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim()) {
      toast.warning('Missing details', 'Place name and location are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) throw new Error(json.message || 'Could not add place');
      toast.success('Place added', form.name);
      closeAdd();
      await load();
    } catch (err) {
      toast.error('Could not add place', err instanceof Error ? err.message : undefined);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Tourism"
        description="Manage attractions, heritage sites and destinations shown on the Explore pages."
        count={rows.length}
        actions={
          <button type="button" onClick={() => setAdding(true)} className={primaryButtonClass}>
            <Plus className="h-4 w-4" /> Add place
          </button>
        }
      />

      <AdminEntityTable<Place>
        entityType="place"
        rows={rows}
        loading={loading}
        reload={load}
        columns={columns}
        filters={filters}
        imageKeys={['cover_image', 'gallery']}
        searchText={(p) => `${placeName(p)} ${p.place_categories?.name ?? ''} ${p.areas?.name ?? ''} ${p.location ?? ''}`}
        searchPlaceholder="Search place, category, area…"
        emptyMessage={
          unavailable
            ? 'Explore listings are not set up yet. Places will appear here once they are enabled.'
            : 'No places yet.'
        }
        titleOf={placeName}
        subtitleOf={(p) => <StatusBadge status={p.status} />}
        extraViewFields={(p) => [
          { label: 'Category', value: p.place_categories?.name },
          { label: 'Area', value: p.areas?.name || p.location },
          { label: 'Rating', value: Number(p.rating_avg) > 0 ? Number(p.rating_avg).toFixed(1) : undefined },
          { label: 'Added', value: formatDate(p.created_at, true) },
        ]}
      />

      <Modal open={adding} onClose={submitting ? () => {} : closeAdd} size="lg" labelledBy="add-place-title">
        <form onSubmit={addPlace} className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
            <h2 id="add-place-title" className="text-base font-bold text-[#111827]">
              Add place
            </h2>
            <button
              type="button"
              onClick={closeAdd}
              aria-label="Close"
              className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F1F5F9]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 overflow-y-auto px-6 py-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Place name *</label>
              <input value={form.name} onChange={set('name')} placeholder="e.g. Calicut Beach" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.category} onChange={set('category')} className={inputClass}>
                {PLACE_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Area / locality *</label>
              <input value={form.location} onChange={set('location')} placeholder="e.g. Beach Road" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Full address</label>
              <input value={form.address} onChange={set('address')} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={set('description')}
                className={`${inputClass} h-auto resize-none py-2`}
              />
            </div>
            <div>
              <label className={labelClass}>Opening hours</label>
              <input value={form.open_hours} onChange={set('open_hours')} placeholder="6:00 AM – 9:00 PM" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Entry fee</label>
              <input value={form.entry_fee} onChange={set('entry_fee')} placeholder="Free / ₹20" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Best time to visit</label>
              <input value={form.best_time_to_visit} onChange={set('best_time_to_visit')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Contact phone</label>
              <input type="tel" value={form.phone} onChange={set('phone')} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Website / Google Maps link</label>
              <input type="url" value={form.website} onChange={set('website')} placeholder="https://…" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Visitor tips</label>
              <textarea rows={2} value={form.tips} onChange={set('tips')} className={`${inputClass} h-auto resize-none py-2`} />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#E5E7EB] px-6 py-4">
            <button type="button" onClick={closeAdd} className={secondaryButtonClass}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className={primaryButtonClass}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {submitting ? 'Adding…' : 'Add place'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
