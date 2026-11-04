# SurvivalCheck

PWA statis untuk mengecek kesiapan rumah tangga di Indonesia menghadapi bencana: profil, target dan skenario, inventaris, daya listrik, evaluasi keluarga BNPB, lalu hasil (tier 0-5), daftar belanja, dan info darurat offline. Bahasa Indonesia dan English. Data hanya di perangkat (localStorage), tanpa akun, tanpa pelacakan, tanpa harga.

## Jalankan lokal
```
python3 -m http.server 8000
```
Buka http://localhost:8000/ . Service worker butuh `localhost` atau HTTPS. Semua path relatif, jadi jalan juga di sub-path (`/survivalcheck/`).

## Uji
```
node --test tests/          # mesin hitung (E2)
node tests/e2e-shell.mjs    # shell PWA, SW, offline, 360 px (butuh playwright)
```

## Deploy
Push ke `main` memicu `.github/workflows/pages.yml` (GitHub Pages: upload-pages-artifact + deploy-pages). Aktifkan Pages dengan sumber "GitHub Actions" di pengaturan repo. Artefak hanya memuat aset aplikasi, data, i18n, dan `docs/sources.md` (tanpa `research/`, `tests/`).
Setiap perubahan aset/data: naikkan versi cache di `sw.js` (`survivalcheck-vN`) agar pengguna mendapat notifikasi "versi baru tersedia".

## Sumber data
`data/*.json` dan `i18n/*.json`; rujukan lengkap di `docs/sources.md` (BNPB, BMKG, PVMBG, Kemenkes, plus panduan resmi negara lain). Kontrak teknis: `docs/contract.md`.

## Disclaimer
Alat bantu perencanaan, bukan pengganti instruksi otoritas setempat (BNPB, BPBD, BMKG, tenaga kesehatan). Dosis obat dan bahan kimia selalu ikuti label dan tenaga kesehatan. Angka kebutuhan adalah perkiraan umum.
