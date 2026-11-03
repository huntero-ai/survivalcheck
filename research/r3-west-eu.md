# R3 — Eropa Barat/Tengah + Uni Eropa

- Agent: R3 · Tanggal akses semua sumber: **2026-11-03**
- Cakupan: Inggris, Jerman, Belanda, Swiss, Prancis, Belgia, Uni Eropa
- File data: `research/r3-west-eu.json` (skema PLAN.md §4.1, ditambah field `scenario_items`, `verification_note`)

## Catatan akses web & tingkat verifikasi

- **Awal sesi:** WebFetch gagal (`getaddrinfo ENOTFOUND www.bbk.bund.de`, `getaddrinfo ENOTFOUND prepare.campaign.gov.uk`; curl: `CONNECT tunnel failed, response 403`). Setelah user membuka Network access, **curl berhasil** (WebFetch masih ENOTFOUND, kemungkinan cache DNS tool). Dokumen resmi lalu diunduh dengan curl dan teksnya diekstrak (`pdftotext`).
- **Sumber berlabel [DIBACA]**: PDF/halaman resmi yang diunduh dan teksnya dibaca langsung.
- **Sumber berlabel [CUPLIKAN]**: hanya dari cuplikan WebSearch yang dibatasi ke domain resmi; halamannya belum dibaca utuh.
- **Sumber yang ditolak server:** `sgdsn.gouv.fr` membalas **403** untuk PDF panduan. Panduan yang sama dibaca dari salinan resmi di **info.gouv.fr** (situs pemerintah Prancis).

---

## 1. Inggris (UK) — Cabinet Office, kampanye **"Be Ready"**

- **Pembaruan:** dirilis **22 Okt 2026** (Cabinet Office, Dan Jarvis MP). Ini tahap pertama dari kampanye 3 tahun. Situs lama "Prepare" (sejak Mei 2024) diganti merek dan pesannya; sebagian besar isi saran tetap. [DIBACA] https://www.gov.uk/government/news/households-encouraged-to-take-small-simple-steps-to-stay-prepared-in-an-emergency
- **Target durasi:** **3 hari** ("Being ready for 3 days helps you manage while support reaches those most in need"). Nilai min = rekomendasi = 3. Kit dicicil saat belanja rutin, dicek **tiap 6 bulan**. [DIBACA] https://beready.campaign.gov.uk/wp-content/uploads/sites/252/2026/10/Be-Ready-Checklist_English.pdf
- **Air:** **3 L/orang/hari untuk minum**, selama 3 hari. Masak dan cuci butuh tambahan. [DIBACA] checklist
- **Pangan:** tahan lama untuk 3 hari, tanpa perlu kulkas atau dimasak, misalnya daging/ikan/sayur kaleng, buah kering, kacang. Disarankan membeli makanan yang biasa dimakan. Tidak ada angka kg/kkal.
- **Item checklist (resmi, per kategori):**
  - Water: air kemasan 3 hari.
  - Food: makanan tahan lama 3 hari.
  - Hygiene: hand sanitiser, tisu basah, produk kebersihan & kamar mandi.
  - Light & warmth: senter + baterai cadangan; selimut, sleeping bag, pakaian hangat.
  - Communication: radio FM baterai/engkol; power bank terisi.
  - Money & documents: uang tunai (campuran koin & uang kertas) dan kartu; salinan ID/dokumen; nomor telepon & info penting, termasuk obat rutin dan dosisnya.
  - Medical: P3K; obat esensial & perlengkapan medis.
  - Baby: susu formula **siap minum (ready-to-feed)** lebih baik, karena mungkin tidak bisa merebus air untuk formula bubuk; popok & tisu basah.
  - Pets: pakan + air kemasan.
- **Household Emergency Plan** [DIBACA] https://beready.campaign.gov.uk/wp-content/uploads/sites/252/2026/10/Be-Ready_Household_Emergency_Plan_English_Final.pdf
  - Isi: titik kumpul; nomor penting: 999, NHS 111, polisi 101, listrik padam **105** (Inggris/Skotlandia/Wales) / **03457 643643** (Irlandia Utara); daftar obat (nama/dosis/frekuensi/siapa); data asuransi; lokasi stopkeran air, katup gas, saklar listrik (gas hanya boleh dinyalakan ulang oleh teknisi); frekuensi radio.
  - Darurat di luar rumah: **Go in, Stay in, Tune in**. Darurat di dalam rumah: Get out, Stay out, Ring 999.
