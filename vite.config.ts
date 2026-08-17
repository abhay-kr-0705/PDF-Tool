import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['pdfjs-dist', 'pdf-lib', 'docx', 'xlsx', 'pptxgenjs', 'jspdf', 'html2canvas', 'jszip', 'file-saver', 'tesseract.js']
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 2000
  }
});
