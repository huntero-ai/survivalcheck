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
function savedNote(ctx) { return h('p', { class: 'muted f-saved', text: tr(ctx, 'common.saved_auto', 'Tersimpan otomatis di perangkat ini', 'Saved automatically on this device') }); }
function pageHeader(ctx, title, intro) {
  return [h('h1', { text: title }), intro ? h('p', { class: 'muted', text: intro }) : null];
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

  // 8. provinsi
  const provId = nid('prov');
  const sel = h('select', { id: provId });
  sel.append(h('option', { value: '', text: tr(ctx, 'profile.province_placeholder', 'Belum dipilih') }));
  PROVINCE_KEYS.map((k) => [k, ctx.t('provinces.' + k)]).sort((a, b) => a[1].localeCompare(b[1], 'id')).forEach(([k, name]) => { const o = h('option', { value: k, text: name }); if (p.province === k) o.selected = true; sel.append(o); });
  const jatim = h('p', { class: 'f-hint', text: tr(ctx, 'profile.province_note_jatim', 'Catatan: data IRBI Jawa Timur sama dengan DI Yogyakarta, jadi sarannya perlu kamu periksa lagi.') });
  jatim.hidden = p.province !== 'jawa_timur';
  sel.addEventListener('change', () => { upd((x) => { x.province = sel.value || null; }); jatim.hidden = sel.value !== 'jawa_timur'; });
  root.append(section(tr(ctx, 'profile.province_title', 'Provinsi'), h('div', { class: 'field' }, h('label', { for: provId, text: tr(ctx, 'profile.province_label', 'Pilih provinsi (opsional)') }), sel), h('p', { class: 'f-hint', text: tr(ctx, 'profile.province_hint', 'Kami memakai data risiko BNPB (IRBI 2024) untuk menyarankan jenis bencana. Kamu tetap bisa mengubahnya.') }), jatim));

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
  const prof = getProfile(ctx);
  let days = getTargetDays(ctx);
  let isCustom = !!(ctx.state.target && ctx.state.target.custom) || !presets.includes(days);
  const scenarioDefs = ctx.data.items.scenarios || ctx.data.scenarios || [];

  // saran provinsi: diterapkan sekali per provinsi (agar pilihan pengguna tidak ditimpa ulang)
  let scenarios = Array.isArray(ctx.state.scenarios) ? ctx.state.scenarios.slice() : [];
  let suggestedKey = null;
  if (prof.province) {
    suggestedKey = prof.province;
    if (prof.province_suggested_for !== prof.province) {
      const sug = provinceScenarios(ctx, prof.province);
      scenarios = [...new Set([...scenarios, ...sug])];
      const q = getProfile(ctx); q.province_suggested_for = prof.province;
      ctx.save({ scenarios, profile: q });
    }
  }
  const saveTarget = () => ctx.save({ target: { days, custom: isCustom } });
  if (!ctx.state.target) saveTarget();

  root.append(...pageHeader(ctx, tr(ctx, 'target.title', 'Target dan jenis bencana'), tr(ctx, 'target.intro', 'Berapa hari kamu ingin bisa bertahan di rumah tanpa bantuan dari luar?')));

  const summary = h('div', { class: 'notice', 'aria-live': 'polite' });
  const belowMin = h('p', { class: 'f-error f-soft', 'aria-live': 'polite' });

  // durasi
  const name = nid('dur');
  const fs = h('fieldset', { class: 'f-fieldset', role: 'radiogroup' }, h('legend', { text: tr(ctx, 'target.duration_title', 'Target lama bertahan') }));
  const customWrap = h('div', { class: 'f-sub' });
  const radios = [];
  const mkRadio = (value, labelText, badge) => {
    const id = nid('r');
    const r = h('input', { type: 'radio', name, id, value: String(value) });
    r.checked = value === 'custom' ? isCustom : (!isCustom && days === value);
    r.addEventListener('change', () => {
      if (!r.checked) return;
      if (value === 'custom') { isCustom = true; customWrap.hidden = false; customInput.input.focus(); }
      else { isCustom = false; days = value; customWrap.hidden = true; saveTarget(); }
      update();
    });
    radios.push(r);
    fs.append(h('label', { class: 'choice f-bigchoice', for: id }, r, h('span', null, labelText, badge ? h('span', { class: 'chip chip-info f-badge', text: badge }) : null)));
  };
  const customInput = numField(ctx, { label: tr(ctx, 'target.custom_label', 'Jumlah hari'), min: 1, max: R.defaults.target_custom_max, integer: true, rangeKey: 'target.validation.days_required', soft: 90, value: isCustom ? days : '', onValue: (v) => { if (v != null) { days = v; saveTarget(); update(); } } });
  for (const d of presets) mkRadio(d, tr(ctx, 'target.d' + d, d + ' hari', d + ' days'), d === R.defaults.target_days ? tr(ctx, 'target.default_badge', 'Disarankan') : null);
  mkRadio('custom', tr(ctx, 'target.custom', 'Lainnya'));
  customWrap.append(customInput.el);
  customWrap.hidden = !isCustom;
  fs.append(customWrap);
  root.append(h('section', { class: 'card f-section' }, fs, h('p', { class: 'f-hint', text: tr(ctx, 'target.bnpb_min', 'Minimum BNPB: 3 hari (72 jam). Banyak negara kini menganjurkan 7 hari atau lebih.') }), belowMin));

  // air 3 L vs 2 L
  let dismissed = false;
  try { dismissed = window.localStorage.getItem('survivalcheck.dismiss.water3l') === '1'; } catch (e) { dismissed = false; }
  if (!dismissed) {
    const card = notice('', h('p', null, h('strong', { text: tr(ctx, 'warnings.label', 'Perhatian') + ': ' }), tr(ctx, 'warnings.water_3l', 'BNPB menyebut minimum 2 liter air minum per orang per hari. SurvivalCheck memakai 3 liter.')),
      h('button', { type: 'button', class: 'btn', onclick: () => { card.remove(); try { window.localStorage.setItem('survivalcheck.dismiss.water3l', '1'); } catch (e) { /* abaikan */ } } }, tr(ctx, 'common.close', 'Tutup')));
    root.append(card);
  }

  // skenario
  const scFs = h('fieldset', { class: 'f-fieldset f-scenarios' }, h('legend', { text: tr(ctx, 'target.scenario_title', 'Jenis bencana yang ingin disiapkan') }),
    h('p', { class: 'f-hint', text: tr(ctx, 'target.scenario_intro', 'Pilih satu atau lebih. Barang yang sama tidak dihitung dua kali, dan kebutuhan yang paling besar yang dipakai.') }));
  if (suggestedKey) {
    const sug = provinceScenarios(ctx, suggestedKey);
    scFs.append(notice('', h('strong', { text: tr(ctx, 'target.scenario_suggested', 'Disarankan untuk {province}', 'Suggested for {province}', { province: ctx.t('provinces.' + suggestedKey) }) }),
      h('p', { text: sug.map((id) => lab(ctx, (scenarioDefs.find((s) => s.id === id) || {}).label) || id).join(', ') }),
      h('p', { class: 'f-hint', text: tr(ctx, 'target.scenario_suggested_hint', 'Berdasarkan data risiko BNPB. Hapus centang bila tidak sesuai.') })));
  } else {
    scFs.append(h('p', { class: 'f-hint' }, tr(ctx, 'f.no_province', 'Belum memilih provinsi? ', 'No province selected? '), h('a', { href: '#/profil', text: tr(ctx, 'profile.province_title', 'Pilih provinsi') })));
  }
  const INTL = new Set(['conflict', 'nuclear']);
  const noteIntl = h('p', { class: 'f-hint', text: tr(ctx, 'scenarios.note_international', 'Belum ada panduan khusus untuk warga Indonesia. Isi di sini disusun dari panduan resmi negara lain dan lembaga internasional.') });
  const outageNote = h('p', { class: 'f-hint' }, tr(ctx, 'scenarios.power_outage_desc', 'Mengaktifkan modul Daya Listrik'), ' ', h('a', { href: '#/daya', text: tr(ctx, 'power.title', 'Daya listrik') }));
  const grid = h('div', { class: 'f-cards' });
  for (const s of scenarioDefs) {
    const id = nid('sc');
    const cb = h('input', { type: 'checkbox', id, value: s.id });
    cb.checked = scenarios.includes(s.id);
    cb.addEventListener('change', () => {
      scenarios = cb.checked ? [...new Set([...scenarios, s.id])] : scenarios.filter((x) => x !== s.id);
      ctx.save({ scenarios });
      card.classList.toggle('is-checked', cb.checked); mark.textContent = cb.checked ? '✓' : '';
      update();
    });
    const mark = h('span', { class: 'f-check', 'aria-hidden': 'true', text: cb.checked ? '✓' : '' });
    const card = h('label', { class: 'f-card' + (cb.checked ? ' is-checked' : ''), for: id }, cb, mark,
      h('span', { class: 'f-card-body' },
        h('strong', { text: lab(ctx, s.label) }),
        h('span', { class: 'f-hint', text: tr(ctx, 'scenarios.' + s.id + '_desc', '') }),
        INTL.has(s.id) ? h('span', { class: 'chip chip-info f-badge', text: tr(ctx, 'scenarios.label_international', 'Rujukan internasional') }) : null));
    grid.append(card);
  }
  scFs.append(grid, noteIntl, outageNote);
  root.append(h('section', { class: 'card f-section' }, scFs, h('p', { class: 'f-hint', text: tr(ctx, 'target.scenario_none', 'Tidak memilih jenis bencana tertentu? Paket inti tetap dihitung.') })), summary);

  function update() {
    // ringkasan aturan (C3) dari rules.scenario_rules
    const SR = (R.scenario_rules && R.scenario_rules.scenarios) || {};
    const sel = scenarios.map((s) => ({ id: s, ...(SR[s] || {}) }));
    const maxOf = (k, base) => sel.reduce((m, s) => (typeof s[k] === 'number' ? Math.max(m, s[k]) : m), base);
    const eff = Math.max(days, maxOf('effective_target_min_days', 0));
    const water = maxOf('water_drinking_l_per_person_day', R.water.drinking_l_per_person_day);
    const meds = Math.max(eff, R.meds.min_days, maxOf('meds_min_days', 0));
    summary.textContent = '';
    summary.append(h('strong', { text: tr(ctx, 'target.effective_duration', 'Durasi efektif: {n} hari', 'Effective duration: {n} days', { n: eff }) }));
    if (eff > days) {
      const cause = sel.filter((s) => (s.effective_target_min_days || 0) > days).map((s) => lab(ctx, (scenarioDefs.find((d) => d.id === s.id) || {}).label)).join(', ');
      summary.append(h('p', { text: tr(ctx, 'target.effective_duration_why', 'Karena {scenario}, target dinaikkan dari {from} ke {to} hari.', 'Because of {scenario}, the target is raised from {from} to {to} days.', { scenario: cause, from: days, to: eff }) }));
    }
    if (water > R.water.drinking_l_per_person_day) summary.append(h('p', { text: tr(ctx, 'target.water_raised', 'Air minum dinaikkan menjadi {n} L per orang per hari.', 'Drinking water is raised to {n} L per person per day.', { n: water }) }));
    if (water > R.water.drinking_l_per_person_day) summary.append(h('p', { class: 'f-hint', 'data-note': 'water-careful', text: tr(ctx, 'target.water_careful', 'Angka hati-hati: 4 L berasal dari panduan untuk cuaca panas (Latvia), bukan khusus kekeringan. Anggap sebagai batas aman, bukan angka pasti.', 'Cautious figure: 4 L comes from hot-weather guidance (Latvia), not drought-specific. Treat it as a safe margin, not an exact number.') }));
    if (meds > Math.max(eff, R.meds.min_days)) summary.append(h('p', { text: tr(ctx, 'target.medicine_raised', 'Stok obat rutin dinaikkan menjadi {n} hari.', 'Routine medicine stock is raised to {n} days.', { n: meds }) }));
    belowMin.textContent = days < R.defaults.bnpb_minimum_days ? tr(ctx, 'target.below_min', 'Target di bawah 3 hari berarti di bawah minimum BNPB. Kamu tetap boleh memakainya.') : (days > 90 ? tr(ctx, 'target.validation.days_large', 'Target lebih dari 90 hari jarang realistis. Tetap lanjut?') : '');
  }
  update();
  root.append(savedNote(ctx), navBar(ctx, { href: '#/profil', label: tr(ctx, 'common.back', 'Kembali') }, { href: '#/inventaris', label: tr(ctx, 'common.next', 'Lanjut') }));
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
function isQuick(ctx) { return !!(ctx.state.settings && ctx.state.settings.mode === 'quick'); }
function isCoreItem(it) { return it.priority === 'critical' || (it.gating && it.min_tier_gating != null && it.min_tier_gating <= 2); }
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
  const list = items(ctx).filter((it) => set.has(it.id) && it.category === catId);
  const quick = isQuick(ctx);
  const shown = quick ? list.filter(isCoreItem) : list;
  const filled = shown.filter((it) => isFilled(ctx, it)).length;
  const prog = res.status === 'ok' ? res.category_progress[catId] : null;
  return { total: shown.length, filled, prog };
}

