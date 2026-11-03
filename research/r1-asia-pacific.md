# R1 — Asia-Pasifik

- Agent: R1 · Tanggal akses semua sumber: **2026-11-03**
- Cakupan: Jepang, Korea Selatan, Taiwan, Singapura, Filipina, Australia, Selandia Baru
- File data: `research/r1-asia-pacific.json` (skema PLAN.md §4.1, ditambah `verification`, `sanitation`, `go_bag`, `scenario_items`, `*_urls`, `dead_links`). Record pertama adalah status riset, bukan negara.

## Catatan akses web & tingkat verifikasi

- WebFetch gagal DNS (`getaddrinfo ENOTFOUND`) sepanjang sesi. Halaman diunduh dengan `curl -sSL` (User-Agent default, lewat proxy sesi). Tidak ada pemalsuan User-Agent, mirror, atau arsip.
- **[DIBACA]** = halaman/PDF resmi diunduh dan teksnya dibaca. **[CUPLIKAN]** = hanya dari cuplikan hasil WebSearch karena server membalas 403, memutus koneksi, atau URL-nya mati. Angka [CUPLIKAN] perlu diverifikasi ulang sebelum dikunci.
- Server yang memblokir atau mati: getready.govt.nz & civildefence.govt.nz (403), nema.gov.au (koneksi diputus), pia.gov.ph / ocd.gov.ph / ndrrmc.gov.ph / doh.gov.ph (403), prepare.mnd.gov.tw/…/go-bag (403), kokuminhogo.go.jp (404), kantei.go.jp/…/sonae.html (404), beberapa URL lama safekorea.go.kr (dialihkan ke beranda).

---

## 1. Jepang

Lembaga: **防災庁** (Badan Penanggulangan Bencana, berdiri 2026-11-02 sebagai pengganti 内閣府 防災担当), **農林水産省** (MAFF), **Pemerintah Metropolitan Tokyo** (東京都防災), 環境省 (hewan peliharaan), 気象庁 (JMA).

| Parameter | Nilai | Sumber |
|---|---|---|
| Target durasi | **Min. 3 hari, sebaiknya 1 minggu** | Seruan darurat 防災庁 2026-11-02 [DIBACA] https://www.bousai.go.jp/common2026/pdf/Urgent_Request_for_Stronger_Pre_Disaster_Preparedness_Public.pdf ; CAO check.html [DIBACA] https://www.bousai.go.jp/kyoiku/hokenkyousai/check.html |
| Alasan & perpanjangan | Utilitas sering pulih >1 minggu, bantuan bisa tiba >3 hari, toko bisa kosong 1 minggu. Maka "min. 3 hari s/d 1 minggu × jumlah orang", dan **2 minggu** bila hazard map wilayah menuntut | MAFF [DIBACA] https://www.maff.go.jp/j/zyukyu/foodstock/chapter01.html |
| Air | **3 L/orang/hari, sudah termasuk air untuk memasak** (air bilas toilet di luar angka ini) | 防災庁 2026 [DIBACA]; CAO check.html [DIBACA] |
| Contoh air MAFF | 2 L × 6 botol × 4 dus = 48 L untuk 2 dewasa/1 minggu | [DIBACA] https://www.maff.go.jp/j/pr/aff/2603/spe1_01.html |
| Toilet portabel | **5 buah/orang/hari × 3 hari = stok minimum. Stok 1 minggu dianjurkan** (keluarga 4 orang: 60 buah untuk 3 hari) | Tokyo 広報東京都 2025-09 [DIBACA] https://www.koho.metro.tokyo.lg.jp/2025/09/01-1.html |
| Dasar angka 5 | "Rata-rata buang air 5 kali/hari", 200–300 ml/kali, ditambah 200 ml/kali bila memakai air bilas. Angka ini dibuat untuk perencanaan shelter | Pedoman toilet pengungsian CAO 2022-04 [DIBACA] https://www.bousai.go.jp/taisaku/hinanjo/pdf/2204hinanjo_toilet_guideline.pdf |
| Tisu toilet | ≈1 rol/orang/minggu | Tokyo 2025-09 [DIBACA] |
| Gas kaleng | ≈6 tabung/orang/minggu (12 untuk 2 dewasa) | MAFF [DIBACA] https://www.maff.go.jp/j/zyukyu/foodstock/chapter07.html |
| Obat resep | Selalu sisakan cadangan ±1 minggu | Pamflet Tokyo R7.11 [DIBACA] https://www.bousai.metro.tokyo.lg.jp/_res/common/bichiku/pamph_r7_11.pdf |
| Hewan peliharaan | Makanan & air min. 5 hari, sebaiknya ≥7 hari | 環境省 [DIBACA] https://www.env.go.jp/nature/dobutsu/aigo/2_data/pamph/h3009a/a-1a.pdf |
| Kalori | Tidak disebutkan | — |

