// QA bagian 4: hitung manual (angka di-hardcode dari kalkulasi tangan atas rules.json/items.json) vs engine.evaluate.
// Jalankan: node tests/qa/t4_calc.mjs
import { readFileSync } from 'node:fs';
import { evaluate } from '../../src/engine.js';
const load = (p) => JSON.parse(readFileSync(new URL('../../' + p, import.meta.url), 'utf8'));
const data = { items: load('data/items.json'), rules: load('data/rules.json'), power: load('data/power.json'), indicators: load('data/bnpb_family_indicators.json') };
let fails = 0, n = 0;
const eq = (a, b, m, tol = 0.011) => { n++; const good = typeof b === 'number' ? Math.abs(a - b) <= tol : JSON.stringify(a) === JSON.stringify(b); console.log((good ? 'PASS ' : 'FAIL ') + m + ' | app=' + JSON.stringify(a) + ' manual=' + JSON.stringify(b)); if (!good) fails++; };
const APPL = Array.from({ length: 28 }, (_, i) => i + 1).filter((x) => ![4, 27, 28].includes(x)); // berlaku utk dewasa saja (25)
const bag = (k, list = APPL) => Object.fromEntries(list.slice(0, k).map((x) => [x, true])); // k nomor berlaku pertama "ya"
const ind = (sum) => { const o = {}; let left = sum; for (let i = 1; i <= 18; i++) { const v = Math.min(2, left); o['ind_' + String(i).padStart(2, '0')] = v; left -= v; } return o; };
const P = (counts, extra = {}) => ({ counts: { infant: 0, toddler: 0, child: 0, adult: 0, elderly: 0, ...counts }, pregnant: 0, breastfeeding: 0, infant_feeding: 'formula', pets: { dog: 0, cat: 0 }, meds: [], has_electric_medical: false, usage_per_day: {}, scenarios: [], target_days: 7, ...extra });
const ev = (profile, inventory = {}, o = {}) => evaluate({ profile, inventory, bag_checklist: o.bag || {}, indicators: o.ind || {}, scenarios: profile.scenarios, target: { days: profile.target_days }, power: o.power }, data);
// Tier 2 basis untuk 1 dewasa (tanpa bayi/lansia): tas yang berlaku = 28 - {4,27,28} = 25; 21/25 = 84% > 80; 20/25 = 80% (tepat) -> perlu dilengkapi.
const T2 = { water_drinking: 9, food_rice: { qty: 2 }, toilet_bags: 15, flashlight: 1, spare_batteries: 1, gobag_main: 1 };
// Hitung manual: air 3*1*3=9 L; kkal 2230*3=6690, beras 359*2000/100=7180 >= 6690; toilet 5*1*3=15.

