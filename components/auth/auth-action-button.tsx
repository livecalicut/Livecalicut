'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  useRequireAuth,
  type PendingAuthAction,
} from '@/hooks/use-require-auth';
import { cn } from '@/lib/utils';

type ButtonProps = React.ComponentProps<typeof Button>;

interface AuthActionButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** Called only when the user is authenticated (and verified when required). */
  onAuthedClick?: () => void | Promise<void>;
  /** Navigate here after auth instead of running onAuthedClick. */
  hrefWhenAuthed?: string;
  pending?: PendingAuthAction;
  loginMessage?: string;
  requireVerified?: boolean;
  children: React.ReactNode;
}

/**
 * Button that prompts login for guests before running a protected action.
 * No API call is made until auth succeeds.
 */
export const AuthActionButton: React.FC<AuthActionButtonProps> = ({
  onAuthedClick,
  hrefWhenAuthed,
  pending,
  loginMessage,
  requireVerified = true,
  children,
  className,
  disabled,
  type = 'button',
  ...rest
}) => {
  const router = useRouter();
  const { requireAuth, isLoading } = useRequireAuth();
  const [busy, setBusy] = React.useState(false);

  const handleClick = async () => {
    const next =
      hrefWhenAuthed ||
      (typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/');

    const ok = requireAuth({
      next,
      pending: pending || (hrefWhenAuthed ? { type: 'custom', href: hrefWhenAuthed } : undefined),
      message: loginMessage,
      requireVerified,
    });
    if (!ok) return;

    if (hrefWhenAuthed) {
      router.push(hrefWhenAuthed);
      return;
    }

    if (!onAuthedClick) return;
    try {
      setBusy(true);
      await onAuthedClick();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      type={type}
      disabled={disabled || busy || isLoading}
      className={cn(className)}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Button>
  );
};
