import React, { useState } from 'react';
import { ToolDefinition, UploadedFile } from '../../types';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { ResultView } from '../common/ResultView';
import { mergePdfs } from '../../utils/pdfEngine';
import { downloadUint8Array, fileToArrayBuffer } from '../../utils/fileHelpers';
import { Layers, ArrowRight } from 'lucide-react';

interface MergeToolProps {
  tool: ToolDefinition;
}

export const MergeTool: React.FC<MergeToolProps> = ({ tool }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [resultData, setResultData] = useState<Uint8Array | null>(null);

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please upload at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setProgress(20);
    setStatusText(`Reading ${files.length} PDF files...`);

    try {
      const buffers: ArrayBuffer[] = [];
      for (let i = 0; i < files.length; i++) {
        setProgress(20 + Math.round((i / files.length) * 50));
        setStatusText(`Loading ${files[i].name}...`);
        buffers.push(await fileToArrayBuffer(files[i].file));
      }

      setProgress(80);
      setStatusText('Merging document streams into one PDF...');

      const mergedBytes = await mergePdfs(buffers);
      setProgress(100);
      setResultData(mergedBytes);
    } catch (err: any) {
      console.error(err);
      alert('Error merging PDFs: ' + (err?.message || 'Check files'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultData) return;
    downloadUint8Array(resultData, 'merged_document.pdf');
  };

  const handleReset = () => {
    setFiles([]);
    setResultData(null);
    setProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {resultData ? (
        <ResultView
          filename="merged_document.pdf"
          newSize={resultData.byteLength}
          onDownload={handleDownload}
          onReset={handleReset}
          additionalInfo={`Successfully combined ${files.length} PDF files into a single unified document.`}
        />
      ) : isProcessing ? (
        <ProcessingOverlay progress={progress} statusText={statusText} />
      ) : (
        <div className="glass-card rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-200/80 dark:border-slate-800 space-y-6">
          <FileDropzone
            acceptedFiles=".pdf"
            allowMultiple={true}
            files={files}
            onFilesChange={setFiles}
            title="Upload Multiple PDF Files to Merge"
            description="Select 2 or more PDFs. You can drag and rearrange their order before merging."
          />

          {files.length > 0 && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleMerge}
                disabled={files.length < 2}
                className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-5 h-5" />
                <span>
                  {files.length < 2 ? 'Add at least 1 more PDF to Merge' : `Combine ${files.length} PDFs into One`}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
