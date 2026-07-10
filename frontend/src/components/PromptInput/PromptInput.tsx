import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  disabled?: boolean;
}

const EXAMPLE_PROMPTS = [
  'Build a REST API with FastAPI and SQLite',
  'Create a React dashboard with charts',
  'Build a CLI tool for file management',
  'Create a blog with Next.js and Markdown',
];

export default function PromptInput({ onSubmit, disabled = false }: PromptInputProps) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, disabled, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Main Prompt Box */}
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 1px rgba(0,229,255,0.5), 0 0 40px rgba(0,229,255,0.15)'
            : '0 0 0 1px rgba(255,255,255,0.07)',
        }}
        transition={{ duration: 0.2 }}
        className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden glass"
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id="prompt-input"
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder="What would you like to build today?"
          rows={3}
          className="w-full bg-transparent resize-none px-5 sm:px-8 pt-5 sm:pt-7 pb-4 sm:pb-5 text-base sm:text-lg md:text-xl leading-relaxed focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minHeight: '120px', maxHeight: '320px' }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 px-5 pb-5 sm:px-7 sm:pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <Sparkles size={16} className="text-[#94A3B8] shrink-0 mt-0.5" />
            <span className="text-xs sm:text-sm md:text-base text-[#94A3B8] leading-relaxed">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono">Enter</kbd> to generate · <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono">Shift+Enter</kbd> for newline
            </span>
          </div>
          <motion.button
            id="prompt-submit"
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-accent flex items-center gap-2 px-6 sm:px-7 py-3 rounded-[1.35rem] text-sm sm:text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none self-start md:self-auto w-full md:w-auto justify-center"
          >
            <span>Generate</span>
            <Send size={13} />
          </motion.button>
        </div>
      </motion.div>

      {/* Example prompts */}
      <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3 justify-center sm:justify-start">
        {EXAMPLE_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => !disabled && setValue(p)}
            disabled={disabled}
            className="text-[11px] sm:text-[12px] px-4 sm:px-5 py-2.5 rounded-full border border-white/5 text-[#94A3B8] hover:text-[#00E5FF] hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
