'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/../components/layout/header';
import { KozhikodeMapSection } from '@/../components/layout/kozhikode-map-section';
import { Footer } from '@/../components/layout/footer';
import { MobileBottomNav } from '@/../components/layout/mobile-bottom-nav';

interface PageContainerProps {
  children: React.ReactNode;
}

/** Routes that render their own sidebar/header chrome and must not get the public shell. */
const STANDALONE_PREFIXES = ['/admin', '/merchant'];

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  const pathname = usePathname();
  const isStandalone = STANDALONE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <div
      className="relative flex min-h-screen w-full flex-col bg-white font-sans text-[#111827] transition-colors selection:bg-[#2563EB] selection:text-white"
      suppressHydrationWarning
    >
      <Header />

      <main id="main-content" className="relative z-10 w-full flex-1">
        {children}
      </main>

      {pathname !== '/login' && pathname !== '/register' ? <KozhikodeMapSection /> : null}
      <Footer />
      <MobileBottomNav />
    </div>
  );
};
