import React, { useState } from 'react';
import { ToolDefinition, UploadedFile } from '../../types';
import { FileDropzone } from '../common/FileDropzone';
import { ProcessingOverlay } from '../common/ProcessingOverlay';
import { ResultView } from '../common/ResultView';
import { 
  convertWordToPdf, 
  convertPdfToWord, 
  convertExcelToPdf, 
  convertPdfToExcel,
  convertPowerPointToPdf,
  convertPdfToPowerPoint,
  convertImagesToPdf,
  convertPdfToImages,
  convertHtmlToPdf,
  convertPdfToHtml,
  convertMarkdownToPdf,
  convertCodeToPdf
} from '../../utils/conversionEngine';
import { 
  extractTextFromPdf, 
  extractImagesFromPdf 
} from '../../utils/pdfEngine';
import { 
  downloadUint8Array, 
  downloadBlob, 
  downloadText, 
  fileToArrayBuffer 
} from '../../utils/fileHelpers';
import { ArrowRight, Download, Sparkles, Sliders } from 'lucide-react';

interface GenericConvertToolProps {
  tool: ToolDefinition;
}

export const GenericConvertTool: React.FC<GenericConvertToolProps> = ({ tool }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  
  // Custom text / markdown / code inputs for text-to-pdf, markdown-to-pdf, code-to-pdf, html-to-pdf
  const isInputTextTool = ['text-to-pdf', 'markdown-to-pdf', 'code-to-pdf', 'html-to-pdf'].includes(tool.id);
  const [inputText, setInputText] = useState(
    tool.id === 'markdown-to-pdf'
      ? '# DocuVortix PDF Studio\n\nWelcome to the **Markdown to PDF** converter.\n\n- 100% Client-Side\n- Instant Rendering\n- GFM Tables & Code\n\n```javascript\nconsole.log("Hello PDF!");\n```\n'
      : tool.id === 'code-to-pdf'
      ? '// Enter or paste your source code here\nfunction calculateFactorial(n) {\n  if (n <= 1) return 1;\n  return n * calculateFactorial(n - 1);\n}\n'
      : tool.id === 'html-to-pdf'
      ? '<div style="padding: 20px; font-family: sans-serif;">\n  <h1 style="color: #4f46e5;">DocuVortix HTML to PDF</h1>\n  <p>Render any HTML snippet or styled template directly to PDF.</p>\n</div>'
      : 'Type or paste plain text here to convert into a clean PDF document...'
  );

  // Result state
  const [downloadPayload, setDownloadPayload] = useState<{
    data: Uint8Array | Blob | string;
    filename: string;
    type: 'uint8' | 'blob' | 'text' | 'html';
    size?: number;
  } | null>(null);

  const handleConvert = async () => {
    setIsProcessing(true);
    setProgress(25);
    setStatusText(`Converting with ${tool.name} engine...`);

    try {
      if (isInputTextTool) {
        setProgress(60);
        let pdfData: Uint8Array;
        if (tool.id === 'markdown-to-pdf') {
          pdfData = await convertMarkdownToPdf(inputText);
        } else if (tool.id === 'code-to-pdf') {
          pdfData = await convertCodeToPdf(inputText, 'javascript');
        } else if (tool.id === 'html-to-pdf') {
          pdfData = await convertHtmlToPdf(inputText);
        } else {
          pdfData = await convertHtmlToPdf(`<pre style="font-family:sans-serif; white-space:pre-wrap;">${inputText}</pre>`);
        }
        setProgress(100);
        setDownloadPayload({
          data: pdfData,
          filename: `${tool.id}_export.pdf`,
          type: 'uint8',
          size: pdfData.byteLength
        });
        return;
      }

      if (files.length === 0) return;
      const file = files[0].file;
      const buffer = await fileToArrayBuffer(file);
      const baseName = file.name.replace(/\.[^/.]+$/, '');

      setProgress(50);
      setStatusText('Parsing document streams...');

      switch (tool.id) {
        case 'word-to-pdf': {
          const pdfData = await convertWordToPdf(file);
          setDownloadPayload({ data: pdfData, filename: `${baseName}.pdf`, type: 'uint8', size: pdfData.byteLength });
          break;
        }
        case 'pdf-to-word': {
          const docxBlob = await convertPdfToWord(buffer);
          setDownloadPayload({ data: docxBlob, filename: `${baseName}.docx`, type: 'blob', size: docxBlob.size });
          break;
        }
        case 'excel-to-pdf': {
          const pdfData = await convertExcelToPdf(file);
          setDownloadPayload({ data: pdfData, filename: `${baseName}.pdf`, type: 'uint8', size: pdfData.byteLength });
          break;
        }
        case 'pdf-to-excel': {
          const xlsxBlob = await convertPdfToExcel(buffer);
          setDownloadPayload({ data: xlsxBlob, filename: `${baseName}.xlsx`, type: 'blob', size: xlsxBlob.size });
          break;
        }
        case 'powerpoint-to-pdf': {
          const pdfData = await convertPowerPointToPdf(file);
          setDownloadPayload({ data: pdfData, filename: `${baseName}.pdf`, type: 'uint8', size: pdfData.byteLength });
          break;
        }
        case 'pdf-to-powerpoint': {
          const pptxBlob = await convertPdfToPowerPoint(buffer);
          setDownloadPayload({ data: pptxBlob, filename: `${baseName}.pptx`, type: 'blob', size: pptxBlob.size });
          break;
        }
        case 'image-to-pdf': {
          const rawFiles = files.map(f => f.file);
          const pdfData = await convertImagesToPdf(rawFiles, { pageSize: 'A4', orientation: 'auto' });
          setDownloadPayload({ data: pdfData, filename: `${baseName}_images.pdf`, type: 'uint8', size: pdfData.byteLength });
          break;
        }
        case 'pdf-to-image': {
          const zipBlob = await convertPdfToImages(buffer, 'png', 150);
          setDownloadPayload({ data: zipBlob, filename: `${baseName}_images_png.zip`, type: 'blob', size: zipBlob.size });
          break;
        }
        case 'pdf-to-html': {
          const htmlDoc = await convertPdfToHtml(buffer);
          setDownloadPayload({ data: htmlDoc, filename: `${baseName}.html`, type: 'html', size: htmlDoc.length });
          break;
        }
        case 'pdf-to-text': {
          const textContent = await extractTextFromPdf(buffer);
          setDownloadPayload({ data: textContent, filename: `${baseName}.txt`, type: 'text', size: textContent.length });
          break;
        }
        case 'extract-images': {
          const zipBlob = await extractImagesFromPdf(buffer);
          setDownloadPayload({ data: zipBlob, filename: `${baseName}_extracted_images.zip`, type: 'blob', size: zipBlob.size });
          break;
        }
        default:
          alert('Tool conversion underway!');
      }

      setProgress(100);
    } catch (err: any) {
      console.error(err);
      alert(`Conversion error: ${err?.message || 'Please check the file format'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!downloadPayload) return;
    const { data, filename, type } = downloadPayload;

    if (type === 'uint8') {
      downloadUint8Array(data as Uint8Array, filename);
    } else if (type === 'blob') {
      downloadBlob(data as Blob, filename);
    } else if (type === 'html') {
      downloadText(data as string, filename, 'text/html');
    } else {
      downloadText(data as string, filename, 'text/plain');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setDownloadPayload(null);
    setProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {downloadPayload ? (
        <ResultView
          filename={downloadPayload.filename}
          newSize={downloadPayload.size}
          onDownload={handleDownload}
          onReset={handleReset}
          additionalInfo={`Processed with ${tool.name}.`}
        />
      ) : isProcessing ? (
        <ProcessingOverlay progress={progress} statusText={statusText} />
      ) : (
        <div className="glass-card rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-200/80 dark:border-slate-800 space-y-6">
          
          {isInputTextTool ? (
            /* Live text / markdown / code editor */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-bold text-sm text-slate-900 dark:text-white">
                  Enter or Paste Content for {tool.name}
                </label>
                <span className="text-xs text-slate-500">{inputText.length} characters</span>
              </div>

              <textarea
                rows={12}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-4 rounded-xl font-mono text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={handleConvert}
                className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Generate PDF Document</span>
              </button>
            </div>
          ) : (
            /* Standard File Dropzone */
            <div className="space-y-6">
              <FileDropzone
                acceptedFiles={tool.acceptedFiles}
                allowMultiple={tool.allowMultiple}
                files={files}
                onFilesChange={setFiles}
                title={`Upload files for ${tool.name}`}
                description={`Drop ${tool.acceptedFiles} file(s) to convert`}
              />

              {files.length > 0 && (
                <button
                  onClick={handleConvert}
                  className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span>Convert with {tool.name}</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
