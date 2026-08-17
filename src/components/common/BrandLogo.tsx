import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', box: 'w-8 h-8 rounded-lg', text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', box: 'w-10 h-10 rounded-xl', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', box: 'w-12 h-12 rounded-2xl', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', box: 'w-16 h-16 rounded-3xl', text: 'text-3xl', sub: 'text-sm' },
  };

  const dim = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Sleek Minimalist Avatar PDF Vector Icon */}
      <div className={`relative ${dim.box} bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-1 flex items-center justify-center border border-indigo-500/30 shadow-md shadow-indigo-500/20 group-hover:border-indigo-500/60 group-hover:shadow-indigo-500/40 transition-all overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-cyan-500/20 to-transparent opacity-60 pointer-events-none" />
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full text-white relative z-10 drop-shadow-[0_2px_8px_rgba(99,102,241,0.5)]" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="brandLogoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="brandFoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>

          {/* Document outline with folded corner */}
          <path 
            d="M 22 18 L 62 18 L 80 36 L 80 80 A 4 4 0 0 1 76 84 L 24 84 A 4 4 0 0 1 20 80 L 20 22 A 4 4 0 0 1 24 18 Z" 
            stroke="url(#brandLogoGrad)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
          />

          {/* Dog-ear fold */}
          <path 
            d="M 62 18 L 62 36 L 80 36" 
            stroke="url(#brandFoldGrad)" 
            strokeWidth="4.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="#06b6d4"
            fillOpacity="0.2"
          />

          {/* Minimalist Avatar silhouette head */}
          <circle 
            cx="48" 
            cy="46" 
            r="10" 
            stroke="url(#brandLogoGrad)" 
            strokeWidth="4.5" 
            strokeLinecap="round"
            fill="none"
          />

          {/* Avatar shoulders / torso */}
          <path 
            d="M 32 74 C 32 61, 40 58, 48 58 C 56 58, 64 61, 64 74" 
            stroke="url(#brandLogoGrad)" 
            strokeWidth="4.5" 
            strokeLinecap="round"
            fill="none"
          />

          {/* Clean tech accent line */}
          <line 
            x1="54" 
            y1="67" 
            x2="76" 
            y2="78" 
            stroke="url(#brandFoldGrad)" 
            strokeWidth="3.5" 
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-heading font-black ${dim.text} tracking-tight text-slate-900 dark:text-white leading-none`}>
            Avatar <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">PDF</span>
          </span>
          <span className={`${dim.sub} uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mt-1`}>
            avatarpdf.com
          </span>
        </div>
      )}
    </div>
  );
};
