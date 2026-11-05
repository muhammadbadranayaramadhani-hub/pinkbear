// Mesin bukti: pengumpulan dan pemeriksaan hubungan antarbukti di Papan Bukti.

export const pairKey = (a, b) => [a, b].sort().join('+');

export function getConnection(caseData, a, b) {
  const key = pairKey(a, b);
  return caseData.connections.find((c) => pairKey(c.a, c.b) === key) || null;
}

export function relationshipOptions(caseData, a, b) {
  const conn = getConnection(caseData, a, b);
  return conn ? conn.options : caseData.genericConnectionOptions;
}

/**
 * Menilai alasan pemain untuk sepasang bukti.
 * Hasil: { correct, counts (menjadi benang di papan), feedback, connectionId }
 */
export function evaluateRelationship(caseData, a, b, optionId) {
  const conn = getConnection(caseData, a, b);
  const options = conn ? conn.options : caseData.genericConnectionOptions;
  const opt = options.find((o) => o.id === optionId);
  if (!opt) return { correct: false, counts: false, feedback: 'Pilih salah satu alasan terlebih dahulu.' };
  if (!conn) {
    return { correct: !!opt.correct, counts: false, unrelated: true, feedback: opt.feedback };
  }
  return { correct: !!opt.correct, counts: !!opt.correct, connectionId: conn.id, feedback: opt.feedback };
}

export function collectedEvidence(caseData, cs) {
  return caseData.evidenceOrder.filter((id) => cs.evidence.includes(id)).map((id) => caseData.evidence[id]);
}

export function locationName(caseData, locId) {
  return caseData.locations[locId] ? caseData.locations[locId].name : locId;
}
