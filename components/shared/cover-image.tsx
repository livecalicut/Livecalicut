'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export const LOGO_FALLBACK = '/images/logo.png';

interface CoverImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  imgClassName?: string;
  /** When true, logo fallback uses contain (centered). Cover images always use cover. */
  fallbackContain?: boolean;
}

/**
 * Cover media with object-cover. Falls back to LiveCalicut logo if missing/broken.
 */
export function CoverImage({
  src,
  alt = '',
  className,
  imgClassName,
  fallbackContain = true,
}: CoverImageProps) {
  const [failed, setFailed] = useState(false);
  const hasSrc = Boolean(src && String(src).trim());
  const showFallback = !hasSrc || failed;
  const finalSrc = showFallback ? LOGO_FALLBACK : (src as string);

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden bg-[#F8FAFC]',
        showFallback && 'flex items-center justify-center',
        className
      )}
    >
      <img
        src={finalSrc}
        alt={alt || 'LiveCalicut'}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={cn(
          'h-full w-full transition-transform duration-300 group-hover:scale-105',
          showFallback
            ? fallbackContain
              ? 'object-contain p-8 opacity-80'
              : 'object-cover'
            : 'object-cover',
          imgClassName
        )}
      />
    </div>
  );
}

/** Resolve a display image from common API shapes */
export function resolveCoverImage(entity: Record<string, unknown> | null | undefined): string | null {
  if (!entity) return null;

  const direct =
    (entity.cover_image as string) ||
    (entity.featured_image as string) ||
    (entity.image as string) ||
    (entity.image_url as string) ||
    (entity.logo as string) ||
    null;

  if (direct) return direct;

  const social = entity.social_media as { cover_image?: string } | null;
  if (social?.cover_image) return social.cover_image;

  const images = entity.business_images as Array<{ url?: string }> | null;
  if (Array.isArray(images) && images[0]?.url) return images[0].url!;

  const company = entity.companies as { logo?: string } | null;
  if (company?.logo) return company.logo;

  return null;
}
