'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { fetchAdminEventsAction } from './actions';
import { Card } from '@/components/ui/card';
import { Calendar, Plus, Search, XCircle, X, Loader2, MapPin, Clock } from 'lucide-react';

export default function AdminEventsPage() {
  const [search, setSearch] = useState('');
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Event Modal state
  const [showModal, setShowModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Cultural Festival');
  const [formVenue, setFormVenue] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formRegLink, setFormRegLink] = useState('');
  const [formTicketRequired, setFormTicketRequired] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const res = await fetchAdminEventsAction();
    if (res.success) setEventsList(res.data || []);
    setLoading(false);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formTitle || !formStartDate) {
      setError('Event title and start date are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription,
          category: formCategory,
          venue: formVenue,
          start_date: formStartDate,
          end_date: formEndDate || undefined,
          registration_link: formRegLink || undefined,
          is_ticket_required: formTicketRequired,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to create event');

      // Reset form
      setShowModal(false);
      setFormTitle(''); setFormDescription(''); setFormCategory('Cultural Festival');
      setFormVenue(''); setFormStartDate(''); setFormEndDate('');
      setFormRegLink(''); setFormTicketRequired(false);
      loadEvents();
    } catch (err: any) {
      setError(err.message || 'Could not create event.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const action = currentStatus === 'published' ? 'reject' : 'approve';
    const res = await fetch('/api/v1/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'event', entityId: id, action }),
    });
    if (res.ok) loadEvents();
  };

  const deleteEvent = async (id: string) => {
    if (!window.confirm('Delete this event permanently?')) return;
    const res = await fetch('/api/v1/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entityType: 'event', entityId: id, hardDelete: true }),
    });
    if (res.ok) loadEvents();
  };

  const filtered = eventsList.filter(
    (e) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.venue?.toLowerCase().includes(search.toLowerCase())
  );

  const INPUT = 'w-full h-11 px-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]';
  const LABEL = 'text-xs font-bold text-[#4B5563] uppercase tracking-wider';

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Cultural Events' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
                <Calendar className="w-7 h-7 text-[#2563EB]" />
                <span>Kozhikode Cultural Events Desk</span>
              </h1>
              <p className="text-sm text-[#6B7280]">
                Approve cultural programs, literary fests, and community schedules across Calicut
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="h-[40px] px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Create City Event
            </button>
          </div>

          {/* Search */}
          <Card className="p-4 border border-[#E5E7EB] bg-white rounded-2xl shadow-xs flex items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#6B7280] pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search event title or venue..."
                className="w-full pl-10 pr-4 h-[38px] rounded-xl border border-[#D1D5DB] bg-white text-xs text-[#111827] font-semibold focus:border-[#2563EB] focus:outline-none placeholder:text-[#9CA3AF]"
              />
            </div>
            <span className="text-xs font-bold text-[#6B7280]">Total Events: {filtered.length}</span>
          </Card>

          {/* Events Table */}
          <Card className="p-0 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-extrabold text-[#6B7280] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Event Name / Category</th>
                    <th className="py-3.5 px-4">Venue</th>
                    <th className="py-3.5 px-4">Schedule Dates</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-xs">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-8 text-[#6B7280]">Loading events...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <div className="space-y-2">
                          <Calendar className="w-10 h-10 text-[#D1D5DB] mx-auto" />
                          <p className="text-[#6B7280] font-semibold text-sm">No city events yet</p>
                          <p className="text-[#9CA3AF] text-xs">Click "Create City Event" to schedule the first cultural event.</p>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.map((e) => (
                    <tr key={e.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-bold text-[#111827] font-sans">{e.title}</p>
                        <p className="text-[11px] text-[#6B7280]">{e.event_categories?.name || 'General'}</p>
                      </td>
                      <td className="py-4 px-4 text-[#4B5563] font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#9CA3AF] shrink-0" />
                        {e.venue || 'TBD'}
                      </td>
                      <td className="py-4 px-4 font-bold text-[#2563EB]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#9CA3AF]" />
                          {new Date(e.start_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        {e.end_date && (
                          <p className="text-[11px] text-[#6B7280] font-normal">
                            → {new Date(e.end_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          e.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {e.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => toggleStatus(e.id, e.status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            e.status === 'published'
                              ? 'border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100'
                              : 'border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {e.status === 'published' ? 'Unpublish' : 'Approve & Publish'}
                        </button>
                        <button
                          onClick={() => deleteEvent(e.id)}
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

      {/* ─── Create Event Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#111827] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2563EB]" /> Create City Event
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#6B7280] hover:bg-[#F3F4F6] p-1.5 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-[#2563EB] font-semibold">
              🎭 Once published, this event will be live on the Kozhikode Cultural Events feed.
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleCreateEvent} className="space-y-4">

              <div className="space-y-1.5">
                <label className={LABEL}>Event Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Malabar Literary Festival 2025"
                  className={INPUT}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={LABEL}>Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className={INPUT}
                  >
                    <option>Cultural Festival</option>
                    <option>Music & Arts</option>
                    <option>Literary Event</option>
                    <option>Food & Culinary</option>
                    <option>Sports & Fitness</option>
                    <option>Business & Networking</option>
                    <option>Education & Workshop</option>
                    <option>Heritage & Tourism</option>
                    <option>Community Gathering</option>
                    <option>Government & Civic</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className={LABEL}>Venue / Location</label>
                  <input
                    type="text"
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    placeholder="e.g. Mananchira Square, Kozhikode"
                    className={INPUT}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={LABEL}>Start Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className={INPUT}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={LABEL}>End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className={INPUT}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={LABEL}>Event Description</label>
                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the event — schedule, highlights, guests, entry details..."
                  className="w-full px-3 py-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#111827] font-semibold focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF] resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className={LABEL}>Registration / Ticket Link (optional)</label>
                <input
                  type="url"
                  value={formRegLink}
                  onChange={(e) => setFormRegLink(e.target.value)}
                  placeholder="https://bookmyshow.com/... or WhatsApp registration link"
                  className={INPUT}
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="ticketRequired"
                  checked={formTicketRequired}
                  onChange={(e) => setFormTicketRequired(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D1D5DB] accent-[#2563EB]"
                />
                <label htmlFor="ticketRequired" className="text-xs font-bold text-[#4B5563]">
                  Entry ticket / registration required
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-bold text-[#4B5563] hover:bg-[#F3F4F6] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
                  ) : (
                    <><Calendar className="w-4 h-4" /> Publish to City Events</>
                  )}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
