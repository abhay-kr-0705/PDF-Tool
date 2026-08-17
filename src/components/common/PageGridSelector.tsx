import React from 'react';
import { PdfPagePreview } from '../../types';
import { RotateCw, Trash2, CheckCircle2, Circle, Copy } from 'lucide-react';

interface PageGridSelectorProps {
  pages: PdfPagePreview[];
  onPageToggle?: (pageNumber: number) => void;
  onPageRotate?: (pageNumber: number) => void;
  onPageDelete?: (pageNumber: number) => void;
  onPageDuplicate?: (pageNumber: number) => void;
  onReorder?: (newOrder: number[]) => void;
  selectable?: boolean;
  actionType?: 'select' | 'organize';
}

export const PageGridSelector: React.FC<PageGridSelectorProps> = ({
  pages,
  onPageToggle,
  onPageRotate,
  onPageDelete,
  onPageDuplicate,
  selectable = true,
  actionType = 'organize'
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {pages.map((page, idx) => (
        <div
          key={page.pageNumber}
          className={`relative group rounded-xl glass-card overflow-hidden border-2 transition-all ${
            page.selected 
              ? 'border-indigo-500 shadow-md shadow-indigo-500/10' 
              : 'border-slate-200/80 dark:border-slate-800 opacity-60'
          }`}
        >
          {/* Thumbnail Container */}
          <div 
            onClick={() => onPageToggle && onPageToggle(page.pageNumber)}
            className="aspect-[1/1.4] bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-2 cursor-pointer relative overflow-hidden"
          >
            <img
              src={page.thumbnailUrl}
              alt={`Page ${page.pageNumber}`}
              className="max-h-full max-w-full object-contain rounded shadow-sm transition-transform duration-200"
              style={{ transform: `rotate(${page.rotation}deg)` }}
            />

            {/* Selection Badge (Top Right) */}
            {selectable && (
              <div className="absolute top-2 right-2 p-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                {page.selected ? (
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400" />
                )}
              </div>
            )}
          </div>

          {/* Bottom Card Controls */}
          <div className="p-2.5 bg-white/90 dark:bg-slate-900/90 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Page {page.pageNumber}
            </span>

            <div className="flex items-center gap-1">
              {onPageRotate && (
                <button
                  onClick={() => onPageRotate(page.pageNumber)}
                  title="Rotate 90°"
                  className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              )}

              {onPageDuplicate && (
                <button
                  onClick={() => onPageDuplicate(page.pageNumber)}
                  title="Duplicate Page"
                  className="p-1 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              )}

              {onPageDelete && (
                <button
                  onClick={() => onPageDelete(page.pageNumber)}
                  title="Delete Page"
                  className="p-1 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
