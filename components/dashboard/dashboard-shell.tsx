'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, useGSAP, DURATION, EASE, prefersReducedMotion } from '@/lib/gsap';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { MerchantSidebar } from '@/components/merchant/merchant-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

interface DashboardShellProps {
  variant: 'admin' | 'merchant';
  children: React.ReactNode;
}

/**
 * Persistent chrome for the admin and merchant workspaces. Living in the route
 * layout means the sidebar keeps its scroll position and does not remount on
 * navigation. On small screens the sidebar becomes a GSAP-driven drawer.
 */
export const DashboardShell: React.FC<DashboardShellProps> = ({ variant, children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Navigating away should always dismiss the drawer.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Escape closes the drawer, and the page behind it must not scroll.
  useEffect(() => {
    if (!drawerOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerOpen, closeDrawer]);

  useGSAP(
    () => {
      if (!drawerRef.current || !backdropRef.current) return;

      if (prefersReducedMotion()) {
        gsap.set(drawerRef.current, { xPercent: drawerOpen ? 0 : -100 });
        gsap.set(backdropRef.current, { autoAlpha: drawerOpen ? 1 : 0 });
        return;
      }

      gsap.to(drawerRef.current, {
        xPercent: drawerOpen ? 0 : -100,
        duration: DURATION.fast,
        ease: EASE.out,
      });
      gsap.to(backdropRef.current, {
        autoAlpha: drawerOpen ? 1 : 0,
        duration: DURATION.fast,
      });
    },
    { dependencies: [drawerOpen] }
  );

  // Fade route content in on each navigation.
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(contentRef.current, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: DURATION.base, ease: EASE.out }
      );
    },
    { dependencies: [pathname] }
  );

  const Sidebar = variant === 'admin' ? AdminSidebar : MerchantSidebar;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#111827]">
      {/* Desktop sidebar */}
      <div className="sticky top-0 hidden h-screen shrink-0 overflow-y-auto lg:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      <div
        ref={backdropRef}
        onClick={closeDrawer}
        aria-hidden="true"
        className="invisible fixed inset-0 z-40 bg-slate-950/50 opacity-0 backdrop-blur-sm lg:hidden"
      />
      <div
        ref={drawerRef}
        id="dashboard-mobile-nav"
        className="fixed inset-y-0 left-0 z-50 -translate-x-full overflow-y-auto shadow-2xl lg:hidden"
        {...(!drawerOpen && { inert: '' as unknown as boolean })}
      >
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          variant={variant}
          drawerOpen={drawerOpen}
          onToggleDrawer={() => setDrawerOpen((open) => !open)}
        />

        <main
          id="main-content"
          ref={contentRef}
          className="flex-1 space-y-8 overflow-x-hidden p-4 sm:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
};
