import React, { useState, useEffect } from 'react';
import { ToolDefinition, UploadedFile, PdfPagePreview } from '../../types';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { ResultView } from '../common/ResultView';
import { generatePdfThumbnails, mergePdfsAdvanced, AdvancedMergeItem } from '../../utils/pdfEngine';
import { downloadUint8Array, fileToArrayBuffer } from '../../utils/fileHelpers';
import { Layers, Plus, Trash2, RotateCw, Image as ImageIcon, Sliders, CheckCircle2, Circle } from 'lucide-react';

interface MergeToolProps {
  tool: ToolDefinition;
}

interface MergePageItem {
  id: string;
  sourceFileId: string;
  sourceFileName: string;
  pdfBuffer?: ArrayBuffer;
  pageIndex: number;
  thumbnailUrl: string;
  selected: boolean;
  rotation: number;
  isImage?: boolean;
  imageFile?: File;
}

export const MergeTool: React.FC<MergeToolProps> = ({ tool }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [pageItems, setPageItems] = useState<MergePageItem[]>([]);
  const [isAdvancedMode, setIsAdvancedMode] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [resultData, setResultData] = useState<Uint8Array | null>(null);

  // When files change, load thumbnails of pages for each document
  useEffect(() => {
    loadAllFileThumbnails();
  }, [files]);

  const loadAllFileThumbnails = async () => {
    if (files.length === 0) {
      setPageItems([]);
      return;
    }

    const items: MergePageItem[] = [];

    for (const f of files) {
      try {
        const buffer = await fileToArrayBuffer(f.file);
        const thumbs = await generatePdfThumbnails(buffer, 50, f.id);
        thumbs.forEach(t => {
          items.push({
            id: `${f.id}_page_${t.pageNumber}`,
            sourceFileId: f.id,
            sourceFileName: f.name,
            pdfBuffer: buffer,
            pageIndex: t.pageNumber - 1,
            thumbnailUrl: t.thumbnailUrl,
            selected: true,
            rotation: 0,
            isImage: false
          });
        });
      } catch (e) {
        console.warn('Could not read PDF for merge thumbnails', e);
      }
    }

    setPageItems(items);
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newImageItem: MergePageItem = {
        id: `img_${Date.now()}`,
        sourceFileId: 'image',
        sourceFileName: imgFile.name,
        pageIndex: 0,
        thumbnailUrl: reader.result as string,
        selected: true,
        rotation: 0,
        isImage: true,
        imageFile: imgFile
      };
      setPageItems([...pageItems, newImageItem]);
    };
    reader.readAsDataURL(imgFile);
  };

  const togglePageSelect = (id: string) => {
    setPageItems(pageItems.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };

  const rotatePage = (id: string) => {
    setPageItems(pageItems.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
  };

  const removePage = (id: string) => {
    setPageItems(pageItems.filter(p => p.id !== id));
  };

  const movePage = (index: number, direction: 'left' | 'right') => {
    const target = direction === 'left' ? index - 1 : index + 1;
    if (target < 0 || target >= pageItems.length) return;
    const reordered = [...pageItems];
    const temp = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = temp;
    setPageItems(reordered);
  };

  const handleMerge = async () => {
    const selectedPages = pageItems.filter(p => p.selected);
    if (selectedPages.length === 0) {
      alert('Please select at least 1 page or image to merge.');
      return;
    }

    setIsProcessing(true);
    setProgress(20);
    setStatusText(`Compiling ${selectedPages.length} selected pages...`);

    try {
      const advancedItems: AdvancedMergeItem[] = selectedPages.map(p => {
        if (p.isImage) {
          return {
            type: 'image',
            imageFile: p.imageFile,
            rotation: p.rotation
          };
        }
        return {
          type: 'pdf-page',
          pdfBuffer: p.pdfBuffer,
          pageIndex: p.pageIndex,
          rotation: p.rotation
        };
      });

      setProgress(60);
      setStatusText('Writing final combined PDF document...');

      const mergedBytes = await mergePdfsAdvanced(advancedItems);
      setProgress(100);
      setResultData(mergedBytes);
    } catch (err: any) {
      console.error(err);
      alert('Error merging PDFs: ' + (err?.message || 'Check files'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {resultData ? (
        <ResultView
          filename="merged_document.pdf"
          newSize={resultData.byteLength}
          onDownload={() => downloadUint8Array(resultData, 'merged_document.pdf')}
          onReset={() => {
            setFiles([]);
            setPageItems([]);
            setResultData(null);
            setProgress(0);
          }}
          additionalInfo={`Successfully combined ${pageItems.filter(p => p.selected).length} selected pages into a single document.`}
        />
      ) : isProcessing ? (
        <ProcessingOverlay progress={progress} statusText={statusText} />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
          <FileDropzone
            acceptedFiles=".pdf"
            allowMultiple={true}
            files={files}
            onFilesChange={setFiles}
            title="Upload PDF Files to Merge"
            description="Select 2 or more PDFs. You can select exact pages, remove unwanted pages, or add images."
          />

          {files.length > 0 && (
            <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in">
              
              {/* Toolbar: Mode & Add Images */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {pageItems.filter(p => p.selected).length} of {pageItems.length} pages selected
                  </span>
                </div>

                {/* Add Image Button */}
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    id="merge-img-upload"
                    onChange={handleAddImage}
                    className="hidden"
                  />
                  <label
                    htmlFor="merge-img-upload"
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-600 hover:text-indigo-600 hover:border-indigo-500 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>+ Insert Image Page</span>
                  </label>
                </div>
              </div>

              {/* Page-by-Page Thumbnail Grid */}
              {pageItems.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-500 flex justify-between">
                    <span>Click any page to include/exclude. Use arrows to reorder.</span>
                    <span>{files.length} document(s) loaded</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                    {pageItems.map((page, idx) => (
                      <div
                        key={page.id}
                        className={`relative group rounded-xl border-2 overflow-hidden transition-all bg-slate-50 dark:bg-slate-800 ${
                          page.selected 
                            ? 'border-indigo-600 shadow-md shadow-indigo-500/10' 
                            : 'border-slate-200 dark:border-slate-700 opacity-40'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div
                          onClick={() => togglePageSelect(page.id)}
                          className="aspect-[1/1.35] p-2 flex items-center justify-center cursor-pointer relative bg-white dark:bg-slate-950"
                        >
                          <img
                            src={page.thumbnailUrl}
                            alt={`Page ${page.pageIndex + 1}`}
                            className="max-h-full max-w-full object-contain rounded transition-transform"
                            style={{ transform: `rotate(${page.rotation}deg)` }}
                          />

                          {/* Checkbox Badge */}
                          <div className="absolute top-1.5 right-1.5 p-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 shadow">
                            {page.selected ? (
                              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-400" />
                            )}
                          </div>

                          {page.isImage && (
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-white text-[9px] font-bold">
                              IMG
                            </span>
                          )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[80px]">
                            {page.isImage ? 'Image' : `P.${page.pageIndex + 1}`}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => movePage(idx, 'left')}
                              disabled={idx === 0}
                              title="Move Left"
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 text-xs px-0.5"
                            >
                              ◀
                            </button>
                            <button
                              type="button"
                              onClick={() => movePage(idx, 'right')}
                              disabled={idx === pageItems.length - 1}
                              title="Move Right"
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 text-xs px-0.5"
                            >
                              ▶
                            </button>
                            <button
                              type="button"
                              onClick={() => rotatePage(page.id)}
                              title="Rotate 90°"
                              className="p-0.5 text-slate-400 hover:text-indigo-600"
                            >
                              <RotateCw className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removePage(page.id)}
                              title="Delete Page"
                              className="p-0.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Merge Button */}
              <button
                onClick={handleMerge}
                className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Layers className="w-5 h-5" />
                <span>Combine {pageItems.filter(p => p.selected).length} Selected Pages into One PDF</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
