# Sumber Rujukan SurvivalCheck

Dibuat oleh agent S1, 2026-11-03. Semua baris diambil dari `research/r0`-`r5` (tanpa riset web baru, URL tidak diubah). Setiap `sources` di `data/items.json` merujuk ID di tabel ini.

**Penanda bukti** (aturan P-2 di `docs/decisions.md`):

- **DIBACA**: dokumen/halaman resmi diunduh dan dibaca oleh agent riset.
- **CUPLIKAN**: hanya dari cuplikan hasil pencarian atau halaman tidak bisa dibuka server. Angka dari sumber ini hanya dipakai bila tidak ada alternatif, diberi `evidence: CUPLIKAN` di items.json, dan wajib dicek Q1.

Item `evidence: DIBACA` bila minimal satu sumbernya DIBACA (kecuali ditimpa manual untuk angka yang hanya berasal dari cuplikan, mis. air hewan, sabun, kulkas saat padam).

**Catatan sitasi BNPB 2026 (D-044):** URL PDF berada di path `.../uploaded_files/temporary/...` dan berisiko mati. Sitasi harus selalu memuat judul lengkap, penerbit (BNPB), dan tahun (Cetakan Pertama 2026). Pada 2026-11-03 URL membalas HTTP 200, application/pdf, 11,98 MB.

**Pola umum:** kebijakan panduan cepat berubah (防災庁 berdiri 2026-11-02, UK Be Ready 2026-10-22, MCF 2026-01-01). Kolom `last_updated_by_source` dijaga untuk review berkala. Klaim '53 negara' tidak dipakai (D-041).

Kolom 'Item' = jumlah item di `items.json` yang memakai sumber itu.

## Indonesia

