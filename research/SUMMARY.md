# SurvivalCheck: Rangkuman Riset Fase 1 dan Gate Review PM

- Disusun oleh: agent PM · Tanggal: 2026-11-03
- Input: `research/r0`–`r5` (.md + .json). Semua sumber diakses 2026-11-03.
- Penanda bukti: **[DIBACA]** = dokumen resmi diunduh dan dibaca utuh. **[CUPLIKAN]** = hanya dari cuplikan hasil pencarian. Default app diusulkan berbasis [DIBACA].
- File pendamping: `docs/decisions.md` (log keputusan), `docs/phase2-brief.md` (brief S1/S2/S3/D1).

---

## Ringkasan eksekutif

**Status gate Fase 1: LOLOS DENGAN CATATAN.** Keenam agent riset (R0–R5) menyerahkan output dengan format §4.1. Untuk 29 negara/lembaga, record berisi target durasi, air/orang/hari (atau "tidak disebutkan"), daftar item, kebutuhan khusus, dan URL. Tidak ada celah yang menahan Fase 2. Angka yang masih [CUPLIKAN] wajib diberi tanda di `items.json`.

**Temuan utama:**
1. **BNPB 2026 [DIBACA] jadi rujukan lokal.** Isinya: tas siaga 72 jam, air minum **min. 2 L/orang/hari**, cek tiap 6 bulan, tas bisa diambil dalam 10 detik. BNPB juga punya **dua alat ukur yang siap dipakai app**. Pertama, skor checklist tas: >80% SIAP, 50–80% PERLU DILENGKAPI, <50% BELUM SIAP. Kedua, **evaluasi keluarga 18 indikator**: 0–12 Rawan, 13–24 Cukup Siaga, 25–36 Siap. PM sudah menyalin daftar 18 indikator dari PDF asli (§4.3).
2. **Konsensus internasional lebih tinggi dari BNPB.** Air **3 L/orang/hari** untuk minum + masak dipakai JP, TW, NZ, SE, DK, EE, PL, NL, CH, dan UK, dan sama dengan batas atas "survival" Sphere/WHO. Target ideal **7 hari** dipakai JP, SE, NO, EE, TW, dan CH. Jerman menganjurkan 10 hari, AS 14 hari di rumah.
3. **Kalori.** Tidak ada negara yang memberi kkal untuk rumah tangga. Yang tersedia adalah standar WFP/WHO **2.100 kkal** (rata-rata populasi) dan tabel per usia FNNE [DIBACA].
4. **Toilet darurat.** Hanya Jepang yang memberi angka, yaitu **5 kali/orang/hari** (Tokyo + pedoman CAO [DIBACA]).
5. **Klaim "53 negara" tidak terverifikasi.** Asalnya unggahan viral di X (2 Nov 2026) yang diberi Community Note. Yang bisa dikonfirmasi dari situs resmi: **25 negara + UE**.

**Usulan default terpenting:**

| Parameter | Usulan default | Dasar |
|---|---|---|
| Air minum + masak (gating) | **3 L/orang/hari**, semua usia | Konsensus [DIBACA]; BNPB 2 L terlalu rendah |
| Air kebersihan (saran) | **+2 L/orang/hari**, non-gating | IFRC [DIBACA]; menunggu user |
| Kalori | FNNE per usia: dewasa 2.230, lansia 1.890, anak 5–12 ±2.000, balita ±1.430; hamil +285, menyusui +500 | WFP/WHO [DIBACA] |
| Toilet darurat | **5 kantong/orang/hari**; tisu 1 rol/orang/minggu | Tokyo/CAO [DIBACA] |
| Obat rutin | **≥7 hari** semua tier; ≥14 hari mulai tier 4; 30 hari untuk pandemi | NO, JP, AU, CDC, SE [DIBACA] |
| Pemutih 5–9% | **2 tetes/L**, 4 bila keruh, tunggu 30 menit | CDC/EPA [DIBACA] |
| Tier | 3/7/14/30 hari tetap; tier 2 = "Standar BNPB 72 jam" | BNPB + JP/Nordik |
| Tunai | "hari belanja" tanpa nominal: 3 hari (tier 2), 7 hari (tier ≥3) | BNPB 2019/20, EE, LV, CH [DIBACA] |

