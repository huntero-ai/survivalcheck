# R5 ★ Indonesia: Panduan Kesiapsiagaan Resmi

- Agent: R5 (Indonesia), run ulang
- Tanggal akses semua sumber: **2026-11-03**
- Metode: WebSearch untuk mencari URL, lalu `curl` (User-Agent default, lewat proxy sesi) ke folder scratch. Teks PDF diekstrak dengan `pdftotext`. PDF berbasis gambar (Buku Saku BMKG) dibaca dari render halaman.
- Penanda bukti: **[DIBACA]** berarti dokumen asli diunduh dan dibaca. **[CUPLIKAN]** berarti hanya ringkasan/cuplikan WebSearch, karena dokumen asli tidak bisa diunduh.
- Data terstruktur ada di `research/r5-indonesia.json` (skema §4.1, ditambah `province_risks` dan `emergency_numbers`).

---

## 0. Ringkasan untuk tim sintesis (S1/S2)

| Parameter | Nilai resmi Indonesia | Sumber |
|---|---|---|
| Target durasi tas siaga | **3 hari / 72 jam** (min = rekomendasi = 3). Tidak ada sumber resmi yang menyarankan stok rumah lebih dari 3 hari. | BNPB 2026 [DIBACA]; BNPB Buku Saku 2019/2020 [DIBACA] |
| Air minum di tas siaga | **min. 2 L/orang/hari** | BNPB 2026 [DIBACA] |
| Air untuk pengungsian (masak, makan, minum) | **5 L/orang/hari pada hari ke-1, 20 L/orang/hari mulai hari ke-2** | Kemenkes 2014 [DIBACA] |
| Kalori/pangan | Tidak disebutkan dalam kkal atau kg. Hanya jenisnya: makanan siap saji tahan lama, biskuit energi, mie instan, abon, coklat. | BNPB [DIBACA] |
| Pemeriksaan tas | Minimal 6 bulan sekali; harus bisa diambil dalam 10 detik | BNPB 2026 [DIBACA] |
| Hewan peliharaan | Makanan kaleng dan air untuk **3–5 hari** | BNPB Buku Saku 2019/2020 [DIBACA] |
| Kalium iodida (KI) | Belum ada panduan warga yang terbaca. Cuplikan pedoman BAPETEN 2017 menempatkan KI sebagai tindakan protektif yang dibagikan otoritas. | BAPETEN [CUPLIKAN] |

Catatan penting: angka 2 L di BNPB lebih rendah dari baseline PLAN.md (3 L). Sumber ini hanya menyebut air minum. Kemenkes memakai 5 L lalu 20 L/orang/hari untuk kebutuhan masak, makan, dan minum di pengungsian.

---

## 1. Per lembaga

### 1.1 BNPB: "Keluarga Siaga Bencana: Panduan Anti Panik Saat Gempa, Banjir & Krisis Darurat" (2026) [DIBACA]
- URL: https://perpustakaan.bnpb.go.id/inlislite/uploaded_files/temporary/DigitalCollection/OThjMzRiZDFlMDU2OWYzNzQ5ZjliYWI0Nzg3ODkxMTQxNTE0NDIzNg==.pdf
- Penerbit: Pusat Data, Informasi dan Komunikasi Kebencanaan BNPB. Penulis: Dr. Agus Wibowo (Direktur Sistem PB). Cetakan Pertama 2026, metadata PDF 2026-05-11. Ini konfirmasi "panduan keluarga siaga 2026".
- **Durasi:** "Tas Siaga 72 Jam". Teks: "keluarga harus bertahan sendiri selama 24–72 jam pertama"; tas siaga untuk "keadaan darurat selama 3x24 jam".
- **Isi Wajib Tas Siaga (Standar Keluarga):**
  - Kebutuhan dasar: air minum (**minimal 2 liter/orang/hari**), makanan siap saji tahan lama, biskuit energi, makanan bayi (jika ada balita). Checklist juga memuat sendok dan alat makan sederhana.
  - Peralatan: senter + baterai cadangan, power bank, radio portable, peluit, masker, sarung tangan.
  - Kesehatan & P3K: obat pribadi, obat penurun panas, perban & antiseptik, plester luka, minyak angin, hand sanitizer.
  - Dokumen (dalam plastik tahan air): fotokopi KTP, fotokopi KK, fotokopi sertifikat rumah, salinan buku tabungan, nomor penting tercetak.
  - Tambahan: pakaian ganti, selimut tipis, jas hujan, uang tunai secukupnya. Checklist juga memuat perlengkapan bayi dan obat lansia.
