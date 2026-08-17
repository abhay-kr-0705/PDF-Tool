import { 
  PDFDocument, 
  rgb, 
  degrees, 
  StandardFonts, 
  PageSizes, 
  degrees as deg,
  PDFName,
  PDFArray
} from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { 
  WatermarkSettings, 
  PageNumberSettings, 
  EncryptionSettings, 
  MetadataSettings,
  PdfPagePreview,
  AnnotationObject,
  NUpSettings,
  CleanBgWatermarkSettings
} from '../types';
import { hexToRgb } from './fileHelpers';

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

/**
 * Load PDF.js document from ArrayBuffer
 */
export async function loadPdfJsDoc(buffer: ArrayBuffer) {
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
  return await loadingTask.promise;
}

/**
 * Render a single PDF page to an HTML5 Canvas
 */
export async function renderPageToCanvas(
  pdfJsDoc: pdfjsLib.PDFDocumentProxy, 
  pageNumber: number, 
  scale = 1.5
): Promise<HTMLCanvasElement> {
  const page = await pdfJsDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not create canvas context');

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: context,
    viewport: viewport
  }).promise;

  return canvas;
}

/**
 * Generate preview thumbnails for all or first N pages of a PDF
 */
export async function generatePdfThumbnails(
  buffer: ArrayBuffer, 
  maxPages = 100,
  sourceFileId?: string
): Promise<PdfPagePreview[]> {
  const pdfJsDoc = await loadPdfJsDoc(buffer);
  const total = Math.min(pdfJsDoc.numPages, maxPages);
  const previews: PdfPagePreview[] = [];

  for (let i = 1; i <= total; i++) {
    const canvas = await renderPageToCanvas(pdfJsDoc, i, 0.4);
    previews.push({
      pageNumber: i,
      thumbnailUrl: canvas.toDataURL('image/jpeg', 0.8),
      rotation: 0,
      selected: true,
      width: canvas.width,
      height: canvas.height,
      sourceFileId,
      sourcePageIndex: i - 1
    });
  }

  return previews;
}

/**
 * Merge multiple PDF buffers into a single PDF
 */
