'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Eye, EyeOff, ExternalLink, Loader2, Plus, Radio, X } from 'lucide-react';
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
import { isExternalHref, sanitizeLiveUpdate, type LiveUpdate } from '@/lib/live-updates';
import { toast } from '@/lib/toast';

const inputClass =
  'h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:outline-none';

const EMPTY: LiveUpdate = { id: '', title: '', detail: '', href: '/', cta: 'Learn more', active: true };

async function saveItems(items: LiveUpdate[]): Promise<LiveUpdate[]> {
  const res = await fetch('/api/v1/live-updates', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.success) throw new Error(json.error || `Save failed (${res.status})`);
  return json.items;
}

/** Same look as the public ticker, so editors see what visitors see */
function TickerPreview({ items }: { items: LiveUpdate[] }) {
  const active = items.filter((i) => i.active);
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      <div className="flex h-10 items-center">
        <div className="flex h-full shrink-0 items-center gap-2 border-r border-[#E5E7EB] px-4">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" aria-hidden />
          <span className="text-[11px] font-bold tracking-[0.14em] text-[#111827] uppercase">Calicut</span>
        </div>
        <div className="flex min-w-0 flex-1 items-center overflow-x-auto">
          {active.length === 0 ? (
            <p className="px-5 text-xs text-[#9CA3AF]">Nothing visible — the ticker is hidden on the site.</p>
          ) : (
            active.map((item) => (
              <p key={item.id} className="flex shrink-0 items-center gap-2 px-5 text-[13px] whitespace-nowrap text-[#6B7280]">
                <span className="font-semibold text-[#111827]">{item.title}</span>
                {item.detail && (
                  <>
                    <span className="text-[#D1D5DB]">·</span>
                    <span>{item.detail}</span>
                  </>
                )}
                <span className="inline-flex items-center gap-1 font-semibold text-[#2563EB]">
                  {item.cta} <ArrowRight className="h-3 w-3" />
                </span>
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminLiveUpdatesPage() {
  const [items, setItems] = useState<LiveUpdate[]>([]);
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<LiveUpdate | null>(null);
  const [viewing, setViewing] = useState<LiveUpdate | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/live-updates?all=1');
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Could not load updates');
      setItems(json.items);
      setIsDefault(Boolean(json.isDefault));
    } catch (err) {
      toast.error('Could not load live updates', err instanceof Error ? err.message : undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Every change saves the full ordered list
  const commit = async (next: LiveUpdate[], message: string) => {
    const previous = items;
    setItems(next);
    try {
      setItems(await saveItems(next));
      setIsDefault(false);
      toast.success(message);
      return true;
    } catch (err) {
      setItems(previous);
      toast.error('Not saved', err instanceof Error ? err.message : undefined);
      return false;
    }
  };

  const move = (item: LiveUpdate, delta: -1 | 1) => {
    const i = items.findIndex((x) => x.id === item.id);
    const j = i + delta;
    if (i < 0 || j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    commit(next, 'Order updated');
  };

  const toggle = (item: LiveUpdate) =>
    commit(
      items.map((x) => (x.id === item.id ? { ...x, active: !x.active } : x)),
      item.active ? 'Hidden from the ticker' : 'Shown on the ticker'
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const cleaned = sanitizeLiveUpdate(editing as unknown as Record<string, unknown>);
    if (typeof cleaned === 'string') {
      toast.error('Check the update', cleaned);
      return;
    }
    setSaving(true);
    const exists = items.some((x) => x.id === editing.id && editing.id);
    const ok = await commit(
      exists ? items.map((x) => (x.id === editing.id ? cleaned : x)) : [...items, cleaned],
      exists ? 'Update saved' : 'Update added'
    );
    setSaving(false);
    if (ok) setEditing(null);
  };

  const columns: Column<LiveUpdate>[] = [
    {
      key: 'order',
      header: '#',
      className: 'w-12',
      cell: (item) => <span className="font-semibold text-[#9CA3AF]">{items.findIndex((x) => x.id === item.id) + 1}</span>,
    },
    {
      key: 'title',
      header: 'Update',
      cell: (item) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-[#111827]">{item.title}</p>
          <p className="truncate text-[11px] text-[#6B7280]">{item.detail || '—'}</p>
        </div>
      ),
    },
    {
      key: 'link',
      header: 'Button → link',
      hideOnMobile: true,
      cell: (item) => (
        <span className="flex min-w-0 items-center gap-1.5 text-xs">
          <span className="font-semibold text-[#2563EB]">{item.cta}</span>
          <span className="truncate text-[#6B7280]">{item.href}</span>
          {isExternalHref(item.href) && <ExternalLink className="h-3 w-3 shrink-0 text-[#9CA3AF]" />}
        </span>
      ),
    },
    {
      key: 'active',
      header: 'Status',
      cell: (item) => <StatusBadge status={item.active ? 'Visible' : 'Hidden'} tone={item.active ? 'green' : 'gray'} />,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Live updates"
        description="The “Calicut” ticker that scrolls above the public site. Changes go live within a minute."
        count={items.length}
        actions={
          <button type="button" onClick={() => setEditing({ ...EMPTY })} className={primaryButtonClass}>
            <Plus className="h-4 w-4" /> Add update
          </button>
        }
      />

      <div className="space-y-2">
        <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-[#6B7280] uppercase">
          <Radio className="h-3.5 w-3.5 text-[#2563EB]" /> Preview
        </p>
        <TickerPreview items={items} />
        {isDefault && !loading && (
          <p className="text-[11px] text-[#6B7280]">Showing the built-in starter updates. Your first change saves your own list.</p>
        )}
      </div>

      <DataTable<LiveUpdate>
        rows={items}
        columns={columns}
        getRowId={(item) => item.id}
        loading={loading}
        emptyMessage="No updates. Add one to show the ticker on the site."
        rowLabel={(item) => item.title}
        onView={setViewing}
        onEdit={(item) => setEditing({ ...item })}
        onDelete={(item) => {
          commit(
            items.filter((x) => x.id !== item.id),
            'Update deleted'
          );
        }}
        rowActions={(item) => (
          <>
            <IconButton label="Move up" onClick={() => move(item, -1)}>
              <ArrowUp className="h-4 w-4" />
            </IconButton>
            <IconButton label="Move down" onClick={() => move(item, 1)}>
              <ArrowDown className="h-4 w-4" />
            </IconButton>
            <IconButton label={item.active ? 'Hide' : 'Show'} onClick={() => toggle(item)}>
              {item.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </IconButton>
          </>
        )}
      />

      {/* View */}
      <Modal open={viewing !== null} onClose={() => setViewing(null)} size="sm" labelledBy="lu-view-title">
        {viewing && (
          <>
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
              <h2 id="lu-view-title" className="text-base font-bold text-[#111827]">
                {viewing.title}
              </h2>
              <button type="button" onClick={() => setViewing(null)} aria-label="Close" className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F1F5F9]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <dl className="grid grid-cols-3 gap-x-4 gap-y-3 px-6 py-5 text-sm">
              <dt className="text-xs font-bold text-[#6B7280]">Detail</dt>
              <dd className="col-span-2 text-[#111827]">{viewing.detail || '—'}</dd>
              <dt className="text-xs font-bold text-[#6B7280]">Button</dt>
              <dd className="col-span-2 text-[#111827]">{viewing.cta}</dd>
              <dt className="text-xs font-bold text-[#6B7280]">Link</dt>
              <dd className="col-span-2 break-all text-[#2563EB]">{viewing.href}</dd>
              <dt className="text-xs font-bold text-[#6B7280]">Status</dt>
              <dd className="col-span-2">
                <StatusBadge status={viewing.active ? 'Visible' : 'Hidden'} tone={viewing.active ? 'green' : 'gray'} />
              </dd>
            </dl>
            <div className="flex justify-end gap-2 border-t border-[#E5E7EB] bg-[#F8FAFC] px-6 py-3">
              <button type="button" onClick={() => setViewing(null)} className={secondaryButtonClass}>
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing({ ...viewing });
                  setViewing(null);
                }}
                className={primaryButtonClass}
              >
                Edit
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Add / edit */}
      <Modal open={editing !== null} onClose={() => !saving && setEditing(null)} size="sm" labelledBy="lu-edit-title">
        {editing && (
          <form onSubmit={submit} className="flex min-h-0 flex-col">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
              <h2 id="lu-edit-title" className="flex items-center gap-2 text-base font-bold text-[#111827]">
                <Radio className="h-5 w-5 text-[#2563EB]" /> {editing.id ? 'Edit update' : 'Add update'}
              </h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close" className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F1F5F9]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto px-6 py-5">
              <label className="block space-y-1.5">
                <span className="text-xs font-bold text-[#374151]">Title</span>
                <input
                  required
                  maxLength={80}
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Malabar Literature Festival"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-bold text-[#374151]">Detail (optional)</span>
                <input
                  maxLength={120}
                  value={editing.detail}
                  onChange={(e) => setEditing({ ...editing, detail: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Passes are live"
                />
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <label className="block space-y-1.5">
                  <span className="text-xs font-bold text-[#374151]">Button text</span>
                  <input
                    maxLength={30}
                    value={editing.cta}
                    onChange={(e) => setEditing({ ...editing, cta: e.target.value })}
                    className={inputClass}
                    placeholder="View events"
                  />
                </label>
                <label className="block space-y-1.5 sm:col-span-2">
                  <span className="text-xs font-bold text-[#374151]">Link</span>
                  <input
                    required
                    value={editing.href}
                    onChange={(e) => setEditing({ ...editing, href: e.target.value })}
                    className={inputClass}
                    placeholder="/events or https://…"
                  />
                </label>
              </div>
              <p className="text-[11px] text-[#6B7280]">
                Use a site path like <code>/jobs</code>, or a full <code>https://</code> link (opens in a new tab).
              </p>
              <label className="flex items-center gap-2 text-sm font-semibold text-[#374151]">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  className="h-4 w-4 rounded border-[#D1D5DB] accent-[#2563EB]"
                />
                Show on the ticker
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t border-[#E5E7EB] bg-[#F8FAFC] px-6 py-3">
              <button type="button" onClick={() => setEditing(null)} className={secondaryButtonClass}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className={primaryButtonClass}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing.id ? 'Save update' : 'Add update'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