- **Versi Hemat:** air kemasan, mie instan, senter sederhana, map plastik untuk dokumen, obat yang sudah ada di rumah.
- **Tas anak:** camilan favorit, boneka kecil, senter kecil, masker, botol minum. Libatkan anak saat menyiapkannya.
- **Tas lansia:** obat rutin, kacamata cadangan, popok dewasa (jika perlu), nomor keluarga besar.
- **Penyimpanan:** dekat pintu keluar, mudah terlihat, tidak terkunci, bisa diambil dalam 10 detik, diperiksa minimal 6 bulan sekali. Idealnya 1 tas utama keluarga + 1 tas kecil tambahan. Rumah bertingkat: pertimbangkan tas di lantai atas. Simpan juga senter kecil di kamar dan sepatu di dekat tempat tidur.
- **Kesalahan umum:** tas terlalu berat, disimpan di lemari paling atas, tidak pernah dicek ulang, makanan kedaluwarsa, tidak disesuaikan dengan kebutuhan anak atau lansia.
- **Skor kesiapan (cocok untuk app):** checklist tas: >80% SIAP, 50–80% PERLU DILENGKAPI, <50% BELUM SIAP. Evaluasi keluarga terdiri dari 18 indikator dengan skor 0–2 (fisik/logistik, prosedur, mental). Skor 0–12 = Rawan, 13–24 = Cukup Siaga, 25–36 = Siap. Simulasi minimal 2 kali setahun.
- **Rencana kesiapsiagaan keluarga ("standar BNPB"):** identifikasi risiko, pembagian peran, rencana evakuasi dan titik kumpul (utama + cadangan), kontak darurat (BPBD, RT/RW, keluarga besar; dalam bentuk cetak), tas siaga, latihan berkala.
- **InaRISK** disebut sebagai portal peta ancaman, risiko, dan rekomendasi mitigasi. Untuk cek potensi likuefaksi: InaRISK, DKMS, Info BMKG.

### 1.2 BNPB: Buku Saku "Tanggap Tangkas Tangguh Menghadapi Bencana" [DIBACA]
- Cetakan ke-5 (2020): https://www.bnpb.go.id/storage/app/media/Buku%20BNPB/Buku%20Saku%20Bencana%20BNPB.pdf (halaman: https://www.bnpb.go.id/buku/buku-saku-tanggap-tangkas-tangguh-cetakan-kelima-2020)
- Cetakan ke-4 (Maret 2019, ISBN 978-602-5693-05-2): https://www.bnpb.go.id/storage/app/media/uploads/24/buku-data-bencana/6-buku-saku-cetakan-4-2019.pdf. Halaman https://www.bnpb.go.id/buku/buku-saku-bencana bertanggal 19 Feb 2019. URL `bnpb.go.id/uploads/...` tanpa `www` membalas 403, tetapi file yang sama terunduh dari path `www.bnpb.go.id/storage/app/media/...` yang ditautkan halaman resmi.
- Edisi 2012: https://www.bnpb.go.id/storage/app/media/uploads/migration/pubs/478.pdf. Edisi ini menyebut "Menyiapkan tas siaga bencana" tetapi **tidak memuat daftar isinya**.
- Perbedaan cetakan 2020 dari 2019: ada bab Pandemi COVID-19, Call Center 117, kolom golongan darah dan catatan medis. Isi Tas Siaga **sama**.
- **"Contoh Kebutuhan Dasar Tas Siaga Bencana Untuk 3 Hari":** surat-surat penting (surat tanah, surat kendaraan, ijazah, akte kelahiran), pakaian untuk 3 hari (pakaian dalam, celana panjang, jaket, selimut, handuk, jas hujan), makanan ringan tahan lama (mie instan, biskuit, abon, coklat), air minum yang "setidaknya bisa mendukung kebutuhan selama kurang lebih 3 hari" (**tanpa angka liter**), kotak obat/P3K (obat pribadi dan obat umum), alat bantu penerangan (senter, headlamp, korek api, lilin), uang cash secukupnya untuk ±3 hari, radio/ponsel + baterai/charger/powerbank, peluit, masker, perlengkapan mandi (sabun, sikat gigi + odol, sisir, cotton bud).
- TSB = tas tahan air (waterproof), "untuk bertahan hidup saat bantuan belum datang dan memudahkan kita saat evakuasi".
- Bab Banjir: "Membuat persiapan untuk hidup mandiri selama sekurangnya tiga hari".
- **Hewan peliharaan:** kalung dan tali, kotak P3K cadangan, fotokopi identitas hewan, makanan kaleng dan air (**untuk 3–5 hari**), kantung sekali pakai, sabun pembersih, kandang/carrier, selimut/kain. Juga: tag identitas atau microchip, foto hewan, lokasi penitipan hewan (beberapa pengungsian menolak hewan), stiker peringatan hewan di jendela.
- **Disabilitas:** bab khusus mitigasi untuk penyandang disabilitas.
- 26 April ditetapkan sebagai Hari Kesiapsiagaan Bencana.

