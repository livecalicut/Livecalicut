'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { fetchAdminPropertiesAction } from './actions';
import { Card } from '@/components/ui/card';
import { Building, Search, Plus, MapPin, XCircle, Home } from 'lucide-react';

export default function AdminPropertiesPage() {
  const [search, setSearch] = useState('');

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    const res = await fetchAdminPropertiesAction();
    if (res.success) {
      setProperties(res.data || []);
    }
    setLoading(false);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const action = currentStatus === 'published' ? 'reject' : 'approve';
    const res = await fetch('/api/v1/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'property', entityId: id, action })
    });
    if (res.ok) loadProperties();
  };

  const deleteProperty = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    const res = await fetch('/api/v1/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'property', entityId: id, hardDelete: true })
    });
    if (res.ok) loadProperties();
  };

  const filteredProperties = properties.filter((p) => p.title?.toLowerCase().includes(search.toLowerCase()) || p.areas?.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Real Estate Listings' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
                <Building className="w-7 h-7 text-[#2563EB]" />
                <span>Real Estate & Property Governance</span>
              </h1>
              <p className="text-sm text-[#6B7280]">Verify land title plots, commercial office rentals, and residential villas across Kozhikode</p>
            </div>

            <Link href="/properties/create">
              <button className="h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0">
                <Plus className="w-4 h-4" /> Add Property Listing
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
                placeholder="Search location or title..."
                className="w-full pl-10 pr-4 h-[38px] rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs text-[#111827] focus:bg-white focus:border-[#2563EB] focus:outline-none"
              />
            </div>
            <span className="text-xs font-bold text-[#6B7280]">Listings: {filteredProperties.length}</span>
          </Card>

          {/* Table */}
          <Card className="p-0 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Property Title / Location</th>
                    <th className="py-3.5 px-4">Price Value</th>
                    <th className="py-3.5 px-4">Agent / Seller</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-8">Loading properties...</td></tr>
                  ) : filteredProperties.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8">No properties found</td></tr>
                  ) : filteredProperties.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 font-semibold">
                        <p className="font-bold text-[#111827] font-sans">{p.title}</p>
                        <p className="text-[11px] text-[#6B7280] flex items-center gap-1">
                          <Home className="w-3 h-3 text-[#2563EB]" /> {p.areas?.name || 'Unspecified Location'}
                        </p>
                      </td>
                      <td className="py-4 px-4 font-black text-[#111827]">₹{Number(p.price).toLocaleString('en-IN')}</td>
                      <td className="py-4 px-4 text-[#4B5563] font-medium">{p.profiles?.full_name || 'Anonymous User'}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            p.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => toggleStatus(p.id, p.status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            p.status === 'published'
                              ? 'border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100'
                              : 'border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {p.status === 'published' ? 'Revoke Status' : 'Approve & Verify'}
                        </button>
                        <button
                          onClick={() => deleteProperty(p.id)}
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
