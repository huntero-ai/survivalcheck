# SurvivalCheck — Daftar Fitur (v1)

> Disusun 2026-11-03 setelah gate Fase 1. Semua usulan PM (Q1–Q7) disetujui user, ditambah modul **Daya Listrik / Power Station** (D-045).
> Rujukan angka: `docs/decisions.md`. Rujukan riset: `research/SUMMARY.md`.
> Prioritas: **P0** = wajib ada di rilis pertama · **P1** = sebaiknya ada · **P2** = nanti.

## A. Platform & offline
| ID | Fitur | Prioritas |
|---|---|---|
| A1 | PWA statis di GitHub Pages (sub-path `/survivalcheck/`, semua path relatif) | P0 |
| A2 | Jalan 100% offline setelah kunjungan pertama (service worker precache semua aset + data + i18n) | P0 |
| A3 | Bisa di-install ke layar utama HP (manifest, ikon) | P0 |
| A4 | Data hanya di perangkat (localStorage, dibungkus try/catch); tanpa server, tanpa pelacakan | P0 |
| A5 | Notifikasi "versi data baru tersedia" saat online (update cache) | P1 |
| A6 | Ekspor/impor profil sebagai file JSON (pindah HP / cadangan) | P1 |
| A7 | Tombol "Hapus semua data saya" | P0 |
| A8 | Deploy otomatis via GitHub Actions | P0 |

## B. Profil rumah tangga
| ID | Fitur | Prioritas |
|---|---|---|
| B1 | Jumlah orang per kelompok usia: bayi <1, balita 1–4, anak 5–12, dewasa 13–59, lansia ≥60 (D-030) | P0 |
| B2 | Tandai hamil / menyusui (+285 / +500 kkal, D-009) | P0 |
| B3 | Obat rutin per orang (jumlah dosis/hari, stok saat ini dalam hari) | P0 |
| B4 | Hewan peliharaan (anjing, kucing, lainnya) + pakan dari pemakaian harian user (D-016) | P0 |
| B5 | Kebutuhan bayi dari pemakaian harian user: popok, formula, MPASI (D-010) | P0 |
| B6 | Kebutuhan khusus: disabilitas, alat bantu, **alat medis yang butuh listrik** (masuk modul E) | P0 |
| B7 | Jenis hunian (rumah tapak / apartemen / kos) & ketinggian (>1.000 m dpl → aturan rebus 3 menit) | P1 |
| B8 | Pilih provinsi → saran skenario dari IRBI 2024 (bisa diubah) (D-038) | P0 |

## C. Target & skenario
| ID | Fitur | Prioritas |
|---|---|---|
| C1 | Target durasi: 3 / 7 / 14 / 30 hari / custom; default 7 hari, minimum BNPB 3 hari ditampilkan (D-003) | P0 |
| C2 | Multi-pilih 11 skenario: gempa, tsunami, banjir & longsor, erupsi, kabut asap, kekeringan, cuaca ekstrem, listrik padam panjang, pandemi, konflik, nuklir/radiologi | P0 |
| C3 | Aturan skenario: item digabung tanpa dobel, pengali tertinggi, durasi minimum efektif (konflik 7 hari, pandemi 14 hari + obat 30 hari, kekeringan air 4 L) | P0 |

## D. Inventaris & checklist
| ID | Fitur | Prioritas |
|---|---|---|
| D1 | Form inventaris per kategori, otomatis dari `data/items.json` (kuantitas atau ya/tidak) | P0 |
| D2 | Kategori: air, pangan, obat & P3K, sanitasi, penerangan, **daya listrik**, komunikasi, dokumen & tunai, pakaian & kehangatan, alat, tas siaga, kebutuhan khusus, rencana & pengetahuan | P0 |
| D3 | Pangan: input per jenis pangan lokal (beras, mi instan, biskuit, kaleng, siap saji, susu UHT) → total kkal (nilai kkal dari R5b/TKPI; fallback input kkal dari label) | P0 |
| D4 | Pemisahan "di tas siaga" vs "stok rumah" (field `location`) | P0 |
| D5 | Checklist Tas Siaga 72 jam BNPB (28 item) → sub-skor SIAP / PERLU DILENGKAPI / BELUM SIAP (D-026) | P0 |
| D6 | Evaluasi Keluarga BNPB 18 indikator (0/1/2) → Rawan / Cukup Siaga / Siap (D-027) | P0 |
| D7 | Simpan otomatis progres; bisa dilanjutkan kapan saja | P0 |
| D8 | Mode cepat ("isi 10 pertanyaan inti") vs mode lengkap | P1 |

## E. Modul Daya Listrik / Power Station (baru, D-045)
| ID | Fitur | Prioritas |
|---|---|---|
| E1 | Pilih perangkat penting dari daftar (HP, lampu LED, router/modem, radio, kipas angin, laptop, pompa air, kulkas/kulkas ASI-obat, CPAP, konsentrator oksigen, nebulizer, dll.) dengan watt tipikal + jam pakai/hari; watt bisa diubah sesuai label perangkat | P0 |
| E2 | Hitung kebutuhan energi: Wh/hari = Σ(watt × jam) dan Wh total = Wh/hari × hari target (atau hari "tanpa listrik" yang dipilih user) | P0 |
| E3 | Rekomendasi kapasitas power station (Wh) dengan faktor efisiensi inverter & cadangan kapasitas, plus daya keluaran minimum (W) dari perangkat terbesar / lonjakan | P0 |
| E4 | Inventaris daya yang dimiliki: power bank (mAh → Wh), power station (Wh), baterai cadangan, genset, panel surya (Wp) | P0 |
| E5 | "Listrik cukup untuk ± X hari" — ikut dihitung di hari bertahan bila ada alat medis listrik (gating khusus) | P0 |
| E6 | Opsi isi ulang: estimasi Wh/hari dari panel surya (Wp × jam matahari efektif) → apakah bisa mandiri | P1 |
| E7 | Peringatan keselamatan: genset/kompor/grill **tidak boleh di dalam ruangan** (CO), jangan sambung genset ke instalasi rumah tanpa teknisi, simpan power station di tempat kering; info daftar pasien alat medis ke PLN/faskes bila ada | P0 |

