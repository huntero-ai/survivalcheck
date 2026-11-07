// Uji E2E sisa LOW (No 20-32): jalankan dengan `node tests/e2e-antislop-low.mjs`.
import { chromium, serve, baseState, seed, ROUTES } from './qa/lib.mjs';

const srv = await serve();
const browser = await chromium.launch();
let fail = 0;
const ok = (c, m, extra) => { console.log((c ? 'ok   ' : 'FAIL ') + m + (c || extra === undefined ? '' : '  => ' + JSON.stringify(extra))); if (!c) fail++; };

const counts0 = { infant: 0, toddler: 0, child: 0, adult: 0, elderly: 0 };
const empty = baseState({ profile: { ...baseState().profile, counts: counts0 }, createdAt: undefined });
const started = baseState({ inventory: {} });
const filled = baseState({
  scenarios: ['power_outage'],
  profile: { ...baseState().profile, counts: { infant: 1, toddler: 0, child: 1, adult: 2, elderly: 1 }, scenarios: ['power_outage'], has_electric_medical: true },
  inventory: { water_drinking: 10, flashlight: 1 },
});
async function open(route, { st = filled, theme = 'light', w = 390, h = 844, csp = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme });
  await seed(ctx, st);
  if (csp) await ctx.addInitScript(() => { window.__csp = []; document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI)); });
  const page = await ctx.newPage();
  await page.goto(srv.base + route);
  await page.waitForSelector('main h1');
  await page.waitForTimeout(300);
  return { ctx, page };
}
const lum = (rgb) => { const c = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const parse = (s) => s.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
const colors = (page, sel) => page.$eval(sel, (el) => { const c = getComputedStyle(el); return { bg: c.backgroundColor, fg: c.color, r: c.borderRadius }; });
const tabs = (page) => page.$$eval('.bottom-nav a[aria-current="page"]', (a) => a.map((x) => x.dataset.tab));

// #21 aksen hanya untuk langkah utama
for (const theme of ['light', 'dark']) {
  const { ctx, page } = await open('#/info/darurat', { theme });
  const prim = await page.$$eval('.tel-row a.btn-primary', (a) => a.map((x) => x.textContent));
  ok(prim.length === 1 && prim[0] === '112', `#21 (${theme}) hanya 112 yang beraksen di tombol telepon`, prim);
  ok(await page.locator('.tel-row a.btn-tel').count() === 8, `#21 (${theme}) 8 tombol telepon lain bergaya sekunder (unslop #1)`);
  const c = await colors(page, '.tel-row a.btn-tel');
  ok(ratio(parse(c.bg), parse(c.fg)) >= 4.5, `#21 (${theme}) kontras tombol telepon >= 4.5`, ratio(parse(c.bg), parse(c.fg)));
  await ctx.close();
}
for (const theme of ['light', 'dark']) {
  const { ctx, page } = await open('#/pengaturan', { theme });
  await page.click('button:has-text("Hapus semua")');
  await page.waitForSelector('[role=alertdialog]');
  ok(await page.locator('[role=alertdialog] .btn-primary').count() === 0, `#21 (${theme}) dialog destruktif tidak memakai aksen`);
  const c = await colors(page, '[role=alertdialog] .btn-hazard');
  ok(ratio(parse(c.bg), parse(c.fg)) >= 4.5, `#21 (${theme}) kontras tombol bahaya >= 4.5`, ratio(parse(c.bg), parse(c.fg)));
  await ctx.close();
}
{
  const { ctx, page } = await open('#/xyz');
  ok(await page.locator('main .btn-primary').count() === 0 && await page.locator('main a.btn-solid').count() === 1, '#21 404: "Ke beranda" bergaya biru, bukan aksen');
  const c = await colors(page, 'main a.btn-solid');
  ok(ratio(parse(c.bg), parse(c.fg)) >= 4.5, '#21 kontras "Ke beranda" >= 4.5');
  // #29 404
  ok((await tabs(page)).length === 0, '#29 404: tidak ada tab yang menyala', await tabs(page));
  ok((await page.textContent('main p')).length > 20, '#29 404 punya kalimat penjelas');
  await page.click('main a.btn-solid'); await page.waitForSelector('.tier-card, .home-intro');
  ok(page.url().endsWith('#/'), '#29 404: tautan balik ke beranda');
  await ctx.close();
}

// #29 tab aktif dan label
{
  const { ctx, page } = await open('#/info');
  const label = (await page.textContent('.bottom-nav a[data-tab="more"]')).trim();
  const h1 = (await page.textContent('main h1')).trim();
  ok(label === h1, '#29 label tab sama dengan judul halaman', { label, h1 });
  for (const r of ['#/info', '#/belanja', '#/pengaturan', '#/info/darurat']) {
    await page.goto(srv.base + r); await page.waitForSelector('main h1'); await page.waitForTimeout(250);
    const t = await tabs(page);
    ok(t.length === 1 && t[0] === 'more', `#29 ${r}: tab Lainnya menyala`, t);
  }
  await ctx.close();
}

// #24 Beranda awal
{
  const { ctx, page } = await open('#/', { st: empty });
  ok(await page.locator('.home-intro').count() === 1 && (await page.textContent('.home-intro')).includes('SurvivalCheck membantu'), '#24 intro tampil di Beranda awal');
  ok((await page.textContent('.home-intro')).includes('hanya tersimpan di perangkat ini'), '#24 kalimat privasi tampil');
  const d = page.locator('.home-disclaimer');
  ok(await d.count() === 1 && (await d.textContent()).includes('bukan pengganti instruksi otoritas'), '#24 disclaimer kesehatan tampil sebagai kotak');
  ok(await d.locator('a[href="#/info/disclaimer"]').count() === 1, '#24 disclaimer punya tautan selengkapnya');
  ok(await page.locator('main .btn-primary').count() === 1, '#24 tetap satu CTA');
  const hgt = await page.$eval('.home-disclaimer a', (a) => a.getBoundingClientRect().height);
  ok(hgt >= 44, '#24 tautan disclaimer >= 44px', hgt);
  ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), '#24 tanpa overflow horizontal');
  await ctx.close();
}
// #24 versi English
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await seed(ctx, { ...empty, settings: { ...empty.settings, lang: 'en' } });
  const page = await ctx.newPage(); await page.goto(srv.base + '#/'); await page.waitForSelector('.home-intro');
  ok((await page.textContent('.home-intro')).includes('Rough numbers are enough'), '#24/#26 intro bahasa Inggris');
  await ctx.close();
}

