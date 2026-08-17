import React, { useState } from 'react';
import { ToolDefinition, UploadedFile, CompressionSettings, CompressionLevel } from '../../types';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { ResultView } from '../common/ResultView';
import { compressPdf, CompressionResult } from '../../utils/compressionEngine';
import { downloadUint8Array, fileToArrayBuffer } from '../../utils/fileHelpers';
import { Zap, ShieldCheck, Sliders, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

interface CompressToolProps {
  tool: ToolDefinition;
}

export const CompressTool: React.FC<CompressToolProps> = ({ tool }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [result, setResult] = useState<CompressionResult | null>(null);

  const [settings, setSettings] = useState<CompressionSettings>({
    level: 'lossless',
    imageQuality: 0.82,
    dpi: 150,
    removeMetadata: true,
    flattenForms: false,
    grayscale: false
  });

  const handleCompress = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(20);
    setStatusText('Analyzing PDF structures & streams...');

    try {
      const buffer = await fileToArrayBuffer(files[0].file);
      setProgress(50);
      setStatusText(settings.level === 'lossless' ? 'Optimizing object streams losslessly...' : 'Resampling image streams...');

      const compressionRes = await compressPdf(buffer, settings);
      setProgress(100);
      setResult(compressionRes);
    } catch (err: any) {
      console.error(err);
      alert('Error during compression: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || files.length === 0) return;
    const baseName = files[0].name.replace(/\.[^/.]+$/, '');
    downloadUint8Array(result.data, `${baseName}_compressed.pdf`);
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {result ? (
        <ResultView
          filename={files[0]?.name ? `${files[0].name.replace(/\.[^/.]+$/, '')}_compressed.pdf` : 'compressed.pdf'}
          originalSize={result.originalSize}
          newSize={result.compressedSize}
          savingsPercentage={result.savingsPercentage}
          onDownload={handleDownload}
          onReset={handleReset}
          additionalInfo={
            settings.level === 'lossless'
              ? 'Lossless compression applied: All visual quality and vector sharpness preserved 100%.'
              : `Compressed using ${settings.level.toUpperCase()} optimization mode.`
          }
        />
      ) : isProcessing ? (
        <ProcessingOverlay progress={progress} statusText={statusText} />
      ) : (
        <div className="glass-card rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-200/80 dark:border-slate-800 space-y-8">
          
          {/* Dropzone */}
          <FileDropzone
            acceptedFiles=".pdf"
            allowMultiple={false}
            files={files}
            onFilesChange={setFiles}
            title="Upload PDF to Compress"
            description="Select or drop your PDF document to optimize file size"
          />

          {/* Compression Level Options */}
          {files.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-500" />
                  <span>Choose Compression Level</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Lossless */}
                <div
                  onClick={() => setSettings({ ...settings, level: 'lossless' })}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    settings.level === 'lossless'
                      ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 shadow-md shadow-emerald-500/10'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      100% Quality
                    </span>
                    {settings.level === 'lossless' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  </div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">Lossless Optimization</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Preserves original pixel clarity and vectors. Defragments object streams and cleans font metadata.
                  </p>
                </div>

                {/* 2. Balanced */}
                <div
                  onClick={() => setSettings({ ...settings, level: 'balanced' })}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    settings.level === 'balanced'
                      ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-md shadow-indigo-500/10'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      Recommended
                    </span>
                    {settings.level === 'balanced' && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                  </div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">Balanced Compression</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Resamples images to 150 DPI. Ideal for email sharing, web publishing, and printing.
                  </p>
                </div>

                {/* 3. Extreme */}
                <div
                  onClick={() => setSettings({ ...settings, level: 'extreme' })}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    settings.level === 'extreme'
                      ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/30 shadow-md shadow-amber-500/10'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Smallest Size
                    </span>
                    {settings.level === 'extreme' && <CheckCircle2 className="w-5 h-5 text-amber-500" />}
                  </div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">Extreme Compression</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    High compression ratio (72 DPI). Maximum reduction for strict upload size limits.
                  </p>
                </div>
              </div>

              {/* Extra toggles */}
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.removeMetadata}
                    onChange={(e) => setSettings({ ...settings, removeMetadata: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Strip redundant metadata</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.grayscale}
                    onChange={(e) => setSettings({ ...settings, grayscale: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Convert to Grayscale (Extra savings)</span>
                </label>
              </div>

              {/* Compress Action Button */}
              <button
                onClick={handleCompress}
                className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                <span>Compress PDF Now</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
