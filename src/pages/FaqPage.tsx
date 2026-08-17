import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, Sparkles } from 'lucide-react';

interface FaqPageProps {
  onNavigate: (slug: string) => void;
}

const GLOBAL_FAQS = [
  {
    q: 'How can I compress a PDF without decreasing quality?',
    a: 'Use our Lossless Compression mode in the Compress PDF tool. Lossless compression removes duplicate structural objects, defragments font tables, and compacts stream dictionaries without altering visual raster resolution.'
  },
  {
    q: 'How do I edit text on a scanned PDF document?',
    a: 'Upload your scan into our Edit Scanned PDF (OCR) tool. DocuVortix runs Tesseract OCR directly inside your browser to recognize characters, generate a searchable text layer, and let you fix typos or copy raw text directly.'
  },
  {
    q: 'Are my confidential files uploaded to any servers?',
    a: 'Never! DocuVortix operates 100% in your browser using client-side WebAssembly and JavaScript engines. No files or personal data are ever transmitted to any remote servers.'
  },
  {
    q: 'Can I convert Word DOCX, Excel XLSX, and PowerPoint PPTX to PDF for free?',
    a: 'Yes! All office document conversions are 100% free with no file size limits and no account required.'
  },
  {
    q: 'How do I combine multiple PDF files into one?',
    a: 'Navigate to the Merge PDF tool, select your PDF documents, drag and drop the cards into your desired sequence, and click Combine PDF.'
  },
  {
    q: 'Can I add a digital signature to PDF contracts?',
    a: 'Yes! Our Sign PDF tool lets you draw your signature with a stylus or mouse, type with elegant cursive fonts, or upload a transparent signature image.'
  },
  {
    q: 'How can I redact sensitive personal info (SSNs, credit cards)?',
    a: 'Open the Edit PDF tool or Redact PDF tool, select the Redact tool, and draw blackout boxes over sensitive areas. This permanently burns vector rectangles into the document stream.'
  },
  {
    q: 'Is there a limit on how many pages or files I can process?',
    a: 'Because all processing happens on your local device, there are no artificial limits. You can process documents as large as your device memory allows.'
  }
];

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [query, setQuery] = useState('');

  const filteredFaqs = GLOBAL_FAQS.filter(f => 
    f.q.toLowerCase().includes(query.toLowerCase()) || 
    f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 animate-in fade-in">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
          <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
          PDF Knowledge &amp; Troubleshooting Hub
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Everything you need to know about in-browser document manipulation, conversions, lossless compression, and privacy.
        </p>
      </div>

      {/* Search FAQ */}
      <div className="relative max-w-lg mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Accordion list */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  {faq.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-indigo-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-6 py-4 bg-white/50 dark:bg-slate-950/40 border-t border-slate-200/60 dark:border-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
