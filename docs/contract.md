# Kontrak Build (dikunci PM, 2026-11-04)

Bahan: `data/items.json`, `data/rules.json`, `data/power.json`, `data/bnpb_family_indicators.json`, `data/sources-to-buy.json`, `i18n/id.json|en.json`, `docs/scoring.md`, `docs/ux-flow.md`, `docs/design-tokens.md`, `tests/cases.json`. **Jangan ubah file data**; bila ada bug data, catat di `docs/build-notes.md`.

## Keputusan PM atas pertanyaan S2
- (a) D-032: konflik = target minimum 7 hari + `target_tier`, bukan batas tier. Disetujui.
- (b) Berat kemasan pangan tak bersumber: konversi otomatis hanya kg; selain itu user isi `grams_per_unit` atau kkal dari label. Disetujui.
- (c) Item per-orang (masker, peluit) menghitung semua usia. Disetujui.

## Stack
Vanilla JS ES modules, tanpa bundler, tanpa dependensi runtime, tanpa CDN. Semua path RELATIF (jalan di `/survivalcheck/`). Uji dengan Node (`node --test`), tanpa npm install.

## Kepemilikan file (JANGAN sentuh file agent lain)
| Agent | File |
|---|---|
| **E1** | `index.html`, `manifest.webmanifest`, `sw.js`, `icons/*`, `src/app.js` (shell, router hash, bottom nav, stepper, halaman statis G/Pengaturan), `src/storage.js`, `src/i18n.js`, `styles/main.css`, `.github/workflows/pages.yml`, `README.md`, `.nojekyll` |
| **E2** | `src/engine.js` (murni, tanpa DOM), `src/power.js` (rumus listrik, murni), `src/forms.js` (layar Profil, Target/Skenario, Inventaris, Daya, Indikator), `styles/forms.css`, `tests/engine.test.mjs`, `tests/power.test.mjs` |
| **E3** | `src/results.js` (layar Hasil), `src/shopping.js` (Daftar belanja + cetak/salin/unduh), `styles/results.css`, `styles/print.css` |

## Antarmuka
- Setiap modul layar mengekspor `export function render(root, ctx)` dan opsional `export function destroy()`.
- `ctx` (dibuat E1): `{ t(key, vars), lang, setLang(l), state, save(patch), navigate(route), data: {items, rules, power, indicators, buy, ...} }`.
- `state` (disimpan E1 di localStorage key `survivalcheck.v1`, try/catch, aman bila storage gagal): `{ profile, target, scenarios, inventory, bag_checklist, indicators, power_inventory, power_devices, settings:{lang}, updatedAt }` — skema persis di `docs/scoring.md` (profile/inventory/indicators/bag_checklist) dan `docs/power.md` (power).
- `engine.js` mengekspor: `evaluate(state, data) -> result` (skema `result` di scoring.md). E3 hanya MEMBACA `result`; E2 tidak boleh membuat UI hasil.
- `power.js` mengekspor fungsi di `docs/power.md`; `evaluate` memanggilnya.
- Route hash: `#/` beranda, `#/profil`, `#/target`, `#/inventaris/<kategori>`, `#/daya`, `#/keluarga`, `#/hasil`, `#/belanja`, `#/info`, `#/pengaturan`. E1 memetakan route → modul: forms.js (`renderProfile`, `renderTarget`, `renderInventory`, `renderPower`, `renderIndicators` — E2 mengekspor kelimanya dengan signature `(root, ctx, params)`), results.js `render`, shopping.js `render`.
- Semua teks lewat `ctx.t()`; kunci i18n ada di `i18n/*.json`. Kunci yang kurang: tambahkan ke file i18n HANYA oleh E1 lewat `docs/build-notes.md` request → PM yang menambahkan; sementara pakai fallback teks kunci.
- Label item: `item.label[lang]`; jenis toko: `i18n store.<id>`.

## Aturan keras
- Tanpa harga; tanpa "53 negara"; aksesibilitas (≥44 px, kontras AA, label form); layar 360 px; dark mode; print CSS rapi.
- Service worker: precache SEMUA aset + data + i18n, cache-first, versi cache `survivalcheck-v1`; `start_url` & `scope` = `./`.
- Jangan git commit/push — PM yang melakukan.
