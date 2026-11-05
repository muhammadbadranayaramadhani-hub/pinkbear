import { THE_LAST_DROP } from './theLastDrop.js';

// Daftar kasus. Kasus baru cukup ditambahkan di sini.
export const CASES = {
  [THE_LAST_DROP.id]: THE_LAST_DROP,
};

// Map yang terlihat di Arsip, termasuk yang masih tersegel.
export const ARCHIVE_SHELF = [
  { id: 'MYS-001', playable: true },
  { id: 'MYS-002', playable: false, title: 'Bayangan di Laboratorium', subjects: ['IPA', 'Matematika'], teaser: 'Bayangan tiang bendera memanjang di jam yang salah.' },
  { id: 'MYS-003', playable: false, title: 'Surat Tanpa Tanda Baca', subjects: ['Bahasa Indonesia', 'IPS'], teaser: 'Sepucuk surat lama mengubah arti sebuah peta.' },
];

export function getCase(id) {
  return CASES[id];
}
