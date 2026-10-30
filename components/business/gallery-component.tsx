'use client';

import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';

interface GalleryComponentProps {
  images?: { id: string; url: string; caption?: string }[];
}

export const GalleryComponent: React.FC<GalleryComponentProps> = ({ images = [] }) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const displayImages = images.length > 0 ? images : [
    { id: '1', url: '', caption: 'Store Front & Entrance' },
    { id: '2', url: '', caption: 'Interior & Products' },
    { id: '3', url: '', caption: 'Services Showcase' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {displayImages.map((img) => (
          <div
            key={img.id}
            onClick={() => img.url && setActiveImage(img.url)}
            className="group w-full h-48 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex items-center justify-center relative overflow-hidden cursor-pointer"
          >
            {img.url ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.caption || 'Gallery Image'}
                  className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2 rounded-full bg-white/90 text-slate-800 shadow-md">
                    <Eye className="w-4 h-4" />
                  </span>
                </div>
              </>
            ) : (
              <span className="text-xs text-slate-400 font-medium px-4 text-center">{img.caption}</span>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <button
            type="button"
            onClick={() => setActiveImage(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Close image preview"
          >
            <X className="w-6 h-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage}
            alt="Expanded view"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl bg-white p-2"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
