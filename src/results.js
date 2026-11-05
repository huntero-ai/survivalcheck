// SurvivalCheck - layar Hasil (E3). Hanya MEMBACA `result` dari engine.
// Aman XSS: semua teks lewat createTextNode / textContent, tanpa innerHTML.

import { glyph } from './icons.js';

const TIER_ICON = ['○', '◔', '◑', '◕', '●', '●★'];
const BAND_BAG = { siap: ['ready', 'check'], perlu_dilengkapi: ['needs_work', 'tri'], belum_siap: ['not_ready', 'circle'] };
const BAND_FAMILY = { rawan: ['vulnerable', 'circle'], cukup_siaga: ['fairly_prepared', 'half'], siap: ['ready', 'check'] };
const BOTTLENECK_KEY = { water: 'water', food: 'kcal', meds: 'meds', infant_food: 'baby_food', power: 'power_medical' };
const PRIORITY_KEY = { critical: 'critical', important: 'important', extra: 'nice', nice: 'nice' };
const SCORE_MAX = { critical_stock: 55, bag: 20, family: 15, scenario: 10 };
const SCORE_KEY = { critical_stock: 'critical', bag: 'bag', family: 'family', scenario: 'scenario' };
const SHORTFALL_PAGE = 25;

export function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v == null) continue;
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? '' : String(v));
  }
  for (const c of kids.flat()) {
    if (c == null || c === false) continue;
    e.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return e;
}

/** Terjemahan dengan fallback bila kunci kurang (ctx.t mengembalikan kunci / kosong). */
export function tr(ctx, key, fallback, vars) {
  let v;
  try { v = ctx && ctx.t ? ctx.t(key, vars) : undefined; } catch (e) { v = undefined; }
  if (v == null || v === '' || v === key) return fill(fallback == null ? key : fallback, vars);
  return v;
}
export function fill(s, vars) {
  return String(s).replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] != null ? vars[k] : m));
}
export function fmt(n, lang) {
  if (n == null || Number.isNaN(n)) return '';
  if (Number.isInteger(n)) return String(n);
  try { return n.toLocaleString(lang === 'en' ? 'en-US' : 'id-ID', { maximumFractionDigits: 1 }); } catch (e) { return String(n); }
}
export const arr = (d, key) => (Array.isArray(d) ? d : (d && Array.isArray(d[key]) ? d[key] : []));
export function indexById(list) {
  const m = {};
  for (const x of list) if (x && x.id) m[x.id] = x;
  return m;
}
export function loc(obj, lang) {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.id || obj.en || '';
}

function ensureCss(root) {
  if (typeof document === 'undefined' || document.getElementById('sc-results-css')) return;
  const mk = (id, file, media) => {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.id = id; l.href = new URL('../styles/' + file, import.meta.url).href;
    if (media) l.media = media;
    document.head.append(l);
  };
  mk('sc-results-css', 'results.css');
  mk('sc-print-css', 'print.css', 'print');
}

export async function loadResult(ctx) {
  try {
    const eng = await import('./engine.js');
    if (eng && typeof eng.evaluate === 'function') return { result: eng.evaluate(ctx.state, ctx.data), fixture: false };
  } catch (e) { /* engine gagal dimuat: jangan menampilkan data uji */ }
  return { result: null, fixture: false };
}

/** Daftar kekurangan ternormalisasi + diperkaya dari items.json. */
export function normalizeShortfall(result, itemsById) {
  const src = (result && (result.shortfall || result.shortfall_head)) || [];
  return src.map((s) => {
    const it = itemsById[s.id] || {};
    return Object.assign({ category: it.category, priority: it.priority || 'important', min_tier_gating: it.min_tier_gating }, s,
      { priority: s.priority || it.priority || 'important' });
  });
}

function link(href, text, cls) { return h('a', { href, class: 'sc-btn ' + (cls || ''), text }); }

