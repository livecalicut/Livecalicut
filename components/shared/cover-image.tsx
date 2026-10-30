'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { businessCover } from '@/lib/business/images';

export const LOGO_FALLBACK = '/images/logo.png';
export const PHOTO_FALLBACK = '/heroes/calicut-hero.jpg';

interface CoverImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  imgClassName?: string;
  fallbackSrc?: string;
  /** When true, logo fallback uses contain (centered). Cover images always use cover. */
  fallbackContain?: boolean;
}

/**
 * Cover media with object-cover. Falls back gracefully without awkward blank shapes.
 */
export function CoverImage({
  src,
  alt = '',
  className,
  imgClassName,
  fallbackSrc,
  fallbackContain = false,
}: CoverImageProps) {
  const [failed, setFailed] = useState(false);
  const hasSrc = Boolean(src && String(src).trim());
  const showFallback = !hasSrc || failed;
  const defaultFallback = fallbackSrc || PHOTO_FALLBACK;
  const finalSrc = showFallback ? defaultFallback : (src as string);
  const isLogo = finalSrc === LOGO_FALLBACK;

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden bg-slate-100',
        isLogo && 'flex items-center justify-center bg-white p-4',
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
          isLogo
            ? fallbackContain
              ? 'object-contain max-h-full max-w-full opacity-90'
              : 'object-contain'
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

  const business = businessCover(entity as Parameters<typeof businessCover>[0]);
  if (business) return business;

  const company = entity.companies as { logo?: string } | null;
  if (company?.logo) return company.logo;

  return null;
}
