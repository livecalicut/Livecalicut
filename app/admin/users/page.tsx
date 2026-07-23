'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Card } from '@/components/ui/card';
import { RoleBadge } from '@/components/auth/role-badge';
import { UserRole } from '@/src/store/useAuthStore';
import { Users, Search, UserCheck, UserX, Shield, UserPlus, Filter, KeyRound, Trash2, X, Plus } from 'lucide-react';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStaffData, setNewStaffData] = useState({ fullName: '', email: '', roleName: 'Moderator' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/v1/admin/users');
      const json = await res.json();
      if (json.success) {
        setUsersList(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newAction = currentStatus === 'active' ? 'suspend' : 'activate';
    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, action: newAction })
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error('Action failed', err);
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, action: 'soft_delete' })
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('/api/v1/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaffData)
      });
      if (res.ok) {
        setShowCreateModal(false);
        setNewStaffData({ fullName: '', email: '', roleName: 'Moderator' });
        fetchUsers();
      } else {
        const errorData = await res.json();
        alert(`Failed to create staff: ${errorData.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error creating staff account');
    }
    setCreating(false);
  };

  const updateRole = async (id: string, newRole: string) => {
    setUsersList(usersList.map((u) => u.id === id ? { ...u, role: newRole } : u));
    alert('Role assignment requires roleId mapping in backend (Feature coming soon).');
  };

  const filteredUsers = usersList.filter((u) => {
    const fullName = u.full_name || '';
    const email = u.email || '';
    const matchesSearch = fullName.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Users & Roles' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
                <Users className="w-7 h-7 text-[#2563EB]" />
                <span>Ecosystem Users & Access Control</span>
              </h1>
              <p className="text-sm text-[#6B7280]">Manage citizen accounts, assign staff roles, and monitor authentication status</p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Staff Member
            </button>
          </div>

          {/* Controls Bar: Search & Role Filter */}
          <Card className="p-4 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full pl-10 pr-4 h-[38px] rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs text-[#111827] focus:bg-white focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-4 h-4 text-[#6B7280]" />
              <span className="font-bold text-[#111827]">Role Filter:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-[38px] px-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs font-semibold text-[#111827] focus:outline-none"
              >
                <option value="All">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="City Admin">City Admin</option>
                <option value="Moderator">Moderator</option>
                <option value="Merchant">Merchant</option>
                <option value="User">User</option>
              </select>
            </div>
          </Card>

          {/* User Table Card */}
          <Card className="p-0 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                    <th className="py-3.5 px-6">User / Email</th>
                    <th className="py-3.5 px-4">Location / Ward</th>
                    <th className="py-3.5 px-4">Assigned Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-8">Loading users...</td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8">No users found</td></tr>
                  ) : filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 font-semibold">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] font-extrabold flex items-center justify-center">
                            {(u.full_name || 'U').charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[#111827] font-sans">{u.full_name || 'Anonymous'}</p>
                            <p className="text-[11px] text-[#6B7280]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#4B5563] font-medium">{u.city_ward || 'Not specified'}</td>
                      <td className="py-4 px-4">
                        <select
                          value={u.role || 'User'}
                          onChange={(e) => updateRole(u.id, e.target.value)}
                          className="h-[32px] px-2.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-bold text-[#111827] focus:border-[#2563EB]"
                        >
                          <option value="User">User</option>
                          <option value="Merchant">Merchant</option>
                          <option value="Moderator">Moderator</option>
                          <option value="Marketing Executive">Marketing Executive</option>
                          <option value="City Admin">City Admin</option>
                          <option value="Super Admin">Super Admin</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            u.account_status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {u.account_status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => toggleStatus(u.id, u.account_status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            u.account_status === 'active'
                              ? 'border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100'
                              : 'border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {u.account_status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>

      {/* Create Staff Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-white rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#111827]">Create Staff Account</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-[#6B7280] hover:bg-[#F3F4F6] p-1.5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4B5563]">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStaffData.fullName}
                  onChange={(e) => setNewStaffData({ ...newStaffData, fullName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]"
                  placeholder="e.g. Rahul Kumar"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4B5563]">Email Address</label>
                <input
                  type="email"
                  required
                  value={newStaffData.email}
                  onChange={(e) => setNewStaffData({ ...newStaffData, email: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]"
                  placeholder="name@livecalicut.in"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4B5563]">Assign Role</label>
                <select
                  value={newStaffData.roleName}
                  onChange={(e) => setNewStaffData({ ...newStaffData, roleName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="Moderator">Moderator</option>
                  <option value="Marketing Executive">Marketing Executive</option>
                  <option value="City Admin">City Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
                <p className="text-[10px] text-[#6B7280]">Staff will receive an email to set their password.</p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-bold text-[#4B5563] hover:bg-[#F3F4F6] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
