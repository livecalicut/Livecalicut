'use client';

import { useEffect } from 'react';

// Last-resort boundary for errors thrown by the root layout itself
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Root layout error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#F8FAFC', color: '#111827' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ maxWidth: 420, width: '100%', textAlign: 'center', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 24 }}>
            <h1 style={{ fontSize: 20, margin: '0 0 8px' }}>Something went wrong</h1>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 20px' }}>
              Please try again. If the problem continues, come back in a few minutes.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => reset()} style={{ padding: '10px 16px', borderRadius: 10, border: 0, background: '#2563EB', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>
                Try again
              </button>
              <a href="/" style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #E5E7EB', color: '#111827', textDecoration: 'none', fontWeight: 600 }}>
                Go home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
