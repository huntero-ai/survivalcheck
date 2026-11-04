// QA bagian 4: keluaran UI (#/hasil) vs perhitungan manual untuk tier 2 / 4 / 5 dan band tas/indikator.
import { chromium, serve, reporter, baseState } from './lib.mjs';
const { ok, fails } = reporter();
const srv = await serve(); const browser = await chromium.launch();
const APPL = Array.from({ length: 28 }, (_, i) => i + 1).filter((x) => ![4, 27, 28].includes(x));
const bag = (k) => Object.fromEntries(APPL.slice(0, k).map((x) => [x, true]));
const ind = (sum) => { const o = {}; let left = sum; for (let i = 1; i <= 18; i++) { o['ind_' + String(i).padStart(2, '0')] = Math.min(2, left); left -= Math.min(2, left); } return o; };
const T3 = { water_drinking: 42, food_rice: { qty: 9 }, toilet_bags: 70, flashlight: 1, spare_batteries: 1, gobag_main: 1, power_bank: 1, radio_portable: 1, emergency_numbers_printed: 1, doc_copy_ktp: 1, doc_copy_kk: 1, doc_copy_property: 1, doc_copy_bank: 1, doc_waterproof_bag: 1, cash_days: 7 };
const T4 = { ...T3, water_drinking: 84, food_rice: { qty: 18 }, toilet_bags: 140, water_treatment_chemical: 1, fuel_lpg: 14, family_emergency_plan: 1 };
const mk = (inv, b, i, td, lang = 'id') => baseState({ profile: { ...baseState().profile, counts: { infant: 0, toddler: 0, child: 0, adult: 2, elderly: 0 }, target_days: td }, target: { days: td }, inventory: inv, bag_checklist: bag(b), indicators: ind(i), settings: { ...baseState().settings, lang } });
async function text(state) { const c = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1 }); await c.addInitScript(([k, s]) => { if (!window.name.includes('s')) { localStorage.setItem(k, s); window.name = 's'; } }, ['survivalcheck.v1', JSON.stringify(state)]); const p = await c.newPage(); await p.goto(srv.base + '#/hasil'); await p.reload(); await p.waitForSelector('main h1'); await p.waitForTimeout(400); const t = await p.innerText('main'); await p.screenshot({ path: '/tmp/qa-shots/calc-' + Math.random().toString(36).slice(2, 6) + '.png' }); await c.close(); return t.replace(/\n+/g, ' | '); }
let t = await text(mk(T4, 21, 25, 14)); console.log(t.slice(0, 900));
ok(/Tier 4 dari 5/.test(t) && /14 hari/.test(t), 'UI tier 4, bertahan 14 hari');
t = await text(mk(T4, 21, 24, 14)); ok(/Tier 3 dari 5/.test(t), 'UI indikator 24 -> tier 3 (skor tidak menaikkan)', t.slice(0, 200));
t = await text(mk(T3, 20, 13, 7)); ok(/Tier 1 dari 5/.test(t) && /(PERLU DILENGKAPI)/i.test(t), 'UI tas 20/25=80% -> PERLU DILENGKAPI & tier 1', t.slice(0, 500));
t = await text(mk(T3, 21, 13, 7)); ok(/Tier 3 dari 5/.test(t) && /\b84\b/.test(t), 'UI tas 84% tier 3', t.slice(0, 500));
for (const [i, band] of [[12, /Rawan/i], [13, /Cukup Siaga/i], [24, /Cukup Siaga/i], [25, /\bSiap\b/]]) { t = await text(mk(T3, 21, i, 7)); const m = t.match(/Evaluasi keluarga[^|]*\|[^|]*\|[^|]*\|[^|]*/i); ok(band.test(m ? m[0] : t), 'UI band indikator ' + i, m && m[0]); }
console.log('FAILS', fails()); await browser.close(); srv.close();
