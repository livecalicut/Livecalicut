'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Plus, Search, Building2, X, Loader2 } from 'lucide-react';
import { toast } from '@/lib/toast';

interface CityTenant {
  id: string;
  name: string;
  slug: string;
  state: string;
  status: string;
  areas_count: number;
}

export default function AdminCitiesPage() {
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState<CityTenant[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [cityName, setCityName] = useState('');
  const [stateName, setStateName] = useState('Kerala');
  const [status, setStatus] = useState('active');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    const supabase = createClient();
    try {
      const { data: citiesData, error } = await supabase
        .from('cities')
        .select('*, areas(count)')
        .is('deleted_at', null);

      if (error) throw error;

      const formatted = (citiesData || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        state: c.state || 'Kerala',
        status: c.is_active ? 'Active Operating City' : 'Expansion Prepared',
        areas_count: c.areas?.[0]?.count || 0,
      }));

      setCities(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName) return;

    setSubmitting(true);
    const supabase = createClient();
    const slug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
      const { error } = await supabase.from('cities').insert({
        name: cityName,
        slug: slug,
        state: stateName,
        is_active: status === 'active',
      });

      if (error) throw error;
      toast.success('City Tenant Added', `Successfully configured ${cityName}`);
      setShowModal(false);
      setCityName('');
      fetchCities();
    } catch (err: any) {
      toast.error('Error', err.message || 'Could not add city tenant');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCities = cities.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.state.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Cities & Wards' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
                <MapPin className="w-7 h-7 text-[#2563EB]" />
                <span>Cities & Regional Bounds</span>
              </h1>
              <p className="text-sm text-[#6B7280]">Configure multi-city tenant structures, municipal ward zones, and regional expansion bounds</p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add New City Tenant
            </button>
          </div>

          {/* Search Bar Card */}
          <Card className="p-4 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city tenant..."
                className="w-full pl-10 pr-4 h-[38px] rounded-xl border border-[#D1D5DB] bg-white text-xs text-[#111827] font-semibold focus:border-[#2563EB] focus:outline-none placeholder:text-[#9CA3AF]"
              />
            </div>
            <span className="text-xs font-bold text-[#6B7280]">Configured Tenants: {filteredCities.length}</span>
          </Card>

          {/* Cities List */}
          {loading ? (
            <div className="text-center py-12 text-[#6B7280] text-sm font-medium">Loading configured city bounds...</div>
          ) : filteredCities.length === 0 ? (
            <div className="text-center py-12 text-[#6B7280] text-sm font-medium">No city tenants found.</div>
          ) : (
            <div className="space-y-3">
              {filteredCities.map((c) => (
                <Card key={c.id} className="p-5 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs flex items-center justify-between gap-4 hover:border-blue-200 transition-all">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-[#111827] font-sans flex items-center gap-2">
                      <span>{c.name}, {c.state}</span>
                    </h4>
                    <p className="text-xs text-[#6B7280]">
                      {c.areas_count > 0 ? `${c.areas_count} Municipal Wards Configured` : 'Target Regional Node'} • <span className="font-mono text-[11px]">/{c.slug}</span>
                    </p>
                  </div>

                  <Badge variant={c.status.includes('Active') ? 'success' : 'purple'} className="px-3 py-1 rounded-full text-xs font-bold">
                    {c.status}
                  </Badge>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal: Add New City Tenant */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 bg-white rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#111827]">Add New City Tenant</h2>
              <button onClick={() => setShowModal(false)} className="text-[#6B7280] hover:bg-[#F3F4F6] p-1.5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCity} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4B5563]">City / Regional Hub Name *</label>
                <input
                  type="text"
                  required
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  placeholder="e.g. Kozhikode (Calicut), Kochi, Kannur"
                  className="w-full h-10 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4B5563]">State / Province</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4B5563]">Operating Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="active">Active Operating City</option>
                  <option value="expansion">Expansion Prepared (Inactive)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-bold text-[#4B5563] hover:bg-[#F3F4F6] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Save City Tenant
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
