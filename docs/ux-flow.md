# SurvivalCheck — Alur UX & Struktur Layar (v1)

> Disusun D1, 2026-11-03. Acuan: `FEATURES.md`, `docs/decisions.md` (D-001…D-045), `docs/phase2-brief.md` §5, `research/SUMMARY.md` §4.
> Pasangan: `docs/design-tokens.md` (visual) dan `i18n/id.json` / `i18n/en.json` (semua teks; kunci ditulis di dokumen ini sebagai `bagian.kunci`).
> Bukan kode aplikasi. Dokumen ini mengatur apa yang ada di tiap layar, dalam urutan apa, dan bagaimana terasa.

## 1. Prinsip

1. **Tenang, bukan menakut-nakuti (I4).** Bingkai "Panduan Anti Panik" dan "Keluarga Siaga" (BNPB). Tier 0 berwarna abu, bukan merah. Merah hanya untuk peringatan keselamatan nyata (CO genset, kabel genset) dan error input.
2. **Satu langkah kecil berikutnya.** Setiap layar menjawab "apa yang perlu aku lakukan sekarang?". Hasil tidak pernah berhenti di angka, selalu ada "untuk naik tier butuh…".
3. **Mulai dari yang ada.** Semua isian boleh kosong dan boleh diisi kira-kira. Hasil sementara diberi label, bukan ditolak.
4. **Simpan otomatis (D7).** Tidak ada tombol "Simpan" pada form utama. Setiap perubahan tersimpan ke `localStorage` (dibungkus try/catch) dan diumumkan lembut ("Tersimpan otomatis di perangkat ini").
5. **Satu tangan, 360 px (I2).** Aksi utama di bagian bawah layar, target sentuh ≥44 px, tidak ada gestur rumit, tidak ada hover.
6. **Offline penuh (A2).** Tidak ada layar yang bergantung pada jaringan. Tautan sumber diberi catatan "butuh internet".
7. **Tanpa harga, tanpa merek (keputusan terkunci).** Nama jaringan toko hanya "contoh umum".
8. **Jangan hanya warna (WCAG 1.4.1).** Setiap status memakai ikon + teks + warna.

## 2. Arsitektur informasi

```
Beranda (onboarding / lanjutkan)
 ├─ Alur Penyiapan (stepper, dipakai pertama kali dan saat mengubah)
 │    1 Profil (B)
 │    2 Target & skenario (C)
 │    3 Inventaris per kategori (D) ── Pangan, Air, ... , Tas siaga (28 item BNPB), Daya listrik (E)
 │    4 Evaluasi keluarga 18 indikator (D6)
 │    └─▶ Hasil
 ├─ Hasil (F) ── Tier, skor, hari bertahan, progress, naik tier, kekurangan
 │    └─ Daftar belanja (F8/F9) ── cetak / salin / .txt
 ├─ Info offline (G) ── Nomor darurat, Panduan skenario, Penjernihan air, Kartu keluarga, Sumber
 └─ Pengaturan ── Bahasa, tampilan, pengingat, ekspor/impor, hapus data, tentang
```

### 2.1 Pola navigasi: bottom nav + stepper (keduanya, dengan alasan)

| Pola | Dipakai di | Alasan |
|---|---|---|
| **Bottom navigation** 4 tab: Beranda · Stok · Hasil · Lainnya | Navigasi utama, selalu terlihat setelah onboarding selesai | Jempol mudah menjangkau (satu tangan). Empat tab = tiap tab ≥ 90 px di layar 360 px. Pengguna bisa melompat langsung ke Hasil kapan saja, tanpa dipaksa melewati semua langkah. |
| **Stepper horizontal** (Profil → Target → Stok → Evaluasi → Hasil) | Hanya di dalam alur penyiapan pertama kali dan mode "ubah profil/target" | Pengguna baru butuh urutan jelas dan rasa kemajuan ("Langkah 2 dari 5"). Setelah selesai, stepper tidak lagi memonopoli layar. |
| **Daftar kategori** (kartu dengan progress) | Di dalam tab Stok | 13 kategori terlalu banyak untuk tab. Daftar bisa dilanjutkan sebagian ("5 dari 13 terisi"). |
| **Tab "Lainnya"** | Info offline, Pengaturan, Daftar belanja, Sumber | Menjaga nav utama tetap 4 item. Info darurat tetap dua ketukan dari mana saja. |

Tambahan:
- Pada setiap layar ada tautan kecil "Nomor darurat" di header (ikon telepon, label `info.emergency.title`) agar G1 selalu satu ketukan.
- Tombol "Kembali" di header untuk sub-layar. Tidak ada gestur swipe wajib.
- Pada layar penyiapan, tombol "Lanjut" tetap di bawah (sticky) dan tidak menutupi isian terakhir (ruang `--sp-12`).
- Judul halaman (`<h1>`) menerima fokus saat berpindah layar, untuk pembaca layar.

### 2.2 Status aplikasi

| Status | Kondisi | Efek |
|---|---|---|
| Baru | Belum ada data | Beranda menampilkan onboarding dan satu tombol "Mulai". Bottom nav disembunyikan sampai profil minimal terisi. |
| Sebagian | Profil terisi, stok belum lengkap | Beranda menampilkan "Lanjutkan yang tadi". Hasil tampil dengan banner "hasil sementara". |
| Lengkap | Semua langkah pernah dilewati | Beranda menampilkan ringkasan tier + pengingat berkala. |
| Mode cepat (D8, P1) | Pilihan di Beranda | Hanya 10 pertanyaan inti. Hasil diberi banner dan ajakan melengkapi. |

## 3. Spesifikasi per layar

Format tiap layar: **Tujuan · Komponen · State kosong / error · Validasi · Navigasi · Aksesibilitas.** Prioritas fitur dalam kurung.

---

### 3.1 Beranda & onboarding (A3, A5, H2, H3, I4)

**Tujuan.** Membuat pengguna merasa aman memulai, menjelaskan privasi dalam satu kalimat, dan membawanya ke langkah berikutnya. Untuk pengguna lama: lanjutkan atau lihat hasil.

