// Membuat PNG ikon dari icons/icon.svg dan icons/icon-maskable.svg dengan Chromium (Playwright).
// Jalankan: node icons/make-icons.mjs
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const dir = dirname(fileURLToPath(import.meta.url));

const jobs = [
  ['icon.svg', 'icon-192.png', 192],
  ['icon.svg', 'icon-512.png', 512],
  ['icon-maskable.svg', 'icon-maskable-512.png', 512],
];
const browser = await chromium.launch();
for (const [src, out, size] of jobs) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  const svg = readFileSync(join(dir, src), 'utf8').replace('<svg ', `<svg width="${size}" height="${size}" `);
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}svg{display:block}</style>${svg}`);
  writeFileSync(join(dir, out), await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } }));
  await page.close();
}
await browser.close();
console.log('ikon dibuat');