- **Kebutuhan khusus:** bayi (formula siap minum, popok); hewan (pakan, air); obat (daftar obat; [CUPLIKAN] minta resep ulang hingga 5 hari kerja lebih awal); disabilitas & pendamping punya halaman khusus [CUPLIKAN] https://beready.campaign.gov.uk/be-ready-for-emergencies/advice-for-disabled-persons-and-carers/ ; Priority Services Register (gratis, untuk pelanggan utilitas yang rentan).
- **Per skenario:**
  - Listrik padam: power bank, senter, radio, uang tunai, nomor 105. [CUPLIKAN] Sebelum badai: isi daya HP, power bank, dan baterai alat medis. https://beready.campaign.gov.uk/be-informed-about-hazards/storms/
  - Banjir [CUPLIKAN]: matikan gas/listrik/air bila aman; jangan sentuh saklar sambil berdiri di air; hindari air banjir. https://beready.campaign.gov.uk/be-informed-about-hazards/flooding/
  - Panas ekstrem [CUPLIKAN]: banyak minum; hindari matahari 11.00–15.00; jangan tinggalkan orang/hewan di mobil. https://prepare.campaign.gov.uk/be-informed-about-hazards/hot-weather/
  - Nuklir/radiologi [DIBACA] (UKHSA, diperbarui 10 Sep 2024): masuk gedung; matikan kipas/AC; tutup pintu, jendela, ventilasi; **biasanya di dalam ruangan 1–2 hari** (bisa lebih lama); iodium stabil hanya bila disarankan. https://www.gov.uk/government/publications/radiation-emergencies-information-for-the-public/what-to-do-in-a-radiation-emergency
  - Pandemi, konflik: tidak disebutkan.
- **Poin unik:** formula siap minum; cicil saat belanja rutin & donasikan kelebihan; peta lokasi stopkeran/gas/listrik; Priority Services Register; ajakan cek tetangga.

---

## 2. Jerman — BBK (+ BLE/ernaehrungsvorsorge.de untuk tabel pangan)

- **Pembaruan penting:** "Ratgeber für Notfallvorsorge und richtiges Handeln in Notsituationen" **diganti** oleh **"Vorsorgen für Krisen und Katastrophen"**. Edisi pertama 13 Okt 2025; PDF yang dibaca: **Stand 11/2025, 2. Auflage**. Topik baru: Schutz suchen (tempat berlindung termasuk saat serangan militer), disinformasi, disabilitas.
  - [DIBACA] https://www.bbk.bund.de/SharedDocs/Downloads/DE/Mediathek/Publikationen/Buergerinformationen/Ratgeber/BBK-Vorsorgen-fuer-Krisen-und-Katastrophen.pdf?__blob=publicationFile&v=44
  - [DIBACA] Checklist baru: https://www.bbk.bund.de/SharedDocs/Downloads/DE/Mediathek/Publikationen/Buergerinformationen/Ratgeber/Checklisten-zur-Vorsorge-Krisen-und-Katastrophen.pdf?__blob=publicationFile&v=19 (URL lama `ratgeber-notfallvosorge-checkliste.pdf` kini mengarah ke file yang sama)
  - [CUPLIKAN] Siaran pers: https://www.bbk.bund.de/SharedDocs/Pressemitteilungen/DE/2025/10/pm-13-neuer-ratgeber.html
- **Target durasi:** "möglichst **10 Tage**" selama mungkin, "zumindest **3 Tage**" sudah sangat membantu. Nilai min = 3, rekomendasi = 10. [DIBACA] Ratgeber hlm. 5
- **Air:** **2 L/orang/hari**, di dalamnya **0,5 L untuk memasak**. Contoh untuk 3 orang: **18 L/3 hari, 30 L/5 hari, 60 L/10 hari**. Ingat juga air untuk hewan. [DIBACA] Ratgeber hlm. 6
  - BLE [DIBACA]: angka 2 L = minum dewasa 1,5 L + 0,5 L untuk memasak pasta/kentang/beras. **Lansia ≥65 th: minum 2 L/hari** (jadi ±2,5 L dengan air masak). **Anak ≤12 th (bukan bayi): 1 L/hari.** https://www.ernaehrungsvorsorge.de/private-vorsorge/notvorrat/vorratskalkulator/