console.log('== S1: 1 dewasa, target 3, stok tier-2 pas ==');
let r = ev(P({ adult: 1 }, { target_days: 3 }), T2, { bag: { ...bag(21) }, ind: ind(13) });
eq(r.household.daily_kcal, 2230, 'S1 kkal harian 2230');
eq(r.survival.components.water, 3, 'S1 hari air = 9/3 = 3');
eq(r.survival.components.food, 7180 / 2230, 'S1 hari pangan = 7180/2230 = 3.22');
eq(r.survival.days, 3, 'S1 hari bertahan 3'); eq(r.survival.bottleneck, 'water', 'S1 bottleneck air');
eq(r.bag.applicable, 25, 'S1 tas berlaku 25'); eq(r.bag.pct, 84, 'S1 tas 21/25 = 84%'); eq(r.bag.band, 'siap', 'S1 band tas siap');
eq(r.tier.value, 2, 'S1 tier 2');
console.log('== S1b: tas tepat 80% (20/25) -> PERLU DILENGKAPI -> tier 1 ==');
r = ev(P({ adult: 1 }, { target_days: 3 }), T2, { bag: bag(20), ind: ind(13) });
eq(r.bag.pct, 80, 'S1b pct 80'); eq(r.bag.band, 'perlu_dilengkapi', 'S1b band perlu_dilengkapi'); eq(r.tier.value, 1, 'S1b tier 1 (tas tepat 80% belum >80)');
console.log('== S1c: indikator keluarga 12/13/24/25 ==');
for (const [s, band, tier] of [[12, 'rawan', 1], [13, 'cukup_siaga', 2], [24, 'cukup_siaga', 2], [25, 'siap', 2]]) { r = ev(P({ adult: 1 }, { target_days: 3 }), T2, { bag: bag(21), ind: ind(s) }); eq(r.family.total, s, 'S1c total ' + s); eq(r.family.band, band, 'S1c band untuk ' + s); eq(r.tier.value, tier, 'S1c tier untuk indikator ' + s); }
console.log('== S1d: bag 50% / 49% ==');
r = ev(P({ adult: 1 }, { target_days: 3 }), T2, { bag: bag(12) }); // 12/25 = 48% -> belum siap
eq(r.bag.band, 'belum_siap', 'S1d 12/25=48% belum_siap'); r = ev(P({ adult: 1 }), T2, { bag: bag(13) }); eq(r.bag.band, 'perlu_dilengkapi', 'S1d 13/25=52% perlu_dilengkapi');
// tepat 50%: 7/14? gunakan 2 orang tak mengubah; pakai bayi (applicable 28 -> 14/28 = 50%)
r = ev(P({ adult: 1, infant: 1 }, { target_days: 3 }), T2, { bag: bag(13.5 | 0, Array.from({ length: 27 }, (_, i) => i + 1)) }); eq(r.bag.applicable, 27, 'S1d tas berlaku dgn bayi = 27 (kecuali #28 lansia)'); eq(r.bag.pct, 48.15, 'S1d 13/27 = 48.15%');
r = ev(P({ adult: 2, infant: 1, elderly: 1 }, { target_days: 3 }), T2, { bag: bag(14, Array.from({ length: 28 }, (_, i) => i + 1)) }); eq(r.bag.pct, 50, 'S1d 14/28 tepat 50%'); eq(r.bag.band, 'perlu_dilengkapi', 'S1d tepat 50% = perlu_dilengkapi');

console.log('== S2: tier 3 (2 dewasa, 7 hari) ==');
const T3 = { water_drinking: 42, food_rice: { qty: 9 }, toilet_bags: 70, flashlight: 1, spare_batteries: 1, gobag_main: 1, power_bank: 1, radio_portable: 1, emergency_numbers_printed: 1, doc_copy_ktp: 1, doc_copy_kk: 1, doc_copy_property: 1, doc_copy_bank: 1, doc_waterproof_bag: 1, cash_days: 7 };
r = ev(P({ adult: 2 }, { target_days: 7 }), T3, { bag: bag(21), ind: ind(13) });
eq(r.household.daily_kcal, 4460, 'S2 kkal 4460'); eq(r.food.total_kcal, 32310, 'S2 total kkal 9kg beras = 32310');
eq(r.survival.components.water, 7, 'S2 air 42/6 = 7'); eq(r.survival.components.food, 32310 / 4460, 'S2 pangan 7.24');
eq(r.tier.value, 3, 'S2 tier 3');
r = ev(P({ adult: 2 }, { target_days: 7 }), { ...T3, cash_days: 6 }, { bag: bag(21), ind: ind(13) }); eq(r.tier.value, 2, 'S2b tunai 6 hari (<7) -> tier 2');
r = ev(P({ adult: 2 }, { target_days: 7 }), { ...T3, radio_portable: 0 }, { bag: bag(21), ind: ind(13) }); eq(r.tier.value, 2, 'S2c tanpa radio -> tier 2');