export async function mergePdfs(buffers: ArrayBuffer[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const buffer of buffers) {
    const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Advanced Merge: Combine selected pages from multiple PDFs and optionally insert images
 */
export interface AdvancedMergeItem {
  type: 'pdf-page' | 'image';
  pdfBuffer?: ArrayBuffer;
  pageIndex?: number; // 0-indexed
  imageFile?: File;
  imageDataUrl?: string;
  rotation?: number;
}

export async function mergePdfsAdvanced(items: AdvancedMergeItem[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  // Cache loaded PDFDocuments to avoid re-parsing same buffer
  const docCache = new Map<ArrayBuffer, PDFDocument>();

  for (const item of items) {
    if (item.type === 'pdf-page' && item.pdfBuffer && item.pageIndex !== undefined) {
      let srcDoc = docCache.get(item.pdfBuffer);
      if (!srcDoc) {
        srcDoc = await PDFDocument.load(item.pdfBuffer, { ignoreEncryption: true });
        docCache.set(item.pdfBuffer, srcDoc);
      }
      if (item.pageIndex >= 0 && item.pageIndex < srcDoc.getPageCount()) {
        const [copiedPage] = await mergedPdf.copyPages(srcDoc, [item.pageIndex]);
        if (item.rotation) {
          const cur = copiedPage.getRotation().angle;
          copiedPage.setRotation(deg((cur + item.rotation) % 360));
        }
        mergedPdf.addPage(copiedPage);
      }
    } else if (item.type === 'image' && (item.imageFile || item.imageDataUrl)) {
      let embeddedImg;
      if (item.imageFile) {
        const imgBuffer = await item.imageFile.arrayBuffer();
        if (item.imageFile.type.includes('png') || item.imageFile.name.toLowerCase().endsWith('.png')) {
          embeddedImg = await mergedPdf.embedPng(imgBuffer);
        } else {
          embeddedImg = await mergedPdf.embedJpg(imgBuffer);
        }
      } else if (item.imageDataUrl) {
        const base64 = item.imageDataUrl.split(',')[1];
        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        if (item.imageDataUrl.includes('png')) {
          embeddedImg = await mergedPdf.embedPng(bytes);
        } else {
          embeddedImg = await mergedPdf.embedJpg(bytes);
        }
      }

      if (embeddedImg) {
        const imgW = embeddedImg.width;
        const imgH = embeddedImg.height;
        const pageW = PageSizes.A4[0];
        const pageH = PageSizes.A4[1];
        const margin = 20;
        const scale = Math.min((pageW - margin * 2) / imgW, (pageH - margin * 2) / imgH);
        const drawW = imgW * scale;
        const drawH = imgH * scale;

        const newPg = mergedPdf.addPage([pageW, pageH]);
        newPg.drawImage(embeddedImg, {
          x: (pageW - drawW) / 2,
          y: (pageH - drawH) / 2,
          width: drawW,
          height: drawH
        });
      }
    }
  }

  return await mergedPdf.save();
}

/**
 * Split a PDF by page ranges or extract specific pages
 */
export async function splitPdf(
  buffer: ArrayBuffer, 
  pageRanges: number[][]
): Promise<{ filename: string; data: Uint8Array }[]> {
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const results: { filename: string; data: Uint8Array }[] = [];

  for (let i = 0; i < pageRanges.length; i++) {
    const range = pageRanges[i];
    const newDoc = await PDFDocument.create();
    const zeroIndexed = range.map(p => p - 1).filter(p => p >= 0 && p < srcDoc.getPageCount());
    
    if (zeroIndexed.length > 0) {
      const copied = await newDoc.copyPages(srcDoc, zeroIndexed);
      copied.forEach(p => newDoc.addPage(p));
      const data = await newDoc.save();
      const filename = `split_part_${i + 1}_pages_${range[0]}-${range[range.length - 1]}.pdf`;
      results.push({ filename, data });
    }
  }

  return results;
}

/**
 * Rotate PDF pages by 90, 180, or 270 degrees
 */
export async function rotatePdf(
  buffer: ArrayBuffer, 
  rotations: Record<number, number> | number
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const pages = doc.getPages();

  pages.forEach((page, index) => {
    const pageNum = index + 1;
    const additionalAngle = typeof rotations === 'number' ? rotations : (rotations[pageNum] || 0);
    if (additionalAngle !== 0) {
      const currentAngle = page.getRotation().angle;
      page.setRotation(deg((currentAngle + additionalAngle) % 360));
    }
  });

  return await doc.save();
}

/**
 * Delete specified pages from PDF
 */
export async function deletePdfPages(
  buffer: ArrayBuffer, 
  pagesToDelete: number[]
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const total = doc.getPageCount();
  const deleteSet = new Set(pagesToDelete);

  for (let i = total - 1; i >= 0; i--) {
    if (deleteSet.has(i + 1)) {
      doc.removePage(i);
    }
  }

  return await doc.save();
}

/**
 * Extract specified pages into a new PDF
 */
export async function extractPdfPages(
  buffer: ArrayBuffer, 
  pagesToExtract: number[]
): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();
  
  const validZeroIndices = pagesToExtract
    .map(p => p - 1)
    .filter(p => p >= 0 && p < srcDoc.getPageCount());

  const copied = await newDoc.copyPages(srcDoc, validZeroIndices);
  copied.forEach(p => newDoc.addPage(p));

  return await newDoc.save();
}

/**
 * Reorder PDF pages according to new 1-indexed order array
 */
export async function reorderPdfPages(
  buffer: ArrayBuffer, 
  newOrder: number[]
): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();
  
  const validIndices = newOrder
    .map(p => p - 1)
    .filter(p => p >= 0 && p < srcDoc.getPageCount());

  const copied = await newDoc.copyPages(srcDoc, validIndices);
  copied.forEach(p => newDoc.addPage(p));

  return await newDoc.save();
}

/**
 * Add Watermark (Text or Image) to PDF
 */
export async function addWatermarkToPdf(
  buffer: ArrayBuffer, 
  settings: WatermarkSettings
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages = doc.getPages();
  const { r, g, b } = hexToRgb(settings.fontColor || '#6366f1');

  let embeddedImage: any = null;
  if (settings.type === 'image' && settings.imageFile) {
    const imgBuffer = await settings.imageFile.arrayBuffer();
    if (settings.imageFile.type.includes('png')) {
      embeddedImage = await doc.embedPng(imgBuffer);
    } else {
      embeddedImage = await doc.embedJpg(imgBuffer);
    }
  }

  pages.forEach(page => {
    const { width, height } = page.getSize();

    if (settings.type === 'text' && settings.text) {
      const text = settings.text;
      const size = settings.fontSize || 48;
      const textWidth = font.widthOfTextAtSize(text, size);
      const textHeight = font.heightAtSize(size);

      if (settings.position === 'tiled') {
        const stepX = textWidth + 80;
        const stepY = textHeight + 80;
        for (let x = 0; x < width + stepX; x += stepX) {
          for (let y = 0; y < height + stepY; y += stepY) {
            page.drawText(text, {
              x,
              y,
              size: size * 0.7,
              font,
              color: rgb(r, g, b),
              opacity: settings.opacity || 0.25,
              rotate: degrees(settings.rotation || 45)
            });
          }
        }
      } else {
        let x = (width - textWidth) / 2;
        let y = (height - textHeight) / 2;

        if (settings.position === 'top-left') { x = 40; y = height - 60; }
        if (settings.position === 'top-right') { x = width - textWidth - 40; y = height - 60; }
        if (settings.position === 'bottom-left') { x = 40; y = 40; }
        if (settings.position === 'bottom-right') { x = width - textWidth - 40; y = 40; }

        page.drawText(text, {
          x,
          y,
          size,
          font,
          color: rgb(r, g, b),
          opacity: settings.opacity || 0.35,
          rotate: degrees(settings.position === 'center' ? (settings.rotation || 45) : 0)
        });
      }
    } else if (embeddedImage) {
      const imgDims = embeddedImage.scale(0.5);
      page.drawImage(embeddedImage, {
        x: (width - imgDims.width) / 2,
        y: (height - imgDims.height) / 2,
        width: imgDims.width,
        height: imgDims.height,
        opacity: settings.opacity || 0.35,
        rotate: degrees(settings.rotation || 0)
      });
    }
  });

  return await doc.save();
}

/**
 * Add Page Numbers to PDF
 */
export async function addPageNumbersToPdf(
  buffer: ArrayBuffer, 
  settings: PageNumberSettings
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  const total = pages.length;
  const { r, g, b } = hexToRgb(settings.color || '#475569');
  const size = settings.fontSize || 10;

  pages.forEach((page, index) => {
    const pageNum = index + 1;
    if (pageNum < (settings.startPage || 1)) return;

    let text = `${pageNum}`;
    if (settings.format === 'page-of-total') {
      text = `Page ${pageNum} of ${total}`;
    } else if (settings.format === 'doc-title' && settings.prefix) {
      text = `${settings.prefix} - ${pageNum}`;
    } else if (settings.prefix) {
      text = `${settings.prefix} ${pageNum}`;
    }

    const textWidth = font.widthOfTextAtSize(text, size);
    const { width, height } = page.getSize();
    const margin = 24;

    let x = (width - textWidth) / 2;
    let y = margin;

    if (settings.position === 'bottom-left') { x = margin; y = margin; }
    if (settings.position === 'bottom-right') { x = width - textWidth - margin; y = margin; }
    if (settings.position === 'top-center') { x = (width - textWidth) / 2; y = height - margin - size; }
    if (settings.position === 'top-left') { x = margin; y = height - margin - size; }
    if (settings.position === 'top-right') { x = width - textWidth - margin; y = height - margin - size; }

    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(r, g, b)
    });
  });

  return await doc.save();
}

