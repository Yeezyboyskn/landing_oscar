import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = process.cwd();
const ignoredDirs = new Set(['.git', 'node_modules', '.wrangler']);
const ignoredFiles = new Set(['package-lock.json']);
const allowedMatches = [
  { file: 'sitemap.xml', text: 'http://www.sitemaps.org/schemas/sitemap/0.9' },
  { file: 'scripts/scan-security.mjs', text: 'http://' },
  { file: 'scripts/scan-security.mjs', text: 'ws://' },
  { file: 'scripts/scan-security.mjs', text: 'localhost' },
  { file: 'scripts/scan-security.mjs', text: '127\\.0\\.0\\.1' }
];
const insecurePattern = /(?:http:\/\/|ws:\/\/|localhost|127\.0\.0\.1)/g;
const findings = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirs.has(entry.name)) continue;

    const path = join(dir, entry.name);
    const rel = relative(root, path);

    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }

    if (ignoredFiles.has(entry.name)) continue;

    const text = await readFile(path, 'utf8').catch(() => null);
    if (!text) continue;

    const lines = text.split('\n');
    lines.forEach((line, index) => {
      const matches = line.match(insecurePattern);
      if (!matches) return;

      for (const match of matches) {
        const allowed = allowedMatches.some((allowedMatch) => rel === allowedMatch.file && line.includes(allowedMatch.text));
        if (!allowed) {
          findings.push(`${rel}:${index + 1}: ${line.trim()}`);
          break;
        }
      }
    });
  }
}

await walk(root);

if (findings.length > 0) {
  console.error('Referencias inseguras/locales detectadas:');
  console.error(findings.join('\n'));
  process.exit(1);
}

console.log('Sin referencias inseguras/locales no permitidas.');
