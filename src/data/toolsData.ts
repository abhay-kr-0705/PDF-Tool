import { ToolDefinition } from '../types';

export const TOOLS: ToolDefinition[] = [
  // 1. Word to PDF
  {
    id: 'word-to-pdf',
    slug: 'word-to-pdf',
    name: 'Word to PDF',
    shortDesc: 'Convert DOCX and DOC documents to polished, standard PDF files instantly.',
    metaTitle: 'Word to PDF Converter — Free, Fast & 100% Private Online | Avatar PDF',
    metaDesc: 'Convert Microsoft Word DOCX and DOC documents to PDF online for free. Preserves all tables, formatting, and fonts with 100% client-side security.',
    keywords: ['word to pdf', 'convert docx to pdf', 'doc to pdf online', 'free word to pdf converter', 'private doc to pdf'],
    category: 'convert-to',
    badge: 'Popular',
    icon: 'FileText',
    color: 'text-blue-500',
    bgGradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    acceptedFiles: '.docx,.doc',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload Word File', desc: 'Select or drag & drop your .docx or .doc file into the upload zone.' },
      { step: 2, title: 'Instant Conversion', desc: 'Avatar PDF parses document tables, styles, and headers client-side in seconds.' },
      { step: 3, title: 'Download PDF', desc: 'Preview your converted document and click Download to save your PDF.' }
    ],
    features: [
      { title: 'Preserves Layout & Tables', desc: 'Maintains formatting, fonts, indentations, headers, and tables accurately.' },
      { title: '100% Private & In-Browser', desc: 'Zero document uploads to any server. Your sensitive files never leave your device.' },
      { title: 'No File Size Limits', desc: 'Unlimited conversions with instant WebAssembly speed.' }
    ],
    faqs: [
      { q: 'Will my Word formatting be preserved when converting to PDF?', a: 'Yes! Avatar PDF extracts styles, paragraphs, tables, and typography to reproduce an identical PDF representation.' },
      { q: 'Is it safe to convert confidential Word files here?', a: 'Completely safe. Unlike other tools that upload your files to external cloud servers, Avatar PDF runs 100% locally in your web browser.' },
      { q: 'Do I need Microsoft Word installed?', a: 'No! No external software or MS Office license is required.' }
    ],
    relatedToolSlugs: ['pdf-to-word', 'excel-to-pdf', 'powerpoint-to-pdf', 'merge-pdf']
  },

  // 2. PDF to Word
  {
    id: 'pdf-to-word',
    slug: 'pdf-to-word',
    name: 'PDF to Word',
    shortDesc: 'Convert PDF documents into fully editable Microsoft Word (.docx) files.',
    metaTitle: 'PDF to Word Converter (.DOCX) — Free & Accurate Online | Avatar PDF',
    metaDesc: 'Convert PDF files to editable DOCX Word documents online. Extract text, tables, and formatting with zero file upload privacy.',
    keywords: ['pdf to word', 'convert pdf to docx', 'pdf to doc converter free', 'editable word from pdf'],
    category: 'convert-from',
    badge: 'Popular',
    icon: 'FileCode',
    color: 'text-blue-600',
    bgGradient: 'from-blue-600/10 via-cyan-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Choose PDF File', desc: 'Select the PDF document you want to convert into editable Word.' },
      { step: 2, title: 'Text & Layout Extraction', desc: 'Our engine reconstructs paragraph flows, text lines, and headings.' },
      { step: 3, title: 'Download .DOCX', desc: 'Get your editable Microsoft Word file ready for editing in Word, Docs, or Pages.' }
    ],
    features: [
      { title: 'Fully Editable Output', desc: 'Creates real .docx files with clean text paragraphs and proper font sizes.' },
      { title: 'Local Client-Side Processing', desc: 'No file size caps and zero server logs.' },
      { title: 'Fast Batch Extraction', desc: 'Converts multi-page documents in seconds.' }
    ],
    faqs: [
      { q: 'Can I edit the converted Word file in Microsoft Word or Google Docs?', a: 'Yes! The output is a standard .docx file compatible with MS Word, Google Docs, LibreOffice, and Apple Pages.' },
      { q: 'What if my PDF is a scanned document?', a: 'If your PDF is scanned, use our Scanned PDF OCR Editor tool to recognize and extract text before converting.' }
    ],
    relatedToolSlugs: ['word-to-pdf', 'pdf-to-excel', 'pdf-to-text', 'edit-scanned-pdf']
  },

  // 3. Compress PDF
  {
    id: 'compress-pdf',
    slug: 'compress-pdf',
    name: 'Compress PDF',
    shortDesc: 'Shrink PDF file size while maintaining maximum quality with smart compression.',
    metaTitle: 'Compress PDF Online — Reduce PDF Size Without Losing Quality | Avatar PDF',
    metaDesc: 'Compress PDF files online for free. Choose lossless compression, balanced quality, or extreme reduction with live file size savings.',
    keywords: ['compress pdf', 'reduce pdf size', 'compress pdf without losing quality', 'shrink pdf online', 'lossless pdf compression'],
    category: 'optimize',
    badge: 'Lossless',
    icon: 'Minimize2',
    color: 'text-emerald-500',
    bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Select PDF', desc: 'Upload the PDF document you want to optimize.' },
      { step: 2, title: 'Choose Compression Mode', desc: 'Pick Lossless (Preserves 100% Quality), Balanced, or Extreme.' },
      { step: 3, title: 'Download Compressed PDF', desc: 'View your percentage size savings and download instantly.' }
    ],
    features: [
      { title: 'Lossless Optimization', desc: 'Defragments object streams, strips redundant metadata, and compacts fonts without touching pixels.' },
      { title: 'Custom Quality Slider', desc: 'Fine-tune image DPI and JPEG compression to match email or web upload limits.' },
      { title: 'Instant Live Savings Metric', desc: 'See exact MB and percentage saved in real-time.' }
    ],
    faqs: [
      { q: 'How does lossless PDF compression work?', a: 'Lossless compression reorganizes PDF binary structures, defragments cross-reference tables, and applies Flate stream compression without altering visual resolution.' },
      { q: 'Will the compressed PDF look blurry?', a: 'In Lossless mode, visual quality is 100% identical. In Balanced mode, images are downsampled to crisp 150 DPI ideal for print and screen.' }
    ],
    relatedToolSlugs: ['merge-pdf', 'flatten-pdf', 'grayscale-pdf', 'resize-pdf']
  },

  // 4. Merge PDF
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    name: 'Merge PDF',
    shortDesc: 'Combine multiple PDF files into a single organized document in your custom order.',
    metaTitle: 'Merge PDF Online — Combine Multiple PDFs into One Document | Avatar PDF',
    metaDesc: 'Merge PDF files online for free. Combine multiple PDFs with visual drag-and-drop reordering. Fast, secure, and private.',
    keywords: ['merge pdf', 'combine pdfs', 'join pdf files', 'merge pdf online free', 'reorder and merge pdf'],
    category: 'organize',
    badge: 'Popular',
    icon: 'Layers',
    color: 'text-indigo-500',
    bgGradient: 'from-indigo-500/10 via-purple-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: true,
    howToSteps: [
      { step: 1, title: 'Upload Multiple PDFs', desc: 'Select 2 or more PDF files from your device.' },
      { step: 2, title: 'Reorder Files', desc: 'Drag and drop file cards to arrange the exact page sequence.' },
      { step: 3, title: 'Merge & Save', desc: 'Click Combine PDF to generate your single merged document.' }
    ],
    features: [
      { title: 'Visual Drag & Drop Reordering', desc: 'Easily rearrange files before merging.' },
      { title: 'Unlimited File Count', desc: 'Combine 2, 5, 20 or more PDF files seamlessly.' },
      { title: 'Preserves Bookmarks & Forms', desc: 'Keeps document structure intact.' }
    ],
    faqs: [
      { q: 'Can I merge password-protected PDFs?', a: 'Unlock the PDF using our Unlock PDF tool first, then combine it with your other documents.' },
      { q: 'Is there a limit on how many PDFs I can merge?', a: 'No limit! Because Avatar PDF runs on your device, you can merge as many documents as your browser memory permits.' }
    ],
    relatedToolSlugs: ['split-pdf', 'organize-pdf', 'compress-pdf', 'extract-pages']
  },

  // 5. Split PDF
  {
    id: 'split-pdf',
    slug: 'split-pdf',
    name: 'Split PDF',
    shortDesc: 'Separate PDF pages into individual documents or extract custom page ranges.',
    metaTitle: 'Split PDF Online — Extract Pages & Separate PDF Ranges | Avatar PDF',
    metaDesc: 'Split PDF files online for free. Extract specific page ranges (e.g. 1-5, 8, 11-15) or split every page into separate files with 1-click download.',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'split pdf by page range', 'cut pdf'],
    category: 'organize',
    badge: 'Popular',
    icon: 'Scissors',
    color: 'text-amber-500',
    bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select the PDF file you wish to split.' },
      { step: 2, title: 'Define Ranges or Pages', desc: 'Type custom ranges like 1-3, 5, 7-10 or select Extract All.' },
      { step: 3, title: 'Download Split Files', desc: 'Download individual PDFs or all parts in a single ZIP package.' }
    ],
    features: [
      { title: 'Flexible Range Syntax', desc: 'Supports complex ranges like "1-4, 7, 10-15".' },
      { title: 'Extract Every Page', desc: '1-click option to split every page into standalone PDF files.' },
      { title: 'Interactive Thumbnail Selector', desc: 'Click thumbnails to select exact pages visually.' }
    ],
    faqs: [
      { q: 'How do I extract only page 2 and page 5?', a: 'Simply enter "2, 5" in the page range input field and click Split PDF.' }
    ],
    relatedToolSlugs: ['merge-pdf', 'extract-pages', 'delete-pages', 'organize-pdf']
  },

  // 6. Edit Scanned PDF & OCR
  {
    id: 'edit-scanned-pdf',
    slug: 'edit-scanned-pdf',
    name: 'Edit Scanned PDF (OCR)',
    shortDesc: 'Recognize scanned document text with Tesseract OCR, copy, edit, and overlay live text.',
    metaTitle: 'Edit Scanned PDF Online with OCR — Searchable & Editable Text | Avatar PDF',
    metaDesc: 'Edit scanned PDF documents online. Powered by client-side Tesseract OCR to recognize text, detect bounding boxes, make text searchable, and edit scanned text directly.',
    keywords: ['edit scanned pdf', 'ocr pdf online', 'scanned pdf to text', 'make pdf searchable', 'tesseract ocr pdf'],
    category: 'edit-scan',
    badge: 'OCR',
    icon: 'ScanLine',
    color: 'text-purple-500',
    bgGradient: 'from-purple-500/10 via-fuchsia-500/5 to-transparent',
    acceptedFiles: '.pdf,.png,.jpg,.jpeg',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload Scanned File', desc: 'Drop your scanned PDF document or high-res photo scan.' },
      { step: 2, title: 'Run Client-Side OCR', desc: 'Tesseract OCR runs in a WebAssembly worker to detect words and text coordinates.' },
      { step: 3, title: 'Edit & Export', desc: 'Copy recognized text, fix typos with text overlays, or download searchable PDF.' }
    ],
    features: [
      { title: 'Client-Side Tesseract OCR', desc: 'Zero server dependency — fast, private optical character recognition.' },
      { title: 'Bounding Box Text Overlay', desc: 'Inspect exact word coordinates on scanned document pages.' },
      { title: 'Searchable & Copyable Text', desc: 'Turn static image scans into real, searchable document layers.' }
    ],
    faqs: [
      { q: 'What is OCR for scanned PDFs?', a: 'OCR (Optical Character Recognition) analyzes scanned document images, recognizes letterforms, and converts them into editable, selectable text.' },
      { q: 'Does Avatar PDF upload my scanned document to any cloud server?', a: 'No! The entire OCR engine runs directly inside your browser via WebAssembly, guaranteeing total confidentiality for medical, financial, and legal scans.' }
    ],
    relatedToolSlugs: ['edit-pdf', 'pdf-to-text', 'deskew-pdf', 'sign-pdf']
  },

  // 7. Full Interactive PDF Editor
  {
    id: 'edit-pdf',
    slug: 'edit-pdf',
    name: 'Edit PDF',
    shortDesc: 'Add text, freehand drawings, shapes, highlights, stamps, and redact sensitive info.',
    metaTitle: 'Free Online PDF Editor — Add Text, Annotate, Redact & Draw | Avatar PDF',
    metaDesc: 'Edit PDF files online for free. Add custom text, highlight paragraphs, draw shapes, apply stamps, redact sensitive information, and sign documents.',
    keywords: ['edit pdf', 'free online pdf editor', 'annotate pdf', 'add text to pdf', 'pdf markup tool'],
    category: 'edit-scan',
    badge: 'Popular',
    icon: 'Edit3',
    color: 'text-rose-500',
    bgGradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Open PDF in Editor', desc: 'Upload your document to launch the interactive canvas workspace.' },
      { step: 2, title: 'Add Annotations', desc: 'Use text, shapes, highlighter, stamps, whiteout, and signature tools.' },
      { step: 3, title: 'Save & Download', desc: 'Click Save PDF to burn annotations into the vector document stream.' }
    ],
    features: [
      { title: 'Rich Annotation Suite', desc: 'Text, Pen, Highlighter, Rectangles, Circles, Arrows, Stamps.' },
      { title: 'PII Redaction / Whiteout', desc: 'Permanently remove or blackout confidential details.' },
      { title: 'Multi-Page Navigation', desc: 'Seamlessly switch between pages with live previews.' }
    ],
    faqs: [
      { q: 'Can I add a company stamp or signature in the editor?', a: 'Yes! We have built-in stamps (APPROVED, CONFIDENTIAL, etc.) and a digital signature pad.' }
    ],
    relatedToolSlugs: ['edit-scanned-pdf', 'sign-pdf', 'redact-pdf', 'watermark-pdf']
  },

  // 8. Excel to PDF
  {
    id: 'excel-to-pdf',
    slug: 'excel-to-pdf',
    name: 'Excel to PDF',
    shortDesc: 'Convert XLSX, XLS, and CSV spreadsheets into formatted, professional PDF tables.',
    metaTitle: 'Excel to PDF Converter (.XLSX, .CSV) — Free & Private Online | Avatar PDF',
    metaDesc: 'Convert Excel spreadsheets (XLSX, XLS, CSV) to clean PDF tables online. Fast in-browser conversion with multi-sheet support.',
    keywords: ['excel to pdf', 'convert xlsx to pdf', 'csv to pdf', 'spreadsheet to pdf converter'],
    category: 'convert-to',
    badge: 'Fast',
    icon: 'Table',
    color: 'text-green-600',
    bgGradient: 'from-green-600/10 via-emerald-500/5 to-transparent',
    acceptedFiles: '.xlsx,.xls,.csv',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Select Spreadsheet', desc: 'Upload your .xlsx, .xls, or .csv file.' },
      { step: 2, title: 'Grid Rendering', desc: 'Avatar PDF parses tabular columns, sheet headers, and data cells.' },
      { step: 3, title: 'Download PDF', desc: 'Get your publication-ready landscape table PDF.' }
    ],
    features: [
      { title: 'Preserves Grid & Columns', desc: 'Formatted table borders and headers for optimal readability.' },
      { title: 'Multi-Sheet Detection', desc: 'Handles workbooks with multiple worksheets.' }
    ],
    faqs: [
      { q: 'Can I convert .csv files too?', a: 'Yes! CSV, XLS, and XLSX are all supported.' }
    ],
    relatedToolSlugs: ['pdf-to-excel', 'word-to-pdf', 'powerpoint-to-pdf']
  },

  // 9. PDF to Excel
  {
    id: 'pdf-to-excel',
    slug: 'pdf-to-excel',
    name: 'PDF to Excel',
    shortDesc: 'Extract structured tables, numbers, and data columns from PDF into .XLSX.',
    metaTitle: 'PDF to Excel Converter (.XLSX) — Extract Tables Online Free | Avatar PDF',
    metaDesc: 'Convert PDF tables into editable Excel XLSX spreadsheets online. Automatically detect columns, rows, and numbers with zero server uploads.',
    keywords: ['pdf to excel', 'convert pdf to xlsx', 'extract table from pdf', 'pdf to spreadsheet free'],
    category: 'convert-from',
    badge: 'Pro',
    icon: 'FileSpreadsheet',
    color: 'text-green-700',
    bgGradient: 'from-green-700/10 via-teal-600/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Choose the PDF containing tables, invoices, or financial reports.' },
      { step: 2, title: 'Column & Row Detection', desc: 'Our algorithm groups text coordinates into structured grid rows.' },
      { step: 3, title: 'Download .XLSX', desc: 'Open your converted spreadsheet in Microsoft Excel or Google Sheets.' }
    ],
    features: [
      { title: 'Smart Table Alignment', desc: 'Reconstructs spreadsheet cells based on coordinate analysis.' },
      { title: 'Per-Page Worksheets', desc: 'Organizes each PDF page into a dedicated sheet tab.' }
    ],
    faqs: [
      { q: 'Will numerical values remain editable?', a: 'Yes, all text and numerical values are placed in real spreadsheet cells.' }
    ],
    relatedToolSlugs: ['excel-to-pdf', 'pdf-to-word', 'pdf-to-text']
  },

  // 10. PowerPoint to PDF
  {
    id: 'powerpoint-to-pdf',
    slug: 'powerpoint-to-pdf',
    name: 'PowerPoint to PDF',
    shortDesc: 'Convert PPTX presentation slides into high-fidelity PDF slide decks.',
    metaTitle: 'PowerPoint to PDF Converter (.PPTX) — Free Online | Avatar PDF',
    metaDesc: 'Convert Microsoft PowerPoint presentations (PPTX, PPT) to PDF online. Perfect for pitch decks, handouts, and presentation sharing.',
    keywords: ['powerpoint to pdf', 'convert pptx to pdf', 'ppt to pdf online', 'slide deck to pdf'],
    category: 'convert-to',
    badge: 'Fast',
    icon: 'Presentation',
    color: 'text-orange-500',
    bgGradient: 'from-orange-500/10 via-amber-500/5 to-transparent',
    acceptedFiles: '.pptx,.ppt',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload Presentation', desc: 'Select your .pptx or .ppt slide deck.' },
      { step: 2, title: 'Slide Layout Rendering', desc: 'Avatar PDF converts slides into crisp landscape pages.' },
      { step: 3, title: 'Download PDF', desc: 'Save your presentation PDF ready for distribution.' }
    ],
    features: [
      { title: '16:9 Landscape Aspect Ratio', desc: 'Standard presentation deck dimensions.' },
      { title: 'Compact File Size', desc: 'Optimized for quick email attachments.' }
    ],
    faqs: [
      { q: 'Does this work on mobile?', a: 'Yes! Avatar PDF works on all desktop and mobile browsers.' }
    ],
    relatedToolSlugs: ['pdf-to-powerpoint', 'word-to-pdf', 'excel-to-pdf']
  },

  // 11. PDF to PowerPoint
  {
    id: 'pdf-to-powerpoint',
    slug: 'pdf-to-powerpoint',
    name: 'PDF to PowerPoint',
    shortDesc: 'Convert PDF document pages into editable Microsoft PowerPoint (.pptx) slides.',
    metaTitle: 'PDF to PowerPoint Converter (.PPTX) — Free Online | Avatar PDF',
    metaDesc: 'Convert PDF pages to PowerPoint PPTX presentations online. High-res slide layout preservation for presentations and pitches.',
    keywords: ['pdf to powerpoint', 'convert pdf to pptx', 'pdf to slides', 'pdf presentation converter'],
    category: 'convert-from',
    badge: 'Pro',
    icon: 'Film',
    color: 'text-orange-600',
    bgGradient: 'from-orange-600/10 via-rose-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select the PDF you want to convert into a slide presentation.' },
      { step: 2, title: 'Slide Deck Generation', desc: 'Pages are converted into presentation slides.' },
      { step: 3, title: 'Download PPTX', desc: 'Open in PowerPoint, Google Slides, or Keynote.' }
    ],
    features: [
      { title: 'Standard PPTX Format', desc: 'Compatible with all major presentation software.' }
    ],
    faqs: [
      { q: 'Can I edit the slides in Google Slides?', a: 'Yes, just upload the generated .pptx to Google Drive.' }
    ],
    relatedToolSlugs: ['powerpoint-to-pdf', 'pdf-to-image', 'pdf-to-word']
  },

  // 12. PDF to Image (JPG, PNG, WEBP)
  {
    id: 'pdf-to-image',
    slug: 'pdf-to-image',
    name: 'PDF to Image',
    shortDesc: 'Convert PDF pages into high-resolution JPG, PNG, or WEBP images with ZIP download.',
    metaTitle: 'PDF to Image Converter (JPG, PNG, WEBP) — High Resolution | Avatar PDF',
    metaDesc: 'Convert PDF pages to high-resolution PNG, JPG, or WEBP images online. Choose 150 or 300 DPI and download all pages in a single ZIP.',
    keywords: ['pdf to image', 'pdf to jpg', 'pdf to png', 'convert pdf to image online', 'high res pdf to picture'],
    category: 'convert-from',
    badge: 'Popular',
    icon: 'Image',
    color: 'text-cyan-500',
    bgGradient: 'from-cyan-500/10 via-blue-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Select PDF', desc: 'Upload the PDF document you want to extract images from.' },
      { step: 2, title: 'Choose Format & DPI', desc: 'Select PNG, JPG, or WEBP, and standard (150 DPI) or ultra (300 DPI).' },
      { step: 3, title: 'Download ZIP', desc: 'Get all rendered page pictures in an organized ZIP folder.' }
    ],
    features: [
      { title: 'Crisp 300 DPI Rendering', desc: 'Publication-quality high resolution rendering.' },
      { title: 'Multi-Format Support', desc: 'PNG (Lossless), JPG (Compact), WEBP (Modern Web).' },
      { title: 'Instant ZIP Packaging', desc: 'All pages neatly bundled and named.' }
    ],
    faqs: [
      { q: 'What is the best format for clear text?', a: 'PNG offers lossless compression with zero compression artifacts for text.' }
    ],
    relatedToolSlugs: ['image-to-pdf', 'extract-images', 'pdf-to-html']
  },

  // 13. Image to PDF
  {
    id: 'image-to-pdf',
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    shortDesc: 'Convert JPG, PNG, WEBP, SVG, TIFF, and BMP images into a unified PDF document.',
    metaTitle: 'Image to PDF Converter (JPG, PNG, WEBP to PDF) — Free Online | Avatar PDF',
    metaDesc: 'Convert images to PDF online for free. Combine multiple JPG, PNG, WEBP, or SVG photos into a single PDF with custom page size and margin controls.',
    keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'convert photos to pdf', 'combine images into pdf'],
    category: 'convert-to',
    badge: 'Popular',
    icon: 'Images',
    color: 'text-cyan-600',
    bgGradient: 'from-cyan-600/10 via-teal-500/5 to-transparent',
    acceptedFiles: '.jpg,.jpeg,.png,.webp,.bmp,.svg,.tiff',
    allowMultiple: true,
    howToSteps: [
      { step: 1, title: 'Upload Images', desc: 'Drag and drop one or more pictures (JPG, PNG, WEBP, etc.).' },
      { step: 2, title: 'Adjust Layout', desc: 'Choose page size (A4, Letter, Fit to Image) and margins.' },
      { step: 3, title: 'Generate PDF', desc: 'Click Convert to create your unified PDF document.' }
    ],
    features: [
      { title: 'Batch Photo Conversion', desc: 'Add dozens of images at once.' },
      { title: 'Auto Orientation Detection', desc: 'Automatically aligns portrait and landscape photos.' },
      { title: 'Margin Controls', desc: 'Add clean borders or borderless full-bleed pages.' }
    ],
    faqs: [
      { q: 'Can I reorder photos before converting?', a: 'Yes! Drag and drop image thumbnails to set the exact order.' }
    ],
    relatedToolSlugs: ['pdf-to-image', 'merge-pdf', 'compress-pdf']
  },

  // 14. PDF to HTML
  {
    id: 'pdf-to-html',
    slug: 'pdf-to-html',
    name: 'PDF to HTML',
    shortDesc: 'Convert PDF pages into responsive HTML5 web pages with styled text layers.',
    metaTitle: 'PDF to HTML Converter — Clean HTML5 & CSS Online | Avatar PDF',
    metaDesc: 'Convert PDF to clean, responsive HTML5 code online. Retain text positioning, font sizes, and layout for web embedding.',
    keywords: ['pdf to html', 'convert pdf to webpage', 'pdf to html5 converter free', 'embed pdf as html'],
    category: 'convert-from',
    badge: 'New',
    icon: 'Code',
    color: 'text-violet-500',
    bgGradient: 'from-violet-500/10 via-indigo-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select your PDF document.' },
      { step: 2, title: 'HTML Generation', desc: 'Avatar PDF converts text streams and layout coordinates to CSS absolute positioning.' },
      { step: 3, title: 'Download HTML', desc: 'Get your standalone HTML file ready for web publishing.' }
    ],
    features: [
      { title: 'Semantic HTML5 Structure', desc: 'Clean markup ready for copy-pasting into web projects.' }
    ],
    faqs: [
      { q: 'Can I open the HTML file in any browser?', a: 'Yes, the output is a standalone HTML5 file that opens in Chrome, Safari, Firefox, Edge, etc.' }
    ],
    relatedToolSlugs: ['html-to-pdf', 'pdf-to-text', 'pdf-to-word']
  },

  // 15. HTML to PDF
  {
    id: 'html-to-pdf',
    slug: 'html-to-pdf',
    name: 'HTML to PDF',
    shortDesc: 'Convert raw HTML code, rich formatted text, or styled snippets to PDF.',
    metaTitle: 'HTML to PDF Converter — Convert HTML Code & Web Content | Avatar PDF',
    metaDesc: 'Convert HTML code and rich web snippets to PDF online for free. Clean CSS rendering and pagination.',
    keywords: ['html to pdf', 'convert html to pdf online', 'webpage to pdf', 'html code to pdf'],
    category: 'convert-to',
    badge: 'Fast',
    icon: 'FileCode2',
    color: 'text-violet-600',
    bgGradient: 'from-violet-600/10 via-purple-500/5 to-transparent',
    acceptedFiles: '.html,.htm,.txt',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Paste HTML or Upload File', desc: 'Paste your HTML code snippet or upload an .html file.' },
      { step: 2, title: 'Live Preview', desc: 'Verify your rendered web page visually in real-time.' },
      { step: 3, title: 'Export PDF', desc: 'Download your styled PDF document.' }
    ],
    features: [
      { title: 'CSS & Typography Support', desc: 'Renders colors, fonts, margins, and inline styling.' }
    ],
    faqs: [
      { q: 'Can I style with inline CSS?', a: 'Yes! Full inline CSS and HTML tags are rendered.' }
    ],
    relatedToolSlugs: ['pdf-to-html', 'markdown-to-pdf', 'code-to-pdf']
  },

  // 16. Watermark PDF
  {
    id: 'watermark-pdf',
    slug: 'watermark-pdf',
    name: 'Watermark PDF',
    shortDesc: 'Add custom text or image watermarks with angle, opacity, and repeating grid styles.',
    metaTitle: 'Watermark PDF Online — Add Text & Image Watermarks | Avatar PDF',
    metaDesc: 'Add custom text or logo watermarks to PDF files online for free. Customize font size, rotation angle, opacity, and tiled repeating grids.',
    keywords: ['watermark pdf', 'add watermark to pdf', 'pdf watermark online', 'stamp confidential watermark on pdf'],
    category: 'security',
    badge: 'Popular',
    icon: 'Stamp',
    color: 'text-indigo-600',
    bgGradient: 'from-indigo-600/10 via-sky-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select the document you want to brand or protect.' },
      { step: 2, title: 'Customize Watermark', desc: 'Enter text (e.g. CONFIDENTIAL, DRAFT), set opacity, color, and angle.' },
      { step: 3, title: 'Apply & Download', desc: 'Save your watermarked PDF.' }
    ],
    features: [
      { title: 'Text & Logo Watermarks', desc: 'Support for custom text or transparent PNG logo watermarks.' },
      { title: 'Tiled Repeating Grid Mode', desc: 'Stamp repeating diagonal watermarks across the entire page for anti-theft.' },
      { title: 'Opacity & Rotation Controls', desc: 'Fine-tune subtle transparency and 45° angle.' }
    ],
    faqs: [
      { q: 'Can the watermark be easily removed by others?', a: 'Avatar PDF merges the watermark directly into the PDF content stream, making it non-trivial to remove.' }
    ],
    relatedToolSlugs: ['protect-pdf', 'sign-pdf', 'page-numbers']
  },

  // 17. Protect PDF (Encrypt)
  {
    id: 'protect-pdf',
    slug: 'protect-pdf',
    name: 'Protect PDF',
    shortDesc: 'Encrypt your PDF with a strong user password and restrict unauthorized modifications.',
    metaTitle: 'Protect PDF Online — Add Password Encryption to PDF | Avatar PDF',
    metaDesc: 'Protect PDF files with password encryption online for free. Secure sensitive financial and legal documents directly in your browser.',
    keywords: ['protect pdf', 'password protect pdf', 'encrypt pdf online', 'lock pdf with password'],
    category: 'security',
    badge: 'Pro',
    icon: 'Lock',
    color: 'text-red-500',
    bgGradient: 'from-red-500/10 via-rose-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Choose PDF', desc: 'Upload the document you want to secure.' },
      { step: 2, title: 'Set Password', desc: 'Enter your custom encryption password.' },
      { step: 3, title: 'Download Protected PDF', desc: 'Your file is now encrypted and requires the password to open.' }
    ],
    features: [
      { title: 'Standard PDF Encryption', desc: 'Compatible with Adobe Acrobat, Apple Preview, and all standard PDF readers.' },
      { title: 'Zero Server Knowledge', desc: 'Passwords are never sent to any server.' }
    ],
    faqs: [
      { q: 'What happens if I forget my password?', a: 'Because Avatar PDF operates with zero-knowledge client privacy, we do not store passwords. Make sure to record your password safely.' }
    ],
    relatedToolSlugs: ['unlock-pdf', 'watermark-pdf', 'redact-pdf']
  },

  // 18. Unlock PDF (Decrypt)
  {
    id: 'unlock-pdf',
    slug: 'unlock-pdf',
    name: 'Unlock PDF',
    shortDesc: 'Remove password security and permission restrictions from unlocked PDF documents.',
    metaTitle: 'Unlock PDF Online — Remove PDF Password & Restrictions | Avatar PDF',
    metaDesc: 'Unlock password protected PDF files online for free. Remove copy, print, and edit restrictions easily.',
    keywords: ['unlock pdf', 'remove pdf password', 'decrypt pdf online free', 'remove pdf restrictions'],
    category: 'security',
    badge: 'Fast',
    icon: 'Unlock',
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-600/10 via-teal-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload Locked PDF', desc: 'Select your password-protected PDF.' },
      { step: 2, title: 'Enter Current Password', desc: 'Provide the document password to authorize decryption.' },
      { step: 3, title: 'Download Unlocked PDF', desc: 'Get an unlocked version with all restrictions permanently removed.' }
    ],
    features: [
      { title: 'Remove Printing & Editing Restrictions', desc: 'Free your document for unrestricted use.' }
    ],
    faqs: [
      { q: 'Can I unlock a PDF without knowing the password?', a: 'You must provide the valid document password once to authorize removal of restrictions.' }
    ],
    relatedToolSlugs: ['protect-pdf', 'merge-pdf', 'edit-pdf']
  },

  // 19. Add Page Numbers
  {
    id: 'page-numbers',
    slug: 'page-numbers',
    name: 'Add Page Numbers',
    shortDesc: 'Insert customizable page numbers, headers, and footers across all PDF pages.',
    metaTitle: 'Add Page Numbers to PDF Online — Header & Footer Customizer | Avatar PDF',
    metaDesc: 'Add page numbers to PDF documents online for free. Customize position, format (Page N of M), font style, start page, and margins.',
    keywords: ['add page numbers to pdf', 'number pdf pages', 'pdf page numbering online', 'header footer pdf'],
    category: 'organize',
    badge: 'Popular',
    icon: 'Hash',
    color: 'text-blue-500',
    bgGradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select the PDF document to number.' },
      { step: 2, title: 'Configure Numbering', desc: 'Choose position (bottom-center, bottom-right, etc.), format, and starting page.' },
      { step: 3, title: 'Apply & Download', desc: 'Download your cleanly paginated document.' }
    ],
    features: [
      { title: '6 Position Layouts', desc: 'Top/bottom and left/center/right alignment.' },
      { title: 'Custom Formats', desc: 'Supports "Page {n} of {total}", "{n}", or custom document prefixes.' },
      { title: 'Offset Start Page', desc: 'Skip cover pages or introductory sections easily.' }
    ],
    faqs: [
      { q: 'Can I exclude page numbers from the cover page?', a: 'Yes! Set "Start numbering from page" to 2 to keep the first page clean.' }
    ],
    relatedToolSlugs: ['watermark-pdf', 'organize-pdf', 'merge-pdf']
  },

  // 20. Rotate PDF
  {
    id: 'rotate-pdf',
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    shortDesc: 'Rotate specific pages or all pages 90°, 180°, or 270° clockwise with visual previews.',
    metaTitle: 'Rotate PDF Pages Online — 90, 180, 270 Degrees | Avatar PDF',
    metaDesc: 'Rotate PDF pages online for free. Rotate individual pages or all pages permanently. Interactive live page thumbnail rotation.',
    keywords: ['rotate pdf', 'turn pdf pages', 'rotate pdf 90 degrees', 'fix upside down pdf'],
    category: 'organize',
    badge: 'Fast',
    icon: 'RotateCw',
    color: 'text-amber-600',
    bgGradient: 'from-amber-600/10 via-yellow-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select the PDF with misaligned or upside-down pages.' },
      { step: 2, title: 'Rotate Pages', desc: 'Click Rotate All or click rotation buttons on individual page cards.' },
      { step: 3, title: 'Save PDF', desc: 'Download your permanently oriented PDF.' }
    ],
    features: [
      { title: 'Per-Page Rotation', desc: 'Rotate page 2 clockwise and page 4 counter-clockwise independently.' },
      { title: 'Live Visual Grid Preview', desc: 'See thumbnails rotate immediately before saving.' }
    ],
    faqs: [
      { q: 'Is the rotation permanent?', a: 'Yes, downloading the PDF saves the rotation permanently into the document structure.' }
    ],
    relatedToolSlugs: ['organize-pdf', 'crop-pdf', 'delete-pages']
  },

  // 21. Organize & Reorder Pages
  {
    id: 'organize-pdf',
    slug: 'organize-pdf',
    name: 'Organize Pages',
    shortDesc: 'Visual drag-and-drop page grid to reorder, duplicate, rotate, and delete pages.',
    metaTitle: 'Organize PDF Pages Online — Drag & Drop Page Manager | Avatar PDF',
    metaDesc: 'Organize PDF pages online for free. Visual drag-and-drop grid to rearrange, duplicate, delete, and rotate PDF pages effortlessly.',
    keywords: ['organize pdf pages', 'reorder pdf pages', 'rearrange pdf pages', 'pdf page organizer'],
    category: 'organize',
    badge: 'Popular',
    icon: 'LayoutGrid',
    color: 'text-indigo-600',
    bgGradient: 'from-indigo-600/10 via-violet-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Open your multi-page document.' },
      { step: 2, title: 'Drag & Rearrange', desc: 'Drag page thumbnails to your desired order, rotate, or delete unwanted pages.' },
      { step: 3, title: 'Save Organized PDF', desc: 'Download the newly structured PDF.' }
    ],
    features: [
      { title: 'Visual Drag-and-Drop', desc: 'Smooth intuitive grid reordering.' },
      { title: 'Page Actions', desc: 'Rotate, duplicate, and delete per page.' }
    ],
    faqs: [
      { q: 'Can I duplicate a page?', a: 'Yes, click duplicate on any page thumbnail to create a copy.' }
    ],
    relatedToolSlugs: ['delete-pages', 'rotate-pdf', 'merge-pdf', 'split-pdf']
  },

  // 22. Delete Pages
  {
    id: 'delete-pages',
    slug: 'delete-pages',
    name: 'Delete PDF Pages',
    shortDesc: 'Select and remove unwanted pages from your PDF with 1-click visual removal.',
    metaTitle: 'Delete PDF Pages Online — Remove Unwanted Pages Free | Avatar PDF',
    metaDesc: 'Delete pages from PDF online for free. Click thumbnails to remove unwanted blank or duplicate pages and download your clean PDF.',
    keywords: ['delete pdf pages', 'remove pages from pdf', 'cut pages from pdf', 'erase pdf page'],
    category: 'organize',
    badge: 'Fast',
    icon: 'Trash2',
    color: 'text-red-500',
    bgGradient: 'from-red-500/10 via-rose-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Select PDF', desc: 'Upload your document.' },
      { step: 2, title: 'Click Pages to Delete', desc: 'Mark the pages you want to remove.' },
      { step: 3, title: 'Download Clean PDF', desc: 'Save your file with selected pages removed.' }
    ],
    features: [
      { title: 'Multi-Selection', desc: 'Click individual pages or type ranges like 2, 4, 7-9 to remove.' }
    ],
    faqs: [
      { q: 'Can I undo a page deletion before saving?', a: 'Yes! Simply uncheck the page before clicking save.' }
    ],
    relatedToolSlugs: ['extract-pages', 'organize-pdf', 'split-pdf']
  },

  // 23. Extract Pages
  {
    id: 'extract-pages',
    slug: 'extract-pages',
    name: 'Extract PDF Pages',
    shortDesc: 'Select individual pages or custom ranges to create a fresh standalone PDF.',
    metaTitle: 'Extract PDF Pages Online — Save Selected Pages as New PDF | Avatar PDF',
    metaDesc: 'Extract pages from PDF online for free. Select specific pages and save them into a new standalone PDF document.',
    keywords: ['extract pdf pages', 'save specific pdf pages', 'extract pages from pdf free'],
    category: 'organize',
    badge: 'Popular',
    icon: 'ExternalLink',
    color: 'text-teal-500',
    bgGradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select the master document.' },
      { step: 2, title: 'Pick Pages', desc: 'Select desired pages visually or enter ranges.' },
      { step: 3, title: 'Export Extracted PDF', desc: 'Save your extracted pages.' }
    ],
    features: [
      { title: 'Interactive Thumbnail Selector', desc: 'Click to toggle pages.' }
    ],
    faqs: [
      { q: 'Does extracting pages alter the original document?', a: 'No, your original file remains untouched.' }
    ],
    relatedToolSlugs: ['delete-pages', 'split-pdf', 'organize-pdf']
  },

  // 24. Digital Signature & Sign PDF
  {
    id: 'sign-pdf',
    slug: 'sign-pdf',
    name: 'Sign PDF',
    shortDesc: 'Draw your signature, type cursive signatures, or upload transparent signature stamps.',
    metaTitle: 'Sign PDF Online Free — Electronic Signature & Certificate Stamp | Avatar PDF',
    metaDesc: 'Sign PDF documents online for free. Draw your e-signature, type cursive signatures, or upload signature image stamps with complete privacy.',
    keywords: ['sign pdf', 'e-sign pdf online', 'digital signature pdf', 'draw signature on pdf free'],
    category: 'security',
    badge: 'Popular',
    icon: 'FileSignature',
    color: 'text-indigo-500',
    bgGradient: 'from-indigo-500/10 via-sky-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Open PDF', desc: 'Upload the contract, NDA, or form to sign.' },
      { step: 2, title: 'Create Signature', desc: 'Draw with mouse/stylus, type with elegant cursive fonts, or upload image.' },
      { step: 3, title: 'Place & Save', desc: 'Position your signature on the page and download the signed PDF.' }
    ],
    features: [
      { title: '3 Signing Modes', desc: 'Draw, Type (Cursive), or Upload Image.' },
      { title: 'Transparent Background', desc: 'Clean overlay without white boxes.' },
      { title: 'Audit Timestamp', desc: 'Optional verified timestamp badge.' }
    ],
    faqs: [
      { q: 'Is my drawn signature stored on any server?', a: 'Never! Everything is processed locally in your browser memory.' }
    ],
    relatedToolSlugs: ['edit-pdf', 'protect-pdf', 'watermark-pdf']
  },

  // 25. Redact PDF
  {
    id: 'redact-pdf',
    slug: 'redact-pdf',
    name: 'Redact PDF',
    shortDesc: 'Permanently blackout or whiteout sensitive PII, SSNs, and confidential information.',
    metaTitle: 'Redact PDF Online — Permanently Blackout Sensitive PII | Avatar PDF',
    metaDesc: 'Redact PDF files online for free. Permanently black out or white out sensitive confidential information and personal data.',
    keywords: ['redact pdf', 'blackout pdf text', 'remove sensitive info from pdf', 'permanent pdf redaction'],
    category: 'security',
    badge: 'Pro',
    icon: 'EyeOff',
    color: 'text-slate-800 dark:text-slate-200',
    bgGradient: 'from-slate-800/10 via-slate-700/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select the document containing confidential data.' },
      { step: 2, title: 'Draw Redaction Boxes', desc: 'Drag blackout rectangles over confidential text or numbers.' },
      { step: 3, title: 'Burn Redactions', desc: 'Download the permanently sanitized document.' }
    ],
    features: [
      { title: 'Permanent Data Removal', desc: 'Burns black rectangles into the vector layer so text cannot be highlighted underneath.' }
    ],
    faqs: [
      { q: 'Can someone undo the black redaction box?', a: 'No, Avatar PDF writes the redaction as a permanent vector element in the PDF.' }
    ],
    relatedToolSlugs: ['edit-pdf', 'protect-pdf', 'flatten-pdf']
  },

  // 26. Flatten PDF
  {
    id: 'flatten-pdf',
    slug: 'flatten-pdf',
    name: 'Flatten PDF',
    shortDesc: 'Flatten interactive form fields and annotations into static, uneditable vector layers.',
    metaTitle: 'Flatten PDF Online — Lock Form Fields & Annotations | Avatar PDF',
    metaDesc: 'Flatten PDF forms and annotations online for free. Make interactive form fields permanent and uneditable.',
    keywords: ['flatten pdf', 'lock pdf form fields', 'flatten annotations pdf', 'make pdf uneditable'],
    category: 'optimize',
    badge: 'Fast',
    icon: 'Layers2',
    color: 'text-blue-600',
    bgGradient: 'from-blue-600/10 via-indigo-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Select Form PDF', desc: 'Upload the filled PDF form.' },
      { step: 2, title: 'Flatten Structure', desc: 'Avatar PDF merges AcroForm interactive fields into static page graphics.' },
      { step: 3, title: 'Download Flattened PDF', desc: 'Save your tamper-proof document.' }
    ],
    features: [
      { title: 'Tamper Proofing', desc: 'Prevents others from changing filled form values.' }
    ],
    faqs: [
      { q: 'Why should I flatten my PDF form?', a: 'Flattening ensures that form fields display consistently across all PDF viewers and prevents unwanted edits.' }
    ],
    relatedToolSlugs: ['form-filler', 'compress-pdf', 'protect-pdf']
  },

  // 27. Grayscale / B&W PDF
  {
    id: 'grayscale-pdf',
    slug: 'grayscale-pdf',
    name: 'Grayscale PDF',
    shortDesc: 'Convert color PDF documents to clean black & white grayscale for eco-friendly printing.',
    metaTitle: 'Convert PDF to Grayscale / B&W Online Free | Avatar PDF',
    metaDesc: 'Convert color PDF documents to black and white grayscale online. Save printer ink and toner with eco-friendly B&W PDFs.',
    keywords: ['grayscale pdf', 'convert pdf to black and white', 'b&w pdf converter', 'pdf eco printing'],
    category: 'optimize',
    badge: 'Fast',
    icon: 'Moon',
    color: 'text-slate-600',
    bgGradient: 'from-slate-600/10 via-zinc-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload Color PDF', desc: 'Select the color PDF document.' },
      { step: 2, title: 'Grayscale Conversion', desc: 'Luminance calculations convert all graphics and text to crisp monochrome.' },
      { step: 3, title: 'Download B&W PDF', desc: 'Ready for printing or archival.' }
    ],
    features: [
      { title: 'Printer Toner Saver', desc: 'Optimized contrast for economical black & white printing.' }
    ],
    faqs: [
      { q: 'Does grayscale reduce file size?', a: 'Yes, stripping color channels often reduces file size significantly.' }
    ],
    relatedToolSlugs: ['invert-pdf', 'compress-pdf', 'deskew-pdf']
  },

  // 28. Invert PDF (Dark Mode)
  {
    id: 'invert-pdf',
    slug: 'invert-pdf',
    name: 'Invert PDF (Dark Mode)',
    shortDesc: 'Invert document colors to dark mode (black background, light text) for night reading.',
    metaTitle: 'Invert PDF Colors Online — PDF Dark Mode Reader | Avatar PDF',
    metaDesc: 'Invert PDF colors online for free. Turn white pages black for comfortable night reading and eye-strain reduction.',
    keywords: ['invert pdf colors', 'pdf dark mode', 'negative pdf converter', 'night mode pdf'],
    category: 'optimize',
    badge: 'New',
    icon: 'SunMoon',
    color: 'text-amber-500',
    bgGradient: 'from-amber-500/10 via-yellow-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select the document you want to read in dark mode.' },
      { step: 2, title: 'Color Inversion', desc: 'Each pixel is inverted (white becomes dark, black becomes light).' },
      { step: 3, title: 'Download Dark Mode PDF', desc: 'Enjoy reading in low-light environments.' }
    ],
    features: [
      { title: 'Eye Strain Relief', desc: 'High-contrast dark mode for OLED screens and night studying.' }
    ],
    faqs: [
      { q: 'Can I view this dark mode PDF on any device?', a: 'Yes! It is saved as a standard PDF that opens in dark mode on every device.' }
    ],
    relatedToolSlugs: ['grayscale-pdf', 'compress-pdf', 'edit-pdf']
  },

  // 29. Compare PDF
  {
    id: 'compare-pdf',
    slug: 'compare-pdf',
    name: 'Compare PDF',
    shortDesc: 'Side-by-side visual diff slider and text change detection between two PDF revisions.',
    metaTitle: 'Compare PDF Online — Visual Diff & Text Change Detector | Avatar PDF',
    metaDesc: 'Compare two PDF files online for free. Spot differences, visual changes, and text revisions with an interactive split-slider.',
    keywords: ['compare pdf', 'diff pdf files', 'pdf comparison tool online', 'spot differences in two pdfs'],
    category: 'advanced',
    badge: 'Pro',
    icon: 'SplitSquareVertical',
    color: 'text-purple-600',
    bgGradient: 'from-purple-600/10 via-indigo-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: true,
    howToSteps: [
      { step: 1, title: 'Upload Revision A & Revision B', desc: 'Select original and updated PDF versions.' },
      { step: 2, title: 'Interactive Diff Slider', desc: 'Slide between versions or view highlighted change overlays.' },
      { step: 3, title: 'Review Differences', desc: 'Inspect text and graphic differences instantly.' }
    ],
    features: [
      { title: 'Interactive Split Slider', desc: 'Slide left and right to inspect visual changes in real-time.' }
    ],
    faqs: [
      { q: 'Does it highlight text differences?', a: 'Yes! It extracts text from both versions to highlight modified lines.' }
    ],
    relatedToolSlugs: ['merge-pdf', 'edit-pdf', 'pdf-to-text']
  },

  // 30. PDF Form Filler
  {
    id: 'form-filler',
    slug: 'form-filler',
    name: 'PDF Form Filler',
    shortDesc: 'Detect and fill interactive AcroForm fields (text fields, checkboxes) and export.',
    metaTitle: 'Fill PDF Forms Online Free — Interactive AcroForm Filler | Avatar PDF',
    metaDesc: 'Fill out PDF forms online for free. Type into text boxes, check checkboxes, and save filled PDF forms securely in your browser.',
    keywords: ['fill pdf form online', 'pdf form filler', 'type on pdf form', 'fill and sign pdf'],
    category: 'advanced',
    badge: 'Popular',
    icon: 'CheckSquare',
    color: 'text-blue-500',
    bgGradient: 'from-blue-500/10 via-sky-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload Form PDF', desc: 'Select your interactive tax form, job application, or invoice.' },
      { step: 2, title: 'Fill Fields', desc: 'Type into form fields and check checkboxes.' },
      { step: 3, title: 'Download Filled PDF', desc: 'Export your completed form.' }
    ],
    features: [
      { title: 'AcroForm Support', desc: 'Detects native interactive form fields.' }
    ],
    faqs: [
      { q: 'Can I flatten the form after filling?', a: 'Yes, use our Flatten PDF tool to lock the entries.' }
    ],
    relatedToolSlugs: ['flatten-pdf', 'sign-pdf', 'edit-pdf']
  },

  // 31. PDF Metadata Editor
  {
    id: 'pdf-metadata',
    slug: 'pdf-metadata',
    name: 'PDF Metadata Editor',
    shortDesc: 'View and update Title, Author, Subject, Keywords, Creator, and Producer properties.',
    metaTitle: 'Edit PDF Metadata Online — Change Title, Author & Keywords | Avatar PDF',
    metaDesc: 'Edit PDF metadata online for free. View and change PDF title, author, subject, keywords, creation date, and creator properties.',
    keywords: ['edit pdf metadata', 'change pdf author', 'modify pdf title', 'pdf metadata editor online'],
    category: 'advanced',
    badge: 'Fast',
    icon: 'FileQuestion',
    color: 'text-cyan-600',
    bgGradient: 'from-cyan-600/10 via-blue-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select the file to inspect.' },
      { step: 2, title: 'Edit Metadata Fields', desc: 'Update Title, Author, Subject, and Keywords.' },
      { step: 3, title: 'Save Metadata', desc: 'Download the updated PDF with clean metadata.' }
    ],
    features: [
      { title: 'SEO & Archival Friendly', desc: 'Set accurate document titles and search keywords.' }
    ],
    faqs: [
      { q: 'Can I remove personal author metadata for privacy?', a: 'Yes! Clear the author and creator fields to sanitize metadata before sharing.' }
    ],
    relatedToolSlugs: ['compress-pdf', 'protect-pdf', 'page-numbers']
  },

  // 32. N-Up / Multiple Pages on One Page (A4, A1-A5)
  {
    id: 'n-up-pdf',
    slug: 'n-up-pdf',
    name: 'Multiple Pages on 1 Page (N-Up)',
    shortDesc: 'Fit 2, 4, 6, 8, 9, or 16 pages onto A4, A1, A2, A3, A5 with live preview, adjustable margins & padding.',
    metaTitle: 'Multiple Pages on One Page PDF (A4, A1, A2, A3) — Live Preview & Margins | Avatar PDF',
    metaDesc: 'Combine multiple PDF pages into one sheet (A4 by default, A1, A2, A3, A5) online. Live visual preview with adjustable margins, padding, and landscape/portrait modes.',
    keywords: ['multiple pages at one single page pdf', 'multiple pages on one page a4', 'multi page pdf sheet a1 a2 a3', 'n-up pdf', 'booklet imposition', 'fit pages on a4', '2 pages on one sheet', '4 pages on one sheet', 'adjustable margin padding pdf'],
    category: 'organize',
    badge: 'Pro',
    icon: 'Grid',
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-600/10 via-teal-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select your multi-page document.' },
      { step: 2, title: 'Configure Sheet Layout', desc: 'Choose 2, 4, 6, 8, 9, or 16 pages per sheet, select paper size (A4, A1-A5), orientation, and adjust margin/padding sliders with live preview.' },
      { step: 3, title: 'Download Sheet PDF', desc: 'Get your print-ready handout or booklet sheet.' }
    ],
    features: [
      { title: 'Live Real-Time Preview', desc: 'Watch the imposed sheet preview update instantly as you change settings.' },
      { title: 'All ISO Paper Sizes', desc: 'Supports A4 (default), A1, A2, A3, A5, US Letter, Legal, and Tabloid.' },
      { title: 'Adjustable Margins & Gaps', desc: 'Fine-tune outer margins and gap padding between tiles with sliders.' },
      { title: 'Portrait & Landscape Modes', desc: '1-click orientation switching with automatic layout recalculation.' }
    ],
    faqs: [
      { q: 'Can I put 2 or 4 pages on a single A4 page?', a: 'Yes! Select 2-Up or 4-Up with A4 paper size, and customize the margins and padding.' },
      { q: 'Can I see how it looks before saving?', a: 'Yes! Our real-time canvas preview shows the exact tile arrangement as you adjust sliders.' }
    ],
    relatedToolSlugs: ['resize-pdf', 'grayscale-pdf', 'organize-pdf', 'merge-pdf']
  },

  // 41. Clean Background, Invert & Remove Watermark / Logo
  {
    id: 'remove-watermark-pdf',
    slug: 'remove-watermark-pdf',
    name: 'Remove Watermark & Clean BG',
    shortDesc: 'Erase watermarks, remove company logos/stamps, whiten yellowed scan backgrounds, or invert colors.',
    metaTitle: 'Remove Watermarks & Clean PDF Background Online Free | Avatar PDF',
    metaDesc: 'Remove watermarks, logos, and stamps from PDF pages online for free. Clean and whiten yellowed/gray scan backgrounds or invert colors directly in your browser.',
    keywords: ['remove watermark from pdf', 'erase watermark', 'watermark remover', 'remove logo from pdf', 'clean background pdf', 'whiten pdf scan', 'remove stamp from pdf', 'invert pdf color', 'dark mode pdf', 'erase watermark online'],
    category: 'edit-scan',
    badge: 'Pro',
    icon: 'Eraser',
    color: 'text-rose-500',
    bgGradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select the document with unwanted watermarks, logos, or dark scan backgrounds.' },
      { step: 2, title: 'Select Cleanup Mode', desc: 'Drag an eraser box over any watermark/logo to erase it, or adjust the background whitening threshold slider.' },
      { step: 3, title: 'Download Cleaned PDF', desc: 'Save your sanitized, high-contrast, watermark-free document.' }
    ],
    features: [
      { title: 'Interactive Watermark Eraser', desc: 'Draw a box over any existing watermark, header logo, or stamp to erase it cleanly.' },
      { title: 'Scan Background Whitener', desc: 'Turn gray/yellowed paper background into pure crisp white.' },
      { title: 'High-Contrast Color Inverter', desc: 'Convert to dark mode night reading.' }
    ],
    faqs: [
      { q: 'Can I erase a company logo or confidential watermark?', a: 'Yes! Select the Erase Logo / Watermark tool and drag an eraser box over the watermark or logo on the page.' },
      { q: 'Does it work on scanned documents?', a: 'Yes, the background whitener removes gray tints and enhances text contrast on scans.' }
    ],
    relatedToolSlugs: ['watermark-pdf', 'edit-scanned-pdf', 'edit-pdf', 'deskew-pdf']
  },

  // 33. Extract Images from PDF
  {
    id: 'extract-images',
    slug: 'extract-images',
    name: 'Extract Images from PDF',
    shortDesc: 'Scan the PDF stream to extract and download all embedded photos and logos in a ZIP.',
    metaTitle: 'Extract Images from PDF Online Free — Download Embedded Photos | Avatar PDF',
    metaDesc: 'Extract all images and photos from PDF files online for free. Download embedded graphics in high quality as a ZIP archive.',
    keywords: ['extract images from pdf', 'save photos from pdf', 'pdf image ripper online', 'extract embedded graphics from pdf'],
    category: 'convert-from',
    badge: 'Popular',
    icon: 'FolderDown',
    color: 'text-indigo-500',
    bgGradient: 'from-indigo-500/10 via-sky-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select the PDF containing photos or diagrams.' },
      { step: 2, title: 'Scan Stream Objects', desc: 'Avatar PDF scans XObject image streams in the PDF.' },
      { step: 3, title: 'Download Images ZIP', desc: 'Get all extracted photos in original quality.' }
    ],
    features: [
      { title: 'Original Quality Preservation', desc: 'Extracts raw image streams without re-compression degradation.' }
    ],
    faqs: [
      { q: 'What image formats are extracted?', a: 'PNG and JPG formats based on the original embedded graphic streams.' }
    ],
    relatedToolSlugs: ['pdf-to-image', 'image-to-pdf', 'compress-pdf']
  },

  // 34. PDF to Plain Text
  {
    id: 'pdf-to-text',
    slug: 'pdf-to-text',
    name: 'PDF to Text',
    shortDesc: 'Extract clean, raw text content from PDF pages with 1-click copy or TXT download.',
    metaTitle: 'PDF to Text Converter (.TXT) — Extract Plain Text Online | Avatar PDF',
    metaDesc: 'Convert PDF to plain text TXT online for free. Extract raw text with layout preservation and copy to clipboard instantly.',
    keywords: ['pdf to text', 'extract text from pdf', 'pdf to txt online', 'copy text from pdf'],
    category: 'convert-from',
    badge: 'Fast',
    icon: 'FileText',
    color: 'text-slate-600 dark:text-slate-300',
    bgGradient: 'from-slate-600/10 via-slate-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select your PDF document.' },
      { step: 2, title: 'Extract Text Layer', desc: 'Avatar PDF extracts all text strings.' },
      { step: 3, title: 'Copy or Download', desc: 'Copy directly to clipboard or save as .txt file.' }
    ],
    features: [
      { title: '1-Click Clipboard Copy', desc: 'Instantly paste extracted text anywhere.' }
    ],
    faqs: [
      { q: 'Can I extract text from a scanned document?', a: 'For scanned docs, use our Scanned PDF OCR Editor tool.' }
    ],
    relatedToolSlugs: ['edit-scanned-pdf', 'pdf-to-word', 'text-to-pdf']
  },

  // 35. Text to PDF
  {
    id: 'text-to-pdf',
    slug: 'text-to-pdf',
    name: 'Text to PDF',
    shortDesc: 'Convert plain text notes or .txt files into formatted, styled PDF documents.',
    metaTitle: 'Text to PDF Converter (.TXT to PDF) — Free Online | Avatar PDF',
    metaDesc: 'Convert plain text notes and TXT files to formatted PDF documents online for free. Clean margins and typography.',
    keywords: ['text to pdf', 'txt to pdf converter', 'notepad to pdf', 'plain text to pdf'],
    category: 'convert-to',
    badge: 'Fast',
    icon: 'AlignLeft',
    color: 'text-blue-500',
    bgGradient: 'from-blue-500/10 via-cyan-500/5 to-transparent',
    acceptedFiles: '.txt,.text',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Type or Paste Text', desc: 'Enter your text or upload a .txt file.' },
      { step: 2, title: 'Format & Paginate', desc: 'Configure font size, line spacing, and margins.' },
      { step: 3, title: 'Download PDF', desc: 'Get your clean PDF document.' }
    ],
    features: [
      { title: 'Live Word & Character Counter', desc: 'Real-time text stats while you type.' }
    ],
    faqs: [
      { q: 'Can I adjust font sizes?', a: 'Yes! Customize typography before exporting.' }
    ],
    relatedToolSlugs: ['pdf-to-text', 'markdown-to-pdf', 'code-to-pdf']
  },

  // 36. Markdown to PDF
  {
    id: 'markdown-to-pdf',
    slug: 'markdown-to-pdf',
    name: 'Markdown to PDF',
    shortDesc: 'Live Markdown editor with GitHub Flavored Markdown (GFM) styling exported to PDF.',
    metaTitle: 'Markdown to PDF Converter — Live GFM Editor to PDF | Avatar PDF',
    metaDesc: 'Convert Markdown to PDF online for free. Live side-by-side GFM editor with tables, syntax blocks, and headings exported to beautiful PDF.',
    keywords: ['markdown to pdf', 'md to pdf converter', 'gfm to pdf', 'markdown editor to pdf'],
    category: 'convert-to',
    badge: 'New',
    icon: 'FileSignature',
    color: 'text-purple-600',
    bgGradient: 'from-purple-600/10 via-fuchsia-500/5 to-transparent',
    acceptedFiles: '.md,.markdown,.txt',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Write or Paste Markdown', desc: 'Type Markdown syntax in the live editor.' },
      { step: 2, title: 'Real-Time Preview', desc: 'See headers, lists, code blocks, and tables render instantly.' },
      { step: 3, title: 'Export PDF', desc: 'Download your polished documentation PDF.' }
    ],
    features: [
      { title: 'GFM Tables & Code Blocks', desc: 'Full GitHub Flavored Markdown styling.' }
    ],
    faqs: [
      { q: 'Are code blocks styled?', a: 'Yes, code blocks receive dark-theme styling.' }
    ],
    relatedToolSlugs: ['code-to-pdf', 'html-to-pdf', 'text-to-pdf']
  },

  // 37. Code to PDF
  {
    id: 'code-to-pdf',
    slug: 'code-to-pdf',
    name: 'Code to PDF',
    shortDesc: 'Convert source code files with syntax styling, line numbers, and monospaced typography.',
    metaTitle: 'Code to PDF Converter — Source Code with Syntax Highlighting | Avatar PDF',
    metaDesc: 'Convert source code (.js, .py, .java, .cpp, .html, .css) to PDF online for free. Features line numbers, monospaced font, and clean theme.',
    keywords: ['code to pdf', 'source code to pdf', 'syntax highlighted pdf', 'programming code to pdf'],
    category: 'convert-to',
    badge: 'New',
    icon: 'Terminal',
    color: 'text-emerald-500',
    bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    acceptedFiles: '.js,.ts,.py,.java,.cpp,.c,.cs,.html,.css,.json,.sql,.sh,.txt',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Paste Source Code', desc: 'Paste code or upload any programming file.' },
      { step: 2, title: 'Select Language', desc: 'Pick JavaScript, Python, TypeScript, HTML, etc.' },
      { step: 3, title: 'Export PDF', desc: 'Download your syntax-formatted code PDF.' }
    ],
    features: [
      { title: 'Line Numbers & Monospace Font', desc: 'Ideal for code reviews, homework submissions, and documentation.' }
    ],
    faqs: [
      { q: 'Does it support long scripts?', a: 'Yes, multi-page code files are paginated cleanly.' }
    ],
    relatedToolSlugs: ['markdown-to-pdf', 'text-to-pdf', 'html-to-pdf']
  },

  // 38. Crop PDF
  {
    id: 'crop-pdf',
    slug: 'crop-pdf',
    name: 'Crop PDF',
    shortDesc: 'Interactive canvas crop box to trim margins, remove unwanted borders, or zoom into content.',
    metaTitle: 'Crop PDF Pages Online — Trim Margins & Cut Borders Free | Avatar PDF',
    metaDesc: 'Crop PDF pages online for free. Interactive crop bounding box to trim margins, cut unwanted header/footers, and resize page viewports.',
    keywords: ['crop pdf', 'trim pdf margins', 'cut pdf borders', 'crop pdf pages online'],
    category: 'organize',
    badge: 'Pro',
    icon: 'Crop',
    color: 'text-amber-500',
    bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select the document to crop.' },
      { step: 2, title: 'Adjust Crop Box', desc: 'Drag margin sliders or crop bounding box on the page preview.' },
      { step: 3, title: 'Download Cropped PDF', desc: 'Save your trimmed PDF.' }
    ],
    features: [
      { title: 'Visual Margin Sliders', desc: 'Set Top, Right, Bottom, and Left margins in millimeters or pixels.' }
    ],
    faqs: [
      { q: 'Can I apply crop to all pages at once?', a: 'Yes! Choose "Apply crop to all pages" with one click.' }
    ],
    relatedToolSlugs: ['resize-pdf', 'rotate-pdf', 'organize-pdf']
  },

  // 39. Resize PDF Pages
  {
    id: 'resize-pdf',
    slug: 'resize-pdf',
    name: 'Resize PDF Pages',
    shortDesc: 'Scale and fit PDF pages to standard paper dimensions (A4, A3, Letter, Legal, Tabloid).',
    metaTitle: 'Resize PDF Pages Online — Convert to A4, Letter, Legal Paper | Avatar PDF',
    metaDesc: 'Resize PDF page dimensions online for free. Change PDF paper size to A4, Letter, Legal, A3, or Tabloid with automatic aspect ratio scaling.',
    keywords: ['resize pdf', 'change pdf page size', 'convert pdf to a4', 'pdf letter to a4'],
    category: 'organize',
    badge: 'Fast',
    icon: 'Maximize',
    color: 'text-blue-600',
    bgGradient: 'from-blue-600/10 via-indigo-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload PDF', desc: 'Select your document.' },
      { step: 2, title: 'Select Target Page Size', desc: 'Choose A4, Letter, Legal, A3, or Tabloid.' },
      { step: 3, title: 'Download Resized PDF', desc: 'Save your consistently sized PDF.' }
    ],
    features: [
      { title: 'Standard Print Standards', desc: 'Converts US Letter to ISO A4 and vice versa.' }
    ],
    faqs: [
      { q: 'Will the content be distorted?', a: 'No, content scales proportionally with centered alignment.' }
    ],
    relatedToolSlugs: ['n-up-pdf', 'crop-pdf', 'compress-pdf']
  },

  // 40. Deskew & Scanned PDF Cleanup
  {
    id: 'deskew-pdf',
    slug: 'deskew-pdf',
    name: 'Deskew & Clean Scan',
    shortDesc: 'Enhance contrast, binarize text, and remove background noise from scanned documents.',
    metaTitle: 'Clean Scanned PDF Online — Enhance Contrast & Remove Noise | Avatar PDF',
    metaDesc: 'Clean and enhance scanned PDF documents online. Auto-adjust contrast, remove background yellowing, and sharpen scanned text.',
    keywords: ['clean scanned pdf', 'deskew pdf', 'enhance scanned document', 'remove scan noise pdf'],
    category: 'optimize',
    badge: 'OCR',
    icon: 'Sparkles',
    color: 'text-purple-500',
    bgGradient: 'from-purple-500/10 via-indigo-500/5 to-transparent',
    acceptedFiles: '.pdf',
    allowMultiple: false,
    howToSteps: [
      { step: 1, title: 'Upload Scanned PDF', desc: 'Select the faded, noisy, or yellowed scan.' },
      { step: 2, title: 'Apply Cleanup Filters', desc: 'Adjust contrast enhancement and text sharpening thresholds.' },
      { step: 3, title: 'Download Enhanced PDF', desc: 'Get a clean, high-contrast, professional scan.' }
    ],
    features: [
      { title: 'Auto-Thresholding', desc: 'Turns blurry gray backgrounds into clean pure white.' }
    ],
    faqs: [
      { q: 'Does this improve OCR recognition?', a: 'Yes! Running cleanup before OCR drastically boosts character recognition accuracy.' }
    ],
    relatedToolSlugs: ['edit-scanned-pdf', 'grayscale-pdf', 'compress-pdf']
  }
];

