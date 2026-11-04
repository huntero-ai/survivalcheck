// QA bagian 3: data korup, XSS lewat impor/perangkat custom, roundtrip ekspor-hapus-impor.
import { chromium, serve, reporter, baseState, KEY } from './lib.mjs';
import fs from 'node:fs';
const { ok, fails } = reporter();
const srv = await serve();
const browser = await chromium.launch();
const mk = async () => { const c = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1, acceptDownloads: true }); const p = await c.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('dialog', (d) => { errs.push('DIALOG:' + d.message()); d.dismiss(); }); return { c, p, errs }; };
// 1. data korup: banner pesan?
{
  const { c, p, errs } = await mk();
  await p.goto(srv.base); await p.evaluate((k) => localStorage.setItem(k, '{not json'), KEY); await p.reload(); await p.waitForSelector('main h1');
  const txt = await p.innerText('body');
  console.log('korup home:', txt.replace(/\n+/g, ' | ').slice(0, 300));
  ok(/rusak|tidak bisa dibaca|corrupt/i.test(txt), 'data korup: ada pemberitahuan ke pengguna');
  const after = await p.evaluate((k) => localStorage.getItem(k), KEY);
  console.log('   isi storage setelah load korup:', String(after).slice(0, 60));
  await c.close();
}
// 2. XSS: impor JSON berisi payload di nama perangkat custom, label obat, kartu keluarga, dst
const XSS = ['<img src=x onerror="window.__xss=1;alert(1)">', '<script>window.__xss=2</script>', '"><svg onload="window.__xss=3">', "'-alert(4)-'"];
const st = baseState({
  profile: { ...baseState().profile, meds: [{ label: XSS[0], doses_per_day: 1, stock_days: 5 }], has_electric_medical: true, province: XSS[1], aids: XSS[2], pets: { dog: 0, cat: 0, other: XSS[0] } },
  power_devices: { custom_1: { qty: 1, hours: 2, watts: 50, name: XSS[0], medical: true }, custom_2: { qty: 1, hours: 2, watts: 50, name: XSS[1] }, custom_3: { qty: 1, hours: 1, watts: 5, name: XSS[2] }, '<img src=x onerror=window.__xss=9>': { qty: 1, hours: 1, watts: 5 } },
  power_inventory: { outage_days: 3 },
  family_plan: { meeting_point: XSS[0], far_contact: XSS[1], bag_carrier: XSS[2], helper: XSS[3], route: XSS[0], contacts: XSS[1] },
  inventory: { '<b onmouseover=alert(1)>x': 5, water_drinking: { qty: XSS[0] } },
  shopping: { checked: { [XSS[0]]: true }, hide_bought: false }, settings: { lang: 'id', theme: XSS[0], reminders: {}, reminderDone: {}, disclaimerAccepted: true },
  scenarios: [XSS[0], 'earthquake'],
});
const file = '/tmp/qa-shots/xss-import.json';
fs.writeFileSync(file, JSON.stringify({ app: 'survivalcheck', schema: 1, exportedAt: 'x', state: st }));
{
  const { c, p, errs } = await mk();
  await p.goto(srv.base + '#/pengaturan'); await p.waitForSelector('main h1');
  await p.setInputFiles('#import-file', file);
  await p.waitForSelector('.dialog'); await p.click('.dialog .btn-primary'); await p.waitForTimeout(500);
  const route = ['#/daya', '#/profil', '#/hasil', '#/belanja', '#/info/kartu', '#/inventaris/water', '#/inventaris/special_needs', '#/inventaris/power', '#/keluarga', '#/target', '#/pengaturan', '#/'];
  for (const r of route) { await p.goto(srv.base + r); await p.reload(); await p.waitForSelector('main h1, main h2').catch(() => {}); await p.waitForTimeout(250); }
  for (const r of ['#/daya', '#/profil', '#/hasil', '#/belanja', '#/info/kartu']) { await p.goto(srv.base + r); await p.reload(); await p.waitForTimeout(300); }
  const x = await p.evaluate(() => ({ xss: window.__xss, imgs: document.querySelectorAll('img[src="x"],script:not([src]),svg[onload],[onerror],[onmouseover]').length }));
  ok(!x.xss && x.imgs === 0 && !errs.some((e) => e.startsWith('DIALOG')), 'XSS: payload impor tidak dieksekusi & tidak jadi elemen', { x, errs: errs.slice(0, 3) });
  // tampil sebagai teks?
  await p.goto(srv.base + '#/daya'); await p.reload(); await p.waitForSelector('main h1'); await p.waitForTimeout(300);
  const shown = await p.evaluate(() => document.body.innerText.includes('<img src=x'));
  console.log('   payload tampil sebagai teks literal di #/daya:', shown);
  await c.close();
}
// 3. impor rusak / berbahaya
const bad = { 'bukan json': 'oops{', 'app salah': JSON.stringify({ app: 'x', schema: 1, state: {} }), 'schema 2': JSON.stringify({ app: 'survivalcheck', schema: 2, state: {} }), 'state null': JSON.stringify({ app: 'survivalcheck', schema: 1, state: null }), 'state array': JSON.stringify({ app: 'survivalcheck', schema: 1, state: [1] }), 'kosong': '' };
for (const [n, body] of Object.entries(bad)) {
  const { c, p, errs } = await mk();
  await p.goto(srv.base + '#/pengaturan'); await p.waitForSelector('main h1');
  fs.writeFileSync('/tmp/qa-shots/bad.json', body);
  await p.setInputFiles('#import-file', '/tmp/qa-shots/bad.json'); await p.waitForTimeout(500);
  const dlg = await p.$('.dialog');
  const msg = await p.innerText('main');
  ok(!dlg || n === 'state array', 'impor rusak ditolak tanpa dialog konfirmasi: ' + n, { dlg: !!dlg });
  if (dlg) { console.log('   state array lolos validasi -> dialog'); await p.click('.dialog .btn:not(.btn-primary)'); }
  await c.close();
}
// impor valid dengan state berbahaya struktur: counts string, proto pollution
{
  const { c, p, errs } = await mk();
  await p.goto(srv.base + '#/pengaturan'); await p.waitForSelector('main h1');
  fs.writeFileSync('/tmp/qa-shots/proto.json', '{"app":"survivalcheck","schema":1,"state":{"__proto__":{"polluted":"yes"},"profile":{"counts":{"adult":"abc"}},"constructor":{"prototype":{"p2":1}}}}');
  await p.setInputFiles('#import-file', '/tmp/qa-shots/proto.json'); await p.waitForSelector('.dialog'); await p.click('.dialog .btn-primary'); await p.waitForTimeout(400);
  const pol = await p.evaluate(() => ({}).polluted || ({}).p2 || null);
  ok(!pol, 'prototype pollution via impor tidak terjadi', pol);
  for (const r of ['#/', '#/hasil', '#/profil', '#/belanja']) { await p.goto(srv.base + r); await p.reload(); await p.waitForSelector('main h1, main h2').catch(() => {}); }
  ok(errs.length === 0, 'impor state ganjil tidak menimbulkan pageerror', errs.slice(0, 3));
  await c.close();
}
// 4. roundtrip ekspor -> hapus -> impor lewat UI
{
  const { c, p, errs } = await mk();
  const full = baseState({ profile: { ...baseState().profile, counts: { infant: 1, toddler: 0, child: 1, adult: 2, elderly: 1 }, meds: [{ label: 'Obat', doses_per_day: 2, stock_days: 9 }], pets: { dog: 1, cat: 0 } }, scenarios: ['earthquake', 'pandemic'], inventory: { water_drinking: 33, flashlight: 2, food_rice: { qty: 4 } }, bag_checklist: { 1: true, 2: true }, indicators: { ind_01: 2, ind_02: 1 }, power_devices: { phone: { qty: 2, hours: 3, watts: 10 }, custom_1: { qty: 1, hours: 2, watts: 40, name: 'Kipas Ö 日本' } }, power_inventory: { outage_days: 2, power_station_wh: 500 }, family_plan: { meeting_point: 'Lapangan' }, shopping: { checked: { flashlight: true }, hide_bought: true } });
  await p.goto(srv.base); await p.evaluate(([k, s]) => localStorage.setItem(k, s), [KEY, JSON.stringify(full)]); await p.reload();
  await p.goto(srv.base + '#/pengaturan'); await p.waitForSelector('main h1');
  const dl = p.waitForEvent('download'); await p.click('button:has-text("Ekspor")'); const d = await dl; const path = '/tmp/qa-shots/export.json'; await d.saveAs(path);
  const exp = JSON.parse(fs.readFileSync(path, 'utf8'));
  ok(exp.app === 'survivalcheck' && exp.schema === 1 && exp.state.inventory.water_drinking === 33, 'ekspor memuat state', Object.keys(exp));
  await p.click('button:has-text("Hapus semua data")'); await p.waitForSelector('.dialog'); await p.click('.dialog .btn-primary'); await p.waitForTimeout(500);
  const cleared = await p.evaluate((k) => localStorage.getItem(k), KEY);
  ok(cleared === null || !JSON.parse(cleared).profile, 'hapus semua data', String(cleared).slice(0, 80));
  console.log('   setelah hapus, url:', p.url(), '| ada #import-file:', !!(await p.$('#import-file')));
  await p.goto(srv.base + '#/pengaturan'); await p.waitForSelector('#import-file', { state: 'attached' });
  await p.setInputFiles('#import-file', path); await p.waitForSelector('.dialog'); await p.click('.dialog .btn-primary'); await p.waitForTimeout(500);
  const back = await p.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
  const strip = (s) => { const o = JSON.parse(JSON.stringify(s)); delete o.updatedAt; delete o.createdAt; return o; };
  const a = strip(full), b = strip(back);
  const diffs = Object.keys(a).filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
  ok(diffs.length === 0, 'roundtrip ekspor->hapus->impor identik', { diffs, a: diffs.map((k) => a[k]), b: diffs.map((k) => b[k]) });
  await p.goto(srv.base + '#/hasil'); await p.reload(); await p.waitForSelector('main h1');
  ok(errs.length === 0, 'tanpa error selama roundtrip', errs);
  await c.close();
}
console.log('FAILS', fails());
await browser.close(); srv.close();
