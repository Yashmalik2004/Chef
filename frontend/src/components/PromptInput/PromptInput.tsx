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
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Prompt Box */}
      <motion.div
        animate={{
          boxShadow: focused
            ? '0 0 0 1px rgba(0,229,255,0.5), 0 0 40px rgba(0,229,255,0.15)'
            : '0 0 0 1px rgba(255,255,255,0.07)',
        }}
        transition={{ duration: 0.2 }}
        className="relative rounded-2xl overflow-hidden glass"
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
          className="w-full bg-transparent resize-none px-5 pt-4 pb-2 text-[#E5E7EB] placeholder-[#94A3B8]/50 text-sm leading-relaxed focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minHeight: '80px', maxHeight: '200px' }}
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-[#94A3B8]" />
            <span className="text-[11px] text-[#94A3B8]">
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono">Enter</kbd> to generate · <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono">Shift+Enter</kbd> for newline
            </span>
          </div>
          <motion.button
            id="prompt-submit"
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-accent flex items-center gap-2 px-4 py-2 rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            <span>Generate</span>
            <Send size={13} />
          </motion.button>
        </div>
      </motion.div>

      {/* Example prompts */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {EXAMPLE_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => !disabled && setValue(p)}
            disabled={disabled}
            className="text-[11px] px-3 py-1.5 rounded-full border border-white/5 text-[#94A3B8] hover:text-[#00E5FF] hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
