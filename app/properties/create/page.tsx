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
import { propertiesApi } from '@/lib/services/api-client';
import { useAuthStore } from '@/src/store/useAuthStore';
import { toast } from '@/lib/toast';
import { Building, PlusCircle, CheckCircle, Loader2, LogIn, ShieldAlert } from 'lucide-react';

export default function CreatePropertyPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, profile } = useAuthStore();

  const [title, setTitle] = useState('');
  const [listingType, setListingType] = useState('sale');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('3');
  const [areaSqft, setAreaSqft] = useState('2400');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
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
            <h3 className="text-2xl font-extrabold text-[#111827] font-sans">Login Required to Post Property</h3>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Only authenticated users, verified agents, and builders can post real estate listings on LiveCalicut.
            </p>
          </div>
          <Link href="/login?next=/properties/create">
            <Button className="h-[44px] px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold gap-2 shadow-md mt-2">
              <LogIn className="w-4 h-4" /> Sign In / Register First
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !price || !description || !areaSqft) {
      toast.error('Validation Error', 'Please complete mandatory property details.');
      return;
    }

    try {
      setSubmitting(true);
      await propertiesApi.create({
        title,
        listing_type: listingType,
        price: Number(price),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        area_sqft: Number(areaSqft),
        description,
        images: imageUrl ? [imageUrl] : [],
      });

      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property Listed!', 'Your property is published on LiveCalicut Real Estate.');
      setSubmitted(true);
      setTimeout(() => {
        router.push('/properties');
      }, 2000);
    } catch (err: any) {
      toast.error('Post Failed', err.message || 'Could not publish property.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <PageHeader
        title="Post Real Estate Property Listing"
        description="List your villa, apartment, commercial office or plot in Kozhikode."
        icon={<Building className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Properties', href: '/properties' },
          { label: 'Post Property' },
        ]}
      />

      {submitted ? (
        <Card className="p-8 text-center space-y-4 border border-emerald-200 bg-emerald-50/50 rounded-3xl shadow-xl">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold text-[#111827]">Property Listing Published!</h3>
          <p className="text-xs text-[#6B7280]">
            Your real estate property is live on LiveCalicut Real Estate Portal. Redirecting to properties...
          </p>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl space-y-4 shadow-xs">
            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                Property Title *
              </label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Independent 3 BHK Luxury Villa in Bypass"
                className="h-[44px] rounded-xl border-[#E5E7EB] text-[#111827] font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Listing Type *
                </label>
                <Select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                  className="w-full h-[44px] text-xs rounded-xl border-[#E5E7EB] text-[#111827] font-semibold uppercase"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                  <option value="lease">For Lease</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Price / Rent (in ₹) *
                </label>
                <Input
                  required
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="12500000"
                  className="h-[44px] rounded-xl border-[#E5E7EB] text-[#111827] font-bold"
                />
              </div>
            </div>

            <ImageUploader
              value={imageUrl}
              onChange={setImageUrl}
              module="properties"
              label="Property Front Image (Optional)"
            />

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Bedrooms
                </label>
                <Input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Bathrooms
                </label>
                <Input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="h-[44px] rounded-xl border-[#E5E7EB] text-[#111827]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                  Area (sq.ft) *
                </label>
                <Input
                  required
                  type="number"
                  value={areaSqft}
                  onChange={(e) => setAreaSqft(e.target.value)}
                  className="h-[44px] rounded-xl border-[#E5E7EB] text-[#111827] font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                Property Description *
              </label>
              <Textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention key highlights, distance to Cyberpark / Railway station, parking space..."
                className="rounded-xl border-[#E5E7EB] text-[#111827]"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full h-[48px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold gap-2 shadow-md">
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing Property...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" /> Publish Real Estate Listing
                </>
              )}
            </Button>
          </Card>
        </form>
      )}
    </div>
  );
}
