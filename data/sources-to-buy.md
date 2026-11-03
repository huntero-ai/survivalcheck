# sources-to-buy: aturan untuk developer

File: `data/sources-to-buy.json` (v1.0.0). Validasi: `python3 -I tests/validate_buy.py`.

## Skema
- `store_types[]`: `{id, label{id,en}}`, 12 jenis toko; id sama dengan kunci i18n (minimarket, supermarket, traditional_market, pharmacy, medical_supply, hardware, electronics, outdoor, baby_store, pet_shop, online_marketplace, free_official).
- `items{<item_id>}`: wajib ada untuk SEMUA id di `data/items.json` (149). Tiap entri punya semua field:
  - `stores`: id jenis toko, urut paling umum dulu. `[]` untuk item konsep/rencana/pengetahuan (atau yang cukup `free_official`).
  - `examples`: contoh jaringan umum (Indomaret, Alfamart, Kimia Farma, K-24, Ace, Mitra10, Tokopedia, Shopee, dsb.). Hanya contoh, boleh kosong. Bukan rekomendasi, bukan merek produk.
  - `diy`: `{id,en}` atau `null`. Hanya yang bersumber (toilet kantong sampah + penyerap, plastik kedap air, ember/wadah air, tandon hujan) atau yang jelas memakai barang rumah.
  - `free_official`: `{id,en,source}` atau `null`. Dukcapil/kelurahan (salinan dokumen), BPBD/InaRISK (jalur evakuasi), Info BMKG/MAGMA/SATUSEHAT (informasi).
  - `often_at_home`: bool. Prinsip "Versi Hemat" BNPB (ember, kantong sampah, senter, selimut, sendok, pakaian, dll.). UI boleh menampilkan "mungkin sudah ada".
  - `buy_tip`: `{id,en}` atau `null`.

## Aturan keras
- Tanpa harga/nominal/"Rp"/"ribu"/"juta"; validator menolak. Uang tunai hanya dalam "hari belanja" (item `cash_days` tanpa toko).
- Tanpa merek produk. Nama jaringan toko hanya sebagai contoh.
- Pemutih/tablet/saring air/masker: "cek kadar/petunjuk/standar di label". Jangan menakar dosis dari data ini.
- Obat resep: arahkan ke faskes/dokter/apotek; jangan sarankan obat keras tanpa resep (lihat `meds_personal`, `elderly_meds`, `pet_meds`).
- Kalium iodida tidak ada (D-023).
- Item baru di `items.json` harus ditambahkan di sini, atau validator gagal.
- Teks dua bahasa (id utama, en). `source` untuk `free_official` berupa nama lembaga, bukan URL yang belum diverifikasi.
