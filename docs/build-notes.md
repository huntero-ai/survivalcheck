# Build notes

## E3 (Hasil + Daftar belanja)

Kunci i18n yang kurang (E3 pakai fallback teks Indonesia; mohon PM tambahkan ke `i18n/id.json` dan `en.json`):
- `result.next_group_any` = "Salah satu dari: {items}"
- `result.next_input_missing` = "{item}: isi angka pemakaian harian dulu"
- `result.next_bag_more` = "Centang {n} item lagi."
- `result.next_family_more` = "{n} poin lagi."
- `result.shortfall_needs_input` = "Isi angka pemakaian harian untuk menghitung"
- `result.blocks_tier` = "Menahan tier {n}"
- `shopping.needs_input` = "isi pemakaian harian dulu"
- `shopping.group_other` = "Lainnya"
- (opsional) `shopping.group_free_official` & `shopping.group_at_home` sudah ada; `target.title` dipakai sebagai label tautan "Ubah target".

Permintaan ke E1 (storage):
- `state.shopping` = `{ checked: {<item_id>: true}, hide_bought: bool }` harus ikut disimpan/dipertahankan oleh `ctx.save(patch)` dan masuk ekspor/impor; belum ada di skema state kontrak.
- Tautan E3 memakai `<a href="#/...">` langsung (bukan ctx.navigate). Router harus menangani `#/hasil`, `#/belanja`, `#/info`, `#/target`, `#/profil`, `#/keluarga`, `#/daya`, `#/inventaris/<kategori>`.
- `ctx.data.items` = isi `items.json` (objek ber-`items[]`) atau array langsung; `ctx.data.buy` = isi `sources-to-buy.json`. Keduanya didukung.
- E3 memuat `styles/results.css` dan `styles/print.css` (media=print) sendiri lewat `<link>` bila belum ada; E1 boleh menautkannya di `index.html` dan menambahkannya ke precache SW (plus `tests/cases.json` TIDAK perlu diprecache; hanya dipakai bila `src/engine.js` belum ada).

Catatan engine (E2): `result.shortfall` penuh dipakai bila ada; jika hanya `shortfall_head`, E3 memakai itu. Prioritas `extra` dipetakan ke kunci i18n `result.priority.nice`. Id bottleneck `food`->`kcal`, `infant_food`->`baby_food`, `power`->`power_medical`.

## E1 (kerangka PWA + deploy)

Status: shell, router, storage, i18n, halaman statis (Beranda, Info: darurat/panduan/air/kartu/sumber/disclaimer/tentang, Pengaturan), SW, ikon, workflow Pages selesai. Uji: `node tests/e2e-shell.mjs` (semua lolos: SW, offline, 360 px, ekspor/impor/hapus, sub-path `/survivalcheck/`).

Kunci i18n yang kurang (E1 memakai fallback teks bila belum ada; mohon PM tambahkan id + en):
- `common.coming_soon` = "Segera hadir" / "Coming soon"
- `common.coming_soon_body` = "Bagian ini sedang disiapkan dan akan tersedia pada pembaruan berikutnya." / "This section is being prepared and will be available in an upcoming update."
- Panduan per skenario (G2) Sebelum/Saat/Sesudah: i18n hanya punya label umum `info.guides.before|during|after`, tidak ada isi per skenario. Halaman Panduan sementara memuat label, rujukan, lead tsunami/konflik/nuklir + kotak KI. Mohon tambahkan `info.guides.<scenario_id>.before|during|after` (daftar kalimat/array atau teks) + `...source` untuk 11 skenario; E1 akan merendernya (butuh instruksi: format array string atau string tunggal).
- Label langkah stepper memakai `nav.profile`, `target.title`, `nav.inventory`, `family_eval.title`, `nav.result` (semua sudah ada).

Catatan teknis untuk E2/E3:
- Tambahan `ctx`: `confirm({title,body,action,danger}) -> Promise<bool>`, `toast(msg)`, `announce(msg)`, `storageAvailable()`, `data.scenarios`, `data.categories`.
- `ctx.state` adalah objek yang SAMA dimutasi (jangan simpan salinan); `ctx.save(patch)` = Object.assign + simpan + updatedAt. State tambahan: `state.family_plan` (kartu keluarga), `state.shopping` `{checked, hide_bought}` (diminta E3, ada di default + ikut ekspor/impor), `state.settings` `{lang, theme, mode:'quick'|'full', reminders, reminderDone, disclaimerAccepted}`, `createdAt`.
- Router: `#/inventaris` tanpa kategori memanggil `renderInventory(root, ctx, {category:null})`; lainnya `(root, ctx, {rest:[]})`. Layar E2/E3 yang mengekspor fungsi dengan nama lain/tidak ada menampilkan placeholder "segera".
- CSS lazy: E1 menautkan `styles/forms.css` (forms) dan `styles/results.css` + `styles/print.css` (hasil/belanja) saat layar dimuat; tautan dihapus bila 404. `print.css` TIDAK media-scoped dari E1 (file harus memakai `@media print` sendiri).
- Header dan bottom nav: bottom nav tersembunyi sampai `state.profile.counts` ada jumlah >0 pada rute `#/`, `#/profil`, `#/target`. Stepper 5 langkah (profil, target, inventaris/daya, keluarga, hasil) tampil di luar `#/hasil`; modul layar tidak perlu menggambar stepper/nav.
- SW: CORE (wajib) = aset E1 + data + i18n + `docs/sources.md`; OPTIONAL (tidak menggagalkan instal) = `src/engine|power|forms|results|shopping.js`, `styles/forms|results|print.css`. Jika file baru ditambahkan, edit daftar di `sw.js` dan naikkan `CACHE`. `docs/sources.md` disalin ke `_site/docs/` oleh workflow (docs/ lain tidak dipublikasikan).
- Bug data: tidak ada ditemukan. Catatan: `docs/sources.md` memuat satu baris sumber internasional dengan domain `info.gouv...`; tidak masalah.
- Temuan untuk E3: `src/shopping.js` `render()` menghapus `<h1>` (`page.textContent = ''`) setelah hasil dimuat dan tidak menambahkannya lagi, sehingga `#/belanja` tanpa `<h1>` (a11y: fokus judul halaman). Mohon tambahkan lagi h1 setelah build. Uji e2e-shell menerima h1 atau h2 di rute itu.
