'use client';

import React from 'react';
import { SaveFavoriteButton } from '@/components/auth/save-favorite-button';
import { ShareButtons } from '@/components/shared/share-buttons';

interface DetailSaveActionsProps {
  kind: 'marketplace' | 'business' | 'property';
  entityId: string;
  slug?: string;
  title?: string;
  label?: string;
  showShare?: boolean;
}

export const DetailSaveActions: React.FC<DetailSaveActionsProps> = ({
  kind,
  entityId,
  slug,
  title,
  label = 'Save Favorite',
  showShare = true,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <SaveFavoriteButton
        kind={kind}
        entityId={entityId}
        slug={slug}
        label={label}
        savedLabel="Saved"
      />
      {showShare && title ? <ShareButtons title={title} /> : null}
    </div>
  );
};
