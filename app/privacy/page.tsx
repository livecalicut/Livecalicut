import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/layout/container';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-8 sm:py-12 space-y-8 max-w-4xl">
      <PageHeader
        title="Privacy Policy"
        description="How LiveCalicut protects citizen data and respects user privacy across Kozhikode Wards."
        icon={<ShieldCheck className="w-6 h-6 text-[#2563EB]" />}
        breadcrumbs={[{ label: 'Privacy Policy' }]}
      />

      <Card className="p-6 sm:p-8 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-6 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#111827] font-sans">1. Information We Collect</h3>
          <p>
            When you register an account, post commercial business listings, submit job applications, or browse Kozhikode marketplace items, LiveCalicut collects basic contact details (full name, email address, phone number, and spatial ward location) necessary to connect citizens with verified local merchants.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#111827] font-sans">2. How We Use Your Data</h3>
          <p>
            Your information is used strictly to facilitate local commerce, route customer inquiries to verified merchants, display relevant Cyberpark IT job openings, and maintain 100% Ward Physical Checks. We never sell citizen data to third-party ad brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#111827] font-sans">3. Data Protection & Security</h3>
          <p>
            All user authentication data is securely encrypted using enterprise Supabase Auth protocols with Row Level Security (RLS) policies protecting candidate resumes, private inquiries, and administrative audit trails.
          </p>
        </section>
      </Card>
    </Container>
  );
}
