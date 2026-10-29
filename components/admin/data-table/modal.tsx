'use client';
// components/admin/data-table/modal.tsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

const SIZES = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' } as const;

/** Centered dialog (or right-side drawer) rendered in a portal with Escape-to-close and scroll lock. */
export function Modal({
  open,
  onClose,
  children,
  size = 'md',
  variant = 'dialog',
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  variant?: 'dialog' | 'drawer';
  labelledBy?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  const drawer = variant === 'drawer';

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex bg-[#0F172A]/40 backdrop-blur-[2px] ${
        drawer ? 'justify-end' : 'items-center justify-center p-4'
      }`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={
          drawer
            ? 'flex h-full w-full max-w-lg flex-col bg-white pb-[env(safe-area-inset-bottom,0px)] pt-[env(safe-area-inset-top,0px)] shadow-2xl'
            : `flex max-h-[90vh] w-full ${SIZES[size]} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl`
        }
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
