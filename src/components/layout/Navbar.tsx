import React, { useState, useEffect, useRef } from 'react';
import { TOOLS } from '../../data/toolsData';
import { IconRenderer } from '../common/IconRenderer';
import { BrandLogo } from '../common/BrandLogo';
import { 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronDown, 
  Sparkles, 
  Layers, 
  Edit3, 
  ArrowRightCircle, 
  ArrowLeftCircle,
  ArrowRight
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
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

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchResults = normalizedQuery
    ? TOOLS.filter(tool => 
        tool.name.toLowerCase().includes(normalizedQuery) ||
        tool.slug.toLowerCase().includes(normalizedQuery) ||
        tool.shortDesc.toLowerCase().includes(normalizedQuery) ||
        (tool.keywords && tool.keywords.some(k => k.toLowerCase().includes(normalizedQuery)))
      ).slice(0, 10)
    : [];

  const convertToTools = TOOLS.filter(t => t.category === 'convert-to').slice(0, 8);
  const convertFromTools = TOOLS.filter(t => t.category === 'convert-from').slice(0, 8);
  const organizeTools = TOOLS.filter(t => t.category === 'organize' || t.category === 'optimize').slice(0, 8);
  const editSecurityTools = TOOLS.filter(t => t.category === 'edit-scan' || t.category === 'security' || t.category === 'advanced').slice(0, 8);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleSelectTool = (slug: string) => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setSearchQuery('');
    onNavigate(slug);
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleSelectTool('/')}
            className="flex items-center gap-2.5 shrink-0 text-left focus:outline-none group"
            aria-label="Avatar PDF Home"
          >
            <BrandLogo size="md" />
          </button>

          {/* Desktop Navigation Menus */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleSelectTool('merge-pdf')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentSlug === 'merge-pdf' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Merge PDF
            </button>

            <button
              onClick={() => handleSelectTool('split-pdf')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentSlug === 'split-pdf' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Split PDF
            </button>

            <button
              onClick={() => handleSelectTool('compress-pdf')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentSlug === 'compress-pdf' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Compress PDF
            </button>

            {/* Convert PDF Mega Dropdown */}
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
                          onClick={() => handleSelectTool(t.slug)}
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
                          onClick={() => handleSelectTool(t.slug)}
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

            {/* All PDF Tools Mega Menu */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('all')}
                className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors ${
                  activeDropdown === 'all' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' : 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>All PDF Tools (41+)</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'all' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'all' && (
                <div className="absolute top-full -left-48 mt-2 w-[780px] p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-6 z-50 animate-in fade-in">
                  
                  {/* Col 1 */}
                  <div className="space-y-2.5">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Organize &amp; Optimize
                    </div>
                    <div className="space-y-1">
                      {organizeTools.map(t => (
                        <button
                          key={t.id}
                          onClick={() => handleSelectTool(t.slug)}
                          className="w-full px-2 py-1.5 rounded-lg text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors flex items-center gap-2"
                        >
                          <span className={t.color}><IconRenderer name={t.icon} className="w-3.5 h-3.5" /></span>
                          <span>{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Col 2 */}
                  <div className="space-y-2.5">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5" /> Edit, OCR &amp; Security
                    </div>
                    <div className="space-y-1">
                      {editSecurityTools.map(t => (
                        <button
                          key={t.id}
                          onClick={() => handleSelectTool(t.slug)}
                          className="w-full px-2 py-1.5 rounded-lg text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors flex items-center gap-2"
                        >
                          <span className={t.color}><IconRenderer name={t.icon} className="w-3.5 h-3.5" /></span>
                          <span>{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Col 3 */}
                  <div className="space-y-2.5">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Most Popular
                    </div>
                    <div className="space-y-1">
                      {TOOLS.slice(0, 8).map(t => (
                        <button
                          key={t.id}
                          onClick={() => handleSelectTool(t.slug)}
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

          {/* Desktop Search Bar */}
          <div ref={searchRef} className="relative hidden md:block max-w-xs w-full">
            <form role="search" onSubmit={(e) => e.preventDefault()} autoComplete="off" className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="search"
                name="search_nav_desktop"
                id="nav-search-desktop"
                placeholder="Find a tool (e.g. watermark, compress)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                inputMode="search"
                data-lpignore="true"
                data-form-type="other"
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 text-slate-900 dark:text-white"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </form>

            {/* Desktop Autocomplete Results */}
            {isSearchOpen && normalizedQuery && (
              <div className="absolute top-full left-0 right-0 mt-1.5 p-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 max-h-80 overflow-y-auto space-y-1">
                {searchResults.length > 0 ? (
                  searchResults.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleSelectTool(tool.slug)}
                      className="w-full p-2 rounded-lg text-left flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className={tool.color}><IconRenderer name={tool.icon} className="w-4 h-4" /></span>
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600">{tool.name}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{tool.shortDesc}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-slate-500">
                    No tool found matching &ldquo;{searchQuery}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side</span>
            </div>

            <button
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation & Full Search Drawer */}
        {isMobileMenuOpen && (
          <div ref={mobileSearchRef} className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in">
            
            {/* Mobile Search Input */}
            <form role="search" onSubmit={(e) => e.preventDefault()} autoComplete="off" className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="search"
                name="search_nav_mobile"
                id="nav-search-mobile"
                placeholder="Search any tool (e.g. watermark, compress, merge)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                inputMode="search"
                data-lpignore="true"
                data-form-type="other"
                className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Mobile Live Search Results */}
            {normalizedQuery ? (
              <div className="space-y-1.5 max-h-72 overflow-y-auto p-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Matching Tools ({searchResults.length})
                </div>
                {searchResults.length > 0 ? (
                  searchResults.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTool(t.slug)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-left flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-700"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={t.color}><IconRenderer name={t.icon} className="w-4 h-4" /></span>
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white">{t.name}</div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">{t.shortDesc}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    No tool found matching &ldquo;{searchQuery}&rdquo;.
                  </div>
                )}
              </div>
            ) : (
              /* Quick Category Grid for Mobile */
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Popular Quick Tools
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button onClick={() => handleSelectTool('merge-pdf')} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-left flex items-center gap-1.5">
                    📑 Merge PDF
                  </button>
                  <button onClick={() => handleSelectTool('compress-pdf')} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-left flex items-center gap-1.5">
                    ⚡ Compress PDF
                  </button>
                  <button onClick={() => handleSelectTool('watermark-pdf')} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-left flex items-center gap-1.5">
                    🛡️ Watermark PDF
                  </button>
                  <button onClick={() => handleSelectTool('remove-watermark-pdf')} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-left flex items-center gap-1.5">
                    🧹 Remove Watermark
                  </button>
                  <button onClick={() => handleSelectTool('n-up-pdf')} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-left flex items-center gap-1.5">
                    📄 Pages on 1 Page
                  </button>
                  <button onClick={() => handleSelectTool('edit-scanned-pdf')} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-left flex items-center gap-1.5">
                    🔍 Scanned OCR
                  </button>
                  <button onClick={() => handleSelectTool('word-to-pdf')} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-left flex items-center gap-1.5">
                    📝 Word to PDF
                  </button>
                  <button onClick={() => handleSelectTool('sign-pdf')} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-left flex items-center gap-1.5">
                    ✍️ Sign PDF
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs text-slate-500 font-medium">
              <button onClick={() => handleSelectTool('/')}>All 41+ Tools</button>
              <button onClick={() => handleSelectTool('about')}>About</button>
              <button onClick={() => handleSelectTool('privacy')}>Privacy</button>
              <button onClick={() => handleSelectTool('faq')}>FAQ</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
