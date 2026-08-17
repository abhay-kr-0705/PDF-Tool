import React, { useState, useEffect } from 'react';
import { ToolDefinition, UploadedFile, PdfPagePreview } from '../../types';
import { FileDropzone } from '../common/FileDropzone';
import { PageGridSelector } from '../common/PageGridSelector';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { ResultView } from '../common/ResultView';
import { generatePdfThumbnails, splitPdf, extractPdfPages } from '../../utils/pdfEngine';
import { downloadUint8Array, downloadBlob, fileToArrayBuffer, parsePageRange } from '../../utils/fileHelpers';
import JSZip from 'jszip';
import { Scissors, Layers, CheckCircle2, Trash2 } from 'lucide-react';

interface SplitToolProps {
  tool: ToolDefinition;
}

export const SplitTool: React.FC<SplitToolProps> = ({ tool }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [pages, setPages] = useState<PdfPagePreview[]>([]);
  const [splitMode, setSplitMode] = useState<'visual' | 'range' | 'all'>('visual');
  const [rangeInput, setRangeInput] = useState('1-2, 3-4');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [resultZip, setResultZip] = useState<Blob | null>(null);
  const [singlePdfResult, setSinglePdfResult] = useState<{ name: string; data: Uint8Array } | null>(null);

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
      const thumbs = await generatePdfThumbnails(buffer, 60);
      setPages(thumbs);
      setRangeInput(`1-${Math.min(2, thumbs.length)}, ${Math.min(3, thumbs.length)}-${thumbs.length}`);
    } catch (e) {
      console.warn('Could not generate thumbnails for split preview', e);
    }
  };

  const handlePageToggle = (pageNumber: number) => {
    setPages(pages.map(p => p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p));
  };

  const handlePageDelete = (pageNumber: number) => {
    setPages(pages.filter(p => p.pageNumber !== pageNumber));
  };

  const handleSplit = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(20);
    setStatusText('Reading PDF pages...');

    try {
      const buffer = await fileToArrayBuffer(files[0].file);
      const totalPages = pages.length || 10;
      let rangesToSplit: number[][] = [];

      if (splitMode === 'all') {
        // Every single page into separate files
        rangesToSplit = Array.from({ length: totalPages }, (_, i) => [i + 1]);
      } else if (splitMode === 'visual') {
        // Selected pages (removing unselected pages)
        const selected = pages.filter(p => p.selected).map(p => p.pageNumber);
        if (selected.length === 0) {
          alert('Please select at least one page.');
          setIsProcessing(false);
          return;
        }
        
        setProgress(60);
        setStatusText('Extracting selected pages and removing unselected...');
        const extractedBytes = await extractPdfPages(buffer, selected);
        setSinglePdfResult({
          name: `${files[0].name.replace(/\.[^/.]+$/, '')}_selected_pages.pdf`,
          data: extractedBytes
        });
        setProgress(100);
        setIsProcessing(false);
        return;
      } else {
        // Range syntax
        const parts = rangeInput.split(',');
        for (const part of parts) {
          const parsed = parsePageRange(part.trim(), totalPages);
          if (parsed.length > 0) rangesToSplit.push(parsed);
        }
      }

      setProgress(60);
      setStatusText('Splitting pages into individual files...');

      const splitResults = await splitPdf(buffer, rangesToSplit);

      if (splitResults.length === 1) {
        setSinglePdfResult({ name: splitResults[0].filename, data: splitResults[0].data });
      } else {
        const zip = new JSZip();
        splitResults.forEach(res => {
          zip.file(res.filename, res.data);
        });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setResultZip(zipBlob);
      }

      setProgress(100);
    } catch (err: any) {
      console.error(err);
      alert('Error splitting PDF: ' + (err?.message || 'Check range syntax'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (singlePdfResult) {
      downloadUint8Array(singlePdfResult.data, singlePdfResult.name);
    } else if (resultZip) {
      downloadBlob(resultZip, 'split_documents.zip');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setPages([]);
    setResultZip(null);
    setSinglePdfResult(null);
    setProgress(0);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {resultZip || singlePdfResult ? (
        <ResultView
          filename={singlePdfResult ? singlePdfResult.name : 'split_documents.zip'}
          newSize={singlePdfResult ? singlePdfResult.data.byteLength : (resultZip?.size || 0)}
          onDownload={handleDownload}
          onReset={handleReset}
          additionalInfo="Document pages extracted and organized successfully."
        />
      ) : isProcessing ? (
        <ProcessingOverlay progress={progress} statusText={statusText} />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
          <FileDropzone
            acceptedFiles=".pdf"
            allowMultiple={false}
            files={files}
            onFilesChange={setFiles}
            title="Upload PDF to Split or Remove Pages"
            description="Select which pages to keep, remove unwanted pages, or split into separate files"
          />

          {files.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in">
              
              {/* Split Mode Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSplitMode('visual')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    splitMode === 'visual' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 font-bold' : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Visual Page Selector</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">Click thumbnails to keep or remove</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSplitMode('range')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    splitMode === 'range' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 font-bold' : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Custom Ranges</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">e.g. 1-3, 5, 7-10</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSplitMode('all')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    splitMode === 'all' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 font-bold' : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Extract All Pages</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5">1 separate file per page</div>
                </button>
              </div>

              {/* Range Input box */}
              {splitMode === 'range' && (
                <div className="space-y-2 text-left">
                  <label className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                    Enter Page Ranges (comma separated)
                  </label>
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder="e.g. 1-2, 3-5, 8"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              )}

              {/* Visual Page Grid */}
              {pages.length > 0 && splitMode === 'visual' && (
                <div className="space-y-3 text-left">
                  <div className="text-xs font-bold text-slate-600 dark:text-slate-400 flex justify-between">
                    <span>Click pages to include in the output ({pages.filter(p => p.selected).length} selected)</span>
                    <span>Unselected pages will be removed</span>
                  </div>
                  <PageGridSelector 
                    pages={pages} 
                    onPageToggle={handlePageToggle} 
                    onPageDelete={handlePageDelete}
                  />
                </div>
              )}

              <button
                onClick={handleSplit}
                className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Scissors className="w-5 h-5" />
                <span>
                  {splitMode === 'visual'
                    ? `Save PDF with ${pages.filter(p => p.selected).length} Selected Pages`
                    : 'Split PDF Document'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
