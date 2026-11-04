// QA bagian 2: bahasa English di 320 px: overflow, lang, h1.
import { chromium, serve, reporter, baseState, ROUTES, seed } from './lib.mjs';
const { ok, fails } = reporter();
const srv = await serve(); const browser = await chromium.launch();
const st = baseState({ settings: { ...baseState().settings, lang: 'en' }, scenarios: ['earthquake', 'conflict'], profile: { ...baseState().profile, counts: { infant: 1, toddler: 1, child: 1, adult: 2, elderly: 1 }, pets: { dog: 1, cat: 1 } } });
for (const [w, h] of [[320, 568], [360, 640]]) {
  const c = await browser.newContext({ viewport: { width: w, height: h } }); await seed(c, st); const p = await c.newPage();
  const bad = [];
  for (const r of ROUTES) { await p.goto(srv.base + r); await p.reload(); await p.waitForSelector('main h1, main h2').catch(() => {}); await p.waitForTimeout(100);
    const i = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth > innerWidth, lang: document.documentElement.lang, h1: document.querySelectorAll('h1').length, id: /Beranda|Mulai|Kebutuhan|Dimiliki|Tersimpan/.test(document.body.innerText) }));
    if (i.sw || i.lang !== 'en' || i.h1 !== 1 || i.id) bad.push(r + ' ' + JSON.stringify(i)); }
  ok(bad.length === 0, `EN ${w}x${h}: tanpa overflow, lang=en, 1 h1, tanpa sisa teks Indonesia`, bad.slice(0, 8)); await c.close();
}
console.log('FAILS', fails()); await browser.close(); srv.close();