| ID | Judul | Lembaga | URL | Diakses | last_updated_by_source | Bukti | Item |
|---|---|---|---|---|---|---|---|
| `ID-BNPB-2026` | Keluarga Siaga Bencana: Panduan Anti Panik Saat Gempa, Banjir & Krisis Darurat (Cetakan Pertama 2026) | BNPB (Pusat Data, Informasi dan Komunikasi Kebencanaan) | <https://perpustakaan.bnpb.go.id/inlislite/uploaded_files/temporary/DigitalCollection/OThjMzRiZDFlMDU2OWYzNzQ5ZjliYWI0Nzg3ODkxMTQxNTE0NDIzNg==.pdf> | 2026-11-03 | 2026 (cetakan pertama 2026; metadata PDF 2026-05-11) | DIBACA | 60 |
| `ID-BNPB-BS2020` | Buku Saku Tanggap Tangkas Tangguh Menghadapi Bencana (cetakan ke-5, 2020; isi Tas Siaga sama dengan cetakan ke-4, 2019) | BNPB | <https://www.bnpb.go.id/storage/app/media/Buku%20BNPB/Buku%20Saku%20Bencana%20BNPB.pdf> | 2026-11-03 | 2020 (PDF dibuat 2020-11-26) | DIBACA | 53 |
| `ID-BMKG-MITIGASI` | Antisipasi Gempabumi (halaman mitigasi BMKG) | BMKG | <https://www.bmkg.go.id/gempabumi/mitigasi/antisipasi-gempabumi> | 2026-11-03 | tidak disebutkan di halaman | DIBACA | 9 |
| `ID-BMKG-BUKUSAKU` | Buku Saku Mengenal Gempabumi & Tsunami | BMKG | <https://content.bmkg.go.id/wp-content/uploads/BMKG_Buku-Saku-Gempabumi-dan-Tsunami.pdf> | 2026-11-03 | 2020 (PDF dibuat 2020-10-19) | DIBACA | 3 |
| `ID-BMKG-EDUKASI` | Edukasi Gempabumi dan Tsunami (Gerakan Sadar Tas Siaga Bencana 72 jam; booklet BMKG-JICA disabilitas) | BMKG | <https://www.bmkg.go.id/gempabumi/mitigasi/edukasi-gempabumi-tsunami> | 2026-11-03 | booklet disabilitas 2025 | DIBACA | 1 |
| `ID-BMKG-EVAKUASI` | Siaran pers: Evakuasi ke tempat aman, bukan eksodus (evakuasi mandiri tsunami) | BMKG | <https://www.bmkg.go.id/siaran-pers/bmkg-evakuasi-ke-tempat-aman-bukan-eksodus> | 2026-11-03 | 2021-01-17 | DIBACA | 1 |
| `ID-BMKG-BAUBAU` | BMKG soroti kerentanan pesisir Baubau, dorong mitigasi gempa bumi hingga banjir rob (rumus 20-20-20) | BMKG | <https://www.bmkg.go.id/berita/daerah/bmkg-soroti-kerentanan-pesisir-baubau-dorong-mitigasi-gempa-bumi-hingga-banjir-rob> | 2026-11-03 | 2026-06-25 | CUPLIKAN | 1 |
| `ID-BMKG-KEMARAU` | Kesiapsiagaan hadapi kemarau: BMKG ajak pemerintah daerah perkuat antisipasi kekeringan | BMKG | <https://www.bmkg.go.id/berita/kesiapsiagaan-hadapi-kemarau-bmkg-ajak-pemerintah-daerah-perkuat-antisipasi-kekeringan> | 2026-11-03 | 2026-06-05 | DIBACA | 1 |
| `ID-PVMBG-ESDM` | Gunung Ibu Erupsi, Warga Diminta Waspadai Hujan Abu (Badan Geologi/PVMBG) | Badan Geologi PVMBG, Kementerian ESDM | <https://esdm.go.id/id/media-center/arsip-berita/gunung-ibu-erupsi-warga-diminta-waspadai-hujan-abu> | 2026-11-03 | 2025-08-04 | DIBACA | 3 |
| `ID-KEMENKES-2014` | Kebutuhan Air Bersih pada Musim Banjir | Kementerian Kesehatan RI | <https://kemkes.go.id/id/kebutuhan-air-bersih-pada-musim-banjir> | 2026-11-03 | 2014-01-13 | DIBACA | 4 |
| `ID-KEMENKES-BANJIR` | Antisipasi Penyakit Menular saat Banjir | Kementerian Kesehatan RI | <https://kemkes.go.id/id/antisipasi-penyakit-menular-saat-banjir> | 2026-11-03 | 2012-04-07 | DIBACA | 1 |
| `ID-KEMENKES-ASAP` | Menkes: Pakai masker dan pantau kualitas udara untuk cegah dampak asap karhutla | Kementerian Kesehatan RI | <https://kemkes.go.id/id/menkes-pakai-masker-dan-pantau-kualitas-udara-untuk-cegah-dampak-asap-karhutla> | 2026-11-03 | 2026-08-21 | DIBACA | 2 |
| `ID-KEMENKES-ASAP-N95` | Kemenkes perkuat perlindungan kesehatan warga terdampak kabut asap di Palangka Raya | Kementerian Kesehatan RI | <https://www.kemkes.go.id/id/kemenkes-perkuat-perlindungan-kesehatan-warga-terdampak-kabut-asap-di-palangka-raya> | 2026-11-03 | 2026-10-23 | DIBACA | 2 |
| `ID-KEMENKES-WABAH` | Kemenkes ajak warga terdampak banjir waspadai risiko wabah di pengungsian | Kementerian Kesehatan RI | <https://kemkes.go.id/id/kemenkes-ajak-warga-terdampak-banjir-waspadai-risiko-wabah-di-pengungsian> | 2026-11-03 | 2025-12-17 | DIBACA | 2 |
| `ID-KEMENKES-119` | Akses darurat medis 119 kini bisa melalui SATUSEHAT Mobile | Kementerian Kesehatan RI | <https://kemkes.go.id/id/akses-darurat-medis-119-kini-bisa-melalui-satusehat-mobile> | 2026-11-03 | 2024 | DIBACA | 1 |
| `ID-BPBD-DIY` | Siap Hadapi Darurat, Mulai dengan Tas Siaga Bencana | BPBD Daerah Istimewa Yogyakarta | <https://bpbd.jogjaprov.go.id/berita/siap-hadapi-darurat-mulai-dengan-tas-siaga-bencana-> | 2026-11-03 | 2024-09-20 | DIBACA | 13 |
| `ID-IRBI-2024` | Buku Indeks Risiko Bencana Indonesia (IRBI) Tahun 2024 | BNPB (InaRISK) | <https://inarisk.bnpb.go.id/pdf/BUKU%20IRBI%202024.pdf> | 2026-11-03 | 2024 (PDF dibuat 2025-05-02) | DIBACA | 0 |
| `ID-BAPETEN-2017` | Pedoman perencanaan kesiapsiagaan dan penanggulangan kedaruratan reaktor nuklir | BAPETEN (Badan Pengawas Tenaga Nuklir) | <https://www.bapeten.go.id/dokumen/document-item/unduh?filename=2017_Pedoman_perencanaan_kesiapsiagaan_dan_penanggulangan_kedaruratan_reaktor_nuklir.pdf> | 2026-11-03 | 2017 | CUPLIKAN | 1 |
| `ID-PMI` | Palang Merah Indonesia (situs resmi) | PMI | <https://pmi.or.id/> | 2026-11-03 | tidak disebutkan | CUPLIKAN | 0 |
| `ID-BASARNAS` | Basarnas (situs resmi) | Basarnas | <https://basarnas.go.id/> | 2026-11-03 | tidak disebutkan | CUPLIKAN | 0 |

