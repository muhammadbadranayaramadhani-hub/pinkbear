# MYSTERIA: The Academy of Hidden Knowledge

Game misteri edukasi (visual novel + investigasi titik-dan-klik) untuk siswa SMP kelas VII–IX.
Kasus pertama, **MYS-001 "The Last Drop"**, bisa dimainkan dari menu sampai kesimpulan.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # hasil di dist/
npm test           # tes logika game (node:test, tanpa dependensi tambahan)
```

Butuh Node.js 18+. Progres tersimpan otomatis di `localStorage` (kunci `mysteria.save.v1`).

## Cara bermain

1. **Penyelidikan Baru** → prolog (masukkan nama) → **Arsip Kasus** → **Buka Kasus**.
2. Jelajahi tiga lokasi, ketuk titik berpendar, kumpulkan bukti. Tidak semua benda adalah bukti.
3. Bukti membuka **Tantangan** (Matematika, IPA, Bahasa Indonesia). Jawaban salah dijelaskan, petunjuk bertahap tersedia, jawaban baru diperlihatkan hanya atas permintaan pemain.
4. Hubungkan bukti di **Papan Bukti** (pilih dua kartu, pilih hubungan *dan* alasannya).
5. Setelah 4 hubungan inti terbukti dan semua tantangan selesai, **Kesimpulan** terbuka. Kesimpulan dinilai dari bukti dan angka yang dipilih, bukan sekadar pilihan benar.

Keyboard: Enter/Spasi/→ melanjutkan dialog, tombol 1–9 memilih jawaban dialog, Esc menutup panel.

## Struktur

```
src/
  components/   UI (MainMenu, DialogueBox, StoryScreen, InvestigationScene, InteractiveObject,
                EvidenceInventory, EvidenceBoard, KnowledgeChallenge, CaseResolution,
                ResultScreen, CaseArchive, ProgressPanel, SettingsScreen, SceneBackground, ...)
  data/
    characters.js  evidence.js  intro.js
    cases/theLastDrop.js   <- seluruh konten kasus (lokasi, skrip, soal, hubungan, kesimpulan)
    cases/index.js         <- daftar kasus
  engines/      logika murni tanpa React
    StoryEngine  InvestigationEngine  EvidenceEngine  PuzzleEngine  ProgressEngine
  styles/       theme.css (token Dream Archive)  global.css
tests/          engines.test.mjs
```

## Menambah kasus baru

1. Salin `src/data/cases/theLastDrop.js` sebagai kerangka (lokasi + hotspot, bukti, `scripts`,
   `challenges`, `connections`, `objectives`, `resolution`).
2. Daftarkan di `src/data/cases/index.js` (`CASES` dan `CASE_LIST`).
3. Latar baru: tambahkan komponen adegan di `SceneBackground.jsx`.

Bahasa syarat yang sama dipakai di seluruh data: `{ collected, inspected, solved, connections, finalSolved, ready }`.

## Data kasus MYS-001 (harus selalu konsisten)

| Data | Nilai |
|---|---|
| Konsumsi normal | 1.200 liter |
| Hari penyelidikan | 1.560 liter |
| Selisih | 1.560 − 1.200 = **360 liter** |
| Sesi tambahan | 2 × 180 = **360 liter** |
| Murid hadir | 420 orang setiap hari |

`npm test` memeriksa bahwa tidak ada angka liter lain yang bertentangan di seluruh data kasus.
