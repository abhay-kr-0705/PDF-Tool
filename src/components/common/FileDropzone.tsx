import React, { useRef, useState } from 'react';
import { UploadedFile } from '../../types';
import { formatBytes } from '../../utils/fileHelpers';
import { UploadCloud, File, Trash2, Plus, ArrowUpDown } from 'lucide-react';

interface FileDropzoneProps {
  acceptedFiles: string;
  allowMultiple: boolean;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  title?: string;
  description?: string;
  buttonLabel?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  acceptedFiles,
  allowMultiple,
  files,
  onFilesChange,
  title = 'Select PDF files',
  description = 'or drop files here',
  buttonLabel
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      newFiles.push({
        id: `${f.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file: f,
        name: f.name,
        size: f.size,
        type: f.type,
        status: 'idle'
      });
      if (!allowMultiple) break;
    }

    if (allowMultiple) {
      onFilesChange([...files, ...newFiles]);
    } else {
      onFilesChange(newFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    const reordered = [...files];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    onFilesChange(reordered);
  };

  return (
    <div className="space-y-4">
      {/* Big Action Drop Area (iLovePDF Style) */}
      {files.length === 0 || allowMultiple ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 ${
            isDragOver 
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40' 
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={acceptedFiles}
            multiple={allowMultiple}
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4">
            
            {/* Big Primary Select Button */}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-lg sm:text-xl shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-3 cursor-pointer"
            >
              <UploadCloud className="w-6 h-6" />
              <span>{buttonLabel || title}</span>
            </button>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {description}
            </p>

            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
              Format: <code className="text-slate-600 dark:text-slate-300 font-bold">{acceptedFiles || 'All files'}</code>
            </span>
          </div>
        </div>
      ) : null}

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 px-1">
            <span>Selected File ({files.length})</span>
            {allowMultiple && (
              <button 
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Add more files
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2">
            {files.map((file, idx) => (
              <div
                key={file.id}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <File className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {file.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {formatBytes(file.size)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {allowMultiple && files.length > 1 && (
                    <div className="flex items-center gap-1 mr-1">
                      <button
                        type="button"
                        onClick={() => moveFile(idx, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFile(idx, 'down')}
                        disabled={idx === files.length - 1}
                        title="Move Down"
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-20"
                      >
                        ▼
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    title="Remove file"
                    className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
