'use client';

import React, { useState } from 'react';
import { Bookmark, Heart, Loader2 } from 'lucide-react';
import { AuthActionButton } from '@/components/auth/auth-action-button';
import { toast } from '@/lib/toast';
import type { PendingAuthAction } from '@/hooks/use-require-auth';

type SaveKind = 'job' | 'marketplace' | 'business' | 'property';

const ENDPOINTS: Record<SaveKind, { url: string; bodyKey: string; pendingType: PendingAuthAction['type'] }> = {
  job: { url: '/api/jobs/save', bodyKey: 'jobId', pendingType: 'save-job' },
  marketplace: { url: '/api/marketplace/favorite', bodyKey: 'itemId', pendingType: 'save-marketplace' },
  business: { url: '/api/businesses/bookmark', bodyKey: 'businessId', pendingType: 'save-business' },
  property: { url: '/api/properties/favorite', bodyKey: 'propertyId', pendingType: 'save-property' },
};

interface SaveFavoriteButtonProps {
  kind: SaveKind;
  /** UUID preferred; slug accepted for jobs when the API resolves it. */
  entityId: string;
  slug?: string;
  label?: string;
  savedLabel?: string;
  variant?: 'outline' | 'default' | 'ghost' | 'secondary';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  className?: string;
  icon?: 'bookmark' | 'heart';
}

/**
 * Favourite / save control — never hits the API until the user is signed in.
 */
export const SaveFavoriteButton: React.FC<SaveFavoriteButtonProps> = ({
  kind,
  entityId,
  slug,
  label = 'Save',
  savedLabel = 'Saved',
  variant = 'outline',
  size = 'sm',
  className = 'gap-1.5 h-[40px] rounded-xl font-bold',
  icon = 'bookmark',
}) => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const config = ENDPOINTS[kind];
  const Icon = icon === 'heart' ? Heart : Bookmark;

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(config.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          [config.bodyKey]: entityId,
          slug: slug || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));

      if (res.status === 401) {
        toast.info('Login required', 'Sign in to save favourites.');
        return;
      }
      if (!res.ok) {
        throw new Error(json.error || json.message || 'Could not update favourite');
      }

      const next =
        typeof json.favorited === 'boolean'
          ? json.favorited
          : typeof json.bookmarked === 'boolean'
            ? json.bookmarked
            : typeof json.saved === 'boolean'
              ? json.saved
              : !saved;

      setSaved(next);
      toast.success(next ? 'Saved' : 'Removed', next ? 'Added to your favourites.' : 'Removed from favourites.');
    } catch (err) {
      toast.error('Save failed', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthActionButton
      variant={variant}
      size={size}
      className={className}
      loginMessage="Sign in to save favourites to your account."
      pending={{ type: config.pendingType, id: entityId || slug }}
      onAuthedClick={toggle}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className={`h-4 w-4 text-[#2563EB] ${saved ? 'fill-[#2563EB]' : ''}`} />
      )}
      {saved ? savedLabel : label}
    </AuthActionButton>
  );
};
