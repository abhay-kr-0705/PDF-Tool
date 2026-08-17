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

const host = process.env.HOSTINGER_FTP_HOST;
const user = process.env.HOSTINGER_FTP_USER;
const password = process.env.HOSTINGER_FTP_PASSWORD;
const port = parseInt(process.env.HOSTINGER_FTP_PORT || '21', 10);
const remoteDir = process.env.HOSTINGER_REMOTE_DIR || 'public_html';
const secure = process.env.HOSTINGER_FTP_SECURE === 'true' || process.env.HOSTINGER_FTP_SECURE === undefined;

console.log('\n🚀 ===============================================');
console.log('   Avatar PDF — Hostinger 1-Click Terminal Deploy');
console.log('=================================================\n');

if (!host || !user || !password) {
  console.error('❌ Missing Hostinger FTP Credentials!\n');
  console.log('👉 To enable 1-click terminal deployment:');
  console.log('   1. Create a file named .env.deploy in the project root:');
  console.log('      (or copy .env.deploy.example -> .env.deploy)');
  console.log('\n   2. Add your Hostinger FTP details inside .env.deploy:');
  console.log('      HOSTINGER_FTP_HOST=ftp.avatarpdf.com');
  console.log('      HOSTINGER_FTP_USER=your_ftp_username');
  console.log('      HOSTINGER_FTP_PASSWORD=your_ftp_password');
  console.log('      HOSTINGER_REMOTE_DIR=public_html');
  console.log('\n   3. Where to find FTP credentials in Hostinger:');
  console.log('      • Log in to Hostinger hPanel');
  console.log('      • Go to Websites -> Manage -> Files -> FTP Accounts');
  console.log('      • Copy FTP IP/Host, Username, and Password');
  console.log('\n   4. Run: npm run deploy\n');
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
  const client = new ftp.Client();
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

    // Step 3: Navigate to remote directory
    console.log(`📂 Step 3: Uploading dist/ to "${remoteDir}" on Hostinger...`);
    await client.ensureDir(remoteDir);
    await client.clearWorkingDir(); // Clean previous build to prevent leftover old hashes

    // Step 4: Upload all files & folders from dist
    client.trackProgress(info => {
      process.stdout.write(`\r   Uploading: ${info.name} (${(info.bytesOverall / 1024).toFixed(1)} KB uploaded)`);
    });

    await client.uploadFromDir(distDir);
    console.log('\n\n✨ Step 4: All files uploaded successfully!');
    console.log('\n=================================================');
    console.log('🎉 DEPLOYMENT SUCCESSFUL!');
    console.log('🌐 Your website is live at: https://avatarpdf.com');
    console.log('=================================================\n');
  } catch (error) {
    console.error('\n❌ Deployment Error:', error.message || error);
    console.log('\n💡 Tip: If connection fails with TLS/Secure error, set HOSTINGER_FTP_SECURE=false in .env.deploy');
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
