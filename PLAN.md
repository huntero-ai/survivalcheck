# SurvivalCheck — Rencana Proyek

> Status: **PLAN SAJA — belum dieksekusi.** Dokumen ini membagi pekerjaan ke beberapa agent terpisah, lalu semua hasilnya dikumpulkan dan diintegrasikan oleh satu agent PM.

### Keputusan yang sudah dikunci (dari user)

| Topik | Keputusan | Dampak ke plan |
|---|---|---|
| Lokalisasi | **Fokus Indonesia** | Panduan BNPB/BMKG/Badan Geologi/Kemenkes jadi rujukan utama lokal; panduan luar negeri dipakai sebagai pembanding & pelengkap. Tempat beli = toko/jaringan di Indonesia. Agent riset baru **R5 (Indonesia)**. |
| Skenario | **Semua skenario** | Ada modul skenario (§2.1): item tambahan per jenis krisis, dipilih user. |
| Harga | **Tanpa harga** | S3 & E3 hanya menampilkan tempat beli + alternatif, tanpa nominal Rupiah. |
| Hosting | **GitHub Pages** | E1 menyiapkan path relatif, scope service worker untuk sub-path repo, dan workflow deploy GitHub Actions. |
| Bahasa | Default tetap: **Indonesia (utama) + English** | — |

---

## 0. Tujuan

1. **Merangkum** panduan kesiapsiagaan resmi dari pemerintah (Jepang, Inggris, Swedia, Jerman, AS, dll.) yang sekarang tersebar di banyak tempat, menjadi satu daftar kebutuhan yang konsisten dan ada sumbernya.
2. **Membangun web-app sederhana yang jalan offline** (PWA) untuk mengecek *sejauh mana user sudah siap*:
   - Input jumlah orang yang ditanggung (dewasa, anak, bayi, lansia, hewan peliharaan, kebutuhan khusus).
   - Input target lama bertahan (3 / 7 / 14 / 30 hari atau custom).
   - Hasil: **tier kesiapan** (dari "Belum Siap Sama Sekali" sampai "Mandiri"), **estimasi berapa hari bisa bertahan** saat ini, dan **daftar kekurangan**: apa yang harus disiapkan, berapa banyak, dan beli di mana.

---

## 1. Ringkasan Awal Panduan Resmi (baseline, WAJIB diverifikasi agent riset)

> Angka di bawah ini adalah titik awal dari pengetahuan umum, **bukan hasil riset final**. Agent R1–R5 harus mengonfirmasi tiap angka ke sumber resmi + URL, dan mengoreksi kalau sudah ada pembaruan. Konteks "53 negara" juga perlu dikonfirmasi oleh R0.

| Negara / Lembaga | Sumber resmi (perkiraan) | Target swadaya | Air minum | Catatan khas |
|---|---|---|---|---|
| Jepang | Cabinet Office (内閣府), Tokyo Metropolitan "東京防災" | Min. 3 hari, idealnya 1 minggu | 3 L/orang/hari | *Rolling stock*, toilet portabel (~5x/orang/hari), kompor gas kaleng, tas evakuasi (非常持ち出し袋) |
| Inggris | GOV.UK "Prepare" | Beberapa hari (cek angka pasti) | Air kemasan (cek volume) | Senter, radio baterai/engkol, power bank, uang tunai, salinan dokumen, obat |
| Swedia | MSB "Om krisen eller kriget kommer" (edisi 2024) | Min. 1 minggu | ~3 L/orang/hari | Fokus juga ke pemanas, komunikasi, dan kesiapan saat perang |
| Norwegia | DSB "Egenberedskap" | 1 minggu (naik dari 3 hari) | 3 L/orang/hari (cek) | Yodium (kebutuhan khusus), kayu bakar/pemanas |
| Finlandia | 72tuntia.fi | 72 jam (cek apakah sudah naik) | Cek | Daftar lengkap 72 jam |
| Jerman | BBK "Ratgeber für Notfallvorsorge" | 10 hari | 2 L/orang/hari (1,5 minum + 0,5 masak) | Daftar makanan per orang per 10 hari |
| Belanda | "Denk Vooruit" | 72 jam | Cek | Kit noodpakket |
| Uni Eropa | EU Preparedness Union Strategy (2025) | 72 jam | — | Payung kebijakan untuk negara anggota |
| Amerika Serikat | FEMA Ready.gov / CDC | Min. 3 hari (evakuasi), 2 minggu (di rumah) | 1 galon (~3,8 L)/orang/hari | Daftar "Basic Disaster Supplies Kit" |
| Kanada | GetPrepared.gc.ca | 72 jam | 2 L minum + 2 L cuci/orang/hari | — |
| Indonesia | BNPB "Tas Siaga Bencana" | 3 hari | Cek | Relevan untuk lokalisasi user Indonesia |
| Standar internasional | Sphere Handbook / WFP / WHO | — | 2,5–3 L minum; 15 L total kebutuhan/orang/hari | ~2.100 kkal/orang/hari untuk perencanaan pangan |