### 1.3 BMKG [DIBACA]
- Antisipasi Gempa Bumi: https://www.bmkg.go.id/gempabumi/mitigasi/antisipasi-gempabumi (tahun tidak disebutkan). Daftar "Alat yang harus ada di setiap tempat": kotak P3K, senter/lampu baterai, radio, makanan suplemen dan air (tanpa jumlah). Saran lain: perabot dipaku atau diikat ke dinding, barang berat di bagian bawah, bahan mudah terbakar di wadah tak mudah pecah, belajar P3K dan memakai alat pemadam, mencatat nomor penting.
- Buku Saku "Mengenal Gempabumi & Tsunami" (PDF 2020, dibaca dari gambar): https://content.bmkg.go.id/wp-content/uploads/BMKG_Buku-Saku-Gempabumi-dan-Tsunami.pdf. Halaman "Perlengkapan yang wajib dimiliki di rumah Anda": Kotak P3K, Tas Siaga Bencana, Senter/Lampu Battery, Radio/Alat komunikasi, Makanan Suplemen, Air Mineral. **"3 Langkah Tanggap Tsunami"**:
  1. Tanggap Gempa: waspada bila gempa kuat atau berlangsung lama; jauhi pantai dan tepi sungai.
  2. Tanggap Peringatan: status AWAS dan SIAGA = warga harus evakuasi; WASPADA = jauhi pantai dan tepi sungai. Sumber info: TV Nasional, radio daerah, sirine, kentongan.
  3. Tanggap Evakuasi: ikuti jalur dan rambu evakuasi. Bila lokasi aman tidak diketahui, larilah sejauh mungkin dari pantai dan naiklah ke tempat yang lebih tinggi.