- **Pangan:** Ratgeber 2025 dan checklist barunya **tidak lagi memuat tabel kg**. Checklist hanya mencentang "Haltbare Lebensmittel für alle Personen für 3/5/7/10 Tage". Untuk angka pasti, Ratgeber merujuk ke tabel & kalkulator BLE di ernaehrungsvorsorge.de.
  - **Tabel A — BLE "Vorratstabelle" (berlaku sekarang, 1 orang, 10 hari, basis 2.200 kkal/hari)** [DIBACA] https://www.ernaehrungsvorsorge.de/private-vorsorge/notvorrat/vorratstabelle/

    | Kelompok pangan | /orang/10 hari | /orang/hari (kalkulator BLE) |
    |---|---|---|
    | Getreideprodukte, Brot, Kartoffeln (serealia, roti, kentang, pasta, beras) | **3,3 kg** | 0,33 kg |
    | Gemüse, Pilze (sayur, jamur; termasuk kacang-kacangan kaleng) | **4,0 kg** | 0,40 kg |
    | Obst (buah; kalengan/tahan simpan) | **2,5 kg** | 0,25 kg |
    | Getränke / Mineralwasser (minuman) | **20 L** | 2,00 L |
    | Milch, Milcherzeugnisse (susu UHT, keju keras) | **2,5 kg** | 0,25 kg |
    | Eier, Fleisch, Wurst, Fisch (telur, daging, sosis, ikan) | **1,2 kg** | 0,12 kg |
    | Fette, Öl (lemak: 180 g mentega/margarin + 0,15 L minyak) | **330 g** | ±33 g |

  - **Tabel B — BBK "Meine persönliche Checkliste" (edisi lama, "10-Tage-Vorrat", ±2.200 kkal/hari)** [DIBACA] dari salinan resmi Kota Kempen, berkas "Checkliste-BBK-2025-01": https://www.kempen.de/system/files/2025-06/Checkliste-BBK-2025-01.pdf (juga Koblenz: https://www.koblenz.de/rathaus/verwaltung/feuerwehr/vorsorge-selbsthilfe/vorsorge-fuer-den-katastrophenfall/meine-persoenliche-checkliste.pdf?cid=c2p)

    | Kelompok pangan | /orang/10 hari |
    |---|---|
    | Getränke | **20 L** (2 L/hari) |
    | Getreide, Getreideprodukte, Brot, Kartoffeln, Nudeln, Reis | **3,5 kg** |
    | Gemüse, Hülsenfrüchte | **4,0 kg** |
    | Obst, Nüsse | **2,5 kg** |
    | Milch, Milchprodukte | **2,6 kg** |
    | Fisch, Fleisch, Eier bzw. Volleipulver | **1,5 kg** |
    | Fette, Öle | **0,357 kg** |
    | Sonstiges | sesuai selera (gula, madu, cokelat, garam beryodium, dll.) |

    Selisih A dan B kecil. **Tabel A lebih baru**, jadi disarankan sebagai acuan. Versi lama 14 hari (Auswärtiges Amt/Kreis Calw [CUPLIKAN]): susu 3,7 kg; daging/ikan/telur 2,1 kg; lemak 0,5 kg; sayur 5,6 kg; buah 3,6 kg.
  - Kriteria memilih pangan (Ratgeber 2025): tahan lama tanpa kulkas, siap makan tanpa dimasak, waktu masak singkat (hemat bahan bakar), serta cocok dengan alergi, anak kecil, dan hewan.
- **Item checklist baru (resmi, 2025)** [DIBACA]:
  - Makan & minum: air 2 L/orang/hari; makanan tahan lama; kompor alternatif (kompor kemping/grill gas) + bahan bakar; stok pakan hewan.
  - Info/komunikasi: radio solar/baterai + baterai, atau radio engkol; aplikasi peringatan (NINA); power bank terisi; daftar nomor telepon di kertas.
  - Cahaya & kehangatan: senter + baterai cadangan; lilin + pemantik; pakaian hangat & selimut; sleeping bag; pemanas tanpa listrik (pemanas gas, kompor minyak, perapian etanol) + bahan bakarnya.
  - Hausapotheke: obat nyeri, penurun demam, termometer, desinfektan luka & kulit, plester/perban, obat diare/mual, obat flu, elektrolit, salep luka bakar & gigitan serangga, gel pendingin, semprot hidung, kain luka bakar, sarung tangan sekali pakai, kompres dingin, pinset, gunting, obat pribadi. **Obat rutin: stok ≥10 hari** (Ratgeber).
  - Hygiene: pasta & sikat gigi, sabun, produk menstruasi, **popok**, **kantong sampah besar & kuat untuk dipasang di toilet**, tisu toilet, desinfektan, deterjen, tisu basah, tisu dapur, sarung tangan rumah tangga, **toilet kemping**.
  - Brandschutz: detektor asap, APAR/semprot pemadam, **detektor karbon monoksida**.
  - Sonstiges: wadah air (pemadam/air pakai), **masker FFP2**, **helm pelindung**, **uang tunai (di luar uang di tas darurat)**.
  - Notgepäck (tas darurat): pakaian hangat, jas hujan, sepatu kokoh, baju ganti, P3K, obat pribadi, power bank, produk kebersihan, makanan tahan lama + botol isi ulang, map dokumen, sleeping bag/selimut, alat makan, pisau lipat + pembuka kaleng, senter, radio, pemantik/korek, tabir surya + topi, notes + pena, sarung tangan kerja, cadangan alat bantu (kacamata, alat bantu dengar), uang tunai.