**Kategori kebutuhan yang muncul di hampir semua panduan (konsensus awal):**

1. **Air** — minum + masak + kebersihan; alat penjernih/tablet.
2. **Pangan** — tahan lama, siap makan/minim masak; alat masak darurat + bahan bakar; pembuka kaleng.
3. **Obat & P3K** — obat rutin (stok sesuai durasi), kotak P3K, masker, kebutuhan khusus (insulin, kacamata cadangan, dll.).
4. **Sanitasi & kebersihan** — toilet darurat/kantong toilet, tisu basah, kantong sampah, pembalut, popok.
5. **Penerangan & daya** — senter/headlamp, baterai cadangan, power bank, (opsional) solar panel/generator.
6. **Komunikasi & informasi** — radio baterai/engkol, peluit, daftar kontak tertulis, titik kumpul keluarga.
7. **Dokumen & uang** — salinan dokumen penting (tahan air), uang tunai pecahan kecil.
8. **Perlindungan & kehangatan** — pakaian ganti, selimut darurat, jas hujan, sepatu kokoh, sarung tangan kerja.
9. **Alat** — pisau lipat/multitool, lakban, tali, korek/pemantik.
10. **Tas evakuasi (grab bag)** — versi ringkas dari semua di atas untuk dibawa pergi.
11. **Kebutuhan khusus** — bayi (susu formula, popok), lansia, disabilitas, hewan peliharaan.
12. **Rencana & pengetahuan** — rencana evakuasi, titik kumpul, latihan, pengetahuan P3K dasar.

---

## 2. Arsitektur Web-App (usulan)

- **Bentuk:** PWA statis (HTML + CSS + JS tanpa backend), di-host di **GitHub Pages**, lalu di-"install" ke HP.
- **Offline:** Service Worker *cache-first* untuk semua aset + data; `manifest.webmanifest` agar bisa diinstall; tanpa CDN eksternal saat runtime (semua dibundle lokal).
- **GitHub Pages:** semua path relatif (app jalan di sub-path `https://<user>.github.io/survivalcheck/`), `start_url` & `scope` manifest = `./`, service worker didaftarkan relatif; deploy otomatis via GitHub Actions (`.github/workflows/pages.yml`) dari branch `main`. Catatan: Pages untuk repo **private** butuh paket GitHub berbayar — kalau repo private di akun gratis, repo perlu dijadikan public.
- **Penyimpanan:** `localStorage` (dibungkus try/catch) untuk profil rumah tangga dan status checklist. Tidak ada data yang dikirim ke server.
- **Stack:** Vanilla JS + modul ES (atau Preact kecil kalau perlu). Tanpa framework berat supaya ringan dan mudah di-cache.
- **Bahasa:** Bahasa Indonesia (utama) + English. Teks di file i18n JSON.
- **Data terpisah dari kode:** semua item, rumus, tier, dan info tempat beli ada di `data/*.json` supaya bisa diperbarui tanpa mengubah logika.

### Alur pengguna

