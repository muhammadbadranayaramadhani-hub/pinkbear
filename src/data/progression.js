// Pangkat penyelidik dan lencana. Poin Pengetahuan (PP) dihitung dari skor terbaik tiap kasus.

export const RANKS = [
  { min: 0, title: 'Calon Penyelidik' },
  { min: 80, title: 'Penyelidik Muda' },
  { min: 180, title: 'Penyelidik Arsip' },
  { min: 300, title: 'Penjaga Petunjuk' },
  { min: 450, title: 'Ahli Arsip' },
];

export const KP_RULES = {
  inspect: 2,
  evidence: 5,
  connection: 15,
  finalFirstTry: 50,
  finalLater: 35,
};

// Lencana dievaluasi terhadap state kasus. Kondisi ditulis sebagai fungsi kecil agar mudah dibaca.
export const BADGES = [
  {
    id: 'mata-elang', title: 'Mata Elang', icon: 'eye',
    description: 'Menemukan semua bukti dalam satu kasus.',
    test: (cs, c) => c.evidenceOrder.every((id) => cs.evidence.includes(id)),
  },
  {
    id: 'rasa-ingin-tahu', title: 'Rasa Ingin Tahu', icon: 'search',
    description: 'Memeriksa setiap objek, termasuk yang tampak tidak penting.',
    test: (cs, c) => c.hotspots.every((h) => cs.inspected.includes(h.id)),
  },
  {
    id: 'hitungan-jitu', title: 'Hitungan Jitu', icon: 'sparkles',
    description: 'Menyelesaikan semua tantangan matematika tanpa salah dan tanpa petunjuk.',
    test: (cs, c) => {
      const math = Object.values(c.challenges).filter((ch) => ch.subject === 'Matematika');
      return math.length > 0 && math.every((ch) => {
        const r = cs.challenges[ch.id];
        return r && r.solved && r.parts.every((p) => p.wrong === 0 && p.hints === 0 && !p.revealed);
      });
    },
  },
  {
    id: 'pembaca-teliti', title: 'Pembaca Teliti', icon: 'book',
    description: 'Menganalisis kesaksian tanpa membuka petunjuk.',
    test: (cs) => {
      const r = cs.challenges.bi;
      return !!(r && r.solved && r.parts.every((p) => p.hints === 0 && !p.revealed));
    },
  },
  {
    id: 'penjaga-air', title: 'Penjaga Air', icon: 'droplet',
    description: 'Memahami penguapan dan cara menghemat air di sekolah.',
    test: (cs) => !!(cs.challenges.ipa && cs.challenges.ipa.solved),
  },
  {
    id: 'benang-merah', title: 'Benang Merah', icon: 'link',
    description: 'Menemukan 6 hubungan antarbukti di Papan Bukti.',
    test: (cs) => cs.connections.length >= 6,
  },
  {
    id: 'kasus-pertama', title: 'Kasus Pertama', icon: 'award',
    description: 'Memecahkan MYS-001: Tetes Terakhir.',
    test: (cs, c) => c.id === 'MYS-001' && cs.status === 'solved',
  },
];
