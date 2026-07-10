import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { TerminalLine } from '../../types';

interface TerminalProps {
  lines: TerminalLine[];
}

const AGENT_COLORS: Record<string, string> = {
  Planner: '#00E5FF',
  Architect: '#F59E0B',
  Coder: '#22C55E',
};

function getLineStyle(line: TerminalLine): { prefix: string; prefixColor: string; msgColor: string } {
  const msg = line.message.toUpperCase();

  if (msg.includes('ERROR') || msg.includes('TRACEBACK')) {
    return { prefix: 'ERR', prefixColor: '#EF4444', msgColor: '#EF4444' };
  }
  if (msg.includes('WARN')) {
    return { prefix: 'WRN', prefixColor: '#F59E0B', msgColor: '#F59E0B' };
  }
  if (msg.includes('WROTE:') || msg.includes('SUCCESS') || msg.includes('COMPLETE') || msg.includes('DONE')) {
    return { prefix: line.agent ?? 'SYS', prefixColor: '#22C55E', msgColor: '#22C55E' };
  }

  const agentColor = line.agent ? AGENT_COLORS[line.agent] ?? '#94A3B8' : '#94A3B8';
  return {
    prefix: line.agent ?? 'SYS',
    prefixColor: agentColor,
    msgColor: '#E5E7EB',
  };
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

export default function Terminal({ lines }: TerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);

  useEffect(() => {
    if (autoScrollRef.current && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    autoScrollRef.current = atBottom;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-5 sm:px-7 py-[18px] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          {/* Traffic lights */}
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]/70" />
          <span className="ml-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest">
            Terminal
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Color legend */}
          <div className="hidden sm:flex items-center gap-4">
            {Object.entries(AGENT_COLORS).map(([agent, color]) => (
              <div key={agent} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[9px] text-[#94A3B8]">{agent}</span>
              </div>
            ))}
          </div>
          <span className="text-[10px] text-[#94A3B8] font-mono">{lines.length} lines</span>
        </div>
      </div>

      {/* Terminal body */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 sm:py-6 font-mono text-[11px] sm:text-[13px] leading-relaxed bg-black/30"
      >
        {lines.length === 0 ? (
          <div className="flex flex-col items-start gap-1 text-[#94A3B8]/50">
            <span className="text-[#22C55E]/70">chef@ai:~$</span>
            <span>Waiting for agents to start...</span>
            <motion.span
              className="inline-block w-2 h-3 bg-[#22C55E]/70 mt-1"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            />
          </div>
        ) : (
          <>
            {lines.map((line) => {
              const style = getLineStyle(line);
              return (
                <div key={line.id} className="term-line flex gap-2 sm:gap-4 mb-2 group">
                  {/* Timestamp */}
                  <span className="hidden sm:inline text-[#94A3B8]/30 shrink-0 select-none">
                    {formatTimestamp(line.timestamp)}
                  </span>
                  {/* Agent prefix */}
                  <span
                    className="shrink-0 font-semibold min-w-[62px] sm:min-w-[88px]"
                    style={{ color: style.prefixColor }}
                  >
                    [{style.prefix}]
                  </span>
                  {/* Message */}
                  <span style={{ color: style.msgColor }} className="break-all">
                    {line.message}
                  </span>
                </div>
              );
            })}
            {/* Blinking cursor */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[#22C55E]/70">chef@ai:~$</span>
              <motion.span
                className="inline-block w-2 h-3 bg-[#22C55E]"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              />
            </div>
          </>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
