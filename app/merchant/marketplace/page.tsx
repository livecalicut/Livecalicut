'use client';

import React, { useState } from 'react';
import { MerchantSidebar } from '@/components/merchant/merchant-sidebar';
import { MerchantHeader } from '@/components/merchant/merchant-header';
import { Card } from '@/components/ui/card';
import { ShoppingBag, Plus, Search, Tag, Eye, MessageCircle, Trash2 } from 'lucide-react';

export default function MerchantMarketplacePage() {
  const [search, setSearch] = useState('');

  const [itemsings, setItemsings] = useState([
    { id: '1', title: 'Commercial Stainless Steel Deep Fryer', price: '₹14,500', category: 'Home & Store Appliances', views: 340, inquiries: 12, status: 'Available' },
    { id: '2', title: 'Teak Wood Dining Set (6 Chairs Included)', price: '₹38,000', category: 'Furniture', views: 820, inquiries: 24, status: 'Available' },
    { id: '3', title: 'Commercial Coffee Espresso Machine', price: '₹62,000', category: 'Store Equipment', views: 510, inquiries: 18, status: 'Reserved' },
  ]);

  const updateItemStatus = (id: string, newStatus: string) => {
    setItemsings(itemsings.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
  };

  const deleteItem = (id: string) => {
    setItemsings(itemsings.filter((i) => i.id !== id));
  };

  const filteredItems = itemsings.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MerchantHeader breadcrumbs={[{ label: 'Merchant Workspace', href: '/merchant' }, { label: 'Classifieds Inventory' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
                <ShoppingBag className="w-7 h-7 text-[#2563EB]" />
                <span>Classified Inventory & Store Listings</span>
              </h1>
              <p className="text-sm text-[#6B7280]">Manage pre-owned stock, store equipment, prices, and buyer inquiry logs</p>
            </div>

            <button className="h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0">
              <Plus className="w-4 h-4" /> Post Classified Item
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
                placeholder="Search inventory listing..."
                className="w-full pl-10 pr-4 h-[38px] rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs text-[#111827] focus:bg-white focus:border-[#2563EB] focus:outline-none"
              />
            </div>
            <span className="text-xs font-bold text-[#6B7280]">Total Items: {filteredItems.length}</span>
          </Card>

          {/* Items Table Card */}
          <Card className="p-0 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Product Title / Category</th>
                    <th className="py-3.5 px-4">Asking Price</th>
                    <th className="py-3.5 px-4">Engagement (Views / Inquiries)</th>
                    <th className="py-3.5 px-4">Availability Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 font-semibold">
                        <p className="font-bold text-[#111827] font-sans">{item.title}</p>
                        <p className="text-[11px] text-[#6B7280]">{item.category}</p>
                      </td>
                      <td className="py-4 px-4 font-black text-[#2563EB]">{item.price}</td>
                      <td className="py-4 px-4 font-medium text-[#4B5563]">
                        <span className="inline-flex items-center gap-1 mr-3"><Eye className="w-3.5 h-3.5 text-[#6B7280]" /> {item.views}</span>
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold"><MessageCircle className="w-3.5 h-3.5" /> {item.inquiries}</span>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={item.status}
                          onChange={(e) => updateItemStatus(item.id, e.target.value)}
                          className="h-[32px] px-2.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-bold text-[#111827]"
                        >
                          <option value="Available">Available</option>
                          <option value="Reserved">Reserved</option>
                          <option value="Sold">Mark as Sold</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all"
                          title="Delete Listing"
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
