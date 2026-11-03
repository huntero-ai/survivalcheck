# R4 — Amerika (AS, Kanada) + Standar Internasional

- Agent: R4 · Diakses: 2026-11-03 · Data terstruktur: `research/r4-americas-intl.json`
- Status verifikasi: **SEBAGIAN** — lihat §0.

## 0. Catatan akses web (WAJIB dibaca PM / S2)

| Tool | Hasil |
|---|---|
| `WebFetch https://www.ready.gov/kit` (+ `/water`, `/food`) | **GAGAL**: `getaddrinfo ENOTFOUND www.ready.gov` — domain di luar allowlist jaringan sesi |
| `WebFetch https://www.cdc.gov/water-emergency/...` | **GAGAL**: `getaddrinfo ENOTFOUND www.cdc.gov` — alasan sama |
| `WebSearch` (dengan `allowed_domains` resmi) | **BERHASIL** |

Karena tool menyuruh berhenti mencoba host lain setelah dua host gagal, WebFetch tidak dipakai lagi. Riset dilanjutkan **hanya dengan WebSearch yang difilter ke domain resmi** (ready.gov, fema.gov, cdc.gov, epa.gov, canada.ca, getprepared.gc.ca, spherestandards.org, who.int, unhcr.org, wfp.org, ifrc.org; redcross.org sebagai *secondary*).
Akibatnya:
- Semua angka berasal dari **cuplikan hasil pencarian** di halaman resmi itu, bukan dari halaman yang dibaca utuh. Di JSON ditandai `"verification": "search_snippet_only"`.
- Tanggal "last updated" halaman sebagian besar **tidak bisa dipastikan**.
- **Saran:** sebelum Fase 3, izinkan domain `ready.gov, cdc.gov, canada.ca, spherestandards.org, who.int, unhcr.org, ifrc.org, epa.gov` di pengaturan jaringan sesi, lalu verifikasi ulang angka bertanda ⚠.

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

### 1.2 CDC
- **Air**: min. 1 galon/orang/hari selama 3 hari; **usahakan stok 2 minggu**. Simpan lebih banyak di iklim panas, saat musim panas, atau di daerah rawan kekeringan. Air isi sendiri diganti **tiap 6 bulan**; air kemasan mengikuti tanggal kedaluwarsa. Simpan pada 50–70 °F (10–21 °C), memakai wadah *food-grade*. — https://www.cdc.gov/water-emergency/about/how-to-create-and-store-an-emergency-water-supply.html
- **Ibu hamil/menyusui**: simpan air lebih banyak (tanpa angka); vitamin prenatal, pembalut, pakaian, handuk bersih, sarung tangan. — https://www.cdc.gov/children-and-school-preparedness/resources/emergency-kit-checklist-pregnant-women-infants-and-children.html
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

### 1.3 EPA — Disinfeksi air darurat
URL: https://www.epa.gov/ground-water-and-drinking-water/emergency-disinfection-drinking-water
- **Rebus**: didih bergolak (*rolling boil*) **≥1 menit**; **3 menit** di atas 5.000 ft (±1.524 m). CDC memakai ambang 6.500 ft (±1.981 m).
- **Pemutih tanpa pewangi**: **8 tetes (6%)** atau **6 tetes (8,25%) per galon** (≈2 tetes/L). Aduk, diamkan **30 menit**. **Gandakan dosis** bila air keruh, berwarna, atau sangat dingin. Bila air tidak berbau klorin, ulangi dosis dan tunggu 15 menit lagi. Pakai pemutih yang disimpan <1 tahun.
- **Tingtur yodium 2%**: 5 tetes per liter. Hindari bila hamil, punya gangguan tiroid, atau alergi yodium (peringatan CDC).
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
- **Pangan**: **2.100 kkal/orang/hari**, 10–12% energi dari protein; disesuaikan dengan demografi (Appendix 6). ⚠ Tabel per usia tidak berhasil diambil.

