// Uji rumus listrik terhadap data/power.json test_cases (docs/power.md). Jalankan: node --test tests/
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as P from '../src/power.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pd = JSON.parse(readFileSync(join(root, 'data/power.json'), 'utf8'));
const tc = Object.fromEntries(pd.test_cases.map((c) => [c.id, c]));
const near = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} != ${b}`);

for (const id of ['tc1', 'tc2', 'tc3', 'tc4']) {
  test(`${id}: ${tc[id].title}`, () => {
    const c = tc[id];
    const sel = c.input.devices;
    const load = P.computeLoad(sel, pd);
    near(load.wh_day, c.intermediate.wh_day);
    near(P.whTotal(load.wh_day, c.input.days), c.intermediate.wh_total);
    near(load.concurrent_w, c.intermediate.concurrent_w);
    near(load.peak_w, c.intermediate.peak_w);
    const total = P.whTotal(load.wh_day, c.input.days);
    assert.equal(P.recommendedCapacityWh(total, pd), c.expected.recommended_capacity_wh);
    const out = P.minOutput(load, pd);
    assert.equal(out.min_continuous_w, c.expected.min_continuous_w);
    assert.equal(out.min_surge_w, c.expected.min_surge_w);
    if (c.inventory) {
      const st = P.storedEnergy({ power_station_wh: c.inventory.power_station_wh }, pd);
      near(st.stored_wh, c.intermediate.stored_wh);
      const dpm = P.daysPowerMedical(st.stored_wh, load.wh_day_med, 0);
      near(dpm, c.expected.days_power_medical);
    }
  });
}

test('tc5: panel surya 100 Wp', () => {
  const c = tc.tc5;
  const solar = P.solarWhDay(c.input.solar_wp, pd);
  near(solar, c.expected.solar_wh_day);
  assert.equal(P.daysPower(0, 74, solar), 'self_sufficient');
  const st = P.storedEnergy({ power_station_wh: 1000 }, pd);
  near(P.daysPower(st.stored_wh, 480, solar), 4.0);
  near(P.daysPowerMedical(st.stored_wh, 480, solar), c.expected.days_power_medical_with_station_1000wh);
});

test('tc6: power bank 20.000 mAh x 2', () => {
  const c = tc.tc6;
  const st = P.storedEnergy({ power_banks: c.input.power_banks.map((b) => ({ mah: b.mah, qty: b.qty })) }, pd);
  near(st.power_bank_nominal_wh, c.expected.nominal_wh);
  near(st.stored_wh, c.expected.usable_wh);
  near(P.daysPower(st.stored_wh, c.input.load_wh_day, 0), c.expected.days_power);
});

test('summarize: CPAP + station 1000 Wh = 1,5 hari medis; tanpa alat medis = null', () => {
  const s = P.summarize({ power_devices: { cpap: { qty: 1, hours: 8 } }, power_inventory: { power_station_wh: 1000 } }, pd, 7);
  near(s.days_power_medical, 1.5);
  assert.equal(s.recommended_capacity_wh, 5600);
  const s2 = P.summarize({ power_devices: { led_lamp: { qty: 1, hours: 6 } }, power_inventory: { power_station_wh: 1000 } }, pd, 3);
  assert.equal(s2.days_power_medical, null);
});

test('override watt dan perangkat sendiri', () => {
  const load = P.computeLoad({ phone_charging: { qty: 1, hours: 2, watts: 20 }, custom_1: { qty: 1, hours: 1, watts: 100, name: 'x' } }, pd);
  near(load.wh_day, 20 * 2 + 100);
  assert.equal(load.has_medical, false);
});

test('jam 0 = tidak menyala bersamaan; masukan kosong aman', () => {
  const load = P.computeLoad({ fan: { qty: 1, hours: 0 } }, pd);
  assert.equal(load.wh_day, 0);
  assert.equal(load.concurrent_w, 0);
  assert.equal(P.recommendedCapacityWh(0, pd), 0);
  const s = P.summarize({}, pd, 3);
  assert.equal(s.wh_day, 0);
  assert.equal(s.days_power, null);
});
