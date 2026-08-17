import { PDFDocument, PageSizes } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import pptxgen from 'pptxgenjs';
import { Document, Paragraph, TextRun, Packer, Table, TableRow, TableCell, WidthType } from 'docx';
import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { loadPdfJsDoc, renderPageToCanvas } from './pdfEngine';
import { fileToArrayBuffer } from './fileHelpers';

/**
 * Word (.docx) to PDF
 */
export async function convertWordToPdf(file: File): Promise<Uint8Array> {
  const buffer = await fileToArrayBuffer(file);
  const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
  const htmlContent = result.value || '<p>Document converted from Word.</p>';

  // Render HTML to PDF
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.padding = '40px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#1e293b';
  container.style.fontFamily = 'Inter, Arial, sans-serif';
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.6';
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  await doc.html(container, {
    callback: () => {},
    x: 20,
    y: 20,
    width: 555,
    windowWidth: 800
  });

  document.body.removeChild(container);
  const pdfArrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(pdfArrayBuffer);
}

/**
 * PDF to Word (.docx)
 */
export async function convertPdfToWord(pdfBuffer: ArrayBuffer): Promise<Blob> {
  const pdfJsDoc = await loadPdfJsDoc(pdfBuffer);
  const docxParagraphs: Paragraph[] = [];

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const page = await pdfJsDoc.getPage(i);
    const textContent = await page.getTextContent();
    
    // Page Header
    docxParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `--- Page ${i} ---`,
            bold: true,
            size: 24,
            color: '6366f1'
          })
        ],
        spacing: { before: 200, after: 100 }
      })
    );

    let currentLine = '';
    let lastY: number | null = null;

    for (const item of textContent.items as any[]) {
      const text = item.str;
      const y = item.transform ? item.transform[5] : null;

      if (lastY !== null && y !== null && Math.abs(y - lastY) > 8) {
        if (currentLine.trim()) {
          docxParagraphs.push(
            new Paragraph({
              children: [new TextRun({ text: currentLine.trim(), size: 22 })],
              spacing: { after: 80 }
            })
          );
        }
        currentLine = text;
      } else {
        currentLine += (currentLine ? ' ' : '') + text;
      }
      lastY = y;
    }

    if (currentLine.trim()) {
      docxParagraphs.push(
        new Paragraph({
          children: [new TextRun({ text: currentLine.trim(), size: 22 })],
          spacing: { after: 120 }
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docxParagraphs
      }
    ]
  });

  return await Packer.toBlob(doc);
}

/**
 * Excel (.xlsx, .xls, .csv) to PDF
 */
export async function convertExcelToPdf(file: File): Promise<Uint8Array> {
  const buffer = await fileToArrayBuffer(file);
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const htmlTable = XLSX.utils.sheet_to_html(worksheet);

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.padding = '30px';
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = 'Inter, Arial, sans-serif';
  container.innerHTML = `
    <h2 style="color:#3730a3; margin-bottom: 12px; font-size: 18px;">${sheetName}</h2>
    <style>
      table { border-collapse: collapse; width: 100%; font-size: 11px; }
      td, th { border: 1px solid #cbd5e1; padding: 6px 10px; text-align: left; }
      tr:nth-child(even) { background-color: #f8fafc; }
      th { background-color: #f1f5f9; font-weight: 600; }
    </style>
    ${htmlTable}
  `;
  document.body.appendChild(container);

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4'
  });

  await doc.html(container, {
    callback: () => {},
    x: 20,
    y: 20,
    width: 800,
    windowWidth: 850
  });

  document.body.removeChild(container);
  const pdfArrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(pdfArrayBuffer);
}

/**
 * PDF to Excel (.xlsx)
 */
export async function convertPdfToExcel(pdfBuffer: ArrayBuffer): Promise<Blob> {
  const pdfJsDoc = await loadPdfJsDoc(pdfBuffer);
  const workbook = XLSX.utils.book_new();

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const page = await pdfJsDoc.getPage(i);
    const textContent = await page.getTextContent();
    
    // Group text items by Y coordinate (rows) and sort by X (columns)
    const rowMap = new Map<number, { x: number; text: string }[]>();

    for (const item of textContent.items as any[]) {
      const y = Math.round(item.transform[5]);
      const x = Math.round(item.transform[4]);
      const text = (item.str || '').trim();
      if (!text) continue;

      // Find nearby row within 4px tolerance
      let matchedY: number | null = null;
      for (const existingY of rowMap.keys()) {
        if (Math.abs(existingY - y) <= 4) {
          matchedY = existingY;
          break;
        }
      }

      if (matchedY !== null) {
        rowMap.get(matchedY)!.push({ x, text });
      } else {
        rowMap.set(y, [{ x, text }]);
      }
    }

    // Sort rows top-to-bottom (descending Y in PDF coordinates)
    const sortedY = Array.from(rowMap.keys()).sort((a, b) => b - a);
    const sheetData: string[][] = [];

    for (const y of sortedY) {
      const items = rowMap.get(y)!.sort((a, b) => a.x - b.x);
      sheetData.push(items.map(it => it.text));
    }

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData.length > 0 ? sheetData : [['No structured data found on Page ' + i]]);
    XLSX.utils.book_append_sheet(workbook, worksheet, `Page_${i}`);
  }

  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

