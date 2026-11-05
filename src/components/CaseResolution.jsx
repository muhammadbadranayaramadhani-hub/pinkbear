import { useState } from 'react';
import Icon from './Icon.jsx';
import { collectedEvidence } from '../engines/EvidenceEngine.js';
import { evaluateConclusion } from '../engines/PuzzleEngine.js';

const STEPS = ['Tinjau bukti', 'Pilih penyebab', 'Bukti pendukung', 'Jelaskan & ajukan'];

// Penyelesaian kasus: pemain meninjau bukti, memilih penyebab, memilih bukti pendukung, dan membuktikan dengan angka.
export default function CaseResolution({ caseData, cs, dispatch, onBack, onOpenJournal }) {
  const f = caseData.final;
  const items = collectedEvidence(caseData, cs);
  const [step, setStep] = useState(0);
  const [cause, setCause] = useState('');
  const [picked, setPicked] = useState([]);
  const [eq, setEq] = useState({ increase: '', sessions: '', perSession: '' });
  const [reasoning, setReasoning] = useState('');
  const [result, setResult] = useState(null);

  function submit(e) {
    e.preventDefault();
    const submission = { cause, evidence: picked, ...eq, reasoning };
    const res = evaluateConclusion(caseData, submission, cs);
    dispatch({ type: 'FINAL_ATTEMPT' });
    setResult(res);
    if (res.ok) {
      dispatch({ type: 'FINAL_SOLVED', submission, notes: res.notes });
    }
  }

  const canNext = [true, !!cause, picked.length > 0, true][step];

  return (
    <div className="resolution">
      <header className="board-head">
        <button type="button" className="btn btn--ghost btn--small" onClick={onBack}><Icon name="arrowLeft" size={16} /> Kembali menjelajah</button>
        <div className="board-head__titles">
          <p className="eyebrow eyebrow--gold">Kesimpulan akhir · {caseData.id}</p>
          <h1 className="page-title">Ungkap Kebenaran</h1>
          <p className="board-head__help">Kesimpulanmu dinilai dari buktinya, bukan hanya dari pilihan jawaban.</p>
        </div>
      </header>

      <ol className="wizard-steps" aria-label="Langkah kesimpulan">
        {STEPS.map((s, i) => (
          <li key={s} className={`${i === step ? 'is-current' : ''} ${i < step ? 'is-done' : ''}`} aria-current={i === step ? 'step' : undefined}>
            <span className="wizard-steps__n mono">{i + 1}</span> <span className="wizard-steps__label">{s}</span>
          </li>
        ))}
      </ol>

      <form className="resolution__card" onSubmit={submit}>
        {step === 0 ? (
          <section aria-labelledby="r-review">
            <h2 id="r-review" className="resolution__q">Baca lagi semua bukti yang kamu kumpulkan.</h2>
            <p className="resolution__help">Perhatikan angka-angkanya. Penjelasan yang benar harus cocok dengan semua bukti.</p>
            <ul className="review-list">
              {items.map((ev) => (
                <li key={ev.id} className="review-item">
                  <p className="review-item__title"><Icon name={ev.icon} size={18} /> {ev.title}</p>
                  <ul>
                    {ev.facts.map((x) => <li key={x.label}><span>{x.label}</span> <strong>{x.value}</strong></li>)}
                  </ul>
                </li>
              ))}
            </ul>
            <button type="button" className="btn btn--ghost btn--small" onClick={onOpenJournal}><Icon name="book" size={16} /> Buka dokumen lengkap di Jurnal</button>
          </section>
        ) : null}

        {step === 1 ? (
          <fieldset>
            <legend className="resolution__q">{f.question}</legend>
            <div className="options">
              {f.options.map((o, i) => (
                <label key={o.id} className={`option ${cause === o.id ? 'is-picked' : ''}`}>
                  <input type="radio" name="cause" value={o.id} checked={cause === o.id} onChange={() => { setCause(o.id); setResult(null); }} />
                  <span className="option__key mono" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                  <span>{o.text}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset>
            <legend className="resolution__q">Bukti mana saja yang mendukung kesimpulanmu?</legend>
            <p className="resolution__help">Pilih bukti yang menunjukkan berapa kenaikannya, dari mana air tambahan berasal, dan bukti yang menolak penjelasan lain.</p>
            <div className="options options--grid">
              {items.map((ev) => {
                const on = picked.includes(ev.id);
                return (
                  <label key={ev.id} className={`option option--multi ${on ? 'is-picked' : ''}`}>
                    <input type="checkbox" checked={on} onChange={() => { setPicked(on ? picked.filter((x) => x !== ev.id) : [...picked, ev.id]); setResult(null); }} />
                    <span className="option__box" aria-hidden="true">{on ? <Icon name="check" size={14} strokeWidth={3} /> : null}</span>
                    <span><strong>{ev.title}</strong><br /><small>{ev.facts[0].label}: {ev.facts[0].value}</small></span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <section aria-labelledby="r-explain">
            <h2 id="r-explain" className="resolution__q">Buktikan dengan angka.</h2>
            <p className="resolution__help">Lengkapi persamaan yang menghubungkan kenaikan pemakaian air dengan penyiraman tambahan.</p>
            <div className="equation">
              <label className="eq-field">
                <span className="eq-field__label">Kenaikan</span>
                <input className="field field--eq" inputMode="numeric" value={eq.increase} onChange={(e) => { setEq({ ...eq, increase: e.target.value }); setResult(null); }} aria-label="Kenaikan pemakaian air dalam liter" placeholder="?" />
                <span className="eq-field__unit">liter</span>
              </label>
              <span className="eq-op" aria-hidden="true">=</span>
              <label className="eq-field">
                <span className="eq-field__label">Banyak sesi</span>
                <input className="field field--eq" inputMode="numeric" value={eq.sessions} onChange={(e) => { setEq({ ...eq, sessions: e.target.value }); setResult(null); }} aria-label="Banyak sesi penyiraman tambahan" placeholder="?" />
                <span className="eq-field__unit">sesi</span>
              </label>
              <span className="eq-op" aria-hidden="true">×</span>
              <label className="eq-field">
                <span className="eq-field__label">Per sesi</span>
                <input className="field field--eq" inputMode="numeric" value={eq.perSession} onChange={(e) => { setEq({ ...eq, perSession: e.target.value }); setResult(null); }} aria-label="Liter air per sesi" placeholder="?" />
                <span className="eq-field__unit">liter</span>
              </label>
            </div>
            <label className="reasoning">
              <span className="reasoning__label">Tuliskan alasanmu dengan kata-katamu sendiri <span className="muted">(opsional, tapi sangat dianjurkan)</span></span>
              <textarea
                id="reasoning"
                className="field"
                rows={3}
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                placeholder="Contoh: Pemakaian air naik … liter karena …"
              />
            </label>
          </section>
        ) : null}

        <div className="feedback-slot" aria-live="polite">
          {result && !result.ok ? (
            <div className="feedback feedback--wrong">
              <Icon name="alert" size={20} />
              <div>
                <p className="feedback__title">Kesimpulan belum bisa diterima</p>
                <ul className="issues">
                  {result.issues.map((it) => (
                    <li key={it.title}>
                      <strong>{it.title}.</strong> {it.message}{' '}
                      <button type="button" className="btn btn--link" onClick={() => { setStep(it.step); }}>Perbaiki di langkah {it.step + 1}</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        <div className="btn-row resolution__nav">
          {step > 0 ? <button type="button" className="btn btn--ghost" onClick={() => setStep(step - 1)}><Icon name="chevronLeft" size={18} /> Sebelumnya</button> : <span />}
          {step < 3 ? (
            <button type="button" className="btn btn--primary" disabled={!canNext} onClick={() => setStep(step + 1)}>
              Berikutnya <Icon name="chevronRight" size={18} />
            </button>
          ) : (
            <button type="submit" className="btn btn--gold btn--big"><Icon name="gavel" size={18} /> Ajukan kesimpulan</button>
          )}
        </div>
        {step < 3 && !canNext ? <p className="resolution__need">{step === 1 ? 'Pilih satu penjelasan untuk melanjutkan.' : 'Pilih minimal satu bukti untuk melanjutkan.'}</p> : null}
      </form>
    </div>
  );
}
