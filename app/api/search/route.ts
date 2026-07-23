import { NextResponse } from 'next/server';
import { GlobalSearchService } from '@/lib/services/global-search.service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const moduleFilter = searchParams.get('module') || 'all';

  if (!q.trim()) {
    return NextResponse.json({ data: [] });
  }

  try {
    const results = await GlobalSearchService.searchAll(q, moduleFilter);
    return NextResponse.json({ query: q, total: results.length, data: results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
