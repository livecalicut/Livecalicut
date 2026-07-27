'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { MessageSquare, Star, Reply } from 'lucide-react';
import { getMerchantDashboardData, type MerchantReview } from '@/app/merchant/actions';

function formatReviewDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function MerchantReviewsPage() {
  const [reviews, setReviews] = useState<(MerchantReview & { reply?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getMerchantDashboardData();
        if (!cancelled) setReviews(data.reviews.map((r) => ({ ...r, reply: '' })));
      } catch {
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const submitReply = (id: string) => {
    // Local-only reply draft until a reply API exists.
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reply: replyText } : r)));
    setActiveReplyId(null);
    setReplyText('');
  };

  return (
    <>
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111827] font-sans flex items-center gap-2">
          <MessageSquare className="h-7 w-7 text-[#2563EB]" />
          <span>Customer Reviews & Feedback Stream</span>
        </h1>
        <p className="text-sm text-[#6B7280]">
          Reviews synced from your live business listings in Kozhikode.
        </p>
      </div>

      <div className="space-y-4">
        {loading && (
          <p className="py-8 text-center text-sm text-[#6B7280]">Loading reviews…</p>
        )}
        {!loading && reviews.length === 0 && (
          <Card className="rounded-3xl border border-dashed border-[#E5E7EB] bg-white p-8 text-center text-sm text-[#6B7280]">
            No customer reviews yet. They will appear here as people rate your listings.
          </Card>
        )}
        {reviews.map((rev) => (
          <Card
            key={rev.id}
            className="space-y-4 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-base font-bold text-[#111827] font-sans">{rev.reviewer}</h4>
                <p className="text-[11px] text-[#6B7280]">{formatReviewDate(rev.created_at)}</p>
              </div>
              <div className="flex items-center text-amber-500">
                {[...Array(rev.rating)].map((_, r) => (
                  <Star key={r} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
            </div>

            <p className="text-sm italic font-normal leading-relaxed text-[#4B5563]">
              &ldquo;{rev.comment}&rdquo;
            </p>

            {rev.reply ? (
              <div className="space-y-1 rounded-2xl border border-blue-200 bg-blue-50 p-3.5 text-xs">
                <p className="font-bold text-[#2563EB]">Your Storefront Reply:</p>
                <p className="text-[#111827]">{rev.reply}</p>
              </div>
            ) : null}

            {activeReplyId === rev.id ? (
              <div className="space-y-3 pt-2">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write professional store reply..."
                  className="w-full rounded-xl border border-[#E5E7EB] p-3 text-xs text-[#111827] focus:border-[#2563EB] focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveReplyId(null)}
                    className="rounded-xl border border-[#E5E7EB] px-3.5 py-1.5 text-xs font-bold text-[#6B7280]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => submitReply(rev.id)}
                    className="rounded-xl bg-[#2563EB] px-3.5 py-1.5 text-xs font-bold text-white"
                  >
                    Publish Reply
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveReplyId(rev.id);
                    setReplyText(rev.reply || '');
                  }}
                  className="inline-flex items-center gap-1 rounded-xl border border-[#E5E7EB] px-3 py-1.5 font-bold text-[#2563EB]"
                >
                  <Reply className="h-3.5 w-3.5" /> Reply
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