Ada 7 pertanyaan untuk user di §6.

---

## 1. Review acceptance criteria Fase 1

| Agent | Cakupan | Hasil | Catatan |
|---|---|---|---|
| R0 | "53 negara" | **Lolos** | Asal klaim ditemukan (X @WhaleNewsDaily, Community Note). 26 entri terverifikasi (25 negara + UE), 18 belum. Status Indonesia di R0 masih `verified:false`; sudah diselesaikan R5. |
| R1 | JP, KR, TW, SG, PH, AU, NZ | **Lolos, ada catatan** | Field lengkap. Air "tidak disebutkan" untuk KR, SG, PH, dan itu sah. PH, NZ, dan AU federal sebagian besar [CUPLIKAN] (403). JSON memakai `null`, bukan teks "tidak disebutkan"; ini masalah format kecil. |
| R2 | SE, NO, FI, DK, EE, LV, LT, PL | **Lolos, ada catatan** | 7 dari 8 negara [DIBACA]. **Lituania seluruhnya [CUPLIKAN]** dan angka airnya tidak konsisten. Lituania tidak boleh jadi satu-satunya sumber untuk item apa pun. |
| R3 | UK, DE, NL, CH, FR, BE, UE | **Lolos** | Hampir semua [DIBACA]. UE memang belum punya angka (pedoman 72 jam belum terbit). FR dibaca dari salinan resmi info.gouv.fr. |
| R4 | US, CA, Sphere, WHO, WFP, IFRC | **Lolos, ada catatan** | CDC, EPA, WHO, FNNE, IFRC [DIBACA]. FEMA, Kanada, Sphere WASH, Red Cross [CUPLIKAN]. Ada 54 `technical_constants`. |
| R5 ★ | Indonesia | **Lolos** | BNPB 2026 dan 2019/2020 [DIBACA]. Memuat 38 provinsi (IRBI 2024) dan nomor darurat. Celahnya: kkal, P3K Kemenkes, BAPETEN 403, konflik, pengali panas. 18 indikator BNPB belum ada di JSON (kini di §4.3). Kontak 34 BPBD belum di JSON. |

**Cek 1 URL oleh PM.** PDF BNPB 2026 tersimpan di path `.../uploaded_files/temporary/...`. Pada 2026-11-03 URL ini membalas HTTP 200, application/pdf, 11,98 MB. Path "temporary" berisiko mati, jadi sitasi harus memuat judul lengkap, penerbit, dan tahun.

---

## 2. Tabel konsolidasi

### 2.1 Target durasi
| Durasi | Negara/lembaga | Bukti |
|---|---|---|
| **3 hari** (min = anjuran) | **Indonesia (BNPB 2026, 2019/2020)**, UK, FI, DK, PL, NL, BE, FR, LU, CZ, PH, AU (QLD), CA, UE | [DIBACA]; CA/PH [CUPLIKAN] |
| Min 3, **anjuran 7** | JP (防災庁 2026-11-02), NZ, LV, CH (pangan 7, air 3), IFRC | [DIBACA]; NZ [CUPLIKAN] |
| **7 hari** min | SE (MCF), NO (DSB; naik dari 3 hari), EE, TW | [DIBACA] |
| **10 hari** | DE (BBK 2025; "zumindest 3") | [DIBACA] |
| **14 hari** | AS di rumah (CDC), SG (pangan), JP bila hazard tinggi, AT/Tirol, KR nuklir | [DIBACA]; Red Cross [CUPLIKAN] |
| **30 hari** | KR (stok darurat), SI (tabel pangan) | [DIBACA] |

