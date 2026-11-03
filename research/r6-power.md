# R6 - Listrik padam panjang & alat medis listrik (untuk modul S4)

Akses: 2026-11-03. WebFetch gagal DNS; WebSearch + `curl` (UA default). Tag: [DIBACA] = diunduh dan dibaca; [CUPLIKAN] = hanya dari hasil pencarian; [ASUMSI] = tidak bersumber.

## Temuan bersumber
- **BBK PiB-19 "Autarke Notstromversorgung der Bevölkerung"** [DIBACA] (PDF, 2024-11): rata-rata watt lampu hemat energi 5-22 W (12 W), LED 12 V 9 W, radio 14 W, router 7,6 W, notebook 17,6 W (mode hemat), telepon rumah 2 W, HP 2113 mAh @5 V (≈10,6 Wh), kulkas 0,34-0,77 kWh/hari (rata-rata 0,54), Wasserkocher 2340 W. Inverter ηWR = 0,9; kulkas 100 W butuh inverter ≥700 W (arus awal ±7x). Alat medis rumah gagal saat padam.
- **BBK Stromausfall: Vorsorge und Selbsthilfe (Stand 2026)** [DIBACA sebagian]: Stromerzeuger tidak di dalam ruangan; Fachbetrieb untuk pasokan darurat; sistem baterai+inverter sebagai alternatif.
- **CDC power outage** [DIBACA] (halaman 2026-08-26): generator >20 kaki (≈6 m) dari jendela/pintu/ventilasi, tidak di rumah/garasi/basement; detektor CO berbaterai; kulkas ±4 jam, freezer penuh 48 jam / setengah 24 jam; obat dingin buang bila padam ≥1 hari kecuali label lain; senter bukan lilin.
- **CDC CO basics** [DIBACA]; **FDA** [DIBACA] konfirmasi 4 jam/48 jam.
- **Ready.gov/FEMA** [CUPLIKAN]: curl dapat 403 Access Denied; tidak diakali. Isi dari ringkasan pencarian: rencana dengan penyedia medis, generator hanya di luar & kering. Halaman memuat catatan sedang diperbarui.
- **UK PSR (UKPN/SSEN/SP)** [CUPLIKAN]: daftar prioritas gratis untuk pengguna alat medis listrik; saran baterai cadangan ≥3 jam.
- **PLN** [CUPLIKAN sekunder]: berita insiden arus balik genset (Singosari 2025-07-09). Panduan resmi PLN tentang genset/changeover/daftar pelanggan medis: **tidak ditemukan**.
- **Surya Indonesia** [CUPLIKAN sekunder]: ≈4,75 kWh/m²/hari (UNRAM), lokasi 4,2-5,3 (Global Solar Atlas via laporan pihak ketiga). Angka resmi ESDM/BMKG nasional tidak ditemukan.

## Tidak ditemukan / tidak diakses
- MSB, GOV.UK Be Ready (power cut), Kemenkes/BNPB soal alat medis listrik, ESDM/Energy Star tabel watt.
- DOE energy.gov: halaman diunduh tapi tanpa tabel watt.
- **Watt kipas, pompa air, TV, penanak nasi, CPAP, konsentrator oksigen, nebulizer, kulkas ASI: tanpa sumber resmi** -> `typical_w_source: "label perangkat — user wajib cek"`. Rentang sekunder komersial (bukan resmi): CPAP 30-60 W, konsentrator 300-600 W.

## Dipakai di data/power.json
Lihat `data/power.json` dan `docs/power.md`. Rangkuman angka konstanta: inverter 0,9 (BBK); usable 0,8, reserve 1,2, output margin 1,25, PSH 4,0, derate 0,75, efisiensi power bank 0,7 = ASUMSI.

JSON: `research/r6-power.json` (skema PLAN §4.1 + entri `{"type":"device_watts"}`).
