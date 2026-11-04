// QA bagian 2: layar, sentuh, fokus, label, h1, lang, ARIA. Output JSON ringkas + screenshots.
import { chromium, serve, reporter, REPO, baseState, KEY, ROUTES, seed } from './lib.mjs';
import fs from 'node:fs';
const { ok, fails } = reporter();
const srv = await serve();
const browser = await chromium.launch();
const VPS = [[360, 640], [320, 568], [412, 915]];
const rich = baseState({ profile: { ...baseState().profile, counts: { infant: 1, toddler: 1, child: 1, adult: 2, elderly: 1 }, pregnant: 1, pets: { dog: 1, cat: 1 }, meds: [{ label: 'Antihipertensi untuk Kakek', doses_per_day: 2, stock_days: 10 }], has_electric_medical: true }, scenarios: ['earthquake', 'tsunami', 'conflict', 'power_outage', 'pandemic'], inventory: { water_drinking: 40, flashlight: 1 } });
const findings = { overflow: [], touch: {}, clip: [], nolabel: [], h1: [], lang: [], focus: [], tab: [] };
async function audit(page, route, vp, theme) {
  return page.evaluate(() => {
    const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !e.closest('[hidden]') && !e.closest('.sr-only'); };
    const sel = 'a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[tabindex]:not([tabindex="-1"])';
    const small = [];
    for (const e of document.querySelectorAll(sel)) {
      if (!vis(e)) continue;
      let r = e.getBoundingClientRect(); let tgt = e;
      if (e.matches('input[type=checkbox],input[type=radio]')) { const lab = e.closest('label') || (e.id && document.querySelector('label[for="' + CSS.escape(e.id) + '"]')); const lr = lab && lab.getBoundingClientRect(); if (lr && lr.height > r.height) { r = lr; tgt = lab; } }
      const inline = e.tagName === 'A' && getComputedStyle(e).display === 'inline' && e.closest('p,li,span,td') && !e.closest('nav');
      if (r.height < 43.5 || r.width < 43.5) small.push({ t: e.tagName + (e.className ? '.' + String(e.className).split(' ')[0] : ''), txt: (e.innerText || e.getAttribute('aria-label') || e.value || '').trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height), inline: !!inline });
    }
    const clip = [];
    for (const e of document.querySelectorAll('main *,nav *,header *')) {
      if (!vis(e)) continue; const cs = getComputedStyle(e);
      if ((cs.overflow === 'hidden' || cs.overflowX === 'hidden' || cs.textOverflow === 'ellipsis') && e.scrollWidth > e.clientWidth + 1 && e.clientWidth > 0) clip.push(e.tagName + '.' + e.className + ' ' + (e.innerText || '').slice(0, 30));
      const r = e.getBoundingClientRect(); if (r.right > innerWidth + 1 && e.tagName !== 'HTML' && !e.closest('.sr-only') && cs.position !== 'fixed' && r.width > 0) clip.push('beyond-viewport ' + e.tagName + '.' + e.className + ' r=' + Math.round(r.right));
    }
    const nolabel = [];
    for (const e of document.querySelectorAll('input:not([type=hidden]),select,textarea')) {
      const has = e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || e.closest('label') || (e.id && document.querySelector('label[for="' + CSS.escape(e.id) + '"]'));
      if (!has) nolabel.push(e.tagName + '#' + e.id + '[' + (e.type || '') + '] name=' + e.name);
    }
    for (const e of document.querySelectorAll('button,a[href]')) { if (!vis(e)) continue; if (!(e.innerText || '').trim() && !e.getAttribute('aria-label') && !e.getAttribute('title') && !e.querySelector('img[alt]')) nolabel.push('NONAME ' + e.tagName + '.' + e.className); }
    const progress = [...document.querySelectorAll('progress,[role=progressbar],[role=meter]')].map((p) => ({ tag: p.tagName, label: p.getAttribute('aria-label') || p.getAttribute('aria-labelledby'), now: p.getAttribute('aria-valuenow') || p.value }));
    return { sw: document.documentElement.scrollWidth, iw: innerWidth, small, clip, nolabel, h1: document.querySelectorAll('h1').length, h1txt: (document.querySelector('h1') || {}).innerText, lang: document.documentElement.lang, navs: [...document.querySelectorAll('nav')].map((n) => n.getAttribute('aria-label')), landmarks: { main: document.querySelectorAll('main').length, header: document.querySelectorAll('header').length }, progress, title: document.title };
  });
}
for (const theme of ['light', 'dark']) {
  for (const [w, h] of VPS) {
    const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, colorScheme: theme });
    await seed(context, rich);
    const page = await context.newPage();
    for (const r of ROUTES) {
      await page.goto(srv.base + r); await page.reload(); await page.waitForSelector('main h1, main h2').catch(() => {}); await page.waitForTimeout(150);
      const a = await audit(page, r, w, theme);
      const tag = `${r}@${w}x${h}/${theme}`;
      if (a.sw > a.iw) findings.overflow.push(tag + ' sw=' + a.sw);
      const sm = a.small.filter((s) => !s.inline); if (sm.length) findings.touch[tag] = sm;
      if (a.clip.length) findings.clip.push({ tag, c: a.clip.slice(0, 4) });
      if (a.nolabel.length) findings.nolabel.push({ tag, n: a.nolabel.slice(0, 5) });
      if (a.h1 !== 1) findings.h1.push(tag + ' h1=' + a.h1);
      if (a.lang !== 'id') findings.lang.push(tag + ' lang=' + a.lang);
      if (theme === 'light' && w === 360) { findings.nav = findings.nav || {}; findings.nav[r] = { navs: a.navs, progress: a.progress, title: a.title, h1: a.h1txt }; }
      if (w === 360 && h === 640 && ['#/', '#/hasil', '#/inventaris/water', '#/profil', '#/daya', '#/keluarga', '#/belanja', '#/target', '#/info/panduan'].includes(r)) await page.screenshot({ path: `/tmp/qa-shots/${r.replace(/[#\/]/g, '_')}_${theme}.png`, fullPage: false });
    }
    await context.close();
  }
}
fs.writeFileSync('/tmp/qa-shots/layout.json', JSON.stringify(findings, null, 1));
console.log('overflow', findings.overflow.length, findings.overflow.slice(0, 10));
console.log('touch pages', Object.keys(findings.touch).length);
const agg = {}; for (const [k, v] of Object.entries(findings.touch)) for (const s of v) { const key = s.t + '|' + s.txt + '|' + s.w + 'x' + s.h; agg[key] = (agg[key] || 0) + 1; }
console.log(JSON.stringify(Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 40), null, 0));
console.log('clip', JSON.stringify(findings.clip.slice(0, 10)));
console.log('nolabel', JSON.stringify(findings.nolabel.slice(0, 10)));
console.log('h1', findings.h1.slice(0, 10), 'lang', findings.lang.slice(0, 3));
await browser.close(); srv.close();
