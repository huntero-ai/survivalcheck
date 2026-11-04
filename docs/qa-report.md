# Laporan QA Independen (Q1) - SurvivalCheck v1.0.0

Tanggal uji: 2026-11-04 · Penguji: Q1 · Basis: commit `43de057` (kode aplikasi tidak diubah oleh Q1) · Peramban: Chromium (Playwright), Node 22.
Skrip uji ada di `tests/qa/` (lihat bagian 6). Screenshot ada di `/tmp/qa-shots/` (tidak masuk repo).

## 1. Ringkasan

| Bagian | Hasil | Catatan |
|---|---|---|
| 1. Offline | LULUS | 29 rute (semua kategori, info/*, pengaturan) tampil offline setelah reload; SW aktif, scope benar; data tersimpan; manifest sah; 4 ikon ada (192/512/maskable/svg). Semua aset src/styles/data/i18n ter-precache. |
| 2. Layar & aksesibilitas | LULUS DENGAN CATATAN | 360x640 dan 412x915 tanpa scroll horizontal. 320x568: `#/belanja` meluap (B-03). Kontras AA lulus semua pasangan token (light+dark). Fokus terlihat di 10 rute. Label form lengkap, 1 h1 per halaman, `html lang` benar (id/en), nav ber-ARIA, progressbar ber-ARIA. Target sentuh: tautan merek header 26 px dan "Lihat selengkapnya" 20 px (B-04). |
| 3. Kasus ekstrem | LULUS | 0 orang, bayi saja, 20 orang, 90 hari, 11 skenario, tanpa skenario, input negatif/teks/1e9, storage korup (9 bentuk), localStorage diblokir (3 cara), impor rusak, XSS, prototype pollution, roundtrip: tanpa crash, tanpa error konsol, tanpa "NaN/undefined". Catatan kecil B-09..B-11. |
| 4. Kebenaran hitung | LULUS | 85 pemeriksaan tangan vs mesin: 0 selisih. Tier 4 dan 5 (belum dicakup S2) benar. Skor tidak menaikkan tier. Tas tepat 80% = PERLU DILENGKAPI. Band indikator 12/13/24/25 benar. UI `#/hasil` sama dengan mesin. |
| 5. Isi vs sumber | LULUS DENGAN CATATAN | 26 angka dicek: semua cocok dengan `research/`. Tidak ada harga, "53 negara", atau merek produk. Satu pengecualian: nama toko/marketplace (B-08). KI tidak di daftar belanja. 6 item CUPLIKAN: penanda kurang (B-01). |
| 6. Keselamatan/copy | LULUS | 12 pemeriksaan copy lulus (disclaimer, CO genset, tsunami, konflik/nuklir berlabel internasional, 112, pemutih, KI). Nada tenang. Catatan copy B-05, B-13, B-16. |
| 7. GitHub Pages | LULUS | YAML valid; langkah "Siapkan _site" dijalankan persis; `_site` 30 file, 704 KB; `.nojekyll` ada dan ter-track; layanan di `/survivalcheck/` + uji offline/SW lulus; 0 request ke host luar; tanpa 4xx. |
| 8. Performa | LULUS | 614 KB mentah / 173 KB gzip (29 file); 18 request kunjungan pertama; siap ~245 ms; ulang ~180 ms; CPU 4x lebih lambat ~460 ms; `evaluate()` 2,6 ms (20 orang, 90 hari, 3 skenario). |

**Jumlah temuan: P0 = 0, P1 = 3, P2 = 15.**

## 2. Tabel bug

| ID | Sev | Langkah reproduksi | Ekspektasi vs aktual | Dugaan file/baris |
|---|---|---|---|---|
| B-01 | **P1** | Isi profil dengan anjing+kucing; buka `#/hasil`, `#/belanja`, dan `#/inventaris/water`, `sanitation`, `tools`, `communication`, `plan_knowledge` | Item `evidence: CUPLIKAN` (water_pet_dog, water_pet_cat, soap, map_paper_local, tarpaulin_rope, fridge_food_safety_knowledge) harus bertanda "dari kutipan, perlu dicek ulang" di tiap tempat angkanya tampil. Aktual: di `#/hasil` dan `#/belanja` tampil sebagai angka pasti ("Air minum untuk anjing 56 L", "Sabun 700 g") tanpa penanda. Di inventaris penanda hanya ada di dalam `<details>` tertutup ("Mengapa dan sumber"). | `src/results.js`, `src/shopping.js` (tidak membaca `evidence`); `src/forms.js:206` (`sourceLine`) |
| B-02 | **P1** | 2 dewasa, target 14 hari, semua syarat tier 4 terpenuhi kecuali `gas_canister` = 23 | Tier 4/5 mestinya terjangkau rumah tangga umum. Aktual: gating `gas_canister` = 0,8571 tabung/orang/hari, yaitu 12 tabung/orang (tier 4) dan 26 tabung/orang (tier 5); 4 orang tier 5 = 103 tabung. Pengguna LPG 3 kg (umum di Indonesia) tidak bisa memenuhi syarat (LPG hanya `lpg_usage`, non-gating). Dihitung sesuai spek, jadi ini masalah desain/data, bukan bug mesin. | `data/items.json` `gas_canister` (gating tier 4), `docs/scoring.md` 3.8. Saran: terima LPG sebagai alternatif (grup gating seperti `alt_power_any`) atau jadikan non-gating |
| B-03 | **P1** | Lebar 320 px, state dengan bayi+hewan, buka `#/belanja` | Tanpa scroll horizontal (WCAG 1.4.10). Aktual: `scrollWidth` 325 > 320; `SPAN.sc-itemqty` ("isi pemakaian harian dulu" pada susu formula/MPASI) menembus tepi kanan dan terpotong. | `styles/results.css` (`.sc-itemqty`, baris item belanja): tambah `min-width:0; overflow-wrap:anywhere` atau susun vertikal |
| B-04 | P2 | Semua halaman, ukur tautan merek di header | Target sentuh >= 44 px. Aktual: `a.brand` 26 px tinggi; di 320 px teks terpotong "Surviva...". Beranda: tautan "Lihat selengkapnya" 20 px. | `styles/main.css` `.app-header .brand` (beri `min-height:44px; display:inline-flex; align-items:center`); `src/app.js` ~baris 351 |
| B-05 | P2 | `#/inventaris/water`, buka "Mengapa dan sumber" air anjing/kucing | Salinan pengguna tidak boleh memuat catatan internal. Aktual: "(Kanada, cuplikan; perlu verifikasi QA)". Jargon "cuplikan" juga ada di soap dll. | `data/items.json` `why` water_pet_dog/water_pet_cat (data dikunci; catat ke PM) |
| B-06 | P2 | `#/inventaris/plan_knowledge` dan `#/belanja` dengan skenario listrik padam | Satuan "-" tidak boleh tampil; item pengetahuan bukan barang belanja. Aktual: "Kebutuhan: 1 -", "1 -"; "Tahu batas aman makanan di kulkas..." muncul di daftar belanja. | `src/forms.js`, `src/shopping.js` (format unit `-`; saring item boolean berunit `-`) |
| B-07 | P2 | Buka `#/hasil` | Fokus programatik pada h1 tidak menampilkan kotak. Aktual: kotak fokus biru di sekitar h1 (light+dark); aturan `.app-main > h1:focus{outline:none}` tidak mengena karena h1 ada di dalam `.sc-page`. Juga `<title>` beranda "SurvivalCheck · SurvivalCheck". | `styles/main.css` (selector), `src/app.js` ~baris 285 |
| B-08 | P2 | `#/hasil` atau `#/belanja` | Kebijakan "tanpa merek". Aktual: "Contoh umum: Indomaret, Alfamart, Tokopedia, Shopee" (ritel/marketplace komersial, bukan merek produk, tetapi bisa terbaca sebagai rekomendasi). Putusan PM. | `i18n/id.json`, `i18n/en.json` (teks contoh toko) |
| B-09 | P2 | Impor `{"app":"survivalcheck","schema":1,"state":[1]}` | Ditolak sebagai format salah. Aktual: lolos validasi, dialog konfirmasi muncul, data diganti state default. | `src/storage.js` `parseImport` (tolak `Array.isArray(state)`) |
| B-10 | P2 | Suntik stok air 1e9 (atau isi 10.000.000 L lewat UI) | Tampilan masuk akal. Aktual: "Saat ini bisa bertahan ± 166666666 hari". | `src/results.js` (batasi tampil, mis. "lebih dari 365 hari") |
| B-11 | P2 | Ketik "99999999" pada kolom air kebersihan | Nilai tak sah tidak disimpan. Aktual: pesan galat tampil, tetapi prefiks valid terakhir (9999999) tersimpan di state. | `src/forms.js` ~baris 120-130 |
| B-12 | P2 | Baca `src/results.js` | Hasil tidak boleh memakai data uji. Aktual: bila `engine.js` gagal diimpor, `results.js` memuat `tests/cases.json` dan menampilkan hasil fixture. Di `_site` berkas itu tidak ada (hasil kosong, aman), tetapi kode mati berisiko. | `src/results.js:86-100` |
| B-13 | P2 | `#/info/air` | Yodium tingtur (EPA/CDC): 5 tetes/L, 10 tetes bila keruh, diamkan >= 30 menit, hindari bila alergi yodium; app hanya menyebut 5 tetes/L dan hamil/tiroid. Kotak pemutih tidak menyebut "cek kadar di label" di dalamnya (hanya di aturan umum di atas daftar). | `i18n/id.json`, `en.json` `info.water.iodine_body`, `bleach_body` |
| B-14 | P2 | Pilih skenario Kekeringan | Air minum naik ke 4 L memakai angka Latvia "4 L saat panas" ([DIBACA], r2). Sumber untuk panas, bukan kekeringan; D-006 sudah mengakui. Beri catatan di UI bahwa ini angka hati-hati. | `data/rules.json` `scenario_rules.drought`; `data/items.json` `water_drinking.modifiers` |
| B-15 | P2 | Lihat `manifest.webmanifest`, `index.html` | `orientation: portrait` mengunci landscape (WCAG 1.3.4); tidak ada CSP `<meta>` sebagai pertahanan berlapis (app tidak memakai `innerHTML` untuk data, risiko rendah). | `manifest.webmanifest:10`, `index.html` |
| B-16 | P2 | State dengan air 40 L + senter, pangan 0 | Tier 0 menampilkan "Belum mulai, dan itu tidak apa-apa", padahal pengguna sudah mengisi sebagian. Nada baik, kata "Belum mulai" kurang tepat. | `i18n/id.json` teks tier 0 |
| B-17 | P2 | `.github/workflows/pages.yml` | `concurrency.cancel-in-progress: true` pada grup deploy Pages dapat membatalkan deploy yang berjalan; GitHub menyarankan `false`. | `.github/workflows/pages.yml` |
| B-18 | P2 | Cek unit `meds_personal`, `medical_device_backup_power` | Sudah diketahui E2: unit di `items.json` ("hari stok", "Wh") ditimpa "hari" di engine (`UNIT_OVERRIDE`). Selaraskan data kelak. | `data/items.json`, `src/engine.js` |

Keamanan input: tidak ada temuan XSS. Seluruh render memakai `textContent`/`createTextNode`; satu-satunya `innerHTML` adalah ikon SVG konstan (`src/app.js:51`). Payload `<img onerror>`, `<script>`, `"><svg onload>` di nama perangkat custom, label obat, kartu keluarga, kunci inventaris, tema, skenario: tidak dieksekusi dan tidak menjadi elemen (`t3b`). Tidak ada prototype pollution lewat impor `__proto__`/`constructor`. Data korup menampilkan pesan "Data tersimpan tidak bisa dibaca" dengan tombol "Mulai baru". localStorage diblokir/penuh: aplikasi tetap render (memori).

## 3. Cek angka vs sumber (26 butir)

Sumber = berkas di `research/`. OK = angka di app sama dengan sumber.

| # | Klaim di app | Sumber riset | Evidence | Hasil |
|---|---|---|---|---|
| 1 | Air minum 3 L/orang/hari (`items.json` water_drinking) | SUMMARY: JP, SE, DK, EE, PL, NL, UK; WHO 2,5-3; BNPB min 2 L | DIBACA | OK (BNPB 2 L tampil sebagai catatan) |
| 2 | Air kebersihan 2 L (`rules.json` water.hygiene) | SUMMARY baris 26: IFRC | DIBACA | OK |
| 3 | Kekeringan 4 L | r2 Latvia "4 L saat panas" | DIBACA (untuk panas) | Angka OK; ekstrapolasi ke kekeringan (B-14) |
| 4 | Toilet 5 kantong/orang/hari | r1: Tokyo 2025 "5 buah/orang/hari"; CAO pusat tanpa angka | DIBACA | OK |
| 5 | Tisu 1 rol/orang/minggu (0,1429) | SUMMARY baris 28 (Tokyo) | DIBACA | OK |
| 6 | Sabun 250 g/orang/bulan (8,33 g/hari) | SUMMARY baris 110 (Sphere) | CUPLIKAN | Angka OK; penanda kurang (B-01) |
| 7 | Gas kaleng 6/orang/minggu (0,8571/hari) | r1: MAFF "≈6 tabung/orang/minggu" | DIBACA | OK; dampak gating (B-02) |
| 8 | kkal balita 1.430 | FNNE: 1 th 1.220, 2 th 1.380, 3 th 1.500, 4 th 1.620; rerata 1.430 | DIBACA (hitungan PM) | OK |
| 9 | kkal anak 5-12 = 2.000 | FNNE 5-9 1.860, 10-14 2.210; rerata tertimbang 5-12 = 1.991, dibulatkan | DIBACA (hitungan PM) | OK, pembulatan (D-008) |
| 10 | Dewasa 2.230, lansia 1.890; hamil +285, menyusui +500 | SUMMARY baris 27/96 (FNNE) | DIBACA | OK |
| 11 | Rebus 1 menit; 3 menit > 1.000 m | SUMMARY 132; r4: EPA 1.000 m, CDC 1.981 m | DIBACA | OK (ambang paling aman) |
| 12 | Pemutih 5-9%: 2 tetes/L, 4 bila keruh, 30 menit | r4 baris 80 (CDC/EPA); IFRC 1 tetes ditolak | DIBACA | OK; copy kurang tegas "cek label" (B-13) |
| 13 | Yodium 2%: 5 tetes/L; 7%: 2 tetes/L | SUMMARY 134; r4 110/270 | DIBACA | Angka OK; "10 tetes bila keruh" dan "tunggu 30 menit" tidak ada (B-13) |
| 14 | Tawas 1/2 sdt per 20 L; PAC 1 sachet per 20 L | r5 baris 81 (Kemenkes 2014) | DIBACA | OK |
| 15 | Air anjing 4 L, kucing 1 L, min 5 hari | r4 baris 135 (Kanada); SUMMARY 124 | CUPLIKAN | Angka OK; penanda kurang, teks internal bocor (B-01, B-05) |
| 16 | Obat >= 7 hari; >= 14 mulai tier 4; 30 hari pandemi | r2 baris 49; r4 118; SUMMARY 29 | DIBACA | OK |
| 17 | Nomor 110, 113, 115, 118/119, 119 SPGDT, 117, 123, 196 | r5 bagian 4 (BNPB 2020, Kemenkes, BMKG) | DIBACA | OK. 117 di r5b disebut "sekunder (media)"; app memuat catatan "sebagian dari 2019-2020, simpan juga nomor BPBD" |
| 18 | 112 "tergantung daerah" | r5: Permenkominfo 10/2016, diselenggarakan pemda | DIBACA | OK |
| 19 | Genset > 6 m (20 kaki) dari jendela/pintu; jangan di dalam | r6 baris 8 (CDC) | DIBACA | OK |
| 20 | Watt LED 9, router 7,6, radio 14, laptop 17,6; HP 10,6 Wh; inverter 0,9 | r6 baris 6 (BBK PiB-19) | DIBACA | OK |
| 21 | Kulkas 100 W x 24 j x 0,225 = 0,54 kWh/hari | r6: BBK 0,34-0,77 kWh/hari | DIBACA | OK (dalam rentang) |
| 22 | CPAP 60 W, konsentrator O2 500 W, nebulizer 60 W, kipas 40 W, pompa 250 W, TV 100 W, penanak 600 W | `power.json` evidence "ASUMSI" / "sumber komersial" | ASUMSI | Tanpa sumber resmi; UI memberi catatan "perkiraan, cek label" (OK). Sebaiknya label ASUMSI juga di baris perangkat medis |
| 23 | kkal TKPI: beras 359, biskuit 458, abon 404, kacang 564 | r5b baris 44-51 | DIBACA | OK |
| 24 | Kulkas aman ~4 jam, freezer penuh ~48 jam | r4 baris 66; r6 baris 8-9 (CDC, FDA) | CUPLIKAN (item) | Angka OK; penanda tersembunyi (B-01) |
| 25 | Tas BNPB > 80% siap, 50-80% perlu dilengkapi, < 50% belum siap; indikator 0-12 / 13-24 / 25-36 | SUMMARY baris 15, 189-190 (BNPB 2026) | DIBACA | OK, diuji di bagian 4 |
| 26 | Tier 5 >= 30 hari | SUMMARY baris 63 (KR, SI), 193 | DIBACA (sebagian) | OK; dasar lebih tipis dari tier lain |

Pemeriksaan larangan (id+en, seluruh rute dengan 11 skenario): tanpa "Rp"/harga/USD, tanpa "53 negara", tanpa merek produk, tanpa saran obat keras/antibiotik ("jangan membeli obat keras tanpa resep" adalah larangan, bukan saran). Daftar belanja memuat "yodium" hanya sebagai bahan penjernih air (yodium tingtur); tidak ada kalium iodida. KI hanya di panduan nuklir dengan "hanya atas instruksi otoritas".

Penanda 6 item CUPLIKAN: "Dari kutipan, perlu dicek ulang" hanya di dalam "Mengapa dan sumber" pada halaman inventaris (tertutup default). Tidak ada di `#/hasil` dan `#/belanja` (B-01).

## 4. Pemeriksaan hitung (detail di `tests/qa/t4_calc.mjs`)

Semua angka dihitung tangan dari `rules.json`/`items.json`, lalu dibandingkan dengan `engine.evaluate`.

| Skenario | Hitung manual | Hasil app |
|---|---|---|
| 1 dewasa, target 3, air 9 L, beras 2 kg (7.180 vs 6.690 kkal), toilet 15, senter, baterai, tas utama, tas 21/25 = 84%, indikator 13 | air 9/3 = 3 hari; pangan 3,22; tas berlaku 25 (28 - {4,27,28}); tier 2 | cocok |
| Sama, tas 20/25 = 80% | PERLU DILENGKAPI (tepat 80), tier 1 | cocok |
| Indikator 12 / 13 / 24 / 25 | rawan / cukup / cukup / siap; tier 1 / 2 / 2 / 2 | cocok |
| Tas 14/28 = 50% (bayi+lansia) | PERLU DILENGKAPI | cocok |
| 2 dewasa, 7 hari, air 42, beras 9 kg, toilet 70, dokumen, tunai 7 | kkal 4.460; 32.310 kkal; tier 3. Tunai 6, atau tanpa radio: tier 2 | cocok |
| **Tier 4**: 2 dewasa, 14 hari, air 84, beras 18 kg, toilet 140, gas 24 (0,8571 x 2 x 14 = 23,998), kompor, penjernih, rencana keluarga, indikator 25 | tier 4, bertahan 14 hari | cocok. Variasi indikator 24 / tanpa kompor / gas 23 / tanpa rencana / tanpa penjernih: tier 3. Obat 14 hari: tier 4; 13: tier 3; 7: tier 3; 6: tier 1 |
| **Tier 5**: 1 dewasa, 30 hari, air 90, beras 19 kg, gas 26, panel surya, P3K | tier 5. Tanpa daya alternatif / tanpa P3K / obat 29 hari: tier 4. Genset menggantikan surya: tier 5 | cocok |
| Skor tinggi (tas 25/25, indikator 36, tanpa tas utama) | skor 90, tier <= 1 (skor tidak menaikkan tier) | cocok |
| Skor: 1 dewasa, target 3, air 6 L saja | kritis (6 item): 55 x (0,6667/6) = 6,11; bobot 90; total 6,11 x 100/90 = 6,79 -> 7 | 6,11; 6,79; 7 |
| Bayi+balita+anak+dewasa+lansia, hamil+menyusui, 5 hari | kkal 1.430+2.000+2.230+1.890+285+500 = 8.335; air 2 hari; makanan bayi min(25/5, 10/2) = 5; air kebersihan 50; toilet 125; tas 28 | cocok |
| Anjing x2, kucing x1, target 3 | air anjing 4x2x5 = 40; kucing 5; pakan 400x5 = 2.000 | cocok |
| Kekeringan; pandemi; konflik; pandemi+konflik | 56 L / 14 hari air; target 14 + obat 30; konflik 7 + tunai 7; max = 14 | cocok |
| Daya: CPAP 60 W x 8 j + station 1.000 Wh | 1.000 x 0,8 x 0,9 / 480 = 1,5 hari; power bank 2x20.000 mAh = 103,6 Wh -> 0,216; genset 1.000 W x 10 j x 0,5 = 5.000 Wh -> 10,42 | cocok |
| UI `#/hasil` | tier 4 / 3 / 1 sesuai syarat; tas "21 dari 25 (84%) SIAP"; band indikator 12/13/24/25 | cocok |

Catatan: bayi saja dengan ASI tidak punya kebutuhan pangan (kkal bayi 0, formula tidak berlaku); komponen pangan `null` dan hari bertahan hanya dari air. Sesuai D-010, bukan bug, tetapi perlu diketahui.

## 5. Rekomendasi rilis

**SIAP RILIS BERSYARAT.** Tidak ada P0. Tidak ada XSS, kehilangan data, crash, atau request luar. Hitungan benar. Offline dan sub-path GitHub Pages berfungsi.

Syarat sebelum rilis publik (P1):
1. B-01: tampilkan penanda "dari kutipan, perlu dicek ulang" untuk item CUPLIKAN di Hasil dan Belanja (dan jangan sembunyikan di inventaris).
2. B-03: perbaiki luapan `#/belanja` pada 320 px.
3. B-02: putusan PM soal gating `gas_canister` (terima LPG atau non-gating), agar tier 4/5 bisa dicapai.

Sebaiknya sebelum rilis (P2 murah): B-04, B-05, B-06, B-07, B-09, B-13. Sisanya bisa menyusul.

Setelah perbaikan: naikkan `CACHE` di `sw.js` (`survivalcheck-v3`), ulangi semua skrip `tests/qa/`.

## 6. Cara menjalankan skrip uji

Dari akar repo (butuh `playwright` terpasang):
```
node tests/qa/t1_offline_pages.mjs repo                      # offline, manifest, 0 host luar (akar repo)
node tests/qa/t1_offline_pages.mjs site /tmp/qa-site/_site   # sama, di /survivalcheck/ (simulasi _site di bawah)
node tests/qa/t2_layout.mjs         # 3 viewport x light/dark x 29 rute (menulis /tmp/qa-shots/layout.json)
python3 tests/qa/t2b_contrast.py    # kontras dari token CSS
node tests/qa/t2c_keyboard.mjs      # fokus terlihat, urutan tab
node tests/qa/t2d_en_320.mjs        # English di 320/360
node tests/qa/t3_edge.mjs           # kasus ekstrem, storage diblokir/korup
node tests/qa/t3b_corrupt_xss_roundtrip.mjs
node tests/qa/t3c_inputs_ui.mjs ; node tests/qa/t3d_inv_input.mjs
node tests/qa/t4_calc.mjs ; node tests/qa/t4b_calc_ui.mjs ; node tests/qa/t4c_power.mjs
node tests/qa/t5_content.mjs        # teks semua rute id+en; sebagian butuh tinjauan manual
node tests/qa/t8_perf.mjs
```
Simulasi `_site`: salin berkas ter-track ke folder baru, jalankan isi langkah "Siapkan _site" dari `pages.yml` (diekstrak lewat `yaml.safe_load`), serve `_site` di prefix `/survivalcheck/` (`tests/qa/lib.mjs` `serve(root, prefix)`).

Catatan metode: `t5_content.mjs` memakai regex kasar (mis. "USD" cocok dengan "Pusdalops", "yodium" cocok di daftar belanja); hasil FAIL skrip itu sudah ditinjau manual dan dinilai bukan pelanggaran, kecuali B-08. Skrip menulis keluaran ke `/tmp/qa-shots/`, bukan ke repo. Skrip `t3c_inputs_ui.mjs` memakai pemilih label "Dimiliki (L)" pertama yang ternyata air kebersihan; `t3d_inv_input.mjs` adalah versi yang dipakai untuk bukti B-11.

## 7. Status perbaikan (Fixer, 2026-11-04)

Semua P1 dan P2 diperbaiki; tidak ada yang ditolak. Tes pelindung: `tests/fixes.test.mjs` (node:test), `tests/e2e-fixes.mjs` (Playwright 320/360 px), `tests/engine.test.mjs` + `tests/cases.json` (tc06, tc10 dihitung ulang). Detail perubahan data di `docs/build-notes.md` bagian Fix.

| ID | Status | Perbaikan dan alasan |
|---|---|---|
| B-01 | fixed | Penanda "Dari kutipan sumber, perlu dicek ulang" (`data-evidence="excerpt"`, i18n `common.excerpt_badge`) terlihat di Hasil (baris kekurangan), Belanja (layar + teks salin) dan Inventaris (di baris item, di luar `<details>`). |
| B-02 | fixed | D-047: gating tier 4/5 memakai grup `cooking_fuel_any` (gas kaleng / LPG 3 kg / kompor alternatif) dalam hari (14/30), bukan 0,8571 tabung/orang/hari. Saran MAFF ~6 kaleng/orang/minggu hanya hint di form. `items.json`, `rules.json`, `engine.js`, `forms.js`, `scoring.md`, `cases.json` diselaraskan. |
| B-03 | fixed | `.sc-itemname/.sc-itemqty` boleh menyusut dan membungkus teks; diuji 30 rute di 320 px (id+en) tanpa scroll horizontal. |
| B-04 | fixed | Tautan merek `min-height` 44 px, header dirapatkan di <=360 px (nama tidak terpotong di 320); "Lihat selengkapnya" 44 px (`.link-touch`). |
| B-05 | fixed | `why` air anjing/kucing dan item CUPLIKAN lain ditulis ulang tanpa catatan internal; tes menyapu semua `why` (id+en). |
| B-06 | fixed | Satuan "-" tidak tampil di inventaris; item pengetahuan/rencana (unit "-") disaring dari daftar belanja (tetap di hasil/inventaris). |
| B-07 | fixed | Aturan outline h1 kini mengena (`.app-main h1[tabindex="-1"]`); judul beranda tidak lagi ganda; fokus h1 Belanja dipertahankan setelah render asinkron. |
| B-08 | fixed | Nama toko tetap sebagai contoh jaringan umum; label "Contoh umum (hanya contoh, bukan rekomendasi)" dan catatan bawah diperkuat. |
| B-09 | fixed | `parseImport` menolak `state` berupa array. |
| B-10 | fixed | Hasil menampilkan "> 365 hari" (i18n id/en). |
| B-11 | fixed | Input tak sah mengosongkan nilai tersimpan (prefiks valid tidak tersisa). |
| B-12 | fixed | Fallback fixture dihapus dari `results.js`; `fixtureResult` pindah ke `tests/fixture.mjs` (hanya tes). |
| B-13 | fixed | Yodium: 5 tetes/L, 10 bila keruh, diamkan >= 30 menit, jangan bila alergi yodium; kotak pemutih memuat "Cek kadar di label" (id+en). |
| B-14 | fixed | Catatan "Angka hati-hati" pada air 4 L di halaman Target dan Inventaris air saat kekeringan. Angka tidak diubah (D-006). |
| B-15 | fixed | `orientation` dihapus dari manifest; CSP `<meta>` (`script-src 'self'`, gaya inline diizinkan untuk atribut `style` dari DOM, `worker-src/connect-src 'self'`); SW, offline, dan semua rute diuji tanpa pelanggaran. `frame-ancestors` tidak bisa lewat meta (tidak dipasang). |
| B-16 | fixed | "Belum mulai" diganti "Baru di awal" (id) / "just at the start" (en). |
| B-17 | fixed | `cancel-in-progress: false`. |
| B-18 | fixed | Unit di `items.json` "hari"; `UNIT_OVERRIDE` dihapus. |

SW: `survivalcheck-v3` (juga di `tests/e2e-shell.mjs`).
