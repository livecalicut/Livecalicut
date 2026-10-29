'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Archive, CheckCircle2, Plus } from 'lucide-react';
import { fetchAdminNewsAction } from './actions';
import {
  AdminEntityTable,
  AdminPageHeader,
  IconButton,
  RecordFormModal,
  StatusBadge,
  formatDate,
  primaryButtonClass,
  type Column,
  type TableFilter,
} from '@/components/admin/data-table';
import { adminApi } from '@/lib/admin/client';
import type { EntityField } from '@/lib/admin/entities';
import { toast } from '@/lib/toast';

type Article = {
  id: string;
  title: string;
  status: string;
  author?: string | null;
  featured_image?: string | null;
  gallery?: string[] | null;
  published_at?: string | null;
  created_at: string;
  news_categories?: { name: string } | null;
  profiles?: { full_name?: string | null } | null;
  [key: string]: any;
};

const NEWS_CATEGORIES = [
  'News Editorial',
  'Cyberpark Expansion',
  'Cultural Festival',
  'Infrastructure',
  'Business',
  'Government',
  'Health',
];

const createFields: EntityField[] = [
  { name: 'title', label: 'Headline', type: 'text', required: true, wide: true },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    required: true,
    options: NEWS_CATEGORIES.map((c) => ({ value: c, label: c })),
  },
  { name: 'author', label: 'Author', type: 'text' },
  { name: 'summary', label: 'Short summary (shown in timeline)', type: 'text', wide: true },
  { name: 'content', label: 'Article body', type: 'textarea', required: true, wide: true },
  { name: 'featured_image', label: 'Cover image', type: 'image', module: 'news', wide: true },
  { name: 'gallery', label: 'Gallery', type: 'images', module: 'news', wide: true },
];

const createDefaults = { category: 'News Editorial' };

const authorOf = (n: Article) => n.profiles?.full_name || n.author || 'Editorial Team';

const columns: Column<Article>[] = [
  {
    key: 'title',
    header: 'Headline',
    sortValue: (n) => n.title,
    cell: (n) => (
      <div className="flex min-w-0 items-center gap-3">
        {n.featured_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={n.featured_image}
            alt=""
            className="h-10 w-10 shrink-0 rounded-lg border border-[#E5E7EB] object-cover"
          />
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-[#111827]">{n.title}</p>
          <p className="text-[11px] text-[#6B7280]">{n.news_categories?.name || 'General'}</p>
        </div>
      </div>
    ),
  },
  { key: 'author', header: 'Author', hideOnMobile: true, sortValue: authorOf, cell: authorOf },
  {
    key: 'published_at',
    header: 'Published',
    hideOnMobile: true,
    sortValue: (n) => n.published_at || n.created_at,
    cell: (n) => formatDate(n.published_at || n.created_at, true),
  },
  { key: 'status', header: 'Status', sortValue: (n) => n.status, cell: (n) => <StatusBadge status={n.status} /> },
];

const statusFilter: TableFilter<Article> = {
  key: 'status',
  label: 'Statuses',
  options: [
    { value: 'published', label: 'Published' },
    { value: 'pending', label: 'Pending' },
    { value: 'draft', label: 'Draft' },
    { value: 'archived', label: 'Archived' },
  ],
  match: (n, v) => n.status === v,
};

export default function AdminNewsPage() {
  const [rows, setRows] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    const res = await fetchAdminNewsAction();
    if (res.success) setRows((res.data as Article[]) || []);
    else toast.error('Could not load articles', res.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filters = useMemo<TableFilter<Article>[]>(() => {
    const categories = Array.from(new Set(rows.map((n) => n.news_categories?.name).filter(Boolean))) as string[];
    if (categories.length === 0) return [statusFilter];
    return [
      statusFilter,
      {
        key: 'category',
        label: 'Categories',
        options: categories.sort().map((c) => ({ value: c, label: c })),
        match: (n, v) => n.news_categories?.name === v,
      },
    ];
  }, [rows]);

  const publish = async (values: Record<string, unknown>) => {
    const res = await fetch('/api/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...values, featured_image: values.featured_image || undefined }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) throw new Error(json.message || 'Could not publish article');

    toast.success('Published', `"${values.title}" is now live on the city feed.`);
    setCreating(false);
    await load();
  };

  const moderate = async (n: Article, action: 'approve' | 'reject') => {
    try {
      await adminApi.moderate('news', n.id, action);
      toast.success(action === 'approve' ? 'Article published' : 'Article archived', n.title);
      await load();
    } catch (err) {
      toast.error('Action failed', err instanceof Error ? err.message : undefined);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="News"
        description="Publish civic announcements, manage breaking news and curate editorial features."
        count={rows.length}
        actions={
          <button type="button" onClick={() => setCreating(true)} className={primaryButtonClass}>
            <Plus className="h-4 w-4" /> Write article
          </button>
        }
      />

      <AdminEntityTable<Article>
        entityType="news"
        rows={rows}
        loading={loading}
        reload={load}
        columns={columns}
        filters={filters}
        searchText={(n) => `${n.title} ${authorOf(n)} ${n.news_categories?.name ?? ''}`}
        searchPlaceholder="Search headline, author, category…"
        emptyMessage="No articles yet. Write the first city news update."
        titleOf={(n) => n.title}
        subtitleOf={(n) => <StatusBadge status={n.status} />}
        imageKeys={['featured_image', 'gallery']}
        extraViewFields={(n) => [
          { label: 'Category', value: n.news_categories?.name || 'General' },
          { label: 'Published', value: formatDate(n.published_at || n.created_at, true) },
        ]}
        rowActions={(n) =>
          n.status === 'published' ? (
            <IconButton label="Archive" tone="danger" onClick={() => moderate(n, 'reject')}>
              <Archive className="h-4 w-4" />
            </IconButton>
          ) : (
            <IconButton label="Publish" onClick={() => moderate(n, 'approve')}>
              <CheckCircle2 className="h-4 w-4" />
            </IconButton>
          )
        }
      />

      <RecordFormModal
        open={creating}
        title="Write & publish article"
        fields={createFields}
        record={createDefaults}
        submitLabel="Publish to city feed"
        onClose={() => setCreating(false)}
        onSubmit={publish}
      />
    </>
  );
}
