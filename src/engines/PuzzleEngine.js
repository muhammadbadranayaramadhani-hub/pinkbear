// Mesin teka-teki: menilai jawaban tantangan pengetahuan dan kesimpulan akhir.

/** Mengubah teks jawaban menjadi angka. Menerima "360", "360 liter", "1.560", "360,0". */
export function parseNumber(raw) {
  if (raw == null) return NaN;
  let s = String(raw).trim().toLowerCase();
  s = s.replace(/liter|ltr|l\b/g, '').replace(/\s+/g, '');
  if (!s) return NaN;
  s = s.replace(/[−–]/g, '-');
  if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
  s = s.replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(s)) return NaN;
  return Number(s);
}

export function evaluatePart(part, value) {
  if (part.type === 'number') {
    const n = parseNumber(value);
    if (Number.isNaN(n)) {
      return { correct: false, invalid: true, feedback: 'Tulis jawabanmu sebagai angka, misalnya 250.' };
    }
    if (Math.abs(n - part.answer) < 1e-9) return { correct: true };
    const mistake = (part.mistakes || []).find((m) => Math.abs(m.value - n) < 1e-9);
    return { correct: false, feedback: mistake ? mistake.text : part.wrong };
  }

  if (part.type === 'choice') {
    const opt = part.options.find((o) => o.id === value);
    if (!opt) return { correct: false, invalid: true, feedback: 'Pilih salah satu jawaban terlebih dahulu.' };
    return opt.correct ? { correct: true } : { correct: false, feedback: opt.feedback };
  }

  if (part.type === 'multi') {
    const picked = Array.isArray(value) ? value : [];
    if (picked.length === 0) return { correct: false, invalid: true, feedback: 'Pilih minimal satu jawaban.' };
    const wrongPicked = part.options.filter((o) => picked.includes(o.id) && !o.correct);
    const missed = part.options.filter((o) => o.correct && !picked.includes(o.id));
    if (wrongPicked.length === 0 && missed.length === 0) return { correct: true };
    const lines = wrongPicked.map((o) => `“${o.text}” ${o.feedback}`);
    if (missed.length > 0) {
      lines.push(`Masih ada ${missed.length} cara tepat yang belum kamu pilih.`);
    }
    return { correct: false, feedback: lines.join(' ') };
  }

  return { correct: false, feedback: 'Jenis soal tidak dikenal.' };
}

export function correctAnswerText(part) {
  if (part.type === 'number') return `${part.answer.toLocaleString('id-ID')} ${part.unit || ''}`.trim();
  if (part.type === 'choice') return part.options.find((o) => o.correct).text;
  if (part.type === 'multi') return part.options.filter((o) => o.correct).map((o) => o.text).join(' · ');
  return '';
}

export function emptyPartRecord() {
  return { attempts: 0, wrong: 0, hints: 0, revealed: false, solved: false };
}

export function partQuality(rec) {
  if (!rec) return 0;
  if (rec.revealed) return 1 / 3;
  if (rec.wrong > 0 || rec.hints > 0) return 2 / 3;
  return 1;
}

export function challengeKp(challenge, record) {
  if (!record) return 0;
  const q = challenge.parts.map((_, i) => partQuality(record.parts[i]));
  const avg = q.reduce((a, b) => a + b, 0) / q.length;
  return Math.round(challenge.kp * avg);
}

/**
 * Menilai kesimpulan akhir berdasarkan bukti, bukan hanya pilihan penyebab.
 * submission: { cause, evidence:[], increase, sessions, perSession, reasoning }
 */
export function evaluateConclusion(caseData, submission, cs) {
  const f = caseData.final;
  const issues = [];

  if (!submission.cause) {
    return { ok: false, issues: [{ step: 1, title: 'Penyebab belum dipilih', message: 'Pilih penjelasan yang menurutmu paling didukung bukti.' }] };
  }

  if (submission.cause !== f.correct) {
    const opt = f.options.find((o) => o.id === submission.cause);
    let message = opt.rebuttal;
    if (opt.evidenceRef && !cs.evidence.includes(opt.evidenceRef)) {
      const ev = caseData.evidence[opt.evidenceRef];
      message += ` Kamu belum menemukan "${ev.title}". Coba periksa ${caseData.locations[ev.location].name}.`;
    }
    return { ok: false, issues: [{ step: 1, title: 'Penjelasan ini dibantah oleh bukti', message }] };
  }

  const ev = submission.evidence || [];
  const missingReq = f.requiredEvidence.filter((id) => !ev.includes(id));
  if (missingReq.length) {
    const roles = {
      laporan: 'bukti yang menunjukkan berapa besar kenaikannya',
      jadwal: 'bukti yang menunjukkan dari mana air tambahan itu berasal',
    };
    issues.push({
      step: 2,
      title: 'Kesimpulanmu belum didukung bukti yang cukup',
      message: `Penyebabnya sudah tepat, tapi kamu belum memilih ${missingReq.map((id) => roles[id] || caseData.evidence[id].title).join(' dan ')}.`,
    });
  }

  if (!f.ruleOutEvidence.some((id) => ev.includes(id))) {
    issues.push({
      step: 2,
      title: 'Penjelasan lain belum ditolak',
      message: 'Pak Darto masih yakin ada kebocoran. Pilih minimal satu bukti yang menunjukkan bahwa penjelasan lain, seperti kebocoran atau meter rusak, tidak terjadi.',
    });
  }

  const eq = f.equation;
  const inc = parseNumber(submission.increase);
  const ses = parseNumber(submission.sessions);
  const per = parseNumber(submission.perSession);
  if ([inc, ses, per].some(Number.isNaN)) {
    issues.push({ step: 3, title: 'Persamaan belum lengkap', message: 'Isi ketiga kotak persamaan dengan angka dari bukti.' });
  } else if (ses === eq.perSession && per === eq.sessions) {
    issues.push({ step: 3, title: 'Angkanya tertukar', message: 'Coba baca lagi: berapa banyak sesi tambahan, dan berapa liter untuk setiap sesi?' });
  } else {
    if (inc !== eq.increase) {
      issues.push({ step: 3, title: 'Angka kenaikan belum tepat', message: 'Kenaikan adalah selisih pemakaian hari Selasa dengan hari biasa. Lihat Laporan Pemakaian Air Harian.' });
    }
    if (ses !== eq.sessions || per !== eq.perSession) {
      issues.push({ step: 3, title: 'Data penyiraman belum tepat', message: 'Lihat Jadwal Penyiraman: berapa sesi tambahan dan berapa liter per sesi?' });
    } else if (inc === eq.increase && ses * per !== inc) {
      issues.push({ step: 3, title: 'Persamaan tidak seimbang', message: 'Kedua sisi persamaan harus bernilai sama.' });
    }
  }

  const text = (submission.reasoning || '').toLowerCase();
  const notes = [];
  if (/360/.test(text) && (/180/.test(text) || /sesi|siram/.test(text))) notes.push('Penjelasanmu menghubungkan angka 360 dengan penyiraman. Bagus sekali!');
  else if (text.trim().length > 0) notes.push('Terima kasih sudah menuliskan alasanmu. Coba sebutkan angka-angka bukti agar penjelasanmu lebih kuat.');

  return { ok: issues.length === 0, issues, notes };
}