1. **Profil rumah tangga** → jumlah dewasa, anak, bayi, lansia, hewan (anjing/kucing), kebutuhan khusus (obat rutin, alat medis), jenis hunian (rumah tapak / apartemen / kos), provinsi (opsional, untuk saran risiko lokal), dan **skenario yang ingin disiapkan** (multi-pilih, lihat §2.1).
2. **Target durasi** → 3 / 7 / 14 / 30 hari / custom.
3. **Checklist inventaris** → per kategori; user isi *jumlah yang dimiliki* (mis. "air: 24 L", "beras: 10 kg") atau centang ya/tidak untuk item non-kuantitas.
4. **Hasil:**
   - Tier kesiapan + skor (0–100).
   - **"Saat ini kamu bisa bertahan ± X hari"** → dihitung dari sumber daya kritis yang paling cepat habis (bottleneck).
   - Daftar kekurangan, diurutkan dari prioritas tertinggi: item, jumlah yang kurang, alasan, **tempat beli di Indonesia** + alternatif murah/DIY (tanpa harga).
   - Tombol cetak / simpan daftar belanja (print CSS, tanpa internet).

### 2.1 Modul skenario (semua skenario)

Paket **inti** (air, pangan, obat, sanitasi, penerangan, komunikasi, dokumen, tas evakuasi) selalu dihitung. Tiap skenario yang dipilih user menambah item & bisa mengubah pengali kebutuhan:

| Skenario | Rujukan utama | Contoh item / aturan tambahan |
|---|---|---|
| Gempa bumi | BNPB, BMKG | Pengikat lemari/rak, sepatu kokoh di dekat tempat tidur, helm, peluit, linggis kecil |
| Tsunami | BMKG, BNPB | Rute & titik evakuasi ke tempat tinggi, tas evakuasi siap 24 jam, tanpa bergantung kendaraan |
| Banjir & longsor | BNPB, BPBD | Kantong kedap air (dry bag), pelampung/ban, boot karet, terpal, penjernih air ekstra |
| Erupsi gunung api | Badan Geologi (PVMBG), MAGMA Indonesia | Masker N95 per orang, kacamata pelindung, penutup tangki/talang air |
| Kebakaran hutan & kabut asap | BNPB, KLHK, Kemenkes | Masker N95, air purifier/filter DIY, obat saluran napas |
| Kekeringan / El Niño | BMKG | Air × pengali lebih tinggi, wadah penampungan air |
| Cuaca ekstrem / angin kencang | BMKG | Terpal, tali, lakban, perlengkapan pengaman atap |
| Pemadaman listrik panjang | (pelengkap: panduan Swedia/Jerman) | Power bank, baterai, lampu solar, kompor non-listrik + bahan bakar, uang tunai lebih banyak |
| Pandemi / wabah | Kemenkes, WHO | Masker, hand sanitizer, termometer, oksimeter, stok obat > 30 hari |
| Konflik / kerusuhan / perang | (pelengkap: MSB Swedia, DSB Norwegia, GOV.UK) | Target durasi minimal 7–14 hari, rencana tetap di rumah vs evakuasi, uang tunai, radio |
| Insiden nuklir / radiologi | BAPETEN (rujukan resmi), pelengkap panduan Nordik | Plakban & plastik untuk menyegel ruangan, stok tinggal di dalam ruangan; tablet kalium iodida **hanya sesuai instruksi otoritas** (tidak dianjurkan konsumsi mandiri) |

Aturan: kalau beberapa skenario dipilih, item digabung (tidak dobel) dan pengali diambil yang **tertinggi**. Durasi minimum tier bisa naik untuk skenario tertentu (mis. konflik).

### Model perhitungan (draft, difinalkan agent S2)

```
orang_setara  = dewasa + 0.7×anak + 0.5×bayi + 1×lansia   (bobot difinalkan S2)
air_butuh_L   = 3 L × orang × hari  (+ tambahan per hewan, + tambahan iklim panas)
kalori_butuh  = 2100 kkal × orang_setara × hari
toilet_butuh  = 5 kantong × orang × hari
obat_butuh    = dosis_harian × hari (per orang yang punya obat rutin)

hari_bertahan = MIN(air_dimiliki / air_per_hari,
                    kalori_dimiliki / kalori_per_hari,
                    obat_hari, toilet_hari, ...)      ← bottleneck
```

### Tier kesiapan (draft)

