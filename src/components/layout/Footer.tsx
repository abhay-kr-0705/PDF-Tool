import React from 'react';
import { TOOLS, CATEGORIES } from '../../data/toolsData';
import { ShieldCheck, Sparkles, Heart, Globe, Lock, Cpu, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const convertToTools = TOOLS.filter(t => t.category === 'convert-to').slice(0, 6);
  const convertFromTools = TOOLS.filter(t => t.category === 'convert-from').slice(0, 6);
  const organizeTools = TOOLS.filter(t => t.category === 'organize' || t.category === 'optimize').slice(0, 6);
  const editSecurityTools = TOOLS.filter(t => t.category === 'edit-scan' || t.category === 'security').slice(0, 6);

  return (
    <footer className="mt-24 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
      {/* Top Value Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-xl glass-card">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">100% In-Browser Privacy</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">No server uploads. Files never leave your browser.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl glass-card">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">WebAssembly Powered</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Lightning-fast native client-side performance.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl glass-card">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">40+ Comprehensive Tools</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">All PDF conversions, edits, OCR & optimization.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Bio */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-extrabold text-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                DocuVortix
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              The universal client-side PDF intelligence suite. Empowering millions with private, instant, and high-fidelity document manipulation directly in the browser.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <Globe className="w-3.5 h-3.5 text-indigo-500" /> English (Global)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                ✓ System Operational
              </span>
            </div>
          </div>

          {/* Col 2: Convert To PDF */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Convert To PDF
            </h4>
            <ul className="space-y-2 text-xs">
              {convertToTools.map(t => (
                <li key={t.id}>
                  <button 
                    onClick={() => onNavigate(t.slug)}
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Convert From PDF */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Convert From PDF
            </h4>
            <ul className="space-y-2 text-xs">
              {convertFromTools.map(t => (
                <li key={t.id}>
                  <button 
                    onClick={() => onNavigate(t.slug)}
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Edit, OCR & Security */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Edit, OCR & Security
            </h4>
            <ul className="space-y-2 text-xs">
              {editSecurityTools.map(t => (
                <li key={t.id}>
                  <button 
                    onClick={() => onNavigate(t.slug)}
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    {t.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Informational Pages Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-600 dark:text-slate-400 font-medium">
            <button onClick={() => onNavigate('/about')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              About Us
            </button>
            <button onClick={() => onNavigate('/privacy')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('/terms')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Terms of Service
            </button>
            <button onClick={() => onNavigate('/faq')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              FAQ
            </button>
            <button onClick={() => onNavigate('/contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Contact
            </button>
            <button onClick={() => onNavigate('/sitemap')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              HTML Sitemap
            </button>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-0.5">
              XML Sitemap <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          <div className="text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} DocuVortix Studio. 100% Client-Side Privacy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