Semua sumber resmi Indonesia hanya menyebut 3 hari. Tidak ada anjuran stok rumah lebih dari 3 hari.

### 2.2 Air
| Sumber | Minum | Masak | Kebersihan | Total | Bukti |
|---|---|---|---|---|---|
| **BNPB 2026** | **min 2 L** | — | — | 2 L | [DIBACA] |
| BNPB 2019/20 | "cukup ±3 hari", tanpa liter | | | | [DIBACA] |
| **Kemenkes 2014** (pengungsian) | | | | **5 L hari ke-1; 20 L mulai hari ke-2** (masak, makan, minum) | [DIBACA] |
| JP | 3 L, termasuk masak | | flush di luar angka | 3 | [DIBACA] |
| TW, NZ, SE, DK, EE, PL | 3 L | | | 3 | [DIBACA] |
| NL | 2 | 1 | | 3 | [DIBACA] |
| CH | 9 L/3 hari (minum + masak) | | higiene & flush tidak termasuk | 3 | [DIBACA] |
| UK | 3 L minum saja | tambahan | tambahan | ≥3 | [DIBACA] |
| LV | ~3 (4 saat panas) | | **10–12** | 13–16 | [DIBACA] |
| NO | 20 L/minggu (≈2,9) | | | 2,9 | [DIBACA] |
| FI, FR | 2 | | | 2 | [DIBACA] |
| DE | 1,5 (lansia 2; anak ≤12 1) | 0,5 | | 2 | [DIBACA] |
| BE | 1,5–2 | | | 3–10; 4 saat air mati | [DIBACA] |
| CA | 2 | ±2 | | 4 (konflik antar-halaman) | [CUPLIKAN] |
| US | | | | 3,785 (minum + sanitasi); panas bisa ×2 | CDC [DIBACA], FEMA [CUPLIKAN] |
| IFRC | 2 | | 2 | 4 (25–30 L/minggu) | [DIBACA] |
| Sphere/WHO | **2,5–3** survival | 3–6 | 2–6 | 7,5–15 | WHO [DIBACA] |
| WHO | | | | min 7,5; ±20 untuk higiene dasar | [DIBACA] |

Air isi sendiri diganti tiap 6 bulan (CDC, NZ, IFRC). Untuk hamil, menyusui, dan iklim panas, sumber hanya bilang "lebih banyak" tanpa angka.

### 2.3 Pangan
| Sumber | Angka | Bukti |
|---|---|---|
| BNPB | Jenis saja (siap saji, biskuit energi, mi instan, abon, cokelat, MPASI). Tanpa kkal/kg. | [DIBACA] |
| WFP/WHO FNNE, Sphere | 2.100 kkal/orang/hari (rata-rata populasi, "not for an individual"); protein 53 g, lemak 40 g | [DIBACA] |
| FNNE Annex 1 | <1 th 820 · 1 th 1.220 · 2 th 1.380 · 3 th 1.500 · 4 th 1.620 · 5–9 1.860 · 10–14 2.210 · 15–19 2.420 · 20–59 2.230 · 60+ 1.890 · hamil +285 · menyusui +500 | [DIBACA] |
| Koreksi dingin | +100 kkal per 5 °C di bawah 20 °C | [DIBACA] |
| DE BLE (per orang/hari, 2.200 kkal) | serealia 0,33 kg; sayur 0,40; buah 0,25; susu 0,25; protein hewani 0,12; lemak 33 g | [DIBACA] |
| JP MAFF | Contoh belanja 2 dewasa/1 minggu; 1 porsi nasi ≈ 75 g | [DIBACA] |
| EE | 50% stok siap santap tanpa masak | [DIBACA] |
| Rotasi | rolling stock (JP), Notvorrat (CH), dicicil saat belanja (UK, BE) | [DIBACA] |

