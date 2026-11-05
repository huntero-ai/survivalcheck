// Uji regresi perbaikan QA (docs/qa-report.md, bagian Status perbaikan). Jalankan: node --test
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { evaluate } from '../src/engine.js';
import { parseImport } from '../src/storage.js';
import { buildShoppingList, toPlainText } from '../src/shopping.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const load = (p) => JSON.parse(read(p));
const data = { items: load('data/items.json'), rules: load('data/rules.json'), power: load('data/power.json'), indicators: load('data/bnpb_family_indicators.json'), buy: load('data/sources-to-buy.json') };
const id = load('i18n/id.json');
const en = load('i18n/en.json');
const item = (i) => data.items.items.find((x) => x.id === i);
const get = (o, k) => k.split('.').reduce((a, p) => (a == null ? a : a[p]), o);

// --- B-02 / D-047: bahan bakar masak ---
const FUEL = ['fuel_canister', 'fuel_lpg', 'fuel_alt_stove'];
const ind = Object.fromEntries(Array.from({ length: 18 }, (_, i) => ['ind_' + String(i + 1).padStart(2, '0'), 2]));
const bag = Object.fromEntries(Array.from({ length: 28 }, (_, i) => [String(i + 1), true]));
// 2 dewasa, 14 hari; semua syarat tier 4 terpenuhi kecuali bahan bakar masak (nilai diatur per kasus)
function tier4State(fuel) {
  return {
    profile: { counts: { infant: 0, toddler: 0, child: 0, adult: 2, elderly: 0 }, target_days: 14, infant_feeding: 'formula' },
    inventory: {
      water_drinking: 84, water_hygiene: 56, food_rice: { qty: 18 }, toilet_bags: 140, flashlight: 1, spare_batteries: 1, gobag_main: 1,
      power_bank: true, radio_portable: 1, emergency_numbers_printed: true, doc_copy_ktp: true, doc_copy_kk: true, doc_copy_property: true, doc_copy_bank: true,
      doc_waterproof_bag: 1, cash_days: 7, water_treatment_chemical: true, family_emergency_plan: true, ...fuel,
    },
    indicators: ind, bag_checklist: bag,
  };
}
const ev = (st) => evaluate(st, data);

test('D-047: item bahan bakar masak berbentuk grup cooking_fuel_any (hari), gas_canister lama tidak ada', () => {
  assert.equal(item('gas_canister'), undefined);
  assert.equal(item('lpg_usage'), undefined);
  for (const f of FUEL) {
    const it = item(f);
    assert.equal(it.gating_group, 'cooking_fuel_any');
    assert.equal(it.qty_mode, 'fuel_days');
    assert.equal(it.unit, 'hari');
    assert.equal(it.min_tier_gating, 4);
    assert.equal(it.per_person_day, null);
  }
  assert.equal(item('stove_portable').gating, false);
  assert.equal(item('fuel_canister').suggest_per_person_week, 6);
});

test('D-047: tanpa bahan bakar -> tier 3, syarat naik berupa group_any dengan hari', () => {
  const r = ev(tier4State({}));
  assert.equal(r.tier.value, 3);
  const g = r.to_next_tier.requirements.find((x) => x.kind === 'group_any');
  assert.deepEqual(g, { kind: 'group_any', group: 'cooking_fuel_any', ids: FUEL, missing: 14, unit: 'hari', days: 14 });
});

test('D-047: salah satu dari gas kaleng / LPG 3 kg / kompor alternatif selama 14 hari -> tier 4', () => {
  for (const f of FUEL) {
    const r = ev(tier4State({ [f]: 14 }));
    assert.equal(r.tier.value, 4, f);
    assert.equal(r.tier_checks['4'], true);
  }
});

