// SurvivalCheck - Daftar belanja (E3). Fungsi murni buildShoppingList/toPlainText bebas DOM (diuji di Node).
import { h, tr, fill, fmt, arr, indexById, loc, loadResult, normalizeShortfall } from './results.js';

const LABEL_NOTE_IDS = /water_treatment|bleach|chlorine|iodine|purif|filter|mask/;
const RX_NOTE_IDS = /^(meds_personal|elderly_meds|pet_meds)$/;
const FALLBACK = {
  title: 'Daftar belanja kesiapsiagaan',
  for: 'Untuk {n} orang, target {days} hari',
  free: 'Gratis atau resmi',
  home: 'Biasanya sudah ada di rumah (cek dulu)',
  other: 'Lainnya',
  diy: 'Alternatif hemat atau buat sendiri',
  needs_input: 'isi pemakaian harian dulu',
  noPrice: 'Tanpa harga. Nama toko hanya contoh umum.',
  label: 'Untuk pemutih, yodium, dan tablet: cek kadar dan petunjuk di label.',
  rx: 'Obat resep: tanyakan ke dokter, fasilitas kesehatan, atau apotek. Jangan membeli obat keras tanpa resep.',
};

/**
 * Susun daftar belanja dari result engine.
 * Aturan penempatan item (urutan): sering ada di rumah -> "home"; punya toko -> toko pertama (paling umum);
 * punya jalur gratis/resmi -> "free"; sisanya -> "other". Item ber-DIY juga muncul di bagian `diy`.
 * @returns {{meta, groups:[{id,kind,key,label,items}], diy:[], notes:{label:boolean,rx:boolean}}}
 */
export function buildShoppingList(result, data, lang = 'id', checked = {}) {
  const itemsById = indexById(arr(data && data.items, 'items'));
  const buy = (data && data.buy) || {};
  const buyById = buy.items || {};
  const storeTypes = arr(buy, 'store_types');
  const storeLabel = {};
  for (const s of storeTypes) storeLabel[s.id] = loc(s.label, lang) || s.id;

  const buckets = {};
  const put = (kind, id, entry) => {
    const bid = kind === 'store' ? id : kind;
    (buckets[bid] = buckets[bid] || { id: bid, kind, items: [] }).items.push(entry);
  };
  const diy = [];
  let flagLabel = false;
  let flagRx = false;

  for (const s of normalizeShortfall(result || {}, itemsById)) {
    const needsInput = s.status === 'needs_input' || s.missing == null;
    if (!needsInput && !(s.missing > 0)) continue;
    const it = itemsById[s.id] || {};
    const b = buyById[s.id] || {};
    const entry = {
      id: s.id,
      label: loc(it.label, lang) || s.id,
      qty: needsInput ? null : s.missing,
      unit: s.unit || it.unit || '',
      needsInput,
      priority: s.priority,
      why: loc(it.why, lang),
      tip: b.buy_tip ? loc(b.buy_tip, lang) : '',
      diy: b.diy ? loc(b.diy, lang) : '',
      free: b.free_official ? { text: loc(b.free_official, lang), source: b.free_official.source || '' } : null,
      examples: b.examples || [],
      stores: b.stores || [],
      atHome: !!b.often_at_home,
      checked: !!checked[s.id],
    };
    if (LABEL_NOTE_IDS.test(s.id)) flagLabel = true;
    if (RX_NOTE_IDS.test(s.id)) flagRx = true;
    if (entry.diy) diy.push({ id: s.id, label: entry.label, text: entry.diy });
    if (entry.atHome) put('home', null, entry);
    else if (entry.stores.length) put('store', entry.stores[0], entry);
    else if (entry.free) put('free', null, entry);
    else put('other', null, entry);
  }

  const groups = [];
  for (const s of storeTypes) {
    if (s.id === 'free_official') continue;
    if (buckets[s.id]) groups.push(Object.assign(buckets[s.id], { key: 'stores.' + s.id, label: storeLabel[s.id] }));
  }
  if (buckets.free_official) groups.push(Object.assign(buckets.free_official, { key: 'stores.free_official', label: FALLBACK.free }));
  if (buckets.free) groups.push(Object.assign(buckets.free, { key: 'shopping.group_free_official', label: FALLBACK.free }));
  if (buckets.other) groups.push(Object.assign(buckets.other, { key: 'shopping.group_other', label: FALLBACK.other }));
  if (buckets.home) groups.push(Object.assign(buckets.home, { key: 'shopping.group_at_home', label: FALLBACK.home }));

  const all = groups.flatMap((g) => g.items);
  return {
    meta: {
      persons: result && result.household ? result.household.n_total : null,
      days: result && result.targets ? result.targets.effective_target_days : null,
      total: all.length,
      done: all.filter((e) => e.checked).length,
    },
    groups,
    diy,
    notes: { label: flagLabel, rx: flagRx },
  };
}

function T(t, key, fallback, vars) {
  let v;
  try { v = t ? t(key, vars) : undefined; } catch (e) { v = undefined; }
  return v == null || v === '' || v === key ? fill(fallback == null ? key : fallback, vars) : v;
}

