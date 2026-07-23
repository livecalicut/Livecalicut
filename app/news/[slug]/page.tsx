import React from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { ShareButtons } from '@/components/shared/share-buttons';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Eye, Bookmark, MapPin, Newspaper, Tag } from 'lucide-react';
import Link from 'next/link';

export default async function NewsDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const article = {
    title: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'KOZHIKODE BEACH PROMENADE RENOVATION COMPLETED',
    category: 'Infrastructure & City Planning',
    publishedAt: 'July 12, 2026 • 2 hours ago',
    author: 'LiveCalicut Editorial Desk',
    ward: 'Ward 12 Beach Road, Calicut',
    viewsCount: 1420,
    summary: 'New eco-friendly seating, decorative lighting, and street food vending kiosks opened along Kozhikode Beach promenade.',
    content: `
      KOZHIKODE — The District Administration and Tourism Development Department have officially declared the Kozhikode Beach Promenade Renovation Project phase 1 complete.
      
      The renovated stretch features modern heritage streetlight posts, eco-friendly benches, improved pedestrian walkways, dedicated sanitation facilities, and integrated waste disposal bins to support evening tourists and local families.
      
      Merchant food stalls along Beach Road have also been aligned into designated vending kiosks to preserve traffic flow, physical ward cleanliness, and culinary food safety.
      
      City Mayor and District Collector inaugurated the newly paved pedestrian strip, emphasizing Calicut's commitment to sustainable urban beach front developments.
    `,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    author: {
      '@type': 'Organization',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'LiveCalicut.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://livecalicut.com/images/logo.png',
      },
    },
    datePublished: '2026-07-12T10:00:00Z',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Schema.org Article Structured Metadata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        title={article.title}
        description={article.summary}
        icon={<Newspaper className="w-6 h-6 text-[#2563EB]" />}
        breadcrumbs={[
          { label: 'News Editorial', href: '/news' },
          { label: 'Article Details' },
        ]}
      />

      {/* Article Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-[#E5E7EB] text-xs text-[#6B7280]">
        <div className="flex flex-wrap items-center gap-3 font-semibold">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] font-bold border border-blue-200">
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-[#111827]">
            <User className="w-3.5 h-3.5 text-[#2563EB]" /> {article.author}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.publishedAt}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {article.ward}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {article.viewsCount} reads
          </span>
        </div>

        <ShareButtons title={article.title} />
      </div>

      {/* Article Content Card */}
      <Card className="p-6 sm:p-8 border border-[#E5E7EB] bg-white rounded-3xl shadow-xs space-y-6">
        <div className="w-full h-64 sm:h-80 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xs text-[#6B7280] font-bold">
          High Resolution Editorial Photography Placeholder
        </div>

        <div className="prose max-w-none text-sm text-[#374151] leading-relaxed whitespace-pre-line font-sans font-normal">
          {article.content}
        </div>

        <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#2563EB]" />
            <span className="font-bold text-[#111827]">Tags:</span>
            <span className="text-[#6B7280]">#CalicutBeach #Infrastructure #Tourism #LiveCalicut</span>
          </div>

          <Link href="/news" className="font-bold text-[#2563EB] hover:underline">
            ← Back to News Desk
          </Link>
        </div>
      </Card>
    </div>
  );
}
