'use client';
// components/shared/multi-image-uploader.tsx
import React, { useState } from 'react';
import { mediaApi } from '@/lib/services/api-client';
import { toast } from '@/lib/toast';
import { ImagePlus, Loader2, X } from 'lucide-react';

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  module?: string;
  label?: string;
  max?: number;
}

const MAX_BYTES = 10 * 1024 * 1024;

/** Uploads several images at once; the first image is treated as the cover by callers. */
export function MultiImageUploader({
  value,
  onChange,
  module = 'general',
  label = 'Images',
  max = 10,
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(0);
  const remaining = Math.max(0, max - value.length);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (picked.length === 0) return;

    const files = picked.filter((f) => f.type.startsWith('image/') && f.size <= MAX_BYTES).slice(0, remaining);
    if (files.length < picked.length) {
      toast.warning(
        'Some files skipped',
        `Only images up to 10MB are accepted, maximum ${max} per listing.`
      );
    }
    if (files.length === 0) return;

    setUploading(files.length);
    const results = await Promise.allSettled(files.map((file) => mediaApi.upload(file, module)));
    setUploading(0);

    const urls = results.flatMap((r) => (r.status === 'fulfilled' ? [r.value.url] : []));
    const failed = results.length - urls.length;
    if (urls.length) onChange([...value, ...urls]);
    if (failed) toast.error('Upload failed', `${failed} of ${results.length} images could not be uploaded.`);
  };

  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  const makeCover = (index: number) => {
    if (index === 0) return;
    const next = [...value];
    const [picked] = next.splice(index, 1);
    onChange([picked, ...next]);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#4B5563]">{label}</span>
        <span className="text-[11px] text-[#9CA3AF]">
          {value.length}/{max}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {value.map((url, index) => (
          <div
            key={url}
            className="group relative aspect-square overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            {index === 0 ? (
              <span className="absolute bottom-1.5 left-1.5 rounded-md bg-[#2563EB] px-1.5 py-0.5 text-[10px] font-bold text-white">
                Cover
              </span>
            ) : (
              <button
                type="button"
                onClick={() => makeCover(index)}
                className="absolute bottom-1.5 left-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-[#111827] opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
              >
                Set cover
              </button>
            )}
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute right-1.5 top-1.5 rounded-lg bg-white/90 p-1 text-rose-500 hover:text-rose-700"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {Array.from({ length: uploading }).map((_, i) => (
          <div
            key={`uploading-${i}`}
            className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-[#D1D5DB] bg-[#F8FAFC]"
          >
            <Loader2 className="h-5 w-5 animate-spin text-[#2563EB]" />
          </div>
        ))}

        {remaining > 0 && uploading === 0 && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#D1D5DB] bg-[#F8FAFC] text-[#6B7280] transition-colors hover:border-[#2563EB] hover:bg-white hover:text-[#2563EB]">
            <ImagePlus className="h-5 w-5" />
            <span className="text-[11px] font-semibold">Add images</span>
            <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
          </label>
        )}
      </div>
      <p className="text-[10px] text-[#9CA3AF]">JPG, PNG or WebP up to 10MB each. Select several files at once.</p>
    </div>
  );
}
