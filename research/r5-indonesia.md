# R5 ★ Indonesia — STATUS: GAGAL AKSES WEB (riset belum dilakukan)

- Tanggal percobaan: 2026-11-03
- Agent: R5 (Indonesia)
- Status: **DIHENTIKAN** sesuai aturan tugas ("Jika akses web gagal, catat errornya di file output dan berhenti").
- Tidak ada angka atau klaim yang dimasukkan ke file ini, karena tidak ada satu pun dokumen resmi yang berhasil dibaca.

## 1. Error yang terjadi

| Alat | Target | Hasil |
|---|---|---|
| WebFetch | `https://bnpb.go.id/uploads/24/buku-data-bencana/6-buku-saku-cetakan-4-2019.pdf` | `getaddrinfo ENOTFOUND bnpb.go.id`: host di luar domain yang diizinkan jaringan sesi |
| WebFetch | `https://www.bnpb.go.id/storage/app/media/uploads/migration/pubs/478.pdf` | `getaddrinfo ENOTFOUND www.bnpb.go.id` |
| WebFetch | `https://bpbd.jogjaprov.go.id/berita/siap-hadapi-darurat-mulai-dengan-tas-siaga-bencana-` | `getaddrinfo ENOTFOUND bpbd.jogjaprov.go.id` |
| WebFetch | `https://indonesiabaik.id/infografis/siap-hadapi-bencana-dengan-tas-siaga-bencana` | `getaddrinfo ENOTFOUND indonesiabaik.id` |
| WebFetch | `https://luk.tsipil.ugm.ac.id/artikel/2017BNPB-BukuSakuTanggapTangkasTangguhBencana.pdf` (salinan PDF BNPB) | `getaddrinfo ENOTFOUND luk.tsipil.ugm.ac.id` |
| curl (Bash) | bnpb.go.id, sma.kemdikbud.go.id, www.bnpb.go.id (PDF) | `CONNECT tunnel failed, response 403` (proxy egress menolak) |
| WebSearch | 2 kueri | **Berhasil**, tetapi hanya memberi judul, URL, dan ringkasan dari model. Dokumen sumbernya sendiri tidak terbaca, jadi tidak memenuhi standar verifikasi (setiap angka harus diperiksa ke sumber). |

Kesimpulan: kebijakan jaringan sesi memblokir domain `.go.id` dan domain lain yang dicoba. Riset dari sumber resmi tidak bisa dijalankan.

## 2. Perbaikan yang dibutuhkan

Izinkan domain berikut di pengaturan Network access environment (menu environment di title bar sesi → Edit → Allowed domains, atau naikkan level akses). Panduan: https://code.claude.com/docs/en/cloud-environments#network-access

Domain minimal untuk menjalankan ulang R5:
- `bnpb.go.id`, `www.bnpb.go.id`, `inarisk.bnpb.go.id`, `dibi.bnpb.go.id`, `perpustakaan.bnpb.go.id`
- `bmkg.go.id`, `www.bmkg.go.id`
- `vsi.esdm.go.id`, `magma.esdm.go.id`, `geologi.esdm.go.id`
- `kemkes.go.id`, `www.kemkes.go.id`, `ayosehat.kemkes.go.id`
- `bapeten.go.id`, `www.bapeten.go.id`, `brin.go.id`
- `pmi.or.id`, `basarnas.go.id`
- `bpbd.jakarta.go.id`, `bpbd.jogjaprov.go.id`, `bpbd.jabarprov.go.id`
- `kemhan.go.id`, `polkam.go.id`, `komdigi.go.id` (nomor darurat 112)
- `sma.kemdikbud.go.id` (salinan buku saku BNPB 2019)

## 3. Petunjuk untuk run berikutnya (BELUM DIVERIFIKASI, jangan dipakai sebagai data)

URL di bawah ini muncul di hasil WebSearch dan bisa jadi titik awal saat akses dibuka. Isinya belum dibaca.

- BNPB, Buku Saku "Tanggap Tangkas Tangguh Menghadapi Bencana" cetakan ke-4, 2019: https://bnpb.go.id/uploads/24/buku-data-bencana/6-buku-saku-cetakan-4-2019.pdf
- BNPB, edisi 2012 (PDF): https://www.bnpb.go.id/storage/app/media/uploads/migration/pubs/478.pdf
- Halaman buku saku BNPB: https://bnpb.go.id/buku/buku-saku-bencana
- Salinan buku saku BNPB 2019 di Kemdikbud: https://sma.kemdikbud.go.id/data/files/buku/Buku_Saku_Siaga_Bencana_bnpb_2019.pdf
- BPBD DIY, artikel tas siaga bencana: https://bpbd.jogjaprov.go.id/berita/siap-hadapi-darurat-mulai-dengan-tas-siaga-bencana-
- Ringkasan hasil pencarian menyebut durasi tas siaga bencana sekitar 3 hari dan adanya "panduan keluarga siaga BNPB 2026". Keduanya **belum terverifikasi** dari dokumen resmi.

## 4. Celah data (semua cakupan belum tersentuh)

BNPB (Tas Siaga Bencana, buku saku, keluarga siaga, InaRISK), BMKG (gempa, tsunami, cuaca ekstrem, kekeringan), PVMBG/MAGMA (erupsi, gerakan tanah), Kemenkes (P3K, kabut asap, wabah, air minum), BAPETEN/BRIN (nuklir, kalium iodida), PMI, Basarnas, BPBD, Kemhan/Kemenko Polkam, nomor darurat, dan risiko per provinsi. Semuanya **belum diriset**.
