// MYS-001 · Tetes Terakhir (The Last Drop)
// Seluruh konten kasus ada di sini; logika permainan ada di folder engines/.
//
// Data angka inti (jangan diubah tanpa memeriksa seluruh berkas):
//   hari biasa 1.200 L · Selasa 1.560 L · selisih 360 L
//   2 sesi tambahan × 180 L = 360 L

import { EVIDENCE_MYS001, EVIDENCE_ORDER_MYS001 } from '../evidence.js';

const scenes = {
  c1_briefing: {
    id: 'c1_briefing',
    chapter: 'Babak 1 · Pengarahan',
    bg: 'library',
    cast: ['seruni'],
    nodes: [
      { speaker: 'seruni', expr: 'serious', text: 'Kasus MYS-001: Tetes Terakhir. Laporannya masuk tadi pagi dari Pak Darto, petugas pemeliharaan.' },
      { speaker: 'seruni', expr: 'neutral', text: 'Pemakaian air akademi hari Selasa naik jauh dari biasanya. Padahal jumlah siswa dan kegiatan sekolah tidak berubah.' },
      { speaker: 'seruni', expr: 'thinking', text: 'Pak Darto yakin ada pipa bocor yang tersembunyi. Kalau benar, air bersih terbuang sia-sia setiap hari.' },
      {
        type: 'choice',
        prompt: 'Bagaimana kamu memulai penyelidikan?',
        options: [
          { label: 'Pasti ada pipa bocor. Ayo cari pipanya!', goto: 'b-hasty', flag: 'hastyStart' },
          { label: 'Aku mau lihat datanya dulu sebelum menduga.', goto: 'b-data', flag: 'carefulStart' },
        ],
      },
      { id: 'b-hasty', speaker: 'seruni', expr: 'serious', text: 'Mungkin saja. Tapi itu baru dugaan, namanya hipotesis. Hipotesis harus diuji dengan bukti, bukan langsung dipercaya.', goto: 'b-merge' },
      { id: 'b-data', speaker: 'seruni', expr: 'smile', text: 'Bagus, itu cara berpikir penyelidik. Dugaan yang belum diuji namanya hipotesis, dan kita akan mengujinya.' },
      { id: 'b-merge', speaker: 'seruni', expr: 'neutral', text: 'Mulailah dari Ruang Pemeliharaan. Pak Darto menyimpan semua catatan air di sana.' },
      { speaker: 'seruni', expr: 'smile', text: 'Kalau bingung, buka daftar Tujuan. Aku akan menyusul nanti.' },
    ],
    onEnd: { go: 'scene', scene: 'c1_darto_intro' },
  },

  c1_darto_intro: {
    id: 'c1_darto_intro',
    chapter: 'Babak 1 · Pengarahan',
    bg: 'maintenance',
    cast: ['darto'],
    nodes: [
      { speaker: 'narrator', text: 'Ruang Pemeliharaan berbau besi dan oli. Pipa-pipa merambat di dinding seperti akar pohon tua.' },
      { speaker: 'darto', expr: 'worried', text: 'Oh, kamu penyelidik dari arsip itu, ya? Syukurlah. Saya sudah pusing dua hari ini.' },
      {
        type: 'choice',
        prompt: 'Tanyakan sesuatu kepada Pak Darto.',
        options: [
          { label: 'Sejak kapan Bapak sadar ada masalah?', goto: 'd-when' },
          { label: 'Kenapa Bapak yakin ada kebocoran?', goto: 'd-why' },
        ],
      },
      { id: 'd-when', speaker: 'darto', expr: 'thinking', text: 'Rabu pagi, waktu saya membaca meter. Angkanya melonjak dibanding hari-hari sebelumnya.', goto: 'd-merge' },
      { id: 'd-why', speaker: 'darto', expr: 'serious', text: 'Siswanya sama, kegiatannya sama. Kalau pemakaian naik, ke mana lagi airnya kalau bukan bocor?' },
      { id: 'd-merge', speaker: 'darto', expr: 'neutral', text: 'Semua catatan ada di meja saya. Meter air utama juga terpasang di dinding itu.' },
      { speaker: 'darto', expr: 'worried', text: 'Tolong dicek, ya. Kalau memang bocor, saya harus segera menggali.' },
    ],
    onEnd: { flags: ['briefed'], go: 'investigate', location: 'maintenance' },
  },

  c1_after_m1: {
    id: 'c1_after_m1',
    chapter: 'Babak 2 · Data',
    bg: 'maintenance',
    cast: ['seruni', 'darto'],
    nodes: [
      { speaker: 'darto', expr: 'surprised', text: 'Tiga ratus enam puluh liter dalam sehari? Banyak sekali!' },
      { speaker: 'darto', expr: 'serious', text: 'Sudah jelas. Air sebanyak itu pasti merembes dari pipa bocor.' },
      { speaker: 'narrator', text: 'Langkah ringan terdengar dari pintu. Seruni masuk sambil membawa lentera biru.' },
      {
        type: 'choice',
        prompt: 'Bagaimana tanggapanmu?',
        options: [
          { label: 'Bisa jadi, tapi kita belum punya bukti kebocoran.', goto: 'a-cautious', flag: 'cautious' },
          { label: 'Atau ada yang memakai air lebih banyak dari biasanya.', goto: 'a-usage' },
        ],
      },
      { id: 'a-cautious', speaker: 'seruni', expr: 'smile', text: 'Tepat. Angka 360 itu fakta. Penyebabnya masih harus kita buktikan.', goto: 'a-merge' },
      { id: 'a-usage', speaker: 'seruni', expr: 'thinking', text: 'Kemungkinan yang menarik. Pemakaian tambahan juga bisa menjelaskan angka itu, asal ada buktinya.' },
      { id: 'a-merge', speaker: 'seruni', expr: 'neutral', text: 'Sekarang kita tahu ada 360 liter yang perlu dijelaskan. Air sebanyak itu pasti meninggalkan jejak.' },
      { speaker: 'seruni', expr: 'serious', text: 'Taman Akademi dan Lorong Akademi sudah terbuka. Ikuti ke mana airnya pergi.' },
    ],
    onEnd: { unlockLocations: ['garden', 'hallway'], go: 'investigate', location: 'garden' },
  },

  c1_after_m2: {
    id: 'c1_after_m2',
    chapter: 'Babak 3 · Jejak Air',
    bg: 'garden',
    cast: ['seruni'],
    nodes: [
      { speaker: 'seruni', expr: 'surprised', text: '2 × 180 = 360 liter. Sama persis dengan selisih di laporan harian.' },
      { speaker: 'seruni', expr: 'thinking', text: 'Kebetulan? Atau inilah jawaban yang kita cari?' },
      {
        type: 'choice',
        prompt: 'Apa pendapatmu?',
        options: [
          { label: 'Bukan kebetulan. Penyiraman tambahan penyebabnya!', goto: 'w-sure' },
          { label: 'Angkanya cocok, tapi kemungkinan bocor juga harus dicek.', goto: 'w-check', flag: 'checkedAlternatives' },
        ],
      },
      { id: 'w-sure', speaker: 'seruni', expr: 'serious', text: 'Bukti ini kuat. Tapi Pak Darto masih yakin ada kebocoran. Kita juga harus bisa menunjukkan bahwa kebocoran tidak terjadi.', goto: 'w-merge' },
      { id: 'w-check', speaker: 'seruni', expr: 'smile', text: 'Pemikiran yang cermat. Penjelasan yang kuat harus bisa menolak kemungkinan lain.' },
      { id: 'w-merge', speaker: 'seruni', expr: 'neutral', text: 'Kumpulkan kesaksian, periksa catatan pemeliharaan, lalu hubungkan semuanya di Papan Bukti.' },
    ],
    onEnd: { go: 'investigate' },
  },

  c1_nadia: {
    id: 'c1_nadia',
    chapter: 'Babak 4 · Saksi',
    bg: 'hallway',
    cast: ['nadia'],
    nodes: [
      { speaker: 'nadia', expr: 'surprised', text: 'Eh, kamu penyelidik baru yang dibicarakan semua orang? Aku Nadia, dari Klub Taman.' },
      {
        type: 'choice',
        prompt: 'Mulai wawancara.',
        options: [
          { label: 'Kamu ke taman hari Selasa?', goto: 'n-taman' },
          { label: 'Kamu tahu soal pemakaian air yang naik?', goto: 'n-air' },
        ],
      },
      { id: 'n-taman', speaker: 'nadia', expr: 'smile', text: 'Iya! Selasa kami sibuk sekali di taman.', goto: 'n-merge' },
      { id: 'n-air', speaker: 'nadia', expr: 'thinking', text: 'Air naik? Hmm… jangan-jangan ada hubungannya dengan kami, ya?' },
      { id: 'n-merge', speaker: 'nadia', expr: 'neutral', text: 'Selasa panas banget. Bu Ratna minta kami menyiram dua kali lagi, di luar jadwal biasa.' },
      { speaker: 'nadia', expr: 'smile', text: 'Kamis nanti ada Pameran Taman. Tanamannya nggak boleh layu.' },
      {
        type: 'choice',
        prompt: 'Gali informasi lebih dalam.',
        options: [
          { label: 'Jam berapa kalian menyiram?', goto: 'n-jam' },
          { label: 'Berapa banyak air yang kalian pakai?', goto: 'n-liter' },
        ],
      },
      { id: 'n-jam', speaker: 'nadia', expr: 'thinking', text: 'Jam 11 siang dan jam 2 siang. Panasnya pas lagi terik-teriknya.', goto: 'n-merge2' },
      { id: 'n-liter', speaker: 'nadia', expr: 'thinking', text: 'Keran taman punya meteran kecil. Kami selalu mencatat angkanya.' },
      { id: 'n-merge2', speaker: 'nadia', expr: 'neutral', text: 'Setiap selesai, Bima mencatat angka di meteran keran: 180 liter tiap sesi.' },
      { speaker: 'nadia', expr: 'worried', text: 'Waduh… jadi kami yang bikin pemakaian air naik? Kami nggak bermaksud boros…' },
      {
        type: 'choice',
        prompt: 'Tanggapi Nadia.',
        options: [
          { label: 'Belum tentu. Aku masih mengumpulkan bukti.', goto: 'n-calm1' },
          { label: 'Tenang, menyiram tanaman bukan kesalahan.', goto: 'n-calm2' },
        ],
      },
      { id: 'n-calm1', speaker: 'nadia', expr: 'smile', text: 'Oke. Aku senang kalau semuanya diperiksa dulu baru disimpulkan.', goto: 'n-end' },
      { id: 'n-calm2', speaker: 'nadia', expr: 'happy', text: 'Makasih! Tanaman-tanaman itu sudah kami rawat sejak awal semester.' },
      { id: 'n-end', speaker: 'nadia', expr: 'neutral', text: 'Biar jelas, aku tuliskan kesaksianku, ya.' },
    ],
    onEnd: { collect: ['kesaksian'], flags: ['metNadia'], go: 'investigate', location: 'hallway' },
  },

  c1_darto_hall: {
    id: 'c1_darto_hall',
    chapter: 'Babak 4 · Saksi',
    bg: 'hallway',
    cast: ['darto'],
    nodes: [
      { speaker: 'darto', expr: 'worried', text: 'Saya belum bisa tidur nyenyak. Kelebihan 360 liter itu bukan sedikit.' },
      { speaker: 'darto', expr: 'neutral', text: 'Selasa malam saya tutup semua keran, dari jam 10 malam sampai jam 5 pagi.' },
      {
        type: 'choice',
        prompt: 'Tanyakan tentang uji itu.',
        options: [
          { label: 'Untuk apa Bapak menutup semua keran?', goto: 'h-why' },
          { label: 'Lalu, angka meternya bagaimana?', goto: 'h-result' },
        ],
      },
      { id: 'h-why', speaker: 'darto', expr: 'serious', text: 'Itu cara mengecek bocor. Kalau semua keran tertutup tapi meter tetap berputar, berarti ada air yang lari lewat pipa bocor.' },
      { id: 'h-result', speaker: 'darto', expr: 'thinking', text: 'Angkanya diam. Tidak bergerak sedikit pun sampai pagi.' },
      { speaker: 'darto', expr: 'neutral', text: 'Hasilnya sudah saya tulis di daftar periksa, di papan klip Ruang Pemeliharaan.' },
      { speaker: 'darto', expr: 'worried', text: 'Tapi pipa di bawah tanah kan tidak kelihatan. Saya tetap khawatir.' },
      { speaker: 'narrator', text: 'Kalau meter diam saat semua keran tertutup… apa artinya bagi dugaan Pak Darto?' },
    ],
    onEnd: { flags: ['talkedDarto'], go: 'investigate', location: 'hallway' },
  },

  c1_epilogue: {
    id: 'c1_epilogue',
    chapter: 'Babak 6 · Kesimpulan',
    bg: 'garden',
    cast: ['darto', 'nadia'],
    nodes: [
      { speaker: 'darto', expr: 'happy', text: 'Jadi bukan bocor… Syukurlah! Saya hampir saja menggali taman ini.' },
      { speaker: 'nadia', expr: 'worried', text: 'Maaf ya, Pak. Kami nggak tahu penyiraman tambahan membuat pemakaian air naik sebanyak itu.' },
      { speaker: 'darto', expr: 'smile', text: 'Tidak apa-apa, tanaman juga butuh air. Lain kali kita siram pagi atau sore saja, biar airnya tidak cepat menguap.' },
      { speaker: 'nadia', expr: 'happy', text: 'Kami juga mau menampung air hujan untuk menyiram! Nanti aku usulkan ke Bu Ratna.' },
      { bg: 'library', cast: ['seruni'], speaker: 'seruni', expr: 'smile', text: 'Kasus ditutup, {name}. Kamu tidak hanya menemukan jawabannya. Kamu membuktikannya.' },
      { speaker: 'seruni', expr: 'serious', text: 'Ingat hari ini: dugaan pertama terdengar meyakinkan, tapi angkalah yang menceritakan kebenaran.' },
      { speaker: 'seruni', expr: 'smile', text: 'Arsip akan menyimpan laporanmu. Masih banyak map lain yang menunggu.' },
    ],
    onEnd: { go: 'result' },
  },
};

