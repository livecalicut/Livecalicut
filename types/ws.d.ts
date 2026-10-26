declare module 'ws' {
  const WebSocket: {
    new (address: string, protocols?: string | string[]): WebSocket;
  };
  export default WebSocket;
}