console.log('== S3: tier 4 (belum dicakup tes S2) ==');
const T4 = { ...T3, water_drinking: 84, food_rice: { qty: 18 }, toilet_bags: 140, water_treatment_chemical: 1, fuel_lpg: 14, family_emergency_plan: 1 };
// manual: air 3*2*14=84; kkal 4460*14=62440, beras 18kg=64620; toilet 5*2*14=140; bahan bakar masak (D-047): salah satu dari gas kaleng/LPG 3 kg/kompor alternatif >= 14 hari.
let r4 = ev(P({ adult: 2 }, { target_days: 14 }), T4, { bag: bag(21), ind: ind(25) });
eq(r4.tier.value, 4, 'S3 tier 4'); eq(r4.survival.days, 14, 'S3 hari bertahan 14'); eq(r4.tier_checks['4'], true, 'S3 tier_checks[4]');
r = ev(P({ adult: 2 }, { target_days: 14 }), T4, { bag: bag(21), ind: ind(24) }); eq(r.tier.value, 3, 'S3b indikator 24 (<25) -> tier 3 walau semua stok tier 4');
r = ev(P({ adult: 2 }, { target_days: 14 }), { ...T4, fuel_lpg: 0 }, { bag: bag(21), ind: ind(25) }); eq(r.tier.value, 3, 'S3c tanpa bahan bakar masak -> tier 3');
r = ev(P({ adult: 2 }, { target_days: 14 }), { ...T4, fuel_lpg: 13 }, { bag: bag(21), ind: ind(25) }); eq(r.tier.value, 3, 'S3d bahan bakar 13 < 14 hari -> tier 3');
r = ev(P({ adult: 2 }, { target_days: 14 }), { ...T4, family_emergency_plan: 0 }, { bag: bag(21), ind: ind(25) }); eq(r.tier.value, 3, 'S3e tanpa rencana keluarga -> tier 3');
r = ev(P({ adult: 2 }, { target_days: 14 }), { ...T4, water_treatment_chemical: 0 }, { bag: bag(21), ind: ind(25) }); eq(r.tier.value, 3, 'S3f tanpa penjernih -> tier 3');
r = ev(P({ adult: 2 }, { target_days: 14, meds: [{ label: 'a', doses_per_day: 1, stock_days: 13 }] }), { ...T4, elderly_meds: 0 }, { bag: bag(21), ind: ind(25) }); eq(r.tier.value, 3, 'S3g obat 13 hari (<14) -> tier 4 tertahan, tier 3');
console.log('   S3g tier aktual =', r.tier.value, 'tier_checks', JSON.stringify(r.tier_checks));
r = ev(P({ adult: 2 }, { target_days: 14, meds: [{ label: 'a', doses_per_day: 1, stock_days: 14 }] }), T4, { bag: bag(21), ind: ind(25) }); eq(r.tier.value, 4, 'S3h obat 14 hari -> tier 4');
r = ev(P({ adult: 2 }, { target_days: 14, meds: [{ label: 'a', doses_per_day: 1, stock_days: 7 }] }), T4, { bag: bag(21), ind: ind(25) }); eq(r.tier.value, 3, 'S3i obat 7 hari -> tier 3 (butuh 14 utk tier 4)');
r = ev(P({ adult: 2 }, { target_days: 14, meds: [{ label: 'a', doses_per_day: 1, stock_days: 6 }] }), T4, { bag: bag(21), ind: ind(25) }); eq(r.tier.value, 1, 'S3j obat 6 hari (<7) -> tier 1 (tahan tier 2) bila hari bertahan >=1');