## F. Mesin hitung & hasil
| ID | Fitur | Prioritas |
|---|---|---|
| F1 | Kebutuhan otomatis: air 3 L/orang/hari wajib + 2 L kebersihan saran; kkal per kelompok usia; toilet 5 kantong/orang/hari; obat ≥ max(target, 7) hari; tunai dalam "hari belanja" | P0 |
| F2 | **Tier 0–5** dengan gating (tier 2 = Siap Dasar 72 jam standar BNPB: tas >80% + 18 indikator ≥13; tier 4: indikator ≥25) | P0 |
| F3 | Skor 0–100 (stok kritis 55%, tas BNPB 20%, 18 indikator 15%, skenario 10%) — tidak bisa menaikkan tier | P0 |
| F4 | **"Saat ini bisa bertahan ± X hari"** + sumber daya yang paling cepat habis (bottleneck) | P0 |
| F5 | Progress per kategori (bar) + apa yang menahan naik tier ("untuk naik ke tier 3 kamu butuh …") | P0 |
| F6 | Daftar kekurangan berurut prioritas: item, jumlah kurang, alasan + sumber resmi | P0 |
| F7 | **Tempat beli di Indonesia** per item (jenis toko + contoh jaringan umum), alternatif DIY/murah, yang gratis/resmi, tanda "biasanya sudah ada di rumah" — **tanpa harga** | P0 |
| F8 | Daftar belanja dikelompokkan per jenis toko, bisa dicentang | P0 |
| F9 | Cetak / simpan PDF via print, salin teks, unduh .txt | P0 |
| F10 | Rencana bertahap: "minggu ini beli A, bulan depan B" untuk naik tier | P1 |

## G. Info & panduan offline
| ID | Fitur | Prioritas |
|---|---|---|
| G1 | Nomor darurat (112 tergantung daerah, 110, 113, 115, 117, 118/119, 123, 196) — bisa ditekan langsung | P0 |
| G2 | Panduan singkat per skenario (sebelum/saat/sesudah) dari BNPB/BMKG/PVMBG/Kemenkes; konflik & nuklir dari rujukan internasional dengan label jelas | P0 |
| G3 | Penjernihan air: rebus, pemutih (ikuti kadar di label), tawas/PAC, yodium — dengan peringatan | P0 |
| G4 | Kartu kontak & rencana keluarga (titik kumpul, siapa membawa tas, siapa membantu lansia/anak) — bisa dicetak | P1 |
| G5 | Halaman sumber: semua rujukan dengan tanggal akses & penanda bukti | P0 |
| G6 | Disclaimer: bukan pengganti instruksi otoritas setempat; dosis obat/kimia ikuti label & tenaga kesehatan | P0 |

## H. Pengingat & perawatan stok
| ID | Fitur | Prioritas |
|---|---|---|
| H1 | Tanggal kedaluwarsa per item + daftar "segera kedaluwarsa" (rolling stock) | P1 |
| H2 | Pengingat cek tas tiap 6 bulan, ganti air isi sendiri tiap 6 bulan, simulasi 2× setahun (tampil di app saat dibuka) | P1 |
| H3 | Pengingat isi ulang power bank / power station tiap 3 bulan | P1 |

## I. Bahasa, aksesibilitas, desain
| ID | Fitur | Prioritas |
|---|---|---|
| I1 | Bahasa Indonesia (utama) + English, bisa diganti kapan saja | P0 |
| I2 | Mobile-first (360 px), target sentuh ≥44 px, kontras AA, bisa dipakai satu tangan | P0 |
| I3 | Mode gelap / terang mengikuti sistem | P1 |
| I4 | Nada tenang, tidak menakut-nakuti ("Panduan Anti Panik", "Keluarga Siaga") | P0 |
| I5 | Ringan: tanpa framework berat, tanpa CDN saat runtime | P0 |

## Di luar cakupan v1
Akun/login, sinkronisasi cloud, harga, peta online, notifikasi push dari server, rekomendasi merek.

---

## Rencana eksekusi setelah daftar ini

| Fase | Agent | Output |
|---|---|---|
| 2 · Riset tambahan (paralel) | **R5b** AKG 2019, TKPI kkal per satuan pangan lokal, P3K Kemenkes/PMI · **R6** kebutuhan listrik: panduan resmi listrik padam & alat medis (BBK, FEMA/Ready.gov, MSB, PLN, Kemenkes) + watt tipikal perangkat | `research/r5b-*.md/json`, `research/r6-power.md/json` |
| 2 · Desain data & UX (paralel) | **S1** items.json · **S2** rules.json + 10 kasus uji · **S3** tempat beli · **S4** modul daya listrik (`data/power.json`, rumus E2–E6, kasus uji) · **D1** UX flow + i18n | `data/`, `docs/`, `i18n/` |
| 2 · Gate | **PM** kunci kontrak data | `docs/decisions.md` diperbarui |
| 3 · Build (paralel) | **E1** kerangka PWA + deploy · **E2** mesin hitung + form · **E3** hasil + daftar belanja + cetak | app |
| 4 · QA | **Q1** offline, HP 360 px, aksesibilitas, cek angka vs sumber, kasus ekstrem | `docs/qa-report.md` |
| 5 · Integrasi | **PM** merge, laporan akhir | `docs/final-report.md` |