/**
 * Read and extract all text from a PDF
 */
export async function extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
  const pdfJsDoc = await loadPdfJsDoc(buffer);
  const total = pdfJsDoc.numPages;
  const textPieces: string[] = [];

  for (let i = 1; i <= total; i++) {
    const page = await pdfJsDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str || '')
      .join(' ');
    textPieces.push(`--- Page ${i} ---\n${pageText}\n`);
  }

  return textPieces.join('\n');
}

/**
 * Extract all embedded images from a PDF into a ZIP archive
 */
export async function extractImagesFromPdf(buffer: ArrayBuffer): Promise<Blob> {
  const pdfJsDoc = await loadPdfJsDoc(buffer);
  const zip = new JSZip();
  let imageCounter = 1;

  for (let pageNum = 1; pageNum <= pdfJsDoc.numPages; pageNum++) {
    const page = await pdfJsDoc.getPage(pageNum);
    const operatorList = await page.getOperatorList();
    
    for (let i = 0; i < operatorList.fnArray.length; i++) {
      if (
        operatorList.fnArray[i] === pdfjsLib.OPS.paintImageXObject || 
        operatorList.fnArray[i] === pdfjsLib.OPS.paintInlineImageXObject
      ) {
        const objId = operatorList.argsArray[i][0];
        try {
          const imgObj = await page.objs.get(objId);
          if (imgObj && imgObj.data) {
            const canvas = document.createElement('canvas');
            canvas.width = imgObj.width;
            canvas.height = imgObj.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              const imgData = ctx.createImageData(imgObj.width, imgObj.height);
              if (imgObj.data.length === imgObj.width * imgObj.height * 4) {
                imgData.data.set(imgObj.data);
              } else {
                let srcIdx = 0;
                for (let p = 0; p < imgData.data.length; p += 4) {
                  imgData.data[p] = imgObj.data[srcIdx] || 0;
                  imgData.data[p + 1] = imgObj.data[srcIdx + 1] || 0;
                  imgData.data[p + 2] = imgObj.data[srcIdx + 2] || 0;
                  imgData.data[p + 3] = 255;
                  srcIdx += 3;
                }
              }
              ctx.putImageData(imgData, 0, 0);
              const dataUrl = canvas.toDataURL('image/png');
              const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
              zip.file(`image_p${pageNum}_${imageCounter++}.png`, base64Data, { base64: true });
            }
          }
        } catch (e) {
          console.warn('Could not extract image object', e);
        }
      }
    }
  }

  if (imageCounter === 1) {
    for (let i = 1; i <= pdfJsDoc.numPages; i++) {
      const canvas = await renderPageToCanvas(pdfJsDoc, i, 2.0);
      const dataUrl = canvas.toDataURL('image/png');
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      zip.file(`extracted_page_${i}.png`, base64Data, { base64: true });
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Get & Set PDF Metadata
 */
export async function getPdfMetadata(buffer: ArrayBuffer): Promise<MetadataSettings> {
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const kw = doc.getKeywords();
  const keywordsStr = Array.isArray(kw) ? kw.join(', ') : (typeof kw === 'string' ? kw : '');
  return {
    title: doc.getTitle() || '',
    author: doc.getAuthor() || '',
    subject: doc.getSubject() || '',
    keywords: keywordsStr,
    creator: doc.getCreator() || '',
    producer: doc.getProducer() || ''
  };
}

export async function setPdfMetadata(
  buffer: ArrayBuffer, 
  metadata: MetadataSettings
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  if (metadata.title) doc.setTitle(metadata.title);
  if (metadata.author) doc.setAuthor(metadata.author);
  if (metadata.subject) doc.setSubject(metadata.subject);
  if (metadata.keywords) doc.setKeywords(metadata.keywords.split(',').map(k => k.trim()));
  if (metadata.creator) doc.setCreator(metadata.creator);
  if (metadata.producer) doc.setProducer(metadata.producer);
  doc.setModificationDate(new Date());

  return await doc.save();
}

/**
 * Convert PDF pages to Grayscale
 */
export async function convertPdfToGrayscale(buffer: ArrayBuffer): Promise<Uint8Array> {
  const pdfJsDoc = await loadPdfJsDoc(buffer);
  const newDoc = await PDFDocument.create();

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const canvas = await renderPageToCanvas(pdfJsDoc, i, 2.0);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      for (let j = 0; j < d.length; j += 4) {
        const gray = 0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2];
        d[j] = gray;
        d[j + 1] = gray;
        d[j + 2] = gray;
      }
      ctx.putImageData(imgData, 0, 0);
    }
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const embeddedImg = await newDoc.embedJpg(dataUrl);
    const page = newDoc.addPage([canvas.width / 2, canvas.height / 2]);
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: canvas.width / 2,
      height: canvas.height / 2
    });
  }

  return await newDoc.save();
}