console.log('== S4: tier 5 + skor tak menaikkan tier ==');
const T5 = { water_drinking: 90, food_rice: { qty: 19 }, toilet_bags: 150, flashlight: 1, spare_batteries: 1, gobag_main: 1, power_bank: 1, radio_portable: 1, emergency_numbers_printed: 1, doc_copy_ktp: 1, doc_copy_kk: 1, doc_copy_property: 1, doc_copy_bank: 1, doc_waterproof_bag: 1, cash_days: 7, water_treatment_chemical: 1, fuel_lpg: 30, family_emergency_plan: 1, solar_panel: 1, first_aid_knowledge: 1 };
// manual: air 3*30=90; kkal 2230*30=66900, beras 19kg=68210; bahan bakar masak 30 hari
let r5 = ev(P({ adult: 1 }, { target_days: 30 }), T5, { bag: bag(21), ind: ind(25) });
eq(r5.tier.value, 5, 'S4 tier 5'); eq(r5.survival.days, 30, 'S4 hari 30');
r = ev(P({ adult: 1 }, { target_days: 30 }), { ...T5, solar_panel: 0 }, { bag: bag(21), ind: ind(25) }); eq(r.tier.value, 4, 'S4b tanpa daya alternatif -> tier 4');
r = ev(P({ adult: 1 }, { target_days: 30 }), { ...T5, solar_panel: 0, generator: 1 }, { bag: bag(21), ind: ind(25) }); eq(r.tier.value, 5, 'S4c generator menggantikan -> tier 5');
r = ev(P({ adult: 1 }, { target_days: 30 }), { ...T5, first_aid_knowledge: 0 }, { bag: bag(21), ind: ind(25) }); eq(r.tier.value, 4, 'S4d tanpa pengetahuan P3K -> tier 4');
r = ev(P({ adult: 1 }, { target_days: 30, meds: [{ label: 'a', doses_per_day: 1, stock_days: 29 }] }), T5, { bag: bag(21), ind: ind(25) }); eq(r.tier.value, 4, 'S4e obat 29 hari -> tier 4');
// skor: tas penuh + indikator penuh + semua kritis penuh, tapi tanpa item tier-2 -> skor tinggi namun tier rendah
r = ev(P({ adult: 1 }, { target_days: 3 }), { water_drinking: 9, food_rice: { qty: 2 }, toilet_bags: 15, flashlight: 1, spare_batteries: 1 /* tanpa gobag_main */ }, { bag: bag(25), ind: ind(36) });
console.log('   skor tinggi tanpa gobag_main: skor', r.score.total, 'tier', r.tier.value, 'tas', r.bag.pct);
eq(r.tier.value <= 1, true, 'S4f skor tinggi tidak menaikkan tier (gobag_main kosong -> tier<=1)');

console.log('== S5: skor manual (1 dewasa, target 3, air 6 L saja) ==');
// kritis berlaku: water_drinking, food_kcal_total, toilet_bags, flashlight, spare_batteries, gobag_main = 6 item. coverage: air 6/9=0.6667, lainnya 0.
// critical = 55*(0.6667/6)=6.111; tas 0; family 0; skenario tak berlaku -> bobot 90 -> total = 6.111*100/90 = 6.79 -> 7
r = ev(P({ adult: 1 }, { target_days: 3 }), { water_drinking: 6 }, {});
eq(r.score.components.critical_stock, 6.11, 'S5 komponen kritis 6.11'); eq(r.score.weight_sum, 90, 'S5 bobot 90'); eq(r.score.total_exact, 6.79, 'S5 total_exact 6.79'); eq(r.score.total, 7, 'S5 skor 7');
eq(r.survival.components.water, 2, 'S5 air 6/3 = 2 hari'); eq(r.tier.value, 0, 'S5 tier 0 (pangan 0 -> <1 hari)');

console.log('== S6: bayi + balita + hamil/menyusui + lansia, kkal ==');
r = ev(P({ infant: 1, toddler: 1, child: 1, adult: 1, elderly: 1 }, { pregnant: 1, breastfeeding: 1, target_days: 5, usage_per_day: { infant_formula: 5, infant_mpasi: 2, infant_diapers: 8 } }), { water_drinking: 30, infant_formula: 25, infant_mpasi: 10, infant_diapers: 40 });
// manual kkal: bayi 0 + balita 1430 + anak 2000 + dewasa 2230 + lansia 1890 = 7550 + 285 + 500 = 8335
eq(r.household.daily_kcal, 8335, 'S6 kkal = 7550+285+500'); eq(r.survival.components.water, 30 / 15, 'S6 air 30/(3*5)=2');
eq(r.survival.components.infant_food, 5, 'S6 makanan bayi min(25/5, 10/2)=5');
eq(r.items_eval.water_hygiene && r.items_eval.water_hygiene.need, 2 * 5 * 5, 'S6 air kebersihan 2*5*5=50');
eq(r.items_eval.toilet_bags.need, 5 * 5 * 5, 'S6 toilet 5*5*5=125');
eq(r.bag.applicable, 28, 'S6 tas berlaku 28 (bayi+lansia)');

