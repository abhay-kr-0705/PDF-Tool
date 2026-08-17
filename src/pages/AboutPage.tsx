import React from 'react';
import { Sparkles, ShieldCheck, Cpu, Zap, Lock, Globe, Users, Heart } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (slug: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12 animate-in fade-in">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" /> About Avatar PDF Studio
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white">
          Revolutionizing PDF Intelligence with <br />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
            100% Client-Side Privacy
          </span>
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Avatar PDF was built on a simple yet uncompromising principle: you should never have to upload confidential personal, financial, or legal documents to third-party servers just to compress, edit, or convert a PDF.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Zero Server Retention</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All document operations run in your browser via WebAssembly. Your files are never stored, transmitted, or logged.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Next-Gen WebAssembly</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Harnesses your local multi-core CPU for blazing-fast compression, OCR, and high-fidelity rendering.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">40+ Comprehensive Tools</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            From scanned document OCR to Word, Excel, PowerPoint, and Image conversions, everything you need is here.
          </p>
        </div>
      </div>

      {/* Philosophy Details */}
      <div className="glass-card rounded-2xl p-8 sm:p-10 space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        <h2 className="font-heading font-bold text-2xl text-slate-900 dark:text-white">
          Our Architecture &amp; Privacy Commitment
        </h2>
        <p>
          Traditional online PDF tools require you to upload megabytes of sensitive documents across the public internet to backend server clusters. This introduces serious privacy vulnerabilities, data breach risks, compliance issues (GDPR/HIPAA), and slow queue times.
        </p>
        <p>
          Avatar PDF eliminates backend document servers entirely. By leveraging modern browser capabilities including HTML5 Canvas, WebAssembly, Web Workers, PDF.js, and Tesseract OCR, all computations occur securely in your computer or phone memory. When you close the browser tab, your document data ceases to exist.
        </p>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('/')}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-colors"
        >
          Explore All 40+ Tools
        </button>
      </div>
    </div>
  );
};
