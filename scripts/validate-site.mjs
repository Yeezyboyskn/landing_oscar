import { access, readdir, readFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';

const root = process.cwd();
const excludedDirs = new Set(['.git', '.wrangler', 'node_modules', 'outputs', 'work']);
const htmlFiles = [];
const errors = [];
const titles = new Map();

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirs.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (extname(entry.name) === '.html') htmlFiles.push(path);
  }
}

const localTarget = (value) => {
  if (!value || value.startsWith('#') || /^(?:https?:|mailto:|tel:)/.test(value)) return null;
  const pathname = new URL(value, 'https://fariaslabs.cl').pathname;
  if (pathname === '/') return join(root, 'index.html');
  if (pathname.endsWith('/')) return join(root, pathname.slice(1), 'index.html');
  return join(root, pathname.slice(1));
};

await walk(root);

for (const file of htmlFiles) {
  const source = await readFile(file, 'utf8');
  const label = file.slice(root.length + 1).replaceAll('\\', '/');
  const title = source.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = source.match(/<meta name="description" content="([^"]+)">/)?.[1];
  const canonical = source.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  const h1Count = (source.match(/<h1(?:\s|>)/g) ?? []).length;

  if (!title) errors.push(`${label}: falta title.`);
  else if (titles.has(title)) errors.push(`${label}: title duplicado con ${titles.get(title)}.`);
  else titles.set(title, label);
  if (!description) errors.push(`${label}: falta meta description.`);
  if (!canonical?.startsWith('https://fariaslabs.cl')) errors.push(`${label}: canonical inválida.`);
  if (h1Count !== 1) errors.push(`${label}: debe tener exactamente un H1; tiene ${h1Count}.`);
  if (/\[(?:URL|NÚMERO|NOMBRE|AGREGAR|SOLO)/.test(source)) errors.push(`${label}: contiene un placeholder editorial.`);
  if (/href="#"/.test(source)) errors.push(`${label}: contiene un enlace vacío.`);

  for (const match of source.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]); } catch { errors.push(`${label}: JSON-LD inválido.`); }
  }

  for (const match of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = localTarget(match[1]);
    if (!target) continue;
    try { await access(resolve(dirname(file), target)); } catch { errors.push(`${label}: destino inexistente ${match[1]}.`); }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validación correcta: ${htmlFiles.length} páginas, titles únicos, JSON-LD válido y enlaces internos resueltos.`);
