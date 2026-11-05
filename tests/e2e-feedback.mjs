// Uji feedback: (1) Stok dikelompokkan per kategori, tanpa tahap "Lengkapi/Pelengkap";
// (2) Beranda punya pilihan hari persediaan (mis. 3 -> 7 hari).
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
const SEED = { app: 'survivalcheck', schema: 1,
  profile: { counts: { infant: 0, toddler: 0, child: 0, adult: 2, elderly: 0 }, pregnant: 0, breastfeeding: 0, pets: { dog: 0, cat: 0 }, meds: [], has_electric_medical: false, usage_per_day: {}, scenarios: ['power_outage'], target_days: 3 },
  target: { days: 3, custom: false }, scenarios: ['power_outage'], inventory: {}, settings: { lang: 'id', reminders: {}, reminderDone: {} }, createdAt: new Date().toISOString() };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
const page = await ctx.newPage();
const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
await page.goto(base, { waitUntil: 'load' });
await page.evaluate((s) => localStorage.setItem('survivalcheck.v1', JSON.stringify(s)), SEED);

// ---- 2. Beranda: ganti hari persediaan ----
await page.goto(base + '#/', { waitUntil: 'networkidle' });
await page.reload({ waitUntil: 'networkidle' });
const radios = page.locator('.days-picker-home [role="radio"]');
ok((await radios.count()) === 4, 'Beranda punya 4 pilihan hari');
ok((await radios.evaluateAll((a) => a.map((x) => x.textContent))).join() === '3 hari,7 hari,14 hari,30 hari', 'label pilihan: 3/7/14/30 hari');
ok((await page.locator('.days-picker-home [aria-checked="true"]').textContent()).includes('3'), 'awalnya 3 hari terpilih');
const small = await radios.evaluateAll((a) => a.filter((x) => x.getBoundingClientRect().height < 44).length);
ok(small === 0, 'target sentuh >= 44 px');
await radios.nth(1).click();
await page.waitForTimeout(400);
ok((await page.locator('.days-picker-home [aria-checked="true"]').textContent()).includes('7'), 'klik 7 hari -> 7 terpilih');
ok(await page.evaluate(() => JSON.parse(localStorage.getItem('survivalcheck.v1')).target.days) === 7, 'state.target.days = 7 tersimpan');
ok((await page.locator('.pill-row').first().textContent()).includes('7'), 'ringkasan target di Beranda ikut jadi 7 hari');
await page.reload({ waitUntil: 'networkidle' });
ok((await page.locator('.days-picker-home [aria-checked="true"]').textContent()).includes('7'), '7 hari bertahan setelah muat ulang');
ok((await page.locator('.days-picker-home a[href="#/target"]').count()) === 1, 'ada tautan untuk hari lain (#/target)');

// ---- 1. Stok: grup per kategori ----
await page.goto(base + '#/inventaris', { waitUntil: 'networkidle' });
const body = await page.locator('main').innerText();
ok(!/Lengkapi|Pelengkap|Bekal dasar/.test(body), 'tidak ada teks Lengkapi / Pelengkap / Bekal dasar');
ok((await page.locator('.f-stage, details.f-stage').count()) === 0, 'tidak ada grup tahap');
const cards = await page.locator('.f-catcard').evaluateAll((a) => a.map((x) => x.querySelector('strong').textContent));
console.log('     kategori:', cards.join(' | '));
ok(cards.length >= 8, `kategori tampil sebagai kartu (${cards.length})`);
ok(['Air', 'Makanan'].every((k) => cards.some((c) => c.includes(k))) && cards.some((c) => /Daya|Listrik/i.test(c)), 'ada kategori Air, Makanan, dan Daya/Listrik');
const hrefs = await page.locator('.f-catcard').evaluateAll((a) => a.map((x) => x.getAttribute('href')));
ok(hrefs.every((h) => /^#\/inventaris\/[a-z_]+$/.test(h)), 'tautan kategori tanpa segmen tahap');
await page.locator('.f-catcard').first().click();
await page.waitForTimeout(300);
ok((await page.locator('.f-itemlist > li').count()) > 0, 'membuka kategori menampilkan item');
ok(!(await page.locator('main').innerText()).includes('Tampilkan'), 'tidak ada tombol "Tampilkan ... lagi"');
const hs = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
ok(hs <= 0, 'tanpa scroll horizontal di 360 px');
ok(errs.length === 0, 'tanpa error halaman ' + errs.join(';'));
await browser.close(); server.close();
process.exit(fail ? 1 : 0);
