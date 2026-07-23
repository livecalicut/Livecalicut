'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Camera, Loader2, User } from 'lucide-react';

interface AvatarUploadProps {
  url?: string;
  onUploadComplete: (url: string) => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ url, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(url);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `avatar_${Math.random()}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);

      const publicUrl = publicData.publicUrl;
      setPreviewUrl(publicUrl);
      onUploadComplete(publicUrl);
    } catch (error: any) {
      alert('Error uploading avatar: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group w-24 h-24 rounded-full glass-panel overflow-hidden border-2 border-slate-700 flex items-center justify-center bg-slate-900 shadow-xl">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="User Avatar" className="w-full h-full object-cover" />
        ) : (
          <User className="w-10 h-10 text-slate-500" />
        )}

        <label className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
          {uploading ? (
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-cyan-400" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      <span className="text-[11px] text-slate-400">Click avatar to update photo</span>
    </div>
  );
};
