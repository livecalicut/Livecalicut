import { PageHeader } from '@/components/shared/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, Bot, Send } from 'lucide-react';

export default function AiAssistantPage() {
  const suggestedPrompts = [
    'Best biriyani near Paragon Mavoor Road',
    'Senior IT engineer jobs at Cyberpark',
    '3 BHK sea view villa in Beach Road',
    'SM Street halwa tasting food tour',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <PageHeader
        title="LiveCalicut AI Local Concierge"
        description="Ask natural language questions to discover Kozhikode businesses, jobs, real estate & events."
        icon={<Sparkles className="w-6 h-6" />}
        breadcrumbs={[{ label: 'AI Concierge' }]}
      />

      {/* Suggested Prompts Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Suggested Discovery Questions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestedPrompts.map((sp) => (
            <Card key={sp} className="p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 surface-card text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 hover:border-cyan-300 transition-all cursor-pointer flex items-center justify-between">
              <span>&quot;{sp}&quot;</span>
              <Bot className="w-4 h-4 text-cyan-600 shrink-0" />
            </Card>
          ))}
        </div>
      </div>

      {/* AI Chat Window Container */}
      <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
        <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-xs leading-relaxed space-y-2">
          <p className="font-bold flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400">
            <Sparkles className="w-4 h-4" /> AI Concierge Ready
          </p>
          <p>
            I am grounded exclusively on verified LiveCalicut platform listings. Ask me anything about dining, vacancies, pre-owned items, or heritage spots in Kozhikode.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Input placeholder="Type your query (e.g. Best cafes with Wi-Fi near Cyberpark)..." />
          <Button className="gap-2">
            <Send className="w-4 h-4" /> Ask Concierge
          </Button>
        </div>
      </Card>
    </div>
  );
}
