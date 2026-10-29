'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Ban, Loader2, Plus, ShieldCheck, Trash2, UserCheck, X } from 'lucide-react';
import { useAuthStore } from '@/src/store/useAuthStore';
import { assignableRolesFor, isCityOrSuper } from '@/lib/rbac/roles';
import {
  AdminEntityTable,
  AdminPageHeader,
  ConfirmDialog,
  IconButton,
  Modal,
  StatusBadge,
  formatDate,
  primaryButtonClass,
  secondaryButtonClass,
  type Column,
  type TableFilter,
} from '@/components/admin/data-table';
import { toast } from '@/lib/toast';

type User = {
  id: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  area?: string | null;
  city_ward?: string | null;
  role?: string | null;
  account_status?: string | null;
  created_at?: string | null;
  [key: string]: any;
};

type UserAction = 'suspend' | 'activate' | 'ban' | 'soft_delete' | 'assign_role';

const ALL_ROLES = ['Super Admin', 'City Admin', 'Marketing Executive', 'Moderator', 'Merchant', 'User'];

const inputClass =
  'h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:outline-none';

const nameOf = (u: User) => u.full_name || u.email || 'Anonymous';
const locationOf = (u: User) => u.city_ward || [u.area, u.city].filter(Boolean).join(', ');
const statusOf = (u: User) => u.account_status || 'active';

async function patchUser(body: Record<string, unknown>) {
  const res = await fetch('/api/v1/admin/users', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.error?.message || json.error || json.message || `Request failed (${res.status})`);
  }
  return json;
}