/**
 * Invert PDF Colors (Night Mode / High Contrast)
 */
export async function invertPdfColors(buffer: ArrayBuffer): Promise<Uint8Array> {
  const pdfJsDoc = await loadPdfJsDoc(buffer);
  const newDoc = await PDFDocument.create();

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const canvas = await renderPageToCanvas(pdfJsDoc, i, 2.0);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      for (let j = 0; j < d.length; j += 4) {
        d[j] = 255 - d[j];
        d[j + 1] = 255 - d[j + 1];
        d[j + 2] = 255 - d[j + 2];
      }
      ctx.putImageData(imgData, 0, 0);
    }
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    const embeddedImg = await newDoc.embedJpg(dataUrl);
    const page = newDoc.addPage([canvas.width / 2, canvas.height / 2]);
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: canvas.width / 2,
      height: canvas.height / 2
    });
  }

  return await newDoc.save();
}

/**
 * Clean Background, Invert, or Erase Watermarks/Logos
 */
export async function cleanAndRemoveWatermarksFromPdf(
  buffer: ArrayBuffer,
  settings: CleanBgWatermarkSettings
): Promise<Uint8Array> {
  const pdfJsDoc = await loadPdfJsDoc(buffer);
  const newDoc = await PDFDocument.create();

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const canvas = await renderPageToCanvas(pdfJsDoc, i, 2.0);
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // 1. Erase marked regions (watermarks / logos / stamps)
      const pageRegions = settings.eraseRegions.filter(r => r.pageNumber === i);
      pageRegions.forEach(reg => {
        ctx.fillStyle = reg.color || '#ffffff';
        // scale is 2.0
        ctx.fillRect(reg.x * 2, reg.y * 2, reg.width * 2, reg.height * 2);
      });

      // 2. Clean Background or Invert
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      const threshold = settings.bgThreshold || 215;
      const contrast = settings.contrast || 1.1;
      const brightness = settings.brightness || 0;

      for (let j = 0; j < d.length; j += 4) {
        let r = d[j];
        let g = d[j + 1];
        let b = d[j + 2];

        if (settings.mode === 'invert') {
          d[j] = 255 - r;
          d[j + 1] = 255 - g;
          d[j + 2] = 255 - b;
        } else if (settings.mode === 'clean-bg') {
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum > threshold) {
            // Whiten tinted or grayish background
            d[j] = 255;
            d[j + 1] = 255;
            d[j + 2] = 255;
          } else {
            // Sharpen darker text
            r = Math.min(255, Math.max(0, (r - 128) * contrast + 128 + brightness));
            g = Math.min(255, Math.max(0, (g - 128) * contrast + 128 + brightness));
            b = Math.min(255, Math.max(0, (b - 128) * contrast + 128 + brightness));
            d[j] = r;
            d[j + 1] = g;
            d[j + 2] = b;
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    const embeddedImg = await newDoc.embedJpg(dataUrl);
    const page = newDoc.addPage([canvas.width / 2, canvas.height / 2]);
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: canvas.width / 2,
      height: canvas.height / 2
    });
  }

  return await newDoc.save();
}

