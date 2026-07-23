import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { PageContainer } from '@/components/layout/PageContainer';

export const metadata: Metadata = {
  title: 'LiveCalicut - Hyperlocal Portal for Kozhikode & Kerala',
  description: 'Discover shops, dining spots, Cyberpark jobs, local news, events, and classifieds across Kozhikode.',
};

import { FloatingAiButton } from '@/components/ai/floating-ai-button';
import { AnnouncementBanner } from '@/components/notifications/announcement-banner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="antialiased bg-white text-slate-900 min-h-screen" suppressHydrationWarning>
        <AppProviders>
          <AnnouncementBanner />
          <PageContainer>{children}</PageContainer>
          <FloatingAiButton />
        </AppProviders>
      </body>
    </html>
  );
}
