# SurvivalCheck

PWA offline untuk mengecek kesiapan rumah tangga menghadapi bencana. Baca `README.md`, `docs/contract.md`, dan `docs/decisions.md` sebelum mengubah kode atau data. Aturan keras: tanpa harga, tanpa klaim "53 negara", semua teks lewat `i18n/`, semua path relatif (jalan di `/survivalcheck/`), naikkan versi cache di `sw.js` setiap file aplikasi berubah.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read these installed skill files directly (use these paths even if a same-named global skill exists):
- Core filter, always on: `antislop`: `.claude/skills/antislop/SKILL.md`
- UI / visual: `antislop-ui`: `.claude/skills/antislop-ui/SKILL.md`
- Copy & text: `antislop-copywriting`: `.claude/skills/antislop-copywriting/SKILL.md`
- People: `antislop-human`: `.claude/skills/antislop-human/SKILL.md`
- Mobile / responsive: `antislop-layoutmobile`: `.claude/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `antislop-code`: `.claude/skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: `npx antislop-ai --update`, or run `npx antislop-ai` and pick Overwrite them.
<!-- antislop:end -->

## unslop
Skill `unslop` (oleh Damir Sokolovsky, @heydamir, lisensi CC BY 4.0, repo https://github.com/heydamir/unslop) memeriksa dan merapikan UI yang terlihat seperti buatan AI. Baca `.claude/skills/unslop/SKILL.md` untuk pekerjaan audit atau polesan tampilan, bersama `DESIGN.md` dan `antislop`. Proyek ini sudah melewati audit antislop, jadi pakai mode polesan (jangan mendesain ulang layar yang sudah baik). Skill ini hanya instruksi kerja: jangan menyambungkan layanan gambar eksternal (fal, Replicate, dll.) dan jangan membuat aset visual tanpa izin pemilik; skrip `scripts/snapshot.mjs` dan `scripts/story.mjs` hanya dijalankan bila diminta. Kredit pembuat di `SKILL.md` wajib dipertahankan.