**Komponen.**
- Judul + kalimat pembuka (`home.title`, `home.intro`), kalimat privasi (`home.privacy`).
- Kartu disclaimer ringkas (`disclaimer.short`) dengan tautan "selengkapnya" (`disclaimer.full`). Pertama kali dibuka: layar disclaimer dengan tombol "Saya mengerti" (`disclaimer.accept`).
- Tombol utama: "Mulai, hanya sekitar 5 menit" (`home.start`) atau "Lanjutkan yang tadi" (`home.resume`) dengan tanggal terakhir diubah.
- Pilihan mode cepat / lengkap (P1) sebagai dua chip, dengan penjelasan satu baris (`home.mode_hint`).
- Daftar 4 langkah (`home.steps.*`) agar pengguna tahu apa yang menanti.
- Kartu pasang ke layar utama (`home.install_*`) bila peramban menawarkan. Bisa ditutup.
- Penanda offline (`home.offline_ready` / `home.offline_preparing`).
- Pengingat berkala (H1–H3, `home.reminder_*`): maksimal satu pengingat sekaligus, dengan "Sudah saya lakukan" dan "Nanti saja".
- Banner pembaruan data (A5): "Data versi baru tersedia" + "Perbarui sekarang".

**State.**
- Kosong: onboarding penuh seperti di atas.
- Error penyimpanan tidak tersedia (mode privat): banner `settings.storage_unavailable`. Aplikasi tetap bisa dipakai dalam sesi.
- Error data rusak: `errors.storage_read` dengan pilihan "Mulai baru" atau impor cadangan.

**Validasi.** Tidak ada.

**Navigasi.** "Mulai" membuka Alur Penyiapan langkah 1. "Lihat hasil terakhir" membuka Hasil. Header: ikon nomor darurat, ikon pengaturan.

**Aksesibilitas.** `<h1>` = nama layar. Pengingat berada di wilayah `aria-live="polite"`. Kartu pasang bukan modal dan tidak menahan fokus. Kontras tombol utama 6,4:1.

---

### 3.2 Profil rumah tangga (B1–B8)

**Tujuan.** Mengumpulkan siapa yang ditanggung, sekali, dengan bahasa yang tidak teknis.

**Komponen (urutan dari atas).**
1. **Jumlah orang per kelompok usia (B1, D-030):** lima baris stepper (− angka +): Bayi (<1), Balita (1–4), Anak (5–12), Dewasa (13–59), Lansia (≥60). Total berjalan "Total: N orang" (`profile.total_people`).
2. **Hamil / menyusui (B2):** dua toggle, masing-masing dengan stepper jumlah yang muncul bila aktif. Hint kebutuhan energi dan air (`profile.pregnancy_hint`, `warnings.pregnancy_water`).
3. **Bayi (B5):** muncul hanya bila bayi ≥1. Tiga isian angka dari pemakaian harian (popok, formula, MPASI) + toggle "bayi mendapat ASI". Teks: tidak ada angka standar, kami memakai angkamu (`profile.baby_intro`).
4. **Obat rutin (B3):** daftar kartu kecil. "Tambah obat rutin" membuka sheet: untuk siapa, nama/catatan (opsional), dosis per hari, stok sekarang cukup untuk berapa hari. Catatan `profile.meds_note` (tanyakan ke dokter/apotek).
5. **Hewan (B4):** stepper anjing, kucing, lain; isian pakan per hari sesuai kebiasaan.
6. **Kebutuhan khusus (B6):** toggle disabilitas, alat bantu, **alat medis yang butuh listrik**. Bila alat medis aktif, tampil kartu info yang menjanjikan bantuan hitung daya di modul Daya Listrik.
7. **Tempat tinggal (B7, P1):** tiga pilihan radio (rumah tapak, apartemen, kos/kontrakan) + toggle ketinggian >1.000 m.
8. **Provinsi (B8):** pilihan 38 provinsi (`provinces.*`), opsional. Bila dipilih, saran skenario muncul di langkah berikutnya. Catatan khusus Jawa Timur (`profile.province_note_jatim`).

**State.**
- Kosong: semua angka 0, tombol "Lanjut" aktif tetapi menampilkan pesan lembut `profile.validation.no_people` bila total 0 (tidak memblokir pindah, hanya hasil yang tidak bisa dihitung).
- Obat kosong: `profile.meds_empty`.
- Error: validasi per field di bawah field, disertai ikon dan teks.

**Validasi.**
- Angka bulat ≥0. Kelompok usia maksimum 99 per kelompok; di atas 20 total muncul konfirmasi lembut "Jumlahnya besar sekali. Periksa lagi angkanya?" (bukan penolakan).
- Hamil+menyusui tidak boleh melebihi jumlah dewasa (peringatan lembut).
- Dosis per hari 1–12. Stok hari ≥0.
- Pesan inline muncul saat *blur*, bukan saat mengetik.

**Navigasi.** Stepper langkah 1 dari 5. "Lanjut" ke Target. Bisa dibuka lagi dari Beranda atau Lainnya → "Ubah profil". Perubahan profil menghitung ulang hasil tanpa menghapus isian stok.

**Aksesibilitas.** Stepper memakai tombol 44×44 px dengan label "Tambah satu Dewasa" (`profile.increase`), nilai diumumkan via `aria-live="polite"`. Field terhubung label dengan `for`/`id`. Sheet obat memindahkan fokus ke judul, bisa ditutup dengan tombol Tutup dan Esc, mengembalikan fokus ke tombol pemicu. Input angka berukuran font ≥16 px.

---

### 3.3 Target & skenario (C1–C3, B8)

**Tujuan.** Menetapkan berapa lama ingin bertahan dan jenis bencana yang disiapkan, tanpa membuat pengguna merasa harus memilih semuanya.

**Komponen.**
1. **Target durasi (C1):** radio besar 3 / 7 / 14 / 30 hari + "Lainnya" (isian angka). 7 hari berlabel "Disarankan" (D-003). Di bawahnya selalu: "Minimum BNPB: 3 hari (72 jam)…" (`target.bnpb_min`).
2. **Skenario (C2):** 11 kartu centang (`scenarios.*`), masing-masing dengan satu baris keterangan sumber. Bila provinsi dipilih: bagian "Disarankan untuk {provinsi}" dengan skenario terpilih otomatis dan teks "Hapus centang bila tidak sesuai".
3. **Penanda rujukan internasional:** kartu konflik dan nuklir menampilkan lencana "Rujukan internasional" dan, setelah dipilih, catatan `scenarios.note_international`.
4. **Ringkasan aturan (C3):** muncul otomatis bila perlu: "Durasi efektif: 7 hari" (konflik), "Air minum dinaikkan menjadi 4 L" (kekeringan), "Stok obat rutin 30 hari" (pandemi).
5. **Salinan pesan air:** kartu info `warnings.water_3l` (3 L vs minimum BNPB 2 L) tampil di sini sekali, dengan tombol tutup.

