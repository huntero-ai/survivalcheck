// QA bagian 3: input UI (kosong/negatif/teks/1e9) pada profil, target, inventaris, daya. Cek nilai tersimpan & tampilan.
import { chromium, serve, reporter, baseState, KEY } from './lib.mjs';
const { ok, fails } = reporter();
const srv = await serve(); const browser = await chromium.launch();
const c = await browser.newContext({ viewport: { width: 360, height: 740 } }); const p = await c.newPage(); p.setDefaultTimeout(3000);
const errs = []; p.on('pageerror', (e) => errs.push(e.message));
const S = () => p.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), KEY);
await p.goto(srv.base + '#/profil'); await p.waitForSelector('main h1');
const num = (l) => p.getByLabel(l, { exact: true }).first();
const dump = async (m) => { const r = await p.evaluate(() => ({ bad: (document.body.innerText.match(/\b(NaN|undefined|Infinity|null)\b/g) || []).length, sw: document.documentElement.scrollWidth > innerWidth })); ok(r.bad === 0 && !r.sw, 'UI bersih: ' + m, r); };
for (const v of ['-3', 'abc', '1e9', '99999999999', '2.7', '', '  5  ', '1e2', '0x10', '٣']) {
  await num('Dewasa').fill(v).catch(async () => { await num('Dewasa').evaluate((el, x) => { el.value = x; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }, v); });
  await num('Dewasa').blur(); await p.click('button:has-text("Simpan")').catch(() => {}); await p.waitForTimeout(250);
  const val = await num('Dewasa').inputValue(); const s = await S();
  console.log(`   profil Dewasa input=${JSON.stringify(v)} -> field=${JSON.stringify(val)} state=${JSON.stringify(s && s.profile && s.profile.counts && s.profile.counts.adult)}`);
  await dump('profil dewasa=' + v);
}
// reset ke 2 dewasa & uji target custom
await num('Dewasa').fill('2'); await p.click('button:has-text("Simpan")').catch(() => {}); await p.waitForTimeout(200);
await p.goto(srv.base + '#/target'); await p.waitForSelector('main h1');
const custom = p.locator('input[type=number]').first();
console.log('   target: ada input number custom?', await custom.count());
const radios = await p.locator('input[type=radio]').evaluateAll((els) => els.map((e) => e.value + ':' + (e.closest('label') || {}).innerText));
console.log('   radios', radios.join(' | ').slice(0, 300));
await p.locator('input[type=radio]').last().check().catch(() => {});
for (const v of ['90', '0', '-1', '1000', '365', '366']) {
  const inp = p.locator('input[type=number]').first(); await inp.fill(v).catch(() => {}); await inp.blur(); await p.waitForTimeout(150);
  const s = await S(); console.log(`   target custom input=${v} -> state.target=${JSON.stringify(s.target)} profile.target_days=${s.profile && s.profile.target_days} field=${await inp.inputValue()}`);
  await dump('target ' + v);
}
// inventaris air
await p.goto(srv.base + '#/inventaris/water'); await p.waitForSelector('main h1');
const water = p.getByLabel(/Dimiliki \(L\)/).first();
for (const v of ['-50', '1e9', '1e30', '99999999999999999999', '12.5', '', '5000', '99999']) {
  await water.fill(v).catch(() => {}); await water.blur(); await p.waitForTimeout(150);
  const s = await S(); console.log(`   air input=${JSON.stringify(v)} -> field=${JSON.stringify(await water.inputValue())} state.inv.water_drinking=${JSON.stringify(s.inventory && s.inventory.water_drinking)}`);
  await dump('air ' + v);
}
await p.goto(srv.base + '#/hasil'); await p.waitForSelector('main h1'); await p.waitForTimeout(300);
console.log('   hasil:', (await p.innerText('main')).replace(/\n+/g, ' | ').slice(0, 420));
ok(errs.length === 0, 'tanpa pageerror', errs);
console.log('FAILS', fails());
await browser.close(); srv.close();
