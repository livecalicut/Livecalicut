import { PageHeader } from '@/components/shared/page-header';
import { MetricGrowthCard } from '@/components/analytics/metric-growth-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, ShoppingBag, Briefcase, Building2, CreditCard } from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const metrics = [
    { title: 'Total Active Users', value: '14,250', trend: '+14.2% MoM', isPositive: true },
    { title: 'Verified Businesses', value: '840', trend: '+8.6% MoM', isPositive: true },
    { title: 'Active Cyberpark Jobs', value: '310', trend: '+22.1% MoM', isPositive: true },
    { title: 'Monthly Recurring Revenue', value: '₹1,84,500', trend: '+18.5% MoM', isPositive: true },
  ];

  const categoryBreakdown = [
    { name: 'Dining & Restaurants (Paragon, Rahmath)', percentage: 38, count: '320 listings' },
    { name: 'IT Vacancies (Cyberpark, UL Cyberpark)', percentage: 24, count: '310 posts' },
    { name: 'Real Estate (Bypass Villas, Flat Rentals)', percentage: 20, count: '290 properties' },
    { name: 'Beaches & Heritage Sites (SM Street, Kappad)', percentage: 18, count: '140 spots' },
  ];

  return (
    <div className="space-y-8 py-4">
      <PageHeader
        title="LiveCalicut Executive Analytics & BI"
        description="Comprehensive telemetry, daily active user trends, category heat maps & monthly recurring revenue metrics."
        icon={<BarChart3 className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Executive Analytics' }]}
      />

      {/* Top Growth Cards */}
      <ResponsiveGrid cols={4}>
        {metrics.map((m) => (
          <MetricGrowthCard
            key={m.title}
            title={m.title}
            value={m.value}
            trend={m.trend}
            isPositive={m.isPositive}
          />
        ))}
      </ResponsiveGrid>

      {/* Category Breakdown Progress Bar Chart */}
      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-600" /> Platform Category Heat Map Breakdown
        </h3>

        <div className="space-y-4">
          {categoryBreakdown.map((cat) => (
            <div key={cat.name} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{cat.name}</span>
                <span className="text-slate-400">{cat.count} ({cat.percentage}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