**State.**
- Kosong: tidak ada skenario dipilih diperbolehkan; teks `target.scenario_none` menjelaskan paket inti tetap dihitung.
- Tidak ada provinsi: bagian saran disembunyikan, ada tautan "Pilih provinsi" ke Profil.

**Validasi.** Durasi custom 1–365 hari (`target.validation.days_required`). Di bawah 3 hari: info lembut `target.below_min`. Di atas 90 hari: konfirmasi lembut `target.validation.days_large`.

**Navigasi.** Stepper langkah 2 dari 5; "Lanjut" ke Stok. "Kembali" ke Profil. Memilih "Listrik padam panjang" menandai kategori Daya listrik sebagai disarankan di Stok.

**Aksesibilitas.** Kelompok durasi = `radiogroup` dengan legenda; kelompok skenario = `fieldset` + `legend`, tiap kartu satu `checkbox` yang seluruh areanya bisa diketuk. Kartu terpilih ditandai ikon centang dan teks, bukan hanya border berwarna. Perubahan durasi efektif diumumkan lewat `aria-live`.

---

### 3.4 Inventaris per kategori (D1–D5, D7, D8, H1)

**Tujuan.** Mengisi apa yang dimiliki, kategori demi kategori, tanpa merasa kewalahan. Bisa berhenti kapan saja.

**3.4.1 Daftar kategori (halaman utama tab Stok).**
- 13 kartu: Air, Pangan, Obat & P3K, Sanitasi, Penerangan, Daya listrik, Komunikasi, Dokumen & tunai, Pakaian & kehangatan, Alat, Tas siaga, Kebutuhan khusus, Rencana & pengetahuan (`categories.*`).
- Tiap kartu: ikon, nama, satu baris keterangan, "{x} dari {y} terisi", dan chip status (`✓ Cukup`, `△ Kurang`, `— Belum diisi`) + bar progress dengan persen tertulis.
- Urutan disusun menurut prioritas gating (air, pangan, obat dulu) dan kartu yang sedang diisi diberi tanda "Lanjutkan".
- Kategori yang tidak berlaku (mis. bayi tanpa bayi) diberi chip "Tidak berlaku untuk rumah tangga ini" dan tidak dihitung.
- Pada atas daftar: chip mode **Cepat / Lengkap** (D8). Mode cepat hanya menampilkan 10 pertanyaan inti.

**3.4.2 Layar satu kategori (pola umum).**
- Daftar item hasil `data/items.json`. Tiap baris: nama item, *kebutuhan* ("Kebutuhan: 21 L"), isian *dimiliki* (stepper/angka) atau toggle ya/tidak sesuai `qty_mode`, chip status, dan tautan sumber (`common.source`) yang membuka sheet sumber.
- Pemisahan lokasi (D4): selektor tiga posisi "Di tas siaga / Stok rumah / Di tas dan di rumah" (`inventory.location.*`) hanya untuk item yang berlaku.
- Tanggal kedaluwarsa opsional (H1, P1) dalam bagian ringkas "Lebih detail".
- Footer menunjukkan "Tersimpan otomatis". Tombol "Kategori berikutnya" tetap di bawah.

**3.4.3 Pangan (D3).** Daftar jenis pangan lokal: beras, mi instan, biskuit, makanan kaleng, makanan siap saji, susu UHT (`inventory.food.*`). Tiap baris isian jumlah. Total kkal dan kebutuhan kkal per hari ditampilkan di atas. Pangan di luar daftar: isian "kalori per kemasan dari label" (fallback). Tips: sebagian stok siap santap tanpa masak (`inventory.food.ready_to_eat_tip`). Air ada di kategori Air dengan catatan `inventory.water_note` dan kartu 3 L vs 2 L (`warnings.water_3l`).

**3.4.4 Tas siaga BNPB (D5).** Layar khusus berisi 28 item dalam lima kelompok (A–E, `inventory.gobag.group_*`). Tiap item satu toggle besar "Ada / Perlu tambah". Di atas: "{n} dari {total} item" + sub-skor langsung (`✓ SIAP`, `△ PERLU DILENGKAPI`, `○ BELUM SIAP`) dengan aturan >80%, 50–80%, <50% (tepat 80% = perlu dilengkapi). Item bayi/lansia disembunyikan dan diberi catatan "tidak dihitung" bila rumah tangga tidak punya bayi/lansia (D-026). Teks nama 28 item adalah milik S1 (`data/items.json`), tidak diulang di i18n UI.

**3.4.5 Daya listrik (E1–E7)** lihat §3.5.

**State.**
- Kosong: `inventory.empty_state_*` dengan ajakan mulai dari Air.
- Mode cepat aktif: banner `inventory.quick_banner` dan tombol "Lengkapi dengan mode lengkap".
- Error penyimpanan: toast `errors.storage_write`, isian tetap di layar.

**Validasi.** Angka ≥0 (inline, saat blur). Angka sangat besar → konfirmasi lembut. Tanggal kedaluwarsa lampau → info "tidak dihitung sebagai stok". Tidak ada bidang wajib: kosong dibaca sebagai 0 dan ditandai "Belum diisi" (berbeda dari "Kurang").

**Navigasi.** Tab Stok → daftar kategori → layar kategori. "Kategori berikutnya"/"Sebelumnya" di bawah. Di alur penyiapan, setelah kategori terakhir tombol berubah menjadi "Lanjut ke evaluasi keluarga". Pengguna boleh melompat langsung ke Hasil dari kepala layar ("Lihat hasil sementara").

**Aksesibilitas.** Kartu kategori adalah tautan dengan nama aksesibel lengkap ("Air, 2 dari 5 terisi, masih kurang"). Bar progress memakai `role="progressbar"` + `aria-valuenow` dan persen tertulis. Toggle ya/tidak memakai `role="switch"` dengan teks status ("Dicentang"/"Belum dicentang"). Kontrol ukuran ≥44 px dan jarak ≥8 px. Daftar panjang memakai `<ul>` dan judul kelompok `<h2>`.

---

### 3.5 Daya listrik / power station (E1–E7, B6, H3)

**Tujuan.** Menjawab "listrikku cukup untuk berapa hari?" dengan bahasa awam, dan memberi saran kapasitas power station bila kurang.

