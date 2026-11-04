// QA bagian 2: fokus keyboard terlihat, urutan tab, skip link, ARIA.
import { chromium, serve, reporter, baseState, seed } from './lib.mjs';
const { ok, fails } = reporter();
const srv = await serve();
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 1 });
await seed(context, baseState({ scenarios: ['earthquake'], inventory: { water_drinking: 10 } }));
const page = await context.newPage();
for (const r of ['#/', '#/profil', '#/target', '#/inventaris/water', '#/daya', '#/keluarga', '#/hasil', '#/belanja', '#/pengaturan', '#/info']) {
  await page.goto(srv.base + r); await page.reload(); await page.waitForSelector('main h1'); await page.waitForTimeout(200);
  const seq = []; let noFocus = [];
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press('Tab');
    const f = await page.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
      const vis = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2) || (cs.boxShadow && cs.boxShadow !== 'none');
      return { t: e.tagName + (e.id ? '#' + e.id : ''), txt: (e.innerText || e.getAttribute('aria-label') || e.value || '').trim().slice(0, 25), vis, top: Math.round(r.top), left: Math.round(r.left), type: e.type, sr: !!e.closest('.sr-only') }; });
    if (!f) break;
    if (seq.length && seq[0].t === f.t && seq[0].txt === f.txt && i > 3) break;
    seq.push(f);
    if (!f.vis && !(f.type === 'radio' || f.type === 'checkbox')) noFocus.push(f);
  }
  // urutan tab ~ urutan visual (top naik, ignoring fixed nav/header): hitung inversi besar
  const body = seq.filter((s) => !s.sr);
  let inv = 0; for (let i = 1; i < body.length; i++) if (body[i].top + 400 < body[i - 1].top && body[i - 1].top < 3000) inv++;
  console.log(r, 'tab stops', seq.length, 'first:', seq.slice(0, 3).map((s) => s.txt || s.t).join(' | '));
  ok(noFocus.length === 0, 'fokus terlihat semua elemen ' + r, noFocus.slice(0, 4));
}
// radio/checkbox fokus: cek wrapper
await page.goto(srv.base + '#/target'); await page.reload(); await page.waitForSelector('main h1');
const rad = await page.evaluate(() => { const i = document.querySelector('input[type=radio]'); i.focus(); const cs = getComputedStyle(i); const r = i.getBoundingClientRect(); const l = i.closest('label'); const lcs = l && getComputedStyle(l); return { out: cs.outlineStyle + ' ' + cs.outlineWidth, w: r.width, h: r.height, op: cs.opacity, lbl: l && l.className }; });
console.log('radio focus', rad);
await page.keyboard.press('Tab'); // skip link check
await page.goto(srv.base + '#/'); await page.reload(); await page.waitForSelector('main h1');
const skip = await page.evaluate(() => ({ skip: !!document.querySelector('.skip-link'), live: !!document.getElementById('live'), liveAttr: (document.getElementById('live') || {}).getAttribute && document.getElementById('live').getAttribute('aria-live') }));
console.log('skip/live', skip);
await page.keyboard.press('Tab'); const first = await page.evaluate(() => document.activeElement.className + ' ' + document.activeElement.innerText);
console.log('first tab:', first);
console.log('FAILS', fails());
await browser.close(); srv.close();
