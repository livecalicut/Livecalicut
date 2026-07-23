import React from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { MobileBottomNav } from './mobile-bottom-nav';

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative bg-white text-slate-900 selection:bg-blue-600 selection:text-white transition-colors w-full">
      <Header />
      <main className="flex-1 w-full relative z-10">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};