function tierCard(ctx, result) {
  const n = result.tier.value;
  const name = tr(ctx, `tiers.${n}.name`, (result.tier.label && loc(result.tier.label, ctx.lang)) || `Tier ${n}`);
  const label = tr(ctx, 'a11y.tier_badge', 'Tingkat kesiapan: tier {n}, {name}', { n, name });
  const seg = h('span', { class: 'sc-segs', role: 'img', 'aria-label': tr(ctx, 'tiers.segments_label', '{n} dari 5 segmen terisi', { n }) });
  for (let i = 1; i <= 5; i++) seg.append(h('span', { class: 'sc-seg' + (i <= n ? ' on' : ''), 'aria-hidden': 'true' }));
  return h('section', { class: `sc-card sc-tier tier-${n}`, 'aria-labelledby': 'sc-tier-h' },
    h('h2', { id: 'sc-tier-h', class: 'sc-sr', text: tr(ctx, 'result.tier_heading', 'Tingkat kesiapan kamu') }),
    h('div', { class: 'sc-badge', role: 'img', 'aria-label': label },
      h('span', { class: 'sc-badge-icon', 'aria-hidden': 'true', text: TIER_ICON[n] }),
      h('span', { class: 'sc-badge-text', 'aria-hidden': 'true' },
        h('span', { class: 'sc-badge-num', text: tr(ctx, 'tiers.of', 'Tier {n} dari 5', { n }) }),
        n === 2 ? h('span', { class: 'sc-chip sc-chip-bnpb', text: tr(ctx, 'tiers.bnpb_badge', 'BNPB') }) : null,
        n >= 3 ? h('span', { class: 'sc-chip sc-chip-bnpb', text: tr(ctx, 'tiers.beyond_bnpb', 'Melampaui standar BNPB') }) : null)),
    seg,
    h('p', { class: 'sc-tier-name', text: name }),
    h('p', { class: 'sc-muted', text: tr(ctx, `tiers.${n}.summary`, '') }));
}

function survivalCard(ctx, result) {
  const s = result.survival || {};
  const target = result.targets && result.targets.effective_target_days;
  const days = s.days_exact != null && s.days_exact < 1 ? tr(ctx, 'result.survive_less_than_one', 'kurang dari 1 hari')
    : s.days > 365 ? tr(ctx, 'result.survive_over_year', '> 365 hari')
    : tr(ctx, 'result.survive_value', '± {n} hari', { n: s.days });
  const ok = target != null && s.days_exact != null && s.days_exact >= target;
  const resource = tr(ctx, 'result.bottleneck.' + (BOTTLENECK_KEY[s.bottleneck] || s.bottleneck), s.bottleneck || '');
  const line = ok ? tr(ctx, 'result.bottleneck_ok', 'Semua sumber daya utama cukup untuk target.')
    : tr(ctx, 'result.bottleneck_line', '{resource} habis lebih dulu, sekitar hari ke-{n}.', { resource, n: Math.min(365, Math.max(1, s.days || 0)) });
  return h('section', { class: 'sc-card', 'aria-labelledby': 'sc-surv-h' },
    h('h2', { id: 'sc-surv-h', text: tr(ctx, 'result.survive_heading', 'Saat ini bisa bertahan') }),
    h('p', { class: 'sc-display', 'aria-live': 'polite', text: days }),
    target != null ? h('p', { class: 'sc-muted', text: tr(ctx, 'result.survive_target', 'Target kamu: {n} hari', { n: target }) }) : null,
    h('p', null, h('strong', { text: tr(ctx, 'result.bottleneck_heading', 'Yang paling cepat habis') + ': ' }), line),
    h('details', { class: 'sc-details' },
      h('summary', { text: tr(ctx, 'common.show_more', 'Lihat selengkapnya') }),
      h('p', { class: 'sc-small', text: tr(ctx, 'result.survive_note', '') })));
}

function scoreCard(ctx, result) {
  const sc = result.score || {};
  const comps = sc.components || {};
  const rows = Object.keys(SCORE_MAX).filter((k) => comps[k] != null).map((k) =>
    h('li', null, `${tr(ctx, 'result.score_part.' + SCORE_KEY[k], k)}: ${fmt(comps[k], ctx.lang)} / ${SCORE_MAX[k]}`));
  return h('section', { class: 'sc-card', 'aria-labelledby': 'sc-score-h' },
    h('h2', { id: 'sc-score-h', text: tr(ctx, 'result.score_heading', 'Skor') }),
    h('p', { class: 'sc-score', text: tr(ctx, 'result.score_value', '{n} dari 100', { n: sc.total }) }),
    h('p', { class: 'sc-small sc-muted', text: tr(ctx, 'result.score_note', '') }),
    rows.length ? h('details', { class: 'sc-details' },
      h('summary', { text: tr(ctx, 'result.score_breakdown', 'Dari mana skor ini') }),
      h('ul', { class: 'sc-list' }, rows)) : null);
}

