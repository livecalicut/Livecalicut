import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPinOff, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 border border-slate-800 bg-slate-900 text-center space-y-4 shadow-2xl">
        <MapPinOff className="w-14 h-14 text-cyan-400 mx-auto" />
        <h1 className="text-3xl font-black text-white">404 - Page Not Found</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          The Kozhikode location, listing, or page you are looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button size="sm" className="gap-1.5">
              <Home className="w-4 h-4" /> LiveCalicut Home
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Search className="w-4 h-4" /> Universal Search
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
