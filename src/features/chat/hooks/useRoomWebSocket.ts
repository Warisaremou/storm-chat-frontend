import { useEffect, useRef } from 'react';
import { useChatStore } from '@/stores/chat.store';
import { getRoomWebSocketUrl } from '@/lib/roomWebSocketUrl';
import type { Message } from '@/types';

const RECONNECT_DELAY_MS = 3000;

export function useRoomWebSocket(roomId: string | null) {
  const addMessage = useChatStore((s) => s.addMessage);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRoomId = useRef<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    activeRoomId.current = roomId;

    function connect() {
      if (activeRoomId.current !== roomId) return;

      const url = getRoomWebSocketUrl(roomId);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data as string) as Message;
          addMessage(roomId, message);
        } catch {
          // ignore malformed frames
        }
      };

      ws.onclose = () => {
        if (activeRoomId.current !== roomId) return;
        reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY_MS);
      };
    }

    connect();

    return () => {
      activeRoomId.current = null;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [roomId, addMessage]);
}
