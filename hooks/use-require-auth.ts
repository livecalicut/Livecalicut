'use client';

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useAuthPrompt } from '@/components/auth/auth-prompt-provider';
import { toast } from '@/lib/toast';

const PENDING_KEY = 'lc:pending-auth-action';

export type PendingAuthAction = {
  type: 'save-job' | 'save-marketplace' | 'save-business' | 'save-property' | 'apply-job' | 'custom';
  id?: string;
  href?: string;
  label?: string;
};

export function stashPendingAuthAction(action: PendingAuthAction) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(action));
  } catch {
    /* ignore */
  }
}

export function readPendingAuthAction(): PendingAuthAction | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingAuthAction;
  } catch {
    return null;
  }
}

export function clearPendingAuthAction() {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Gate for favourites, apply, create, and other signed-in-only actions.
 * Guests → login popup (no hard redirect). Unconfirmed email → blocked until verified.
 * Returns false without calling any API when the user cannot proceed.
 */
export function useRequireAuth() {
  const pathname = usePathname();
  const { promptLogin } = useAuthPrompt();
  const { user, profile, isLoading } = useAuthStore();

  const isAuthenticated = Boolean(user);
  const emailUnconfirmed = user?.email_confirmed_at === null;

  const requireAuth = useCallback(
    (options?: {
      next?: string;
      pending?: PendingAuthAction;
      message?: string;
      requireVerified?: boolean;
    }): boolean => {
      const next = options?.next || pathname || '/';

      if (isLoading) {
        toast.info('Please wait', 'Checking your session…');
        return false;
      }

      if (!user) {
        if (options?.pending) stashPendingAuthAction(options.pending);
        promptLogin({
          next,
          message:
            options?.message ||
            'Sign in to save favourites, apply for jobs, write reviews, and manage your account.',
        });
        return false;
      }

      if (options?.requireVerified !== false && emailUnconfirmed) {
        toast.warning(
          'Verify your email',
          'Confirm your email address before favouriting or applying. Check your inbox for the link.'
        );
        return false;
      }

      return true;
    },
    [emailUnconfirmed, isLoading, pathname, promptLogin, user]
  );

  return {
    user,
    profile,
    isLoading,
    isAuthenticated,
    emailUnconfirmed,
    requireAuth,
  };
}
