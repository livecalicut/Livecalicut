'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { wipeDummyDataAction } from './actions';
import { useRouter } from 'next/navigation';

export function WipeDataButton() {
  const [wiping, setWiping] = useState(false);
  const router = useRouter();

  const handleWipe = async () => {
    if (!window.confirm('WARNING: This will permanently delete all dummy/system-generated data across the platform. Proceed?')) return;
    
    setWiping(true);
    const res = await wipeDummyDataAction();
    if (res.success) {
      alert('Dummy data wiped successfully!');
      router.refresh();
    } else {
      alert('Failed to wipe data: ' + res.error);
    }
    setWiping(false);
  };

  return (
    <button
      onClick={handleWipe}
      disabled={wiping}
      className="h-[40px] px-4 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
    >
      <Trash2 className="w-4 h-4" />
      {wiping ? 'Wiping...' : 'Wipe Dummy Data'}
    </button>
  );
}
