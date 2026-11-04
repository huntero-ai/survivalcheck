import { chromium, serve, baseState, KEY } from './lib.mjs';
const srv = await serve(); const browser = await chromium.launch();
const c = await browser.newContext({ viewport: { width: 360, height: 740 } }); await c.addInitScript(([k, s]) => { if (!window.name.includes('s')) { localStorage.setItem(k, s); window.name = 's'; } }, [KEY, JSON.stringify(baseState())]);
const p = await c.newPage(); p.setDefaultTimeout(4000);
await p.goto(srv.base + '#/inventaris/water'); await p.waitForSelector('main h1');
const inp = p.getByLabel(/Dimiliki \(L\)/).first();
console.log('inputs:', await p.locator('main input').evaluateAll((e) => e.map((x) => x.id + ':' + x.type + ':' + (x.min || '') + '-' + (x.max || ''))).then((a) => a.slice(0, 8)));
for (const v of ['-50', '1e9', '99999999', '12.5', '', '5000', 'abc']) {
  await inp.click(); await p.keyboard.press('Control+A'); await p.keyboard.press('Delete'); if (v) await p.keyboard.type(v); await p.keyboard.press('Tab'); await p.waitForTimeout(250);
  const s = await p.evaluate((k) => JSON.parse(localStorage.getItem(k)).inventory, KEY);
  const err = await inp.evaluate((el) => { const e = document.getElementById(el.id + '-err'); return e ? e.textContent : '(no err el)'; });
  console.log(`air=${JSON.stringify(v)} -> inventory=${JSON.stringify(s)} invalid=${await inp.getAttribute('aria-invalid')} msg=${err}`);
}
await browser.close(); srv.close();
