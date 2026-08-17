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
  AnnotationObject
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
  maxPages = 100
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
      height: canvas.height
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
 * Split a PDF by page ranges (e.g. [[1,2], [3,5]]) or extract specific pages
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

  // Remove pages from highest index to lowest
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

  // Fallback: If no raw XObjects were extracted, rasterize high-res pages as images
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
 * Flatten PDF (burn interactive fields into flat page streams)
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
 * N-Up / Booklet Imposition layout (2, 4, 8 pages per sheet)
 */
export async function nUpPdf(
  buffer: ArrayBuffer, 
  pagesPerSheet: 2 | 4 | 8 | 16
): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();
  const totalPages = srcDoc.getPageCount();

  const sheetSize = PageSizes.A4; // [595.28, 841.89]
  const sheetWidth = sheetSize[0];
  const sheetHeight = sheetSize[1];

  let cols = 1;
  let rows = 2;
  if (pagesPerSheet === 4) { cols = 2; rows = 2; }
  if (pagesPerSheet === 8) { cols = 2; rows = 4; }
  if (pagesPerSheet === 16) { cols = 4; rows = 4; }

  const cellWidth = sheetWidth / cols;
  const cellHeight = sheetHeight / rows;

  for (let i = 0; i < totalPages; i += pagesPerSheet) {
    const sheetPage = newDoc.addPage(sheetSize);
    
    for (let slot = 0; slot < pagesPerSheet; slot++) {
      const pageIndex = i + slot;
      if (pageIndex >= totalPages) break;

      const [embeddedPage] = await newDoc.embedPdf(srcDoc, [pageIndex]);
      const col = slot % cols;
      const row = rows - 1 - Math.floor(slot / cols);

      const scale = Math.min(
        (cellWidth * 0.92) / embeddedPage.width,
        (cellHeight * 0.92) / embeddedPage.height
      );

      const drawWidth = embeddedPage.width * scale;
      const drawHeight = embeddedPage.height * scale;

      const posX = col * cellWidth + (cellWidth - drawWidth) / 2;
      const posY = row * cellHeight + (cellHeight - drawHeight) / 2;

      sheetPage.drawPage(embeddedPage, {
        x: posX,
        y: posY,
        width: drawWidth,
        height: drawHeight
      });
    }
  }

  return await newDoc.save();
}

/**
 * Resize PDF pages to target standard size
 */
export async function resizePdfPages(
  buffer: ArrayBuffer, 
  targetSize: 'A4' | 'A3' | 'Letter' | 'Legal' | 'Tabloid'
): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const newDoc = await PDFDocument.create();

  let targetDims = PageSizes.A4;
  if (targetSize === 'A3') targetDims = PageSizes.A3;
  if (targetSize === 'Letter') targetDims = PageSizes.Letter;
  if (targetSize === 'Legal') targetDims = [612, 1008];
  if (targetSize === 'Tabloid') targetDims = [792, 1224];

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

    // PDF coordinate system starts at bottom-left, while browser canvas starts at top-left
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
