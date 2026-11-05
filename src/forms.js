// SurvivalCheck - layar isian (E2): Profil, Target & skenario, Inventaris, Daya listrik, Evaluasi keluarga.
// Semua teks lewat ctx.t(); DOM dibangun dengan createElement + textContent (tanpa innerHTML).
// Perubahan disimpan otomatis lewat ctx.save(patch) (patch = kunci tingkat atas state, utuh).

import { evaluate, haveOf } from './engine.js';
import * as P from './power.js';

// ---------- util ----------
let uid = 0;
const nid = (p = 'f') => `${p}-${++uid}`;

function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, String(v));
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
}
const interp = (s, vars) => (vars ? String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : String(s));

/** Teks i18n dengan fallback (id, en) bila kunci belum ada. */
function tr(ctx, key, idText, enText, vars) {
  const v = ctx.t(key, vars);
  if (typeof v === 'string' && v !== key) return v;
  return interp(ctx.lang === 'en' && enText != null ? enText : idText != null ? idText : key, vars);
}
const lab = (ctx, o) => (o && (o[ctx.lang] || o.id)) || '';
const fmt = (ctx, n, d = 2) => (Number.isFinite(n) ? n.toLocaleString(ctx.lang === 'en' ? 'en-GB' : 'id-ID', { maximumFractionDigits: d }) : '-');
const cp = (o) => (o === undefined ? undefined : JSON.parse(JSON.stringify(o)));
const items = (ctx) => (Array.isArray(ctx.data.items) ? ctx.data.items : ctx.data.items.items);
const catsOf = (ctx) => (ctx.data.items.categories || ctx.data.categories || []);
const rules = (ctx) => ctx.data.rules;

function ev(ctx) {
  try { return evaluate(ctx.state, { items: Array.isArray(ctx.data.items) ? { items: ctx.data.items, categories: ctx.data.categories || [], scenarios: ctx.data.scenarios || [] } : ctx.data.items, rules: ctx.data.rules, power: ctx.data.power, indicators: ctx.data.indicators }); }
  catch (e) { console.error(e); return { status: 'invalid', errors: ['error'] }; }
}

// ---------- profil & state default ----------
const AGE = ['infant', 'toddler', 'child', 'adult', 'elderly'];
const AGE_KEY = { infant: 'infant', toddler: 'toddler', child: 'child', adult: 'adult', elderly: 'elder' };
const AGE_FALLBACK = { infant: ['Bayi', 'di bawah 1 tahun'], toddler: ['Balita', '1 sampai 4 tahun'], child: ['Anak', '5 sampai 12 tahun'], adult: ['Dewasa', '13 sampai 59 tahun'], elderly: ['Lansia', '60 tahun ke atas'] };

function defaultProfile() {
  return {
    counts: { infant: 0, toddler: 0, child: 0, adult: 0, elderly: 0 },
    pregnant: 0, breastfeeding: 0, infant_feeding: 'formula',
    pets: { dog: 0, cat: 0, other: 0 }, meds: [], has_electric_medical: false,
    usage_per_day: {}, disability: false, aids: false, housing: 'house', altitude_over_1000: false, province: null,
  };
}
function getProfile(ctx) {
  const d = defaultProfile();
  const p = ctx.state.profile;
  if (!p || typeof p !== 'object') return d;
  return {
    ...d, ...cp(p),
    counts: { ...d.counts, ...(p.counts || {}) },
    pets: { ...d.pets, ...(p.pets || {}) },
    usage_per_day: { ...(p.usage_per_day || {}) },
    meds: Array.isArray(p.meds) ? cp(p.meds) : [],
  };
}
const saveProfile = (ctx, p) => ctx.save({ profile: p });
const totalPeople = (p) => AGE.reduce((s, g) => s + (Number(p.counts[g]) || 0), 0);
function getTargetDays(ctx) {
  const t = ctx.state.target;
  const d = t && typeof t === 'object' ? t.days : typeof t === 'number' ? t : null;
  return Number.isFinite(d) ? d : rules(ctx).defaults.target_days;
}

// Saran skenario per provinsi dari IRBI 2024 (BNPB) 'dominant_hazards'. Diutamakan ctx.data.province_risks bila tersedia.
const PROVINCE_SCENARIOS = {"aceh":["flood_landslide","extreme_weather","haze"],"sumatera_utara":["flood_landslide","extreme_weather","haze"],"sumatera_barat":["flood_landslide","haze"],"riau":["flood_landslide","haze"],"jambi":["flood_landslide","haze"],"sumatera_selatan":["flood_landslide","extreme_weather","haze"],"bengkulu":["flood_landslide","extreme_weather","haze"],"lampung":["flood_landslide","extreme_weather","drought"],"kepulauan_bangka_belitung":["flood_landslide","extreme_weather","haze"],"kepulauan_riau":["flood_landslide","extreme_weather","haze"],"dki_jakarta":["flood_landslide","extreme_weather"],"jawa_barat":["flood_landslide","extreme_weather"],"jawa_tengah":["flood_landslide","extreme_weather"],"di_yogyakarta":["extreme_weather","drought"],"jawa_timur":["flood_landslide","extreme_weather","haze"],"banten":["flood_landslide"],"bali":["flood_landslide","earthquake"],"nusa_tenggara_barat":["earthquake","tsunami","flood_landslide"],"nusa_tenggara_timur":["flood_landslide","earthquake","tsunami"],"kalimantan_barat":["flood_landslide","haze","extreme_weather"],"kalimantan_tengah":["flood_landslide"],"kalimantan_selatan":["flood_landslide","extreme_weather","haze"],"kalimantan_timur":["flood_landslide","haze","extreme_weather"],"kalimantan_utara":["flood_landslide","extreme_weather","haze"],"sulawesi_utara":["flood_landslide","extreme_weather"],"sulawesi_tengah":["flood_landslide"],"sulawesi_selatan":["flood_landslide","extreme_weather"],"sulawesi_tenggara":["flood_landslide","extreme_weather"],"gorontalo":["flood_landslide"],"sulawesi_barat":["flood_landslide"],"maluku":["flood_landslide","extreme_weather"],"maluku_utara":["flood_landslide","extreme_weather","earthquake"],"papua":["flood_landslide"],"papua_barat":["flood_landslide"],"papua_selatan":["flood_landslide"],"papua_tengah":["flood_landslide"],"papua_pegunungan":["flood_landslide"],"papua_barat_daya":["flood_landslide"]};
const PROVINCE_KEYS = Object.keys(PROVINCE_SCENARIOS);
const HAZARD_MAP = { banjir: 'flood_landslide', 'tanah longsor': 'flood_landslide', 'cuaca ekstrem': 'extreme_weather', 'angin puting beliung': 'extreme_weather', karhutla: 'haze', 'banjir bandang': 'flood_landslide', 'gempa bumi': 'earthquake', tsunami: 'tsunami', kekeringan: 'drought' };
function provinceScenarios(ctx, key) {
  const pr = ctx.data.province_risks;
  const rows = Array.isArray(pr) ? pr : pr && Array.isArray(pr.data) ? pr.data : null;
  if (rows) {
    const name = ctx.t('provinces.' + key);
    const row = rows.find((r) => String(r.province).toLowerCase() === String(name).toLowerCase());
    if (row) {
      const out = [];
      for (const w of String(row.dominant_hazards || '').split(',')) { const m = HAZARD_MAP[w.trim()]; if (m && !out.includes(m)) out.push(m); }
      return out;
    }
  }
  return PROVINCE_SCENARIOS[key] || [];
}

// ---------- komponen UI ----------
function validateNumber(raw, o) {
  const s = String(raw).trim().replace(',', '.');
  if (s === '') return { ok: true, empty: true, value: null };
  const n = Number(s);
  if (!Number.isFinite(n)) return { ok: false, err: 'not_number' };
  if (n < (o.min ?? 0)) return { ok: false, err: o.min > 0 ? 'range' : 'negative' };
  if (o.max != null && n > o.max) return { ok: false, err: 'range' };
  if (o.integer && !Number.isInteger(n)) return { ok: false, err: 'integer' };
  return { ok: true, value: n, soft: o.soft != null && n > o.soft };
}
function errText(ctx, err, o) {
  if (err === 'negative') return tr(ctx, 'inventory.validation.negative', 'Jumlah tidak boleh negatif.', 'Amount cannot be negative.');
  if (err === 'not_number') return tr(ctx, 'inventory.validation.not_a_number', 'Isi dengan angka.', 'Enter a number.');
  if (err === 'integer') return tr(ctx, 'profile.validation.whole_number', 'Isi dengan bilangan bulat.', 'Enter a whole number.');
  if (o && o.rangeKey) return tr(ctx, o.rangeKey, `Isi angka antara ${o.min} dan ${o.max}.`, `Enter a number between ${o.min} and ${o.max}.`);
  return tr(ctx, 'f.range', 'Isi angka antara {min} dan {max}.', 'Enter a number between {min} and {max}.', { min: o.min ?? 0, max: o.max ?? '' });
}

/** Isian angka berlabel. onValue(value|null) dipanggil hanya untuk nilai valid. */
function numField(ctx, o) {
  const id = nid('num');
  const errId = id + '-err';
  const hintId = id + '-hint';
  const input = h('input', { type: 'number', id, inputmode: o.integer ? 'numeric' : 'decimal', min: o.min ?? 0, max: o.max, step: o.step ?? (o.integer ? 1 : 'any'), 'aria-describedby': [o.hint ? hintId : '', errId].filter(Boolean).join(' '), autocomplete: 'off' });
  if (o.value != null && o.value !== '') input.value = String(o.value);
  const err = h('p', { class: 'f-error', id: errId, 'aria-live': 'polite' });
  const show = (r) => {
    if (!r.ok) { err.textContent = '⚠ ' + errText(ctx, r.err, o); err.className = 'f-error'; input.setAttribute('aria-invalid', 'true'); }
    else if (r.soft) { err.textContent = tr(ctx, 'inventory.validation.very_large', 'Angkanya sangat besar. Sudah benar?', 'That number is very large. Is it correct?'); err.className = 'f-error f-soft'; input.removeAttribute('aria-invalid'); }
    else { err.textContent = ''; input.removeAttribute('aria-invalid'); }
  };
  input.addEventListener('input', () => {
    const r = validateNumber(input.value, o);
    if (r.ok) { if (!r.soft) show(r); o.onValue(r.value); }
    else { show(r); o.onValue(null); } // nilai tak sah tidak boleh tersimpan (prefiks valid sebelumnya dibuang)
  });
  input.addEventListener('blur', () => show(validateNumber(input.value, o)));
  const el = h('div', { class: 'field f-num' + (o.compact ? ' f-compact' : '') },
    h('label', { for: id, text: o.label }),
    o.hint ? h('p', { class: 'f-hint', id: hintId, text: o.hint }) : null,
    h('div', { class: 'f-numrow' }, input, o.unit ? h('span', { class: 'f-unit', 'aria-hidden': 'true', text: o.unit }) : null),
    err);
  return { el, input };
}

