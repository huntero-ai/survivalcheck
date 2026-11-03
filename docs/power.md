# Modul Daya Listrik (S4, D-045)

Sumber data: `data/power.json`. Riset: `research/r6-power.md`. Tanpa harga, tanpa merek.

## Prinsip
- Angka watt bukan nilai resmi kecuali `evidence` berisi DIBACA. Sisanya `typical_w_source: "label perangkat — user wajib cek"`. UI wajib menampilkan "perkiraan" dan memungkinkan user menimpa watt (E1).
- Konstanta bertanda `ASUMSI` harus tampil sebagai asumsi di layar hasil.
- Alat medis (`medical=true`) memengaruhi "hari bertahan" (E5); selain itu listrik hanya saran.

## Struktur `power.json`
- `devices[]`: id, label{id,en}, typical_w, surge_w, default_hours_per_day, duty_cycle (kulkas), category, medical, power_hungry (tampilkan label "boros"), source, evidence, note.
- `constants`: inverter_efficiency 0,9 (BBK), usable_capacity_factor 0,8, power_bank_nominal_v 3,7, power_bank_conversion_efficiency 0,7, reserve_margin 1,2, output_margin 1,25, solar_peak_sun_hours_indonesia 4,0, solar_derate 0,75, genset_default_load_factor 0,5 (selain inverter: asumsi).
- `formulas[]`: deskripsi + pseudo-kode (di bawah).
- `safety_messages[]`: key, id, en, source, evidence, needs_review.
- `test_cases[]`: tc1-tc6 untuk unit test.

## Rumus
```
wh_day  = Σ typical_w × hours × duty_cycle × qty
wh_total = wh_day × days
rec_wh  = ceil10( wh_total / (inverter_eff × usable) × reserve )
cont_w  = Σ typical_w (bersamaan);  peak_w = cont_w + max(surge_w − typical_w)
min_continuous_w = ceil(cont_w × 1.25);  min_surge_w = ceil(peak_w)

pb_wh  = Σ mAh/1000 × 3.7 × qty × 0.7
ps_wh  = Σ station_wh × 0.8 × 0.9          # keluaran AC
gen_wh = genset_w × run_hours × 0.5
stored = pb_wh + ps_wh + gen_wh
solar_wh_day = Wp × 4.0 × 0.75
net = wh_day − solar_wh_day
days_power = net<=0 ? "mandiri" : stored / net
days_power_medical = (wh_day_med==0) ? n/a : stored / max(wh_day_med − solar,0)
survival_days = min(other_days, floor(days_power_medical))   # hanya bila ada medical
```
Aturan UI: "mandiri" berarti cukup selama cuaca cerah, jangan dihitung tak hingga (pakai days_target). Bila ada alat medis dan days_power_medical < days_target: peringatan keras + `medical_plan`.

## Kasus uji (ringkas)
| id | beban | hasil |
|---|---|---|
| tc1 | HP + LED, 3 hari | 74 Wh/hari, 222 Wh, rekomendasi 370 Wh, ≥24 W |
| tc2 | HP×4+router+kipas, 7 hari | 491,2 Wh/hari, 3438,4 Wh, rek. 5740 Wh, ≥110 W, lonjakan 168 W |
| tc3 | CPAP 8 jam × 7 hari | 480 Wh/hari, 3360 Wh, rek. 5600 Wh; station 1000 Wh → 1,5 hari |
| tc4 | Konsentrator O2 24 jam | 12.000 Wh/hari, rek. 20.000 Wh (tidak realistis), ≥625 W, lonjakan 1000 W |
| tc5 | Panel 100 Wp | 300 Wh/hari; mandiri untuk tc1, tidak untuk CPAP (defisit 180 Wh) |
| tc6 | Power bank 20.000 mAh × 2 | 148 Wh nominal, 103,6 Wh terpakai, 5,18 hari untuk 20 Wh/hari |

## Untuk copywriter
- Nada tenang, jelas. Selalu: "Cek label perangkat Anda."
- Alat medis: jangan menjanjikan layanan PLN; tulis ajakan bicara dengan dokter/penyedia alat (pesan `medical_plan`, needs_review).
- Pesan CO: tampilkan sebelum menyarankan genset. `no_backfeed` dan `battery_storage` masih `needs_review` (sumber sekunder/parsial).

## Keterbatasan
Ready.gov 403, sumber PLN/MSB/Kemenkes tidak ditemukan; watt kipas, pompa, TV, penanak nasi, CPAP, konsentrator, nebulizer, kulkas ASI adalah placeholder.
