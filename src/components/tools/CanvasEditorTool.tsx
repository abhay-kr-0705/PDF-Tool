import React, { useState, useRef, useEffect } from 'react';
import { ToolDefinition, UploadedFile, AnnotationObject } from '../../types';
import { FileDropzone } from '../common/FileDropzone';
import { SignatureModal } from '../common/SignatureModal';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { ResultView } from '../common/ResultView';
import { loadPdfJsDoc, renderPageToCanvas, applyAnnotationsToPdf } from '../../utils/pdfEngine';
import { downloadUint8Array, fileToArrayBuffer } from '../../utils/fileHelpers';
import { 
  Type, 
  PenTool, 
  Highlighter, 
  Square, 
  Circle, 
  Stamp, 
  EyeOff, 
  FileSignature, 
  Download, 
  Undo, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface CanvasEditorToolProps {
  tool: ToolDefinition;
}

export const CanvasEditorTool: React.FC<CanvasEditorToolProps> = ({ tool }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTool, setActiveTool] = useState<'select' | 'text' | 'draw' | 'highlight' | 'rect' | 'stamp' | 'redact' | 'signature'>('text');
  
  // Styling state
  const [textColor, setTextColor] = useState('#4f46e5');
  const [fontSize, setFontSize] = useState(16);
  const [textInput, setTextInput] = useState('Sample Text');
  const [selectedStamp, setSelectedStamp] = useState('APPROVED');

  const [annotations, setAnnotations] = useState<AnnotationObject[]>([]);
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultData, setResultData] = useState<Uint8Array | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);

  useEffect(() => {
    if (files.length > 0) {
      loadPdf();
    }
  }, [files]);

  useEffect(() => {
    if (pdfDocRef.current) {
      renderCurrentPage();
    }
  }, [currentPage, annotations]);

  const loadPdf = async () => {
    try {
      const buffer = await fileToArrayBuffer(files[0].file);
      const pdfJsDoc = await loadPdfJsDoc(buffer);
      pdfDocRef.current = pdfJsDoc;
      setTotalPages(pdfJsDoc.numPages);
      setCurrentPage(1);
      renderCurrentPage();
    } catch (e) {
      console.error(e);
    }
  };

  const renderCurrentPage = async () => {
    if (!pdfDocRef.current || !canvasRef.current) return;
    const page = await renderPageToCanvas(pdfDocRef.current, currentPage, 1.2);
    const mainCanvas = canvasRef.current;
    mainCanvas.width = page.width;
    mainCanvas.height = page.height;
    const ctx = mainCanvas.getContext('2d');
    if (!ctx) return;

    // Draw PDF page base
    ctx.drawImage(page, 0, 0);

    // Draw page annotations
    const pageAnnots = annotations.filter(a => a.pageNumber === currentPage);
    pageAnnots.forEach(a => {
      ctx.save();
      if (a.type === 'text' && a.text) {
        ctx.font = `${a.fontSize || 16}px Inter, sans-serif`;
        ctx.fillStyle = a.color || '#000';
        ctx.fillText(a.text, a.x, a.y);
      } else if (a.type === 'rect') {
        ctx.strokeStyle = a.color || '#000';
        ctx.lineWidth = a.strokeWidth || 2;
        ctx.strokeRect(a.x, a.y, a.width, a.height);
      } else if (a.type === 'highlight') {
        ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
        ctx.fillRect(a.x, a.y, a.width, a.height);
      } else if (a.type === 'redact') {
        ctx.fillStyle = '#000000';
        ctx.fillRect(a.x, a.y, a.width, a.height);
      } else if (a.type === 'stamp' && a.text) {
        ctx.strokeStyle = a.color || '#b91c1c';
        ctx.lineWidth = 3;
        ctx.strokeRect(a.x, a.y, a.width, a.height);
        ctx.font = `bold ${a.fontSize || 16}px sans-serif`;
        ctx.fillStyle = a.color || '#b91c1c';
        ctx.fillText(a.text, a.x + 8, a.y + (a.height / 2) + 5);
      } else if (a.type === 'signature' && a.imageData) {
        const img = new Image();
        img.src = a.imageData;
        ctx.drawImage(img, a.x, a.y, a.width, a.height);
      }
      ctx.restore();
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'text') {
      const newAnnot: AnnotationObject = {
        id: `${Date.now()}`,
        type: 'text',
        pageNumber: currentPage,
        x,
        y,
        width: 120,
        height: 24,
        color: textColor,
        strokeWidth: 1,
        opacity: 1,
        text: textInput,
        fontSize
      };
      setAnnotations([...annotations, newAnnot]);
    } else if (activeTool === 'stamp') {
      const newAnnot: AnnotationObject = {
        id: `${Date.now()}`,
        type: 'stamp',
        pageNumber: currentPage,
        x,
        y,
        width: 140,
        height: 40,
        color: '#dc2626',
        strokeWidth: 2,
        opacity: 0.9,
        text: selectedStamp,
        fontSize: 16
      };
      setAnnotations([...annotations, newAnnot]);
    } else if (activeTool === 'rect') {
      const newAnnot: AnnotationObject = {
        id: `${Date.now()}`,
        type: 'rect',
        pageNumber: currentPage,
        x,
        y,
        width: 120,
        height: 60,
        color: textColor,
        strokeWidth: 2,
        opacity: 1
      };
      setAnnotations([...annotations, newAnnot]);
    } else if (activeTool === 'redact') {
      const newAnnot: AnnotationObject = {
        id: `${Date.now()}`,
        type: 'redact',
        pageNumber: currentPage,
        x,
        y,
        width: 120,
        height: 24,
        color: '#000000',
        strokeWidth: 0,
        opacity: 1
      };
      setAnnotations([...annotations, newAnnot]);
    } else if (activeTool === 'highlight') {
      const newAnnot: AnnotationObject = {
        id: `${Date.now()}`,
        type: 'highlight',
        pageNumber: currentPage,
        x,
        y,
        width: 140,
        height: 20,
        color: '#facc15',
        strokeWidth: 0,
        opacity: 0.4
      };
      setAnnotations([...annotations, newAnnot]);
    }
  };

  const handleSignaturePlaced = (dataUrl: string) => {
    const newAnnot: AnnotationObject = {
      id: `${Date.now()}`,
      type: 'signature',
      pageNumber: currentPage,
      x: 100,
      y: 200,
      width: 160,
      height: 60,
      color: '#000',
      strokeWidth: 1,
      opacity: 1,
      imageData: dataUrl
    };
    setAnnotations([...annotations, newAnnot]);
  };

  const handleSavePdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const buffer = await fileToArrayBuffer(files[0].file);
      const updatedPdfBytes = await applyAnnotationsToPdf(buffer, annotations);
      setResultData(updatedPdfBytes);
    } catch (e: any) {
      alert('Save error: ' + e?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const undoLastAnnotation = () => {
    setAnnotations(annotations.slice(0, -1));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {resultData ? (
        <ResultView
          filename={`${files[0]?.name.replace(/\.[^/.]+$/, '')}_edited.pdf`}
          newSize={resultData.byteLength}
          onDownload={() => downloadUint8Array(resultData, `${files[0]?.name.replace(/\.[^/.]+$/, '')}_edited.pdf`)}
          onReset={() => {
            setFiles([]);
            setAnnotations([]);
            setResultData(null);
          }}
          additionalInfo="All annotations, text, stamps, and signatures burned into the PDF structure."
        />
      ) : isProcessing ? (
        <ProcessingOverlay statusText="Burning annotations into PDF..." />
      ) : files.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 border border-slate-200 dark:border-slate-800">
          <FileDropzone
            acceptedFiles=".pdf"
            allowMultiple={false}
            files={files}
            onFilesChange={setFiles}
            title="Upload PDF to Open in Editor"
            description="Add text, freehand drawing, highlights, stamps, and signatures"
          />
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          
          {/* Top Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            
            {/* Tool Selection */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveTool('text')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  activeTool === 'text' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Type className="w-3.5 h-3.5" /> Text
              </button>

              <button
                onClick={() => setActiveTool('highlight')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  activeTool === 'highlight' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5" /> Highlight
              </button>

              <button
                onClick={() => setActiveTool('rect')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  activeTool === 'rect' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Square className="w-3.5 h-3.5" /> Rectangle
              </button>

              <button
                onClick={() => setActiveTool('stamp')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  activeTool === 'stamp' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Stamp className="w-3.5 h-3.5" /> Stamp
              </button>

              <button
                onClick={() => setActiveTool('redact')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  activeTool === 'redact' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" /> Redact
              </button>

              <button
                onClick={() => setIsSigModalOpen(true)}
                className="px-3 py-1.5 rounded-lg font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 flex items-center gap-1.5"
              >
                <FileSignature className="w-3.5 h-3.5 text-indigo-500" /> Sign
              </button>
            </div>

            {/* Actions & Pagination */}
            <div className="flex items-center gap-2">
              <button
                onClick={undoLastAnnotation}
                disabled={annotations.length === 0}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-30"
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 px-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 rounded bg-white dark:bg-slate-800 disabled:opacity-30"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold">Page {currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1 rounded bg-white dark:bg-slate-800 disabled:opacity-30"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleSavePdf}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Save PDF
              </button>
            </div>
          </div>

          {/* Sub-bar options for active tool */}
          {activeTool === 'text' && (
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500 font-medium">Text Content:</span>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Click canvas to place this text"
                className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs w-64"
              />
              <span className="text-slate-500">Size:</span>
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(+e.target.value)}
                className="w-14 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 text-xs"
              />
              <span className="text-slate-400 italic">Click on document canvas to place text</span>
            </div>
          )}

          {activeTool === 'stamp' && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Select Stamp:</span>
              {['APPROVED', 'CONFIDENTIAL', 'DRAFT', 'FINAL', 'PAID', 'VOID'].map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedStamp(s)}
                  className={`px-2.5 py-1 rounded font-bold uppercase ${
                    selectedStamp === s ? 'bg-red-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Document Canvas Workspace */}
          <div className="relative overflow-auto max-h-[650px] p-6 bg-slate-200/60 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-center">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="shadow-2xl rounded cursor-crosshair max-w-full bg-white"
            />
          </div>

          <SignatureModal
            isOpen={isSigModalOpen}
            onClose={() => setIsSigModalOpen(false)}
            onSave={handleSignaturePlaced}
          />
        </div>
      )}
    </div>
  );
};
