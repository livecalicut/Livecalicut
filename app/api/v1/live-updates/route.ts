import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/supabase/require-auth';
import { CONTENT_EDITORS } from '@/lib/rbac/roles';
import { SettingsService } from '@/lib/services/settings.service';
import {
  DEFAULT_LIVE_UPDATES,
  LIVE_UPDATES_KEY,
  MAX_LIVE_UPDATES,
  parseStoredLiveUpdates,
  sanitizeLiveUpdate,
  type LiveUpdate,
} from '@/lib/live-updates';

async function readItems(): Promise<{ items: LiveUpdate[]; isDefault: boolean }> {
  const stored = parseStoredLiveUpdates(await SettingsService.getSetting(LIVE_UPDATES_KEY));
  return stored ? { items: stored, isDefault: false } : { items: DEFAULT_LIVE_UPDATES, isDefault: true };
}

/**
 * GET  /api/v1/live-updates          public: active ticker items
 * GET  /api/v1/live-updates?all=1    editors: every item, including hidden ones
 * PUT  /api/v1/live-updates          editors: replace the whole ordered list
 */
export async function GET(request: Request) {
  try {
    if (new URL(request.url).searchParams.get('all') === '1') {
      const auth = await requireRole([...CONTENT_EDITORS]);
      if (auth instanceof NextResponse) return auth;
      return NextResponse.json({ success: true, ...(await readItems()) });
    }

    const { items } = await readItems();
    return NextResponse.json(
      { success: true, items: items.filter((i) => i.active) },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch {
    // The ticker must never break the page: fall back to the defaults
    return NextResponse.json({ success: true, items: DEFAULT_LIVE_UPDATES, fallback: true });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await requireRole([...CONTENT_EDITORS]);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json().catch(() => null);
    if (!Array.isArray(body?.items)) {
      return NextResponse.json({ success: false, error: 'items must be a list' }, { status: 400 });
    }
    if (body.items.length > MAX_LIVE_UPDATES) {
      return NextResponse.json({ success: false, error: `At most ${MAX_LIVE_UPDATES} updates` }, { status: 400 });
    }

    const items: LiveUpdate[] = [];
    for (const [i, raw] of body.items.entries()) {
      const item = sanitizeLiveUpdate((raw ?? {}) as Record<string, unknown>);
      if (typeof item === 'string') {
        return NextResponse.json({ success: false, error: `Update ${i + 1}: ${item}` }, { status: 400 });
      }
      items.push(item);
    }

    await SettingsService.updateSetting(LIVE_UPDATES_KEY, { items }, `Live updates edited by ${auth.user.id}`);
    return NextResponse.json({ success: true, items, isDefault: false });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Could not save updates' }, { status: 500 });
  }
}
