// Uji audit antislop 001: kontras dihitung dari token CSS aktif, plus pemeriksaan sumber (tanpa browser).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(root + p, 'utf8');
const css = read('styles/main.css');

function tokens(block) {
  const out = {};
  for (const m of block.matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})\b/g)) out[m[1]] = m[2];
  return out;
}
function blockAfter(marker) {
  const i = css.indexOf(marker);
  assert.ok(i >= 0, marker);
  return css.slice(i, css.indexOf('\n}', i));
}
const light = tokens(blockAfter(':root {'));
const dark = tokens(blockAfter(':root[data-theme="dark"] {'));

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const themes = { terang: light, gelap: dark };

for (const [name, tk] of Object.entries(themes)) {
  test(`#3 label dial putih penuh >= 4.5:1 (${name})`, () => {
    assert.ok(ratio('#FFFFFF', tk['c-dial'] || light['c-dial']) >= 4.5);
  });
  test(`#4 batas kontrol dan trek >= 3:1 terhadap latar (${name})`, () => {
    for (const bg of ['c-bg', 'c-surface']) {
      const r = ratio(tk['c-border'], tk[bg]);
      assert.ok(r >= 3, `${name} c-border vs ${bg} = ${r.toFixed(2)}`);
    }
  });
  test(`#9 hover tombol utama tetap terbaca (${name})`, () => {
    assert.ok(ratio(tk['c-on-cta'], tk['c-cta-hover']) >= 4.5);
    assert.ok(ratio(tk['c-on-primary'], tk['c-primary-hover']) >= 4.5);
  });
  test(`#17 warna bahaya terbaca di latar dan permukaan (${name})`, () => {
    assert.ok(ratio(tk['c-hazard'], tk['c-bg']) >= 4.5);
    assert.ok(ratio(tk['c-hazard'], tk['c-surface']) >= 4.5);
  });
}

test('#3 .dial-lbl tanpa opacity', () => {
  const rule = css.match(/\.dial \.dial-lbl\s*\{[^}]*\}/)[0];
  assert.ok(!/opacity/.test(rule));
});

test('#15 tabular-nums tidak di body, hanya elemen angka', () => {
  const body = css.match(/\nbody\s*\{[^}]*\}/)[0];
  assert.ok(!/tabular-nums/.test(body));
  assert.match(css, /\.dial-num[^{]*\{\s*font-variant-numeric:\s*tabular-nums/);
});

test('#16/#17 tier tetap netral, bahaya punya token sendiri', () => {
  assert.ok(light['c-hazard'] && dark['c-hazard']);
  assert.notEqual(light['c-hazard'], light['tier-0-bg']);
});

test('#18 ikon chart dihapus dari ICONS', () => {
  assert.ok(!/^\s*chart:/m.test(read('src/app.js')));
});

test('#13 tanpa em dash di sumber JS dan i18n', () => {
  for (const f of ['src/app.js', 'src/forms.js', 'src/results.js', 'src/shopping.js', 'src/icons.js', 'src/a11y.js', 'i18n/id.json', 'i18n/en.json']) {
    assert.ok(!read(f).includes('—'), f);
  }
});

test('CACHE v11 dan berkas baru masuk precache', () => {
  const sw = read('sw.js');
  assert.match(sw, /survivalcheck-v11/);
  assert.ok(sw.includes("'src/icons.js'") && sw.includes("'src/a11y.js'"));
  assert.ok(!/survivalcheck-v9/.test(sw));
});

test('#2 DESIGN.md ada dan cocok dengan token aktif', () => {
  assert.ok(existsSync(root + 'DESIGN.md'));
  const d = read('DESIGN.md');
  for (const v of [light['c-primary'], light['c-cta'], light['c-hazard'], dark['c-primary'], dark['c-cta'], dark['c-hazard']]) assert.ok(d.toUpperCase().includes(v.toUpperCase()), v);
  assert.match(d, /Rubik/);
});
