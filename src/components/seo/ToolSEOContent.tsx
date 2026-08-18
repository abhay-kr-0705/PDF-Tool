import React, { useState } from 'react';
import { ToolDefinition } from '../../types';
import { TOOLS } from '../../data/toolsData';
import { IconRenderer } from '../common/IconRenderer';
import { 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Home,
  ChevronRight
} from 'lucide-react';

interface ToolSEOContentProps {
  tool: ToolDefinition;
  onNavigate: (slug: string) => void;
}

export const ToolSEOContent: React.FC<ToolSEOContentProps> = ({ tool, onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const relatedTools = (tool.relatedToolSlugs || [])
    .map(slug => TOOLS.find(t => t.slug === slug))
    .filter(Boolean) as ToolDefinition[];

  return (
    <div className="mt-16 space-y-12 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* 0. Breadcrumb Navigation for UX & SEO */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <button 
          onClick={() => onNavigate('/')}
          className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button 
          onClick={() => onNavigate('/sitemap')}
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          PDF Tools
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-900 dark:text-white">{tool.name}</span>
      </nav>

      {/* 1. Step-by-Step How-To Section */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            How to use {tool.name} online for free
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Follow these 3 simple steps to process your document in seconds with 100% privacy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {tool.howToSteps.map((step) => (
            <div 
              key={step.step} 
              className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2.5 text-left"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                {step.step}
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Key Features & Privacy Guarantee */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Key Features of {tool.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {tool.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{feature.title}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client-Side Privacy Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-emerald-500/30 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              100% In-Browser Privacy
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Unlike cloud services that upload your confidential files to remote servers, Avatar PDF processes everything locally in your browser memory via WebAssembly.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Zero File Retention Guarantee
          </div>
        </div>
      </section>

      {/* 3. Why Avatar PDF vs iLovePDF & Cloud Tools (Competitive Matrix) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Why Choose Avatar PDF over Other PDF Tools?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            See how Avatar PDF delivers superior privacy, unlimited free usage, and instant performance compared to traditional cloud tools like iLovePDF and SmallPDF.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                <th className="py-3 px-4">Feature / Benefit</th>
                <th className="py-3 px-4 text-indigo-600 dark:text-indigo-400 font-extrabold">Avatar PDF (This Tool)</th>
                <th className="py-3 px-4 text-slate-500">Other Cloud Tools (iLovePDF, etc.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3 px-4 font-semibold">Document Privacy</td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> 100% In-Browser (Zero Uploads)
                </td>
                <td className="py-3 px-4 text-slate-500 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-amber-500" /> Uploaded to remote cloud servers
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Usage Limits &amp; Caps</td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> 100% Free &amp; Unlimited
                </td>
                <td className="py-3 px-4 text-slate-500 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-amber-500" /> 2 tasks/hour or paywall
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">File Size Limits</td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> No File Size Caps
                </td>
                <td className="py-3 px-4 text-slate-500 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-amber-500" /> Capped at 15MB - 25MB on free tier
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Processing Speed</td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Instant Native WebAssembly
                </td>
                <td className="py-3 px-4 text-slate-500 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-amber-500" /> Server queue &amp; upload delays
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Scanned OCR Editing</td>
                <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Full Client-Side OCR Included
                </td>
                <td className="py-3 px-4 text-slate-500 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-amber-500" /> Paid Premium feature only
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Comprehensive FAQ Section (Google PAA Snippet Target) */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Everything you need to know about {tool.name}
          </p>
        </div>

        <div className="space-y-2.5">
          {tool.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 py-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Related Tools Grid */}
      {relatedTools.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Related PDF Tools
            </h3>
            <button 
              onClick={() => onNavigate('/')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              All 41+ Tools <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {relatedTools.map((relTool) => (
              <button
                key={relTool.id}
                onClick={() => onNavigate(relTool.slug)}
                className="text-left p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/80 transition-all flex flex-col justify-between group shadow-sm"
              >
                <div className="space-y-2">
                  <div className={`p-2 rounded-lg w-fit ${relTool.color} bg-slate-50 dark:bg-slate-800`}>
                    <IconRenderer name={relTool.icon} className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {relTool.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {relTool.shortDesc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
