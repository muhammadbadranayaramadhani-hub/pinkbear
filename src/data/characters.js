// Tokoh-tokoh MYSTERIA. Data portret dipakai oleh CharacterPortrait.jsx.

export const CHARACTERS = {
  narrator: { id: 'narrator', name: '', role: 'Narasi' },
  player: { id: 'player', name: '{name}', role: 'Penyelidik' },
  seruni: {
    id: 'seruni',
    name: 'Seruni',
    role: 'Penjaga Arsip',
    side: 'left',
    portrait: { skin: '#D9A884', skinShade: '#B9866A', hair: '#1E1B33', accent: '#7776A8' },
  },
  darto: {
    id: 'darto',
    name: 'Pak Darto',
    role: 'Petugas Pemeliharaan',
    side: 'right',
    portrait: { skin: '#A8714E', skinShade: '#8A5A3E', hair: '#4A4652', accent: '#91B9B4' },
  },
  nadia: {
    id: 'nadia',
    name: 'Nadia',
    role: 'Klub Taman · Kelas VIII-B',
    side: 'right',
    portrait: { skin: '#C99472', skinShade: '#AB7A5C', hair: '#C8A9C8', accent: '#91B9B4' },
  },
};

export const EXPRESSION_LABELS = {
  neutral: 'tenang',
  smile: 'tersenyum',
  happy: 'gembira',
  worried: 'cemas',
  thinking: 'berpikir',
  surprised: 'terkejut',
  serious: 'serius',
};