| Tier | Nama | Syarat utama (gating) |
|---|---|---|
| 0 | **Belum Siap Sama Sekali** | Air atau pangan < 1 hari, tidak ada rencana |
| 1 | **Rentan** | Bertahan 1–2 hari; item kritis masih bolong |
| 2 | **Siap Dasar (72 jam)** | ≥ 3 hari untuk air, pangan, obat, sanitasi, penerangan + tas evakuasi ada |
| 3 | **Siap (1 minggu)** | ≥ 7 hari (standar Jepang/Swedia/Norwegia) + komunikasi + dokumen + uang tunai |
| 4 | **Tangguh (2 minggu)** | ≥ 14 hari (FEMA "home") + alat masak/bahan bakar + penjernih air + rencana keluarga |
| 5 | **Mandiri (≥ 30 hari)** | ≥ 30 hari + daya alternatif + skill (P3K, dsb.) |

Aturan penting: **item kritis bersifat "gating"** — skor tinggi di kategori lain tidak bisa menaikkan tier kalau air/pangan/obat masih di bawah ambang tier itu.

---

## 3. Pembagian Kerja ke Agent

### Peta dependensi

```
Fase 1 (paralel)        Fase 2 (paralel)          Fase 3 (paralel)         Fase 4
R0 Konteks 53 negara ┐
R1 Asia-Pasifik      ├─▶ S1 Master checklist ─┐
R2 Eropa Utara       │   S2 Rumus & tier ─────┼─▶ E1 Kerangka PWA ─┐
R3 Eropa Barat + UE  │   S3 Tempat beli ──────┤   E2 Engine hitung ├─▶ Q1 QA ─▶ PM: integrasi
R4 Amerika + Intl    │   D1 UX & copy ────────┘   E3 Hasil & belanja┘           & laporan akhir
R5 Indonesia ★       ┘
```

**PM agent** aktif dari awal sampai akhir: menetapkan kontrak data (skema JSON di §4), membagikan tugas, mereview output tiap fase, menyelesaikan konflik antar sumber, dan menggabungkan semuanya.

---

### Fase 1 — Riset (6 agent paralel)

Semua agent riset mengeluarkan file `research/<id>.md` + `research/<id>.json` dengan format yang sama (lihat §4.1). **Aturan:** hanya sumber resmi pemerintah/lembaga resmi (Palang Merah/Bulan Sabit Merah boleh sebagai sumber kedua); setiap angka wajib punya URL + tanggal akses; tandai kalau panduan sudah diperbarui (mis. 3 hari → 7 hari).

| ID | Tugas | Cakupan | Output |
|---|---|---|---|
| **R0** | Konfirmasi konteks "53 negara" | Cari sumber berita/kebijakan yang dimaksud, daftar negaranya, dan negara mana yang punya panduan publik untuk warga | `research/r0-context.md`, daftar negara + link panduan |
| **R1** | Asia-Pasifik | Jepang (Cabinet Office, Tokyo Bousai), Korea Selatan, Taiwan, Singapura, **Indonesia (BNPB)**, Filipina, Australia, Selandia Baru | Ringkasan per negara + angka kuantitatif |
| **R2** | Eropa Utara & Baltik | Swedia (MSB), Norwegia (DSB), Finlandia, Denmark, Estonia, Latvia, Lituania, Polandia | Sama |
| **R3** | Eropa Barat/Tengah + UE | Inggris (GOV.UK Prepare), Jerman (BBK), Belanda, Swiss, Prancis, Belgia, EU Preparedness Union Strategy | Sama |
| **R4** | Amerika + standar internasional | AS (FEMA/CDC), Kanada, IFRC, WHO, Sphere, WFP (standar air & kalori) | Sama + standar teknis (L/hari, kkal/hari, sanitasi) |
| **R5 ★** | **Indonesia (prioritas)** | BNPB (Tas Siaga Bencana, buku saku), BMKG (gempa, tsunami, cuaca, kekeringan), Badan Geologi/PVMBG (erupsi), Kemenkes (P3K, wabah, kabut asap), BAPETEN (nuklir/radiologi), PMI, Basarnas, contoh BPBD. Juga: peta risiko bencana per provinsi (InaRISK), nomor darurat (112, 110, 113, 118/119, 115) | Ringkasan per lembaga + per skenario, `research/r5-indonesia.json`, daftar risiko dominan per provinsi |

R1 tidak lagi meneliti Indonesia (sudah dipegang R5).