- Halaman Edukasi (https://www.bmkg.go.id/gempabumi/mitigasi/edukasi-gempabumi-tsunami): video "Gerakan Sadar Tas Siaga Bencana" untuk bertahan "selama 72 jam pertama". Ada booklet BMKG–JICA untuk penyandang disabilitas, termasuk netra (2025).
- **Evakuasi mandiri tsunami:** "Segera melakukan evakuasi mandiri dengan cara menjauh dari pantai, dengan cara menjadikan gempa kuat yang dirasakan di pantai sebagai peringatan dini tsunami" (Kepala BMKG, 17 Jan 2021): https://www.bmkg.go.id/siaran-pers/bmkg-evakuasi-ke-tempat-aman-bukan-eksodus
- **Rumus "20-20-20"** (BMKG Baubau, 25 Jun 2026): guncangan >20 detik adalah sinyal bahaya, ada ±20 menit sebelum tsunami lokal tiba, evakuasi ke ketinggian min. 20 m dpl. Sumber: https://www.bmkg.go.id/berita/daerah/bmkg-soroti-kerentanan-pesisir-baubau-dorong-mitigasi-gempa-bumi-hingga-banjir-rob. [CUPLIKAN] Media (Antara Ambon) mengutip BMKG bahwa rumus ini **tidak berlaku di Maluku** karena waktu tiba tsunami 1–7 menit. Halaman resmi untuk klaim ini belum dibaca.
- **Kekeringan / El Niño 2026** (berita BMKG 5 Jun 2026): https://www.bmkg.go.id/berita/kesiapsiagaan-hadapi-kemarau-bmkg-ajak-pemerintah-daerah-perkuat-antisipasi-kekeringan. Isinya: El Niño 2026, indeks ENSO +1,0 akhir Mei 2026, musim kemarau lebih kering dari normal, durasi 3–7 bulan tergantung wilayah. Imbauan ditujukan ke pemda. **Tidak ada angka stok air rumah tangga.**
- Cuaca ekstrem: situs BMKG punya menu peringatan dini (curah hujan, siklon tropis, gelombang tinggi, rob, kekeringan meteorologis, tsunami). Contact Center **196**. Panduan item rumah tangga khusus cuaca ekstrem dari BMKG: tidak ditemukan. Yang tersedia adalah panduan BNPB untuk puting beliung (lihat §2).

### 1.4 Badan Geologi / PVMBG / MAGMA [DIBACA, sebagian]
- Berita ESDM "Gunung Ibu Erupsi, Warga Diminta Waspadai Hujan Abu" (4 Agu 2025): https://esdm.go.id/id/media-center/arsip-berita/gunung-ibu-erupsi-warga-diminta-waspadai-hujan-abu. Kutipan: "Jika terjadi hujan abu, masyarakat yang beraktivitas di luar rumah disarankan untuk menggunakan pelindung hidung dan mulut (masker) serta kacamata guna melindungi mata dari partikel abu vulkanik". Warga diminta mematuhi radius bahaya, tidak menyebar hoaks, dan memantau MAGMA Indonesia (aplikasi Android, vsi.esdm.go.id, magma.esdm.go.id).
- Status gunung api Level I Normal sampai IV Awas, serta KRB I–III, dijelaskan di Buku Saku BNPB 2019/2020 [DIBACA].
- Gerakan tanah: [CUPLIKAN] PVMBG menerbitkan peta prakiraan gerakan tanah bulanan di vsi.esdm.go.id (belum dibaca). Tanda longsor resmi yang terbaca berasal dari BNPB edisi 2012: retakan vertikal pada tebing, air tanah muncul tiba-tiba, air sumur di sekitar tebing menjadi keruh, longsoran batu-batu kecil.
- Akses: magma.esdm.go.id beberapa kali memutus koneksi (connection reset).

### 1.5 Kementerian Kesehatan [DIBACA]
- **Air bersih saat banjir** (13 Jan 2014): https://kemkes.go.id/id/kebutuhan-air-bersih-pada-musim-banjir
  - Kebutuhan minimal masak, makan, minum: **5 L/orang/hari hari pertama, 20 L/orang/hari hari kedua dst.**
  - Penjernihan: tawas ½ sdt per 20 L (aduk 5 menit, endapkan 10–20 menit); PAC 1 sachet per 20 L; K-116 1 sdm per 200 L (2–3 sdm bila sangat keruh).
  - Desinfeksi: kaporit (teks sumber rancu: "14.4 mg kaporit (1 sendok teh peres=3 gram) untuk ): 20 liter air"; **perlu klarifikasi, jangan dipakai sebagai dosis**), aquatab 8,5 mg 1 tablet per 20 L, tincture iodine 7% 2 tetes per 1 L. Diamkan 30 menit sebelum diminum.
  - Waspadai 7 penyakit: diare, DBD, leptospirosis, ISPA, penyakit kulit, penyakit saluran cerna lain, perburukan penyakit kronik.
- **Penyakit menular saat banjir** (7 Apr 2012): https://kemkes.go.id/id/antisipasi-penyakit-menular-saat-banjir. Cuci tangan pakai sabun, rebus air minum hingga mendidih setiap hari, 3M untuk DBD, pakai sepatu pelindung bila terpaksa ke daerah banjir (leptospirosis).
- **Kabut asap karhutla 2026:**
  - 21 Agu 2026: https://kemkes.go.id/id/menkes-pakai-masker-dan-pantau-kualitas-udara-untuk-cegah-dampak-asap-karhutla. Pakai masker, batasi aktivitas luar, pantau indeks kualitas udara (PM2,5). Ke puskesmas atau RS bila sesak, batuk menetap, nyeri dada, atau iritasi mata berat. Karhutla tercatat di 7 provinsi (Jambi, Riau, Sumsel, Kalbar, Kalteng, Kalsel, Kaltim).
  - 23 Okt 2026: https://www.kemkes.go.id/id/kemenkes-perkuat-perlindungan-kesehatan-warga-terdampak-kabut-asap-di-palangka-raya. Kutipan: "Kalau tidak perlu, jangan keluar rumah, terutama balita, ibu hamil, dan orang tua. Kalau memang harus keluar, gunakan masker **N95** dan pastikan dipakai dengan benar agar tidak ada celah". Sebagian besar ISPA bisa dirawat di rumah dengan istirahat dan cukup minum.
- **Wabah di pengungsian** (17 Des 2025): https://kemkes.go.id/id/kemenkes-ajak-warga-terdampak-banjir-waspadai-risiko-wabah-di-pengungsian. Etika batuk, masker, kebersihan tangan, segera lapor gejala, imunisasi rutin dan kejar tetap berjalan (risiko KLB campak dan pertusis).
- **Darurat medis 119** juga bisa lewat SATUSEHAT Mobile (5 Okt 2024): https://kemkes.go.id/id/akses-darurat-medis-119-kini-bisa-melalui-satusehat-mobile
- [CUPLIKAN] Sep 2026: Kemenkes mengimbau masker bagi orang bergejala flu di tengah kasus Influenza A(H3N2) subclade K. Rilis resminya belum dibaca.
- **Celah:** daftar isi kotak P3K rumah tangga versi Kemenkes tidak ditemukan. Stok obat untuk pandemi (mis. >30 hari) juga tidak disebutkan.

### 1.6 BAPETEN / BRIN: kedaruratan nuklir dan radiologi [CUPLIKAN]
- bapeten.go.id dan www.bapeten.go.id membalas **HTTP 403** (dari situs asal) untuk semua halaman dan PDF. BRIN tidak memberi hasil relevan.
- [CUPLIKAN] "Pedoman perencanaan kesiapsiagaan dan penanggulangan kedaruratan reaktor nuklir" (BAPETEN, 2017): https://www.bapeten.go.id/dokumen/document-item/unduh?filename=2017_Pedoman_perencanaan_kesiapsiagaan_dan_penanggulangan_kedaruratan_reaktor_nuklir.pdf. Menurut ringkasan WebSearch, pedoman ini memuat tindakan protektif di luar tapak: berlindung (sheltering), evakuasi, dan distribusi **tablet KI**, dengan ambang dosis tiroid 50 mSv dalam 7 hari. Isi asli belum diverifikasi.
- [CUPLIKAN] Gladi Lapang Nasional 2016 (Puspiptek Serpong): tablet KI dibagikan ke pekerja fasilitas dalam simulasi. https://bapeten.go.id/berita/gladi-lapang-nasional-penanggulangan-kedaruratan-nuklir-134826?lang=id
- **Sikap resmi soal KI untuk warga:** panduan BAPETEN/BRIN bagi masyarakat umum tentang stok atau konsumsi mandiri **tidak ditemukan**. Cuplikan yang ada menempatkan KI sebagai tindakan yang didistribusikan dan diinstruksikan otoritas. Ini sejalan dengan aturan PLAN.md ("hanya sesuai instruksi otoritas"). BNPB hanya mencantumkan B3 Kelas 7 (Radioaktif) dan PP 58/2015.

### 1.7 BPBD (contoh)
- **BPBD DIY** [DIBACA], 20 Sep 2024: https://bpbd.jogjaprov.go.id/berita/siap-hadapi-darurat-mulai-dengan-tas-siaga-bencana-. Tas disiapkan "untuk setiap anggota keluarga", bahan tahan air. Isinya 8 kelompok yang bersumber dari Buku Saku BNPB: dokumen penting, P3K/obat, makanan dan minuman tahan lama (mi instan, air mineral, biskuit, abon), alat penerangan (senter, headlamp, korek, lilin), peluit, perlengkapan mandi, ponsel dan powerbank, pakaian ganti. Tidak ada angka durasi atau liter. Pusdalops (0274) 555585, WA (0274) 555584.
- **BPBD DKI Jakarta:** situsnya terjangkau, tetapi halaman tas siaga tidak ditemukan. [CUPLIKAN] Media (koran-jakarta.com, 4 Feb 2026) mengutip BPBD DKI soal "tas siaga 3 hari". Ini bukan sumber resmi.
- **BPBD Jawa Barat:** bpbd.jabarprov.go.id membalas **HTTP 403**.

### 1.8 Basarnas [DIBACA]
- https://basarnas.go.id/ menyebut "Kontak Darurat SAR, tekan untuk menelepon **115**" dan "WhatsApp Rescue 115".

### 1.9 PMI (sekunder)
- pmi.or.id dirender JavaScript. Tidak ada panduan tas siaga atau P3K PMI yang terbaca atau ditemukan di WebSearch. PMI tercantum di daftar kontak BNPB: 021-4207051.

### 1.10 Kemhan / Kemenko Polkam: konflik dan darurat sipil
- Panduan praktis resmi untuk warga sipil (stok, berlindung) **tidak ditemukan**.
- [CUPLIKAN] Dasar hukum "keadaan bahaya" (darurat sipil, darurat militer, keadaan perang): Perppu 23/1959, https://jdih.kemenkeu.go.id/fulltext/1959/23TAHUN1959PERPPU.htm
- Panduan perilaku yang ada hanya dari BNPB edisi 2012 [DIBACA]. Kerusuhan sosial: hindari kerumunan demo, laporkan kerusuhan atau kekerasan ke Kepolisian. Teroris: laporkan orang atau rencana mencurigakan ke pihak berwenang.
- Rekomendasi untuk S1/S2: skenario konflik dan perang perlu memakai pelengkap Nordik/GOV.UK sesuai PLAN.md, karena tidak ada rujukan Indonesia.

---

## 2. Per skenario (sumber Indonesia)

| Skenario | Item / aturan tambahan dari sumber resmi Indonesia | Sumber |
|---|---|---|
| Gempa bumi | Drop–Cover–Hold On, jangan lari saat guncangan. Titik aman di dalam rumah + titik kumpul di luar (utama dan cadangan). Alas kaki dan senter dekat tempat tidur. Perabot diikat atau dipaku ke dinding, barang berat di bawah. Alat pemadam kebakaran, alat keselamatan standar, obat-obatan. Helm atau bantal untuk kepala. Bila ada tanda likuefaksi, longsor, api, atau gas, evakuasi horizontal. | BNPB 2026, BNPB 2019/2020, BMKG [DIBACA] |
| Tsunami | Gempa kuat = peringatan dini, evakuasi mandiri tanpa menunggu. 10 menit emas; "20-20-20" (BMKG Baubau 2026). Evakuasi berjalan kaki, hindari jembatan, tinggalkan kendaraan bila macet. Tsunami bisa sampai 5 kali, jangan kembali sebelum dinyatakan aman. Status AWAS/SIAGA = evakuasi. | BMKG, BNPB [DIBACA] |
| Banjir & longsor | Hidup mandiri ≥3 hari. Dokumen dalam plastik kedap air. Isi ember atau wadah air bersih. Matikan listrik utama, lepas regulator LPG. Mengungsi sebelum air selutut (arus 30 cm sudah berbahaya). Tongkat untuk cek pijakan. Pasca banjir: sarung tangan, boots, disinfektan, buang makanan terendam. Air: rebus atau olah (tawas, PAC, aquatab, iodine). Sepatu pelindung untuk cegah leptospirosis. Longsor: evakuasi menjauhi gemuruh atau sirine, waspada longsor susulan. | BNPB 2026/2019, Kemenkes [DIBACA] |
| Erupsi gunung api | Masker dan kacamata pelindung. Makanan siap saji, senter dan baterai, uang tunai cukup, obat khusus. Jangan pakai lensa kontak. Masker atau kain basah. Baju lengan panjang, celana panjang, topi. Bersihkan abu dari atap. Patuhi radius bahaya, pantau MAGMA. Waspada lahar saat hujan. | BNPB 2019/2020, ESDM/PVMBG [DIBACA] |
| Karhutla & kabut asap | Tetap di dalam rumah, tutup akses asap. AC atau filtrasi udara. Masker **N95** dipakai rapat. Cukup minum air dan makan bergizi. Kelompok rentan (balita, ibu hamil, lansia, penderita asma/paru/jantung) jangan keluar. Ke puskesmas bila sesak. Kualitas udara PM10 menurut BNPB: Baik 0–50, Sedang 50–150, Tidak Sehat 150–250, Sangat Tidak Sehat 250–350, Berbahaya >350. | BNPB 2019/2020, Kemenkes 2026 [DIBACA] |
| Kekeringan / El Niño | Tandon air di pekarangan untuk tampung air hujan. Hemat air, atur jadwal penggunaan. Minta bantuan air bersih ke pihak berwenang. Kemarau 2026 lebih kering, durasi 3–7 bulan. **Tidak ada pengali air resmi.** | BNPB 2019/2020, BMKG 2026 [DIBACA] |
| Cuaca ekstrem / puting beliung | Bawa barang masuk rumah, kunci pintu dan jendela, matikan listrik. Saat petir: membungkuk, duduk, peluk lutut, jangan tiarap. Jauhi pohon besar dan papan reklame. Gelombang pasang: alat komunikasi, jauhi pantai. | BNPB 2012/2019 [DIBACA] |
| Pemadaman listrik | Kumpulkan keluarga. Senter, bukan lilin. Cek info resmi via radio atau ponsel. Jangan sebar info yang belum jelas. Power bank dan radio sudah ada di isi wajib tas. | BNPB 2026 [DIBACA] |
| Pandemi / wabah | Cuci tangan dengan sabun + hand sanitizer, jaga jarak min. 1 m, masker di tempat umum, etika batuk, isolasi diri dan telemedis bila bergejala, disinfeksi permukaan. Di pengungsian: masker, kebersihan tangan, imunisasi. Termometer, oksimeter, dan stok obat >30 hari **tidak disebutkan**. | BNPB 2020, Kemenkes 2025 [DIBACA] |
| Konflik / kerusuhan / perang | Hindari kerumunan demo, lapor polisi. Tidak ada panduan stok atau berlindung. | BNPB 2012 [DIBACA]; Perppu 23/1959 [CUPLIKAN] |
| Nuklir / radiologi | Berlindung dan evakuasi; KI hanya didistribusikan atau diinstruksikan otoritas. Belum diverifikasi. | BAPETEN 2017 [CUPLIKAN] |
| Hewan peliharaan | Makanan kaleng dan air 3–5 hari, carrier, tali, P3K, identitas. | BNPB 2019/2020 [DIBACA] |

---

## 3. Risiko bencana per provinsi (BNPB IRBI 2024) [DIBACA]

Sumber: BNPB, *Buku Indeks Risiko Bencana Indonesia (IRBI) Tahun 2024*, https://inarisk.bnpb.go.id/pdf/BUKU%20IRBI%202024.pdf (PDF dibuat 2 Mei 2025). Kolom "Paling sering (DIBI 2024)" diambil dari kalimat "bencana yang paling banyak terjadi di …" pada profil tiap provinsi. Daftar ancaman lengkap per provinsi ada di JSON (`hazards_exposed`). IRBI 2025 tersedia di https://inarisk.bnpb.go.id/IRBI-2025, tetapi berupa flipbook Flash dan tidak terbaca. Tahun 2024 ada **7 provinsi berkelas risiko tinggi**; sisanya sedang.

| Provinsi | Paling sering terjadi (DIBI 2024) | Ancaman lain yang menonjol di daftar IRBI | IRBI 2024 | Kelas |
|---|---|---|---|---|
| Aceh | banjir, cuaca ekstrem, karhutla | gempa, tsunami, gunung api, longsor | 144,29 | tinggi |
| Sumatera Utara | banjir, cuaca ekstrem, karhutla | gempa, tsunami, gunung api, longsor | 139,84 | sedang |
| Sumatera Barat | banjir, tanah longsor, karhutla | gempa, tsunami, gunung api | 142,55 | sedang |
| Riau | banjir, gelombang pasang/abrasi, karhutla | gempa, kekeringan | 137,69 | sedang |
| Jambi | banjir, karhutla | gempa, gunung api, longsor | 138,02 | sedang |
| Sumatera Selatan | banjir, cuaca ekstrem, karhutla | gempa, tsunami, kekeringan | 131,05 | sedang |
| Bengkulu | banjir, cuaca ekstrem, karhutla | gempa, tsunami, gunung api | 144,08 | tinggi |
| Lampung | banjir, cuaca ekstrem, kekeringan | gempa, tsunami, gunung api | 130,10 | sedang |
| Kep. Bangka Belitung | banjir, cuaca ekstrem, karhutla | gempa, abrasi | 143,42 | sedang |
| Kepulauan Riau | banjir, cuaca ekstrem, karhutla | longsor, gelombang ekstrem | 109,24 | sedang |
| DKI Jakarta | banjir, cuaca ekstrem | gempa, kekeringan, abrasi | 59,29 | sedang |
| Jawa Barat | banjir, tanah longsor, cuaca ekstrem | gempa, tsunami, gunung api | 114,15 | sedang |
| Jawa Tengah | banjir, tanah longsor, cuaca ekstrem | gempa, tsunami, gunung api | 99,61 | sedang |
| DI Yogyakarta | cuaca ekstrem, kekeringan | gempa, gunung api, tsunami | 102,83 | sedang |
| Jawa Timur | banjir, cuaca ekstrem, longsor, karhutla | gempa, gunung api, tsunami | 113,70 | sedang |
| Banten | banjir | gempa, tsunami | 128,64 | sedang |
| Bali | tanah longsor, banjir, gempa | tsunami, gunung api | 111,28 | sedang |
| Nusa Tenggara Barat | gempa, tsunami, banjir, longsor | gunung api, kekeringan | 113,64 | sedang |
| Nusa Tenggara Timur | banjir, gempa, tsunami, longsor | gunung api, kekeringan | 131,85 | sedang |
| Kalimantan Barat | banjir, longsor, karhutla, puting beliung | kekeringan | 131,66 | sedang |
| Kalimantan Tengah | banjir, tanah longsor | karhutla, kekeringan | 117,48 | sedang |
| Kalimantan Selatan | banjir, cuaca ekstrem, karhutla | kekeringan | 122,11 | sedang |
| Kalimantan Timur | banjir, karhutla, cuaca ekstrem, longsor | kekeringan | 136,11 | sedang |
| Kalimantan Utara | banjir, cuaca ekstrem, longsor, karhutla | tsunami | 131,84 | sedang |
| Sulawesi Utara | banjir, cuaca ekstrem | gempa, gunung api, tsunami | 125,91 | sedang |
| Sulawesi Tengah | banjir | gempa, tsunami, banjir bandang | 137,25 | sedang |
| Sulawesi Selatan | banjir, cuaca ekstrem | gempa, tsunami, banjir bandang | 140,76 | sedang |
| Sulawesi Tenggara | banjir, cuaca ekstrem | gempa, tsunami | 151,77 | tinggi |
| Gorontalo | banjir | gempa, tsunami | 116,02 | sedang |
| Sulawesi Barat | banjir | gempa, tsunami | 155,69 | tinggi |
| Maluku | banjir, cuaca ekstrem | gempa, tsunami | 161,50 | tinggi |
| Maluku Utara | banjir, cuaca ekstrem, gempa | tsunami, gunung api | 145,09 | sedang |
| Papua | banjir, gelombang pasang/abrasi | gempa, tsunami | 137,43 | sedang |
| Papua Barat | banjir, longsor, gelombang pasang/abrasi | gempa, tsunami | 145,76 | tinggi |
| Papua Selatan | banjir, gelombang pasang/abrasi | gempa, tsunami | 138,20 | sedang |
| Papua Tengah | banjir | gempa, likuefaksi, tsunami | 116,49 | sedang |
| Papua Pegunungan | tanah longsor | banjir bandang, gempa | 102,05 | sedang |
| Papua Barat Daya | banjir | karhutla, banjir bandang, gempa | 148,44 | tinggi |

Catatan: daftar ancaman Jawa Timur di PDF identik dengan DIY (kemungkinan salin tata letak di sumber). Nilai IRBI 2024 untuk lima provinsi Papua pemekaran sama dengan 2023 (status "TETAP").

---

## 4. Nomor darurat resmi

| Nomor | Layanan | Sumber | Bukti |
|---|---|---|---|
| **112** | Layanan Nomor Tunggal Panggilan Darurat (kebakaran, kerusuhan, kecelakaan, bencana alam, kesehatan, keamanan). Diselenggarakan pemkab/pemkot (DKI: pemprov), jadi **ketersediaan bergantung daerah**. | Permenkominfo 10/2016, https://jdih.komdigi.go.id/produk_hukum/view/id/539/t/peraturan+menteri+komunikasi+dan+informatika+nomor+10+tahun+2016+tanggal+15+juli+2016 | [DIBACA] |
| **110** | Polisi | BNPB Buku Saku 2020 (Kontak Darurat) | [DIBACA] |
| **113** | Pemadam Kebakaran | BNPB Buku Saku 2020 | [DIBACA] |
| **115** | SAR / Basarnas (+ WhatsApp Rescue 115) | https://basarnas.go.id/ ; BNPB 2020 | [DIBACA] |
| **118 atau 119** | Ambulans | BNPB Buku Saku 2020 | [DIBACA] |
| **119** | Darurat medis SPGDT Kemenkes (juga lewat SATUSEHAT Mobile) | https://kemkes.go.id/id/akses-darurat-medis-119-kini-bisa-melalui-satusehat-mobile | [DIBACA] |
| **117** | Call Center BNPB / Pusdalops 24 jam | BNPB 2020; header www.bnpb.go.id | [DIBACA] |
| 0812-1237575 / 021-29827666 | Pusdalops BNPB | BNPB 2020 | [DIBACA] |
| 123 | PLN | BNPB 2020 | [DIBACA] |
| 108 | Penerangan (informasi) | BNPB 2020 | [DIBACA] |
| 1500-567 | Halo Kemenkes (non-darurat) | Kemenkes 2026 | [DIBACA] |
| 196 | Contact Center BMKG | bmkg.go.id | [DIBACA] |
| 021-4250767 / 021-4227875 | Sentra Informasi Keracunan | BNPB 2020 | [DIBACA] |
| 021-4207051 | PMI | BNPB 2020 | [DIBACA] |
| 022-7272606 | PVMBG | BNPB 2020 | [DIBACA] |

Daftar BPBD seluruh 34 provinsi (telepon dan situs) ada di lampiran Buku Saku BNPB 2019/2020 (hal. 79–85). Belum dimasukkan ke JSON. Nomor-nomor ini berasal dari 2019/2020 dan mungkin sudah berubah.

---

## 5. Celah dan kendala akses

| Topik | Status |
|---|---|
| BAPETEN (KI, nuklir) | HTTP 403 dari situs asal; hanya [CUPLIKAN] |
| BPBD Jawa Barat | HTTP 403 |
| bnpb.go.id (tanpa www) | HTTP 403; berhasil lewat path www.bnpb.go.id yang ditautkan halaman resmi |
| sma.kemdikbud.go.id (salinan buku saku) | ditolak proxy (tidak diperlukan, file asli BNPB terbaca) |
| magma.esdm.go.id | connection reset |
| PMI | situs JS, tidak ada konten terbaca |
| Kemhan/Polkam panduan warga | tidak ditemukan |
| Kemenkes daftar kotak P3K rumah tangga; stok obat pandemi | tidak ditemukan |
| Pengali air resmi untuk kekeringan/iklim panas | tidak disebutkan oleh sumber Indonesia |
| Kalori/kg pangan per orang | tidak disebutkan oleh sumber Indonesia |
| IRBI 2025 | flipbook Flash, tidak terbaca |
