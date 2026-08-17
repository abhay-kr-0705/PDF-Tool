import React, { useState, useEffect, useRef } from 'react';
import { TOOLS, CATEGORIES } from '../../data/toolsData';
import { ToolDefinition } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronDown, 
  Sparkles, 
  ArrowRight,
  FileText,
  Layers,
  Edit3,
  Lock,
  ArrowRightCircle,
  ArrowLeftCircle
} from 'lucide-react';

interface NavbarProps {
  currentSlug: string;
  onNavigate: (slug: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSlug,
  onNavigate,
  isDarkMode,
  onToggleTheme
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? TOOLS.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 8)
    : [];

  const convertToTools = TOOLS.filter(t => t.category === 'convert-to').slice(0, 8);
  const convertFromTools = TOOLS.filter(t => t.category === 'convert-from').slice(0, 8);
  const organizeTools = TOOLS.filter(t => t.category === 'organize' || t.category === 'optimize').slice(0, 8);
  const editSecurityTools = TOOLS.filter(t => t.category === 'edit-scan' || t.category === 'security' || t.category === 'advanced').slice(0, 8);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <button 
            onClick={() => {
              setActiveDropdown(null);
              onNavigate('/');
            }}
            className="flex items-center gap-2.5 shrink-0 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:bg-indigo-700 transition-colors">
              <span className="font-extrabold text-xl tracking-tighter">DV</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl tracking-tight text-slate-900 dark:text-white">
                Docu<span className="text-indigo-600 dark:text-indigo-400">Vortix</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 -mt-1">
                PDF Tools
              </span>
            </div>
          </button>

          {/* Desktop Navigation Menus (iLovePDF Style) */}
          <nav className="hidden lg:flex items-center gap-1">
            
