import { createHash, createPublicKey, sign, verify } from 'node:crypto';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';

function argument(name) {
  const index = process.argv.indexOf(`--${name}`);
  if (index < 0 || !process.argv[index + 1]) throw new Error(`Missing --${name}`);
  return process.argv[index + 1];
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

const zipPath = resolve(argument('zip'));
const outputPath = resolve(argument('output'));
const version = argument('version');
const channel = argument('channel');
const commit = argument('commit');
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) throw new Error('Invalid SemVer version');
if (!['stable', 'beta', 'edge'].includes(channel)) throw new Error('Invalid release channel');
if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error('Invalid release commit');

const privateKey = process.env.AISEO_RELEASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
if (!privateKey) throw new Error('AISEO_RELEASE_PRIVATE_KEY is required');
const bytes = await readFile(zipPath);
const info = await stat(zipPath);
const manifest = {
  schema_version: '1.0.0',
  plugin: 'wordpress-aiseo',
  version,
  channel,
  requires_wordpress: '6.2',
  requires_php: '7.4',
  tested_wordpress: process.env.AISEO_TESTED_WORDPRESS || '7.0.4',
  changelog: `AISEO ${version}: same-host Codex OAuth, local SEO engine and portable signed updates.`,
  asset: {
    name: basename(zipPath),
    size: info.size,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  },
  package_url: `https://github.com/Bajna007/Wordpress-AISEO-Releases/releases/download/v${version}/wordpress-aiseo-${version}.zip`,
  release_commit: commit,
  published_at: new Date().toISOString(),
};
const payload = Buffer.from(JSON.stringify(canonicalize(manifest)));
const signature = sign(null, payload, privateKey);
if (!verify(null, payload, createPublicKey(privateKey), signature)) throw new Error('Signature self-check failed');
await writeFile(outputPath, `${JSON.stringify({ ...manifest, signature: signature.toString('base64') }, null, 2)}\n`);
console.log(`Signed ${manifest.asset.name}`);
