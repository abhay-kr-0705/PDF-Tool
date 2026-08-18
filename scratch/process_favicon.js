import fs from 'fs';
import path from 'path';

const sourceImgPath = 'C:\\Users\\abhay\\.gemini\\antigravity-ide\\brain\\3d0330d7-4392-4516-9ea1-c8aa4eeb6eaf\\avatar_pdf_favicon_master_1787029708860.jpg';
const publicDir = path.resolve('public');

if (fs.existsSync(sourceImgPath)) {
  const masterBuffer = fs.readFileSync(sourceImgPath);
  
  // Save as main favicon PNG and apple touch icon
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), masterBuffer);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), masterBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon-512x512.png'), masterBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon-192x192.png'), masterBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon-96x96.png'), masterBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), masterBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), masterBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), masterBuffer);

  console.log('Successfully generated all favicon variations from master icon.');
} else {
  console.error('Source icon file not found at:', sourceImgPath);
}
