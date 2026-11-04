// Hanya untuk tes: membangun result dari tests/cases.json (tidak dipakai aplikasi).
import { indexById } from '../src/results.js';

/** Bangun result dari satu kasus uji (dipakai bila engine.js belum ada & oleh tes). */
export function fixtureResult(cases, itemsList, id) {
  const all = [].concat(cases.cases || [], cases.extra_cases || []);
  const c = all.find((x) => x.id === id) || all[0];
  const e = JSON.parse(JSON.stringify(c.expected || {}));
  const byId = indexById(itemsList || []);
  const head = (e.shortfall_head || []).map((s) => {
    const it = byId[s.id] || {};
    return Object.assign({ category: it.category, priority: it.priority, min_tier_gating: it.min_tier_gating, blocks_tier: it.min_tier_gating }, s);
  });
  e.status = 'ok';
  e.shortfall = head;
  e.tier_checks = e.tier && e.tier.checks_2_to_5;
  e.tier = Object.assign({ next_tier: null }, e.tier);
  if (e.tier.value != null && e.tier.value < 5 && e.tier.next_tier == null) e.tier.next_tier = e.tier.value + 1;
  return e;
}