**Komponen (urutan, dengan pengungkapan bertahap).**
1. **Perangkat penting (E1):** daftar centang perangkat (HP, lampu LED, router, radio, kipas, laptop, pompa air, kulkas, kulkas ASI/obat, CPAP, konsentrator oksigen, nebulizer, lainnya) dengan lencana "Alat medis" bila relevan. Perangkat medis dipilih otomatis bila di Profil ditandai memakai alat medis. Tiap perangkat terpilih menampilkan isian watt (sudah terisi tipikal, bisa diubah, hint "lihat label perangkat") dan jam pakai per hari.
2. **Hari tanpa listrik (E2):** isian, default sama dengan target ("Sama dengan target: N hari").
3. **Kebutuhan energi (E2):** kartu hasil "N Wh per hari" dan "N Wh untuk X hari" dengan penjelasan satu kalimat arti Wh (`power.wh_explain`).
4. **Saran kapasitas (E3):** "Kapasitas sekitar N Wh" dan "Daya keluaran minimal N W" dengan alasan (efisiensi inverter, cadangan, perangkat terbesar). Tanpa harga dan tanpa merek.
5. **Daya yang dimiliki (E4):** power bank (mAh → Wh dengan catatan konversi), power station (Wh), baterai cadangan, genset (W, bahan bakar tersedia berapa jam), panel surya (Wp).
6. **Hasil (E5):** pernyataan besar "Listrik cukup untuk ± N hari" + status cukup/kurang terhadap target. Bila ada alat medis listrik: catatan bahwa daya ikut menentukan hari bertahan (`power.medical_gating`) dan info pendataan pelanggan prioritas PLN/faskes (`power.medical_registry`).
7. **Isi ulang surya (E6, P1):** jam matahari efektif → perkiraan Wh per hari → apakah bisa mandiri; catatan mendung.
8. **Peringatan keselamatan (E7):** kartu bergaya danger di bagian atas bila genset/kompor diisi, dan selalu tersedia di bawah layar: CO, jangan sambung genset ke instalasi rumah, simpan di tempat kering (`power.warn.*`). Peringatan CO tidak bisa ditutup permanen, hanya dilipat.

**State.**
- Kosong: `power.empty_state_*`; layar boleh dilewati.
- Tanpa sumber daya: `power.coverage_none`.
- Error: validasi inline watt/jam/kapasitas.

**Validasi.** Watt 1–5.000, jam 0–24, kapasitas ≥0. Jam 0 diterima (perangkat dicadangkan). Perangkat bermotor menampilkan catatan lonjakan daya (`power.surge_note`).

**Navigasi.** Ada dua pintu: (a) kartu "Daya listrik" di daftar kategori Stok; (b) dari Profil bila alat medis aktif, atau dari Target bila "Listrik padam panjang" dipilih. Kembali ke daftar kategori. Hasil memuat tautan "Lihat perhitungan daya".

**Aksesibilitas.** Peringatan CO: ikon `⚠` + judul tebal + teks, `role="alert"` saat muncul pertama kali. Angka Wh memakai `font-variant-numeric: tabular-nums`. Hasil "± N hari" ada dalam elemen `aria-live="polite"` yang diperbarui saat isian berubah.

---

### 3.6 Evaluasi keluarga, 18 indikator (D6)

**Tujuan.** Mengukur kesiapan kebiasaan dan rencana, bukan benda. Terasa seperti percakapan, bukan ujian.

**Komponen.**
- Satu pertanyaan per kartu (18), dikelompokkan Logistik (1–7), Prosedur (8–13), Kesiapan mental (14–18) (`family_eval.group.*`).
- Tiga pilihan jawaban sebagai radio besar (0 / 1 / 2): "Belum", "Ada, belum lengkap", "Lengkap dan sudah dilatih" (`family_eval.option.*`).
- Penanda kemajuan "Pertanyaan N dari 18" dan skor berjalan "Skor: x dari 36" yang lembut.
- Pertanyaan 10, 11, 16, 17 (spesifik gempa/banjir) diberi catatan konteks (`family_eval.context_quake_flood`) dan tetap dihitung (skala 36 sama dengan BNPB).
- Di akhir: pita hasil `○ Rawan` / `◑ Cukup Siaga` / `✓ Siap` (0–12, 13–24, 25–36) dengan ajakan ("Satu hal kecil untuk ditingkatkan: …").

**State.** Belum dijawab = dihitung 0 dan ditandai "Belum dijawab". Boleh dilompati (tombol "Lewati dulu"), dengan peringatan lembut bahwa tier 2 butuh skor ≥13 dan tier 4 ≥25.

**Validasi.** Tidak ada (pilihan tertutup). Setiap jawaban disimpan saat dipilih.

**Navigasi.** Stepper langkah 4 dari 5. Dalam layar: daftar bergulir satu halaman dengan kelompok, atau satu per satu di mode cepat. "Selesai" menuju Hasil. Dapat diulang dari tab Stok (kategori Rencana & pengetahuan).

**Aksesibilitas.** Tiap pertanyaan = `fieldset` + `legend` dengan nomor. Radio besar 44 px. Skor berjalan tidak diumumkan setiap perubahan, hanya saat selesai.

---

### 3.7 Hasil (F1–F6, F10)

**Tujuan.** Memberi gambaran jujur yang tenang dan langkah berikutnya. Ini layar terpenting.

**Komponen (urutan dari atas, urutan ini menentukan prioritas).**
1. **Banner hasil sementara** bila data belum lengkap (`result.partial_banner`).
2. **Kartu tier (F2):** lencana lima segmen + "Tier N" + nama + kalimat ringkas (`tiers.N.summary`). Tier 2 memakai lencana "BNPB". Selalu ikon + teks + warna.
3. **"Saat ini bisa bertahan ± X hari" (F4):** angka besar (`--fs-display`), target, dan **bottleneck**: "Air minum habis lebih dulu, sekitar hari ke-2" (`result.bottleneck_line`). Catatan cara menghitung (lipat).
4. **Skor 0–100 (F3):** angka kecil di bawah, dengan catatan "tier ditentukan item penting, bukan skor" dan rincian 4 bagian (bisa dilipat).
5. **Dua alat ukur BNPB:** Tas siaga (`✓ SIAP` / `△ PERLU DILENGKAPI` / `○ BELUM SIAP`) dan Evaluasi keluarga (`○ Rawan` / `◑ Cukup Siaga` / `✓ Siap`). Bila evaluasi belum diisi: tombol "Isi evaluasi keluarga".
6. **Progress per kategori (F5):** 13 bar dengan persen dan chip status. Ketuk membuka kategori itu.
7. **Untuk naik ke tier N+1 (F5):** daftar singkat penahan: item yang kurang, syarat skor evaluasi, syarat tas >80%. Tombol "Lihat daftar belanja".
8. **Daftar kekurangan (F6/F7):** diurut prioritas (Utama → Penting → Pelengkap). Tiap baris: nama item, "Kurang {jumlah}", alasan, sumber, dan **tempat beli per jenis toko** (chip: Minimarket, Apotek, …) + alternatif hemat/DIY + gratis/resmi + chip "Biasanya sudah ada di rumah". Satu catatan "tanpa harga, nama toko hanya contoh umum".
9. **Rencana bertahap (F10, P1):** "Minggu ini", "Bulan depan", "Setelah itu".
10. **Aksi:** "Lihat daftar belanja", "Cetak atau simpan".
11. **Disclaimer ringkas** di kaki dan peringatan air 3 L vs 2 L pada baris air bila tampil.

