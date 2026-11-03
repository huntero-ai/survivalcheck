# R4 — Amerika (AS, Kanada) + Standar Internasional

- Agent: R4 · Diakses: 2026-11-03 · Data terstruktur: `research/r4-americas-intl.json`
- Status verifikasi: **sebagian besar terverifikasi**. Sumber CDC, EPA, WHO, UNHCR/WFP, Sphere (pangan), dan IFRC dibaca utuh. FEMA/Ready.gov, Kanada, Sphere (WASH), dan Red Cross masih level cuplikan pencarian — lihat §0.

## 0. Catatan akses web (WAJIB dibaca PM / S2)

**Putaran 1 (network tertutup):**
- `WebFetch` ke ready.gov dan cdc.gov gagal (`getaddrinfo ENOTFOUND`).
- Riset dilakukan dengan `WebSearch` yang difilter ke domain resmi.

**Putaran 2 (setelah user membuka Network access):**
- Tool `WebFetch` masih gagal DNS (`ENOTFOUND`).
- `curl` lewat proxy sesi berfungsi. Halaman diunduh **dengan User-Agent bawaan curl, tanpa pemalsuan**. Dokumen dihosting UNHCR (PDF resmi Sphere/FNNE di emergency.unhcr.org) dipakai karena itu salinan resmi lembaga PBB, bukan mirror pihak ketiga.

| Domain | Hasil putaran 2 | Status angka |
|---|---|---|
| cdc.gov (air, bayi, ibu hamil, hewan, radiasi, pengolahan air) | 200 OK | **verified** |
| epa.gov (disinfeksi darurat; diperbarui 2026-02-24) | 200 OK | **verified** |
| cdn.who.int / who.int (TN9, HWT, halaman Humanitarian emergencies, PDF gizi ibu) | 200 OK | **verified** |
| emergency.unhcr.org (FNNE 2002/2004; bab Pangan + Appendix 6 Sphere 2018) | 200 OK | **verified** |
| ifrc.org PAPE PDF, wash.ifrc.org HWTS manual | 200 OK | **verified** |
| ready.gov, fema.gov | **HTTP 403 dari server (AkamaiGHost)** | cuplikan WebSearch |
| spherestandards.org, handbook.spherestandards.org | **HTTP 403 dari server** | WASH Sphere = cuplikan |
| redcross.org, cdc.gov/aging | HTTP 403 dari server | cuplikan |
| canada.ca, getprepared.gc.ca | server menutup koneksi (`Empty reply` / `HTTP2 INTERNAL_ERROR`) | cuplikan |

Di JSON, tiap objek punya field `verification`. Angka konstanta yang sudah dicek ke halaman utuh diberi tanda `[verified]` di `note`.

Konversi satuan dihitung oleh R4: 1 galon AS = 3,785 L; 1 ft = 0,3048 m.

---

## 1. Amerika Serikat

### 1.1 FEMA — Ready.gov "Build a Kit"
URL: https://www.ready.gov/kit · checklist PDF: https://www.ready.gov/sites/default/files/2024-05/ready_supply-kit-checklist.pdf

**Durasi target**
- Halaman kit sekarang: air & makanan untuk "beberapa hari" (*several days*). Checklist lama: **min. 3 hari**.
- Panduan "Are You Ready?" (2021): simpan air **3, 7, atau bahkan 14 hari**, tergantung lokasi — https://www.ready.gov/sites/default/files/2021-11/are-you-ready-guide.pdf
- Lokasi kit: satu kit lengkap di rumah, plus kit kecil di tempat kerja dan kendaraan.