function bnpbCard(ctx, result) {
  const bag = result.bag || {};
  const fam = result.family || {};
  const [bk, bi] = BAND_BAG[bag.band] || ['not_ready', 'circle'];
  const [fk, fi] = BAND_FAMILY[fam.band] || ['vulnerable', 'circle'];
  const indicators = ctx.state && ctx.state.indicators;
  const famFilled = indicators && Object.values(indicators).some((v) => v != null);
  return h('section', { class: 'sc-card', 'aria-labelledby': 'sc-bnpb-h' },
    h('h2', { id: 'sc-bnpb-h', text: tr(ctx, 'result.bnpb_heading', 'Dua alat ukur BNPB') }),
    h('div', { class: 'sc-row' },
      h('span', { text: tr(ctx, 'result.bnpb_bag_line', 'Tas siaga: {have} dari {total} item ({pct}%)', { have: bag.yes, total: bag.applicable, pct: fmt(Math.round(bag.pct || 0), ctx.lang) }) }),
      h('span', { class: 'sc-chip sc-band-' + bk }, glyph(bi), tr(ctx, 'bands.bag.' + bk, bk))),
    famFilled
      ? h('div', { class: 'sc-row' },
        h('span', { text: tr(ctx, 'result.bnpb_family_line', 'Evaluasi keluarga: {score} dari 36', { score: fam.total }) }),
        h('span', { class: 'sc-chip sc-band-' + fk }, glyph(fi), tr(ctx, 'bands.family.' + fk, fk)))
      : h('div', { class: 'sc-row' },
        h('span', { text: tr(ctx, 'result.bnpb_family_missing', 'Evaluasi keluarga belum diisi.') }),
        link('#/keluarga', tr(ctx, 'result.bnpb_family_cta', 'Isi evaluasi keluarga'), 'sc-btn-secondary')));
}

function progressCard(ctx, result) {
  const cp = result.category_progress || {};
  const ul = h('ul', { class: 'sc-prog' });
  for (const [cat, pct] of Object.entries(cp)) {
    const name = tr(ctx, 'categories.' + cat, cat);
    let st, icon;
    if (pct == null) { st = 'na'; icon = 'minus'; } else if (pct >= 99.5) { st = 'enough'; icon = 'check'; } else if (pct <= 0) { st = 'empty'; icon = 'circle'; } else { st = 'short'; icon = 'tri'; }
    const stText = tr(ctx, 'result.progress_status.' + st, st);
    const p = pct == null ? 0 : Math.round(pct);
    ul.append(h('li', null,
      h('a', { class: 'sc-prog-row', href: '#/inventaris/' + cat },
        h('span', { class: 'sc-prog-name', text: name }),
        h('span', { class: 'sc-bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': p,
          'aria-label': `${name}: ${tr(ctx, 'a11y.progress_bar', 'Kemajuan {pct} persen', { pct: p })}` },
          (() => { const f = h('span', { class: 'sc-bar-fill' }); f.style.setProperty('--w', p + '%'); return f; })()),
        h('span', { class: 'sc-prog-val', text: pct == null ? '' : p + '%' }),
        h('span', { class: 'sc-chip sc-st-' + st }, glyph(icon), stText))));
  }
  return h('section', { class: 'sc-card', 'aria-labelledby': 'sc-prog-h' },
    h('h2', { id: 'sc-prog-h', text: tr(ctx, 'result.progress_heading', 'Kemajuan per kategori') }), ul);
}

function reqLine(ctx, r, itemsById) {
  const lang = ctx.lang;
  const nm = (id) => loc((itemsById[id] || {}).label, lang) || id;
  if (r.kind === 'item') {
    const u = r.unit ? ' ' + r.unit : '';
    return tr(ctx, 'result.next_item', '{item}: kurang {missing}', { item: nm(r.id), missing: fmt(r.missing, lang) + u });
  }
  if (r.kind === 'group_any' && r.days) return tr(ctx, 'result.next_group_fuel', 'Bahan bakar masak untuk {days} hari. Cukup salah satu: {items}', { days: r.days, items: (r.ids || []).map(nm).join(' / ') });
  if (r.kind === 'group_any') return tr(ctx, 'result.next_group_any', 'Salah satu dari: {items}', { items: (r.ids || []).map(nm).join(' / ') });
  if (r.kind === 'input_missing') return tr(ctx, 'result.next_input_missing', '{item}: isi angka pemakaian harian dulu', { item: nm(r.id) });
  if (r.kind === 'bag') {
    return `${tr(ctx, 'result.next_gate_bag', 'Tas siaga perlu terisi lebih dari 80%.')} ${tr(ctx, 'result.next_bag_more', 'Centang {n} item lagi.', { n: r.missing })}`;
  }
  if (r.kind === 'family') {
    return `${tr(ctx, 'result.next_gate_family', 'Evaluasi keluarga perlu skor minimal {n} dari 36.', { n: r.required_gte })} ${tr(ctx, 'result.next_family_more', '{n} poin lagi.', { n: r.missing })}`;
  }
  return '';
}

