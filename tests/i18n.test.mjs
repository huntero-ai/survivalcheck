import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const load = (l) => JSON.parse(readFileSync(new URL(`../i18n/${l}.json`, import.meta.url), 'utf8'));
function flat(o, p = '', out = {}) {
  for (const [k, v] of Object.entries(o)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, p + k + '.', out);
    else out[p + k] = v;
  }
  return out;
}
const id = flat(load('id'));
const en = flat(load('en'));

test('kunci id dan en identik', () => {
  const a = Object.keys(id), b = new Set(Object.keys(en));
  assert.deepEqual(a.filter((k) => !b.has(k)), [], 'ada di id, tidak di en');
  const sa = new Set(a);
  assert.deepEqual([...b].filter((k) => !sa.has(k)), [], 'ada di en, tidak di id');
});

test('array panduan sama panjang dan tanpa string kosong', () => {
  for (const k of Object.keys(id)) {
    if (Array.isArray(id[k])) { assert.ok(Array.isArray(en[k]), k); }
    if (Array.isArray(id[k]) && Array.isArray(en[k])) assert.equal(id[k].length, en[k].length, k);
  }
});

test('panduan 11 skenario lengkap', () => {
  for (const s of ['earthquake', 'tsunami', 'flood_landslide', 'eruption', 'haze', 'drought', 'extreme_weather', 'power_outage', 'pandemic', 'conflict', 'nuclear']) {
    assert.ok(id[`info.guides.${s}.source`], s + ' source');
    assert.ok(Array.isArray(id[`info.guides.${s}.during`]) && id[`info.guides.${s}.during`].length >= 2, s + ' during');
  }
});

test('tanpa harga dan tanpa klaim 53 negara', () => {
  for (const [k, v] of [...Object.entries(id), ...Object.entries(en)]) {
    const txt = JSON.stringify(v);
    assert.ok(!/\bRp\b|Rp\.|Rp\d|IDR|\$\d/.test(txt), 'harga di ' + k);
    assert.ok(!/53 (negara|countries)/i.test(txt), '53 negara di ' + k);
  }
});