## Asia-Pasifik

| ID | Judul | Lembaga | URL | Diakses | last_updated_by_source | Bukti | Item |
|---|---|---|---|---|---|---|---|
| `JP-BOUSAI-2026` | Urgent Request for Stronger Pre-Disaster Preparedness (Public) | Disaster Management Agency (防災庁; berdiri 2026-11-02) | <https://www.bousai.go.jp/common2026/pdf/Urgent_Request_for_Stronger_Pre_Disaster_Preparedness_Public.pdf> | 2026-11-03 | 2026-11-02 | DIBACA | 1 |
| `JP-CAO-CHECK` | Checklist persiapan bencana rumah tangga | Cabinet Office Jepang (bousai.go.jp) | <https://www.bousai.go.jp/kyoiku/hokenkyousai/check.html> | 2026-11-03 | tidak disebutkan | DIBACA | 0 |
| `JP-CAO-TOILET-2022` | Pedoman toilet di tempat pengungsian (revisi 2022-04) | Cabinet Office Jepang | <https://www.bousai.go.jp/taisaku/hinanjo/pdf/2204hinanjo_toilet_guideline.pdf> | 2026-11-03 | 2022-04 (revisi lanjutan 2024-12-13) | DIBACA | 1 |
| `JP-TOKYO-2025` | Pamflet persiapan bencana Tokyo 'R7.11' (pamph_r7_11) | Pemerintah Metropolitan Tokyo (Tokyo Bousai) | <https://www.bousai.metro.tokyo.lg.jp/_res/common/bichiku/pamph_r7_11.pdf> | 2026-11-03 | 2025-11 | DIBACA | 10 |
| `JP-TOKYO-TOILET-2025` | Artikel toilet darurat: 5 kali/orang/hari | Pemerintah Metropolitan Tokyo (Koho Tokyo) | <https://www.koho.metro.tokyo.lg.jp/2025/09/01-1.html> | 2026-11-03 | 2025-09 | DIBACA | 1 |
| `JP-MAFF` | Panduan stok pangan darurat rumah tangga (foodstock, bab 1) | Kementerian Pertanian, Kehutanan, dan Perikanan Jepang (MAFF) | <https://www.maff.go.jp/j/zyukyu/foodstock/chapter01.html> | 2026-11-03 | edisi 2026-03 (materi terkait) | DIBACA | 9 |
| `JP-ENV-PET` | Panduan hewan peliharaan saat bencana (edisi r07_04) | Kementerian Lingkungan Jepang | <https://www.env.go.jp/nature/dobutsu/aigo/2_data/saigai_guide_pet/r07_04/mat02_2.pdf> | 2026-11-03 | 2025-04 (kode r07_04) | DIBACA | 1 |
| `KR-MOIS` | Pedoman perilaku keadaan darurat (비상사태 행동요령) dan perlengkapan darurat | Kementerian Dalam Negeri dan Keselamatan Korea (MOIS), Safety Korea | <https://safekorea.go.kr/safekorea-kor/acts/nacts/action-guide.do?category=stateOfEmergency&actsHeaderTitle=%EB%B9%84%EC%83%81%EC%82%AC%ED%83%9C&menuSn=4> | 2026-11-03 | tidak disebutkan (portal bermigrasi ke 국민안전24) | DIBACA | 5 |
| `TW-MND` | Stok rumah tangga (日常居家儲備) - Panduan 'In Case of Crisis' | Kementerian Pertahanan Taiwan (All-out Defense Mobilization Agency) | <https://prepare.mnd.gov.tw/emergency-supplies/household-supplies> | 2026-11-03 | 2025-09-16 (buku panduan); situs 2025-2026 | DIBACA | 15 |
| `SG-SCDF-2026` | Civil Defence Emergency Handbook, edisi ke-10 (2026) dan Ready Bag | Singapore Civil Defence Force (SCDF) | <https://www.scdf.gov.sg/docs/default-source/comm.---volunteers-(docs)/(2026)-scdf-emergency-handbook-(english).pdf?sfvrsn=1407b4dd_1> | 2026-11-03 | 2026 | DIBACA | 7 |
| `PH-OSG-2024` | TOR Emergency Go Bags NEP FY2024 (go bag 72 jam sesuai NDRRMC) | Office of the Solicitor General Filipina (dokumen pengadaan), mengutip NDRRMC | <https://osg.gov.ph/public/documents/procurement/bidding/2023/023-11-220/TOR%20Emergency%20Go%20Bags%20NEP%20FY2024.pdf> | 2026-11-03 | FY2024 | DIBACA | 3 |
| `AU-QLD-KIT` | Get Ready Queensland: Emergency Kit checklist | Pemerintah Queensland, Australia | <https://www.getready.qld.gov.au/sites/default/files/2023-12/GRQ%20Emergency%20Kit%20checklist.pdf> | 2026-11-03 | 2023-12 | DIBACA | 14 |
| `AU-QLD-PETS` | Get Ready Queensland: Pets | Pemerintah Queensland, Australia | <https://www.getready.qld.gov.au/pets> | 2026-11-03 | tidak disebutkan | DIBACA | 1 |
| `AU-NEMA-STORM` | Your cyclone and storm resilient home (v2) | National Emergency Management Agency (NEMA) Australia | <https://www.nema.gov.au/sites/default/files/2025-05/NEMA_Cyclone%20and%20Storm_VERSION-2-290425.pdf> | 2026-11-03 | 2025-04/05 | CUPLIKAN | 1 |
| `NZ-GETREADY` | Get Ready NZ: Household supplies | National Emergency Management Agency (NEMA) Selandia Baru | <https://getready.govt.nz/prepared/household/supplies> | 2026-11-03 | tidak disebutkan | CUPLIKAN | 4 |
| `NZ-AKL-WATER` | Auckland Emergency Management: Store water | Auckland Emergency Management (lokal) | <https://www.aucklandemergencymanagement.govt.nz/get-prepared/get-home-ready/store-water> | 2026-11-03 | tidak disebutkan | DIBACA | 1 |

