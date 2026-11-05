// SurvivalCheck - shell aplikasi: router hash, navigasi, halaman statis, pengaturan.
import * as Store from './storage.js';
import * as I18n from './i18n.js';
import { glyph } from './icons.js';
import { rovingRadios } from './a11y.js';

const APP_VERSION = '1.0.0';
const DATA_FILES = {
  items: 'data/items.json',
  rules: 'data/rules.json',
  power: 'data/power.json',
  indicators: 'data/bnpb_family_indicators.json',
  buy: 'data/sources-to-buy.json',
  province_risks: 'data/province_risks.json',
};
const MONTH_MS = 30 * 24 * 3600 * 1000;
const REMINDERS = [
  { key: 'check', text: 'home.reminder_check_bag', months: 6 },
  { key: 'water', text: 'home.reminder_water', months: 6 },
  { key: 'drill', text: 'home.reminder_drill', months: 6 },
  { key: 'power', text: 'home.reminder_power', months: 3 },
];
const t = (k, v) => I18n.t(k, v);

// ---------- util DOM ----------
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v == null) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k in el && k !== 'list' && typeof v !== 'string' ) el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
}
const ICONS = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  box: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4"/><path d="M12 11v10"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 005 5L15 12l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"/>',
  gear: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>',
};
function icon(name) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true'); s.innerHTML = ICONS[name];
  return s;
}
function tt(key, idText, enText) { return I18n.has(key) ? t(key) : (I18n.getLang() === 'en' ? enText : idText); }
const fmtDate = (ts) => new Date(ts).toLocaleDateString(I18n.getLang() === 'en' ? 'en-GB' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

// ---------- state ----------
let state;
let storageError = null;
const data = {};

function persist() {
  state.updatedAt = new Date().toISOString();
  if (!state.createdAt) state.createdAt = state.updatedAt;
  return Store.save(state);
}
let announceTimer = null;
function announce(msg) {
  const live = document.getElementById('live');
  if (!live) return;
  live.textContent = '';
  setTimeout(() => { live.textContent = msg; }, 30);
}
function save(patch) {
  if (patch && typeof patch === 'object') Object.assign(state, patch);
  const ok = persist();
  clearTimeout(announceTimer);
  announceTimer = setTimeout(() => announce(ok ? t('a11y.saved_announce') : t('errors.storage_write')), 1200);
  return ok;
}
function hasProfile() {
  const c = state.profile && state.profile.counts;
  return !!c && Object.values(c).some((n) => Number(n) > 0);
}
function resetState(next) {
  for (const k of Object.keys(state)) delete state[k];
  Object.assign(state, next);
}

// ---------- tema & bahasa ----------
function applyTheme() {
  const th = state.settings.theme;
  if (th === 'light' || th === 'dark') document.documentElement.setAttribute('data-theme', th);
  else document.documentElement.removeAttribute('data-theme');
}
function isDark() {
  const th = state && state.settings && state.settings.theme;
  if (th === 'dark') return true;
  if (th === 'light') return false;
  return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
}
function toggleTheme() {
  state.settings.theme = isDark() ? 'light' : 'dark';
  applyTheme(); save();
  const b = document.getElementById('theme-toggle');
  if (b) b.setAttribute('aria-pressed', String(isDark()));
  announce(isDark() ? tt('nav.dark_on', 'Mode gelap aktif', 'Dark mode on') : tt('nav.dark_off', 'Mode terang aktif', 'Light mode on'));
}
function applyLang() {
  const l = I18n.setLang(state.settings.lang);
  document.documentElement.lang = l;
}
function setLang(l) {
  state.settings.lang = l === 'en' ? 'en' : 'id';
  applyLang(); save();
  buildShell();
  renderRoute();
}

// ---------- dialog & toast ----------
function confirmDialog({ title, body, action, danger = false }) {
  return new Promise((resolve) => {
    const opener = document.activeElement;
    const titleId = 'dlg-title', bodyId = 'dlg-body';
    const cancel = h('button', { class: 'btn', type: 'button' }, t('common.cancel'));
    const ok = h('button', { class: 'btn btn-primary', type: 'button' }, action);
    const dlg = h('div', { class: 'dialog', role: danger ? 'alertdialog' : 'dialog', 'aria-modal': 'true', 'aria-labelledby': titleId, 'aria-describedby': bodyId },
      h('h2', { id: titleId }, title), h('p', { id: bodyId }, body), h('div', { class: 'btn-row' }, cancel, ok));
    const overlay = h('div', { class: 'overlay' }, dlg);
    const close = (v) => { overlay.remove(); document.removeEventListener('keydown', onKey, true); if (opener && opener.focus) opener.focus(); resolve(v); };
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(false); }
      else if (e.key === 'Tab') {
        const f = [cancel, ok]; const i = f.indexOf(document.activeElement);
        e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    };
    cancel.addEventListener('click', () => close(false));
    ok.addEventListener('click', () => close(true));
    document.addEventListener('keydown', onKey, true);
    document.body.append(overlay);
    cancel.focus();
  });
}
function toast(msg) {
  document.querySelectorAll('.toast').forEach((n) => n.remove());
  const el = h('div', { class: 'toast', role: 'status' }, msg);
  document.body.append(el);
  announce(msg);
  setTimeout(() => el.remove(), 4000);
}