- **Dokumen:** identitas (akta lahir, KTP), bukti kepemilikan, asuransi, ijazah, surat kuasa, wasiat & rekam medis, buku vaksin, daftar password, foto penting. Simpan dalam wadah tahan api atau air, buat salinan digital (cloud/USB). [DIBACA] Ratgeber hlm. 24–25
- **Kebutuhan khusus (disabilitas)** [DIBACA] hlm. 7–8: alat bantu (kacamata, alat bantu dengar) + baterai/charger cadangan; alat bantu mobilitas; rencana & stok obat; pakan & air untuk hewan pendamping; daftar kontak darurat; kartu darurat (Notfallausweis); aplikasi darurat **nora**; detektor asap bergetar/berlampu untuk tunarungu.
- **Per skenario:**
  - Listrik padam [DIBACA]: uang tunai (ATM mati); radio baterai/engkol; power bank/charger surya; masak dengan kompor kemping; tinggal di satu ruangan agar hangat, tetapi rutin membuka ventilasi (terutama bila memakai lilin). https://www.bbk.bund.de/DE/Warnung-Vorsorge/Vorsorge/Stromausfall/stromausfall_node.html
  - Panas [DIBACA]: minum **≥1,5–2 L/hari**; pakaian longgar & terang; gelapkan ruangan; konsultasi dosis obat ke dokter; jangan tinggalkan orang/hewan di mobil. https://www.bbk.bund.de/DE/Warnung-Vorsorge/Vorsorge/Mit-Naturgefahren-umgehen/Hitze-Duerre/hitze-duerre_node.html
  - Banjir [DIBACA] Ratgeber hlm. 28: naik ke area/lantai lebih tinggi; **jangan masuk basement**; hindari garasi bawah tanah dan underpass. Dokumen dalam wadah tahan air.
  - Nuklir/radiologi [DIBACA] Ratgeber hlm. 27: berlindung **serendah mungkin** (basement, garasi bawah tanah, stasiun U-Bahn), jauh dari jendela. BfS [CUPLIKAN]: tutup jendela/pintu, matikan ventilasi; **tablet yodium hanya atas perintah otoritas**. https://www.bfs.de/DE/themen/ion/notfallschutz/verhalten/jodblockade/jodblockade_node.html
  - Kimia/gas: naik ke lantai atas; segel jendela/pintu; matikan ventilasi.
  - Konflik/serangan udara/ledakan [DIBACA] hlm. 29–30: ruang bawah tanah tanpa jendela, atau ruang dalam (tangga, kamar mandi, lorong); hindari loteng; fasilitas umum (garasi bawah tanah, U-Bahn); helm pelindung ada di checklist.
  - Pandemi: masker FFP2 & desinfektan ada di checklist; panduan khusus tidak dibaca.
- **Poin unik:** satu-satunya negara dengan **tabel kuantitas pangan per kelompok** (BLE) dan kalkulator 1–28 hari untuk 1–10 orang; air dipecah antara minum dan masak, dengan angka berbeda untuk lansia dan anak; target 10 hari; detektor CO dan pemanas tanpa listrik; kantong sampah di toilet sebagai toilet darurat; panduan tempat berlindung per jenis ancaman.

---

## 3. Belanda — NCTV / Rijksoverheid, kampanye **"Denk Vooruit"**

- **Pembaruan:** kampanye multi-tahun mulai 1 Nov 2025; kampanye lanjutan 12 Okt 2026. NCTV [CUPLIKAN] mencatat kepemilikan noodpakket naik dari 30% ke 44% (Apr 2026). PDF infografis bertanggal 2025-11-26.
  - [CUPLIKAN] https://www.rijksoverheid.nl/actueel/nieuws/2026/10/12/nieuwe-denk-vooruit-campagne-om-extra-aandacht-te-vragen-om-voor-te-bereiden-op-noodsituatie
  - [CUPLIKAN] https://www.nctv.nl/actueel/nieuws/2026/04/13/steeds-meer-nederlanders-bereiden-zich-door-denk-vooruit-voor-op-noodsituaties
- **Target durasi:** **72 jam** ("de eerste 72 uur"). Nilai min = rekomendasi = 3. [DIBACA] https://www.denkvooruit.nl/bereid-je-voor/stel-je-noodpakket-samen
- **Air:** **3 L/orang/hari**. Halaman air minum: "minimaal 3 liter per persoon per dag" untuk 3 hari, ditambah air untuk hewan. Untuk distribusi air darurat, 3 L dipecah **2 L minum + 1 L untuk menyiapkan makanan**. Bawa ember bersih, botol kosong, atau jeriken ke titik pengambilan. [DIBACA] https://www.denkvooruit.nl/risicos/risicos-in-nederland/drinkwater
  - Catatan: Q&A internal Nov 2025 [CUPLIKAN] menyebut "4 à 5 liter p.p.". Angka ini tidak konsisten dengan halaman publik; pakai 3 L.
- **Pangan:** tahan lama (kacang, sayur kaleng, buah kering). Tidak ada kuantitas.
- **Item kit (resmi)** [DIBACA] PDF A4 https://www.denkvooruit.nl/site/binaries/site-content/collections/documents/2025/11/26/een-noodpakket-samenstellen/noodpakket-a4.pdf + https://www.rijksoverheid.nl/documenten/vraag-en-antwoord/veiligheidsregios-en-crisisbeheersing/wat-zit-er-in-een-noodpakket
  - Air kemasan (3 L/orang/hari); makanan tahan lama.
  - Radio baterai + HP dengan power bank.
  - Senter + baterai, lilin, korek api.
  - Kotak P3K dengan petunjuk; selimut; peluit.
  - Perkakas: palu, gergaji, tang potong.
  - Gel desinfektan, tisu toilet, tisu basah, pembalut, pasta & sikat gigi.
  - Salinan identitas + daftar nomor penting.
  - **Uang tunai €70/dewasa, €30/anak** untuk 72 jam pertama (angka anjuran, campuran uang kertas & koin); kunci cadangan rumah & mobil.
  - Tas/ransel tahan air untuk evakuasi. Cek setiap setengah tahun.
