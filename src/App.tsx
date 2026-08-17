import React, { useState, useEffect } from 'react';
import { TOOLS, getToolBySlug } from './data/toolsData';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { ToolGrid } from './components/home/ToolGrid';
import { ToolWorkspace } from './components/tools/ToolWorkspace';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { SitemapPage } from './pages/SitemapPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname.replace(/^\//, '') || '';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('avatarpdf_theme') || localStorage.getItem('docuvortix_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('avatarpdf_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('avatarpdf_theme', 'light');
    }
  }, [isDarkMode]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname.replace(/^\//, '') || '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Known top-level pages
  const isKnownInfoPage = ['about', 'privacy', 'terms', 'faq', 'contact', 'sitemap'].includes(currentPath);
  const isHomePage = currentPath === '' || currentPath === '/';
  const activeTool = getToolBySlug(currentPath);
  const is404 = !isHomePage && !activeTool && !isKnownInfoPage;

  // Update dynamic SEO title and meta description
  useEffect(() => {
    if (activeTool) {
      document.title = activeTool.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', activeTool.metaDesc);
    } else if (currentPath === 'about') {
      document.title = 'About Avatar PDF — 100% In-Browser PDF Intelligence';
    } else if (currentPath === 'privacy') {
      document.title = 'Privacy Policy — Zero Server Retention Guarantee | Avatar PDF';
    } else if (currentPath === 'terms') {
      document.title = 'Terms of Service | Avatar PDF';
    } else if (currentPath === 'faq') {
      document.title = 'PDF Help & FAQ Knowledge Hub | Avatar PDF';
    } else if (currentPath === 'contact') {
      document.title = 'Contact Support & Feedback | Avatar PDF';
    } else if (currentPath === 'sitemap') {
      document.title = 'Complete HTML Sitemap of 40+ PDF Tools | Avatar PDF';
    } else if (isHomePage) {
      document.title = 'Avatar PDF — Universal Client-Side PDF Intelligence Suite';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', '100% Free & Private Online PDF Tools. Compress, Merge, Split, Convert (Word, Excel, PPT, Image, HTML), Edit Scanned PDFs with OCR, Sign, and Protect directly in your browser.');
    } else {
      document.title = '404 Page Not Found — Avatar PDF';
    }
  }, [currentPath, activeTool, isHomePage, is404]);

  const handleNavigate = (slug: string) => {
    const cleanSlug = slug.replace(/^\//, '').trim();
    setCurrentPath(cleanSlug);
    window.history.pushState({}, '', '/' + cleanSlug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        currentSlug={currentPath}
        onNavigate={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTool ? (
          /* Direct Tool Workspace */
          <ToolWorkspace tool={activeTool} onNavigate={handleNavigate} />
        ) : currentPath === 'about' ? (
          <AboutPage onNavigate={handleNavigate} />
        ) : currentPath === 'privacy' ? (
          <PrivacyPage />
        ) : currentPath === 'terms' ? (
          <TermsPage />
        ) : currentPath === 'faq' ? (
          <FaqPage onNavigate={handleNavigate} />
        ) : currentPath === 'contact' ? (
          <ContactPage />
        ) : currentPath === 'sitemap' ? (
          <SitemapPage onNavigate={handleNavigate} />
        ) : isHomePage ? (
          /* Landing Home Page */
          <>
            <HeroSection
              onNavigate={handleNavigate}
              onSearch={setSearchQuery}
            />
            <ToolGrid
              onSelectTool={handleNavigate}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery('')}
            />
          </>
        ) : (
          /* 404 Not Found Page */
          <NotFoundPage currentPath={currentPath} onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;

