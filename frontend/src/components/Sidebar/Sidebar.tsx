import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat,
  Circle,
  Plus,
  Settings,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type { ProjectHistoryItem } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  history: ProjectHistoryItem[];
  onClearHistory: () => void;
  onNewProject: () => void;
  wsStatus: string;
}

const STATUS_COLOR: Record<string, string> = {
  complete: 'text-green-400',
  error: 'text-red-400',
  running: 'text-[#00E5FF]',
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  complete: <CheckCircle2 size={12} className="text-green-400" />,
  error: <AlertCircle size={12} className="text-red-400" />,
  running: <Loader2 size={12} className="text-[#00E5FF] animate-spin" />,
};

function formatTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

export default function Sidebar({
  isOpen,
  history,
  onClearHistory,
  onNewProject,
  wsStatus,
}: SidebarProps) {
  const isConnected = wsStatus === 'connected';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="flex flex-col h-auto lg:h-full glass border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden"
          style={{ minWidth: 0 }}
        >
          {/* ── Logo ───────────────────────────────────────────────── */}
          <div className="flex items-center gap-4 px-5 py-5 sm:px-8 sm:py-8 border-b border-white/5">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center">
                <ChefHat size={20} className="sm:size-[24px] text-[#00E5FF]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00E5FF] border-2 border-[#111827]" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-xl sm:text-[1.65rem] leading-none">CHEF</p>
              <p className="text-[10px] sm:text-[11px] text-[#94A3B8] mt-1.5 tracking-[0.24em] uppercase">AI Engineer</p>
            </div>
          </div>

          {/* ── Status ─────────────────────────────────────────────── */}
          <div className="px-5 py-4 sm:px-8 sm:py-5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 shadow-[0_0_8px_#22C55E]' : 'bg-[#94A3B8]'}`}
              />
              <span className="text-xs sm:text-sm text-[#94A3B8]">
                {isConnected ? 'Connected' : wsStatus === 'connecting' ? 'Connecting...' : 'Ready'}
              </span>
            </div>
          </div>

          {/* ── Project History ────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
            <div className="flex items-center justify-between mb-4 sm:mb-5 px-2">
              <p className="text-[11px] sm:text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.22em]">
                History
              </p>
              {history.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-[#94A3B8] hover:text-red-400 transition-colors p-1 rounded"
                  title="Clear history"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-sm sm:text-base text-[#94A3B8]/60">No projects yet</p>
              </div>
            ) : (
              <div className="space-y-2.5 sm:space-y-3">
                {history.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-hover group rounded-[1.5rem] p-4 sm:p-5 border border-white/5 bg-white/[0.02] cursor-pointer hover:border-[#00E5FF]/20 hover:bg-[#00E5FF]/5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm sm:text-[15px] text-[#E5E7EB] font-medium leading-snug line-clamp-2 flex-1">
                        {item.name}
                      </p>
                      <span className="flex-shrink-0 mt-0.5">
                        {STATUS_ICON[item.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Clock size={12} className="text-[#94A3B8]" />
                      <span className="text-[11px] sm:text-[12px] text-[#94A3B8]">{formatTime(item.timestamp)}</span>
                      {item.files && (
                        <span className="text-[11px] sm:text-[12px] text-[#94A3B8]">· {item.files.length} files</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* ── Actions ────────────────────────────────────────────── */}
          <div className="p-4 sm:p-6 border-t border-white/5 space-y-3.5">
            <button
              id="sidebar-new-project"
              onClick={onNewProject}
              className="w-full flex items-center gap-3 sm:gap-4 px-5 py-[18px] rounded-[1.35rem] text-sm sm:text-base font-medium text-white bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/20 hover:border-[#00E5FF]/40 transition-all group"
            >
              <Plus size={18} className="text-[#00E5FF] group-hover:rotate-90 transition-transform duration-200" />
              New Project
            </button>
            <button className="w-full flex items-center gap-3 sm:gap-4 px-5 py-[18px] rounded-[1.35rem] text-sm sm:text-base text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all">
              <Settings size={18} />
              Settings
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
