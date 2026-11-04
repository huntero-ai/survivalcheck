// SurvivalCheck - mesin hitung (murni, tanpa DOM; Node & browser).
// Spesifikasi: docs/scoring.md. Semua angka dari data/rules.json dan data/items.json.
// evaluate(state, data) -> result. data = { items, rules, power?, indicators? } (isi file JSON).

import * as P from './power.js';

const EPS = 1e-9;
const AGE_GROUPS = ['infant', 'toddler', 'child', 'adult', 'elderly'];
const PRIORITY_RANK = { critical: 0, important: 1, extra: 2 };
const UNIT_OVERRIDE = { meds_personal: 'hari', medical_device_backup_power: 'hari' };
const BAG_TOTAL = 28;

const round = P.round;
const num = (v, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);
const toList = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const missingOf = (need, have) => Math.ceil(round(need - have, 6) - EPS);

/** Nilai kepemilikan: null/false = 0, true = 1, angka, {home,bag} dijumlahkan. */
export function haveOf(v) {
  if (v == null || v === false) return 0;
  if (v === true) return 1;
  if (typeof v === 'number') return Number.isFinite(v) && v > 0 ? v : 0;
  if (typeof v === 'object') return haveOf(v.home) + haveOf(v.bag);
  return 0;
}

function normalize(state, data) {
  const R = data.rules;
  const I = data.items;
  const profile = (state && state.profile) || {};
  const counts = {};
  for (const g of AGE_GROUPS) counts[g] = Math.max(0, Math.floor(num(profile.counts && profile.counts[g])));
  const N = AGE_GROUPS.reduce((s, g) => s + counts[g], 0);

  let td = state && state.target;
  if (td && typeof td === 'object') td = td.days;
  if (typeof td !== 'number') td = profile.target_days;
  if (typeof td !== 'number' || !Number.isFinite(td)) td = R.defaults.target_days;
  const target_days = Math.min(R.defaults.target_custom_max, Math.max(R.defaults.target_custom_min, Math.round(td)));

  const known = new Set((I.scenarios || []).map((s) => s.id));
  const rawSc = (state && Array.isArray(state.scenarios) ? state.scenarios : null) || profile.scenarios || [];
  const scenarios = [...new Set(rawSc)].filter((s) => known.has(s));

  const feeding = ['formula', 'breastfeeding', 'mixed'].includes(profile.infant_feeding)
    ? profile.infant_feeding
    : R.defaults.infant_feeding;

  const meds = (Array.isArray(profile.meds) ? profile.meds : []).map((m) => ({
    label: m && m.label,
    doses_per_day: m && m.doses_per_day,
    stock_days: Math.max(0, num(m && m.stock_days)),
  }));

  return {
    counts,
    N,
    pregnant: Math.max(0, Math.floor(num(profile.pregnant))),
    breastfeeding: Math.max(0, Math.floor(num(profile.breastfeeding))),
    feeding,
    pets: { dog: Math.max(0, num(profile.pets && profile.pets.dog)), cat: Math.max(0, num(profile.pets && profile.pets.cat)) },
    meds,
    has_electric_medical: !!profile.has_electric_medical,
    usage: profile.usage_per_day || {},
    scenarios,
    target_days,
    inventory: (state && state.inventory) || {},
    indicators: (state && state.indicators) || {},
    bag: (state && state.bag_checklist) || {},
  };
}

function resolvePower(state, data, h, effectiveTarget) {
  // Prioritas: state.power.days_power_medical (sudah dihitung) -> hitung dari power_devices/power_inventory.
  if (state && state.power && state.power.days_power_medical !== undefined) return state.power.days_power_medical;
  if (state && (state.power_devices || state.power_inventory) && data.power) {
    const s = P.summarize(state, data.power, effectiveTarget);
    return s.days_power_medical;
  }
  return null;
}

