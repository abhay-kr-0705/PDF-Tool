import React, { useState, useEffect, useRef } from 'react';
import { TOOLS } from '../../data/toolsData';
import { IconRenderer } from '../common/IconRenderer';
import { ShieldCheck, Zap, Lock, Sparkles, CheckCircle2, Search, X, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (slug: string) => void;
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onSearch, initialQuery = '' }) => {
  const [localQuery, setLocalQuery] = useState(initialQuery);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalQuery(initialQuery);
  }, [initialQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalized = localQuery.trim().toLowerCase();

  const matchingTools = normalized
    ? TOOLS.filter(tool => 
        tool.name.toLowerCase().includes(normalized) ||
        tool.slug.toLowerCase().includes(normalized) ||
        tool.shortDesc.toLowerCase().includes(normalized) ||
        (tool.keywords && tool.keywords.some(k => k.toLowerCase().includes(normalized) || normalized.includes(k.toLowerCase())))
      ).slice(0, 6)
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQuery(val);
    onSearch(val);
    setIsDropdownOpen(true);
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearch('');
    setIsDropdownOpen(false);
  };

  const handleQuickSearch = (term: string) => {
    setLocalQuery(term);
    onSearch(term);
    setIsDropdownOpen(true);
  };

  const handleSelectTool = (slug: string) => {
    setIsDropdownOpen(false);
    onNavigate(slug);
  };

  return (
    <section className="pt-10 pb-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-5">
      
      {/* Search-Optimized Catchy H1 Heading */}
      <h1 className="font-heading font-black text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight leading-tight">
        Every PDF tool you need in one private place
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        100% Free, Private &amp; In-Browser. Merge, split, compress, convert Office to PDF, JPG to PDF, OCR scanned documents, and sign with <strong>zero server uploads</strong>.
      </p>

      {/* Prominent Fast Search Bar in Hero */}
      <div ref={searchContainerRef} className="max-w-xl mx-auto pt-1 space-y-2.5 relative z-30">
        <div className="relative shadow-md rounded-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500" />
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search any tool (e.g. merge, compress 100kb, photo se pdf, ocr, word)..."
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

          {/* Instant Floating Live Search Dropdown (Solves Mobile Scrolling Issue) */}
          {isDropdownOpen && normalized && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2.5 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-left z-50 animate-in fade-in max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                <span>Matching Tools ({matchingTools.length})</span>
                <span className="text-[10px] lowercase text-slate-400 font-normal">Tap to open</span>
              </div>

              {matchingTools.length > 0 ? (
                <div className="space-y-1">
                  {matchingTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleSelectTool(tool.slug)}
                      className="w-full p-2.5 rounded-xl text-left flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tool.color} bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform shrink-0`}>
                          <IconRenderer name={tool.icon} className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-1.5">
                            <span>{tool.name}</span>
                            {tool.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {tool.shortDesc}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  No tool found matching &ldquo;{localQuery}&rdquo;. Try &ldquo;merge&rdquo;, &ldquo;compress&rdquo;, or &ldquo;word&rdquo;.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Search Tag Pills */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap text-xs">
          <span className="text-slate-400 font-medium mr-1">Trending:</span>
          <button 
            type="button"
            onClick={() => handleQuickSearch('merge')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            📑 Merge PDF
          </button>
          <button 
            type="button"
            onClick={() => handleQuickSearch('compress')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            ⚡ Compress 100kb
          </button>
          <button 
            type="button"
            onClick={() => handleQuickSearch('photo se pdf')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            🖼️ Photo se PDF
          </button>
          <button 
            type="button"
            onClick={() => handleQuickSearch('pdf to word')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            📝 PDF to Word
          </button>
          <button 
            type="button"
            onClick={() => handleQuickSearch('ocr')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            🔍 Scanned OCR
          </button>
          <button 
            type="button"
            onClick={() => handleQuickSearch('sign')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            ✍️ Sign PDF
          </button>
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
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited Free Usage (No Limits)
        </span>
      </div>
    </section>
  );
};
