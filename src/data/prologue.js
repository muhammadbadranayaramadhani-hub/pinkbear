// Prolog: pemain menerima undangan, masuk akademi, bertemu Seruni, dan mendapat kasus pertama.

export const PROLOGUE = {
  id: 'prologue',
  chapter: 'Prolog · Undangan',
  bg: 'letter',
  cast: ['seruni'],
  nodes: [
    { bg: 'letter', speaker: 'narrator', text: 'Malam itu hujan baru saja reda. Sebuah amplop ungu terselip di bawah pintu kamarmu.' },
    { speaker: 'narrator', text: 'Tidak ada perangko, tidak ada alamat pengirim. Hanya segel lilin keemasan berbentuk kunci kecil.' },
    {
      type: 'letter',
      title: 'Undangan Rahasia',
      body: [
        'Kepada calon penyelidik,',
        'Akademi Pengetahuan Tersembunyi menyimpan arsip kasus yang belum terpecahkan. Kami membutuhkan seseorang yang teliti, sabar, dan berani bertanya.',
        'Jika kamu bersedia, tuliskan namamu di bawah ini. Datanglah saat lonceng berbunyi tujuh kali.',
      ],
      sign: '— S., Penjaga Arsip',
    },
    { type: 'name' },
    { bg: 'gate', speaker: 'narrator', text: 'Lonceng berbunyi tujuh kali. Gerbang besi akademi terbuka perlahan, seolah sudah menunggumu.' },
    { speaker: 'narrator', text: 'Lentera-lentera biru menyala satu per satu di sepanjang tangga batu, menuntunmu ke dalam.' },
    { bg: 'library', speaker: 'seruni', expr: 'smile', text: 'Selamat datang, {name}. Aku Seruni, Penjaga Arsip akademi ini.' },
    { speaker: 'seruni', expr: 'neutral', text: 'Surat itu tidak dikirim ke sembarang orang. Arsip sendiri yang memilihmu.' },
    {
      type: 'choice',
      prompt: 'Apa yang ingin kamu tanyakan?',
      options: [
        { label: 'Arsip bisa memilih orang?', goto: 'q-arsip' },
        { label: 'Apa sebenarnya tugas Divisi Penyelidik?', goto: 'q-divisi' },
      ],
    },
    { id: 'q-arsip', speaker: 'seruni', expr: 'thinking', text: 'Anggap saja begitu. Arsip ini menyukai orang yang lebih senang bertanya daripada menebak.' },
    { speaker: 'seruni', expr: 'smile', text: 'Dan kamu menjawab undangannya. Itu sudah pertanda baik.', goto: 'merge-1' },
    { id: 'q-divisi', speaker: 'seruni', expr: 'serious', text: 'Kami memecahkan kejadian aneh di akademi. Bukan dengan sihir, tapi dengan pengetahuan.' },
    { id: 'merge-1', speaker: 'seruni', expr: 'neutral', text: 'Lihat rak-rak ini. Setiap map berisi satu misteri yang belum terpecahkan.' },
    { speaker: 'seruni', expr: 'serious', text: 'Di sini, matematika, sains, dan bahasa adalah alat penyelidik. Angka bisa bersaksi. Kalimat bisa menyembunyikan petunjuk.' },
    { speaker: 'seruni', expr: 'neutral', text: 'Setiap bukti yang kamu temukan tersimpan di Jurnal Detektif. Nanti, hubungkan bukti-bukti itu di Papan Bukti.' },
    { speaker: 'seruni', expr: 'smile', text: 'Satu pesan lagi: jangan terburu-buru menyimpulkan. Biarkan bukti berbicara lebih dulu.' },
    { speaker: 'narrator', text: 'Sebuah map tua bergeser sendiri dari rak dan jatuh tepat di depanmu. Labelnya bertuliskan MYS-001.' },
    { speaker: 'seruni', expr: 'surprised', text: 'Oh! Rupanya arsip sudah memilihkan kasus pertamamu.' },
  ],
  onEnd: { unlockCase: 'MYS-001', go: 'archive' },
};
