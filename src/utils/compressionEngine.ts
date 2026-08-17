import { PDFDocument } from 'pdf-lib';
import { CompressionSettings, CompressionLevel } from '../types';
import { loadPdfJsDoc, renderPageToCanvas } from './pdfEngine';

export interface CompressionResult {
  data: Uint8Array;
  originalSize: number;
  compressedSize: number;
  savingsPercentage: number;
}

/**
 * Smart Multi-level PDF Compression
 */
export async function compressPdf(
  buffer: ArrayBuffer, 
  settings: CompressionSettings
): Promise<CompressionResult> {
  const originalSize = buffer.byteLength;
  let compressedData: Uint8Array;

  if (settings.level === 'lossless') {
    // Lossless: Re-encode object streams, remove unused references, defragment
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    
    if (settings.removeMetadata) {
      doc.setTitle('');
      doc.setAuthor('');
      doc.setSubject('');
      doc.setKeywords([]);
      doc.setProducer('DocuVortix Optimizer');
      doc.setCreator('DocuVortix Engine');
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
    // Balanced, Extreme, or Scanned: Re-rasterize high-res imagery and downsample
    const pdfJsDoc = await loadPdfJsDoc(buffer);
    const newDoc = await PDFDocument.create();

    let scale = 1.5; // ~150 DPI
    let quality = 0.82;

    if (settings.level === 'extreme') {
      scale = 1.0; // ~96 DPI
      quality = 0.65;
    } else if (settings.level === 'scanned') {
      scale = 1.5;
      quality = 0.75;
    }

    for (let i = 1; i <= pdfJsDoc.numPages; i++) {
      const canvas = await renderPageToCanvas(pdfJsDoc, i, scale);
      const ctx = canvas.getContext('2d');

      if (settings.grayscale || settings.level === 'scanned') {
        if (ctx) {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const d = imgData.data;
          for (let j = 0; j < d.length; j += 4) {
            let gray = 0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2];
            if (settings.level === 'scanned') {
              // High contrast binarization for crisp text
              gray = gray > 140 ? 255 : (gray < 80 ? 0 : gray);
            }
            d[j] = gray;
            d[j + 1] = gray;
            d[j + 2] = gray;
          }
          ctx.putImageData(imgData, 0, 0);
        }
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

    compressedData = await newDoc.save({ useObjectStreams: true });
  }

  const compressedSize = compressedData.byteLength;
  const savings = Math.max(0, originalSize - compressedSize);
  const savingsPercentage = Math.round((savings / originalSize) * 100);

  return {
    data: compressedData,
    originalSize,
    compressedSize,
    savingsPercentage
  };
}
