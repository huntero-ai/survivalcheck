# Spesifikasi Mesin Hitung SurvivalCheck (S2)

Tanggal: 2026-11-03 · Pemilik: S2 · Pengguna: E2 (kode), E3 (tampilan hasil), Q1 (uji)
File terkait: `data/rules.json` (angka), `data/items.json` (kuantitas per item), `data/power.json` + `docs/power.md` (rumus listrik, milik S4), `data/bnpb_family_indicators.json`, `tests/cases.json` (10 kasus uji + 2 kasus tepi).

Prinsip: tanpa harga; semua angka ada di `rules.json`/`items.json`, bukan di kode; fungsi murni (input -> output, tanpa efek samping, tanpa waktu/acak); semua keputusan merujuk `docs/decisions.md`.

---

## 1. Skema input

Mesin dipanggil `compute(profile, inventory, indicators, bag_checklist, power)` dan mengembalikan `result` (bagian 2). Semua field opsional kecuali `profile.counts` (minimal 1 orang).

### 1.1 `profile`
```json
{
  "counts": {"infant": 0, "toddler": 0, "child": 0, "adult": 1, "elderly": 0},
  "pregnant": 0,
  "breastfeeding": 0,
  "infant_feeding": "formula",
  "pets": {"dog": 0, "cat": 0},
  "meds": [{"label": "Antihipertensi", "doses_per_day": 1, "stock_days": 12}],
  "has_electric_medical": false,
  "usage_per_day": {"infant_formula": 5, "infant_mpasi": 2, "infant_diapers": 8, "pet_food": 400, "mask_n95": 3},
  "scenarios": ["earthquake", "drought"],
  "target_days": 7
}
```
| Field | Tipe | Default | Arti |
|---|---|---|---|
| `counts.{infant,toddler,child,adult,elderly}` | int >= 0 | 0 | Orang per kelompok usia (D-030). `N` = jumlah kelimanya, harus >= 1. |
| `pregnant`, `breastfeeding` | int >= 0 | 0 | Jumlah orang yang ditandai. +285 / +500 kkal per orang per hari (D-009). Orang yang sama sudah termasuk di `counts`. |
| `infant_feeding` | `formula` \| `breastfeeding` \| `mixed` | `defaults.infant_feeding` = `formula` | Menentukan apakah `infant_formula` berlaku (hanya `formula`/`mixed`). |
| `pets.dog`, `pets.cat` | int >= 0 | 0 | Jumlah hewan (D-016). Hewan lain tidak dihitung. |
| `meds[]` | daftar | `[]` | Obat rutin. `stock_days` = sisa stok dalam hari (angka >= 0). `doses_per_day` hanya informasi untuk UI. `has_meds = meds.length > 0`. |
| `has_electric_medical` | bool | false | Ada alat medis listrik (CPAP, konsentrator oksigen, nebulizer, dst.). |
| `usage_per_day` | map id -> angka >= 0 | `{}` | Pemakaian harian untuk item `qty_mode = user_usage_per_day` (D-010, D-016). **Total rumah tangga**, bukan per orang. `null`/tidak ada = belum diisi. `0` = sengaja tidak dipakai. |
| `scenarios[]` | id skenario di `items.json.scenarios` | `[]` | Multi-pilih. |
| `target_days` | int 1..365 | 7 | Preset 3/7/14/30 atau custom. |

Bendera turunan (dipakai `applies_if`): `has_infant = counts.infant>0`, `has_toddler = counts.toddler>0`, `has_child = counts.toddler+counts.child>0` (dipakai `profile_hint`), `has_elderly`, `has_pregnant = pregnant>0`, `has_meds`, `has_pet_dog`, `has_pet_cat`, `has_electric_medical`.

### 1.2 `inventory`
Peta `item id -> nilai`. Id yang tidak ada = 0/false.