**Rolling stock (ローリングストック):** beli bahan makanan harian sedikit lebih banyak, konsumsi yang paling dekat kedaluwarsa, lalu isi ulang. Metode ini dipadukan dengan 非常食 (makanan darurat khusus). Sumber: 防災庁 2026 ("日頃使っているものを多めに買っておき、使ったら補充") [DIBACA], CAO check.html ("ローリング・ストック方式") [DIBACA], MAFF [DIBACA] https://www.maff.go.jp/j/zyukyu/foodstock/chapter01.html.

**Daftar belanja MAFF untuk 2 dewasa/1 minggu** [DIBACA] https://www.maff.go.jp/j/pr/aff/2603/spe1_01.html: beras 2 kg × 2, sōmen 2 × 300 g, pasta 2 × 600 g, mi cup 6, nasi kemasan 6, makanan retort 18 + saus pasta 6, kaleng daging/ikan 18, sayur tahan lama, bumbu, jus sayur, sup instan, dan camilan. Ukuran 1 porsi nasi ≈ 75 g.

**Catatan verifikasi toilet (run lanjutan):** pemerintah pusat (seruan 防災庁 2026 dan CAO check.html) hanya mewajibkan 携帯用トイレ **tanpa menyebut jumlah** [DIBACA]. Angka 5/orang/hari untuk rumah tangga berasal dari **Tokyo** [DIBACA], dengan dasar rata-rata ekskresi dalam pedoman CAO [DIBACA]. Pemda lain memakai angka yang sama: Suginami (min. 3 hari, anjuran 7 hari) [CUPLIKAN] https://www.city.suginami.tokyo.jp/s015/news/27750.html dan Nagoya (5 × 7 hari × jumlah orang) [CUPLIKAN] https://www.city.nagoya.jp/atsuta/kurashi/1022124/1036044.html. Dari 国土交通省 dan 経産省 tidak ditemukan angka per rumah tangga. Jadi baseline PLAN "~5x/orang/hari" **terkonfirmasi**, dengan catatan bahwa sumbernya pemda dan pedoman shelter, bukan anjuran rumah tangga nasional.

**Item khas lain:** pengikat furnitur [DIBACA, 防災庁 2026], 感震ブレーカー (pemutus listrik otomatis saat gempa) [CUPLIKAN] https://www.bousai.go.jp/jishin/kanshin_breaker.html, lentera di 3 ruangan [DIBACA, Tokyo], dan tas evakuasi 非常持ち出し袋 yang disimpan dekat pintu [DIBACA, CAO].

**Skenario:**
- Peringatan 南海トラフ臨時情報: siaga khusus 1 minggu, lalu 1 minggu lanjutan [DIBACA] https://www.jma.go.jp/jma/kishou/know/jishin/nteq/bosai.html
- Abu gunung Fuji: masker DS2/N95, goggle, stok min. 3 hari dan bila mungkin ≥7 hari [DIBACA] https://www.fujisan-kouhai.metro.tokyo.lg.jp/en/preparation_en/
- Nuklir: tetap di dalam ruangan. Tablet iodium dibagikan otoritas, bukan untuk konsumsi mandiri [CUPLIKAN]
- Misil (J-Alert): [CUPLIKAN], karena kokuminhogo.go.jp membalas 404

