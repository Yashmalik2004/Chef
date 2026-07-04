// ── WebSocket Event Types ──────────────────────────────────────────────────

export type AgentName = 'Planner' | 'Architect' | 'Coder' | null;

export type ProgressPhase =
  | 'Initializing'
  | 'Planning'
  | 'Architecting'
  | 'Coding'
  | 'Testing'
  | 'Completed';

export interface LogEvent {
  type: 'log';
  agent: AgentName;
  message: string;
  timestamp: number;
}

export interface ProgressEvent {
  type: 'progress';
  phase: ProgressPhase;
  percent: number;
}

export interface StatusEvent {
  type: 'status';
  message: string;
}

export interface CompleteEvent {
  type: 'complete';
  project_name: string;
  files: string[];
  elapsed: number;
}

export interface ErrorEvent {
  type: 'error';
  message: string;
}

export interface HeartbeatEvent {
  type: 'heartbeat';
}

export type WSEvent =
  | LogEvent
  | ProgressEvent
  | StatusEvent
  | CompleteEvent
  | ErrorEvent
  | HeartbeatEvent;

// ── App State Types ────────────────────────────────────────────────────────

export type AppPhase =
  | 'idle'          // Prompt screen
  | 'connecting'    // WebSocket connecting
  | 'working'       // Agents running
  | 'complete'      // Project generated
  | 'error';        // Something went wrong

export interface TerminalLine {
  id: string;
  agent: AgentName;
  message: string;
  timestamp: number;
}

export interface ProjectResult {
  projectName: string;
  files: string[];
  elapsed: number;
}

export interface ProjectHistoryItem {
  id: string;
  name: string;
  prompt: string;
  timestamp: Date;
  status: 'complete' | 'error' | 'running';
  files?: string[];
}

// ── Toast Types ───────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
