# MYSTERIA: The Academy of Hidden Knowledge

Gim visual novel misteri edukatif berbasis peramban untuk siswa SMP (kelas VII–IX).
Kasus pertama, **MYS-001 · Tetes Terakhir (The Last Drop)**, dapat dimainkan penuh dari menu utama sampai laporan kasus.

## Menjalankan

```bash
npm install
npm run dev      # mode pengembangan
npm run build    # hasil produksi di folder dist/
```

## Alur permainan

1. **Menu utama** → Penyelidikan Baru.
2. **Prolog**: surat undangan, isi nama penyelidik, masuk akademi, bertemu Seruni, map MYS-001 terbuka.
3. **Arsip Kasus** → Buka Berkas → pengarahan Seruni dan Pak Darto (pilihan dialog bercabang).
4. **Penyelidikan** di 3 lokasi (Ruang Pemeliharaan, Taman, Lorong) dengan 17 objek interaktif, 7 bukti, dan objek pengecoh.
5. **Tantangan pengetahuan** (Matematika ×2, IPA, Bahasa Indonesia) dengan petunjuk bertahap; jawaban hanya dibuka atas permintaan.
6. **Papan Bukti**: pilih dua bukti lalu pilih alasan hubungannya. 8 hubungan sah; pasangan yang tidak berhubungan juga dinilai.
7. **Kesimpulan akhir**: tinjau bukti → pilih penyebab → pilih bukti pendukung (termasuk bukti yang menolak dugaan kebocoran) → lengkapi persamaan `360 = 2 × 180` → ajukan.
8. **Epilog** dan **Laporan Kasus**: penjelasan, bukti pendukung, konsep, kinerja, bintang, pangkat, lencana.

Progres tersimpan otomatis di `localStorage` (kunci `mysteria.save.v1`).

## Struktur

```
src/
  components/   UI (MainMenu, DialogueScreen, DialogueBox, CharacterPortrait, SceneArt,
                InvestigationScene, InteractiveObject, InspectionPanel, EvidenceInventory,
                EvidenceBoard, KnowledgeChallenge, CaseResolution, CaseResult, ProgressPanel, …)
  data/
    cases/theLastDrop.js   seluruh konten kasus: adegan, lokasi, objek, tantangan, hubungan, kesimpulan
    evidence.js            dokumen bukti MYS-001
    characters.js          tokoh dan warna portret
    prologue.js            prolog
    progression.js         pangkat, aturan poin, lencana
  engines/      StoryEngine, InvestigationEngine, EvidenceEngine, PuzzleEngine, ProgressEngine (logika murni)
  state/        gameReducer.js (semua perubahan state)
  styles/       theme.css (token Dream Archive), global.css
```

## Menambah kasus baru

1. Buat `src/data/cases/namaKasus.js` dengan bentuk yang sama seperti `theLastDrop.js`
   (scenes, locations, hotspots, evidence, challenges, connections, objectives, chapters, final).
2. Daftarkan di `src/data/cases/index.js` (`CASES` dan `ARCHIVE_SHELF`).
3. Tambahkan ilustrasi lokasi baru di `SceneArt.jsx` bila perlu.

Persyaratan ditulis deklaratif (`{ evidence: [], challenges: [], flags: [], connections: n }`),
jadi tidak perlu mengubah engine.

## Catatan

- Ikon ditulis langsung dalam gaya Lucide (`components/Icon.jsx`) agar gim tetap berjalan tanpa jaringan;
  bisa diganti dengan paket `lucide-react`.
- Ilustrasi lokasi dan potret tokoh adalah SVG buatan sendiri (tanpa aset gambar eksternal).
- Aksesibilitas: fokus keyboard terlihat, dialog dengan perangkap fokus dan Esc, target sentuh ≥ 44 px,
  status tidak hanya lewat warna (ikon + teks), pengaturan "Kurangi gerak" dan ukuran huruf besar.
- Pintasan: Spasi/Enter melanjutkan dialog, angka 1–4 memilih opsi, J membuka Jurnal, B membuka Papan Bukti, Esc menu jeda.
