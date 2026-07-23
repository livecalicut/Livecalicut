import { MerchantSidebar } from '@/components/merchant/merchant-sidebar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Plus } from 'lucide-react';

export default function MerchantNewsPage() {
  const announcements = [
    { id: '1', title: 'New Outdoor Dining Garden Section Now Open', date: 'July 10, 2026' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <MerchantSidebar />
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-white">Business News & Updates</h1>
            <p className="text-xs text-slate-400">Publish announcements, menu additions, or holiday timing alerts.</p>
          </div>

          <button className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Publish Announcement
          </button>
        </div>

        <div className="space-y-3">
          {announcements.map((a) => (
            <Card key={a.id} className="p-4 border border-slate-800 bg-slate-900 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">{a.title}</h4>
                <p className="text-xs text-slate-400">Published on {a.date}</p>
              </div>
              <Badge variant="success">Live</Badge>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
