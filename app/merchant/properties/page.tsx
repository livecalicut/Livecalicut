'use client';

import React, { useState } from 'react';
import { MerchantSidebar } from '@/components/merchant/merchant-sidebar';
import { MerchantHeader } from '@/components/merchant/merchant-header';
import { Card } from '@/components/ui/card';
import { Building, Plus, Search, Eye, MessageCircle, Trash2, Home } from 'lucide-react';

export default function MerchantPropertiesPage() {
  const [search, setSearch] = useState('');

  const [propertiesings, setPropertiesings] = useState([
    { id: '1', title: 'Commercial Dining Floor Space for Lease', type: 'For Lease', price: '₹75,000 / mo', location: 'Mavoor Road, Calicut', views: 640, inquiries: 18, status: 'Active' },
    { id: '2', title: 'Luxury 3 BHK Independent Villa', type: 'For Sale', price: '₹1.25 Cr', location: 'Thondayad Bypass, Calicut', views: 1420, inquiries: 32, status: 'Active' },
    { id: '3', title: 'Cyberpark Office Space 1,200 sq.ft', type: 'For Rent', price: '₹45,000 / mo', location: 'Sahya Building, Cyberpark', views: 890, inquiries: 21, status: 'Under Offer' },
  ]);

  const updatePropStatus = (id: string, newStatus: string) => {
    setPropertiesings(propertiesings.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
  };

  const deleteProperty = (id: string) => {
    setPropertiesings(propertiesings.filter((p) => p.id !== id));
  };

  const filteredProps = propertiesings.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MerchantHeader breadcrumbs={[{ label: 'Merchant Workspace', href: '/merchant' }, { label: 'Real Estate Listings' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
                <Building className="w-7 h-7 text-[#2563EB]" />
                <span>Real Estate Listings & Broker Desk</span>
              </h1>
              <p className="text-sm text-[#6B7280]">Manage commercial rentals, residential villas, plots for sale, and tenant inquiry leads</p>
            </div>

            <button className="h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0">
              <Plus className="w-4 h-4" /> Post New Property
            </button>
          </div>

          {/* Search Card */}
          <Card className="p-4 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search real estate title..."
                className="w-full pl-10 pr-4 h-[38px] rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs text-[#111827] focus:bg-white focus:border-[#2563EB] focus:outline-none"
              />
            </div>
            <span className="text-xs font-bold text-[#6B7280]">Active Properties: {filteredProps.length}</span>
          </Card>

          {/* Properties Table Card */}
          <Card className="p-0 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Property Title / Location</th>
                    <th className="py-3.5 px-4">Listing Type / Price</th>
                    <th className="py-3.5 px-4">Inquiry Stats</th>
                    <th className="py-3.5 px-4">Property Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {filteredProps.map((prop) => (
                    <tr key={prop.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 font-semibold">
                        <p className="font-bold text-[#111827] font-sans">{prop.title}</p>
                        <p className="text-[11px] text-[#6B7280]">{prop.location}</p>
                      </td>
                      <td className="py-4 px-4 font-bold">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-[10px] font-bold border border-blue-200 uppercase mr-2">
                          {prop.type}
                        </span>
                        <span className="text-[#111827] font-black">{prop.price}</span>
                      </td>
                      <td className="py-4 px-4 font-medium text-[#4B5563]">
                        <span className="inline-flex items-center gap-1 mr-3"><Eye className="w-3.5 h-3.5 text-[#6B7280]" /> {prop.views}</span>
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold"><MessageCircle className="w-3.5 h-3.5" /> {prop.inquiries}</span>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={prop.status}
                          onChange={(e) => updatePropStatus(prop.id, e.target.value)}
                          className="h-[32px] px-2.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-bold text-[#111827]"
                        >
                          <option value="Active">Active Listing</option>
                          <option value="Under Offer">Under Offer / Token Paid</option>
                          <option value="Leased/Sold">Mark as Leased / Sold</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => deleteProperty(prop.id)}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
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