const locations = {
  maintenance: {
    id: 'maintenance',
    name: 'Ruang Pemeliharaan',
    art: 'maintenance',
    blurb: 'Pipa-pipa merambat di dinding. Meja Pak Darto penuh catatan.',
  },
  garden: {
    id: 'garden',
    name: 'Taman Akademi',
    art: 'garden',
    blurb: 'Bedeng bunga untuk Pameran Taman. Tanahnya masih lembap.',
    lockedHint: 'Terbuka setelah kamu menghitung kenaikan pemakaian air.',
  },
  hallway: {
    id: 'hallway',
    name: 'Lorong Akademi',
    art: 'hallway',
    blurb: 'Lorong berlengkung dengan lentera biru. Siswa lalu-lalang di sini.',
    lockedHint: 'Terbuka setelah kamu menghitung kenaikan pemakaian air.',
  },
};

// x, y = posisi dalam persen pada ilustrasi 16:10
const hotspots = [
  // --- Ruang Pemeliharaan ---
  {
    id: 'meja', location: 'maintenance', x: 32, y: 60, kind: 'evidence', evidence: 'laporan', icon: 'fileText',
    name: 'Meja Pak Darto',
    description: 'Tumpukan kertas, cangkir kopi yang sudah dingin, dan sebuah map biru berlabel "AIR · OKTOBER".',
    action: { challenge: 'm1', label: 'Analisis: hitung kenaikannya' },
  },
  {
    id: 'meteran', location: 'maintenance', x: 74, y: 37, kind: 'evidence', evidence: 'meter', icon: 'gauge',
    name: 'Meter Air Utama',
    description: 'Jarumnya berdetak pelan setiap kali ada keran yang terbuka. Di sebelahnya tergantung kartu bacaan harian.',
  },
  {
    id: 'papan-klip', location: 'maintenance', x: 55, y: 36, kind: 'evidence', evidence: 'checklist', icon: 'clipboard',
    name: 'Papan Klip di Dinding',
    description: 'Daftar periksa yang diisi Pak Darto. Tulisannya rapi, tapi ada catatan kecil yang terdengar ragu di bagian bawah.',
  },
  {
    id: 'lemari', location: 'maintenance', x: 89, y: 62, kind: 'evidence', evidence: 'kehadiran', icon: 'archive',
    name: 'Lemari Arsip',
    description: 'Laci kedua sedikit terbuka. Di dalamnya ada salinan rekap dari tata usaha.',
  },
  {
    id: 'pipa-tua', location: 'maintenance', x: 8, y: 38, kind: 'info', icon: 'wrench',
    name: 'Pipa Tua Berkarat',
    description: 'Karatnya tebal dan warnanya mencurigakan. Pipa seperti ini sering bocor.',
    details: [
      'Saat kamu sentuh, permukaannya kering dan berdebu.',
      'Ada label kecil: "TIDAK DIPAKAI SEJAK RENOVASI 2019. ALIRAN SUDAH DIPUTUS."',
    ],
    verdict: 'Terlihat mencurigakan, tapi bukan petunjuk. Pipa ini tidak dialiri air.',
  },
  {
    id: 'perkakas', location: 'maintenance', x: 63, y: 85, kind: 'info', icon: 'toolbox',
    name: 'Kotak Perkakas',
    description: 'Kunci pipa, selotip pipa, dan sekop kecil sudah disiapkan di lantai.',
    details: ['Sepertinya Pak Darto benar-benar siap menggali taman untuk mencari pipa bocor.'],
    verdict: 'Informasi latar: menunjukkan seberapa yakin Pak Darto pada dugaannya.',
  },

  // --- Taman Akademi ---
  {
    id: 'alat-siram', location: 'garden', x: 13, y: 63, kind: 'info', icon: 'droplet',
    name: 'Rak Alat Penyiraman',
    description: 'Dua gembor dan sebuah ujung semprot (nozzle) tergantung di rak kayu.',
    details: [
      'Ujung semprotnya masih meneteskan sisa air. Alat ini baru saja dipakai.',
      'Ada stiker: "Milik Klub Taman. Kembalikan setelah dipakai."',
    ],
    verdict: 'Petunjuk kecil: Klub Taman aktif menyiram akhir-akhir ini.',
  },
  {
    id: 'papan-jadwal', location: 'garden', x: 33, y: 42, kind: 'evidence', evidence: 'jadwal', icon: 'fileText',
    name: 'Papan Jadwal Penyiraman',
    description: 'Papan kayu berkaca di dekat jalan setapak. Selembar jadwal ditempel dengan paku payung emas.',
    action: { challenge: 'm2', label: 'Analisis: hitung air sesi tambahan' },
  },
  {
    id: 'air-mancur', location: 'garden', x: 52, y: 55, kind: 'info', icon: 'droplet',
    name: 'Air Mancur Batu',
    description: 'Airnya mengalir terus, siang dan malam. Apakah ini yang menghabiskan air?',
    details: [
      'Di balik air mancur ada pompa kecil. Air dari kolam disedot lalu dialirkan kembali ke kolam yang sama.',
      'Tulisan di kotak pompa: "Sistem sirkulasi. Isi ulang sebulan sekali." Pengisian terakhir dua minggu lalu.',
    ],
    verdict: 'Bukan penyebab. Air mancur memakai air yang sama berulang kali dan tidak diisi pada hari Selasa.',
  },
  {
    id: 'tanaman', location: 'garden', x: 62, y: 84, kind: 'info', icon: 'sprout',
    name: 'Bedeng Tanaman Pameran',
    description: 'Bunga kertas, kemangi, dan cabai rawit tumbuh segar. Papan kecil bertuliskan "Untuk Pameran Taman, jangan dipetik!"',
    details: [
      'Tanahnya lembap sampai ke dalam, tanda baru disiram cukup banyak.',
      'Matahari siang di sini sangat terik. Tidak ada peneduh di atas bedeng.',
    ],
    action: { challenge: 'ipa', label: 'Analisis IPA: air dan tanaman', lockedText: 'Temukan dulu jadwal penyiraman untuk menganalisis bedeng ini.' },
  },
  {
    id: 'keran', location: 'garden', x: 77, y: 62, kind: 'info', icon: 'droplet',
    name: 'Keran & Selang Taman',
    description: 'Selang hijau tergulung rapi di samping keran.',
    details: [
      'Kamu memeriksa selang dari ujung ke ujung. Tidak ada lubang atau sambungan yang merembes.',
      'Di keran terpasang meteran kecil. Klub Taman memakainya untuk mencatat berapa liter air yang dipakai setiap sesi.',
    ],
    verdict: 'Selang dan keran dalam keadaan baik. Meteran kecil ini membuat catatan liter di jadwal bisa dipercaya.',
  },
  {
    id: 'catatan-darto', location: 'garden', x: 91, y: 46, kind: 'info', icon: 'pencil',
    name: 'Catatan di Pintu Gudang',
    description: 'Selembar kertas ditempel dengan selotip. Tulisannya tergesa-gesa.',
    doc: { kind: 'note', lines: ['Air naik lagi?!', 'Pasti pipa bawah tanah bocor.', 'Besok gali dekat bedeng mawar!'], sign: '— D.' },
    verdict: 'Ini dugaan Pak Darto, bukan bukti. Hipotesis harus diuji dulu.',
  },

  // --- Lorong Akademi ---
  {
    id: 'nadia', location: 'hallway', x: 35, y: 62, kind: 'interview', scene: 'c1_nadia', evidence: 'kesaksian', icon: 'message',
    name: 'Nadia · Klub Taman',
    description: 'Seorang siswi berkerudung merah muda memeluk buku catatan bergambar daun.',
    doneText: 'Kamu sudah mewawancarai Nadia. Kesaksiannya tersimpan di Jurnal.',
    action: { challenge: 'bi', label: 'Analisis: baca kesaksian Nadia' },
  },
  {
    id: 'darto', location: 'hallway', x: 71, y: 62, kind: 'interview', scene: 'c1_darto_hall', icon: 'message',
    name: 'Pak Darto',
    description: 'Pak Darto mondar-mandir sambil menatap langit-langit, seolah bisa melihat pipa di baliknya.',
    doneText: 'Pak Darto bercerita tentang uji malam. Hasilnya tercatat di daftar periksa Ruang Pemeliharaan.',
  },
  {
    id: 'mading', location: 'hallway', x: 20, y: 40, kind: 'evidence', evidence: 'pengumuman', icon: 'megaphone',
    name: 'Papan Mading',
    description: 'Papan pengumuman penuh selebaran: jadwal ujian, lomba puisi, dan satu kertas hijau yang mencolok.',
  },
  {
    id: 'lantai', location: 'hallway', x: 55, y: 83, kind: 'info', icon: 'alert',
    name: 'Tanda Lantai Basah',
    description: 'Lantai dekat tangga mengilap basah. Apakah ini rembesan dari pipa?',
    details: [
      'Tercium wangi karbol. Ember dan tongkat pel bersandar di dinding.',
      'Bekas basahnya membentuk pola sapuan, bukan genangan yang terus bertambah.',
    ],
    verdict: 'Bukan kebocoran. Lantai basah karena baru dipel.',
  },
  {
    id: 'jendela', location: 'hallway', x: 87, y: 34, kind: 'info', icon: 'window',
    name: 'Jendela Lorong',
    description: 'Cahaya matahari masuk miring lewat kaca patri.',
    details: [
      'Penjaga sekolah bilang pekan ini cuacanya panas dan kering. Hujan belum turun sejak hari Minggu.',
      'Daun-daun di halaman tampak layu saat siang.',
    ],
    verdict: 'Informasi latar: cuaca panas membuat tanaman butuh lebih banyak air.',
  },
];