| `qty_mode` item | Bentuk nilai | Arti |
|---|---|---|
| `per_person_day` | angka | Total yang dimiliki dalam satuan item (L air, kantong, rol, g, tabung). |
| `per_household`, `boolean` | angka atau bool | Jumlah buah/set; `true` = 1, `false` = 0. |
| `user_usage_per_day` | angka | Total yang dimiliki (mis. 28 porsi formula, 1500 g pakan). Pemakaian harian dari `profile.usage_per_day`. |
| item `food_*` (jenis pangan) | objek `{qty, grams_per_unit?, kcal_per_unit?, kcal_total?}` | Lihat 3.3. |
| `cash_days` | angka | Jumlah hari belanja pokok yang tertutup tunai (tanpa nominal, D-017). |
| `meds_personal` | (tidak dipakai) | Diambil dari `profile.meds`. |
| `medical_device_backup_power` | (tidak dipakai) | Diambil dari `power`. |
| `food_kcal_total`, `food_no_cook_share` | (tidak dipakai) | Turunan dari jenis pangan. |

Semua nilai angka/bool juga boleh berbentuk `{ "home": n, "bag": m }` (lokasi D-031, dijumlahkan; selain itu tidak memengaruhi hitungan, hanya dilaporkan UI). Jenis pangan tidak punya lokasi.

### 1.3 `indicators` (18 nilai)
`{"ind_01": 0..2, ..., "ind_18": 0..2}` sesuai `data/bnpb_family_indicators.json`. Tidak ada/`null` = 0 dan advisory `indicators_incomplete`. Indikator 6, 10, 11, 16, 17 tetap dihitung (skala 36 setara BNPB).

### 1.4 `bag_checklist` (28 ya/tidak)
`{"1": true, "2": false, ..., "28": true}` (nomor checklist BNPB 2026 pada `items.json.bnpb_checklist`). Tidak ada = false. Nilai untuk nomor yang dikeluarkan dari penyebut (4, 27, 28) diabaikan.

### 1.5 `power` (dari modul daya, milik S4)
```json
{"days_power_medical": 3.0}
```
`days_power_medical` = hasil rumus `days_power_medical` di `docs/power.md` (angka hari, atau string `"self_sufficient"` bila panel surya menutup beban medis, atau `null`/tidak ada bila modul daya belum diisi). **Rumus daya tidak diduplikasi di sini**; mesin hanya menerima hasilnya.

---

## 2. Skema output `result`
```json
{
  "status": "ok",
  "errors": [],
  "household": {"n_total": 4, "counts": {...}, "daily_kcal": 5890, "water_l_per_person_day": 3, "flags": {...}},
  "targets": {"target_days": 7, "effective_target_days": 7, "meds_target_days": 7, "cash_target_days": 7, "target_tier": 3},
  "food": {"total_kcal": 42820, "no_cook_share_pct": 0},
  "survival": {"days_exact": 5.6, "days": 5, "bottleneck": "infant_food",
               "components": {"water": 6.0, "food": 7.27, "meds": null, "infant_food": 5.6, "power": null}},
  "tier": {"value": 1, "next_tier": 2, "label": {"id": "...", "en": "..."}},
  "tier_checks": {"2": false, "3": false, "4": false, "5": false},
  "to_next_tier": {"tier": 2, "requirements": [ ... ]},
  "bag": {"yes": 21, "applicable": 27, "excluded": [28], "pct": 77.78, "band": "perlu_dilengkapi"},
  "family": {"total": 14, "band": "cukup_siaga"},
  "score": {"components": {"critical_stock": 52.9, "bag": 15.56, "family": 5.83, "scenario": null},
            "weight_sum": 90, "total_exact": 82.55, "total": 83},
  "category_progress": {"water": 17.1, "food": 25.0, "...": null},
  "items_eval": {"water_drinking": {"unit": "L", "need": 84, "have": 72, "missing": 12, "coverage": 0.8571}},
  "shortfall_count": 80,
  "shortfall": [ {"id": "infant_formula", "category": "special_needs", "priority": "critical", "min_tier_gating": 2,
                  "unit": "porsi/botol", "need": 35, "have": 28, "missing": 7, "blocks_tier": 2} ],
  "warnings": ["usage_missing:infant_mpasi"],
  "advisories": ["no_cook_share_low"]
}
```
- Bila `N < 1`: `{"status": "invalid", "errors": ["household_empty"]}` dan tidak ada field lain.
- `tier.label` diambil dari `rules.tiers[tier].name`. `bag.band` dan `family.band` memakai id (`siap|perlu_dilengkapi|belum_siap`, `rawan|cukup_siaga|siap`); label tampilan dari `bnpb_family_indicators.json`.
- `survival.components[x] = null` bila komponen tidak berlaku.
- `to_next_tier = null` pada tier 5.
- `requirements[]` berbentuk salah satu: `{kind:"item", id, unit, need, have, missing}` · `{kind:"group_any", group, ids, missing:1}` · `{kind:"input_missing", id}` · `{kind:"bag", required_pct_gt, current_pct, yes, needed_yes, missing}` · `{kind:"family", required_gte, current, missing}`.
- `shortfall[].status = "needs_input"` dan `missing = null` bila item gating/kritis butuh angka pemakaian yang belum diisi.
- Pembulatan: `missing` = ceil setelah dibulatkan 6 desimal; `days_exact`, kkal, persen, komponen skor = 2 desimal; `survival.days = floor(days_exact)`; `score.total` = half-up ke bilangan bulat. Perbandingan memakai epsilon 1e-9.