/** Teks polos untuk salin/unduh. `t(key, vars)` = ctx.t atau stub. Tanpa harga. */
export function toPlainText(list, t) {
  const L = [];
  L.push(T(t, 'shopping.print_title', FALLBACK.title));
  if (list.meta.persons != null && list.meta.days != null) {
    L.push(T(t, 'shopping.print_for', FALLBACK.for, { n: list.meta.persons, days: list.meta.days }));
  }
  L.push('');
  for (const g of list.groups) {
    L.push('== ' + T(t, g.key, g.label) + ' ==');
    for (const e of g.items) {
      const qty = e.needsInput ? T(t, 'shopping.needs_input', FALLBACK.needs_input) : `${fmt(e.qty)}${e.unit ? ' ' + e.unit : ''}`;
      let line = `[${e.checked ? 'x' : ' '}] ${e.label} - ${qty}`;
      if (g.kind === 'free' || g.kind === 'home') {
        if (e.free) line += ` (${e.free.text}${e.free.source ? ', ' + e.free.source : ''})`;
      }
      L.push(line);
      if (e.tip) L.push('    ' + e.tip);
    }
    L.push('');
  }
  if (list.diy.length) {
    L.push('== ' + T(t, 'result.diy_alt', FALLBACK.diy) + ' ==');
    for (const d of list.diy) L.push(`- ${d.label}: ${d.text}`);
    L.push('');
  }
  if (list.notes.label) L.push(T(t, 'shopping.check_label_note', FALLBACK.label));
  if (list.notes.rx) L.push(T(t, 'shopping.rx_note', FALLBACK.rx));
  L.push(T(t, 'result.no_price_note', FALLBACK.noPrice));
  L.push(T(t, 'warnings.not_substitute', 'Bukan pengganti instruksi otoritas setempat.'));
  return L.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

// ---------- UI ----------
async function copyText(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return true; }
  } catch (e) { /* fallback */ }
  try {
    const ta = h('textarea', { 'aria-hidden': 'true', tabindex: '-1', style: 'position:fixed;left:-9999px;top:0' });
    ta.value = text;
    document.body.append(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return !!ok;
  } catch (e) { return false; }
}

function downloadTxt(text, name) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = h('a', { href: url, download: name, style: 'display:none' });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

