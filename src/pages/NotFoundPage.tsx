import React, { useState } from 'react';
import { TOOLS } from '../data/toolsData';
import { IconRenderer } from '../components/common/IconRenderer';
import { 
  FileQuestion, 
  Home, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

interface NotFoundPageProps {
  currentPath: string;
  onNavigate: (slug: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ currentPath, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const popularTools = TOOLS.filter(t => 
    ['merge-pdf', 'compress-pdf', 'pdf-to-word', 'word-to-pdf', 'sign-pdf', 'edit-scanned-pdf'].includes(t.id)
  );

  const searchResults = searchQuery.trim()
    ? TOOLS.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12 text-center animate-in fade-in">
      
      {/* 404 Hero Visual */}
      <div className="space-y-5">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[22px] flex items-center justify-center">
              <FileQuestion className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-rose-500 text-white font-extrabold text-[11px] shadow-md tracking-wider">
            ERROR 404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight">
            Page or PDF Tool Not Found
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The page <code className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs">/{currentPath}</code> does not exist or may have been renamed.
          </p>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('/')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/25 flex items-center gap-2 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </button>
          
          <button
            onClick={() => onNavigate('sitemap')}
            className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-sm shadow-sm flex items-center gap-2 transition-all"
          >
            <Compass className="w-4 h-4 text-indigo-500" />
            <span>Browse HTML Sitemap</span>
          </button>
        </div>
      </div>

      {/* Quick Search */}
      <div className="max-w-md mx-auto space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search all 40+ PDF tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>

        {/* Live matching results if searching */}
        {searchQuery && (
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 space-y-1 shadow-lg text-left">
            {searchResults.length > 0 ? (
              searchResults.map(t => (
                <button
                  key={t.id}
                  onClick={() => onNavigate(t.slug)}
                  className="w-full p-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 group"
                >
                  <div className="flex items-center gap-2">
                    <span className={t.color}><IconRenderer name={t.icon} className="w-4 h-4" /></span>
                    <span>{t.name}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-slate-500">
                No tool found for &ldquo;{searchQuery}&rdquo;.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popular Tools Grid */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Popular Tools You Might Need</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-left">
          {popularTools.map(t => (
            <button
              key={t.id}
              onClick={() => onNavigate(t.slug)}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className={`w-8 h-8 rounded-lg ${t.color} bg-slate-50 dark:bg-slate-800 flex items-center justify-center`}>
                  <IconRenderer name={t.icon} className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {t.name}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {t.shortDesc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
