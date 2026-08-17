import React from 'react';
import { ToolDefinition } from '../../types';
import { IconRenderer } from '../common/IconRenderer';

interface ToolCardProps {
  tool: ToolDefinition;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onClick }) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
      className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/80 dark:hover:border-indigo-500/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between text-left cursor-pointer"
    >
      <div className="space-y-4">
        {/* Icon & Badge */}
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.color} bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 group-hover:scale-105 transition-transform`}>
            <IconRenderer name={tool.icon} className="w-6 h-6" />
          </div>

          {tool.badge && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
              tool.badge === 'Popular' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300' :
              tool.badge === 'Lossless' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' :
              tool.badge === 'OCR' ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300' :
              tool.badge === 'Pro' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300' :
              'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300'
            }`}>
              {tool.badge}
            </span>
          )}
        </div>

        {/* Name & Description */}
        <div className="space-y-1.5">
          <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {tool.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {tool.shortDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
