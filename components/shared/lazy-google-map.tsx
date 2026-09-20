'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LazyGoogleMapProps {
  src: string;
  title: string;
  className?: string;
}

export const LazyGoogleMap: React.FC<LazyGoogleMapProps> = ({ src, title, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '160px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`bg-slate-100 ${className}`}>
      {isVisible ? (
        <iframe
          title={title}
          src={src}
          className="h-full w-full min-h-[280px] border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="flex h-full min-h-[280px] items-center justify-center text-sm font-medium text-slate-400">
          Map loading when you scroll here
        </div>
      )}
    </div>
  );
};
