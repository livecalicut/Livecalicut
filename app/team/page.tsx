import Link from 'next/link';
import { Users, ShieldCheck, Building2, Newspaper, ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/container';

export const metadata = {
  title: 'Our Team — LiveCalicut',
  description: 'Meet the people building Kozhikode’s digital operating system.',
};

const TEAM = [
  {
    name: 'City Operations',
    role: 'Ward verification & merchant onboarding',
    focus: 'Physical checks across Kozhikode wards, outlet approvals, and merchant support.',
    icon: Building2,
  },
  {
    name: 'Product & Platform',
    role: 'Search, listings & citizen experience',
    focus: 'Building the LiveCalicut OS — directory, jobs, marketplace, and civic discovery.',
    icon: ShieldCheck,
  },
  {
    name: 'Editorial Desk',
    role: 'News, events & city updates',
    focus: 'Local stories, cultural calendars, and verified civic announcements for Calicut.',
    icon: Newspaper,
  },
  {
    name: 'Growth & Partnerships',
    role: 'Cyberpark, institutions & city partners',
    focus: 'Connecting employers, colleges, and civic partners to the platform.',
    icon: Users,
  },
] as const;

export default function TeamPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#F8FAFC] font-sans">
      <Container className="space-y-10 py-10 sm:py-14">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold tracking-[0.18em] text-[#2563EB] uppercase">
            Our Team
          </p>
          <h1 className="mt-2 font-sans text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">
            Built in Kozhikode, for Kozhikode
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#6B7280]">
            LiveCalicut is run by a local team focused on verified commerce, jobs, news, and civic
            discovery across Malabar — not a generic marketplace drop-in.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {TEAM.map((member) => {
            const Icon = member.icon;
            return (
              <article
                key={member.name}
                className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-xs sm:p-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-[#2563EB]">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="mt-4 text-lg font-bold text-[#111827]">{member.name}</h2>
                <p className="mt-1 text-sm font-semibold text-[#2563EB]">{member.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">{member.focus}</p>
              </article>
            );
          })}
        </div>

        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-[#111827]">Want to work with us?</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6B7280]">
            Merchants, Cyberpark employers, journalists, and civic partners — tell us what you’re
            building in Kozhikode. We’ll route you to the right desk.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex h-11 items-center gap-1.5 rounded-2xl bg-[#2563EB] px-5 text-sm font-bold text-white hover:bg-[#1D4ED8]"
            >
              Contact the team
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/merchant"
              className="inline-flex h-11 items-center rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-5 text-sm font-bold text-[#111827] hover:border-[#2563EB]"
            >
              Merchant signup
            </Link>
            <Link
              href="/jobs"
              className="inline-flex h-11 items-center rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-5 text-sm font-bold text-[#111827] hover:border-[#2563EB]"
            >
              Open roles
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
