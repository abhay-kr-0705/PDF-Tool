import React, { useState } from 'react';
import { TOOLS, CATEGORIES } from '../../data/toolsData';
import { ToolDefinition, ToolCategory } from '../../types';
import { ToolCard } from './ToolCard';
import { IconRenderer } from '../common/IconRenderer';
import { Search, X } from 'lucide-react';

interface ToolGridProps {
  onSelectTool: (slug: string) => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  onSelectTool,
  searchQuery,
  onClearSearch
}) => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');

  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = !searchQuery.trim() || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      
      {/* Category Pills Header */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as ToolCategory)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm' 
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          );
        })}
      </div>

      {/* Search status header (if query exists) */}
      {searchQuery && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-slate-900 border border-indigo-200 dark:border-slate-800 text-xs sm:text-sm">
          <span className="text-slate-700 dark:text-slate-300">
            Results for &ldquo;<strong>{searchQuery}</strong>&rdquo; ({filteredTools.length} tools)
          </span>
          <button 
            onClick={onClearSearch}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Clear <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Grid of Clean Tool Cards */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onClick={() => onSelectTool(tool.slug)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No matching tools found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try searching for &ldquo;word&rdquo;, &ldquo;compress&rdquo;, &ldquo;merge&rdquo;, &ldquo;sign&rdquo;, or &ldquo;watermark&rdquo;.
          </p>
          <button
            onClick={() => {
              onClearSearch();
              setActiveCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow hover:bg-indigo-700 transition-colors"
          >
            View All 40+ Tools
          </button>
        </div>
      )}
    </section>
  );
};
