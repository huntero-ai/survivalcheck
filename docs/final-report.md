# Laporan Akhir — SurvivalCheck v1

Tanggal: 2026-11-04 · Branch: `claude/eloquent-maxwell-dzgg24`

## Status
Aplikasi PWA offline selesai dibangun dan lolos QA (0 bug P0; semua bug P1/P2 dari QA sudah diperbaiki, lihat `docs/qa-report.md` §7). **Belum di-deploy**: GitHub Pages butuh kode ada di branch `main`.

## Yang dibuat
- **Riset (Fase 1)**: panduan resmi Indonesia (BNPB, BMKG, PVMBG, Kemenkes) + 25 negara dan UE + standar internasional → `research/`, ringkasan di `research/SUMMARY.md`. Klaim "53 negara" tidak terverifikasi dan tidak dipakai.
- **Data**: 149 barang, 13 kategori, 11 skenario (`data/items.json`); aturan tier dan skor (`data/rules.json`); modul listrik/power station (`data/power.json`); tempat beli Indonesia tanpa harga (`data/sources-to-buy.json`); risiko 38 provinsi; 18 indikator keluarga BNPB.
- **App**: profil rumah tangga, target dan skenario, inventaris + tas siaga BNPB, modul daya listrik, evaluasi keluarga, hasil (tier 0–5, skor, hari bertahan + bottleneck, kekurangan, tempat beli), daftar belanja (cetak/salin/unduh), info offline, ID + EN, mode gelap.
- **Pengujian**: 57 tes unit, uji e2e (shell, alur lengkap, perbaikan) di Playwright, QA independen 85 cek hitung manual.

## Keputusan penting
Lihat `docs/decisions.md` (D-001…D-047). Yang menonjol: air 3 L/orang/hari (BNPB 2 L ditampilkan sebagai minimum), kalori per kelompok usia, toilet 5/orang/hari, tier 2 = standar BNPB 72 jam, bahan bakar masak boleh gas kaleng/LPG/kompor alternatif (D-047).

## Keterbatasan yang perlu diketahui
- Beberapa angka hanya dari cuplikan pencarian (air hewan, sabun, dll.) dan ditandai di app "dari kutipan sumber, perlu dicek ulang".
- Tidak ada panduan resmi Indonesia untuk skenario konflik/perang dan nuklir (BAPETEN menolak akses); app memakai rujukan internasional dan melabelinya.
- Watt kipas, CPAP, konsentrator oksigen dll. adalah asumsi — user diminta mengecek label perangkat.
- Berat kemasan pangan dan kalori makanan siap saji/kurma tidak ada sumber resmi; user mengisi dari label.
- Kontak BPBD per provinsi belum terverifikasi.
- Bukan pengganti instruksi otoritas setempat; dosis obat/kimia ikuti label dan tenaga kesehatan.

## Deploy
1. Merge branch ini ke `main`.
2. Di GitHub: Settings → Pages → Source: **GitHub Actions** (repo private butuh paket yang mendukung Pages).
3. Workflow `.github/workflows/pages.yml` men-deploy otomatis; alamat: `https://<owner>.github.io/survivalcheck/`.

## Saran lanjutan
Tanggal kedaluwarsa per barang, pengingat isi ulang, tinjau berkala sumber yang berubah cepat (防災庁, UK Be Ready, UE 72 jam), verifikasi manual sumber yang memblokir akses.
