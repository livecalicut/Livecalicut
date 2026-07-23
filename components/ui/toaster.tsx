'use client';
// components/ui/toaster.tsx
import React, { useEffect, useState } from 'react';
import { toast, type ToastMessage } from '@/lib/toast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function Toaster() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return toast.subscribe((items) => setToasts(items));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';
        const isWarning = t.type === 'warning';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              isSuccess
                ? 'bg-slate-900 border-emerald-500/40 text-emerald-400'
                : isError
                ? 'bg-slate-900 border-rose-500/40 text-rose-400'
                : isWarning
                ? 'bg-slate-900 border-amber-500/40 text-amber-400'
                : 'bg-slate-900 border-cyan-500/40 text-cyan-400'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-cyan-400" />}
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <h4 className="text-xs font-bold text-white leading-tight">{t.title}</h4>
              {t.message && <p className="text-xs text-slate-300 leading-normal">{t.message}</p>}
            </div>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