function renderCategoryList(root, ctx, res, cats) {
  root.append(...pageHeader(ctx, tr(ctx, 'inventory.title', 'Persediaan'), tr(ctx, 'inventory.intro', 'Isi yang kamu punya sekarang. Angka kira-kira sudah cukup.')));
  if (res.status !== 'ok') root.append(notice('warn', h('p', { text: tr(ctx, 'profile.validation.no_people', 'Isi minimal satu orang agar perhitungan bisa dimulai.') }), h('a', { class: 'btn', href: '#/profil', text: tr(ctx, 'nav.profile', 'Profil') })));
  // mode cepat/lengkap
  const mode = isQuick(ctx) ? 'quick' : 'full';
  const modeBtn = (m, text) => h('button', { type: 'button', class: 'btn', 'aria-pressed': String(mode === m), onclick: () => { const s = cp(ctx.state.settings || {}); s.mode = m; ctx.save({ settings: s }); renderInventory(root, ctx, {}); } }, text);
  root.append(h('div', { class: 'btn-row', role: 'group', 'aria-label': tr(ctx, 'home.mode_hint', 'Mode isian') }, modeBtn('quick', tr(ctx, 'inventory.mode_quick', 'Cepat')), modeBtn('full', tr(ctx, 'inventory.mode_full', 'Lengkap'))));
  if (mode === 'quick') root.append(notice('', h('p', { text: tr(ctx, 'inventory.quick_banner', 'Mode cepat: hanya pertanyaan inti. Hasil sementara bisa kurang akurat.') })));
  if (res.status === 'ok') {
    const allFilled = cats.every((c) => categoryStats(ctx, res, c.id).filled === 0);
    if (allFilled) root.append(notice('', h('strong', { text: tr(ctx, 'inventory.empty_state_title', 'Belum ada yang diisi') }), h('p', { text: tr(ctx, 'inventory.empty_state_body', 'Tidak apa-apa. Mulai dari satu kategori, misalnya air. Setiap isian langsung tersimpan.') })));
  }
  root.append(h('p', null, h('a', { class: 'btn', href: '#/hasil', text: tr(ctx, 'f.see_result', 'Lihat hasil sementara', 'See interim result') })));
  const ul = h('ul', { class: 'f-catlist' });
  for (const c of cats) {
    const st = categoryStats(ctx, res, c.id);
    const na = st.total === 0;
    let chip;
    if (na) chip = h('span', { class: 'chip' }, tr(ctx, 'common.not_applicable', 'Tidak berlaku untuk rumah tangga ini'));
    else if (st.filled === 0) chip = statusChip(ctx, 'none');
    else if (st.prog != null && st.prog >= 99.95) chip = statusChip(ctx, 'ok');
    else chip = statusChip(ctx, 'short');
    const pct = st.prog == null ? 0 : st.prog;
    const nm = lab(ctx, c.label);
    const desc = tr(ctx, 'categories.' + c.id + '_desc', '');
    const prog = tr(ctx, 'inventory.category_progress', '{done} dari {total} terisi', '{done} of {total} filled', { done: st.filled, total: st.total });
    const link = h('a', { class: 'f-catcard', href: '#/inventaris/' + c.id, 'aria-label': `${nm}, ${prog}` },
      h('span', { class: 'f-cat-top' }, h('strong', { text: nm }), chip),
      desc ? h('span', { class: 'f-hint', text: desc }) : null,
      na ? null : h('span', { class: 'f-cat-prog' },
        h('span', { class: 'f-bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(pct)), 'aria-label': tr(ctx, 'a11y.progress_bar', 'Kemajuan {pct} persen', 'Progress {pct} percent', { pct: Math.round(pct) }) }, h('span', { class: 'f-bar-fill', style: `width:${Math.min(100, Math.max(0, pct))}%` })),
        h('span', { class: 'f-cat-pct', text: `${fmt(ctx, pct, 0)}% · ${prog}` })));
    ul.append(h('li', null, link));
  }
  root.append(ul, savedNote(ctx), navBar(ctx, { href: '#/target', label: tr(ctx, 'common.back', 'Kembali') }, { href: '#/keluarga', label: tr(ctx, 'f.to_family', 'Lanjut ke evaluasi keluarga', 'Continue to family evaluation') }));
}

function renderCategory(root, ctx, def, cats) {
  const idx = cats.findIndex((c) => c.id === def.id);
  root.append(h('a', { class: 'back-link', href: '#/inventaris', text: '← ' + tr(ctx, 'nav.inventory', 'Stok') }));
  root.append(...pageHeader(ctx, lab(ctx, def.label), tr(ctx, 'categories.' + def.id + '_desc', '')));
  const quick = isQuick(ctx);
  if (quick) root.append(notice('', h('p', { text: tr(ctx, 'inventory.quick_banner', 'Mode cepat: hanya pertanyaan inti.') }), h('button', { type: 'button', class: 'btn', onclick: () => { const s = cp(ctx.state.settings || {}); s.mode = 'full'; ctx.save({ settings: s }); renderInventory(root, ctx, { category: def.id }); } }, tr(ctx, 'inventory.switch_to_full', 'Lengkapi dengan mode lengkap'))));

  const res0 = ev(ctx);
  if (res0.status !== 'ok') {
    root.append(notice('warn', h('p', { text: tr(ctx, 'profile.validation.no_people', 'Isi minimal satu orang agar perhitungan bisa dimulai.') }), h('a', { class: 'btn', href: '#/profil', text: tr(ctx, 'nav.profile', 'Profil') })));
    return;
  }
  const applicable = new Set(res0.applicable_ids);
  let list = items(ctx).filter((it) => it.category === def.id && applicable.has(it.id));
  if (quick) list = list.filter(isCoreItem);

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

  if (def.id === 'water') root.append(notice('', h('p', { text: tr(ctx, 'inventory.water_note', 'Kami memakai 3 L per orang per hari untuk minum dan masak. Air kebersihan 2 L per orang per hari adalah saran.') })));
  if (def.id === 'water' && res0.household.water_l_per_person_day > rules(ctx).water.drinking_l_per_person_day) root.append(notice('', h('p', { 'data-note': 'water-careful', text: tr(ctx, 'target.water_careful', 'Angka hati-hati: 4 L berasal dari panduan untuk cuaca panas (Latvia), bukan khusus kekeringan. Anggap sebagai batas aman, bukan angka pasti.', 'Cautious figure: 4 L comes from hot-weather guidance (Latvia), not drought-specific. Treat it as a safe margin, not an exact number.') })));
  if (def.id === 'power') root.append(notice('', h('p', { text: tr(ctx, 'categories.power_desc', 'Power bank, power station, panel surya') }), h('a', { class: 'btn', href: '#/daya', text: tr(ctx, 'power.title', 'Daya listrik') + ' →' })));
  if (def.id === 'plan_knowledge') root.append(notice('', h('a', { class: 'btn', href: '#/keluarga', text: tr(ctx, 'family_eval.title', 'Evaluasi keluarga') + ' →' })));

  let foodTotal = null;
  let updateFoodTotals = () => {};
  if (def.id === 'food') {
    const fb = buildFoodSection(ctx, res0, refreshLive);
    foodTotal = fb.totals; updateFoodTotals = fb.update;
    root.append(fb.el);
  }
  if (def.id === 'gobag') root.append(buildBagChecklist(ctx, res0, root));

  const FOOD_SKIP = new Set([...(rules(ctx).food.aggregates), 'food_kcal_total', 'food_no_cook_share']);
  const ul = h('ul', { class: 'f-itemlist' });
  for (const it of list) {
    if (FOOD_SKIP.has(it.id)) continue;
    ul.append(buildItemRow(ctx, it, res0, refreshLive, live));
  }
  if (ul.children.length) root.append(h('h2', { class: 'f-h2', text: def.id === 'gobag' || def.id === 'food' ? tr(ctx, 'f.other_items', 'Item lainnya', 'Other items') : tr(ctx, 'f.items', 'Daftar item', 'Items') }), ul);
  refreshLive();

  const prev = cats[idx - 1];
  const next = cats[idx + 1];
  root.append(savedNote(ctx), navBar(ctx,
    prev ? { href: '#/inventaris/' + prev.id, label: '← ' + lab(ctx, prev.label) } : { href: '#/inventaris', label: tr(ctx, 'common.back', 'Kembali') },
    next ? { href: '#/inventaris/' + next.id, label: tr(ctx, 'f.next_category', 'Kategori berikutnya: {name}', 'Next category: {name}', { name: lab(ctx, next.label) }) } : { href: '#/keluarga', label: tr(ctx, 'f.to_family', 'Lanjut ke evaluasi keluarga') }));
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
      if (loc === 'both') body.append(locationSelect(ctx, it, cur, label, refreshLive));
      else body.append(switchRow(ctx, { label: tr(ctx, 'inventory.have_yes', 'Sudah punya'), checked: haveOf(cur) > 0, onChange: (on) => { setInv(ctx, it.id, on ? 1 : 0); refreshLive(); } }).el);
    } else if (loc === 'both') {
      const c = cur && typeof cur === 'object' ? cur : { home: typeof cur === 'number' ? cur : 0, bag: 0 };
      const row = h('div', { class: 'f-two' });
      for (const [k, lk, fb] of [['bag', 'inventory.location.bag', 'Di tas siaga'], ['home', 'inventory.location.home', 'Stok rumah']]) {
        row.append(numField(ctx, { label: `${tr(ctx, lk, fb)}${unit ? ' (' + unit + ')' : ''}`, min: 0, max: 1e7, soft: 100000, value: c[k] || '', compact: true, onValue: (v) => { const x = cp((ctx.state.inventory || {})[it.id]); const o = x && typeof x === 'object' ? x : { home: typeof x === 'number' ? x : 0, bag: 0 }; o[k] = v == null ? 0 : v; setInv(ctx, it.id, o); refreshLive(); } }).el);
      }
      body.append(row);
    } else {
      body.append(numField(ctx, { label, min: 0, max: 1e7, soft: 100000, value: haveOf(cur) || (cur === 0 ? 0 : ''), compact: true, onValue: (v) => { setInv(ctx, it.id, v); refreshLive(); } }).el);
    }
  }
  li.append(body, sourceLine(ctx, it));
  live.set(it.id, { chipHost, needEl, it });
  return li;
}

