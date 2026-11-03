# Brief Fase 2: S1, S2, S3, D1

Tanggal: 2026-11-03 · Dari: PM · Mulai setelah user menjawab pertanyaan di `research/SUMMARY.md` §6. Bila belum dijawab, kerjakan dengan nilai "usulan" di `docs/decisions.md` dan buat nilainya mudah diganti di data.

## 0. Wajib dibaca semua agent
1. `PLAN.md`: keputusan terkunci, §2, §2.1, §4.
2. `research/SUMMARY.md`: tabel konsolidasi (§2), konflik (§3), desain (§4), celah (§5).
3. `docs/decisions.md`: nilai default D-001…D-044.
4. Data mentah: `research/r1`–`r5` *.json; `r4-americas-intl.json` (record `technical_constants`, 54 konstanta); `r5-indonesia.json` (record `province_risks`, `emergency_numbers`).

## 1. Keputusan terkunci (jangan diubah)
- Fokus **Indonesia**: BNPB/BMKG/PVMBG/Kemenkes jadi rujukan utama; luar negeri sebagai pelengkap.
- **Semua 11 skenario** di §2.1. Item digabung tanpa dobel; pengali diambil yang tertinggi.
- **Tanpa harga** di mana pun, termasuk uang tunai, yang dinyatakan dalam "hari belanja".
- **GitHub Pages**, PWA offline, data di `data/*.json`.
- Bahasa: **Indonesia (utama) + English**.
- Aturan data: setiap item punya ≥1 sumber; angka tanpa sumber = "tidak disebutkan" atau input user; tandai `evidence: DIBACA|CUPLIKAN`.
- Kalium iodida **tidak** masuk daftar belanja (D-023).
- Jangan memakai klaim "53 negara" (D-041).

## 2. S1: Master checklist (`data/items.json`, `docs/sources.md`)
- Kategori 1–12 dari PLAN §1. Prioritas dan gating mengikuti SUMMARY §4.2. Field tambahan yang diusulkan untuk skema §4.2: `evidence`, `location` (bag/home/both), `min_tier_gating`, `scenarios` (daftar id skenario), `qty_mode` (`per_person_day` | `per_household` | `user_usage_per_day` | `boolean`), `applies_if` (mis. `has_infant`, `has_elderly`, `has_pet_dog`, `has_meds`).
- Isi inti wajib memuat semua 28 item checklist tas BNPB 2026 (SUMMARY §4.3), dengan `sources` ID-BNPB-2026. Jadikan field `bnpb_checklist` agar S2 bisa menghitung sub-skor.
- Item skenario: SUMMARY §2.11. Item tanpa sumber diperlakukan sesuai D-036 (menunggu user); siapkan dua versi atau flag `unsourced: true` agar mudah dibuang.
- Nilai kuantitas: D-004…D-024. Item dengan `user_usage_per_day`: popok, formula, MPASI, pakan, LPG, N95.
- `sources.md`: ID sumber (mis. ID-BNPB-2026, ID-BNPB-BS2020, ID-KEMENKES-2014, JP-BOUSAI-2026, JP-TOKYO-2025, SE-MCF-2024, DE-BBK-2025, DE-BLE, US-CDC-WATER, US-EPA-2026, INT-FNNE, INT-WHO-TN9, INT-IFRC-PAPE, …) dengan judul, lembaga, URL, tanggal akses, `last_updated_by_source`, dan bukti. Sitasi BNPB 2026 harus lengkap (D-044).
- Pangan: sediakan item per jenis pangan lokal (beras, mi instan, biskuit, kaleng ikan/daging, makanan siap saji, susu UHT) dengan field `kcal_per_unit` = **null + TODO R5b** (G-02). Jangan isi tebakan.

## 3. S2: Rumus dan tier (`data/rules.json`, `docs/scoring.md` + 10 kasus uji)
- Kebutuhan: air D-004/D-005/D-006; kkal D-008/D-009 (kelompok usia D-030); obat D-014; toilet D-012; hewan D-016; tunai D-017.
- Hari bertahan: D-028. Tier dan gating: SUMMARY §4.1. Sub-skor BNPB: D-026 (tas, aturan batas tepat 80%) dan D-027 (18 indikator). Skor 0–100: D-029 sebagai titik awal.
- Aturan skenario: pengali tertinggi; durasi minimum efektif untuk konflik 7 hari; pandemi mengubah obat ke 30 hari dan stok ke ≥14 hari; kekeringan menaikkan air minum ke 4 L.
- Indikator 18 yang spesifik gempa/banjir (10, 11, 16, 17) tetap dihitung untuk skala 36 agar setara BNPB. D1 boleh memberi penjelasan kontekstual.
- 10 kasus uji wajib mencakup: 1 dewasa 3 hari; keluarga 2 dewasa + 1 balita + 1 bayi formula 7 hari; lansia dengan obat rutin; rumah dengan anjing + kucing; gempa + tsunami + listrik padam; kekeringan (4 L); pandemi (obat 30 hari); konflik (durasi min 7); input nol/kosong; 20 orang 90 hari.
- Sertakan perhitungan rinci (angka antara) agar E2 dan Q1 bisa memverifikasi.

