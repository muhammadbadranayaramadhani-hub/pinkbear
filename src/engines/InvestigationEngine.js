// Mesin penyelidikan: persyaratan, tujuan, lokasi, dan status objek interaktif.

/**
 * Memeriksa persyaratan deklaratif terhadap state kasus.
 * req: { evidence:[], challenges:[], flags:[], inspected:[], connections:n, keyConnections:[], solved:bool }
 */
export function meets(req, cs) {
  if (!req) return true;
  if (req.evidence && !req.evidence.every((e) => cs.evidence.includes(e))) return false;
  if (req.challenges && !req.challenges.every((c) => cs.challenges[c] && cs.challenges[c].solved)) return false;
  if (req.flags && !req.flags.every((f) => cs.flags[f])) return false;
  if (req.inspected && !req.inspected.every((h) => cs.inspected.includes(h))) return false;
  if (req.connections && cs.connections.length < req.connections) return false;
  if (req.keyConnections && !req.keyConnections.every((k) => cs.connections.includes(k))) return false;
  if (req.solved && cs.status !== 'solved') return false;
  return true;
}

/** Daftar yang belum terpenuhi, dalam kalimat yang bisa dibaca pemain. */
export function missingRequirements(req, cs, caseData) {
  const out = [];
  if (!req) return out;
  (req.evidence || []).forEach((e) => {
    if (!cs.evidence.includes(e)) out.push(`Temukan bukti: ${caseData.evidence[e].title}`);
  });
  (req.challenges || []).forEach((c) => {
    if (!(cs.challenges[c] && cs.challenges[c].solved)) out.push(`Selesaikan analisis: ${caseData.challenges[c].title}`);
  });
  if (req.connections && cs.connections.length < req.connections) {
    out.push(`Hubungkan bukti di Papan Bukti (${cs.connections.length}/${req.connections})`);
  }
  (req.keyConnections || []).forEach((k) => {
    if (!cs.connections.includes(k)) {
      const conn = caseData.connections.find((c) => c.id === k);
      out.push(`Temukan hubungan kunci: ${conn ? conn.title : k}`);
    }
  });
  return out;
}

export function getObjectives(caseData, cs) {
  return caseData.objectives
    .filter((o) => meets(o.visible, cs))
    .map((o) => ({ ...o, isDone: meets(o.done, cs) }));
}

export function currentObjective(caseData, cs) {
  return getObjectives(caseData, cs).find((o) => !o.isDone && !o.optional) || null;
}

export function chapterStatus(caseData, cs) {
  const list = caseData.chapters.map((ch) => ({ ...ch, isDone: meets(ch.done, cs) }));
  const currentIdx = list.findIndex((c) => !c.isDone);
  return { list, current: currentIdx === -1 ? list.length - 1 : currentIdx };
}

export function isLocationUnlocked(cs, locId) {
  return cs.unlockedLocations.includes(locId);
}

export function hotspotsAt(caseData, locId) {
  return caseData.hotspots.filter((h) => h.location === locId);
}

export function hotspotState(h, cs) {
  const inspected = cs.inspected.includes(h.id);
  const collected = h.evidence ? cs.evidence.includes(h.evidence) : false;
  const done = h.kind === 'evidence' ? collected : inspected;
  return { inspected, collected, done };
}

export function isChallengeAvailable(caseData, cs, id) {
  const ch = caseData.challenges[id];
  return !!ch && meets(ch.requires, cs);
}

export function isChallengeSolved(cs, id) {
  return !!(cs.challenges[id] && cs.challenges[id].solved);
}

export function pendingChallenges(caseData, cs) {
  return Object.values(caseData.challenges).filter((c) => meets(c.requires, cs) && !isChallengeSolved(cs, c.id));
}

export function isFinalUnlocked(caseData, cs) {
  return meets(caseData.finalRequires, cs);
}
