import React from 'react';
import { TOOLS, CATEGORIES } from '../data/toolsData';
import { IconRenderer } from '../components/common/IconRenderer';
import { Map, ArrowRight, ArrowUpRight } from 'lucide-react';

interface SitemapPageProps {
  onNavigate: (slug: string) => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12 animate-in fade-in">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          <Map className="w-4 h-4" /> HTML Site Directory
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
          Avatar PDF Sitemap &amp; Tool Index
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Complete indexed listing of all 40+ specialized PDF intelligence tools and legal documentation.
        </p>
      </div>

      {/* Info Pages Category */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <span>General &amp; Legal Pages</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          <button onClick={() => onNavigate('/')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:text-indigo-600 font-semibold text-left">🏠 Home Page</button>
          <button onClick={() => onNavigate('/about')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:text-indigo-600 font-semibold text-left">ℹ️ About Us</button>
          <button onClick={() => onNavigate('/privacy')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:text-indigo-600 font-semibold text-left">🛡️ Privacy Policy</button>
          <button onClick={() => onNavigate('/terms')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:text-indigo-600 font-semibold text-left">📜 Terms of Service</button>
          <button onClick={() => onNavigate('/faq')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:text-indigo-600 font-semibold text-left">❓ FAQ Hub</button>
          <button onClick={() => onNavigate('/contact')} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:text-indigo-600 font-semibold text-left">✉️ Contact Us</button>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:text-indigo-600 font-semibold text-left flex items-center justify-between">
            <span>🗺️ XML Sitemap</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Group tools by category */}
      {CATEGORIES.filter(c => c.id !== 'all').map((category) => {
        const catTools = TOOLS.filter(t => t.category === category.id);
        return (
          <div key={category.id} className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <IconRenderer name={category.icon} className="w-5 h-5 text-indigo-500" />
              <span>{category.name} ({catTools.length})</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {catTools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => onNavigate(tool.slug)}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-indigo-50 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800/60 text-left group transition-all"
                >
                  <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 flex items-center justify-between">
                    <span>{tool.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                    {tool.shortDesc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