const challenges = {
  m1: {
    id: 'm1',
    subject: 'Matematika',
    title: 'Menghitung Selisih',
    evidence: 'laporan',
    requires: { evidence: ['laporan'] },
    kp: 30,
    intro: 'Pak Darto bilang pemakaian air "melonjak". Seberapa besar lonjakannya? Angka pastinya akan menjadi patokan semua dugaan kita.',
    parts: [
      {
        type: 'number',
        unit: 'liter',
        prompt: 'Berapa liter lebih banyak pemakaian air pada hari Selasa dibandingkan hari biasa?',
        answer: 360,
        hints: [
          'Kalimat "lebih banyak … dibandingkan" berarti kita mencari selisih. Selisih didapat dengan pengurangan.',
          'Lihat laporan: hari biasa 1.200 liter, hari Selasa 1.560 liter.',
          'Kurangkan nilai yang lebih besar dengan yang lebih kecil: 1.560 − 1.200 = …',
        ],
        mistakes: [
          { value: 2760, text: 'Kamu menjumlahkan kedua angka. Kita tidak mencari total, tapi berapa banyak lebihnya.' },
          { value: 1560, text: '1.560 liter adalah pemakaian total hari Selasa, bukan kelebihannya.' },
          { value: 1200, text: '1.200 liter adalah pemakaian hari biasa. Yang ditanyakan adalah kelebihannya.' },
          { value: -360, text: 'Arahnya terbalik. Selisih ditulis positif: nilai besar dikurangi nilai kecil.' },
          { value: 460, text: 'Hampir! Periksa lagi pengurangan pada angka ratusan.' },
          { value: 260, text: 'Hampir! Periksa lagi pengurangan pada angka ratusan.' },
        ],
        wrong: 'Belum tepat. Bandingkan dua angka di laporan, lalu cari berapa banyak lebihnya.',
        explain: '1.560 − 1.200 = 360 liter.',
      },
    ],
    concept: {
      title: 'Selisih = nilai besar − nilai kecil',
      body: '1.560 − 1.200 = 360. Pemakaian hari Selasa 360 liter lebih banyak dari hari biasa. Selisih memberi tahu seberapa jauh dua nilai berbeda.',
    },
    caseLink: 'Sekarang misterinya punya ukuran: ada 360 liter air yang harus dijelaskan. Penjelasan apa pun yang diajukan nanti harus cocok dengan angka ini.',
    onSolved: { scene: 'c1_after_m1' },
  },

  m2: {
    id: 'm2',
    subject: 'Matematika',
    title: 'Menafsirkan Jadwal',
    evidence: 'jadwal',
    requires: { evidence: ['jadwal'], challenges: ['m1'] },
    kp: 30,
    intro: 'Jadwal mencatat sesi penyiraman tambahan pada hari Selasa. Berapa banyak air yang terpakai untuk sesi-sesi itu?',
    parts: [
      {
        type: 'number',
        unit: 'liter',
        prompt: 'Setiap sesi tambahan memakai 180 liter, dan ada 2 sesi tambahan. Berapa liter total air untuk penyiraman tambahan?',
        answer: 360,
        hints: [
          'Ada beberapa kelompok yang sama besar. Operasi apa yang cocok untuk "2 kali 180 liter"?',
          'Perkalian adalah penjumlahan berulang: 2 × 180 = 180 + 180.',
          'Hitung 180 + 180 = …',
        ],
        mistakes: [
          { value: 182, text: 'Kamu menjumlahkan banyak sesi (2) dengan liter per sesi (180). Keduanya berbeda satuan, jadi tidak bisa dijumlahkan.' },
          { value: 90, text: 'Kamu membagi 180 dengan 2. Padahal setiap sesi memakai 180 liter, jadi totalnya lebih besar, bukan lebih kecil.' },
          { value: 180, text: 'Itu baru air untuk satu sesi. Ada dua sesi tambahan.' },
          { value: 540, text: 'Kamu menghitung tiga sesi. Hanya sesi tambahan yang dihitung, dan jumlahnya dua.' },
          { value: 720, text: 'Kamu menghitung empat sesi. Sesi rutin sudah termasuk pemakaian normal. Hitung sesi tambahan saja.' },
        ],
        wrong: 'Belum tepat. Lihat lagi jadwalnya: berapa sesi tambahan, dan berapa liter tiap sesi?',
        explain: '2 × 180 = 360 liter.',
      },
    ],
    concept: {
      title: 'Perkalian = penjumlahan berulang',
      body: '2 sesi × 180 liter = 180 + 180 = 360 liter. Perkalian dipakai saat ada beberapa kelompok yang sama besar.',
    },
    caseLink: 'Total penyiraman tambahan 360 liter, sama persis dengan selisih di laporan harian (1.560 − 1.200 = 360). Dua sumber berbeda kini menunjukkan angka yang sama.',
    onSolved: { scene: 'c1_after_m2' },
  },

  bi: {
    id: 'bi',
    subject: 'Bahasa Indonesia',
    title: 'Membaca Kesaksian',
    evidence: 'kesaksian',
    requires: { evidence: ['kesaksian'] },
    kp: 30,
    intro: 'Kesaksian adalah teks informasi. Penyelidik harus bisa memisahkan informasi utama, fakta penting, dan informasi yang tidak berhubungan.',
    parts: [
      {
        type: 'choice',
        prompt: 'Apa informasi utama (ide pokok) dari kesaksian Nadia?',
        options: [
          { id: 'a', text: 'Cuaca hari Selasa sangat panas.', feedback: 'Cuaca adalah informasi pendukung yang menjelaskan alasan. Ide pokok adalah hal utama yang dibicarakan sebagian besar kalimat.' },
          { id: 'b', text: 'Klub Taman melakukan dua kali penyiraman tambahan pada hari Selasa.', correct: true },
          { id: 'c', text: 'Lantai lorong basah karena sedang dipel.', feedback: 'Kalimat ini hanya cerita sampingan di bagian akhir, bukan hal utama yang diceritakan.' },
          { id: 'd', text: 'Bima mencatat angka di meteran keran.', feedback: 'Ini rincian (detail), bukan ide pokok. Rincian mendukung ide pokok.' },
        ],
        hints: [
          'Ide pokok adalah hal yang dibicarakan oleh sebagian besar kalimat.',
          'Kalimat (2), (3), dan (4) membicarakan hal yang sama. Apa itu?',
        ],
        explain: 'Kalimat (2) sampai (4) membahas penyiraman tambahan. Kalimat lainnya hanya pendukung atau sampingan.',
      },
      {
        type: 'choice',
        prompt: 'Fakta mana yang paling berguna untuk menghitung jumlah air yang terpakai?',
        options: [
          { id: 'a', text: 'Penyiraman dilakukan untuk persiapan Pameran Taman.', feedback: 'Ini alasan penyiraman, bukan data jumlah air.' },
          { id: 'b', text: 'Nadia dan Bima yang menyiram kebun.', feedback: 'Siapa yang menyiram tidak membantu menghitung jumlah air.' },
          { id: 'c', text: 'Setiap sesi tercatat 180 liter di meteran keran.', correct: true },
          { id: 'd', text: 'Bu Ratna adalah pembina Klub Taman.', feedback: 'Informasi ini tidak berisi angka atau jumlah air.' },
        ],
        hints: [
          'Untuk menghitung, kita butuh angka yang berhubungan dengan air.',
          'Cari kalimat yang menyebut satuan liter.',
        ],
        explain: 'Kalimat (4) memberi angka 180 liter per sesi. Bersama keterangan "dua kali", kita bisa menghitung totalnya.',
      },
      {
        type: 'choice',
        prompt: 'Pak Darto punya hipotesis: "Ada pipa bocor di akademi." Bagaimana kalimat (5) tentang lantai lorong yang basah?',
        options: [
          { id: 'a', text: 'Mendukung hipotesis, karena lantai basah berarti ada air bocor.', feedback: 'Hati-hati! Kalimat (5) sendiri menjelaskan penyebab lantai basah: sedang dipel. Air pel bukan air bocor.' },
          { id: 'b', text: 'Tidak mendukung hipotesis, karena lantai basah disebabkan oleh kegiatan mengepel.', correct: true },
          { id: 'c', text: 'Membuktikan bahwa Nadia berbohong.', feedback: 'Tidak ada informasi bahwa Nadia berbohong. Penyelidik tidak menuduh tanpa bukti.' },
          { id: 'd', text: 'Membuktikan bahwa meteran air rusak.', feedback: 'Kalimat (5) sama sekali tidak membicarakan meteran.' },
        ],
        hints: [
          'Baca kalimat (5) sampai selesai. Apakah Nadia menjelaskan mengapa lantainya basah?',
          'Informasi yang tampak mencurigakan belum tentu mendukung hipotesis. Periksa penyebabnya.',
        ],
        explain: 'Lantai basah punya penyebab yang jelas, yaitu dipel. Informasi ini tidak relevan dengan hipotesis kebocoran.',
      },
    ],
    concept: {
      title: 'Ide pokok, fakta, dan relevansi',
      body: 'Ide pokok adalah gagasan utama sebuah teks. Fakta pendukung memberi rincian. Penyelidik juga menilai relevansi: apakah sebuah informasi benar-benar mendukung atau menolak hipotesis.',
    },
    caseLink: 'Kesaksian Nadia menjelaskan siapa, kapan, mengapa, dan berapa banyak air dipakai untuk penyiraman tambahan. Lantai basah di lorong ternyata bukan tanda kebocoran.',
  },

  ipa: {
    id: 'ipa',
    subject: 'IPA',
    title: 'Air, Tanaman, dan Matahari',
    evidence: 'jadwal',
    requires: { evidence: ['jadwal'] },
    kp: 30,
    intro: 'Tanah di bedeng masih lembap, padahal matahari bersinar terik. Sebelum memberi rekomendasi untuk akademi, pahami dulu ke mana air siraman pergi.',
    parts: [
      {
        type: 'choice',
        prompt: 'Mengapa sekolah perlu memakai air secara bertanggung jawab?',
        options: [
          { id: 'a', text: 'Air di bumi akan habis dalam satu tahun.', feedback: 'Berlebihan. Air di bumi tidak habis dalam setahun, tetapi air bersih yang siap pakai memang terbatas.' },
          { id: 'b', text: 'Air bersih siap pakai terbatas, dan butuh energi serta biaya untuk diolah dan dialirkan.', correct: true },
          { id: 'c', text: 'Air yang sudah dipakai tidak bisa kembali ke alam.', feedback: 'Air tetap berputar dalam siklus air. Masalahnya, air bersih siap pakai terbatas dan pengolahannya butuh energi.' },
          { id: 'd', text: 'Hanya sekolah yang memakai air bersih.', feedback: 'Rumah, pertanian, dan industri juga memakai air. Karena banyak yang membutuhkan, kita perlu berhemat.' },
        ],
        hints: [
          'Pikirkan: dari mana air keran berasal sebelum sampai di sekolah?',
          'Air bersih harus disaring, diolah, lalu dialirkan dengan pompa.',
        ],
        explain: 'Air bersih perlu diolah dan dialirkan memakai energi. Setiap liter yang terbuang ikut membuang energi dan biaya itu.',
      },
      {
        type: 'choice',
        prompt: 'Penyiraman tambahan dilakukan pukul 11.00 dan 14.00 saat matahari terik. Mengapa menyiram pada jam-jam itu kurang efisien?',
        options: [
          { id: 'a', text: 'Tanaman tidak membutuhkan air pada siang hari.', feedback: 'Tanaman tetap butuh air sepanjang hari, bahkan lebih banyak saat panas. Masalahnya ada pada air yang hilang.' },
          { id: 'b', text: 'Air keran menjadi beracun jika terkena sinar matahari.', feedback: 'Tidak benar. Air keran tidak menjadi beracun karena sinar matahari.' },
          { id: 'c', text: 'Suhu tinggi membuat lebih banyak air menguap sebelum sempat diserap akar.', correct: true },
          { id: 'd', text: 'Akar tanaman hanya menyerap air pada malam hari.', feedback: 'Akar menyerap air kapan saja selama tanahnya lembap.' },
        ],
        hints: [
          'Apa yang terjadi pada genangan air di halaman saat siang yang panas?',
          'Ingat materi perubahan wujud: zat cair yang berubah menjadi gas karena panas disebut …',
        ],
        explain: 'Saat suhu tinggi, penguapan (evaporasi) berlangsung cepat. Sebagian air siraman berubah menjadi uap sebelum mencapai akar.',
      },
      {
        type: 'multi',
        prompt: 'Pilih SEMUA cara yang tepat untuk menghemat air di sekolah.',
        options: [
          { id: 'a', text: 'Menyiram tanaman pada pagi atau sore hari.', correct: true },
          { id: 'b', text: 'Menampung air hujan untuk menyiram taman.', correct: true },
          { id: 'c', text: 'Menyiram lebih sering supaya tanah tidak pernah kering.', feedback: 'Menyiram terlalu sering memboroskan air dan bisa membuat akar membusuk.' },
          { id: 'd', text: 'Segera melaporkan keran yang menetes kepada petugas.', correct: true },
          { id: 'e', text: 'Membiarkan selang tetap mengalir saat berpindah tempat.', feedback: 'Air terbuang percuma saat selang tidak diarahkan ke tanaman.' },
          { id: 'f', text: 'Memakai ujung semprot (nozzle) agar aliran air terarah.', correct: true },
        ],
        hints: [
          'Ada 4 jawaban yang tepat.',
          'Cara hemat air biasanya mengurangi air yang terbuang, menguap, atau mengalir percuma.',
        ],
        explain: 'Empat cara tepat: menyiram pagi/sore, menampung air hujan, melaporkan keran menetes, dan memakai nozzle.',
      },
    ],
    concept: {
      title: 'Penguapan dan hemat air',
      body: 'Penguapan (evaporasi) adalah perubahan air dari cair menjadi gas. Semakin panas suhunya, semakin cepat air menguap. Menyiram pagi atau sore membuat lebih banyak air sampai ke akar.',
    },
    caseLink: 'Kenaikan air bukan karena kebocoran, tapi waktu penyiramannya kurang tepat. Ini akan menjadi rekomendasimu untuk akademi.',
  },
};

