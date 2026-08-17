import React, { useState } from 'react';
import { ToolDefinition, UploadedFile, OcrPageResult } from '../../types';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { ResultView } from '../common/ResultView';
import { performOcrOnPdf, performOcrOnImage } from '../../utils/ocrEngine';
import { convertHtmlToPdf } from '../../utils/conversionEngine';
import { downloadUint8Array, downloadText, fileToArrayBuffer, fileToDataUrl } from '../../utils/fileHelpers';
import { ScanLine, Copy, Check, Sparkles, FileText, Download, Edit3, Globe } from 'lucide-react';

interface ScannedOcrToolProps {
  tool: ToolDefinition;
}

export const ScannedOcrTool: React.FC<ScannedOcrToolProps> = ({ tool }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [language, setLanguage] = useState('eng');
  const [ocrResults, setOcrResults] = useState<OcrPageResult[]>([]);
  const [editableText, setEditableText] = useState('');
  const [copied, setCopied] = useState(false);
  const [activePage, setActivePage] = useState(1);

  const handleRunOcr = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(10);
    setStatusText('Initializing client-side Tesseract OCR worker...');

    try {
      const file = files[0].file;
      let results: OcrPageResult[] = [];

      if (file.type.includes('pdf') || file.name.endsWith('.pdf')) {
        const buffer = await fileToArrayBuffer(file);
        results = await performOcrOnPdf(buffer, language, (curr, total, pct, stat) => {
          const overall = Math.round(((curr - 1) / total) * 100 + (pct / total));
          setProgress(overall);
          setStatusText(stat);
        });
      } else {
        // Image file
        const dataUrl = await fileToDataUrl(file);
        setProgress(50);
        setStatusText('Recognizing characters in scan...');
        const singleRes = await performOcrOnImage(dataUrl, language, (pct, stat) => {
          setProgress(pct);
          setStatusText(stat);
        });
        results = [{
          pageNumber: 1,
          text: singleRes.text,
          words: singleRes.words,
          imageWidth: 800,
          imageHeight: 1100
        }];
      }

      setOcrResults(results);
      const combined = results.map(r => `--- Page ${r.pageNumber} ---\n${r.text}`).join('\n\n');
      setEditableText(combined);
      setProgress(100);
    } catch (err: any) {
      console.error(err);
      alert('OCR Processing error: ' + (err?.message || 'Check scan resolution'));
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    downloadText(editableText, `${files[0]?.name || 'scan'}_ocr_text.txt`);
  };

  const handleExportSearchablePdf = async () => {
    setIsProcessing(true);
    setProgress(50);
    setStatusText('Compiling editable text into PDF...');
    try {
      const formattedHtml = editableText
        .split('\n')
        .map(line => line.startsWith('---') ? `<h3 style="color:#4f46e5; border-bottom:1px solid #cbd5e1; padding-bottom:4px; margin-top:16px;">${line}</h3>` : `<p style="margin:4px 0; font-size:13px; line-height:1.5;">${line || '&nbsp;'}</p>`)
        .join('');
      const pdfBytes = await convertHtmlToPdf(formattedHtml, 'Searchable OCR Export');
      downloadUint8Array(pdfBytes, `${files[0]?.name || 'scan'}_searchable.pdf`);
    } catch (e: any) {
      alert('Export failed: ' + e?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setOcrResults([]);
    setEditableText('');
    setProgress(0);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {isProcessing ? (
        <ProcessingOverlay progress={progress} statusText={statusText} />
      ) : ocrResults.length > 0 ? (
        <div className="glass-card rounded-2xl p-6 sm:p-10 shadow-xl border border-indigo-500/30 space-y-6 animate-in fade-in">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <ScanLine className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  OCR Text Recognition Complete
                </h3>
                <p className="text-xs text-slate-500">
                  {ocrResults.length} page(s) scanned and converted to editable text
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handleDownloadTxt}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Save .TXT</span>
              </button>

              <button
                onClick={handleExportSearchablePdf}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Export Searchable PDF</span>
              </button>
            </div>
          </div>

          {/* Editable OCR text area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5 text-indigo-500" /> Directly edit, fix typos, or reformat recognized text below:
              </span>
              <span>{editableText.length} characters</span>
            </div>
            <textarea
              rows={14}
              value={editableText}
              onChange={(e) => setEditableText(e.target.value)}
              className="w-full p-4 rounded-xl font-mono text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <button
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold"
            >
              ← Scan Another Document
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-200/80 dark:border-slate-800 space-y-6">
          <FileDropzone
            acceptedFiles=".pdf,.png,.jpg,.jpeg"
            allowMultiple={false}
            files={files}
            onFilesChange={setFiles}
            title="Upload Scanned Document or Photo"
            description="Supports PDF scans, PNG, and JPG images. OCR runs 100% locally."
          />

          {files.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-indigo-500" />
                  <span>OCR Recognition Language</span>
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="eng">English (eng)</option>
                  <option value="spa">Spanish (spa)</option>
                  <option value="fra">French (fra)</option>
                  <option value="deu">German (deu)</option>
                  <option value="hin">Hindi (hin)</option>
                  <option value="ita">Italian (ita)</option>
                  <option value="por">Portuguese (por)</option>
                </select>
              </div>

              <button
                onClick={handleRunOcr}
                className="w-full py-4 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base shadow-lg shadow-purple-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <ScanLine className="w-5 h-5" />
                <span>Run In-Browser OCR &amp; Edit Text</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
