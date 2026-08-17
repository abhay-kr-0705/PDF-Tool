import React, { useState, useEffect, useRef } from 'react';
import { ToolDefinition, UploadedFile, CleanBgWatermarkSettings } from '../../types';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { ResultView } from '../common/ResultView';
import { loadPdfJsDoc, renderPageToCanvas, cleanAndRemoveWatermarksFromPdf } from '../../utils/pdfEngine';
import { downloadUint8Array, fileToArrayBuffer } from '../../utils/fileHelpers';
import { Eraser, Sparkles, Moon, Sun, Sliders, ChevronLeft, ChevronRight, Check, Trash2 } from 'lucide-react';

interface CleanBgWatermarkRemoverToolProps {
  tool: ToolDefinition;
}

export const CleanBgWatermarkRemoverTool: React.FC<CleanBgWatermarkRemoverToolProps> = ({ tool }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultData, setResultData] = useState<Uint8Array | null>(null);

  const [settings, setSettings] = useState<CleanBgWatermarkSettings>({
    mode: tool.id === 'invert-pdf' ? 'invert' : tool.id === 'clean-bg' ? 'clean-bg' : 'erase-watermark',
    bgThreshold: 215,
    contrast: 1.15,
    brightness: 0,
    eraseRegions: []
  });

  const [isErasing, setIsErasing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [brushColor, setBrushColor] = useState('#ffffff');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);

  useEffect(() => {
    if (files.length > 0) {
      loadPdf();
    }
  }, [files]);

  useEffect(() => {
    if (pdfDocRef.current) {
      renderCanvas();
    }
  }, [currentPage, settings]);

  const loadPdf = async () => {
    try {
      const buffer = await fileToArrayBuffer(files[0].file);
      const doc = await loadPdfJsDoc(buffer);
      pdfDocRef.current = doc;
      setTotalPages(doc.numPages);
      setCurrentPage(1);
    } catch (e) {
      console.warn('Could not load PDF for cleaning', e);
    }
  };

  const renderCanvas = async () => {
    if (!pdfDocRef.current || !canvasRef.current) return;
    const page = await renderPageToCanvas(pdfDocRef.current, currentPage, 1.2);
    const canvas = canvasRef.current;
    canvas.width = page.width;
    canvas.height = page.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw base page
    ctx.drawImage(page, 0, 0);

    // Apply Background Cleaning / Inverting preview
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;

    if (settings.mode === 'invert') {
      for (let j = 0; j < d.length; j += 4) {
        d[j] = 255 - d[j];
        d[j + 1] = 255 - d[j + 1];
        d[j + 2] = 255 - d[j + 2];
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (settings.mode === 'clean-bg') {
      const th = settings.bgThreshold;
      for (let j = 0; j < d.length; j += 4) {
        const lum = 0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2];
        if (lum > th) {
          d[j] = 255; d[j + 1] = 255; d[j + 2] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // Draw erased regions
    const currentRegions = settings.eraseRegions.filter(r => r.pageNumber === currentPage);
    currentRegions.forEach(r => {
      ctx.fillStyle = r.color || '#ffffff';
      ctx.fillRect(r.x, r.y, r.width, r.height);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(r.x, r.y, r.width, r.height);
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (settings.mode !== 'erase-watermark') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsErasing(true);
    setStartPos({ x, y });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isErasing || !startPos) return;
    setIsErasing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const x = Math.min(startPos.x, endX);
    const y = Math.min(startPos.y, endY);
    const width = Math.abs(endX - startPos.x);
    const height = Math.abs(endY - startPos.y);

    if (width > 5 && height > 5) {
      const newRegion = {
        id: `${Date.now()}`,
        pageNumber: currentPage,
        x,
        y,
        width,
        height,
        color: brushColor
      };
      setSettings({
        ...settings,
        eraseRegions: [...settings.eraseRegions, newRegion]
      });
    }
    setStartPos(null);
  };

  const clearErasedRegions = () => {
    setSettings({
      ...settings,
      eraseRegions: settings.eraseRegions.filter(r => r.pageNumber !== currentPage)
    });
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const buffer = await fileToArrayBuffer(files[0].file);
      const cleanBytes = await cleanAndRemoveWatermarksFromPdf(buffer, settings);
      setResultData(cleanBytes);
    } catch (e: any) {
      alert('Cleaning error: ' + e?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {resultData ? (
        <ResultView
          filename={`${files[0]?.name.replace(/\.[^/.]+$/, '')}_cleaned.pdf`}
          newSize={resultData.byteLength}
          onDownload={() => downloadUint8Array(resultData, `${files[0]?.name.replace(/\.[^/.]+$/, '')}_cleaned.pdf`)}
          onReset={() => {
            setFiles([]);
            setResultData(null);
          }}
          additionalInfo="Document background cleaned and watermarks/logos erased successfully."
        />
      ) : isProcessing ? (
        <ProcessingOverlay statusText="Whitening background and erasing selected watermarks/logos..." />
      ) : files.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-md">
          <FileDropzone
            acceptedFiles=".pdf"
            allowMultiple={false}
            files={files}
            onFilesChange={setFiles}
            title="Upload PDF to Clean Background or Remove Watermarks"
            description="Remove gray scan tint, invert colors, or drag an eraser box to remove logos & stamps"
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg space-y-5">
          
          {/* Top Options Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
            
            {/* Mode Selector */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSettings({ ...settings, mode: 'clean-bg' })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  settings.mode === 'clean-bg' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                ✨ Clean &amp; Whiten Background
              </button>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, mode: 'erase-watermark' })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  settings.mode === 'erase-watermark' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                🧹 Erase Logo / Watermark Box
              </button>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, mode: 'invert' })}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  settings.mode === 'invert' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                🌙 Dark Mode Invert
              </button>
            </div>

            {/* Pagination & Save */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 font-bold text-slate-700 dark:text-slate-200">
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 rounded bg-white dark:bg-slate-700 disabled:opacity-30"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span>Page {currentPage} / {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1 rounded bg-white dark:bg-slate-700 disabled:opacity-30"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleProcess}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Save Cleaned PDF
              </button>
            </div>
          </div>

          {/* Sub-bar for selected mode */}
          {settings.mode === 'clean-bg' && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-4 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">Background Whitening Threshold:</span>
              <input
                type="range"
                min="160"
                max="245"
                value={settings.bgThreshold}
                onChange={(e) => setSettings({ ...settings, bgThreshold: +e.target.value })}
                className="w-48 accent-indigo-600"
              />
              <span className="font-bold text-indigo-600">{settings.bgThreshold}</span>
              <span className="text-slate-400 italic">Adjust slider until gray paper tint becomes pure white</span>
            </div>
          )}

          {settings.mode === 'erase-watermark' && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Eraser className="w-4 h-4 text-rose-500" />
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  Drag a box over any watermark, logo, or stamp on the document below to erase it.
                </span>
              </div>
              <button
                type="button"
                onClick={clearErasedRegions}
                className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 text-xs font-semibold hover:bg-rose-100 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear page eraser boxes
              </button>
            </div>
          )}

          {/* Interactive Document Preview Canvas */}
          <div className="p-6 bg-slate-200 dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-slate-800 flex justify-center max-h-[600px] overflow-auto">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              className={`shadow-2xl rounded bg-white ${settings.mode === 'erase-watermark' ? 'cursor-crosshair' : 'cursor-default'}`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