## Eropa Utara dan Baltik

| ID | Judul | Lembaga | URL | Diakses | last_updated_by_source | Bukti | Item |
|---|---|---|---|---|---|---|---|
| `SE-MCF-2024` | Om krisen eller kriget kommer / In case of crisis or war (edisi 2024) | Myndigheten för civilt försvar (MCF; sebelumnya MSB) | <https://rib.msb.se/filer/pdf/31523.pdf> | 2026-11-03 | brosur 2024 (dikirim Nov 2024) | DIBACA | 14 |
| `SE-MCF-MEDS` | One month's supply of medicines at home | MCF Swedia | <https://www.mcf.se/en/advice-for-individuals/home-preparedness--prepping-for-at-least-a-week/one-months-supply-of-medicines-at-home/> | 2026-11-03 | tidak disebutkan | DIBACA | 1 |
| `NO-DSB` | Egenberedskap (brosur versi Inggris) | Direktoratet for samfunnssikkerhet og beredskap (DSB), Norwegia | <https://www.dsb.no/siteassets/sikkerhverdag/egenberedskap/brosjyren/dsb-egenberedskap-engelsk-web.pdf> | 2026-11-03 | saran diperbarui Mei 2024 (3 hari ke 1 minggu) | DIBACA | 9 |
| `NO-DSB-CHECK` | Checklist for your emergency kit | DSB Norwegia | <https://www.dsb.no/siteassets/sikkerhverdag/egenberedskap/checklist-for-your-emergency-kit.pdf> | 2026-11-03 | tidak disebutkan | DIBACA | 0 |
| `FI-SUOMI` | Preparedness checklist (Suomi.fi) | Kemendagri Finlandia dan Digital and Population Data Services Agency | <https://www.suomi.fi/guides/preparedness/checklist> | 2026-11-03 | 2024-11-18 (halaman radiasi 2026-11-02) | DIBACA | 7 |
| `DK-BRS` | Prepared for crises (Forberedt på kriser) | Styrelsen for Samfundssikkerhed / Beredskabsstyrelsen, Denmark | <https://www.brs.dk/en/prepared/> | 2026-11-03 | kampanye 2024; brosur Totalberedskab Feb 2026 | DIBACA | 7 |
| `EE-OLEVALMIS` | Ole valmis!: Emergency supplies | Päästeamet (Estonian Rescue Board) | <https://www.olevalmis.ee/en/emergency-supplies> | 2026-11-03 | tidak disebutkan (brosur 'Be prepared!' 2022) | DIBACA | 13 |
| `LV-MOD-2024` | 72 hours: What to do in case of a crisis (brosur edisi 2024) | Kementerian Pertahanan Latvia (Aizsardzības ministrija) | <https://www.mod.gov.lv/sites/mod/files/document/72H%20buklets_ENG_WEB_2024.pdf> | 2026-11-03 | 2024-10 | DIBACA | 9 |
| `PL-MSWIA-2025` | Poradnik bezpieczeństwa / Safety Handbook (Nr 1/2025) | MSWiA Polandia (Kemendagri), RCB | <https://www.gov.pl/attachment/9aa63303-0c11-4756-9369-646f5ef4a595> | 2026-11-03 | 2025 (dikirim ke ~17 juta rumah tangga awal 2026) | DIBACA | 9 |
| `LT-KAM-2025` | If war or crisis comes: what should I do? (brosur nasional) | Kementerian Pertahanan Lituania (KAM) | <https://kam.lt/wp-content/uploads/2025/04/Jeikrizearbakaraskaipelgtisanglukalba.pdf> | 2026-11-03 | 2025-04 | CUPLIKAN | 0 |

