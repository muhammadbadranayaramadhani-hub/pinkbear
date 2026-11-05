// Mesin kemajuan: simpan/muat, poin pengetahuan, pangkat, lencana, dan rangkuman kinerja.

import { RANKS, BADGES } from '../data/progression.js';
import { CASES } from '../data/cases/index.js';

export const STORAGE_KEY = 'mysteria.save.v1';
const VERSION = 1;

export const DEFAULT_SETTINGS = { textSpeed: 'normal', motion: 'system', textSize: 'normal' };

export function freshCaseState(caseData) {
  return {
    status: 'not-started',
    flags: {},
    unlockedLocations: [...caseData.initialLocations],
    location: caseData.initialLocations[0],
    inspected: [],
    evidence: [],
    unseen: [],
    challenges: {},
    connections: [],
    boardMistakes: 0,
    finalAttempts: 0,
    kp: 0,
    result: null,
  };
}

export function freshGame(settings = DEFAULT_SETTINGS) {
  return {
    version: VERSION,
    player: { name: '' },
    settings: { ...DEFAULT_SETTINGS, ...settings },
    progress: { unlockedCases: [], caseBest: {}, badges: [] },
    session: null,
    cases: {},
    toasts: [],
  };
}

export function loadGame() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshGame();
    const data = JSON.parse(raw);
    if (!data || data.version !== VERSION) return freshGame();
    return { ...freshGame(), ...data, toasts: [] };
  } catch (e) {
    return freshGame();
  }
}

export function saveGame(state) {
  try {
    const { toasts, ...rest } = state;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  } catch (e) {
    /* penyimpanan tidak tersedia; permainan tetap berjalan */
  }
}

export function hasSave(state) {
  return !!(state.session && state.player.name);
}

export function totalKp(state) {
  let total = 0;
  Object.keys(CASES).forEach((id) => {
    const best = (state.progress.caseBest[id] && state.progress.caseBest[id].kp) || 0;
    const current = (state.cases[id] && state.cases[id].kp) || 0;
    total += Math.max(best, current);
  });
  return total;
}

export function rankFor(kp) {
  let idx = 0;
  RANKS.forEach((r, i) => { if (kp >= r.min) idx = i; });
  const current = RANKS[idx];
  const next = RANKS[idx + 1] || null;
  const progress = next ? (kp - current.min) / (next.min - current.min) : 1;
  return { current, next, progress, index: idx };
}

export function newBadges(state) {
  const earned = new Set(state.progress.badges);
  const found = [];
  Object.entries(state.cases).forEach(([id, cs]) => {
    const caseData = CASES[id];
    if (!caseData) return;
    BADGES.forEach((b) => {
      if (!earned.has(b.id) && !found.includes(b.id) && b.test(cs, caseData)) found.push(b.id);
    });
  });
  return found;
}

export function caseStats(caseData, cs) {
  const records = Object.values(cs.challenges);
  const parts = records.flatMap((r) => r.parts);
  const challengeIds = Object.keys(caseData.challenges);
  return {
    evidence: cs.evidence.length,
    evidenceTotal: caseData.evidenceOrder.length,
    inspected: cs.inspected.length,
    inspectTotal: caseData.hotspots.length,
    challengesSolved: challengeIds.filter((id) => cs.challenges[id] && cs.challenges[id].solved).length,
    challengesTotal: challengeIds.length,
    cleanChallenges: challengeIds.filter((id) => {
      const r = cs.challenges[id];
      return r && r.solved && r.parts.every((p) => p.wrong === 0 && p.hints === 0 && !p.revealed);
    }).length,
    hints: parts.reduce((a, p) => a + p.hints, 0),
    reveals: parts.filter((p) => p.revealed).length,
    connections: cs.connections.length,
    connectionsTotal: caseData.connections.length,
    boardMistakes: cs.boardMistakes,
    finalAttempts: cs.finalAttempts,
    kp: cs.kp,
  };
}

export function ratingFor(stats) {
  let stars = 1;
  if (stats.reveals === 0 && stats.hints <= 3 && stats.finalAttempts <= 2) stars += 1;
  if (stats.evidence >= stats.evidenceTotal - 1 && stats.connections >= 4 && stats.reveals === 0) stars += 1;
  const titles = { 1: 'Kasus Terpecahkan', 2: 'Penyelidik Cermat', 3: 'Penyelidik Teladan' };
  const messages = {
    1: 'Kamu berhasil sampai ke kebenaran. Setiap petunjuk yang kamu pakai adalah bagian dari belajar, bukan kekalahan.',
    2: 'Penyelidikan yang rapi! Kamu menguji dugaan dengan angka dan tidak mudah percaya pada kesan pertama.',
    3: 'Luar biasa. Kamu teliti, sabar, dan setiap kesimpulanmu berdiri di atas bukti. Arsip bangga memilihmu.',
  };
  return { stars, title: titles[stars], message: messages[stars] };
}
