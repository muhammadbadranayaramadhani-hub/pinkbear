import { useState } from 'react';
import Modal from './Modal.jsx';
import Icon from './Icon.jsx';
import DocumentView from './DocumentView.jsx';
import { evaluatePart, correctAnswerText, emptyPartRecord } from '../engines/PuzzleEngine.js';

const SUBJECT_ICON = { Matematika: 'sparkles', IPA: 'droplet', 'Bahasa Indonesia': 'book', IPS: 'users' };

// Tantangan pengetahuan: soal muncul dari bukti, petunjuk bertahap, jawaban hanya dibuka atas permintaan.
export default function KnowledgeChallenge({ challenge, caseData, record, dispatch, onClose, onComplete }) {
  const rec = record || { parts: challenge.parts.map(() => emptyPartRecord()), solved: false };
  const firstOpen = rec.parts.findIndex((p) => !p.solved);
  const [partIdx, setPartIdx] = useState(firstOpen === -1 ? challenge.parts.length - 1 : firstOpen);
  const [phase, setPhase] = useState(firstOpen === -1 ? 'concept' : 'question');
  const [value, setValue] = useState('');
  const [multi, setMulti] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [askReveal, setAskReveal] = useState(false);

  const part = challenge.parts[partIdx];
  const pr = rec.parts[partIdx] || emptyPartRecord();
  const ev = caseData.evidence[challenge.evidence];
  const total = challenge.parts.length;
  const canReveal = pr.wrong >= 2 || (pr.hints >= part.hints.length && pr.wrong >= 1);

  function check(e) {
    if (e) e.preventDefault();
    const answer = part.type === 'multi' ? multi : value;
    const res = evaluatePart(part, answer);
    if (res.invalid) {
      setFeedback({ kind: 'invalid', text: res.feedback });
      return;
    }
    dispatch({ type: 'CHALLENGE_ATTEMPT', id: challenge.id, part: partIdx, correct: res.correct });
    if (res.correct) {
      setFeedback({ kind: 'right', text: part.explain });
      setPhase('part-done');
      setAskReveal(false);
    } else {
      setFeedback({ kind: 'wrong', text: res.feedback });
    }
  }

  function hint() {
    const level = Math.min(part.hints.length, pr.hints + 1);
    dispatch({ type: 'CHALLENGE_HINT', id: challenge.id, part: partIdx, level });
  }

  function reveal() {
    dispatch({ type: 'CHALLENGE_REVEAL', id: challenge.id, part: partIdx });
    setFeedback({ kind: 'revealed', text: `Jawaban: ${correctAnswerText(part)}. ${part.explain}` });
    setPhase('part-done');
    setAskReveal(false);
  }

  function nextPart() {
    if (partIdx + 1 < total) {
      setPartIdx(partIdx + 1);
      setPhase('question');
      setValue('');
      setMulti([]);
      setFeedback(null);
    } else {
      setPhase('concept');
      setFeedback(null);
    }
  }

  const footer = phase === 'concept' ? (
    <div className="btn-row">
      <button type="button" className="btn btn--primary" onClick={onComplete} autoFocus>
        Lanjutkan penyelidikan <Icon name="chevronRight" size={18} />
      </button>
    </div>
  ) : null;

  return (
    <Modal
      title={challenge.title}
      eyebrow={`Analisis ${challenge.subject}${total > 1 ? ` · Bagian ${Math.min(partIdx + 1, total)} dari ${total}` : ''}`}
      onClose={onClose}
      closeLabel="Tutup analisis (kemajuanmu tersimpan)"
      variant="full"
      className={`challenge challenge--${challenge.subject.replace(/\s+/g, '-').toLowerCase()}`}
      footer={footer}
    >
      <div className="challenge__layout">
        <aside className="challenge__evidence" aria-label="Bukti terkait">
          <details open className="evidence-peek">
            <summary><Icon name={ev.icon} size={18} /> Bukti terkait: {ev.title}</summary>
            <DocumentView doc={ev.doc} compact />
          </details>
        </aside>

        <section className="challenge__main">
          <p className="subject-tag"><Icon name={SUBJECT_ICON[challenge.subject] || 'sparkles'} size={16} /> {challenge.subject}</p>

          {phase === 'concept' ? (
            <div className="concept" role="status">
              <p className="concept__badge"><Icon name="check" size={18} strokeWidth={2.5} /> Analisis selesai</p>
              <h3 className="concept__title">{challenge.concept.title}</h3>
              <p className="concept__body">{challenge.concept.body}</p>
              <div className="case-link">
                <p className="case-link__label"><Icon name="link" size={16} /> Bagaimana ini membantu kasus</p>
                <p>{challenge.caseLink}</p>
              </div>
            </div>
          ) : (
            <>
              {partIdx === 0 ? <p className="challenge__intro">{challenge.intro}</p> : null}
              {total > 1 ? (
                <ol className="part-dots" aria-hidden="true">
                  {challenge.parts.map((_, i) => (
                    <li key={i} className={rec.parts[i] && rec.parts[i].solved ? 'is-done' : i === partIdx ? 'is-current' : ''} />
                  ))}
                </ol>
              ) : null}

              <form onSubmit={check} className="question">
                <fieldset disabled={phase === 'part-done'}>
                  <legend className="question__prompt">{part.prompt}</legend>

                  {part.type === 'number' ? (
                    <div className="number-field">
                      <label htmlFor={`ans-${challenge.id}-${partIdx}`} className="sr-only">Jawaban dalam {part.unit}</label>
                      <input
                        id={`ans-${challenge.id}-${partIdx}`}
                        className="field field--big"
                        inputMode="decimal"
                        autoComplete="off"
                        value={value}
                        onChange={(e) => { setValue(e.target.value); if (feedback && feedback.kind === 'invalid') setFeedback(null); }}
                        placeholder="0"
                        autoFocus
                      />
                      <span className="number-field__unit">{part.unit}</span>
                    </div>
                  ) : null}

                  {part.type === 'choice' ? (
                    <div className="options" role="radiogroup">
                      {part.options.map((o, i) => (
                        <label key={o.id} className={`option ${value === o.id ? 'is-picked' : ''}`}>
                          <input type="radio" name={`q-${challenge.id}-${partIdx}`} value={o.id} checked={value === o.id} onChange={() => { setValue(o.id); setFeedback(null); }} />
                          <span className="option__key mono" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                          <span>{o.text}</span>
                        </label>
                      ))}
                    </div>
                  ) : null}

                  {part.type === 'multi' ? (
                    <div className="options">
                      {part.options.map((o) => {
                        const on = multi.includes(o.id);
                        return (
                          <label key={o.id} className={`option option--multi ${on ? 'is-picked' : ''}`}>
                            <input type="checkbox" checked={on} onChange={() => { setMulti(on ? multi.filter((x) => x !== o.id) : [...multi, o.id]); setFeedback(null); }} />
                            <span className="option__box" aria-hidden="true">{on ? <Icon name="check" size={14} strokeWidth={3} /> : null}</span>
                            <span>{o.text}</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : null}
                </fieldset>

                {pr.hints > 0 ? (
                  <ol className="hints" aria-label="Petunjuk">
                    {part.hints.slice(0, pr.hints).map((h, i) => (
                      <li key={h}><span className="hints__label mono">Petunjuk {i + 1}</span> {h}</li>
                    ))}
                  </ol>
                ) : null}

                <div className="feedback-slot" aria-live="polite">
                  {feedback ? (
                    <div className={`feedback feedback--${feedback.kind}`}>
                      <Icon name={feedback.kind === 'right' ? 'check' : feedback.kind === 'revealed' ? 'eye' : 'alert'} size={20} />
                      <div>
                        <p className="feedback__title">
                          {feedback.kind === 'right' ? 'Tepat!' : feedback.kind === 'revealed' ? 'Jawaban dibuka' : feedback.kind === 'invalid' ? 'Periksa isianmu' : 'Belum tepat'}
                        </p>
                        <p>{feedback.text}</p>
                        {feedback.kind === 'wrong' ? <p className="feedback__retry">Baca lagi buktinya, lalu coba sekali lagi.</p> : null}
                      </div>
                    </div>
                  ) : null}
                </div>

                {phase === 'question' ? (
                  <div className="btn-row btn-row--wrap">
                    <button type="submit" className="btn btn--primary"><Icon name="check" size={18} /> Periksa jawaban</button>
                    <button type="button" className="btn btn--ghost" onClick={hint} disabled={pr.hints >= part.hints.length}>
                      <Icon name="lightbulb" size={18} /> {pr.hints >= part.hints.length ? 'Semua petunjuk sudah dibuka' : `Minta petunjuk (${pr.hints}/${part.hints.length})`}
                    </button>
                    {canReveal && !askReveal ? (
                      <button type="button" className="btn btn--link" onClick={() => setAskReveal(true)}>Tunjukkan jawaban</button>
                    ) : null}
                  </div>
                ) : (
                  <div className="btn-row">
                    <button type="button" className="btn btn--primary" onClick={nextPart} autoFocus>
                      {partIdx + 1 < total ? 'Bagian berikutnya' : 'Lihat konsepnya'} <Icon name="chevronRight" size={18} />
                    </button>
                  </div>
                )}

                {askReveal ? (
                  <div className="reveal-confirm" role="alertdialog" aria-label="Konfirmasi buka jawaban">
                    <p>Yakin ingin melihat jawabannya? Kamu tetap bisa lanjut, tapi poin untuk bagian ini berkurang. Coba baca petunjuk sekali lagi dulu?</p>
                    <div className="btn-row">
                      <button type="button" className="btn btn--ghost btn--small" onClick={() => setAskReveal(false)}>Coba lagi dulu</button>
                      <button type="button" className="btn btn--danger btn--small" onClick={reveal}>Ya, tunjukkan</button>
                    </div>
                  </div>
                ) : null}
              </form>
            </>
          )}
        </section>
      </div>
    </Modal>
  );
}