**State.**
- Kosong: `result.empty_title/body` dan tombol ke Profil/Stok.
- Sementara: banner + hasil dengan label "(sementara)".
- Tier 5: `result.next_top`, tanpa bagian naik tier.
- Error perhitungan/data: `errors.data_load` dengan "Muat ulang".

**Validasi.** Tidak ada input. Hasil dihitung ulang otomatis saat data berubah (`result.recalc`).

**Navigasi.** Tab Hasil di bottom nav. Dari baris kekurangan → kategori terkait. Dari "Daftar belanja" → §3.8. Tombol "Ubah target" ke Target.

**Aksesibilitas.** Lencana tier: `role="img"` dengan label gabungan ("Tingkat kesiapan: tier 2, Siap Dasar 72 jam standar BNPB"). Warna tier tidak dipakai sendirian. Urutan baca = urutan visual. Bar progress punya label teks. Angka "± X hari" dibaca utuh ("sekitar 3 hari"). Bagian dapat dilipat memakai `<details>`. Zoom 200% tanpa scroll horizontal. Bahasa tenang: tidak ada kata "bahaya", "gagal", atau merah pada tier.

---

### 3.8 Daftar belanja (F8, F9)

**Tujuan.** Membawa pengguna dari hasil ke tindakan: satu daftar siap dibawa ke toko, bisa dicetak.

**Komponen.**
- Judul, ringkasan "Untuk N orang, target X hari" dan "N dari M dibeli".
- Kelompok per jenis toko (`stores.*`): Minimarket, Supermarket, Pasar tradisional, Apotek, Toko alat kesehatan, Toko bangunan, Toko elektronik, Outdoor/camping, Perlengkapan bayi, Petshop, Marketplace online. Kelompok terpisah: "Gratis atau resmi" (salinan dokumen, titik kumpul, info BMKG) dan "Biasanya sudah ada di rumah (cek dulu)".
- Baris: kotak centang besar, nama item, jumlah kurang, catatan label (pemutih/tablet: cek kadar di label; obat resep: tanya dokter/apotek).
- Aksi: Cetak / simpan PDF, Salin teks, Unduh .txt (`shopping.print/copy/download_txt`); toggle "Sembunyikan yang sudah dibeli".
- Contoh jaringan toko hanya contoh umum, tanpa harga dan tanpa merek.

**State.** Kosong: `shopping.empty_*`. Salin gagal: `shopping.copy_failed` dengan alternatif. Status centang tersimpan.

**Validasi.** Tidak ada.

**Navigasi.** Dari Hasil atau Lainnya → Daftar belanja. Tombol kembali ke Hasil. Mengisi stok di kategori mengurangi daftar otomatis; item yang sudah dicentang "dibeli" tetap tercatat sampai stok diisi.

**Aksesibilitas.** Tiap kelompok `<section>` dengan `<h2>`. Kotak centang ≥44 px. Cetak: CSS cetak (`design-tokens.md` §7) mengganti kotak centang dengan "☐", menyembunyikan navigasi, mencetak URL sumber sebagai teks, dan menambahkan footer tanggal + disclaimer. Tidak bergantung warna di cetakan hitam-putih.

---

### 3.9 Info offline (G1–G6)

**Tujuan.** Panduan yang bisa dibuka dalam keadaan darurat, tanpa sinyal, dengan sedikit ketukan.

**Subbagian (daftar di tab Lainnya → Info).**
1. **Nomor darurat (G1):** kartu berisi tombol telepon besar (`tel:`). 112 dengan catatan "ketersediaan tergantung daerah", 110, 113, 115, 117, 118/119, 123, 196. Tombol "Cetak kartu". Catatan pembaruan data (`info.emergency.verify_note`).
2. **Panduan per skenario (G2):** 11 skenario, tiap satu: Sebelum / Saat / Sesudah, label sumber. Tsunami: "gempa kuat atau lama di dekat pantai, segera ke tempat tinggi, jangan menunggu sirene" di paling atas. Konflik dan nuklir: lencana "Rujukan internasional" + "belum ada panduan khusus untuk warga Indonesia". Nuklir: kotak KI "hanya atas instruksi otoritas".
3. **Penjernihan air (G3):** rebus, pemutih, tawas/PAC, yodium; peringatan "ikuti label, ragu rebus" di atas.
4. **Kartu kontak & rencana keluarga (G4, P1):** isian titik kumpul, kontak luar kota, pembawa tas, penolong anak/lansia, jalur; cetak.
5. **Sumber (G5):** daftar rujukan, tanggal akses, penanda bukti (dibaca langsung / dari kutipan).
6. **Disclaimer (G6):** teks lengkap.

**State.** Konten bersifat statis dan di-cache. Tautan eksternal diberi catatan "butuh internet". Bila data panduan gagal dimuat: `errors.data_load`.

**Validasi.** Hanya di kartu keluarga (teks bebas, tanpa validasi).

**Navigasi.** Lainnya → Info → subbagian. Nomor darurat juga dari ikon di header semua layar. Breadcrumb sederhana (tombol kembali).

**Aksesibilitas.** Nomor telepon `<a href="tel:...">` dengan label "Telepon 110" dan area ketuk penuh. Panduan memakai judul bertingkat dan daftar bernomor. Panjang baris ≤70 karakter. Lencana "Rujukan internasional" berupa teks, bukan hanya warna.

---

### 3.10 Pengaturan (A6, A7, I1, I3, H2)

**Tujuan.** Kendali atas bahasa, tampilan, data, dan privasi, tanpa kerumitan.

**Komponen.**
- Bahasa: radio "Bahasa Indonesia" / "English" (berlaku seketika tanpa muat ulang).
- Tampilan: Ikuti sistem / Terang / Gelap.
- Pengingat (H2/H3): tiga-empat toggle (tas 6 bulan, air 6 bulan, simulasi 2×/tahun, power bank 3 bulan) + catatan bahwa pengingat hanya muncul saat aplikasi dibuka.
- Cadangan data: "Ekspor data ke file" (unduh JSON) dan "Impor dari file".
- Pembaruan data (A5): "Cek pembaruan" dan status.
- Privasi: satu paragraf.
- Bahaya: "Hapus semua data saya" (A7) di bagian bawah, gaya tombol sekunder (bukan merah mencolok).
- Tentang & versi.

