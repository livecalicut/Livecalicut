import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { HeroBanner } from '@/components/shared/hero-banner';
import { CategoryCard } from '@/components/shared/category-card';
import { SectionTitle } from '@/components/shared/section-title';
import { BusinessCard } from '@/components/cards/business-card';
import { JobCard } from '@/components/cards/job-card';

import { CityMetrics } from '@/components/shared/city-metrics';
import { VisionSection } from '@/components/shared/vision-section';
import { CityTimeline } from '@/components/shared/city-timeline';
import { PartnerLogos } from '@/components/shared/partner-logos';
import { Testimonials } from '@/components/shared/testimonials';
import { AppDownloadBanner } from '@/components/shared/app-download-banner';

import { Section } from '@/components/layout/section';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';

import {
  Building2,
  Newspaper,
  Calendar,
  Briefcase,
  ShoppingBag,
  Building,
  Compass,
  GraduationCap,
  Activity,
  Utensils,
  Hotel,
  Ambulance,
  Users,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

import { AdminService } from '@/lib/services/admin.service';

export default async function HomePage() {
  // ── Fetch real data from Supabase (Server Component) ──────────────────────
  const supabase = await createClient();

  const [
    { data: featuredBusinesses },
    { data: activeJobs },
    { data: cmsSettingsRow },
    realMetricsRaw
  ] = await Promise.all([
    supabase
      .from('businesses')
      .select('id, slug, name, business_categories(name), areas(name), avg_rating, review_count, phone')
      .eq('status', 'active')
      .eq('is_featured', true)
      .is('deleted_at', null)
      .order('avg_rating', { ascending: false })
      .limit(4),
    supabase
      .from('jobs')
      .select('id, slug, title, salary_min, salary_max, salary_currency, job_type, companies(name), areas(name)')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('settings')
      .select('value')
      .eq('key', 'cms')
      .single(),
    AdminService.getDashboardMetrics(supabase)
  ]);

  const cmsData = cmsSettingsRow?.value || {};

  const realMetrics = [
    {
      icon: 'Building2',
      color: 'text-[#2563EB]',
      label: 'Verified Outlets',
      value: `${realMetricsRaw.activeBusinesses}+`,
      bgColor: 'bg-blue-50',
      subtext: 'Shops, dining & healthcare across 21 Calicut spatial wards',
      borderColor: 'border-blue-200'
    },
    {
      icon: 'Briefcase',
      color: 'text-emerald-600',
      label: 'Cyberpark IT Jobs',
      value: `${realMetricsRaw.activeJobs}+`,
      bgColor: 'bg-emerald-50',
      subtext: 'Software engineering & corporate hiring positions posted',
      borderColor: 'border-emerald-200'
    },
    {
      icon: 'Users',
      color: 'text-purple-600',
      label: 'Connected Citizens',
      value: `${realMetricsRaw.totalUsers}`,
      bgColor: 'bg-purple-50',
      subtext: 'Registered Kozhikode residents on platform',
      borderColor: 'border-purple-200'
    },
    {
      icon: 'Building',
      color: 'text-indigo-600',
      label: 'Real Estate Listings',
      value: `${realMetricsRaw.activeProperties}`,
      bgColor: 'bg-indigo-50',
      subtext: 'Properties, plots and commercial real estate listed',
      borderColor: 'border-indigo-200'
    }
  ];

  // 13 Module Shortcut Navigation Cards
  const quickAccessModules = [
    { title: 'Businesses', desc: 'Shops, dining & clinics', icon: <Building2 className="w-5 h-5" />, href: '/business', badge: 'Directory' },
    { title: 'Local News', desc: 'Kozhikode editorial stories', icon: <Newspaper className="w-5 h-5" />, href: '/news', badge: 'Verified', badgeVariant: 'purple' as const },
    { title: 'City Events', desc: 'Cultural fests & schedules', icon: <Calendar className="w-5 h-5" />, href: '/events', badge: 'Cultural', badgeVariant: 'secondary' as const },
    { title: 'Jobs & Hiring', desc: 'Cyberpark & local openings', icon: <Briefcase className="w-5 h-5" />, href: '/jobs', badge: 'Cyberpark', badgeVariant: 'warning' as const },
    { title: 'Buy & Sell', desc: 'Pre-owned items & cars', icon: <ShoppingBag className="w-5 h-5" />, href: '/marketplace', badge: 'Classifieds', badgeVariant: 'success' as const },
    { title: 'Properties', desc: 'Plots, villas & rentals', icon: <Building className="w-5 h-5" />, href: '/properties', badge: 'Real Estate' },
    { title: 'Tourism & Stays', desc: 'Beach spots & resorts', icon: <Compass className="w-5 h-5" />, href: '/tourism', badge: 'Guide' },
    { title: 'Education', desc: 'Colleges & coaching hubs', icon: <GraduationCap className="w-5 h-5" />, href: '/education', badge: 'Academia' },
    { title: 'Healthcare', desc: 'Hospitals & 24/7 labs', icon: <Activity className="w-5 h-5" />, href: '/healthcare', badge: 'Medical', badgeVariant: 'info' as const },
    { title: 'Restaurants', desc: 'Malabar dining & cafes', icon: <Utensils className="w-5 h-5" />, href: '/restaurants', badge: 'Dine Out' },
    { title: 'Hotels & Stays', desc: 'Boutique stays & suites', icon: <Hotel className="w-5 h-5" />, href: '/hotels', badge: 'Hospitality' },
    { title: 'Emergency 24/7', desc: 'Helplines & blood banks', icon: <Ambulance className="w-5 h-5" />, href: '/emergency', badge: '24/7 Priority', badgeVariant: 'destructive' as const },
    { title: 'Community', desc: 'Neighborhood forums', icon: <Users className="w-5 h-5" />, href: '/community', badge: 'Residents' },
  ];

  return (
    <div className="divide-y divide-[#E5E7EB] w-full">
      {/* SECTION 1: HERO OS LAUNCHER - FULL WIDTH EDGE-TO-EDGE VIDEO CANVAS */}
      <section id="hero-section" className="w-full relative bg-white overflow-hidden">
        <HeroBanner
          title={cmsData.hero?.title}
          subtitle={cmsData.hero?.subtitle}
          badgeText={cmsData.hero?.badgeText}
          videoUrl={cmsData.hero?.videoUrl}
        />
      </section>

      {/* SECTION 2: REALTIME CITY METRICS */}
      <Section id="city-metrics" bgVariant="secondary">
        <SectionTitle
          title="Kozhikode City Operating Metrics"
          subtitle="Real-time data engine powering 21 spatial wards across Calicut"
        />
        <CityMetrics metrics={realMetrics} />
      </Section>

      {/* SECTION 3: VISION & MISSION MANIFESTO */}
      <Section id="vision-manifesto" bgVariant="white">
        <VisionSection />
      </Section>

      {/* SECTION 4: TODAY'S LIVE CITY TIMELINE */}
      <Section id="city-timeline" bgVariant="secondary">
        <SectionTitle
          title="Today in Kozhikode"
          subtitle="Real-time editorial releases, cultural schedules, and community announcements"
          viewAllHref="/news"
          viewAllLabel="Full City Feed"
        />
        <CityTimeline />
      </Section>

      {/* SECTION 5: HYPERLOCAL ECOSYSTEM MODULE GRID */}
      <Section id="quick-access" bgVariant="white">
        <SectionTitle
          title="Explore City Services & Verticals"
          subtitle="Instant access to Kozhikode’s 13 digital OS modules"
        />
        <ResponsiveGrid cols={5}>
          {quickAccessModules.map((mod) => (
            <CategoryCard
              key={mod.title}
              title={mod.title}
              description={mod.desc}
              icon={mod.icon}
              badge={mod.badge}
              badgeVariant={mod.badgeVariant}
              href={mod.href}
            />
          ))}
        </ResponsiveGrid>
      </Section>

      {/* SECTION 6: WHY LIVECALICUT TRUST ENGINE */}
      <Section id="why-livecalicut" bgVariant="secondary">
        <SectionTitle
          title="Why Kozhikode Relies on LiveCalicut"
          subtitle="The digital trust infrastructure powering Malabar commerce"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="surface-card p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-[18px] font-bold text-[#111827] font-sans">100% Physical Ward Verification</h4>
            <p className="text-[15px] text-[#6B7280] leading-relaxed font-normal">
              Every shop, hospital, and vacancy is physically cross-checked to ensure trusted local transactions.
            </p>
          </div>

          <div className="surface-card p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-[18px] font-bold text-[#111827] font-sans">Sub-Second Universal Search</h4>
            <p className="text-[15px] text-[#6B7280] leading-relaxed font-normal">
              Query across software engineering roles, classifieds, and dining outlets in under 50 milliseconds.
            </p>
          </div>

          <div className="surface-card p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-[18px] font-bold text-[#111827] font-sans">Direct Citizen & Merchant Bridge</h4>
            <p className="text-[15px] text-[#6B7280] leading-relaxed font-normal">
              Connect directly via WhatsApp and direct call without middleman commissions or third-party delays.
            </p>
          </div>
        </div>
      </Section>

      {/* SECTION 7: FEATURED COMMERCIAL OUTLETS (REAL DATA) */}
      {featuredBusinesses && featuredBusinesses.length > 0 && (
        <Section id="featured-businesses" bgVariant="white">
          <SectionTitle
            title="Top Rated Commercial Outlets"
            subtitle="Premier dining spots, hospitals, textiles, and services in Kozhikode"
            viewAllHref="/business"
            viewAllLabel="View All Outlets"
          />
          <ResponsiveGrid cols={4}>
            {featuredBusinesses.map((biz: any) => (
              <BusinessCard
                key={biz.id}
                id={biz.id}
                slug={biz.slug}
                name={biz.name}
                category={biz.business_categories?.name ?? 'Business'}
                location={biz.areas?.name ?? 'Kozhikode'}
                rating={biz.avg_rating ?? 0}
                reviewCount={biz.review_count ?? 0}
                phone={biz.phone}
                isVerified
              />
            ))}
          </ResponsiveGrid>
        </Section>
      )}

      {/* SECTION 8: ACTIVE JOBS (REAL DATA) */}
      {activeJobs && activeJobs.length > 0 && (
        <Section id="jobs-section" bgVariant="secondary">
          <SectionTitle
            title="Cyberpark & IT Openings"
            subtitle="Software engineering, tech lead roles, and walk-in interviews"
            viewAllHref="/jobs"
            viewAllLabel="View All Jobs"
          />
          <ResponsiveGrid cols={3}>
            {activeJobs.map((job: any) => {
              const salaryLabel =
                job.salary_min && job.salary_max
                  ? `${job.salary_currency ?? '₹'}${Number(job.salary_min).toLocaleString('en-IN')} – ${Number(job.salary_max).toLocaleString('en-IN')} / mo`
                  : undefined;
              return (
                <JobCard
                  key={job.id}
                  id={job.id}
                  slug={job.slug}
                  title={job.title}
                  company={job.companies?.name ?? 'Company'}
                  location={job.areas?.name ?? 'Kozhikode'}
                  jobType={job.job_type ?? 'Full Time'}
                  salary={salaryLabel}
                />
              );
            })}
          </ResponsiveGrid>
        </Section>
      )}

      {/* SECTION 9: MERCHANT GROWTH & ECONOMIC IMPACT CTA */}
      <Section id="merchant-growth" bgVariant="white">
        <div className="surface-card p-8 lg:p-12 border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-blue-50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-[#2563EB] text-xs font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>For Kozhikode Merchants & Entrepreneurs</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827] font-sans">
                Grow Your Kozhikode Business with Verified City Traffic
              </h3>
              <p className="text-[15px] text-[#6B7280] leading-relaxed font-normal">
                Join over 12,400 Malabar store owners using LiveCalicut Merchant OS to capture verified customer leads, showcase daily offers, and post walk-in job vacancies.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <Link
                href="/merchant"
                className="inline-flex items-center gap-2 px-6 h-[48px] rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[15px] transition-all shadow-md shrink-0"
              >
                <span>Register Store Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* SECTION 10: FEATURED CITY PARTNERS */}
      <Section id="featured-partners" bgVariant="secondary">
        <SectionTitle
          title="Trusted City Partners & Institutions"
          subtitle="Empowering digital transformation across Kozhikode’s leading enterprises"
        />
        <PartnerLogos partners={[]} />
      </Section>

      {/* SECTION 11: CITIZEN SUCCESS STORIES */}
      <Section id="testimonials" bgVariant="white">
        <SectionTitle
          title="Stories from Kozhikode Residents"
          subtitle="Real voices from doctors, software engineers, and heritage merchants"
        />
        <Testimonials testimonials={[]} />
      </Section>

      {/* SECTION 12: MOBILE COMPANION APP DOWNLOAD */}
      <Section id="mobile-app" bgVariant="secondary">
        <AppDownloadBanner />
      </Section>

      {/* SECTION 13: KOZHIKODE COMMUNITY & FINAL CIVIC OS CTA */}
      <Section id="final-cta" bgVariant="white">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] font-sans">
            Ready to Connect with Everything Kozhikode?
          </h2>
          <p className="text-[16px] text-[#6B7280] leading-relaxed font-normal">
            Whether you are looking for verified clinics, Cyberpark IT vacancies, beach tourism, or selling pre-owned items—LiveCalicut is your city’s digital operating system.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href="/business"
              className="inline-flex items-center gap-2 px-8 h-[48px] rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[15px] transition-all shadow-md"
            >
              <span>Explore Digital City</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-8 h-[48px] rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#2563EB] text-[#111827] font-bold text-[15px] transition-all shadow-sm"
            >
              <span>Join Community Forum</span>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