test('D-047: kurang dari 14 hari belum cukup; hari tidak dijumlah antar anggota grup', () => {
  assert.equal(ev(tier4State({ fuel_lpg: 13 })).tier.value, 3);
  const r = ev(tier4State({ fuel_canister: 7, fuel_lpg: 7 }));
  assert.equal(r.tier.value, 3);
  assert.equal(r.to_next_tier.requirements.find((x) => x.kind === 'group_any').missing, 7);
});

test('D-047: tidak bergantung jumlah orang (tak ada 0,8571 tabung/orang/hari)', () => {
  const st = tier4State({ fuel_lpg: 14 });
  st.profile.counts.adult = 8;
  const base = ev(tier4State({ fuel_lpg: 14 }));
  const big = ev({ ...st, inventory: { ...st.inventory, water_drinking: 336, food_rice: { qty: 72 }, toilet_bags: 560, water_hygiene: 224 } });
  assert.equal(base.tier.value, 4);
  assert.equal(big.tier.value, 4);
});

test('D-047: tier 5 butuh 30 hari bahan bakar', () => {
  const st = (d) => {
    const s = tier4State({ fuel_alt_stove: d });
    s.profile.counts.adult = 1; s.profile.target_days = 30;
    Object.assign(s.inventory, { water_drinking: 90, water_hygiene: 60, food_rice: { qty: 19 }, toilet_bags: 150, generator: true, first_aid_knowledge: true, meds_personal: undefined });
    return s;
  };
  assert.equal(ev(st(29)).tier.value, 4);
  assert.equal(ev(st(30)).tier.value, 5);
});

test('D-047: kekurangan bahan bakar hanya satu baris (wakil grup) dan hilang bila salah satu cukup', () => {
  const r = ev(tier4State({}));
  const rows = r.shortfall.filter((s) => FUEL.includes(s.id));
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0].group_ids, FUEL);
  assert.equal(rows[0].unit, 'hari');
  const r2 = ev(tier4State({ fuel_lpg: 14 }));
  assert.equal(r2.shortfall.filter((s) => FUEL.includes(s.id)).length, 0);
  for (const f of FUEL) assert.equal(r2.items_eval[f].coverage, 1);
});

// --- B-18 ---
test('B-18: unit meds_personal dan medical_device_backup_power = "hari" di items.json, tanpa UNIT_OVERRIDE', () => {
  assert.equal(item('meds_personal').unit, 'hari');
  assert.equal(item('medical_device_backup_power').unit, 'hari');
  assert.ok(!/UNIT_OVERRIDE/.test(read('src/engine.js')));
});

// --- B-01 / B-06: belanja ---
const resultWithAll = () => ev({
  profile: { counts: { infant: 0, toddler: 0, child: 0, adult: 2, elderly: 0 }, pets: { dog: 1, cat: 1 }, target_days: 7, scenarios: ['power_outage', 'extreme_weather'] },
  inventory: {}, indicators: {}, bag_checklist: {},
});
test('B-01: item CUPLIKAN ditandai di daftar belanja (data + teks salin)', () => {
  const r = resultWithAll();
  const list = buildShoppingList(r, data, 'id');
  const all = list.groups.flatMap((g) => g.items);
  const dog = all.find((e) => e.id === 'water_pet_dog');
  assert.ok(dog && dog.excerpt === true);
  assert.equal(all.find((e) => e.id === 'water_drinking').excerpt, false);
  const t = (k) => get(id, k);
  const txt = toPlainText(list, t);
  assert.match(txt, /Air minum untuk anjing.*Dari kutipan sumber, perlu dicek ulang/);
});
test('B-06: item pengetahuan (satuan "-") tidak masuk daftar belanja', () => {
  const r = resultWithAll();
  assert.ok(r.shortfall.some((s) => s.id === 'fridge_food_safety_knowledge'), 'masih ada di hasil');
  const all = buildShoppingList(r, data, 'id').groups.flatMap((g) => g.items);
  assert.ok(!all.some((e) => item(e.id).unit === '-'));
  assert.ok(!all.some((e) => e.id === 'fridge_food_safety_knowledge'));
});

