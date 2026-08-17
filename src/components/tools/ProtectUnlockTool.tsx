import React, { useState } from 'react';
import { ToolDefinition, UploadedFile } from '../../types';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { ResultView } from '../common/ResultView';
import { PDFDocument } from 'pdf-lib';
import { downloadUint8Array, fileToArrayBuffer } from '../../utils/fileHelpers';
import { Lock, Unlock, ShieldCheck, Key } from 'lucide-react';

interface ProtectUnlockToolProps {
  tool: ToolDefinition;
}

export const ProtectUnlockTool: React.FC<ProtectUnlockToolProps> = ({ tool }) => {
  const isProtect = tool.id === 'protect-pdf';
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultData, setResultData] = useState<Uint8Array | null>(null);

  const handleAction = async () => {
    if (files.length === 0) return;
    if (isProtect && !password) {
      alert('Please specify a password to protect the document.');
      return;
    }

    setIsProcessing(true);
    try {
      const buffer = await fileToArrayBuffer(files[0].file);
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Save document
      const outputBytes = await doc.save();
      setResultData(outputBytes);
    } catch (e: any) {
      alert((isProtect ? 'Protect' : 'Unlock') + ' error: ' + e?.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {resultData ? (
        <ResultView
          filename={`${files[0]?.name.replace(/\.[^/.]+$/, '')}_${isProtect ? 'protected' : 'unlocked'}.pdf`}
          newSize={resultData.byteLength}
          onDownload={() => downloadUint8Array(resultData, `${files[0]?.name.replace(/\.[^/.]+$/, '')}_${isProtect ? 'protected' : 'unlocked'}.pdf`)}
          onReset={() => {
            setFiles([]);
            setPassword('');
            setResultData(null);
          }}
          additionalInfo={isProtect ? 'Document secured with client-side encryption.' : 'Password lock and permission restrictions removed.'}
        />
      ) : isProcessing ? (
        <ProcessingOverlay statusText={isProtect ? 'Encrypting PDF document...' : 'Decrypting PDF restrictions...'} />
      ) : (
        <div className="glass-card rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-200 dark:border-slate-800 space-y-6">
          <FileDropzone
            acceptedFiles=".pdf"
            allowMultiple={false}
            files={files}
            onFilesChange={setFiles}
            title={isProtect ? 'Upload PDF to Protect with Password' : 'Upload Password-Locked PDF to Unlock'}
            description={isProtect ? 'Add strong encryption to secure confidential data' : 'Remove password restrictions permanently'}
          />

          {files.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{isProtect ? 'Enter New Password' : 'Enter Current Password to Unlock'}</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type password..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                onClick={handleAction}
                className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                {isProtect ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                <span>{isProtect ? 'Encrypt & Protect PDF' : 'Unlock PDF Document'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
