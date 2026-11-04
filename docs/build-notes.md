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

## E2 (engine, power, forms)

Tes: `node --test` (Node 22 tidak menerima `node --test tests/`; pakai tanpa argumen atau `"tests/*.test.mjs"`). Semua kasus cases.json (10 + 2) dan test_cases power.json hijau; tidak ada selisih data.

Catatan data (tidak diubah):
- `items.json` unit `meds_personal` = "hari stok" dan `medical_device_backup_power` = "Wh", sedangkan cases.json mengharapkan "hari". Engine menimpa unit keduanya menjadi "hari" (UNIT_OVERRIDE di engine.js). Disarankan samakan di items.json.
- `gas_canister.per_person_day` 0,8571 tabung/orang/hari (terlihat tak lazim) diikuti apa adanya sesuai cases tc10.

Keputusan/ekstensi engine:
- `evaluate(state, data)`: target dari `state.target` ({days} atau angka) lalu `profile.target_days`; skenario dari `state.scenarios` lalu `profile.scenarios`. Daya medis dari `state.power.days_power_medical`, atau dihitung dari `state.power_devices` + `state.power_inventory` lewat power.js.
- Tambahan output: `result.applicable_ids`. Tambahan input: `inventory.food_other = {kcal_total}` (pangan lain dari label).
- Skema power state: `power_devices = {id:{qty,hours,watts}}` (perangkat sendiri: kunci `custom_*` + `name`, `medical`); `power_inventory = {outage_days, power_bank_mah, power_bank_qty, power_station_wh, spare_battery_wh (ASUMSI: x0,8 tanpa inverter), generator_w, generator_fuel_hours, solar_wp, solar_sun_hours}`.
- Form profil menyimpan juga `disability, aids, housing, altitude_over_1000, province, province_suggested_for, pets.other`. `state.target = {days, custom}`.
- Bagian bayi/balita di Profil juga muncul untuk balita (popok/MPASI jadi gating tier 2).
- Tanggal kedaluwarsa item (ux 3.4.2) belum ada tempat di skema state: tidak diimplementasi.

Permintaan ke E1/PM:
- `ctx.data.province_risks` (isi `research/r5-indonesia.json` record province_risks atau `data/province_risks.json`) bila ingin saran provinsi dari data; sementara forms.js memakai tabel bawaan hasil turunan IRBI 2024.
- Kunci i18n kurang (fallback dipakai): f.range, f.needs_input, f.why, f.days, f.hours, f.qty, f.hungry, f.see_result, f.to_family, f.next_category, f.other_items, f.items, f.usage_per_day, f.meds_from_profile, f.power_from_module, f.grams_per_unit, f.kcal_required, f.kcal_unresolved, f.other_kcal_total, f.not_counted, f.answered, f.skip_warn, f.estimate_note, f.pick_medical, f.pick_medical_short, f.medical_days, f.medical_short, f.too_big, f.self_suff, f.sun_default, f.assumptions, f.assumption_note, f.safety, f.more_safety, f.no_province.
- `ctx.save(patch)` dipakai sebagai shallow merge kunci tingkat atas; forms selalu mengirim objek utuh.

## Integrasi (PM/Integrator)

