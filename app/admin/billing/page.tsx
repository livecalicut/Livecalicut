import React from 'react';
import { CreditCard, IndianRupee, Clock, FileText, Users } from 'lucide-react';
import { fetchBillingOverviewAction } from './actions';
import { StatTile } from '@/components/dashboard/stat-tile';
import { BarBreakdown } from '@/components/dashboard/bar-breakdown';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = { title: 'Billing & Payments — LiveCalicut Admin' };

const STATUS_TONE: Record<string, string> = {
  captured: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  failed: 'bg-rose-50 text-rose-700 border-rose-200',
  refunded: 'bg-slate-100 text-slate-600 border-slate-200',
};

function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

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
      <div>
        <h1 className="font-sans text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
          Billing & Payments
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Subscription revenue and gateway transactions across the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatTile
          title="Captured revenue"
          value={data.revenueCaptured}
          icon={IndianRupee}
          tone="emerald"
          hint="All successfully captured payments"
        />
        <StatTile title="Pending" value={data.revenuePending} icon={Clock} tone="amber" />
        <StatTile
          title="Active subscriptions"
          value={data.activeSubscriptions}
          icon={Users}
          tone="blue"
        />
        <StatTile title="Transactions" value={data.paymentsCount} icon={CreditCard} tone="purple" />
        <StatTile title="Invoices" value={data.invoicesCount} icon={FileText} tone="cyan" />
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

      <Card className="space-y-4 rounded-3xl p-6">
        <h2 className="font-sans text-sm font-extrabold text-[#111827]">Recent transactions</h2>

        {data.recentPayments.length === 0 ? (
          <p className="py-10 text-center text-xs text-[#6B7280]">
            No payments have been processed yet.
          </p>
        ) : (
          <div className="-mx-2 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">Most recent payment transactions</caption>
              <thead>
                <tr className="border-b border-[#E5E7EB]">
                  {['Merchant', 'Amount', 'Gateway', 'Status', 'Date'].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-2 py-2 text-[10px] font-extrabold tracking-widest text-[#9CA3AF] uppercase"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recentPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-[#F1F5F9] transition-colors last:border-0 hover:bg-[#F8FAFC]"
                  >
                    <td className="px-2 py-3 text-xs font-bold text-[#111827]">
                      {payment.merchant}
                    </td>
                    <td className="px-2 py-3 text-xs font-extrabold text-[#111827] tabular-nums">
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>
                    <td className="px-2 py-3 text-xs text-[#6B7280] capitalize">
                      {payment.gateway}
                    </td>
                    <td className="px-2 py-3">
                      <Badge
                        className={`border text-[10px] font-bold capitalize ${
                          STATUS_TONE[payment.status] ?? STATUS_TONE.refunded
                        }`}
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-2 py-3 text-xs whitespace-nowrap text-[#6B7280]">
                      {new Date(payment.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
