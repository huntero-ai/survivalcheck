// Uji: tab nav bawah benar di alur penyiapan & konten tidak tertutup nav.
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = fileURLToPath(new URL('..', import.meta.url));
const types = { '.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json', '.webmanifest':'application/manifest+json', '.svg':'image/svg+xml', '.png':'image/png', '.woff2':'font/woff2', '.md':'text/plain' };
const server = createServer(async (req, res) => {
  try {
    let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (p.endsWith('/')) p += 'index.html';
    const buf = await readFile(join(root, p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(buf);
  } catch { res.writeHead(404); res.end(); }
}).listen(0);
const base = `http://127.0.0.1:${server.address().port}/`;

let fail = 0;
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fail++; };
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 360, height: 640 } })).newPage();
const expected = { '': 'home', '#/profil': 'stok', '#/target': 'stok', '#/keluarga': 'stok', '#/inventaris': 'stok', '#/daya': 'stok', '#/info': 'more', '#/pengaturan': 'more' };
for (const [hash, tab] of Object.entries(expected)) {
  await page.goto(base + hash, { waitUntil: 'networkidle' });
  const cur = await page.$$eval('.bottom-nav a[aria-current="page"]', (a) => a.map((x) => x.dataset.tab));
  ok(cur.length === 1 && cur[0] === tab, `${hash || '#/'} -> tab ${tab} (aktual: ${cur})`);
  const navVisible = await page.locator('.bottom-nav').isVisible();
  const hasNav = await page.evaluate(() => document.body.classList.contains('has-nav'));
  ok(navVisible === hasNav, `${hash || '#/'} nav tampil=${navVisible} sejalan dgn has-nav=${hasNav}`);
}
// Konten paling bawah di #/target tidak tertutup nav.
await page.goto(base + '#/target', { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
const gap = await page.evaluate(() => {
  const nav = document.querySelector('.bottom-nav').getBoundingClientRect().top;
  const main = document.querySelector('.app-main'); const last = [...main.querySelectorAll('*')].filter((e) => e.getBoundingClientRect().height > 0).pop();
  return nav - last.getBoundingClientRect().bottom;
});
ok(gap >= 0, `konten terakhir di #/target tidak tertutup nav (jarak ${Math.round(gap)} px)`);
await browser.close(); server.close();
process.exit(fail ? 1 : 0);
