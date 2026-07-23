'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/shared/page-header';
import { ImageUploader } from '@/components/shared/image-uploader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/textarea';
import { businessApi } from '@/lib/services/api-client';
import { useAuthStore } from '@/src/store/useAuthStore';
import { toast } from '@/lib/toast';
import {
  Building2,
  PlusCircle,
  CheckCircle,
  Loader2,
  MapPin,
  Phone,
  MessageCircle,
  Globe,
  Clock,
  Award,
  LogIn,
  ShieldAlert,
} from 'lucide-react';

export default function CreateBusinessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, profile, roleName } = useAuthStore();
  const isStaffOrAdmin = ['Super Admin', 'City Admin', 'Marketing Executive', 'Moderator'].includes(roleName);

  const businessTypes = [
    'Restaurant', 'Cafe', 'Hotel', 'Hospital', 'Clinic', 'Pharmacy',
    'School', 'College', 'Institute', 'Shopping', 'Retail Store', 'Electronics',
    'Fashion', 'Salon', 'Gym', 'Tourism', 'Travel Agency', 'Automobile',
    'Real Estate', 'IT Company', 'Freelancer', 'Service Provider', 'Government Office',
    'NGO', 'Startup', 'Other'
  ];

  const amenitiesList = [
    'Parking', 'WiFi', 'Wheelchair Access', 'Card Payment', 'Online Payment',
    'Delivery', 'Pickup', 'Air Conditioning', 'Family Friendly', 'Pet Friendly'
  ];

  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('Restaurant');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('Mavoor Road');
  const [description, setDescription] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Parking', 'WiFi', 'Card Payment']);
  const [openingHours, setOpeningHours] = useState('08:00 AM - 10:00 PM (Mon - Sun)');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Auth Guard
  if (!user && !profile) {
    return (
      <div className="max-w-xl mx-auto py-16 space-y-6 text-center">
        <Card className="p-8 border border-amber-200 bg-amber-50/50 rounded-3xl shadow-xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-[#111827] font-sans">Login Required to Register Outlets</h3>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Only registered citizens and verified business owners can post outlets on LiveCalicut to prevent fraud and spam listings.
            </p>
          </div>
          <Link href="/login?next=/business/create">
            <Button className="h-[44px] px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold gap-2 shadow-md mt-2">
              <LogIn className="w-4 h-4" /> Sign In / Register First
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !location || !description) {
      toast.error('Validation Error', 'Please fill in all mandatory business details.');
      return;
    }

    try {
      setSubmitting(true);
      await businessApi.create({
        name,
        category: businessType,
        phone,
        location: `${area}, ${location}`,
        description,
        cover_image: coverImage || undefined,
        ownerEmail: ownerEmail || undefined,
      });

      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast.success('Business Registered!', 'Listing submitted for 100% Ward Physical Checks.');
      setSubmitted(true);
      setTimeout(() => {
        router.push('/business');
      }, 2000);
    } catch (err: any) {
      toast.error('Submission Error', err.message || 'Could not save business listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <PageHeader
        title="Register Kozhikode Commercial Outlet"
        description="Add your business to Kozhikode’s Digital Operating System across 21 spatial wards."
        icon={<Building2 className="w-6 h-6 text-[#2563EB]" />}
        breadcrumbs={[
          { label: 'Business Directory', href: '/business' },
          { label: 'Register Outlet' },
        ]}
      />

      {submitted ? (
        <Card className="p-8 text-center space-y-4 border border-emerald-200 bg-emerald-50/50 rounded-3xl shadow-xl">
          <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-[#111827] font-sans">
              Business Registered & Sent for Physical Ward Verification!
            </h3>
            <p className="text-sm text-[#6B7280]">
              Our Kozhikode ward moderation team will physically verify your outlet details. Redirecting to Business Directory...
            </p>
          </div>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Business Core Metadata */}
          <Card className="p-6 sm:p-8 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
              <Building2 className="w-5 h-5 text-[#2563EB]" />
              <h3 className="text-lg font-bold text-[#111827] font-sans">1. Outlet Core Information</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Business Outlet Name *
                </label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Paragon Restaurant & Dining"
                  className="h-[44px] rounded-xl border-[#E5E7EB] text-[#111827] font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Business Type & Vertical *
                  </label>
                  <Select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full h-[44px] text-xs rounded-xl border-[#E5E7EB] font-semibold text-[#111827]"
                  >
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    GST / Trade License Number (Optional)
                  </label>
                  <Input
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    placeholder="e.g., 32AAAAA0000A1Z5"
                    className="h-[44px] rounded-xl border-[#E5E7EB] text-[#111827] font-mono"
                  />
                </div>
              </div>

              <ImageUploader
                value={coverImage}
                onChange={setCoverImage}
                module="businesses"
                label="Storefront Cover Image"
              />

              {isStaffOrAdmin && (
                <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                    Staff-Only: Assign Business Owner
                  </h4>
                  <div>
                    <label className="block text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                      Owner's Email Address (Optional)
                    </label>
                    <Input
                      type="email"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="owner@business.com"
                      className="h-[44px] rounded-xl border-blue-200 bg-white text-[#111827] font-semibold focus:border-blue-500 focus:ring-0"
                    />
                    <p className="text-[10px] text-blue-600 mt-1">
                      If the owner has an account, this links the business to them. If not, they will receive an email invitation to set up their password and access their Merchant Dashboard.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Section 2: Contact Desks & Direct Channels */}
          <Card className="p-6 sm:p-8 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
              <Phone className="w-5 h-5 text-[#2563EB]" />
              <h3 className="text-lg font-bold text-[#111827] font-sans">2. Customer Contact Desks</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Primary Phone Line *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
                  <Input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 495 276 8920"
                    className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  WhatsApp Direct Inquiry Line
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
                  <Input
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+91 98470 12345"
                    className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@store.in"
                  className="h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Website URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
                  <Input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://store.in"
                    className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Spatial Ward & Location Details */}
          <Card className="p-6 sm:p-8 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
              <MapPin className="w-5 h-5 text-[#2563EB]" />
              <h3 className="text-lg font-bold text-[#111827] font-sans">3. Ward Location & Address</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    City / District *
                  </label>
                  <Input readOnly value="Kozhikode (Calicut)" className="h-[44px] rounded-xl border-[#E5E7EB] bg-[#F8FAFC] text-[#6B7280] font-bold cursor-not-allowed" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                    Area / Spatial Ward *
                  </label>
                  <Input
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g., Mavoor Road Junction / SM Street"
                    className="h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Full Physical Street Address *
                </label>
                <Input
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Near Railway Station, Mavoor Road, Kozhikode, Kerala 673001"
                  className="h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Operating Hours *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
                  <Input
                    required
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    className="pl-10 h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Business Description & Offerings *
                </label>
                <Textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed description of your products, cuisine, medical services, or corporate offerings..."
                  className="rounded-xl border-[#E5E7EB] text-[#111827]"
                />
              </div>
            </div>
          </Card>

          {/* Section 4: Amenities & Features Pills */}
          <Card className="p-6 sm:p-8 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-3">
              <Award className="w-5 h-5 text-[#2563EB]" />
              <h3 className="text-lg font-bold text-[#111827] font-sans">4. Features & Amenities</h3>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {amenitiesList.map((item) => {
                const isSelected = selectedAmenities.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleAmenity(item)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-blue-50 border-[#2563EB] text-[#2563EB] shadow-xs'
                        : 'bg-[#F8FAFC] border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{item}
                  </button>
                );
              })}
            </div>
          </Card>

          <Button type="submit" disabled={submitting} className="w-full h-[50px] rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm gap-2 shadow-lg">
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Registering Business...
              </>
            ) : (
              <>
                <PlusCircle className="w-5 h-5" /> Submit Business for 100% Physical Ward Checks
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
