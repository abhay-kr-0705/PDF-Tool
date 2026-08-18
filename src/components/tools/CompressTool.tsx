import React, { useState } from 'react';
import { ToolDefinition, UploadedFile, CompressionSettings, CompressionLevel, CompressionMode } from '../../types';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { ResultView } from '../common/ResultView';
import { compressPdf, CompressionResult } from '../../utils/compressionEngine';
import { downloadUint8Array, fileToArrayBuffer, formatFileSize } from '../../utils/fileHelpers';
import { Zap, ShieldCheck, Sliders, CheckCircle2, Target, SlidersHorizontal, Sparkles, HelpCircle } from 'lucide-react';

interface CompressToolProps {
  tool: ToolDefinition;
}

export const CompressTool: React.FC<CompressToolProps> = ({ tool }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [result, setResult] = useState<CompressionResult | null>(null);

  const [mode, setMode] = useState<CompressionMode>('preset');
  const [presetLevel, setPresetLevel] = useState<CompressionLevel>('light');
  const [targetKb, setTargetKb] = useState<number>(200);
  const [targetUnit, setTargetUnit] = useState<'KB' | 'MB'>('KB');
  const [customInputValue, setCustomInputValue] = useState<string>('200');

  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [grayscale, setGrayscale] = useState(false);

  const handleCustomInput = (val: string, unit: 'KB' | 'MB') => {
    setCustomInputValue(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setTargetKb(unit === 'MB' ? Math.round(num * 1024) : Math.round(num));
    }
  };

  const handleQuickPreset = (kb: number) => {
    setTargetKb(kb);
    if (kb >= 1024) {
      setTargetUnit('MB');
      setCustomInputValue((kb / 1024).toString());
    } else {
      setTargetUnit('KB');
      setCustomInputValue(kb.toString());
    }
  };

  const handleCompress = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(20);
    setStatusText('Analyzing PDF structures & streams...');

    try {
      const buffer = await fileToArrayBuffer(files[0].file);
      setProgress(50);
      
      const settings: CompressionSettings = {
        mode,
        level: presetLevel,
        targetSizeKb: mode === 'target-size' ? targetKb : undefined,
        imageQuality: presetLevel === 'light' ? 0.85 : presetLevel === 'balanced' ? 0.75 : 0.58,
        dpi: presetLevel === 'light' ? 150 : presetLevel === 'balanced' ? 110 : 72,
        removeMetadata,
        flattenForms: false,
        grayscale
      };

      setStatusText(mode === 'target-size' ? `Optimizing and fitting to target ${targetKb >= 1024 ? (targetKb/1024).toFixed(1)+' MB' : targetKb+' KB'}...` : 'Resampling and compacting streams...');

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
            mode === 'target-size'
              ? `Target size mode (${targetKb >= 1024 ? (targetKb/1024).toFixed(1)+' MB' : targetKb+' KB'}): Achieved ${formatFileSize(result.compressedSize)} with ${result.savingsPercentage}% size reduction.`
              : `Compressed using ${presetLevel.toUpperCase()} quality preset.`
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
            description="Select or drop your PDF document to shrink file size"
          />

          {/* Compression Configuration Panel */}
          {files.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 animate-in fade-in">
              
              {/* File Info Bar */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-xs">
                  📄 {files[0].name}
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md">
                  Original: {formatFileSize(files[0].size)}
                </span>
              </div>

              {/* 1. Mode Selector (Quality preset vs Target file size) */}
              <div className="space-y-3">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  MODE
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option A: Quality preset */}
                  <label
                    onClick={() => setMode('preset')}
                    className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      mode === 'preset'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 dark:border-indigo-500 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="compress-mode"
                      checked={mode === 'preset'}
                      onChange={() => setMode('preset')}
                      className="mt-0.5 w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">Quality preset</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">One pass, predictable</div>
                    </div>
                  </label>

                  {/* Option B: Target file size */}
                  <label
                    onClick={() => setMode('target-size')}
                    className={`p-4 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      mode === 'target-size'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 dark:border-indigo-500 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="compress-mode"
                      checked={mode === 'target-size'}
                      onChange={() => setMode('target-size')}
                      className="mt-0.5 w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>Target file size</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Smart Fit</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Retries until it fits</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* 2A. If Mode is Quality Preset -> Show Level Options */}
              {mode === 'preset' && (
                <div className="space-y-3 animate-in fade-in">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    COMPRESSION LEVEL
                  </label>

                  <div className="space-y-2.5">
                    {/* Light */}
                    <label
                      onClick={() => setPresetLevel('light')}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        presetLevel === 'light'
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 dark:border-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="compress-level"
                          checked={presetLevel === 'light'}
                          onChange={() => setPresetLevel('light')}
                          className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        />
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Light</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">150 DPI · best quality</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40">
                        High Clarity
                      </span>
                    </label>

                    {/* Balanced */}
                    <label
                      onClick={() => setPresetLevel('balanced')}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        presetLevel === 'balanced'
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 dark:border-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="compress-level"
                          checked={presetLevel === 'balanced'}
                          onChange={() => setPresetLevel('balanced')}
                          className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        />
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Balanced</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">110 DPI · good all-round</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40">
                        Recommended
                      </span>
                    </label>

                    {/* Aggressive */}
                    <label
                      onClick={() => setPresetLevel('aggressive')}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        presetLevel === 'aggressive'
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 dark:border-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="compress-level"
                          checked={presetLevel === 'aggressive'}
                          onChange={() => setPresetLevel('aggressive')}
                          className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        />
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Aggressive</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">72 DPI · smallest file</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40">
                        Max Reduction
                      </span>
                    </label>

                    {/* Lossless */}
                    <label
                      onClick={() => setPresetLevel('lossless')}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        presetLevel === 'lossless'
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 dark:border-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="compress-level"
                          checked={presetLevel === 'lossless'}
                          onChange={() => setPresetLevel('lossless')}
                          className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        />
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Lossless Vector Deflate</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">Preserves original pixels · 100% quality</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40">
                        Pure Lossless
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* 2B. If Mode is Target File Size -> Show Target Size Controls */}
              {mode === 'target-size' && (
                <div className="space-y-4 animate-in fade-in p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-indigo-500" />
                      <span>TARGET FILE SIZE</span>
                    </label>
                    <span className="text-xs text-slate-500">
                      Engine will downsample until file is ≤ target
                    </span>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {[100, 200, 300, 500, 1024, 2048].map((kbVal) => {
                      const isSelected = targetKb === kbVal;
                      const label = kbVal >= 1024 ? `${kbVal / 1024} MB` : `${kbVal} KB`;
                      return (
                        <button
                          key={kbVal}
                          type="button"
                          onClick={() => handleQuickPreset(kbVal)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Target Input */}
                  <div className="flex items-center gap-2 max-w-xs pt-1">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="10"
                        max="50000"
                        value={customInputValue}
                        onChange={(e) => handleCustomInput(e.target.value, targetUnit)}
                        placeholder="Enter target size"
                        className="w-full px-3.5 py-2 text-sm font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                      />
                    </div>
                    
                    <select
                      value={targetUnit}
                      onChange={(e) => {
                        const newUnit = e.target.value as 'KB' | 'MB';
                        setTargetUnit(newUnit);
                        handleCustomInput(customInputValue, newUnit);
                      }}
                      className="px-3 py-2 text-sm font-bold rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="KB">KB</option>
                      <option value="MB">MB</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Extra Toggles */}
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={removeMetadata}
                    onChange={(e) => setRemoveMetadata(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Strip redundant metadata</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={grayscale}
                    onChange={(e) => setGrayscale(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Convert to Grayscale (Extra space reduction)</span>
                </label>
              </div>

              {/* Action Button */}
              <button
                onClick={handleCompress}
                className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                <span>Compress PDF</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
