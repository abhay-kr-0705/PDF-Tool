import React, { useState, useEffect, useRef } from 'react';
import { ToolDefinition, UploadedFile, PdfPagePreview, NUpSettings } from '../../types';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { ResultView } from '../common/ResultView';
import { generatePdfThumbnails, nUpAdvancedPdf, PAPER_DIMENSIONS } from '../../utils/pdfEngine';
import { downloadUint8Array, fileToArrayBuffer } from '../../utils/fileHelpers';
import { Grid, Sliders, Layout, Check, Sparkles, Smartphone, Monitor } from 'lucide-react';

interface NUpMultiPageToolProps {
  tool: ToolDefinition;
}

export const NUpMultiPageTool: React.FC<NUpMultiPageToolProps> = ({ tool }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [pages, setPages] = useState<PdfPagePreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultData, setResultData] = useState<Uint8Array | null>(null);

  const [settings, setSettings] = useState<NUpSettings>({
    pagesPerSheet: 2,
    paperSize: 'A4',
    orientation: 'portrait',
    margin: 20,
    padding: 8,
    drawBorders: true,
    addPageNumbers: true,
    fitMode: 'contain'
  });

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (files.length > 0) {
      loadThumbnails();
    } else {
      setPages([]);
    }
  }, [files]);

  const loadThumbnails = async () => {
    try {
      const buffer = await fileToArrayBuffer(files[0].file);
      const thumbs = await generatePdfThumbnails(buffer, 32);
      setPages(thumbs);
    } catch (e) {
      console.warn('Could not load thumbnails', e);
    }
  };

  // Render live visual preview of the first imposed sheet
  useEffect(() => {
    if (pages.length === 0 || !previewCanvasRef.current) return;
    renderLivePreview();
  }, [pages, settings]);

  const renderLivePreview = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseDims = PAPER_DIMENSIONS[settings.paperSize] || PAPER_DIMENSIONS['A4'];
    const sheetW = settings.orientation === 'landscape' ? baseDims[1] : baseDims[0];
    const sheetH = settings.orientation === 'landscape' ? baseDims[0] : baseDims[1];

    // Scale canvas to preview box width (e.g. 360px)
    const previewScale = 380 / sheetW;
    canvas.width = 380;
    canvas.height = sheetH * previewScale;

    // Background sheet
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border of paper
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

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

    const scaledMargin = settings.margin * previewScale;
    const scaledPadding = settings.padding * previewScale;

    const usableW = canvas.width - (scaledMargin * 2) - (scaledPadding * (cols - 1));
    const usableH = canvas.height - (scaledMargin * 2) - (scaledPadding * (rows - 1));

    const cellW = usableW / cols;
    const cellH = usableH / rows;

    for (let slot = 0; slot < settings.pagesPerSheet; slot++) {
      if (slot >= pages.length) break;
      const page = pages[slot];

      const col = slot % cols;
      const row = Math.floor(slot / cols);

      const cellX = scaledMargin + col * (cellW + scaledPadding);
      const cellY = scaledMargin + row * (cellH + scaledPadding);

      // Draw cell background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(cellX, cellY, cellW, cellH);

      // Draw thumbnail inside cell
      const img = new Image();
      img.src = page.thumbnailUrl;
      if (img.complete) {
        const aspect = img.width / img.height;
        let drawW = cellW * 0.9;
        let drawH = drawW / aspect;
        if (drawH > cellH * 0.9) {
          drawH = cellH * 0.9;
          drawW = drawH * aspect;
        }
        const imgX = cellX + (cellW - drawW) / 2;
        const imgY = cellY + (cellH - drawH) / 2;
        ctx.drawImage(img, imgX, imgY, drawW, drawH);
      }

      // Draw tile border
      if (settings.drawBorders) {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 0.75;
        ctx.strokeRect(cellX, cellY, cellW, cellH);
      }

      // Draw page number badge
      if (settings.addPageNumbers) {
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(`Page ${slot + 1}`, cellX + 4, cellY + 12);
      }
    }
  };

  const handleExecute = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const buffer = await fileToArrayBuffer(files[0].file);
      const output = await nUpAdvancedPdf(buffer, settings);
      setResultData(output);
    } catch (e: any) {
      alert('N-Up processing failed: ' + e?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {resultData ? (
        <ResultView
          filename={`${files[0]?.name.replace(/\.[^/.]+$/, '')}_${settings.pagesPerSheet}up_${settings.paperSize.toLowerCase()}.pdf`}
          newSize={resultData.byteLength}
          onDownload={() => downloadUint8Array(resultData, `${files[0]?.name.replace(/\.[^/.]+$/, '')}_${settings.pagesPerSheet}up_${settings.paperSize.toLowerCase()}.pdf`)}
          onReset={() => {
            setFiles([]);
            setPages([]);
            setResultData(null);
          }}
          additionalInfo={`Converted to ${settings.pagesPerSheet}-Up layout on ${settings.paperSize} (${settings.orientation}).`}
        />
      ) : isProcessing ? (
        <ProcessingOverlay statusText="Generating multi-page imposed PDF sheet..." />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
          <FileDropzone
            acceptedFiles=".pdf"
            allowMultiple={false}
            files={files}
            onFilesChange={setFiles}
            title="Upload PDF for Multi-Page Sheet Layout"
            description="Fit 2, 4, 6, 8, 9, or 16 pages onto A4, A1, A2, A3, A5, Letter with live visual preview"
          />

          {files.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Controls & Sliders */}
                <div className="lg:col-span-7 space-y-5 text-left">
                  
                  {/* Pages Per Sheet */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Pages per Sheet ({settings.pagesPerSheet}-Up)
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[2, 4, 6, 8, 9, 16].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setSettings({ ...settings, pagesPerSheet: num as any })}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            settings.pagesPerSheet === num
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {num}-Up
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Paper Size & Orientation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Paper Size Standard
                      </label>
                      <select
                        value={settings.paperSize}
                        onChange={(e) => setSettings({ ...settings, paperSize: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      >
                        <option value="A4">A4 (Standard 210 × 297 mm)</option>
                        <option value="A1">A1 (Poster 594 × 841 mm)</option>
                        <option value="A2">A2 (Large 420 × 594 mm)</option>
                        <option value="A3">A3 (Medium 297 × 420 mm)</option>
                        <option value="A5">A5 (Compact 148 × 210 mm)</option>
                        <option value="Letter">US Letter (8.5 × 11 in)</option>
                        <option value="Legal">US Legal (8.5 × 14 in)</option>
                        <option value="Tabloid">Tabloid (11 × 17 in)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Page Orientation
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, orientation: 'portrait' })}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            settings.orientation === 'portrait'
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-extrabold'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600'
                          }`}
                        >
                          📄 Portrait
                        </button>
                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, orientation: 'landscape' })}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            settings.orientation === 'landscape'
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-extrabold'
                              : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600'
                          }`}
                        >
                          📃 Landscape
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Margins and Padding Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>Outer Margin:</span>
                        <span className="font-bold text-indigo-600">{settings.margin} pt</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        value={settings.margin}
                        onChange={(e) => setSettings({ ...settings, margin: +e.target.value })}
                        className="w-full accent-indigo-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>Gap / Padding between tiles:</span>
                        <span className="font-bold text-indigo-600">{settings.padding} pt</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="30"
                        value={settings.padding}
                        onChange={(e) => setSettings({ ...settings, padding: +e.target.value })}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex flex-wrap gap-4 pt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.drawBorders}
                        onChange={(e) => setSettings({ ...settings, drawBorders: e.target.checked })}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Draw borders around each page tile</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.addPageNumbers}
                        onChange={(e) => setSettings({ ...settings, addPageNumbers: e.target.checked })}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Add page number indicators</span>
                    </label>
                  </div>
                </div>

                {/* Right Side: Real-time Live Preview */}
                <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-3">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Live Imposition Preview ({settings.paperSize})</span>
                  </div>

                  <div className="p-3 bg-slate-200 dark:bg-slate-900 rounded-xl shadow-inner flex items-center justify-center max-w-full overflow-hidden">
                    <canvas
                      ref={previewCanvasRef}
                      className="shadow-md rounded max-h-[380px] object-contain"
                    />
                  </div>

                  <span className="text-[11px] text-slate-400 text-center">
                    {pages.length} total pages will fit onto ~{Math.ceil(pages.length / settings.pagesPerSheet)} sheet(s).
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleExecute}
                className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Grid className="w-5 h-5" />
                <span>Generate {settings.pagesPerSheet}-Up {settings.paperSize} PDF</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
