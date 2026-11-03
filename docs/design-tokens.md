# SurvivalCheck — Design Tokens (v1)

> Disusun D1, 2026-11-03. Pasangan dengan `docs/ux-flow.md`. Dipakai E1–E3 sebagai CSS custom properties di `:root`.
> `designreference` di root repo kosong saat disusun, jadi tidak ada acuan visual eksternal.
> Prinsip: tenang, hangat, tidak menakut-nakuti (I4). Merah hanya untuk peringatan keselamatan (CO, listrik), **tidak pernah** untuk tier atau skor.
> Semua rasio kontras di bawah dihitung dengan rumus WCAG 2.1 (skrip dicek D1). AA: teks normal ≥4,5:1, teks besar & elemen non-teks ≥3:1.

## 1. Warna dasar

| Token | Terang | Gelap | Pemakaian | Kontras (terang / gelap) |
|---|---|---|---|---|
| `--c-bg` | `#FAFAF7` | `#121614` | latar halaman | — |
| `--c-surface` | `#FFFFFF` | `#1B201E` | kartu, sheet, input | — |
| `--c-surface-2` | `#F1F3EF` | `#232927` | baris belang, chip non-aktif | — |
| `--c-text` | `#1B1F1D` | `#E8ECEA` | teks utama | 16,7 / 13,9 pada surface |
| `--c-text-muted` | `#4A524E` | `#AEB7B2` | teks bantu, hint | 8,0 / 8,0 pada surface |
| `--c-border` | `#7C8580` | `#7F8984` | garis input, checkbox (non-teks) | 3,8 / 4,6 |
| `--c-divider` | `#E1E5E2` | `#2C3330` | pemisah dekoratif (bukan batas kontrol) | dekoratif |
| `--c-primary` | `#0F6B5A` | `#5CC9B0` | tombol utama, tautan, tab aktif | 6,4 / 8,2 |
| `--c-on-primary` | `#FFFFFF` | `#0B1F1A` | teks di atas primary | 6,4 / 8,5 |
| `--c-focus` | `#1A5FB4` | `#8AB8FF` | cincin fokus 3 px + offset 2 px | 6,3 / 8,2 |
| `--c-info-fg` / `--c-info-bg` | `#1D4F91` / `#E3EDFA` | `#9CC2F5` / `#16263D` | catatan sumber, tips | 6,9 / 8,3 |
| `--c-ok-fg` / `--c-ok-bg` | `#245C2A` / `#E2F1DE` | `#9AD69F` / `#173019` | "Sudah cukup", tersimpan | 6,8 / 8,5 |
| `--c-warn-fg` / `--c-warn-bg` | `#7A4300` / `#FDF0D8` | `#F5C77A` / `#3A2A10` | "Perlu dilengkapi", validasi lunak | 7,1 / 8,8 |
| `--c-danger-fg` / `--c-danger-bg` | `#9B2C1C` / `#FBE7E3` | `#F4A898` / `#3D1C16` | **hanya** peringatan keselamatan (CO genset, listrik) & error input | 6,4 / 7,9 |

Mode gelap mengikuti `prefers-color-scheme` (I3, P1). Pengaturan boleh menimpa dengan `data-theme="light|dark"` di `<html>`.

## 2. Warna tier 0–5 (tidak menakutkan, tidak bergantung warna)

Urutan tier memakai spektrum **tenang** (abu → pasir → teal → biru → nila → hijau hutan), bukan merah→hijau. Tier 0 berwarna abu netral, bukan merah: pesan "belum mulai", bukan "bahaya".

| Tier | Nama (id) | Ikon / penanda | `fg` terang | `bg` terang | `accent` terang | `fg` gelap | `bg` gelap | `accent` gelap |
|---|---|---|---|---|---|---|---|---|
| 0 | Belum Siap | ○ lingkaran kosong · 0/5 segmen | `#4A5361` | `#ECEEF1` | `#6B7585` | `#C9CFD8` | `#252A31` | `#8E97A5` |
| 1 | Rentan | ◔ seperempat · 1/5 | `#7A4300` | `#FCEFD6` | `#B0721A` | `#F2C27A` | `#33260F` | `#D99A3D` |
| 2 | Siap Dasar 72 jam (standar BNPB) | ◑ setengah · 2/5 + lencana "BNPB" | `#0B5F56` | `#DCF2EE` | `#178F80` | `#7FD9CB` | `#11302C` | `#3FB5A4` |
| 3 | Siap 1 Minggu | ◕ tiga perempat · 3/5 | `#1D4F91` | `#E1ECFA` | `#3B78C4` | `#A2C4F2` | `#152740` | `#6A9FE0` |
| 4 | Tangguh 2 Minggu | ● penuh · 4/5 | `#4A3A8C` | `#ECE8F8` | `#7462C2` | `#C3B8F2` | `#262140` | `#9C8CE6` |
| 5 | Mandiri ≥30 Hari | ● + bintang · 5/5 | `#2E5B1D` | `#E3F0DA` | `#4F8A35` | `#AEDB98` | `#1A2E14` | `#7DBA60` |

