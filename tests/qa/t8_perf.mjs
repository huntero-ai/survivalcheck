// QA bagian 8: ukuran aset, jumlah request, waktu muat (kunjungan pertama vs ulang/offline).
import { chromium, serve, reporter, baseState, KEY, REPO } from './lib.mjs';
import fs from 'node:fs'; import zlib from 'node:zlib';
const srv = await serve(); const browser = await chromium.launch();
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(d + '/' + e.name) : [d + '/' + e.name]);
let raw = 0, gz = 0; const rows = [];
for (const dir of ['index.html', 'manifest.webmanifest', 'sw.js', 'src', 'styles', 'data', 'i18n', 'icons', 'docs/sources.md']) {
  const files = fs.statSync(REPO + '/' + dir).isDirectory() ? walk(REPO + '/' + dir) : [REPO + '/' + dir];
  for (const f of files) { if (/\.(md|mjs)$/.test(f) && !f.endsWith('sources.md')) continue; const b = fs.readFileSync(f); const z = zlib.gzipSync(b).length; raw += b.length; gz += z; rows.push([f.replace(REPO + '/', ''), b.length, z]); }
}
console.log('TOTAL aset dipublikasi: raw', (raw / 1024).toFixed(0), 'KB, gzip', (gz / 1024).toFixed(0), 'KB, file', rows.length);
console.log('Terbesar:', rows.sort((a, b) => b[1] - a[1]).slice(0, 6).map((r) => `${r[0]} ${(r[1] / 1024).toFixed(0)}KB/${(r[2] / 1024).toFixed(0)}KB gz`).join(' | '));
const ctx = await browser.newContext({ viewport: { width: 360, height: 740 } });
await ctx.addInitScript(([k, s]) => { if (!window.name.includes('s')) { localStorage.setItem(k, s); window.name = 's'; } }, [KEY, JSON.stringify(baseState({ scenarios: ['earthquake'] }))]);
const p = await ctx.newPage(); let reqs = 0, bytes = 0; const urls = [];
p.on('response', async (r) => { reqs++; urls.push(r.url().replace(srv.base, '')); try { bytes += (await r.body()).length; } catch {} });
const t0 = Date.now(); await p.goto(srv.base + '#/hasil'); await p.waitForSelector('main h1'); await p.waitForFunction(() => document.querySelector('main').innerText.length > 100);
const t1 = Date.now() - t0;
const nav = await p.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; const paint = performance.getEntriesByType('paint').map((x) => x.name + ':' + Math.round(x.startTime)); return { dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), paint }; });
console.log('Kunjungan pertama #/hasil: request', reqs, 'bytes', (bytes / 1024).toFixed(0) + 'KB', 'siap', t1 + 'ms', JSON.stringify(nav));
await p.waitForTimeout(2500);
console.log('Request setelah SW precache (total):', reqs);
// kunjungan ulang (SW cache)
const p2 = await ctx.newPage(); let r2 = 0; p2.on('request', () => r2++);
const t2 = Date.now(); await p2.goto(srv.base + '#/hasil'); await p2.waitForSelector('main h1'); await p2.waitForFunction(() => document.querySelector('main').innerText.length > 100); console.log('Kunjungan ulang (SW): request', r2, 'siap', Date.now() - t2 + 'ms');
// CPU throttling 4x
const cdp = await ctx.newCDPSession(p2); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
const t3 = Date.now(); await p2.reload(); await p2.waitForSelector('main h1'); await p2.waitForFunction(() => document.querySelector('main').innerText.length > 100); console.log('Ulang + CPU 4x lambat: siap', Date.now() - t3 + 'ms');
// engine evaluate waktu pada profil 20 orang
const ms = await p2.evaluate(async () => { const e = await import('./src/engine.js'); const d = {}; for (const [k, f] of [['items', 'items'], ['rules', 'rules'], ['power', 'power'], ['indicators', 'bnpb_family_indicators']]) d[k] = await (await fetch('data/' + f + '.json')).json(); const st = { profile: { counts: { adult: 20 }, target_days: 90, scenarios: ['earthquake', 'pandemic', 'conflict'] }, inventory: {}, scenarios: ['earthquake', 'pandemic', 'conflict'] }; const a = performance.now(); for (let i = 0; i < 50; i++) e.evaluate(st, d); return (performance.now() - a) / 50; });
console.log('evaluate() rata-rata', ms.toFixed(2), 'ms');
await browser.close(); srv.close();
