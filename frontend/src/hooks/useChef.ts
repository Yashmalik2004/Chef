import { useCallback, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import type {
  AppPhase,
  ProjectHistoryItem,
  ProjectResult,
  TerminalLine,
  Toast,
  ToastType,
  WSEvent,
} from '../types';
import { useWebSocket } from './useWebSocket';

function nanoidShort() {
  return nanoid(8);
}

export function useChef() {
  // ── State ────────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<AppPhase>('idle');
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [progressPhase, setProgressPhase] = useState('Initializing');
  const [progressPercent, setProgressPercent] = useState(0);
  const [projectResult, setProjectResult] = useState<ProjectResult | null>(null);
  const [history, setHistory] = useState<ProjectHistoryItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentStatus, setCurrentStatus] = useState('Initializing agents...');

  const currentPromptRef = useRef('');
  const startTimeRef = useRef<number>(0);
  const historyIdRef = useRef<string>('');

  // ── Toast helpers ────────────────────────────────────────────────────────
  const addToast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = nanoidShort();
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── WS event handler ─────────────────────────────────────────────────────
  const handleEvent = useCallback(
    (event: WSEvent) => {
      switch (event.type) {
        case 'log': {
          const line: TerminalLine = {
            id: nanoidShort(),
            agent: event.agent,
            message: event.message,
            timestamp: event.timestamp,
          };
          setTerminalLines((prev) => [...prev, line]);
          break;
        }

        case 'progress': {
          setProgressPhase(event.phase);
          setProgressPercent(event.percent);
          break;
        }

        case 'status': {
          setCurrentStatus(event.message);
          break;
        }

        case 'complete': {
          setProgressPhase('Completed');
          setProgressPercent(100);
          const result: ProjectResult = {
            projectName: event.project_name,
            files: event.files,
            elapsed: event.elapsed,
          };
          setProjectResult(result);
          setPhase('complete');

          // Update history item
          setHistory((prev) =>
            prev.map((h) =>
              h.id === historyIdRef.current
                ? { ...h, status: 'complete', files: event.files }
                : h
            )
          );
          addToast('success', `✔ "${event.project_name}" generated in ${event.elapsed}s`);
          break;
        }

        case 'error': {
          setPhase('error');
          setHistory((prev) =>
            prev.map((h) =>
              h.id === historyIdRef.current ? { ...h, status: 'error' } : h
            )
          );
          addToast('error', `Error: ${event.message.slice(0, 100)}`);
          const errLine: TerminalLine = {
            id: nanoidShort(),
            agent: null,
            message: `ERROR: ${event.message}`,
            timestamp: Date.now(),
          };
          setTerminalLines((prev) => [...prev, errLine]);
          break;
        }

        case 'heartbeat':
          break;
      }
    },
    [addToast]
  );

  // ── WebSocket hook ────────────────────────────────────────────────────────
  const { status: wsStatus, connect, disconnect } = useWebSocket({
    onEvent: handleEvent,
    onStatusChange: (s) => {
      if (s === 'error') {
        addToast('error', 'WebSocket connection failed. Is the server running?');
        setPhase('error');
      }
    },
  });

  // ── Submit prompt ─────────────────────────────────────────────────────────
  const submit = useCallback(
    async (prompt: string) => {
      if (!prompt.trim()) return;

      // Reset state
      currentPromptRef.current = prompt;
      startTimeRef.current = Date.now();
      setTerminalLines([]);
      setProgressPhase('Initializing');
      setProgressPercent(0);
      setProjectResult(null);
      setCurrentStatus('Initializing agents...');
      setPhase('connecting');

      // Add history entry
      const histId = nanoidShort();
      historyIdRef.current = histId;
      const histItem: ProjectHistoryItem = {
        id: histId,
        name: prompt.slice(0, 40) + (prompt.length > 40 ? '…' : ''),
        prompt,
        timestamp: new Date(),
        status: 'running',
      };
      setHistory((prev) => [histItem, ...prev]);

      try {
        await connect(prompt);
        setPhase('working');
        addToast('info', 'Connected — agents are starting...');
      } catch (e) {
        setPhase('error');
        setHistory((prev) =>
          prev.map((h) => (h.id === histId ? { ...h, status: 'error' } : h))
        );
        addToast('error', 'Failed to connect to backend');
      }
    },
    [connect, addToast]
  );

  const reset = useCallback(() => {
    disconnect();
    setPhase('idle');
    setTerminalLines([]);
    setProgressPhase('Initializing');
    setProgressPercent(0);
    setProjectResult(null);
    setCurrentStatus('Initializing agents...');
  }, [disconnect]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    phase,
    terminalLines,
    progressPhase,
    progressPercent,
    projectResult,
    history,
    toasts,
    currentStatus,
    wsStatus,
    submit,
    reset,
    clearHistory,
    addToast,
    removeToast,
  };
}
