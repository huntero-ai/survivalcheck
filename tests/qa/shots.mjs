import { chromium, serve, baseState, seed } from './lib.mjs';
const srv = await serve(); const browser = await chromium.launch();
const st = baseState({ scenarios: ['earthquake', 'tsunami', 'conflict', 'power_outage'], profile: { ...baseState().profile, counts: { infant: 1, toddler: 1, child: 1, adult: 2, elderly: 1 }, pets: { dog: 1, cat: 1 }, has_electric_medical: true, meds: [{ label: 'Obat jantung', doses_per_day: 2, stock_days: 4 }] }, inventory: { water_drinking: 60, flashlight: 1 } });
for (const [w, h, name, route, theme] of [[320, 568, 'belanja320', '#/belanja', 'light'], [360, 640, 'hasil_full', '#/hasil', 'dark'], [360, 640, 'daya', '#/daya', 'light'], [412, 915, 'panduan', '#/info/panduan/tsunami', 'light'], [360, 640, 'sumber', '#/info/sumber', 'light']]) {
  const c = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, colorScheme: theme }); await seed(c, st); const p = await c.newPage();
  await p.goto(srv.base + route); await p.reload(); await p.waitForSelector('main h1'); await p.waitForTimeout(300);
  await p.screenshot({ path: `/tmp/qa-shots/s_${name}.png`, fullPage: name === 'belanja320' ? false : false });
  if (name === 'belanja320') { await p.evaluate(() => window.scrollTo(0, 700)); await p.screenshot({ path: '/tmp/qa-shots/s_belanja320b.png' }); }
  await c.close();
}
await browser.close(); srv.close();