## Eropa Barat, Tengah, dan UE

| ID | Judul | Lembaga | URL | Diakses | last_updated_by_source | Bukti | Item |
|---|---|---|---|---|---|---|---|
| `UK-BEREADY-2026` | Be Ready Checklist (kampanye Be Ready) | Cabinet Office, Inggris | <https://beready.campaign.gov.uk/wp-content/uploads/sites/252/2026/10/Be-Ready-Checklist_English.pdf> | 2026-11-03 | 2026-10-22 | DIBACA | 25 |
| `DE-BBK-2025` | Vorsorgen für Krisen und Katastrophen (Ratgeber, 2. Auflage) | Bundesamt für Bevölkerungsschutz und Katastrophenhilfe (BBK), Jerman | <https://www.bbk.bund.de/SharedDocs/Downloads/DE/Mediathek/Publikationen/Buergerinformationen/Ratgeber/BBK-Vorsorgen-fuer-Krisen-und-Katastrophen.pdf?__blob=publicationFile&v=44> | 2026-11-03 | 2025-11 (terbit pertama 2025-10-13) | DIBACA | 38 |
| `DE-BBK-STROMAUSFALL` | Stromausfall (halaman BBK) | BBK Jerman | <https://www.bbk.bund.de/DE/Warnung-Vorsorge/Vorsorge/Stromausfall/stromausfall_node.html> | 2026-11-03 | tidak disebutkan | DIBACA | 2 |
| `DE-BLE` | Vorratstabelle (tabel stok pangan) | Bundesanstalt für Landwirtschaft und Ernährung (BLE), ernaehrungsvorsorge.de | <https://www.ernaehrungsvorsorge.de/private-vorsorge/notvorrat/vorratstabelle/> | 2026-11-03 | tidak disebutkan | DIBACA | 10 |
| `NL-DENKVOORUIT` | Stel je noodpakket samen (Denk Vooruit) | NCTV / Rijksoverheid, Belanda | <https://www.denkvooruit.nl/bereid-je-voor/stel-je-noodpakket-samen> | 2026-11-03 | 2025-11 (PDF 2025-11-26) | DIBACA | 16 |
| `CH-BWL-2025` | Kluger Rat - Notvorrat (Prospekt) | Bundesamt für wirtschaftliche Landesversorgung (BWL), Swiss | <https://www.bwl.admin.ch/dam/de/sd-web/T9r68p19kgxB/Prospekt_Notvorrat_DE_Web.pdf> | 2026-11-03 | 2025-02 (versi EN 2025-10-13) | DIBACA | 9 |
| `FR-SGDSN-2025` | Tous responsables (guide) | SGDSN, Prancis (salinan info.gouv.fr) | <https://www.info.gouv.fr/upload/media/mixed/0001/16/b250783992e0c766ae97bce7cb6eb1e8f081fe33.pdf> | 2026-11-03 | 2025-11-20 | DIBACA | 11 |
| `BE-NCCN-2026` | Prêts. Ensemble. / Samen voorbereid (brosur) | Centre de Crise National / Nationaal Crisiscentrum, Belgia | <https://centredecrise.be/sites/default/files/documents/files/WEB-Brochure-Pr%C3%AAts.%20Ensemble-FR.pdf> | 2026-11-03 | 2026-10-01 | DIBACA | 5 |
| `EU-PREP-2025` | European Preparedness Union Strategy, JOIN(2025) 130 | European Commission dan High Representative | <https://commission.europa.eu/document/download/526806b6-c4e1-43d1-81b7-947308efbab1_en?filename=eu-preparedness-union-strategy.pdf> | 2026-11-03 | 2025-03-26 | DIBACA | 0 |

