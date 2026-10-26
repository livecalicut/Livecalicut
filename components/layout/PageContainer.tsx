'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './header';
import { CalicutMapSection } from './kozhikode-map-section';
import { Footer } from './footer';
import { MobileBottomNav } from './mobile-bottom-nav';

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  const pathname = usePathname();
  const isWorkspace = pathname.startsWith('/admin') || pathname.startsWith('/merchant');

  if (isWorkspace) {
    return <div className="min-h-screen bg-[#F8FAFC] text-[#111827]">{children}</div>;
  }

  return (
    <div className="relative m-0 flex min-h-screen w-full flex-col overflow-x-clip bg-white p-0 text-[#111827] selection:bg-[#2563EB] selection:text-white">
      <Header />
      <main className="relative z-10 m-0 w-full flex-1 overflow-visible p-0">{children}</main>
      <CalicutMapSection />
      <Footer />
      <MobileBottomNav />
    </div>
  );
};
