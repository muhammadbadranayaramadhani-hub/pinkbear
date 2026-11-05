import { CaseData } from '../../types/game';

export const theLastDropCase: CaseData = {
  id: 'the-last-drop',
  code: 'MYS-001',
  title: 'Tetes Terakhir',
  subtitle: 'Misteri Lonjakan Konsumsi Air Akademi',
  difficulty: 'Tingkat Pemula (Kelas VII-IX)',
  duration: '10 - 15 Menit',
  subjects: ['Matematika', 'Ilmu Pengetahuan Alam (IPA)', 'Bahasa Indonesia'],
  synopsis:
    'Sistem utilitas Akademi Mysteria mencatat lonjakan konsumsi air harian yang mencurigakan. Dari rata-rata 1.200 liter, hari ini melonjak menjadi 1.560 liter padahal jumlah murid hadir tidak berubah. Pak Joko khawatir ada pipa bawah tanah yang bocor. Selidiki fakta di balik angka ini!',
  targetExplanation:
    'Lonjakan konsumsi air sebesar 360 liter (1.560 - 1.200) terbukti berasal dari 2 sesi penyiraman ekstra tanaman anggrek langka di Taman Akademi (2 × 180 liter = 360 liter), bukan akibat kebocoran pipa utilitas.',
  
  locations: [
    {
      id: 'garden',
      name: 'Taman Akademi',
      subtitle: 'Kebun Botani & Area Konservasi Tanaman',
      sceneImage: '/src/assets/images/mysteria_garden_scene_1793849662259.jpg',
      description:
        'Taman rimbun dengan bebatuan, kanal air jernih, dan rumah kaca berkubah. Udara beraroma tanah basah dan dedaunan segar.',
      hotspots: [
        {
          id: 'garden-hose',
          name: 'Gulungan Selang Kuningan',
          x: 65,
          y: 72,
          icon: 'droplet',
          shortDesc: 'Selang air dengan meteran semprot kuningan.',
          detailText:
            'Selang taman utama terhubung ke keran bertekanan. Ujung semprotannya masih basah dengan sisa tetesan air segar, menandakan baru saja dipakai belum lama ini.',
          hasEvidence: false,
        },
        {
          id: 'garden-schedule-board',
          name: 'Papan Jadwal Penyiraman',
          x: 63,
          y: 48,
          icon: 'clipboard-list',
          shortDesc: 'Papan kayu berisi catatan log pemeliharaan tanaman.',
          detailText:
            'Tertulis dengan kapur putih: "Catatan Hari Ini: Ditambahkan 2 SESI PENYIRAMAN EKSTRA untuk bibit Anggrek Mistika menjelang Pameran Musim Dingin. Tiap sesi memakai tangki penampung khusus berkapasitas 180 Liter air."',
          hasEvidence: true,
          evidenceId: 'ev-garden-schedule',
          triggerChallengeId: 'challenge-math-2',
        },
        {
          id: 'orchid-bed',
          name: 'Petak Anggrek Mistika',
          x: 22,
          y: 78,
          icon: 'flower',
          shortDesc: 'Kumpulan bunga langka dengan kelopak lembap.',
          detailText:
            'Bunga anggrek yang sangat sensitif terhadap kelembapan tanah. Tanah di sekitarnya tampak gembur dan sangat lembap. Ada lapisan mulsa kayu untuk menahan laju penguapan.',
          hasEvidence: false,
          triggerChallengeId: 'challenge-ipa',
        },
        {
          id: 'greenhouse-entry',
          name: 'Kubah Rumah Kaca',
          x: 42,
          y: 35,
          icon: 'warehouse',
          shortDesc: 'Kubah kaca anggun tempat riset botani akademi.',
          detailText:
            'Di balik kaca berkabut, terlihat tanaman-tanaman hidroponik dan instalasi pengairan tertata rapi tanpa genangan air berlebih di lantai.',
          hasEvidence: false,
        },
      ],
    },
    {
      id: 'maintenance',
      name: 'Ruang Pemeliharaan',
      subtitle: 'Pusat Utilitas & Pengontrolan Pipa Utama',
      sceneImage: '/src/assets/images/mysteria_maintenance_scene_1793849662124.jpg',
      description:
        'Ruang bawah tanah dengan pipa-pipa kuningan, pengukur tekanan, dan meja kerja kayu yang diterangi lampu minyak hangat.',
      hotspots: [
        {
          id: 'water-meter',
          name: 'Meteran Air Utama (Flow Meter)',
          x: 75,
          y: 22,
          icon: 'gauge',
          shortDesc: 'Alat ukur aliran air analog dengan jarum indikator.',
          detailText:
            'Meteran menunjukkan pembacaan kumulatif 1.560 liter. Ketika semua keran akademi ditutup sementara untuk pengujian, jarum penunjuk berhenti total dan tidak berputar sama sekali.',
          hasEvidence: true,
          evidenceId: 'ev-water-meter',
        },
        {
          id: 'workbench-records',
          name: 'Buku Catatan Log Pemakaian',
          x: 81,
          y: 58,
          icon: 'book-open',
          shortDesc: 'Lembar catatan harian konsumsi air akademi.',
          detailText:
            'Tercatat jelas: "Rata-rata konsumsi normal harian akademi: 1.200 liter. Pembacaan hari ini pukul 17.00: 1.560 liter. Terdeteksi selisih kenaikan signifikan yang memerlukan penyelidikan."',
          hasEvidence: true,
          evidenceId: 'ev-water-report',
          triggerChallengeId: 'challenge-math-1',
        },
        {
          id: 'pipeline-checklist',
          name: 'Checklist Uji Tekanan Pipa',
          x: 30,
          y: 36,
          icon: 'file-check',
          shortDesc: 'Dokumen hasil inspeksi fisik jaringan perpipaan.',
          detailText:
            'Laporan inspeksi teknisi: "Uji tekanan jalur pipa utama menghasilkan 2,4 bar (stabil). Tidak ada penurunan tekanan statis (pressure drop). Tidak ditemukan rembesan pada dinding maupun koridor bawah tanah."',
          hasEvidence: true,
          evidenceId: 'ev-checklist',
        },
        {
          id: 'tool-rack',
          name: 'Rak Perkakas Teknisi',
          x: 40,
          y: 42,
          icon: 'wrench',
          shortDesc: 'Kunci pipa, manometer cadangan, dan pita seal.',
          detailText:
            'Semua perkakas tersusun rapi. Belum ada tanda-tanda pipa darurat yang diganti atau dipotong dalam 24 jam terakhir.',
          hasEvidence: false,
        },
      ],
    },
    {
      id: 'hallway',
      name: 'Lorong Akademi',
      subtitle: 'Koridor Utama & Papan Informasi Siswa',
      sceneImage: '/src/assets/images/mysteria_hallway_scene_1793849662734.jpg',
      description:
        'Lorong berlantai kayu mengilap dengan jendela bergaya gotik dan lentera tembaga. Siswa dan staf berlalu-lalang di sini.',
      hotspots: [
        {
          id: 'bulletin-board',
          name: 'Papan Pengumuman Sekolah',
          x: 85,
          y: 48,
          icon: 'info',
          shortDesc: 'Poster kegiatan dan pengumuman resmi siswa.',
          detailText:
            'Pengumuman resmi: "Pekan Konservasi Alam & Persiapan Pameran Anggrek Mistika sedang berlangsung. Seluruh tim pengurus taman diminta memastikan kelembapan tanaman tetap optimal."',
          hasEvidence: false,
        },
        {
          id: 'witness-student-budi',
          name: 'Siswa: Budi (Klub Botani)',
          x: 55,
          y: 62,
          icon: 'user-check',
          shortDesc: 'Siswa anggota klub tanaman yang sedang memegang buku catatan.',
          detailText:
            'Budi berkata: "Siang tadi cuaca sangat terik. Sesuai instruksi guru pembina, kami melakukan dua sesi penyiraman tambahan untuk tanaman anggrek. Tiap sesi kami menghabiskan tepat satu tangki 180 liter."',
          hasEvidence: true,
          evidenceId: 'ev-witness',
          triggerChallengeId: 'challenge-indonesian',
        },
        {
          id: 'witness-worker-joko',
          name: 'Pak Joko (Petugas Pemeliharaan)',
          x: 20,
          y: 62,
          icon: 'user',
          shortDesc: 'Petugas utilitas senior yang tampak cemas.',
          detailText:
            'Pak Joko berkata: "Saya melihat angka 1.560 liter di meteran dan langsung panik, khawatir pipa tua di bawah tanah pecah! Tapi anehnya, manometer tidak menunjukkan kebocoran."',
          hasEvidence: false,
        },
      ],
    },
  ],

  evidence: [
    {
      id: 'ev-water-report',
      title: 'Laporan Konsumsi Air Harian',
      category: 'Dokumen',
      locationSource: 'Ruang Pemeliharaan (Meja Kerja)',
      description:
        'Dokumen resmi log utilitas sekolah yang mencatat pemakaian air harian secara terperinci.',
      keyData: 'Normal: 1.200 Liter | Hari Ini: 1.560 Liter | Kenaikan: 360 Liter',
      iconName: 'book-open',
    },
    {
      id: 'ev-water-meter',
      title: 'Observasi Meteran Air Utama',
      category: 'Observasi',
      locationSource: 'Ruang Pemeliharaan (Dinding Pipa)',
      description:
        'Pengamatan langsung terhadap jarum flow meter saat semua keran ditutup sementara.',
      keyData: 'Jarum diam total (0 L/menit saat katup tertutup). Tidak ada kebocoran statis tersembunyi.',
      iconName: 'gauge',
    },
    {
      id: 'ev-garden-schedule',
      title: 'Jadwal Penyiraman Tambahan',
      category: 'Dokumen',
      locationSource: 'Taman Akademi (Papan Kayu)',
      description:
        'Catatan resmi aktivitas pemeliharaan tanaman anggrek mistika untuk persiapan pameran.',
      keyData: '2 Sesi Tambahan × 180 Liter per sesi = 360 Liter total pemakaian khusus.',
      iconName: 'clipboard-list',
    },
    {
      id: 'ev-checklist',
      title: 'Checklist Uji Tekanan Pipa',
      category: 'Fisik',
      locationSource: 'Ruang Pemeliharaan (Papan Lembar)',
      description:
        'Hasil pengujian teknis tekanan fluida pada sistem distribusi air akademi.',
      keyData: 'Tekanan stabil 2,4 bar. Tidak ada pressure drop, tidak ada tanda rembesan air.',
      iconName: 'file-check',
    },
    {
      id: 'ev-witness',
      title: 'Kesaksian Pengurus Klub Tanaman',
      category: 'Kesaksian',
      locationSource: 'Lorong Akademi (Budi)',
      description:
        'Pernyataan terverifikasi dari pengurus klub botani mengenai aktivitas penyiraman lapangan.',
      keyData: 'Mengonfirmasi pelaksanaan 2 sesi penyiraman tambahan dengan kuota tepat 180 L per sesi.',
      iconName: 'message-square-quote',
    },
  ],

  challenges: [
    {
      id: 'challenge-math-1',
      subject: 'Matematika',
      grade: 'SMP Kelas VII',
      title: 'Kalkulasi Selisih Konsumsi Air',
      context:
        'Untuk memulai investigasi secara ilmiah, detektif harus mengetahui dengan tepat berapa banyak kelebihan air yang terpakai pada hari kejadian.',
      question:
        'Berdasarkan buku catatan harian, konsumsi air hari ini mencapai 1.560 liter, sedangkan konsumsi rata-rata normal adalah 1.200 liter. Berapa liter selisih kenaikan air tersebut?',
      type: 'calculation',
      expectedNumber: 360,
      tolerance: 0,
      unit: 'liter',
      hints: [
        'Gunakan operasi pengurangan sederhana: Konsumsi Hari Ini dikurangi Konsumsi Normal.',
        'Rumus: 1.560 - 1.200 = ...',
      ],
      educationalTakeaway:
        'Dalam matematika dan penyelidikan kasus, mencari selisih (difference) adalah langkah pertama untuk mengisolasi anomali data.',
      storyImpact:
        'Kamu berhasil menemukan angka kunci: tepat 360 liter air misterius yang harus kita telusuri jejak pemakaiannya!',
    },
    {
      id: 'challenge-math-2',
      subject: 'Matematika',
      grade: 'SMP Kelas VII',
      title: 'Interpretasi Sesi Penyiraman Ekstra',
      context:
        'Papan jadwal taman mencatat adanya 2 sesi penyiraman ekstra, dengan penggunaan 180 liter air pada setiap sesinya.',
      question:
        'Jika setiap sesi penyiraman membutuhkan 180 liter air dan dilaksanakan sebanyak 2 kali, berapakah total volume air yang digunakan untuk penyiraman ekstra tersebut?',
      type: 'calculation',
      expectedNumber: 360,
      tolerance: 0,
      unit: 'liter',
      hints: [
        'Gunakan operasi perkalian: Banyak sesi dikali volume per sesi.',
        'Rumus: 2 × 180 liter = ...',
      ],
      educationalTakeaway:
        'Operasi perkalian menghubungkan laju/kuota satuan dengan total agregat. Perhatikan bagaimana hasil 360 liter ini persis menyamai selisih konsumsi!',
      storyImpact:
        'Angka 360 liter muncul kembali! Volume penyiraman ekstra ini persis cocok dengan selisih yang dicatat meteran sekolah.',
    },
    {
      id: 'challenge-ipa',
      subject: 'Ilmu Pengetahuan Alam (IPA)',
      grade: 'SMP Kelas VIII',
      title: 'Konservasi Air & Transpirasi Tanaman',
      context:
        'Klub botani merawat Anggrek Mistika di bawah cuaca panas. Sebagai penyelidik berpikiran ilmiah, kamu mengamati teknik penyiraman mereka.',
      question:
        'Metode manakah yang paling efektif untuk menjaga kelembapan tanaman sekaligus mencegah pemborosan air akibat penguapan tinggi di siang hari?',
      type: 'multiple_choice',
      options: [
        {
          id: 'opt-ipa-1',
          text: 'Menyiram terus-menerus dengan semprotan deras di tengah terik matahari.',
          isCorrect: false,
          explanation:
            'Menyiram di siang terik dengan semprotan deras menyebabkan sebagian besar air langsung menguap sebelum diserap akar.',
        },
        {
          id: 'opt-ipa-2',
          text: 'Menggunakan irigasi tetes/penyiraman terarah di pagi/sore hari dan memberi mulsa pada permukaan tanah.',
          isCorrect: true,
          explanation:
            'Tepat sekali! Irigasi tetes menyalurkan air langsung ke perakaran, sementara mulsa menahan laju penguapan (evaporasi) tanah.',
        },
        {
          id: 'opt-ipa-3',
          text: 'Mengalirkan air hingga tanah tergenang seperti danau buatan.',
          isCorrect: false,
          explanation:
            'Tanah yang tergenang berlebihan dapat membusukkan akar tanaman anggrek dan membuang banyak air.',
        },
      ],
      hints: [
        'Pikirkan tentang siklus air dan penguapan (evaporasi) saat terkena sinar matahari.',
        'Teknologi irigasi yang hemat air menyasar langsung ke akar tanpa disebar ke udara.',
      ],
      educationalTakeaway:
        'Prinsip konservasi air dalam biologi dan pertanian mengutamakan efisiensi pengantaran air ke stomata dan akar dengan meminimalkan evaporasi tak berguna.',
      storyImpact:
        'Kamu memahami alasan logis mengapa pengurus klub menyiram secara terjadwal dan terukur dengan tangki 180 liter, bukan membuka keran sembarangan!',
    },
    {
      id: 'challenge-indonesian',
      subject: 'Bahasa Indonesia',
      grade: 'SMP Kelas VII - IX',
      title: 'Analisis Fakta vs Opini dalam Kesaksian',
      context:
        'Seorang detektif harus mampu memisahkan pernyataan yang merupakan fakta objektif (dapat dibuktikan dan terukur) dari opini atau kecurigaan subjektif.',
      question:
        'Perhatikan kutipan berikut dari Budi dan Pak Joko. Manakah pernyataan di bawah ini yang merupakan FAKTA OBJEKTIF yang dapat diverifikasi?',
      type: 'multiple_choice',
      options: [
        {
          id: 'opt-indo-1',
          text: '"Saya merasa ada pipa tua di bawah tanah yang pasti pecah karena sudah rapuh."',
          isCorrect: false,
          explanation:
            'Kata "merasa" dan "pasti pecah" merupakan dugaan/opini subjektif yang belum dibuktikan dengan data uji fisik.',
        },
        {
          id: 'opt-indo-2',
          text: '"Kami melakukan dua sesi penyiraman ekstra dengan kuota tepat 180 liter per sesi."',
          isCorrect: true,
          explanation:
            'Pernyataan ini adalah fakta terukur yang memuat data kuantitatif spesifik (2 sesi, 180 liter) dan dapat dicocokkan dengan log taman.',
        },
        {
          id: 'opt-indo-3',
          text: '"Hari ini terasa sangat aneh dan kemungkinan ada makhluk gaib yang meminum air akademi."',
          isCorrect: false,
          explanation:
            'Ini adalah takhayul dan asumsi tanpa dasar bukti empiris.',
        },
      ],
      hints: [
        'Fakta adalah hal nyata yang memuat angka, waktu, atau peristiwa yang dapat dibuktikan kebenarannya.',
        'Opini biasanya diawali kata "merasa", "tampaknya", "menurut saya", atau dugaan tanpa bukti.',
      ],
      educationalTakeaway:
        'Membedakan fakta dan opini adalah kompetensi kritis literasi membaca (Bahasa Indonesia) yang menjadi pondasi pemikiran kritis dan investigasi ilmiah.',
      storyImpact:
        'Dengan memilah fakta, kamu tidak terdistraksi oleh kepanikan isu pipa pecah dan fokus pada data nyata!',
    },
  ],

  connections: [
    {
      id: 'conn-1',
      evidenceA: 'ev-water-report',
      evidenceB: 'ev-garden-schedule',
      relationTitle: 'Korelasi Volume: Selisih Konsumsi vs Sesi Penyiraman',
      options: [
        {
          id: 'opt-c1-correct',
          text: 'Selisih kenaikan 360 L (1.560 - 1.200) persis sama dengan total 2 sesi penyiraman taman (2 × 180 L = 360 L).',
          isCorrect: true,
          feedback:
            'Deduksi Cemerlang! Hubungan matematis ini membuktikan bahwa seluruh lonjakan air 360 liter teralokasi untuk penyiraman taman.',
        },
        {
          id: 'opt-c1-wrong',
          text: 'Angka 360 L hanya kebetulan dan taman menggunakan air dari sumber lain.',
          isCorrect: false,
          feedback:
            'Kurang tepat. Taman terhubung langsung ke pipa utama sekolah, sehingga angka tersebut berhubungan langsung.',
        },
      ],
      deductionExplanation:
        'Kenaikan 360 liter air terjawab 100% oleh 2 sesi penyiraman ekstra (2 × 180 L = 360 L).',
      unlockedInsight:
        'Insight Terbuka: Tidak ada kelebihan air misterius yang tak terjelaskan di luar penyiraman taman!',
    },
    {
      id: 'conn-2',
      evidenceA: 'ev-water-meter',
      evidenceB: 'ev-checklist',
      relationTitle: 'Pemeriksaan Integritas Sistem: Pipa vs Kebocoran',
      options: [
        {
          id: 'opt-c2-correct',
          text: 'Jarum meteran diam saat keran ditutup dan tekanan pipa stabil 2,4 bar, membuktikan TIDAK ADA kebocoran pipa.',
          isCorrect: true,
          feedback:
            'Tepat sekali! Jika ada pipa bawah tanah yang bocor, jarum meteran akan terus berputar perlahan dan tekanan akan merosot.',
        },
        {
          id: 'opt-c2-wrong',
          text: 'Meteran air dan checklist menunjukkan adanya kebocoran besar di bawah tanah.',
          isCorrect: false,
          feedback:
            'Salah penafsiran. Data justru membuktikan sistem perpipaan dalam kondisi kedap dan bertekanan stabil.',
        },
      ],
      deductionExplanation:
        'Kombinasi observasi meteran statis dan checklist tekanan 2,4 bar secara definitif menggugurkan hipotesis kebocoran pipa.',
      unlockedInsight:
        'Insight Terbuka: Hipotesis kebocoran pipa utilitas Pak Joko resmi terbantahkan!',
    },
    {
      id: 'conn-3',
      evidenceA: 'ev-garden-schedule',
      evidenceB: 'ev-witness',
      relationTitle: 'Verifikasi Saksi: Rencana Tertulis vs Pelaksanaan Nyata',
      options: [
        {
          id: 'opt-c3-correct',
          text: 'Kesaksian Budi mengonfirmasi bahwa jadwal 2 sesi ekstra @ 180 liter benar-benar dilakukan di lapangan.',
          isCorrect: true,
          feedback:
            'Sempurna! Dokumen tertulis di papan jadwal bersesuaian penuh dengan keterangan saksi mata yang bertugas.',
        },
        {
          id: 'opt-c3-wrong',
          text: 'Jadwal taman bertentangan dengan kesaksian siswa.',
          isCorrect: false,
          feedback:
            'Salah. Catatan papan jadwal dan pengakuan Budi saling menguatkan satu sama lain.',
        },
      ],
      deductionExplanation:
        'Kesaksian saksi membuktikan bahwa penyiraman tambahan bukan sekadar rencana di atas kertas melainkan fakta nyata.',
      unlockedInsight:
        'Insight Terbuka: Aktivitas penyiraman ekstra terbukti benar-benar terlaksana dengan volume yang cocok.',
    },
  ],

  resolutions: [
    {
      id: 'res-garden-watering',
      title: 'Penyiraman Taman Ekstra untuk Anggrek Langka',
      summary:
        'Kenaikan konsumsi air 360 liter disebabkan oleh 2 sesi penyiraman tambahan (2 × 180 L) untuk merawat bibit anggrek di cuaca terik.',
      isCorrect: true,
      requiredEvidenceIds: ['ev-water-report', 'ev-garden-schedule', 'ev-witness'],
      feedback:
        'Deduksi Sempurna! Kamu telah menggunakan matematika, analisis data, dan verifikasi saksi untuk mengungkap kebenaran secara ilmiah tanpa terjebak kepanikan!',
    },
    {
      id: 'res-pipe-leak',
      title: 'Kebocoran Pipa Bawah Tanah Tersembunyi',
      summary:
        'Pipa bawah tanah akademi telah pecah dan meneteskan air ke dalam tanah tanpa terlihat di permukaan.',
      isCorrect: false,
      requiredEvidenceIds: ['ev-water-meter'],
      feedback:
        'Hipotesis ini keliru. Observasi meteran air saat katup tertutup dan checklist tekanan membuktikan bahwa tekanan pipa stabil 2,4 bar tanpa kebocoran.',
    },
    {
      id: 'res-student-attendance',
      title: 'Lonjakan Jumlah Siswa yang Hadir',
      summary:
        'Konsumsi air melonjak karena ada rombongan tamu atau peningkatan kehadiran murid akademi secara drastis.',
      isCorrect: false,
      requiredEvidenceIds: [],
      feedback:
        'Keliru. Informasi kasus menegaskan bahwa jumlah siswa dan aktivitas harian di akademi tidak berubah.',
    },
    {
      id: 'res-broken-meter',
      title: 'Kerusakan Alat Pengukur Meteran Air',
      summary:
        'Meteran air mengalami eror kalibrasi mekanik sehingga menghitung volume air secara berlebihan.',
      isCorrect: false,
      requiredEvidenceIds: [],
      feedback:
        'Keliru. Meteran air telah teruji akurat dan berhenti secara presisi ketika aliran keran dihentikan.',
    },
  ],

  dialogues: {
    'intro-1': {
      id: 'intro-1',
      speaker: 'Aria',
      speakerTitle: 'Kepala Arsip Investigasi',
      portrait: '/src/assets/images/mysteria_guide_aria_1793849663528.jpg',
      text:
        'Selamat datang di Divisi Arsip Rahasia Akademi Mysteria. Saya Aria, kurator arsip penyelidikan. Surat undangan yang kamu terima bukan kebetulan.',
      nextNodeId: 'intro-2',
    },
    'intro-2': {
      id: 'intro-2',
      speaker: 'Aria',
      speakerTitle: 'Kepala Arsip Investigasi',
      portrait: '/src/assets/images/mysteria_guide_aria_1793849663528.jpg',
      text:
        'Di akademi ini, kami tidak memecahkan misteri dengan tebakan atau takhayul. Sains, matematika, dan nalar bahasa adalah instrumen terbaik bagi seorang penyelidik sejati.',
      choices: [
        {
          text: 'Saya siap bertugas, Aria! Apa kasus pertama kita?',
          nextNodeId: 'intro-3a',
          impactText: 'Antusiasme penyelidik muda dicatat dalam arsip.',
        },
        {
          text: 'Mengapa pelajaran sekolah bisa berguna untuk investigasi?',
          nextNodeId: 'intro-3b',
          impactText: 'Rasa ingin tahu filosofis dicatat dalam arsip.',
        },
      ],
    },
    'intro-3a': {
      id: 'intro-3a',
      speaker: 'Aria',
      speakerTitle: 'Kepala Arsip Investigasi',
      portrait: '/src/assets/images/mysteria_guide_aria_1793849663528.jpg',
      text:
        'Bagus sekali! Kasus pertama kita baru saja masuk beberapa jam lalu. Kasus MYS-001: "Tetes Terakhir". Pak Joko dari bagian utilitas panik karena air akademi melonjak drastis.',
      nextNodeId: 'intro-4',
    },
    'intro-3b': {
      id: 'intro-3b',
      speaker: 'Aria',
      speakerTitle: 'Kepala Arsip Investigasi',
      portrait: '/src/assets/images/mysteria_guide_aria_1793849663528.jpg',
      text:
        'Karena dunia nyata tersusun atas pola logis. Matematika membaca jumlah dan tren, sains menjelaskan sebab-akibat alam, dan bahasa menyaring fakta dari kabar burung. Mari kita buktikan di Kasus MYS-001.',
      nextNodeId: 'intro-4',
    },
    'intro-4': {
      id: 'intro-4',
      speaker: 'Aria',
      speakerTitle: 'Kepala Arsip Investigasi',
      portrait: '/src/assets/images/mysteria_guide_aria_1793849663528.jpg',
      text:
        'Tugasmu: Periksa 3 lokasi kunci—Taman Akademi, Ruang Pemeliharaan, dan Lorong Sekolah. Kumpulkan bukti, pecahkan tantangan pengetahuan, hubungkan petunjuk di Papan Deduksi, lalu simpulkan kebenarannya!',
      nextNodeId: 'intro-end',
    },
  },
};
