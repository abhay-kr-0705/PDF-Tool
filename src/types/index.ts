export type ToolCategory = 
  | 'all'
  | 'convert-to'
  | 'convert-from'
  | 'organize'
  | 'optimize'
  | 'edit-scan'
  | 'security'
  | 'advanced';

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  metaTitle: string;
  metaDesc: string;
  keywords: string[];
  category: ToolCategory;
  badge?: 'Popular' | 'Lossless' | 'OCR' | 'New' | 'Pro' | 'Fast';
  icon: string;
  color: string;
  bgGradient: string;
  acceptedFiles: string; // e.g. '.pdf', '.docx,.doc', '.xlsx,.xls', '.png,.jpg,.jpeg', '*'
  allowMultiple: boolean;
  howToSteps: { step: number; title: string; desc: string }[];
  features: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  relatedToolSlugs: string[];
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  pageCount?: number;
  previewUrl?: string;
  arrayBuffer?: ArrayBuffer;
  status: 'idle' | 'processing' | 'done' | 'error';
  error?: string;
}

export interface PdfPagePreview {
  pageNumber: number;
  thumbnailUrl: string;
  rotation: number; // 0, 90, 180, 270
  selected: boolean;
  width: number;
  height: number;
}

export type CompressionLevel = 'lossless' | 'balanced' | 'extreme' | 'scanned';

export interface CompressionSettings {
  level: CompressionLevel;
  imageQuality: number; // 0.1 - 1.0
  dpi: number; // 72, 150, 300
  removeMetadata: boolean;
  flattenForms: boolean;
  grayscale: boolean;
}

export interface WatermarkSettings {
  type: 'text' | 'image';
  text: string;
  fontColor: string;
  fontSize: number;
  opacity: number; // 0.1 - 1.0
  rotation: number; // in degrees, e.g. 45
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'tiled';
  imageFile?: File;
}

export interface PageNumberSettings {
  position: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';
  format: 'page-only' | 'page-of-total' | 'doc-title';
  prefix: string;
  startPage: number;
  fontSize: number;
  color: string;
  fontFamily: 'Helvetica' | 'TimesRoman' | 'Courier';
}

export interface EncryptionSettings {
  userPassword?: string;
  ownerPassword?: string;
  allowPrinting: boolean;
  allowCopying: boolean;
  allowModifying: boolean;
}

export interface MetadataSettings {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
}

export interface AnnotationObject {
  id: string;
  type: 'text' | 'draw' | 'rect' | 'circle' | 'line' | 'arrow' | 'highlight' | 'stamp' | 'redact' | 'signature' | 'image';
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
  opacity: number;
  fillColor?: string;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  imageData?: string; // base64
  points?: { x: number; y: number }[]; // for freehand draw
}

export interface OcrWord {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export interface OcrPageResult {
  pageNumber: number;
  text: string;
  words: OcrWord[];
  imageWidth: number;
  imageHeight: number;
}