export const CATEGORIES: { id: string; name: string; icon: string; count: number }[] = [
  { id: 'all', name: 'All Tools', icon: 'Sparkles', count: TOOLS.length },
  { id: 'convert-to', name: 'Convert To PDF', icon: 'ArrowRightCircle', count: TOOLS.filter(t => t.category === 'convert-to').length },
  { id: 'convert-from', name: 'Convert From PDF', icon: 'ArrowLeftCircle', count: TOOLS.filter(t => t.category === 'convert-from').length },
  { id: 'organize', name: 'Organize & Pages', icon: 'Layers', count: TOOLS.filter(t => t.category === 'organize').length },
  { id: 'optimize', name: 'Optimize & Compress', icon: 'Zap', count: TOOLS.filter(t => t.category === 'optimize').length },
  { id: 'edit-scan', name: 'Edit & Scanned OCR', icon: 'Edit3', count: TOOLS.filter(t => t.category === 'edit-scan').length },
  { id: 'security', name: 'Security & Sign', icon: 'ShieldCheck', count: TOOLS.filter(t => t.category === 'security').length },
  { id: 'advanced', name: 'Advanced Utilities', icon: 'Cpu', count: TOOLS.filter(t => t.category === 'advanced').length },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  const cleanSlug = slug.replace(/^\//, '').trim();
  return TOOLS.find(t => t.slug === cleanSlug || t.id === cleanSlug);
}
