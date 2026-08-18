import fs from 'fs';
import path from 'path';

const logoPath = path.resolve('logo (3).png');
const publicDir = path.resolve('public');

if (fs.existsSync(logoPath)) {
  const logoBuffer = fs.readFileSync(logoPath);
  
  // Save as main branding assets and all favicon sizes
  fs.writeFileSync(path.join(publicDir, 'avatar-logo.png'), logoBuffer);
  fs.writeFileSync(path.join(publicDir, 'logo.png'), logoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), logoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon-512x512.png'), logoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon-192x192.png'), logoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon-96x96.png'), logoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), logoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), logoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), logoBuffer);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), logoBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), logoBuffer);
  fs.writeFileSync(path.join(publicDir, 'avatar-pdf-logo.jpg'), logoBuffer);
  fs.writeFileSync(path.join(publicDir, 'og-preview.png'), logoBuffer);

  console.log('✅ Successfully replaced and deployed new Avatar PDF logo across all public asset paths.');
} else {
  console.error('❌ logo (3).png not found at:', logoPath);
}