/** Stepper - angka + (editable). */
function stepper(ctx, o) {
  const id = nid('stp');
  const max = o.max ?? 99;
  let value = Number(o.value) || 0;
  const input = h('input', { type: 'number', id, inputmode: 'numeric', min: 0, max, step: 1, value: String(value), 'aria-describedby': id + '-err', class: 'f-stepper-input' });
  const err = h('p', { class: 'f-error', id: id + '-err', 'aria-live': 'polite' });
  const set = (n, notify = true) => {
    value = n; input.value = String(n);
    dec.disabled = n <= 0; inc.disabled = n >= max;
    if (notify) o.onChange(n);
  };
  const dec = h('button', { type: 'button', class: 'f-step-btn', 'aria-label': tr(ctx, 'profile.decrease', 'Kurangi satu {group}', 'Remove one {group}', { group: o.groupLabel || o.label }), onclick: () => { set(Math.max(0, value - 1)); input.focus(); } }, h('span', { 'aria-hidden': 'true', text: '−' }));
  const inc = h('button', { type: 'button', class: 'f-step-btn', 'aria-label': tr(ctx, 'profile.increase', 'Tambah satu {group}', 'Add one {group}', { group: o.groupLabel || o.label }), onclick: () => { set(Math.min(max, value + 1)); input.focus(); } }, h('span', { 'aria-hidden': 'true', text: '+' }));
  input.addEventListener('input', () => { const r = validateNumber(input.value, { min: 0, max, integer: true }); if (r.ok && !r.empty) { value = r.value; dec.disabled = value <= 0; inc.disabled = value >= max; o.onChange(value); } });
  input.addEventListener('blur', () => {
    const r = validateNumber(input.value, { min: 0, max, integer: true, rangeKey: null });
    if (!r.ok) { err.textContent = '⚠ ' + errText(ctx, r.err, { min: 0, max }); input.setAttribute('aria-invalid', 'true'); }
    else { err.textContent = ''; input.removeAttribute('aria-invalid'); if (r.empty) set(0); }
  });
  dec.disabled = value <= 0; inc.disabled = value >= max;
  const el = h('div', { class: 'f-stepper' },
    h('div', { class: 'f-stepper-label' }, h('label', { for: id, text: o.label }), o.hint ? h('span', { class: 'f-hint', text: o.hint }) : null),
    h('div', { class: 'f-stepper-ctl' }, dec, input, inc), err);
  return { el, set, input };
}

function switchRow(ctx, o) {
  const id = nid('sw');
  const input = h('input', { type: 'checkbox', id, role: 'switch' });
  input.checked = !!o.checked;
  input.addEventListener('change', () => o.onChange(input.checked));
  const el = h('div', { class: 'f-switchrow' },
    h('label', { class: 'choice', for: id }, input, h('span', { class: 'f-switch-text' }, h('span', { text: o.label }), o.hint ? h('span', { class: 'f-hint', text: o.hint }) : null)));
  return { el, input };
}

function statusChip(ctx, kind) {
  if (kind === 'ok') return h('span', { class: 'chip chip-ok' }, h('span', { 'aria-hidden': 'true', text: '✓ ' }), tr(ctx, 'inventory.enough', 'Sudah cukup', 'Enough'));
  if (kind === 'short') return h('span', { class: 'chip chip-warn' }, h('span', { 'aria-hidden': 'true', text: '△ ' }), tr(ctx, 'inventory.short', 'Masih kurang', 'Still short'));
  if (kind === 'input') return h('span', { class: 'chip chip-warn' }, h('span', { 'aria-hidden': 'true', text: '△ ' }), tr(ctx, 'f.needs_input', 'Isi pemakaian harian', 'Enter daily use'));
  return h('span', { class: 'chip' }, h('span', { 'aria-hidden': 'true', text: '— ' }), tr(ctx, 'inventory.empty', 'Belum diisi', 'Not filled in'));
}

function notice(kind, ...kids) { return h('div', { class: 'notice' + (kind ? ' ' + kind : '') }, ...kids); }
function savedNote() { return document.createDocumentFragment(); }
function pageHeader(ctx, title, intro) {
  return [h('h1', { text: title })];
}
function navBar(ctx, back, next) {
  return h('div', { class: 'f-nav' },
    back ? h('a', { class: 'btn', href: back.href, text: back.label }) : null,
    next ? h('a', { class: 'btn btn-primary', href: next.href, text: next.label }) : null);
}
function hazardCard(ctx, title, body, danger) {
  return h('section', { class: 'notice ' + (danger ? 'danger' : ''), 'aria-label': title },
    h('p', null, h('span', { 'aria-hidden': 'true', text: '⚠ ' }), h('strong', { text: title })),
    h('p', { text: body }));
}
function sourceLine(ctx, it) {
  return h('details', { class: 'f-why' },
    h('summary', { text: tr(ctx, 'f.why', 'Mengapa dan sumber', 'Why, and sources') }),
    h('p', { text: lab(ctx, it.why) || '' }),
    (it.sources && it.sources.length) ? h('p', { class: 'f-hint', text: tr(ctx, 'common.sources', 'Sumber', 'Sources') + ': ' + it.sources.join(', ') }) : null,
    h('p', { class: 'f-hint', text: it.evidence === 'DIBACA' ? tr(ctx, 'common.evidence_read', 'Sumber dibaca langsung', 'Source read directly') : tr(ctx, 'common.evidence_snippet', 'Dari kutipan, perlu dicek ulang', 'From an excerpt, to be re-checked') }));
}

/** Penanda terlihat untuk item evidence CUPLIKAN (tidak tersembunyi di <details>). */
function evidenceBadge(ctx, it) {
  if (!it || it.evidence !== 'CUPLIKAN') return null;
  return h('span', { class: 'chip chip-warn f-excerpt', 'data-evidence': 'excerpt' }, h('span', { 'aria-hidden': 'true', text: '△ ' }), tr(ctx, 'common.excerpt_badge', 'Dari kutipan sumber, perlu dicek ulang', 'From a source excerpt, to be re-checked'));
}

