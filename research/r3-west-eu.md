# R3 — Eropa Barat/Tengah + Uni Eropa

- Agent: R3 · Tanggal akses semua sumber: **2026-11-03**
- Cakupan: Inggris, Jerman, Belanda, Swiss, Prancis, Belgia, Uni Eropa
- File data: `research/r3-west-eu.json` (skema PLAN.md §4.1 + field tambahan `verification_note`)

## ⚠ Catatan akses web & tingkat verifikasi (WAJIB dibaca PM/S1)

| Tool | Status | Error |
|---|---|---|
| WebFetch | **GAGAL** | `getaddrinfo ENOTFOUND www.bbk.bund.de` dan `getaddrinfo ENOTFOUND prepare.campaign.gov.uk` (host di luar allowed network domains sesi). `curl` ke bbk.bund.de: `CONNECT tunnel failed, response 403`. |
| WebSearch | Berfungsi | — |

Konsekuensi:
- **Tidak ada halaman/PDF resmi yang dibaca utuh.** Semua angka di bawah berasal dari **cuplikan hasil WebSearch** yang dibatasi (`allowed_domains`) ke domain resmi (bbk.bund.de, bfs.de, gov.uk, *.campaign.gov.uk, denkvooruit.nl, rijksoverheid.nl, nctv.nl, bwl.admin.ch, babs.admin.ch, alertswiss.ch, sgdsn.gouv.fr, info.gouv.fr, centredecrise.be/crisiscentrum.be/crisiscenter.be, risquenucleaire.be, europa.eu). URL yang dicantumkan = URL halaman resmi yang menjadi sumber cuplikan.
- Tabel pangan Jerman (kg per orang per 10 hari) dikonfirmasi dari **salinan resmi checklist BBK yang di-host pemerintah kota** (Koblenz, Kempen "Checkliste-BBK-2025-01"), bukan dari bbk.bund.de langsung. Ada risiko salah-pasang baris akibat ekstraksi teks PDF (khususnya baris "Milch, Milchprodukte").
- Q1 sebaiknya **cek silang angka-angka ini dengan membuka PDF asli** begitu host di atas diizinkan (Network access → Allowed domains, lihat https://code.claude.com/docs/en/cloud-environments#network-access).
- Item yang tidak muncul di cuplikan ditulis **"tidak disebutkan / tidak terverifikasi"** — bukan berarti panduan resminya tidak membahas.

---

## 1. Inggris (UK) — Cabinet Office, kampanye **"Be Ready"**

- **Pembaruan penting:** situs lama "Prepare" (prepare.campaign.gov.uk) kini bermerek "Be Ready"; kampanye **Be Ready diluncurkan Oktober 2026** (dewan kota Walsall menyebut 22 Okt 2026; New Forest 26 Okt 2026), tahap pertama dari kampanye 3 tahun.
  - https://www.gov.uk/government/news/households-encouraged-to-take-small-simple-steps-to-stay-prepared-in-an-emergency
  - https://beready.campaign.gov.uk/
  - https://go.walsall.gov.uk/newsroom/walsall-residents-encouraged-prepare-possible-disruption
- **Target durasi:** **3 hari** gangguan layanan (min = rekomendasi = 3). Bukan ajakan menimbun; cicil saat belanja rutin. — https://beready.campaign.gov.uk/be-ready-for-emergencies/
- **Air:** **3 L/orang/hari** air kemasan untuk 3 hari; perlu tambahan untuk masak & cuci. — https://beready.campaign.gov.uk/wp-content/uploads/sites/252/2026/10/Be-Ready-Checklist_English.pdf
  - (Pembanding lama/lokal: Dumfries & Galloway 2,5 L/orang/hari — halaman lebih lama, https://www.dumfriesandgalloway.gov.uk/environment-community-safety/prepare-emergencies)
- **Pangan:** tahan lama, cukup ≥3 hari, **tidak perlu dimasak/didinginkan** (mis. kalengan) + **pembuka kaleng**. Kuantitas kg tidak disebutkan.
- **Item kit (checklist):** air kemasan; makanan tahan lama; pembuka kaleng; senter + baterai cadangan (lebih aman dari lilin); radio FM baterai/engkol; power bank; P3K; obat esensial & perlengkapan medis; produk kebersihan; uang tunai; salinan dokumen penting; daftar nomor telepon penting di kertas. — checklist PDF di atas
- **Sanitasi:** "hygiene products", tisu basah (untuk bayi). Toilet darurat: tidak disebutkan.
- **Penerangan/daya:** senter + baterai; power bank; isi daya HP/power bank/baterai alat medis sebelum badai. — https://beready.campaign.gov.uk/be-informed-about-hazards/storms/
- **Komunikasi:** radio FM baterai/engkol; nomor penting ditulis di kertas; lapor listrik padam **105** (Inggris/Skotlandia/Wales), **03457 643643** (Irlandia Utara); *Priority Services Register* gratis untuk rumah tangga rentan.
- **Dokumen & uang:** salinan dokumen penting; uang tunai (jumlah tidak disebutkan).
- **Kebutuhan khusus:**
  - Bayi: susu formula — **utamakan siap minum (ready-to-feed)** daripada bubuk karena mungkin tidak bisa merebus air; popok; tisu basah.
  - Hewan: makanan + air kemasan; hewan pemandu: dokumen, makanan, air, obat, tali di grab bag.
  - Obat: minta resep ulang lebih awal (**hingga 5 hari kerja** sebelum dibutuhkan); daftar obat (nama, dosis, frekuensi, siapa) di Household Emergency Plan. — https://beready.campaign.gov.uk/wp-content/uploads/sites/252/2026/10/Be-Ready_Household_Emergency_Plan_English_Final.pdf
  - Disabilitas & pendamping: halaman khusus — https://beready.campaign.gov.uk/be-ready-for-emergencies/advice-for-disabled-persons-and-carers/
  - Lansia: tidak disebutkan secara spesifik.
- **Per skenario:**
  - Listrik padam: isi daya HP/power bank/baterai alat medis lebih dulu; nomor 105.
  - Banjir: matikan gas/listrik/air bila aman; jangan sentuh saklar sambil berdiri di air; hindari air banjir, cuci tangan. — https://beready.campaign.gov.uk/be-informed-about-hazards/flooding/
  - Panas ekstrem: banyak minum; hindari matahari **11.00–15.00**; jangan tinggalkan orang/hewan di mobil. — https://prepare.campaign.gov.uk/be-informed-about-hazards/hot-weather/
  - Nuklir/radiologi/kimia: **"Go in, stay in, tune in"**; mungkin perlu di dalam ruangan **1–2 hari**; jangan evakuasi kecuali disuruh. — https://www.gov.uk/government/publications/radiation-emergencies-information-for-the-public/what-to-do-in-a-radiation-emergency ; https://prepare.campaign.gov.uk/be-informed-about-hazards/hazardous-materials-incident/
  - Pandemi: tidak disebutkan (di hasil). Konflik: tidak disebutkan.
- **Poin unik:** grab bag terpisah; Household Emergency Plan PDF; Priority Services Register; formula siap minum; nomor 105.

---

## 2. Jerman — BBK (Bundesamt für Bevölkerungsschutz und Katastrophenhilfe)

- **Pembaruan penting:** Ratgeber lama "Ratgeber für Notfallvorsorge und richtiges Handeln in Notsituationen" **diganti** oleh **"Vorsorgen für Krisen und Katastrophen"**, dirilis **13 Oktober 2025** (lebih ringkas; topik baru: disinformasi, *Schutzorte*/tempat berlindung, kesehatan mental). Checklist baru: "Checklisten zur Vorsorge für Krisen und Katastrophen" dengan tabel untuk **3, 5, 7, 10 hari**.
  - https://www.bbk.bund.de/SharedDocs/Pressemitteilungen/DE/2025/10/pm-13-neuer-ratgeber.html
  - https://www.bbk.bund.de/DE/Warnung-Vorsorge/Vorsorge/Ratgeber-Checkliste/ratgeber-checkliste_node.html
  - https://www.bbk.bund.de/SharedDocs/Downloads/DE/Mediathek/Publikationen/Buergerinformationen/Ratgeber/Checklisten-zur-Vorsorge-Krisen-und-Katastrophen.pdf?__blob=publicationFile&v=19
- **Target durasi:** **min. 3 hari** ("sudah sangat membantu"), **rekomendasi 10 hari**. — https://www.bbk.bund.de/DE/Warnung-Vorsorge/Vorsorge/So-koennen-Sie-sich-vorbereiten/Bevorraten/bevorraten_node.html
- **Air:** **2 L/orang/hari** (**1,5 L minum + 0,5 L masak**). Contoh tabel 3 orang: **18 L/3 hari, 30 L/5 hari, 60 L/10 hari**. — halaman Bevorraten + checklist baru di atas
- **Pangan — tabel BBK "Meine persönliche Checkliste" (10-Tage-Vorrat, 1 orang):**

  | Kelompok pangan | Jumlah / orang / 10 hari |
  |---|---|
  | Getreide, Getreideprodukte, Brot, Kartoffeln, Nudeln, Reis (serealia, roti, kentang, pasta, beras) | **3,5 kg** |
  | Gemüse, Hülsenfrüchte (sayur, kacang-kacangan) | **4,0 kg** |
  | Obst, Nüsse (buah, kacang) | **2,5 kg** |
  | Milch, Milchprodukte (susu & olahan)* | **2,6 kg** |
  | Fisch, Fleisch, Eier bzw. Volleipulver (ikan, daging, telur/telur bubuk) | **1,5 kg** |
  | Fette, Öle (lemak, minyak) | **0,357 kg** |
  | Getränke (minuman) | **20 L** |
  | Sonstiges: gula/madu/selai/cokelat, garam beryodium, makanan siap saji, dll. | menurut selera (tidak dikuantifikasi) |

  Sumber: salinan resmi checklist BBK — Koblenz https://www.koblenz.de/rathaus/verwaltung/feuerwehr/vorsorge-selbsthilfe/vorsorge-fuer-den-katastrophenfall/meine-persoenliche-checkliste.pdf?cid=c2p ; Kempen (Checkliste-BBK-2025-01) https://www.kempen.de/system/files/2025-06/Checkliste-BBK-2025-01.pdf ; asal BBK https://www.bbk.bund.de/SharedDocs/Downloads/DE/Mediathek/Publikationen/Buergerinformationen/Ratgeber/ratgeber-notfallvosorge-checkliste.pdf?__blob=publicationFile
  \*Baris susu: hasil ekstraksi PDF menyebut "Milch 2,6 kg", pemasangan ke "Milchprodukte" tidak 100% jelas → verifikasi.
  Total energi ±**2.200 kkal/orang/hari** (disebut pada versi checklist 14 hari: https://doha.diplo.de/resource/blob/2112606/0c16d410f62682f27fe3547f50b4ec72/checkliste-krisenvorsorge-data.pdf).
  - **Versi lama 14 hari** (Auswärtiges Amt / Kreis Calw): susu 3,7 kg; ikan/daging/telur 2,1 kg; lemak/minyak 0,5 kg; sayur 5,6 kg; buah/kacang 3,6 kg (serealia 14 hari tidak tertangkap). — https://www.kreis-calw.de/media/custom/2442_635_1.PDF
  - **Ratgeber 2025 baru:** cuplikan hanya menunjukkan "makanan tahan lama untuk semua orang untuk 3/5/7/10 hari"; **tabel kg per kelompok pangan tidak terlihat** di cuplikan versi baru → belum terkonfirmasi apakah tabel kg masih dipakai. Kalkulator: ernaehrungsvorsorge.de (BLE).
  - Pilih makanan tanpa perlu kulkas, tanpa/sedikit dimasak; perhatikan alergi & kebiasaan.
- **Item kit (cuplikan checklist):** cahaya & panas: senter + baterai cadangan, lilin + pemantik; radio baterai/engkol + aplikasi peringatan (NINA); kompor kemping + bahan bakar; uang tunai; map dokumen; P3K/Hausapotheke; kebersihan; perlindungan kebakaran. — checklist PDF di atas
- **Hausapotheke:** obat nyeri, penurun demam, termometer, pinset, elektrolit, perban; simpan terkunci; **obat rutin ≥10 hari**. — https://www.bbk.bund.de/DE/Warnung-Vorsorge/Vorsorge/So-koennen-Sie-sich-vorbereiten/Hausapotheke/hausapotheke_node.html
- **Sanitasi:** tisu toilet, tisu dapur, kantong sampah, **toilet kemping + kantong/cairan cadangan**. — https://www.bbk.bund.de/DE/Warnung-Vorsorge/Vorsorge/Gesundheit-und-Hygiene/Hygiene-in-Notsituationen/hygiene-in-notsituationen_node.html
- **Notgepäck (tas darurat):** obat pribadi, P3K, radio baterai, **makanan untuk 2 hari**, botol air, sleeping bag/selimut, dokumen; uang tunai. — https://www.bbk.bund.de/DE/Warnung-Vorsorge/Vorsorge/So-koennen-Sie-sich-vorbereiten/Notgepaeck/notgepaeck_node.html
- **Dokumen & uang:** Dokumentenmappe + salinan cadangan; uang tunai karena ATM mati saat listrik padam (jumlah tidak disebutkan).
- **Kebutuhan khusus:** obat rutin ≥10 hari; pakan & air hewan (disebut dalam stok); bayi/lansia: tidak terverifikasi detailnya di cuplikan. Kelompok rentan panas: lansia, orang yang dirawat, sakit kronis, anak, ibu hamil.
- **Per skenario:**
  - Listrik padam: uang tunai, radio baterai/engkol, senter, kompor kemping. — https://www.bbk.bund.de/DE/Warnung-Vorsorge/Vorsorge/Stromausfall/stromausfall_node.html
  - Panas: minum **≥1,5–2 L/hari**, ventilasi pagi hari, peneduh; tanya dokter soal penyesuaian dosis; jangan tinggalkan orang/hewan di mobil. — https://www.bbk.bund.de/DE/Warnung-Vorsorge/Vorsorge/Mit-Naturgefahren-umgehen/Hitze-Duerre/hitze-duerre_node.html
  - Nuklir/radiologi (BfS + flyer CBRN BBK): tetap di dalam gedung, tutup jendela/pintu, matikan ventilasi/AC, cari ruang dalam/basement tanpa jendela; **tablet yodium dosis tinggi hanya atas perintah otoritas**. — https://www.bfs.de/DE/themen/ion/notfallschutz/verhalten/aufenthalt-haus/aufenthalt-haus_node.html ; https://www.bfs.de/DE/themen/ion/notfallschutz/verhalten/jodblockade/jodblockade_node.html ; https://www.bbk.bund.de/SharedDocs/Downloads/DE/Mediathek/Publikationen/Flyer/cbrn.pdf?__blob=publicationFile&v=4
  - Banjir: amankan pemanas & instalasi listrik (detail tipis). Pandemi: tidak terverifikasi. Konflik: Ratgeber 2025 membahas *Schutzorte* & disinformasi (detail item tidak terverifikasi).
- **Poin unik:** satu-satunya panduan dengan **tabel kuantitas pangan per kelompok (kg)**; air dipecah minum vs masak; tabel bertingkat 3/5/7/10 hari; obat ≥10 hari; aplikasi NINA.

---

## 3. Belanda — NCTV / Rijksoverheid, kampanye **"Denk Vooruit"**

- **Pembaruan:** kampanye multi-tahun dimulai **1 Nov 2025**; kampanye lanjutan **12 Okt 2026** (fokus: siapa jemput anak, punya uang tunai & radio darurat?). Kepemilikan noodpakket naik **30% → 44%** (NCTV, Apr 2026).
  - https://www.rijksoverheid.nl/actueel/nieuws/2025/11/03/overheid-start-campagne-denk-vooruit-voorbereiden-op-noodsituatie-steeds-belangrijker
  - https://www.rijksoverheid.nl/actueel/nieuws/2026/10/12/nieuwe-denk-vooruit-campagne-om-extra-aandacht-te-vragen-om-voor-te-bereiden-op-noodsituatie
  - https://www.nctv.nl/actueel/nieuws/2026/04/13/steeds-meer-nederlanders-bereiden-zich-door-denk-vooruit-voor-op-noodsituaties
- **Target durasi:** **72 jam** (min = rekomendasi = 3 hari).
- **Air:** **3 L/orang/hari** (**2 L minum + 1 L untuk menyiapkan makanan**), untuk 3 hari. Catatan: Q&A internal Nov 2025 menyebut "4 à 5 liter p.p." (tidak konsisten). — https://www.rijksoverheid.nl/documenten/vraag-en-antwoord/veiligheidsregios-en-crisisbeheersing/wat-zit-er-in-een-noodpakket ; https://www.denkvooruit.nl/risicos/risicos-in-nederland/drinkwater ; https://www.denkvooruit.nl/site/binaries/site-content/collections/documents/2025/10/27/toolkit-denk-vooruit-campagne-najaar-2025/20251111-qa-denkvooruit-bronbestand.pdf
- **Pangan:** tahan lama (kacang, sayur kaleng, buah kering). Kuantitas: tidak disebutkan.
- **Item kit:** senter + baterai, lilin, korek api, radio baterai/engkol, kotak P3K + petunjuk, selimut, peluit, perkakas, gel desinfektan, tisu toilet, tisu basah, pasta & sikat gigi, salinan identitas, daftar nomor penting, kunci cadangan, **uang tunai €70/dewasa & €30/anak**, makanan & air hewan; simpan di tas tahan air/ransel; **cek tiap 6 bulan**. — https://www.denkvooruit.nl/bereid-je-voor/stel-je-noodpakket-samen ; PDF A4 https://www.denkvooruit.nl/site/binaries/site-content/collections/documents/2025/11/26/een-noodpakket-samenstellen/noodpakket-a4.pdf ; EN https://english.denkvooruit.nl/prepare-yourself/putting-together-an-emergency-kit
- **Kebutuhan khusus:** pakan hewan, makanan bayi, obat — sesuaikan situasi; jumlah uang tunai disesuaikan (Q&A).
- **Per skenario:**
  - Nuklir: tetap di dalam (via NL-Alert), tutup jendela/pintu, matikan ventilasi, bisa sampai **72 jam**; **yodium hanya atas saran pemerintah**: usia ≤40 th di 0–20 km; anak <18 & ibu hamil di 20–100 km. — https://www.denkvooruit.nl/risicos/risicos-in-nederland/nucleair/een-nucleair-ongeval-in-nederland ; https://www.rijksoverheid.nl/onderwerpen/straling/vraag-en-antwoord/voor-wie-zijn-jodiumtabletten-bedoeld
  - Listrik/air/internet padam lama: dibahas umum. — https://www.rijksoverheid.nl/onderwerpen/dreiging-in-nederland/energie-drinkwater-internet-zorg-bereikbaarheid-tijdens-crisis
  - Banjir, panas, pandemi, konflik: tidak terverifikasi di cuplikan.
- **Poin unik:** jumlah **uang tunai konkret per orang**; 3 langkah (noodpakket, noodplan, saling bantu); NL-Alert.

---

## 4. Swiss — BWL (Bundesamt für wirtschaftliche Landesversorgung) + BABS/Alertswiss

- **Dokumen:** brosur **"Kluger Rat – Notvorrat"**, edisi **Feb 2025** (DE/FR/IT; EN sejak 13 Okt 2025; versi Leichte Sprache). — https://www.bwl.admin.ch/de/kluger-rat-notvorrat ; PDF https://www.bwl.admin.ch/dam/de/sd-web/T9r68p19kgxB/Prospekt_Notvorrat_DE_Web.pdf ; EN https://www.bwl.admin.ch/dam/en/sd-web/Jew-ujrm-vV1/Notvorrat_EN.pdf ; https://www.bwl.admin.ch/de/notvorrats-broschuere
- **Target durasi:** air untuk **3 hari**, pangan **±1 minggu** (min 3 / rekomendasi 7 — interpretasi; tidak ada angka "min" eksplisit).
- **Air:** **≥9 L/orang** (= sixpack botol 1,5 L) untuk minum + masak 3 hari → **3 L/orang/hari**; air untuk kebersihan/flush **tidak termasuk**.
- **Pangan:** ±1 minggu: beras, pasta, minyak, makanan siap saji, garam, gula, kopi, teh, buah kering, müesli, zwieback, cokelat, susu UHT, keju keras, daging kering, kalengan; plus makanan yang bisa dimakan tanpa dimasak. Kuantitas kg: tidak disebutkan di cuplikan; ada **Notvorratsrechner** (kalkulator daftar belanja).
- **Item kit:** senter + baterai cadangan, lilin, korek, **radio baterai** (info otoritas), kompor gas, produk kebersihan, obat pribadi, baterai, uang tunai.
- **Uang tunai:** pecahan kecil & koin, **cukup untuk belanja seminggu + kemungkinan satu tangki bensin**.
- **Kebutuhan khusus:** hewan: pakan, air, **pasir/alas kandang**, obat. Bayi/lansia: tidak disebutkan di cuplikan.
- **Per skenario (BABS/Alertswiss):**
  - Sirene "Allgemeiner Alarm": dengarkan radio / Alertswiss, ikuti instruksi. — https://www.babs.admin.ch/de/alarmierung
  - Nuklir: tablet yodium **dibagikan di muka dalam radius 50 km** PLTN (terakhir musim gugur 2023); di luar zona tidak perlu stok. Tetap di dalam gedung/ruang perlindungan (Schutzraum). — https://blog.alertswiss.ch/de/gefahren-kennen/unfall-kernkraftwerk/notfallschutz-bei-einem-kkw-unfall-wie-ist-die-schweiz-vorbereitet/
  - Listrik padam: radio baterai/mobil tetap jalan; uang tunai (kartu bisa tak berfungsi); makanan tanpa masak.
  - Komunikasi gagal: **Notfalltreffpunkte** (titik temu darurat) — notfalltreffpunkte.ch; https://www.babs.admin.ch/dam/de/sd-web/Z8gD79plAgZG/Konzept_Notfalltreffpunkte_de.pdf
  - Notfallplan keluarga: https://www.babs.admin.ch/dam/de/sd-web/oJLzuJoq2T-3/Emergency%20plan_A4_DE.pdf
  - Banjir, panas, pandemi, konflik: tidak terverifikasi.
- **Poin unik:** air dihitung sebagai "sixpack per orang"; uang tunai = belanja seminggu + 1 tangki; infrastruktur shelter nasional; titik temu darurat.

---

## 5. Prancis — SGDSN, panduan **"Tous responsables – Bien préparés"**

- **Dokumen:** dirilis **20 Nov 2025**; versi standar, FALC (mudah dibaca), dan cetak. — https://www.sgdsn.gouv.fr/publications/guide-tous-responsables ; PDF https://www.sgdsn.gouv.fr/files/files/Publications/Guide_Tous%20responsables.pdf ; https://www.info.gouv.fr/risques/se-preparer-a-une-situation-durgence ; https://www.info.gouv.fr/actualite/tous-responsables-un-guide-pour-mieux-faire-face-aux-risques
- **Target durasi:** **72 jam** (layanan darurat bisa jenuh). Tiga prioritas: minum & makan, tetap hangat, merawat diri.
- **Air:** **6 L/orang** untuk 72 jam (botol) → **2 L/orang/hari**; rumus: 6 × jumlah anggota rumah. Tablet penjernih **hanya pilihan terakhir**.
- **Pangan:** tanpa perlu dimasak (kalengan, makanan bayi dalam jar, pakan hewan). Kuantitas: tidak disebutkan.
- **Item kit:** makanan tanpa masak; senter + baterai, lilin, pemantik/korek; radio baterai + charger HP (disebut di info.gouv.fr, tidak di fiche SGDSN); pakaian hangat + selimut darurat (couverture de survie); obat harian + kotak P3K; uang tunai; **kacamata cadangan**; **kunci duplikat rumah & mobil**; fotokopi dokumen (KTP, resep) dalam kantong kedap air; buku & permainan. **Cek 2× setahun**.
- **Sanitasi:** tidak disebutkan di cuplikan.
- **Kebutuhan khusus:** makanan bayi (petits pots), pakan hewan, obat harian, kacamata cadangan.
- **Per skenario:** sirene diuji **Rabu pertama tiap bulan** (>5.000 sirene), **FR-Alert** ke HP; risiko alam: tetap di dalam, hindari perjalanan; kecelakaan nuklir: berlindung di dalam (mise à l'abri); konflik bersenjata & manipulasi informasi dibahas. Detail yodium, panas, listrik padam, banjir: **tidak terverifikasi** di cuplikan.
- **Poin unik:** buku & permainan (kesehatan mental), kunci duplikat, kacamata cadangan, cakupan ancaman konflik/siber/terorisme dalam satu buku warga.

---

## 6. Belgia — Centre de Crise National / Nationaal Crisiscentrum

- **Dokumen:** brosur **"Prêts. Ensemble."** (FR) / **"Samen voorbereid"** (NL) + halaman kit. Tanggal terbit: **tidak terkonfirmasi**.
  - https://centredecrise.be/fr/que-pouvez-vous-faire/preparez-un-kit-durgence/un-kit-durgence-la-maison
  - https://crisiscenter.be/en/what-can-you-do/build-emergency-kit/emergency-kit-home
  - https://crisiscentrum.be/sites/default/files/documents/files/WEB-Brochure%20Samen%20voorbereid-NL.pdf
  - https://centredecrise.be/sites/default/files/documents/files/WEB-Brochure-Pr%C3%AAts.%20Ensemble-FR.pdf
- **Target durasi:** **≥72 jam** ("dianjurkan di seluruh UE").
- **Air:** **3–10 L/orang/hari** di rumah (dewasa minum 1,5–2 L; sisanya cuci, kebersihan, masak); tas evakuasi **1 L/orang**; gangguan air minum: **4 L/orang/hari** + air non-minum untuk bersih-bersih. — https://centredecrise.be/fr/risques-en-belgique/risques-societaux/defaillance-de-lapprovisionnement-en-eau-potable
- **Pangan:** tahan lama; kuantitas tidak disebutkan. "Tidak ada kit standar"; jangan beli kit mahal.
- **Item kit:** dokumen (salinan polis asuransi, daftar kontak, salinan KTP anggota rumah); uang tunai **cukup ±72 jam** (jangan simpan jumlah besar); obat esensial **≥3 hari** di tas + daftar obat dari apoteker/dokter; senter (**diutamakan dinamo**); radio baterai/engkol; P3K dasar; charger + baterai eksternal; peluit; pisau multitool; pemantik/korek; lilin; selimut.
- **Kebutuhan khusus:** bayi: makanan bayi khusus, popok, baju ganti; hewan: obat/daftar obat, paspor & catatan vaksin, makanan & air **untuk 72 jam** (https://crisiscentrum.be/nl/newsroom/tips-voor-jou-en-je-dieren-bij-noodsituaties-0); orang yang butuh bantuan tambahan: https://crisiscenter.be/en/what-can-you-do/make-plan/people-who-need-additional-help
- **Per skenario:**
  - Nuklir: zona 100 km ≈ hampir seluruh wilayah; **tablet yodium gratis di semua apotek** (target: keluarga dengan anak ≤18 th, ibu hamil & menyusui; warga lain boleh minta 1 kotak); **minum hanya bila otoritas menganjurkan**; berlindung di dalam. — https://risquenucleaire.be/fr/faq ; https://centredecrise.be/fr/que-pouvez-vous-faire/le-bon-reflexe/se-mettre-labri
  - Gangguan air minum: 4 L/orang/hari.
  - Listrik padam: radio untuk ikuti media. Banjir, panas, pandemi, konflik: tidak terverifikasi.
- **Poin unik:** rentang air 3–10 L (paling tinggi di wilayah ini); senter dinamo; anti-kit-mahal; kit "di lokasi" (kantor/mobil) terpisah.

---

## 7. Uni Eropa — European Preparedness Union Strategy

- **Dokumen:** Joint Communication **JOIN(2025) 130**, **26 Maret 2025**. — https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A52025JC0130 ; https://commission.europa.eu/topics/preparedness_en ; factsheet https://ec.europa.eu/commission/presscorner/api/files/attachment/880970/Factsheet_EU%20Preparedness%20Union%20Strategy.pdf
- **Target durasi:** **minimum 72 jam** swadaya penduduk. Komisi akan menyusun **pedoman** (penyimpanan pasokan esensial, rencana krisis, ketersediaan shelter, perlindungan orang, hewan & properti) + kampanye; **jadwal: 2026** (key action). Juga: masuk kurikulum sekolah, **EU Preparedness Day**.
- **Dokumen turunan:**
  - **EU Stockpiling Strategy COM(2025) 528**, 9 Juli 2025 (stok tingkat UE + negara anggota; evaluasi 2026). — https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52025DC0528
  - Union Civil Protection Knowledge Network menampung leaflet nasional 72 jam (Prancis, Belanda; Denmark, Latvia, Finlandia dipublikasi 5 Maret 2026). — https://civil-protection-knowledge-network.europa.eu/media/leaflet-emergency-kit-72-hours-self-sufficiency-france ; https://civil-protection-knowledge-network.europa.eu/media/information-leaflet-emergency-kit-and-72-hours-self-sufficiency-netherlands
  - **Pedoman 72 jam resmi UE / daftar kit UE: belum ditemukan per 2026-11-03.**
- **Air / pangan / item:** **tidak disebutkan** dalam dokumen strategi. Contoh item yang disebut Komisioner Hadja Lahbib (air, makanan, senter, power bank, radio, uang tunai, obat) hanya dari **liputan pers** (bukan dokumen resmi; secondary): https://www.euronews.com/my-europe/2025/03/26/brussels-ask-eu-citizens-to-put-together-a-72-hour-emergency-kit-to-face-crises
- **Catatan konteks:** Irlandia dilaporkan membatalkan saran 72 jam di buklet "Be Emergency Ready" (Okt 2026, laporan media — bukan cakupan R3, tidak diverifikasi): https://www.thejournal.ie/emergency-booklet-72-hour-supplies-advice-ditched-7195386-Oct2026/

---

## Tabel perbandingan

| Negara | Lembaga / dokumen (tahun) | Target min | Target rekomendasi | Air L/orang/hari | Pangan | Uang tunai | Yodium | Catatan |
|---|---|---|---|---|---|---|---|---|
| Inggris | Cabinet Office "Be Ready" (Okt 2026) | 3 hari | 3 hari | **3** (+ masak/cuci) | ≥3 hari, tanpa masak/kulkas | ya (jumlah tidak disebutkan) | tidak disebutkan | formula siap minum; resep 5 hari kerja lebih awal |
| Jerman | BBK "Vorsorgen für Krisen und Katastrophen" (13 Okt 2025) | 3 hari | **10 hari** | **2** (1,5 minum + 0,5 masak) | **tabel kg/10 hari** (3,5/4,0/2,5/2,6/1,5/0,357 kg + 20 L), ±2.200 kkal/hari | ya | hanya atas perintah (BfS) | obat ≥10 hari; toilet kemping |
| Belanda | NCTV/Rijksoverheid "Denk Vooruit" (Nov 2025; kampanye Okt 2026) | 3 hari | 3 hari | **3** (2 minum + 1 masak) | tahan lama, tanpa kuantitas | **€70/dewasa, €30/anak** | ≤40 th 0–20 km; <18 & hamil 20–100 km; atas saran | cek 6 bulan |
| Swiss | BWL "Kluger Rat – Notvorrat" (Feb 2025) | 3 hari (air) | 7 hari (pangan) | **3** (9 L/3 hari; tanpa air higiene) | ±1 minggu, daftar jenis | belanja seminggu + 1 tangki | pra-distribusi ≤50 km | Notvorratsrechner; Schutzraum |
| Prancis | SGDSN "Tous responsables" (20 Nov 2025) | 3 hari | 3 hari | **2** (6 L/72 jam) | tanpa masak | ya | tidak terverifikasi | kacamata & kunci cadangan; buku/permainan; cek 2×/tahun |
| Belgia | Centre de Crise "Prêts. Ensemble." (tgl ?) | 3 hari | 3 hari | **3–10** (rumah); 1 L tas evakuasi; 4 L saat air mati | tahan lama | cukup ±72 jam | gratis di apotek (hampir seluruh negeri), atas anjuran | senter dinamo |
| UE | Preparedness Union Strategy JOIN(2025)130 (26 Mar 2025) | 3 hari | tidak disebutkan | tidak disebutkan | tidak disebutkan | tidak disebutkan (pers: ya) | — | pedoman 72 jam dijadwalkan 2026, belum ditemukan |

**Implikasi untuk SurvivalCheck (saran ke S1/S2, bukan keputusan):**
- Air: rentang wilayah ini 2–3 L/orang/hari untuk minum+masak (BE 3–10 termasuk higiene) → default 3 L di PLAN §2 konsisten dengan UK/NL/CH; Jerman lebih rendah (2 L).
- Hanya Jerman yang memberi kuantitas pangan per kelompok → kandidat dasar untuk konversi "kg per orang per hari" (mis. serealia 0,35 kg/hari, sayur/kacang 0,4 kg/hari, buah/kacang 0,25 kg/hari, susu 0,26 kg/hari, protein hewani 0,15 kg/hari, lemak 0,036 kg/hari — hasil bagi 10 dari tabel BBK).
- Uang tunai: NL memberi angka (€70/€30) dan CH memberi rumus (belanja 1 minggu) → bisa diadaptasi ke Rupiah tanpa nominal (mis. "biaya belanja seminggu").
- Yodium: semua sumber sepakat **hanya diminum atas instruksi otoritas** → sejalan dengan PLAN §2.1 (BAPETEN).
- Obat: UK (minta resep lebih awal), BE (≥3 hari di tas), DE (≥10 hari).

## Celah data
1. Semua angka belum dibaca dari halaman/PDF asli (WebFetch diblokir) — verifikasi ulang direkomendasikan.
2. Jerman: apakah Ratgeber Okt 2025 masih memuat tabel kg pangan (cuplikan versi baru hanya menunjukkan tabel 3/5/7/10 hari untuk air & "makanan tahan lama"). Baris "Milch/Milchprodukte" perlu dicek.
3. UK/FR/BE/CH: tidak ada kuantitas pangan (kg/kkal).
4. Skenario pandemi & konflik hampir tidak tertangkap untuk semua negara; panas & banjir hanya UK/DE.
5. Belgia: tanggal brosur "Prêts. Ensemble." tidak diketahui.
6. UE: pedoman 72 jam resmi (dijadwalkan 2026) belum ditemukan; tidak ada daftar kit UE resmi.
7. Sanitasi/toilet darurat hanya eksplisit di Jerman.