// ---------- shell ----------
const els = {};
let deferredInstall = null;
let swReg = null;
let updateReady = false;

function buildShell() {
  const root = document.getElementById('app');
  root.textContent = '';
  els.header = h('header', { class: 'app-header' },
    h('a', { class: 'brand', href: '#/' }, t('app.name')),
    h('a', { class: 'icon-link', href: '#/info/darurat', 'aria-label': t('info.emergency.title') }, icon('phone'), h('span', {}, t('info.emergency.title'))),
    h('button', { class: 'icon-link', id: 'theme-toggle', type: 'button', 'aria-pressed': String(isDark()), 'aria-label': tt('nav.dark_mode', 'Mode gelap', 'Dark mode'), onclick: toggleTheme },
      (() => { const a = icon('sun'); a.classList.add('i-sun'); return a; })(), (() => { const m = icon('moon'); m.classList.add('i-moon'); return m; })()),
    h('a', { class: 'icon-link', href: '#/pengaturan', 'aria-label': t('nav.settings') }, icon('gear')));
  els.banners = h('div', { class: 'banner-area', id: 'banners' });
  els.stepper = h('div', { id: 'stepper-wrap' });
  els.main = h('main', { class: 'app-main', id: 'main', tabindex: '-1' });
  els.nav = h('nav', { class: 'bottom-nav', 'aria-label': t('nav.main_label') },
    navLink('#/', 'home', t('nav.home'), 'home'),
    navLink('#/inventaris', 'box', t('nav.inventory'), 'stok'),
    navLink('#/info', 'menu', t('nav.more'), 'more'));
  const live = h('div', { id: 'live', class: 'sr-only', role: 'status', 'aria-live': 'polite' });
  const skip = h('a', { class: 'skip-link', href: '#main', onclick: (e) => { e.preventDefault(); els.main.focus(); } }, t('nav.skip_to_content'));
  root.append(skip, els.header, els.banners, els.main, els.nav, live);
  renderBanners();
}
function navLink(href, ic, label, tab) {
  return h('a', { href, 'data-tab': tab }, icon(ic), h('span', {}, label));
}
function renderBanners() {
  if (!els.banners) return;
  els.banners.textContent = '';
  if (storageError === 'read') {
    els.banners.append(h('div', { class: 'notice warn banner', role: 'alert' }, h('p', {}, t('errors.storage_read')),
      h('button', { class: 'btn', type: 'button', onclick: () => { Store.clearAll(); storageError = null; renderBanners(); renderRoute(); } }, t('errors.start_fresh'))));
  } else if (!Store.isAvailable()) {
    els.banners.append(h('div', { class: 'notice warn banner' }, h('p', {}, t('settings.storage_unavailable'))));
  }
  if (updateReady) {
    els.banners.append(h('div', { class: 'notice banner', role: 'status' }, h('p', {}, t('home.update_available')),
      h('button', { class: 'btn', type: 'button', onclick: applyUpdate }, t('home.update_action'))));
  }
}

// ---------- router ----------
const SETUP_STEPS = [
  { route: 'profil', label: () => t('nav.profile') },
  { route: 'target', label: () => t('target.title') },
  { route: 'keluarga', label: () => t('family_eval.title') },
];
const SCREENS = {
  profil: { mod: './forms.js', fn: 'renderProfile', css: ['styles/forms.css'] },
  target: { mod: './forms.js', fn: 'renderTarget', css: ['styles/forms.css'] },
  inventaris: { mod: './forms.js', fn: 'renderInventory', css: ['styles/forms.css'] },
  daya: { mod: './forms.js', fn: 'renderPower', css: ['styles/forms.css'] },
  keluarga: { mod: './forms.js', fn: 'renderIndicators', css: ['styles/forms.css'] },
  rincian: { mod: './results.js', fn: 'render', css: ['styles/results.css', 'styles/print.css'] },
  belanja: { mod: './shopping.js', fn: 'render', css: ['styles/results.css', 'styles/print.css'] },
};
const loadedCss = new Set();
function loadCss(href) {
  if (loadedCss.has(href)) return;
  loadedCss.add(href);
  const l = h('link', { rel: 'stylesheet', href });
  if (/print\.css$/.test(href)) l.media = 'print'; // print.css tidak punya @media sendiri
  l.addEventListener('error', () => l.remove());
  document.head.append(l);
}
const MODS = {
  './forms.js': () => import('./forms.js'),
  './results.js': () => import('./results.js'),
  './shopping.js': () => import('./shopping.js'),
};

