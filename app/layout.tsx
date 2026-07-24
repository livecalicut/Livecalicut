import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { PageContainer } from '@/components/layout/PageContainer';

export const metadata: Metadata = {
  title: 'LiveCalicut - Hyperlocal Portal for Kozhikode & Kerala',
  description:
    'Discover shops, dining spots, Cyberpark jobs, local news, events, and classifieds across Kozhikode.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-icon.svg',
  },
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
      <body className="m-0 min-h-screen overflow-y-auto bg-white p-0 text-slate-900 antialiased" suppressHydrationWarning>
        <AppProviders>
          <AnnouncementBanner />
          <PageContainer>{children}</PageContainer>
          <FloatingAiButton />
        </AppProviders>
      </body>
    </html>
  );
}