/**
 * Standard paper size dimensions in points [width, height] in Portrait
 */
export const PAPER_DIMENSIONS: Record<string, [number, number]> = {
  'A1': [1683.78, 2383.94],
  'A2': [1190.55, 1683.78],
  'A3': [841.89, 1190.55],
  'A4': [595.28, 841.89],
  'A5': [419.53, 595.28],
  'Letter': [612.0, 792.0],
  'Legal': [612.0, 1008.0],
  'Tabloid': [792.0, 1224.0]
};

export async function nUpPdf(buffer: ArrayBuffer, pagesPerSheet: 2 | 4 | 8 = 2): Promise<Uint8Array> {
  return await nUpAdvancedPdf(buffer, {
    pagesPerSheet: pagesPerSheet === 8 ? 8 : (pagesPerSheet === 4 ? 4 : 2),
    paperSize: 'A4',
    orientation: 'portrait',
    margin: 20,
    padding: 8,
    drawBorders: true,
    addPageNumbers: true,
    fitMode: 'contain'
  });
}

/**
 * Advanced N-Up Imposition (Multiple pages on one sheet with A1-A5 sizes, landscape/portrait, margin/padding)
 */
export async function nUpAdvancedPdf(
  buffer: ArrayBuffer,
  settings: NUpSettings
): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();
  const font = await newDoc.embedFont(StandardFonts.Helvetica);
  const totalPages = srcDoc.getPageCount();

  const baseDims = PAPER_DIMENSIONS[settings.paperSize] || PAPER_DIMENSIONS['A4'];
  const sheetWidth = settings.orientation === 'landscape' ? baseDims[1] : baseDims[0];
  const sheetHeight = settings.orientation === 'landscape' ? baseDims[0] : baseDims[1];

  let cols = 1;
  let rows = 2;
  if (settings.pagesPerSheet === 2) {
    cols = settings.orientation === 'landscape' ? 2 : 1;
    rows = settings.orientation === 'landscape' ? 1 : 2;
  } else if (settings.pagesPerSheet === 4) {
    cols = 2; rows = 2;
  } else if (settings.pagesPerSheet === 6) {
    cols = settings.orientation === 'landscape' ? 3 : 2;
    rows = settings.orientation === 'landscape' ? 2 : 3;
  } else if (settings.pagesPerSheet === 8) {
    cols = settings.orientation === 'landscape' ? 4 : 2;
    rows = settings.orientation === 'landscape' ? 2 : 4;
  } else if (settings.pagesPerSheet === 9) {
    cols = 3; rows = 3;
  } else if (settings.pagesPerSheet === 16) {
    cols = 4; rows = 4;
  }

  const margin = settings.margin || 20;
  const padding = settings.padding || 8;

  const usableWidth = sheetWidth - (margin * 2) - (padding * (cols - 1));
  const usableHeight = sheetHeight - (margin * 2) - (padding * (rows - 1));

  const cellWidth = usableWidth / cols;
  const cellHeight = usableHeight / rows;

  for (let i = 0; i < totalPages; i += settings.pagesPerSheet) {
    const sheetPage = newDoc.addPage([sheetWidth, sheetHeight]);

    for (let slot = 0; slot < settings.pagesPerSheet; slot++) {
      const pageIndex = i + slot;
      if (pageIndex >= totalPages) break;

      const [embeddedPage] = await newDoc.embedPdf(srcDoc, [pageIndex]);
      const col = slot % cols;
      const row = rows - 1 - Math.floor(slot / cols);

      const scale = Math.min(
        cellWidth / embeddedPage.width,
        cellHeight / embeddedPage.height
      );

      const drawWidth = embeddedPage.width * scale;
      const drawHeight = embeddedPage.height * scale;

      const cellX = margin + col * (cellWidth + padding);
      const cellY = margin + row * (cellHeight + padding);

      const posX = cellX + (cellWidth - drawWidth) / 2;
      const posY = cellY + (cellHeight - drawHeight) / 2;

      sheetPage.drawPage(embeddedPage, {
        x: posX,
        y: posY,
        width: drawWidth,
        height: drawHeight
      });

      if (settings.drawBorders) {
        sheetPage.drawRectangle({
          x: cellX,
          y: cellY,
          width: cellWidth,
          height: cellHeight,
          borderColor: rgb(0.7, 0.7, 0.7),
          borderWidth: 0.75
        });
      }

      if (settings.addPageNumbers) {
        const pageNumText = `${pageIndex + 1}`;
        sheetPage.drawText(pageNumText, {
          x: cellX + cellWidth / 2 - 4,
          y: cellY + 4,
          size: 8,
          font,
          color: rgb(0.4, 0.4, 0.4)
        });
      }
    }
  }

  return await newDoc.save();
}

