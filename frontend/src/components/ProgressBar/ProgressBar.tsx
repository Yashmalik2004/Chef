import { motion } from 'framer-motion';

interface ProgressBarProps {
  phase: string;
  percent: number;
}

const PHASES = [
  { key: 'Initializing', label: 'Init', pct: 5 },
  { key: 'Planning', label: 'Planning', pct: 15 },
  { key: 'Architecting', label: 'Architecting', pct: 32 },
  { key: 'Coding', label: 'Coding', pct: 61 },
  { key: 'Testing', label: 'Testing', pct: 90 },
  { key: 'Completed', label: 'Done', pct: 100 },
];

export default function ProgressBar({ phase, percent }: ProgressBarProps) {
  const clampedPct = Math.max(0, Math.min(100, percent));
  const currentPhaseObj = PHASES.find((p) => p.key === phase) ?? PHASES[0];

  return (
    <div className="w-full">
      {/* Phase label + percentage */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-semibold text-[#00E5FF] uppercase tracking-widest">
          {currentPhaseObj.label}
        </span>
        <span className="text-[10px] text-[#94A3B8] font-mono">{clampedPct}%</span>
      </div>

      {/* Phase chips */}
      <div className="flex items-center gap-1 flex-wrap mb-3">
        {PHASES.map((p) => {
          const done = clampedPct >= p.pct;
          const active = p.key === phase;
          return (
            <div
              key={p.key}
              className="text-[9px] px-2 py-0.5 rounded transition-all"
              style={{
                color: done ? '#00E5FF' : '#94A3B8',
                backgroundColor: active ? 'rgba(0,229,255,0.1)' : 'transparent',
                border: active ? '1px solid rgba(0,229,255,0.3)' : '1px solid transparent',
              }}
            >
              {p.label}
            </div>
          );
        })}
      </div>

      {/* Track */}
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full progress-shimmer"
          initial={{ width: '0%' }}
          animate={{ width: `${clampedPct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