## 2. Korea Selatan

Lembaga: **행정안전부 (MOIS)**, portal 국민재난안전포털 / 국민안전24.

| Parameter | Nilai | Sumber |
|---|---|---|
| Tas bertahan hidup (생존배낭) | 2–3 hari/orang | [DIBACA] https://safekorea.go.kr/safekorea-kor/acts/nacts/action-guide.do?category=stateOfEmergency&actsHeaderTitle=%EB%B9%84%EC%83%81%EC%82%AC%ED%83%9C&menuSn=4 |
| Stok darurat nasional (비상대비물자) | **Makanan & air 30 hari** (beras, ramyeon, tepung, kaleng); gas butana ≥15 kaleng | [DIBACA] https://old.safekorea.go.kr/idsiSFK/neo/main_m/set/supplies.html |
| Shelter nuklir | Siapkan ≥2 minggu (radiasi turun ±1/1000 setelah 2 minggu) | [DIBACA] halaman 비상사태 di atas |
| Min. 3 hari untuk rumah tangga | Hanya muncul di cuplikan | [CUPLIKAN] https://www.safekorea.go.kr/idsiSFK/sfk/cs/sfc/securityTrick.do |
| Air L/orang/hari | Tidak disebutkan | — |
| Toilet | Tidak disebutkan | — |
| Kalori | Tidak disebutkan | — |

Ciri khas: panduan sangat berorientasi perang dan KBRN (masker gas, segel kusen dengan selotip, baju pelindung). Ada pula larangan menimbun dan mekanisme penjatahan [DIBACA].

## 3. Taiwan

Lembaga: **國防部全民防衛動員署** (Kemhan), buku panduan 《當危機來臨時》 edisi 2025-09-16.

| Parameter | Nilai | Sumber |
|---|---|---|
| Stok rumah | **Min. 7 hari per rumah tangga** | [DIBACA] https://prepare.mnd.gov.tw/emergency-supplies/household-supplies |
| Air | **Min. 3 L/orang/hari** | [DIBACA] idem |
| Tas evakuasi | 1–3 hari/orang | [CUPLIKAN] https://prepare.mnd.gov.tw/emergency-supplies/go-bag (403) |
| Air di tas evakuasi | 2 × 600 ml | [DIBACA] https://prepare.mnd.gov.tw/assets/pdf/manual.zh-Hant.pdf |
| Berat tas | ±15 kg pria / ±10 kg wanita; cek tiap 6 bulan | [DIBACA] manual |
| Toilet | Tisu toilet & kantong plastik, tanpa jumlah | [DIBACA] |
| Kalori | Tidak disebutkan | — |

Ciri khas: pemisahan tegas antara stok rumah dan tas evakuasi, peringatan bahwa pintu elektrik/ATM/lift gagal saat listrik padam, dan bab ketahanan mental serta melawan disinformasi [DIBACA].

## 4. Singapura

Lembaga: **SCDF**, Civil Defence Emergency Handbook edisi ke-10 (2026).

| Parameter | Nilai | Sumber |
|---|---|---|
| Stok pangan pokok | **2 minggu** (beras, mi, kaleng; prinsip A-B-C, tanpa menimbun) | [DIBACA] https://www.scdf.gov.sg/docs/default-source/comm.---volunteers-(docs)/(2026)-scdf-emergency-handbook-(english).pdf?sfvrsn=1407b4dd_1 |
| Durasi minimum | Tidak disebutkan | — |
| Air | Tidak disebutkan. Air kemasan hanya item **opsional** Ready Bag | [DIBACA] https://www.scdf.gov.sg/home/community-volunteers/community-preparedness/community-programmes/ready-bag |
| Ready Bag | Senter + baterai, obat pribadi, map dokumen tahan air, peluit, P3K, masker N95, perlengkapan anak | [DIBACA] idem |
| Toilet, kalori | Tidak disebutkan | — |

Ciri khas: shelter rumah tangga (HS) di flat modern, dan stok pangan dibingkai sebagai bagian dari "Economic Defence" (Total Defence) [DIBACA].

