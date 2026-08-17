# ⚡ Avatar PDF — Universal Client-Side PDF Intelligence Suite

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Privacy: 100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-10b981?logo=shield)](https://github.com/abhay-kr-0705/PDF-Tool)

**The all-in-one, ultra-fast, 100% private online PDF toolkit. No servers, no uploads, no file size limits.**

[Features](#-key-features) • [Tool Directory](#-comprehensive-tool-directory-40-tools) • [Architecture](#-architecture--privacy) • [Getting Started](#-getting-started) • [Deployment](#-deployment)

</div>

---

## 🌟 Key Features

- 🔒 **100% In-Browser Privacy**: Zero document uploads to any remote server. All file parsing, conversions, OCR, compression, and watermarking execute directly inside your local browser memory via WebAssembly and Web Workers.
- ⚡ **Instant WebAssembly Speed**: Native multi-threaded performance powered by `pdf-lib`, `pdfjs-dist`, and `tesseract.js`.
- 📁 **No File Size Caps**: Unlimited file sizes and unlimited document processing for free.
- 🔍 **Scanned PDF OCR Text Recognition**: Client-side OCR with bounding-box character recognition, typo fixing, and searchable PDF export.
- 🎯 **SEO-Optimized Direct Tool URLs**: Every tool has its own dedicated canonical URL (e.g. `/word-to-pdf`, `/compress-pdf`, `/sign-pdf`) ready for immediate drag-and-drop file processing at the top, followed by structured How-To guides and FAQ accordions.
- 🎨 **Clean, Professional UI**: Inspired by industry leaders like iLovePDF and Smallpdf with categorized mega-menus, dark/light theme toggle, and live search autocomplete.

---

## 🛠️ Comprehensive Tool Directory (40+ Tools)

### 📄 Convert To PDF
- **Word to PDF** (`/word-to-pdf`): Convert `.docx` & `.doc` files with tables, typography, and images.
- **Excel to PDF** (`/excel-to-pdf`): Convert `.xlsx`, `.xls`, & `.csv` spreadsheets with multi-sheet support.
- **PowerPoint to PDF** (`/powerpoint-to-pdf`): Convert `.pptx` & `.ppt` slides to high-fidelity presentation decks.
- **Image to PDF** (`/image-to-pdf`): Convert JPG, PNG, WEBP, SVG, TIFF, and BMP with margin & orientation controls.
- **HTML to PDF** (`/html-to-pdf`): Convert rich HTML and styled web layouts to PDF.
- **Markdown to PDF** (`/markdown-to-pdf`): Live side-by-side GFM editor with tables and code blocks to PDF.
- **Code to PDF** (`/code-to-pdf`): Convert source code (`.js`, `.py`, `.ts`, etc.) with syntax styling and line numbers.
- **Text to PDF** (`/text-to-pdf`): Plain text notes and TXT files to styled PDF documents.

### 📝 Convert From PDF
- **PDF to Word** (`/pdf-to-word`): Convert PDF layout, typography, and text into editable `.docx`.
- **PDF to Excel** (`/pdf-to-excel`): Detect tables, numbers, and data columns, exporting to clean `.xlsx`.
- **PDF to PowerPoint** (`/pdf-to-powerpoint`): Convert PDF pages into slide decks (`.pptx`).
- **PDF to Image** (`/pdf-to-image`): Render high-res pages (150/300 DPI) as JPG, PNG, WEBP, or ZIP.
- **PDF to HTML** (`/pdf-to-html`): Convert PDF pages into responsive HTML5 web pages.
- **PDF to Text** (`/pdf-to-text`): Extract raw text with layout preservation and 1-click clipboard copy.
- **Extract Images** (`/extract-images`): Scan and extract all embedded graphics and photos in a ZIP archive.

### ⚡ Optimize & Clean
- **Compress PDF** (`/compress-pdf`):
  - *Lossless Compression*: Stream compaction, object defragmentation (100% quality preserved).
  - *Balanced Compression*: 150 DPI image downsampling for email and web sharing.
  - *Extreme Compression*: Maximum reduction (72 DPI) for strict upload limits.
- **Flatten PDF** (`/flatten-pdf`): Flatten interactive forms and annotations into uneditable vector streams.
- **Grayscale / B&W PDF** (`/grayscale-pdf`): Convert color documents to clean monochrome for eco-printing.
- **Invert PDF / Dark Mode** (`/invert-pdf`): Invert page colors for comfortable night reading.
- **Deskew & Scan Cleanup** (`/deskew-pdf`): Auto-enhance contrast, sharpen text, and remove noise from scans.

### 🔍 Edit & Scanned OCR
- **Edit Scanned PDF (OCR)** (`/edit-scanned-pdf`): Client-side Tesseract OCR to detect text, copy words, fix typos, and export searchable PDFs.
- **Full Canvas PDF Editor** (`/edit-pdf`): Add text, freehand drawing, highlighter, rectangles, circles, stamps, and PII redaction.
- **Digital Signatures** (`/sign-pdf`): Draw signature with stylus/mouse, type cursive signatures, or upload transparent PNG stamps.
- **Redact PDF** (`/redact-pdf`): Permanently blackout sensitive personal data (SSNs, credit cards, PII).

### 📑 Organize & Structure
- **Merge PDF** (`/merge-pdf`): Combine multiple PDF documents with drag-and-drop reordering.
- **Split PDF** (`/split-pdf`): Split by custom page ranges (e.g. 1-3, 5), extract every page, or use visual picker.
- **Organize Pages** (`/organize-pdf`): Visual drag-and-drop page grid with rotate, duplicate, and delete controls.
- **Delete Pages** (`/delete-pages`): 1-click removal of unwanted pages.
- **Extract Pages** (`/extract-pages`): Select specific pages and save them into a new standalone PDF.
- **Rotate PDF** (`/rotate-pdf`): Rotate individual pages or all pages 90°, 180°, or 270°.
- **Crop PDF** (`/crop-pdf`): Interactive margin cutter and viewport trimmer.
- **N-Up / Booklet Imposition** (`/n-up-pdf`): Print 2, 4, 8, or 16 pages per sheet for handouts.
- **Resize PDF Pages** (`/resize-pdf`): Scale PDF pages to A4, A3, Letter, Legal, or Tabloid.

### 🛡️ Security & Utilities
- **Protect / Encrypt PDF** (`/protect-pdf`): Add strong password encryption.
- **Unlock / Decrypt PDF** (`/unlock-pdf`): Remove password restrictions.
- **Watermark PDF** (`/watermark-pdf`): Add custom text or image watermarks with angle, opacity, and repeating grid.
- **Add Page Numbers** (`/page-numbers`): Configurable headers, footers, formats (`Page N of M`), and start offsets.
- **PDF Metadata Editor** (`/pdf-metadata`): Edit Title, Author, Subject, Keywords, Creator, Producer.
- **PDF Form Filler** (`/form-filler`): Fill AcroForm fields and export.
- **Compare PDFs** (`/compare-pdf`): Side-by-side visual diff slider and text change analysis.

---

## 🔒 Architecture & Privacy

```
┌────────────────────────────────────────────────────────┐
│                   User's Web Browser                   │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │               Avatar PDF UI (React)              │  │
│  └─────────────────────────┬────────────────────────┘  │
│                            │ (In-Memory Processing)    │
│  ┌─────────────────────────▼────────────────────────┐  │
│  │           WebAssembly / Client Engines           │  │
│  │  • pdf-lib (Structure, Merge, Split, Stamp)      │  │
│  │  • pdfjs-dist (Canvas Rendering & Extraction)    │  │
│  │  • Tesseract.js (Web Worker OCR Engine)          │  │
│  │  • SheetJS / XLSX (Spreadsheet Engine)           │  │
│  │  • Mammoth & Docx (Word Document Engine)         │  │
│  │  • PptxGenJS (PowerPoint Slide Generator)        │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
                       ▲
                       │ Zero Server Transmission
                       │ 100% In-Memory Sandbox
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/abhay-kr-0705/PDF-Tool.git

# Navigate to project directory
cd PDF-Tool

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Building for Production

```bash
# Run TypeScript validation and build minified bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deployment

Avatar PDF is a 100% static Single Page Application and can be deployed in 1 click to:

### Vercel
```bash
npx vercel --prod
```

### Netlify
```bash
npx netlify deploy --prod --dir=dist
```

### Cloudflare Pages
1. Connect your GitHub repository `https://github.com/abhay-kr-0705/PDF-Tool`.
2. Build command: `npm run build`
3. Output directory: `dist`

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Built with ❤️ for privacy, speed, and productivity.
</div>
