'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { CheckCircle2, CircleAlert, Loader2, RefreshCw } from 'lucide-react';
import type { SetupStatus } from '@/lib/services/setup.service';

function statusLabel(overall: SetupStatus['overall']) {
  switch (overall) {
    case 'ready':
      return { text: 'Ready', className: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    case 'needs_schema':
      return { text: 'Needs schema', className: 'text-amber-800 bg-amber-50 border-amber-200' };
    case 'needs_env':
      return { text: 'Needs env', className: 'text-rose-700 bg-rose-50 border-rose-200' };
    default:
      return { text: 'Degraded', className: 'text-orange-800 bg-orange-50 border-orange-200' };
  }
}

export default function SetupPage() {
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const res = await fetch('/api/v1/setup/status', { cache: 'no-store' });
        const json = await res.json();
        if (!json.success) {
          setError(json.error?.message || 'Failed to load setup status');
          return;
        }
        setStatus(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error');
      }
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pill = status ? statusLabel(status.overall) : null;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#F8FAFC]">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111827]">Setup</h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Supabase connection and database readiness
            </p>
          </div>
          <div className="flex items-center gap-2">
            {pill && (
              <span
                className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${pill.className}`}
              >
                {pill.text}
              </span>
            )}
            <button
              type="button"
              onClick={load}
              disabled={isPending}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 text-xs font-semibold text-[#111827] hover:border-[#2563EB] hover:text-[#2563EB] disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              Recheck
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!status && !error && (
          <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-8 text-sm text-[#6B7280]">
            <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" />
            Checking…
          </div>
        )}

        {status && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: 'Connection',
                  value: status.connected ? 'Online' : 'Offline',
                  hint: `${status.latencyMs}ms`,
                },
                {
                  label: 'Env keys',
                  value: `${status.env.filter((e) => e.required && e.present).length}/${status.env.filter((e) => e.required).length}`,
                  hint: 'required',
                },
                {
                  label: 'Tables',
                  value: `${status.tables.filter((t) => t.status === 'ok').length}/${status.tables.length}`,
                  hint: 'core',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-4"
                >
                  <p className="text-xs font-medium text-[#6B7280]">{item.label}</p>
                  <p className="mt-1 text-xl font-bold text-[#111827]">{item.value}</p>
                  <p className="mt-0.5 text-[11px] text-[#9CA3AF]">{item.hint}</p>
                </div>
              ))}
            </div>

            {status.nextSteps.length > 0 && (
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
                <h2 className="text-sm font-bold text-[#111827]">Next steps</h2>
                <ul className="mt-3 space-y-2">
                  {status.nextSteps.map((step) => (
                    <li key={step} className="text-sm leading-relaxed text-[#4B5563]">
                      · {step}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href="/admin/locations"
                    className="inline-flex h-9 items-center rounded-xl bg-[#2563EB] px-3.5 text-xs font-semibold text-white hover:bg-[#1D4ED8]"
                  >
                    Manage locations
                  </Link>
                  <Link
                    href="/locations"
                    className="inline-flex h-9 items-center rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-xs font-semibold text-[#111827] hover:border-[#2563EB] hover:text-[#2563EB]"
                  >
                    View public list
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex h-9 items-center rounded-xl border border-[#E5E7EB] bg-white px-3.5 text-xs font-semibold text-[#6B7280] hover:text-[#111827]"
                  >
                    Home
                  </Link>
                </div>
              </div>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                <h2 className="mb-3 text-sm font-bold text-[#111827]">Environment</h2>
                <ul className="divide-y divide-[#F3F4F6]">
                  {status.env.map((item) => (
                    <li key={item.key} className="flex items-center justify-between py-2.5">
                      <div>
                        <p className="font-mono text-[11px] font-semibold text-[#111827]">
                          {item.key}
                        </p>
                        <p className="text-[10px] text-[#9CA3AF]">
                          {item.required ? 'Required' : 'Optional'}
                          {!item.public ? ' · server' : ''}
                        </p>
                      </div>
                      {item.present ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <CircleAlert className="h-4 w-4 text-rose-500" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
                <h2 className="mb-3 text-sm font-bold text-[#111827]">Tables</h2>
                <div className="max-h-80 overflow-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] uppercase tracking-wide text-[#9CA3AF]">
                      <tr>
                        <th className="pb-2 font-semibold">Name</th>
                        <th className="pb-2 font-semibold">Rows</th>
                        <th className="pb-2 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {status.tables.map((t) => (
                        <tr key={t.table} className="border-t border-[#F3F4F6]">
                          <td className="py-2 font-mono text-[11px] text-[#111827]">{t.table}</td>
                          <td className="py-2 text-[#6B7280]">
                            {t.count === null ? '—' : t.count}
                          </td>
                          <td className="py-2 text-right">
                            {t.status === 'ok' ? (
                              <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <CircleAlert className="ml-auto h-3.5 w-3.5 text-rose-500" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
