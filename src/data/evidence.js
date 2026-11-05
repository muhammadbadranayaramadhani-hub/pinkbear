// Bukti untuk kasus MYS-001 "Tetes Terakhir".
// Semua angka konsisten: hari biasa 1.200 L, Selasa 1.560 L, selisih 360 L = 2 sesi × 180 L.

export const EVIDENCE_MYS001 = {
  laporan: {
    id: 'laporan',
    title: 'Laporan Pemakaian Air Harian',
    short: 'Laporan Harian',
    icon: 'fileText',
    location: 'maintenance',
    source: 'Ruang Pemeliharaan · meja Pak Darto',
    summary: 'Catatan pemakaian air akademi selama empat hari sekolah terakhir.',
    facts: [
      { label: 'Pemakaian hari biasa', value: '1.200 liter/hari' },
      { label: 'Pemakaian hari Selasa', value: '1.560 liter' },
    ],
    doc: {
      kind: 'table',
      heading: 'Laporan Pemakaian Air',
      sub: 'Akademi Pengetahuan Tersembunyi · Oktober',
      columns: ['Hari', 'Tanggal', 'Pemakaian'],
      rows: [
        { cells: ['Kamis', '9 Okt', '1.200 L'] },
        { cells: ['Jumat', '10 Okt', '1.200 L'] },
        { cells: ['Senin', '13 Okt', '1.200 L'] },
        { cells: ['Selasa', '14 Okt', '1.560 L'], mark: true },
      ],
      note: 'Sabtu dan Minggu sekolah libur. Pemakaian 1.200 L/hari sudah termasuk penyiraman rutin pagi dan sore.',
      sign: 'Dicatat oleh: Darto',
    },
  },

  meter: {
    id: 'meter',
    title: 'Pengamatan Meter Air Utama',
    short: 'Bacaan Meter',
    icon: 'gauge',
    location: 'maintenance',
    source: 'Ruang Pemeliharaan · kartu di samping meter',
    summary: 'Angka meter air utama yang dibaca setiap pagi pukul 06.00.',
    facts: [
      { label: 'Senin 06.00 → Selasa 06.00', value: '24.100 L → 25.300 L' },
      { label: 'Selasa 06.00 → Rabu 06.00', value: '25.300 L → 26.860 L' },
    ],
    doc: {
      kind: 'table',
      heading: 'Kartu Bacaan Meter',
      sub: 'Meter air utama · dibaca pukul 06.00',
      columns: ['Waktu baca', 'Angka meter'],
      rows: [
        { cells: ['Senin, 13 Okt · 06.00', '24.100 L'] },
        { cells: ['Selasa, 14 Okt · 06.00', '25.300 L'] },
        { cells: ['Rabu, 15 Okt · 06.00', '26.860 L'], mark: true },
      ],
      note: 'Pemakaian satu hari = angka pagi berikutnya − angka pagi hari itu.',
      sign: 'Dibaca oleh: Darto',
    },
  },

  jadwal: {
    id: 'jadwal',
    title: 'Jadwal Penyiraman Taman',
    short: 'Jadwal Siram',
    icon: 'sprout',
    location: 'garden',
    source: 'Taman Akademi · papan jadwal',
    summary: 'Jadwal penyiraman Klub Taman, termasuk sesi tambahan hari Selasa.',
    facts: [
      { label: 'Sesi tambahan hari Selasa', value: '2 sesi (11.00 dan 14.00)' },
      { label: 'Air per sesi tambahan', value: '180 liter' },
    ],
    doc: {
      kind: 'schedule',
      heading: 'Jadwal Penyiraman Taman',
      sub: 'Klub Taman Akademi',
      sections: [
        {
          title: 'Rutin · setiap hari sekolah',
          note: 'Sudah termasuk pemakaian normal akademi.',
          rows: [
            { time: '06.30', label: 'Siram pagi', value: '✓' },
            { time: '17.00', label: 'Siram sore', value: '✓' },
          ],
        },
        {
          title: 'Tambahan · Selasa, 14 Okt',
          note: 'Persiapan Pameran Taman (cuaca panas).',
          mark: true,
          rows: [
            { time: '11.00', label: 'Siram tambahan 1', value: '180 L' },
            { time: '14.00', label: 'Siram tambahan 2', value: '180 L' },
          ],
        },
      ],
      note: 'Jumlah liter dicatat dari meteran kecil di keran taman.',
      sign: 'Pembina: Bu Ratna',
    },
  },

  checklist: {
    id: 'checklist',
    title: 'Daftar Periksa Pemeliharaan',
    short: 'Daftar Periksa',
    icon: 'clipboard',
    location: 'maintenance',
    source: 'Ruang Pemeliharaan · papan klip di dinding',
    summary: 'Hasil pemeriksaan sistem air, termasuk uji malam untuk mencari kebocoran.',
    facts: [
      { label: 'Uji malam (22.00–05.00)', value: 'Semua keran ditutup, angka meter tidak bergerak' },
      { label: 'Uji meter', value: 'Bergerak saat keran dibuka, berhenti saat ditutup' },
    ],
    doc: {
      kind: 'checklist',
      heading: 'Daftar Periksa Pemeliharaan',
      sub: 'Selasa malam – Rabu pagi',
      items: [
        { text: 'Pipa utama di bawah taman', result: 'Tanah di atasnya kering, tidak ada genangan' },
        { text: 'Keran toilet & wastafel', result: 'Tertutup rapat, tidak menetes' },
        { text: 'Tandon air di atap', result: 'Pelampung normal, tidak meluap' },
        { text: 'Uji malam: semua keran ditutup 22.00–05.00', result: 'Angka meter TIDAK bergerak' },
        { text: 'Uji meter: keran dibuka lalu ditutup', result: 'Meter bergerak, lalu berhenti' },
      ],
      note: 'Semua normal… tapi pipa di bawah tanah kan tidak kelihatan!',
      sign: 'Darto',
    },
  },

  kesaksian: {
    id: 'kesaksian',
    title: 'Kesaksian Nadia',
    short: 'Kesaksian',
    icon: 'message',
    location: 'hallway',
    source: 'Lorong Akademi · wawancara dengan Nadia',
    summary: 'Pernyataan Nadia, anggota Klub Taman, tentang kegiatan hari Selasa.',
    facts: [
      { label: 'Penyiraman tambahan', value: '2 kali, pukul 11.00 dan 14.00' },
      { label: 'Air per sesi (meteran keran)', value: '180 liter' },
      { label: 'Alasan', value: 'Persiapan Pameran Taman, cuaca panas' },
    ],
    doc: {
      kind: 'statement',
      heading: 'Kesaksian',
      witness: 'Nadia · Kelas VIII-B · Klub Taman',
      sentences: [
        'Hari Selasa, cuaca di akademi panas sekali.',
        'Bu Ratna, pembina Klub Taman, meminta kami menyiram kebun dua kali lagi di luar jadwal biasa supaya tanaman tetap segar untuk Pameran Taman hari Kamis.',
        'Saya dan Bima menyiram pukul 11.00 dan pukul 14.00 memakai selang dari keran taman.',
        'Setiap kali selesai, Bima mencatat angka di meteran keran, yaitu 180 liter per sesi.',
        'Waktu kembali ke kelas, saya melihat lantai lorong basah, tapi ternyata Pak Udin sedang mengepel.',
      ],
      sign: 'Nadia',
    },
  },

  kehadiran: {
    id: 'kehadiran',
    title: 'Rekap Kehadiran & Kegiatan',
    short: 'Rekap Kehadiran',
    icon: 'users',
    location: 'maintenance',
    source: 'Ruang Pemeliharaan · lemari arsip',
    summary: 'Salinan rekap tata usaha: jumlah siswa hadir dan kegiatan sekolah.',
    facts: [
      { label: 'Siswa hadir Senin dan Selasa', value: '312 siswa (sama)' },
      { label: 'Kegiatan Selasa', value: 'Pelajaran biasa, tanpa acara tambahan' },
    ],
    doc: {
      kind: 'table',
      heading: 'Rekap Kehadiran & Kegiatan',
      sub: 'Tata Usaha Akademi',
      columns: ['Hari', 'Siswa hadir', 'Kegiatan'],
      rows: [
        { cells: ['Senin, 13 Okt', '312', 'Pelajaran biasa'] },
        { cells: ['Selasa, 14 Okt', '312', 'Pelajaran biasa'], mark: true },
      ],
      note: 'Tidak ada kerja bakti, kegiatan kolam, atau acara tambahan pekan ini.',
      sign: 'Tata Usaha',
    },
  },

  pengumuman: {
    id: 'pengumuman',
    title: 'Pengumuman Pameran Taman',
    short: 'Pengumuman',
    icon: 'megaphone',
    location: 'hallway',
    source: 'Lorong Akademi · papan mading',
    summary: 'Selebaran tentang Pameran Taman dan perawatan tanaman tambahan.',
    facts: [
      { label: 'Acara', value: 'Pameran Taman, Kamis 16 Okt' },
      { label: 'Instruksi', value: 'Tambah penyiraman hari Selasa karena cuaca panas' },
    ],
    doc: {
      kind: 'notice',
      heading: 'Pameran Taman Akademi',
      lines: [
        'Kamis, 16 Oktober · Halaman Barat',
        'Seluruh warga akademi diundang melihat hasil kebun Klub Taman.',
        'Catatan untuk Klub Taman: karena cuaca panas, tambahkan penyiraman pada hari Selasa agar tanaman tetap segar.',
      ],
      sign: 'Bu Ratna, Pembina Klub Taman',
    },
  },
};

export const EVIDENCE_ORDER_MYS001 = ['laporan', 'meter', 'checklist', 'kehadiran', 'jadwal', 'kesaksian', 'pengumuman'];
