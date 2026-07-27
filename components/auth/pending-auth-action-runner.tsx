'use client';

import React, { useEffect } from 'react';
import {
  clearPendingAuthAction,
  readPendingAuthAction,
  useRequireAuth,
} from '@/hooks/use-require-auth';
import { toast } from '@/lib/toast';
import { useRouter } from 'next/navigation';

/**
 * After login, resumes a favourited/apply navigation that was interrupted.
 * Mount once in the authenticated app shell.
 */
export function PendingAuthActionRunner() {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    const pending = readPendingAuthAction();
    if (!pending) return;

    clearPendingAuthAction();

    if (pending.href) {
      toast.success('Welcome back', pending.label || 'Continuing where you left off…');
      router.push(pending.href);
      return;
    }

    if (pending.type === 'apply-job' && pending.id) {
      toast.success('Welcome back', 'Continue your job application.');
      router.push(`/jobs/apply/${pending.id}`);
    }
  }, [isAuthenticated, isLoading, router]);

  return null;
}
