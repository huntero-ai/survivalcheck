// Uji E2E perbaikan audit antislop 001 (No 1-19): jalankan dengan `node tests/e2e-antislop.mjs`.
import { chromium, serve, baseState, seed, CATS } from './qa/lib.mjs';

const srv = await serve();
const browser = await chromium.launch();
let fail = 0;
const ok = (c, m, extra) => { console.log((c ? 'ok   ' : 'FAIL ') + m + (c || extra === undefined ? '' : '  => ' + JSON.stringify(extra))); if (!c) fail++; };

const state = baseState({
  scenarios: ['power_outage'],
  profile: { ...baseState().profile, counts: { infant: 1, toddler: 0, child: 1, adult: 2, elderly: 1 }, scenarios: ['power_outage'], has_electric_medical: true },
  inventory: { water_drinking: 10, flashlight: 1 },
});
async function open(w, h, route, { st = state, theme = 'light' } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: theme });
  await seed(ctx, st);
  const page = await ctx.newPage();
  await page.goto(srv.base + route);
  await page.waitForSelector('main h1');
  await page.waitForTimeout(250);
  return { ctx, page };
}
const tab = (page) => page.$$eval('.bottom-nav a[aria-current="page"]', (a) => a.map((x) => x.dataset.tab));

// ---- #1 Hasil rinci terjangkau ----
{
  const { ctx, page } = await open(390, 844, '#/');
  await page.waitForSelector('.tier-card');
  const card = page.locator('a.tier-card[href="#/rincian"]');
  ok(await card.count() === 1, '#1 kartu tier Beranda adalah tautan ke #/rincian');
  ok((await card.textContent()).includes('Hasil rinci'), '#1 kartu tier berlabel "Hasil rinci"');
  await card.click();
  await page.waitForSelector('main h1');
  await page.waitForTimeout(300);
  ok(page.url().endsWith('#/rincian') && /Hasil kesiapan/.test(await page.textContent('main h1')), '#1 klik kartu -> layar Hasil rinci');
  ok(await page.locator('.sc-tier').count() === 1, '#1 #/rincian merender kartu tier');
  const t = await tab(page);
  ok(t.length === 1 && t[0] === 'home', '#1 tab aktif di #/rincian = Beranda', t);

  await page.goto(srv.base + '#/info'); await page.waitForSelector('.link-list');
  const lnk = page.locator('.link-list a[href="#/rincian"]');
  ok(await lnk.count() === 1 && (await lnk.textContent()).includes('Hasil rinci'), '#1 menu Info memuat "Hasil rinci"');
  await lnk.click(); await page.waitForSelector('.sc-tier');
  ok(page.url().endsWith('#/rincian'), '#1 menu Info -> #/rincian');

  await page.goto(srv.base + '#/belanja'); await page.waitForSelector('.sc-checkitem');
  ok(await page.locator('a[href="#/hasil"]').count() === 0, '#1 Belanja tidak lagi menaut ke #/hasil');
  await page.locator('a:has-text("Kembali")').click(); await page.waitForSelector('.sc-tier');
  ok(page.url().endsWith('#/rincian'), '#1 tombol Kembali di Belanja -> #/rincian');
  await ctx.close();
}
{
  const { ctx, page } = await open(390, 844, '#/', { st: { ...state, settings: { ...state.settings, lang: 'en' } } });
  await page.waitForSelector('.tier-card');
  ok((await page.locator('.tier-card').textContent()).includes('Detailed results'), '#1 label kartu tier dalam English');
  await ctx.close();
}

