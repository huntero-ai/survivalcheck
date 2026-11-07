// Uji e2e regresi perbaikan QA (B-01..B-17). Jalankan: node tests/e2e-fixes.mjs (butuh playwright terpasang)
import { chromium, serve, baseState, seed, reporter, CATS, ROUTES } from './qa/lib.mjs';

const { ok, fails } = reporter();
const srv = await serve();
const browser = await chromium.launch();
const errors = [];

async function open(w, state, hash) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 740 } });
  await seed(ctx, state);
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${hash}: ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`${hash}: pageerror ${e.message}`));
  page.on('request', (r) => { if (/cases\.json/.test(r.url())) errors.push('meminta tests/cases.json'); });
  await page.goto(srv.base + hash);
  await page.waitForSelector('main h1');
  await page.waitForTimeout(300);
  return { ctx, page };
}
const noOverflow = (page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
const state = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('survivalcheck.v1')));

const rich = baseState({
  profile: { counts: { infant: 1, toddler: 1, child: 0, adult: 2, elderly: 0 }, pregnant: 0, breastfeeding: 0, infant_feeding: 'formula', pets: { dog: 1, cat: 1 }, meds: [], has_electric_medical: false, usage_per_day: {}, scenarios: ['power_outage', 'extreme_weather'], target_days: 7 },
  scenarios: ['power_outage', 'extreme_weather'],
});

// ---- B-01: penanda kutipan terlihat di hasil, belanja, inventaris ----
for (const [hash, label] of [['#/rincian', 'hasil'], ['#/belanja', 'belanja'], ['#/inventaris/water', 'inventaris air'], ['#/inventaris/sanitation', 'inventaris sanitasi'], ['#/inventaris/tools', 'inventaris alat']]) {
  const { ctx, page } = await open(360, rich, hash);
  if (label === 'hasil') { const more = page.getByRole('button', { name: /Lihat selengkapnya/ }); if (await more.count()) await more.first().click(); }
  const info = await page.evaluate(() => [...document.querySelectorAll('[data-evidence="excerpt"]')].map((e) => ({ txt: e.textContent, hidden: !!e.closest('details:not([open])') || e.offsetParent === null })));
  ok(info.length > 0 && info.every((i) => /Dari kutipan sumber, perlu dicek ulang/.test(i.txt) && !i.hidden), `B-01 penanda kutipan terlihat: ${label} (${info.length})`);
  await ctx.close();
}
{
  const { ctx, page } = await open(360, rich, '#/inventaris/plan_knowledge');
  const body = await page.innerText('main');
  ok(/Tahu batas aman makanan di kulkas/.test(body) && !/Kebutuhan: 1 -/.test(body) && !/\b1 -(\s|$)/.test(body), 'B-06 inventaris pengetahuan tanpa satuan "-"');
  ok((await page.locator('[data-evidence="excerpt"]').count()) >= 1, 'B-01 pengetahuan kulkas bertanda kutipan');
  await ctx.close();
}
{
  const { ctx, page } = await open(360, rich, '#/belanja');
  const body = await page.innerText('main');
  ok(!/Tahu batas aman makanan di kulkas/.test(body) && !/ - 1 -/.test(body) && !/\s1 -\s/.test(body), 'B-06 belanja tanpa item pengetahuan / satuan "-"');
  await ctx.close();
}

// ---- B-03: 320 px tanpa scroll horizontal ----
for (const hash of ['#/belanja', '#/rincian', '#/', '#/inventaris/special_needs', '#/inventaris/food', '#/inventaris/water']) {
  for (const lang of ['id', 'en']) {
    const st = JSON.parse(JSON.stringify(rich)); st.settings.lang = lang;
    const { ctx, page } = await open(320, st, hash);
    ok(await noOverflow(page), `B-03 320px tanpa scroll horizontal: ${hash} ${lang}`);
    await ctx.close();
  }
}
{
  const { ctx, page } = await open(320, rich, '#/belanja');
  const r = await page.evaluate(() => [...document.querySelectorAll('.sc-itemqty')].map((e) => e.getBoundingClientRect().right <= window.innerWidth + 0.5));
  ok(r.length > 0 && r.every(Boolean), 'B-03 sc-itemqty di dalam layar 320');
  await ctx.close();
}

// ---- B-04 / B-07: target sentuh, fokus h1, judul ----
for (const w of [320, 360]) {
  const { ctx, page } = await open(w, rich, '#/');
  const h = await page.evaluate(() => ({ brand: document.querySelector('a.brand').getBoundingClientRect().height, more: [...document.querySelectorAll('.foot-note a')].map((a) => a.getBoundingClientRect().height), title: document.title, brandText: document.querySelector('a.brand').scrollWidth <= document.querySelector('a.brand').clientWidth }));
  ok(h.brand >= 44, `B-04 tautan merek >= 44px @${w}: ${h.brand}`);
  ok(h.more.length > 0 && h.more.every((x) => x >= 44), `B-04 "Lihat selengkapnya" >= 44px @${w}: ${h.more}`);
  ok(/^(Kesiapan rumahmu · )?SurvivalCheck$/.test(h.title), `B-07 judul beranda tanpa duplikasi: ${h.title}`);
  if (w === 320) ok(h.brandText, 'B-04 nama aplikasi tidak terpotong @320');
  await ctx.close();
}
for (const hash of ['#/rincian', '#/belanja', '#/profil']) {
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, colorScheme: scheme });
    await seed(ctx, rich);
    const page = await ctx.newPage();
    await page.goto(srv.base + hash); await page.waitForSelector('main h1'); await page.waitForTimeout(300);
    const o = await page.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return { tag: e.tagName, style: cs.outlineStyle, width: cs.outlineWidth }; });
    ok(o.tag === 'H1' && (o.style === 'none' || parseFloat(o.width) === 0), `B-07 h1 fokus tanpa kotak: ${hash} ${scheme} ${JSON.stringify(o)}`);
    await ctx.close();
  }
}

