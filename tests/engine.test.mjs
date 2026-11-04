// Uji mesin hitung terhadap tests/cases.json (docs/scoring.md). Jalankan: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { evaluate } from '../src/engine.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const load = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const data = { items: load('data/items.json'), rules: load('data/rules.json'), power: load('data/power.json'), indicators: load('data/bnpb_family_indicators.json') };
const cases = load('tests/cases.json');
const TOL = 0.01;

function same(actual, expected, path) {
  if (typeof expected === 'number') {
    assert.equal(typeof actual, 'number', `${path}: bukan angka (${JSON.stringify(actual)})`);
    // bilangan bulat persis, desimal toleransi 0,01
    if (Number.isInteger(expected) && !path.match(/(need|have|days_exact|food|water|power|meds|infant_food|total_exact|pct|current_pct|critical_stock|bag|family|scenario|coverage|total_kcal)/)) {
      assert.equal(actual, expected, `${path}: ${actual} != ${expected}`);
    } else {
      assert.ok(Math.abs(actual - expected) <= TOL, `${path}: ${actual} != ${expected}`);
    }
  } else if (Array.isArray(expected)) {
    assert.ok(Array.isArray(actual), `${path}: bukan array`);
    assert.equal(actual.length, expected.length, `${path}: panjang ${actual.length} != ${expected.length} (${JSON.stringify(actual)})`);
    expected.forEach((e, i) => same(actual[i], e, `${path}[${i}]`));
  } else if (expected && typeof expected === 'object') {
    assert.ok(actual && typeof actual === 'object', `${path}: bukan objek`);
    for (const k of Object.keys(expected)) same(actual[k], expected[k], `${path}.${k}`);
  } else {
    assert.equal(actual, expected, `${path}: ${JSON.stringify(actual)} != ${JSON.stringify(expected)}`);
  }
}

function check(c) {
  const { profile, inventory, indicators, bag_checklist, power } = c.input;
  const r = evaluate({ profile, inventory, indicators, bag_checklist, power }, data);
  const e = c.expected;
  if (e.status === 'invalid') {
    assert.equal(r.status, 'invalid');
    assert.deepEqual(r.errors, e.errors);
    return;
  }
  assert.equal(r.status, 'ok');
  for (const [k, v] of Object.entries(e)) {
    switch (k) {
      case 'food_total_kcal': same(r.food.total_kcal, v, k); break;
      case 'tier': {
        same(r.tier.value, v.value, 'tier.value');
        if (v.next_tier !== undefined) assert.equal(r.tier.next_tier, v.next_tier, 'tier.next_tier');
        if (v.checks_2_to_5) assert.deepEqual(r.tier_checks, v.checks_2_to_5, 'tier_checks');
        break;
      }
      case 'to_next_tier': {
        if (v === null) assert.equal(r.to_next_tier, null);
        else same(r.to_next_tier, v, 'to_next_tier');
        break;
      }
      case 'score': same(r.score, v, 'score'); break;
      case 'items_eval': {
        for (const id of Object.keys(v)) same(r.items_eval[id], v[id], `items_eval.${id}`);
        break;
      }
      case 'shortfall_head': {
        const head = r.shortfall.slice(0, v.length).map(({ id, unit, need, have, missing }) => ({ id, unit, need, have, missing }));
        same(head, v, 'shortfall_head');
        break;
      }
      case 'shortfall_count': assert.equal(r.shortfall_count, v, 'shortfall_count'); break;
      case 'warnings': assert.deepEqual(r.warnings, v, 'warnings'); break;
      case 'advisories': assert.deepEqual(r.advisories, v, 'advisories'); break;
      case 'category_progress': same(r.category_progress, v, 'category_progress'); break;
      case 'infant_formula_applicable': assert.equal(r.applicable_ids.includes('infant_formula'), v); break;
      case 'infant_mpasi_shortfall_status': assert.equal((r.shortfall.find((s) => s.id === 'infant_mpasi') || {}).status, v); break;
      default: same(r[k], v, k);
    }
  }
}

for (const c of [...cases.cases, ...cases.extra_cases]) {
  test(`${c.id}: ${c.title}`, () => check(c));
}

test('murni: evaluate tidak mengubah masukan dan hasilnya deterministik', () => {
  const c = cases.cases[1];
  const st = { profile: c.input.profile, inventory: c.input.inventory, indicators: c.input.indicators, bag_checklist: c.input.bag_checklist };
  const before = JSON.stringify([st, data.items.items.length, Object.keys(data.items.items[0])]);
  const a = evaluate(st, data);
  const b = evaluate(st, data);
  assert.deepEqual(a, b);
  assert.equal(JSON.stringify([st, data.items.items.length, Object.keys(data.items.items[0])]), before);
});

test('state.target & state.scenarios (bentuk penyimpanan aplikasi) setara dengan profile.target_days/scenarios', () => {
  const c = cases.cases.find((x) => x.id.startsWith('tc07'));
  const { profile, inventory, indicators, bag_checklist } = c.input;
  const { target_days, scenarios, ...rest } = profile;
  const a = evaluate({ profile, inventory, indicators, bag_checklist }, data);
  const b = evaluate({ profile: rest, target: { days: target_days }, scenarios, inventory, indicators, bag_checklist }, data);
  assert.deepEqual(a, b);
});

test('konsistensi rules.json dan items.json (air, kebersihan)', () => {
  const it = (id) => data.items.items.find((x) => x.id === id);
  assert.equal(it('water_drinking').per_person_day, data.rules.water.drinking_l_per_person_day);
  assert.equal(it('water_hygiene').per_person_day, data.rules.water.hygiene_l_per_person_day);
});

test('daya medis dihitung dari power_devices/power_inventory bila state.power tak ada', () => {
  const c = cases.cases.find((x) => x.id.startsWith('tc05'));
  const { profile, inventory, indicators, bag_checklist } = c.input;
  const r = evaluate({
    profile, inventory, indicators, bag_checklist,
    power_devices: { cpap: { qty: 1, hours: 8 } },
    power_inventory: { power_station_wh: 2000 },
  }, data);
  assert.equal(r.survival.components.power, 3);
  assert.equal(r.survival.bottleneck, 'power');
});