---

## 3. Algoritma langkah demi langkah

Notasi: `R` = rules.json, `I` = items.json, `eps = 1e-9`.

### 3.0 Validasi dan normalisasi
1. Isi default: `target_days = R.defaults.target_days`, `infant_feeding = R.defaults.infant_feeding`, `counts.* = 0`.
2. `N = sum(counts)`. Bila `N < 1` -> kembalikan `invalid/household_empty`.
3. Skenario yang tidak dikenal diabaikan (UI mencegah). `target_days` di luar 1..365 dijepit.
4. `have_of(v)`: `null/false/tidak ada` = 0; `true` = 1; angka = angka; `{home,bag}` = home+bag.

### 3.1 Kebutuhan dasar rumah tangga
```
daily_kcal = sum(counts[g] * kcal_per_day[g]) + pregnant*285 + breastfeeding*500
             # kcal_per_day: bayi null (0), balita 1430, anak 2000, dewasa 2230, lansia 1890
water_rate = max(R.water.drinking_l_per_person_day (3), SR[s].water_drinking_l_per_person_day untuk s dalam scenarios)   # kekeringan 4
```
Air minum berlaku untuk **semua** usia termasuk bayi (D-004). Air kebersihan 2 L (`water_hygiene`) hanya saran (non-gating, tidak ikut hari bertahan).

### 3.2 Skenario (pengali tertinggi, item digabung)
```
effective_target_days = max(target_days, max(SR[s].effective_target_min_days))     # konflik 7, pandemi 14
meds_target_days      = max(effective_target_days, R.meds.min_days (7), max(SR[s].meds_min_days))   # pandemi 30
cash_target_days      = max(max(SR[s].cash_days), effective_target_days >= 7 ? 7 : 3)             # konflik/listrik padam 7
target_tier           = tier tertinggi (id >= 1) dengan stock_days <= effective_target_days
```
- Angka numerik antarskenario: **diambil yang tertinggi**. Item: **gabungan tanpa dobel** (item berlaku bila `item.scenarios` kosong atau salah satu skenario terpilih ada di `item.scenarios`).
- `effective_target_days` dipakai untuk kebutuhan, kekurangan, dan skor. **Tier tidak berubah karena skenario** (tier hanya melihat stok); skenario menaikkan target dan `target_tier` untuk tampilan "target Anda setara tier X".

### 3.3 Kkal stok dari jenis pangan
Untuk tiap id di `R.food.aggregates` yang ada di `inventory` (objek `{qty, grams_per_unit, kcal_per_unit, kcal_total}`), urutan penyelesaian:
1. `kcal_total` bila ada.
2. `qty * kcal_per_unit` bila `kcal_per_unit` ada (label gizi).
3. `qty * g * kcal_per_100g / 100`, `g = grams_per_unit` atau `R.food.unit_g_defaults[item.unit]` (hanya `kg` = 1000), dan `kcal_per_100g` tidak null.
4. Selain itu kkal = 0 + warning `food_kcal_unresolved:<id>` (kurma dan makanan siap saji: `kcal_per_100g = null`, wajib dari label; D-046).

