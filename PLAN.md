# SurvivalCheck — Rencana Proyek

> Status: **PLAN SAJA — belum dieksekusi.** Dokumen ini membagi pekerjaan ke beberapa agent terpisah, lalu semua hasilnya dikumpulkan dan diintegrasikan oleh satu agent PM.

---

## 0. Tujuan

1. **Merangkum** panduan kesiapsiagaan resmi dari pemerintah (Jepang, Inggris, Swedia, Jerman, AS, dll.) yang sekarang tersebar di banyak tempat, menjadi satu daftar kebutuhan yang konsisten dan ada sumbernya.
2. **Membangun web-app sederhana yang jalan offline** (PWA) untuk mengecek *sejauh mana user sudah siap*:
   - Input jumlah orang yang ditanggung (dewasa, anak, bayi, lansia, hewan peliharaan, kebutuhan khusus).
   - Input target lama bertahan (3 / 7 / 14 / 30 hari atau custom).
   - Hasil: **tier kesiapan** (dari "Belum Siap Sama Sekali" sampai "Mandiri"), **estimasi berapa hari bisa bertahan** saat ini, dan **daftar kekurangan**: apa yang harus disiapkan, berapa banyak, dan beli di mana.

---

## 1. Ringkasan Awal Panduan Resmi (baseline, WAJIB diverifikasi agent riset)

> Angka di bawah ini adalah titik awal dari pengetahuan umum, **bukan hasil riset final**. Agent R1–R4 harus mengonfirmasi tiap angka ke sumber resmi + URL, dan mengoreksi kalau sudah ada pembaruan. Konteks "53 negara" juga perlu dikonfirmasi oleh R0.

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

- **Bentuk:** PWA statis (HTML + CSS + JS tanpa backend). Bisa di-host di GitHub Pages / Cloudflare Pages, lalu di-"install" ke HP.
- **Offline:** Service Worker *cache-first* untuk semua aset + data; `manifest.webmanifest` agar bisa diinstall; tanpa CDN eksternal saat runtime (semua dibundle lokal).
- **Penyimpanan:** `localStorage` (dibungkus try/catch) untuk profil rumah tangga dan status checklist. Tidak ada data yang dikirim ke server.
- **Stack:** Vanilla JS + modul ES (atau Preact kecil kalau perlu). Tanpa framework berat supaya ringan dan mudah di-cache.
- **Bahasa:** Bahasa Indonesia (utama) + English. Teks di file i18n JSON.
- **Data terpisah dari kode:** semua item, rumus, tier, dan info tempat beli ada di `data/*.json` supaya bisa diperbarui tanpa mengubah logika.

### Alur pengguna

