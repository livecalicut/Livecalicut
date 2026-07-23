'use client';

import React, { useState } from 'react';
import { MerchantSidebar } from '@/components/merchant/merchant-sidebar';
import { MerchantHeader } from '@/components/merchant/merchant-header';
import { Card } from '@/components/ui/card';
import { MessageSquare, Star, Reply, Flag, CheckCircle2 } from 'lucide-react';

export default function MerchantReviewsPage() {
  const [reviews, setReviews] = useState([
    { id: '1', reviewer: 'Dr. Faisal Rahman', rating: 5, comment: 'Exceptional Malabar cuisine and prompt customer response. Ward physical verification gives complete peace of mind!', date: 'Today, 01:10 PM', reply: 'Thank you Dr. Faisal! We are honored to serve authentic Malabar flavors.' },
    { id: '2', reviewer: 'Anjali Nambiar', rating: 5, comment: 'Great ambiance and smooth booking process via LiveCalicut.', date: 'Yesterday', reply: '' },
    { id: '3', reviewer: 'K. V. Moideenkutty', rating: 4, comment: 'Authentic taste. Highly recommended for family dining in Calicut.', date: '3 days ago', reply: '' },
  ]);

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const submitReply = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, reply: replyText } : r)));
    setActiveReplyId(null);
    setReplyText('');
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MerchantHeader breadcrumbs={[{ label: 'Merchant Workspace', href: '/merchant' }, { label: 'Customer Reviews' }]} />

        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto max-w-4xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight font-sans flex items-center gap-2">
              <MessageSquare className="w-7 h-7 text-[#2563EB]" />
              <span>Customer Reviews & Feedback Stream</span>
            </h1>
            <p className="text-sm text-[#6B7280]">Respond directly to customer feedback, maintain high trust ratings, and report abusive reviews</p>
          </div>

          <div className="space-y-4">
            {reviews.map((rev) => (
              <Card key={rev.id} className="p-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-base font-bold text-[#111827] font-sans">{rev.reviewer}</h4>
                    <p className="text-[11px] text-[#6B7280]">{rev.date}</p>
                  </div>
                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating)].map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-[#4B5563] leading-relaxed italic font-normal">"{rev.comment}"</p>

                {rev.reply && (
                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1 text-xs">
                    <p className="font-bold text-[#2563EB]">Your Storefront Reply:</p>
                    <p className="text-[#111827]">{rev.reply}</p>
                  </div>
                )}

                {activeReplyId === rev.id ? (
                  <div className="space-y-3 pt-2">
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write professional store reply..."
                      className="w-full p-3 text-xs rounded-xl border border-[#E5E7EB] text-[#111827] focus:border-[#2563EB] focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setActiveReplyId(null)} className="px-3.5 py-1.5 rounded-xl border border-[#E5E7EB] text-xs font-bold text-[#6B7280]">
                        Cancel
                      </button>
                      <button onClick={() => submitReply(rev.id)} className="px-3.5 py-1.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold">
                        Publish Reply
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 flex justify-end gap-2 text-xs">
                    <button
                      onClick={() => {
                        setActiveReplyId(rev.id);
                        setReplyText(rev.reply || '');
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-[#E5E7EB] hover:border-[#2563EB] text-[#2563EB] font-bold inline-flex items-center gap-1"
                    >
                      <Reply className="w-3.5 h-3.5" /> {rev.reply ? 'Edit Reply' : 'Reply to Customer'}
                    </button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