**State.**
- Impor gagal: pesan spesifik (`settings.import_error_*`), data lama tetap aman.
- Offline saat cek pembaruan: `settings.data_update_offline`.
- Penyimpanan tak tersedia: banner.

**Validasi / konfirmasi.**
- Impor: validasi format dan versi file sebelum diganti; dialog konfirmasi "Ganti data dengan file ini?".
- Hapus: dialog konfirmasi dengan dua tombol berlabel jelas ("Batal" dan "Ya, hapus semua"); fokus awal pada "Batal". Setelah hapus, kembali ke Beranda onboarding dengan pesan konfirmasi.

**Navigasi.** Lainnya → Pengaturan. Ikon roda gigi di header Beranda sebagai jalan pintas.

**Aksesibilitas.** Pergantian bahasa memperbarui `lang` pada `<html>`. Dialog: `role="dialog"` (`alertdialog` untuk hapus), perangkap fokus, Esc menutup, fokus kembali ke pemicu. Hasil ekspor/impor diumumkan lewat `aria-live`. Aksi destruktif tidak mengandalkan warna.

---

## 4. Wireframe ASCII (lebar 360 px ≈ 40 kolom, 8 layar)

Keterangan: `[ ]` tombol, `( )` radio, `[x]` centang, `▓░` segmen/progress, `⚠` peringatan keselamatan. Teks di dalam wireframe mewakili kunci i18n.

### 4.1 Beranda / onboarding

```
┌──────────────────────────────────────┐
│ SurvivalCheck           ☎   ⚙        │  header: nomor darurat, pengaturan
├──────────────────────────────────────┤
│  Selamat datang                      │  home.title
│                                      │
│  SurvivalCheck membantu kamu melihat │
│  seberapa siap rumah tangga ... Tidak│
│  perlu sempurna.                     │  home.intro
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🔒 Datamu hanya tersimpan di    │  │  home.privacy
│  │ perangkat ini. Tanpa akun.      │  │
│  └────────────────────────────────┘  │
│                                      │
│  Empat langkah                       │
│  1 Ceritakan siapa saja di rumah     │
│  2 Pilih target dan jenis bencana    │
│  3 Isi persediaan yang kamu punya    │
│  4 Lihat hasil dan langkah berikutnya│
│                                      │
│  Mode:  (•) Lengkap  ( ) Cepat       │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  Mulai, hanya sekitar 5 menit  │  │  tombol utama, 48 px
│  └────────────────────────────────┘  │
│                                      │
│  ✓ Siap dipakai tanpa internet       │
│  Bukan pengganti instruksi otoritas  │  disclaimer.short
│  setempat.                           │
└──────────────────────────────────────┘
```

### 4.2 Profil rumah tangga (langkah 1 dari 5)

```
┌──────────────────────────────────────┐
│ ←  Profil rumah tangga        ☎      │
│ Langkah 1 dari 5  ●○○○○              │  stepper
├──────────────────────────────────────┤
│ Jumlah orang per kelompok usia       │
│                                      │
│ Bayi (di bawah 1 tahun)  [−] 1 [+]   │
│ Balita (1 sampai 4)      [−] 0 [+]   │
│ Anak (5 sampai 12)       [−] 0 [+]   │
│ Dewasa (13 sampai 59)    [−] 2 [+]   │
│ Lansia (60 ke atas)      [−] 0 [+]   │
│ Total: 3 orang                       │
│                                      │
│ Kondisi khusus ibu                   │
│ [ ] Ada yang sedang hamil            │
│ [x] Ada yang sedang menyusui         │
│       Berapa orang?      [−] 1 [+]   │
│                                      │
│ Kebutuhan bayi (isi sesuai pemakaian)│
│ Popok per hari           [  8   ]    │
│ Formula per hari         [  3   ]    │
│ MPASI per hari           [  0   ]    │
│                                      │
│ Obat rutin                           │
│ Belum ada obat rutin. Lewati bila... │
│ [ + Tambah obat rutin ]              │
│                                      │
│ ... hewan, kebutuhan khusus, hunian, │
│ provinsi ...                         │
│  Tersimpan otomatis di perangkat ini │
├──────────────────────────────────────┤
│ [          Lanjut          ]         │  sticky
└──────────────────────────────────────┘
```

### 4.3 Target & skenario (langkah 2 dari 5)

```
┌──────────────────────────────────────┐
│ ←  Target dan jenis bencana   ☎      │
│ Langkah 2 dari 5  ●●○○○              │
├──────────────────────────────────────┤
│ Target lama bertahan                 │
│ ( ) 3 hari   (•) 7 hari  Disarankan  │
│ ( ) 14 hari  ( ) 30 hari ( ) Lainnya │
│ ⓘ Minimum BNPB: 3 hari (72 jam).     │
│   Banyak negara kini menganjurkan 7  │
│   hari atau lebih.                   │
│                                      │
│ Disarankan untuk Jawa Tengah         │
│ ┌────────────────────────────────┐   │
│ │ [x] ✓ Gempa bumi               │   │
│ │     Sumber: BNPB, BMKG         │   │
│ └────────────────────────────────┘   │
│ ┌────────────────────────────────┐   │
│ │ [x] ✓ Banjir dan longsor       │   │
│ └────────────────────────────────┘   │
│ ┌────────────────────────────────┐   │
│ │ [ ] Konflik dan kerusuhan      │   │
│ │  [Rujukan internasional]       │   │
│ └────────────────────────────────┘   │
│ ... 11 skenario ...                  │
│                                      │
│ ⓘ Durasi efektif: 7 hari (konflik)   │
├──────────────────────────────────────┤
│ [          Lanjut          ]         │
└──────────────────────────────────────┘
```

### 4.4 Daftar kategori inventaris (tab Stok)

