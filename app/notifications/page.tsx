'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { useNotifications, useMarkNotificationRead } from '@/hooks/use-notifications';
import { toast } from '@/lib/toast';
import { Bell, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Notification } from '@/lib/types/api.types';

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications();
  const markReadMutation = useMarkNotificationRead();

  const notifications = (data?.data as Notification[] | undefined) ?? [
    {
      id: '1',
      user_id: '1',
      title: 'Business Verified Successfully',
      body: 'Paragon Restaurant business listing has been verified by City Admin.',
      type: 'business_approved',
      is_read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      user_id: '1',
      title: 'New Customer Inquiry Lead Received',
      body: 'Dr. Faisal Ahmed requested a catering quote for 120 guests.',
      type: 'inquiry_received',
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ];

  const handleMarkRead = async (id: string) => {
    try {
      await markReadMutation.mutateAsync(id);
      toast.success('Notification Read', 'Marked notification as read.');
    } catch {
      toast.error('Update Failed', 'Could not update notification status.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <PageHeader
        title="Notification Center"
        description="Realtime alerts for business approvals, candidate applications & customer leads."
        icon={<Bell className="w-6 h-6" />}
        breadcrumbs={[{ label: 'Notification Center' }]}
        action={
          <Button variant="outline" size="sm" className="gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Realtime Active
          </Button>
        }
      />

      {isLoading ? (
        <ListSkeleton count={4} cols={1} />
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          description="You are all caught up! Realtime activity notifications will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={`p-4 border surface-card transition-all flex flex-wrap items-center justify-between gap-3 ${
                n.is_read
                  ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-80'
                  : 'border-cyan-500/40 bg-cyan-50/30 dark:bg-slate-900 shadow-md shadow-cyan-500/5'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={n.is_read ? 'secondary' : 'purple'} className="uppercase text-[10px] font-bold">
                    {n.type || 'system'}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.body}</p>
              </div>

              <div className="flex items-center gap-2">
                {!n.is_read && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkRead(n.id)}
                    disabled={markReadMutation.isPending}
                    className="text-xs"
                  >
                    Mark as Read
                  </Button>
                )}
                <Link
                  href="/merchant/leads"
                  className="font-bold text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                >
                  View <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
