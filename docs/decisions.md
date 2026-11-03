# Log Keputusan SurvivalCheck

Format: ID · topik · nilai default · sumber (bukti) · alasan · status. Status: **usulan** = PM mengusulkan, berlaku bila user tidak keberatan · **menunggu user** = butuh jawaban eksplisit · **final PM** = keputusan proses/kualitas data. Disusun 2026-11-03, gate Fase 1.

Prinsip umum:
- P-1: sumber Indonesia (BNPB/BMKG/Kemenkes/PVMBG) = rujukan lokal dan selalu disebut di copy. Bila angkanya lebih rendah dari konsensus internasional [DIBACA], app memakai nilai yang lebih aman.
- P-2: default hanya dari angka [DIBACA]. Angka [CUPLIKAN] boleh dipakai bila tidak ada alternatif, dengan `evidence: "CUPLIKAN"` dan wajib dicek Q1.
- P-3: tidak mengarang angka. Bila tidak ada sumber, pakai input berbasis pemakaian user atau boolean.

| ID | Topik | Nilai default | Sumber (bukti) | Alasan | Status |
|---|---|---|---|---|---|
| D-001 | Ambang tier | 0 (<1 hari) · 1 (1–2) · 2 (≥3) · 3 (≥7) · 4 (≥14) · 5 (≥30) | BNPB 2026; JP 防災庁 2026, SE MCF, NO DSB; CDC; KR [DIBACA] | Sesuai PLAN; tiap tier punya rujukan resmi | usulan |
| D-002 | Label tier 2 | "Siap Dasar 72 jam (standar BNPB)" | BNPB 2026 [DIBACA] | Menautkan app ke standar nasional | menunggu user |
| D-003 | Default target durasi di form | 7 hari (3 hari tetap ditampilkan sebagai minimum BNPB) | JP, SE, NO, EE, TW [DIBACA] | Tren internasional; JP baru menegaskan 1 minggu | menunggu user |
| D-004 | Air minum + masak | 3 L/orang/hari, semua usia termasuk bayi; gating | JP, TW, NZ (Auckland), SE, DK, EE, PL, NL, CH, UK; WHO TN9 2,5–3 [DIBACA] | BNPB 2 L lebih rendah dari konsensus; iklim tropis; air untuk formula | usulan |
| D-005 | Air kebersihan | +2 L/orang/hari, saran, non-gating | IFRC PAPE [DIBACA]; pembanding LV 10–12, Kemenkes 20 L hari ke-2, WHO 15–20 [DIBACA] | Realistis untuk stok rumah; kebutuhan penuh lewat ember/tandon + penjernihan | menunggu user |
| D-006 | Air saat kekeringan / El Niño | Air minum 4 L/orang/hari (×1,33); pengali dipakai yang tertinggi | Latvia 4 L saat panas [DIBACA]; FEMA ×2 [CUPLIKAN] tidak dipakai | Angka [DIBACA]; sumber Indonesia tidak punya pengali | usulan |
| D-007 | Pengali panas umum | Tidak ada (3 L sudah memperhitungkan iklim) | Sphere/WHO "depends on climate" [DIBACA] | Menghindari stok berlebihan tanpa sumber | usulan |
| D-008 | Kalori per kelompok usia | balita 1–4: 1.430 · anak 5–12: 2.000 · dewasa 13–59: 2.230 · lansia ≥60: 1.890 kkal/hari | FNNE Annex 1 [DIBACA]. 1.430 = rerata usia 1–4; 2.000 = rerata tertimbang 5–9 dan 10–12 (dihitung PM) | Sphere: 2.100 bukan untuk individu; 2.230 lebih aman | usulan (S2 boleh membulatkan) |
| D-009 | Hamil / menyusui | +285 / +500 kkal/hari; air: anjuran "lebih banyak" tanpa angka | WHO, FNNE [DIBACA]; CDC [DIBACA] | — | usulan |
| D-010 | Bayi <1 tahun | Tidak dihitung kkal. Item: ASI (dukung menyusui), formula siap minum/bubuk, MPASI, popok, tisu basah. Jumlah dari input pemakaian harian user. Gating bila ada bayi. | BNPB 2026; CDC; UK Be Ready [DIBACA] | Tidak ada angka resmi per hari | usulan |
| D-011 | Pangan siap santap | ≥50% stok bisa dimakan tanpa masak (anjuran, non-gating) | Estonia [DIBACA]; CH, FR, BNPB [DIBACA] | Listrik/gas bisa padam | usulan |
| D-012 | Toilet darurat | 5 kantong/orang/hari; DIY (kantong sampah tebal + penyerap) dihitung setara; gating mulai tier 2 | Tokyo 2025, CAO 2022 [DIBACA]; BBK [DIBACA] | Satu-satunya angka rumah tangga | usulan |
| D-013 | Tisu toilet / sabun | 1 rol/orang/minggu · 250 g sabun/orang/bulan (non-gating) | Tokyo [DIBACA]; Sphere [CUPLIKAN] | — | usulan |
| D-014 | Obat rutin | ≥ max(target, 7) hari; ≥14 hari mulai tier 4; 30 hari untuk pandemi; catatan "konsultasi dokter/faskes" | NO, JP Tokyo, AU QLD, CDC; SE 1 bulan [DIBACA] | Isi ulang resep butuh waktu | usulan |
| D-015 | P3K | Inti BNPB (penurun panas, perban, antiseptik, plester, minyak angin, hand sanitizer) + pelengkap BBK (termometer, obat diare, elektrolit, sarung tangan, gunting, pinset) | BNPB 2026, BBK 2025 [DIBACA] | Daftar Kemenkes tidak ditemukan | usulan |
| D-016 | Hewan | Durasi = target, min 5 hari; air anjing 4 L, kucing 1 L; pakan dari input user; non-gating | BNPB 3–5, JP, AU [DIBACA]; Kanada [CUPLIKAN] | Batas atas BNPB = minimum JP/AU | usulan (angka air perlu dicek Q1) |
| D-017 | Uang tunai | Dalam hari belanja pokok: 3 hari (tier 2), 7 hari (tier ≥3, konflik, listrik padam); pecahan kecil; tanpa nominal | BNPB 2019/20; EE, LV, CH [DIBACA] | Keputusan tanpa harga | usulan |
| D-018 | Rebus air | Didih bergolak 1 menit; 3 menit bila >1.000 m dpl | CDC, EPA, Kemenkes [DIBACA] | Ambang EPA paling aman | usulan |
| D-019 | Pemutih | Kadar 5–9%: 2 tetes/L, 4 bila keruh, tunggu 30 menit, harus berbau klorin samar; kadar lain atau ragu → rebus | CDC, EPA [DIBACA]; IFRC 1 tetes ditolak | Dosis lebih aman, dari lembaga pemerintah | usulan |
| D-020 | Tablet / aquatab / kaporit | "Ikuti petunjuk label". Angka aquatab 1/20 L dan kaporit Kemenkes tidak ditampilkan. | EPA [DIBACA]; Kemenkes [DIBACA], tetapi diragukan atau rancu | Mencegah dosis kurang | usulan |
| D-021 | Pra-olah air keruh | Tawas ½ sdt/20 L, PAC 1 sachet/20 L, lalu desinfeksi | Kemenkes 2014 [DIBACA] | Praktik khas Indonesia | usulan |
| D-022 | Yodium tingtur | Ikuti kadar: 2% → 5 tetes/L; 7% → 2 tetes/L; tidak untuk hamil/tiroid | EPA, Kemenkes, CDC [DIBACA] | — | usulan |
| D-023 | Kalium iodida | Tidak masuk daftar belanja; info "hanya atas instruksi otoritas" | Semua sumber Nordik/EU/US [DIBACA]; BAPETEN [CUPLIKAN] | Konsensus; PLAN §2.1 | usulan |
| D-024 | Bahan bakar masak | Gas kaleng kompor portabel ±6/orang/minggu; LPG dari input user | MAFF [DIBACA] | Satu-satunya angka | usulan |
| D-025 | Penerangan | Senter + baterai gating (tier 2); senter di kamar; lilin hanya cadangan + peringatan | BNPB 2026, Kanada [DIBACA/CUPLIKAN] | BNPB 2026: "senter, bukan lilin" | usulan |
| D-026 | Sub-skor tas siaga | Checklist BNPB 28 item: >80% SIAP, 50–80% PERLU DILENGKAPI, <50% BELUM SIAP; item bayi/lansia dikeluarkan bila tidak relevan | BNPB 2026 [DIBACA, dicek PM] | Selaras standar nasional | menunggu user |
| D-027 | Evaluasi keluarga | 18 indikator 0–2 (maks 36): Rawan 0–12, Cukup Siaga 13–24, Siap 25–36; gating tier 2 ≥13, tier 4 ≥25 | BNPB 2026 [DIBACA, dicek PM] | Mengisi kategori "Rencana & pengetahuan" | menunggu user |
| D-028 | Hari bertahan | MIN(air minum, kkal, obat rutin, makanan bayi); sanitasi/penerangan hanya gating tier | — (desain) | Angka "bertahan" mencerminkan ancaman langsung | usulan (S2 final) |
| D-029 | Skor 0–100 | Stok kritis 55%, tas BNPB 20%, 18 indikator 15%, item skenario 10%; skor tidak menaikkan tier | — (desain) | Titik awal S2 | usulan (S2 final) |
| D-030 | Kelompok usia profil | bayi <1 · balita 1–4 · anak 5–12 · dewasa 13–59 · lansia ≥60 · centang hamil/menyusui | FNNE [DIBACA] | Diperlukan untuk D-008/D-009 | menunggu user |
| D-031 | Lokasi item | Field `location`: bag / home / both | BNPB, TW, PL [DIBACA] | Membedakan tas siaga dan stok rumah | usulan |
| D-032 | Skenario konflik | Durasi min tier efektif 7 hari; tunai 7 hari; radio; "dua dinding"; disinformasi; copy "tidak ada panduan Indonesia" | SE, NO, EE, LV, PL [DIBACA] | Tidak ada sumber lokal | usulan |
| D-033 | Skenario nuklir | Shelter di dalam ≥24 jam (stok tetap mengikuti target); plastik + lakban; matikan AC; lepas pakaian luar | CDC, UK, FI, PL [DIBACA] | BAPETEN tidak terbaca | usulan |
| D-034 | Skenario pandemi | Stok air/pangan min 14 hari; obat 30 hari; masker, hand sanitizer, termometer; oksimeter dibuang (tanpa sumber) | CDC, SE, DE, CH, BNPB, Kemenkes [DIBACA] | — | usulan |
| D-035 | Skenario kabut asap | N95 per orang (boolean/jumlah dari input), tetap di dalam, AC/filtrasi | Kemenkes 2026, BNPB [DIBACA] | Jumlah N95/hari tidak disebutkan | usulan |
| D-036 | Item tanpa sumber resmi | Ganti ke padanan bersumber (dry bag → tas/plastik kedap air; air purifier → AC/filtrasi udara; lampu solar → radio/charger surya); buang linggis, pelampung, oksimeter, penutup tandon, pengaman atap | PLAN §2.1 vs riset | Aturan ≥1 sumber per item | menunggu user |
| D-037 | Copy tsunami | Utama: "gempa kuat/lama di pantai → segera ke tempat tinggi, jangan menunggu sirene". 20-20-20 hanya catatan + peringatan wilayah | BMKG [DIBACA]; Maluku [CUPLIKAN] | Mencegah rasa aman palsu | usulan |
| D-038 | Saran skenario per provinsi | Dari IRBI 2024 `dominant_hazards`, bisa diubah user; catatan data Jatim | BNPB IRBI 2024 [DIBACA] | — | usulan |
| D-039 | Nomor darurat | 112 (tergantung daerah), 110, 113, 115, 118/119, 117, 119 SPGDT, 123, 196 | R5 [DIBACA]; sebagian data 2019/20 | Q1 cek ulang | usulan |
| D-040 | Pengingat pemeriksaan | Tiap 6 bulan; simulasi 2× setahun; ganti air isi sendiri tiap 6 bulan | BNPB, UK, CDC, TW [DIBACA] | — | usulan |
| D-041 | Framing "53 negara" | Tidak dipakai; "BNPB + >25 negara + lembaga internasional" | R0 | Klaim viral tidak terverifikasi | final PM |
| D-042 | Sumber tidak konsisten | Air LT, CA, Q&A NL tidak jadi dasar default | R2/R3/R4 [CUPLIKAN] | P-2 | final PM |
| D-043 | Mini-riset R5b | AKG 2019, TKPI kkal per satuan, P3K Kemenkes/PMI, (opsional) kontak BPBD; paralel dengan S1/S2 | — | Menutup G-01..G-03 | menunggu user |
| D-044 | Sitasi BNPB 2026 | Simpan judul, penerbit, tahun, dan URL; path "temporary" berisiko mati | Cek PM 2026-11-03 (HTTP 200) | Ketahanan sitasi | final PM |
