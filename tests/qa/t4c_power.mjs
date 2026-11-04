// QA bagian 4: listrik. Manual: CPAP 60 W x 8 j = 480 Wh/hari; station 1000 Wh x 0.8 x 0.9 = 720 Wh -> 1.5 hari. Surya 200 Wp x 4 x 0.75 = 600 Wh/hari > 480 -> mandiri.
import { readFileSync } from 'node:fs';
import * as pw from '../../src/power.js';
import { evaluate } from '../../src/engine.js';
const L = (p) => JSON.parse(readFileSync(new URL('../../' + p, import.meta.url), 'utf8'));
const data = { items: L('data/items.json'), rules: L('data/rules.json'), power: L('data/power.json'), indicators: L('data/bnpb_family_indicators.json') };
console.log('power.js exports:', Object.keys(pw).join(', '));
const base = { profile: { counts: { adult: 1 }, has_electric_medical: true, target_days: 3 }, inventory: {}, scenarios: [], power_devices: { cpap: { qty: 1, hours: 8, watts: 60 } } };
let n = 0, f = 0; const eq = (a, b, m) => { n++; const g = typeof a === 'number' ? Math.abs(a - b) < 0.011 : a === b; console.log((g ? 'PASS ' : 'FAIL ') + m + ' | app=' + a + ' manual=' + b); if (!g) f++; };
let r = evaluate({ ...base, power_inventory: { power_station_wh: 1000 } }, data);
eq(r.survival.components.power, 1.5, 'CPAP + station 1000 Wh = 1.5 hari');
r = evaluate({ ...base, power_inventory: { power_station_wh: 1000, solar_wp: 200, solar_sun_hours: 4 } }, data);
console.log('   dengan surya 200Wp: power comp =', r.survival.components.power, 'warnings', r.warnings);
r = evaluate({ ...base, power_inventory: { power_bank_mah: 20000, power_bank_qty: 2 } }, data);
// pb_wh = 20 Ah x 3.7 x 2 x 0.7 = 103.6 Wh ; /480 = 0.2158 hari
eq(r.survival.components.power, 103.6 / 480, 'power bank 2x20000 mAh = 103.6 Wh -> 0.216 hari'); eq(r.survival.days, 0, 'hari bertahan 0 (<1)'); eq(r.tier.value, 0, 'tier 0 karena daya medis < 1 hari');
r = evaluate({ ...base, power_inventory: { generator_w: 1000, generator_fuel_hours: 10 } }, data);
// gen_wh = 1000 x 10 x 0.5 = 5000 ; /480 = 10.4 hari
eq(r.survival.components.power, 5000 / 480, 'genset 1000 W x 10 jam x 0.5 = 5000 Wh -> 10.42 hari');
console.log(`Total ${n}, gagal ${f}`);