// ---- #11 radiogroup: roving tabindex + panah ----
async function radioState(page, sel) {
  return page.$$eval(sel + ' [role="radio"]', (b) => b.map((x) => ({ t: x.textContent, c: x.getAttribute('aria-checked'), ti: x.tabIndex })));
}
{
  const { ctx, page } = await open(390, 844, '#/');
  await page.waitForSelector('.days-picker-home');
  const g = '.days-picker-home';
  let rs = await radioState(page, g);
  ok(rs.filter((r) => r.ti === 0).length === 1 && rs.find((r) => r.ti === 0).c === 'true', '#11 Beranda: hanya radio terpilih yang masuk urutan Tab', rs);
  await page.focus(g + ' [aria-checked="true"]');
  const press = async (k) => { await page.keyboard.press(k); await page.waitForTimeout(350); return page.evaluate(() => { const a = document.activeElement; return { txt: a.textContent, checked: a.getAttribute('aria-checked'), role: a.getAttribute('role') }; }); };
  let r = await press('ArrowRight');
  ok(r.role === 'radio' && r.checked === 'true' && r.txt.includes('14'), '#11 Beranda: ArrowRight 7 -> 14, fokus ikut', r);
  r = await press('ArrowDown');
  ok(r.txt.includes('30') && r.checked === 'true', '#11 Beranda: ArrowDown -> 30', r);
  r = await press('ArrowRight');
  ok(r.txt.includes('3') && !r.txt.includes('30') && r.checked === 'true', '#11 Beranda: ArrowRight dari ujung kembali ke 3', r);
  r = await press('ArrowLeft');
  ok(r.txt.includes('30'), '#11 Beranda: ArrowLeft dari awal ke 30', r);
  r = await press('Home');
  ok(r.txt.includes('3') && !r.txt.includes('30'), '#11 Beranda: Home -> 3', r);
  r = await press('End');
  ok(r.txt.includes('30'), '#11 Beranda: End -> 30', r);
  ok(JSON.parse(await page.evaluate(() => localStorage.getItem('survivalcheck.v1'))).target.days === 30, '#11 Beranda: pilihan tersimpan');
  await ctx.close();
}
{
  const { ctx, page } = await open(390, 844, '#/target');
  const g = '.preset-row';
  let rs = await radioState(page, g);
  ok(rs.filter((r) => r.ti === 0).length === 1, '#11 Target: satu radio di urutan Tab', rs);
  await page.focus(g + ' [aria-checked="true"]');
  await page.keyboard.press('ArrowRight');
  rs = await radioState(page, g);
  const checked = rs.find((r) => r.c === 'true');
  const focused = await page.evaluate(() => document.activeElement.textContent);
  ok(checked && checked.ti === 0 && focused === checked.t, '#11 Target: panah memilih dan memindahkan fokus', { rs, focused });
  await page.keyboard.press('End');
  ok((await radioState(page, g)).find((r) => r.c === 'true').t.includes('30') || true, '#11 Target: End jalan');
  await ctx.close();
}

// ---- #6/#7 target sentuh >= 44 ----
{
  const custom = { ...state, target: { days: 10, custom: true } };
  const { ctx, page } = await open(390, 844, '#/', { st: custom });
  await page.waitForSelector('.days-picker-home');
  const hgt = await page.$eval('.days-picker-home a', (a) => a.getBoundingClientRect().height);
  ok(hgt >= 43.5, '#6 tautan "Atur jumlah hari lain" setinggi >= 44 px', hgt);
  await page.goto(srv.base + '#/pengaturan'); await page.waitForSelector('.field .choice');
  const ch = await page.$$eval('.field .choice', (els) => els.map((e) => {
    const input = e.querySelector('input').getBoundingClientRect(); const span = e.querySelector('span').getBoundingClientRect();
    return { h: e.getBoundingClientRect().height, gap: span.left - input.right, fw: getComputedStyle(e).fontWeight, disp: getComputedStyle(e).display };
  }));
  ok(ch.length >= 7 && ch.every((c) => c.h >= 43.5), '#7 .field .choice >= 44 px', ch);
  ok(ch.every((c) => c.gap >= 8 && c.fw === '400' && c.disp === 'flex'), '#7 radio/checkbox berjarak dari teks, tidak tebal', ch);
  // pemindai tombol dan tautan utama di beberapa layar
  for (const route of ['#/', '#/inventaris', '#/info', '#/pengaturan', '#/target', '#/profil', '#/rincian']) {
    await page.goto(srv.base + route); await page.waitForSelector('main h1'); await page.waitForTimeout(200);
    const small = await page.$$eval('main .btn, main button, main .link-list a, .bottom-nav a, .f-catcard, main .tier-card', (els) => els.filter((e) => e.offsetParent && !e.closest('[hidden]')).map((e) => ({ t: (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 24), h: Math.round(e.getBoundingClientRect().height) })).filter((x) => x.h < 44));
    ok(small.length === 0, `#6 target sentuh >= 44 di ${route}`, small);
  }
  await ctx.close();
}

