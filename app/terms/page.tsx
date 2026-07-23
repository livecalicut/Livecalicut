import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/layout/container';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <Container className="py-8 sm:py-12 space-y-8 max-w-4xl">
      <PageHeader
        title="Terms of Service & Platform Governance"
        description="Legal agreement governing citizen browsing, merchant listings, and recruitment on LiveCalicut."
        icon={<FileText className="w-6 h-6 text-[#2563EB]" />}
        breadcrumbs={[{ label: 'Terms of Service' }]}
      />

      <Card className="p-6 sm:p-8 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-6 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#111827] font-sans">1. Acceptance of Terms</h3>
          <p>
            By accessing or using LiveCalicut.com, you agree to comply with our platform terms. All commercial outlets, job vacancies, and pre-owned classifieds posted must comply with Kozhikode municipal regulations and Malabar physical verification standards.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-[#111827] font-sans">2. Merchant Responsibilities</h3>
          <p>
            Business owners and employers are responsible for maintaining accurate contact details, honest pricing, and genuine Cyberpark job requirements. Fraudulent listings will be suspended immediately via our Super Admin Control Center.
          </p>
        </section>
      </Card>
    </Container>
  );
}