### 2.4 Sanitasi
| Item | Angka | Sumber | Bukti |
|---|---|---|---|
| Kantong toilet | **5/orang/hari**; min 3 hari, anjuran 7 hari | Tokyo 2025; CAO 2022 | [DIBACA] |
| | 1/orang/hari (packet latrine) | CDC arsip | [CUPLIKAN] |
| Tisu toilet | ≈1 rol/orang/minggu | Tokyo | [DIBACA] |
| DIY | Kantong sampah kuat dipasang di kloset; toilet kemping | BBK | [DIBACA] |
| Sabun | 250 g/orang/bulan | Sphere | [CUPLIKAN] |
| Mandi | sabun, sikat & odol, sisir; hand sanitizer | BNPB | [DIBACA] |

### 2.5 Obat
BNPB: "obat pribadi selalu ada di tas" (indikator 7), tanpa jumlah hari [DIBACA]. BE ≥3 hari · JP ±1 minggu · NO ≥7 hari · AU 1 minggu · CDC 7–10 hari, checklist hamil/anak dan pandemi 2 minggu · DE ≥10 hari · SE 1 bulan [semua DIBACA] · CA ±2 minggu [CUPLIKAN]. Daftar P3K Kemenkes tidak ditemukan. Pelengkap: BBK Hausapotheke [DIBACA].

### 2.6 Kelompok khusus
- **Bayi:** BNPB menyebut susu/MPASI dan perlengkapan bayi. CDC/UK: menyusui paling aman, formula siap minum (RTF) lebih baik dari bubuk, popok min 1 pak besar + 2 pak tisu basah, cek ulang tiap bulan. Tidak ada angka popok atau mL per hari [DIBACA].
- **Anak:** tas anak BNPB; buku/permainan (FR); benda penenang (BE) [DIBACA].
- **Lansia:** BNPB menyebut obat rutin, kacamata cadangan, popok dewasa, nomor keluarga, pendamping (indikator 13). BLE: lansia ≥65 minum 2 L [DIBACA].
- **Disabilitas:** bab khusus BNPB, booklet BMKG–JICA 2025, alat bantu + baterai di BBK [DIBACA], oksigen di FEMA [CUPLIKAN].
- **Hamil/menyusui:** +285/+500 kkal; air "lebih banyak"; prioritas evakuasi [DIBACA].

### 2.7 Hewan
BNPB 3–5 hari: carrier, tali, P3K, identitas, lokasi penitipan [DIBACA]. JP min 5, sebaiknya ≥7 [DIBACA]. AU 5 [DIBACA]. NO 1 minggu [CUPLIKAN]. CDC 14 hari [DIBACA]. Kanada: air anjing ±4 L, kucing ±1 L per hari [CUPLIKAN], satu-satunya angka air yang ada. Pakan g/hari tidak disebutkan di mana pun.

### 2.8 Tunai
BNPB 2026 "secukupnya"; BNPB 2019/20 "±3 hari" · NL €70/dewasa, €30/anak per 72 jam · SE ±SEK 1.000/dewasa · EE/LV 1 minggu · CH belanja 1 minggu + 1 tangki · BE ±72 jam · DK/NO/SE kartu fisik + PIN dan beberapa bank [semua DIBACA].

### 2.9 Penjernihan air
| Metode | Aturan | Bukti |
|---|---|---|
| Rebus | ≥1 menit didih bergolak. 3 menit di dataran tinggi: EPA >1.000 m, CDC >1.981 m, HC ≥2 menit >2.000 m [CUPLIKAN] | [DIBACA] |
| Pemutih 5–9% | 2 tetes (0,1 mL)/L; gandakan bila keruh/dingin; tunggu 30 menit (CDC, EPA). IFRC: 1 tetes/L | [DIBACA] |
| Yodium | 2%: 5 tetes/L (EPA). 7%: 2 tetes/L (Kemenkes). Hindari untuk hamil/tiroid. | [DIBACA] |
| Tablet | EPA: ikuti label. Kemenkes: aquatab 8,5 mg 1/20 L (diragukan) | [DIBACA] |
| Kaporit | Teks Kemenkes rancu, tidak dipakai. EPA: HTH sebagai larutan stok. | [DIBACA] |
| Pra-olah (Indonesia) | tawas ½ sdt/20 L; PAC 1 sachet/20 L; K-116 1 sdm/200 L (Kemenkes) | [DIBACA] |
| SODIS | 6 jam (IFRC) | [DIBACA] |
| Batas | Tidak menghilangkan logam berat, kimia, atau radiasi | [DIBACA] |