- **Kebutuhan khusus:** obat, makanan bayi, makan & minum untuk hewan.
- **Per skenario:**
  - Nuklir [CUPLIKAN]: tetap di dalam (perintah via NL-Alert); tutup jendela/pintu; matikan ventilasi; bisa sampai 72 jam. Tablet yodium **hanya atas saran pemerintah**: usia ≤40 th di zona 0–20 km; anak <18 th & ibu hamil di zona 20–100 km. https://www.denkvooruit.nl/risicos/risicos-in-nederland/nucleair/een-nucleair-ongeval-in-nederland ; https://www.rijksoverheid.nl/onderwerpen/straling/vraag-en-antwoord/voor-wie-zijn-jodiumtabletten-bedoeld
  - Air keran mati: titik air darurat 3 L/orang/hari; siapkan wadah.
  - Listrik padam: radio baterai (rampenzender regional), power bank, uang tunai.
  - Banjir, panas, pandemi, konflik: tidak terverifikasi.
- **Poin unik:** **uang tunai dengan angka per orang**; perkakas (palu/gergaji); tiga langkah kampanye: noodpakket, noodplan, saling bantu.

---

## 4. Swiss — BWL "Kluger Rat – Notvorrat" + BABS/Alertswiss

- **Dokumen:** brosur BWL edisi **Feb 2025** (DE/FR/IT; EN sejak 13 Okt 2025 [CUPLIKAN]). [DIBACA] https://www.bwl.admin.ch/dam/de/sd-web/T9r68p19kgxB/Prospekt_Notvorrat_DE_Web.pdf ; halaman: https://www.bwl.admin.ch/de/kluger-rat-notvorrat
- **Target durasi:** "**Empfehlung persönlicher Notvorrat für 7 Tage**" (pangan ±1 minggu). Air minimal untuk **3 hari**. Nilai min = 3 (air), rekomendasi = 7. Notvorrat dimaksudkan untuk menjembatani kekurangan sementara, bukan krisis panjang.
- **Air:** **≥9 L/orang** (sixpack botol 1,5 L) untuk minum + masak selama 3 hari, jadi **3 L/orang/hari**. **Air higiene dan flush toilet tidak termasuk.**
- **Pangan (daftar 7 hari, tanpa kuantitas):**
  - Minuman: air, jus, teh, kopi, susu/alternatif susu.
  - Siap makan: kaleng sayur/buah, kacang-kacangan (buncis saus tomat, kacang arab), daging/ikan (salami, sarden) atau alternatif vegetarian, saus, keju keras, minyak, bumbu, makanan manis & asin (cokelat, gula, keripik, kacang).
  - Perlu diolah: pasta, beras, müesli, sup instan/kaldu, makanan siap saji (rösti).
  - Ada makanan yang bisa dimakan dingin, untuk saat listrik padam.
  - Kalkulator: https://www.notvorratsrechner.bwl.admin.ch/de
- **Item kit lainnya:** masker higiene, hand sanitizer, obat pribadi, obat nyeri, desinfektan luka, perban, termometer; produk perawatan tubuh, tisu toilet, tisu; senter + baterai, power bank, lilin, korek; kompor gas/grill/rechaud fondue + bahan bakar; radio baterai (info pemerintah saat krisis, IBBK); kantong sampah; pembuka kaleng.
- **Uang tunai:** pecahan kecil & koin, **cukup untuk belanja seminggu dan kalau perlu satu tangki bensin**.
- **Kebutuhan khusus:** bayi: susu formula, bubur, vitamin, popok. Hewan: pakan, air, pasir/alas, obat. Pemilik kendaraan: **tangki minimal setengah penuh** atau baterai terisi.
- **Per skenario:**
  - Listrik padam: makanan siap makan tanpa dimasak, kompor gas, radio baterai, uang tunai (ATM, kartu, dan pembayaran via HP bisa mati).
  - Nuklir [DIBACA]: tablet yodium **sudah dibagikan ke semua rumah tangga dalam radius 50 km** dari PLTN, stok tambahan di apotek. Diminum **hanya bila otoritas memerintahkan**. https://blog.alertswiss.ch/de/gefahren-kennen/unfall-kernkraftwerk/notfallschutz-bei-einem-kkw-unfall-wie-ist-die-schweiz-vorbereitet/
  - Sirene "Allgemeiner Alarm": dengarkan radio atau Alertswiss, ikuti instruksi. [CUPLIKAN] https://www.babs.admin.ch/de/alarmierung
  - Komunikasi gagal: Notfalltreffpunkte (titik temu darurat). [CUPLIKAN] https://www.babs.admin.ch/dam/de/sd-web/Z8gD79plAgZG/Konzept_Notfalltreffpunkte_de.pdf
  - Pandemi: masker higiene + hand sanitizer ada di daftar.
  - Banjir, panas, konflik: tidak terverifikasi.
- **Poin unik:** air dihitung sebagai "satu sixpack per orang"; uang tunai = belanja seminggu + 1 tangki; tangki kendaraan ≥½; pembagian yodium di muka; titik temu darurat; Notvorrat dipakai dalam masak sehari-hari (rotasi).

