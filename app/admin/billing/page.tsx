import React from 'react';
import { fetchBillingOverviewAction } from './actions';
import { StatTile } from '@/components/dashboard/stat-tile';
import { BarBreakdown } from '@/components/dashboard/bar-breakdown';
import { Card } from '@/components/ui/card';
import { AdminPageHeader } from '@/components/admin/data-table';
import { PaymentsTable } from './payments-table';

export const metadata = { title: 'Billing & Payments — LiveCalicut Admin' };

export default async function AdminBillingPage() {
  const data = await fetchBillingOverviewAction();

  if (!data.authorized) {
    return (
      <Card className="rounded-3xl p-10 text-center">
        <h1 className="text-lg font-extrabold text-[#111827]">Billing & Payments</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Billing data is restricted to Super Admin accounts.
        </p>
      </Card>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Billing & payments"
        description="Subscription revenue and gateway transactions across the platform."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatTile
          title="Captured revenue"
          value={data.revenueCaptured}
          icon="indian-rupee"
          tone="emerald"
          hint="All successfully captured payments"
        />
        <StatTile title="Pending" value={data.revenuePending} icon="clock" tone="amber" />
        <StatTile
          title="Active subscriptions"
          value={data.activeSubscriptions}
          icon="users"
          tone="blue"
        />
        <StatTile title="Transactions" value={data.paymentsCount} icon="credit-card" tone="purple" />
        <StatTile title="Invoices" value={data.invoicesCount} icon="file-text" tone="cyan" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BarBreakdown
          title="Subscriptions by plan"
          rows={data.planMix}
          emptyLabel="No subscriptions recorded yet."
        />
        <BarBreakdown
          title="Transactions by status"
          rows={data.statusMix}
          emptyLabel="No transactions recorded yet."
        />
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-[#111827]">
          Transactions <span className="font-normal text-[#6B7280]">· latest 200</span>
        </h2>
        <PaymentsTable payments={data.recentPayments} />
      </section>
    </>
  );
}
