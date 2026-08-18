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
      {/* 3D Isometric Avatar PDF Brand Emblem */}
      <div className={`relative ${dim.box} flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform shrink-0`}>
        <img 
          src="/avatar-logo.png" 
          alt="Avatar PDF Logo" 
          className="w-full h-full object-contain drop-shadow-[0_2px_10px_rgba(6,182,212,0.35)]" 
        />
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
