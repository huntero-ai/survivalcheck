# DESIGN.md - SurvivalCheck

Sumber kebenaran visual. Fakta di bawah diambil dari `styles/main.css` (token di `:root`), `styles/forms.css`, `styles/results.css`. Bila CSS berubah, ubah berkas ini. `docs/design-tokens.md` adalah rancangan awal (D1) dan sudah diberi banner "digantikan".
Disusun dari draf audit antislop 001 (`anti-slop/audit-001-2026-11-05.md`, bagian 5) setelah perbaikan No 1-19. Bagian bertanda [belum dikonfirmasi pemilik] adalah keputusan agen yang masih bisa diganti.

## Identitas

PWA offline untuk mengecek kesiapan rumah tangga menghadapi bencana. Bahasa Indonesia dan English.
Nada: tenang, tidak menakut-nakuti. Kata ganti "kamu".
Aturan produk (CLAUDE.md): tanpa harga, jangan sebut "53 negara", semua teks lewat `i18n/`, data kesehatan wajib disclaimer.
Dial: ENERGY 1-2 / RHYTHM 1-2 / MOTION 1 [belum dikonfirmasi pemilik]. Ini keadaan nyata CSS: palet kecil, satu kolom, hampir tanpa gerak.

## Warna (`styles/main.css` :root)