`total_kcal = sum`, `no_cook_kcal = sum` untuk id di `R.food.no_cook_ids`. `no_cook_share_pct = no_cook_kcal / total_kcal * 100`; bila `< 50` dan `total_kcal > 0` -> advisory `no_cook_share_low` (D-011, tidak gating, tidak masuk skor).

### 3.4 Keberlakuan item
Item `it` berlaku bila **semua**:
1. `applies_if` kosong **atau** salah satu bendera di `applies_if` true (any-of).
2. `profile_hint` kosong atau bendera itu true.
3. Override `R.item_applicability_overrides`: `infant_formula` hanya bila `infant_feeding in {formula, mixed}`.
4. `it.scenarios` kosong **atau** ada irisan dengan skenario terpilih.

Jenis pangan (`R.food.aggregates`) dan `food_no_cook_share` berlaku tetapi **tidak diperlakukan sebagai item kebutuhan** (tidak masuk shortfall/skor/gating; kekurangan pangan dinyatakan pada `food_kcal_total`).

### 3.5 Kebutuhan dan kepemilikan per item: `have_need(it, days)`
`days` = jumlah hari yang dievaluasi (hari target atau `stock_days` tier).

| Jenis (berdasarkan id/`qty_mode`) | `need` | `have` |
|---|---|---|
| `water_drinking` (per_person_day) | `water_rate * N * days` | inventaris |
| `water_hygiene`, `toilet_bags`, `toilet_paper`, `soap`, `gas_canister` (per_person_day) | `per_person_day * N * days` (kecuali `water_hygiene`: `R.water.hygiene_l_per_person_day`) | inventaris |
| `user_usage_per_day` | `usage * max(days, modifiers.min_days bila ada)` (`pet_food` min 5) | inventaris. `usage` null -> `unknown` (lihat 3.10). `usage` 0 -> need 0 |
| `water_pet_dog` / `water_pet_cat` | `jumlah_hewan * 4 (anjing) atau 1 (kucing) * max(days, 5)` | inventaris |
| `per_household` / `boolean` | `per_household`, atau `per_person * N`, atau 1 | inventaris (bool -> 0/1) |
| `food_kcal_total` | `daily_kcal * days` | `total_kcal` (3.3) |
| `meds_personal` | `max(days, 7)` (hari; `7 = R.meds.min_days`) | `min(meds[].stock_days)`; 0 bila tidak ada |
| `cash_days` | `days` (hari belanja) | inventaris |
| `medical_device_backup_power` | `days` | `power.days_power_medical`; `"self_sufficient"` = `days` (memenuhi); null -> `unknown` |

`coverage = min(have / need, 1)` bila `need > 0`. Item dengan `need = 0` dikeluarkan dari semua rata-rata.

### 3.6 Hari bertahan (D-028)
```
water      = have(water_drinking) / (water_rate * N)
food       = daily_kcal > 0 ? total_kcal / daily_kcal : null
meds       = has_meds ? min(meds[].stock_days) : null
infant_food= min( formula/usage_formula  [bila has_infant dan infant_feeding in {formula,mixed}; usage null -> 0 + warning],
                  mpasi/usage_mpasi      [bila (has_infant atau has_toddler) dan usage_mpasi > 0] )  ; null bila tak ada bagian
power      = has_electric_medical dan power.days_power_medical berupa angka ? angka : null
             # 'self_sufficient' -> null (tidak membatasi); null dengan has_electric_medical -> null + warning medical_power_unknown
days_exact = min(komponen non-null)           # air selalu ada
days       = floor(days_exact + eps)
bottleneck = komponen dengan nilai minimum; seri -> urutan water, food, meds, infant_food, power
```
Sanitasi, penerangan, air kebersihan tidak ikut (hanya gating tier). Rumus daya milik S4 (`docs/power.md`); mesin hanya membaca hasilnya (pembatas seperti `floor(days_power_medical)` sudah tercakup oleh `floor(days_exact)`).

