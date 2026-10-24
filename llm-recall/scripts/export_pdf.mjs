#!/usr/bin/env node
// Export the authored SVG figures as vector PDF pages, without a browser.
// Usage: node scripts/export_pdf.mjs [output.pdf]
import { mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { figures } from '../js/figures.js';
import { C, esc } from '../js/drawing.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const destination = process.argv[2] ? resolve(process.argv[2]) : join(root, 'pdf/how-llms-recall.pdf');
const parts = readFileSync(join(root, 'slides.md'), 'utf8').trim().split(/\r?\n---\r?\n/);
const hopfield = JSON.parse(readFileSync(join(root, 'assets/hopfield.json'), 'utf8'));
if (parts.length !== figures.length) throw new Error('The manuscript and figure counts do not match.');

function page(part, figure, index) {
  const [audience, notes] = part.split(/\r?\nNote:\r?\n/);
  const clean = audience.replace(/<!--.*?-->/gs, '').replace(/^> .*$/gm, '').trim();
  const heading = clean.match(/^#{1,2} (.+)$/);
  if (!heading || !notes) throw new Error(`Slide ${index + 1} must contain one headline, a figure, and notes.`);
  const sourceLine = notes.split('\n').find(line => /^\*\*(?:Source|Sources|Basis):\*\*/.test(line));
  const source = sourceLine?.match(/\[([^\]]+)\]\(([^)]+)\)/);
  const sourceLink = source
    ? `<a href="${esc(source[2])}"><text x="80" y="853" class="mono" font-size="16" fill="${C.muted}">${esc(source[1].split(',')[0].replaceAll('*', ''))}</text></a>`
    : '';
  const cover = figure.cover;
  const diagram = figure.render(figure.steps, { id: `s${String(index + 1).padStart(2, '0')}`, hopfield, motion: false })
    .replace('<svg ', `<svg x="80" y="${cover ? 232.5 : 203.4}" width="1440" height="${cover ? 540 : 580}" `);
  // Static counterpart of styles/deck.css: 1600 × 900, with the same margins.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" font-family="Avenir Next, Segoe UI, Arial, sans-serif">
    <title>${esc(heading[1])}</title>
    <style>.mono { font-family:"SFMono-Regular",Consolas,"Liberation Mono",monospace; }</style>
    <rect width="1600" height="900" fill="${C.bg}"/>
    <circle cx="84" cy="65" r="3.5" fill="${C.teal}"/>
    <text x="102" y="70" font-size="15" font-weight="600" letter-spacing="2.25" fill="${C.ink}">HOW LLMS RECALL</text>
    <text x="1520" y="70" class="mono" font-size="14" letter-spacing="1.12" text-anchor="end" fill="${C.muted}">${esc(figure.chapter)}</text>
    <text x="80" y="${cover ? 184 : 161}" font-size="${cover ? 96 : 70}" font-weight="600" letter-spacing="${cover ? -3.84 : -2.8}" fill="${C.ink}">${esc(heading[1])}</text>
    ${diagram}
    ${sourceLink}
    <text x="1520" y="853" class="mono" font-size="16" text-anchor="end" fill="${C.muted}">${String(index + 1).padStart(2, '0')} / ${figures.length}</text>
  </svg>`;
}

const scratch = join(root, 'tmp/pdfs');
mkdirSync(scratch, { recursive: true });
const work = mkdtempSync(join(scratch, 'export-'));
try {
  const files = parts.map((part, index) => {
    const file = join(work, `slide-${String(index + 1).padStart(2, '0')}.svg`);
    writeFileSync(file, page(part, figures[index], index));
    return file;
  });
  const pdf = join(work, 'slides.pdf');
  const cache = join(work, 'cache');
  mkdirSync(cache);
  const result = spawnSync('rsvg-convert', ['--format', 'pdf', '--output', pdf, ...files], {
    encoding: 'utf8', env: { ...process.env, XDG_CACHE_HOME: cache }
  });
  if (result.error?.code === 'ENOENT') throw new Error('PDF export requires rsvg-convert from librsvg (on macOS: brew install librsvg).');
  if (result.error || result.status !== 0) throw new Error(result.stderr || result.error?.message || 'PDF conversion failed.');
  if (!readFileSync(pdf).subarray(0, 5).equals(Buffer.from('%PDF-'))) throw new Error('The converter did not produce a PDF.');
  mkdirSync(dirname(destination), { recursive: true });
  renameSync(pdf, destination);
  console.log(`Exported ${figures.length} vector slides (16:9, final build states) to ${destination}`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