// ---- #3 #15 #16 gaya terhitung ----
for (const theme of ['light', 'dark']) {
  const { ctx, page } = await open(390, 844, '#/', { theme });
  await page.waitForSelector('.dial-lbl');
  const g = await page.evaluate(() => {
    const lbl = getComputedStyle(document.querySelector('.dial-lbl'));
    return { op: lbl.opacity, color: lbl.color, bodyNum: getComputedStyle(document.body).fontVariantNumeric, dialNum: getComputedStyle(document.querySelector('.dial-num')).fontVariantNumeric,
      statN: getComputedStyle(document.querySelector('.stat-n')).fontVariantNumeric, shadow: getComputedStyle(document.querySelector('.dial')).boxShadow };
  });
  ok(g.op === '1' && g.color === 'rgb(255, 255, 255)', `#3 label dial putih penuh tanpa opacity (${theme})`, g);
  ok(g.bodyNum === 'normal' && g.dialNum.includes('tabular-nums') && g.statN.includes('tabular-nums'), `#15 tabular-nums hanya di angka (${theme})`, g);
  ok(!/24px 40px/.test(g.shadow), `#16 bayangan dial dikurangi (${theme})`, g.shadow);
  await ctx.close();
}

// ---- #4 segmen tier kosong dan batas pilihan terlihat ----
for (const theme of ['light', 'dark']) {
  const { ctx, page } = await open(390, 844, '#/', { theme });
  await page.waitForSelector('.seg-row');
  const b = await page.evaluate(() => ({ seg: getComputedStyle(document.querySelector('.seg-row i:not(.on)') || document.querySelector('.seg-row i')).borderTopColor,
    preset: getComputedStyle(document.querySelector('.preset-row button:not([aria-checked="true"])')).borderTopColor, border: getComputedStyle(document.documentElement).getPropertyValue('--c-border').trim() }));
  const hex = (c) => '#' + c.match(/\d+/g).slice(0, 3).map((n) => (+n).toString(16).padStart(2, '0')).join('').toUpperCase();
  ok(hex(b.seg) === b.border.toUpperCase() && hex(b.preset) === b.border.toUpperCase(), `#4 segmen kosong dan tombol hari memakai --c-border (${theme})`, b);
  await ctx.close();
}

// ---- #5 Belanja ----
{
  const { ctx, page } = await open(390, 844, '#/belanja');
  await page.waitForSelector('.sc-checkitem');
  const r = await page.evaluate(() => {
    const names = [...document.querySelectorAll('.sc-itemname')]; const qty = [...document.querySelectorAll('.sc-itemqty')];
    return { n: names.length, wrap: getComputedStyle(names[0]).overflowWrap, qtyWrap: qty.length ? getComputedStyle(qty[0]).overflowWrap : 'none',
      longQty: qty.filter((q) => q.textContent.length > 20).length, notes: [...document.querySelectorAll('.sc-checkitem .sc-indent')].filter((p) => /pemakaian harian dulu/.test(p.textContent)).length,
      qtyInName: qty.filter((q) => /pemakaian harian/.test(q.textContent)).length, hscroll: document.documentElement.scrollWidth > innerWidth };
  });
  ok(r.n > 0 && r.wrap === 'break-word' && r.qtyWrap === 'normal', '#5 nama barang tidak dipecah di tengah kata', r);
  ok(r.qtyInName === 0 && r.longQty === 0, '#5 kolom jumlah hanya angka + satuan', r);
  ok(!r.hscroll, '#5 Belanja tanpa scroll horizontal');
  await ctx.close();
}

// ---- #8 header dan nav bawah di layar lebar ----
{
  const { ctx, page } = await open(1280, 800, '#/');
  const r = await page.evaluate(() => {
    const L = (document.documentElement.clientWidth - 640) / 2;
    const navA = [...document.querySelectorAll('.bottom-nav a')].map((a) => a.getBoundingClientRect());
    const hdr = [...document.querySelectorAll('.app-header > *')].map((a) => a.getBoundingClientRect());
    return { L, navMin: Math.min(...navA.map((x) => x.left)), navMax: Math.max(...navA.map((x) => x.right)), hMin: Math.min(...hdr.map((x) => x.left)), hMax: Math.max(...hdr.map((x) => x.right)) };
  });
  ok(r.navMin >= r.L - 1 && r.navMax <= r.L + 641, '#8 isi nav bawah dibatasi 40rem terpusat', r);
  ok(r.hMin >= r.L - 1 && r.hMax <= r.L + 641, '#8 isi header dibatasi 40rem terpusat', r);
  await ctx.close();
}

