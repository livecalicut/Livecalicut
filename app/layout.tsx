import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { PageContainer } from '@/components/layout/PageContainer';

export const metadata: Metadata = {
  title: 'LiveCalicut - Hyperlocal Portal for Calicut & Kerala',
  description:
    'Discover shops, dining spots, employment opportunities, local news, events, and classifieds across Calicut.',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.png',
    apple: '/apple-icon.png',
  },
};

import { AnnouncementBanner } from '@/components/notifications/announcement-banner';
import { RevealOnScrollInit } from '@/components/animated/reveal-on-scroll-init';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <noscript>
          {/* Without JS the GSAP reveals never run, so reveal everything up front. */}
          <style>{`.gsap-reveal { opacity: 1 !important; }`}</style>
        </noscript>
      </head>
      <body className="m-0 min-h-screen overflow-y-auto bg-white p-0 text-slate-900 antialiased" suppressHydrationWarning>
        <AppProviders>
          <RevealOnScrollInit />
          <AnnouncementBanner />
          <PageContainer>{children}</PageContainer>
        </AppProviders>
      </body>
    </html>
  );
}
