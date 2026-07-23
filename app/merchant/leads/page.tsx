'use client';

import React, { useState } from 'react';
import { MerchantSidebar } from '@/components/merchant/merchant-sidebar';
import { MerchantHeader } from '@/components/merchant/merchant-header';
import { Card } from '@/components/ui/card';
import { Users, Search, MessageCircle, Phone, Filter, CheckCircle2, Clock } from 'lucide-react';

export default function MerchantLeadsPage() {
  const [search, setSearch] = useState('');

  const [leads, setLeads] = useState([
    { id: '1', name: 'Dr. Faisal Rahman', phone: '+91 98950 12345', email: 'faisal@astermims.in', category: 'Table Reservation Inquiry', status: 'New Lead', date: 'Today 02:15 PM' },
    { id: '2', name: 'Anjali Nambiar', phone: '+91 94471 98765', email: 'anjali@software.in', category: 'Corporate Catering Quote', status: 'Contacted', date: 'Yesterday' },
    { id: '3', name: 'Moideenkutty K.', phone: '+91 98470 54321', email: 'moideen@smstreet.in', category: 'Bulk Sweets Order', status: 'Closed Deal', date: '3 days ago' },
  ]);

  const updateLeadStatus = (id: string, status: string) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const filteredLeads = leads.filter((l) => l.name.toLowerCase().includes(search.toLowerCase()) || l.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MerchantHeader breadcrumbs={[{ label: 'Merchant Workspace', href: '/merchant' }, { label: 'Customer Leads CRM' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
              <Users className="w-7 h-7 text-[#2563EB]" />
              <span>Customer Leads & Inquiries CRM</span>
            </h1>
            <p className="text-sm text-[#6B7280]">Manage verified customer inquiries captured from phone clicks, WhatsApp chats, and storefront forms</p>
          </div>

          {/* Search Bar */}
          <Card className="p-4 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search lead by customer name or query..."
                className="w-full pl-10 pr-4 h-[38px] rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-xs text-[#111827] focus:bg-white focus:border-[#2563EB] focus:outline-none"
              />
            </div>
            <span className="text-xs font-bold text-[#6B7280]">Total Customer Leads: {filteredLeads.length}</span>
          </Card>

          {/* Leads CRM Table Card */}
          <Card className="p-0 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Customer / Contact</th>
                    <th className="py-3.5 px-4">Inquiry Category</th>
                    <th className="py-3.5 px-4">Lead Timestamp</th>
                    <th className="py-3.5 px-4">CRM Status</th>
                    <th className="py-3.5 px-6 text-right">Instant Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6 font-semibold">
                        <p className="font-bold text-[#111827] font-sans">{lead.name}</p>
                        <p className="text-[11px] text-[#6B7280]">{lead.phone} • {lead.email}</p>
                      </td>
                      <td className="py-4 px-4 text-[#4B5563] font-bold">{lead.category}</td>
                      <td className="py-4 px-4 text-[#6B7280] font-medium">{lead.date}</td>
                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className="h-[32px] px-2.5 rounded-lg border border-[#E5E7EB] bg-white text-xs font-bold text-[#111827]"
                        >
                          <option value="New Lead">New Lead</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed Deal">Closed Deal</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <a
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Customer
                        </a>
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
