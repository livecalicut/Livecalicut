'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { AuthActionButton } from '@/components/auth/auth-action-button';
import { businessApi } from '@/lib/services/api-client';
import { toast } from '@/lib/toast';
import { Star } from 'lucide-react';

type WriteReviewButtonProps = {
  businessId: string;
  slug: string;
  businessName: string;
};

export function WriteReviewButton({ businessId, slug, businessName }: WriteReviewButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (comment.trim().length < 5) {
      toast.warning('Add a bit more', 'Please write at least 5 characters.');
      return;
    }
    try {
      setSubmitting(true);
      await businessApi.addReview(slug, { rating, comment: comment.trim(), businessId });
      toast.success('Review posted', 'Thanks for sharing your experience.');
      setOpen(false);
      setComment('');
      setRating(5);
      router.refresh();
    } catch (err) {
      toast.error('Could not post review', err instanceof Error ? err.message : 'Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AuthActionButton
        size="sm"
        className="gap-1"
        loginMessage="Sign in to write a review for this business."
        pending={{ type: 'custom', href: `/business/${slug}` }}
        onAuthedClick={() => setOpen(true)}
      >
        Write a Review
      </AuthActionButton>

      <Dialog open={open} onClose={() => setOpen(false)} title={`Review ${businessName}`}>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Your rating
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="rounded p-0.5"
                  aria-label={`${value} stars`}
                >
                  <Star
                    className={`h-6 w-6 ${
                      value <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="review-comment" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Your review
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="What stood out about this place?"
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#2563EB]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button size="sm" onClick={submit} disabled={submitting} className="bg-[#2563EB] text-white hover:bg-[#1D4ED8]">
              {submitting ? 'Posting…' : 'Post review'}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
