import React, { useState } from 'react';
import { ShieldCheck, Zap, Lock, Sparkles, CheckCircle2, Search, X } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (slug: string) => void;
  onSearch: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onSearch }) => {
  const [localQuery, setLocalQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQuery(val);
    onSearch(val);
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearch('');
  };

  return (
    <section className="pt-10 pb-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-5">
      
      {/* Title */}
      <h1 className="font-heading font-black text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight leading-tight">
        Every tool you need to work with PDFs in one place
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        100% Free, Private &amp; In-Browser. Merge, split, compress, edit scanned PDFs with OCR, convert, sign, and protect documents with <strong>zero server uploads</strong>.
      </p>

      {/* Prominent Fast Search Bar in Hero */}
      <div className="max-w-xl mx-auto pt-1">
        <div className="relative shadow-md rounded-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            placeholder="Search any tool (e.g. watermark, multiple pages on A4, merge, compress, ocr)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 shadow-sm transition-all"
          />
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

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
