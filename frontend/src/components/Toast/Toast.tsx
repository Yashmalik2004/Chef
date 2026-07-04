import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { Toast, ToastType } from '../../types';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const TOAST_CONFIG: Record<ToastType, { icon: React.ReactNode; border: string; bg: string; text: string }> = {
  success: {
    icon: <CheckCircle2 size={15} />,
    border: 'border-[#22C55E]/30',
    bg: 'bg-[#22C55E]/10',
    text: 'text-[#22C55E]',
  },
  error: {
    icon: <XCircle size={15} />,
    border: 'border-[#EF4444]/30',
    bg: 'bg-[#EF4444]/10',
    text: 'text-[#EF4444]',
  },
  warning: {
    icon: <AlertTriangle size={15} />,
    border: 'border-[#F59E0B]/30',
    bg: 'bg-[#F59E0B]/10',
    text: 'text-[#F59E0B]',
  },
  info: {
    icon: <Info size={15} />,
    border: 'border-[#00E5FF]/30',
    bg: 'bg-[#00E5FF]/10',
    text: 'text-[#00E5FF]',
  },
};

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = TOAST_CONFIG[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border glass shadow-xl max-w-xs ${config.border} ${config.bg}`}
            >
              <span className={config.text}>{config.icon}</span>
              <p className="text-xs text-[#E5E7EB] flex-1 leading-snug">{toast.message}</p>
              <button
                onClick={() => onRemove(toast.id)}
                className="text-[#94A3B8] hover:text-white transition-colors ml-1 shrink-0"
              >
                <X size={13} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