### 2.10 Kategori lain
Penerangan: senter + baterai; senter di kamar (indikator 5); "senter, bukan lilin" (BNPB 2026). Komunikasi: radio, power bank, peluit, nomor tercetak (indikator 18). Dokumen: fotokopi KTP/KK/sertifikat/buku tabungan dalam plastik tahan air (indikator 4). Alat: multitool, pembuka kaleng, lakban, tali, perkakas mematikan utilitas. Masak: gas kaleng ±6/orang/minggu (MAFF), KR butana ≥15. Kebakaran/CO: APAR, detektor CO, larangan grill/genset di dalam ruangan. Tas: 1 tas utama + 1 tas kecil, ambil dalam 10 detik, jangan terlalu berat (BNPB); TW ±15/10 kg. Cek tiap 6 bulan; simulasi 2× setahun (BNPB). [DIBACA]

### 2.11 Item per skenario
| Skenario | Indonesia [DIBACA kecuali ditandai] | Pelengkap | Item PLAN tanpa sumber |
|---|---|---|---|
| Gempa | Drop–Cover–Hold On; perabot diikat/dipaku; alas kaki + senter dekat tempat tidur; helm **atau bantal**; APAR; peluit; titik kumpul utama + cadangan; evakuasi horizontal bila likuefaksi | JP pengikat furnitur; DE helm | linggis |
| Tsunami | Gempa kuat/lama = evakuasi mandiri; jalan kaki; tsunami bisa sampai 5 kali; AWAS/SIAGA = evakuasi; "20-20-20" (Baubau), **tidak berlaku di Maluku** [CUPLIKAN] | NZ "Long or Strong" [CUPLIKAN] | — |
| Banjir/longsor | Mandiri ≥3 hari; dokumen kedap air; isi wadah air; matikan listrik/LPG; mengungsi sebelum air selutut; tongkat; sepatu (leptospirosis); tawas/PAC/rebus; pasca-banjir: sarung tangan, boots, disinfektan | DE/FR jangan ke basement | pelampung, dry bag |
| Erupsi | Masker + kacamata; tanpa lensa kontak; lengan panjang; bersihkan abu dari atap; radius Level I–IV/KRB; MAGMA; lahar | JP Fuji N95, goggle, ≥7 hari | penutup tandon/talang |
| Kabut asap | N95 dipakai rapat; tetap di dalam; AC/filtrasi; kelompok rentan; ke puskesmas; ISPU | — | air purifier; jumlah N95 |
| Kekeringan | Tandon air hujan; hemat air; bantuan pemda; kemarau 2026 3–7 bulan; tanpa pengali resmi | LV 4 L saat panas; FEMA ×2 [CUPLIKAN] | — |
| Cuaca ekstrem | Barang masuk; kunci jendela; matikan listrik; posisi saat petir; jauhi pohon/reklame | AU terpal + tali | pengaman atap |
| Listrik padam | Senter bukan lilin; radio; power bank; info resmi | SE/DE/CH tunai, kompor non-listrik; FEMA kulkas 4 jam/freezer 48 jam [CUPLIKAN]; DK larangan grill di dalam (CO) | lampu solar |
| Pandemi | Cuci tangan; masker; jarak 1 m; isolasi + telemedis; imunisasi | CDC stok 2 minggu; DE/CH FFP2 dan termometer | oksimeter |
| Konflik | Hindari demo, lapor polisi. **Tidak ada panduan stok.** | SE/NO/EE ≥7 hari; tunai 1 minggu; "dua dinding"; disinformasi | — |
| Nuklir | BAPETEN: sheltering, KI oleh otoritas [CUPLIKAN] | Shelter min 24 jam (CDC); lepas pakaian luar; matikan AC; plastik + lakban; KI hanya atas instruksi | — |

