import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildShoppingList, toPlainText } from '../src/shopping.js';
import { fixtureResult } from './fixture.mjs';

const load = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const cases = load('../tests/cases.json');
const itemsDoc = load('../data/items.json');
const buy = load('../data/sources-to-buy.json');
const i18n = load('../i18n/id.json');
const data = { items: itemsDoc, buy };
const PRICE = /\bRp\b|\bribu\b|\bjuta\b|\brupiah\b/i;
const get = (o, k) => k.split('.').reduce((a, p) => (a == null ? a : a[p]), o);
const t = (k, v) => { const s = get(i18n, k); return typeof s === 'string' ? s.replace(/\{(\w+)\}/g, (m, n) => (v && v[n] != null ? v[n] : m)) : k; };
const results = cases.cases.map((c) => [c.id, fixtureResult(cases, itemsDoc.items, c.id)]);

test('buildShoppingList: struktur & pengelompokan', () => {
  for (const [id, r] of results) {
    const list = buildShoppingList(r, data, 'id');
    assert.ok(Array.isArray(list.groups), id);
    const seen = new Set();
    for (const g of list.groups) {
      assert.ok(g.items.length > 0, `${id}: grup kosong ${g.id}`);
      for (const e of g.items) {
        assert.ok(e.label && e.label !== e.id, `${id}: label ${e.id}`);
        assert.ok(!seen.has(e.id), `${id}: duplikat ${e.id}`);
        seen.add(e.id);
        if (!e.needsInput) assert.ok(e.qty > 0);
        if (g.kind === 'store') assert.equal(g.id, e.stores[0]);
        if (g.kind === 'home') assert.equal(e.atHome, true);
      }
    }
  }
});

test('tc02: air minum & formula bayi ada, jumlah sesuai expected', () => {
  const r = results.find(([id]) => id.startsWith('tc02'))[1];
  const list = buildShoppingList(r, data, 'id');
  const all = list.groups.flatMap((g) => g.items);
  const water = all.find((e) => e.id === 'water_drinking');
  const formula = all.find((e) => e.id === 'infant_formula');
  assert.equal(water.qty, 12);
  assert.equal(formula.qty, 7);
  assert.equal(list.meta.persons, 4);
  assert.equal(list.meta.days, 7);
  assert.equal(list.meta.total, all.length);
});

test('item tercentang ditandai & dihitung', () => {
  const r = results[1][1];
  const list = buildShoppingList(r, data, 'id', { water_drinking: true });
  assert.equal(list.meta.done, 1);
  assert.match(toPlainText(list, t), /\[x\] Air minum/);
});

test('status needs_input masuk daftar tanpa jumlah', () => {
  const r = { household: { n_total: 1 }, targets: { effective_target_days: 3 },
    shortfall: [{ id: 'infant_formula', priority: 'critical', unit: 'porsi/botol', missing: null, status: 'needs_input' }] };
  const list = buildShoppingList(r, data, 'id');
  assert.equal(list.groups.flatMap((g) => g.items)[0].needsInput, true);
  assert.match(toPlainText(list, t), /infant|bayi|formula|Susu/i);
});

test('result kosong / invalid -> daftar kosong', () => {
  assert.equal(buildShoppingList({ status: 'invalid' }, data, 'id').groups.length, 0);
  assert.equal(buildShoppingList(null, data, 'id').groups.length, 0);
});

test('toPlainText: judul, tanpa harga, baris tercentang', () => {
  for (const [id, r] of results) {
    for (const lang of ['id', 'en']) {
      const txt = toPlainText(buildShoppingList(r, data, lang), t);
      assert.ok(txt.startsWith(t('shopping.print_title')), id);
      assert.ok(/\[ \] /.test(txt) || r.shortfall.length === 0, id);
      assert.ok(!PRICE.test(txt), `${id}/${lang}: pola harga ditemukan`);
    }
  }
});

test('toPlainText: fallback bila kunci i18n kurang', () => {
  const r = results[1][1];
  const txt = toPlainText(buildShoppingList(r, data, 'id'), (k) => k);
  assert.match(txt, /Daftar belanja kesiapsiagaan/);
  assert.ok(!PRICE.test(txt));
});

test('semua data beli & teks UI bebas pola harga', () => {
  assert.ok(!PRICE.test(JSON.stringify(buy.items)));
  assert.ok(!PRICE.test(JSON.stringify(i18n.shopping) + JSON.stringify(i18n.result)));
});
