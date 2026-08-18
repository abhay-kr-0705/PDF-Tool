import { PDFDocument } from 'pdf-lib';
import { CompressionSettings, CompressionLevel, CompressionMode } from '../types';
import { loadPdfJsDoc, renderPageToCanvas } from './pdfEngine';

export interface CompressionResult {
  data: Uint8Array;
  originalSize: number;
  compressedSize: number;
  savingsPercentage: number;
  targetHit?: boolean;
}

/**
 * Perform single-pass rasterization compression
 */
async function compressWithParams(
  pdfJsDoc: any,
  scale: number,
  quality: number,
  grayscale: boolean,
  removeMetadata: boolean
): Promise<Uint8Array> {
  const newDoc = await PDFDocument.create();

  if (removeMetadata) {
    newDoc.setTitle('');
    newDoc.setAuthor('');
    newDoc.setSubject('');
    newDoc.setKeywords([]);
    newDoc.setProducer('Avatar PDF Optimizer');
    newDoc.setCreator('Avatar PDF Engine');
  }

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const canvas = await renderPageToCanvas(pdfJsDoc, i, scale);
    const ctx = canvas.getContext('2d');

    if (grayscale && ctx) {
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

    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    const embeddedImg = await newDoc.embedJpg(dataUrl);
    const pageWidth = canvas.width / scale;
    const pageHeight = canvas.height / scale;

    const page = newDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight
    });
  }

  return await newDoc.save({ useObjectStreams: true });
}

/**
 * Smart Multi-level & Target Size PDF Compression Engine
 */
export async function compressPdf(
  buffer: ArrayBuffer, 
  settings: CompressionSettings
): Promise<CompressionResult> {
  const originalSize = buffer.byteLength;
  let compressedData: Uint8Array;
  let targetHit = false;

  // Case 1: Target File Size Mode (Retries and iterates until it fits)
  if (settings.mode === 'target-size' && settings.targetSizeKb && settings.targetSizeKb > 0) {
    const targetBytes = settings.targetSizeKb * 1024;

    // Step 1: Try Lossless first (if already under target size, preserve 100% quality)
    try {
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      if (settings.removeMetadata) {
        doc.setTitle('');
        doc.setAuthor('');
        doc.setSubject('');
        doc.setProducer('Avatar PDF Optimizer');
      }
      const losslessData = await doc.save({ useObjectStreams: true });
      if (losslessData.byteLength <= targetBytes) {
        compressedData = losslessData;
        targetHit = true;
      }
    } catch (e) {
      // Proceed to raster iterations
    }

    // Step 2: Iterative trial fitting with decreasing DPI and JPEG quality
    if (!compressedData!) {
      const pdfJsDoc = await loadPdfJsDoc(buffer);
      
      // Candidate passes: [scale, quality, grayscale]
      const passes = [
        { scale: 1.6, quality: 0.88, gray: settings.grayscale }, // High Res ~160 DPI
        { scale: 1.4, quality: 0.80, gray: settings.grayscale }, // ~140 DPI
        { scale: 1.2, quality: 0.72, gray: settings.grayscale }, // ~120 DPI
        { scale: 1.0, quality: 0.65, gray: settings.grayscale }, // ~100 DPI
        { scale: 0.85, quality: 0.55, gray: settings.grayscale }, // ~85 DPI
        { scale: 0.75, quality: 0.45, gray: true },              // ~75 DPI Grayscale
        { scale: 0.60, quality: 0.35, gray: true }               // Extreme fit
      ];

      let bestAttempt: Uint8Array | null = null;

      for (const pass of passes) {
        const attempt = await compressWithParams(
          pdfJsDoc, 
          pass.scale, 
          pass.quality, 
          pass.gray, 
          settings.removeMetadata
        );

        bestAttempt = attempt;

        if (attempt.byteLength <= targetBytes) {
          compressedData = attempt;
          targetHit = true;
          break;
        }
      }

      if (!compressedData!) {
        compressedData = bestAttempt!;
      }
    }
  } 
  // Case 2: Quality Preset Mode (One pass, predictable)
  else if (settings.level === 'lossless') {
    // Lossless: Re-encode object streams, remove unused references, defragment
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    
    if (settings.removeMetadata) {
      doc.setTitle('');
      doc.setAuthor('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setProducer('Avatar PDF Optimizer');
      doc.setCreator('Avatar PDF Engine');
    }

    if (settings.flattenForms) {
      try {
        doc.getForm().flatten();
      } catch (e) {
        // ignore
      }
    }

    // Save using maximum stream compression & object streams
    compressedData = await doc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50
    });
  } else {
    // Light (150 DPI), Balanced (110 DPI), Aggressive (72 DPI), or Scanned
    const pdfJsDoc = await loadPdfJsDoc(buffer);

    let scale = 1.5; // ~150 DPI (Light)
    let quality = 0.85;

    if (settings.level === 'balanced') {
      scale = 1.15; // ~110 DPI
      quality = 0.75;
    } else if (settings.level === 'aggressive' || settings.level === 'extreme') {
      scale = 0.8; // ~72 DPI
      quality = 0.58;
    } else if (settings.level === 'scanned') {
      scale = 1.4;
      quality = 0.75;
    }

    compressedData = await compressWithParams(
      pdfJsDoc,
      scale,
      quality,
      settings.grayscale || settings.level === 'scanned',
      settings.removeMetadata
    );
  }

  const compressedSize = compressedData.byteLength;
  const savings = Math.max(0, originalSize - compressedSize);
  const savingsPercentage = Math.round((savings / originalSize) * 100);

  return {
    data: compressedData,
    originalSize,
    compressedSize,
    savingsPercentage,
    targetHit
  };
}