---

## 3. Konflik dan usulan default (detail di docs/decisions.md)
| # | Konflik | Usulan | Status |
|---|---|---|---|
| K-01 | Air BNPB/FR/FI/DE 2 L vs konsensus 3 L | 3 L, semua usia, gating; tampilkan juga "minimum BNPB 2 L" | usulan |
| K-02 | Air kebersihan: 0 / 2 (IFRC) / 10–12 (LV) / 20 (Kemenkes, WHO) | +2 L saran, non-gating; kebutuhan penuh lewat ember/tandon + penjernihan | menunggu user |
| K-03 | Panas: FEMA ×2 [CUPLIKAN] vs LV 4 L | Kekeringan → 4 L; tanpa pengali panas umum | usulan |
| K-04 | Durasi BNPB 3 vs 7 hari | Tier 3/7/14/30; tier 2 = standar BNPB; default form 7 hari | menunggu user |
| K-05 | 2.100 populasi vs individu | Kkal FNNE per kelompok usia | usulan |
| K-06 | Pemutih 2 vs 1 tetes | 2 tetes/L (4 bila keruh) + cek kadar di label | usulan |
| K-07 | Aquatab Kemenkes 1/20 L | Ikuti label; angka Kemenkes tidak ditampilkan | usulan |
| K-08 | Ambang rebus di ketinggian | 3 menit bila >1.000 m | usulan |
| K-09 | Toilet 5 vs 1 | 5/orang/hari; DIY dihitung setara | usulan |
| K-10 | Obat 3–30 hari | ≥max(target, 7); ≥14 hari mulai tier 4; 30 hari untuk pandemi | usulan |
| K-11 | Hewan 3–14 hari | Mengikuti target, min 5 hari; air 4/1 L ditandai "verifikasi" | usulan |
| K-12 | Tunai 3 hari vs 1 minggu | Hari belanja: 3 (tier 2), 7 (tier ≥3, konflik, listrik padam) | usulan |
| K-13 | KI | Tidak masuk daftar belanja; info "hanya atas instruksi otoritas" | usulan |
| K-14 | LT, CA, NL Q&A tidak konsisten | Tidak dipakai | final PM |
| K-15 | 20-20-20 | Copy utama BMKG "jangan menunggu sirene"; 20-20-20 hanya catatan + peringatan | usulan |
| K-16 | Lilin (2019) vs "senter, bukan lilin" (2026) | Lilin hanya cadangan + peringatan | usulan |

---

## 4. Pemetaan ke desain app

### 4.1 Tier
| Tier | Nama | Gating stok | Tambahan | Padanan BNPB |
|---|---|---|---|---|
| 0 | Belum Siap | air atau pangan <1 hari | — | tas <50% / Rawan |
| 1 | Rentan | 1–2 hari | — | 50–80% |
| 2 | Siap Dasar 72 jam (standar BNPB) | ≥3 hari untuk air, pangan, makanan bayi*, obat* (≥7), sanitasi, penerangan | tas >80%; 18 indikator ≥13 | SIAP + Cukup Siaga |
| 3 | Siap 1 Minggu | ≥7 | komunikasi, dokumen, tunai 7 hari | melampaui BNPB |
| 4 | Tangguh 2 Minggu | ≥14; obat ≥14 | kompor + bahan bakar, penjernih, indikator ≥25 | — |
| 5 | Mandiri ≥30 | ≥30 | daya alternatif, skill P3K | — |