function nextCard(ctx, result, itemsById) {
  const t = result.tier.value;
  if (t >= 5 || !result.to_next_tier) {
    return h('section', { class: 'sc-card' }, h('p', { text: tr(ctx, 'result.next_top', 'Kamu sudah di tier tertinggi. Pertahankan dengan mengecek stok berkala.') }));
  }
  const reqs = result.to_next_tier.requirements || [];
  return h('section', { class: 'sc-card', 'aria-labelledby': 'sc-next-h' },
    h('h2', { id: 'sc-next-h', text: tr(ctx, 'result.next_heading', 'Untuk naik ke tier {n}', { n: result.to_next_tier.tier }) }),
    h('p', { class: 'sc-muted', text: tr(ctx, 'result.next_hint', 'Satu langkah kecil dulu. Selesaikan satu hal di bawah, lalu cek lagi.') }),
    h('ul', { class: 'sc-list' }, reqs.map((r) => h('li', { text: reqLine(ctx, r, itemsById) }))),
    link('#/belanja', tr(ctx, 'result.see_shopping', 'Lihat daftar belanja'), 'sc-btn-primary'));
}

/** Penanda terlihat untuk item evidence CUPLIKAN (B-01). */
export function evidenceBadge(ctx, it) {
  if (!it || it.evidence !== 'CUPLIKAN') return null;
  return h('p', { class: 'sc-chips' }, h('span', { class: 'sc-chip sc-chip-excerpt', 'data-evidence': 'excerpt' }, glyph('tri'), tr(ctx, 'common.excerpt_badge', 'Dari kutipan sumber, perlu dicek ulang')));
}

function shortfallRow(ctx, s, itemsById, buyById, storeLabel) {
  const lang = ctx.lang;
  const it = itemsById[s.id] || {};
  const buy = buyById[s.id] || {};
  const name = loc(it.label, lang) || s.id;
  const qty = s.missing == null || s.status === 'needs_input'
    ? tr(ctx, 'result.shortfall_needs_input', 'Isi angka pemakaian harian untuk menghitung')
    : tr(ctx, 'result.shortfall_missing', 'Kurang {qty}', { qty: `${fmt(s.missing, lang)}${s.unit ? ' ' + s.unit : ''}` });
  const li = h('li', { class: 'sc-short' },
    h('h4', { class: 'sc-short-name', text: name }),
    h('p', { class: 'sc-short-qty', text: qty }),
    s.group_ids && s.group_ids.length > 1 ? h('p', { class: 'sc-small sc-muted', text: tr(ctx, 'result.shortfall_any_of', 'Cukup salah satu: {items}', { items: s.group_ids.map((x) => loc((itemsById[x] || {}).label, lang) || x).join(' / ') }) }) : null,
    evidenceBadge(ctx, it));
  if (s.blocks_tier) li.append(h('p', { class: 'sc-small sc-muted', text: tr(ctx, 'result.blocks_tier', 'Menahan tier {n}', { n: s.blocks_tier }) }));
  const chips = h('p', { class: 'sc-chips' });
  if (buy.often_at_home) chips.append(h('span', { class: 'sc-chip sc-chip-home', text: tr(ctx, 'result.already_at_home', 'Biasanya sudah ada di rumah') }));
  if (buy.free_official) chips.append(h('span', { class: 'sc-chip sc-chip-free', text: tr(ctx, 'result.free_official', 'Gratis atau resmi') }));
  if (chips.childNodes.length) li.append(chips);
  const stores = buy.stores || [];
  if (stores.length) {
    li.append(h('p', { class: 'sc-small sc-muted', text: tr(ctx, 'result.where_to_buy', 'Di mana mendapatkannya') }),
      h('p', { class: 'sc-chips' }, stores.map((sid) => h('span', { class: 'sc-chip sc-chip-store', text: storeLabel(sid) }))));
    if ((buy.examples || []).length) li.append(h('p', { class: 'sc-small sc-muted', text: `${tr(ctx, 'stores.examples_label', 'Contoh umum, bukan rekomendasi')}: ${buy.examples.join(', ')}` }));
  }
  if (buy.diy) li.append(h('p', { class: 'sc-small' }, h('strong', { text: tr(ctx, 'result.diy_alt', 'Alternatif hemat atau buat sendiri') + ': ' }), loc(buy.diy, lang)));
  if (buy.free_official) {
    const f = buy.free_official;
    li.append(h('p', { class: 'sc-small' }, h('strong', { text: tr(ctx, 'result.free_official', 'Gratis atau resmi') + ': ' }), loc(f, lang) + (f.source ? ` (${f.source})` : '')));
  }
  if (buy.buy_tip) li.append(h('p', { class: 'sc-small sc-muted', text: loc(buy.buy_tip, lang) }));
  const why = loc(it.why, lang);
  if (why || (it.sources || []).length) {
    li.append(h('details', { class: 'sc-details' },
      h('summary', { text: tr(ctx, 'result.shortfall_why', 'Alasan') }),
      why ? h('p', { class: 'sc-small', text: why }) : null,
      s.id === 'water_drinking' ? h('p', { class: 'sc-small', text: tr(ctx, 'warnings.water_3l', '') }) : null,
      (it.sources || []).length ? h('p', { class: 'sc-small sc-muted', text: `${tr(ctx, 'common.sources', 'Sumber')}: ${it.sources.join(', ')}` }) : null));
  }
  return li;
}

