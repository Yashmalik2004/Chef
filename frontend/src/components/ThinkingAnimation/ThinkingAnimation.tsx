import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu } from 'lucide-react';
import ParticleCanvas from './ParticleCanvas';

const THINKING_STATUSES = [
  'Initializing agents...',
  'Loading project context...',
  'Analyzing requirements...',
  'Planning architecture...',
  'Creating engineering tasks...',
  'Generating implementation...',
  'Writing source files...',
  'Creating directory structure...',
  'Generating backend...',
  'Generating frontend...',
  'Writing API routes...',
  'Building components...',
  'Generating tests...',
  'Checking dependencies...',
  'Running validations...',
  'Optimizing code...',
  'Finalizing project...',
  'Packaging output...',
  'Almost done...',
];

interface ThinkingAnimationProps {
  currentStatus: string;
  phase: 'connecting' | 'working';
}

export default function ThinkingAnimation({ currentStatus, phase }: ThinkingAnimationProps) {
  const [displayStatus, setDisplayStatus] = useState(currentStatus || THINKING_STATUSES[0]);
  const [autoIdx, setAutoIdx] = useState(0);
  const [useAuto, setUseAuto] = useState(true);

  // When backend sends a status, use it; otherwise auto-cycle
  useEffect(() => {
    if (currentStatus && currentStatus !== 'Initializing agents...') {
      setDisplayStatus(currentStatus);
      setUseAuto(false);
      // Resume auto-cycle after 3s if no new status comes
      const t = setTimeout(() => setUseAuto(true), 3000);
      return () => clearTimeout(t);
    }
  }, [currentStatus]);

  // Auto-cycle through status messages
  useEffect(() => {
    if (!useAuto) return;
    const interval = setInterval(() => {
      setAutoIdx((i) => {
        const next = (i + 1) % THINKING_STATUSES.length;
        setDisplayStatus(THINKING_STATUSES[next]);
        return next;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [useAuto]);

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden">
      {/* Particle background */}
      <ParticleCanvas active={true} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Animated CPU icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="relative"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center glow-accent">
            <Cpu size={28} className="text-[#00E5FF]" />
          </div>
          {/* Orbiting dot */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 flex items-start justify-center"
            style={{ transformOrigin: 'center 50%' }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF] -mt-1"
            />
          </motion.div>
        </motion.div>

        {/* Phase label */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#94A3B8] uppercase tracking-widest font-semibold">
            {phase === 'connecting' ? 'Connecting' : 'AI Agents Active'}
          </span>
          <span className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 h-1 rounded-full bg-[#00E5FF]"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </span>
        </div>

        {/* Status message with crossfade */}
        <div className="h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={displayStatus}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="thinking-glow font-mono text-lg text-[#00E5FF] font-medium"
            >
              {displayStatus}
              <motion.span
                className="ml-1 inline-block w-0.5 h-4 bg-[#00E5FF] align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              />
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Three-column agent indicators */}
        <div className="flex gap-6">
          {['Planner', 'Architect', 'Coder'].map((agent, i) => (
            <motion.div
              key={agent}
              animate={{
                opacity: [0.4, 1, 0.4],
                scale: [0.97, 1.02, 0.97],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.65,
                ease: 'easeInOut',
              }}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    agent === 'Planner' ? '#00E5FF' : agent === 'Architect' ? '#F59E0B' : '#22C55E',
                  boxShadow: `0 0 8px ${
                    agent === 'Planner' ? '#00E5FF' : agent === 'Architect' ? '#F59E0B' : '#22C55E'
                  }`,
                }}
              />
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest">{agent}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
