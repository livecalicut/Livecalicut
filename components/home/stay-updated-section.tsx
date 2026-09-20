'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export const StayUpdatedSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsLoading(true);

    // Simulate quick subscription or call API
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 400);
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16 border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs">
          {/* Subtle Background Cityscape Outline */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none hidden md:block select-none max-w-sm">
            <img
              src="/heroes/coastal-life.jpg"
              alt="Calicut City"
              className="w-full h-auto object-cover filter grayscale"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content & Form */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
                    Stay Updated
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
                    Get the latest updates, events, offers and stories from Kozhikode.
                  </p>
                </div>
              </div>

              {isSubscribed ? (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Thank you for subscribing! You are now connected to Kozhikode city alerts.</span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 max-w-md"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] shadow-2xs"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-70 text-white font-bold text-xs sm:text-sm transition-all shadow-xs shrink-0 cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>{isLoading ? 'Joining...' : 'Subscribe'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Right Graphic / Slogan */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center space-y-1">
              <span className="font-serif italic text-lg sm:text-2xl text-slate-700 font-medium tracking-tight text-right select-none">
                A Stronger <br className="hidden lg:inline" />
                Kozhikode Together.
              </span>
              <span className="text-[11px] text-slate-400 font-sans">
                Join 12,000+ local citizens
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