### 3.7 Sub-skor tas BNPB (D-026) dan keluarga (D-027)
```
excluded = {4 jika tak ada bayi/balita, 27 jika tak ada bayi/balita, 28 jika tak ada lansia}
applicable = {1..28} \ excluded
yes = hitung nomor di applicable yang true
pct = yes / |applicable| * 100
band: pct > 80 -> siap ; 50 <= pct <= 80 -> perlu_dilengkapi (tepat 80 dan tepat 50 masuk sini) ; pct < 50 -> belum_siap
family_total = sum(ind_01..ind_18)  (0..36); band: 0-12 rawan, 13-24 cukup_siaga, 25-36 siap
```

### 3.8 Tier (D-001, D-002, D-014, D-017, D-027)
Parameter tier ada di `R.tiers[]`: `stock_days` (T2=3, T3=7, T4=14, T5=30), `bag_pct_gt`, `family_score_gte` (T2/T3: 13; T4/T5: 25), `meds_days`, `cash_days`.

Untuk tiap `T` dalam 2..5, hitung `unmet(T)`:
1. **Item gating**: untuk tiap item berlaku dengan `gating = true` dan `min_tier_gating <= T`:
   - grup `gating_group` (`alt_power_any`: power_station, solar_panel, generator): terpenuhi bila **salah satu** anggota dimiliki >= 1; dihitung sekali per grup.
   - `cash_days`: evaluasi dengan `days = R.cash.gating_days` (7).
   - selain itu: evaluasi `have_need(it, tier.stock_days)`; terpenuhi bila `have + eps >= need`. Untuk item hitungan/ya-tidak, `need` tidak bergantung hari; `meds_personal` otomatis `max(stock_days, 7)` (T2: 7, T3: 7, T4: 14, T5: 30).
   - Item gating dengan nilai `unknown` (pemakaian belum diisi, atau daya medis belum ada) dianggap **tidak terpenuhi** (`input_missing`).
2. **Tas**: `bag.pct > max(bag_pct_gt untuk tier 2..T)` (strict).
3. **Indikator**: `family_total >= max(family_score_gte untuk tier 2..T)`.

`ok[T] = unmet(T) kosong`. Tier:
```
tier = 0
jika days_exact >= 1: tier = 1
untuk T = 2..5 berurutan: jika ok[T] (dan semua tier sebelumnya >=2 ok): tier = T, selain itu berhenti
```
(= tier tertinggi yang semua gating-nya terpenuhi; syarat kumulatif.) **Skor tidak pernah memengaruhi tier.** Tier 1 -> tier 2: syarat "naik" memakai `unmet(2)`.

Gating saat ini dari `items.json` (informasi; kode selalu membaca field):
- Tier 2: `water_drinking`, `food_kcal_total`, `toilet_bags`, `flashlight`, `spare_batteries`, `gobag_main`; bila berlaku: `meds_personal`, `infant_formula`, `infant_mpasi`, `infant_diapers`, `elderly_meds`, `medical_device_backup_power`.
- Tier 3: `power_bank`, `radio_portable`, `emergency_numbers_printed`, `doc_copy_ktp`, `doc_copy_kk`, `doc_copy_property`, `doc_copy_bank`, `doc_waterproof_bag`, `cash_days`.
- Tier 4: `water_treatment_chemical`, `stove_portable`, `gas_canister`, `family_emergency_plan` (+ indikator >= 25).
- Tier 5: salah satu `power_station|solar_panel|generator`, `first_aid_knowledge`.

