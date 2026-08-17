import saveAs from 'file-saver';

export function formatBytes(bytes: number, decimals = 2): string {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

export async function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  saveAs(blob, filename);
}

export function downloadUint8Array(data: Uint8Array, filename: string, mimeType = 'application/pdf') {
  const blob = new Blob([data as unknown as BlobPart], { type: mimeType });
  saveAs(blob, filename);
}

export function downloadText(text: string, filename: string, mimeType = 'text/plain') {
  const blob = new Blob([text], { type: mimeType });
  saveAs(blob, filename);
}

export function sanitizeFilename(name: string, newExtension?: string): string {
  const baseName = name.substring(0, name.lastIndexOf('.')) || name;
  const cleanBase = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
  if (newExtension) {
    return `${cleanBase}.${newExtension.replace(/^\./, '')}`;
  }
  return cleanBase;
}

export function parsePageRange(rangeStr: string, totalPages: number): number[] {
  if (!rangeStr.trim()) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set<number>();
  const parts = rangeStr.split(',');
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.max(1, Math.min(start, end));
        const max = Math.min(totalPages, Math.max(start, end));
        for (let i = min; i <= max; i++) {
          pages.add(i);
        }
      }
    } else {
      const page = parseInt(trimmed, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        pages.add(page);
      }
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255 || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255 || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255 || 0;
  return { r, g, b };
}
