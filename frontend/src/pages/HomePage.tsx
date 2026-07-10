import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat } from 'lucide-react';

import { useChef } from '../hooks/useChef';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import PromptInput from '../components/PromptInput/PromptInput';
import ThinkingAnimation from '../components/ThinkingAnimation/ThinkingAnimation';
import Terminal from '../components/Terminal/Terminal';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import ProjectCard from '../components/ProjectCard/ProjectCard';
import ToastContainer from '../components/Toast/Toast';

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
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
    removeToast,
  } = useChef();

  const isWorking = phase === 'working' || phase === 'connecting';
  const showTerminal = isWorking || phase === 'complete' || phase === 'error';
  const showProgress = isWorking || phase === 'complete';

  return (
    <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(0,229,255,0.12),_transparent_34%),linear-gradient(180deg,#0B0F19_0%,#080b12_100%)] p-3 md:p-6 lg:p-7">
      <div className="flex min-h-[calc(100vh-1.5rem)] flex-col rounded-[28px] border border-white/8 bg-[#0B0F19]/85 shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden md:min-h-[calc(100vh-3rem)] md:rounded-[36px] lg:h-[calc(100vh-3.5rem)] lg:overflow-hidden">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <Header
          phase={phase}
          wsStatus={wsStatus}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col lg:flex-row overflow-visible lg:overflow-hidden">

          {/* ── Sidebar ─────────────────────────────────────────────── */}
          <div
            className={`shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-full lg:w-[360px]' : 'w-0'}`}
          >
            <Sidebar
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen((v) => !v)}
              history={history}
              onClearHistory={clearHistory}
              onNewProject={reset}
              wsStatus={wsStatus}
            />
          </div>

          {/* ── Main Content ─────────────────────────────────────────── */}
          <main className="flex-1 flex flex-col min-w-0 overflow-visible lg:overflow-hidden">

            {/* ── Center Area ─────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col gap-6 lg:gap-0 lg:flex-row overflow-visible lg:overflow-hidden">

              {/* ── Center Panel ─────────────────────────────────────── */}
              <div className="flex-1 flex flex-col items-center justify-start relative overflow-visible lg:overflow-auto min-w-0 px-5 py-8 sm:px-6 md:px-12 md:py-16 lg:px-16 lg:py-18">

              {/* Idle state */}
              <AnimatePresence mode="wait">
                {phase === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-10 sm:gap-12 lg:gap-16 w-full max-w-5xl mx-auto pt-4 sm:pt-8 pb-8"
                  >
                    {/* Hero */}
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, type: 'spring', damping: 20 }}
                        className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-[2.25rem] bg-[#00E5FF]/10 border border-[#00E5FF]/30 mb-8 sm:mb-10 glow-accent"
                      >
                        <ChefHat size={36} className="sm:size-[46px] text-[#00E5FF]" />
                      </motion.div>

                      <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="font-display font-extrabold text-white text-glow tracking-tight"
                        style={{ fontSize: 'clamp(2.75rem, 10vw, 6rem)' }}
                      >
                        CHEF
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-[#94A3B8] mt-4 text-base sm:text-lg md:text-xl lg:text-2xl"
                      >
                        Your AI Software Engineer
                      </motion.p>

                      {/* Agent badges */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 flex-wrap"
                      >
                        {['Planner', 'Architect', 'Coder'].map((a, i) => (
                          <span
                            key={a}
                            className="text-[10px] sm:text-[11px] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border font-semibold uppercase tracking-widest"
                            style={{
                              borderColor:
                                i === 0 ? 'rgba(0,229,255,0.3)' : i === 1 ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)',
                              color:
                                i === 0 ? '#00E5FF' : i === 1 ? '#F59E0B' : '#22C55E',
                              backgroundColor:
                                i === 0 ? 'rgba(0,229,255,0.05)' : i === 1 ? 'rgba(245,158,11,0.05)' : 'rgba(34,197,94,0.05)',
                            }}
                          >
                            {a}
                          </span>
                        ))}
                      </motion.div>
                    </div>

                    {/* Prompt */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="w-full max-w-5xl"
                    >
                      <PromptInput onSubmit={submit} disabled={isWorking} />
                    </motion.div>
                  </motion.div>
                )}

                {/* Thinking / Working */}
                {(phase === 'connecting' || phase === 'working') && (
                  <motion.div
                    key="working"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <ThinkingAnimation
                      currentStatus={currentStatus}
                      phase={phase === 'connecting' ? 'connecting' : 'working'}
                    />
                  </motion.div>
                )}

                {/* Complete */}
                {phase === 'complete' && projectResult && (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-5xl mx-auto"
                  >
                    <ProjectCard result={projectResult} onReset={reset} />
                  </motion.div>
                )}

                {/* Error */}
                {phase === 'error' && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-8 text-center max-w-xl mx-auto"
                  >
                    <div className="w-28 h-28 rounded-[2rem] bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center">
                      <span className="text-5xl">⚠️</span>
                    </div>
                    <h2 className="font-display font-bold text-white text-4xl">Something went wrong</h2>
                    <p className="text-[#94A3B8] text-sm">
                      Check the terminal for error details. Make sure the CHEF backend server is running.
                    </p>
                    <button
                      onClick={reset}
                      className="btn-accent px-6 py-2.5 rounded-xl text-sm mt-2"
                    >
                      Try Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Right: Terminal Panel ─────────────────────────────── */}
            <AnimatePresence>
              {showTerminal && (
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.35 }}
                  className="flex w-full flex-col border-t border-white/5 lg:border-t-0 lg:border-l bg-[#080b12] overflow-hidden lg:w-[500px] lg:min-w-[380px] lg:max-w-[560px]"
                >
                  {/* Progress bar */}
                  {showProgress && (
                    <div className="px-8 py-6 border-b border-white/5 shrink-0">
                      <ProgressBar phase={progressPhase} percent={progressPercent} />
                    </div>
                  )}

                  {/* Terminal */}
                  <div className="flex-1 overflow-hidden">
                    <Terminal lines={terminalLines} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Bottom prompt bar (when working/complete) ─────────────── */}
          <AnimatePresence>
            {phase !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="border-t border-white/5 px-5 py-5 sm:px-8 sm:py-7 md:px-12 md:py-8 glass shrink-0"
              >
                <div className="max-w-5xl mx-auto">
                  <PromptInput onSubmit={submit} disabled={isWorking} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </main>
        </div>
      </div>

      {/* ── Toasts ──────────────────────────────────────────────────────── */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
