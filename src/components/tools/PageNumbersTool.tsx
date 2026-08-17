import React, { useState } from 'react';
import { ToolDefinition, UploadedFile, PageNumberSettings } from '../../types';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { ResultView } from '../common/ResultView';
import { addPageNumbersToPdf } from '../../utils/pdfEngine';
import { downloadUint8Array, fileToArrayBuffer } from '../../utils/fileHelpers';
import { Hash, Sliders } from 'lucide-react';

interface PageNumbersToolProps {
  tool: ToolDefinition;
}

export const PageNumbersTool: React.FC<PageNumbersToolProps> = ({ tool }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultData, setResultData] = useState<Uint8Array | null>(null);

  const [settings, setSettings] = useState<PageNumberSettings>({
    position: 'bottom-center',
    format: 'page-of-total',
    prefix: '',
    startPage: 1,
    fontSize: 10,
    color: '#475569',
    fontFamily: 'Helvetica'
  });

  const handleApply = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const buffer = await fileToArrayBuffer(files[0].file);
      const output = await addPageNumbersToPdf(buffer, settings);
      setResultData(output);
    } catch (e: any) {
      alert('Page numbering error: ' + e?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {resultData ? (
        <ResultView
          filename={`${files[0]?.name.replace(/\.[^/.]+$/, '')}_numbered.pdf`}
          newSize={resultData.byteLength}
          onDownload={() => downloadUint8Array(resultData, `${files[0]?.name.replace(/\.[^/.]+$/, '')}_numbered.pdf`)}
          onReset={() => {
            setFiles([]);
            setResultData(null);
          }}
          additionalInfo="Page numbers cleanly embedded across all pages."
        />
      ) : isProcessing ? (
        <ProcessingOverlay statusText="Inserting page numbers and headers/footers..." />
      ) : (
        <div className="glass-card rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-200 dark:border-slate-800 space-y-6">
          <FileDropzone
            acceptedFiles=".pdf"
            allowMultiple={false}
            files={files}
            onFilesChange={setFiles}
            title="Upload PDF to Add Page Numbers"
            description="Select document to customize page numbering layout and format"
          />

          {files.length > 0 && (
            <div className="space-y-5 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Position
                  </label>
                  <select
                    value={settings.position}
                    onChange={(e) => setSettings({ ...settings, position: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  >
                    <option value="bottom-center">Bottom Center (Footer)</option>
                    <option value="bottom-right">Bottom Right (Footer)</option>
                    <option value="bottom-left">Bottom Left (Footer)</option>
                    <option value="top-center">Top Center (Header)</option>
                    <option value="top-right">Top Right (Header)</option>
                    <option value="top-left">Top Left (Header)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Numbering Format
                  </label>
                  <select
                    value={settings.format}
                    onChange={(e) => setSettings({ ...settings, format: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  >
                    <option value="page-of-total">Page 1 of 10</option>
                    <option value="page-only">1 (Number only)</option>
                    <option value="doc-title">Document Title - 1</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Start numbering from page
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={settings.startPage}
                    onChange={(e) => setSettings({ ...settings, startPage: +e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  />
                </div>

                {settings.format === 'doc-title' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Document Title Prefix
                    </label>
                    <input
                      type="text"
                      value={settings.prefix}
                      onChange={(e) => setSettings({ ...settings, prefix: e.target.value })}
                      placeholder="e.g. Project Proposal"
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleApply}
                className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                <Hash className="w-5 h-5" />
                <span>Apply Page Numbers</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