### 3.9 Skor 0-100 (D-029)
```
f(it) = coverage(it) terhadap effective_target_days (meds: meds_target_days; cash: cash_target_days)
critical_stock = 55 * rata-rata f(it) untuk item berlaku dengan priority = critical          # bobot item sama
bag            = 20 * yes / |applicable|
family         = 15 * family_total / 36
scenario       = 10 * rata-rata f(it) untuk item berlaku dengan it.scenarios tidak kosong     # item inti tidak ikut
total_exact    = jumlah komponen berlaku * 100 / jumlah bobot komponen berlaku
total          = half-up(total_exact)
```
- Komponen tanpa item yang berlaku (mis. tanpa skenario) dikeluarkan dan total dinormalisasi (contoh: 3 komponen -> bobot 90, total = jumlah * 100/90), supaya orang yang tidak memilih skenario tidak dihukum.
- Item pemakaian-harian dengan angka belum diisi: bila kritis atau gating -> `f = 0` (+ warning `usage_missing:<id>`); selain itu dikeluarkan dari rata-rata, tanpa warning.
- Skor tidak menaikkan tier; tier tidak memengaruhi skor.

### 3.10 Kekurangan (F5, F6)
Untuk tiap item berlaku (kecuali jenis pangan/food_no_cook_share):
```
d = effective_target_days  (meds: meds_target_days; cash: cash_target_days)
hn = have_need(it, d)
bila hn unknown dan (gating atau kritis): masukkan {missing: null, status: "needs_input"}
bila need > 0 dan have < need: missing = ceil(need - have)
```
Urutan (stabil): (1) `priority`: critical, important, extra; (2) `min_tier_gating` naik (null terakhir); (3) persentase kekurangan terbesar `round(1 - coverage, 6)`; (4) urutan item di `items.json`. Setiap entri membawa `blocks_tier = min_tier_gating` (bila ada) sehingga UI bisa menulis "menahan tier X". Alasan (`why`) dan sumber diambil UI dari `items.json`.

### 3.11 "Untuk naik ke tier X butuh ..."
`next = tier + 1` (null bila tier 5).
- `next = 1` (tier 0): komponen survival yang `< 1 hari` dinyatakan sebagai `item` air/kkal/obat/makanan bayi/daya medis dengan `days = 1` (obat: butuh >= 1 hari, bukan lantai 7).
- `next >= 2`: `unmet(next)` dari 3.8, diurutkan seperti kekurangan (priority, min_tier, urutan item), lalu entri `bag`, lalu `family`. Jumlah tas yang dibutuhkan: `needed_yes = floor(bag_pct_gt/100 * |applicable|) + 1`.
- Kuantitas tiap `item` dihitung untuk `stock_days` tier tujuan (bukan target pengguna).

### 3.12 Progres per kategori (F5)
`category_progress[cat] = rata-rata coverage` item berlaku dengan need > 0 pada kategori itu (terhadap effective_target_days), x100, 1 desimal; `null` bila tidak ada item. Item pemakaian-harian gating/kritis tanpa angka dihitung 0.

---

## 4. Peringatan dan advisory
| Kode | Kapan | Tingkat |
|---|---|---|
| `usage_missing:<id>` | item kritis/gating berpemakaian-harian berlaku tapi `usage_per_day` belum diisi | warn |
| `food_kcal_unresolved:<id>` | jenis pangan tak bisa dihitung kkal-nya | warn |
| `medical_power_unknown` | `has_electric_medical` tanpa `power.days_power_medical` | warn |
| `no_cook_share_low` | pangan siap santap < 50% kkal | advisory |
| `below_bnpb_minimum` | `target_days < 3` | advisory |
| `pregnant_breastfeeding_exceeds_household` | hamil + menyusui > dewasa + lansia | advisory |
| `indicators_incomplete` | ada indikator tanpa nilai | advisory |

`warnings` terurut abjad tanpa duplikat; `advisories` urut deteksi (`no_cook_share_low`, `below_bnpb_minimum`, `pregnant_breastfeeding_exceeds_household`, `indicators_incomplete`).

---

## 5. Pemetaan angka ke `rules.json`
| Bagian rules.json | Dipakai di |
|---|---|
| `age_groups`, `energy_adjustments` | 3.1 |
| `water`, `item_applicability_overrides` | 3.1, 3.4, 3.5 |
| `food` | 3.3 |
| `meds`, `cash` | 3.2, 3.5, 3.8 |
| `scenario_rules` | 3.2 |
| `tiers`, `tier_rule` | 3.8 |
| `survival_days` | 3.6 (`tie_break_order`, `tier1_item_ids` untuk 3.11) |
| `bag_checklist`, `family_indicators` | 3.7 |
| `score` | 3.9 |
| `shortfall`, `rounding`, `advisories` | 3.10 dan seterusnya |

