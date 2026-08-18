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

  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('q') || '';
    }
    return '';
  });

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
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get('q') || '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Known top-level pages
  const isKnownInfoPage = ['about', 'privacy', 'terms', 'faq', 'contact', 'sitemap'].includes(currentPath);
  const isHomePage = currentPath === '' || currentPath === '/';
  const activeTool = getToolBySlug(currentPath);
  const is404 = !isHomePage && !activeTool && !isKnownInfoPage;

  // Comprehensive Dynamic SEO & JSON-LD Structured Schema Injection
  useEffect(() => {
    // Helper to safely set meta tag content
    const setMeta = (selector: string, content: string) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute('content', content);
      }
    };

    const setCanonical = (url: string) => {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    };

    // Remove any previously injected dynamic tool JSON-LD schema
    const oldDynamicSchema = document.getElementById('dynamic-tool-jsonld');
    if (oldDynamicSchema) {
      oldDynamicSchema.remove();
    }

    if (activeTool) {
      document.title = activeTool.metaTitle;
      setMeta('meta[name="description"]', activeTool.metaDesc);
      setMeta('meta[name="keywords"]', activeTool.keywords.join(', ') + ', ilovepdf alternative, free online pdf tools, private in-browser pdf');
      
      const toolUrl = `https://avatarpdf.com/${activeTool.slug}`;
      setCanonical(toolUrl);

      // OpenGraph
      setMeta('meta[property="og:title"]', activeTool.metaTitle);
      setMeta('meta[property="og:description"]', activeTool.metaDesc);
      setMeta('meta[property="og:url"]', toolUrl);

      // Twitter
      setMeta('meta[name="twitter:title"]', activeTool.metaTitle);
      setMeta('meta[name="twitter:description"]', activeTool.metaDesc);
      setMeta('meta[name="twitter:url"]', toolUrl);

      // Inject Tool-Specific JSON-LD Schemas (HowTo, FAQPage, BreadcrumbList, WebApplication)
      const dynamicSchemaScript = document.createElement('script');
      dynamicSchemaScript.id = 'dynamic-tool-jsonld';
      dynamicSchemaScript.type = 'application/ld+json';
      
      const dynamicSchemas = [
        // 1. BreadcrumbList Schema
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://avatarpdf.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": activeTool.name,
              "item": toolUrl
            }
          ]
        },
        // 2. HowTo Schema
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": `How to use ${activeTool.name} online for free`,
          "description": activeTool.shortDesc,
          "step": activeTool.howToSteps.map((step, idx) => ({
            "@type": "HowToStep",
            "position": idx + 1,
            "name": step.title,
            "text": step.desc
          }))
        },
        // 3. FAQPage Schema for Tool Page
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": activeTool.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        }
      ];

      dynamicSchemaScript.text = JSON.stringify(dynamicSchemas);
      document.head.appendChild(dynamicSchemaScript);

    } else if (currentPath === 'about') {
      document.title = 'About Us — Avatar PDF | #1 Free & Private PDF Studio';
      setMeta('meta[name="description"]', 'Learn about Avatar PDF, the world’s most private, client-side online PDF intelligence platform built with WebAssembly.');
      setCanonical('https://avatarpdf.com/about');
    } else if (currentPath === 'privacy') {
      document.title = 'Privacy Policy — 100% Client-Side Zero Server Retention | Avatar PDF';
      setMeta('meta[name="description"]', 'Avatar PDF zero server retention policy. Your files are processed 100% locally in your browser memory and never uploaded to any remote server.');
      setCanonical('https://avatarpdf.com/privacy');
    } else if (currentPath === 'terms') {
      document.title = 'Terms of Service | Avatar PDF';
      setMeta('meta[name="description"]', 'Terms of service and usage conditions for Avatar PDF online productivity tools.');
      setCanonical('https://avatarpdf.com/terms');
    } else if (currentPath === 'faq') {
      document.title = 'Frequently Asked Questions & PDF Help Center | Avatar PDF';
      setMeta('meta[name="description"]', 'Common questions and answers regarding merging, compressing, converting Word to PDF, OCR scanned documents, and privacy on Avatar PDF.');
      setCanonical('https://avatarpdf.com/faq');
    } else if (currentPath === 'contact') {
      document.title = 'Contact Support & Feedback | Avatar PDF';
      setMeta('meta[name="description"]', 'Get in touch with the Avatar PDF engineering and product team for support, questions, or custom feature requests.');
      setCanonical('https://avatarpdf.com/contact');
    } else if (currentPath === 'sitemap') {
      document.title = 'All 41+ Free PDF Tools Directory & HTML Sitemap | Avatar PDF';
      setMeta('meta[name="description"]', 'Complete directory and sitemap of all 41+ free, client-side PDF tools available on Avatar PDF.');
      setCanonical('https://avatarpdf.com/sitemap');
    } else if (isHomePage) {
      document.title = 'Avatar PDF | Free Online PDF Tools — Merge, Compress, Convert, Edit & Sign PDF';
      setMeta('meta[name="description"]', 'Avatar PDF is the #1 free, 100% private online PDF service. Merge PDF, split PDF, compress PDF, PDF to Word, Word to PDF, JPG to PDF, edit scanned PDFs with OCR, sign, watermark, and protect documents with zero server uploads.');
      setCanonical('https://avatarpdf.com/');
    } else {
      document.title = '404 Page Not Found | Avatar PDF';
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
              initialQuery={searchQuery}
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
