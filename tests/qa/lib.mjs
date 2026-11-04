// Pustaka bersama uji QA (Q1). Server statis dengan prefix opsional + helper Playwright.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
export const { chromium } = require('playwright');
export const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SHOTS = process.env.SHOTS_DIR || '/tmp/qa-shots';
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.md': 'text/markdown' };
export async function serve(root = REPO, prefix = '/') {
  const log = [];
  const server = http.createServer(async (req, res) => {
    const u = new URL(req.url, 'http://x');
    log.push(u.pathname);
    if (!u.pathname.startsWith(prefix)) { res.writeHead(404); return res.end(); }
    let rel = normalize(decodeURIComponent(u.pathname.slice(prefix.length))) || 'index.html';
    if (rel.endsWith('/') || rel === '.') rel = join(rel, 'index.html');
    if (rel.startsWith('..')) { res.writeHead(403); return res.end(); }
    try { const body = await readFile(join(root, rel)); res.writeHead(200, { 'content-type': MIME[extname(rel)] || 'application/octet-stream' }); res.end(body); }
    catch { res.writeHead(404); res.end('nf'); }
  });
  await new Promise((r) => server.listen(0, r));
  return { base: `http://localhost:${server.address().port}${prefix}`, log, close: () => server.close() };
}
export function reporter() {
  const results = [];
  const ok = (c, m, extra) => { results.push({ ok: !!c, m, extra }); console.log((c ? 'PASS ' : 'FAIL ') + m + (c || extra === undefined ? '' : '  => ' + JSON.stringify(extra))); };
  return { ok, results, fails: () => results.filter((r) => !r.ok).length };
}
export const KEY = 'survivalcheck.v1';
export const baseState = (over = {}) => Object.assign({
  profile: { counts: { infant: 0, toddler: 0, child: 0, adult: 2, elderly: 0 }, pregnant: 0, breastfeeding: 0, infant_feeding: 'formula', pets: { dog: 0, cat: 0 }, meds: [], has_electric_medical: false, usage_per_day: {}, scenarios: [], target_days: 7 },
  target: { days: 7 }, scenarios: [], inventory: {}, bag_checklist: {}, indicators: {}, power_inventory: null, power_devices: null,
  settings: { lang: 'id', theme: 'system', reminders: { check: true, water: true, drill: true, power: true }, reminderDone: {}, disclaimerAccepted: true },
  family_plan: {}, shopping: { checked: {}, hide_bought: false }, createdAt: '2026-11-04T00:00:00.000Z', updatedAt: '2026-11-04T00:00:00.000Z',
}, over);
export async function seed(context, state) {
  await context.addInitScript(([k, s]) => { if (!sessionStorage.getItem('__seeded')) { localStorage.setItem(k, s); sessionStorage.setItem('__seeded', '1'); } }, [KEY, JSON.stringify(state)]);
}
export const CATS = ['water','food','meds_firstaid','sanitation','lighting','power','communication','docs_cash','clothing_warmth','tools','gobag','special_needs','plan_knowledge'];
export const ROUTES = ['#/', '#/profil', '#/target', ...CATS.map((c) => '#/inventaris/' + c), '#/inventaris', '#/daya', '#/keluarga', '#/hasil', '#/belanja', '#/info', '#/info/darurat', '#/info/panduan', '#/info/air', '#/info/kartu', '#/info/sumber', '#/info/disclaimer', '#/info/tentang', '#/pengaturan'];