```
┌──────────────────────────────────────┐
│ Persediaan                    ☎      │
│ Mode: [Cepat] [Lengkap•]             │
├──────────────────────────────────────┤
│ ┌────────────────────────────────┐   │
│ │ 💧 Air                         │   │
│ │ Air minum, masak, kebersihan   │   │
│ │ ▓▓▓▓▓░░░░░ 50%   △ Kurang      │   │
│ └────────────────────────────────┘   │
│ ┌────────────────────────────────┐   │
│ │ 🍚 Pangan                      │   │
│ │ ▓▓▓▓▓▓▓▓░░ 80%   ✓ Cukup       │   │
│ └────────────────────────────────┘   │
│ ┌────────────────────────────────┐   │
│ │ 💊 Obat dan P3K                │   │
│ │ ░░░░░░░░░░  0%   — Belum diisi │   │
│ └────────────────────────────────┘   │
│ ┌────────────────────────────────┐   │
│ │ 🎒 Tas siaga (BNPB)            │   │
│ │ 19 dari 28 item  △ PERLU DILENGKAPI│
│ └────────────────────────────────┘   │
│ ┌────────────────────────────────┐   │
│ │ 🔌 Daya listrik   Lanjutkan →  │   │
│ └────────────────────────────────┘   │
│ ... 13 kategori ...                  │
├──────────────────────────────────────┤
│ 🏠 Beranda  📦 Stok  📊 Hasil  ⋯ Lain│  bottom nav
└──────────────────────────────────────┘
```

### 4.5 Daya listrik

```
┌──────────────────────────────────────┐
│ ←  Daya listrik               ☎      │
├──────────────────────────────────────┤
│ Perangkat yang paling penting        │
│ [x] HP / ponsel                      │
│      Daya [ 10 ] W   Jam/hari [ 4 ]  │
│ [x] Lampu LED                        │
│      Daya [ 5 ] W    Jam/hari [ 6 ]  │
│ [x] CPAP  (Alat medis)               │
│      Daya [ 40 ] W   Jam/hari [ 8 ]  │
│ [ ] Kipas angin  [ ] Router ...      │
│ [ + Tambah perangkat lain ]          │
│                                      │
│ Kebutuhan energi                     │
│  380 Wh per hari                     │
│  2.660 Wh untuk 7 hari               │
│ Saran kapasitas power station        │
│  sekitar 3.500 Wh · keluaran ≥ 300 W │
│                                      │
│ Daya yang kamu punya                 │
│ Power bank [ 20000 ] mAh ≈ 74 Wh     │
│ Power station [ 500 ] Wh             │
│                                      │
│ ┌────────────────────────────────┐   │
│ │ Listrik cukup untuk ± 1,5 hari │   │
│ │ △ Kurang sekitar 2.000 Wh      │   │
│ └────────────────────────────────┘   │
│ ┌────────────────────────────────┐   │
│ │ ⚠ Awas gas karbon monoksida    │   │
│ │ Jangan nyalakan genset di dalam│   │
│ │ ruangan...                     │   │
│ └────────────────────────────────┘   │
└──────────────────────────────────────┘
```

Angka dalam wireframe hanya contoh ilustrasi tata letak, bukan hasil perhitungan resmi (rumus ada di S4).

### 4.6 Evaluasi keluarga (satu pertanyaan)

```
┌──────────────────────────────────────┐
│ ←  Evaluasi keluarga          ☎      │
│ Langkah 4 dari 5  ●●●●○              │
│ Logistik · Pertanyaan 3 dari 18      │
│ Skor: 4 dari 36                      │
├──────────────────────────────────────┤
│ Semua anggota keluarga tahu lokasi   │
│ tas siaga                            │
│                                      │
│ ┌────────────────────────────────┐   │
│ │ ( ) Belum                      │   │
│ └────────────────────────────────┘   │
│ ┌────────────────────────────────┐   │
│ │ (•) Ada, belum lengkap         │   │
│ └────────────────────────────────┘   │
│ ┌────────────────────────────────┐   │
│ │ ( ) Lengkap dan sudah dilatih  │   │
│ └────────────────────────────────┘   │
│                                      │
│ Tidak ada nilai buruk. Ini cara untuk│
│ tahu langkah berikutnya.             │
├──────────────────────────────────────┤
│ [ Sebelumnya ]       [   Lanjut   ]  │
└──────────────────────────────────────┘
```

### 4.7 Hasil (layar terpenting)

```
┌──────────────────────────────────────┐
│ Hasil kesiapan                ☎      │
│ Hasil ini bukan nilai ujian. Ini peta│
│ langkah berikutnya.                  │
├──────────────────────────────────────┤
│ ┌────────────────────────────────┐   │
│ │ ▓▓░░░  ◑ Tier 2 dari 5   [BNPB]│   │
│ │ Siap Dasar 72 jam (standar BNPB)│  │
│ │ Kamu memenuhi standar dasar    │   │
│ │ BNPB untuk 3 hari.             │   │
│ └────────────────────────────────┘   │
│                                      │
│ Saat ini bisa bertahan               │
│   ± 4 hari       Target: 7 hari      │
│ Yang paling cepat habis:             │
│ Air minum, sekitar hari ke-4         │
│                                      │
│ Skor 68 dari 100  (tier ditentukan   │
│ item penting)       [Rincian ▾]      │
│                                      │
│ Dua alat ukur BNPB                   │
│ Tas siaga: 24 dari 28 (86%)  ✓ SIAP  │
│ Evaluasi keluarga: 15 dari 36        │
│                     ◑ Cukup Siaga    │
│                                      │
│ Kemajuan per kategori                │
│ Air       ▓▓▓▓▓░░░░░ 50%  △ Kurang   │
│ Pangan    ▓▓▓▓▓▓▓▓░░ 80%  ✓ Cukup    │
│ Obat      ▓▓▓▓▓▓▓▓▓░ 90%  ✓ Cukup    │
│ ... 13 kategori ...                  │
│                                      │
│ Untuk naik ke tier 3                 │
│ • Air minum: kurang 33 L             │
│ • Radio: belum ada                   │
│ • Evaluasi keluarga: 4 poin lagi     │
│                                      │
│ Yang perlu dilengkapi                │
│ ┌────────────────────────────────┐   │
│ │ Utama · Air minum              │   │
│ │ Kurang 33 L                    │   │
│ │ [Minimarket] [Supermarket]     │   │
│ │ Hemat: tampung di wadah bersih │   │
│ └────────────────────────────────┘   │
│ [ Lihat daftar belanja ]             │
│ Bukan pengganti instruksi otoritas.  │
├──────────────────────────────────────┤
│ 🏠 Beranda  📦 Stok  📊 Hasil  ⋯ Lain│
└──────────────────────────────────────┘
```

Angka pada wireframe hanya ilustrasi tata letak.

### 4.8 Daftar belanja