**Air** (https://www.ready.gov/water)
- **1 galon (3,785 L)/orang/hari** untuk **minum + sanitasi**.
- Kebutuhan cairan orang yang aktif normal: **±¾ galon (±2,84 L)/hari** (dari air + minuman lain).
- **Suhu sangat panas: kebutuhan bisa berlipat dua.** Dokumen FEMA lama menyebut minimal 2 quart (±1,9 L) minum per hari, yang bisa berlipat dua di lingkungan panas atau saat aktivitas berat (https://www.fema.gov/pdf/library/f&web.pdf).
- Anak, ibu menyusui, dan orang sakit butuh lebih banyak — **tanpa angka**.

**Daftar item kit dasar**: air; makanan tidak mudah basi; radio baterai/engkol + NOAA Weather Radio; senter; P3K; baterai cadangan; peluit; masker debu (panduan 2021: beberapa N95 yang sudah di-*fit test*); plastik lembaran + gunting + lakban (untuk shelter-in-place); tisu basah, kantong sampah, pengikat plastik (sanitasi pribadi); kunci pas/tang (mematikan utilitas); pembuka kaleng manual; peta lokal; HP + charger + baterai cadangan.

**Kebutuhan khusus**
- Disabilitas (https://www.ready.gov/people-disabilities): obat resep untuk beberapa hari; oksigen cadangan; baterai ekstra alat medis/bantu; daftar obat, dosis, alergi, nomor seri alat; rencana untuk alat medis yang bergantung listrik.
- Lansia (https://www.ready.gov/sites/default/files/documents/files/older_americans.pdf): obat harian **min. 1 minggu**.
- Pengasuh: *cooler* + *ice pack* untuk obat yang harus didinginkan.

**Hewan peliharaan**
- PDF Ready.gov 2023 (https://www.ready.gov/sites/default/files/2023-06/ready.gov_prepare-pets-for-disasters.pdf): makanan untuk beberapa hari dalam wadah kedap udara dan tahan air, mangkuk air, dan air untuk beberapa hari.
- Siaran pers FEMA 2021 (https://www.fema.gov/press-release/20210318/include-your-animals-disaster-preparedness): makanan, air kemasan, dan obat untuk **min. 1 minggu** per hewan, plus pembuka kaleng manual.
- **Tidak ada angka L/hari atau g/hari.**

**Per skenario**

| Skenario | Item/aturan | URL |
|---|---|---|
| Listrik padam | Kulkas menjaga makanan tetap dingin ±**4 jam**, freezer penuh ±**48 jam** (pintu tertutup). Generator di luar ruangan, ≥20 ft (±6 m) dari jendela, pintu, dan garasi. Detektor CO bertenaga baterai di tiap lantai. Rencanakan alat medis listrik. Obat yang harus didinginkan umumnya dibuang bila listrik padam >1 hari, kecuali label berkata lain. | https://www.ready.gov/power-outages |
| Pandemi | Stok untuk tinggal di rumah **beberapa hari hingga beberapa minggu** (pembersih, makanan tidak mudah basi, obat resep, air kemasan). Beli bertahap. | https://www.ready.gov/pandemic |
| Banjir | Stok min. 3 hari; dokumen & elektronik di rak tinggi/lantai atas; bersihkan talang; pasang *check valve* pada pipa | https://www.ready.gov/sites/default/files/2021-11/are-you-ready-guide.pdf |
| Gempa | Ikat rak buku, kulkas, pemanas air, dan TV; barang berat di rak bawah; kit beberapa hari; senter, APAR, peluit; latihan Drop-Cover-Hold On | https://www.ready.gov/earthquakes |
| Nuklir / shelter-in-place | *Get Inside, Stay Inside, Stay Tuned*. Tetap di tempat paling terlindung selama **24 jam pertama**. Matikan kipas, AC, dan pemanas *forced-air*; tutup jendela, pintu, dan *damper* perapian; bawa hewan ke dalam. Setelah ledakan nuklir ada waktu ±10 menit atau lebih untuk mencari tempat berlindung sebelum *fallout* tiba. | https://www.ready.gov/radiation |

### 1.2 CDC ✅ (sebagian besar diverifikasi dari halaman utuh)
- **Air** (halaman diperbarui 2025-06-27):
  - "Store at least 1 gallon of water per person, per day for 3 days … for drinking, cooking, brushing teeth, and other uses. Try to store a 2-week supply if possible."
  - "Consider storing more water than this for pregnant women, people who are sick, pets, or if you live in a hot climate." Tidak ada angkanya.
  - Air isi sendiri diganti **tiap 6 bulan**. Simpan pada 50–70 °F (10–21 °C).
  - URL: https://www.cdc.gov/water-emergency/about/how-to-create-and-store-an-emergency-water-supply.html
- **Pengolahan air (CDC)** — https://www.cdc.gov/water-emergency/about/index.html (2024-09-19):
  - Rebus **1 menit**; **3 menit di atas 6.500 ft (±1.981 m)**.
  - Pemutih 5–9%: **2 tetes (0,1 mL) per liter**, 8 tetes (½ mL) per galon. Pemutih 1%: 10 tetes (½ mL) per liter.
  - Gandakan dosis bila air keruh, berwarna, atau sangat dingin. Diamkan **≥30 menit**.
  - Disinfektan kimia kurang efektif terhadap *Cryptosporidium* dan *Giardia* dibanding merebus.
- **Ibu hamil/bayi/anak** (checklist 2026-04-20) — https://www.cdc.gov/children-and-school-preparedness/resources/emergency-kit-checklist-pregnant-women-infants-and-children.html:
  - "Prescription medications (**at least 2 weeks supply**)".
  - Air "at least one gallon per person per day for several days … Consider storing more water than this if you are pregnant or lactating".
  - Perlengkapan hewan untuk beberapa hari.
  - Vitamin prenatal, air ekstra, botol/dot + formula (RTF atau bubuk), *cooler* kecil untuk ASI.
  - Periksa kit **tiap 6 bulan**.
- **Bayi** (https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/checklist.html, https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/preparedness.html):
  - Formula **siap minum (RTF)** paling aman (tidak perlu air, steril), cukup untuk **beberapa hari**; cek ulang tiap bulan karena bayi cepat tumbuh.
  - Bila memakai formula bubuk: air kemasan, wadah campur, dan takaran.
  - Popok: **min. 1 pak besar**; tisu basah: **min. 2 pak**; krim ruam, kantong *zip* ukuran galon, *bulb syringe*, termometer bayi, parasetamol bayi, boks portabel.
  - Menyusui adalah pilihan paling aman, jadi lanjutkan bila bisa.
  - **Tidak ada angka popok/hari atau mL formula/hari.**
- **Obat**:
  - **7–10 hari** dalam wadah tahan air dan aman anak, plus daftar obat (https://stacks.cdc.gov/view/cdc/80940, https://stacks.cdc.gov/view/cdc/139899/cdc_139899_DS1.pdf).
  - Checklist ibu hamil/anak: obat resep **min. 2 minggu**.
  - Pandemi: usahakan **2 minggu untuk semua obat** (https://stacks.cdc.gov/view/cdc/138803/cdc_138803_DS1.pdf).
  - Tanya dokter soal refill darurat 30 hari.
- **Hewan** (https://www.cdc.gov/healthy-pets/emergency-preparedness/preparedness-kit.html): makanan, air, dan obat **2 minggu** per hewan; obat kutu, caplak, dan cacing jantung 1 bulan; mangkuk anti-tumpah, pembuka kaleng manual, instruksi pemberian makan.
- **Pandemi**: stok air & makanan 2 minggu di rumah (3 hari untuk evakuasi); obat bebas (pereda nyeri, obat lambung, obat batuk/pilek, cairan elektrolit, vitamin) — https://stacks.cdc.gov/view/cdc/46451/cdc_46451_DS1.pdf
- **Radiasi** (https://www.cdc.gov/radiation-emergencies/response/get-inside.html): tetap di dalam **min. 24 jam**. Melepas pakaian lapisan luar menghilangkan hingga **90%** material radioaktif. Jangan keluar menjemput keluarga.

### 1.3 EPA — Disinfeksi air darurat ✅ (diperbarui 2026-02-24)
URL: https://www.epa.gov/ground-water-and-drinking-water/emergency-disinfection-drinking-water
- **Rebus**: didih bergolak (*rolling boil*) **≥1 menit**; **3 menit** "at altitudes above 5,000 feet (1,000 meters)". Konversi di halaman EPA tidak konsisten: 5.000 ft = ±1.524 m.
- **Pemutih tanpa pewangi 6% atau 8,25%**: **2 tetes per liter** (untuk kedua konsentrasi); per galon 8 tetes (6%) atau 6 tetes (8,25%).
  - Aduk, diamkan **30 menit**; air harus berbau klorin samar. Bila tidak, ulangi dosis dan tunggu 15 menit lagi.
  - **Gandakan dosis** bila air keruh, berwarna, atau sangat dingin. Pakai pemutih yang disimpan <1 tahun.
- **Tingtur yodium 2%**: **5 tetes per liter**, 10 tetes bila keruh; diamkan ≥30 menit. Hindari bila hamil, punya gangguan tiroid, atau alergi yodium (CDC).
- **Kaporit granul (HTH)**: 1 sdt munjung per 2 galon menghasilkan larutan ±500 mg/L; pakai 1 bagian larutan per 100 bagian air.
- **Tablet** (klorin, yodium, klorin dioksida): **ikuti label**, karena tidak ada dosis universal.
- Merebus atau klorinasi **tidak** menghilangkan logam berat, garam, atau kebanyakan bahan kimia.

### 1.4 American Red Cross *(secondary)*
URL: https://www.redcross.org/get-help/how-to-prepare-for-emergencies/survival-kit-supplies.html
- Air 1 galon/orang/hari: **3 hari untuk evakuasi, 2 minggu di rumah**. Makanan dengan pembagian yang sama.
- Obat **7 hari**.

---

## 2. Kanada — Public Safety Canada (Get Prepared) & Health Canada

**Durasi target**: mandiri **min. 72 jam**. Obat sebaiknya ±2 minggu; uang tunai untuk beberapa minggu kebutuhan dasar. — https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared/emergency-kits.html

**Air** ⚠ ada konflik antar-halaman:
- Checklist (https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared/emergency-kits/get-kit.html): **2 L/orang/hari** untuk minum, masak, dan higiene.
- Halaman "Emergency kits": **±4 L/orang/hari**.
- Health Canada (https://www.canada.ca/en/health-canada/services/food-drinking-water-safe-emergency.html): **2 L minum + ±2 L masak/bersih-bersih**, ditambah air untuk hewan dan botol kecil yang mudah dibawa.
- → Untuk rumus: **2 L minum, 4 L total**.

**Item kit**: air; makanan tidak mudah basi (diganti setahun sekali); pembuka kaleng manual; senter dan radio engkol/baterai; baterai cadangan dan *battery pack*; charger HP dan power bank; P3K (plester, gaza, antiseptik, sarung tangan, pereda nyeri, masker); **kunci cadangan mobil & rumah**; uang tunai pecahan kecil dan koin; salinan rencana darurat, kontak, dan dokumen identitas (fisik + digital); obat, alat medis, kacamata; formula/makanan bayi dan tisu basah; perlengkapan hewan; **tas *grab-and-go* per orang**.

**Hewan** (https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared/emergency-planning-resources/animals.html):
- Makanan dan air **min. 72 jam**. Air: **±4 L/hari untuk anjing rata-rata, ±1 L/hari untuk kucing rata-rata**.
- Kandang/*carrier*, tali, obat dan kontak dokter hewan, pasir/koran, P3K hewan, berkas hewan (foto, rekam medis).
- Sebagian besar shelter evakuasi hanya menerima hewan pemandu, jadi siapkan alternatif (hotel, penitipan, teman).

**Pengolahan air (Health Canada)**:
- Didih bergolak **1 menit**; **≥2 menit di atas 2.000 m**.
- Pemutih 5,25% tanpa pewangi: **±2 tetes (0,2 mL) per liter**, aduk, diamkan **30 menit**.
- Merebus tidak menghilangkan kontaminan kimia atau radiologis.
- URL: https://www.canada.ca/en/health-canada/services/publications/healthy-living/guidance-issuing-rescinding-boil-water-advisories-canadian-drinking-water-supplies.html

**Per skenario**

| Skenario | Item/aturan | URL |
|---|---|---|
| Listrik padam | Mandiri ≥72 jam; radio baterai/surya/engkol; daya cadangan portabel; freezer penuh beku **24–48 jam**; senter, bukan lilin; kompor gas jangan dipakai sebagai pemanas; cabut elektronik | https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared/hazards-emergencies/power-outages/how-prepare.html |
| Nuklir / shelter-in-place | Siap berlindung di tempat **min. 24 jam**; tutup pintu, jendela, dan *damper*; matikan kipas, AC, dan pemanas *forced-air*; **plastik + lakban**; kalium iodida hanya relevan dekat PLTN dan sesuai instruksi otoritas. Health Canada 2003: berlindung di tempat **tidak dimaksudkan >±2 hari**. | https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared/hazards-emergencies/radiological/how-prepare.html ; https://www.canada.ca/content/dam/hc-sc/migration/hc-sc/ewh-semt/alt_formats/hecs-sesc/pdf/pubs/radiation/guide-03/interventions-eng.pdf |
| Gempa | Ikat furnitur tinggi/berat dan peralatan ke rangka dinding; Drop-Cover-Hold On; kit di mobil | https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared/hazards-emergencies/earthquakes/how-prepare.html |
| Banjir | Dokumen di lantai atas; tangki BBM penuh; kit di mobil; rencanakan karung pasir; pergi saat diperintahkan | https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared/hazards-emergencies/floods/how-prepare.html |
| Pandemi | **Tidak ditemukan** panduan rumah tangga spesifik di canada.ca | — |

---

## 3. Standar internasional

### 3.1 Sphere Handbook 2018
URL: https://spherestandards.org/wp-content/uploads/Sphere-Handbook-2018-EN.pdf · interaktif: https://handbook.spherestandards.org/

- **Air (Appendix 3)**:

  | Kebutuhan | L/orang/hari |
  |---|---|
  | Bertahan hidup (minum + makanan) | **2,5–3**, tergantung iklim dan fisiologi |
  | Higiene dasar | **2–6** |
  | Masak dasar | **3–6** |
  | Total | **7,5–15** |

  Standar **min. 15 L/orang/hari**: ini *minimum*, bukan maksimum. Fase akut kekeringan: 7,5 L boleh untuk waktu singkat. Perkotaan berpenghasilan menengah: 50 L bisa jadi minimum. ⚠ Situs interaktif menyebut lingkungan panas/kering butuh alokasi lebih tinggi (±20 L), tetapi ini belum terkonfirmasi di teks cetak.
- **Sanitasi** (https://handbook.spherestandards.org/?handbook=Sphere&lang=english&chapter_id=ch006&section_id=ch006_005&match=toilet):
  - Toilet komunal min. 1 per 20 orang (1 per 50 di fase awal krisis mendadak).
  - **Volume ekskreta untuk perencanaan: 1–2 L/orang/hari.**
- **Higiene**: sabun mandi **250 g/orang/bulan**; sabun cuci **200 g/orang/bulan**; tambahan **250 g/bulan** untuk higiene menstruasi.
- **Pangan** ✅ (Appendix 6, PDF resmi bab Pangan dihosting UNHCR: https://emergency.unhcr.org/sites/default/files/2024-05/SphereFS+N.pdf):
  - Energi **2.100 kkal**, protein 53 g (10% energi), lemak 40 g (17% energi).
  - "These average population minimum requirements **incorporate the requirements of all age groups and both sexes** … **should not be used as requirements for an individual**." Angka ini sudah memperhitungkan ibu hamil dan menyusui.
  - Naikkan bila aktivitas di atas "light" (1,6 × BMR) atau suhu rata-rata <20 °C.
  - Sphere 2018 tidak memuat tabel per usia; tabelnya ada di FNNE Annex 1 (§3.3).
- Catatan: angka WASH Sphere (air, sabun, toilet) di atas masih level cuplikan, karena spherestandards.org membalas 403.

### 3.2 WHO ✅
- **TN9 "How much water is needed"** (diperbarui Juli 2013; https://cdn.who.int/media/docs/default-source/wash-documents/who-tn-09-how-much-water-is-needed.pdf):
  - Table 9.1: survival (drinking and food) **2,5–3 L** ("depends on climate and individual physiology"); higiene dasar **2–6 L**; masak dasar **3–6 L**; total **7,5–15 L**.
  - Pendekatan bertahap: penuhi kebutuhan *survival* dulu.
  - Table 9.2 menyebut **masjid 2–5 L/orang/hari untuk wudu dan minum** (relevan untuk Indonesia, angka fasilitas).
- **Halaman Humanitarian emergencies** (https://www.who.int/teams/environment-climate-change-and-health/water-sanitation-and-health/environmental-health-in-emergencies/humanitarian-emergencies):
  - "Based on estimates of requirements of **lactating women who engage in moderate physical activity in above-average temperatures**, a minimum of **7.5 litres** per capita per day will meet the requirements of most people under most conditions."
  - Dalam darurat minimal **15 L**; ±**20 L** untuk higiene dasar dan higiene pangan.
  - Residu klorin sistem perpipaan >0,5 mg/L.
- **Domestic Water Quantity, Service Level and Health, ed. 2** (https://iris.who.int/server/api/core/bitstreams/ca623971-c9ee-4a72-9f60-f2a389ffb5c7/content): minimum air **minum 5,3 L/orang/hari** (konteks umum); 20 L sering cukup untuk minum, masak, dan higiene dasar.
- **Pengolahan air rumah tangga** (https://cdn.who.int/media/docs/default-source/wash-documents/hwt-after-emergencies.pdf?sfvrsn=f28f139a_4):
  - Dosis klorin harus menyisakan **residu klorin bebas 0,4–0,5 mg/L setelah 30 menit**; air harus jernih; waktu kontak lebih lama bila air dingin.
  - Merebus: cukup sampai **mendidih bergolak lalu didinginkan** (GDWQ); WHO-EMRO menyarankan didihkan **≥3 menit** (https://applications.emro.who.int/dsaf/dsa605.pdf).
  - Merebus tidak meninggalkan residu desinfektan.

### 3.3 WFP / UNHCR / UNICEF / WHO — *Food and Nutrition Needs in Emergencies* (2002/2004) ✅
URL: https://emergency.unhcr.org/sites/default/files/2024-01/Food%20and%20nutrition%20needs%20in%20emergencies%202004.pdf (salinan WHO IRIS: https://iris.who.int/bitstream/handle/10665/68660/a83743.pdf)
- Angka perencanaan awal **2.100 kkal/orang/hari**; "was also designed to include the needs of pregnant and lactating women within the population".
- **Ibu hamil +285 kkal/hari; ibu menyusui +500 kkal/hari**. Angka ini juga ada di https://www.who.int/docs/default-source/documents/publications/maternal-nutrition-in-emergencies.pdf. Modul IFE UNHCR menyebut ±450 (cuplikan).
- Suhu <20 °C: +100 kkal per 5 °C → 15 °C +100; 10 °C +200; 5 °C +300; 0 °C +400.
- **Annex 1 — Kebutuhan energi per kelompok usia** (sumber: WHO 2000; profil negara berkembang; aktivitas ringan; BB dewasa L 60 kg / P 52 kg). Satuan kkal/orang/hari:

| Usia (tahun) | Laki-laki | Perempuan | Rata-rata L+P |
|---|---|---|---|
| 0 (<1) | 850 | 780 | 820 |
| 1 | 1.250 | 1.190 | 1.220 |
| 2 | 1.430 | 1.330 | 1.380 |
| 3 | 1.560 | 1.440 | 1.500 |
| 4 | 1.690 | 1.540 | 1.620 |
| 0–4 | 1.320 | 1.250 | 1.290 |
| 5–9 | 1.980 | 1.730 | 1.860 |
| 10–14 | 2.370 | 2.040 | 2.210 |
| 15–19 | 2.700 | 2.120 | 2.420 |
| 20–59 | 2.460 | 1.990 | 2.230 |
| 60+ | 2.010 | 1.780 | 1.890 |
| Hamil | — | +285 | +285 |
| Menyusui | — | +500 | +500 |
| Seluruh populasi | 2.250 | 1.910 | 2.080 |

### 3.4 IFRC ✅
- **PAPE** (https://www.ifrc.org/sites/default/files/PAPE-2.0-English.pdf):
  - "Store enough clean water and non-perishable food to survive for about a week – **25 to 30 litres (7 gallons) for each household member**. About half of this is for drinking or cooking and half for sanitation."
  - "… based on an estimated **two litres** for drinking and another **two for sanitation**. Include allocations for pets and service animals. Replace every six months."
  - Makanan ≥7 hari (cek kedaluwarsa tiap 6 bulan); ransum ±2.100 kalori/orang/hari. Dewasa minum ±2 L/hari dalam kondisi rata-rata.
  - **Item**: P3K + obat resep; masker debu; senter (surya/engkol/baterai); kantong plastik + pengikat untuk sanitasi; pemutih cair; plastik + lakban untuk menyegel jendela/pintu; pisau lipat serbaguna; korek; peluit; kertas & spidol; telepon + baterai cadangan; telepon rumah non-listrik; pakaian, jas hujan, sepatu kokoh, sarung tangan kerja; selimut & handuk; alat bantu (kacamata); kontak darurat + salinan dokumen (disimpan di luar rumah bila mungkin).
  - **Pengolahan air**: saring; rebus **≥1 menit** atau sampai muncul gelembung besar; pemutih **1 tetes per liter**, 8 tetes per galon, atau 1 tutup botol per jeriken 20 L, lalu diamkan 30 menit. ⚠ Dosis per liter ini lebih rendah dari CDC/EPA/Health Canada (2 tetes/L). Alternatif **SODIS**: botol bening di bawah sinar matahari langsung **6 jam**.
  - Contoh pesan gempa: tas evakuasi untuk rumah dan mobil berisi 1 galon air/orang/hari dan makanan untuk 3 hari.
- Pesan keluarga PAPE: https://www.ifrc.org/document/prepare-your-family-and-home-pape-messages
- **IFRC First Aid Guidelines 2020** (https://www.ifrc.org/sites/default/files/2022-02/EN_GFARC_GUIDELINES_2020.pdf): kit untuk kebutuhan dasar **3 hari pertama**.
- **Manual HWTS IFRC** (edisi 2, 2018; https://wash.ifrc.org/wp-content/uploads/2025/06/ifrc-hwts-manual-english.pdf): "Usually around **5 litres per person per day** is needed" untuk minum dan menyiapkan makanan mentah; "may vary depending on climate".
- **Rencana keluarga**: titik kumpul dan kontak di luar daerah sebagai "checkpoint" — https://www.ifrc.org/document/family-safety-plan-template

---

## 4. Tabel ANGKA TEKNIS untuk rumus

| Kunci | Nilai | Satuan | Berlaku untuk | Sumber | URL |
|---|---|---|---|---|---|
| Air total (AS) | 3,785 | L/orang/hari | semua; minum + sanitasi | FEMA/CDC | https://www.ready.gov/kit |
| Kebutuhan cairan | 2,84 | L/orang/hari | dewasa aktif normal | FEMA | https://www.ready.gov/water |
| Pengali panas | ×2 | — | cairan saat sangat panas | FEMA | https://www.ready.gov/water |
| Air minum (Kanada) | 2 | L/orang/hari | semua | Health Canada | https://www.canada.ca/en/health-canada/services/food-drinking-water-safe-emergency.html |
| Air total (Kanada) | 4 ⚠ | L/orang/hari | semua | Public Safety Canada | https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared/emergency-kits.html |
| Air *survival* ✅ | 2,5–3 | L/orang/hari | minum + makanan | Sphere/WHO TN9 | https://cdn.who.int/media/docs/default-source/wash-documents/who-tn-09-how-much-water-is-needed.pdf |
| Air higiene dasar | 2–6 | L/orang/hari | — | Sphere/WHO | sama |
| Air masak dasar | 3–6 | L/orang/hari | — | Sphere/WHO | sama |
| Air total kemanusiaan | 15 (min.) | L/orang/hari | kamp/pengungsian | Sphere/WHO | https://spherestandards.org/wp-content/uploads/Sphere-Handbook-2018-EN.pdf |
| Air IFRC ✅ | 25–30 (=2 L minum + 2 L sanitasi/hari) | L/orang/minggu | anggota rumah tangga | IFRC | https://www.ifrc.org/sites/default/files/PAPE-2.0-English.pdf |
| Ganti air simpanan | 6 | bulan | air isi sendiri | CDC/FEMA/IFRC | https://www.cdc.gov/water-emergency/about/how-to-create-and-store-an-emergency-water-supply.html |
| Tambahan air hamil/menyusui/sakit/iklim panas ✅ | tidak disebutkan (CDC: "consider storing more") | — | — | CDC/FEMA | https://www.cdc.gov/children-and-school-preparedness/resources/emergency-kit-checklist-pregnant-women-infants-and-children.html |
| Air anjing | 4 | L/ekor/hari | anjing rata-rata | Public Safety Canada | https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared/emergency-planning-resources/animals.html |
| Air kucing | 1 | L/ekor/hari | kucing rata-rata | Public Safety Canada | sama |
| Pakan hewan | tidak disebutkan | g/hari | — | — | — |
| Durasi stok hewan ✅ | 14 | hari | makanan, air, obat | CDC | https://www.cdc.gov/healthy-pets/emergency-preparedness/preparedness-kit.html |
| Kalori perencanaan ✅ | 2.100 | kkal/orang/hari | rata-rata POPULASI (sudah termasuk semua usia + hamil/menyusui; bukan untuk individu) | WFP/UNHCR/WHO; Sphere | https://iris.who.int/bitstream/handle/10665/68660/a83743.pdf |
| Tambahan hamil ✅ | +285 | kkal/hari | ibu hamil | WHO | https://www.who.int/docs/default-source/documents/publications/maternal-nutrition-in-emergencies.pdf |
| Tambahan menyusui | +500 (UNHCR IFE: 450) | kkal/hari | ibu menyusui | WHO | sama |
| Koreksi dingin ✅ | +100 | kkal per 5 °C di bawah 20 °C | populasi | WFP/UNHCR/WHO | https://www.unhcr.org/uk/sites/uk/files/legacy-pdf/45fa745b2.pdf |
| Kalori per usia ✅ | 0–4 th: 1.290; 5–9: 1.860; 10–14: 2.210; 15–19: 2.420; 20–59: 2.230; 60+: 1.890 (rinci per tahun & L/P di §3.3) | kkal/orang/hari | per kelompok usia | FNNE 2002 Annex 1 (WHO 2000) | https://emergency.unhcr.org/sites/default/files/2024-01/Food%20and%20nutrition%20needs%20in%20emergencies%202004.pdf |
| Kantong toilet | 1 | kantong/orang/hari | *packet latrine* (konteks kemanusiaan) | CDC (arsip) | https://archive.cdc.gov/www_cdc_gov/healthywater/global/sanitation/sanitation-emergency-response.html |
| Volume ekskreta | 1–2 | L/orang/hari | perencanaan | Sphere | https://handbook.spherestandards.org/?handbook=Sphere&lang=english&chapter_id=ch006&section_id=ch006_005&match=toilet |
| Sabun mandi | 250 | g/orang/bulan | semua | Sphere | sama |
| Rebus ✅ | 1 | menit | didih bergolak | CDC/EPA/Health Canada | https://www.epa.gov/ground-water-and-drinking-water/emergency-disinfection-drinking-water |
| Rebus dataran tinggi ✅ | 3 | menit | EPA: >5.000 ft (EPA menulis "1,000 meters"); CDC: >6.500 ft (±1.981 m); Health Canada: ≥2 menit >2.000 m (cuplikan) | EPA/CDC | https://www.cdc.gov/water-emergency/about/index.html |
| Pemutih 5–9% ✅ | 2 (0,1 mL) | tetes/L | air jernih; gandakan bila keruh/dingin. IFRC: 1 tetes/L; pemutih 1%: 10 tetes/L | CDC/EPA (+Health Canada cuplikan) | https://www.cdc.gov/water-emergency/about/index.html |
| Waktu kontak klorin ✅ | 30 | menit | — | EPA/HC/WHO | https://www.epa.gov/ground-water-and-drinking-water/emergency-disinfection-drinking-water |
| Residu klorin target ✅ | 0,4–0,5 | mg/L | setelah 30 menit | WHO | https://cdn.who.int/media/docs/default-source/wash-documents/hwt-after-emergencies.pdf?sfvrsn=f28f139a_4 |
| Yodium 2% ✅ | 5 (10 bila keruh) | tetes/L | — | EPA | https://www.epa.gov/ground-water-and-drinking-water/emergency-disinfection-drinking-water |
| Tablet penjernih | ikuti label | — | — | EPA | sama |
| Obat minimum | 7 (CDC: 7–10) | hari | pengguna obat resep | CDC | https://stacks.cdc.gov/view/cdc/80940 |
| Obat dianjurkan ✅ | 14 | hari | obat resep; pandemi | CDC / Public Safety Canada | https://www.cdc.gov/children-and-school-preparedness/resources/emergency-kit-checklist-pregnant-women-infants-and-children.html |
| Formula bayi ✅ | "beberapa hari" (RTF) | — | bayi formula | CDC | https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/preparedness.html |
| Popok ✅ | min. 1 pak besar (+2 pak tisu basah) | pak | bayi | CDC | https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/checklist.html |
| Kulkas aman | 4 | jam | listrik padam | FEMA | https://www.ready.gov/power-outages |
| Freezer penuh aman | 48 (Kanada 24–48) | jam | listrik padam | FEMA | sama |
| Shelter-in-place radiasi ✅ | 24 | jam | nuklir/radiologi | FEMA/CDC/Public Safety Canada | https://www.ready.gov/radiation |
| Jarak generator | ≥6,1 (20 ft) | m | generator portabel | FEMA | https://www.ready.gov/power-outages |
| Air masjid (wudu + minum) ✅ | 2–5 | L/orang/hari | fasilitas ibadah | WHO TN9 | https://cdn.who.int/media/docs/default-source/wash-documents/who-tn-09-how-much-water-is-needed.pdf |
| Minimum WHO (dasar: ibu menyusui, aktivitas sedang, suhu di atas rata-rata) ✅ | 7,5 | L/kapita/hari | semua | WHO | https://www.who.int/teams/environment-climate-change-and-health/water-sanitation-and-health/environmental-health-in-emergencies/humanitarian-emergencies |
| SODIS ✅ | 6 | jam | botol bening, sinar matahari langsung | IFRC | https://www.ifrc.org/sites/default/files/PAPE-2.0-English.pdf |

Tanda ✅ = diverifikasi dari halaman/PDF utuh pada 2026-11-03. Tanpa tanda = level cuplikan WebSearch.

### Usulan untuk S2 (pendapat R4, bukan angka sumber)
- **Air**: 3 L/orang/hari ≈ batas atas *survival* Sphere/WHO, mendekati 1 galon AS. Untuk total dengan higiene minimal ala Kanada, pakai 4 L. Pengali iklim panas: FEMA hanya menyebut "bisa berlipat dua" untuk cairan minum. Untuk Indonesia, pengali 1,5 pada porsi minum lebih konservatif daripada 2,0 pada total — keputusan ada di S2.
- **Hewan**: anjing 4 L/hari dan kucing 1 L/hari (Kanada) adalah satu-satunya angka resmi yang ditemukan.
- **Toilet**: angka "5 kantong/orang/hari" di PLAN §2 berasal dari Jepang (per penggunaan). Sumber AS/Internasional hanya memberi 1 kantong/orang/hari untuk *packet latrine* (konteks kemanusiaan), sehingga angka 5 harus diverifikasi oleh R1.
- **Kalori**: Sphere menegaskan 2.100 kkal adalah rata-rata populasi dan **tidak untuk individu**. Untuk rumah tangga, lebih tepat menjumlahkan kebutuhan per anggota dari FNNE Annex 1, misalnya dewasa 20–59 = 2.230 (atau per jenis kelamin), anak 5–9 = 1.860, lansia 60+ = 1.890, ditambah 285/500 untuk ibu hamil/menyusui. Bobot `orang_setara` di PLAN tersirat dari tabel ini: anak 5–9 ≈ 0,83 × dewasa, anak 1–4 ≈ 0,55–0,73, bayi <1 ≈ 0,37 (sebagian besar dari ASI/formula), lansia ≈ 0,85.

## 5. Celah data
1. **Pakan hewan g/hari**: tidak ada sumber resmi.
2. **Popok/hari dan mL formula/hari**: tidak ada sumber resmi (CDC hanya memberi jumlah pak / "beberapa hari").
3. **Kantong toilet per orang per hari untuk rumah tangga**: tidak ada di AS/Kanada/Sphere.
4. **Air tambahan untuk hamil/menyusui/anak**: hanya "lebih banyak", tanpa angka.
5. **Konflik air Kanada** 2 L vs 4 L belum terselesaikan tanpa membaca halaman utuh.
6. **Pandemi di Kanada**: tidak ditemukan panduan rumah tangga.
7. **FEMA/Ready.gov, Kanada, WASH Sphere, dan Red Cross** masih level cuplikan, karena server membalas 403 atau menutup koneksi walau network sudah dibuka (lihat §0). Perlu verifikasi manual lewat browser oleh manusia bila angka ini dipakai sebagai sumber utama.
8. **Dosis pemutih tidak seragam**: CDC/EPA 2 tetes/L, IFRC 1 tetes/L. Usulan: pakai 2 tetes/L (lebih konservatif, sumber pemerintah).