1. **Profil rumah tangga** → jumlah dewasa, anak, bayi, lansia, hewan (anjing/kucing), kebutuhan khusus (obat rutin, alat medis), jenis hunian, risiko bencana dominan (gempa, banjir, erupsi, tsunami, konflik/pemadaman).
2. **Target durasi** → 3 / 7 / 14 / 30 hari / custom.
3. **Checklist inventaris** → per kategori; user isi *jumlah yang dimiliki* (mis. "air: 24 L", "beras: 10 kg") atau centang ya/tidak untuk item non-kuantitas.
4. **Hasil:**
   - Tier kesiapan + skor (0–100).
   - **"Saat ini kamu bisa bertahan ± X hari"** → dihitung dari sumber daya kritis yang paling cepat habis (bottleneck).
   - Daftar kekurangan, diurutkan dari prioritas tertinggi: item, jumlah yang kurang, alasan, **tempat beli**, perkiraan harga.
   - Tombol cetak / simpan daftar belanja (print CSS, tanpa internet).

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
R4 Amerika + Intl    ┘   D1 UX & copy ────────┘   E3 Hasil & belanja┘           & laporan akhir
```

**PM agent** aktif dari awal sampai akhir: menetapkan kontrak data (skema JSON di §4), membagikan tugas, mereview output tiap fase, menyelesaikan konflik antar sumber, dan menggabungkan semuanya.

---

### Fase 1 — Riset (5 agent paralel)

Semua agent riset mengeluarkan file `research/<id>.md` + `research/<id>.json` dengan format yang sama (lihat §4.1). **Aturan:** hanya sumber resmi pemerintah/lembaga resmi (Palang Merah/Bulan Sabit Merah boleh sebagai sumber kedua); setiap angka wajib punya URL + tanggal akses; tandai kalau panduan sudah diperbarui (mis. 3 hari → 7 hari).

| ID | Tugas | Cakupan | Output |
|---|---|---|---|
| **R0** | Konfirmasi konteks "53 negara" | Cari sumber berita/kebijakan yang dimaksud, daftar negaranya, dan negara mana yang punya panduan publik untuk warga | `research/r0-context.md`, daftar negara + link panduan |
| **R1** | Asia-Pasifik | Jepang (Cabinet Office, Tokyo Bousai), Korea Selatan, Taiwan, Singapura, **Indonesia (BNPB)**, Filipina, Australia, Selandia Baru | Ringkasan per negara + angka kuantitatif |
| **R2** | Eropa Utara & Baltik | Swedia (MSB), Norwegia (DSB), Finlandia, Denmark, Estonia, Latvia, Lituania, Polandia | Sama |
| **R3** | Eropa Barat/Tengah + UE | Inggris (GOV.UK Prepare), Jerman (BBK), Belanda, Swiss, Prancis, Belgia, EU Preparedness Union Strategy | Sama |
| **R4** | Amerika + standar internasional | AS (FEMA/CDC), Kanada, IFRC, WHO, Sphere, WFP (standar air & kalori) | Sama + standar teknis (L/hari, kkal/hari, sanitasi) |

**Acceptance criteria:** tiap negara minimal berisi target durasi, kebutuhan air/orang/hari, daftar item kit, kebutuhan khusus, URL resmi. Kalau angka tidak ada di sumber, tulis "tidak disebutkan" — jangan diisi tebakan.

---

### Fase 2 — Sintesis & Desain (4 agent paralel, mulai setelah Fase 1)

| ID | Tugas | Input | Output |
|---|---|---|---|
| **S1** | **Master checklist** — gabungkan semua riset jadi satu daftar item, kelompokkan per kategori (§1), tentukan prioritas (kritis / penting / tambahan), tentukan nilai konsensus + sumbernya, catat perbedaan antar negara | `research/*` | `data/items.json` (skema §4.2), `docs/sources.md` |
| **S2** | **Model hitung & tier** — finalkan bobot orang setara, kebutuhan per orang/hari tiap item kuantitatif, tambahan untuk hewan/bayi/lansia/iklim panas, rumus "hari bertahan" (bottleneck), skor 0–100, aturan gating tier | `research/*`, draft S1 | `data/rules.json`, `docs/scoring.md` + 10 contoh kasus (input → output yang diharapkan) untuk unit test |
| **S3** | **Tempat beli & harga** — untuk tiap item: jenis toko (minimarket, supermarket, apotek, toko outdoor, toko bangunan, e-commerce), contoh di Indonesia (mis. Indomaret/Alfamart, apotek K-24/Kimia Farma, Ace/Mitra10, toko outdoor, marketplace), perkiraan rentang harga, alternatif DIY/murah | `data/items.json` (draft) | `data/sources-to-buy.json` |
| **D1** | **UX & copy** — wireframe teks per layar, nada bahasa (tenang, tidak menakut-nakuti), copy ID + EN, aksesibilitas (kontras, ukuran tap, bisa dipakai satu tangan), disclaimer ("bukan pengganti instruksi otoritas setempat") | §2 dokumen ini | `docs/ux-flow.md`, `i18n/id.json`, `i18n/en.json` |

**Acceptance criteria:** setiap item di `items.json` punya id unik, kategori, prioritas, rumus kuantitas (atau boolean), dan ≥ 1 sumber. `rules.json` bisa menghasilkan output yang sama dengan 10 contoh kasus S2.

---

### Fase 3 — Engineering (3 agent paralel, mulai setelah kontrak data Fase 2 dikunci oleh PM)

| ID | Tugas | Output |
|---|---|---|
| **E1** | **Kerangka PWA offline** — struktur folder, `index.html`, `manifest.webmanifest`, service worker (precache semua aset + `data/*.json` + `i18n/*`), versi cache, switch bahasa, penyimpanan lokal (try/catch), icon | App bisa dibuka, diinstall, dan jalan tanpa internet |
| **E2** | **Engine perhitungan + form input** — form profil rumah tangga & durasi, form inventaris per kategori (generate otomatis dari `items.json`), engine yang membaca `rules.json` → skor, tier, hari bertahan, daftar kekurangan; unit test pakai 10 kasus S2 | `src/engine.js`, `src/forms.js`, `tests/` |
| **E3** | **Halaman hasil & daftar belanja** — tampilan tier (badge + progress per kategori), "bisa bertahan ± X hari" + item bottleneck, daftar kekurangan berurut prioritas + jumlah + tempat beli + harga, cetak/print CSS, export teks (copy ke clipboard / unduh .txt) | `src/results.js`, `styles/print.css` |

---

### Fase 4 — QA (1 agent)

| ID | Tugas |
|---|---|
| **Q1** | Uji offline (mode pesawat di Playwright), uji install PWA, uji layar HP 360px, audit aksesibilitas dasar, cek silang 20 angka acak di `items.json` dengan sumber aslinya, uji edge case (0 orang, 1 bayi saja, 20 orang, durasi 90 hari, input kosong/negatif). Output: `docs/qa-report.md` + daftar bug ke PM. |

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

## 5. Pertanyaan Terbuka (untuk user, sebelum eksekusi)

1. **Lokalisasi "beli di mana":** fokus Indonesia saja, atau dibuat generik + contoh Indonesia?
2. **Skenario:** bencana alam saja, atau termasuk konflik/perang, pemadaman listrik panjang, dan pandemi (seperti panduan Swedia/Norwegia)?
3. **Harga:** perlu perkiraan harga (Rupiah) atau cukup tempat belinya saja? (harga cepat basi)
4. **Hosting:** GitHub Pages dari repo ini, atau cukup file statis yang bisa dibuka lokal?
5. **Bahasa:** Indonesia + English cukup, atau perlu bahasa lain?
