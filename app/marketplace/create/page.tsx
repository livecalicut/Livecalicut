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
import { marketplaceApi } from '@/lib/services/api-client';
import { useAuthStore } from '@/src/store/useAuthStore';
import { toast } from '@/lib/toast';
import { ShoppingBag, PlusCircle, CheckCircle, Loader2, LogIn, ShieldAlert } from 'lucide-react';

export default function CreateMarketplaceItemPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, profile } = useAuthStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('like_new');
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
            <h3 className="text-2xl font-extrabold text-[#111827] font-sans">Login Required to Post Items</h3>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Only authenticated citizens can post items for sale on Calicut Marketplace to keep classifieds spam-free.
            </p>
          </div>
          <Link href="/login?next=/marketplace/create">
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

    if (!title || !price || !description) {
      toast.error('Validation Error', 'Please fill in mandatory fields.');
      return;
    }

    try {
      setSubmitting(true);
      await marketplaceApi.create({
        title,
        category,
        price: Number(price),
        condition,
        description,
        images: imageUrl ? [imageUrl] : [],
      });

      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
      toast.success('Listing Published!', 'Your item is live on Calicut Marketplace.');
      setSubmitted(true);
      setTimeout(() => {
        router.push('/marketplace');
      }, 2000);
    } catch (err: any) {
      toast.error('Post Failed', err.message || 'Could not publish listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <PageHeader
        title="Post Pre-owned Item for Sale"
        description="List your item in Kozhikode Buy & Sell marketplace for local buyers."
        icon={<ShoppingBag className="w-6 h-6" />}
        breadcrumbs={[
          { label: 'Marketplace', href: '/marketplace' },
          { label: 'Post Item' },
        ]}
      />

      {submitted ? (
        <Card className="p-8 text-center space-y-4 border border-emerald-200 bg-emerald-50/50 rounded-3xl shadow-xl">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
          <h3 className="text-xl font-bold text-[#111827]">Classified Listing Posted!</h3>
          <p className="text-xs text-[#6B7280]">
            Your item is live on Kozhikode Buy & Sell Marketplace. Redirecting to catalog...
          </p>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card className="p-6 border border-[#E5E7EB] bg-white rounded-3xl space-y-4 shadow-xs">
            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                Item Title *
              </label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., iPhone 15 Pro Max 256GB"
                className="h-[44px] rounded-xl border-[#E5E7EB] text-[#111827] font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                Category *
              </label>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-[44px] text-xs rounded-xl border-[#E5E7EB] text-[#111827] font-semibold"
              >
                <option value="Electronics">Electronics</option>
                <option value="Mobiles & Tablets">Mobiles & Tablets</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Furniture">Furniture</option>
                <option value="Home Appliances">Home Appliances</option>
              </Select>
            </div>

            <ImageUploader
              value={imageUrl}
              onChange={setImageUrl}
              module="marketplace"
              label="Item Photo (Optional)"
            />

            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                Asking Price (in ₹) *
              </label>
              <Input
                required
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25000"
                className="h-[44px] rounded-xl border-[#E5E7EB] text-[#111827] font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                Item Condition *
              </label>
              <Select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full h-[44px] text-xs rounded-xl border-[#E5E7EB] text-[#111827] font-semibold"
              >
                <option value="brand_new">Brand New (Unopened)</option>
                <option value="like_new">Like New (Mint Condition)</option>
                <option value="used_good">Used - Good</option>
                <option value="used_fair">Used - Fair</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111827] uppercase tracking-wider mb-1">
                Detailed Specifications & Note *
              </label>
              <Textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention warranty status, original bill inclusion, reason for selling..."
                className="rounded-xl border-[#E5E7EB] text-[#111827]"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full h-[48px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold gap-2 shadow-md">
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing Item...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" /> Publish Classified Listing
                </>
              )}
            </Button>
          </Card>
        </form>
      )}
    </div>
  );
}