// =====================================================================
// PROFIL
// =====================================================================
export function renderProfile(root, ctx) {
  root.textContent = '';
  const p = getProfile(ctx);
  const upd = (fn) => { const q = getProfile(ctx); fn(q); saveProfile(ctx, q); return q; };
  const R = rules(ctx);

  root.append(...pageHeader(ctx, tr(ctx, 'profile.title', 'Profil rumah tangga'), tr(ctx, 'profile.intro', 'Siapa saja yang kamu tanggung?')));

  // 1. jumlah orang
  const totalEl = h('p', { class: 'f-total', 'aria-live': 'polite' });
  const warnEl = h('p', { class: 'f-error f-soft', 'aria-live': 'polite' });
  const section = (title, ...kids) => h('section', { class: 'card f-section' }, h('h2', { text: title }), ...kids);
  const peopleSteppers = AGE.map((g) => {
    const fb = AGE_FALLBACK[g];
    const name = tr(ctx, 'profile.age.' + AGE_KEY[g], fb[0], fb[0]);
    const hint = tr(ctx, 'profile.age.' + AGE_KEY[g] + '_hint', fb[1], fb[1]);
    return stepper(ctx, { label: name, groupLabel: name, hint, value: p.counts[g], max: 99, onChange: (n) => { upd((q) => { q.counts[g] = n; }); refresh(); } });
  });
  root.append(section(tr(ctx, 'profile.people_title', 'Jumlah orang per kelompok usia'), ...peopleSteppers.map((s) => s.el), totalEl, warnEl));

  // 2. hamil / menyusui
  const mkCount = (key, labelKey, fbLabel, fbCount) => {
    const wrap = h('div', { class: 'f-sub' });
    const stp = stepper(ctx, { label: tr(ctx, labelKey + '_count', fbCount, fbCount), groupLabel: fbLabel, value: Math.max(1, p[key]), max: 99, onChange: (n) => { upd((q) => { q[key] = n; }); refresh(); } });
    wrap.append(stp.el);
    wrap.hidden = !(p[key] > 0);
    const sw = switchRow(ctx, { label: tr(ctx, labelKey, fbLabel, fbLabel), checked: p[key] > 0, onChange: (on) => {
      upd((q) => { q[key] = on ? Math.max(1, Number(stp.input.value) || 1) : 0; });
      wrap.hidden = !on; refresh();
    } });
    return h('div', null, sw.el, wrap);
  };
  root.append(section(tr(ctx, 'profile.pregnancy_title', 'Kondisi khusus ibu'),
    mkCount('pregnant', 'profile.pregnant', 'Ada yang sedang hamil', 'Berapa orang hamil?'),
    mkCount('breastfeeding', 'profile.breastfeeding', 'Ada yang sedang menyusui', 'Berapa orang menyusui?'),
    h('p', { class: 'f-hint', text: tr(ctx, 'profile.pregnancy_hint', 'Kebutuhan energi bertambah. Untuk air, panduan resmi hanya menyarankan minum lebih banyak, tanpa angka pasti.') })));

  // 3. kebutuhan bayi / balita
  const babyBox = h('section', { class: 'card f-section' });
  const buildBaby = () => {
    babyBox.textContent = '';
    const q = getProfile(ctx);
    const hasInfant = q.counts.infant > 0;
    babyBox.hidden = !(hasInfant || q.counts.toddler > 0);
    if (babyBox.hidden) return;
    babyBox.append(h('h2', { text: tr(ctx, 'profile.baby_title', 'Kebutuhan bayi dan balita') }),
      h('p', { class: 'muted', text: tr(ctx, 'profile.baby_intro', 'Isi sesuai pemakaian harian. Tidak ada angka standar, jadi kami memakai angkamu.') }));
    const use = (id, label, unit, hint) => numField(ctx, { label, hint, unit, min: 0, max: 500, value: q.usage_per_day[id], onValue: (v) => {
      upd((x) => { if (v == null) delete x.usage_per_day[id]; else x.usage_per_day[id] = v; if (id === 'infant_formula') syncFeeding(x); });
    } });
    babyBox.append(use('infant_diapers', tr(ctx, 'profile.baby_diapers', 'Popok per hari'), '', null).el);
    if (hasInfant) {
      babyBox.append(use('infant_formula', tr(ctx, 'profile.baby_formula', 'Formula per hari'), '', tr(ctx, 'profile.baby_formula_unit', 'takaran atau botol, sesuai kemasan')).el);
      const sw = switchRow(ctx, { label: tr(ctx, 'profile.baby_breastfed', 'Bayi mendapat ASI'), hint: tr(ctx, 'profile.baby_breastfed_hint', 'Menyusui tetap dianjurkan. Siapkan cadangan formula bila perlu.'), checked: q.infant_feeding !== 'formula', onChange: (on) => { upd((x) => { x.infant_feeding = on ? 'breastfeeding' : 'formula'; syncFeeding(x); }); } });
      babyBox.append(sw.el);
    }
    babyBox.append(use('infant_mpasi', tr(ctx, 'profile.baby_mpasi', 'MPASI per hari'), '', null).el);
  };
  // ASI + formula > 0 = campuran; ASI tanpa formula = ASI; tanpa ASI = formula.
  function syncFeeding(x) {
    if (x.infant_feeding === 'formula') return;
    x.infant_feeding = Number(x.usage_per_day.infant_formula) > 0 ? 'mixed' : 'breastfeeding';
  }
  root.append(babyBox);

  // 4. obat rutin
  const medsBox = h('section', { class: 'card f-section' });
  const medEditorHost = h('div');
  let addBtn = null;
  const renderMeds = () => {
    medsBox.textContent = '';
    const q = getProfile(ctx);
    medsBox.append(h('h2', { text: tr(ctx, 'profile.meds_title', 'Obat rutin') }),
      h('p', { class: 'muted', text: tr(ctx, 'profile.meds_intro', 'Tambahkan obat yang diminum rutin. Cukup jumlah dosis dan sisa stok.') }));
    if (!q.meds.length) medsBox.append(h('p', { class: 'f-empty', text: tr(ctx, 'profile.meds_empty', 'Belum ada obat rutin. Lewati bila tidak ada.') }));
    else {
      const ul = h('ul', { class: 'f-list' });
      q.meds.forEach((m, i) => {
        const desc = [m.label || tr(ctx, 'profile.meds_title', 'Obat rutin'), m.for ? tr(ctx, 'profile.meds_for', 'Untuk siapa') + ': ' + m.for : '', `${tr(ctx, 'profile.meds_doses', 'Dosis per hari')}: ${m.doses_per_day ?? '-'}`, `${tr(ctx, 'common.units.day', '{n} hari', '{n} days', { n: fmt(ctx, m.stock_days) })}`].filter(Boolean).join(' · ');
        ul.append(h('li', { class: 'f-listrow' }, h('span', { text: desc }),
          h('span', { class: 'f-rowbtns' },
            h('button', { type: 'button', class: 'btn', onclick: (e) => openMedEditor(i, e.currentTarget) }, tr(ctx, 'common.edit', 'Ubah'), h('span', { class: 'sr-only', text: ' ' + desc })),
            h('button', { type: 'button', class: 'btn', onclick: () => { upd((x) => { x.meds.splice(i, 1); }); renderMeds(); refresh(); } }, tr(ctx, 'common.remove', 'Buang'), h('span', { class: 'sr-only', text: ' ' + desc })))));
      });
      medsBox.append(ul);
    }
    addBtn = h('button', { type: 'button', class: 'btn', onclick: (e) => openMedEditor(-1, e.currentTarget) }, '+ ' + tr(ctx, 'profile.meds_add', 'Tambah obat rutin'));
    medsBox.append(medEditorHost, addBtn, h('p', { class: 'f-hint', text: tr(ctx, 'profile.meds_note', 'Tanyakan ke dokter atau apotek soal cara menambah stok obat rutin.') }));
  };
  function openMedEditor(index, opener) {
    medEditorHost.textContent = '';
    const q = getProfile(ctx);
    const cur = index >= 0 ? q.meds[index] : { label: '', for: '', doses_per_day: 1, stock_days: 0 };
    const draft = { ...cur };
    const title = h('h3', { tabindex: '-1', text: tr(ctx, 'profile.meds_add', 'Tambah obat rutin') });
    const mkText = (key, label) => { const id = nid('t'); const inp = h('input', { type: 'text', id, maxlength: 80, autocomplete: 'off' }); inp.value = draft[key] || ''; inp.addEventListener('input', () => { draft[key] = inp.value; }); return h('div', { class: 'field' }, h('label', { for: id, text: label }), inp); };
    const doses = numField(ctx, { label: tr(ctx, 'profile.meds_doses', 'Dosis per hari'), min: 1, max: 12, integer: true, rangeKey: 'profile.validation.doses_range', value: draft.doses_per_day, onValue: (v) => { draft.doses_per_day = v; } });
    const stock = numField(ctx, { label: tr(ctx, 'profile.meds_stock_days', 'Stok sekarang cukup untuk berapa hari'), min: 0, max: 3650, integer: true, value: draft.stock_days, unit: tr(ctx, 'f.days', 'hari', 'days'), onValue: (v) => { draft.stock_days = v == null ? 0 : v; } });
    const close = () => { medEditorHost.textContent = ''; if (opener && opener.isConnected) opener.focus(); };
    const saveBtn = h('button', { type: 'button', class: 'btn btn-primary', onclick: () => {
      const dv = validateNumber(String(draft.doses_per_day ?? ''), { min: 1, max: 12, integer: true });
      const sv = validateNumber(String(draft.stock_days ?? ''), { min: 0, max: 3650, integer: true });
      if (!dv.ok || dv.empty || !sv.ok) { doses.input.focus(); doses.input.dispatchEvent(new Event('blur')); stock.input.dispatchEvent(new Event('blur')); return; }
      upd((x) => { const m = { label: (draft.label || '').trim(), for: (draft.for || '').trim(), doses_per_day: dv.value, stock_days: sv.value }; if (index >= 0) x.meds[index] = m; else x.meds.push(m); });
      close(); renderMeds(); refresh();
    } }, tr(ctx, 'common.save', 'Simpan'));
    const form = h('div', { class: 'f-editor', role: 'group', 'aria-labelledby': title.id = nid('ttl') }, title,
      mkText('for', tr(ctx, 'profile.meds_for', 'Untuk siapa')), mkText('label', tr(ctx, 'profile.meds_label', 'Nama atau catatan (opsional)')), doses.el, stock.el,
      h('div', { class: 'btn-row' }, saveBtn, h('button', { type: 'button', class: 'btn', onclick: close }, tr(ctx, 'common.cancel', 'Batal'))));
    form.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } });
    medEditorHost.append(form);
    title.focus();
  }
  root.append(medsBox);

  // 5. hewan
  const petUse = numField(ctx, { label: tr(ctx, 'profile.pets_food_per_day', 'Pakan per hari (sesuai yang biasa kamu beri)'), unit: 'g', min: 0, max: 100000, value: p.usage_per_day.pet_food, onValue: (v) => { upd((x) => { if (v == null) delete x.usage_per_day.pet_food; else x.usage_per_day.pet_food = v; }); } });
  const petFoodWrap = h('div', null, petUse.el);
  petFoodWrap.hidden = !(p.pets.dog + p.pets.cat > 0);
  root.append(section(tr(ctx, 'profile.pets_title', 'Hewan peliharaan'),
    stepper(ctx, { label: tr(ctx, 'profile.pets_dog', 'Anjing'), value: p.pets.dog, max: 50, onChange: (n) => { upd((x) => { x.pets.dog = n; }); petFoodWrap.hidden = !(getProfile(ctx).pets.dog + getProfile(ctx).pets.cat > 0); } }).el,
    stepper(ctx, { label: tr(ctx, 'profile.pets_cat', 'Kucing'), value: p.pets.cat, max: 50, onChange: (n) => { upd((x) => { x.pets.cat = n; }); petFoodWrap.hidden = !(getProfile(ctx).pets.dog + getProfile(ctx).pets.cat > 0); } }).el,
    stepper(ctx, { label: tr(ctx, 'profile.pets_other', 'Hewan lain'), value: p.pets.other, max: 50, onChange: (n) => { upd((x) => { x.pets.other = n; }); } }).el,
    petFoodWrap,
    h('p', { class: 'f-hint', text: tr(ctx, 'profile.pets_hint', 'Hewan peliharaan dihitung sebagai tambahan, tidak menentukan tier. Hanya anjing dan kucing yang dihitung.') })));

  // 6. kebutuhan khusus
  const medCard = notice('', h('p', { text: tr(ctx, 'profile.special_electric_hint', 'Contohnya CPAP, konsentrator oksigen, nebulizer, atau kulkas obat. Kami akan membantu menghitung kebutuhan daya.') }), h('a', { class: 'btn', href: '#/daya', text: tr(ctx, 'power.title', 'Daya listrik') }));
  medCard.hidden = !p.has_electric_medical;
  root.append(section(tr(ctx, 'profile.special_title', 'Kebutuhan khusus'),
    switchRow(ctx, { label: tr(ctx, 'profile.special_disability', 'Ada anggota dengan disabilitas'), checked: p.disability, onChange: (on) => upd((x) => { x.disability = on; }) }).el,
    switchRow(ctx, { label: tr(ctx, 'profile.special_aids', 'Memakai alat bantu (kursi roda, tongkat, alat dengar, kacamata)'), checked: p.aids, onChange: (on) => upd((x) => { x.aids = on; }) }).el,
    switchRow(ctx, { label: tr(ctx, 'profile.special_electric_medical', 'Memakai alat medis yang butuh listrik'), checked: p.has_electric_medical, onChange: (on) => { upd((x) => { x.has_electric_medical = on; }); medCard.hidden = !on; } }).el,
    medCard));

  // 7. tempat tinggal
  const houseName = nid('housing');
  const housing = h('fieldset', { class: 'f-fieldset' }, h('legend', { text: tr(ctx, 'profile.housing_title', 'Tempat tinggal') }));
  for (const k of ['house', 'apartment', 'boarding']) {
    const id = nid('r');
    const r = h('input', { type: 'radio', name: houseName, id, value: k });
    r.checked = p.housing === k;
    r.addEventListener('change', () => { if (r.checked) upd((x) => { x.housing = k; }); });
    housing.append(h('label', { class: 'choice', for: id }, r, h('span', { text: tr(ctx, 'profile.housing.' + k, { house: 'Rumah tapak', apartment: 'Apartemen', boarding: 'Kos atau kontrakan' }[k]) })));
  }
  root.append(h('section', { class: 'card f-section' }, housing,
    switchRow(ctx, { label: tr(ctx, 'profile.altitude', 'Tinggal di atas 1.000 m dari permukaan laut'), hint: tr(ctx, 'profile.altitude_hint', 'Air direbus lebih lama di dataran tinggi (3 menit).'), checked: p.altitude_over_1000, onChange: (on) => upd((x) => { x.altitude_over_1000 = on; }) }).el));

  root.append(savedNote(ctx), navBar(ctx, { href: '#/', label: tr(ctx, 'common.back', 'Kembali') }, { href: '#/target', label: tr(ctx, 'common.next', 'Lanjut') }));

  function refresh() {
    const q = getProfile(ctx);
    const n = totalPeople(q);
    totalEl.textContent = n > 0 ? tr(ctx, 'profile.total_people', 'Total: {n} orang', 'Total: {n} people', { n }) : tr(ctx, 'profile.validation.no_people', 'Isi minimal satu orang agar perhitungan bisa dimulai.');
    const msgs = [];
    if (n > 20) msgs.push(tr(ctx, 'profile.validation.too_many', 'Jumlahnya besar sekali. Periksa lagi angkanya?'));
    if (q.pregnant + q.breastfeeding > q.counts.adult + q.counts.elderly) msgs.push(tr(ctx, 'profile.validation.count_exceeds_adults', 'Jumlah yang hamil atau menyusui melebihi jumlah dewasa. Periksa lagi?'));
    warnEl.textContent = msgs.join(' ');
    buildBaby();
  }
  renderMeds();
  refresh();
}