function locationSelect(ctx, it, cur, label, refreshLive) {
  const id = nid('loc');
  const c = cur && typeof cur === 'object' ? cur : { home: haveOf(cur) > 0 ? 1 : 0, bag: 0 };
  const state = (c.home > 0 ? 1 : 0) * 2 + (c.bag > 0 ? 1 : 0); // 0 tidak, 1 tas, 2 rumah, 3 keduanya
  const sel = h('select', { id });
  [['0', tr(ctx, 'inventory.have_no', 'Belum punya')], ['1', tr(ctx, 'inventory.location.bag', 'Di tas siaga')], ['2', tr(ctx, 'inventory.location.home', 'Stok rumah')], ['3', tr(ctx, 'inventory.location.both', 'Di tas dan di rumah')]].forEach(([v, t]) => { const o = h('option', { value: v, text: t }); if (Number(v) === state) o.selected = true; sel.append(o); });
  sel.addEventListener('change', () => { const n = Number(sel.value); setInv(ctx, it.id, { home: n >= 2 ? 1 : 0, bag: n === 1 || n === 3 ? 1 : 0 }); refreshLive(); });
  return h('div', { class: 'field' }, h('label', { for: id, text: tr(ctx, 'inventory.location_title', 'Disimpan di mana?') }), sel);
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
  root.append(notice('', h('p', { text: tr(ctx, 'f.estimate_note', 'Semua angka watt adalah perkiraan. Cek label perangkat Anda.', 'All wattage figures are estimates. Check your device label.') })));
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
  const groups = ind.groups;
  const GROUP_KEY = { logistik: 'logistics', prosedur: 'procedures', mental: 'mental' };
  root.append(...pageHeader(ctx, tr(ctx, 'family_eval.title', 'Evaluasi keluarga'), tr(ctx, 'family_eval.intro', 'Delapan belas pertanyaan dari BNPB untuk melihat kesiapan keluarga. Jawab apa adanya, tidak ada nilai buruk.')));
  const scoreEl = h('div', { class: 'card f-section f-famscore' });
  const answered = h('p', { class: 'muted' });
  const updateScore = () => {
    const vals = ctx.state.indicators || {};
    let total = 0; let n = 0;
    for (let i = 1; i <= 18; i++) { const v = vals['ind_' + String(i).padStart(2, '0')]; if (typeof v === 'number') { total += v; n++; } }
    scoreEl.textContent = '';
    const band = (ind.family_bands.find((b) => total >= b.min && total <= b.max) || {}).id;
    const bt = { rawan: ['○ ', tr(ctx, 'bands.family.vulnerable', 'Rawan'), ''], cukup_siaga: ['◑ ', tr(ctx, 'bands.family.fairly_prepared', 'Cukup Siaga'), 'chip-warn'], siap: ['✓ ', tr(ctx, 'bands.family.ready', 'Siap'), 'chip-ok'] }[band] || ['', '', ''];
    scoreEl.append(h('p', null, h('strong', { text: tr(ctx, 'family_eval.score_total', 'Skor: {score} dari 36', 'Score: {score} of 36', { score: total }) }), ' ', n ? h('span', { class: 'chip ' + bt[2] }, h('span', { 'aria-hidden': 'true', text: bt[0] }), bt[1]) : null),
      h('p', { class: 'f-hint', text: `${n} / 18 ` + tr(ctx, 'f.answered', 'terjawab', 'answered') }),
      h('p', { class: 'f-hint', text: tr(ctx, 'bands.family.rule', 'Skor 0 sampai 12 rawan, 13 sampai 24 cukup siaga, 25 sampai 36 siap.') }));
    if (!n) scoreEl.append(h('p', { class: 'f-empty', text: tr(ctx, 'family_eval.empty_state', 'Belum dijawab. Mulai dari pertanyaan pertama.') }));
  };
  root.append(scoreEl);
  const scaleLabel = (v) => tr(ctx, 'family_eval.option.' + v, lab(ctx, ind.scale.find((s) => s.value === v).label));
  for (const g of groups) {
    const sec = h('section', { class: 'card f-section' }, h('h2', { text: tr(ctx, 'family_eval.group.' + (GROUP_KEY[g.id] || g.id), lab(ctx, g.label)) }));
    for (const q of ind.indicators.filter((x) => x.group === g.id)) {
      const name = q.id;
      const fs = h('fieldset', { class: 'f-fieldset f-question' }, h('legend', { text: `${q.no}. ${tr(ctx, 'family_eval.q.' + q.no, lab(ctx, q.label))}` }));
      if (q.scenario_specific) fs.append(h('p', { class: 'f-hint', text: tr(ctx, 'family_eval.context_quake_flood', 'Pertanyaan ini terutama untuk gempa atau banjir. Tetap dijawab agar skor sebanding dengan standar BNPB.') }));
      const cur = (ctx.state.indicators || {})[q.id];
      const opts = h('div', { class: 'f-options' });
      for (const v of [0, 1, 2]) {
        const id = nid('q');
        const r = h('input', { type: 'radio', name, id, value: String(v) });
        r.checked = cur === v;
        r.addEventListener('change', () => { if (r.checked) { const x = { ...(ctx.state.indicators || {}) }; x[q.id] = v; ctx.save({ indicators: x }); updateScore(); } });
        opts.append(h('label', { class: 'f-option', for: id }, r, h('span', { text: scaleLabel(v) })));
      }
      fs.append(opts);
      sec.append(fs);
    }
    root.append(sec);
  }
  root.append(savedNote(ctx),
    h('p', { class: 'f-hint', text: tr(ctx, 'f.skip_warn', 'Bila dilewati, belum dijawab dihitung 0. Tier 2 butuh skor minimal 13 dan tier 4 minimal 25.', 'Unanswered counts as 0. Tier 2 needs a score of at least 13 and tier 4 at least 25.') }),
    navBar(ctx, { href: '#/inventaris', label: tr(ctx, 'nav.inventory', 'Stok') }, { href: '#/hasil', label: tr(ctx, 'common.done', 'Selesai') }));
  updateScore();
}

export function destroy() { /* tidak ada pendengar global */ }
