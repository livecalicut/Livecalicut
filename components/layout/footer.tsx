'use client';

import React from 'react';
import Link from 'next/link';
import {
  Heart,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
} from 'lucide-react';
import { LiveCalicutLogo } from '@/components/shared/live-calicut-logo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0B132B] text-slate-400 font-sans pt-14 pb-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand & Social (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="brightness-0 invert opacity-95">
              <LiveCalicutLogo showSubtitle={false} />
            </div>
            <p className="text-xs sm:text-[13px] text-slate-400 font-normal leading-relaxed max-w-sm">
              Your trusted local platform for businesses, opportunities, services and everything Kozhikode.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1 text-slate-300">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-[#2563EB] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-[#2563EB] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-[#2563EB] hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-[#2563EB] hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-[#2563EB] hover:text-white flex items-center justify-center transition-colors"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Explore (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Explore
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium">
              <li>
                <Link href="/business" className="hover:text-white transition-colors">
                  Businesses
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-white transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-white transition-colors">
                  Classified
                </Link>
              </li>
              <li>
                <Link href="/business?category=Services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/tourism" className="hover:text-white transition-colors">
                  Tourism
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/merchant" className="hover:text-white transition-colors">
                  Advertise
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Support (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Support
            </h4>
            <ul className="space-y-2 text-xs sm:text-[13px] font-medium">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/merchant" className="hover:text-white transition-colors">
                  List Your Business
                </Link>
              </li>
              <li>
                <Link href="/merchant" className="hover:text-white transition-colors">
                  Post a Listing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Report an Issue
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: App Download (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Download Our App
            </h4>
            <span className="inline-block text-[11px] font-semibold text-blue-400 bg-blue-950/60 border border-blue-800 px-2 py-0.5 rounded-md">
              Coming Soon
            </span>
            <div className="space-y-2 pt-1">
              <div className="w-36 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
                Google Play
              </div>
              <div className="w-36 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
                App Store
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Signature */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} LiveCalicut. All rights reserved.</p>

          <div className="flex items-center gap-1.5 font-medium text-slate-300">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>for Kozhikode</span>
          </div>

          <p className="font-serif italic text-blue-300 text-xs sm:text-[13px] select-none">
            Same City. More Possibilities. LiveCalicut.
          </p>
        </div>
      </div>
    </footer>
  );
};

