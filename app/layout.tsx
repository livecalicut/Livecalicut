import type { Metadata } from 'next';
import Script from 'next/script';
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
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2562099290940435');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src="https://www.facebook.com/tr?id=2562099290940435&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}
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
