import React from 'react';
import { Loader2, Cpu, ShieldCheck } from 'lucide-react';

interface ProcessingOverlayProps {
  progress?: number;
  statusText?: string;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({
  progress = 0,
  statusText = 'Processing your document locally...'
}) => {
  return (
    <div className="p-8 sm:p-12 text-center rounded-2xl glass-card border border-indigo-500/30 space-y-6 max-w-lg mx-auto shadow-2xl animate-in fade-in">
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping pointer-events-none" />
        <div className="w-full h-full rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Executing in Browser
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {statusText}
        </p>
      </div>

      {/* Animated Progress Bar */}
      {progress > 0 && (
        <div className="space-y-1.5">
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <ShieldCheck className="w-4 h-4" /> 100% In-Memory Execution
      </div>
    </div>
  );
};
