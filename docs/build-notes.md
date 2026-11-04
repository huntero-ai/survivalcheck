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