---

## 5. Prancis — SGDSN, panduan **"Tous responsables – face aux risques, agissons"**

- **Dokumen:** rilis **20 Nov 2025** [CUPLIKAN] https://www.sgdsn.gouv.fr/publications/guide-tous-responsables (PDF di sgdsn.gouv.fr membalas **403**). Dibaca dari salinan resmi [DIBACA]: https://www.info.gouv.fr/upload/media/mixed/0001/16/b250783992e0c766ae97bce7cb6eb1e8f081fe33.pdf
- **Target durasi:** **72 jam**, karena "72 jam pertama sering paling berat". Persiapan membuat tim penolong bisa fokus pada yang paling membutuhkan.
- **Tiga prinsip:** (1) minum & makan, (2) tetap hangat, (3) merawat diri.
- **Air:** **6 L/orang** dalam botol untuk 72 jam, jadi **2 L/orang/hari**. Checklist memakai rumus "6 × jumlah orang = stok liter".
- **Pangan:** tidak mudah basi dan **tidak perlu dimasak** (kalengan, makanan bayi dalam jar, pakan hewan). Tidak ada kuantitas.
- **Item kit 72 jam:** radio baterai + baterai cadangan; kotak P3K (alkohol, plester, **masker**, kasa); obat (harian + darurat); perkakas dasar (pisau multifungsi, pembuka kaleng); makanan tanpa masak; pakaian hangat + selimut darurat; senter + baterai, lilin, pemantik/korek; charger HP; **kacamata cadangan**; air 6 L/orang; uang tunai (ATM bisa mati); **kunci duplikat rumah & mobil**; dokumen (KTP, resep, dll.); **buku & permainan**. Simpan di tempat mudah dijangkau; cek **2× setahun** (kedaluwarsa obat & makanan, ganti baterai).
- **Kebutuhan khusus:** makanan bayi, pakan hewan, obat, kacamata cadangan.
- **Per skenario** [DIBACA]:
  - Listrik & pemanas padam lama: disebut sebagai salah satu risiko utama.
  - Banjir: jangan pakai mobil; jangan turun ke basement/parkiran bawah tanah; matikan gas, listrik, pemanas; evakuasi hanya atas perintah; pantau Vigicrues/Météo-France.
  - Nuklir: berlindung di gedung; tutup dan segel pintu/jendela; matikan ventilasi; **tablet yodium hanya atas instruksi prefek**.
  - Kecelakaan industri/kimia: berlindung di dalam, segel ventilasi, bernapas lewat kain basah.
  - Pandemi (COVID-19/flu): cuci tangan dengan sabun/gel, tisu sekali pakai, ventilasi ruangan, **pakai masker**.
  - Konflik/ancaman: siber, manipulasi informasi (lapor ke Pharos), terorisme; peringatan via sirene (diuji Rabu pertama tiap bulan) dan **FR-Alert**; georisques.gouv.fr dan rencana PIMS.
  - Panas ekstrem: tidak ditemukan di teks panduan.
  - Juga ada: kebakaran hutan, gempa, tsunami, letusan gunung api (wilayah seberang laut).
- **Poin unik:** kacamata cadangan, kunci duplikat, buku & permainan (kesehatan mental); rumus air di checklist; cakupan ancaman militer/siber/disinformasi; rencana PIMS.

---

## 6. Belgia — Centre de Crise National / Nationaal Crisiscentrum

- **Dokumen:** brosur **"Prêts. Ensemble." / "Samen voorbereid"**, terbit **1 Okt 2026** (newsroom; metadata PDF 17 Sep 2026). [DIBACA] https://centredecrise.be/sites/default/files/documents/files/WEB-Brochure-Pr%C3%AAts.%20Ensemble-FR.pdf ; https://centredecrise.be/fr/newsroom/prets-ensemble-le-centre-de-crise-national-publie-une-brochure-pour-aider-le-citoyen-se ; halaman kit [DIBACA] https://centredecrise.be/fr/que-pouvez-vous-faire/preparez-un-kit-durgence/un-kit-durgence-la-maison
- **Target durasi:** **≥72 jam**. Halaman resmi menyebut ini anjuran "di seluruh Uni Eropa".
- **Air:**
  - **3–10 L/orang/hari** di rumah. Brosur: "tiga liter hampir tidak cukup untuk minum dan memasak"; tambah bila ingin mandi atau menyiram toilet. Halaman kit: dewasa minum 1,5–2 L/hari.
  - Tas evakuasi: 1 botol air.
  - Gangguan pasokan air minum: **4 L/orang/hari**, ditambah botol kosong atau jeriken. [DIBACA] https://centredecrise.be/fr/risques-en-belgique/risques-societaux/defaillance-de-lapprovisionnement-en-eau-potable
