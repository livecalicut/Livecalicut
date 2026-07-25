'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';

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
    <div className="relative flex min-h-screen w-full flex-col bg-white font-sans text-[#111827] transition-colors selection:bg-[#2563EB] selection:text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-xl focus:bg-[#2563EB] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="relative z-10 w-full flex-1">
        {children}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};