// ---- B-10: hari bertahan sangat besar ----
{
  const st = baseState({ inventory: { water_drinking: 1e9, food_rice: { qty: 1e7 } } });
  const { ctx, page } = await open(360, st, '#/rincian');
  const body = await page.innerText('main');
  ok(/> 365 hari/.test(body) && !/166666666/.test(body) && !/\d{4,} hari/.test(body), 'B-10 tampil "> 365 hari"');
  await ctx.close();
}

// ---- B-11: nilai tak sah tidak tersimpan ----
{
  const { ctx, page } = await open(360, baseState(), '#/inventaris/water');
  const inp = page.getByLabel(/Dimiliki \(L\)/).first();
  await inp.click(); await page.keyboard.type('99999999'); await page.keyboard.press('Tab');
  const s = await state(page);
  ok(!Object.values(s.inventory).includes(9999999), `B-11 prefiks valid tidak tersimpan: ${JSON.stringify(s.inventory)}`);
  ok((await inp.getAttribute('aria-invalid')) === 'true', 'B-11 galat tetap tampil');
  await inp.fill('120'); await page.keyboard.press('Tab');
  const s2 = await state(page);
  ok(Object.values(s2.inventory).includes(120), `B-11 nilai sah tersimpan: ${JSON.stringify(s2.inventory)}`);
  await ctx.close();
}

// ---- B-14: catatan angka hati-hati ----
{
  const dr = baseState({ scenarios: ['drought'], profile: { ...baseState().profile, scenarios: ['drought'] } });
  let ctxp = await open(360, dr, '#/inventaris/water');
  ok(/Angka hati-hati/.test(await ctxp.page.innerText('main')), 'B-14 catatan di inventaris air');
  await ctxp.ctx.close();
  ctxp = await open(360, baseState(), '#/inventaris/water');
  ok(!/Angka hati-hati/.test(await ctxp.page.innerText('main')), 'B-14 tanpa catatan bila bukan kekeringan');
  await ctxp.ctx.close();
}

// ---- B-02 / D-047: bahan bakar masak di UI ----
{
  const { ctx, page } = await open(360, baseState({ target: { days: 14 } }), '#/inventaris/food');
  const body = await page.innerText('main');
  ok(/Bahan bakar masak: gas kaleng/.test(body) && /Bahan bakar masak: LPG 3 kg/.test(body) && /Bahan bakar masak: kompor alternatif/.test(body), 'B-02 tiga pilihan bahan bakar tampil');
  ok(/sekitar 6 kaleng per orang per minggu. Untuk 2 orang selama 14 hari: sekitar 24 kaleng/.test(body), 'B-02 saran jumlah MAFF tampil sebagai saran');
  const f = page.getByLabel(/Cukup untuk berapa hari memasak \(hari\)/);
  ok((await f.count()) === 3, 'B-02 tiga isian hari bahan bakar');
  await f.nth(1).fill('14'); await page.waitForTimeout(200);
  const s = await state(page);
  ok(s.inventory.fuel_lpg === 14, 'B-02 hari LPG tersimpan');
  const chips = await page.locator('.f-item .chip-ok').count();
  ok(chips >= 3, `B-02 ketiga anggota grup tampil "cukup" bila salah satu memenuhi (${chips})`);
  await ctx.close();
}
{
  const { ctx, page } = await open(360, baseState({ target: { days: 14 } }), '#/rincian');
  await page.evaluate(() => {});
  const body = await page.innerText('main');
  ok(/Cukup salah satu/.test(body), 'B-02 hasil menulis "cukup salah satu" untuk bahan bakar');
  await ctx.close();
}

// ---- B-15: CSP tidak merusak SW / inline; tanpa orientation ----
{
  const { ctx, page } = await open(360, rich, '#/');
  const csp = await page.evaluate(() => document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content || '');
  ok(/script-src 'self'/.test(csp), 'B-15 CSP meta ada');
  const sw = await page.evaluate(async () => { const r = await navigator.serviceWorker.ready; return !!r.active; });
  ok(sw, 'B-15 service worker aktif dengan CSP');
  const keys = await page.evaluate(async () => (await caches.keys()));
  ok(keys.includes('survivalcheck-v13'), `SW cache v4: ${keys}`);
  const mf = await (await page.request.get(srv.base + 'manifest.webmanifest')).json();
  ok(!('orientation' in mf), 'B-15 manifest tanpa orientation');
  await ctx.close();
}

// ---- semua rute: tanpa error konsol (termasuk pelanggaran CSP) dan tanpa overflow 320 ----
{
  const { ctx, page } = await open(320, rich, '#/');
  let bad = [];
  for (const r of ROUTES) {
    await page.goto(srv.base + r); await page.waitForSelector('main h1'); await page.waitForTimeout(150);
    if (!(await noOverflow(page))) bad.push(r);
  }
  ok(bad.length === 0, `320px tanpa scroll horizontal di ${ROUTES.length} rute: ${bad}`);
  await ctx.close();
}
ok(errors.length === 0, 'tanpa error konsol / CSP / permintaan cases.json: ' + JSON.stringify(errors.slice(0, 5)));

await browser.close(); srv.close();
console.log(fails() ? `\n${fails()} GAGAL` : '\nSemua lolos');
process.exit(fails() ? 1 : 0);
