// QA bagian 3: kasus ekstrem lewat state yang disuntik ke localStorage + UI.
import { chromium, serve, reporter, baseState, KEY, CATS } from './lib.mjs';
const { ok, fails } = reporter();
const srv = await serve();
const browser = await chromium.launch();
const ROUTES = ['#/', '#/profil', '#/target', ...CATS.map((c) => '#/inventaris/' + c), '#/daya', '#/keluarga', '#/hasil', '#/belanja', '#/pengaturan'];
async function run(name, state, { routes = ROUTES, raw = null, init = null, expectText = null } = {}) {
  const context = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1 });
  if (init) await context.addInitScript(init);
  await context.addInitScript(([k, s, rawv]) => { if (!window.name.includes('__seeded')) { try { localStorage.setItem(k, rawv !== null ? rawv : s); } catch (e) {} window.name += '__seeded'; } }, [KEY, JSON.stringify(state), raw]);
  const page = await context.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  const bad = [];
  for (const r of routes) {
    await page.goto(srv.base + r); await page.reload(); await page.waitForSelector('main h1, main h2', { timeout: 6000 }).catch(() => bad.push(r + ' no heading'));
    await page.waitForTimeout(120);
    const info = await page.evaluate(() => { const t = document.body.innerText; return { bad: (t.match(/\b(undefined|NaN|Infinity|null|\[object Object\])\b/g) || []).slice(0, 3), sw: document.documentElement.scrollWidth > innerWidth, soon: /Segera hadir/.test(t), err: /Terjadi kesalahan|Something went wrong/i.test(t), len: t.length }; });
    if (info.bad.length || info.sw || info.soon || info.err) bad.push(r + ' ' + JSON.stringify(info));
  }
  ok(bad.length === 0 && errs.length === 0, 'edge: ' + name, { bad: bad.slice(0, 5), errs: errs.slice(0, 4) });
  return { context, page, errs };
}
const P = baseState().profile;
const withProfile = (counts, extra = {}, top = {}) => baseState({ profile: { ...P, counts: { infant: 0, toddler: 0, child: 0, adult: 0, elderly: 0, ...counts }, ...extra }, ...top });

// 0 orang
let r = await run('0 orang (counts semua 0)', withProfile({}));
let page = r.page; await page.goto(srv.base + '#/hasil'); await page.reload(); await page.waitForSelector('main h1');
console.log('   0 orang /hasil:', (await page.innerText('main')).replace(/\n+/g, ' | ').slice(0, 300));
await r.context.close();
// 1 bayi saja
r = await run('1 bayi saja', withProfile({ infant: 1 }, { infant_feeding: 'formula' }, { inventory: { water_drinking: 30 } }));
page = r.page; await page.goto(srv.base + '#/hasil'); await page.reload(); await page.waitForSelector('main h1');
console.log('   1 bayi /hasil:', (await page.innerText('main')).replace(/\n+/g, ' | ').slice(0, 500));
await r.context.close();
r = await run('1 bayi ASI', withProfile({ infant: 1, adult: 1 }, { infant_feeding: 'breastfeeding', breastfeeding: 1 }));
await r.context.close();
// 20 orang
r = await run('20 orang', withProfile({ adult: 10, child: 5, toddler: 2, infant: 1, elderly: 2 }, { pregnant: 2, breastfeeding: 1 }, { inventory: { water_drinking: 5000 } }));
await r.context.close();
// 90 hari
r = await run('target 90 hari', withProfile({ adult: 2 }, { target_days: 90 }, { target: { days: 90, custom: true } }));
await r.context.close();
r = await run('target 1000 / -5 / teks', withProfile({ adult: 2 }, { target_days: 1000 }, { target: { days: 'abc' } }));
await r.context.close();
r = await run('tanpa skenario', withProfile({ adult: 2 }, { scenarios: [] }, { scenarios: [] }));
await r.context.close();
const ALL = ['earthquake', 'tsunami', 'flood_landslide', 'eruption', 'haze', 'drought', 'extreme_weather', 'power_outage', 'pandemic', 'conflict', 'nuclear'];
r = await run('11 skenario sekaligus', withProfile({ adult: 2, infant: 1, elderly: 1 }, { scenarios: ALL, pets: { dog: 1, cat: 1 }, has_electric_medical: true, meds: [{ label: 'x', doses_per_day: 1, stock_days: 3 }] }, { scenarios: ALL }));
page = r.page; await page.goto(srv.base + '#/hasil'); await page.reload(); await page.waitForSelector('main h1');
console.log('   11 skenario /hasil:', (await page.innerText('main')).replace(/\n+/g, ' | ').slice(0, 700));
await r.context.close();
// nilai ekstrem di inventaris
r = await run('inventaris 1e9 / negatif / teks / null', withProfile({ adult: 2 }, {}, { inventory: { water_drinking: 1e9, toilet_bags: -50, flashlight: 'abc', spare_batteries: null, power_bank: { home: 1e308, bag: 1e308 }, food_rice: { qty: 1e9, grams_per_unit: -1 }, food_instant_noodles: { qty: 'x' }, cash_days: Infinity } }));
page = r.page; await page.goto(srv.base + '#/hasil'); await page.reload(); await page.waitForSelector('main h1');
console.log('   ekstrem /hasil:', (await page.innerText('main')).replace(/\n+/g, ' | ').slice(0, 500));
await r.context.close();
r = await run('profil counts negatif/teks/desimal/1e9', baseState({ profile: { ...P, counts: { infant: -3, toddler: 'a', child: 2.7, adult: 1e9, elderly: null }, pregnant: -1, breastfeeding: 1e9, pets: { dog: -1, cat: 'x' } } }));
await r.context.close();
// storage corrupt
r = await run('localStorage JSON rusak', baseState(), { raw: '{not json' });
page = r.page; console.log('   rusak banner:', (await page.evaluate(() => document.body.innerText.slice(0, 400))).replace(/\n+/g, ' | '));
await r.context.close();
for (const [n, v] of [['null', 'null'], ['array', '[1,2]'], ['string', '"hi"'], ['profil string', '{"profile":"x","inventory":"y","settings":5,"scenarios":"abc"}'], ['proto', '{"__proto__":{"polluted":1},"profile":{"counts":{"adult":1}},"inventory":{"__proto__":{"x":1}}}'], ['tipe campur', '{"profile":{"counts":"abc"},"inventory":[],"indicators":[1,2],"bag_checklist":"x","scenarios":{"a":1},"settings":{"lang":"fr","theme":"neon"},"power_devices":"x","power_inventory":5,"family_plan":"s","shopping":null}']]) {
  r = await run('storage korup: ' + n, baseState(), { raw: v }); await r.context.close();
}
// localStorage diblokir
for (const [n, init] of [['getter melempar', () => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('denied', 'SecurityError'); } }); }], ['setItem melempar (quota)', () => { Storage.prototype.setItem = function () { throw new DOMException('quota', 'QuotaExceededError'); }; }], ['getItem melempar', () => { Storage.prototype.getItem = function () { throw new Error('x'); }; }]]) {
  r = await run('localStorage diblokir: ' + n, baseState(), { init, routes: ['#/', '#/profil', '#/target', '#/inventaris/water', '#/hasil', '#/pengaturan'] });
  const p = r.page; await p.goto(srv.base + '#/'); await p.reload(); await p.waitForSelector('main h1');
  console.log('   ', n, '->', (await p.innerText('main')).replace(/\n+/g, ' | ').slice(0, 160));
  await r.context.close();
}
console.log('FAILS', fails());
await browser.close(); srv.close();