/**
 * Flatten PDF
 */
export async function flattenPdf(buffer: ArrayBuffer): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const form = doc.getForm();
  try {
    form.flatten();
  } catch (e) {
    console.warn('Form flattening note:', e);
  }
  return await doc.save();
}

/**
 * Resize PDF pages to target standard size
 */
export async function resizePdfPages(
  buffer: ArrayBuffer, 
  targetSize: 'A4' | 'A1' | 'A2' | 'A3' | 'A5' | 'Letter' | 'Legal' | 'Tabloid'
): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  const targetDims = PAPER_DIMENSIONS[targetSize] || PageSizes.A4;

  for (let i = 0; i < srcDoc.getPageCount(); i++) {
    const [embeddedPage] = await newDoc.embedPdf(srcDoc, [i]);
    const page = newDoc.addPage(targetDims);
    
    const scale = Math.min(
      targetDims[0] / embeddedPage.width,
      targetDims[1] / embeddedPage.height
    );

    const w = embeddedPage.width * scale;
    const h = embeddedPage.height * scale;
    const x = (targetDims[0] - w) / 2;
    const y = (targetDims[1] - h) / 2;

    page.drawPage(embeddedPage, {
      x,
      y,
      width: w,
      height: h
    });
  }

  return await newDoc.save();
}