// =====================================================================
// TARGET & SKENARIO
// =====================================================================
export function renderTarget(root, ctx) {
  root.textContent = '';
  const R = rules(ctx);
  const presets = R.defaults.target_presets;
  const max = R.defaults.target_custom_max || 365;
  const prof = getProfile(ctx);
  const people = Object.values(prof.counts || {}).reduce((a, b) => a + (Number(b) || 0), 0);
  let days = getTargetDays(ctx);

  // Asumsi bawaan: listrik padam dan air tidak mengalir. Jenis bencana tidak ditanyakan lagi.
  const sc = Array.isArray(ctx.state.scenarios) ? ctx.state.scenarios : [];
  if (!sc.includes('power_outage')) ctx.save({ scenarios: [...sc, 'power_outage'] });
  const saveTarget = () => ctx.save({ target: { days, custom: !presets.includes(days) } });
  if (!ctx.state.target) saveTarget();

  root.append(...pageHeader(ctx, tr(ctx, 'target.title', 'Target bertahan', 'Survival target'), tr(ctx, 'target.intro', 'Berapa hari kamu ingin siap bertahan di rumah?', 'How many days do you want to be ready to last at home?')));

  const svg = (d) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.innerHTML = '<path d="' + d + '"/>'; return s; };
  const num = h('span', { class: 'dial-num' });
  const dial = h('div', { class: 'dial dial-sm', role: 'group', 'aria-live': 'polite' }, num, h('span', { class: 'dial-unit', text: tr(ctx, 'f.days', 'hari', 'days') }));
  const dec = h('button', { type: 'button', class: 'round-btn', 'aria-label': tr(ctx, 'target.dec', 'Kurangi satu hari', 'One day less') }, svg('M5 12h14'));
  const inc = h('button', { type: 'button', class: 'round-btn fill', 'aria-label': tr(ctx, 'target.inc', 'Tambah satu hari', 'One day more') }, svg('M12 5v14M5 12h14'));
  const label = h('p', { class: 'center', style: 'font-weight:600;margin:0' });
  const hint = h('p', { class: 'center muted', style: 'margin:0 0 var(--sp-4)' });
  const needs = h('div', { class: 'card' });
  const presetRow = h('div', { class: 'preset-row', role: 'radiogroup', 'aria-label': tr(ctx, 'target.presets', 'Pilihan cepat', 'Quick picks') });
  const pBtns = presets.map((d) => {
    const b = h('button', { type: 'button', role: 'radio', text: tr(ctx, 'common.units.day', '{n} hari', '{n} days', { n: d }) });
    b.addEventListener('click', () => set(d));
    presetRow.append(b);
    return [d, b];
  });
  function set(v) { days = Math.max(1, Math.min(max, Math.round(v))); saveTarget(); update(); }
  dec.addEventListener('click', () => set(days - 1));
  inc.addEventListener('click', () => set(days + 1));

  function update() {
    num.textContent = String(days);
    dec.disabled = days <= 1; inc.disabled = days >= max;
    for (const [d, b] of pBtns) b.setAttribute('aria-checked', String(d === days));
    const min = R.defaults.bnpb_minimum_days;
    let l, hh;
    if (days < min) { l = tr(ctx, 'target.lv_below', 'Di bawah minimum BNPB', 'Below the BNPB minimum'); hh = tr(ctx, 'target.below_min', 'Target di bawah 3 hari berarti di bawah minimum BNPB. Kamu tetap boleh memakainya.', 'A target under 3 days is below the BNPB minimum. You can still use it.'); }
    else if (days < R.defaults.target_days) { l = tr(ctx, 'target.lv_bnpb', 'Standar dasar BNPB', 'BNPB basic standard'); hh = tr(ctx, 'target.lv_bnpb_hint', 'Minimal 72 jam, sesuai tas siaga BNPB.', 'At least 72 hours, in line with the BNPB go-bag.'); }
    else if (days === R.defaults.target_days) { l = tr(ctx, 'target.default_badge', 'Disarankan', 'Recommended'); hh = tr(ctx, 'target.lv_rec_hint', 'Melampaui standar BNPB dan umum di panduan resmi.', 'Beyond the BNPB standard and common in official guides.'); }
    else if (days > 90) { l = tr(ctx, 'target.lv_long', 'Jangka panjang', 'Long term'); hh = tr(ctx, 'target.validation.days_large', 'Target lebih dari 90 hari jarang realistis. Tetap lanjut?', 'A target over 90 days is rarely realistic. Continue anyway?'); }
    else { l = tr(ctx, 'target.lv_tough', 'Tangguh', 'Resilient'); hh = tr(ctx, 'target.lv_tough_hint', 'Perlu cara memasak, penjernih air, dan daya alternatif.', 'Needs a way to cook, purify water, and backup power.'); }
    label.textContent = l; hint.textContent = hh;
    needs.textContent = '';
    needs.append(h('p', { class: 'muted', style: 'margin:0 0 var(--sp-3)', text: tr(ctx, 'target.assume', 'Dengan asumsi listrik padam dan air tidak mengalir, {n} orang perlu kira-kira:', 'Assuming a power cut and no running water, {n} people need roughly:', { n: people || 1 }) }),
      h('div', { class: 'stat-grid', style: 'margin:0' },
        h('div', null, h('div', { class: 'stat-n', text: Math.round(R.water.drinking_l_per_person_day * Math.max(people, 1) * days) + ' L' }), h('div', { class: 'muted', text: tr(ctx, 'target.need_water', 'air minum', 'drinking water') })),
        h('div', null, h('div', { class: 'stat-n', text: tr(ctx, 'common.units.day', '{n} hari', '{n} days', { n: Math.max(days, R.meds.min_days) }) }), h('div', { class: 'muted', text: tr(ctx, 'target.need_meds', 'stok obat rutin', 'routine medicine') }))));
  }
  root.append(h('div', { class: 'days-picker' }, dec, dial, inc), label, hint, presetRow, needs,
    h('p', { class: 'muted center', text: tr(ctx, 'target.change_anytime', 'Bisa diubah kapan saja.', 'You can change this any time.') }));
  update();
  root.append(savedNote(ctx), navBar(ctx, { href: '#/profil', label: tr(ctx, 'common.back', 'Kembali') }, { href: '#/keluarga', label: tr(ctx, 'common.next', 'Lanjut') }));
}

// =====================================================================
// INVENTARIS
// =====================================================================
const BAG_GROUPS = [['a', 1, 4], ['b', 5, 12], ['c', 13, 17], ['d', 18, 22], ['e', 23, 28]];
const UNIT_FALLBACK = { L: 'L' };

function inventoryOf(ctx) { return cp(ctx.state.inventory || {}); }
function setInv(ctx, id, value) {
  const inv = inventoryOf(ctx);
  if (value == null) delete inv[id]; else inv[id] = value;
  ctx.save({ inventory: inv });
}
function isQuick() { return false; }
function isFilled(ctx, it) {
  const inv = ctx.state.inventory || {};
  const v = inv[it.id];
  if (it.id === 'meds_personal') return (getProfile(ctx).meds || []).length > 0;
  if (it.id === 'medical_device_backup_power') return !!(ctx.state.power_devices && Object.keys(ctx.state.power_devices).length);
  if (v == null) return false;
  if (typeof v === 'object') return it.id.startsWith('food_') ? haveOf(v.qty) > 0 || v.kcal_total > 0 : (v.home != null || v.bag != null);
  return true;
}

export function renderInventory(root, ctx, params) {
  root.textContent = '';
  const cat = params && params.category;
  const res = ev(ctx);
  const cats = catsOf(ctx);
  if (!cat) return renderCategoryList(root, ctx, res, cats);
  const def = cats.find((c) => c.id === cat);
  if (!def) {
    root.append(h('h1', { text: tr(ctx, 'errors.not_found', 'Halaman tidak ditemukan.') }), h('a', { class: 'btn btn-primary', href: '#/inventaris', text: tr(ctx, 'nav.inventory', 'Stok') }));
    return;
  }
  renderCategory(root, ctx, def, cats);
}

function categoryStats(ctx, res, catId) {
  const set = new Set(res.status === 'ok' ? res.applicable_ids : []);
  const list = items(ctx).filter((it) => set.has(it.id) && (catId == null || it.category === catId));
  const filled = list.filter((it) => isFilled(ctx, it)).length;
  return { total: list.length, filled };
}

