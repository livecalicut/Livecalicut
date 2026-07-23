'use client';

import React from 'react';
import Link from 'next/link';
import { MailCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';

export default function VerifyEmailPage() {
  return (
    <Container className="py-16 sm:py-24 flex items-center justify-center min-h-[60vh]">
      <div className="surface-card max-w-md w-full p-8 text-center space-y-6 border border-[#E5E7EB] bg-white rounded-3xl shadow-xl">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] mx-auto shadow-xs">
          <MailCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-[#111827] font-sans">Check Your Email</h1>
          <p className="text-sm text-[#6B7280] leading-relaxed font-normal">
            We sent a verification link to your registered email address. Please click the link to activate your LiveCalicut account.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link href="/login" className="w-full inline-block">
            <Button className="w-full h-[44px] rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold gap-2">
              <span>Back to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <p className="text-xs text-[#6B7280]">
            Didn&apos;t receive the email? Check your spam folder or register again.
          </p>
        </div>
      </div>
    </Container>
  );
}
