'use client';
// components/admin/staff-password.tsx
import React, { useEffect, useState } from 'react';
import { Check, Copy, Eye, EyeOff, KeyRound, Link2, Loader2, RefreshCw, X } from 'lucide-react';
import { Modal, primaryButtonClass, secondaryButtonClass } from '@/components/admin/data-table';
import { generatePassword, passwordProblem } from '@/lib/admin/password';
import { toast } from '@/lib/toast';

const inputClass =
  'h-10 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#2563EB] focus:outline-none';

export type PasswordMode = 'set' | 'link';

async function copyText(text: string, what: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${what} copied`);
  } catch {
    toast.error('Could not copy', 'Select the text and copy it manually.');
  }
}

/** "Set a password" vs "Share a setup link" toggle */
export function PasswordModeToggle({ value, onChange }: { value: PasswordMode; onChange: (m: PasswordMode) => void }) {
  const option = (mode: PasswordMode, icon: React.ReactNode, title: string, hint: string) => (
    <button
      type="button"
      onClick={() => onChange(mode)}
      aria-pressed={value === mode}
      className={`flex flex-1 items-start gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors ${
        value === mode ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E5E7EB] bg-white hover:border-[#CBD5E1]'
      }`}
    >
      <span className={value === mode ? 'text-[#2563EB]' : 'text-[#6B7280]'}>{icon}</span>
      <span>
        <span className="block text-xs font-bold text-[#111827]">{title}</span>
        <span className="block text-[11px] text-[#6B7280]">{hint}</span>
      </span>
    </button>
  );

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {option('set', <KeyRound className="h-4 w-4" />, 'Set password', 'You choose it and share it')}
      {option('link', <Link2 className="h-4 w-4" />, 'Setup link', 'They choose their own')}
    </div>
  );
}

/** Password input with show/hide, generate and copy, plus the first unmet rule */
export function PasswordField({
  value,
  onChange,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const problem = value ? passwordProblem(value) : null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={visible ? 'text' : 'password'}
            required
            autoFocus={autoFocus}
            autoComplete="new-password"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} pr-10 font-mono`}
            placeholder="At least 8 characters"
            aria-invalid={problem ? true : undefined}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[#6B7280] hover:text-[#111827]"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            onChange(generatePassword());
            setVisible(true);
          }}
          className={secondaryButtonClass}
          title="Generate a strong password"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Generate
        </button>
        <button
          type="button"
          disabled={!value}
          onClick={() => copyText(value, 'Password')}
          className={`${secondaryButtonClass} px-3 disabled:opacity-50`}
          aria-label="Copy password"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className={`text-[11px] ${problem ? 'text-rose-600' : 'text-[#6B7280]'}`}>
        {problem ?? 'Use 8+ characters with uppercase, lowercase and a number.'}
      </p>
    </div>
  );
}

/** Shows a one-time setup link with a copy button */
export function SetupLinkModal({ name, link, onClose }: { name: string; link: string | null; onClose: () => void }) {
  return (
    <Modal open={link !== null} onClose={onClose} size="sm" labelledBy="setup-link-title">
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
        <h2 id="setup-link-title" className="flex items-center gap-2 text-base font-bold text-[#111827]">
          <Link2 className="h-5 w-5 text-[#2563EB]" /> Password setup link
        </h2>
        <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F1F5F9]">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-3 px-6 py-5">
        <p className="text-sm text-[#374151]">
          Send this link to <span className="font-semibold">{name}</span> by WhatsApp or email. It signs them in once so
          they can choose their own password.
        </p>
        <div className="flex gap-2">
          <input readOnly value={link ?? ''} onFocus={(e) => e.target.select()} className={`${inputClass} font-mono text-xs`} />
          <button type="button" onClick={() => link && copyText(link, 'Link')} className={primaryButtonClass}>
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
        </div>
        <p className="text-[11px] text-[#6B7280]">
          Works once and expires after the Supabase link lifetime (1 hour by default). Treat it like a password.
        </p>
      </div>
      <div className="flex justify-end border-t border-[#E5E7EB] bg-[#F8FAFC] px-6 py-3">
        <button type="button" onClick={onClose} className={secondaryButtonClass}>
          <Check className="h-3.5 w-3.5" /> Done
        </button>
      </div>
    </Modal>
  );
}

/** Admin reset: set a new password directly or create a setup link */
export function ResetPasswordModal({
  user,
  onClose,
  onLink,
}: {
  user: { id: string; name: string } | null;
  onClose: () => void;
  onLink: (link: string) => void;
}) {
  const [mode, setMode] = useState<PasswordMode>('set');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      setMode('set');
      setPassword('');
    }
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (mode === 'set') {
      const problem = passwordProblem(password);
      if (problem) return toast.error('Password not accepted', problem);
    }
    setBusy(true);
    try {
      const res = await fetch('/api/v1/admin/users/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'set' ? { userId: user.id, mode, password } : { userId: user.id, mode }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.error || `Request failed (${res.status})`);

      if (mode === 'set') {
        toast.success('Password updated', `Share the new password with ${user.name}.`);
      } else {
        onLink(json.link);
      }
      onClose();
    } catch (err) {
      toast.error('Password not changed', err instanceof Error ? err.message : undefined);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={user !== null} onClose={() => !busy && onClose()} size="sm" labelledBy="reset-password-title">
      <form onSubmit={submit} className="flex min-h-0 flex-col">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
          <h2 id="reset-password-title" className="flex items-center gap-2 text-base font-bold text-[#111827]">
            <KeyRound className="h-5 w-5 text-[#2563EB]" /> Reset password
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-[#6B7280] hover:bg-[#F1F5F9]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <p className="text-sm text-[#374151]">
            For <span className="font-semibold">{user?.name}</span>
          </p>
          <PasswordModeToggle value={mode} onChange={setMode} />
          {mode === 'set' ? (
            <label className="block space-y-1.5">
              <span className="text-xs font-bold text-[#374151]">New password</span>
              <PasswordField value={password} onChange={setPassword} autoFocus />
            </label>
          ) : (
            <p className="rounded-xl bg-[#F8FAFC] px-3 py-2.5 text-[11px] text-[#6B7280]">
              You’ll get a one-time link to share. Their current password keeps working until they set a new one.
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-[#E5E7EB] bg-[#F8FAFC] px-6 py-3">
          <button type="button" onClick={onClose} className={secondaryButtonClass}>
            Cancel
          </button>
          <button type="submit" disabled={busy} className={primaryButtonClass}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'set' ? 'Update password' : 'Create link'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
