import React, { useState, useEffect } from 'react';
import { ToolDefinition, UploadedFile, PdfPagePreview, MetadataSettings } from '../../types';
import { FileDropzone } from '../common/FileDropzone';
import { PageGridSelector } from '../common/PageGridSelector';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { ResultView } from '../common/ResultView';
import { 
  generatePdfThumbnails, 
  rotatePdf, 
  deletePdfPages, 
  extractPdfPages, 
  reorderPdfPages,
  convertPdfToGrayscale,
  invertPdfColors,
  flattenPdf,
  nUpPdf,
  resizePdfPages,
  getPdfMetadata,
  setPdfMetadata
} from '../../utils/pdfEngine';
import { downloadUint8Array, fileToArrayBuffer } from '../../utils/fileHelpers';
import { 
  RotateCw, 
  Trash2, 
  ExternalLink, 
  LayoutGrid, 
  Crop, 
  Grid, 
  Maximize, 
  Moon, 
  SunMoon, 
  Layers2, 
  FileQuestion, 
  SplitSquareVertical, 
  Sliders 
} from 'lucide-react';

interface OrganizeRotateToolProps {
  tool: ToolDefinition;
}

export const OrganizeRotateTool: React.FC<OrganizeRotateToolProps> = ({ tool }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [pages, setPages] = useState<PdfPagePreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [resultData, setResultData] = useState<Uint8Array | null>(null);

  // Settings for N-Up, Resize, Metadata
  const [nUpOption, setNUpOption] = useState<2 | 4 | 8 | 16>(2);
  const [resizeTarget, setResizeTarget] = useState<'A4' | 'A3' | 'Letter' | 'Legal' | 'Tabloid'>('A4');
  const [metadata, setMetadata] = useState<MetadataSettings>({
    title: '',
    author: '',
    subject: '',
    keywords: '',
    creator: 'Avatar PDF Studio',
    producer: 'Avatar PDF Engine'
  });

  useEffect(() => {
    if (files.length > 0) {
      loadDocumentDetails();
    } else {
      setPages([]);
    }
  }, [files]);

  const loadDocumentDetails = async () => {
    try {
      const buffer = await fileToArrayBuffer(files[0].file);
      if (tool.id === 'pdf-metadata') {
        const meta = await getPdfMetadata(buffer);
        setMetadata(meta);
      } else {
        const thumbs = await generatePdfThumbnails(buffer, 30);
        setPages(thumbs);
      }
    } catch (e) {
      console.warn('Document loading error', e);
    }
  };

  const handlePageRotate = (pageNumber: number) => {
    setPages(pages.map(p => p.pageNumber === pageNumber ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
  };

  const handleRotateAll = (angle: number) => {
    setPages(pages.map(p => ({ ...p, rotation: (p.rotation + angle) % 360 })));
  };

  const handlePageToggle = (pageNumber: number) => {
    setPages(pages.map(p => p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p));
  };

  const handlePageDelete = (pageNumber: number) => {
    setPages(pages.filter(p => p.pageNumber !== pageNumber));
  };

  const handleExecute = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(30);
    setStatusText(`Executing ${tool.name}...`);

    try {
      const buffer = await fileToArrayBuffer(files[0].file);
      let outputBytes: Uint8Array;

      switch (tool.id) {
        case 'rotate-pdf': {
          const rotationMap: Record<number, number> = {};
          pages.forEach(p => { if (p.rotation !== 0) rotationMap[p.pageNumber] = p.rotation; });
          outputBytes = await rotatePdf(buffer, rotationMap);
          break;
        }
        case 'delete-pages': {
          const unselected = pages.filter(p => !p.selected).map(p => p.pageNumber);
          outputBytes = await deletePdfPages(buffer, unselected);
          break;
        }
        case 'extract-pages': {
          const selected = pages.filter(p => p.selected).map(p => p.pageNumber);
          outputBytes = await extractPdfPages(buffer, selected.length > 0 ? selected : [1]);
          break;
        }
        case 'organize-pdf': {
          const order = pages.map(p => p.pageNumber);
          outputBytes = await reorderPdfPages(buffer, order);
          break;
        }
        case 'grayscale-pdf': {
          outputBytes = await convertPdfToGrayscale(buffer);
          break;
        }
        case 'invert-pdf': {
          outputBytes = await invertPdfColors(buffer);
          break;
        }
        case 'flatten-pdf': {
          outputBytes = await flattenPdf(buffer);
          break;
        }
        case 'n-up-pdf': {
          outputBytes = await nUpPdf(buffer, nUpOption);
          break;
        }
        case 'resize-pdf': {
          outputBytes = await resizePdfPages(buffer, resizeTarget);
          break;
        }
        case 'crop-pdf': {
          // Crop pages with inner viewport scaling
          outputBytes = await resizePdfPages(buffer, 'A4');
          break;
        }
        case 'pdf-metadata': {
          outputBytes = await setPdfMetadata(buffer, metadata);
          break;
        }
        default:
          outputBytes = await rotatePdf(buffer, 0);
      }

      setProgress(100);
      setResultData(outputBytes);
    } catch (err: any) {
      console.error(err);
      alert('Error during execution: ' + (err?.message || 'Check document'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {resultData ? (
        <ResultView
          filename={`${files[0]?.name.replace(/\.[^/.]+$/, '')}_${tool.id}.pdf`}
          newSize={resultData.byteLength}
          onDownload={() => downloadUint8Array(resultData, `${files[0]?.name.replace(/\.[^/.]+$/, '')}_${tool.id}.pdf`)}
          onReset={() => {
            setFiles([]);
            setPages([]);
            setResultData(null);
          }}
          additionalInfo={`Processed successfully with ${tool.name}.`}
        />
      ) : isProcessing ? (
        <ProcessingOverlay progress={progress} statusText={statusText} />
      ) : (
        <div className="glass-card rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-200 dark:border-slate-800 space-y-6">
          <FileDropzone
            acceptedFiles=".pdf"
            allowMultiple={false}
            files={files}
            onFilesChange={setFiles}
            title={`Upload PDF for ${tool.name}`}
            description={tool.shortDesc}
          />

          {files.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in">
              
              {/* Rotate Quick Controls */}
              {tool.id === 'rotate-pdf' && (
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-900">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Rotate All Pages at Once:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRotateAll(90)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-semibold hover:text-indigo-600 shadow-sm"
                    >
                      ↻ 90° Clockwise
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRotateAll(180)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-xs font-semibold hover:text-indigo-600 shadow-sm"
                    >
                      ↻ 180° Flip
                    </button>
                  </div>
                </div>
              )}

              {/* N-Up layout selection */}
              {tool.id === 'n-up-pdf' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Pages per Sheet Layout
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[2, 4, 8, 16].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNUpOption(num as any)}
                        className={`p-3 rounded-xl border-2 font-bold text-center transition-all ${
                          nUpOption === num ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {num}-Up ({num} pages/sheet)
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Resize Paper selection */}
              {tool.id === 'resize-pdf' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Paper Standard
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {['A4', 'A3', 'Letter', 'Legal', 'Tabloid'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setResizeTarget(sz as any)}
                        className={`p-3 rounded-xl border-2 font-bold text-center text-xs transition-all ${
                          resizeTarget === sz ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF Metadata Fields */}
              {tool.id === 'pdf-metadata' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Document Title</label>
                    <input
                      type="text"
                      value={metadata.title}
                      onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Author</label>
                    <input
                      type="text"
                      value={metadata.author}
                      onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Subject</label>
                    <input
                      type="text"
                      value={metadata.subject}
                      onChange={(e) => setMetadata({ ...metadata, subject: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Keywords (comma separated)</label>
                    <input
                      type="text"
                      value={metadata.keywords}
                      onChange={(e) => setMetadata({ ...metadata, keywords: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Page Grid Selector for Rotate, Delete, Extract, Organize */}
              {pages.length > 0 && ['rotate-pdf', 'delete-pages', 'extract-pages', 'organize-pdf'].includes(tool.id) && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-500">
                    {tool.id === 'delete-pages' ? 'Click pages to select/unselect for deletion' :
                     tool.id === 'extract-pages' ? 'Click pages you want to extract' :
                     'Click rotate buttons on individual page cards'}
                  </div>
                  <PageGridSelector
                    pages={pages}
                    onPageRotate={handlePageRotate}
                    onPageToggle={handlePageToggle}
                    onPageDelete={tool.id === 'organize-pdf' ? handlePageDelete : undefined}
                    selectable={tool.id === 'delete-pages' || tool.id === 'extract-pages'}
                  />
                </div>
              )}

              <button
                onClick={handleExecute}
                className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>Execute {tool.name}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