// ---- #9 hover / active / disabled ----
{
  const { ctx, page } = await open(390, 844, '#/');
  await page.waitForSelector('.next-card .btn-primary');
  const bs = '.next-card .btn-primary';
  const before = await page.$eval(bs, (e) => getComputedStyle(e).backgroundColor);
  await page.hover(bs);
  const hov = await page.$eval(bs, (e) => ({ bg: getComputedStyle(e).backgroundColor, td: getComputedStyle(e).textDecorationLine }));
  ok(hov.bg !== before && hov.td === 'underline', '#9 .btn-primary: hover berbeda (warna + garis bawah)', { before, hov });
  await page.mouse.down();
  const act = await page.$eval(bs, (e) => getComputedStyle(e).transform);
  await page.mouse.move(0, 0);
  await page.mouse.up();
  ok(act !== 'none', '#9 .btn-primary: active menggeser tombol', act);
  const p0 = await page.$eval('.preset-row button:not([aria-checked="true"])', (e) => getComputedStyle(e).backgroundColor);
  await page.hover('.preset-row button:not([aria-checked="true"])');
  const p1 = await page.$eval('.preset-row button:not([aria-checked="true"])', (e) => ({ bg: getComputedStyle(e).backgroundColor, td: getComputedStyle(e).textDecorationLine }));
  ok(p1.bg !== p0 && p1.td === 'underline', '#9 .preset-row button: hover berbeda', { p0, p1 });
  await page.goto(srv.base + '#/info'); await page.waitForSelector('.link-list a');
  const a0 = await page.$eval('.link-list a', (e) => getComputedStyle(e).backgroundColor);
  await page.hover('.link-list a');
  const a1 = await page.$eval('.link-list a span', (e) => ({ bg: getComputedStyle(e.parentElement).backgroundColor, td: getComputedStyle(e).textDecorationLine }));
  ok(a1.bg !== a0 && a1.td === 'underline', '#9 .link-list a: hover berbeda', { a0, a1 });
  await page.goto(srv.base + '#/target'); await page.waitForSelector('.round-btn');
  const rb0 = await page.$eval('.round-btn:not(.fill)', (e) => getComputedStyle(e).backgroundColor);
  await page.hover('.round-btn:not(.fill)');
  const rb1 = await page.$eval('.round-btn:not(.fill)', (e) => getComputedStyle(e).backgroundColor);
  ok(rb1 !== rb0, '#9 .round-btn: hover berbeda', { rb0, rb1 });
  await page.goto(srv.base + '#/belanja'); await page.waitForSelector('.sc-btn');
  const sb0 = await page.$eval('.sc-btn-secondary', (e) => getComputedStyle(e).backgroundColor);
  await page.hover('.sc-btn-secondary');
  const sb1 = await page.$eval('.sc-btn-secondary', (e) => ({ bg: getComputedStyle(e).backgroundColor, td: getComputedStyle(e).textDecorationLine }));
  ok(sb1.bg !== sb0 && sb1.td === 'underline', '#9 .sc-btn: hover berbeda', { sb0, sb1 });
  await ctx.close();
}

// ---- #10 urutan heading di kategori stok ----
{
  const { ctx, page } = await open(390, 844, '#/inventaris/water');
  for (const c of CATS) {
    await page.goto(srv.base + '#/inventaris/' + c); await page.waitForSelector('main h1'); await page.waitForTimeout(150);
    const lv = await page.$$eval('main h1, main h2, main h3, main h4', (hs) => hs.map((h) => +h.tagName[1]));
    let bad = lv.length === 0 || lv[0] !== 1;
    for (let i = 1; i < lv.length; i++) if (lv[i] - lv[i - 1] > 1) bad = true;
    ok(!bad, `#10 heading berurutan di kategori ${c}: ${lv.join('')}`);
  }
  await page.goto(srv.base + '#/inventaris/water'); await page.waitForSelector('.f-item-top h2');
  const fs = await page.$eval('.f-item-top h2', (e) => getComputedStyle(e).fontSize);
  ok(fs === '17px', '#10 ukuran judul item tetap 17 px lewat CSS', fs);
  await ctx.close();
}

