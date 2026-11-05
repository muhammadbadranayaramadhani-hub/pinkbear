import { useLayoutEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import Modal from './Modal.jsx';
import { collectedEvidence, evaluateRelationship, getConnection, relationshipOptions } from '../engines/EvidenceEngine.js';

function RelationshipDialog({ caseData, cs, a, b, onClose, onResult }) {
  const evA = caseData.evidence[a];
  const evB = caseData.evidence[b];
  const conn = getConnection(caseData, a, b);
  // Dihitung sekali saat dialog dibuka, agar umpan balik keberhasilan tetap terlihat.
  const [already] = useState(() => !!(conn && cs.connections.includes(conn.id)));
  const options = relationshipOptions(caseData, a, b);
  const [picked, setPicked] = useState('');
  const [result, setResult] = useState(null);

  function check(e) {
    e.preventDefault();
    const res = evaluateRelationship(caseData, a, b, picked);
    if (!picked) {
      setResult({ ...res, invalid: true });
      return;
    }
    setResult(res);
    onResult(res);
  }

  const done = result && result.correct;
  const correctText = conn ? conn.options.find((o) => o.correct).text : null;

  return (
    <Modal
      title="Hubungkan dua bukti"
      eyebrow="Papan Bukti · alasan"
      onClose={onClose}
      variant="drawer"
      className="relation"
      footer={
        <div className="btn-row">
          {done || already ? (
            <button type="button" className="btn btn--primary" onClick={onClose} autoFocus>Kembali ke papan</button>
          ) : (
            <>
              <button type="button" className="btn btn--ghost" onClick={onClose}>Pilih bukti lain</button>
              <button type="submit" form="relation-form" className="btn btn--primary"><Icon name="link" size={18} /> Periksa hubungan</button>
            </>
          )}
        </div>
      }
    >
      <div className="relation__pair">
        <div className="mini-card"><Icon name={evA.icon} size={18} /><span>{evA.title}</span></div>
        <span className="relation__thread" aria-hidden="true"><Icon name="thread" size={28} /></span>
        <div className="mini-card"><Icon name={evB.icon} size={18} /><span>{evB.title}</span></div>
      </div>

      {already ? (
        <div className="feedback feedback--right">
          <Icon name="check" size={20} />
          <div>
            <p className="feedback__title">Benang ini sudah terhubung: {conn.title}</p>
            <p>{correctText}</p>
          </div>
        </div>
      ) : (
        <form id="relation-form" onSubmit={check}>
          <fieldset disabled={done}>
            <legend className="question__prompt">Bagaimana kedua bukti ini berhubungan? Pilih alasan yang paling didukung isi bukti.</legend>
            <div className="options">
              {options.map((o, i) => (
                <label key={o.id} className={`option ${picked === o.id ? 'is-picked' : ''}`}>
                  <input type="radio" name="relation" value={o.id} checked={picked === o.id} onChange={() => { setPicked(o.id); setResult(null); }} />
                  <span className="option__key mono" aria-hidden="true">{String.fromCharCode(65 + i)}</span>
                  <span>{o.text}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="feedback-slot" aria-live="polite">
            {result ? (
              <div className={`feedback feedback--${result.invalid ? 'invalid' : result.correct ? 'right' : 'wrong'}`}>
                <Icon name={result.correct ? 'check' : 'alert'} size={20} />
                <div>
                  <p className="feedback__title">
                    {result.invalid ? 'Pilih alasan dulu' : result.correct ? (result.counts ? `Benang merah ditemukan: ${conn.title}` : 'Penalaran yang jernih') : 'Alasan ini belum didukung bukti'}
                  </p>
                  <p>{result.feedback}</p>
                  {!result.correct && !result.invalid ? <p className="feedback__retry">Buka lagi kedua bukti di Jurnal dan bandingkan angkanya.</p> : null}
                </div>
              </div>
            ) : null}
          </div>
        </form>
      )}
    </Modal>
  );
}

export default function EvidenceBoard({ caseData, cs, dispatch, onBack }) {
  const items = collectedEvidence(caseData, cs);
  const [sel, setSel] = useState([]);
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState([]);
  const boardRef = useRef(null);
  const cardRefs = useRef({});

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return undefined;
    function measure() {
      const box = board.getBoundingClientRect();
      const out = cs.connections.map((id) => {
        const c = caseData.connections.find((x) => x.id === id);
        const ea = cardRefs.current[c.a];
        const eb = cardRefs.current[c.b];
        if (!ea || !eb) return null;
        const ra = ea.getBoundingClientRect();
        const rb = eb.getBoundingClientRect();
        return {
          id,
          key: c.key,
          x1: ra.left + ra.width / 2 - box.left,
          y1: ra.top + 18 - box.top,
          x2: rb.left + rb.width / 2 - box.left,
          y2: rb.top + 18 - box.top,
        };
      }).filter(Boolean);
      setLines(out);
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(board);
    return () => ro.disconnect();
  }, [cs.connections, items.length, caseData]);

  function toggle(id) {
    setSel((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      if (s.length === 2) return [s[1], id];
      return [...s, id];
    });
  }

  const required = caseData.objectives.find((o) => o.action && o.action.screen === 'board');
  const keyFound = cs.connections.includes('c-laporan-jadwal');
  const linkCount = (id) => cs.connections.filter((cid) => {
    const c = caseData.connections.find((x) => x.id === cid);
    return c.a === id || c.b === id;
  }).length;

  return (
    <div className="board-screen">
      <header className="board-head">
        <button type="button" className="btn btn--ghost btn--small" onClick={onBack}><Icon name="arrowLeft" size={16} /> Kembali menjelajah</button>
        <div className="board-head__titles">
          <p className="eyebrow eyebrow--gold">Papan Bukti</p>
          <h1 className="page-title">Hubungkan Petunjuk</h1>
          <p className="board-head__help">Pilih dua kartu bukti, lalu jelaskan hubungan keduanya. Tidak semua bukti saling berhubungan.</p>
        </div>
        <dl className="board-stats">
          <div><dt>Benang ditemukan</dt><dd className="mono">{cs.connections.length}/{caseData.connections.length}</dd></div>
          <div><dt>Asal 360 liter</dt><dd>{keyFound ? <><Icon name="check" size={14} /> Terhubung</> : 'Belum'}</dd></div>
        </dl>
      </header>

      {items.length < 2 ? (
        <div className="empty-note">
          <Icon name="board" size={28} />
          <p>Papan masih kosong. Kumpulkan minimal dua bukti untuk mulai menghubungkan petunjuk.</p>
          <button type="button" className="btn btn--primary" onClick={onBack}>Kembali menjelajah</button>
        </div>
      ) : (
        <div className="board" ref={boardRef}>
          <svg className="board__threads" aria-hidden="true">
            {lines.map((l) => (
              <g key={l.id}>
                <path d={`M${l.x1} ${l.y1} Q${(l.x1 + l.x2) / 2} ${Math.min(l.y1, l.y2) - 22 - Math.min(40, Math.abs(l.x2 - l.x1) / 12)} ${l.x2} ${l.y2}`} className={`thread ${l.key ? 'thread--key' : ''}`} />
              </g>
            ))}
          </svg>
          <ul className="board__cards">
            {items.map((ev) => {
              const idx = sel.indexOf(ev.id);
              const links = linkCount(ev.id);
              return (
                <li key={ev.id}>
                  <button
                    type="button"
                    ref={(el) => { cardRefs.current[ev.id] = el; }}
                    className={`ev-card ${idx >= 0 ? 'is-selected' : ''}`}
                    onClick={() => toggle(ev.id)}
                    aria-pressed={idx >= 0}
                  >
                    <span className="ev-card__pin" aria-hidden="true" />
                    {idx >= 0 ? <span className="ev-card__order" aria-hidden="true">{idx + 1}</span> : null}
                    <span className="ev-card__head"><Icon name={ev.icon} size={18} /> <span className="ev-card__title">{ev.title}</span></span>
                    <span className="ev-card__facts">
                      {ev.facts.slice(0, 2).map((f) => <span key={f.label}><b>{f.label}:</b> {f.value}</span>)}
                    </span>
                    <span className="ev-card__foot mono">
                      {links ? <><Icon name="link" size={12} /> {links} benang</> : 'Belum terhubung'}
                      {idx >= 0 ? <span className="sr-only"> · dipilih sebagai bukti {idx + 1}</span> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="board-tray" aria-live="polite">
        <p>
          {sel.length === 0 ? 'Pilih kartu bukti pertama.' : sel.length === 1 ? `Bukti 1: ${caseData.evidence[sel[0]].short}. Sekarang pilih bukti kedua.` : `Siap menghubungkan: ${caseData.evidence[sel[0]].short} + ${caseData.evidence[sel[1]].short}`}
        </p>
        <div className="btn-row">
          {sel.length ? <button type="button" className="btn btn--ghost btn--small" onClick={() => setSel([])}>Batal pilih</button> : null}
          <button type="button" className="btn btn--primary btn--small" disabled={sel.length !== 2} onClick={() => setOpen(true)}>
            <Icon name="link" size={16} /> Jelaskan hubungannya
          </button>
        </div>
      </div>

      {cs.connections.length ? (
        <section className="threads-found" aria-labelledby="threads-title">
          <h2 id="threads-title" className="section-title">Benang merah yang sudah ditemukan</h2>
          <ol>
            {cs.connections.map((id) => {
              const c = caseData.connections.find((x) => x.id === id);
              return (
                <li key={id} className={c.key ? 'is-key' : ''}>
                  <p className="threads-found__title"><Icon name="link" size={14} /> {c.title} <span className="mono">· {caseData.evidence[c.a].short} + {caseData.evidence[c.b].short}</span></p>
                  <p>{c.options.find((o) => o.correct).text}</p>
                </li>
              );
            })}
          </ol>
          {required ? <p className="threads-found__note">Target tujuan: minimal 3 benang, termasuk “Asal 360 liter”.</p> : null}
        </section>
      ) : null}

      {open && sel.length === 2 ? (
        <RelationshipDialog
          caseData={caseData}
          cs={cs}
          a={sel[0]}
          b={sel[1]}
          onClose={() => { setOpen(false); setSel([]); }}
          onResult={(res) => dispatch({ type: 'CONNECT_RESULT', correct: res.correct, counts: res.counts, connectionId: res.connectionId })}
        />
      ) : null}
    </div>
  );
}
