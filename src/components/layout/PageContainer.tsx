import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';

interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative bg-white text-[#111827] selection:bg-[#2563EB] selection:text-white transition-colors w-full font-sans">
      {/* Main Navigation */}
      <Navbar />
      
      {/* Main Content Viewport - Full Width Section Wrapper */}
      <main className="flex-1 w-full relative z-10">
        {children}
      </main>
      
      {/* Footer & Mobile Navigation */}
      <Footer />
      <MobileNav />
    </div>
  );
};
