import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

const root = process.cwd();
const maxBlobBytes = 5 * 1024 * 1024;
const findings = [];

const secretRules = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g],
  ['github-token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/g],
  ['aws-access-key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ['google-api-key', /\bAIza[0-9A-Za-z_-]{30,}\b/g],
  ['slack-token', /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g],
  ['stripe-secret', /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}\b/g],
  ['resend-api-key', /\bre_[A-Za-z0-9_-]{16,}\b/g],
  ['jwt', /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g],
  [
    'sensitive-assignment',
    /\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|client[_-]?secret|password|passwd|private[_-]?key|secret)\b\s*[:=]\s*["']?([^\s"'`;,}]{12,})/gi
  ],
  ['credential-url', /https?:\/\/[^\s/:@]+:[^\s/@]+@[^\s]+/gi],
  [
    'webhook-url',
    /https?:\/\/(?:hooks\.slack\.com\/services|discord(?:app)?\.com\/api\/webhooks|hook\.(?:us\d+\.)?make\.com|[^\s/]*n8n[^\s/]*\/webhook)\/[^\s"']+/gi
  ]
];

const insecurePattern = /(?:http:\/\/|ws:\/\/|localhost|127\.0\.0\.1)/g;
const allowedInsecure = new Map([
  ['sitemap.xml', new Set(['http://www.sitemaps.org/schemas/sitemap/0.9'])],
  ['scripts/generate-site.mjs', new Set(['http://www.sitemaps.org/schemas/sitemap/0.9'])]
]);
const obviousPlaceholder = /(?:example|placeholder|dummy|sample|xxxx|your[_-]|<[^>]+>|\*{3,}|\$\{\{|process\.env|env\.|secrets\.)/i;

const normalizePath = (path) => path.replaceAll('\\', '/');

function addFinding(scope, source, line, rule) {
  findings.push({ scope, source, line, rule });
}

function scanText(text, source, scope) {
  const normalizedSource = normalizePath(source);
  if (/\.(?:png|jpe?g|gif|webp|ico|pdf|woff2?)(?:\s@|$)/i.test(normalizedSource)) return;

  if (normalizedSource !== 'scripts/scan-security.mjs') {
    for (const [rule, pattern] of secretRules) {
      pattern.lastIndex = 0;
      for (const match of text.matchAll(pattern)) {
        if (obviousPlaceholder.test(match[0])) continue;
        const line = text.slice(0, match.index).split('\n').length;
        addFinding(scope, normalizedSource, line, rule);
      }
    }
  }

  if (scope !== 'working-tree' || normalizedSource === 'scripts/scan-security.mjs') return;

  const allowed = allowedInsecure.get(normalizedSource) ?? new Set();
  for (const [index, line] of text.split('\n').entries()) {
    for (const match of line.matchAll(insecurePattern)) {
      if ([...allowed].some((entry) => line.includes(entry))) continue;
      addFinding(scope, normalizedSource, index + 1, `insecure-reference:${match[0]}`);
    }
  }
}

const trackedFiles = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);

for (const file of trackedFiles) {
  const absolutePath = resolve(root, file);
  const text = await readFile(absolutePath, 'utf8').catch(() => null);
  if (text !== null) scanText(text, normalizePath(relative(root, absolutePath)), 'working-tree');
}

const historyObjects = execFileSync('git', ['rev-list', '--objects', '--all'], { encoding: 'utf8' })
  .split('\n')
  .map((line) => {
    const separator = line.indexOf(' ');
    return separator === -1 ? null : { oid: line.slice(0, separator), path: line.slice(separator + 1) };
  })
  .filter(Boolean);

const scannedBlobs = new Set();
for (const { oid, path } of historyObjects) {
  if (scannedBlobs.has(oid)) continue;

  const type = execFileSync('git', ['cat-file', '-t', oid], { encoding: 'utf8' }).trim();
  if (type !== 'blob') continue;
  scannedBlobs.add(oid);

  const size = Number(execFileSync('git', ['cat-file', '-s', oid], { encoding: 'utf8' }).trim());
  if (!Number.isFinite(size) || size > maxBlobBytes) continue;

  const text = execFileSync('git', ['cat-file', '-p', oid], {
    encoding: 'utf8',
    maxBuffer: maxBlobBytes + 1024
  });
  scanText(text, `${normalizePath(path)} @ ${oid.slice(0, 12)}`, 'git-history');
}

if (findings.length > 0) {
  console.error('Posibles exposiciones detectadas (los valores se ocultan intencionalmente):');
  for (const finding of findings) {
    console.error(`${finding.scope}: ${finding.source}:${finding.line} [${finding.rule}]`);
  }
  process.exit(1);
}

console.log(
  `Escaneo correcto: ${trackedFiles.length} archivos rastreados y ${scannedBlobs.size} objetos históricos, sin secretos ni referencias inseguras.`
);