### 3.2 WHO
- **TN9 "How much water is needed"** (https://cdn.who.int/media/docs/default-source/wash-documents/who-tn-09-how-much-water-is-needed.pdf): angkanya sama dengan Sphere (2,5–3 / 2–6 / 3–6 / total 7,5–15 L). Pendekatan bertahap: penuhi kebutuhan *survival* dulu.
- **Halaman Humanitarian emergencies** (https://www.who.int/teams/environment-climate-change-and-health/water-sanitation-and-health/environmental-health-in-emergencies/humanitarian-emergencies): min. 15 L/orang/hari secepatnya; ±20 L untuk higiene dasar dan higiene pangan.
- **Domestic Water Quantity, Service Level and Health, ed. 2** (https://iris.who.int/server/api/core/bitstreams/ca623971-c9ee-4a72-9f60-f2a389ffb5c7/content): minimum air **minum 5,3 L/orang/hari** (konteks umum); 20 L sering cukup untuk minum, masak, dan higiene dasar.
- **Pengolahan air rumah tangga** (https://cdn.who.int/media/docs/default-source/wash-documents/hwt-after-emergencies.pdf?sfvrsn=f28f139a_4):
  - Dosis klorin harus menyisakan **residu klorin bebas 0,4–0,5 mg/L setelah 30 menit**; air harus jernih; waktu kontak lebih lama bila air dingin.
  - Merebus: cukup sampai **mendidih bergolak lalu didinginkan** (GDWQ); WHO-EMRO menyarankan didihkan **≥3 menit** (https://applications.emro.who.int/dsaf/dsa605.pdf).
  - Merebus tidak meninggalkan residu desinfektan.

### 3.3 WFP / UNHCR / UNICEF / WHO — *Food and Nutrition Needs in Emergencies* (2002/2004)
URL: https://iris.who.int/bitstream/handle/10665/68660/a83743.pdf
- Angka perencanaan awal **2.100 kkal/orang/hari** (populasi tipikal, aktivitas ringan).
- **Ibu hamil +285 kkal/hari; ibu menyusui +500 kkal/hari** — https://www.who.int/docs/default-source/documents/publications/maternal-nutrition-in-emergencies.pdf. Modul IFE UNHCR menyebut ±450 kkal untuk ibu menyusui.
- Suhu <20 °C: **+100 kkal per 5 °C di bawah 20 °C** — https://www.unhcr.org/uk/sites/uk/files/legacy-pdf/45fa745b2.pdf
- ⚠ **Tabel per kelompok usia (bayi, anak, remaja, lansia) TIDAK berhasil diambil.**

### 3.4 IFRC
- **PAPE** (https://www.ifrc.org/sites/default/files/PAPE-2.0-English.pdf, https://www.ifrc.org/document/prepare-your-family-and-home-pape-messages): air & makanan untuk **±1 minggu**, yaitu **25–30 L per anggota rumah tangga** (≈3,6–4,3 L/hari); makanan ≥7 hari; ganti air tiap 6 bulan; radio, senter, baterai, P3K, obat, penjernih air, uang tunai, salinan dokumen.
- **IFRC First Aid Guidelines 2020** (https://www.ifrc.org/sites/default/files/2022-02/EN_GFARC_GUIDELINES_2020.pdf): kit untuk kebutuhan dasar **3 hari pertama**.
- **Manual HWTS IFRC** (https://wash.ifrc.org/wp-content/uploads/2025/06/ifrc-hwts-manual-english.pdf): ±5 L/orang/hari untuk minum dan menyiapkan makanan mentah.
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
| Air *survival* | 2,5–3 | L/orang/hari | minum + makanan | Sphere/WHO TN9 | https://cdn.who.int/media/docs/default-source/wash-documents/who-tn-09-how-much-water-is-needed.pdf |
| Air higiene dasar | 2–6 | L/orang/hari | — | Sphere/WHO | sama |
| Air masak dasar | 3–6 | L/orang/hari | — | Sphere/WHO | sama |
| Air total kemanusiaan | 15 (min.) | L/orang/hari | kamp/pengungsian | Sphere/WHO | https://spherestandards.org/wp-content/uploads/Sphere-Handbook-2018-EN.pdf |
| Air IFRC | 25–30 | L/orang/minggu | anggota rumah tangga | IFRC | https://www.ifrc.org/sites/default/files/PAPE-2.0-English.pdf |
| Ganti air simpanan | 6 | bulan | air isi sendiri | CDC/FEMA/IFRC | https://www.cdc.gov/water-emergency/about/how-to-create-and-store-an-emergency-water-supply.html |
| Tambahan air hamil/menyusui/anak | tidak disebutkan | — | — | CDC/FEMA | https://www.cdc.gov/children-and-school-preparedness/resources/emergency-kit-checklist-pregnant-women-infants-and-children.html |
| Air anjing | 4 | L/ekor/hari | anjing rata-rata | Public Safety Canada | https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared/emergency-planning-resources/animals.html |
| Air kucing | 1 | L/ekor/hari | kucing rata-rata | Public Safety Canada | sama |
| Pakan hewan | tidak disebutkan | g/hari | — | — | — |
| Durasi stok hewan | 14 | hari | makanan, air, obat | CDC | https://www.cdc.gov/healthy-pets/emergency-preparedness/preparedness-kit.html |
| Kalori perencanaan | 2.100 | kkal/orang/hari | rata-rata populasi | WFP/UNHCR/WHO; Sphere | https://iris.who.int/bitstream/handle/10665/68660/a83743.pdf |
| Tambahan hamil | +285 | kkal/hari | ibu hamil | WHO | https://www.who.int/docs/default-source/documents/publications/maternal-nutrition-in-emergencies.pdf |
| Tambahan menyusui | +500 (UNHCR IFE: 450) | kkal/hari | ibu menyusui | WHO | sama |
| Koreksi dingin | +100 | kkal per 5 °C di bawah 20 °C | populasi | WFP/UNHCR/WHO | https://www.unhcr.org/uk/sites/uk/files/legacy-pdf/45fa745b2.pdf |
| Kalori per usia | ⚠ tidak berhasil diambil | — | — | Sphere App. 6 | https://spherestandards.org/wp-content/uploads/Sphere-Handbook-2018-EN.pdf |
| Kantong toilet | 1 | kantong/orang/hari | *packet latrine* (konteks kemanusiaan) | CDC (arsip) | https://archive.cdc.gov/www_cdc_gov/healthywater/global/sanitation/sanitation-emergency-response.html |
| Volume ekskreta | 1–2 | L/orang/hari | perencanaan | Sphere | https://handbook.spherestandards.org/?handbook=Sphere&lang=english&chapter_id=ch006&section_id=ch006_005&match=toilet |
| Sabun mandi | 250 | g/orang/bulan | semua | Sphere | sama |
| Rebus | 1 | menit | didih bergolak | CDC/EPA/Health Canada | https://www.epa.gov/ground-water-and-drinking-water/emergency-disinfection-drinking-water |
| Rebus dataran tinggi | 3 | menit | >5.000 ft / ±1.524 m (EPA); >6.500 ft (CDC); Health Canada: ≥2 menit >2.000 m | EPA/CDC | sama |
| Pemutih 5,25–6% | 2 | tetes/L | air jernih | Health Canada/EPA | https://www.canada.ca/en/health-canada/services/food-drinking-water-safe-emergency.html |
| Waktu kontak klorin | 30 | menit | — | EPA/HC/WHO | https://www.epa.gov/ground-water-and-drinking-water/emergency-disinfection-drinking-water |
| Residu klorin target | 0,4–0,5 | mg/L | setelah 30 menit | WHO | https://cdn.who.int/media/docs/default-source/wash-documents/hwt-after-emergencies.pdf?sfvrsn=f28f139a_4 |
| Yodium 2% | 5 | tetes/L | — | EPA | https://www.epa.gov/ground-water-and-drinking-water/emergency-disinfection-drinking-water |
| Tablet penjernih | ikuti label | — | — | EPA | sama |
| Obat minimum | 7 (CDC: 7–10) | hari | pengguna obat resep | CDC | https://stacks.cdc.gov/view/cdc/80940 |
| Obat dianjurkan | 14 | hari | obat resep; pandemi | CDC / Public Safety Canada | https://www.cdc.gov/children-and-school-preparedness/resources/emergency-kit-checklist-pregnant-women-infants-and-children.html |
| Formula bayi | "beberapa hari" (RTF) | — | bayi formula | CDC | https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/preparedness.html |
| Popok | min. 1 pak besar (+2 pak tisu basah) | pak | bayi | CDC | https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/checklist.html |
| Kulkas aman | 4 | jam | listrik padam | FEMA | https://www.ready.gov/power-outages |
| Freezer penuh aman | 48 (Kanada 24–48) | jam | listrik padam | FEMA | sama |
| Shelter-in-place radiasi | 24 | jam | nuklir/radiologi | FEMA/CDC/Public Safety Canada | https://www.ready.gov/radiation |
| Jarak generator | ≥6,1 (20 ft) | m | generator portabel | FEMA | https://www.ready.gov/power-outages |

### Usulan untuk S2 (pendapat R4, bukan angka sumber)
- **Air**: 3 L/orang/hari ≈ batas atas *survival* Sphere/WHO, mendekati 1 galon AS. Untuk total dengan higiene minimal ala Kanada, pakai 4 L. Pengali iklim panas: FEMA hanya menyebut "bisa berlipat dua" untuk cairan minum. Untuk Indonesia, pengali 1,5 pada porsi minum lebih konservatif daripada 2,0 pada total — keputusan ada di S2.
- **Hewan**: anjing 4 L/hari dan kucing 1 L/hari (Kanada) adalah satu-satunya angka resmi yang ditemukan.
- **Toilet**: angka "5 kantong/orang/hari" di PLAN §2 berasal dari Jepang (per penggunaan). Sumber AS/Internasional hanya memberi 1 kantong/orang/hari untuk *packet latrine* (konteks kemanusiaan), sehingga angka 5 harus diverifikasi oleh R1.
- **Kalori**: 2.100 kkal adalah **rata-rata populasi** yang sudah memperhitungkan anak. Bila memakai bobot `orang_setara`, jangan menerapkan 2.100 penuh ke anak dan sekaligus mengalikan bobot — hindari hitungan ganda.

## 5. Celah data
1. **Kalori per kelompok usia** (Sphere Appendix 6 / WHO-UNHCR 2002): tidak berhasil diambil.
2. **Pakan hewan g/hari**: tidak ada sumber resmi.
3. **Popok/hari dan mL formula/hari**: tidak ada sumber resmi (CDC hanya memberi jumlah pak / "beberapa hari").
4. **Kantong toilet per orang per hari untuk rumah tangga**: tidak ada di AS/Kanada/Sphere.
5. **Air tambahan untuk hamil/menyusui/anak**: hanya "lebih banyak", tanpa angka.
6. **Konflik air Kanada** 2 L vs 4 L belum terselesaikan tanpa membaca halaman utuh.
7. **Pandemi di Kanada**: tidak ditemukan panduan rumah tangga.
8. **Semua angka** perlu verifikasi fetch langsung setelah domain diizinkan (lihat §0).