function renderCategoryList(root, ctx, res, cats) {
  root.append(h('h1', { text: tr(ctx, 'inventory.title', 'Stok', 'Stock') }));
  if (res.status !== 'ok') {
    root.append(h('div', { class: 'f-empty-block' }, h('p', { text: tr(ctx, 'profile.validation.no_people', 'Isi dulu data rumah tanggamu.') }), h('a', { class: 'btn btn-primary', href: '#/profil', text: tr(ctx, 'nav.profile', 'Profil') })));
    return;
  }
  // Kelompok berdasarkan jenis kebutuhan (air, makanan, listrik, dll.), bukan tahap.
  const ul = h('ul', { class: 'f-catgrid' });
  for (const c of cats) {
    const cs = categoryStats(ctx, res, c.id, null);
    if (!cs.total) continue;
    const pct = Math.round((cs.filled / cs.total) * 100);
    const done = cs.filled >= cs.total;
    ul.append(h('li', null, h('a', { class: 'f-catcard', href: `#/inventaris/${c.id}`, 'aria-label': `${lab(ctx, c.label)}, ${cs.filled}/${cs.total}` },
      h('span', { class: 'f-cat-top' }, h('strong', { text: lab(ctx, c.label) }), h('span', { class: 'f-stage-count', text: done ? '\u2713' : `${cs.filled}/${cs.total}` })),
      h('span', { class: 'f-bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(pct), 'aria-label': lab(ctx, c.label) }, h('span', { class: 'f-bar-fill', style: `width:${pct}%` })))));
  }
  root.append(ul);
}

function renderCategory(root, ctx, def, cats) {
  root.append(h('a', { class: 'back-link', href: '#/inventaris', text: '← ' + tr(ctx, 'nav.inventory', 'Stok') }));
  root.append(h('h1', { text: lab(ctx, def.label) }));
  const quick = false;

  const res0 = ev(ctx);
  if (res0.status !== 'ok') {
    root.append(notice('warn', h('p', { text: tr(ctx, 'profile.validation.no_people', 'Isi minimal satu orang agar perhitungan bisa dimulai.') }), h('a', { class: 'btn', href: '#/profil', text: tr(ctx, 'nav.profile', 'Profil') })));
    return;
  }
  const applicable = new Set(res0.applicable_ids);
  let list = items(ctx).filter((it) => it.category === def.id && applicable.has(it.id));

  // pembaruan langsung chip & kebutuhan tanpa membuat ulang kolom isian
  const live = new Map(); // id -> {chipHost, needEl, it}
  function refreshLive() {
    const res = ev(ctx);
    if (res.status !== 'ok') return;
    for (const [id, l] of live) {
      const e = res.items_eval[id];
      const it = l.it;
      l.chipHost.textContent = '';
      let kind = 'none';
      if (e && e.status === 'needs_input') kind = 'input';
      else if (e && e.coverage != null) kind = e.coverage >= 0.9995 ? 'ok' : (isFilled(ctx, it) || e.have > 0 ? 'short' : 'none');
      l.chipHost.append(statusChip(ctx, kind));
      if (l.needEl) l.needEl.textContent = e && e.need != null && !(it.unit === '-' || it.qty_mode === 'boolean') ? tr(ctx, 'inventory.need_label', 'Kebutuhan: {n}', 'Need: {n}', { n: `${fmt(ctx, e.need)} ${e.unit && e.unit !== '-' ? e.unit : ''}`.trim() }) + (e.missing ? ' · ' + tr(ctx, 'inventory.missing_label', 'Kurang: {n}', 'Short: {n}', { n: fmt(ctx, e.missing, 0) }) : '') : '';
    }
    if (def.id === 'food' && foodTotal) updateFoodTotals(res);
  }


  let foodTotal = null;
  let updateFoodTotals = () => {};
  if (def.id === 'food') {
    const fb = buildFoodSection(ctx, res0, refreshLive);
    foodTotal = fb.totals; updateFoodTotals = fb.update;
    root.append(fb.el);
  }
  if (def.id === 'water' && res0.household.water_l_per_person_day > rules(ctx).water.drinking_l_per_person_day) root.append(notice('', h('p', { 'data-note': 'water-careful', text: tr(ctx, 'target.water_careful', 'Angka hati-hati: 4 L berasal dari panduan untuk cuaca panas, bukan khusus kekeringan.', 'Cautious figure: 4 L comes from hot-weather guidance, not drought-specific.') })));
  if (def.id === 'gobag') root.append(buildBagChecklist(ctx, res0, root));

  const FOOD_SKIP = new Set([...(rules(ctx).food.aggregates), 'food_kcal_total', 'food_no_cook_share']);
  const ul = h('ul', { class: 'f-itemlist' });
  const visible = list.filter((it) => !FOOD_SKIP.has(it.id));
  const todo = visible.filter((it) => !isFilled(ctx, it));
  const doneIts = visible.filter((it) => isFilled(ctx, it));
  const PRI = { critical: 0, important: 1, extra: 2 };
  const byPri = (a, b) => (PRI[a.priority] ?? 1) - (PRI[b.priority] ?? 1);
  for (const it of [...todo.sort(byPri), ...doneIts.sort(byPri)]) ul.append(buildItemRow(ctx, it, res0, refreshLive, live));
  if (ul.children.length) root.append(ul);
  refreshLive();

  root.append(h('div', { class: 'f-nav' }, h('a', { class: 'btn btn-primary btn-block', href: '#/inventaris', text: tr(ctx, 'common.done', 'Selesai', 'Done') })));
}

function itemNeedsToggle(it, e) {
  if (it.qty_mode === 'boolean') return true;
  if (it.qty_mode === 'per_household' && it.per_household === 1) return true;
  return false;
}

function buildItemRow(ctx, it, res, refreshLive, live) {
  const e = res.items_eval[it.id] || {};
  const li = h('li', { class: 'card f-item' });
  const chipHost = h('span', { class: 'f-chiphost' });
  const needEl = h('p', { class: 'f-need' });
  const id = nid('it');
  li.append(h('div', { class: 'f-item-top' }, h('h3', { id: id + '-t', text: lab(ctx, it.label) }), chipHost), ...[evidenceBadge(ctx, it)].filter(Boolean), needEl);
  const inv = ctx.state.inventory || {};
  const cur = inv[it.id];
  const loc = it.location || 'home';
  const unit = it.unit && it.unit !== '-' ? it.unit : '';

  const body = h('div', { class: 'f-item-body' });
  if (it.id === 'meds_personal') {
    const p = getProfile(ctx);
    body.append(h('p', { text: p.meds.length ? tr(ctx, 'f.meds_from_profile', 'Dihitung dari obat rutin di Profil: stok terendah {n} hari.', 'Calculated from routine medicines in Profile: lowest stock {n} days.', { n: Math.min(...p.meds.map((m) => m.stock_days)) }) : tr(ctx, 'profile.meds_empty', 'Belum ada obat rutin.') }), h('a', { class: 'btn', href: '#/profil', text: tr(ctx, 'profile.meds_title', 'Obat rutin') }));
  } else if (it.id === 'medical_device_backup_power') {
    body.append(h('p', { text: tr(ctx, 'f.power_from_module', 'Dihitung dari modul Daya listrik.') }), h('a', { class: 'btn', href: '#/daya', text: tr(ctx, 'power.title', 'Daya listrik') }));
  } else {
    if (it.qty_mode === 'user_usage_per_day') {
      const p = getProfile(ctx);
      body.append(numField(ctx, { label: tr(ctx, 'f.usage_per_day', 'Pemakaian per hari (total rumah tangga)', 'Use per day (whole household)') + (unit ? ` (${unit})` : ''), min: 0, max: 100000, value: p.usage_per_day[it.id], compact: true,
        onValue: (v) => { const q = getProfile(ctx); if (v == null) delete q.usage_per_day[it.id]; else q.usage_per_day[it.id] = v; saveProfile(ctx, q); refreshLive(); } }).el);
    }
    const label = it.qty_mode === 'fuel_days' ? tr(ctx, 'inventory.fuel_days_label', 'Cukup untuk berapa hari memasak', 'Enough for how many days of cooking') + ` (${unit})` : tr(ctx, 'inventory.have_label', 'Dimiliki') + (unit ? ` (${unit})` : '');
    if (it.suggest_per_person_week && res && res.status === 'ok') {
      const n = res.household.n_total;
      const dd = res.targets.effective_target_days;
      body.append(h('p', { class: 'f-hint', text: tr(ctx, 'inventory.fuel_suggest', 'Saran jumlah, bukan syarat: sekitar {per} kaleng per orang per minggu. Untuk {n} orang selama {days} hari: sekitar {cans} kaleng.', 'Suggested amount, not a requirement: about {per} canisters per person per week. For {n} people over {days} days: about {cans} canisters.', { per: it.suggest_per_person_week, n, days: dd, cans: Math.ceil((it.suggest_per_person_week * n * dd) / 7) }) }));
    }
    if (itemNeedsToggle(it, e)) {
      body.append(switchRow(ctx, { label: tr(ctx, 'inventory.have_yes', 'Sudah punya'), checked: haveOf(cur) > 0, onChange: (on) => { setInv(ctx, it.id, on ? 1 : 0); refreshLive(); } }).el);
    } else {
      body.append(numField(ctx, { label, min: 0, max: 1e7, soft: 100000, value: haveOf(cur) || (cur === 0 ? 0 : ''), compact: true, onValue: (v) => { setInv(ctx, it.id, v); refreshLive(); } }).el);
    }
  }
  li.append(body, sourceLine(ctx, it));
  live.set(it.id, { chipHost, needEl, it });
  return li;
}

// ----- pangan -----
function buildFoodSection(ctx, res, refreshLive) {
  const R = rules(ctx);
  const byId = Object.fromEntries(items(ctx).map((i) => [i.id, i]));
  const wrap = h('section', { class: 'card f-section' }, h('h2', { text: tr(ctx, 'inventory.food.title', 'Pangan per jenis') }), h('p', { class: 'muted', text: tr(ctx, 'inventory.food.intro', 'Isi jumlah per jenis pangan yang biasa ada di rumah. Aplikasi menghitung total kalori.') }));
  const totals = h('div', { class: 'f-foodtotals', 'aria-live': 'polite' });
  const upd = (res2) => {
    totals.textContent = '';
    const r = res2 || ev(ctx);
    if (r.status !== 'ok') return;
    totals.append(h('p', null, h('strong', { text: tr(ctx, 'inventory.food.total_kcal', 'Total kalori: {n} kkal', 'Total calories: {n} kcal', { n: fmt(ctx, r.food.total_kcal, 0) }) })),
      h('p', { text: tr(ctx, 'inventory.food.kcal_need', 'Kebutuhan: {n} kkal per hari', 'Need: {n} kcal per day', { n: fmt(ctx, r.household.daily_kcal, 0) }) }),
      h('p', { class: 'f-hint', text: `${fmt(ctx, r.survival.components.food ?? 0, 1)} ${tr(ctx, 'f.days', 'hari', 'days')}` }));
    if (r.advisories.includes('no_cook_share_low')) totals.append(h('p', { class: 'f-hint', text: tr(ctx, 'inventory.food.ready_to_eat_tip', 'Sebagian stok sebaiknya bisa dimakan tanpa memasak, karena listrik atau gas bisa terputus.') }));
    for (const w of r.warnings) if (w.startsWith('food_kcal_unresolved:')) {
      const it = byId[w.split(':')[1]];
      totals.append(h('p', { class: 'f-error f-soft', text: '⚠ ' + (it ? lab(ctx, it.label) : '') + ': ' + tr(ctx, 'f.kcal_unresolved', 'isi kalori per kemasan dari label agar terhitung.', 'enter calories per pack from the label so it counts.') }));
    }
  };
  wrap.append(totals);
  const rows = h('ul', { class: 'f-foodlist' });
  for (const fid of R.food.aggregates) {
    const it = byId[fid];
    if (!it) continue;
    const raw = (ctx.state.inventory || {})[fid];
    const cur = raw && typeof raw === 'object' ? raw : { qty: typeof raw === 'number' ? raw : undefined };
    const save = (patch) => {
      const inv = inventoryOf(ctx);
      const o = { ...(inv[fid] && typeof inv[fid] === 'object' ? inv[fid] : {}), ...patch };
      for (const k of Object.keys(o)) if (o[k] == null || o[k] === '') delete o[k];
      if (!Object.keys(o).length) delete inv[fid]; else inv[fid] = o;
      ctx.save({ inventory: inv });
      refreshLive(); upd();
    };
    const per100 = R.food.kcal_per_100g[fid];
    const knownWeight = !!R.food.unit_g_defaults[it.unit];
    const li = h('li', { class: 'f-foodrow' }, h('h3', { text: lab(ctx, it.label) }));
    const grid = h('div', { class: 'f-two' });
    grid.append(numField(ctx, { label: `${tr(ctx, 'inventory.have_label', 'Dimiliki')} (${it.unit})`, min: 0, max: 1e7, soft: 100000, value: cur.qty ?? '', compact: true, onValue: (v) => save({ qty: v }) }).el);
    if (!knownWeight && per100 != null) grid.append(numField(ctx, { label: tr(ctx, 'f.grams_per_unit', 'Berat per {unit} (gram)', 'Weight per {unit} (grams)', { unit: it.unit }), min: 1, max: 100000, rangeKey: null, value: cur.grams_per_unit ?? '', compact: true, onValue: (v) => save({ grams_per_unit: v }) }).el);
    grid.append(numField(ctx, { label: tr(ctx, 'inventory.food.kcal_label', 'Kalori per kemasan (dari label)', 'Calories per pack (from label)') + (per100 == null ? ' *' : ''), min: 0, max: 100000, value: cur.kcal_per_unit ?? '', compact: true, hint: per100 == null ? tr(ctx, 'f.kcal_required', 'Wajib dari label', 'Required from label') : tr(ctx, 'common.optional', 'opsional'), onValue: (v) => save({ kcal_per_unit: v }) }).el);
    li.append(grid);
    rows.append(li);
  }
  wrap.append(rows);
  // pangan lain: kkal total dari label
  const other = (ctx.state.inventory || {}).food_other;
  wrap.append(h('div', { class: 'f-foodrow' }, h('h3', { text: tr(ctx, 'inventory.food.other_kcal', 'Pangan lain: isi kalori dari label') }),
    numField(ctx, { label: tr(ctx, 'f.other_kcal_total', 'Total kalori pangan lain (kkal)', 'Total calories of other food (kcal)'), min: 0, max: 1e8, value: other && other.kcal_total != null ? other.kcal_total : '', compact: true, onValue: (v) => { setInv(ctx, 'food_other', v == null ? null : { kcal_total: v }); refreshLive(); upd(); } }).el));
  upd(res);
  return { el: wrap, totals, update: upd };
}

// ----- tas siaga 28 item -----
function buildBagChecklist(ctx, res, root) {
  const all = items(ctx).filter((it) => it.bnpb_checklist);
  const byNo = new Map(all.map((it) => [it.bnpb_checklist, it]));
  const wrap = h('section', { class: 'card f-section' }, h('h2', { text: tr(ctx, 'inventory.gobag.title', 'Tas siaga 72 jam (standar BNPB)') }), h('p', { class: 'muted', text: tr(ctx, 'inventory.gobag.intro', 'Centang yang sudah ada di tas. Daftar ini mengikuti 28 item dari BNPB.') }));
  const sum = h('div', { class: 'f-bagsum', 'aria-live': 'polite' });
  wrap.append(sum);
  const checklist = () => ({ ...(ctx.state.bag_checklist || {}) });
  const excluded = new Set(res.status === 'ok' ? res.bag.excluded : []);
  function updateSum() {
    const r = ev(ctx);
    sum.textContent = '';
    if (r.status !== 'ok') return;
    const bandText = { siap: ['✓ ', tr(ctx, 'bands.bag.ready', 'SIAP'), 'chip-ok'], perlu_dilengkapi: ['△ ', tr(ctx, 'bands.bag.needs_work', 'PERLU DILENGKAPI'), 'chip-warn'], belum_siap: ['○ ', tr(ctx, 'bands.bag.not_ready', 'BELUM SIAP'), ''] }[r.bag.band];
    sum.append(h('p', null, h('strong', { text: tr(ctx, 'inventory.gobag.progress', '{have} dari {total} item', '{have} of {total} items', { have: r.bag.yes, total: r.bag.applicable }) + ' · ' + fmt(ctx, r.bag.pct, 1) + '%' }), ' ', h('span', { class: 'chip ' + bandText[2] }, h('span', { 'aria-hidden': 'true', text: bandText[0] }), bandText[1])),
      h('p', { class: 'f-hint', text: tr(ctx, 'bands.bag.rule', 'Di atas 80% siap, 50 sampai 80% perlu dilengkapi, di bawah 50% belum siap. Tepat 80% masuk perlu dilengkapi.') }));
  }
  for (const [gk, from, to] of BAG_GROUPS) {
    const fs = h('fieldset', { class: 'f-fieldset' }, h('legend', { text: tr(ctx, 'inventory.gobag.group_' + gk, gk.toUpperCase()) }));
    const ul = h('ul', { class: 'f-baglist' });
    for (let n = from; n <= to; n++) {
      const it = byNo.get(n);
      if (!it) continue;
      const skipped = excluded.has(n);
      const cbId = nid('bag');
      const cb = h('input', { type: 'checkbox', id: cbId, role: 'switch' });
      cb.checked = checklist()[String(n)] === true;
      cb.disabled = skipped;
      const stateText = h('span', { class: 'chip f-bagstate', 'aria-hidden': 'true' });
      const setState = () => { stateText.textContent = skipped ? tr(ctx, 'f.not_counted', 'tidak dihitung', 'not counted') : cb.checked ? '✓ ' + tr(ctx, 'inventory.gobag.have', 'Ada') : tr(ctx, 'inventory.gobag.need', 'Perlu tambah'); stateText.className = 'chip f-bagstate' + (cb.checked && !skipped ? ' chip-ok' : ''); };
      cb.addEventListener('change', () => { const c = checklist(); c[String(n)] = cb.checked; ctx.save({ bag_checklist: c }); setState(); updateSum(); });
      setState();
      ul.append(h('li', { class: 'f-bagrow' + (skipped ? ' is-skipped' : '') }, h('label', { class: 'choice', for: cbId }, cb, h('span', { class: 'f-bag-text' }, h('span', { text: `${n}. ${lab(ctx, it.label)}` }), skipped ? h('span', { class: 'f-hint', text: (excluded.has(28) && n === 28) ? tr(ctx, 'inventory.gobag.skip_elder', 'Tidak ada lansia: item obat lansia tidak dihitung.') : tr(ctx, 'inventory.gobag.skip_infant', 'Tidak ada bayi atau balita: item perlengkapan bayi tidak dihitung.') }) : null), stateText)));
    }
    fs.append(ul);
    wrap.append(fs);
  }
  wrap.append(h('p', { class: 'f-hint', text: tr(ctx, 'inventory.gobag.bag_tip', 'Taruh tas di tempat yang mudah dijangkau dan pastikan semua orang di rumah tahu lokasinya.') }));
  updateSum();
  return wrap;
}

// =====================================================================
// DAYA LISTRIK
// =====================================================================
export function renderPower(root, ctx) {
  root.textContent = '';
  const pd = ctx.data.power;
  const lang = ctx.lang;
  const devs = pd.devices;
  const prof = getProfile(ctx);
  const getDev = () => cp(ctx.state.power_devices || {});
  const getPInv = () => cp(ctx.state.power_inventory || {});
  const saveDev = (d) => ctx.save({ power_devices: d });
  const savePInv = (o) => { ctx.save({ power_inventory: o }); syncInventory(o); };
  const targetDays = getTargetDays(ctx);
  const daysOf = () => { const o = ctx.state.power_inventory || {}; return Number.isFinite(o.outage_days) && o.outage_days > 0 ? o.outage_days : targetDays; };

  // sinkron: sumber daya yang diisi menandai item inventaris (hanya menaikkan 0 -> 1)
  function syncInventory(o) {
    const inv = inventoryOf(ctx);
    let changed = false;
    const set = (id, cond) => { if (cond && haveOf(inv[id]) < 1) { inv[id] = 1; changed = true; } };
    set('power_bank', (Number(o.power_bank_mah) || 0) > 0);
    set('power_station', (Number(o.power_station_wh) || 0) > 0);
    set('solar_panel', (Number(o.solar_wp) || 0) > 0);
    set('generator', (Number(o.generator_w) || 0) > 0);
    if (changed) ctx.save({ inventory: inv });
  }

  root.append(...pageHeader(ctx, tr(ctx, 'power.title', 'Daya listrik'), tr(ctx, 'power.intro', 'Hitung berapa listrik yang kamu perlukan saat padam, lalu bandingkan dengan yang kamu punya.')));
  const genWarnHost = h('div');
  root.append(genWarnHost);

  // 1. perangkat
  const devBox = h('section', { class: 'card f-section' }, h('h2', { text: tr(ctx, 'power.devices_title', 'Perangkat yang paling penting') }), h('p', { class: 'muted', text: tr(ctx, 'power.devices_intro', 'Pilih perangkat yang harus tetap menyala. Watt tipikal sudah terisi dan bisa kamu ganti.') }));
  if (prof.has_electric_medical) devBox.append(notice('warn', h('p', { text: tr(ctx, 'f.pick_medical', 'Di Profil kamu menandai ada alat medis listrik. Pilih alat medisnya di bawah (ditandai "Alat medis") agar daya ikut menentukan hari bertahan.', 'Your profile says you use electric medical equipment. Select it below (marked "Medical device") so power counts toward survival days.') }), h('p', { class: 'f-hint', text: tr(ctx, 'medical_label', '') || (pd.safety_messages.find((m) => m.key === 'medical_label') || {})[lang] || '' })));
  const devList = h('ul', { class: 'f-devlist' });
  const results = h('section', { class: 'card f-section', 'aria-live': 'polite' });

  function devRow(dev) {
    const sel = getDev()[dev.id];
    const cbId = nid('dev');
    const cb = h('input', { type: 'checkbox', id: cbId });
    cb.checked = !!sel;
    const detail = h('div', { class: 'f-devdetail' });
    const build = () => {
      detail.textContent = '';
      const cur = getDev()[dev.id];
      detail.hidden = !cur;
      if (!cur) return;
      const set = (patch) => { const d = getDev(); d[dev.id] = { ...(d[dev.id] || {}), ...patch }; for (const k of Object.keys(d[dev.id])) if (d[dev.id][k] == null) delete d[dev.id][k]; saveDev(d); renderResults(); };
      const grid = h('div', { class: 'f-three' });
      grid.append(
        numField(ctx, { label: tr(ctx, 'power.watts', 'Daya (watt)'), min: 1, max: 5000, rangeKey: 'power.validation.watts_range', value: cur.watts ?? dev.typical_w, unit: 'W', compact: true, onValue: (v) => set({ watts: v }) }).el,
        numField(ctx, { label: tr(ctx, 'power.hours', 'Jam pakai per hari'), min: 0, max: 24, rangeKey: 'power.validation.hours_range', value: cur.hours ?? dev.default_hours_per_day, compact: true, onValue: (v) => set({ hours: v == null ? 0 : v }) }).el,
        numField(ctx, { label: tr(ctx, 'f.qty', 'Jumlah', 'Quantity'), min: 1, max: 99, integer: true, value: cur.qty ?? 1, compact: true, onValue: (v) => set({ qty: v == null ? 1 : v }) }).el);
      detail.append(grid, h('p', { class: 'f-hint', text: tr(ctx, 'power.watts_hint', 'Lihat label di perangkat. Angka tipikal hanya perkiraan.') }));
      if (dev.surge_w > dev.typical_w * 1.5) detail.append(h('p', { class: 'f-hint', text: tr(ctx, 'power.surge_note', 'Perangkat bermotor (pompa, kulkas) butuh daya lebih besar saat menyala.') }));
    };
    cb.addEventListener('change', () => {
      const d = getDev();
      if (cb.checked) d[dev.id] = { qty: 1, hours: dev.default_hours_per_day, watts: dev.typical_w }; else delete d[dev.id];
      saveDev(d); build(); renderResults();
    });
    build();
    return h('li', { class: 'f-dev' + (dev.medical ? ' is-medical' : '') },
      h('label', { class: 'choice', for: cbId }, cb, h('span', null, h('strong', { text: lab(ctx, dev.label) }), ' ',
        dev.medical ? h('span', { class: 'chip chip-info', text: tr(ctx, 'power.medical_badge', 'Alat medis') }) : null,
        dev.power_hungry ? h('span', { class: 'chip chip-warn', text: tr(ctx, 'f.hungry', 'Boros daya', 'High power') }) : null)),
      detail);
  }
  for (const d of devs) devList.append(devRow(d));
  // perangkat sendiri
  const customs = h('ul', { class: 'f-devlist' });
  const buildCustoms = () => {
    customs.textContent = '';
    const d = getDev();
    for (const [id, s] of Object.entries(d)) {
      if (!id.startsWith('custom_')) continue;
      const set = (patch) => { const x = getDev(); x[id] = { ...x[id], ...patch }; saveDev(x); renderResults(); };
      const nameId = nid('cn');
      const nm = h('input', { type: 'text', id: nameId, maxlength: 60 }); nm.value = s.name || '';
      nm.addEventListener('input', () => set({ name: nm.value }));
      const medId = nid('cm');
      const med = h('input', { type: 'checkbox', id: medId }); med.checked = !!s.medical;
      med.addEventListener('change', () => set({ medical: med.checked }));
      customs.append(h('li', { class: 'f-dev' },
        h('div', { class: 'field' }, h('label', { for: nameId, text: tr(ctx, 'power.custom_name', 'Nama perangkat') }), nm),
        h('div', { class: 'f-three' },
          numField(ctx, { label: tr(ctx, 'power.watts', 'Daya (watt)'), min: 1, max: 5000, rangeKey: 'power.validation.watts_range', value: s.watts ?? '', unit: 'W', compact: true, onValue: (v) => set({ watts: v == null ? 0 : v }) }).el,
          numField(ctx, { label: tr(ctx, 'power.hours', 'Jam pakai per hari'), min: 0, max: 24, rangeKey: 'power.validation.hours_range', value: s.hours ?? 1, compact: true, onValue: (v) => set({ hours: v == null ? 0 : v }) }).el,
          numField(ctx, { label: tr(ctx, 'f.qty', 'Jumlah', 'Quantity'), min: 1, max: 99, integer: true, value: s.qty ?? 1, compact: true, onValue: (v) => set({ qty: v == null ? 1 : v }) }).el),
        h('label', { class: 'choice', for: medId }, med, h('span', { text: tr(ctx, 'power.medical_badge', 'Alat medis') })),
        h('button', { type: 'button', class: 'btn', onclick: () => { const x = getDev(); delete x[id]; saveDev(x); buildCustoms(); renderResults(); } }, tr(ctx, 'common.remove', 'Buang'))));
    }
  };
  devBox.append(devList, customs, h('button', { type: 'button', class: 'btn', onclick: () => { const x = getDev(); x['custom_' + Date.now().toString(36)] = { custom: true, name: '', watts: 0, hours: 1, qty: 1 }; saveDev(x); buildCustoms(); const last = customs.querySelector('li:last-child input'); if (last) last.focus(); } }, '+ ' + tr(ctx, 'power.add_custom', 'Tambah perangkat lain')));
  buildCustoms();
  root.append(devBox);

  // 2. hari tanpa listrik
  const outage = numField(ctx, { label: tr(ctx, 'power.outage_days', 'Berapa hari listrik padam yang ingin ditutup?'), hint: tr(ctx, 'power.outage_days_default', 'Sama dengan target: {n} hari', 'Same as target: {n} days', { n: targetDays }), min: 1, max: 365, integer: true, value: (ctx.state.power_inventory || {}).outage_days ?? '', unit: tr(ctx, 'f.days', 'hari', 'days'), onValue: (v) => { const o = getPInv(); if (v == null) delete o.outage_days; else o.outage_days = v; savePInv(o); renderResults(); } });
  root.append(h('section', { class: 'card f-section' }, outage.el));

  // 3. hasil kebutuhan + saran
  root.append(results);

  // 4. daya yang dimiliki
  const pi = getPInv();
  const own = (key, label, o) => numField(ctx, { label, min: 0, max: o.max ?? 1e7, rangeKey: 'power.validation.capacity_negative', value: pi[key] ?? '', unit: o.unit, hint: o.hint, compact: true, integer: o.integer, onValue: (v) => { const x = getPInv(); if (v == null) delete x[key]; else x[key] = v; savePInv(x); renderResults(); } }).el;
  const bankNote = h('p', { class: 'f-hint', 'aria-live': 'polite' });
  const bankWh = () => { const x = getPInv(); const s = P.storedEnergy({ power_bank_mah: x.power_bank_mah, power_bank_qty: x.power_bank_qty }, pd); bankNote.textContent = s.power_bank_nominal_wh > 0 ? tr(ctx, 'power.owned.power_bank_converted', 'Setara sekitar {n} Wh', 'About {n} Wh', { n: fmt(ctx, s.power_bank_nominal_wh, 1) }) : ''; };
  const ownBox = h('section', { class: 'card f-section' }, h('h2', { text: tr(ctx, 'power.owned_title', 'Daya yang kamu punya') }),
    h('h3', { text: tr(ctx, 'power.owned.power_bank', 'Power bank') }),
    h('div', { class: 'f-two' },
      numField(ctx, { label: tr(ctx, 'power.owned.power_bank_mah', 'Kapasitas (mAh)'), min: 0, max: 1e6, rangeKey: 'power.validation.capacity_negative', value: pi.power_bank_mah ?? '', unit: 'mAh', compact: true, onValue: (v) => { const x = getPInv(); if (v == null) delete x.power_bank_mah; else x.power_bank_mah = v; savePInv(x); bankWh(); renderResults(); } }).el,
      numField(ctx, { label: tr(ctx, 'f.qty', 'Jumlah', 'Quantity'), min: 1, max: 99, integer: true, value: pi.power_bank_qty ?? 1, compact: true, onValue: (v) => { const x = getPInv(); x.power_bank_qty = v == null ? 1 : v; savePInv(x); bankWh(); renderResults(); } }).el),
    bankNote, h('p', { class: 'f-hint', text: tr(ctx, 'power.owned.power_bank_note', 'Kapasitas mAh pada label diukur pada tegangan baterai, bukan 5 V, jadi hasil konversi hanya perkiraan.') }),
    h('h3', { text: tr(ctx, 'power.owned.power_station', 'Power station') }), own('power_station_wh', tr(ctx, 'power.owned.power_station_wh', 'Kapasitas (Wh)'), { unit: 'Wh' }),
    h('h3', { text: tr(ctx, 'power.owned.spare_battery', 'Baterai cadangan') }), own('spare_battery_wh', tr(ctx, 'power.owned.spare_battery_wh', 'Kapasitas total (Wh)'), { unit: 'Wh' }),
    h('h3', { text: tr(ctx, 'power.owned.generator', 'Genset') }), own('generator_w', tr(ctx, 'power.owned.generator_w', 'Daya (W)'), { unit: 'W' }), own('generator_fuel_hours', tr(ctx, 'power.owned.generator_fuel', 'Bahan bakar tersedia untuk berapa jam'), { unit: tr(ctx, 'f.hours', 'jam', 'hours') }),
    h('h3', { text: tr(ctx, 'power.solar_title', 'Isi ulang dengan panel surya') }), own('solar_wp', tr(ctx, 'power.owned.solar_wp', 'Daya puncak (Wp)'), { unit: 'Wp' }),
    own('solar_sun_hours', tr(ctx, 'power.solar_hours', 'Jam matahari efektif per hari'), { max: 12, hint: tr(ctx, 'f.sun_default', 'Kosongkan untuk memakai asumsi {n} jam.', 'Leave empty to use the assumed {n} hours.', { n: pd.constants.solar_peak_sun_hours_indonesia.value }) }));
  bankWh();
  root.append(ownBox);

  // 5. hasil dan keselamatan
  const safetyBox = h('section', { class: 'f-section' });
  root.append(safetyBox);
  const assumptions = h('details', { class: 'guide' }, h('summary', { text: tr(ctx, 'f.assumptions', 'Asumsi perhitungan', 'Calculation assumptions') }));
  const aul = h('ul', { class: 'f-list' });
  for (const [k, c] of Object.entries(pd.constants)) if (/ASUMSI/.test(c.evidence || '')) aul.append(h('li', { text: `${k.replace(/_/g, ' ')}: ${c.value}` }));
  assumptions.append(h('div', null, aul, h('p', { class: 'f-hint', text: tr(ctx, 'f.assumption_note', 'Angka bertanda asumsi bukan nilai resmi. Cek label perangkat Anda.', 'Figures marked as assumptions are not official values. Check your device label.') })));
  root.append(assumptions);

  function renderSafety() {
    safetyBox.textContent = '';
    const msg = (k) => (pd.safety_messages.find((m) => m.key === k) || {});
    const danger = ['co_outdoors', 'no_backfeed'];
    safetyBox.append(h('h2', { text: tr(ctx, 'f.safety', 'Keselamatan listrik', 'Electrical safety') }));
    safetyBox.append(hazardCard(ctx, tr(ctx, 'power.warn.co_title', 'Awas gas karbon monoksida (CO)'), (tr(ctx, 'power.warn.co_body', '') || msg('co_outdoors')[lang]) + ' ' + tr(ctx, 'power.warn.co_symptoms', ''), true),
      hazardCard(ctx, tr(ctx, 'power.warn.house_wiring_title', 'Jangan sambung genset ke instalasi rumah sendiri'), tr(ctx, 'power.warn.house_wiring_body', msg('no_backfeed')[lang] || ''), true),
      hazardCard(ctx, tr(ctx, 'power.warn.dry_title', 'Simpan di tempat kering'), tr(ctx, 'power.warn.dry_body', msg('battery_storage')[lang] || ''), false));
    const rest = pd.safety_messages.filter((m) => !danger.includes(m.key) && !['battery_storage', 'medical_plan', 'medical_label'].includes(m.key));
    safetyBox.append(h('details', { class: 'guide' }, h('summary', { text: tr(ctx, 'f.more_safety', 'Tips keselamatan lain', 'More safety tips') }), h('div', null, h('ul', { class: 'f-list' }, rest.map((m) => h('li', { text: m[lang] || m.id }))))));
  }
  // peringatan CO di atas layar saat genset diisi (role=alert hanya saat pertama muncul)
  let genShown = false;
  function updateGenWarn() {
    const on = (Number((ctx.state.power_inventory || {}).generator_w) || 0) > 0;
    if (on === genShown) return;
    genShown = on;
    genWarnHost.textContent = '';
    if (on) {
      const c = hazardCard(ctx, tr(ctx, 'power.warn.co_title', 'Awas gas karbon monoksida (CO)'), tr(ctx, 'power.warn.co_body', (pd.safety_messages.find((m) => m.key === 'co_outdoors') || {})[lang] || ''), true);
      c.setAttribute('role', 'alert');
      genWarnHost.append(c);
    }
  }

  function renderResults() {
    const days = daysOf();
    const s = P.summarize(ctx.state, pd, days);
    results.textContent = '';
    results.append(h('h2', { text: tr(ctx, 'power.need_title', 'Kebutuhan energi') }));
    if (!(s.wh_day > 0)) {
      results.append(h('p', { class: 'f-empty', text: tr(ctx, 'power.empty_state_title', 'Belum ada perangkat dipilih') }), h('p', { class: 'muted', text: tr(ctx, 'power.empty_state_body', 'Mulai dari HP dan lampu. Tambah yang lain bila perlu.') }));
    } else {
      results.append(
        h('p', { class: 'f-big' }, tr(ctx, 'power.wh_per_day', '{n} Wh per hari', '{n} Wh per day', { n: fmt(ctx, s.wh_day, 1) })),
        h('p', { text: tr(ctx, 'power.wh_total', '{n} Wh untuk {days} hari', '{n} Wh for {days} days', { n: fmt(ctx, s.wh_total, 0), days }) }),
        h('p', { class: 'f-hint', text: tr(ctx, 'power.wh_explain', 'Wh (watt-jam) adalah satuan energi: daya dikali jam pemakaian.') }),
        h('h3', { text: tr(ctx, 'power.recommend_title', 'Saran kapasitas power station') }),
        h('p', { class: 'f-big' }, tr(ctx, 'power.recommend_capacity', 'Kapasitas sekitar {n} Wh', 'Capacity of about {n} Wh', { n: fmt(ctx, s.recommended_capacity_wh, 0) })),
        h('p', { text: tr(ctx, 'power.recommend_output', 'Daya keluaran minimal {n} W', 'Minimum output power {n} W', { n: fmt(ctx, s.recommended_output_w, 0) }) }),
        h('p', { class: 'f-hint', text: tr(ctx, 'power.recommend_why', 'Sudah memperhitungkan efisiensi inverter dan cadangan kapasitas, serta daya perangkat terbesar.') }));
      if (s.recommended_capacity_wh > 5000) results.append(notice('warn', h('p', { text: tr(ctx, 'f.too_big', 'Kapasitas sebesar ini jarang realistis untuk rumah tangga. Bicarakan dengan dokter atau penyedia alat tentang rencana cadangan.', 'This capacity is rarely realistic for a household. Talk to your doctor or equipment provider about a backup plan.') })));
    }
    // daya dimiliki
    results.append(h('h3', { text: tr(ctx, 'power.owned_title', 'Daya yang kamu punya') }));
    if (!(s.stored.stored_wh > 0) && !(s.solar_wh_day > 0)) results.append(h('p', { class: 'f-empty', text: tr(ctx, 'power.coverage_none', 'Belum ada sumber daya yang diisi.') }));
    else {
      results.append(h('p', null, tr(ctx, 'power.owned_total', 'Total energi tersimpan: {n} Wh', 'Total stored energy: {n} Wh', { n: fmt(ctx, s.stored.stored_wh, 0) })));
      if (s.solar_wh_day > 0) results.append(h('p', { text: tr(ctx, 'power.solar_daily', 'Perkiraan {n} Wh per hari', 'About {n} Wh per day', { n: fmt(ctx, s.solar_wh_day, 0) }) }),
        h('p', { class: 'f-hint', text: s.wh_day > 0 ? (s.solar_wh_day >= s.wh_day ? tr(ctx, 'power.solar_self_sufficient', 'Panel ini bisa menutup kebutuhan harian perangkat yang kamu pilih.') : tr(ctx, 'power.solar_not_enough', 'Panel ini baru menutup sebagian kebutuhan harian.')) + ' ' + tr(ctx, 'power.solar_cloudy', 'Hasil panel turun saat mendung atau hujan.') : '' }));
      if (s.wh_day > 0) {
        if (s.days_power === 'self_sufficient') results.append(h('p', { class: 'f-big', text: tr(ctx, 'f.self_suff', 'Mandiri selama cuaca cerah', 'Self-sufficient while the weather is sunny') }));
        else if (typeof s.days_power === 'number') {
          results.append(h('p', { class: 'f-big', text: tr(ctx, 'power.coverage', 'Listrik cukup untuk ± {n} hari', 'Power lasts about {n} days', { n: fmt(ctx, s.days_power, 1) }) }));
          if (s.days_power + 1e-9 >= days) results.append(h('p', null, h('span', { class: 'chip chip-ok' }, '✓ ', tr(ctx, 'power.coverage_enough', 'Sudah cukup untuk target {n} hari.', 'Enough for the {n}-day target.', { n: days }))));
          else results.append(h('p', null, h('span', { class: 'chip chip-warn' }, '△ ', tr(ctx, 'power.coverage_short', 'Kurang sekitar {n} Wh untuk target.', 'About {n} Wh short of the target.', { n: fmt(ctx, s.short_wh, 0) }))));
        }
      }
    }
    // medis
    if (s.has_medical || prof.has_electric_medical) {
      const pm = s.days_power_medical;
      const med = h('div', { class: 'notice' + (typeof pm === 'number' && pm < days ? ' danger' : '') });
      med.append(h('p', null, h('strong', { text: tr(ctx, 'power.medical_badge', 'Alat medis') })), h('p', { text: tr(ctx, 'power.medical_gating', 'Karena ada alat medis yang butuh listrik, daya listrik ikut menentukan berapa hari kamu bisa bertahan.') }));
      if (typeof pm === 'number') med.append(h('p', { class: 'f-big', text: tr(ctx, 'f.medical_days', 'Alat medis: cukup ± {n} hari', 'Medical device: about {n} days', { n: fmt(ctx, pm, 1) }) }));
      else if (pm === 'self_sufficient') med.append(h('p', { class: 'f-big', text: tr(ctx, 'f.self_suff', 'Mandiri selama cuaca cerah') }));
      else med.append(h('p', { class: 'f-hint', text: tr(ctx, 'f.pick_medical_short', 'Pilih alat medis di atas untuk melihat hari daya.', 'Select the medical device above to see the days of power.') }));
      if (typeof pm === 'number' && pm < days) {
        const mp = pd.safety_messages.find((m) => m.key === 'medical_plan');
        med.append(h('p', null, h('span', { 'aria-hidden': 'true', text: '⚠ ' }), h('strong', { text: tr(ctx, 'f.medical_short', 'Daya alat medis kurang dari target {n} hari.', 'Medical device power is below the {n}-day target.', { n: days }) })), mp ? h('p', { text: mp[lang] || mp.id }) : null);
      }
      med.append(h('p', { class: 'f-hint', text: tr(ctx, 'power.medical_registry', '') }));
      results.append(med);
    }
    updateGenWarn();
  }
  renderSafety();
  renderResults();
  root.append(savedNote(ctx), navBar(ctx, { href: '#/inventaris', label: tr(ctx, 'nav.inventory', 'Stok') }, { href: '#/keluarga', label: tr(ctx, 'f.to_family', 'Lanjut ke evaluasi keluarga') }));
}

// =====================================================================
// EVALUASI KELUARGA (18 indikator)
// =====================================================================
export function renderIndicators(root, ctx) {
  root.textContent = '';
  const ind = ctx.data.indicators;
  // 3 pertanyaan singkat; tiap jawaban (0 sampai 2) berlaku untuk satu kelompok indikator BNPB, jadi skala 36 tetap sama.
  const Q = [
    { group: 'logistik', text: tr(ctx, 'quick.q1', 'Sudah punya tas siaga dan stok darurat?', 'Do you have a go-bag and emergency stock?'), opts: [tr(ctx, 'quick.a0', 'Belum', 'Not yet'), tr(ctx, 'quick.q1b', 'Sebagian', 'Some'), tr(ctx, 'quick.q1c', 'Sudah lengkap', 'All set')] },
    { group: 'prosedur', text: tr(ctx, 'quick.q2', 'Keluarga tahu harus berbuat apa saat darurat?', 'Does your family know what to do in an emergency?'), opts: [tr(ctx, 'quick.a0', 'Belum', 'Not yet'), tr(ctx, 'quick.q2b', 'Sedikit', 'A little'), tr(ctx, 'quick.q2c', 'Sudah latihan', 'Practiced')] },
    { group: 'mental', text: tr(ctx, 'quick.q3', 'Merasa siap menghadapi keadaan darurat?', 'Do you feel ready for an emergency?'), opts: [tr(ctx, 'quick.a0', 'Belum', 'Not yet'), tr(ctx, 'quick.q3b', 'Cukup', 'Fairly'), tr(ctx, 'quick.q3c', 'Siap', 'Ready')] },
  ];
  const idsOf = (g) => ind.indicators.filter((x) => x.group === g).map((x) => x.id);
  const current = (g) => {
    const vals = idsOf(g).map((id) => (ctx.state.indicators || {})[id]).filter((v) => typeof v === 'number');
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  };
  root.append(h('h1', { text: tr(ctx, 'family_eval.title', 'Kesiapan keluarga', 'Family readiness') }));
  const list = h('div', { class: 'f-quick' });
  for (const q of Q) {
    const name = nid('q');
    const fs = h('fieldset', { class: 'f-fieldset f-question' }, h('legend', { text: q.text }));
    const cur = current(q.group);
    const opts = h('div', { class: 'f-options' });
    q.opts.forEach((label, v) => {
      const id = nid('o');
      const r = h('input', { type: 'radio', name, id, value: String(v) });
      r.checked = cur === v;
      r.addEventListener('change', () => { if (!r.checked) return; const x = { ...(ctx.state.indicators || {}) }; for (const k of idsOf(q.group)) x[k] = v; ctx.save({ indicators: x }); });
      opts.append(h('label', { class: 'f-option', for: id }, r, h('span', { text: label })));
    });
    fs.append(opts);
    list.append(fs);
  }
  root.append(list, h('div', { class: 'f-nav' }, h('a', { class: 'btn btn-primary btn-block', href: '#/', text: tr(ctx, 'common.done', 'Selesai', 'Done') })));
}

export function destroy() { /* tidak ada pendengar global */ }
