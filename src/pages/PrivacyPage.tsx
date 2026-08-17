import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, FileText } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10 animate-in fade-in">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" /> 100% In-Browser Zero Knowledge
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8 sm:p-10 space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed border border-slate-200 dark:border-slate-800">
        <div className="space-y-3">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-500" />
            1. Zero Document Collection &amp; Server Transmission
          </h2>
          <p>
            DocuVortix operates entirely on client-side technology (WebAssembly and Web Workers). When you upload, merge, split, compress, convert, sign, or edit a document on this website:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li><strong>Your documents never leave your device:</strong> No file contents, text, images, or metadata are ever transmitted over the network to any server.</li>
            <li><strong>Zero Server Storage:</strong> We do not operate document storage databases. Your files reside temporarily in your local browser memory and are deleted the instant you reload or close the tab.</li>
            <li><strong>No Tracking of Document Data:</strong> We cannot see, read, index, or access any files you manipulate.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">
            2. GDPR, CCPA &amp; HIPAA Compliance
          </h2>
          <p>
            Because personal data never enters our custody or servers, DocuVortix inherently meets the highest standards of data privacy compliance. Healthcare providers, law firms, and financial organizations can safely use DocuVortix without breaching confidentiality regulations.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">
            3. Local Storage &amp; Cookies
          </h2>
          <p>
            We use browser `localStorage` solely to remember your UI preference (such as Dark/Light mode theme). We do not use third-party tracking cookies or personal profiling cookies.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">
            4. Contact Our Data Protection Team
          </h2>
          <p>
            If you have questions about our zero-retention architecture, contact us at <code>privacy@docuvortix.app</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
