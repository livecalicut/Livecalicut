import WebSocketImpl from 'ws';

/** Supabase realtime expects a global WebSocket. Node 20 does not provide one. */
if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = WebSocketImpl as unknown as typeof WebSocket;
}
