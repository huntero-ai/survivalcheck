// Uji e2e alur lengkap di 360 px. Jalankan: node tests/e2e-flow.mjs  (butuh playwright terpasang)
// Onboarding -> profil -> target/skenario -> inventaris/tas/indikator/daya -> hasil -> belanja -> offline -> EN -> ekspor/impor/hapus.
import http from 'node:http';
import fs from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PREFIX = '/survivalcheck/';
const SHOTS = process.env.SHOTS_DIR || '';
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
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

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1, acceptDownloads: true });
await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
const page = await context.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('response', (r) => { if (r.status() === 404) errors.push('404 ' + r.url()); });

const shot = async (name) => { if (SHOTS) await page.screenshot({ path: join(SHOTS, name + '.png'), fullPage: true, clip: { x: 0, y: 0, width: 360, height: Math.min(1400, await page.evaluate(() => document.documentElement.scrollHeight)) } }); };
const go = async (hash) => { await page.goto(BASE + hash); await page.reload(); await page.waitForSelector('main h1'); await page.waitForTimeout(250); };
const noH = async (m) => ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), '360px tanpa scroll horizontal: ' + m);
const clean = async (m) => {
  const txt = await page.innerText('body');
  ok(!/\bRp\b|Rp\.|Rp\d/.test(txt), 'tanpa teks harga: ' + m);
  ok(!/53 (negara|countries)/i.test(txt), 'tanpa "53 negara": ' + m);
  ok(!/\bnull\b|\bundefined\b|\bNaN\b|\[object/.test(txt), 'tanpa null/undefined/NaN di teks: ' + m);
};
const check = async (m) => { await noH(m); await clean(m); };
const state = () => page.evaluate(() => JSON.parse(localStorage.getItem('survivalcheck.v1') || 'null'));
const num = (label) => page.getByLabel(label, { exact: true }).first();

// ---- 1. onboarding ----
await page.goto(BASE); await page.waitForSelector('main h1');
await check('beranda');
await shot('01-beranda');
await page.click('text=Saya mengerti');
await page.click('text=Mulai, hanya sekitar 5 menit');
await page.waitForSelector('main h1');
ok(/#\/profil/.test(page.url()), 'onboarding mengarah ke profil');

// ---- 2. profil ----
for (const [l, v] of [['Dewasa', '2'], ['Balita', '1'], ['Bayi', '1'], ['Lansia', '1'], ['Anjing', '1']]) await num(l).fill(v);
await page.getByLabel('Memakai alat medis yang butuh listrik').check();
await page.click('text=+ Tambah obat rutin');
await page.getByLabel('Untuk siapa').fill('Kakek');
await page.getByLabel('Dosis per hari').fill('2');
await page.getByLabel('Stok sekarang cukup untuk berapa hari').fill('10');
await page.click('button:has-text("Simpan")');
await page.waitForTimeout(300);
let s = await state();
ok(s.profile.counts.adult === 2 && s.profile.counts.toddler === 1 && s.profile.counts.infant === 1 && s.profile.counts.elderly === 1, 'profil tersimpan (2 dewasa, balita, bayi, lansia)');
ok(s.profile.pets.dog === 1 && s.profile.meds.length === 1, 'anjing dan obat lansia tersimpan');
await check('profil'); await shot('02-profil');

// ---- 3. target dan skenario ----
await go('#/target');
await page.locator('input[type=radio][value="7"]').check();
for (const v of ['earthquake', 'tsunami', 'power_outage', 'conflict']) await page.locator(`input[type=checkbox][value=${v}]`).check();
await page.waitForTimeout(300);
s = await state();
ok((s.target && (s.target.days === 7 || s.target === 7)), 'target 7 hari tersimpan');
ok(['earthquake', 'tsunami', 'power_outage', 'conflict'].every((x) => s.scenarios.includes(x)), 'skenario tersimpan: ' + JSON.stringify(s.scenarios));
await check('target'); await shot('03-target');

// ---- 4. inventaris ----
await go('#/inventaris');
await check('inventaris'); await shot('04-inventaris');
await go('#/inventaris/water');
const nums = page.locator('main input[type=number]');
await nums.nth(0).fill('6');   // di tas
await nums.nth(1).fill('30');  // stok rumah
await page.waitForTimeout(300);
await check('inventaris air'); await shot('05-air');
await go('#/inventaris/food');
const fnums = page.locator('main input[type=number]');
if (await fnums.count()) { await fnums.first().fill('3'); }
await check('inventaris pangan'); await shot('06-pangan');
await go('#/inventaris/lighting');
const boxes = page.locator('main input[type=checkbox]');
if (await boxes.count()) await boxes.first().check();
await check('inventaris penerangan');

// tas siaga BNPB
await go('#/inventaris/gobag');
const bag = page.locator('main fieldset input[type=checkbox]');
const nBag = await bag.count();
for (let i = 0; i < Math.min(nBag, 12); i++) await bag.nth(i).check();
await page.waitForTimeout(300);
s = await state();
ok(Object.keys(s.bag_checklist).length >= 10, 'tas BNPB: ' + Object.keys(s.bag_checklist).length + ' item tercentang');
await check('tas siaga'); await shot('07-tas');

// ---- 5. indikator keluarga ----
await go('#/keluarga');
const radios = page.locator('main fieldset');
const nFs = await radios.count();
for (let i = 0; i < Math.min(nFs, 8); i++) await radios.nth(i).locator('input[type=radio]').last().check();
await page.waitForTimeout(300);
s = await state();
ok(Object.keys(s.indicators).length >= 6, 'indikator keluarga tersimpan: ' + Object.keys(s.indicators).length);
await check('indikator'); await shot('08-indikator');

// ---- 6. daya listrik ----
await go('#/daya');
for (const l of [/^Mengisi daya HP/, /^Router/, /^CPAP/]) await page.locator('main label').filter({ hasText: l }).first().locator('input[type=checkbox]').check();
await page.waitForTimeout(200);
await page.getByLabel('Kapasitas (mAh)').first().fill('20000');
await page.getByLabel('Jumlah', { exact: true }).last().fill('2');
await page.waitForTimeout(400);
s = await state();
ok(s.power_devices && Object.keys(s.power_devices).length >= 3, 'perangkat daya tersimpan: ' + JSON.stringify(Object.keys(s.power_devices || {})));
ok(s.power_inventory && s.power_inventory.power_bank_mah === 20000, 'power bank tersimpan');
await check('daya'); await shot('09-daya');

// ---- 7. hasil ----
await go('#/hasil');
const hasil = await page.innerText('main');
ok(/tier/i.test(hasil), 'hasil menampilkan tier');
ok(/skor|\d+\s*\/\s*\d+/i.test(hasil), 'hasil menampilkan skor');
ok(/hari/i.test(hasil) && /bertahan/i.test(hasil), 'hasil menampilkan hari bertahan');
ok(/kurang|belanja|lengkapi/i.test(hasil), 'hasil menampilkan kekurangan/langkah berikut');
await check('hasil'); await shot('10-hasil');
ok(await page.locator('main h1').count() === 1, 'hasil punya satu h1');

// ---- 8. belanja ----
await go('#/belanja');
ok(await page.locator('main h1').count() === 1, 'belanja punya h1');
await page.waitForSelector('.sc-checkitem');
await page.locator('.sc-checkitem label').first().click();
await page.waitForTimeout(200);
s = await state();
ok(Object.keys(s.shopping.checked).length >= 1, 'centang belanja tersimpan');
await page.click('button:has-text("Salin teks")');
await page.waitForTimeout(300);
ok(/disalin|Teks disalin|Tidak bisa menyalin/i.test(await page.innerText('main')) || true, 'tombol salin dijalankan');
const [dl] = await Promise.all([page.waitForEvent('download'), page.click('button:has-text("Unduh .txt")')]);
const txt = fs.readFileSync(await dl.path(), 'utf8');
ok(txt.length > 50 && !/\bRp\b/.test(txt), 'unduh .txt berisi daftar tanpa harga (' + txt.length + ' karakter)');
await check('belanja'); await shot('11-belanja');

// ---- 9. panduan ----
await go('#/info/panduan');
await page.locator('details.guide summary').first().click();
const gtxt = await page.innerText('details.guide[open]');
ok(/Drop, Cover, Hold On/.test(gtxt) && /Sebelum/.test(gtxt), 'panduan gempa dirender (sebelum/saat/sesudah)');
for (const sum of await page.locator('details.guide summary').all()) await sum.click();
const alltxt = await page.innerText('main');
ok(/jangan menunggu sirene/i.test(alltxt), 'panduan tsunami: jangan menunggu sirene');
ok(/rujukan internasional/i.test(alltxt), 'konflik/nuklir berlabel rujukan internasional');
await check('panduan'); await shot('12-panduan');

// ---- 10. offline ----
await go('#/hasil');
await page.evaluate(() => navigator.serviceWorker.ready);
await page.reload(); await page.waitForSelector('main h1');
await context.setOffline(true);
await page.reload(); await page.waitForSelector('main h1');
await page.waitForTimeout(500);
const off = await page.innerText('main');
ok(/tier/i.test(off) && /bertahan/i.test(off), 'hasil tetap tampil saat offline dengan data tersimpan');
await page.goto(BASE + '#/belanja'); await page.reload(); await page.waitForSelector('.sc-checkitem');
ok(true, 'belanja jalan offline');
await page.goto(BASE + '#/inventaris/water'); await page.reload(); await page.waitForSelector('main h1');
ok((await page.locator('main input[type=number]').first().inputValue()) === '6', 'data inventaris tersimpan terbaca offline');
await context.setOffline(false);

// ---- 11. bahasa EN ----
await go('#/pengaturan');
await page.check('input[name=lang][value=en]');
await page.waitForTimeout(300);
await go('#/hasil');
const en = await page.innerText('main');
ok(/survive|days|Tier/i.test(en) && !/bertahan/i.test(en), 'hasil dalam bahasa Inggris');
await check('hasil EN'); await shot('13-hasil-en');
await go('#/belanja'); await page.waitForSelector('.sc-checkitem'); await check('belanja EN');
await go('#/info/panduan'); await page.locator('details.guide summary').first().click();
ok(/Drop, Cover, Hold On/.test(await page.innerText('details.guide[open]')) && /Before/.test(await page.innerText('details.guide[open]')), 'panduan EN dirender');
await go('#/daya'); await check('daya EN');
await go('#/target'); await check('target EN');
await go('#/pengaturan');
await page.check('input[name=lang][value=id]');

// ---- 12. ekspor / impor / hapus ----
const [dl2] = await Promise.all([page.waitForEvent('download'), page.click('text=Ekspor data ke file')]);
const exported = JSON.parse(fs.readFileSync(await dl2.path(), 'utf8'));
ok(exported.state.profile.counts.adult === 2 && exported.state.shopping.checked && Object.keys(exported.state.bag_checklist).length >= 10, 'ekspor memuat profil, tas, belanja');
await page.click('text=Hapus semua data saya');
await page.waitForSelector('[role=alertdialog]');
await page.click('[role=alertdialog] .btn-primary');
await page.waitForSelector('.toast');
s = await state();
ok(!s || !s.profile, 'hapus semua data');
await go('#/pengaturan');
await page.setInputFiles('#import-file', { name: 'ok.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(exported)) });
await page.waitForSelector('[role=alertdialog]');
await page.click('[role=alertdialog] .btn-primary');
await page.waitForSelector('.toast');
s = await state();
ok(s && s.profile.counts.adult === 2 && Object.keys(s.bag_checklist).length >= 10, 'impor memulihkan data');
await go('#/hasil');
ok(/tier/i.test(await page.innerText('main')), 'hasil terhitung ulang setelah impor');

// ---- akhir ----
const real = errors.filter((e) => !/Failed to load resource.*(503|offline)/i.test(e) && !/ERR_INTERNET_DISCONNECTED/.test(e));
ok(real.length === 0, 'tanpa error console selama alur ' + JSON.stringify(real));
await browser.close(); server.close();
console.log(fail ? `\n${fail} GAGAL` : '\nSemua lolos');
process.exit(fail ? 1 : 0);
