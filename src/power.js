// SurvivalCheck - rumus listrik (murni, tanpa DOM). Spesifikasi: docs/power.md, angka: data/power.json.
// Semua fungsi menerima `pd` = isi data/power.json.

const EPS = 1e-9;

/** Bulatkan ke n desimal (setengah naik). */
export function round(x, n = 2) {
  if (!Number.isFinite(x)) return x;
  const f = 10 ** n;
  return Math.round(x * f * (1 + 1e-12)) / f;
}
const ceil6 = (x) => Math.ceil(round(x, 6) - EPS);
const num = (v, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

export function constants(pd) {
  const c = (pd && pd.constants) || {};
  const g = (k, d) => (c[k] && typeof c[k].value === 'number' ? c[k].value : d);
  return {
    inverter_efficiency: g('inverter_efficiency', 0.9),
    usable_capacity_factor: g('usable_capacity_factor', 0.8),
    power_bank_nominal_v: g('power_bank_nominal_v', 3.7),
    power_bank_conversion_efficiency: g('power_bank_conversion_efficiency', 0.7),
    reserve_margin: g('reserve_margin', 1.2),
    output_margin: g('output_margin', 1.25),
    solar_peak_sun_hours: g('solar_peak_sun_hours_indonesia', 4.0),
    solar_derate: g('solar_derate', 0.75),
    genset_load_factor: g('genset_default_load_factor', 0.5),
  };
}

export function deviceIndex(pd) {
  const m = {};
  for (const d of (pd && pd.devices) || []) m[d.id] = d;
  return m;
}

/**
 * Beban dari perangkat terpilih.
 * selection: { id: { qty=1, hours, watts, custom?, name?, medical? } }. Kunci tak dikenal butuh `watts` (perangkat sendiri).
 */
export function computeLoad(selection, pd) {
  const idx = deviceIndex(pd);
  let whDay = 0, whDayMed = 0, cont = 0, maxSurgeExtra = 0;
  const lines = [];
  for (const [id, s] of Object.entries(selection || {})) {
    if (!s) continue;
    const dev = idx[id];
    const qty = Math.max(0, num(s.qty, 1));
    const watts = num(s.watts, dev ? dev.typical_w : 0);
    if (watts <= 0 || qty <= 0) continue;
    const hours = Math.max(0, Math.min(24, num(s.hours, dev ? dev.default_hours_per_day : 0)));
    const duty = dev ? num(dev.duty_cycle, 1) : 1;
    const medical = dev ? !!dev.medical : !!s.medical;
    const baseSurge = dev && dev.typical_w > 0 ? (dev.surge_w / dev.typical_w) * watts : watts;
    const surge = Math.max(baseSurge, watts);
    const wh = watts * hours * duty * qty;
    whDay += wh;
    if (medical) whDayMed += wh;
    if (hours > 0) {
      cont += watts * qty;
      maxSurgeExtra = Math.max(maxSurgeExtra, surge - watts);
    }
    lines.push({ id, qty, watts, hours, duty, medical, wh_day: round(wh, 2) });
  }
  return {
    wh_day: round(whDay, 2),
    wh_day_med: round(whDayMed, 2),
    concurrent_w: round(cont, 2),
    peak_w: round(cont + maxSurgeExtra, 2),
    has_medical: whDayMed > 0,
    lines,
  };
}

export const whTotal = (whDay, days) => round(whDay * Math.max(0, days), 2);

/** Kapasitas power station rekomendasi (Wh), dibulatkan ke atas ke 10. */
export function recommendedCapacityWh(whTot, pd) {
  const c = constants(pd);
  if (!(whTot > 0)) return 0;
  const raw = (whTot / (c.inverter_efficiency * c.usable_capacity_factor)) * c.reserve_margin;
  return Math.ceil(round(raw / 10, 6) - EPS) * 10;
}

/** Daya keluaran minimum. */
export function minOutput(load, pd) {
  const c = constants(pd);
  const minCont = load.concurrent_w > 0 ? ceil6(load.concurrent_w * c.output_margin) : 0;
  const minSurge = load.peak_w > 0 ? ceil6(load.peak_w) : 0;
  return { min_continuous_w: minCont, min_surge_w: minSurge, recommended_output_w: Math.max(minCont, minSurge) };
}

/**
 * Energi tersimpan dari inventaris daya.
 * inv: { power_bank_mah, power_bank_qty, power_banks:[{mah,qty}], power_station_wh, spare_battery_wh, generator_w, generator_fuel_hours }
 */
export function storedEnergy(inv, pd) {
  const c = constants(pd);
  inv = inv || {};
  const banks = Array.isArray(inv.power_banks) ? inv.power_banks.slice() : [];
  if (num(inv.power_bank_mah) > 0) banks.push({ mah: inv.power_bank_mah, qty: num(inv.power_bank_qty, 1) });
  let nominal = 0;
  for (const b of banks) nominal += (num(b.mah) / 1000) * c.power_bank_nominal_v * num(b.qty, 1);
  const pb = nominal * c.power_bank_conversion_efficiency;
  const ps = num(inv.power_station_wh) * c.usable_capacity_factor * c.inverter_efficiency;
  const spare = num(inv.spare_battery_wh) * c.usable_capacity_factor; // ASUMSI: DC, tanpa inverter
  const gen = num(inv.generator_w) * num(inv.generator_fuel_hours) * c.genset_load_factor;
  return {
    power_bank_nominal_wh: round(nominal, 2),
    pb_wh: round(pb, 2),
    ps_wh: round(ps, 2),
    spare_wh: round(spare, 2),
    gen_wh: round(gen, 2),
    stored_wh: round(pb + ps + spare + gen, 2),
  };
}

export function solarWhDay(wp, pd, sunHours) {
  const c = constants(pd);
  const sun = sunHours != null && sunHours >= 0 ? sunHours : c.solar_peak_sun_hours;
  return round(num(wp) * sun * c.solar_derate, 2);
}

/** Hari daya total: angka atau 'self_sufficient'. */
export function daysPower(stored, whDay, solarDay) {
  const net = whDay - solarDay;
  if (whDay <= 0) return null;
  if (net <= EPS) return 'self_sufficient';
  return round(stored / net, 2);
}

/** Hari daya alat medis: angka, 'self_sufficient', atau null (tidak ada alat medis). */
export function daysPowerMedical(stored, whDayMed, solarDay) {
  if (!(whDayMed > 0)) return null;
  const net = Math.max(whDayMed - solarDay, 0);
  if (net <= EPS) return 'self_sufficient';
  return round(stored / net, 2);
}

/**
 * Ringkasan lengkap untuk UI dan engine.
 * state: { power_devices, power_inventory }, days: hari tanpa listrik.
 */
export function summarize(state, pd, days) {
  state = state || {};
  const inv = state.power_inventory || {};
  const sel = state.power_devices || {};
  const d = Math.max(1, num(days, num(inv.outage_days, 7)));
  const load = computeLoad(sel, pd);
  const stored = storedEnergy(inv, pd);
  const solar = solarWhDay(inv.solar_wp, pd, inv.solar_sun_hours);
  const total = whTotal(load.wh_day, d);
  const out = minOutput(load, pd);
  const dp = daysPower(stored.stored_wh, load.wh_day, solar);
  const dpm = daysPowerMedical(stored.stored_wh, load.wh_day_med, solar);
  const eff = typeof dp === 'number' ? dp : dp === 'self_sufficient' ? d : null;
  const shortWh = load.wh_day > 0 ? Math.max(0, round(total - stored.stored_wh - solar * d, 2)) : 0;
  return {
    days: d,
    wh_day: load.wh_day,
    wh_day_med: load.wh_day_med,
    wh_total: total,
    recommended_capacity_wh: recommendedCapacityWh(total, pd),
    ...out,
    concurrent_w: load.concurrent_w,
    peak_w: load.peak_w,
    has_medical: load.has_medical,
    stored,
    solar_wh_day: solar,
    days_power: dp,
    days_power_effective: eff,
    days_power_medical: dpm,
    short_wh: shortWh,
    lines: load.lines,
  };
}