export default function AdminUsersPage() {
  const { roleName } = useAuthStore();
  const creatableRoles = useMemo(() => assignableRolesFor(roleName), [roleName]);
  const canEdit = isCityOrSuper(roleName);

  const [rows, setRows] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  // Search handed over from the dashboard header (?q=)
  const [headerQuery, setHeaderQuery] = useState('');
  const [pendingRemove, setPendingRemove] = useState<User | null>(null);
  const [removing, setRemoving] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newStaff, setNewStaff] = useState({ fullName: '', email: '', roleName: '' });

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/users');
      const json = await res.json();
      if (json.success) setRows(json.data || []);
      else toast.error('Could not load users', json.error?.message || json.error);
    } catch (err) {
      toast.error('Could not load users', err instanceof Error ? err.message : undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) setHeaderQuery(q);
    load();
  }, [load]);

  const visibleRows = useMemo(() => {
    const q = headerQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((u) => `${u.full_name ?? ''} ${u.email ?? ''}`.toLowerCase().includes(q));
  }, [rows, headerQuery]);

  const runAction = async (u: User, action: UserAction, done: string) => {
    try {
      await patchUser({ userId: u.id, action });
      toast.success(done, nameOf(u));
      await load();
    } catch (err) {
      toast.error('Action failed', err instanceof Error ? err.message : undefined);
    }
  };

  const toggleStatus = (u: User) =>
    statusOf(u) === 'active'
      ? runAction(u, 'suspend', 'User suspended')
      : runAction(u, 'activate', 'User activated');

  const updateRole = async (u: User, newRole: string) => {
    const previousRole = u.role || 'User';
    setRows((current) => current.map((r) => (r.id === u.id ? { ...r, role: newRole } : r)));
    try {
      await patchUser({ userId: u.id, action: 'assign_role', roleName: newRole });
      toast.success('Role updated', `${newRole} is now assigned.`);
      load();
    } catch (err) {
      setRows((current) => current.map((r) => (r.id === u.id ? { ...r, role: previousRole } : r)));
      toast.error('Role not saved', err instanceof Error ? err.message : 'Try again.');
    }
  };

  const confirmRemove = async () => {
    if (!pendingRemove) return;
    setRemoving(true);
    await runAction(pendingRemove, 'soft_delete', 'User removed');
    setRemoving(false);
    setPendingRemove(null);
  };

  const openCreate = () => {
    setNewStaff({ fullName: '', email: '', roleName: creatableRoles[0] || '' });
    setShowCreate(true);
  };

  const createStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/v1/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) {
        throw new Error(json.error?.message || json.error || 'Account was not created');
      }
      toast.success('Staff account created', newStaff.email);
      setShowCreate(false);
      await load();
    } catch (err) {
      toast.error('Could not create staff', err instanceof Error ? err.message : undefined);
    } finally {
      setCreating(false);
    }
  };

  const roleControl = (u: User) =>
    u.role === 'Super Admin' ? (
      <StatusBadge status="Super Admin" tone="amber" />
    ) : (
      // Wrapper stops the row click (which opens the drawer) when using the select
      <span onClick={(e) => e.stopPropagation()}>
        <select
          aria-label={`Role for ${nameOf(u)}`}
          value={u.role || 'User'}
          onChange={(e) => updateRole(u, e.target.value)}
          className="h-8 rounded-lg border border-[#E5E7EB] bg-white px-2.5 text-xs font-semibold text-[#111827] focus:border-[#2563EB] focus:outline-none"
        >
          {Array.from(new Set([u.role || 'User', 'User', 'Merchant', ...creatableRoles])).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </span>
    );

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User',
      sortValue: (u) => nameOf(u).toLowerCase(),
      cell: (u) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-sm font-bold text-[#2563EB]">
            {nameOf(u).charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#111827]">{u.full_name || 'Anonymous'}</p>
            <p className="truncate text-[11px] text-[#6B7280]">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      hideOnMobile: true,
      sortValue: (u) => locationOf(u),
      cell: (u) => locationOf(u) || '—',
    },
    { key: 'role', header: 'Role', sortValue: (u) => u.role || 'User', cell: roleControl },
    {
      key: 'status',
      header: 'Status',
      sortValue: (u) => statusOf(u),
      cell: (u) => <StatusBadge status={statusOf(u)} />,
    },
    {
      key: 'created_at',
      header: 'Joined',
      hideOnMobile: true,
      sortValue: (u) => u.created_at,
      cell: (u) => formatDate(u.created_at),
    },
  ];

  const filters: TableFilter<User>[] = [
    {
      key: 'role',
      label: 'Roles',
      options: ALL_ROLES.filter((r) => r !== 'Super Admin' || roleName === 'Super Admin').map((r) => ({
        value: r,
        label: r,
      })),
      match: (u, v) => (u.role || 'User') === v,
    },
    {
      key: 'status',
      label: 'Statuses',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'deactivated', label: 'Deactivated' },
      ],
      match: (u, v) => statusOf(u) === v,
    },
  ];

  return (
    <>
      <AdminPageHeader
        title={canEdit ? 'Users & access' : 'My created users'}
        description={
          roleName === 'Super Admin'
            ? 'Full platform users. Super Admin accounts stay hidden from lower roles.'
            : roleName === 'City Admin'
              ? 'City users and staff you manage (Super Admin accounts are hidden).'
              : 'Only users you created appear here — other roles and Super Admin data stay private.'
        }
        count={rows.length}
        actions={
          creatableRoles.length > 0 && (
            <button type="button" onClick={openCreate} className={primaryButtonClass}>
              <Plus className="h-4 w-4" /> Add staff member
            </button>
          )
        }
      />

      {headerQuery && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-2.5 text-xs text-[#1E40AF]">
          <span>
            Showing users matching <strong>“{headerQuery}”</strong>
          </span>
          <button
            type="button"
            onClick={() => setHeaderQuery('')}
            className="inline-flex items-center gap-1 font-bold hover:underline"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
      )}

      <AdminEntityTable<User>
        entityType="user"
        rows={visibleRows}
        loading={loading}
        reload={load}
        columns={columns}
        filters={filters}
        searchText={(u) => `${u.full_name ?? ''} ${u.email ?? ''} ${u.phone ?? ''} ${locationOf(u)}`}
        searchPlaceholder="Search name, email, phone…"
        emptyMessage="No users yet."
        titleOf={nameOf}
        subtitleOf={(u) => (
          <span className="flex flex-wrap items-center gap-2">
            {u.email}
            <StatusBadge status={statusOf(u)} />
          </span>
        )}
        canEdit={canEdit}
        canDelete={false}
        extraViewFields={(u) => [
          { label: 'Email', value: u.email },
          { label: 'Role', value: u.role || 'User' },
          { label: 'Status', value: <StatusBadge status={statusOf(u)} /> },
          { label: 'Ward', value: u.city_ward },
          { label: 'Joined', value: formatDate(u.created_at, true) },
        ]}
        rowActions={(u) =>
          u.role === 'Super Admin' ? null : (
            <>
              {statusOf(u) === 'active' ? (
                <IconButton label="Suspend" tone="danger" onClick={() => toggleStatus(u)}>
                  <Ban className="h-4 w-4" />
                </IconButton>
              ) : (
                <IconButton label="Activate" onClick={() => toggleStatus(u)}>
                  <UserCheck className="h-4 w-4" />
                </IconButton>
              )}
              <IconButton label="Remove user" tone="danger" onClick={() => setPendingRemove(u)}>
                <Trash2 className="h-4 w-4" />
              </IconButton>
            </>
          )
        }
        drawerFooter={(u, close) =>
          u.role === 'Super Admin' ? null : (
            <>
              <button
                type="button"
                onClick={() => {
                  close();
                  setPendingRemove(u);
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-4 text-xs font-bold text-rose-600 hover:bg-rose-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
              <button
                type="button"
                onClick={() => {
                  close();
                  toggleStatus(u);
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-4 text-xs font-bold text-[#374151] hover:border-[#2563EB] hover:text-[#2563EB]"
              >
                {statusOf(u) === 'active' ? (
                  <>
                    <Ban className="h-3.5 w-3.5" /> Suspend
                  </>
                ) : (
                  <>
                    <UserCheck className="h-3.5 w-3.5" /> Activate
                  </>
                )}
              </button>
            </>
          )
        }
      />

      <ConfirmDialog
        open={pendingRemove !== null}
        title="Remove this user?"
        message={
          pendingRemove
            ? `“${nameOf(pendingRemove)}” will be removed from the platform and hidden from this list.`
            : ''
        }
        confirmLabel="Remove user"
        busy={removing}
        onConfirm={confirmRemove}
        onCancel={() => setPendingRemove(null)}
      />

      <Modal open={showCreate} onClose={() => !creating && setShowCreate(false)} size="sm" labelledBy="create-staff-title">
        <form onSubmit={createStaff} className="flex min-h-0 flex-col">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
            <h2 id="create-staff-title" className="flex items-center gap-2 text-base font-bold text-[#111827]">
              <ShieldCheck className="h-5 w-5 text-[#2563EB]" /> Create staff account
            </h2>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              aria-label="Close"
              className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#111827]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto px-6 py-5">
            <label className="block space-y-1.5">
              <span className="text-xs font-bold text-[#374151]">Full name</span>
              <input
                type="text"
                required
                value={newStaff.fullName}
                onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                className={inputClass}
                placeholder="e.g. Rahul Kumar"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-bold text-[#374151]">Email address</span>
              <input
                type="email"
                required
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                className={inputClass}
                placeholder="name@livecalicut.in"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-bold text-[#374151]">Role</span>
              <select
                value={newStaff.roleName}
                onChange={(e) => setNewStaff({ ...newStaff, roleName: e.target.value })}
                className={inputClass}
              >
                {creatableRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <span className="block text-[11px] text-[#6B7280]">
                New staff are linked to your account (created_by) and only see their own data. Super Admin
                cannot be created here.
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#E5E7EB] bg-[#F8FAFC] px-6 py-3">
            <button type="button" onClick={() => setShowCreate(false)} className={secondaryButtonClass}>
              Cancel
            </button>
            <button type="submit" disabled={creating} className={primaryButtonClass}>
              {creating && <Loader2 className="h-4 w-4 animate-spin" />}
              Create account
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