export function evaluate(state, data) {
  const R = data.rules;
  const I = data.items;
  const h = normalize(state, data);
  if (h.N < 1) return { status: 'invalid', errors: ['household_empty'] };

  const { counts, N } = h;
  const SR = (R.scenario_rules && R.scenario_rules.scenarios) || {};
  const scen = h.scenarios.map((s) => SR[s] || {});
  const maxOf = (key, base) => scen.reduce((m, s) => (typeof s[key] === 'number' ? Math.max(m, s[key]) : m), base);

  const flags = {
    has_infant: counts.infant > 0,
    has_toddler: counts.toddler > 0,
    has_child: counts.toddler + counts.child > 0,
    has_elderly: counts.elderly > 0,
    has_pregnant: h.pregnant > 0,
    has_meds: h.meds.length > 0,
    has_pet_dog: h.pets.dog > 0,
    has_pet_cat: h.pets.cat > 0,
    has_electric_medical: h.has_electric_medical,
  };

  // 3.1 kebutuhan dasar
  const kcalByGroup = {};
  for (const g of R.age_groups) kcalByGroup[g.id] = g.kcal_per_day == null ? 0 : g.kcal_per_day;
  const daily_kcal =
    AGE_GROUPS.reduce((s, g) => s + counts[g] * kcalByGroup[g], 0) +
    h.pregnant * R.energy_adjustments.pregnant_extra_kcal +
    h.breastfeeding * R.energy_adjustments.breastfeeding_extra_kcal;
  const waterRate = maxOf('water_drinking_l_per_person_day', R.water.drinking_l_per_person_day);

  // 3.2 skenario
  const effTarget = Math.max(h.target_days, maxOf('effective_target_min_days', 0));
  const medsTarget = Math.max(effTarget, R.meds.min_days, maxOf('meds_min_days', 0));
  const cashTarget = Math.max(
    maxOf('cash_days', 0),
    effTarget >= R.cash.high_from_target_days ? R.cash.days_high : R.cash.days_low
  );
  const tiers = R.tiers;
  let targetTier = 1;
  for (const t of tiers) if (t.id >= 1 && t.stock_days <= effTarget + EPS) targetTier = t.id;

  const warnings = new Set();
  const advisories = [];

  // 3.3 kkal stok
  const aggIds = R.food.aggregates;
  const aggSet = new Set(aggIds);
  const itemById = {};
  const IDX = {};
  I.items.forEach((it, i) => {
    itemById[it.id] = it;
    IDX[it.id] = i;
  });
  let totalKcal = 0;
  let noCookKcal = 0;
  const noCook = new Set(R.food.no_cook_ids);
  for (const id of aggIds) {
    const raw = h.inventory[id];
    if (raw == null) continue;
    const o = typeof raw === 'number' ? { qty: raw } : raw;
    if (typeof o !== 'object') continue;
    const qty = num(o.qty);
    let kcal = null;
    if (typeof o.kcal_total === 'number' && o.kcal_total >= 0) kcal = o.kcal_total;
    else if (typeof o.kcal_per_unit === 'number' && o.kcal_per_unit >= 0) kcal = qty * o.kcal_per_unit;
    else {
      const per100 = R.food.kcal_per_100g[id];
      const it = itemById[id];
      const g = typeof o.grams_per_unit === 'number' && o.grams_per_unit > 0 ? o.grams_per_unit : it && R.food.unit_g_defaults[it.unit];
      if (per100 != null && g) kcal = (qty * g * per100) / 100;
    }
    if (kcal == null) {
      if (qty > 0) warnings.add('food_kcal_unresolved:' + id);
      kcal = 0;
    }
    totalKcal += kcal;
    if (noCook.has(id)) noCookKcal += kcal;
  }
  // Ekstensi: pangan lain di luar daftar (kkal dari label), inventory.food_other = {kcal_total}
  const other = h.inventory.food_other;
  if (other && typeof other === 'object' && num(other.kcal_total) > 0) totalKcal += other.kcal_total;
  const noCookShare = totalKcal > 0 ? (noCookKcal / totalKcal) * 100 : 0;

  // daya medis
  const powerMed = flags.has_electric_medical ? resolvePower(state, data, h, effTarget) : null;
  const powerNum = typeof powerMed === 'number' ? powerMed : null;
  if (flags.has_electric_medical && powerMed == null) warnings.add('medical_power_unknown');

  // 3.4 keberlakuan
  const skip = (it) => aggSet.has(it.id) || it.id === 'food_no_cook_share';
  const applicable = (it) => {
    if (skip(it)) return false;
    const ai = toList(it.applies_if);
    if (ai.length && !ai.some((f) => flags[f])) return false;
    const ph = toList(it.profile_hint);
    if (ph.length && !ph.some((f) => flags[f])) return false;
    const ov = R.item_applicability_overrides && R.item_applicability_overrides[it.id];
    if (ov && ov.profile_infant_feeding_in && !ov.profile_infant_feeding_in.includes(h.feeding)) return false;
    const sc = toList(it.scenarios);
    if (sc.length && !sc.some((s) => h.scenarios.includes(s))) return false;
    return true;
  };
  const items = I.items.filter(applicable);

  // 3.5 kebutuhan & kepemilikan
  const minMeds = Math.min(...h.meds.map((m) => m.stock_days));
  const medsHave = h.meds.length ? minMeds : 0;
  function haveNeed(it, days) {
    const id = it.id;
    const unit = UNIT_OVERRIDE[id] || it.unit;
    const out = (need, have, extra) => ({ unit, need, have, unknown: false, ...extra });
    const inv = haveOf(h.inventory[id]);
    if (id === 'water_drinking') return out(waterRate * N * days, inv);
    if (id === 'water_hygiene') return out(R.water.hygiene_l_per_person_day * N * days, inv);
    if (id === 'water_pet_dog' || id === 'water_pet_cat') {
      const key = id === 'water_pet_dog' ? 'dog' : 'cat';
      const rate = (R.water.pet_l_per_animal_day && R.water.pet_l_per_animal_day[key]) || it.per_animal_day || 0;
      const minD = (it.modifiers && it.modifiers.min_days) || R.water.pet_min_days;
      return out(h.pets[key] * rate * Math.max(days, minD), inv);
    }
    if (id === 'food_kcal_total') return out(daily_kcal * days, totalKcal);
    if (id === 'meds_personal') return out(Math.max(days, R.meds.min_days), medsHave);
    if (id === 'cash_days') return out(days, inv);
    if (id === 'medical_device_backup_power') {
      if (powerMed === 'self_sufficient') return out(days, days);
      if (powerNum == null) return out(days, 0, { unknown: true });
      return out(days, powerNum);
    }
    if (it.qty_mode === 'user_usage_per_day') {
      const u = h.usage[id];
      if (u == null || !Number.isFinite(u)) return out(null, inv, { unknown: true });
      const minD = (it.modifiers && it.modifiers.min_days) || 0;
      return out(Math.max(0, u) * Math.max(days, minD), inv);
    }
    if (it.qty_mode === 'per_person_day') return out(it.per_person_day * N * days, inv);
    // per_household / boolean
    const need = it.per_household != null ? it.per_household : it.per_person != null ? it.per_person * N : 1;
    return out(need, inv);
  }
  const daysFor = (it) => (it.id === 'meds_personal' ? medsTarget : it.id === 'cash_days' ? cashTarget : effTarget);
  const isCritOrGate = (it) => it.priority === 'critical' || it.gating;

  // evaluasi tiap item terhadap target pengguna
  const evals = new Map();
  for (const it of items) {
    const hn = haveNeed(it, daysFor(it));
    let coverage = null;
    if (!hn.unknown && hn.need > EPS) coverage = Math.min(hn.have / hn.need, 1);
    evals.set(it.id, { it, ...hn, coverage });
    if (hn.unknown && it.qty_mode === 'user_usage_per_day' && isCritOrGate(it)) warnings.add('usage_missing:' + it.id);
  }
  // f(it) untuk skor/kategori: null = dikeluarkan
  const fOf = (e) => {
    if (e.unknown) return isCritOrGate(e.it) ? 0 : null;
    if (e.need == null || !(e.need > EPS)) return null;
    return e.coverage;
  };
  const avg = (arr) => (arr.length ? arr.reduce((s, x) => s + x, 0) / arr.length : null);

  // 3.6 hari bertahan
  const comp = { water: null, food: null, meds: null, infant_food: null, power: null };
  comp.water = haveOf(h.inventory.water_drinking) / (waterRate * N);
  comp.food = daily_kcal > 0 ? totalKcal / daily_kcal : null;
  comp.meds = flags.has_meds ? minMeds : null;
  {
    const parts = [];
    if (flags.has_infant && ['formula', 'mixed'].includes(h.feeding)) {
      const u = h.usage.infant_formula;
      if (u == null) parts.push(0);
      else if (u > 0) parts.push(haveOf(h.inventory.infant_formula) / u);
    }
    if ((flags.has_infant || flags.has_toddler) && num(h.usage.infant_mpasi) > 0) {
      parts.push(haveOf(h.inventory.infant_mpasi) / h.usage.infant_mpasi);
    }
    comp.infant_food = parts.length ? Math.min(...parts) : null;
  }
  comp.power = flags.has_electric_medical && powerNum != null ? powerNum : null;
  const ORDER = R.survival_days.tie_break_order;
  let daysExact = Infinity;
  let bottleneck = null;
  for (const k of ORDER) {
    const v = comp[k];
    if (v == null) continue;
    if (v < daysExact - EPS) {
      daysExact = v;
      bottleneck = k;
    }
  }
  const survivalDays = Math.floor(daysExact + EPS);

  // 3.7 tas BNPB & keluarga
  const excl = [];
  for (const e of R.bag_checklist.excluded_when_not_relevant) {
    if (!e.relevant_if_any.some((f) => flags[f])) excl.push(e.no);
  }
  excl.sort((a, b) => a - b);
  const bagApplicable = [];
  for (let n = 1; n <= BAG_TOTAL; n++) if (!excl.includes(n)) bagApplicable.push(n);
  const bagYes = bagApplicable.filter((n) => h.bag[String(n)] === true).length;
  const bagPct = (bagYes / bagApplicable.length) * 100;
  const bagBand = bagPct > R.bag_checklist.bands.siap_gt + EPS ? 'siap' : bagPct + EPS >= R.bag_checklist.bands.perlu_dilengkapi_min ? 'perlu_dilengkapi' : 'belum_siap';
  let famTotal = 0;
  let famMissing = false;
  for (let n = 1; n <= R.family_indicators.count; n++) {
    const k = 'ind_' + String(n).padStart(2, '0');
    const v = h.indicators[k];
    if (typeof v === 'number' && Number.isFinite(v)) famTotal += Math.max(0, Math.min(R.family_indicators.max_per_indicator, Math.round(v)));
    else famMissing = true;
  }
  const famBand = (R.family_indicators.bands.find((b) => famTotal >= b.min && famTotal <= b.max) || {}).id;

  // 3.8 tier
  const tierDef = (t) => tiers.find((x) => x.id === t);
  const sortKey = (it) => [PRIORITY_RANK[it.priority] ?? 9, it.min_tier_gating == null ? 99 : it.min_tier_gating, IDX[it.id]];
  const cmpKey = (a, b) => {
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
    return 0;
  };
  function unmet(T) {
    const td = tierDef(T);
    const list = [];
    const groups = new Map();
    for (const it of items) {
      if (!it.gating || it.min_tier_gating == null || it.min_tier_gating > T) continue;
      if (it.gating_group) {
        if (!groups.has(it.gating_group)) groups.set(it.gating_group, []);
        groups.get(it.gating_group).push(it);
        continue;
      }
      const days = it.id === 'cash_days' ? R.cash.gating_days : td.stock_days;
      const hn = haveNeed(it, days);
      if (hn.unknown) {
        list.push({ key: sortKey(it), req: { kind: 'input_missing', id: it.id } });
      } else if (hn.have + EPS < hn.need) {
        list.push({
          key: sortKey(it),
          req: { kind: 'item', id: it.id, unit: hn.unit, need: round(hn.need, 2), have: round(hn.have, 2), missing: missingOf(hn.need, hn.have) },
        });
      }
    }
    for (const [g, members] of groups) {
      if (!members.some((m) => haveOf(h.inventory[m.id]) >= 1 - EPS)) {
        const first = members.slice().sort((a, b) => cmpKey(sortKey(a), sortKey(b)))[0];
        list.push({ key: sortKey(first), req: { kind: 'group_any', group: g, ids: members.map((m) => m.id), missing: 1 } });
      }
    }
    list.sort((a, b) => cmpKey(a.key, b.key));
    const bagThr = Math.max(...tiers.filter((x) => x.id >= 2 && x.id <= T).map((x) => x.bag_pct_gt || 0));
    const famThr = Math.max(...tiers.filter((x) => x.id >= 2 && x.id <= T).map((x) => x.family_score_gte || 0));
    const bagOk = bagPct > bagThr + EPS;
    const famOk = famTotal >= famThr;
    return { items: list.map((x) => x.req), bagOk, famOk, bagThr, famThr, ok: !list.length && bagOk && famOk };
  }
  const tierChecks = {};
  const unmetByTier = {};
  for (let T = 2; T <= 5; T++) {
    unmetByTier[T] = unmet(T);
    tierChecks[String(T)] = unmetByTier[T].ok;
  }
  let tier = 0;
  if (daysExact + EPS >= 1) tier = 1;
  for (let T = 2; T <= 5; T++) {
    if (unmetByTier[T].ok) tier = T;
    else break;
  }

  // 3.11 naik tier
  let toNext = null;
  if (tier < 5) {
    const next = tier + 1;
    const reqs = [];
    if (next === 1) {
      const ids = R.survival_days.tier1_item_ids;
      const entries = [];
      const consider = (id, cond) => {
        const it = itemById[id];
        if (!it || !cond) return;
        if (!items.includes(it)) return;
        const hn = haveNeed(it, 1);
        const oneDay = id === 'meds_personal' ? { ...hn, need: 1 } : hn;
        if (hn.unknown) entries.push({ id, req: { kind: 'input_missing', id } });
        else entries.push({ id, req: { kind: 'item', id, unit: oneDay.unit, need: round(oneDay.need, 2), have: round(oneDay.have, 2), missing: missingOf(oneDay.need, oneDay.have) } });
      };
      consider('water_drinking', comp.water < 1 - EPS);
      consider('food_kcal_total', comp.food != null && comp.food < 1 - EPS);
      consider('meds_personal', comp.meds != null && comp.meds < 1 - EPS);
      const u = h.usage.infant_formula;
      consider('infant_formula', flags.has_infant && ['formula', 'mixed'].includes(h.feeding) && (u == null || haveOf(h.inventory.infant_formula) < u - EPS));
      consider('medical_device_backup_power', comp.power != null && comp.power < 1 - EPS);
      entries.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
      reqs.push(...entries.map((e) => e.req));
    } else {
      const u = unmetByTier[next];
      reqs.push(...u.items);
      if (!u.bagOk) {
        const needed = Math.floor((u.bagThr * bagApplicable.length) / 100 + EPS) + 1;
        reqs.push({ kind: 'bag', required_pct_gt: u.bagThr, current_pct: round(bagPct, 2), yes: bagYes, needed_yes: needed, missing: Math.max(0, needed - bagYes) });
      }
      if (!u.famOk) reqs.push({ kind: 'family', required_gte: u.famThr, current: famTotal, missing: u.famThr - famTotal });
    }
    toNext = { tier: next, requirements: reqs };
  }

  // 3.9 skor
  const wts = R.score.weights;
  const comps = {};
  const critF = [];
  const scnF = [];
  for (const e of evals.values()) {
    const f = fOf(e);
    if (f == null) continue;
    if (e.it.priority === 'critical') critF.push(f);
    if (toList(e.it.scenarios).length) scnF.push(f);
  }
  comps.critical_stock = critF.length ? wts.critical_stock * avg(critF) : null;
  comps.bag = wts.bag * (bagYes / bagApplicable.length);
  comps.family = wts.family * (famTotal / R.family_indicators.max_total);
  comps.scenario = scnF.length ? wts.scenario * avg(scnF) : null;
  let sum = 0;
  let wsum = 0;
  for (const k of Object.keys(comps)) {
    if (comps[k] == null) continue;
    sum += comps[k];
    wsum += wts[k];
  }
  const totalExact = wsum > 0 ? (sum * 100) / wsum : 0;
  const scoreTotal = Math.floor(round(totalExact, 6) + 0.5);

  // 3.10 kekurangan
  const shortfall = [];
  for (const e of evals.values()) {
    const it = e.it;
    let entry = null;
    if (e.unknown) {
      if (isCritOrGate(it)) entry = { missing: null, status: 'needs_input', need: null, have: round(e.have, 2), pct: 1 };
    } else if (e.need > EPS && e.have + EPS < e.need) {
      const m = missingOf(e.need, e.have);
      if (m > 0) entry = { missing: m, need: round(e.need, 2), have: round(e.have, 2), pct: round(1 - e.coverage, 6) };
    }
    if (!entry) continue;
    const { pct, ...rest } = entry;
    shortfall.push({
      key: [PRIORITY_RANK[it.priority] ?? 9, it.min_tier_gating == null ? 99 : it.min_tier_gating, -pct, IDX[it.id]],
      row: { id: it.id, category: it.category, priority: it.priority, min_tier_gating: it.min_tier_gating ?? null, unit: e.unit, ...rest, blocks_tier: it.min_tier_gating ?? null },
    });
  }
  shortfall.sort((a, b) => cmpKey(a.key, b.key));

  // items_eval & progres kategori
  const itemsEval = {};
  const catAcc = {};
  for (const c of I.categories) catAcc[c.id] = [];
  for (const e of evals.values()) {
    if (e.unknown) {
      itemsEval[e.it.id] = { unit: e.unit, need: null, have: round(e.have, 2), missing: null, coverage: null, status: 'needs_input' };
    } else if (e.need > EPS) {
      const m = e.have + EPS < e.need ? missingOf(e.need, e.have) : 0;
      itemsEval[e.it.id] = { unit: e.unit, need: round(e.need, 2), have: round(e.have, 2), missing: Math.max(0, m), coverage: round(e.coverage, 4) };
    }
    const f = fOf(e);
    if (f != null && catAcc[e.it.category]) catAcc[e.it.category].push(f);
  }
  const categoryProgress = {};
  for (const c of I.categories) categoryProgress[c.id] = catAcc[c.id].length ? round(avg(catAcc[c.id]) * 100, 1) : null;

  // 4. advisories
  if (totalKcal > 0 && noCookShare < R.food.no_cook_target_share_pct) advisories.push('no_cook_share_low');
  if (h.target_days < R.defaults.bnpb_minimum_days) advisories.push('below_bnpb_minimum');
  if (h.pregnant + h.breastfeeding > counts.adult + counts.elderly) advisories.push('pregnant_breastfeeding_exceeds_household');
  if (famMissing) advisories.push('indicators_incomplete');

  const tierName = tierDef(tier).name;
  return {
    status: 'ok',
    errors: [],
    household: { n_total: N, counts, daily_kcal: round(daily_kcal, 2), water_l_per_person_day: waterRate, flags },
    targets: { target_days: h.target_days, effective_target_days: effTarget, meds_target_days: medsTarget, cash_target_days: cashTarget, target_tier: targetTier },
    food: { total_kcal: round(totalKcal, 2), no_cook_share_pct: round(noCookShare, 2) },
    survival: {
      days_exact: round(daysExact, 2),
      days: survivalDays,
      bottleneck,
      components: Object.fromEntries(Object.entries(comp).map(([k, v]) => [k, v == null ? null : round(v, 2)])),
    },
    tier: { value: tier, next_tier: tier < 5 ? tier + 1 : null, label: tierName },
    tier_checks: tierChecks,
    to_next_tier: toNext,
    bag: { yes: bagYes, applicable: bagApplicable.length, excluded: excl, pct: round(bagPct, 2), band: bagBand },
    family: { total: famTotal, band: famBand },
    score: {
      components: Object.fromEntries(Object.entries(comps).map(([k, v]) => [k, v == null ? null : round(v, 2)])),
      weight_sum: wsum,
      total_exact: round(totalExact, 2),
      total: scoreTotal,
    },
    category_progress: categoryProgress,
    items_eval: itemsEval,
    applicable_ids: items.map((x) => x.id),
    shortfall_count: shortfall.length,
    shortfall: shortfall.map((s) => s.row),
    warnings: [...warnings].sort(),
    advisories,
  };
}

/** Item yang berlaku untuk profil (dipakai UI inventaris). Mengembalikan daftar item. */
export function applicableItems(state, data) {
  const r = evaluate(state, data);
  if (r.status !== 'ok') return [];
  const set = new Set(r.applicable_ids);
  return data.items.items.filter((it) => set.has(it.id));
}
