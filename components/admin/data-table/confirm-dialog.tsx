'use client';
// components/admin/data-table/confirm-dialog.tsx
import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Modal } from './modal';

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} onClose={busy ? () => {} : onCancel} size="sm">
      <div className="flex gap-3 p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#111827]">{title}</h2>
          <p className="mt-1 text-sm text-[#6B7280]">{message}</p>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-[#E5E7EB] bg-[#F8FAFC] px-6 py-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="h-9 rounded-xl border border-[#E5E7EB] bg-white px-4 text-xs font-bold text-[#374151] hover:bg-[#F8FAFC]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-rose-600 px-4 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-60"
        >
          {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