**Acceptance criteria:** tiap negara minimal berisi target durasi, kebutuhan air/orang/hari, daftar item kit, kebutuhan khusus, URL resmi. Kalau angka tidak ada di sumber, tulis "tidak disebutkan" — jangan diisi tebakan.

---

### Fase 2 — Sintesis & Desain (4 agent paralel, mulai setelah Fase 1)

| ID | Tugas | Input | Output |
|---|---|---|---|
| **S1** | **Master checklist** — gabungkan semua riset jadi satu daftar item, kelompokkan per kategori (§1), tentukan prioritas (kritis / penting / tambahan), tentukan nilai konsensus + sumbernya, catat perbedaan antar negara | `research/*` | `data/items.json` (skema §4.2), `docs/sources.md` |
| **S2** | **Model hitung & tier** — finalkan bobot orang setara, kebutuhan per orang/hari tiap item kuantitatif, tambahan untuk hewan/bayi/lansia/iklim panas, rumus "hari bertahan" (bottleneck), skor 0–100, aturan gating tier | `research/*`, draft S1 | `data/rules.json`, `docs/scoring.md` + 10 contoh kasus (input → output yang diharapkan) untuk unit test |
| **S3** | **Tempat beli di Indonesia (tanpa harga)** — untuk tiap item: jenis toko (minimarket, supermarket/hypermarket, pasar tradisional, apotek, toko alat kesehatan, toko bangunan/hardware, toko elektronik, toko outdoor/camping, toko perlengkapan bayi, petshop, marketplace online) + contoh jaringan yang umum ada (mis. Indomaret/Alfamart, apotek K-24/Kimia Farma, Ace/Mitra10, toko outdoor, marketplace); alternatif DIY/murah; yang bisa didapat gratis/resmi (mis. salinan dokumen di Dukcapil/kelurahan, info jalur evakuasi di BPBD). Item yang **sudah ada di rumah** ditandai supaya user tidak membeli yang tidak perlu. **Tidak mencantumkan harga.** | `data/items.json` (draft) | `data/sources-to-buy.json` |
| **D1** | **UX & copy** — wireframe teks per layar, nada bahasa (tenang, tidak menakut-nakuti), copy ID + EN, aksesibilitas (kontras, ukuran tap, bisa dipakai satu tangan), disclaimer ("bukan pengganti instruksi otoritas setempat") | §2 dokumen ini | `docs/ux-flow.md`, `i18n/id.json`, `i18n/en.json` |

**Acceptance criteria:** setiap item di `items.json` punya id unik, kategori, prioritas, rumus kuantitas (atau boolean), dan ≥ 1 sumber. `rules.json` bisa menghasilkan output yang sama dengan 10 contoh kasus S2.

---

### Fase 3 — Engineering (3 agent paralel, mulai setelah kontrak data Fase 2 dikunci oleh PM)

| ID | Tugas | Output |
|---|---|---|
| **E1** | **Kerangka PWA offline + deploy GitHub Pages** — struktur folder, `index.html`, `manifest.webmanifest`, service worker (precache semua aset + `data/*.json` + `i18n/*`), versi cache, switch bahasa, penyimpanan lokal (try/catch), icon; semua path relatif agar jalan di sub-path `/survivalcheck/`; workflow `.github/workflows/pages.yml` (deploy dari `main`) | App bisa dibuka, diinstall, dan jalan tanpa internet di URL GitHub Pages |
| **E2** | **Engine perhitungan + form input** — form profil rumah tangga & durasi, form inventaris per kategori (generate otomatis dari `items.json`), engine yang membaca `rules.json` → skor, tier, hari bertahan, daftar kekurangan; unit test pakai 10 kasus S2 | `src/engine.js`, `src/forms.js`, `tests/` |
| **E3** | **Halaman hasil & daftar belanja** — tampilan tier (badge + progress per kategori), "bisa bertahan ± X hari" + item bottleneck, daftar kekurangan berurut prioritas + jumlah + tempat beli (tanpa harga), dikelompokkan per jenis toko supaya praktis saat belanja, cetak/print CSS, export teks (copy ke clipboard / unduh .txt) | `src/results.js`, `styles/print.css` |

---

### Fase 4 — QA (1 agent)