let token = 0;
export function render(root, ctx) {
  const my = ++token;
  root.textContent = '';
  const title = h('h1', { tabindex: '-1', text: tr(ctx, 'shopping.title', 'Daftar belanja') });
  const page = h('div', { class: 'sc-page sc-shopping' },
    title,
    h('p', { class: 'sc-muted', role: 'status', text: tr(ctx, 'common.loading', 'Memuat...') }));
  root.append(page);

  loadResult(ctx).then(({ result }) => {
    if (my !== token) return;
    const saved = (ctx.state && ctx.state.shopping) || {};
    const checked = Object.assign({}, saved.checked);
    let hide = !!saved.hide_bought;
    const t = (k, v) => tr(ctx, k, k, v);
    const persist = () => { try { ctx.save({ shopping: { checked, hide_bought: hide } }); } catch (e) { /* abaikan */ } };
    const build = () => buildShoppingList(result, ctx.data, ctx.lang, checked);
    let list = build();

    page.textContent = '';
    page.append(title);
    const status = h('p', { class: 'sc-sr', role: 'status', 'aria-live': 'polite' });
    const progress = h('p', { class: 'sc-muted' });
    const body = h('div', { class: 'sc-shop-body' });

    const updateProgress = () => {
      const all = list.groups.flatMap((g) => g.items);
      progress.textContent = tr(ctx, 'shopping.progress', '{done} dari {total} dibeli',
        { done: all.filter((e) => checked[e.id]).length, total: all.length });
    };

    const draw = () => {
      body.textContent = '';
      for (const g of list.groups) {
        const hid = 'sc-g-' + g.id;
        const ul = h('ul', { class: 'sc-checklist' });
        for (const e of g.items) {
          const cid = 'sc-c-' + e.id;
          const input = h('input', { type: 'checkbox', id: cid, class: 'sc-check' });
          input.checked = !!checked[e.id];
          const qty = e.needsInput ? tr(ctx, 'shopping.needs_input', FALLBACK.needs_input) : `${fmt(e.qty, ctx.lang)}${e.unit ? ' ' + e.unit : ''}`;
          const li = h('li', { class: 'sc-checkitem' + (input.checked ? ' done' : '') });
          if (hide && input.checked) li.hidden = true;
          li.append(...[
            h('label', { for: cid, class: 'sc-checklabel' },
              input, h('span', { class: 'sc-box', 'aria-hidden': 'true' }),
              h('span', { class: 'sc-itemname', text: e.label }),
              h('span', { class: 'sc-itemqty', text: qty })),
            e.free ? h('p', { class: 'sc-small sc-muted sc-indent', text: e.free.text + (e.free.source ? ` (${e.free.source})` : '') }) : null,
            e.tip ? h('p', { class: 'sc-small sc-muted sc-indent', text: e.tip }) : null].filter(Boolean));
          input.addEventListener('change', () => {
            if (input.checked) checked[e.id] = true; else delete checked[e.id];
            li.classList.toggle('done', input.checked);
            persist();
            updateProgress();
          });
          ul.append(li);
        }
        body.append(h('section', { class: 'sc-card sc-group', 'aria-labelledby': hid },
          h('h2', { id: hid, text: tr(ctx, g.key, g.label) }), ul));
      }
      if (list.diy.length) {
        body.append(h('section', { class: 'sc-card sc-group', 'aria-labelledby': 'sc-g-diy' },
          h('h2', { id: 'sc-g-diy', text: tr(ctx, 'result.diy_alt', FALLBACK.diy) }),
          h('ul', { class: 'sc-list' }, list.diy.map((d) => h('li', null, h('strong', { text: d.label + ': ' }), d.text)))));
      }
    };

    if (!list.groups.length) {
      page.append(h('section', { class: 'sc-card sc-empty' },
        h('h2', { text: tr(ctx, 'shopping.empty_title', 'Daftar belanja kosong') }),
        h('p', { text: tr(ctx, 'shopping.empty_body', 'Tidak ada kekurangan untuk target ini, atau datamu belum diisi.') }),
        h('a', { class: 'sc-btn sc-btn-secondary', href: '#/hasil', text: tr(ctx, 'result.title', 'Hasil kesiapan') })));
      return;
    }

    const hideBtn = h('button', { type: 'button', class: 'sc-btn sc-btn-secondary sc-noprint', 'aria-pressed': String(hide),
      text: tr(ctx, 'shopping.hide_bought', 'Sembunyikan yang sudah dibeli') });
    hideBtn.addEventListener('click', () => { hide = !hide; hideBtn.setAttribute('aria-pressed', String(hide)); persist(); draw(); });

    const plain = () => toPlainText(build(), t);
    const flash = (msg) => { status.textContent = ''; setTimeout(() => { status.textContent = msg; }, 30); };
    const btnPrint = h('button', { type: 'button', class: 'sc-btn sc-btn-primary', text: tr(ctx, 'shopping.print', 'Cetak atau simpan PDF') });
    btnPrint.addEventListener('click', () => window.print());
    const btnCopy = h('button', { type: 'button', class: 'sc-btn sc-btn-secondary', text: tr(ctx, 'shopping.copy', 'Salin teks') });
    btnCopy.addEventListener('click', async () => {
      const ok = await copyText(plain());
      flash(ok ? tr(ctx, 'shopping.copied', 'Teks disalin') : tr(ctx, 'shopping.copy_failed', 'Tidak bisa menyalin otomatis. Pakai tombol cetak atau unduh.'));
    });
    const btnTxt = h('button', { type: 'button', class: 'sc-btn sc-btn-secondary', text: tr(ctx, 'shopping.download_txt', 'Unduh .txt') });
    btnTxt.addEventListener('click', () => { try { downloadTxt(plain(), 'daftar-belanja.txt'); } catch (e) { flash(tr(ctx, 'shopping.copy_failed', 'Tidak bisa mengunduh otomatis. Pakai tombol cetak.')); } });

    const m = list.meta;
    page.append(...[
      h('p', { class: 'sc-print-only sc-printhead', text: tr(ctx, 'shopping.print_title', FALLBACK.title) }),
      m.persons != null ? h('p', { class: 'sc-muted' }, tr(ctx, 'shopping.print_for', FALLBACK.for, { n: m.persons, days: m.days })) : null,
      h('p', { class: 'sc-muted sc-noprint', text: tr(ctx, 'shopping.intro', '') }),
      progress, hideBtn, status, body,
      list.notes.label ? h('p', { class: 'sc-card sc-info', text: tr(ctx, 'shopping.check_label_note', FALLBACK.label) }) : null,
      list.notes.rx ? h('p', { class: 'sc-card sc-info', text: tr(ctx, 'shopping.rx_note', FALLBACK.rx) }) : null,
      h('p', { class: 'sc-small sc-muted', text: tr(ctx, 'result.no_price_note', FALLBACK.noPrice) }),
      h('div', { class: 'sc-actions sc-noprint sc-sticky' }, btnPrint, btnCopy, btnTxt),
      h('p', { class: 'sc-small sc-muted sc-noprint', text: tr(ctx, 'shopping.print_tip', '') }),
      h('p', { class: 'sc-print-only sc-printfoot', text: `${new Date().toLocaleDateString(ctx.lang === 'en' ? 'en-GB' : 'id-ID')} · ${tr(ctx, 'warnings.not_substitute', 'Bukan pengganti instruksi otoritas setempat.')}` }),
      h('p', { class: 'sc-noprint' }, h('a', { href: '#/hasil', class: 'sc-btn sc-btn-secondary', text: tr(ctx, 'common.back', 'Kembali') }))].filter(Boolean));
    draw();
    updateProgress();
  }).catch(() => {
    if (my !== token) return;
    page.textContent = '';
    page.append(title, h('p', { role: 'alert', text: tr(ctx, 'errors.data_load', 'Data gagal dimuat.') }));
  });
}

export function destroy() { token++; }