## 5. Filipina

Lembaga: **NDRRMC / OCD**, dikutip lewat PIA. Panduan rumah tangga nasional yang utuh tidak ditemukan.

| Parameter | Nilai | Sumber |
|---|---|---|
| Target | **72 jam** "sebagaimana direkomendasikan NDRRMC" | [DIBACA] dokumen pengadaan OSG FY2024 https://osg.gov.ph/public/documents/procurement/bidding/2023/023-11-220/TOR%20Emergency%20Go%20Bags%20NEP%20FY2024.pdf |
| Mandiri min. 72 jam "dan mungkin lebih" (skenario West Valley Fault) | — | [CUPLIKAN] https://pia.gov.ph/news/ocd-ncr-72-hr-self-sufficiency-crucial-survival-measure-after-big-one/ |
| Air | Tidak disebutkan dalam L/hari ("air untuk 3 hari"). Spesifikasi go bag OSG: botol 1,5 L + 10 tablet penjernih | [CUPLIKAN] PIA; [DIBACA] OSG |
| Makanan | Energy bar/biskuit 2 pak/orang + kaleng ≥150 g (OSG); makanan siap santap, bukan beras mentah | [DIBACA] OSG; [CUPLIKAN] PIA |
| Go bag | Boleh berupa ember; cek tiap 3 bulan | [CUPLIKAN] https://pia.gov.ph/disaster-information-service/civil-defense-promotes-go-bag-for-emergencies/ |
| Toilet, kalori | Tidak disebutkan | — |

## 6. Australia

Lembaga: **NEMA** (federal) dan **Get Ready Queensland** (negara bagian; panduan paling konkret).

| Parameter | Nilai | Sumber |
|---|---|---|
| Target | **3 hari** di rumah tanpa listrik; lebih lama untuk daerah terpencil | [DIBACA] https://www.getready.qld.gov.au/sites/default/files/2023-12/GRQ%20Emergency%20Kit%20checklist.pdf |
| Air | **Min. 10 L/orang untuk 3 hari** (≈3,33 L/hari, hasil bagi dan bukan angka sumber) | [DIBACA] idem; https://www.qld.gov.au/emergency/dealing-disasters/disaster-types/flood/flood-prepare/pack-an-emergency-kit |
| Air (NEMA) | "At least 3 litres per person", durasi tidak disebutkan | [CUPLIKAN] https://www.nema.gov.au/sites/default/files/2025-05/NEMA_Flood_VERSION-2-290425.pdf |
| Obat | 1 minggu | [DIBACA] GRQ |
| Hewan | Min. 5 hari | [DIBACA] https://www.getready.qld.gov.au/prepare/kit |
| Toilet, kalori | Tidak disebutkan (hanya toiletries & kantong sampah) | [DIBACA] GRQ |

Ciri khas: perkakas untuk mematikan listrik, air, dan gas; terpal dan tali; cek kit min. 2× setahun [DIBACA].

## 7. Selandia Baru

Lembaga: **NEMA** (Get Ready / civildefence.govt.nz, keduanya 403) dan **Auckland Emergency Management** (verifikasi silang).

| Parameter | Nilai | Sumber |
|---|---|---|
| Target | ≥3 hari; makanan "a week or more if you can" | [CUPLIKAN] https://getready.govt.nz/prepared/household/supplies |
| Air | **Min. 3 L/orang/hari** (minum + higiene dasar); ≥9 L/orang untuk 3 hari | [DIBACA] https://www.aucklandemergencymanagement.govt.nz/get-prepared/get-home-ready/store-water |
| Air 1 minggu | 21 L/orang; 9 L = 4 botol 2,25 L | [CUPLIKAN] https://getready.govt.nz/prepared/household/supplies/storing-water |
| Penggantian air | Tiap 6 bulan; disinfeksi pemutih tanpa aroma, tunggu 30 menit | [DIBACA] Auckland |
| Toilet darurat | Sistem dua ember 15–20 L bertutup; jangan flush setelah gempa besar. Jumlah per hari tidak disebutkan | [CUPLIKAN] https://www.civildefence.govt.nz/guidance-training/consistent-messages/readiness/have-emergency-supplies |
| Kalori | Tidak disebutkan | — |

