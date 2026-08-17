import React from 'react';
import { FileCheck, Shield, AlertCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 animate-in fade-in">
      <div className="text-center space-y-3">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8 sm:p-10 space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed border border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">1. Agreement to Terms</h2>
          <p>
            By accessing and using Avatar PDF (avatarpdf.com), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please discontinue using the service.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">2. Permitted Use</h2>
          <p>
            Avatar PDF is provided for lawful personal, educational, and commercial document manipulation purposes. You retain 100% intellectual property ownership of all files processed through our platform.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">3. Disclaimer of Warranties</h2>
          <p>
            Avatar PDF is provided &ldquo;as is&rdquo; without warranties of any kind. While we rigorously test document fidelity across thousands of PDF varieties, you are advised to inspect generated files for accuracy.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">4. Governing Law</h2>
          <p>
            These terms are governed by standard international software conventions.
          </p>
        </div>
      </div>
    </div>
  );
};