function shortfallCard(ctx, result, itemsById, buyById, storeLabel) {
  const list = normalizeShortfall(result, itemsById);
  const sec = h('section', { class: 'sc-card', 'aria-labelledby': 'sc-short-h' },
    h('h2', { id: 'sc-short-h', text: tr(ctx, 'result.shortfall_heading', 'Yang perlu dilengkapi') }));
  if (!list.length) { sec.append(h('p', { text: tr(ctx, 'result.shortfall_empty', 'Tidak ada kekurangan untuk target ini. Kerja bagus.') })); return sec; }
  sec.append(h('p', { class: 'sc-muted', text: tr(ctx, 'result.shortfall_intro', 'Diurutkan dari yang paling penting.') }));
  const wrap = h('div');
  let shown = 0;
  const lastPrio = { v: null };
  let ul = null;
  const renderMore = (limit) => {
    for (; shown < Math.min(list.length, limit); shown++) {
      const s = list[shown];
      if (s.priority !== lastPrio.v || !ul) {
        lastPrio.v = s.priority;
        wrap.append(h('h3', { class: 'sc-prio', text: tr(ctx, 'result.priority.' + (PRIORITY_KEY[s.priority] || 'nice'), s.priority) }));
        ul = h('ul', { class: 'sc-shortlist' });
        wrap.append(ul);
      }
      ul.append(shortfallRow(ctx, s, itemsById, buyById, storeLabel));
    }
  };
  renderMore(SHORTFALL_PAGE);
  sec.append(wrap);
  if (list.length > shown) {
    const btn = h('button', { type: 'button', class: 'sc-btn sc-btn-secondary', text: `${tr(ctx, 'common.show_more', 'Lihat selengkapnya')} (${list.length - shown})` });
    btn.addEventListener('click', () => { renderMore(list.length); btn.remove(); });
    sec.append(btn);
  }
  sec.append(h('p', { class: 'sc-small sc-muted', text: tr(ctx, 'result.no_price_note', '') }));
  return sec;
}