- **Pangan:** tahan lama, bisa dimakan atau disiapkan tanpa air dan listrik (kacang, kalengan, biskuit) + pembuka kaleng atau pisau multifungsi. Tidak ada kuantitas.
- **Item kit di rumah:** radio engkol/baterai (sebaiknya **DAB+ dan FM**) + baterai isi ulang & cadangan; air; makanan; **tablet yodium** (gratis di apotek, diminum bila diperintahkan, "jamais de votre propre initiative"); senter (sebaiknya engkol); pakaian hangat/selimut; lilin & korek. "Tidak ada kit standar"; tidak perlu membeli kit mahal, cicil saat belanja.
- **Ransel evakuasi:** salinan dokumen (kontrak asuransi, KTP); rencana darurat atau daftar nomor; pena & kertas; uang tunai secukupnya (halaman kit: **cukup untuk ±72 jam**, jangan simpan jumlah besar); 1 botol air; biskuit, energy bar, buah kering; P3K dasar (desinfektan, plester, kasa, gunting); produk kebersihan (tisu basah, gel, pasta & sikat gigi, tisu toilet, pembalut); **obat esensial ≥3 hari**; peluit; power bank + charger HP. Persediaan kecil juga disarankan di mobil dan tempat kerja.
- **Kebutuhan khusus:**
  - Anak: makanan, popok, mainan atau benda penenang.
  - Hewan: kandang/keranjang angkut, tali + kalung/harness, pakan tahan lama + air + mangkuk, paspor & buku vaksin + foto pemilik bersama hewan, mainan, obat hewan, kantong kotoran; nomor dokter hewan; microchip; rencana menumpang bersama hewan.
  - Orang yang butuh bantuan tambahan: dipetakan di rencana keluarga.
- **Per skenario:**
  - Nuklir [CUPLIKAN]: hampir seluruh negeri masuk zona 100 km; tablet yodium gratis di apotek (prioritas keluarga dengan anak ≤18 th, ibu hamil & menyusui); berlindung di dalam. https://risquenucleaire.be/fr/faq
  - Air minum terganggu: 4 L/orang/hari.
  - Listrik padam: radio engkol/baterai DAB+/FM, karena internet & jaringan seluler bisa mati.
  - Banjir, panas, pandemi disebut sebagai contoh krisis, tetapi tanpa item spesifik di brosur. Konflik: tidak disebutkan.
- **Nomor:** 112 (darurat), 1722 (pemadam non-darurat), 1733 (dokter jaga); daftar ke **BE-Alert**.
- **Poin unik:** rentang air terlebar (3–10 L); radio DAB+; tablet yodium masuk kit; daftar perlengkapan hewan paling rinci; anjuran tidak membeli kit mahal; kit di mobil/kantor.

---

## 7. Uni Eropa — European Preparedness Union Strategy

- **Dokumen:** Joint Communication **JOIN(2025) 130 final, Brussels 26.3.2025** [DIBACA] https://commission.europa.eu/document/download/526806b6-c4e1-43d1-81b7-947308efbab1_en?filename=eu-preparedness-union-strategy.pdf ; EUR-Lex https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A52025JC0130
- **Key action 14:** "Develop guidelines to reach a population self-sufficiency of **minimum 72 hours**". Komisi akan mengusulkan pedoman untuk negara anggota di bawah inisiatif **PreparEU**. Cakupannya: penyimpanan pasokan esensial, rencana krisis, ketersediaan shelter, lahan & ruang kritis, serta perlindungan orang, **hewan**, dan properti; disertai kampanye dan platform online baru. Jadwal di annex: **2026** [CUPLIKAN dari annex/factsheet].
- **Key action 13:** **EU Preparedness Day** tahunan dan pedoman komunikasi risiko, termasuk kebutuhan kelompok rentan.
- **Key action 9 dan dokumen turunannya:** EU Stockpiling Strategy **COM(2025) 528, 9 Jul 2025** [CUPLIKAN] https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52025DC0528. Isinya stok di tingkat UE dan negara anggota, bukan stok rumah tangga.
- **Status per 2026-11-03:** halaman topik Komisi [DIBACA] https://commission.europa.eu/topics/preparedness_en masih mencantumkan pedoman 72 jam sebagai rencana aksi. **Pedoman resmi yang sudah diadopsi dan daftar kit resmi UE tidak ditemukan.** Leaflet nasional 72 jam dikumpulkan di Union Civil Protection Knowledge Network (mis. Prancis, Belanda) [CUPLIKAN] https://civil-protection-knowledge-network.europa.eu/media/leaflet-emergency-kit-72-hours-self-sufficiency-france
- **Air, pangan, item:** tidak disebutkan dalam dokumen strategi. Contoh item dari Komisioner Lahbib (air, makanan, senter, power bank, radio, uang tunai, obat) hanya dari **liputan pers (secondary, bukan dokumen resmi)**: https://www.euronews.com/my-europe/2025/03/26/brussels-ask-eu-citizens-to-put-together-a-72-hour-emergency-kit-to-face-crises

---

## Tabel perbandingan