\* bila relevan. Hari bertahan = MIN(air, kkal, obat, makanan bayi). Sanitasi dan penerangan hanya gating. Usulan skor 0–100: stok kritis 55%, tas BNPB 20%, 18 indikator 15%, skenario 10%. Keputusan akhir di S2.

### 4.2 Item gating
- Critical + gating mulai tier 2: air, pangan, obat rutin, makanan bayi, sanitasi, senter + baterai, tas siaga.
- Gating mulai tier 3: radio, power bank, dokumen kedap air, nomor tercetak, tunai.
- Gating mulai tier 4: kompor + bahan bakar, penjernih, rencana keluarga ≥25.
- Penting (tidak gating): P3K, masker, sarung tangan, peluit, pakaian, selimut, jas hujan, alas kaki, sanitizer, tisu, sabun, air kebersihan, hewan, kacamata cadangan, popok dewasa.
- Tiap item diberi `location`: bag/home/both.

### 4.3 Alat ukur BNPB 2026 (disalin dari PDF, 2026-11-03)
**Checklist Tas Siaga 72 Jam**, 28 item (Ada / Perlu tambah):
- A. Air minum (2 L/orang/hari), makanan siap saji, biskuit energi, susu/MPASI (jika ada balita), sendok & alat makan.
- B. Senter, baterai cadangan, power bank, radio portable, peluit, masker, sarung tangan.
- C. Obat pribadi, obat penurun panas, perban & antiseptik, plester luka, hand sanitizer.
- D. Fotokopi KTP, fotokopi KK, sertifikat/dokumen rumah, buku tabungan (salinan), nomor darurat tercetak.
- E. Pakaian ganti, selimut tipis, jas hujan, uang tunai, perlengkapan bayi, obat lansia.
- Skor: >80% SIAP · 50–80% PERLU DILENGKAPI · <50% BELUM SIAP. Tepat 80% masuk "perlu dilengkapi". Usulan PM: item bayi/lansia keluar dari penyebut bila tidak relevan.

**Evaluasi Keluarga**, 18 indikator. Nilai: 0 belum · 1 ada tapi belum lengkap · 2 lengkap dan pernah dilatih.
- Logistik: (1) punya tas siaga 72 jam, (2) diperiksa min 6 bulan sekali, (3) semua tahu lokasi tas, (4) dokumen dalam plastik tahan air, (5) senter di kamar tidur, (6) cadangan air bersih saat musim hujan, (7) obat pribadi selalu di tas.
- Prosedur: (8) jalur evakuasi disepakati, (9) titik kumpul di luar rumah, (10) semua tahu Drop–Cover–Hold On, (11) pernah simulasi gempa, (12) tahu siapa mengambil tas, (13) tahu siapa membantu anak/lansia.
- Mental: (14) latihan napas anti-panik, (15) anak tahu harus mengikuti siapa, (16) tidak masuk rumah saat gempa susulan, (17) tahu tanda awal banjir dan kapan mengungsi, (18) nomor darurat tercetak.
- Skor: 0–12 Rawan · 13–24 Cukup Siaga · 25–36 Siap.

### 4.4 Data lokal
- IRBI 2024 (38 provinsi) untuk saran skenario per provinsi. Data Jatim identik dengan DIY, beri catatan.
- Nomor darurat: 112 (tergantung daerah), 110, 113, 115, 118/119, 117, 123, 196.
- Kanal info: InaRISK, Info BMKG, MAGMA, SATUSEHAT Mobile.

---

