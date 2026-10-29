'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Plus, Star, XCircle } from 'lucide-react';
import { fetchAdminBusinessesAction } from './actions';
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
import { businessImages } from '@/lib/business/images';

type Business = {
  id: string;
  name: string;
  status: string;
  is_featured: boolean;
  is_verified: boolean;
  phone?: string | null;
  created_at: string;
  business_categories?: { name: string } | null;
  areas?: { name: string } | null;
  social_media?: Record<string, any> | null;
  gallery?: string[];
  [key: string]: any;
};

const columns: Column<Business>[] = [
  {
    key: 'name',
    header: 'Business',
    sortValue: (b) => b.name,
    cell: (b) => (
      <div className="flex min-w-0 items-center gap-3">
        {b.gallery?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={b.gallery[0]}
            alt=""
            className="h-10 w-10 shrink-0 rounded-lg border border-[#E5E7EB] object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F5F9] text-sm font-bold text-[#94A3B8]">
            {b.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 truncate font-semibold text-[#111827]">
            {b.name}
            {b.is_featured && (
              <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
            )}
          </p>
          <p className="text-[11px] text-[#6B7280]">
            {b.business_categories?.name || 'Uncategorized'}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: 'area',
    header: 'Area',
    hideOnMobile: true,
    sortValue: (b) => b.areas?.name,
    cell: (b) => b.areas?.name || '—',
  },
  { key: 'phone', header: 'Phone', hideOnMobile: true, cell: (b) => b.phone || '—' },
  {
    key: 'status',
    header: 'Status',
    sortValue: (b) => b.status,
    cell: (b) => <StatusBadge status={b.status} />,
  },
  {
    key: 'created_at',
    header: 'Added',
    hideOnMobile: true,
    sortValue: (b) => b.created_at,
    cell: (b) => formatDate(b.created_at),
  },
];

const filters: TableFilter<Business>[] = [
  {
    key: 'status',
    label: 'Statuses',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'rejected', label: 'Rejected' },
    ],
    match: (b, v) => b.status === v,
  },
  {
    key: 'featured',
    label: 'Listings',
    options: [
      { value: 'featured', label: 'Featured' },
      { value: 'standard', label: 'Standard' },
    ],
    match: (b, v) => (v === 'featured' ? b.is_featured : !b.is_featured),
  },
];

export default function AdminBusinessesPage() {
  const [rows, setRows] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetchAdminBusinessesAction();
    // Older listings only have social_media.cover_image; present everything as one gallery
    if (res.success)
      setRows(((res.data as Business[]) || []).map((b) => ({ ...b, gallery: businessImages(b) })));
    else toast.error('Could not load businesses', res.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const moderate = async (b: Business, action: 'approve' | 'reject' | 'feature' | 'unfeature') => {
    try {
      await adminApi.moderate('business', b.id, action);
      toast.success('Business updated', b.name);
      await load();
    } catch (err) {
      toast.error('Action failed', err instanceof Error ? err.message : undefined);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Businesses"
        description="Verify outlets, feature top listings and keep directory details accurate."
        count={rows.length}
        actions={
          <Link href="/business/create" className={primaryButtonClass}>
            <Plus className="h-4 w-4" /> Add business
          </Link>
        }
      />

      <AdminEntityTable<Business>
        entityType="business"
        rows={rows}
        loading={loading}
        reload={load}
        columns={columns}
        filters={filters}
        searchText={(b) =>
          `${b.name} ${b.phone ?? ''} ${b.areas?.name ?? ''} ${b.business_categories?.name ?? ''}`
        }
        searchPlaceholder="Search name, phone, area…"
        emptyMessage="No businesses yet."
        titleOf={(b) => b.name}
        subtitleOf={(b) => <StatusBadge status={b.status} />}
        extraViewFields={(b) => [
          { label: 'Category', value: b.business_categories?.name },
          { label: 'Area', value: b.areas?.name },
          { label: 'Address', value: b.short_description, wide: true },
          {
            label: 'Amenities',
            value: Array.isArray(b.social_media?.amenities)
              ? b.social_media.amenities.join(', ')
              : null,
            wide: true,
          },
          { label: 'Added', value: formatDate(b.created_at, true) },
        ]}
        rowActions={(b) => (
          <>
            {b.status !== 'active' && (
              <IconButton label="Approve" onClick={() => moderate(b, 'approve')}>
                <CheckCircle2 className="h-4 w-4" />
              </IconButton>
            )}
            {b.status === 'pending' && (
              <IconButton label="Reject" tone="danger" onClick={() => moderate(b, 'reject')}>
                <XCircle className="h-4 w-4" />
              </IconButton>
            )}
            <IconButton
              label={b.is_featured ? 'Remove from featured' : 'Feature'}
              onClick={() => moderate(b, b.is_featured ? 'unfeature' : 'feature')}
            >
              <Star className={`h-4 w-4 ${b.is_featured ? 'fill-amber-400 text-amber-400' : ''}`} />
            </IconButton>
          </>
        )}
      />
    </>
  );
}
