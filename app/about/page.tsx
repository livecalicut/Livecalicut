import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/layout/container';
import { Building2, ShieldCheck, Zap, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <Container className="py-8 sm:py-12 space-y-8 max-w-4xl">
      <PageHeader
        title="About LiveCalicut"
        description="Kozhikode’s Digital Operating System connecting 12,400+ commercial outlets across 21 spatial wards."
        icon={<Building2 className="w-6 h-6 text-[#2563EB]" />}
        breadcrumbs={[{ label: 'About Us' }]}
      />

      <Card className="p-6 sm:p-8 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-6 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
        <div className="space-y-3">
          <h3 className="text-xl font-extrabold text-[#111827] font-sans">Empowering Malabar Commerce & Civic Discovery</h3>
          <p>
            LiveCalicut was built with a clear mission: to create a state-of-the-art, sub-second digital OS for Kozhikode. From iconic food heritage near SM Street and Kozhikode Beach to IT recruitment in Cyberpark, LiveCalicut bridges citizens, job seekers, and store owners with 100% physical ward verifications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E5E7EB]">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
            <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
            <h4 className="font-bold text-[#111827] font-sans">Ward Verified</h4>
            <p className="text-[11px] text-[#6B7280]">Physical checks for every registered business outlet.</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <Zap className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold text-[#111827] font-sans">Sub-Second Search</h4>
            <p className="text-[11px] text-[#6B7280]">Instant search queries across 13 city modules.</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
            <Heart className="w-5 h-5 text-purple-600" />
            <h4 className="font-bold text-[#111827] font-sans">Citizen First</h4>
            <p className="text-[11px] text-[#6B7280]">Direct WhatsApp & phone contact without commissions.</p>
          </div>
        </div>
      </Card>
    </Container>
  );
}
