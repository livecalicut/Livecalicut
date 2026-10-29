'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Plus, Star, XCircle } from 'lucide-react';
import { fetchAdminMarketplaceAction } from './actions';
import {
  AdminEntityTable,
  AdminPageHeader,
  IconButton,
  StatusBadge,
  formatDate,
  primaryButtonClass,
  type Column,
  type TableFilter,
} from '@/components/admin/data-table';
import { adminApi } from '@/lib/admin/client';
import { toast } from '@/lib/toast';

type Listing = {
  id: string;
  title: string;
  price: number | string | null;
  status: string;
  condition?: string | null;
  is_featured: boolean;
  is_negotiable?: boolean;
  cover_image?: string | null;
  created_at: string;
  seller_profiles?: { full_name: string } | null;
  marketplace_categories?: { name: string } | null;
  areas?: { name: string } | null;
  [key: string]: any;
};

// The marketplace tables may not be migrated yet; treat that as "no data".
const isMissingTable = (msg?: string) => !!msg && /does not exist|schema cache|could not find/i.test(msg);

const formatPrice = (v: Listing['price']) =>
  v === null || v === undefined || v === '' ? '—' : `₹${Number(v).toLocaleString('en-IN')}`;

const humanize = (v?: string | null) => (v ? v.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '');

const columns: Column<Listing>[] = [
  {
    key: 'title',
    header: 'Listing',
    sortValue: (l) => l.title,
    cell: (l) => (
      <div className="flex min-w-0 items-center gap-3">
        {l.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={l.cover_image} alt="" className="h-10 w-10 shrink-0 rounded-lg border border-[#E5E7EB] object-cover" />
        ) : (
          <div className="h-10 w-10 shrink-0 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC]" />
        )}
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate font-semibold text-[#111827]">
            {l.title}
            {l.is_featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
          </p>
          <p className="text-[11px] text-[#6B7280]">{l.marketplace_categories?.name || 'Uncategorized'}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'price',
    header: 'Price',
    sortValue: (l) => Number(l.price) || 0,
    cell: (l) => <span className="font-semibold text-[#111827]">{formatPrice(l.price)}</span>,
  },
  {
    key: 'seller',
    header: 'Seller',
    hideOnMobile: true,
    sortValue: (l) => l.seller_profiles?.full_name,
    cell: (l) => l.seller_profiles?.full_name || '—',
  },
  {
    key: 'area',
    header: 'Area',
    hideOnMobile: true,
    sortValue: (l) => l.areas?.name,
    cell: (l) => l.areas?.name || '—',
  },
  { key: 'status', header: 'Status', sortValue: (l) => l.status, cell: (l) => <StatusBadge status={l.status} /> },
  {
    key: 'created_at',
    header: 'Listed',
    hideOnMobile: true,
    sortValue: (l) => l.created_at,
    cell: (l) => formatDate(l.created_at),
  },
];

const filters: TableFilter<Listing>[] = [
  {
    key: 'status',
    label: 'Statuses',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'sold', label: 'Sold' },
      { value: 'archived', label: 'Archived' },
    ],
    match: (l, v) => l.status === v,
  },
  {
    key: 'condition',
    label: 'Conditions',
    options: ['brand_new', 'like_new', 'used_good', 'used_fair'].map((value) => ({ value, label: humanize(value) })),
    match: (l, v) => l.condition === v,
  },
  {
    key: 'featured',
    label: 'Listings',
    options: [
      { value: 'featured', label: 'Featured' },
      { value: 'standard', label: 'Standard' },
    ],
    match: (l, v) => (v === 'featured' ? l.is_featured : !l.is_featured),
  },
];

export default function AdminMarketplacePage() {
  const [rows, setRows] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  const load = useCallback(async () => {
    const res = await fetchAdminMarketplaceAction();
    if (res.success) {
      setRows((res.data as Listing[]) || []);
      setUnavailable(false);
    } else if (isMissingTable(res.error)) {
      setRows([]);
      setUnavailable(true);
    } else {
      toast.error('Could not load listings', res.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const moderate = async (l: Listing, action: 'approve' | 'reject' | 'feature' | 'unfeature') => {
    try {
      await adminApi.moderate('marketplace', l.id, action);
      toast.success('Listing updated', l.title);
      await load();
    } catch (err) {
      toast.error('Action failed', err instanceof Error ? err.message : undefined);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Marketplace"
        description="Review buy & sell listings, take down reported items and feature good deals."
        count={rows.length}
        actions={
          <Link href="/marketplace/create" className={primaryButtonClass}>
            <Plus className="h-4 w-4" /> Add listing
          </Link>
        }
      />

      <AdminEntityTable<Listing>
        entityType="marketplace"
        rows={rows}
        loading={loading}
        reload={load}
        columns={columns}
        filters={filters}
        imageKeys={['cover_image', 'gallery']}
        searchText={(l) =>
          `${l.title} ${l.seller_profiles?.full_name ?? ''} ${l.marketplace_categories?.name ?? ''} ${l.areas?.name ?? ''}`
        }
        searchPlaceholder="Search title, seller, category…"
        emptyMessage={
          unavailable ? 'The marketplace is not set up yet. Listings will appear here once it is enabled.' : 'No listings yet.'
        }
        titleOf={(l) => l.title}
        subtitleOf={(l) => <StatusBadge status={l.status} />}
        extraViewFields={(l) => [
          { label: 'Category', value: l.marketplace_categories?.name },
          { label: 'Seller', value: l.seller_profiles?.full_name },
          { label: 'Area', value: l.areas?.name },
          { label: 'Listed', value: formatDate(l.created_at, true) },
        ]}
        rowActions={(l) => (
          <>
            {l.status !== 'active' && (
              <IconButton label="Approve" onClick={() => moderate(l, 'approve')}>
                <CheckCircle2 className="h-4 w-4" />
              </IconButton>
            )}
            {l.status === 'active' && (
              <IconButton label="Take down" tone="danger" onClick={() => moderate(l, 'reject')}>
                <XCircle className="h-4 w-4" />
              </IconButton>
            )}
            <IconButton
              label={l.is_featured ? 'Remove from featured' : 'Feature'}
              onClick={() => moderate(l, l.is_featured ? 'unfeature' : 'feature')}
            >
              <Star className={`h-4 w-4 ${l.is_featured ? 'fill-amber-400 text-amber-400' : ''}`} />
            </IconButton>
          </>
        )}
      />
    </>
  );
}
