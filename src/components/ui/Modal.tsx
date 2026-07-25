'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, DURATION, EASE, prefersReducedMotion } from '@/lib/gsap';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Kept mounted for the length of the exit tween so the close animation can play.
  const [mounted, setMounted] = useState(isOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) setMounted(true);
  }, [isOpen]);

  useGSAP(
    () => {
      if (!mounted) return;

      if (prefersReducedMotion()) {
        if (isOpen) {
          gsap.set([backdropRef.current, panelRef.current], { opacity: 1, scale: 1, y: 0 });
        } else {
          setMounted(false);
        }
        return;
      }

      if (isOpen) {
        gsap
          .timeline()
          .fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: DURATION.fast })
          .fromTo(
            panelRef.current,
            { opacity: 0, scale: 0.95, y: 15 },
            { opacity: 1, scale: 1, y: 0, duration: DURATION.fast, ease: EASE.out },
            '<'
          );
      } else {
        gsap
          .timeline({ onComplete: () => setMounted(false) })
          .to(panelRef.current, { opacity: 0, scale: 0.95, y: 15, duration: DURATION.fast })
          .to(backdropRef.current, { opacity: 0, duration: DURATION.fast }, '<');
      }
    },
    { scope: rootRef, dependencies: [isOpen, mounted] }
  );

  // Escape to dismiss, and lock background scroll while open.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="glass-panel relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/95 p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-slate-100">{title}</h3>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
};