Mengganti angka (mis. target default, kkal, ambang tier) cukup di file itu; tidak ada angka di kode.

---

## 6. Kasus uji
`tests/cases.json` berisi 10 kasus (`cases`) dan 2 kasus tepi (`extra_cases`). Tiap kasus memuat `input` lengkap, `calc` (langkah hitung manual dengan angka antara), dan `expected`. Daftar:

| ID | Fokus |
|---|---|
| tc01 | 1 dewasa 3 hari: tier 2, bottleneck air |
| tc02 | 2 dewasa + 1 balita + 1 bayi formula, 7 hari: bottleneck makanan bayi; tas 77,78% menahan tier 2 -> tier 1 |
| tc03 | 2 lansia, obat 12 dan 5 hari: bottleneck obat, tier 1 |
| tc04 | anjing + kucing, target 3: minimum hewan 5 hari, pakan dari input |
| tc05 | gempa + tsunami + listrik padam, CPAP (daya 3,0 hari): bottleneck daya, tier 2, skor skenario |
| tc06 | kekeringan 4 L, hamil +285: tier 3 |
| tc07 | pandemi, target 3 -> 14, obat 30 hari, tier tidak berubah karena skenario |
| tc08 | konflik, target 3 -> 7, tunai 7, tas tepat 80% = PERLU DILENGKAPI -> tier 1 |
| tc09 | input kosong: tier 0, skor 0 |
| tc10 | 20 orang target 90 hari, stok 33 hari: tier 5, skor 73 |
| ex01 | bayi ASI: formula tidak berlaku, ibu menyusui +500 kkal |
| ex02 | 0 orang: `invalid` |

Cara uji (E2): `compute(case.input...)` lalu bandingkan dengan `expected` (toleransi 0,01 untuk hari/skor/persen; bilangan bulat dan teks persis; daftar berurutan). Tes konsistensi tambahan yang disarankan: nilai air/kkal/hamil di `rules.json` sama dengan `items.json` (`water_drinking.per_person_day`, `water_hygiene.per_person_day`, `modifiers` pada `food_kcal_total`).

---

## 7. Keputusan desain dan hal yang perlu dikonfirmasi PM
1. **Tier vs skenario**: skenario menaikkan target (durasi minimum efektif) tetapi tidak mengubah ambang tier; D-032 "durasi min tier efektif 7 hari" dibaca sebagai target minimum 7 hari + `target_tier`. Alternatif: menahan tier maksimum di bawah target. Belum diminta.
2. **Tier 0/1** berdasar `days_exact >= 1` (termasuk obat, makanan bayi, daya medis), bukan hanya air/pangan seperti tabel SUMMARY 4.1; selaras D-028.
3. **Pemakaian harian** (formula, MPASI, popok, pakan, N95) adalah **total rumah tangga** di `profile.usage_per_day`; stok di `inventory`. Kosong pada item gating/kritis menahan tier (`needs_input`) agar tidak ada tier palsu.
4. **Berat kemasan pangan tidak bersumber** (R5b): hanya satuan `kg` dikonversi otomatis; sisanya wajib `grams_per_unit` atau label.
5. **Daya medis** hanya masuk hari bertahan dan gating tier 2 (butuh >= `stock_days` tier); `"self_sufficient"` tidak membatasi.
6. **Hamil/menyusui** menambah kkal per orang yang ditandai; tidak menambah air (D-009).
7. Item per-orang (`per_person`: masker, peluit, sepatu, selimut) menghitung semua usia termasuk bayi; dapat dipersempit lewat konfigurasi bila diinginkan.
8. `infant_feeding` default `formula` (konservatif) bila bayi ada tetapi belum dipilih.
9. Kolom `buffer_pct` 10% usulan R5b tidak dipakai (default 0).
