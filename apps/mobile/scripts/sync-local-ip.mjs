import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const ENV_KEY = 'EXPO_PUBLIC_API_URL';
const DEFAULT_PORT = '3000';

function isPrivateIpv4(ip) {
  return (
    ip.startsWith('10.') || ip.startsWith('192.168.') || /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

function getLocalIpv4() {
  const interfaces = os.networkInterfaces();
  const all = Object.values(interfaces)
    .flat()
    .filter(Boolean)
    .filter((entry) => entry.family === 'IPv4' && !entry.internal)
    .map((entry) => entry.address);

  return all.find(isPrivateIpv4) ?? all[0] ?? null;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function upsertEnvValue(content, key, value) {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, 'm');

  if (pattern.test(content)) {
    return content.replace(pattern, line);
  }

  if (!content.trim()) {
    return `${line}\n`;
  }

  const normalized = content.endsWith('\n') ? content : `${content}\n`;
  return `${normalized}${line}\n`;
}

async function main() {
  const ip = getLocalIpv4();

  if (!ip) {
    console.warn('[sync-local-ip] No local IPv4 found, skipping env update.');
    return;
  }

  const port = process.env.SYNC_LOCAL_IP_PORT || DEFAULT_PORT;
  const apiUrl = `http://${ip}:${port}`;

  const cwd = process.cwd();
  const envLocalPath = path.join(cwd, '.env.local');
  const envPath = path.join(cwd, '.env');

  const targetPath = (await fileExists(envLocalPath))
    ? envLocalPath
    : (await fileExists(envPath))
      ? envPath
      : envLocalPath;

  const existing = (await fileExists(targetPath)) ? await fs.readFile(targetPath, 'utf8') : '';

  const updated = upsertEnvValue(existing, ENV_KEY, apiUrl);
  await fs.writeFile(targetPath, updated, 'utf8');

  console.log(`[sync-local-ip] ${ENV_KEY} -> ${apiUrl}`);
}

main().catch((error) => {
  console.error('[sync-local-ip] Failed to update local API URL.');
  console.error(error);
  process.exitCode = 1;
});
