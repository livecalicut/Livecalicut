'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { fetchAdminMarketplaceAction } from './actions';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ShoppingBag, Search, ShieldCheck, Tag, XCircle, Plus } from 'lucide-react';

export default function AdminMarketplacePage() {
  const [search, setSearch] = useState('');

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const res = await fetchAdminMarketplaceAction();
    if (res.success) {
      setItems(res.data || []);
    }
    setLoading(false);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'reject' : 'approve';
    const res = await fetch('/api/v1/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'marketplace', entityId: id, action })
    });
    if (res.ok) loadItems();
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    const res = await fetch('/api/v1/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'marketplace', entityId: id, hardDelete: true })
    });
    if (res.ok) loadItems();
  };

  const filteredItems = items.filter((it) => it.title?.toLowerCase().includes(search.toLowerCase()) || it.seller_profiles?.full_name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Classifieds Market' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
                <ShoppingBag className="w-7 h-7 text-[#2563EB]" />
                <span>Buy & Sell Classifieds Moderation</span>
              </h1>
              <p className="text-sm text-[#6B7280]">Review citizen listings, moderate reported pre-owned items, and verify prices</p>
            </div>

            <Link href="/marketplace/create">
              <button className="h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /> Add Classified Item
              </button>
            </Link>
          </div>

          {/* Search Card */}
          <Card className="p-4 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search listing or seller..."
                className="w-full pl-10 pr-4 h-[38px] rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs text-[#111827] focus:bg-white focus:border-[#2563EB] focus:outline-none"
              />
            </div>
            <span className="text-xs font-bold text-[#6B7280]">Total Items: {filteredItems.length}</span>
          </Card>

          {/* Table */}
          <Card className="p-0 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Item Title / Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Seller Account</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-8">Loading listings...</td></tr>
                  ) : filteredItems.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8">No listings found</td></tr>
                  ) : filteredItems.map((it) => (
                    <tr key={it.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 font-semibold">
                        <p className="font-bold text-[#111827] font-sans">{it.title}</p>
                        <p className="text-[11px] text-[#6B7280] flex items-center gap-1">
                          <Tag className="w-3 h-3 text-[#2563EB]" /> {it.marketplace_categories?.name || 'Uncategorized'}
                        </p>
                      </td>
                      <td className="py-4 px-4 font-black text-[#111827]">₹{Number(it.price).toLocaleString('en-IN')}</td>
                      <td className="py-4 px-4 text-[#4B5563] font-medium">{it.seller_profiles?.full_name || 'Anonymous User'}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            it.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : it.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {it.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => toggleStatus(it.id, it.status)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            it.status === 'active'
                              ? 'border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100'
                              : 'border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {it.status === 'active' ? 'Flag & Take Down' : 'Approve Item'}
                        </button>
                        <button
                          onClick={() => deleteItem(it.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Delete
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
    </div>
  );
}