const connections = [
  {
    id: 'c-laporan-jadwal', a: 'laporan', b: 'jadwal', key: true, title: 'Asal 360 liter',
    options: [
      { id: 'x1', text: 'Penyiraman tambahan hanya menjelaskan sebagian kecil kenaikan.', feedback: 'Coba hitung lagi: 2 sesi × 180 liter. Hasilnya dibandingkan dengan selisih 1.560 − 1.200.' },
      { id: 'x2', text: 'Kenaikan 360 liter di laporan sama dengan 2 sesi tambahan × 180 liter di jadwal.', correct: true, feedback: 'Benar! Selisih di laporan (360 L) sama persis dengan total sesi tambahan (2 × 180 = 360 L). Seluruh kenaikan terjelaskan.' },
      { id: 'x3', text: 'Keduanya menunjukkan bahwa taman perlu disiram setiap hari.', feedback: 'Memang benar taman disiram setiap hari, tapi penyiraman rutin sudah termasuk dalam 1.200 liter. Yang menjelaskan kenaikan adalah sesi tambahan.' },
      { id: 'x4', text: 'Jadwal membuktikan bahwa laporan harian salah hitung.', feedback: 'Jadwal tidak membantah laporan. Justru angka di jadwal menjelaskan angka di laporan.' },
    ],
  },
  {
    id: 'c-laporan-meter', a: 'laporan', b: 'meter', title: 'Kenaikan itu nyata',
    options: [
      { id: 'x1', text: 'Meter mencatat lebih banyak dari laporan, jadi meternya rusak.', feedback: 'Hitung dari kartu meter: 26.860 − 25.300. Hasilnya sama dengan laporan, bukan lebih banyak.' },
      { id: 'x2', text: 'Bacaan meter (26.860 − 25.300 = 1.560 L) cocok dengan laporan, jadi kenaikan itu benar-benar terjadi.', correct: true, feedback: 'Tepat. Dua catatan yang dibuat dengan cara berbeda menunjukkan angka yang sama. Kenaikan ini bukan salah catat.' },
      { id: 'x3', text: 'Meter dan laporan sama-sama membuktikan ada kebocoran.', feedback: 'Keduanya hanya menunjukkan berapa banyak air terpakai. Tidak ada yang menunjukkan air itu bocor.' },
    ],
  },
  {
    id: 'c-checklist-meter', a: 'checklist', b: 'meter', title: 'Uji kebocoran',
    options: [
      { id: 'x1', text: 'Meter tidak bergerak di malam hari, berarti meternya rusak.', feedback: 'Daftar periksa juga mencatat uji meter: meter bergerak saat keran dibuka dan berhenti saat ditutup. Meter bekerja normal.' },
      { id: 'x2', text: 'Daftar periksa membuktikan pipa di bawah tanah bocor.', feedback: 'Justru sebaliknya. Periksa hasil uji malam di daftar periksa.' },
      { id: 'x3', text: 'Saat semua keran ditutup semalaman, meter tidak bergerak. Artinya tidak ada air yang bocor diam-diam.', correct: true, feedback: 'Tepat! Jika ada pipa bocor, air tetap mengalir dan meter terus berputar walaupun semua keran tertutup.' },
    ],
  },
  {
    id: 'c-jadwal-kesaksian', a: 'jadwal', b: 'kesaksian', title: 'Saksi menguatkan catatan',
    options: [
      { id: 'x1', text: 'Kesaksian Nadia menguatkan jadwal: sesi pukul 11.00 dan 14.00 benar-benar dilakukan, masing-masing 180 liter.', correct: true, feedback: 'Benar. Catatan tertulis dan keterangan saksi saling cocok, jadi buktinya makin kuat.' },
      { id: 'x2', text: 'Kesaksian Nadia bertentangan dengan jadwal.', feedback: 'Bandingkan jam dan liter di keduanya. Apakah ada yang berbeda?' },
      { id: 'x3', text: 'Nadia menyiram lebih dari dua kali, jadi jadwalnya tidak lengkap.', feedback: 'Nadia menyebut dua kali penyiraman tambahan, sama seperti jadwal.' },
    ],
  },
  {
    id: 'c-kehadiran-laporan', a: 'kehadiran', b: 'laporan', title: 'Bukan karena jumlah siswa',
    options: [
      { id: 'x1', text: 'Siswa yang hadir lebih banyak pada hari Selasa, jadi air naik.', feedback: 'Periksa rekap: Senin dan Selasa sama-sama 312 siswa.' },
      { id: 'x2', text: 'Jumlah siswa sama, jadi kehadiran tidak bisa menjelaskan kenaikan 360 liter.', correct: true, feedback: 'Tepat. Kalau penyebabnya tidak berubah, ia tidak bisa menjelaskan perubahan.' },
      { id: 'x3', text: 'Rekap kehadiran membuktikan laporan harian salah.', feedback: 'Rekap kehadiran tidak membahas pemakaian air, jadi tidak bisa membantah laporan.' },
    ],
  },
  {
    id: 'c-jadwal-pengumuman', a: 'jadwal', b: 'pengumuman', title: 'Alasan sesi tambahan',
    options: [
      { id: 'x1', text: 'Pengumuman menjelaskan alasan sesi tambahan: persiapan Pameran Taman saat cuaca panas.', correct: true, feedback: 'Benar. Sekarang kita tahu bukan hanya apa yang terjadi, tapi juga mengapa.' },
      { id: 'x2', text: 'Pengumuman menunjukkan penyiraman dilakukan hari Kamis.', feedback: 'Pameran Taman diadakan hari Kamis, tetapi penyiraman tambahannya diminta pada hari Selasa.' },
      { id: 'x3', text: 'Pengumuman membuktikan Klub Taman menyiram tanpa izin.', feedback: 'Penyiraman tambahan justru diminta oleh Bu Ratna, pembina Klub Taman.' },
    ],
  },
  {
    id: 'c-checklist-laporan', a: 'checklist', b: 'laporan', title: 'Mencari penyebab lain',
    options: [
      { id: 'x1', text: 'Daftar periksa menunjukkan tidak ada kebocoran, jadi kenaikan di laporan pasti berasal dari pemakaian lain.', correct: true, feedback: 'Tepat. Saat satu kemungkinan gugur, kita mencari penyebab lain yang sesuai bukti.' },
      { id: 'x2', text: 'Laporan menunjukkan kenaikan, jadi daftar periksa pasti salah.', feedback: 'Kenaikan pemakaian tidak berarti ada kebocoran. Air bisa naik karena memang dipakai lebih banyak.' },
      { id: 'x3', text: 'Keduanya menunjukkan pemakaian air turun.', feedback: 'Laporan justru menunjukkan pemakaian naik dari 1.200 menjadi 1.560 liter.' },
    ],
  },
  {
    id: 'c-kesaksian-pengumuman', a: 'kesaksian', b: 'pengumuman', title: 'Dua sumber, satu alasan',
    options: [
      { id: 'x1', text: 'Pengumuman dan kesaksian berbeda pendapat soal alasan penyiraman.', feedback: 'Baca lagi: keduanya menyebut cuaca panas dan Pameran Taman.' },
      { id: 'x2', text: 'Keduanya menyebut Pameran Taman dan cuaca panas sebagai alasan penyiraman tambahan.', correct: true, feedback: 'Benar. Dua sumber independen memberi alasan yang sama.' },
      { id: 'x3', text: 'Keduanya membuktikan bahwa lantai lorong bocor.', feedback: 'Lantai lorong basah karena dipel, dan pengumuman sama sekali tidak membahasnya.' },
    ],
  },
];

