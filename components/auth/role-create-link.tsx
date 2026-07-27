'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/src/store/useAuthStore';
import { cn } from '@/lib/utils';

type RoleCreateLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Who may see/use this create CTA. Default: merchant + city/super admin. */
  allow?: 'merchant' | 'admin';
};

/**
 * Post/create CTAs — only rendered for merchant / admin accounts.
 * Hidden from guests and plain Users (no public "Post Now").
 */
export function RoleCreateLink({
  href,
  children,
  className,
  allow = 'merchant',
}: RoleCreateLinkProps) {
  const { user, isLoading, isMerchant, isAdmin } = useAuthStore();

  const allowed = allow === 'admin' ? isAdmin() : isMerchant();

  if (isLoading || !user || !allowed) return null;

  return (
    <Link href={href} className={cn('inline-flex', className)}>
      {children}
    </Link>
  );
}