console.log('== S7: hewan, target 3 -> min 5 hari ==');
r = ev(P({ adult: 1 }, { pets: { dog: 2, cat: 1 }, target_days: 3, usage_per_day: { pet_food: 400 } }), { water_pet_dog: 10, water_pet_cat: 5, pet_food: 2000 });
eq(r.items_eval.water_pet_dog.need, 4 * 2 * 5, 'S7 air anjing 4*2*5=40'); eq(r.items_eval.water_pet_cat.need, 1 * 1 * 5, 'S7 air kucing 1*1*5=5'); eq(r.items_eval.pet_food.need, 2000, 'S7 pakan 400*5=2000');

console.log('== S8: kekeringan 4 L, pandemi 14 hari, konflik 7 ==');
r = ev(P({ adult: 2 }, { scenarios: ['drought'], target_days: 7 }), { water_drinking: 112 });
eq(r.household.water_l_per_person_day, 4, 'S8 air 4 L (kekeringan)'); eq(r.items_eval.water_drinking.need, 4 * 2 * 7, 'S8 butuh 56'); eq(r.survival.components.water, 112 / 8, 'S8 hari air 14');
r = ev(P({ adult: 2 }, { scenarios: ['pandemic'], target_days: 3 }), {}); eq(r.targets.effective_target_days, 14, 'S8 pandemi target efektif 14'); eq(r.targets.meds_target_days, 30, 'S8 obat 30 hari');
r = ev(P({ adult: 2 }, { scenarios: ['conflict', 'drought'], target_days: 3 }), {}); eq(r.targets.effective_target_days, 7, 'S8 konflik 7'); eq(r.targets.cash_target_days, 7, 'S8 tunai 7');
r = ev(P({ adult: 2 }, { scenarios: ['pandemic', 'conflict'], target_days: 3 }), {}); eq(r.targets.effective_target_days, 14, 'S8 pandemi+konflik = max 14');
console.log('== S9: obat & tier 2 gating ==');
r = ev(P({ adult: 1 }, { target_days: 3, meds: [{ label: 'a', doses_per_day: 1, stock_days: 6 }] }), T2, { bag: bag(21), ind: ind(13) }); eq(r.tier.value, 1, 'S9 obat 6 hari < 7 -> tier 1');
r = ev(P({ adult: 1 }, { target_days: 3, meds: [{ label: 'a', doses_per_day: 1, stock_days: 7 }] }), T2, { bag: bag(21), ind: ind(13) }); eq(r.tier.value, 2, 'S9b obat 7 hari -> tier 2');
r = ev(P({ adult: 1 }, { target_days: 3, meds: [{ label: 'a', doses_per_day: 1, stock_days: 7 }, { label: 'b', doses_per_day: 1, stock_days: 2 }] }), T2, { bag: bag(21), ind: ind(13) }); eq(r.survival.components.meds, 2, 'S9c obat terendah 2 hari = bottleneck');
console.log('== S10: bayi formula tanpa isian pemakaian -> needs_input ==');
r = ev(P({ adult: 1, infant: 1 }, { target_days: 3 }), T2, { bag: bag(21), ind: ind(13) }); eq(r.tier.value <= 1, true, 'S10 pemakaian bayi kosong menahan tier 2'); console.log('   warnings', r.warnings);
console.log('== S11: listrik (power) ==');
r = ev(P({ adult: 1 }, { has_electric_medical: true, target_days: 3 }), T2, { power: { days_power_medical: 1.5 } }); eq(r.survival.components.power, 1.5, 'S11 daya medis 1.5 hari'); eq(r.survival.days, 1, 'S11 hari bertahan floor(1.5)=1');
console.log(`\nTotal ${n}, gagal ${fails}`);
