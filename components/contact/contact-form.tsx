'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`LiveCalicut enquiry from ${name || 'visitor'}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '—'}\n\n${message}`
    );
    window.location.href = `mailto:hello@livecalicut.com?subject=${subject}&body=${body}`;
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex h-full min-h-[280px] flex-col items-start justify-center rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 sm:p-8">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" aria-hidden />
        <h2 className="mt-4 text-xl font-bold text-[#111827]">Message ready to send</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
          Your email app should open with this enquiry. If it did not, write to hello@livecalicut.com.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs sm:p-8"
    >
      <h2 className="text-xl font-bold text-[#111827]">Send a message</h2>
      <p className="mt-1 text-sm text-[#6B7280]">
        Tell us about listings, merchant onboarding, or city partnerships.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-semibold text-[#111827]">
          <span>Name</span>
          <Input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </label>
        <label className="space-y-1.5 text-sm font-semibold text-[#111827]">
          <span>Email</span>
          <Input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </label>
      </div>

      <label className="mt-4 block space-y-1.5 text-sm font-semibold text-[#111827]">
        <span>Phone</span>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91"
          autoComplete="tel"
        />
      </label>

      <label className="mt-4 block space-y-1.5 text-sm font-semibold text-[#111827]">
        <span>Message</span>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="How can we help?"
          className="w-full rounded-xl border border-[#D1D5DB] bg-white px-3.5 py-2.5 text-sm font-medium text-[#111827] placeholder:text-[#9CA3AF] shadow-2xs focus-visible:border-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
        />
      </label>

      <button
        type="submit"
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] px-6 text-sm font-bold text-white transition hover:bg-[#1D4ED8] sm:w-auto"
      >
        Send message
        <ArrowRight className="h-4 w-4" aria-hidden />
      </button>
    </form>
  );
};