```
┌──────────────────────────────────────┐
│ ←  Daftar belanja             ☎      │
│ Untuk 3 orang, target 7 hari         │
│ 2 dari 9 dibeli    [Sembunyikan ✓]   │
├──────────────────────────────────────┤
│ Minimarket                           │
│ [x] Air minum                  33 L  │
│ [ ] Mi instan                  6 bks │
│ Apotek                               │
│ [ ] Plester luka                1    │
│ Toko elektronik                      │
│ [ ] Baterai cadangan            4    │
│ Gratis atau resmi                    │
│ [ ] Salinan KTP dan KK (kelurahan)   │
│ Biasanya sudah ada di rumah          │
│ [ ] Ember bertutup                   │
│                                      │
│ ⓘ Tanpa harga. Nama toko hanya contoh│
│ umum.                                │
├──────────────────────────────────────┤
│ [Cetak/PDF] [Salin teks] [.txt]      │
└──────────────────────────────────────┘
```

Enam layar terpenting: Beranda (4.1), Profil (4.2), Target (4.3), Daya listrik (4.5), Evaluasi keluarga (4.6), Hasil (4.7). Daftar kategori (4.4) dan Daftar belanja (4.8) melengkapi.

## 5. Pola lintas layar

### 5.1 Komponen bersama
- **Stepper angka (− n +)**: dua tombol 44×44 px, nilai di tengah, bisa diketik langsung. Tombol − nonaktif pada 0 dengan `aria-disabled`.
- **Kartu status**: ikon + teks + warna (chip). Tidak pernah warna saja.
- **Sheet sumber**: ketuk "Sumber" di item untuk melihat rujukan (BNPB 2026, dsb.), tanggal akses, penanda bukti, tautan (butuh internet). Tanpa klaim jumlah negara.
- **Kartu peringatan**: tiga varian, **info** (biru), **hati-hati** (kuning), **keselamatan** (merah, jarang). Selalu ada ikon dan judul.
- **Sheet konfirmasi**: untuk impor dan hapus.
- **Toast** kecil "Tersimpan" yang diumumkan lewat `aria-live="polite"`, hilang otomatis tetapi tidak menutupi tombol.

### 5.2 Salinan wajib dan letaknya

| Copy wajib | Kunci i18n | Muncul di |
|---|---|---|
| Bukan pengganti instruksi otoritas | `disclaimer.short/full`, `warnings.not_substitute` | Beranda, kaki Hasil, cetakan, Info |
| Air 3 L vs minimum BNPB 2 L | `warnings.water_3l` | Target, kategori Air, baris air di Hasil |
| Dosis ikuti label, ragu rebus | `warnings.dose_label`, `info.water.label_rule` | Penjernihan air, daftar belanja pemutih/tablet |
| KI hanya atas instruksi otoritas | `warnings.ki_authority`, `info.guides.ki_body` | Panduan nuklir, skenario nuklir |
| Tsunami: jangan menunggu sirene | `warnings.tsunami_no_siren`, `info.guides.tsunami_lead` | Skenario tsunami, panduan tsunami |
| Konflik/nuklir: rujukan internasional | `warnings.international_only`, `scenarios.note_international` | Pilihan skenario, panduan |
| 112 tergantung daerah | `warnings.n112_area`, `info.emergency.n112_caveat` | Nomor darurat |
| Lilin hanya cadangan | `warnings.candles` | Kategori Penerangan, skenario listrik padam |
| Peringatan CO genset | `power.warn.co_*`, `warnings.co_genset` | Daya listrik, kategori Alat/Bahan bakar |

### 5.3 Konvensi tulisan
- Pakai "kamu", kalimat pendek, kata kerja aktif. Hindari "bahaya", "gagal", "kritis", "darurat!" dan tanda seru.
- Nama tier tidak berubah. Tier 2 selalu "Siap Dasar 72 jam (standar BNPB)".
- Angka disertai satuan dan sumber. Tanpa harga, tanpa nominal rupiah, tanpa merek.
- Rujukan lokal (BNPB, BMKG, PVMBG, Kemenkes) disebut lebih dulu. Frasa yang dipakai: "BNPB dan panduan resmi berbagai negara", tanpa klaim jumlah negara (D-041).
- Konten medis dan kimia selalu memuat "ikuti label dan tenaga kesehatan".

### 5.4 Aksesibilitas (ringkasan lintas layar)
- Kontras AA (lihat `design-tokens.md`), target sentuh ≥44 px, jarak ≥8 px, input ≥16 px.
- Urutan fokus mengikuti urutan visual. Fokus terlihat (cincin 3 px). Link "Lewati ke isi utama" (`nav.skip_to_content`).
- Landmark: `<header>`, `<nav aria-label="Navigasi utama">`, `<main>`, `<footer>`.
- Semua status dikomunikasikan lewat teks + ikon + warna. Ikon dekoratif `aria-hidden`.
- Hormati `prefers-reduced-motion` dan `prefers-color-scheme`.
- Zoom 200% tanpa kehilangan fungsi, tanpa scroll horizontal pada 360 px.
- `lang` mengikuti bahasa aktif.
- Bisa dipakai satu tangan: aksi utama di bawah, tidak ada elemen kritis hanya di kiri-atas.

### 5.5 Alur kondisi khusus
- **Tidak ada bayi / lansia / hewan:** bagian terkait disembunyikan, item bersangkutan dikeluarkan dari penyebut dan dari daftar kekurangan, dengan catatan "tidak berlaku".
- **Alat medis listrik aktif:** Daya listrik masuk hitung hari bertahan (E5) dan muncul di bottleneck sebagai "Listrik untuk alat medis".
- **Skenario konflik / nuklir:** lencana "Rujukan internasional" di semua tempat konten itu muncul.
- **Offline:** tidak ada pesan error jaringan di alur inti. Hanya tautan eksternal yang diberi catatan.
- **Ganti bahasa di tengah alur:** semua teks berubah seketika, isian dan posisi gulir dipertahankan.

## 6. Pemetaan fitur → layar

| Fitur | Layar |
|---|---|
| A3, A5, H1–H3 | Beranda; Pengaturan |
| A6, A7, I1, I3 | Pengaturan |
| B1–B8 | Profil |
| C1–C3 | Target & skenario |
| D1–D4, D7, D8, H1 | Inventaris |
| D5 | Inventaris → Tas siaga |
| D6 | Evaluasi keluarga |
| E1–E7 | Daya listrik (kategori di Inventaris) |
| F1–F6, F10 | Hasil |
| F7, F8, F9 | Hasil (baris kekurangan) dan Daftar belanja |
| G1–G6 | Info offline; Sumber |
| I2, I4, I5 | Berlaku di semua layar |
