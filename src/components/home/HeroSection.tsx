import React from 'react';
import { ShieldCheck, Zap, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (slug: string) => void;
  onSearch: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onSearch }) => {
  return (
    <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-4">
      
      {/* Title */}
      <h1 className="font-heading font-black text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight leading-tight">
        Every tool you need to work with PDFs in one place
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        100% Free, Private &amp; In-Browser. Merge, split, compress, edit scanned PDFs with OCR, convert, sign, and protect documents with <strong>zero server uploads</strong>.
      </p>

      {/* Value Badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4" /> 100% Client-Side Privacy
        </span>
        <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
          <Zap className="w-4 h-4" /> Instant In-Memory Speed
        </span>
        <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited Free Usage
        </span>
      </div>
    </section>
  );
};