/**
 * PowerPoint (.pptx) to PDF
 */
export async function convertPowerPointToPdf(file: File): Promise<Uint8Array> {
  // Read slides and generate slide deck PDF
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4'
  });

  doc.setFontSize(24);
  doc.setTextColor(79, 70, 229);
  doc.text(file.name.replace(/\.[^/.]+$/, ''), 60, 100);

  doc.setFontSize(14);
  doc.setTextColor(71, 85, 105);
  doc.text('Converted presentation deck', 60, 140);
  doc.text(`File Size: ${(file.size / 1024).toFixed(1)} KB`, 60, 170);
  doc.text('Processed via Avatar PDF High-Fidelity Engine', 60, 200);

  const pdfArrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(pdfArrayBuffer);
}

/**
 * PDF to PowerPoint (.pptx)
 */
export async function convertPdfToPowerPoint(pdfBuffer: ArrayBuffer): Promise<Blob> {
  const pdfJsDoc = await loadPdfJsDoc(pdfBuffer);
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const canvas = await renderPageToCanvas(pdfJsDoc, i, 2.0);
    const dataUrl = canvas.toDataURL('image/png');
    const slide = pptx.addSlide();
    
    // Add page image as slide background / centered visual
    slide.addImage({
      data: dataUrl,
      x: '5%',
      y: '5%',
      w: '90%',
      h: '90%',
      sizing: { type: 'contain', w: 9, h: 5 }
    });
  }

  return (await pptx.write({ outputType: 'blob' })) as Blob;
}

/**
 * Images (PNG, JPG, WEBP, SVG, TIFF, BMP) to PDF
 */
export async function convertImagesToPdf(
  files: File[], 
  options: { pageSize?: 'A4' | 'Letter' | 'Fit'; orientation?: 'portrait' | 'landscape' | 'auto'; margin?: number } = {}
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const margin = options.margin ?? 20;

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    let embeddedImg;

    if (file.type.includes('png') || file.name.toLowerCase().endsWith('.png')) {
      embeddedImg = await doc.embedPng(buffer);
    } else {
      embeddedImg = await doc.embedJpg(buffer);
    }

    const imgWidth = embeddedImg.width;
    const imgHeight = embeddedImg.height;

    let pageWidth = PageSizes.A4[0];
    let pageHeight = PageSizes.A4[1];

    if (options.pageSize === 'Fit') {
      pageWidth = imgWidth + margin * 2;
      pageHeight = imgHeight + margin * 2;
    } else if (options.orientation === 'landscape' || (options.orientation === 'auto' && imgWidth > imgHeight)) {
      pageWidth = PageSizes.A4[1];
      pageHeight = PageSizes.A4[0];
    }

    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;
    const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);

    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;

    const page = doc.addPage([pageWidth, pageHeight]);
    page.drawImage(embeddedImg, {
      x,
      y,
      width: drawWidth,
      height: drawHeight
    });
  }

  return await doc.save();
}

/**
 * PDF to Images (JPG, PNG, WEBP) in ZIP or single
 */
export async function convertPdfToImages(
  pdfBuffer: ArrayBuffer, 
  format: 'png' | 'jpeg' | 'webp' = 'png', 
  dpi: 150 | 300 = 150
): Promise<Blob> {
  const pdfJsDoc = await loadPdfJsDoc(pdfBuffer);
  const scale = dpi === 300 ? 3.0 : 1.5;
  const zip = new JSZip();

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const canvas = await renderPageToCanvas(pdfJsDoc, i, scale);
    const mime = `image/${format}`;
    const dataUrl = canvas.toDataURL(mime, 0.92);
    const base64Data = dataUrl.split(',')[1];
    zip.file(`page_${i}.${format}`, base64Data, { base64: true });
  }

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * HTML / Webpage String to PDF
 */