Terang: bg #FDFDFD, surface #F3F6F9, surface-2 #E9E9E9, teks #111111, teks redup #555555,
batas kontrol (`--c-border`) #8C8C8C, pemisah dekoratif (`--c-divider`) #E4E4E4,
primary (biru langit) #0072CC, hover primary #005FA8, CTA (aksen merah-oranye) #D93A14 dengan teks #FFFFFF, hover CTA #B92E0C, fokus #0072CC, bahaya (`--c-hazard`) #B00020.
Gelap: bg #0F0F0F, surface #171B20, surface-2 #232A32, teks #F2F2F2, teks redup #B0B0B0,
batas kontrol #7A7A7A, pemisah #2C2C2C, primary #4DB8FF, hover primary #7CCBFF, CTA #FF6B47 dengan teks #111111, hover CTA #FF8566, bahaya #FF8A80.
Lingkaran hari bertahan: isi #0072CC, cincin #0099FF (terang) / #1F4F7A (gelap), teks putih penuh (4,91:1; opacity dihapus).
Tier 0-5: monokrom (hitam dengan teks putih di terang, dibalik di gelap). Arti dibawa teks "Tier N dari 5", nama tier, dan 5 segmen (terisi = pengisi, kosong = garis luar). Tier sengaja netral agar skor tidak terasa seperti nilai ujian.
Status ok/info/warn: netral (#F4F4F4 / #E9E9E9 di terang); arti dibawa ikon SVG dan teks.
Bahaya dan peringatan keselamatan (CO genset, kabel genset, penjernih kimia, kesalahan impor): panel berlatar surface dengan garis 2 px berwarna `--c-hazard`, garis kiri 8 px, ikon segitiga seru dan judul berwarna bahaya. Ini satu-satunya pemakaian merah-bahaya; kartu tier dan CTA tidak memakainya. Kontras bahaya di bg/surface: 7,20 / 6,75 (terang), 8,40 / 7,58 (gelap).
Kontras non-teks: batas kontrol, trek progres, dan segmen tier kosong memakai `--c-border` (3,31:1 di bg terang, 3,10:1 di surface; 4,47 / 4,03 di gelap). `--c-divider` hanya untuk pemisah dekoratif.
Aksen CTA #D93A14 (`.btn-primary`) hanya untuk langkah utama layar (Mulai cek kesiapan, Isi persediaan, Lihat daftar belanja, Cetak, Lanjut/Selesai di alur isian) dan satu penanda: tombol 112. Tombol lain memakai `.btn-solid` (biru solid; putih di #0072CC 4,91:1, gelap #0F0F0F di #4DB8FF 8,78:1): tombol telepon selain 112, "Ke beranda", "Muat ulang", dialog konfirmasi biasa. Aksi destruktif (dialog "Ya, hapus semua", impor yang menimpa data) memakai `.btn-hazard` (`--c-hazard`, teks `--c-on-hazard`: 7,33:1 terang, gelap #0F0F0F di #FF8A80 tinggi), jadi oranye-merah tidak lagi bermakna ganda CTA vs bahaya.
Alasan pemilihan warna: [belum dikonfirmasi pemilik]

## Tipografi

Rubik variabel (300-900, woff2 lokal, `font-display:swap`). Mono sistem hanya untuk nomor darurat.
Skala: display 2rem, h1 1.5rem, h2 1.25rem, h3 1.0625rem, isi 1rem, kecil .875rem, mungil .8125rem.
Angka label dial 4rem berat 500.
Angka tabular (`tabular-nums`) hanya di elemen angka: `.dial-num`, `.stat-n`, `.sc-itemqty`, `.sc-display`, `.sc-score`, `.sc-prog-val`, `.f-stage-count`, `.f-stepper-input`, nomor telepon. Isi teks memakai angka normal karena Rubik dengan `tnum` melebarkan tanda kurung.
Alasan memilih Rubik: [belum dikonfirmasi pemilik]

## Layout dan jarak

Satu kolom, lebar maksimum 40rem terpusat. Header dan nav bawah punya latar selebar layar, tetapi isinya dibatasi kolom yang sama.
Padding halaman 24px, nav bawah 72px + safe-area. Spasi kelipatan 4px (4, 8, 12, 16, 20, 24, 32, 48).
Target sentuh minimum 44px; tombol 52px; pilihan hari 48px. Tautan teks yang berdiri sendiri memakai `.link-touch`.
Radius lewat token: `--r-xs` 2 (ujung stepper), `--r-sm` 6, `--r-md` 14 (input, pilihan), `--r-lg` 20 (kartu, pilihan besar), `--r-btn` 16 (tombol), `--r-pill` (chip, bar). Tidak ada angka radius di luar token kecuali 50% untuk lingkaran.
Bayangan: kartu tanpa bayangan; dialog `0 4px 16px`; dial `0 8px 20px rgb(0 0 0 / .16)`.

## Motif identitas

Lingkaran "hari bertahan" (236px, cincin 12px) di Beranda dan Target. Alasan keputusan (#16): dial adalah motif identitas sekaligus titik fokus tunggal layar, jadi boleh menjadi satu-satunya elemen berwarna jenuh dan berbayangan. Bayangannya dikecilkan dari `0 24px 40px` ke `0 8px 20px` agar tetap terbaca sebagai benda utama tanpa terkesan mengambang berlebihan. Cincin #0099FF tidak memuat teks, jadi kontras 3,0:1-nya aman.
Tangga 5 segmen untuk tier; stepper 3 segmen untuk alur Profil, Target, Evaluasi keluarga.
Ulangan kecil (#31): judul layar Stok dan Lainnya memakai cincin mini (`.h1-ring`, `::before`, isi `--c-dial` dengan cincin `--c-dial-ring`, 0,75em). Dekoratif, tanpa teks, tanpa gerak; hanya dua layar agar tidak bising. Layar lain tetap memakai kartu standar.

## Ikon

SVG stroke 2 px, 24 px, `aria-hidden`; tombol ikon punya `aria-label`. Relevansi (#18):
rumah = Beranda; kotak/kubus = Stok (kotak persediaan; mirip ikon "package" generik, tetap dipakai karena paling dekat dengan arti); tiga garis = menu Lainnya; telepon = nomor darurat; dua slider = Pengaturan; bulan/matahari = tema; panah kiri = kembali.
Ikon `chart` tidak dipakai dan sudah dihapus.
Glyph status (centang, segitiga, lingkaran, setengah lingkaran, minus, peringatan) adalah SVG kecil di `src/icons.js` dengan gaya stroke yang sama. Pengecualian yang sengaja dibiarkan karena bentuknya bergantung pada bagian lingkaran: ikon tier `○ ◔ ◑ ◕ ● ●★` di kartu Hasil rinci, `✓` pada hitungan kategori, `→` pada tautan kembali, dan `⚠` di teks galat isian (`textContent`). Bentuknya tergantung font sistem; ganti ke SVG bila nanti perlu.
Ikon aplikasi (`icons/icon.svg`) bersifat sementara: lihat D-048 di `docs/decisions.md`.

## Daftar seragam (#19)

Daftar kategori Stok (13 kartu), menu Info (10 baris), dan tombol nomor darurat sengaja memakai bobot visual yang sama: tiap daftar adalah navigasi, dan urutan tetap mengikuti isi data agar tempat sebuah item tidak berubah antar kunjungan. Hierarki kebutuhan ditunjukkan dengan penanda teks, bukan ukuran atau warna: kategori Air, Makanan, dan Obat diberi lencana "Kritis" (garis luar, bukan warna), dan nomor 112 diberi lencana "Nomor utama".

## Komponen dan keadaan

Hover, active, disabled harus berbeda dan bukan hanya warna: hover = latar lebih gelap + garis bawah teks; active = geser 1px + bayangan dalam; disabled = garis putus-putus + opacity + kursor not-allowed. Berlaku untuk `.btn`, `.sc-btn`, `.round-btn`, `.preset-row button`, `.link-list a`, kartu tier.
Pilihan hari (Beranda dan Target) memakai pola ARIA radiogroup: `role="radio"`, roving tabindex, panah kiri/kanan/atas/bawah memindahkan dan memilih, Home/End ke ujung.
Kartu tier di Beranda adalah tautan ke Hasil rinci (`#/rincian`), juga tersedia di menu Info dan lewat tombol di Belanja.
Satu sistem komponen (#20): `.sc-btn`, `.sc-card`, `.sc-chip` (dipakai Hasil rinci dan Belanja) berbagi aturan dasar dengan `.btn`, `.card`, `.chip` di `main.css` (satu daftar selector); `results.css` hanya memuat varian (`.sc-info`, `.sc-tier`, `.sc-band-*`, dst). Gutter layar 24px dari `.app-main`; `.sc-page` tidak menambah padding. Token tanpa fallback palet lama.

## Warna sistem (#30)

`theme-color` di `index.html` mengikuti latar header (`--c-bg`): #FDFDFD terang, #0F0F0F gelap. Manifest hanya bisa satu nilai, jadi `theme_color` dan `background_color` = #FDFDFD (sebelumnya `theme_color` #0072CC, yang membuat bilah sistem biru saat dipasang tetapi putih di browser). Akibat yang diterima: layar pembuka PWA terpasang tetap terang di perangkat gelap.

## Gaya inline dan CSP (#32)

Tidak ada atribut `style` tulisan tangan di JS atau HTML; `style-src` CSP tanpa `'unsafe-inline'`. Lebar bar progres (`.f-bar-fill`, `.sc-bar-fill`) memakai custom property `--w` yang diatur lewat CSSOM (`el.style.setProperty`), yang tidak dibatasi CSP, dibaca oleh `width:var(--w)` di CSS. Tes: `tests/e2e-antislop-low.mjs` (tanpa pelanggaran CSP di semua rute).

## Gerak

Hanya transisi switch 120ms. `prefers-reduced-motion`: semua transisi 0ms. Hover/active memakai transform seketika, tanpa transisi.

## Aksesibilitas

Fokus 3px `--c-focus` offset 2px. Kontras teks dan non-teks dihitung dari token (`tests/antislop.test.mjs`) dan dengan `.claude/skills/antislop-human/contrast-check.py`. Arti tidak hanya lewat warna (ikon + teks). Layout utuh di 280-390px. Kursor pointer di lapisan dasar untuk tombol, tautan, label, checkbox, radio.

## Yang sengaja tidak dipakai

Gradien, glassmorphism, glow, latar grid, badge "AI", ilustrasi stok, statistik atau testimoni.
