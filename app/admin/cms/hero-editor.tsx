'use client';

import React, { useState } from 'react';
import { updateCMSHeroAction } from './actions';
import { Save, Loader2 } from 'lucide-react';

interface HeroEditorProps {
  initialData: {
    title?: string;
    subtitle?: string;
    badgeText?: string;
    videoUrl?: string;
  };
}

export const HeroEditor: React.FC<HeroEditorProps> = ({ initialData }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateCMSHeroAction(formData);
      if (res.error) throw new Error(res.error);
      alert('Hero section updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update CMS');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
      <div className="space-y-2">
        <label className="text-sm font-bold text-[#111827]">Main Title</label>
        <input
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-[#111827]">Subtitle</label>
        <textarea
          name="subtitle"
          value={formData.subtitle || ''}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-[#111827]">Badge Text (Top Pill)</label>
        <input
          name="badgeText"
          value={formData.badgeText || ''}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-[#111827]">Background Video URL (.mp4)</label>
        <input
          name="videoUrl"
          value={formData.videoUrl || ''}
          onChange={handleChange}
          required
          type="url"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <p className="text-xs text-gray-500">Provide a direct link to an MP4 video (e.g. from Supabase Storage).</p>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Hero Settings'}
        </button>
      </div>
    </form>
  );
};