function safetyCards(ctx, result) {
  const flags = (result.household && result.household.flags) || {};
  const prof = (ctx.state && ctx.state.profile) || {};
  const scen = prof.scenarios || [];
  const medical = flags.has_electric_medical || prof.has_electric_medical || (result.warnings || []).includes('medical_power_unknown');
  const out = [];
  if (medical) {
    out.push(h('section', { class: 'sc-card sc-info', 'aria-label': tr(ctx, 'power.medical_badge', 'Alat medis') },
      h('p', null, h('strong', { text: tr(ctx, 'power.medical_badge', 'Alat medis') + ': ' }), tr(ctx, 'power.medical_gating', '')),
      h('p', { class: 'sc-small', text: tr(ctx, 'power.medical_registry', '') }),
      link('#/daya', tr(ctx, 'power.title', 'Daya listrik'), 'sc-btn-secondary')));
  }
  if (medical || scen.includes('power_outage')) {
    out.push(h('section', { class: 'sc-card sc-danger', role: 'note' },
      h('p', { class: 'hazard-title' }, glyph('warn'), h('strong', { text: tr(ctx, 'power.warn.co_title', 'Awas gas CO') })),
      h('p', { text: tr(ctx, 'power.warn.co_body', tr(ctx, 'warnings.co_genset', '')) }),
      h('p', { class: 'sc-small', text: tr(ctx, 'power.warn.house_wiring_body', '') })));
  }
  return out;
}

function emptyState(ctx) {
  return h('section', { class: 'sc-card sc-empty' },
    h('h2', { text: tr(ctx, 'result.empty_title', 'Hasil belum bisa dihitung') }),
    h('p', { text: tr(ctx, 'result.empty_body', 'Isi profil dan beberapa persediaan dulu, lalu hasilnya muncul di sini.') }),
    h('div', { class: 'sc-actions' },
      link('#/profil', tr(ctx, 'result.go_profile', 'Isi profil'), 'sc-btn-primary'),
      link('#/inventaris/water', tr(ctx, 'result.go_inventory', 'Isi persediaan'), 'sc-btn-secondary')));
}

function isPartial(ctx, result, fixture) {
  if (fixture) return true;
  const inv = (ctx.state && ctx.state.inventory) || {};
  return Object.keys(inv).length === 0 || (result.warnings || []).length > 0 || (result.advisories || []).includes('indicators_incomplete');
}

let token = 0;
export function render(root, ctx) {
  ensureCss(root);
  const my = ++token;
  root.textContent = '';
  const page = h('div', { class: 'sc-page sc-results' },
    h('h1', { text: tr(ctx, 'result.title', 'Hasil kesiapan') }),
    h('p', { class: 'sc-muted', text: tr(ctx, 'result.calm_intro', 'Hasil ini bukan nilai ujian. Ini peta langkah berikutnya.') }),
    h('p', { class: 'sc-muted', text: tr(ctx, 'common.loading', 'Memuat...'), role: 'status' }));
  root.append(page);
  loadResult(ctx).then(({ result, fixture }) => {
    if (my !== token) return;
    const itemsById = indexById(arr(ctx.data && ctx.data.items, 'items'));
    const buyById = (ctx.data && ctx.data.buy && ctx.data.buy.items) || {};
    const storeTypes = arr(ctx.data && ctx.data.buy, 'store_types');
    const storeLabel = (sid) => tr(ctx, 'stores.' + sid, loc((storeTypes.find((x) => x.id === sid) || {}).label, ctx.lang) || sid);
    page.querySelector('[role=status]').remove();
    if (!result || result.status === 'invalid') { page.append(emptyState(ctx)); return; }
    if (isPartial(ctx, result, fixture)) page.append(h('div', { class: 'sc-card sc-info', role: 'status', text: tr(ctx, 'result.partial_banner', '') }));
    page.append(tierCard(ctx, result), survivalCard(ctx, result), scoreCard(ctx, result), bnpbCard(ctx, result),
      progressCard(ctx, result), nextCard(ctx, result, itemsById), ...safetyCards(ctx, result),
      shortfallCard(ctx, result, itemsById, buyById, storeLabel),
      h('div', { class: 'sc-actions' },
        link('#/belanja', tr(ctx, 'result.see_shopping', 'Lihat daftar belanja'), 'sc-btn-primary'),
        link('#/info', tr(ctx, 'nav.more', 'Lainnya'), 'sc-btn-secondary'),
        link('#/target', tr(ctx, 'target.title', 'Ubah target'), 'sc-btn-secondary')),
      h('p', { class: 'sc-small sc-muted', text: tr(ctx, 'result.recalc', '') }),
      h('p', { class: 'sc-small sc-muted', text: tr(ctx, 'warnings.not_substitute', 'Bukan pengganti instruksi otoritas setempat.') }));
  }).catch(() => {
    if (my !== token) return;
    page.textContent = '';
    page.append(h('p', { role: 'alert', text: tr(ctx, 'errors.data_load', 'Data gagal dimuat.') }));
  });
}

export function destroy() { token++; }