## 4. S3: Tempat beli di Indonesia (`data/sources-to-buy.json`)
- **Tanpa harga dan nominal.** Untuk tiap item: jenis toko (minimarket, supermarket, pasar tradisional, apotek, toko alat kesehatan, toko bangunan, elektronik, outdoor/camping, perlengkapan bayi, petshop, marketplace), contoh jaringan umum sebagai contoh saja, alternatif DIY/murah, dan yang gratis/resmi: salinan dokumen (Dukcapil/kelurahan), jalur evakuasi dan titik kumpul (BPBD, InaRISK), info resmi (Info BMKG, MAGMA, SATUSEHAT).
- Tandai item yang biasanya **sudah ada di rumah** (ember, kantong sampah, senter, selimut, sendok, pakaian), sesuai prinsip "Versi Hemat" BNPB.
- Jangan merekomendasikan merek produk tertentu. Untuk pemutih atau tablet, tulis "cek kadar/petunjuk di label".
- DIY bersumber: toilet kantong sampah + penyerap (BBK), plastik/tas kedap air untuk dokumen (BNPB), wadah/ember air (BNPB/NL), tandon air hujan (BNPB).
- Obat resep: arahkan ke faskes/dokter/apotek; jangan menyarankan membeli obat keras tanpa resep.

## 5. D1: UX dan copy (`docs/ux-flow.md`, `i18n/id.json`, `i18n/en.json`)
- Nada tenang dan tidak menakut-nakuti. Pakai pembingkaian BNPB: "Panduan Anti Panik", "Keluarga Siaga".
- Alur: profil (kelompok usia D-030, hamil/menyusui, hewan, obat rutin, hunian, provinsi untuk saran skenario D-038) → target (default D-003) → checklist (stok rumah + tas siaga BNPB) → evaluasi 18 indikator → hasil.
- Hasil: tier + label BNPB (D-002), "bisa bertahan ± X hari" + bottleneck, sub-skor tas (SIAP / PERLU DILENGKAPI / BELUM SIAP), status keluarga (Rawan / Cukup Siaga / Siap), daftar kekurangan per jenis toko.
- Copy wajib: disclaimer "bukan pengganti instruksi otoritas setempat"; air "minimum BNPB 2 L; SurvivalCheck memakai 3 L karena …"; peringatan dosis (pemutih/yodium/tablet: ikuti label; ragu → rebus); KI hanya atas instruksi otoritas; tsunami sesuai D-037; konflik/nuklir "rujukan internasional, belum ada panduan warga Indonesia"; 112 "ketersediaan tergantung daerah"; lilin hanya cadangan.
- Sumber ditampilkan per item (tautan ke `sources.md`), tidak menyebut "53 negara" (D-041).
- Aksesibilitas: kontras AA, target sentuh ≥44 px, satu tangan, layar 360 px, bisa dicetak.
- Pengingat: cek tiap 6 bulan, simulasi 2× setahun (D-040).

## 6. Pertanyaan yang menunggu user (lihat SUMMARY §6)
Q1 air total (D-005) · Q2 penyelarasan tier dan sub-skor BNPB (D-002, D-026, D-027) · Q3 default target (D-003) · Q4 kelompok usia (D-030) · Q5 item tanpa sumber (D-036) · Q6 mini-riset R5b (D-043) · Q7 input berbasis pemakaian (D-010, D-016).

Agent Fase 2 menyimpan nilai-nilai ini di data/konfigurasi agar bisa diganti tanpa mengubah logika.

## 7. Definition of done Fase 2 (dicek PM)
- items.json: id unik, kategori, prioritas, `qty_mode`/rumus, gating, ≥1 sumber + `evidence` per item; 28 item BNPB terpetakan.
- rules.json menghasilkan output yang sama dengan 10 kasus S2.
- sources-to-buy.json: tanpa satu pun angka harga; semua item punya ≥1 jenis toko atau sumber gratis.
- i18n id/en lengkap untuk semua label dan copy wajib §5.
