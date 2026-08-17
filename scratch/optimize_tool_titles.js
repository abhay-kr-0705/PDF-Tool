import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolsDataPath = path.resolve(__dirname, '../src/data/toolsData.ts');

let content = fs.readFileSync(toolsDataPath, 'utf8');

// Normalize metaTitle patterns to high-ranking competitor pattern
content = content.replace(/metaTitle:\s*['"`]([^'"`]+)['"`]/g, (match, title) => {
  let clean = title.replace(/\s*\|?\s*Avatar PDF/g, '').replace(/\s*—\s*Avatar PDF/g, '').replace(/\s*-\s*Avatar PDF/g, '').trim();
  clean = clean.replace(/—\s*Free, Fast & 100% Private Online/i, '| Free Online')
               .replace(/—\s*Free & Accurate Online/i, '| Free Online')
               .replace(/—\s*Reduce PDF Size Without Losing Quality/i, '| Reduce PDF File Size Online Free')
               .replace(/—\s*Combine Multiple PDFs Fast & Free/i, '| Combine PDF Files Online Free')
               .replace(/—\s*Extract Pages or Separate PDF Files/i, '| Separate PDF Pages Online Free')
               .replace(/—\s*Free In-Browser PDF Editor/i, '| Free Online PDF Editor')
               .replace(/—\s*Edit, Fix & Fix Scanned Documents with OCR/i, '| OCR & Edit Scanned PDFs Online Free')
               .replace(/—\s*Convert Spreadsheets Fast & Free/i, '| Convert Excel to PDF Online Free')
               .replace(/—\s*Convert Presentations Fast & Free/i, '| Convert PowerPoint to PDF Online Free')
               .replace(/—\s*Convert PDF Pages to High-Res JPG\/PNG/i, '| Convert PDF to Image Online Free')
               .replace(/—\s*Convert JPG, PNG, WebP to PDF/i, '| Convert Images to PDF Online Free');

  return `metaTitle: '${clean} - Avatar PDF'`;
});

fs.writeFileSync(toolsDataPath, content, 'utf8');
console.log('Optimized all tool metaTitles in toolsData.ts successfully!');
