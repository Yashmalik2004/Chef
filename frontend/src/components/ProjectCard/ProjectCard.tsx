import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Download,
  RefreshCw,
  FolderOpen,
  FileCode2,
  Clock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import type { ProjectResult } from '../../types';
import { api } from '../../services/api';

interface ProjectCardProps {
  result: ProjectResult;
  onReset: () => void;
}

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'py': return '🐍';
    case 'ts': case 'tsx': return '🔷';
    case 'js': case 'jsx': return '🟡';
    case 'html': return '🌐';
    case 'css': return '🎨';
    case 'json': return '📋';
    case 'md': return '📝';
    case 'env': return '🔐';
    case 'txt': return '📄';
    default: return '📁';
  }
}

export default function ProjectCard({ result, onReset }: ProjectCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [filesExpanded, setFilesExpanded] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await api.downloadProject();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const previewFiles = result.files.slice(0, filesExpanded ? result.files.length : 8);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-xl mx-auto"
    >
      {/* Success header */}
      <div className="glass rounded-2xl border border-[#22C55E]/20 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-start gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
              className="w-14 h-14 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center glow-success shrink-0"
            >
              <CheckCircle2 size={26} className="text-[#22C55E]" />
            </motion.div>

            <div className="flex-1 min-w-0">
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[11px] font-semibold text-[#22C55E] uppercase tracking-widest mb-1"
              >
                ✔ Build Complete
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="font-display font-bold text-white text-xl leading-tight truncate"
              >
                {result.projectName}
              </motion.h2>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex items-center gap-4 mt-2"
              >
                <div className="flex items-center gap-1.5">
                  <FileCode2 size={13} className="text-[#94A3B8]" />
                  <span className="text-xs text-[#94A3B8]">{result.files.length} files</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-[#94A3B8]" />
                  <span className="text-xs text-[#94A3B8]">{result.elapsed}s</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* File tree */}
        <div className="px-4 py-3 border-b border-white/5">
          <button
            onClick={() => setFilesExpanded(!filesExpanded)}
            className="flex items-center gap-2 w-full text-left mb-2 group"
          >
            {filesExpanded ? (
              <ChevronDown size={13} className="text-[#94A3B8]" />
            ) : (
              <ChevronRight size={13} className="text-[#94A3B8]" />
            )}
            <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-widest group-hover:text-white transition-colors">
              Generated Files ({result.files.length})
            </span>
          </button>

          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {previewFiles.map((file, i) => (
              <motion.div
                key={file}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/5 transition-colors"
              >
                <span className="text-sm">{getFileIcon(file)}</span>
                <span className="font-mono text-[11px] text-[#E5E7EB]/80 truncate">{file}</span>
              </motion.div>
            ))}
            {!filesExpanded && result.files.length > 8 && (
              <button
                onClick={() => setFilesExpanded(true)}
                className="text-[11px] text-[#94A3B8] hover:text-[#00E5FF] pl-2 mt-1 transition-colors"
              >
                +{result.files.length - 8} more files...
              </button>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-5 flex flex-col gap-3">
          {/* Row 1: Download + Open Folder */}
          <div className="flex gap-3">
            <motion.button
              id="project-download"
              onClick={handleDownload}
              disabled={downloading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-accent flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm flex-1 justify-center"
            >
              <Download size={14} />
              {downloading ? 'Downloading...' : 'Download ZIP'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-white/10 text-[#94A3B8] hover:text-white hover:border-white/20 hover:bg-white/5 transition-all flex-1 justify-center"
            >
              <FolderOpen size={14} />
              Open Folder
            </motion.button>
          </div>

          {/* Row 2: Generate Again */}
          <motion.button
            id="project-generate-again"
            onClick={onReset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border border-white/10 text-[#94A3B8] hover:text-white hover:border-[#00E5FF]/30 hover:bg-[#00E5FF]/5 transition-all w-full justify-center"
          >
            <RefreshCw size={14} />
            Generate Again
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
