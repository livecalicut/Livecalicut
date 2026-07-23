'use client';

import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Exception caught by Error Boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 border border-rose-500/30 bg-slate-900 text-center space-y-4 shadow-xl">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
        <h2 className="text-xl font-bold text-white">Something Went Wrong</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          An unhandled error occurred while processing your request. Our technical team has been notified.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} size="sm" className="gap-1.5">
            <RefreshCw className="w-4 h-4" /> Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Home className="w-4 h-4" /> Return Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
