import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { formatBytes } from '../../utils/fileHelpers';
import { Download, CheckCircle, RefreshCw, Sparkles, ArrowRight, Share2 } from 'lucide-react';

interface ResultViewProps {
  filename: string;
  originalSize?: number;
  newSize?: number;
  savingsPercentage?: number;
  onDownload: () => void;
  onReset: () => void;
  additionalInfo?: string;
}

export const ResultView: React.FC<ResultViewProps> = ({
  filename,
  originalSize,
  newSize,
  savingsPercentage,
  onDownload,
  onReset,
  additionalInfo
}) => {
  useEffect(() => {
    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="p-8 sm:p-12 text-center rounded-2xl glass-card border border-emerald-500/30 space-y-8 max-w-xl mx-auto shadow-2xl animate-in zoom-in-95">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
        <CheckCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Document Ready!
        </h3>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Your file was processed successfully with 100% private in-browser intelligence.
        </p>
      </div>

      {/* File Details & Savings Metric */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-left space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[240px]">
            {filename}
          </span>
          {newSize ? (
            <span className="font-bold text-slate-900 dark:text-white">
              {formatBytes(newSize)}
            </span>
          ) : null}
        </div>

        {savingsPercentage !== undefined && originalSize && newSize && savingsPercentage > 0 && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Size Reduced by
            </span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
              {savingsPercentage}% ({formatBytes(originalSize - newSize)} saved)
            </span>
          </div>
        )}

        {additionalInfo && (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            {additionalInfo}
          </p>
        )}
      </div>

      {/* Primary Download & Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onDownload}
          className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          <span>Download File</span>
        </button>

        <button
          onClick={onReset}
          className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Process Another File</span>
        </button>
      </div>
    </div>
  );
};
