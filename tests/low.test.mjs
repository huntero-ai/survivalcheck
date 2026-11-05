// Uji audit antislop 001 sisa LOW (No 20-32) tanpa browser: kunci i18n, komentar, gaya inline, warna tema.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(root + p, 'utf8');
const id = JSON.parse(read('i18n/id.json'));
const en = JSON.parse(read('i18n/en.json'));
const get = (d, k) => k.split('.').reduce((v, p) => (v == null ? undefined : v[p]), d);
const srcFiles = readdirSync(root + 'src').filter((f) => f.endsWith('.js'));

test('#23 setiap kunci i18n literal di src/*.js ada di id.json dan en.json', () => {
  const missing = [];
  for (const f of srcFiles) {
    const s = read('src/' + f);
    for (const m of s.matchAll(/\b(?:tt|tr|t)\((?:ctx, )?'([a-z_0-9]+(?:\.[a-z_0-9]+)+[a-z0-9])'/g)) {
      const k = m[1];
      if (typeof get(id, k) !== 'string' || typeof get(en, k) !== 'string') missing.push(`${f}: ${k}`);
    }
  }
  assert.deepEqual(missing, []);
});

test('#23 kunci baru home/nav/quick/target ada di kedua bahasa dan tidak kosong', () => {
  const keys = ['home.start_check', 'home.survive_label', 'home.ready_title', 'home.fill_stock', 'home.next_title', 'home.short_days', 'home.missing', 'home.empty_dial', 'home.bag', 'home.family',
    'home.partial_chip', 'home.partial_note', 'home.next_food', 'home.disclaimer_link', 'nav.dark_mode', 'nav.dark_on', 'nav.dark_off', 'quick.q1', 'quick.a0', 'quick.q3c', 'target.assume', 'target.lv_tough', 'target.dec', 'target.inc', 'errors.not_found_hint'];
  for (const k of keys) for (const d of [id, en]) assert.ok(typeof get(d, k) === 'string' && get(d, k).length > 0, k);
});

test('#26 kalimat pola templat sudah diganti', () => {
  assert.ok(!/bukan nilai ujian/.test(id.result.calm_intro));
  assert.ok(!/not an exam/.test(en.result.calm_intro));
  assert.ok(!/Tidak perlu sempurna/.test(id.home.intro));
  for (const d of [id, en]) assert.ok(!/Kerja bagus|Well done|Selamat,|Congratulations|tidak apa-apa|that is okay/i.test(JSON.stringify(d.result) + JSON.stringify(d.tiers)));
});

test('#28 tanpa pemisah dekoratif dan nomor langkah di komentar src', () => {
  for (const f of ['app.js', 'forms.js', 'results.js', 'shopping.js']) {
    const s = read('src/' + f);
    assert.ok(!/^\s*\/\/\s*(-{3,}|={3,})/m.test(s), f + ' pemisah');
    assert.ok(!/^\s*\/\/\s*\d+\.\s+\S/m.test(s), f + ' nomor langkah');
  }
});

test('#32 tidak ada gaya inline di JS dan index.html; CSP style-src tanpa unsafe-inline', () => {
  for (const f of srcFiles.filter((x) => x !== 'engine.js')) {
    const s = read('src/' + f);
    assert.ok(!/cssText|style:\s*['`]|style=/.test(s), f);
  }
  const html = read('index.html');
  assert.ok(!/\sstyle=/.test(html));
  const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
  assert.ok(!/style-src[^;]*unsafe-inline/.test(csp));
});

test('#30 theme_color manifest = warna header terang di index.html', () => {
  const html = read('index.html');
  const light = html.match(/<meta name="theme-color" content="(#[0-9A-Fa-f]{6})" media="\(prefers-color-scheme: light\)">/)[1];
  const mf = JSON.parse(read('manifest.webmanifest'));
  assert.equal(mf.theme_color.toLowerCase(), light.toLowerCase());
  assert.equal(mf.background_color.toLowerCase(), light.toLowerCase());
});

test('#22 radius memakai token dan .f-catcard hanya satu definisi', () => {
  for (const f of ['main.css', 'forms.css', 'results.css']) {
    const s = read('styles/' + f);
    assert.ok(!/border-radius:\s*\d+px/.test(s), f);
  }
  const forms = read('styles/forms.css');
  assert.equal((forms.match(/^\.f-catcard \{/gm) || []).length, 1);
});

test('#20 results.css tidak lagi mendefinisikan ulang dasar .sc-btn/.sc-card/.sc-chip dan tanpa fallback teal', () => {
  const r = read('styles/results.css');
  assert.ok(!/^\.sc-(btn|card|chip) \{/m.test(r));
  assert.ok(!/#0f6b5a/i.test(r));
});