| ID | Tugas |
|---|---|
| **Q1** | Uji offline (mode pesawat di Playwright) **di URL GitHub Pages yang sebenarnya**, uji install PWA, uji kombinasi skenario (mis. gempa + tsunami + listrik padam), uji layar HP 360px, audit aksesibilitas dasar, cek silang 20 angka acak di `items.json` dengan sumber aslinya, uji edge case (0 orang, 1 bayi saja, 20 orang, durasi 90 hari, input kosong/negatif). Output: `docs/qa-report.md` + daftar bug ke PM. |

---

### PM Agent — Koordinator & Integrator

**Tanggung jawab:**
1. **Kick-off:** bagikan dokumen ini + kontrak data (§4) ke semua agent.
2. **Gate tiap fase:** review output terhadap acceptance criteria; minta revisi kalau kurang.
3. **Resolusi konflik:** kalau sumber berbeda (mis. Jerman 2 L vs Jepang 3 L air/hari), putuskan nilai default (usulan: pakai yang lebih aman/lebih tinggi) dan catat alasannya di `docs/decisions.md`.
4. **Kunci kontrak data** sebelum Fase 3 mulai supaya E1/E2/E3 bisa paralel tanpa bentrok.
5. **Integrasi:** merge semua output, jalankan test, perbaiki inkonsistensi, pastikan build final jalan offline.
6. **Laporan akhir:** `docs/final-report.md` — ringkasan panduan resmi, keputusan desain, status fitur, bug tersisa, saran pengembangan berikutnya.

---

## 4. Kontrak Data (dikunci PM sebelum Fase 3)

### 4.1 Output riset (`research/<id>.json`)
```json
{
  "country": "Japan",
  "agency": "Cabinet Office",
  "url": "https://...",
  "accessed": "2026-11-xx",
  "last_updated_by_source": "2024-xx",
  "target_days": { "min": 3, "recommended": 7 },
  "water_l_per_person_day": 3,
  "food_note": "...",
  "items": [{ "name": "portable toilet", "qty": "5/person/day", "note": "..." }],
  "special_needs": ["infant", "elderly", "pets", "medication"],
  "unique_points": ["rolling stock"]
}
```

### 4.2 Item (`data/items.json`)
```json
{
  "id": "water_drinking",
  "category": "water",
  "priority": "critical",
  "type": "quantity",
  "unit": "L",
  "per_person_day": 3,
  "modifiers": { "pet_dog": 1.0, "hot_climate": 1.5 },
  "gating": true,
  "label": { "id": "Air minum", "en": "Drinking water" },
  "why": { "id": "...", "en": "..." },
  "sources": ["JP-CAO", "SE-MSB", "US-FEMA"],
  "buy": ["minimarket", "supermarket", "ecommerce"]
}
```
Item boolean (mis. "radio baterai") memakai `"type": "boolean"` dan `"per_household": 1`.

### 4.3 Struktur repo target
```
/index.html  /manifest.webmanifest  /sw.js
/src/        engine.js forms.js results.js storage.js i18n.js
/data/       items.json rules.json sources-to-buy.json
/i18n/       id.json en.json
/styles/     main.css print.css
/research/   r0..r4 (.md + .json)
/docs/       sources.md scoring.md ux-flow.md decisions.md qa-report.md final-report.md
/tests/
```

---

## 5. Status Keputusan

Semua pertanyaan terbuka sudah dijawab (lihat tabel "Keputusan yang sudah dikunci" di atas). Sisa yang perlu dicek saat eksekusi:

- **Visibilitas repo:** pastikan repo public (atau akun punya paket yang mendukung Pages untuk repo private) sebelum E1 mengaktifkan GitHub Pages.
- **Branch deploy:** usulan deploy dari `main` setelah PM merge; selama pengembangan kerja di branch fitur.

## 6. Urutan Eksekusi (saat diizinkan)

1. PM kick-off → jalankan R0–R5 paralel.
2. PM review riset → jalankan S1, S2, S3, D1 paralel.
3. PM kunci kontrak data (`items.json`, `rules.json`, `sources-to-buy.json`, i18n) → jalankan E1, E2, E3 paralel.
4. Q1 menguji → PM perbaiki/merge → aktifkan GitHub Pages → laporan akhir.