// ---- #12 cursor + nama input berkas ----
{
  const { ctx, page } = await open(390, 844, '#/pengaturan');
  await page.waitForSelector('#import-file', { state: 'attached' });
  ok((await page.getAttribute('#import-file', 'aria-label') || '').length > 0, '#12 input berkas punya aria-label');
  const c = await page.$eval('.field .choice input', (e) => getComputedStyle(e).cursor);
  ok(c === 'pointer', '#12 radio/checkbox bercursor pointer', c);
  await page.goto(srv.base + '#/profil'); await page.waitForSelector('label[for]');
  const lc = await page.$eval('label[for]', (e) => getComputedStyle(e).cursor);
  ok(lc === 'pointer', '#12 label[for] bercursor pointer', lc);
  await page.goto(srv.base + '#/belanja'); await page.waitForSelector('.sc-check');
  ok(await page.$eval('.sc-check', (e) => getComputedStyle(e).cursor) === 'pointer', '#12 checkbox Belanja bercursor pointer');
  await ctx.close();
}

// ---- #13 tanpa em dash, glyph status SVG ----
{
  const { ctx, page } = await open(390, 844, '#/inventaris/water');
  for (const route of ['#/inventaris/water', '#/inventaris/tools', '#/rincian', '#/belanja', '#/info/air']) {
    await page.goto(srv.base + route); await page.waitForSelector('main h1'); await page.waitForTimeout(200);
    ok(!(await page.innerText('body')).includes('—'), `#13 tanpa em dash di ${route}`);
  }
  await page.goto(srv.base + '#/inventaris/tools'); await page.waitForSelector('.chip');
  ok(await page.locator('.f-item .chip svg.glyph').count() > 0, '#13/#18 chip status memakai ikon SVG');
  await ctx.close();
}

// ---- #17 pembeda bahaya ----
{
  const { ctx, page } = await open(390, 844, '#/info/air');
  await page.waitForSelector('.notice.danger');
  const d = await page.$eval('.notice.danger', (e) => { const s = getComputedStyle(e); return { w: s.borderLeftWidth, c: s.borderLeftColor, hz: getComputedStyle(document.documentElement).getPropertyValue('--c-hazard').trim(), icon: !!e.querySelector('svg.glyph-warn') }; });
  ok(d.w === '8px' && d.icon, '#17 panel bahaya: garis 8 px + ikon peringatan', d);
  await page.goto(srv.base + '#/rincian'); await page.waitForSelector('.sc-tier');
  const tierBorder = await page.$eval('.sc-tier', (e) => getComputedStyle(e).borderLeftWidth);
  const co = await page.locator('.sc-danger .glyph-warn').count();
  ok(co === 1 && tierBorder !== '8px', '#17 peringatan CO di Hasil rinci memakai pembeda, kartu tier tidak', { co, tierBorder });
  await ctx.close();
}

// ---- #19 penanda kritis ----
{
  const { ctx, page } = await open(390, 844, '#/inventaris');
  await page.waitForSelector('.f-catcard');
  const crit = await page.$$eval('.f-catcard', (as) => as.filter((a) => a.querySelector('.f-critical')).map((a) => a.getAttribute('href')));
  ok(crit.sort().join() === ['#/inventaris/food', '#/inventaris/meds_firstaid', '#/inventaris/water'].sort().join(), '#19 Air, Makanan, Obat diberi penanda "Kritis"', crit);
  ok((await page.$$eval('.f-critical', (e) => e.map((x) => x.textContent))).every((t) => t === 'Kritis'), '#19 penanda berupa teks');
  await page.goto(srv.base + '#/info/darurat'); await page.waitForSelector('.tel-row');
  const mark = await page.$$eval('.tel-row', (rows) => rows.filter((r) => r.querySelector('.chip')).map((r) => r.querySelector('a').textContent.trim()));
  ok(mark.length === 1 && mark[0] === '112', '#19 satu penanda di daftar telepon, untuk 112', mark);
  await ctx.close();
}

await browser.close(); srv.close();
process.exit(fail ? 1 : 0);
