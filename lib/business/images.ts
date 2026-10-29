// lib/business/images.ts
// businesses has no image columns in production: photos live in the
// social_media jsonb as cover_image (legacy, single) and gallery (list).

type BusinessLike = {
  cover_image?: unknown;
  social_media?: Record<string, unknown> | null;
  business_images?: { url?: string | null }[] | null;
};

/** Every photo for a business, cover first, without duplicates. */
export function businessImages(b: BusinessLike | null | undefined): string[] {
  if (!b) return [];
  const sm = b.social_media ?? {};
  const candidates: unknown[] = [
    ...(Array.isArray(sm.gallery) ? sm.gallery : []),
    sm.cover_image,
    sm.image_url,
    b.cover_image,
    ...(Array.isArray(b.business_images) ? b.business_images.map((img) => img?.url) : []),
  ];
  const urls = candidates.filter((u): u is string => typeof u === 'string' && /^https?:\/\//.test(u));
  return Array.from(new Set(urls));
}

export function businessCover(b: BusinessLike | null | undefined): string | null {
  return businessImages(b)[0] ?? null;
}
