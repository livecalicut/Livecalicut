'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Link2, Check, MessageSquare, Globe, Send } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : (url || '');

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      handleCopy();
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleNativeShare} className="gap-1.5 text-xs">
        <Share2 className="w-3.5 h-3.5" /> Share
      </Button>

      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
        title="Share on WhatsApp"
      >
        <MessageSquare className="w-4 h-4" />
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
        title="Share on Facebook"
      >
        <Globe className="w-4 h-4" />
      </a>

      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 border border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 transition-colors"
        title="Share on Telegram"
      >
        <Send className="w-4 h-4" />
      </a>

      <Button variant="ghost" size="icon" onClick={handleCopy} className="w-8 h-8 rounded-xl" title="Copy Link">
        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Link2 className="w-4 h-4 text-slate-400" />}
      </Button>
    </div>
  );
};
