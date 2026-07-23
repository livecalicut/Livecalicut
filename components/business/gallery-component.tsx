import React from 'react';

interface GalleryComponentProps {
  images?: { id: string; url: string; caption?: string }[];
}

export const GalleryComponent: React.FC<GalleryComponentProps> = ({ images = [] }) => {
  const displayImages = images.length > 0 ? images : [
    { id: '1', url: '', caption: 'Main Store Front' },
    { id: '2', url: '', caption: 'Interior Ambiance' },
    { id: '3', url: '', caption: 'Products Gallery' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {displayImages.map((img) => (
        <div
          key={img.id}
          className="w-full h-44 rounded-2xl bg-slate-100 dark:bg-slate-800/80 animate-shimmer flex items-center justify-center border border-slate-200 dark:border-slate-800 relative overflow-hidden"
        >
          {img.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img.url} alt={img.caption || 'Gallery Image'} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-slate-400 font-medium">{img.caption}</span>
          )}
        </div>
      ))}
    </div>
  );
};