## Amerika dan standar internasional

| ID | Judul | Lembaga | URL | Diakses | last_updated_by_source | Bukti | Item |
|---|---|---|---|---|---|---|---|
| `US-FEMA-KIT` | Build A Kit (Ready.gov) | FEMA, Amerika Serikat | <https://www.ready.gov/kit> | 2026-11-03 | checklist PDF 2024-05 | CUPLIKAN | 2 |
| `US-FEMA-PETS` | Prepare your pets for disasters (Ready.gov) | FEMA, Amerika Serikat | <https://www.ready.gov/sites/default/files/2023-06/ready.gov_prepare-pets-for-disasters.pdf> | 2026-11-03 | 2023-06 | CUPLIKAN | 2 |
| `US-FEMA-POWER` | Power Outages (Ready.gov) | FEMA, Amerika Serikat | <https://www.ready.gov/power-outages> | 2026-11-03 | tidak disebutkan | CUPLIKAN | 2 |
| `US-FEMA-DISAB` | People with Disabilities (Ready.gov) | FEMA, Amerika Serikat | <https://www.ready.gov/people-disabilities> | 2026-11-03 | tidak disebutkan | CUPLIKAN | 1 |
| `US-CDC-WATER` | How to create and store an emergency water supply | CDC, Amerika Serikat | <https://www.cdc.gov/water-emergency/about/how-to-create-and-store-an-emergency-water-supply.html> | 2026-11-03 | 2025-06-27 | DIBACA | 1 |
| `US-CDC-WATER-ABOUT` | Making water safe in an emergency | CDC, Amerika Serikat | <https://www.cdc.gov/water-emergency/about/index.html> | 2026-11-03 | 2024-09-19 | DIBACA | 2 |
| `US-CDC-INFANT-CHECKLIST` | Infant feeding in emergencies: checklist | CDC, Amerika Serikat | <https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/checklist.html> | 2026-11-03 | 2026-08-03 | DIBACA | 5 |
| `US-CDC-INFANT-PREP` | Infant feeding in emergencies: preparedness | CDC, Amerika Serikat | <https://www.cdc.gov/infant-feeding-emergencies-toolkit/php/preparedness.html> | 2026-11-03 | 2026-08-03 | DIBACA | 3 |
| `US-CDC-PREG-CHECKLIST` | Emergency kit checklist: pregnant women, infants and children | CDC, Amerika Serikat | <https://www.cdc.gov/children-and-school-preparedness/resources/emergency-kit-checklist-pregnant-women-infants-and-children.html> | 2026-11-03 | 2026-04-20 | DIBACA | 4 |
| `US-CDC-PETS` | Pet emergency preparedness kit | CDC, Amerika Serikat | <https://www.cdc.gov/healthy-pets/emergency-preparedness/preparedness-kit.html> | 2026-11-03 | 2024-04-03 | DIBACA | 2 |
| `US-CDC-RADIATION` | Get inside, stay inside, stay tuned (radiation emergencies) | CDC, Amerika Serikat | <https://www.cdc.gov/radiation-emergencies/response/get-inside.html> | 2026-11-03 | 2024-01-10 | DIBACA | 2 |
| `US-CDC-MEDS` | Medication supply guidance (CDC Stacks 80940) | CDC, Amerika Serikat | <https://stacks.cdc.gov/view/cdc/80940> | 2026-11-03 | tidak disebutkan | CUPLIKAN | 1 |
| `US-EPA-2026` | Emergency Disinfection of Drinking Water | US EPA | <https://www.epa.gov/ground-water-and-drinking-water/emergency-disinfection-drinking-water> | 2026-11-03 | 2026-02-24 | DIBACA | 2 |
| `CA-PS-KIT` | Get an emergency kit (Get Prepared) | Public Safety Canada | <https://www.canada.ca/en/services/policing/emergencies/preparedness/get-prepared/emergency-kits/get-kit.html> | 2026-11-03 | tidak diketahui | CUPLIKAN | 6 |
| `CA-HC-WATER` | Food and drinking water safety in an emergency | Health Canada | <https://www.canada.ca/en/health-canada/services/food-drinking-water-safe-emergency.html> | 2026-11-03 | tidak diketahui | CUPLIKAN | 0 |
| `INT-SPHERE` | Sphere Handbook 2018 (edisi ke-4), bab WASH: sabun, toilet, air | Sphere Association | <https://spherestandards.org/wp-content/uploads/Sphere-Handbook-2018-EN.pdf> | 2026-11-03 | 2018 | CUPLIKAN | 1 |
| `INT-SPHERE-FSN` | Sphere Handbook: Food Security & Nutrition + Appendix 6 | Sphere Association (salinan UNHCR) | <https://emergency.unhcr.org/sites/default/files/2024-05/SphereFS+N.pdf> | 2026-11-03 | 2018 | DIBACA | 1 |
| `INT-WHO-TN9` | WASH in Emergencies Technical Note 9: How much water is needed in emergencies | WHO | <https://cdn.who.int/media/docs/default-source/wash-documents/who-tn-09-how-much-water-is-needed.pdf> | 2026-11-03 | 2013-07 | DIBACA | 2 |
| `INT-WHO-HWT` | Household water treatment and safe storage after emergencies | WHO | <https://cdn.who.int/media/docs/default-source/wash-documents/hwt-after-emergencies.pdf?sfvrsn=f28f139a_4> | 2026-11-03 | tidak disebutkan | DIBACA | 2 |
| `INT-WHO-MATERNAL` | Maternal nutrition in emergencies | WHO | <https://www.who.int/docs/default-source/documents/publications/maternal-nutrition-in-emergencies.pdf> | 2026-11-03 | tidak disebutkan | DIBACA | 2 |
| `INT-FNNE` | Food and Nutrition Needs in Emergencies (UNHCR/UNICEF/WFP/WHO), Annex 1 | UNHCR, UNICEF, WFP, WHO | <https://emergency.unhcr.org/sites/default/files/2024-01/Food%20and%20nutrition%20needs%20in%20emergencies%202004.pdf> | 2026-11-03 | 2002 (dicetak ulang 2004) | DIBACA | 1 |
| `INT-IFRC-PAPE` | Public Awareness and Public Education for Disaster Risk Reduction (PAPE 2.0) | IFRC | <https://www.ifrc.org/sites/default/files/PAPE-2.0-English.pdf> | 2026-11-03 | tidak diketahui (edisi 2) | DIBACA | 3 |

