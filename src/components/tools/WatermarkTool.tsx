import React, { useState } from 'react';
import { ToolDefinition, UploadedFile, WatermarkSettings } from '../../types';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { ResultView } from '../common/ResultView';
import { addWatermarkToPdf } from '../../utils/pdfEngine';
import { downloadUint8Array, fileToArrayBuffer } from '../../utils/fileHelpers';
import { Stamp, Sliders, ArrowRight } from 'lucide-react';

interface WatermarkToolProps {
  tool: ToolDefinition;
}

export const WatermarkTool: React.FC<WatermarkToolProps> = ({ tool }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultData, setResultData] = useState<Uint8Array | null>(null);

  const [settings, setSettings] = useState<WatermarkSettings>({
    type: 'text',
    text: 'CONFIDENTIAL',
    fontColor: '#6366f1',
    fontSize: 48,
    opacity: 0.35,
    rotation: 45,
    position: 'center'
  });

  const handleApply = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const buffer = await fileToArrayBuffer(files[0].file);
      const watermarked = await addWatermarkToPdf(buffer, settings);
      setResultData(watermarked);
    } catch (e: any) {
      alert('Watermark error: ' + e?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {resultData ? (
        <ResultView
          filename={`${files[0]?.name.replace(/\.[^/.]+$/, '')}_watermarked.pdf`}
          newSize={resultData.byteLength}
          onDownload={() => downloadUint8Array(resultData, `${files[0]?.name.replace(/\.[^/.]+$/, '')}_watermarked.pdf`)}
          onReset={() => {
            setFiles([]);
            setResultData(null);
          }}
          additionalInfo="Custom watermark embedded into all document pages."
        />
      ) : isProcessing ? (
        <ProcessingOverlay statusText="Stamping watermark across document pages..." />
      ) : (
        <div className="glass-card rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-200 dark:border-slate-800 space-y-6">
          <FileDropzone
            acceptedFiles=".pdf"
            allowMultiple={false}
            files={files}
            onFilesChange={setFiles}
            title="Upload PDF to Watermark"
            description="Add custom text stamp or repeating diagonal watermark"
          />

          {files.length > 0 && (
            <div className="space-y-5 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={settings.text}
                    onChange={(e) => setSettings({ ...settings, text: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Position &amp; Layout
                  </label>
                  <select
                    value={settings.position}
                    onChange={(e) => setSettings({ ...settings, position: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                  >
                    <option value="center">Centered (Diagonal 45°)</option>
                    <option value="tiled">Repeating Grid (Full Page Tiling)</option>
                    <option value="top-left">Top-Left Corner</option>
                    <option value="top-right">Top-Right Corner</option>
                    <option value="bottom-left">Bottom-Left Corner</option>
                    <option value="bottom-right">Bottom-Right Corner</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Opacity: {Math.round(settings.opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.9"
                    step="0.05"
                    value={settings.opacity}
                    onChange={(e) => setSettings({ ...settings, opacity: +e.target.value })}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Font Size: {settings.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="90"
                    step="2"
                    value={settings.fontSize}
                    onChange={(e) => setSettings({ ...settings, fontSize: +e.target.value })}
                    className="w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.fontColor}
                      onChange={(e) => setSettings({ ...settings, fontColor: e.target.value })}
                      className="w-8 h-8 rounded border-none cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-500">{settings.fontColor}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleApply}
                className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                <Stamp className="w-5 h-5" />
                <span>Stamp Watermark on PDF</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