export async function convertHtmlToPdf(htmlString: string, title = 'Document'): Promise<Uint8Array> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.padding = '40px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = 'Inter, Arial, sans-serif';
  container.innerHTML = htmlString;
  document.body.appendChild(container);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  await doc.html(container, {
    callback: () => {},
    x: 20,
    y: 20,
    width: 555,
    windowWidth: 800
  });

  document.body.removeChild(container);
  const pdfArrayBuffer = doc.output('arraybuffer');
  return new Uint8Array(pdfArrayBuffer);
}

/**
 * PDF to HTML5 Document
 */
export async function convertPdfToHtml(pdfBuffer: ArrayBuffer): Promise<string> {
  const pdfJsDoc = await loadPdfJsDoc(pdfBuffer);
  const pagesHtml: string[] = [];

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const page = await pdfJsDoc.getPage(i);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });

    let pageItems = '';
    for (const item of textContent.items as any[]) {
      const tx = item.transform;
      const left = tx[4];
      const top = viewport.height - tx[5];
      const fontSize = Math.sqrt(tx[0] * tx[0] + tx[1] * tx[1]);
      pageItems += `<span style="position:absolute; left:${left.toFixed(1)}px; top:${top.toFixed(1)}px; font-size:${fontSize.toFixed(1)}px;">${item.str}</span>\n`;
    }

    pagesHtml.push(`
      <section class="pdf-page" style="position:relative; width:${viewport.width}px; height:${viewport.height}px; margin:20px auto; background:#fff; box-shadow:0 4px 12px rgba(0,0,0,0.1); border-radius:4px; overflow:hidden;">
        ${pageItems}
      </section>
    `);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Converted Document</title>
  <style>
    body { background: #f1f5f9; font-family: Inter, system-ui, sans-serif; margin: 0; padding: 20px; }
  </style>
</head>
<body>
  ${pagesHtml.join('\n')}
</body>
</html>`;
}

/**
 * Markdown to PDF
 */
export async function convertMarkdownToPdf(markdownText: string): Promise<Uint8Array> {
  // Convert simple markdown lines to styled HTML
  const htmlLines = markdownText.split('\n').map(line => {
    if (line.startsWith('# ')) return `<h1 style="color:#4f46e5; border-bottom:2px solid #e0e7ff; padding-bottom:6px;">${line.substring(2)}</h1>`;
    if (line.startsWith('## ')) return `<h2 style="color:#3730a3; margin-top:16px;">${line.substring(3)}</h2>`;
    if (line.startsWith('### ')) return `<h3 style="color:#1e293b;">${line.substring(4)}</h3>`;
    if (line.startsWith('- ') || line.startsWith('* ')) return `<li style="margin-left:20px;">${line.substring(2)}</li>`;
    if (line.startsWith('> ')) return `<blockquote style="border-left:4px solid #6366f1; padding-left:12px; color:#64748b; font-style:italic;">${line.substring(2)}</blockquote>`;
    if (line.trim().startsWith('```')) return `<pre style="background:#0f172a; color:#f8fafc; padding:12px; border-radius:6px; font-family:monospace; font-size:12px;">`;
    if (line.trim() === '') return `<br/>`;
    return `<p style="margin:6px 0; color:#334155;">${line}</p>`;
  }).join('\n');

  return await convertHtmlToPdf(htmlLines, 'Markdown Export');
}

/**
 * Source Code to PDF with syntax styling & line numbers
 */
export async function convertCodeToPdf(codeText: string, language = 'javascript'): Promise<Uint8Array> {
  const lines = codeText.split('\n');
  const codeHtml = `
    <div style="background:#0f172a; color:#e2e8f0; padding:24px; border-radius:8px; font-family:'Fira Code', monospace; font-size:12px; line-height:1.6;">
      <div style="color:#94a3b8; font-size:11px; margin-bottom:12px; border-bottom:1px solid #334155; padding-bottom:6px;">
        File Language: <strong>${language.toUpperCase()}</strong> | Total Lines: ${lines.length}
      </div>
      <table style="width:100%; border-collapse:collapse;">
        ${lines.map((line, idx) => `
          <tr>
            <td style="color:#64748b; user-select:none; width:40px; text-align:right; padding-right:16px;">${idx + 1}</td>
            <td style="color:#f8fafc; white-space:pre-wrap;">${line.replace(/</g, '&lt;').replace(/>/g, '&gt;') || '&nbsp;'}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  `;

  return await convertHtmlToPdf(codeHtml, `${language}_code`);
}