## Catatan per sumber

| ID | Catatan |
|---|---|
| `ID-BNPB-2026` | Rujukan lokal utama; sumber 28 item checklist tas dan 18 indikator keluarga. Path URL 'temporary' berisiko mati (D-044): sitasi selalu memuat judul, penerbit, tahun. |
| `ID-BNPB-BS2020` | Panduan per skenario (gempa, tsunami, erupsi, banjir, longsor, cuaca ekstrem, kekeringan, asap, pandemi, konflik, nuklir). |
| `ID-BMKG-BUKUSAKU` | Dibaca dari gambar halaman. |
| `ID-BMKG-EVAKUASI` | Dasar copy tsunami D-037: gempa kuat di pantai = peringatan dini. |
| `ID-BMKG-BAUBAU` | Hanya catatan + peringatan wilayah; media melaporkan rumus tidak berlaku di Maluku (D-037). |
| `ID-BMKG-KEMARAU` | Tidak ada angka stok air rumah tangga. |
| `ID-KEMENKES-2014` | Angka aquatab dan kaporit Kemenkes tidak ditampilkan (D-020). |
| `ID-KEMENKES-ASAP-N95` | Masker N95 dipakai rapat; tetap di dalam rumah. |
| `ID-KEMENKES-119` | Dipakai untuk nomor darurat/kanal info. |
| `ID-IRBI-2024` | Dasar saran skenario per provinsi (D-038). Data Jatim identik dengan DIY. |
| `ID-BAPETEN-2017` | Belum dibaca penuh (situs 403 untuk server). KI hanya atas instruksi otoritas (D-023). |
| `ID-PMI` | Tidak ada panduan tas siaga/P3K PMI yang berhasil dibaca; tidak jadi dasar item. |
| `ID-BASARNAS` | Tidak jadi dasar item; relevan untuk nomor darurat 115. |
| `JP-BOUSAI-2026` | Minimum 3 hari, sebaiknya 1 minggu. |
| `JP-TOKYO-2025` | Rolling stock, lentera, toilet portabel. |
| `JP-TOKYO-TOILET-2025` | Satu-satunya angka toilet rumah tangga (D-012). |
| `JP-MAFF` | Gas kaleng ±6/orang/minggu; contoh belanja 2 dewasa/1 minggu. |
| `JP-ENV-PET` | Pakan minimal 5 hari, sebaiknya 7 hari atau lebih. |
| `KR-MOIS` | Angka 3 hari dan hewan dari cuplikan; halaman perlengkapan dibaca langsung. |
| `TW-MND` | Halaman go-bag membalas 403 (isi tas dari cuplikan). |
| `PH-OSG-2024` | Sumber sekunder untuk isi go bag; situs OCD/NDRRMC memblokir server. |
| `AU-QLD-PETS` | Perlengkapan hewan minimal 5 hari. |
| `AU-NEMA-STORM` | nema.gov.au memutus koneksi; hanya cuplikan. |
| `NZ-GETREADY` | Situs membalas 403 dari server. |
| `NZ-AKL-WATER` | Verifikasi silang air 3 L/orang/hari. |
| `SE-MCF-2024` | Min. 1 minggu; air 3 L/orang/hari; tunai ±SEK 1.000/dewasa. |
| `SE-MCF-MEDS` | Stok obat 1 bulan. |
| `EE-OLEVALMIS` | 50% stok siap santap; panel surya portabel/generator. |
| `LV-MOD-2024` | Air 4 L saat cuaca panas; air kebersihan 10-12 L. |
| `LT-KAM-2025` | Situs memblokir server (Cloudflare). Tidak boleh jadi satu-satunya sumber (D-042); tidak dipakai item. |
| `DE-BBK-2025` | 10 hari; air 2 L; toilet kantong sampah; alat bantu + baterai. |
| `DE-BBK-STROMAUSFALL` | Listrik padam: tunai, radio, power bank, kompor kemping. |
| `DE-BLE` | Komposisi pangan per orang/hari (2.200 kkal). |
| `NL-DENKVOORUIT` | Tunai €70/dewasa dan €30/anak per 72 jam. |
| `EU-PREP-2025` | Payung kebijakan; belum memberi angka rumah tangga. |
| `US-FEMA-KIT` | ready.gov membalas 403 dari server. |
| `US-FEMA-POWER` | Kulkas 4 jam, freezer 48 jam; genset min. 6,1 m dari rumah. |
| `US-FEMA-DISAB` | Oksigen cadangan, baterai alat bantu. |
| `US-CDC-WATER` | Ganti air isi sendiri tiap 6 bulan. |
| `US-CDC-WATER-ABOUT` | Pemutih 2 tetes/L, tunggu 30 menit. |
| `US-CDC-INFANT-CHECKLIST` | Popok min. 1 pak besar, tisu basah 2 pak. |
| `US-CDC-INFANT-PREP` | Menyusui paling aman; formula siap minum lebih baik dari bubuk. |
| `US-CDC-PETS` | Pakan, air, obat hewan untuk 14 hari. |
| `US-CDC-RADIATION` | Shelter di dalam min. 24 jam. |
| `US-CDC-MEDS` | Stok obat 7 hari minimum (cuplikan). |
| `US-EPA-2026` | Rebus, pemutih, yodium; tablet ikuti label. |
| `CA-PS-KIT` | canada.ca memutus koneksi; sumber tunggal air hewan 4 L/1 L. |
| `INT-SPHERE` | Bab WASH hanya cuplikan (sabun 250 g/orang/bulan). |
| `INT-SPHERE-FSN` | 2.100 kkal/orang/hari (rata-rata populasi). |
| `INT-WHO-TN9` | Air bertahan hidup 2,5-3 L; total ≥7,5-15 L. |
| `INT-WHO-MATERNAL` | Tambahan kkal hamil +285, menyusui +500. |
| `INT-FNNE` | Kebutuhan kkal per usia. |
| `INT-IFRC-PAPE` | Air kebersihan +2 L; stok ±1 minggu. |

## Sumber tercantum tetapi belum menjadi dasar item

Dicatat agar tidak hilang. `ID-IRBI-2024`, `ID-PMI`, `ID-BASARNAS`, `JP-CAO-CHECK`, `NO-DSB-CHECK`, `LT-KAM-2025`, `EU-PREP-2025`, `CA-HC-WATER`. Alasan: tidak ada angka/daftar yang dipakai (PMI, Basarnas, LT), atau hanya mendukung data lain (mis. nomor darurat, IRBI untuk saran provinsi).
