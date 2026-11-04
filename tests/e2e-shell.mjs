// Uji e2e shell PWA. Jalankan: node tests/e2e-shell.mjs  (butuh playwright terpasang)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PREFIX = '/survivalcheck/'; // uji juga jalan di sub-path
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.md': 'text/markdown' };

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  if (!u.pathname.startsWith(PREFIX)) { res.writeHead(404); return res.end(); }
  let rel = normalize(decodeURIComponent(u.pathname.slice(PREFIX.length))) || 'index.html';
  if (rel.endsWith('/') || rel === '.') rel = join(rel, 'index.html');
  if (rel.startsWith('..')) { res.writeHead(403); return res.end(); }
  try { const body = await readFile(join(ROOT, rel)); res.writeHead(200, { 'content-type': MIME[extname(rel)] || 'application/octet-stream' }); res.end(body); }
  catch { res.writeHead(404); res.end('nf'); }
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}${PREFIX}`;

let fail = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail++; };
const OPTIONAL = /(forms|results|shopping|engine|power)\.js|(forms|results|print)\.css/;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 360, height: 740 } });
const page = await context.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error' && !(/404/.test(m.text()) && true)) errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
const missing = [];
page.on('response', (r) => { if (r.status() === 404) missing.push(r.url()); });

await page.goto(BASE);
await page.waitForSelector('h1');
ok((await page.textContent('h1')).length > 0, 'beranda termuat (h1)');
ok(errors.length === 0, 'tanpa error console di beranda ' + JSON.stringify(errors));
ok(missing.length === 0, 'tanpa 404 di beranda ' + JSON.stringify(missing));

// manifest & ikon
const mf = await (await context.request.get(BASE + 'manifest.webmanifest')).json();
ok(mf.start_url === './' && mf.scope === './' && mf.icons.length >= 3, 'manifest valid');
for (const i of mf.icons) ok((await context.request.get(new URL(i.src, BASE).href)).ok(), 'ikon ada: ' + i.src);

// SW
await page.evaluate(() => navigator.serviceWorker.ready);
await page.reload(); await page.waitForSelector('h1');
ok(await page.evaluate(() => !!navigator.serviceWorker.controller), 'SW terdaftar dan mengendalikan halaman');
const cached = await page.evaluate(async () => (await (await caches.open('survivalcheck-v3')).keys()).map((r) => new URL(r.url).pathname));
ok(['index.html', 'src/app.js', 'data/items.json', 'i18n/id.json', 'i18n/en.json', 'docs/sources.md'].every((p) => cached.some((c) => c.endsWith('/' + p))), 'aset penting di-precache (' + cached.length + ' entri)');

// 360 px tanpa scroll horizontal
const noHScroll = async () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
const rawKey = /\b(app|common|nav|home|info|settings|disclaimer|errors|a11y|scenarios)\.(?!gouv)[a-z_0-9]+(\.[a-z_0-9]+)*\b(?![/-])/;
const routes = ['#/', '#/info', '#/info/darurat', '#/info/panduan', '#/info/air', '#/info/kartu', '#/info/sumber', '#/info/disclaimer', '#/info/tentang', '#/pengaturan', '#/profil', '#/target', '#/inventaris/air', '#/daya', '#/keluarga', '#/hasil', '#/belanja', '#/xyz'];
for (const r of routes) {
  await page.goto(BASE + r);
  try { await page.waitForSelector('h1, main h2', { timeout: 5000 }); } catch { ok(false, `h1 muncul di ${r}: ` + (await page.innerHTML('#app')).slice(-500)); continue; }
  await page.waitForTimeout(150);
  ok(await noHScroll(), `360px tanpa scroll horizontal ${r}`);
  const txt = await page.innerText('body');
  ok(!rawKey.test(txt), `tanpa kunci i18n mentah ${r}`);
}
const nonOptionalMissing = missing.filter((u) => !OPTIONAL.test(u));
ok(nonOptionalMissing.length === 0, 'tidak ada 404 selain modul E2/E3 ' + JSON.stringify(nonOptionalMissing));

// sumber dirender
await page.goto(BASE + '#/info/sumber'); await page.waitForSelector('.src-list li');
ok((await page.locator('.src-list li').count()) > 20, 'halaman sumber memuat daftar');
// nomor darurat
await page.goto(BASE + '#/info/darurat'); await page.waitForSelector('a[href^="tel:"]');
ok((await page.locator('a[href^="tel:"]').count()) >= 8, 'nomor darurat bisa ditekan');

// bahasa
await page.goto(BASE + '#/pengaturan'); await page.waitForSelector('input[name=lang]');
await page.check('input[name=lang][value=en]');
await page.waitForTimeout(200);
ok((await page.textContent('h1')) === 'Settings' || /Settings/i.test(await page.textContent('h1')), 'ganti bahasa ke English seketika');
ok(await page.evaluate(() => document.documentElement.lang === 'en'), 'html lang=en');
await page.check('input[name=lang][value=id]');

// simpan state + ekspor/impor + hapus
await page.evaluate(() => { const k = 'survivalcheck.v1'; const s = JSON.parse(localStorage.getItem(k) || '{}'); s.profile = { counts: { adult: 2 } }; localStorage.setItem(k, JSON.stringify(s)); });
await page.reload(); await page.waitForSelector('h1');
const [dl] = await Promise.all([page.waitForEvent('download'), page.click('text=Ekspor data ke file')]);
const path = await dl.path();
const exported = JSON.parse(await (await import('node:fs/promises')).readFile(path, 'utf8'));
ok(exported.app === 'survivalcheck' && exported.state.profile.counts.adult === 2, 'ekspor JSON berisi profil');
await page.setInputFiles('#import-file', { name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"x":1}') });
await page.waitForSelector('.notice.danger');
ok(true, 'impor file salah ditolak');
await page.setInputFiles('#import-file', { name: 'ok.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(exported)) });
await page.waitForSelector('[role=alertdialog]');
await page.click('[role=alertdialog] .btn-primary');
await page.waitForSelector('.toast');
ok(true, 'impor valid setelah konfirmasi');
await page.click('text=Hapus semua data saya');
await page.waitForSelector('[role=alertdialog]');
ok(await page.evaluate(() => document.activeElement.textContent === 'Batal'), 'fokus awal dialog hapus pada Batal');
await page.click('[role=alertdialog] .btn-primary');
await page.waitForSelector('.toast');
ok(await page.evaluate(() => { const s = localStorage.getItem('survivalcheck.v1'); return !s || !JSON.parse(s).profile; }), 'hapus semua data menghapus profil');

// offline
await page.goto(BASE); await page.waitForSelector('h1');
await context.setOffline(true);
await page.reload(); await page.waitForSelector('h1');
ok((await page.textContent('h1')).length > 0, 'beranda termuat saat offline');
await page.goto(BASE + '#/info/darurat'); await page.waitForSelector('a[href^="tel:"]');
ok(true, 'info darurat tersedia offline');
await page.goto(BASE + '#/info/sumber'); await page.waitForSelector('.src-list li');
ok(true, 'halaman sumber tersedia offline');
await context.setOffline(false);

// Layar 360 px: header & nav muat
const real = errors.filter((e) => !/Failed to load resource/.test(e));
ok(real.length === 0, 'tanpa error console selama uji ' + JSON.stringify(real));

await browser.close(); server.close();
console.log(fail ? `\n${fail} GAGAL` : '\nSemua lolos');
process.exit(fail ? 1 : 0);