// --- B-05 ---
test('B-05: why tidak membocorkan catatan internal', () => {
  const bad = /verifikasi QA|QA to verify|snippet|cuplikan|Q1\b/i;
  for (const it of data.items.items) {
    for (const l of ['id', 'en']) assert.ok(!bad.test((it.why && it.why[l]) || ''), `${it.id}.${l}: ${it.why[l]}`);
  }
});

// --- B-09 ---
test('B-09: impor dengan state berupa array ditolak', () => {
  assert.throws(() => parseImport('{"app":"survivalcheck","schema":1,"state":[1]}'), /format/);
  assert.doesNotThrow(() => parseImport('{"app":"survivalcheck","schema":1,"state":{}}'));
});

// --- B-12 ---
test('B-12: results.js tidak memuat tests/cases.json', () => {
  assert.ok(!/cases\.json|fixtureResult/.test(read('src/results.js')));
});

// --- B-13 ---
test('B-13: panduan yodium lengkap dan kotak pemutih menyebut cek label (id+en)', () => {
  const i = get(id, 'info.water.iodine_body');
  assert.match(i, /5 tetes per liter/); assert.match(i, /10 tetes/); assert.match(i, /30 menit/); assert.match(i, /alergi yodium/);
  assert.match(get(id, 'info.water.bleach_body'), /[Cc]ek kadar di label/);
  const e = get(en, 'info.water.iodine_body');
  assert.match(e, /5 drops per liter/); assert.match(e, /10 drops/); assert.match(e, /30 minutes/); assert.match(e, /allergic to iodine/);
  assert.match(get(en, 'info.water.bleach_body'), /strength on the label/);
});

// --- B-15 ---
test('B-15: manifest tanpa orientation; index.html punya CSP yang mengizinkan SW dan gaya inline', () => {
  const mf = load('manifest.webmanifest');
  assert.equal(mf.orientation, undefined);
  const html = read('index.html');
  const m = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/);
  assert.ok(m, 'CSP meta ada');
  const csp = m[1];
  assert.match(csp, /script-src 'self'(;|$)/);
  assert.ok(!/script-src[^;]*unsafe/.test(csp));
  assert.match(csp, /style-src 'self'(;|$)/);
  assert.match(csp, /worker-src 'self'/);
  assert.match(csp, /connect-src 'self'/);
  assert.match(csp, /object-src 'none'/);
});

// --- B-16 ---
test('B-16: tier 0 tidak berkata "Belum mulai"', () => {
  assert.ok(!/Belum mulai/i.test(get(id, 'tiers.0.summary')));
  assert.ok(!/not started/i.test(get(en, 'tiers.0.summary')));
});

// --- B-17 / SW ---
test('B-17: workflow Pages cancel-in-progress false; SW cache versioned', () => {
  assert.match(read('.github/workflows/pages.yml'), /cancel-in-progress: false/);
  assert.match(read('sw.js'), /const CACHE = 'survivalcheck-v\d+'/);
});

// --- B-08 ---
test('B-08: contoh toko diberi label "hanya contoh, bukan rekomendasi"', () => {
  assert.match(get(id, 'stores.examples_label'), /hanya contoh, bukan rekomendasi/);
  assert.match(get(en, 'stores.examples_label'), /examples only, not a recommendation/);
});

// --- B-14 ---
test('B-14: catatan angka hati-hati untuk air 4 L ada di i18n', () => {
  assert.match(get(id, 'target.water_careful'), /Angka hati-hati/);
  assert.ok(get(en, 'target.water_careful'));
});

// --- i18n baru: kunci id = en ---
test('kunci i18n baru ada di id dan en', () => {
  for (const k of ['common.excerpt_badge', 'result.survive_over_year', 'result.shortfall_any_of', 'result.next_group_fuel', 'inventory.fuel_days_label', 'inventory.fuel_suggest']) {
    assert.ok(get(id, k) && get(en, k), k);
  }
});
