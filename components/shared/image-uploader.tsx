'use client';
// components/shared/image-uploader.tsx
import React, { useState } from 'react';
import { mediaApi } from '@/lib/services/api-client';
import { toast } from '@/lib/toast';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  module?: string;
  label?: string;
  /** light = admin/CMS forms; dark = marketplace-style dark surfaces */
  variant?: 'light' | 'dark';
}

export function ImageUploader({
  value,
  onChange,
  module = 'general',
  label = 'Upload Cover Photo',
  variant = 'dark',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const light = variant === 'light';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid File', 'Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File Too Large', 'Maximum image upload size is 10MB.');
      return;
    }

    try {
      setUploading(true);
      const res = await mediaApi.upload(file, module);
      onChange(res.url);
      toast.success('Upload Successful', 'Image processed by LiveCalicut DAM service.');
    } catch (err: any) {
      toast.error('Upload Failed', err.message || 'Error uploading file to asset gateway.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <span
        className={`text-xs font-semibold uppercase tracking-wider ${
          light ? 'text-[#4B5563]' : 'text-slate-300'
        }`}
      >
        {label}
      </span>

      {value ? (
        <div
          className={`relative w-full h-44 rounded-2xl overflow-hidden border group ${
            light ? 'border-[#D1D5DB] bg-[#F8FAFC]' : 'border-slate-700 bg-slate-900'
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-3 right-3 p-1.5 rounded-xl bg-slate-950/80 text-rose-400 hover:text-rose-300 transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${
            light
              ? 'border-[#D1D5DB] hover:border-[#2563EB] bg-[#F8FAFC] hover:bg-white'
              : 'border-slate-700 hover:border-cyan-500 bg-slate-900/50 hover:bg-slate-900'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className={`w-6 h-6 animate-spin ${light ? 'text-[#2563EB]' : 'text-cyan-400'}`} />
              <span className={`text-xs ${light ? 'text-[#6B7280]' : 'text-slate-400'}`}>
                Uploading media…
              </span>
            </div>
          ) : (
            <div
              className={`flex flex-col items-center gap-1.5 transition-colors ${
                light
                  ? 'text-[#6B7280] group-hover:text-[#2563EB]'
                  : 'text-slate-400 group-hover:text-cyan-400'
              }`}
            >
              <Upload className="w-6 h-6" />
              <span className="text-xs font-semibold">Click to upload image or media</span>
              <span className={`text-[10px] ${light ? 'text-[#9CA3AF]' : 'text-slate-500'}`}>
                JPG, PNG, WebP up to 10MB
              </span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
        </label>
      )}
    </div>
  );
}
