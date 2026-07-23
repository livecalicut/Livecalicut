'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { NewsCard } from '@/components/cards/news-card';
import { ResponsiveGrid } from '@/components/layout/responsive-grid';
import { CategoryPills } from '@/components/feed/category-pills';
import { Pagination } from '@/components/shared/pagination';
import { ListSkeleton } from '@/components/shared/loading-skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { Container } from '@/components/layout/container';
import { useNews } from '@/hooks/use-news';
import { Newspaper, Zap, Flame, Search } from 'lucide-react';
import type { NewsArticle } from '@/lib/types/api.types';

export default function NewsListingPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const LIMIT = 9;

  const newsCategories = [
    { id: 'all', name: 'All News', slug: '' },
    { id: 'politics', name: 'Politics & Governance', slug: 'politics' },
    { id: 'business', name: 'Business & Economy', slug: 'business' },
    { id: 'technology', name: 'Technology & Cyberpark', slug: 'technology' },
    { id: 'education', name: 'Education & Colleges', slug: 'education' },
    { id: 'health', name: 'Health & Medical', slug: 'health' },
    { id: 'sports', name: 'Sports & Football', slug: 'sports' },
    { id: 'entertainment', name: 'Cinema & Arts', slug: 'entertainment' },
    { id: 'community', name: 'Ward Community', slug: 'community' },
  ];

  const { data, isLoading, isError, refetch } = useNews({
    page,
    limit: LIMIT,
    category: category || undefined,
  });

  const articles = (data?.data as NewsArticle[] | undefined) ?? [];
  const total = data?.meta?.total ?? 0;

  const filteredArticles = articles.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <Container className="py-8 sm:py-12 space-y-8">
      <PageHeader
        title="Kozhikode Daily News & Editorial"
        description="Verified local journalism, infrastructure updates, and municipal announcements across 21 spatial wards."
        icon={<Newspaper className="w-6 h-6 text-[#2563EB]" />}
        breadcrumbs={[{ label: 'News Editorial' }]}
      />

      {/* Breaking News Live Ticker */}
      <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-3 text-xs font-bold text-[#111827]">
        <span className="px-2.5 py-1 rounded-xl bg-[#2563EB] text-white flex items-center gap-1 shrink-0 font-sans uppercase text-[10px] tracking-wider font-extrabold">
          <Zap className="w-3.5 h-3.5 fill-white" /> Breaking News
        </span>
        <p className="truncate text-[#111827]">
          Calicut Beach Waterfront Renovation Phase 2 Approved by Kozhikode Municipal Corporation • 500+ Cyberpark Vacancies Listed
        </p>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6B7280] pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search headline or topic..."
            className="w-full pl-10 pr-4 h-[40px] rounded-2xl border border-[#E5E7EB] bg-white text-xs text-[#111827] focus:border-[#2563EB] focus:outline-none shadow-xs"
          />
        </div>

        <CategoryPills
          categories={newsCategories}
          selectedCategory={category || undefined}
          onSelectCategory={(slug) => { setCategory(slug || null); setPage(1); }}
        />
      </div>

      {/* News Feed Results Grid */}
      <div className="space-y-6">
        {isLoading && <ListSkeleton count={LIMIT} cols={3} />}

        {isError && (
          <ErrorState
            title="Could not load news feed"
            description="Something went wrong while fetching local editorial articles."
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && filteredArticles.length === 0 && (
          <EmptyState
            title="No news articles found"
            description="No editorial stories published in this category yet."
          />
        )}

        {!isLoading && !isError && filteredArticles.length > 0 && (
          <ResponsiveGrid cols={3}>
            {filteredArticles.map((item) => (
              <NewsCard
                key={item.id}
                title={item.title}
                excerpt={item.excerpt || ''}
                category={item.category || 'General'}
                timeAgo={item.published_at ? new Date(item.published_at).toLocaleDateString() : 'Recently'}
              />
            ))}
          </ResponsiveGrid>
        )}

        <Pagination page={page} total={total} limit={LIMIT} onPageChange={setPage} />
      </div>
    </Container>
  );
}
