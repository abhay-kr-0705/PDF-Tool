import { createWorker } from 'tesseract.js';
import { loadPdfJsDoc, renderPageToCanvas } from './pdfEngine';
import { OcrPageResult, OcrWord } from '../types';

let workerInstance: any = null;

/**
 * Initialize Tesseract OCR worker
 */
async function getOcrWorker(language = 'eng', onProgress?: (progress: number, status: string) => void) {
  if (!workerInstance) {
    workerInstance = await createWorker(language, 1, {
      logger: (m) => {
        if (onProgress && m.progress !== undefined) {
          onProgress(Math.round((m.progress || 0) * 100), m.status || 'Recognizing text...');
        }
      }
    });
  }
  return workerInstance;
}

/**
 * Run OCR on a single Canvas or Image Data URL
 */
export async function performOcrOnImage(
  imageSource: HTMLCanvasElement | string, 
  language = 'eng',
  onProgress?: (progress: number, status: string) => void
): Promise<{ text: string; words: OcrWord[] }> {
  const worker = await getOcrWorker(language, onProgress);
  const result = await worker.recognize(imageSource);
  
  const words: OcrWord[] = (result.data.words || []).map((w: any) => ({
    text: w.text,
    confidence: w.confidence,
    bbox: {
      x0: w.bbox.x0,
      y0: w.bbox.y0,
      x1: w.bbox.x1,
      y1: w.bbox.y1
    }
  }));

  return {
    text: result.data.text,
    words
  };
}

/**
 * Run OCR across all pages of a scanned PDF document
 */
export async function performOcrOnPdf(
  pdfBuffer: ArrayBuffer,
  language = 'eng',
  onPageProgress?: (currentPage: number, totalPages: number, pagePercent: number, status: string) => void
): Promise<OcrPageResult[]> {
  const pdfJsDoc = await loadPdfJsDoc(pdfBuffer);
  const totalPages = pdfJsDoc.numPages;
  const results: OcrPageResult[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (onPageProgress) {
      onPageProgress(i, totalPages, 0, `Rendering Page ${i} for OCR...`);
    }

    const canvas = await renderPageToCanvas(pdfJsDoc, i, 2.0); // 200 DPI for high OCR accuracy
    
    const { text, words } = await performOcrOnImage(canvas, language, (progress, status) => {
      if (onPageProgress) {
        onPageProgress(i, totalPages, progress, `OCR Page ${i}/${totalPages}: ${status}`);
      }
    });

    results.push({
      pageNumber: i,
      text,
      words,
      imageWidth: canvas.width,
      imageHeight: canvas.height
    });
  }

  return results;
}

/**
 * Terminate OCR worker to free memory
 */
export async function terminateOcrWorker() {
  if (workerInstance) {
    await workerInstance.terminate();
    workerInstance = null;
  }
}
