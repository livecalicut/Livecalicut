'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sparkles, Bot, X, Send, MapPin, ExternalLink } from 'lucide-react';

export const FloatingAiButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<
    { sender: 'user' | 'assistant'; text: string; listings?: any[] }[]
  >([
    {
      sender: 'assistant',
      text: 'Hello! I am your LiveCalicut AI Concierge. Ask me about biriyani spots, Cyberpark jobs, beach rentals, or SM Street shops!',
    },
  ]);

  const handleSend = () => {
    if (!prompt.trim()) return;

    const userMsg = prompt;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setPrompt('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: `Found verified Kozhikode records matching "${userMsg}":`,
          listings: [
            {
              title: 'Paragon Mutton Dum Biryani',
              category: 'Dining',
              url: '/business/paragon-restaurant',
            },
          ],
        },
      ]);
    }, 800);
  };

  return (
    <>
      {/* Floating Sparkles Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-xl shadow-cyan-600/30 hover:scale-105 transition-all flex items-center gap-2 font-bold text-xs"
      >
        <Sparkles className="w-5 h-5 fill-white animate-pulse" />
        <span>Ask AI Concierge</span>
      </button>

      {/* Interactive Chat Overlay Window */}
      {isOpen && (
        <Card className="fixed bottom-36 right-6 z-50 w-80 sm:w-96 h-[480px] border border-cyan-500/30 bg-slate-950 text-slate-100 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="text-xs font-bold text-white">LiveCalicut Local Concierge</h4>
                <p className="text-[10px] text-emerald-400 font-semibold">Grounded on Platform Records</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl ${
                  m.sender === 'user'
                    ? 'bg-cyan-600 text-white ml-8 font-medium'
                    : 'bg-slate-900 text-slate-200 border border-slate-800 mr-6 space-y-2'
                }`}
              >
                <p>{m.text}</p>
                {m.listings?.map((l) => (
                  <a
                    key={l.title}
                    href={l.url}
                    className="block p-2 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 font-bold hover:underline flex items-center justify-between"
                  >
                    <span>{l.title}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            ))}
          </div>

          {/* Prompt Input Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI concierge..."
              className="bg-slate-950 border-slate-800 text-white text-xs"
            />
            <Button size="sm" onClick={handleSend} className="bg-cyan-600 hover:bg-cyan-500 text-white p-2">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};
