import { useCallback, useEffect, useRef, useState } from 'react';
import type { WSEvent } from '../types';
import { WS_URL } from '../services/api';

export type WSStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface UseWebSocketOptions {
  onEvent: (event: WSEvent) => void;
  onStatusChange?: (status: WSStatus) => void;
}

export function useWebSocket({ onEvent, onStatusChange }: UseWebSocketOptions) {
  const [status, setStatus] = useState<WSStatus>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const updateStatus = useCallback(
    (s: WSStatus) => {
      setStatus(s);
      onStatusChange?.(s);
    },
    [onStatusChange]
  );

  const connect = useCallback(
    (prompt: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (wsRef.current) {
          wsRef.current.close();
        }

        updateStatus('connecting');
        const ws = new WebSocket(WS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          updateStatus('connected');
          ws.send(JSON.stringify({ prompt }));
          resolve();
        };

        ws.onmessage = (event) => {
          try {
            const data: WSEvent = JSON.parse(event.data);
            onEventRef.current(data);
          } catch (e) {
            console.error('Failed to parse WS message:', e);
          }
        };

        ws.onerror = (err) => {
          console.error('WebSocket error:', err);
          updateStatus('error');
          reject(new Error('WebSocket connection failed'));
        };

        ws.onclose = () => {
          updateStatus('disconnected');
        };
      });
    },
    [updateStatus]
  );

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    updateStatus('disconnected');
  }, [updateStatus]);

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return { status, connect, disconnect };
}
