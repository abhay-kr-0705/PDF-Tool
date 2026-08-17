import * as ftp from 'basic-ftp';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.deploy') });

const client = new ftp.Client();
client.ftp.verbose = false;

async function check() {
  await client.access({
    host: process.env.HOSTINGER_FTP_HOST,
    user: process.env.HOSTINGER_FTP_USER,
    password: process.env.HOSTINGER_FTP_PASSWORD,
    port: parseInt(process.env.HOSTINGER_FTP_PORT || '21', 10),
    secure: false
  });

  const pwd = await client.pwd();
  console.log('Current working directory:', pwd);
  const list = await client.list();
  console.log('Root files/folders:');
  list.forEach(item => console.log(`  ${item.isDirectory ? '[DIR]' : '[FILE]'} ${item.name} (${item.size} bytes)`));

  // Check if public_html exists inside
  try {
    const subList = await client.list('public_html');
    console.log('\nInside public_html/:');
    subList.forEach(item => console.log(`  ${item.isDirectory ? '[DIR]' : '[FILE]'} ${item.name}`));
  } catch (e) {
    console.log('No public_html folder');
  }

  client.close();
}

check().catch(console.error);
