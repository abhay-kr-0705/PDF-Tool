import * as ftp from 'basic-ftp';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Load .env.deploy or .env
const envDeployPath = path.join(projectRoot, '.env.deploy');
const envPath = path.join(projectRoot, '.env');

if (fs.existsSync(envDeployPath)) {
  dotenv.config({ path: envDeployPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const rawHost = process.env.HOSTINGER_FTP_HOST || '';
const host = rawHost.replace(/^ftp:\/\//i, '').replace(/\/+$/, '');
const user = process.env.HOSTINGER_FTP_USER;
const password = process.env.HOSTINGER_FTP_PASSWORD;
const port = parseInt(process.env.HOSTINGER_FTP_PORT || '21', 10);
const remoteDir = process.env.HOSTINGER_REMOTE_DIR || 'public_html';
const secure = process.env.HOSTINGER_FTP_SECURE === 'true';

console.log('\n🚀 ===============================================');
console.log('   Avatar PDF — Hostinger 1-Click Terminal Deploy');
console.log('=================================================\n');

if (!host || !user || !password) {
  console.error('❌ Missing Hostinger FTP Credentials in .env.deploy!\n');
  process.exit(1);
}

async function deploy() {
  // Step 1: Build Production Bundle
  console.log('📦 Step 1: Building production bundle (tsc && vite build)...');
  try {
    execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
    console.log('✅ Build completed successfully.\n');
  } catch (err) {
    console.error('❌ Build failed! Deployment aborted.');
    process.exit(1);
  }

  const distDir = path.join(projectRoot, 'dist');
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist/ directory not found after build!');
    process.exit(1);
  }

  // Step 2: Connect to Hostinger FTP
  const client = new ftp.Client(60000);
  client.ftp.verbose = false;

  try {
    console.log(`🔌 Step 2: Connecting to Hostinger FTP (${host}:${port})...`);
    await client.access({
      host,
      user,
      password,
      port,
      secure: secure ? 'explicit' : false
    });
    console.log('✅ Connected to Hostinger server successfully.\n');

    // Step 3: Smart Working Directory Detection
    const currentPwd = await client.pwd();
    console.log(`📂 Remote Current Directory: ${currentPwd}`);

    if (currentPwd.endsWith('public_html')) {
      // User is already in public_html root
      console.log('✅ Already at website root (public_html).');
    } else {
      console.log(`Navigating to "${remoteDir}"...`);
      await client.ensureDir(remoteDir);
    }

    // Clean up Hostinger default.php placeholder or stray nested folders if present
    try {
      await client.remove('default.php');
      console.log('🧹 Cleaned Hostinger default placeholder page (default.php)');
    } catch (e) {
      // Ignore if not present
    }

    try {
      await client.removeDir('public_html');
      console.log('🧹 Cleaned nested public_html directory');
    } catch (e) {
      // Ignore
    }

    // Step 4: Upload all files & folders from dist directly to root
    console.log(`\n📤 Step 4: Uploading all production files from dist/ to website root...`);
    client.trackProgress(info => {
      process.stdout.write(`\r   Uploading: ${info.name} (${(info.bytesOverall / 1024).toFixed(1)} KB uploaded)`);
    });

    await client.uploadFromDir(distDir);
    console.log('\n\n✨ All files uploaded directly to website root successfully!');
    console.log('\n=================================================');
    console.log('🎉 DEPLOYMENT SUCCESSFUL!');
    console.log('🌐 Live Website : https://avatarpdf.com');
    console.log('🗺️ Live Sitemap : https://avatarpdf.com/sitemap.xml');
    console.log('🤖 Live Robots  : https://avatarpdf.com/robots.txt');
    console.log('=================================================\n');
  } catch (error) {
    console.error('\n❌ Deployment Error:', error.message || error);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
