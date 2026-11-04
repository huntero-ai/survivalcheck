// QA bagian 1 + 7: offline penuh. Argumen: mode 'repo' (akar repo, prefix /) atau 'site' (_site, prefix /survivalcheck/).
import { chromium, serve, reporter, REPO, baseState, KEY, ROUTES } from './lib.mjs';
import fs from 'node:fs';
const mode = process.argv[2] || 'repo';
const { ok, fails } = reporter();
const root = mode === 'site' ? process.argv[3] : REPO;
const prefix = mode === 'site' ? '/survivalcheck/' : '/';
const srv = await serve(root, prefix);
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1 });
const page = await context.newPage();
const external = new Set(); const errs = []; const fourOh4 = [];
context.on('request', (r) => { const u = new URL(r.url()); if (!/^(localhost|127\.0\.0\.1)$/.test(u.hostname) && u.protocol.startsWith('http')) external.add(r.url()); });
page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
page.on('response', (r) => { if (r.status() >= 400) fourOh4.push(r.status() + ' ' + r.url()); });
const st = baseState({ profile: { ...baseState().profile, counts: { infant: 1, toddler: 0, child: 1, adult: 2, elderly: 1 }, pets: { dog: 1, cat: 1 }, meds: [{ label: 'Obat X', doses_per_day: 2, stock_days: 10 }] }, scenarios: ['earthquake', 'power_outage'], inventory: { water_drinking: 40, flashlight: 1 } });
await page.goto(srv.base); await page.evaluate(([k, s]) => localStorage.setItem(k, s), [KEY, JSON.stringify(st)]);
await page.reload();
await page.waitForSelector('main h1');
// tunggu SW aktif & mengontrol
await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, { timeout: 15000 }).catch(async () => { await page.reload(); });
const sw = await page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); return { reg: !!r, scope: r && r.scope, active: !!(r && r.active), controller: !!navigator.serviceWorker.controller }; });
ok(sw.reg && sw.active, 'SW terdaftar & aktif', sw);
ok(sw.scope.endsWith(prefix), 'SW scope = ' + prefix, sw.scope);
const cacheInfo = await page.evaluate(async () => { const ks = await caches.keys(); const c = await caches.open(ks[0]); const reqs = await c.keys(); return { ks, n: reqs.length, urls: reqs.map((r) => new URL(r.url).pathname) }; });
console.log('cache', cacheInfo.ks, cacheInfo.n);
// pastikan semua file src/ styles/ data/ i18n/ icons di disk (yg dipublikasi) ada di cache
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(d + '/' + e.name).map((x) => e.name + '/' + x) : [e.name]);
for (const dir of ['src', 'styles', 'data', 'i18n']) {
  for (const f of walk(root + '/' + dir)) { if (/\.md$/.test(f)) continue; ok(cacheInfo.urls.includes(prefix + dir + '/' + f), 'precache ' + dir + '/' + f); }
}
// jelajahi semua rute online dulu (memuat lazy modul), lalu offline
await context.setOffline(true);
for (const r of ROUTES) {
  await page.goto(srv.base + r); await page.reload();
  const res = await page.waitForSelector('main h1, main h2', { timeout: 8000 }).then(() => true).catch(() => false);
  const info = await page.evaluate(() => ({ h1: document.querySelectorAll('main h1').length, txt: document.querySelector('main').innerText.length, soon: /Segera hadir|Coming soon/i.test(document.querySelector('main').innerText), raw: /\b(undefined|NaN|\[object)/.test(document.body.innerText) }));
  ok(res && info.txt > 40 && !info.soon && !info.raw, 'offline render ' + r, info);
}
// data tersimpan setelah reload offline
const kept = await page.evaluate((k) => JSON.parse(localStorage.getItem(k)).inventory.water_drinking, KEY);
ok(kept === 40, 'data tersimpan offline (water_drinking=40)', kept);
// ubah data offline lalu reload
await page.goto(srv.base + '#/hasil'); await page.reload(); await page.waitForSelector('main h1');
await page.waitForTimeout(500);
await page.screenshot({ path: '/tmp/qa-shots/offline-hasil-' + mode + '.png' });
await context.setOffline(false);
// manifest + ikon
const man = await (await context.request.get(srv.base + 'manifest.webmanifest')).json();
for (const k of ['name', 'short_name', 'start_url', 'scope', 'display', 'icons']) ok(man[k], 'manifest.' + k);
for (const ic of man.icons) { const r = await context.request.get(srv.base + ic.src); ok(r.status() === 200 && (await r.body()).length > 100, 'ikon ' + ic.src + ' ' + ic.sizes); }
ok(man.icons.some((i) => i.sizes === '192x192') && man.icons.some((i) => i.sizes === '512x512') && man.icons.some((i) => i.purpose === 'maskable'), 'ikon 192/512/maskable ada');
ok(man.start_url === './' && man.scope === './', 'start_url/scope relatif');
console.log('Request eksternal:', [...external]);
ok(external.size === 0, '0 request ke host luar', [...external]);
ok(fourOh4.length === 0, 'tidak ada 4xx/5xx', fourOh4);
ok(errs.length === 0, 'tanpa error console', errs.slice(0, 5));
if (mode === 'site') {
  for (const f of ['.nojekyll', 'docs/sources.md', 'index.html', 'sw.js']) ok(fs.existsSync(root + '/' + f), '_site punya ' + f);
  for (const f of ['research', 'tests', 'PLAN.md', 'docs/contract.md', 'icons/make-icons.mjs', 'data/sources-to-buy.md']) ok(!fs.existsSync(root + '/' + f), '_site tanpa ' + f);
}
console.log('FAILS', fails());
await browser.close(); srv.close();
