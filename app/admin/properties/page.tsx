'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Plus, Star, XCircle } from 'lucide-react';
import { fetchAdminPropertiesAction } from './actions';
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

type Property = {
  id: string;
  title: string;
  price: number | string | null;
  status: string;
  listing_type?: string | null;
  bedrooms?: number | null;
  area_sqft?: number | null;
  is_featured: boolean;
  cover_image?: string | null;
  created_at: string;
  profiles?: { full_name: string } | null;
  property_categories?: { name: string } | null;
  areas?: { name: string } | null;
  [key: string]: any;
};

// The property tables may not be migrated yet; treat that as "no data".
const isMissingTable = (msg?: string) => !!msg && /does not exist|schema cache|could not find/i.test(msg);

const formatPrice = (v: Property['price']) =>
  v === null || v === undefined || v === '' ? '—' : `₹${Number(v).toLocaleString('en-IN')}`;

const humanize = (v?: string | null) => (v ? v.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '');

const columns: Column<Property>[] = [
  {
    key: 'title',
    header: 'Property',
    sortValue: (p) => p.title,
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
            {p.title}
            {p.is_featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
          </p>
          <p className="text-[11px] text-[#6B7280]">
            {[p.property_categories?.name, humanize(p.listing_type)].filter(Boolean).join(' · ') || 'Uncategorized'}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: 'price',
    header: 'Price',
    sortValue: (p) => Number(p.price) || 0,
    cell: (p) => <span className="font-semibold text-[#111827]">{formatPrice(p.price)}</span>,
  },
  {
    key: 'area',
    header: 'Area',
    hideOnMobile: true,
    sortValue: (p) => p.areas?.name,
    cell: (p) => p.areas?.name || '—',
  },
  {
    key: 'owner',
    header: 'Owner',
    hideOnMobile: true,
    sortValue: (p) => p.profiles?.full_name,
    cell: (p) => p.profiles?.full_name || '—',
  },
  { key: 'status', header: 'Status', sortValue: (p) => p.status, cell: (p) => <StatusBadge status={p.status} /> },
  {
    key: 'created_at',
    header: 'Listed',
    hideOnMobile: true,
    sortValue: (p) => p.created_at,
    cell: (p) => formatDate(p.created_at),
  },
];

const filters: TableFilter<Property>[] = [
  {
    key: 'status',
    label: 'Statuses',
    options: [
      { value: 'published', label: 'Published' },
      { value: 'draft', label: 'Draft' },
      { value: 'sold', label: 'Sold' },
      { value: 'rented', label: 'Rented' },
    ],
    match: (p, v) => p.status === v,
  },
  {
    key: 'listing_type',
    label: 'Listing types',
    options: ['sell', 'rent', 'lease', 'buy'].map((value) => ({ value, label: humanize(value) })),
    match: (p, v) => p.listing_type === v,
  },
  {
    key: 'featured',
    label: 'Listings',
    options: [
      { value: 'featured', label: 'Featured' },
      { value: 'standard', label: 'Standard' },
    ],
    match: (p, v) => (v === 'featured' ? p.is_featured : !p.is_featured),
  },
];

export default function AdminPropertiesPage() {
  const [rows, setRows] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  const load = useCallback(async () => {
    const res = await fetchAdminPropertiesAction();
    if (res.success) {
      setRows((res.data as Property[]) || []);
      setUnavailable(false);
    } else if (isMissingTable(res.error)) {
      setRows([]);
      setUnavailable(true);
    } else {
      toast.error('Could not load properties', res.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const moderate = async (p: Property, action: 'approve' | 'reject' | 'feature' | 'unfeature') => {
    try {
      await adminApi.moderate('property', p.id, action);
      toast.success('Property updated', p.title);
      await load();
    } catch (err) {
      toast.error('Action failed', err instanceof Error ? err.message : undefined);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Properties"
        description="Verify real estate listings, unpublish stale ones and feature premium properties."
        count={rows.length}
        actions={
          <Link href="/properties/create" className={primaryButtonClass}>
            <Plus className="h-4 w-4" /> Add property
          </Link>
        }
      />

      <AdminEntityTable<Property>
        entityType="property"
        rows={rows}
        loading={loading}
        reload={load}
        columns={columns}
        filters={filters}
        imageKeys={['cover_image', 'gallery']}
        searchText={(p) =>
          `${p.title} ${p.areas?.name ?? ''} ${p.profiles?.full_name ?? ''} ${p.property_categories?.name ?? ''} ${p.address ?? ''}`
        }
        searchPlaceholder="Search title, area, owner…"
        emptyMessage={
          unavailable
            ? 'Property listings are not set up yet. Listings will appear here once they are enabled.'
            : 'No properties yet.'
        }
        titleOf={(p) => p.title}
        subtitleOf={(p) => <StatusBadge status={p.status} />}
        extraViewFields={(p) => [
          { label: 'Category', value: p.property_categories?.name },
          { label: 'Owner', value: p.profiles?.full_name },
          { label: 'Area', value: p.areas?.name },
          { label: 'Listed', value: formatDate(p.created_at, true) },
        ]}
        rowActions={(p) => (
          <>
            {p.status !== 'published' && (
              <IconButton label="Publish" onClick={() => moderate(p, 'approve')}>
                <CheckCircle2 className="h-4 w-4" />
              </IconButton>
            )}
            {p.status === 'published' && (
              <IconButton label="Unpublish" tone="danger" onClick={() => moderate(p, 'reject')}>
                <XCircle className="h-4 w-4" />
              </IconButton>
            )}
            <IconButton
              label={p.is_featured ? 'Remove from featured' : 'Feature'}
              onClick={() => moderate(p, p.is_featured ? 'unfeature' : 'feature')}
            >
              <Star className={`h-4 w-4 ${p.is_featured ? 'fill-amber-400 text-amber-400' : ''}`} />
            </IconButton>
          </>
        )}
      />
    </>
  );
}