function parseHash() {
  const path = (location.hash || '#/').replace(/^#/, '');
  const seg = path.split('/').filter(Boolean).map(decodeURIComponent);
  return { name: seg[0] || 'home', rest: seg.slice(1) };
}
function navigate(route) {
  const target = '#' + (String(route).replace(/^#/, '').startsWith('/') ? String(route).replace(/^#/, '') : '/' + String(route).replace(/^#/, ''));
  if (location.hash === target) renderRoute(); else location.hash = target;
}

let current = null; // modul layar aktif
let renderToken = 0;

function activeTab(name) {
  if (name === 'home' || name === 'rincian') return 'home';
  // Alur penyiapan (profil, target, keluarga) adalah bagian dari Stok.
  if (['profil', 'target', 'keluarga', 'inventaris', 'daya'].includes(name)) return 'stok';
  return 'more';
}

function updateChrome(name, rest) {
  const tab = activeTab(name);
  els.nav.querySelectorAll('a').forEach((a) => {
    if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  // Nav bawah selalu tampil; padding bawah (has-nav) mencegah konten tertutup.
  els.nav.hidden = false;
  document.body.classList.add('has-nav');
  // stepper
  document.querySelectorAll('.stepper-host').forEach((n) => n.remove());
  const idx = SETUP_STEPS.findIndex((s) => s.route === name);
  if (idx >= 0) {
    const ol = h('ol', { class: 'stepper' }, SETUP_STEPS.map((s, i) => h('li', { 'data-state': i < idx ? 'done' : i === idx ? 'current' : 'todo', 'aria-current': i === idx ? 'step' : false },
      h('a', { href: '#/' + s.route }, h('span', {}, String(i + 1) + '.'), h('span', {}, s.label())))));
    const host = h('div', { class: 'stepper-host' }, h('p', { class: 'step-count' }, t('common.step_of', { current: idx + 1, total: SETUP_STEPS.length })), h('nav', { 'aria-label': t('common.step_of', { current: idx + 1, total: SETUP_STEPS.length }) }, ol));
    els.main.before(host);
    els.stepperHost = host;
    host.style.cssText = 'max-width:40rem;margin:0 auto;padding:var(--sp-6) var(--sp-6) 0';
  }
}

async function renderRoute() {
  if (!els.main) return;
  const token = ++renderToken;
  if (current && typeof current.destroy === 'function') { try { current.destroy(); } catch (e) { /* abaikan */ } }
  current = null;
  let { name, rest } = parseHash();
  if (name === 'hasil') { history.replaceState(null, '', '#/'); name = 'home'; rest = []; }
  updateChrome(name, rest);
  const main = els.main;
  main.textContent = '';
  try {
    if (name === 'home') renderHome(main);
    else if (name === 'info') await renderInfo(main, rest[0]);
    else if (name === 'pengaturan') renderSettings(main);
    else if (SCREENS[name]) await renderScreen(main, name, rest, token);
    else renderNotFound(main);
  } catch (e) {
    console.error(e);
    main.textContent = '';
    main.append(h('h1', {}, t('errors.generic')), h('a', { class: 'btn', href: '#/' }, t('errors.go_home')));
  }
  if (token !== renderToken) return;
  const h1 = main.querySelector('h1');
  const appName = t('app.name');
  document.title = h1 && h1.textContent && h1.textContent.trim() !== appName ? h1.textContent + ' · ' + appName : appName;
  if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
  window.scrollTo(0, 0);
}

async function renderScreen(main, name, rest, token) {
  const def = SCREENS[name];
  let mod = null;
  try { mod = await MODS[def.mod](); } catch (e) { mod = null; }
  if (token !== renderToken) return;
  const fn = mod && mod[def.fn];
  if (typeof fn !== 'function') { renderComingSoon(main, name); return; }
  def.css.forEach(loadCss);
  current = mod;
  const params = name === 'inventaris' ? { category: rest[0] || null } : { rest };
  await fn(main, ctx, params);
}
function renderComingSoon(main, name) {
  main.append(h('h1', {}, tt('common.coming_soon', 'Segera hadir', 'Coming soon')),
    h('div', { class: 'card' }, h('p', {}, tt('common.coming_soon_body', 'Bagian ini sedang disiapkan dan akan tersedia pada pembaruan berikutnya.', 'This section is being prepared and will be available in an upcoming update.'))),
    h('a', { class: 'btn', href: '#/' }, t('errors.go_home')));
}
function renderNotFound(main) {
  main.append(h('h1', {}, t('errors.not_found')), h('a', { class: 'btn btn-primary', href: '#/' }, t('errors.go_home')));
}

// ---------- Beranda ----------
let dismissedReminder = null;
function dueReminder() {
  if (!state.createdAt) return null;
  const now = Date.now();
  for (const r of REMINDERS) {
    if (state.settings && state.settings.reminders && state.settings.reminders[r.key] === false) continue;
    if (dismissedReminder === r.key) continue;
    const since = Date.parse(((state.settings && state.settings.reminderDone) || {})[r.key] || state.createdAt);
    if (now - since > r.months * MONTH_MS) return r;
  }
  return null;
}
const BOTTLENECK_KEY = { water: 'water', food: 'kcal', meds: 'meds', infant_food: 'baby_food', power: 'power_medical' };
// Pilihan hari persediaan di Beranda: ganti target (mis. 3 -> 7 hari) tanpa membuka halaman Target.
const HOME_DAY_PRESETS = [3, 7, 14, 30];
let pendingFocus = null; // selector yang difokuskan lagi setelah Beranda dirender ulang (navigasi panah)
function daysPicker(current) {
  const row = h('div', { class: 'preset-row', role: 'radiogroup', 'aria-label': tt('home.days_label', 'Target hari persediaan', 'Supply target (days)') });
  for (const d of HOME_DAY_PRESETS) {
    row.append(h('button', {
      type: 'button', role: 'radio', 'aria-checked': String(d === current),
      onclick: () => { save({ target: { days: d, custom: false } }); pendingFocus = '.days-picker-home [aria-checked="true"]'; renderRoute(); },
    }, tt('common.units.day', '{n} hari', '{n} days').replace('{n}', String(d))));
  }
  rovingRadios(row);
  const custom = !HOME_DAY_PRESETS.includes(current);
  return h('section', { class: 'days-picker-home' },
    h('h2', {}, tt('home.days_title', 'Target persediaan', 'Supply target')),
    row,
    h('p', { class: 'muted center' }, custom
      ? tt('home.days_custom', 'Target sekarang {n} hari. ', 'Current target is {n} days. ').replace('{n}', String(current))
      : '', h('a', { class: 'link-touch', href: '#/target' }, tt('home.days_other', 'Atur jumlah hari lain', 'Set another number of days'))));
}

async function fillHome(slot) {
  let r = null;
  try { const eng = await import('./engine.js'); r = eng.evaluate(state, data); } catch (e) { r = null; }
  slot.textContent = '';
  if (!r || r.status !== 'ok') {
    slot.append(h('a', { class: 'btn btn-primary btn-block cta', href: '#/profil' }, tt('home.start_check', 'Mulai cek kesiapan', 'Start readiness check')));
    return;
  }
  const lang = I18n.getLang();
  const s = r.survival, target = r.targets.effective_target_days, d = s.days;
  const ok = d >= target;
  const num = d < 1 ? '<1' : '\u00b1 ' + d;
  slot.append(
    h('div', { class: 'dial', role: 'img', 'aria-label': d < 1 ? t('result.survive_less_than_one') : t('result.survive_value', { n: d }) },
      h('span', { class: 'dial-lbl' }, tt('home.survive_label', 'bisa bertahan', 'can last')),
      h('span', { class: 'dial-num' }, num),
      h('span', { class: 'dial-unit' }, tt('f.days', 'hari', 'days'))),
    h('div', { class: 'pill-row' },
      h('span', { class: 'pill' }, t('result.survive_target', { n: target })),
      ok ? null : h('span', { class: 'pill' }, tt('home.short_days', 'Kurang {n} hari', 'Short by {n} days').replace('{n}', String(target - d)))),
    h('p', { class: 'hero-note' }, ok ? t('result.bottleneck_ok')
      : t('result.bottleneck_line', { resource: t('result.bottleneck.' + (BOTTLENECK_KEY[s.bottleneck] || s.bottleneck)), n: Math.min(365, Math.max(1, d)) })),
    daysPicker(target));
  // kartu tier + langkah berikutnya
  const n = r.tier.value;
  const seg = h('span', { class: 'seg-row', role: 'img', 'aria-label': t('tiers.segments_label', { n }) }, [1, 2, 3, 4, 5].map((i) => h('i', { class: i <= n ? 'on' : '' })));
  const tierCard = h('a', { class: 'card tier-card', href: '#/rincian' },
    h('span', { class: 'tier-top' }, seg, n >= 2 ? h('span', { class: 'chip' }, t('tiers.bnpb_badge')) : null),
    h('span', { class: 'tier-sub' }, t('tiers.of', { n })), h('span', { class: 'tier-name', style: 'display:block' }, t('tiers.' + n + '.name')),
    h('span', { class: 'tier-more' }, t('result.detail_cta')));
  const first = (r.shortfall || []).find((x) => x.missing != null);
  const slotAfter = [tierCard];
  if (first) {
    const it = (data.items.items || []).find((x) => x.id === first.id) || {};
    const name = it.label ? (it.label[lang] || it.label.id) : first.id;
    slotAfter.push(h('section', { class: 'next-card' }, h('h2', {}, tt('home.next_title', 'Langkah berikutnya', 'Next step')),
      h('p', {}, h('strong', {}, name), first.unit ? ' \u00b7 ' + tt('home.missing', 'kurang', 'short') + ' ' + first.missing + ' ' + first.unit : ''),
      h('a', { class: 'btn btn-primary btn-block', href: '#/inventaris' }, tt('home.fill_stock', 'Isi persediaan', 'Fill in stock'))));
  }
  slotAfter.push(h('div', { class: 'stat-grid' },
    h('a', { class: 'card', href: '#/inventaris/gobag' }, h('div', { class: 'muted' }, tt('home.bag', 'Tas siaga', 'Go-bag')), h('div', { class: 'stat-n' }, r.bag.yes + ' / ' + r.bag.applicable)),
    h('a', { class: 'card', href: '#/keluarga' }, h('div', { class: 'muted' }, tt('home.family', 'Keluarga', 'Family')), h('div', { class: 'stat-n' }, r.family.total == null ? '-' : r.family.total + ' / 36'))));
  slot.after(...slotAfter);
  if (pendingFocus) { const f = document.querySelector(pendingFocus); pendingFocus = null; if (f) f.focus(); }
}

function renderHome(main) {
  const started = hasProfile();
  if (started) {
    const slot = h('section', { class: 'hero', 'aria-live': 'polite' });
    main.append(h('h1', { class: 'sr-only' }, tt('home.ready_title', 'Kesiapan rumahmu', 'Your household readiness')), slot);
    fillHome(slot);
  } else {
    main.append(h('h1', { class: 'center' }, tt('home.ready_title', 'Kesiapan rumahmu', 'Your household readiness')),
      h('section', { class: 'hero' },
        h('div', { class: 'dial', role: 'img', 'aria-label': tt('home.empty_dial', 'Belum diukur', 'Not measured yet') },
          h('span', { class: 'dial-num' }, '?'),
          h('span', { class: 'dial-unit' }, tt('home.empty_dial', 'belum diukur', 'not measured yet'))),
        h('a', { class: 'btn btn-primary btn-block cta', href: '#/profil' }, tt('home.start_check', 'Mulai cek kesiapan', 'Start readiness check'))));
  }
  const rem = dueReminder();
  if (rem) {
    main.append(h('div', { class: 'notice warn', role: 'status' }, h('p', {}, t(rem.text)),
      h('div', { class: 'btn-row' },
        h('button', { class: 'btn', type: 'button', onclick: () => { state.settings = state.settings || {}; state.settings.reminderDone = state.settings.reminderDone || {}; state.settings.reminderDone[rem.key] = new Date().toISOString(); save(); renderRoute(); } }, t('home.reminder_done')),
        h('button', { class: 'btn', type: 'button', onclick: () => { dismissedReminder = rem.key; renderRoute(); } }, t('home.reminder_dismiss')))));
  }
  if (deferredInstall) {
    main.append(h('button', { class: 'btn btn-block', type: 'button', onclick: async () => { const p = deferredInstall; deferredInstall = null; p.prompt(); try { await p.userChoice; } catch (e) { /* abaikan */ } renderRoute(); } }, t('home.install_button')));
  }
  main.append(h('p', { class: 'foot-note' }, h('a', { href: '#/info/disclaimer' }, t('disclaimer.title'))));
}

// ---------- Info offline ----------
async function renderInfo(main, sub) {
  const back = () => h('a', { class: 'back-link', href: '#/info' }, icon('back'), ' ', t('common.back'));
  if (!sub) {
    main.append(h('h1', {}, t('info.title')), h('p', { class: 'muted' }, t('info.offline_note')),
      h('ul', { class: 'link-list' },
        [['#/info/darurat', t('info.emergency.title')], ['#/info/panduan', t('info.guides.title')], ['#/info/air', t('info.water.title')],
          ['#/info/kartu', t('info.family_plan.title')], ['#/rincian', t('result.detail_cta')], ['#/belanja', t('nav.shopping')], ['#/info/sumber', t('info.sources.title')],
          ['#/info/disclaimer', t('disclaimer.title')], ['#/pengaturan', t('settings.title')], ['#/info/tentang', t('info.about.title')]]
          .map(([href, label]) => h('li', {}, h('a', { href }, h('span', {}, label))))));
    return;
  }
  main.append(back());
  if (sub === 'darurat') return infoEmergency(main);
  if (sub === 'panduan') return infoGuides(main);
  if (sub === 'air') return infoWater(main);
  if (sub === 'kartu') return infoFamilyPlan(main);
  if (sub === 'sumber') return infoSources(main);
  if (sub === 'disclaimer') { main.append(h('h1', {}, t('disclaimer.title')), h('p', {}, t('disclaimer.full'))); return; }
  if (sub === 'tentang') {
    main.append(h('h1', {}, t('info.about.title')), h('p', {}, t('info.about.body')), h('p', {}, t('info.about.no_prices')), h('p', { class: 'muted' }, t('app.version', { version: APP_VERSION })));
    return;
  }
  main.textContent = ''; renderNotFound(main);
}

const TEL = { n112: ['112'], n110: ['110'], n113: ['113'], n115: ['115'], n117: ['117'], n118_119: ['118'], n119_spgdt: ['119'], n123: ['123'], n196: ['196'] };
function infoEmergency(main) {
  main.append(h('h1', {}, t('info.emergency.title')));
  const grid = h('div', { class: 'tel-grid' });
  for (const [key, nums] of Object.entries(TEL)) {
    const text = t('info.emergency.' + key);
    const desc = text.includes(': ') ? text.slice(text.indexOf(': ') + 2) : text;
    for (const n of nums) {
      grid.append(h('div', { class: 'tel-row' }, h('a', { class: 'btn btn-primary', href: 'tel:' + n, 'aria-label': t('a11y.call_number', { number: n }) }, n), h('span', {}, desc, key === 'n112' ? [' ', h('span', { class: 'chip' }, t('info.emergency.main_mark'))] : null)));
    }
  }
  main.append(grid, h('p', { class: 'notice warn' }, t('info.emergency.n112_caveat')), h('p', { class: 'muted' }, t('info.emergency.verify_note')));
  main.append(h('h2', {}, t('info.channels.title')), h('ul', {}, ['inarisk', 'infobmkg', 'magma', 'satusehat'].map((k) => h('li', {}, t('info.channels.' + k)))), h('p', { class: 'muted' }, t('info.channels.online_only')));
  main.append(h('div', { class: 'btn-row' }, h('button', { class: 'btn', type: 'button', onclick: () => window.print() }, t('info.emergency.print_card'))));
}

function infoGuides(main) {
  main.append(h('h1', {}, t('info.guides.title')), h('p', { class: 'muted' }, t('info.guides.not_substitute')));
  const scenarios = (data.items && data.items.scenarios) || [];
  for (const sc of scenarios) {
    const intl = sc.id === 'conflict' || sc.id === 'nuclear';
    const body = h('div', {});
    if (sc.id === 'tsunami') body.append(h('p', { class: 'notice warn' }, h('strong', {}, t('info.guides.tsunami_lead'))), h('p', { class: 'muted' }, t('info.guides.tsunami_note')));
    if (sc.id === 'conflict') body.append(h('p', {}, t('info.guides.conflict_lead')));
    if (sc.id === 'nuclear') body.append(h('p', {}, t('info.guides.nuclear_lead')), h('div', { class: 'notice warn' }, h('strong', {}, t('info.guides.ki_title')), h('p', {}, t('info.guides.ki_body'))), h('p', {}, t('info.guides.nuclear_shelter')));
    if (intl) body.append(h('p', { class: 'muted' }, t('scenarios.note_international')));
    body.append(h('p', { class: 'muted' }, t('scenarios.' + sc.id + '_desc')));
    for (const phase of ['before', 'during', 'after']) {
      const pts = I18n.raw('info.guides.' + sc.id + '.' + phase);
      const list = Array.isArray(pts) ? pts : typeof pts === 'string' ? [pts] : [];
      if (!list.length) continue;
      body.append(h('h3', {}, t('info.guides.' + phase)), h('ul', {}, list.map((p) => h('li', {}, String(p)))));
    }
    const src = I18n.raw('info.guides.' + sc.id + '.source');
    if (typeof src === 'string') body.append(h('p', { class: 'muted small' }, t('info.guides.source_line', { source: src })));
    main.append(h('details', { class: 'guide' }, h('summary', {}, h('span', {}, I18n.getLang() === 'en' ? sc.label.en : sc.label.id), h('span', { class: 'chip ' + (intl ? 'chip-info' : '') }, t(intl ? 'scenarios.label_international' : 'scenarios.label_national'))), body));
  }
}

function infoWater(main) {
  main.append(h('h1', {}, t('info.water.title')), h('div', { class: 'notice danger', role: 'note' }, h('strong', {}, glyph('warn'), t('disclaimer.title')), h('p', {}, t('info.water.label_rule'))));
  for (const k of ['boil', 'settle', 'bleach', 'iodine', 'tablet']) {
    main.append(h('section', { class: 'card' }, h('h2', {}, t(`info.water.${k}_title`)), h('p', {}, t(`info.water.${k}_body`))));
  }
  main.append(h('p', { class: 'muted' }, t('info.water.store_tip')));
}

function infoFamilyPlan(main) {
  const fp = state.family_plan || (state.family_plan = {});
  main.append(h('h1', {}, t('info.family_plan.title')), h('p', {}, t('info.family_plan.intro')));
  const fields = ['meeting_point', 'far_contact', 'bag_carrier', 'helper', 'route', 'contacts'];
  for (const f of fields) {
    const id = 'fp-' + f;
    const input = f === 'contacts' || f === 'route' ? h('textarea', { id, rows: 3 }) : h('input', { id, type: 'text' });
    input.value = fp[f] || '';
    input.addEventListener('input', () => { state.family_plan[f] = input.value; save(); });
    main.append(h('div', { class: 'field' }, h('label', { for: id }, t('info.family_plan.' + f)), input));
  }
  main.append(h('p', { class: 'muted' }, t('common.saved_auto')), h('div', { class: 'btn-row' }, h('button', { class: 'btn btn-primary', type: 'button', onclick: () => window.print() }, t('info.family_plan.print'))),
    h('p', { class: 'print-only' }, t('disclaimer.footer_print', { date: fmtDate(Date.now()) })));
}

async function infoSources(main) {
  main.append(h('h1', {}, t('info.sources.title')), h('p', {}, t('info.sources.intro')), h('p', { class: 'muted' }, t('info.sources.bnpb_citation')));
  let text = '';
  try { const r = await fetch('docs/sources.md'); if (!r.ok) throw new Error(r.status); text = await r.text(); } catch (e) {
    main.append(h('p', { class: 'notice warn' }, t('errors.data_load'))); return;
  }
  const groups = parseSources(text);
  if (!groups.length) { main.append(h('p', { class: 'notice warn' }, t('errors.data_load'))); return; }
  for (const g of groups) {
    main.append(h('h2', {}, g.title));
    main.append(h('ul', { class: 'src-list' }, g.rows.map((r) => h('li', {},
      h('strong', {}, r.title), h('br'), h('span', { class: 'muted' }, [r.agency, r.id].filter(Boolean).join(' · ')), h('br'),
      r.url ? h('a', { href: r.url, target: '_blank', rel: 'noopener noreferrer', 'aria-label': r.title + '. ' + t('a11y.external_link') }, t('info.sources.open_link')) : null,
      h('br'),
      h('span', { class: 'chip ' + (/DIBACA/i.test(r.evidence) ? 'chip-ok' : 'chip-warn') }, glyph(/DIBACA/i.test(r.evidence) ? 'check' : 'tri'), t(/DIBACA/i.test(r.evidence) ? 'info.sources.evidence_read' : 'info.sources.evidence_snippet')),
      r.accessed ? h('span', { class: 'muted' }, ' ' + t('info.sources.accessed_on', { date: r.accessed })) : null))));
  }
}
function parseSources(md) {
  const groups = []; let cur = null; let cols = null;
  for (const line of md.split('\n')) {
    const hm = /^##\s+(.+)/.exec(line);
    if (hm) { cur = { title: hm[1].trim(), rows: [] }; groups.push(cur); cols = null; continue; }
    if (!line.startsWith('|') || !cur) continue;
    const cells = line.replace(/^\||\|\s*$/g, '').split('|').map((c) => c.trim());
    if (/^-+$/.test(cells[0].replace(/[:\s]/g, '')) ) continue;
    if (!cols) { cols = cells.map((c) => c.toLowerCase()); continue; }
    const col = (name) => { const i = cols.findIndex((c) => c.includes(name)); return i >= 0 ? cells[i] || '' : ''; };
    const id = col('id').replace(/`/g, '');
    if (!id) continue;
    cur.rows.push({ id, title: col('judul') || col('title'), agency: col('lembaga') || col('agency'), url: col('url').replace(/^<|>$/g, ''), accessed: col('diakses'), evidence: col('bukti') });
  }
  return groups.filter((g) => g.rows.length);
}

// ---------- Pengaturan ----------
function radioGroup(name, legend, options, value, onChange) {
  return h('fieldset', { class: 'field' }, h('legend', {}, legend), options.map(([v, label]) => {
    const input = h('input', { type: 'radio', name, value: v, checked: v === value });
    input.addEventListener('change', () => onChange(v));
    return h('label', { class: 'choice' }, input, h('span', {}, label));
  }));
}
function renderSettings(main) {
  main.append(h('h1', {}, t('settings.title')));
  if (!Store.isAvailable()) main.append(h('p', { class: 'notice warn' }, t('settings.storage_unavailable')));
  main.append(h('section', { class: 'card' },
    radioGroup('lang', t('settings.language'), [['id', t('settings.language_id')], ['en', t('settings.language_en')]], state.settings.lang, setLang),
    radioGroup('theme', t('settings.theme'), [['system', t('settings.theme_system')], ['light', t('settings.theme_light')], ['dark', t('settings.theme_dark')]], state.settings.theme || 'system', (v) => { state.settings.theme = v; applyTheme(); save(); })));
  // pengingat
  const rem = h('fieldset', { class: 'field' }, h('legend', {}, t('settings.reminders')));
  for (const [k, key] of [['check', 'settings.reminder_check'], ['water', 'settings.reminder_water'], ['drill', 'settings.reminder_drill'], ['power', 'settings.reminder_power']]) {
    const cb = h('input', { type: 'checkbox', checked: state.settings.reminders[k] !== false });
    cb.addEventListener('change', () => { state.settings.reminders[k] = cb.checked; save(); });
    rem.append(h('label', { class: 'choice' }, cb, h('span', {}, t(key))));
  }
  rem.append(h('p', { class: 'muted' }, t('settings.reminders_hint')));
  main.append(h('section', { class: 'card' }, rem));
  // cadangan
  const status = h('p', { role: 'status', 'aria-live': 'polite', class: 'notice ok', hidden: true });
  const showStatus = (msg, kind = 'ok') => { status.hidden = false; status.className = 'notice ' + (kind === 'ok' ? 'ok' : 'danger'); status.textContent = msg; };
  const file = h('input', { type: 'file', accept: 'application/json,.json', class: 'sr-only', id: 'import-file', tabindex: '-1', 'aria-label': t('settings.import') });
  file.addEventListener('change', async () => {
    const f = file.files && file.files[0]; file.value = '';
    if (!f) return;
    let next;
    try { next = Store.parseImport(await f.text()); } catch (e) { showStatus(t('settings.import_error_' + (['format', 'version', 'read'].includes(e.message) ? e.message : 'read')), 'err'); return; }
    const ok = await confirmDialog({ title: t('settings.import_confirm_title'), body: t('settings.import_confirm_body'), action: t('settings.import_confirm_action'), danger: true });
    if (!ok) return;
    resetState(next); applyLang(); applyTheme(); save(); buildShell(); renderRoute(); toast(t('settings.import_done'));
  });
  main.append(h('section', { class: 'card' }, h('h2', {}, t('settings.backup')),
    h('p', { class: 'muted' }, t('settings.export_hint')),
    h('div', { class: 'btn-row' },
      h('button', { class: 'btn', type: 'button', onclick: () => { downloadFile(`survivalcheck-backup-${new Date().toISOString().slice(0, 10)}.json`, Store.exportJSON(state), 'application/json'); showStatus(t('settings.export_done')); } }, t('settings.export')),
      h('button', { class: 'btn', type: 'button', onclick: () => file.click() }, t('settings.import'))),
    h('p', { class: 'muted' }, t('settings.import_hint')), file, status));
  // pembaruan data
  const upStatus = h('p', { class: 'muted', role: 'status', 'aria-live': 'polite' });
  main.append(h('section', { class: 'card' }, h('h2', {}, t('settings.data_update')),
    h('button', { class: 'btn', type: 'button', onclick: async () => {
      if (!navigator.onLine || !swReg) { upStatus.textContent = t('settings.data_update_offline'); return; }
      try { await swReg.update(); } catch (e) { upStatus.textContent = t('settings.data_update_offline'); return; }
      upStatus.textContent = updateReady ? t('home.update_available') : t('settings.data_update_current');
    } }, t('settings.data_update_check')), upStatus));
  // privasi, hapus, tentang
  main.append(h('section', { class: 'card' }, h('h2', {}, t('settings.privacy_title')), h('p', {}, t('settings.privacy_body'))));
  main.append(h('section', { class: 'card' }, h('p', { class: 'muted' }, t('settings.delete_hint')),
    h('button', { class: 'btn', type: 'button', onclick: async () => {
      const ok = await confirmDialog({ title: t('settings.delete_confirm_title'), body: t('settings.delete_confirm_body'), action: t('settings.delete_confirm_action'), danger: true });
      if (!ok) return;
      Store.clearAll();
      const lang = state.settings.lang;
      resetState(Store.defaultState()); state.settings.lang = lang;
      applyLang(); applyTheme(); dismissedReminder = null;
      buildShell(); navigate('/'); toast(t('settings.delete_done'));
    } }, t('settings.delete_all'))));
  main.append(h('p', { class: 'muted' }, t('app.version', { version: APP_VERSION }) + ' · ', h('a', { href: '#/info/tentang' }, t('info.about.title'))));
}
function downloadFile(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = h('a', { href: url, download: name }); document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ---------- service worker ----------
function applyUpdate() {
  if (swReg && swReg.waiting) swReg.waiting.postMessage({ type: 'SKIP_WAITING' });
  else location.reload();
}
function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (updateReady && !reloading) { reloading = true; location.reload(); } else refreshOfflineChip();
  });
  navigator.serviceWorker.register('sw.js').then((reg) => {
    swReg = reg;
    const watch = (w) => w && w.addEventListener('statechange', () => {
      if (w.state === 'installed' && navigator.serviceWorker.controller) { updateReady = true; renderBanners(); }
    });
    if (reg.waiting && navigator.serviceWorker.controller) { updateReady = true; renderBanners(); }
    reg.addEventListener('updatefound', () => watch(reg.installing));
    navigator.serviceWorker.ready.then(refreshOfflineChip);
  }).catch((e) => console.warn('SW gagal didaftarkan', e));
}
function refreshOfflineChip() {
  const chip = document.getElementById('offline-chip');
  if (!chip) return;
  const ready = !!navigator.serviceWorker.controller || !!(swReg && swReg.active);
  chip.className = 'chip ' + (ready ? 'chip-ok' : 'chip-info');
  chip.textContent = (ready ? '✓ ' : '○ ') + t(ready ? 'home.offline_ready' : 'home.offline_preparing');
}

// ---------- ctx ----------
const ctx = {
  t,
  get lang() { return I18n.getLang(); },
  setLang,
  get state() { return state; },
  save,
  navigate,
  data,
  confirm: confirmDialog,
  toast,
  announce,
  storageAvailable: () => Store.isAvailable(),
};

// ---------- boot ----------
async function boot() {
  const app = document.getElementById('app');
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; if (parseHash().name === 'home' && els.main) renderRoute(); });
  window.addEventListener('appinstalled', () => { deferredInstall = null; });
  try {
    const loaded = Store.load();
    state = loaded.state; storageError = loaded.error;
    await I18n.loadDicts();
    await Promise.all(Object.entries(DATA_FILES).map(async ([k, f]) => {
      const r = await fetch(f);
      if (!r.ok) throw new Error(f + ' ' + r.status);
      data[k] = await r.json();
    }));
    data.scenarios = data.items.scenarios; data.categories = data.items.categories;
  } catch (e) {
    console.error(e);
    app.textContent = '';
    app.append(h('main', { class: 'app-main' }, h('h1', {}, 'SurvivalCheck'), h('p', { class: 'notice warn', role: 'alert' }, I18n.has('errors.data_load') ? t('errors.data_load') : 'Data aplikasi gagal dimuat. Muat ulang halaman.'),
      h('button', { class: 'btn btn-primary', type: 'button', onclick: () => location.reload() }, I18n.has('errors.reload') ? t('errors.reload') : 'Muat ulang')));
    return;
  }
  applyLang(); applyTheme();
  buildShell();
  window.addEventListener('hashchange', renderRoute);
  await renderRoute();
  registerSW();
}
boot();