const genericConnectionOptions = [
  { id: 'g-leak', text: 'Keduanya membuktikan adanya kebocoran pipa.', feedback: 'Tidak satu pun dari kedua bukti ini menunjukkan air keluar tanpa dipakai. Periksa lagi isi masing-masing bukti.' },
  { id: 'g-all', text: 'Keduanya bersama-sama menjelaskan seluruh kenaikan 360 liter.', feedback: 'Coba hitung: apakah ada angka di kedua bukti ini yang jika digabung menghasilkan 360 liter? Kalau tidak ada, hubungan ini belum terbukti.' },
  { id: 'g-none', text: 'Kedua bukti ini tidak punya hubungan langsung yang bisa dibuktikan.', correct: true, unrelated: true, feedback: 'Tepat. Tidak semua bukti harus disambungkan. Penyelidik yang baik tahu kapan dua bukti memang tidak berkaitan langsung.' },
];

const finalRequires = {
  challenges: ['m1', 'm2', 'bi', 'ipa'],
  evidence: ['laporan', 'jadwal', 'checklist'],
  connections: 3,
  keyConnections: ['c-laporan-jadwal'],
};

const objectives = [
  { id: 'o1', text: 'Temukan catatan pemakaian air di Ruang Pemeliharaan', done: { evidence: ['laporan'] }, where: 'maintenance' },
  { id: 'o2', text: 'Hitung kenaikan pemakaian air hari Selasa', subject: 'Matematika', visible: { evidence: ['laporan'] }, done: { challenges: ['m1'] }, action: { challenge: 'm1' } },
  { id: 'o3', text: 'Ikuti jejak 360 liter: periksa Taman Akademi', visible: { challenges: ['m1'] }, done: { evidence: ['jadwal'] }, where: 'garden' },
  { id: 'o4', text: 'Hitung total air sesi penyiraman tambahan', subject: 'Matematika', visible: { evidence: ['jadwal'] }, done: { challenges: ['m2'] }, action: { challenge: 'm2' } },
  { id: 'o5', text: 'Wawancarai saksi di Lorong Akademi', visible: { challenges: ['m1'] }, done: { evidence: ['kesaksian'] }, where: 'hallway' },
  { id: 'o6', text: 'Analisis kesaksian Nadia', subject: 'Bahasa Indonesia', visible: { evidence: ['kesaksian'] }, done: { challenges: ['bi'] }, action: { challenge: 'bi' } },
  { id: 'o7', text: 'Pelajari dampak penyiraman siang hari di bedeng tanaman', subject: 'IPA', visible: { evidence: ['jadwal'] }, done: { challenges: ['ipa'] }, action: { challenge: 'ipa' }, where: 'garden' },
  { id: 'o8', text: 'Uji dugaan Pak Darto: cari bukti ada atau tidaknya kebocoran', visible: { challenges: ['m1'] }, done: { evidence: ['checklist'] }, where: 'maintenance' },
  { id: 'o9', text: 'Hubungkan minimal 3 pasang bukti di Papan Bukti, termasuk asal 360 liter', visible: { challenges: ['m2'] }, done: { connections: 3, keyConnections: ['c-laporan-jadwal'] }, action: { screen: 'board' } },
  { id: 'o10', text: 'Ajukan kesimpulan akhir', visible: { challenges: ['m2'] }, done: { solved: true }, action: { screen: 'resolution', requires: finalRequires } },
  { id: 'x1', optional: true, text: 'Pastikan meter air bekerja dan cocok dengan catatan', visible: { evidence: ['laporan'] }, done: { evidence: ['meter'] }, where: 'maintenance' },
  { id: 'x2', optional: true, text: 'Periksa apakah jumlah siswa berubah', visible: { evidence: ['laporan'] }, done: { evidence: ['kehadiran'] }, where: 'maintenance' },
];

