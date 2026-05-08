/**
 * Room WebSocket URL. Must match the API gateway path so Vite/nginx can rewrite to
 * message-service `/ws/rooms/:room_id` (see storm-chat ingress `/api/messages/?(.*)`).
 *
 * Optional `VITE_WS_URL`: only used when set to a full `ws://` or `wss://` base
 * (e.g. `ws://localhost:8082/ws` → connects to `.../ws/rooms/:id`).
 */
export function getRoomWebSocketUrl(roomId: string): string {
  const wsOverride = import.meta.env.VITE_WS_URL as string | undefined;
  if (wsOverride?.startsWith('ws://') || wsOverride?.startsWith('wss://')) {
    return `${wsOverride.replace(/\/$/, '')}/rooms/${roomId}`;
  }

  const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';
  const base = apiUrl.replace(/\/$/, '');

  if (base.startsWith('http://') || base.startsWith('https://')) {
    const u = new URL(base);
    const wsProto = u.protocol === 'https:' ? 'wss:' : 'ws:';
    const pathPrefix = u.pathname.replace(/\/$/, '');
    return `${wsProto}//${u.host}${pathPrefix}/messages/ws/rooms/${roomId}`;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}${base}/messages/ws/rooms/${roomId}`;
}
