import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import {
  ShieldCheck,
  ShieldAlert,
  MessageCircle,
  Star,
  Users,
  Plus,
  ArrowUpRight,
  CreditCard,
  Building2,
  Gauge,
} from 'lucide-react';
import { fetchMerchantDashboardAction } from './actions';
import { StatTile } from '@/components/dashboard/stat-tile';

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

export default async function MerchantDashboardPage() {
  const { authorized, hasBusiness, businessName, isVerified, metrics, leads, reviews, subscription } =
    await fetchMerchantDashboardAction();

  if (!authorized) {
    return (
      <Card className="rounded-3xl p-10 text-center">
        <h1 className="text-lg font-extrabold text-[#111827]">Merchant workspace</h1>
        <p className="mt-2 text-sm text-[#6B7280]">Sign in to open your merchant dashboard.</p>
      </Card>
    );
  }

  if (!hasBusiness) {
    return (
      <Card className="rounded-3xl p-10 text-center">
        <Building2 className="mx-auto h-8 w-8 text-[#2563EB]" aria-hidden="true" />
        <h1 className="mt-3 text-lg font-extrabold text-[#111827]">No outlet registered yet</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#6B7280]">
          Once your business listing is created and approved by the city team, your leads, reviews
          and performance figures will appear here.
        </p>
        <Link
          href="/business/create"
          className="mt-5 inline-flex h-11 items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 text-xs font-bold text-white transition-colors hover:bg-[#1D4ED8]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Register your outlet
        </Link>
      </Card>
    );
  }

  return (
    <>
      {/* Welcome Banner */}
      <Card className="rounded-3xl border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-blue-50/80 p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                isVerified
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isVerified ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Verified listing</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                  <span>Verification pending</span>
                </>
              )}
            </div>
            <h1 className="font-sans text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
              {businessName}
            </h1>
            <p className="text-sm text-[#6B7280]">
              Your merchant workspace for leads, reviews and listing performance.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Link
              href="/merchant/profile"
              className="flex h-11 items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-5 text-xs font-bold text-[#111827] shadow-xs transition-all hover:border-[#2563EB]"
            >
              <Building2 className="h-4 w-4 text-[#2563EB]" aria-hidden="true" /> Edit outlet
            </Link>
            <Link
              href="/merchant/jobs"
              className="flex h-11 items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#1D4ED8]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" /> Post vacancy
            </Link>
          </div>
        </div>
      </Card>

      {/* Performance KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile title="Storefront views" value={metrics.totalViews} icon="eye" tone="blue" />
        <StatTile
          title="New leads"
          value={metrics.newLeadsCount}
          icon="users"
          tone="emerald"
          hint="Awaiting your reply"
        />
        <StatTile title="Reviews" value={metrics.totalReviews} icon="message-circle" tone="teal" />
        <StatTile
          title="Average rating"
          value={metrics.ratingAvg}
          icon="star"
          tone="amber"
          hint={metrics.totalReviews > 0 ? 'Across all listings' : 'No ratings yet'}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Leads */}
        <div className="space-y-4 lg:col-span-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-sans text-lg font-extrabold text-[#111827]">
              <Users className="h-5 w-5 text-[#2563EB]" aria-hidden="true" />
              <span>Recent customer inquiries</span>
            </h2>
            <Link
              href="/merchant/leads"
              className="flex shrink-0 items-center gap-0.5 text-xs font-bold text-[#2563EB] hover:underline"
            >
              <span>View all</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <Card className="overflow-hidden rounded-3xl p-0">
            {leads.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-[#6B7280]">
                No inquiries yet. Leads from your listings will appear here.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left">
                  <caption className="sr-only">Most recent customer inquiries</caption>
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC] text-[11px] font-extrabold tracking-wider text-[#6B7280] uppercase">
                      <th scope="col" className="px-6 py-3.5">Customer</th>
                      <th scope="col" className="px-4 py-3.5">Regarding</th>
                      <th scope="col" className="px-4 py-3.5">Status</th>
                      <th scope="col" className="px-4 py-3.5">Received</th>
                      <th scope="col" className="px-6 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] text-xs">
                    {leads.map((lead) => (
                      <tr key={`${lead.kind}-${lead.id}`} className="transition-colors hover:bg-[#F8FAFC]">
                        <td className="px-6 py-4 font-bold text-[#111827]">{lead.name}</td>
                        <td className="px-4 py-4 font-medium text-[#4B5563]">{lead.subject}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                              lead.status === 'pending'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[11px] whitespace-nowrap text-[#9CA3AF]">
                          {timeAgo(lead.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {lead.phone ? (
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-emerald-700"
                            >
                              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>WhatsApp</span>
                              <span className="sr-only"> {lead.name}</span>
                            </a>
                          ) : lead.email ? (
                            <a
                              href={`mailto:${lead.email}`}
                              className="inline-flex items-center gap-1 rounded-xl border border-[#E5E7EB] px-3 py-1.5 text-xs font-bold text-[#111827] transition-all hover:border-[#2563EB]"
                            >
                              Email<span className="sr-only"> {lead.name}</span>
                            </a>
                          ) : (
                            <span className="text-[11px] text-[#9CA3AF]">No contact</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-6 lg:col-span-4">
          <Card className="space-y-4 rounded-3xl p-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h2 className="flex items-center gap-2 font-sans text-sm font-extrabold text-[#111827]">
                <Gauge className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                <span>Profile completion</span>
              </h2>
              <span className="text-sm font-extrabold text-[#111827] tabular-nums">
                {metrics.profileCompletion}%
              </span>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]"
              role="progressbar"
              aria-valuenow={metrics.profileCompletion}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Profile completion"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA]"
                style={{ width: `${metrics.profileCompletion}%` }}
              />
            </div>
            {metrics.profileCompletion < 100 && (
              <Link
                href="/merchant/profile"
                className="block text-xs font-bold text-[#2563EB] hover:underline"
              >
                Complete your listing →
              </Link>
            )}
          </Card>

          <Card className="space-y-4 rounded-3xl p-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h2 className="flex items-center gap-2 font-sans text-sm font-extrabold text-[#111827]">
                <CreditCard className="h-4 w-4 text-[#2563EB]" aria-hidden="true" />
                <span>Subscription</span>
              </h2>
              {subscription && (
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-[#2563EB] capitalize">
                  {subscription.status}
                </span>
              )}
            </div>

            {subscription ? (
              <dl className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <dt className="text-[#6B7280]">Plan</dt>
                  <dd className="font-bold text-[#111827]">{subscription.planName}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[#6B7280]">Billing cycle</dt>
                  <dd className="font-bold text-[#111827] capitalize">
                    {subscription.billingCycle}
                  </dd>
                </div>
                {subscription.daysRemaining !== null && (
                  <div className="flex items-center justify-between">
                    <dt className="text-[#6B7280]">Renews in</dt>
                    <dd className="font-bold text-[#2563EB]">
                      {subscription.daysRemaining} days
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-[#6B7280]">
                  You are on the free tier. Upgrade for higher search placement and unlimited lead
                  capture.
                </p>
                <Link
                  href="/merchant/subscription"
                  className="inline-flex rounded-xl bg-[#2563EB] px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-[#1D4ED8]"
                >
                  View plans
                </Link>
              </div>
            )}
          </Card>

          <Card className="space-y-4 rounded-3xl p-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h2 className="font-sans text-sm font-extrabold text-[#111827]">Latest feedback</h2>
              <Link
                href="/merchant/reviews"
                className="text-xs font-bold text-[#2563EB] hover:underline"
              >
                Manage all
              </Link>
            </div>

            {reviews.length === 0 ? (
              <p className="py-4 text-center text-xs text-[#6B7280]">No reviews yet.</p>
            ) : (
              <ul className="space-y-3">
                {reviews.map((review) => (
                  <li
                    key={review.id}
                    className="space-y-1.5 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-3.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-bold text-[#111827]">{review.reviewer}</span>
                      <span
                        className="flex shrink-0 items-center text-amber-500"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400" aria-hidden="true" />
                        ))}
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-[#4B5563] italic">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                    <p className="text-[10px] text-[#9CA3AF]">{timeAgo(review.created_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
