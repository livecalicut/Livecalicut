'use client';

import React from 'react';
import Link from 'next/link';
import { useRequireAuth, stashPendingAuthAction, type PendingAuthAction } from '@/hooks/use-require-auth';
import { useAuthPrompt } from '@/components/auth/auth-prompt-provider';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

interface AuthGateLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  loginMessage?: string;
  pending?: PendingAuthAction;
  requireVerified?: boolean;
}

/**
 * Link for authenticated users. Guests get a login popup instead of a hard redirect.
 */
export const AuthGateLink: React.FC<AuthGateLinkProps> = ({
  href,
  children,
  className,
  loginMessage,
  pending,
  requireVerified = false,
}) => {
  const { isAuthenticated, isLoading, emailUnconfirmed } = useRequireAuth();
  const { promptLogin } = useAuthPrompt();

  if (isAuthenticated && !isLoading) {
    if (requireVerified && emailUnconfirmed) {
      return (
        <button
          type="button"
          className={cn('inline-flex', className)}
          onClick={() =>
            toast.warning(
              'Verify your email',
              'Confirm your email address before continuing. Check your inbox for the link.'
            )
          }
        >
          {children}
        </button>
      );
    }

    return (
      <Link href={href} className={cn('inline-flex', className)}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn('inline-flex', className)}
      onClick={() => {
        if (pending) stashPendingAuthAction(pending);
        else stashPendingAuthAction({ type: 'custom', href });
        promptLogin({
          next: href,
          message: loginMessage || 'Sign in to continue with this action.',
        });
      }}
    >
      {children}
    </button>
  );
};