/**
 * Apply canvas annotations, text, shapes, stamps, and signatures onto PDF
 */
export async function applyAnnotationsToPdf(
  buffer: ArrayBuffer, 
  annotations: AnnotationObject[]
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();

  for (const annot of annotations) {
    const pageIndex = annot.pageNumber - 1;
    if (pageIndex < 0 || pageIndex >= pages.length) continue;
    const page = pages[pageIndex];
    const { height: pageHeight } = page.getSize();
    const { r, g, b } = hexToRgb(annot.color || '#000000');

    const pdfY = pageHeight - annot.y - annot.height;

    if (annot.type === 'text' && annot.text) {
      page.drawText(annot.text, {
        x: annot.x,
        y: pageHeight - annot.y - (annot.fontSize || 14),
        size: annot.fontSize || 14,
        font: annot.fontWeight === 'bold' ? font : regularFont,
        color: rgb(r, g, b),
        opacity: annot.opacity || 1
      });
    } else if (annot.type === 'rect' || annot.type === 'redact') {
      page.drawRectangle({
        x: annot.x,
        y: pdfY,
        width: annot.width,
        height: annot.height,
        color: annot.type === 'redact' ? rgb(0, 0, 0) : (annot.fillColor ? rgb(hexToRgb(annot.fillColor).r, hexToRgb(annot.fillColor).g, hexToRgb(annot.fillColor).b) : undefined),
        borderColor: rgb(r, g, b),
        borderWidth: annot.strokeWidth || 1,
        opacity: annot.type === 'redact' ? 1 : (annot.opacity || 1)
      });
    } else if (annot.type === 'highlight') {
      page.drawRectangle({
        x: annot.x,
        y: pdfY,
        width: annot.width,
        height: annot.height,
        color: rgb(1, 0.9, 0.2),
        opacity: 0.35
      });
    } else if (annot.type === 'stamp' && annot.text) {
      page.drawRectangle({
        x: annot.x,
        y: pdfY,
        width: annot.width,
        height: annot.height,
        borderColor: rgb(r, g, b),
        borderWidth: 2,
        opacity: 0.9
      });
      page.drawText(annot.text, {
        x: annot.x + 8,
        y: pdfY + (annot.height - (annot.fontSize || 16)) / 2,
        size: annot.fontSize || 16,
        font,
        color: rgb(r, g, b),
        opacity: 0.9
      });
    } else if ((annot.type === 'signature' || annot.type === 'image') && annot.imageData) {
      const imgBuffer = Uint8Array.from(atob(annot.imageData.split(',')[1] || ''), c => c.charCodeAt(0));
      let embeddedImg;
      if (annot.imageData.includes('image/png') || annot.imageData.startsWith('data:image/png')) {
        embeddedImg = await doc.embedPng(imgBuffer);
      } else {
        embeddedImg = await doc.embedJpg(imgBuffer);
      }
      page.drawImage(embeddedImg, {
        x: annot.x,
        y: pdfY,
        width: annot.width,
        height: annot.height,
        opacity: annot.opacity || 1
      });
    }
  }

  return await doc.save();
}