// #25 hasil sementara dan #27 angka
{
  const a = await open('#/', { st: started });
  ok(await a.page.locator('.pill-partial').count() === 1 && (await a.page.textContent('.pill-partial')).includes('Hasil sementara'), '#25 stok kosong: penanda "Hasil sementara"');
  const note = await a.page.textContent('.hero-note');
  ok(/belum diisi/.test(note), '#25 catatan menjelaskan angka awal', note);
  const nx = await a.page.textContent('.next-card');
  ok(!/\d{4,}/.test(nx), '#27 langkah berikutnya tanpa angka mentah >= 4 digit', nx);
  await a.ctx.close();
  const b = await open('#/', { st: filled });
  ok(await b.page.locator('.pill-partial').count() === 0, '#25 stok terisi: tanpa penanda sementara');
  await b.ctx.close();
}
{
  // langkah berikutnya berupa total kalori diganti langkah konkret
  const { ctx, page } = await open('#/', { st: baseState({ inventory: { water_drinking: 200, flashlight: 3 } }) });
  await page.waitForSelector('.next-card');
  const txt = await page.textContent('.next-card');
  const href = await page.getAttribute('.next-card a.btn-primary', 'href');
  ok(!/kkal/.test(txt), '#27 langkah berikutnya bukan total kkal', txt);
  ok(/^#\/inventaris\/[a-z_]+$/.test(href), '#27 tombol menuju kategori spesifik', href);
  await ctx.close();
}

// #20 satu sistem komponen
{
  const { ctx, page } = await open('#/rincian');
  await page.waitForSelector('.sc-tier');
  const sc = await page.evaluate(() => {
    const m = document.createElement('div'); m.className = 'card'; document.querySelector('main').append(m);
    const cs = (el) => { const c = getComputedStyle(el); return { pad: c.paddingLeft, r: c.borderRadius, mb: c.marginBottom }; };
    const out = { card: cs(m), sc: cs(document.querySelector('.sc-card')) };
    m.remove();
    return out;
  });
  ok(sc.card.pad === sc.sc.pad && sc.card.r === sc.sc.r, '#20 .sc-card = .card (padding, radius)', sc);
  const btn = await colors(page, 'a.sc-btn-primary');
  const { ctx: c2, page: p2 } = await open('#/');
  await p2.waitForSelector('.next-card');
  const btn2 = await colors(p2, '.next-card .btn-primary');
  ok(btn.bg === btn2.bg && btn.r === btn2.r, '#20 tombol utama .sc-btn-primary = .btn-primary (warna, radius)', { btn, btn2 });
  const gut = async (pg) => pg.$eval('main h1', (h) => Math.round(h.getBoundingClientRect().left));
  const g1 = await gut(page), g2 = await gut(p2);
  ok(g1 === g2 && g1 === 24, '#20 gutter judul Rincian = Beranda = 24px', { g1, g2 });
  await page.goto(srv.base + '#/belanja'); await page.waitForSelector('.sc-checkitem');
  ok(await gut(page) === 24, '#20 gutter Belanja 24px');
  await page.goto(srv.base + '#/inventaris'); await page.waitForSelector('.f-catcard');
  ok(await gut(page) === 24, '#20 gutter Stok 24px');
  await c2.close(); await ctx.close();
}

// #31 motif cincin kecil
{
  const { ctx, page } = await open('#/inventaris');
  ok(await page.locator('h1.h1-ring').count() === 1, '#31 cincin kecil di judul Stok');
  const w = await page.$eval('h1.h1-ring', (h) => getComputedStyle(h, '::before').width);
  ok(parseFloat(w) > 10 && parseFloat(w) < 30, '#31 cincin kecil dan tenang', w);
  await page.goto(srv.base + '#/info'); await page.waitForSelector('.link-list');
  ok(await page.locator('h1.h1-ring').count() === 1, '#31 cincin kecil di judul Lainnya');
  await ctx.close();
}

// #32 tanpa inline style, CSP ketat, bar progres tetap berlebar
{
  const { ctx, page } = await open('#/', { csp: true });
  const csp = await page.evaluate(() => document.querySelector('meta[http-equiv="Content-Security-Policy"]').content);
  ok(!/style-src[^;]*unsafe-inline/.test(csp), '#32 CSP style-src tanpa unsafe-inline', csp);
  const bad = [];
  for (const r of [...ROUTES, '#/rincian', '#/xyz', '#/info/xyz']) {
    await page.goto(srv.base + r); await page.waitForSelector('main h1'); await page.waitForTimeout(150);
    const styled = await page.$$eval('[style]', (els) => els.filter((e) => !/^(f-bar-fill|sc-bar-fill)$/.test(e.className)).map((e) => e.tagName + '.' + e.className));
    if (styled.length) bad.push(r + ' ' + styled.join(','));
  }
  ok(bad.length === 0, '#32 tidak ada atribut style selain lebar bar (CSSOM) di semua rute', bad);
  const viol = await page.evaluate(() => window.__csp);
  ok(viol.length === 0, '#32 tidak ada pelanggaran CSP', viol);
  await page.goto(srv.base + '#/inventaris'); await page.waitForSelector('.f-bar-fill');
  const widths = await page.$$eval('.f-bar-fill', (e) => e.map((x) => x.getBoundingClientRect().width));
  ok(widths.some((x) => x > 5), '#32 bar progres Stok punya lebar (CSS custom property)', widths.slice(0, 4));
  await page.goto(srv.base + '#/rincian'); await page.waitForSelector('.sc-bar-fill');
  const w2 = await page.$$eval('.sc-bar-fill', (e) => e.map((x) => x.getBoundingClientRect().width));
  ok(w2.some((x) => x > 1), '#32 bar progres Rincian punya lebar', w2.slice(0, 4));
  await page.goto(srv.base + '#/target'); await page.waitForSelector('.f-target-label');
  ok(await page.$eval('.f-target-label', (e) => getComputedStyle(e).fontWeight) >= 600, '#32 gaya label target lewat kelas');
  await ctx.close();
}

await browser.close(); srv.close();
console.log(fail ? `\n${fail} GAGAL` : '\nsemua hijau');
process.exit(fail ? 1 : 0);