const chapters = [
  { id: 'ch1', label: 'Pengarahan', done: { flags: ['briefed'] } },
  { id: 'ch2', label: 'Data', done: { challenges: ['m1'] } },
  { id: 'ch3', label: 'Jejak Air', done: { challenges: ['m2'] } },
  { id: 'ch4', label: 'Saksi', done: { challenges: ['bi'] } },
  { id: 'ch5', label: 'Benang Merah', done: { connections: 3, keyConnections: ['c-laporan-jadwal'] } },
  { id: 'ch6', label: 'Kesimpulan', done: { solved: true } },
];

const final = {
  question: 'Apa penjelasan terbaik untuk kenaikan pemakaian air hari Selasa?',
  correct: 'watering',
  options: [
    {
      id: 'leak', text: 'Ada kebocoran pipa yang tersembunyi.',
      rebuttal: 'Daftar periksa mencatat uji malam: saat semua keran ditutup, angka meter tidak bergerak sama sekali. Kalau ada pipa bocor, air tetap mengalir dan meter terus berputar.',
      evidenceRef: 'checklist',
    },
    { id: 'watering', text: 'Ada penyiraman tambahan di taman.' },
    {
      id: 'attendance', text: 'Jumlah siswa yang hadir bertambah.',
      rebuttal: 'Rekap kehadiran menunjukkan jumlah siswa hari Senin dan Selasa sama, 312 orang. Sesuatu yang tidak berubah tidak bisa menjelaskan perubahan.',
      evidenceRef: 'kehadiran',
    },
    {
      id: 'meter', text: 'Meter air rusak dan salah mencatat.',
      rebuttal: 'Bacaan meter cocok dengan laporan harian, dan uji meter menunjukkan meter bergerak saat keran dibuka lalu berhenti saat ditutup. Meter bekerja normal.',
      evidenceRef: 'meter',
    },
    {
      id: 'stranger', text: 'Ada orang luar yang diam-diam mengambil air.',
      rebuttal: 'Tidak ada satu pun bukti tentang orang luar. Lagi pula, seluruh 360 liter sudah bisa dijelaskan oleh catatan dan kesaksian yang ada. Jangan menambah dugaan tanpa bukti.',
      evidenceRef: 'jadwal',
    },
  ],
  requiredEvidence: ['laporan', 'jadwal'],
  ruleOutEvidence: ['checklist', 'meter', 'kehadiran'],
  equation: { increase: 360, sessions: 2, perSession: 180 },
  summary:
    'Pada hari Selasa, Klub Taman menyiram kebun dua kali tambahan, pukul 11.00 dan 14.00, atas permintaan Bu Ratna untuk persiapan Pameran Taman di tengah cuaca panas. Setiap sesi memakai 180 liter, jadi totalnya 2 × 180 = 360 liter. Angka ini sama persis dengan kenaikan pemakaian air: 1.560 − 1.200 = 360 liter. Uji malam Pak Darto membuktikan tidak ada kebocoran, meter bekerja normal, dan jumlah siswa tidak berubah.',
  support: [
    { evidence: 'laporan', reason: 'Menunjukkan kenaikan: 1.560 − 1.200 = 360 liter.' },
    { evidence: 'jadwal', reason: 'Mencatat 2 sesi tambahan × 180 liter = 360 liter.' },
    { evidence: 'kesaksian', reason: 'Saksi mata menguatkan jam dan jumlah liter di jadwal.' },
    { evidence: 'checklist', reason: 'Uji malam menolak dugaan kebocoran.' },
    { evidence: 'meter', reason: 'Bacaan meter cocok dengan laporan, jadi kenaikan itu nyata.' },
    { evidence: 'kehadiran', reason: 'Jumlah siswa sama, jadi bukan penyebabnya.' },
  ],
  concepts: [
    { subject: 'Matematika', text: 'Selisih dengan pengurangan (1.560 − 1.200 = 360) dan perkalian sebagai penjumlahan berulang (2 × 180 = 360).' },
    { subject: 'Matematika', text: 'Membaca dan membandingkan data dalam tabel.' },
    { subject: 'IPA', text: 'Penguapan (evaporasi) lebih cepat saat suhu tinggi, dan cara-cara menghemat air.' },
    { subject: 'Bahasa Indonesia', text: 'Menemukan ide pokok, fakta penting, dan menilai relevansi informasi dalam teks.' },
    { subject: 'Berpikir ilmiah', text: 'Hipotesis harus diuji. Penjelasan yang kuat cocok dengan semua bukti dan menolak kemungkinan lain.' },
  ],
};

export const THE_LAST_DROP = {
  id: 'MYS-001',
  title: 'Tetes Terakhir',
  titleEn: 'The Last Drop',
  difficulty: 'Pemula',
  duration: '10–15 menit',
  subjects: ['Matematika', 'IPA', 'Bahasa Indonesia'],
  locationLabel: 'Taman Akademi & Ruang Pemeliharaan',
  teaser: 'Pemakaian air akademi melonjak tanpa sebab yang jelas. Petugas pemeliharaan yakin ada pipa bocor. Benarkah begitu?',
  startScene: 'c1_briefing',
  endScene: 'c1_epilogue',
  scenes,
  locations,
  locationOrder: ['maintenance', 'garden', 'hallway'],
  initialLocations: ['maintenance'],
  hotspots,
  evidence: EVIDENCE_MYS001,
  evidenceOrder: EVIDENCE_ORDER_MYS001,
  challenges,
  connections,
  genericConnectionOptions,
  objectives,
  chapters,
  finalRequires,
  final,
};