## 5. Celah dan risiko
| # | Celah | Rekomendasi |
|---|---|---|
| G-01 | Kkal Indonesia (AKG 2019, Permenkes 28/2019) | Mini-riset R5b paralel. Default tetap FNNE (standar darurat). |
| G-02 | Kkal per satuan pangan lokal | R5b: TKPI Kemenkes, atau label Informasi Nilai Gizi. S1 memakai placeholder. |
| G-03 | P3K Kemenkes/PMI | Inti BNPB + pelengkap BBK; R5b mencoba sekali lagi. |
| G-04 | Popok, formula, pakan per hari | Input berbasis pemakaian user. |
| G-05 | Air tambahan hamil/sakit | Hanya anjuran, tanpa angka. |
| G-06 | Item PLAN tanpa sumber | Ganti padanan bersumber (dry bag → tas/plastik kedap air BNPB; purifier → AC/filtrasi BNPB; lampu solar → radio/charger surya BBK); sisanya dibuang. |
| G-07 | Konflik tanpa sumber Indonesia | Pakai SE/NO/EE/PL/DE; copy menyebut "rujukan internasional". |
| G-08 | BAPETEN 403 | Pakai CDC/UK/FI; verifikasi manual lewat browser bila perlu; jangan mengakali blokir. |
| G-09 | Default dari [CUPLIKAN] (air hewan, sabun) | `evidence` di items.json; Q1 memverifikasi. |
| G-10 | Kadar pemutih lokal | Copy "cek kadar di label"; tanpa merek. |
| G-11 | Konsumsi LPG | Gas kaleng 6/orang/minggu; LPG dari input user. |
| G-12 | Kontak 34 BPBD (data 2019/20) | Opsional, lewat R5b + Q1. |
| G-13 | IRBI 2025 tidak terbaca | Pakai IRBI 2024. |

Risiko: situs memblokir (ready.gov, canada.ca, Sphere, LT, BAPETEN, BPBD Jabar); URL "temporary" BNPB; klaim viral (53 negara, SK 14 hari, AT 10–14 hari); dosis kesehatan wajib diberi disclaimer; rasa aman palsu (20-20-20, tier tinggi); kebijakan cepat berubah (防災庁, Be Ready, MCF, pedoman UE), jadi `last_updated_by_source` disimpan dan direview berkala.

---

## 6. Pertanyaan untuk user
1. Air 3 L wajib + 2 L saran (total 5 L)? (Rekomendasi: ya.)
2. Tier 0–5 + sub-skor BNPB: tas >80% dan 18 indikator ≥13 untuk tier 2, ≥25 untuk tier 4? (Rekomendasi: ya.)
3. Default target durasi di form 7 hari atau 3 hari? (Rekomendasi: 7.)
4. Kelompok usia bayi/balita/anak 5–12/dewasa 13–59/lansia ≥60 + hamil/menyusui? (Rekomendasi: ya.)
5. Item tanpa sumber: ganti padanan bersumber, sisanya buang? (Rekomendasi: ya.)
6. Mini-riset R5b (AKG, TKPI, P3K) paralel dengan Fase 2? (Rekomendasi: ya.)
7. Popok, formula, dan pakan dari input pemakaian user? (Rekomendasi: ya.)

---

## 7. Konteks "53 negara"
- Asal: X @WhaleNewsDaily, 2 Nov 2026. Daftarnya hanya berupa gambar sehingga tidak bisa diverifikasi. Tiga hari sebelumnya akun yang sama menulis 33. Community Note X: daftar itu berisi anjuran rutin lama, bukan peringatan baru yang terkoordinasi.
- Newsweek menyebut 33 negara. IBTimes UK membahas unggahan berisi 18 entri ("not independently verified"). Rencana 90 hari Pentagon menyangkut pangkalan militer, bukan rumah tangga.
- Pemicu: Jepang (Hosono "min 3 hari, idealnya 1 minggu"; 防災庁 berdiri 2 Nov 2026) dan UK Be Ready (22 Okt 2026).
- Terverifikasi dari situs resmi: 25 negara + UE. R5 menambah Indonesia; NZ, LT, dan CA masih cuplikan.
- Pola: minimum 72 jam paling umum; kelompok 1 minggu: SE, NO, EE, TW, CH, JP; DE 10 hari; SG/AT 14 hari.
- Copy app: jangan memakai "53". Usulan: "Disusun dari panduan resmi BNPB dan lebih dari 25 negara serta lembaga internasional."