- i18n: semua kunci permintaan E1/E2/E3 ditambahkan ke `id.json`/`en.json`; `info.guides.<skenario>.before|during|after` (array) + `.source` untuk 11 skenario, hanya dari r5-indonesia, SUMMARY 2.11, decisions D-032/033/034/037, power.md. Konflik dan nuklir berlabel rujukan internasional; KI hanya atas instruksi otoritas; tsunami: jangan menunggu sirene. `drought.after` dan `extreme_weather.after` kosong/tipis karena sumber tidak ada (extreme_weather.after sengaja kosong, renderer melewatinya). `tests/i18n.test.mjs` memeriksa kunci id=en, panjang array, tanpa harga/"53 negara".
- Renderer panduan di `src/app.js` merender array lewat DOM (tanpa innerHTML).
- Bug diperbaiki: `shopping.js` kehilangan `<h1>` (kini dipertahankan, fokus lewat router); teks "null" muncul di item belanja (`append(null)`); `print.css` dimuat tanpa `media="print"` sehingga menyembunyikan semua tombol di layar (kini `media=print` di `loadCss`); bilah aksi lengket belanja menimpa daftar dan tertutup bottom nav (kini statis).
- `data/province_risks.json` dibuat dari record province_risks r5-indonesia.json (38 provinsi, nama cocok dengan `provinces.*`), dimuat di app.js sebagai `ctx.data.province_risks`; forms.js memakainya (fallback tabel bawaan; ditambah pemetaan "banjir bandang").
- SW: `survivalcheck-v2`; semua src/*.js, styles/*.css, data/*.json, i18n/*.json masuk CORE precache.
- Unit: `meds_personal` ("hari stok") dan `medical_device_backup_power` ("Wh") di items.json tetap; engine menimpa ke "hari" (UNIT_OVERRIDE). Disarankan samakan di items.json kelak; angka tidak diubah.
- Uji: `tests/e2e-flow.mjs` (alur 360 px, offline, EN, ekspor/impor/hapus; `SHOTS_DIR=<dir>` menyimpan screenshot).

## Fix (perbaikan temuan QA Q1, 2026-11-04)

Perubahan data (diizinkan PM; kontrak "jangan ubah data" dilonggarkan untuk bagian ini):
- `data/items.json`:
  - D-047 (B-02): `gas_canister` dan `lpg_usage` dihapus; diganti tiga item gating tier 4 `fuel_canister` (gas kaleng + kompor portabel), `fuel_lpg` (LPG 3 kg), `fuel_alt_stove` (kompor alternatif), semuanya `qty_mode: fuel_days`, unit "hari", `gating_group: cooking_fuel_any`. `fuel_canister.suggest_per_person_week: 6` (saran MAFF, hanya tampilan). `stove_portable` jadi non-gating (saran). `_schema.gating` diperbarui.
  - B-18: unit `meds_personal` dan `medical_device_backup_power` jadi "hari"; `UNIT_OVERRIDE` dihapus dari engine.
  - B-05: `why` `water_pet_dog`, `water_pet_cat`, `soap`, `map_paper_local`, `tarpaulin_rope`, `fridge_food_safety_knowledge`, `generator` ditulis ulang tanpa "cuplikan/perlu verifikasi QA/snippet". Penanda kutipan kini lewat UI (`evidence: CUPLIKAN` tetap).
- `data/rules.json`: `tier_rule.gating_groups.cooking_fuel_any` ditambahkan.
- `data/sources-to-buy.json`: entri `gas_canister`/`lpg_usage` diganti `fuel_canister`/`fuel_lpg`/`fuel_alt_stove` (tanpa harga; catatan saran 6 kaleng/orang/minggu di `buy_tip`).
- `tests/cases.json`: tc06 (syarat naik `group_any` hari, items_eval, urutan shortfall_head) dan tc10 (`fuel_canister: 33` hari menggantikan `gas_canister: 520`; shortfall_head, items_eval, category_progress.food 42,9 -> 43,6) dihitung ulang; kasus lain tidak berubah.

Kode: `engine.js` (qty_mode `fuel_days`, grup gating berbasis hari, satu baris kekurangan per grup), `forms.js` (isian hari, saran MAFF, penanda kutipan, unit "-" tak tampil, B-11, catatan air 4 L), `results.js` (penanda kutipan, "> 365 hari", hapus fallback fixture; `fixtureResult` pindah ke `tests/fixture.mjs`), `shopping.js` (penanda kutipan, saring item satuan "-", "cukup salah satu"), `storage.js` (tolak state array), `app.js` + `styles/*` (target sentuh, fokus h1, judul, overflow 320 px), `index.html` (CSP meta), `manifest.webmanifest` (tanpa orientation), `pages.yml` (cancel-in-progress false), `sw.js` v3, i18n id/en.
Tes baru: `tests/fixes.test.mjs` (node:test) dan `tests/e2e-fixes.mjs` (Playwright, 320/360 px).