            {/* Quick Link 1: Merge PDF */}
            <button
              onClick={() => { setActiveDropdown(null); onNavigate('merge-pdf'); }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentSlug === 'merge-pdf' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Merge PDF
            </button>

            {/* Quick Link 2: Split PDF */}
            <button
              onClick={() => { setActiveDropdown(null); onNavigate('split-pdf'); }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentSlug === 'split-pdf' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Split PDF
            </button>

            {/* Quick Link 3: Compress PDF */}
            <button
              onClick={() => { setActiveDropdown(null); onNavigate('compress-pdf'); }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentSlug === 'compress-pdf' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Compress PDF
            </button>

            {/* Dropdown 1: Convert PDF (Mega Dropdown) */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('convert')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors ${
                  activeDropdown === 'convert' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Convert PDF</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'convert' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'convert' && (
                <div className="absolute top-full left-0 mt-2 w-[540px] p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4 z-50 animate-in fade-in">
                  
                  {/* Column 1: Convert TO PDF */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 flex items-center gap-1.5">
                      <ArrowRightCircle className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Convert TO PDF</span>
                    </div>
                    <div className="space-y-1">
                      {convertToTools.map(t => (
                        <button
                          key={t.id}
                          onClick={() => { setActiveDropdown(null); onNavigate(t.slug); }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors flex items-center gap-2"
                        >
                          <span className={t.color}><IconRenderer name={t.icon} className="w-4 h-4" /></span>
                          <span>{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Convert FROM PDF */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 flex items-center gap-1.5">
                      <ArrowLeftCircle className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Convert FROM PDF</span>
                    </div>
                    <div className="space-y-1">
                      {convertFromTools.map(t => (
                        <button
                          key={t.id}
                          onClick={() => { setActiveDropdown(null); onNavigate(t.slug); }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors flex items-center gap-2"
                        >
                          <span className={t.color}><IconRenderer name={t.icon} className="w-4 h-4" /></span>
                          <span>{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown 2: All PDF Tools (Mega Menu) */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('all')}
                className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors ${
                  activeDropdown === 'all' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>All PDF Tools (40+)</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'all' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'all' && (
                <div className="absolute top-full -left-48 mt-2 w-[760px] p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-6 z-50 animate-in fade-in">
                  
                  {/* Col 1: Organize & Optimize */}
                  <div className="space-y-2.5">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Organize &amp; Optimize
                    </div>
                    <div className="space-y-1">
                      {organizeTools.map(t => (
                        <button
                          key={t.id}
                          onClick={() => { setActiveDropdown(null); onNavigate(t.slug); }}
                          className="w-full px-2 py-1.5 rounded-lg text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors flex items-center gap-2"
                        >
                          <span className={t.color}><IconRenderer name={t.icon} className="w-3.5 h-3.5" /></span>
                          <span>{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Col 2: Edit, OCR & Security */}
                  <div className="space-y-2.5">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" /> Edit, OCR &amp; Security
                    </div>
                    <div className="space-y-1">
                      {editSecurityTools.map(t => (
                        <button
                          key={t.id}
                          onClick={() => { setActiveDropdown(null); onNavigate(t.slug); }}
                          className="w-full px-2 py-1.5 rounded-lg text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors flex items-center gap-2"
                        >
                          <span className={t.color}><IconRenderer name={t.icon} className="w-3.5 h-3.5" /></span>
                          <span>{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Col 3: Popular Converts */}
                  <div className="space-y-2.5">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Most Popular
                    </div>
                    <div className="space-y-1">
                      {TOOLS.slice(0, 8).map(t => (
                        <button
                          key={t.id}
                          onClick={() => { setActiveDropdown(null); onNavigate(t.slug); }}
                          className="w-full px-2 py-1.5 rounded-lg text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors flex items-center gap-2"
                        >
                          <span className={t.color}><IconRenderer name={t.icon} className="w-3.5 h-3.5" /></span>
                          <span>{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Search Box - Desktop */}
          <div ref={searchRef} className="relative hidden md:block max-w-xs w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Find a tool..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Live Search Autocomplete */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 p-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 max-h-80 overflow-y-auto space-y-1">
                {searchResults.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onNavigate(tool.slug);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full p-2 rounded-lg text-left flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className={tool.color}><IconRenderer name={tool.icon} className="w-4 h-4" /></span>
                      <span className="font-semibold text-xs text-slate-900 dark:text-white">{tool.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium capitalize">{tool.category.replace('-', ' ')}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Privacy Badge */}
            <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side Privacy</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Mobile Drawer Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search 40+ tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button onClick={() => { onNavigate('merge-pdf'); setIsMobileMenuOpen(false); }} className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-left">📑 Merge PDF</button>
              <button onClick={() => { onNavigate('split-pdf'); setIsMobileMenuOpen(false); }} className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-left">✂️ Split PDF</button>
              <button onClick={() => { onNavigate('compress-pdf'); setIsMobileMenuOpen(false); }} className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-left">⚡ Compress PDF</button>
              <button onClick={() => { onNavigate('word-to-pdf'); setIsMobileMenuOpen(false); }} className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-left">📄 Word to PDF</button>
              <button onClick={() => { onNavigate('pdf-to-word'); setIsMobileMenuOpen(false); }} className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-left">📝 PDF to Word</button>
              <button onClick={() => { onNavigate('edit-scanned-pdf'); setIsMobileMenuOpen(false); }} className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-left">🔍 Scanned OCR</button>
              <button onClick={() => { onNavigate('sign-pdf'); setIsMobileMenuOpen(false); }} className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-left">✍️ Sign PDF</button>
              <button onClick={() => { onNavigate('watermark-pdf'); setIsMobileMenuOpen(false); }} className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-left">🛡️ Watermark</button>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs text-slate-500">
              <button onClick={() => { onNavigate('/'); setIsMobileMenuOpen(false); }}>All 40+ Tools</button>
              <button onClick={() => { onNavigate('/about'); setIsMobileMenuOpen(false); }}>About Us</button>
              <button onClick={() => { onNavigate('/privacy'); setIsMobileMenuOpen(false); }}>Privacy</button>
              <button onClick={() => { onNavigate('/faq'); setIsMobileMenuOpen(false); }}>FAQ</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
