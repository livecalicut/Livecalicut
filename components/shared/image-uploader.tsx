'use client';
// components/shared/image-uploader.tsx
import React, { useState } from 'react';
import { mediaApi } from '@/lib/services/api-client';
import { toast } from '@/lib/toast';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  module?: string;
  label?: string;
}

export function ImageUploader({
  value,
  onChange,
  module = 'general',
  label = 'Upload Cover Photo',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

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
      <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</span>

      {value ? (
        <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 group">
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
        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition-all group">
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              <span className="text-xs text-slate-400">Uploading to DAM Gateway…</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-slate-400 group-hover:text-cyan-400 transition-colors">
              <Upload className="w-6 h-6" />
              <span className="text-xs font-semibold">Click or drag image here</span>
              <span className="text-[10px] text-slate-500">JPG, PNG, WebP up to 10MB</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
        </label>
      )}
    </div>
  );
}