Kontras terukur: `fg` pada `bg` 6,5–7,7 (terang) dan 8,3–9,3 (gelap) → AA teks normal. `accent` (bar/segmen, non-teks) pada surface 4,0–4,9 (terang) dan 5,6–7,1 (gelap) → ≥3:1.

Aturan "jangan hanya warna" (WCAG 1.4.1):
- Lencana tier selalu memuat **angka tier + nama tier + ikon** (mis. `◑ Tier 2 · Siap Dasar 72 jam (standar BNPB)`).
- Tangga tier = 5 segmen; jumlah segmen terisi = nomor tier; label teks "2 dari 5".
- Bar progress kategori selalu disertai persen dan teks status (`✓ Cukup`, `△ Kurang`, `— Belum diisi`).
- Sub-skor BNPB: ikon + teks (`✓ SIAP`, `△ PERLU DILENGKAPI`, `○ BELUM SIAP`; `○ Rawan`, `◑ Cukup Siaga`, `✓ Siap`).
- Peringatan keselamatan: ikon `⚠` + judul tebal + warna danger.

Token CSS: `--tier-0-fg`, `--tier-0-bg`, `--tier-0-accent`, … `--tier-5-accent`.

## 3. Tipografi (system font, tanpa unduhan)

```
--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Helvetica Neue", Arial, sans-serif;
--font-mono: ui-monospace, "SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace;  /* nomor darurat, angka tabel */
```

| Token | Ukuran / line-height | Berat | Pemakaian |
|---|---|---|---|
| `--fs-display` | 2rem (32 px) / 1.2 | 700 | angka "± X hari" di Hasil |
| `--fs-h1` | 1.5rem (24 px) / 1.25 | 700 | judul layar |
| `--fs-h2` | 1.25rem (20 px) / 1.3 | 600 | judul seksi/kartu |
| `--fs-h3` | 1.0625rem (17 px) / 1.35 | 600 | judul item |
| `--fs-body` | 1rem (16 px) / 1.5 | 400 | teks utama; **input minimal 16 px** (mencegah zoom otomatis iOS) |
| `--fs-small` | 0.875rem (14 px) / 1.45 | 400 | hint, sumber, caption |
| `--fs-tiny` | 0.8125rem (13 px) / 1.4 | 500 | label bottom nav (minimum; jangan lebih kecil) |

- Satuan `rem` agar ikut ukuran huruf sistem; layout harus tetap utuh pada zoom 200%.
- `font-variant-numeric: tabular-nums` untuk angka jumlah, Wh, liter, hari.
- Panjang baris teks panduan ≤ 70 karakter (`max-width: 38rem`).

## 4. Spacing (kelipatan 4 px)

| Token | Nilai | Pemakaian |
|---|---|---|
| `--sp-1` | 4 px | jarak ikon–teks |
| `--sp-2` | 8 px | antar elemen dalam baris |
| `--sp-3` | 12 px | padding chip, jarak label–input |
| `--sp-4` | 16 px | **gutter halaman 360 px**, padding kartu |
| `--sp-5` | 20 px | antar field form |
| `--sp-6` | 24 px | antar kartu/seksi |
| `--sp-8` | 32 px | antar blok besar |
| `--sp-12` | 48 px | ruang bawah di atas bottom nav/sticky bar |

Ukuran sentuh:
- `--touch-min: 44px` (tinggi/lebar minimum semua kontrol; I2). Tombol utama 48 px.
- Jarak antar target sentuh ≥ 8 px.
- Stepper angka (− / +) masing-masing 44×44 px.
- Bottom nav: tinggi 64 px + `env(safe-area-inset-bottom)`.

## 5. Radius, bayangan, garis

| Token | Nilai | Pemakaian |
|---|---|---|
| `--r-sm` | 6 px | chip, lencana |
| `--r-md` | 10 px | input, tombol |
| `--r-lg` | 16 px | kartu, bottom sheet (sudut atas) |
| `--r-pill` | 999 px | toggle, bar progress |
| `--shadow-1` | `0 1px 2px rgb(0 0 0 / .08)` | kartu (terang); gelap: tanpa bayangan, pakai `--c-divider` |
| `--shadow-2` | `0 4px 16px rgb(0 0 0 / .12)` | bottom sheet, dialog |
| `--bw` | 1 px; input 1.5 px; fokus 3 px | — |

## 6. Gerak

- `--dur-fast: 120ms`, `--dur-base: 200ms`, easing `cubic-bezier(.2,.0,.0,1)`.
- `@media (prefers-reduced-motion: reduce)`: semua transisi 0 ms, tanpa animasi angka berjalan.
- Tidak ada animasi berkedip / getar untuk tier rendah.

## 7. Cetak (F9, G4)

- `@media print`: latar putih, teks `#000`, sembunyikan nav/tombol; checkbox dicetak sebagai `☐`; ukuran 11 pt; tautan sumber dicetak sebagai teks URL; footer: tanggal cetak + disclaimer singkat.
- Warna tier tidak diandalkan saat cetak hitam-putih: nama tier & ikon tetap tercetak.

## 8. Ikon

SVG inline (tanpa font ikon/CDN), stroke 2 px, 24 px dalam target 44 px. Ikon dekoratif `aria-hidden="true"`; ikon tanpa teks wajib `aria-label` dari i18n (`a11y.*`).
