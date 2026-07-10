import { ChefHat, Menu, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AppPhase } from '../../types';

interface HeaderProps {
  phase: AppPhase;
  wsStatus: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const PHASE_LABELS: Record<string, { label: string; color: string }> = {
  idle: { label: 'Ready', color: '#94A3B8' },
  connecting: { label: 'Connecting...', color: '#F59E0B' },
  working: { label: 'Working...', color: '#00E5FF' },
  complete: { label: 'Complete', color: '#22C55E' },
  error: { label: 'Error', color: '#EF4444' },
};

export default function Header({ phase, wsStatus, sidebarOpen, onToggleSidebar }: HeaderProps) {
  const phaseInfo = PHASE_LABELS[phase] ?? PHASE_LABELS.idle;
  const isOnline = wsStatus === 'connected';

  return (
    <header className="flex items-center justify-between px-7 py-5 md:px-10 md:py-6 border-b border-white/5 glass shrink-0 z-20">
      <div className="flex items-center gap-5">
        <button
          id="header-toggle-sidebar"
          onClick={onToggleSidebar}
          className="p-3 rounded-xl text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all"
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-3">
          <ChefHat size={22} className="text-[#00E5FF]" />
          <span className="font-display font-bold text-white text-xl tracking-wide">CHEF</span>
          <span className="text-[#94A3B8] text-sm md:text-base hidden sm:inline">/ AI Software Engineer</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* Phase indicator */}
        <div className="flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/5 bg-white/[0.02]">
          <motion.span
            key={phase}
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: phaseInfo.color }}
          />
          <span className="text-xs font-medium" style={{ color: phaseInfo.color }}>
            {phaseInfo.label}
          </span>
        </div>

        {/* WS Status */}
        <div className="text-[#94A3B8]">
          {isOnline ? <Wifi size={15} className="text-green-400" /> : <WifiOff size={15} />}
        </div>
      </div>
    </header>
  );
}