| Negara | Dokumen (terbit) | Min hari | Rekomendasi hari | Air L/orang/hari | Kuantitas pangan | Uang tunai | Yodium | Obat |
|---|---|---|---|---|---|---|---|---|
| Inggris | Be Ready (22 Okt 2026) | 3 | 3 | **3** (minum saja; masak/cuci tambahan) | tidak ada | koin+kertas (jumlah tidak disebut) | hanya bila disarankan (UKHSA) | esensial; daftar obat |
| Jerman | BBK Ratgeber (Okt 2025, Stand 11/2025) + BLE | 3 | **10** | **2** (1,5 minum + 0,5 masak); lansia 2 minum; anak ≤12 1 minum | **ya, tabel kg** (BLE: 3,3/4,0/2,5/2,5/1,2 kg + 330 g lemak + 20 L per 10 hari; 2.200 kkal/hari) | ya, di luar tas darurat | hanya atas perintah (BfS) | rutin **≥10 hari** |
| Belanda | Denk Vooruit (Nov 2025; kampanye Okt 2026) | 3 | 3 | **3** (2 minum + 1 masak) | tidak ada | **€70/dewasa, €30/anak** | ≤40 th 0–20 km; <18 & hamil 20–100 km; atas saran | ya (tanpa durasi) |
| Swiss | BWL Notvorrat (Feb 2025) | 3 (air) | **7** | **3** (9 L/3 hari; tanpa higiene) | daftar jenis, tanpa kg | **belanja 1 minggu + 1 tangki** | sudah dibagikan ≤50 km; atas perintah | pribadi |
| Prancis | SGDSN Tous responsables (20 Nov 2025) | 3 | 3 | **2** (6 L/72 jam) | tidak ada | ya | atas instruksi prefek | harian + darurat |
| Belgia | Prêts. Ensemble. (1 Okt 2026) | 3 | 3 | **3–10** (rumah); 4 saat air mati | tidak ada | cukup ±72 jam | gratis di apotek; atas perintah | **≥3 hari** di ransel |
| UE | JOIN(2025)130 (26 Mar 2025) | 3 | — | tidak disebutkan | tidak disebutkan | tidak disebutkan | — | — |

### Konsensus & perbedaan (masukan untuk S1/S2; bukan keputusan)
- **Air:** 4 dari 6 negara memakai **3 L/orang/hari** (UK hanya untuk minum; NL & CH untuk minum + masak). Jerman 2 L dan Prancis 2 L lebih rendah. Belgia memberi rentang 3–10 L termasuk higiene. Default 3 L di PLAN §2 sejalan dengan mayoritas. Swiss & Belgia tegas menyatakan air higiene **di luar** angka itu.
- **Air menurut usia (Jerman/BLE):** lansia ≥65 th 2 L minum (vs dewasa 1,5 L); anak ≤12 th 1 L. Ini bisa langsung dipakai untuk bobot S2.
- **Pangan:** hanya Jerman (BLE) yang memberi **kg per kelompok**. Per orang per hari: serealia 0,33 kg; sayur 0,40 kg; buah 0,25 kg; susu 0,25 kg; protein hewani 0,12 kg; lemak 33 g; total 2.200 kkal. Bisa dipakai sebagai "contoh komposisi" yang diadaptasi ke pangan Indonesia (beras, mi, kalengan).
- **Durasi:** mayoritas 72 jam (UK, NL, FR, BE, UE); Swiss 7 hari; Jerman 10 hari.
- **Uang tunai:** NL memberi angka per orang; CH memberi rumus (belanja seminggu + 1 tangki). Rumus CH bisa dipakai tanpa nominal Rupiah.
- **Yodium:** semua sepakat **diminum hanya atas perintah otoritas**. Ini sejalan dengan PLAN §2.1.
- **Item yang hanya muncul di sedikit sumber:** detektor CO & pemanas tanpa listrik (DE); helm & FFP2 (DE); formula siap minum (UK); kunci & kacamata cadangan (FR, NL, DE); buku/permainan (FR); radio DAB+ (BE); tangki ≥½ (CH); kantong sampah di toilet (DE).

## Celah data
1. Inggris, Belanda, Swiss, Prancis, Belgia: **tidak ada kuantitas pangan (kg/kkal)**.
2. Sanitasi/toilet darurat hanya rinci di Jerman (toilet kemping, kantong sampah di toilet). Negara lain hanya menyebut tisu toilet atau produk kebersihan.
3. Panas ekstrem: hanya UK (cuplikan) dan DE (dibaca). Tidak ditemukan di panduan FR & BE.
4. Konflik/perang: dibahas DE (tempat berlindung) dan FR (ancaman, disinformasi). UK, NL, CH, BE tidak memberi item khusus.
5. UE: pedoman 72 jam (target 2026) **belum terbit**; tidak ada daftar kit resmi UE.
6. Beberapa poin masih [CUPLIKAN]: NL yodium & nuklir, CH sirene & titik temu, UK banjir/panas/badai & 5 hari kerja resep, BfS yodium, BE zona yodium, UE annex 2026 & Stockpiling Strategy. Q1 sebaiknya membaca ulang halaman-halaman ini.
7. Angka "4 à 5 liter" di Q&A Denk Vooruit bertentangan dengan angka publik 3 L. Yang dipakai 3 L.
