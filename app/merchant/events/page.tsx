import { MerchantSidebar } from '@/components/merchant/merchant-sidebar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus } from 'lucide-react';

export default function MerchantEventsPage() {
  const events = [
    { id: '1', title: 'Weekend Seafood Food Tasting & Live Music', date: 'July 18, 2026', venue: 'Paragon Outlet Garden' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <MerchantSidebar />
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black text-white">Merchant Events & Programs</h1>
            <p className="text-xs text-slate-400">Post outlet inaugurations, food festivals & live workshops in Kozhikode.</p>
          </div>

          <button className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Post Event
          </button>
        </div>

        <div className="space-y-3">
          {events.map((e) => (
            <Card key={e.id} className="p-4 border border-slate-800 bg-slate-900 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">{e.title}</h4>
                <p className="text-xs text-slate-400">{e.date} • {e.venue}</p>
              </div>
              <Badge variant="purple">Published</Badge>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