Ciri khas: tsunami "Long or Strong, Get Gone" [CUPLIKAN] dan stok darurat di mobil untuk kasus abu vulkanik [CUPLIKAN].

---

## Tabel perbandingan

| Negara | Min. hari | Anjuran hari | Air L/orang/hari | Toilet/orang/hari | Ciri khas | Verifikasi utama |
|---|---|---|---|---|---|---|
| Jepang | 3 | 7 (2 minggu bila hazard tinggi) | **3** (termasuk masak) | **5** (Tokyo/CAO) | Rolling stock; gas ≈6/orang/minggu | [DIBACA] |
| Korea Selatan | 2–3 (tas); 3 [CUPLIKAN] | 14 (nuklir); 30 (stok darurat) | tidak disebutkan | tidak disebutkan | Orientasi perang/KBRN; gas ≥15 | campuran |
| Taiwan | 7 (rumah) | 7 | **3** | tidak disebutkan | Kemhan; batas berat tas | [DIBACA] |
| Singapura | tidak disebutkan | 14 (pangan pokok) | tidak disebutkan | tidak disebutkan | Air opsional di Ready Bag | [DIBACA] |
| Filipina | 3 (72 jam) | 3 | tidak disebutkan | tidak disebutkan | Go bag boleh ember | sebagian besar [CUPLIKAN] |
| Australia (QLD) | 3 | 3 (+ untuk terpencil) | 10 L/3 hari (≈3,33) | tidak disebutkan | Obat 1 minggu | [DIBACA] (NEMA [CUPLIKAN]) |
| Selandia Baru | 3 | 7 | **3** | tidak disebutkan (ember ganda) | 21 L/minggu | campuran |

**Kesimpulan untuk SurvivalCheck:**
- Air **3 L/orang/hari** didukung langsung oleh JP, TW, NZ, dan ≈AU. Ini konsisten dengan baseline PLAN.
- Pola "min. 3 hari, anjuran 7 hari" menjadi konsensus (JP, NZ, TW 7 hari). KR dan SG menunjuk 14–30 hari untuk skenario perang atau krisis pasokan.
- Angka toilet **5/orang/hari** hanya ada di Jepang.

## Celah data

1. **Kalori/hari:** tidak disebutkan oleh ketujuh negara. Gunakan standar Sphere/WFP (R4).
2. **Toilet portabel:** hanya Jepang yang memberi angka, dan angka itu berasal dari Tokyo dan pedoman shelter CAO. Pemerintah pusat Jepang, 国交省, dan 経産省 tidak memberi angka rumah tangga.
3. **Korea:** air L/hari tidak disebutkan; angka "min. 3 hari" rumah tangga baru dari cuplikan; portal sedang bermigrasi dan banyak URL mati.
4. **Singapura:** durasi minimum dan angka air tidak disebutkan.
5. **Filipina:** situs resmi (OCD/NDRRMC/PIA/DOH) membalas 403, jadi sebagian besar data masih [CUPLIKAN]. Panduan rumah tangga nasional yang utuh tidak ditemukan.
6. **Selandia Baru:** getready.govt.nz membalas 403. Angka 21 L/minggu dan durasi makanan masih [CUPLIKAN]. Hanya angka 3 L/hari yang [DIBACA] via Auckland.
7. **Australia:** nema.gov.au memutus koneksi. Data federal masih [CUPLIKAN], yang terbaca langsung adalah sumber negara bagian (Queensland).
8. **Jepang:** halaman misil kokuminhogo.go.jp (404) dan pamflet 感震ブレーカー masih [CUPLIKAN]. Halaman klasik kantei "sonae" sudah 404.
9. **Pangan per orang (gram/porsi):** hanya ada di daftar MAFF (2 dewasa/1 minggu). Negara lain hanya memberi daftar jenis makanan.
