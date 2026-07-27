'use client';

import React from 'react';
import Link from 'next/link';
import { Dialog } from '@/components/ui/dialog';
import { LogIn, UserPlus } from 'lucide-react';

export type AuthPromptState = {
  open: boolean;
  message: string;
  next: string;
};

type AuthLoginDialogProps = {
  state: AuthPromptState;
  onClose: () => void;
};

/**
 * Soft gate for guests — explain why login is needed, then offer Login / Register.
 * Avoids abrupt redirects when favouriting, reviewing, applying, etc.
 */
export function AuthLoginDialog({ state, onClose }: AuthLoginDialogProps) {
  const next = encodeURIComponent(state.next || '/');
  const loginHref = `/login?next=${next}`;
  const registerHref = `/register?next=${next}`;

  return (
    <Dialog open={state.open} onClose={onClose} title="Sign in required">
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-[#4B5563]">
          {state.message ||
            'Sign in to continue. Favourites, reviews, applications and listing tools need an account.'}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={loginHref}
            onClick={onClose}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#2563EB] text-sm font-bold text-white hover:bg-[#1D4ED8]"
          >
            <LogIn className="h-4 w-4" />
            Log in
          </Link>
          <Link
            href={registerHref}
            onClick={onClose}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white text-sm font-bold text-[#111827] hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            <UserPlus className="h-4 w-4" />
            Create account
          </Link>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-full text-center text-xs font-medium text-[#6B7280] hover:text-[#111827]"
        >
          Continue browsing
        </button>
      </div>
    </Dialog>
  );
}
