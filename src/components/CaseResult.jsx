import Icon from './Icon.jsx';
import ProgressPanel from './ProgressPanel.jsx';

function Stars({ n }) {
  return (
    <span className="stars stars--big" aria-label={`${n} dari 3 bintang`}>
      {[1, 2, 3].map((i) => <Icon key={i} name="star" size={28} className={i <= n ? 'is-on' : ''} />)}
    </span>
  );
}

// Laporan akhir kasus: apa yang terjadi, bukti pendukung, konsep yang dipelajari, dan kinerja.
export default function CaseResult({ caseData, cs, state, onArchive, onRestart, onMenu }) {
  const f = caseData.final;
  const r = cs.result;
  if (!r) return null;
  const s = r.stats;
  const sub = r.submission;
  const chosen = f.options.find((o) => o.id === sub.cause);

  const perf = [
    { label: 'Bukti ditemukan', value: `${s.evidence}/${s.evidenceTotal}` },
    { label: 'Objek diperiksa', value: `${s.inspected}/${s.inspectTotal}` },
    { label: 'Analisis tanpa bantuan', value: `${s.cleanChallenges}/${s.challengesTotal}` },
    { label: 'Petunjuk dibuka', value: s.hints },
    { label: 'Benang merah', value: `${s.connections}/${s.connectionsTotal}` },
    { label: 'Percobaan kesimpulan', value: s.finalAttempts },
  ];

  return (
    <main className="result">
      <div className="result__inner">
        <header className="result__head">
          <div className="stamp" aria-hidden="true">Terpecahkan</div>
          <p className="eyebrow eyebrow--gold mono">{caseData.id} · Laporan Kasus</p>
          <h1 className="page-title page-title--xl">{caseData.title}</h1>
          <div className="result__rating">
            <Stars n={r.rating.stars} />
            <p className="result__rating-title">{r.rating.title}</p>
          </div>
          <p className="result__msg">{r.rating.message}</p>
        </header>

        <section className="result__section" aria-labelledby="what">
          <h2 id="what" className="section-title">Yang sebenarnya terjadi</h2>
          <p className="result__summary">{f.summary}</p>
          <figure className="balance" aria-label="Perbandingan: kenaikan 360 liter sama dengan dua sesi penyiraman 180 liter">
            <div className="balance__row">
              <span className="balance__label">Kenaikan di laporan<br /><span className="mono">1.560 − 1.200</span></span>
              <span className="balance__bar"><span className="bal-seg bal-seg--total">360 L</span></span>
            </div>
            <div className="balance__row">
              <span className="balance__label">Sesi tambahan<br /><span className="mono">2 × 180</span></span>
              <span className="balance__bar"><span className="bal-seg bal-seg--a">180 L</span><span className="bal-seg bal-seg--b">180 L</span></span>
            </div>
            <figcaption>Panjang kedua batang sama: seluruh kenaikan terjelaskan oleh penyiraman tambahan.</figcaption>
          </figure>
        </section>

        <div className="result__cols">
          <section className="result__section" aria-labelledby="yours">
            <h2 id="yours" className="section-title">Kesimpulanmu</h2>
            <dl className="facts">
              <div><dt>Penyebab</dt><dd>{chosen ? chosen.text : '-'}</dd></div>
              <div><dt>Persamaan</dt><dd className="mono">{sub.increase} L = {sub.sessions} sesi × {sub.perSession} L</dd></div>
              <div><dt>Bukti yang kamu ajukan</dt><dd>{sub.evidence.map((id) => caseData.evidence[id].short).join(', ')}</dd></div>
              {sub.reasoning ? <div><dt>Alasanmu</dt><dd className="quote">“{sub.reasoning}”</dd></div> : null}
            </dl>
            {r.notes && r.notes.length ? <p className="thought"><Icon name="lightbulb" size={18} /> {r.notes[0]}</p> : null}
          </section>

          <section className="result__section" aria-labelledby="support">
            <h2 id="support" className="section-title">Bukti yang mendukung</h2>
            <ul className="support-list">
              {f.support.map((x) => {
                const found = cs.evidence.includes(x.evidence);
                return (
                  <li key={x.evidence} className={found ? 'is-found' : 'is-missed'}>
                    <Icon name={found ? 'check' : 'search'} size={16} />
                    <span><strong>{caseData.evidence[x.evidence].title}</strong> <span className="muted">{found ? '' : '(belum kamu temukan)'}</span><br />{x.reason}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <section className="result__section" aria-labelledby="learned">
          <h2 id="learned" className="section-title">Konsep yang kamu gunakan</h2>
          <ul className="concepts">
            {f.concepts.map((c) => (
              <li key={c.text}><span className="chip chip--subject">{c.subject}</span> {c.text}</li>
            ))}
          </ul>
        </section>

        <section className="result__section" aria-labelledby="perf">
          <h2 id="perf" className="section-title">Kinerja penyelidikan</h2>
          <dl className="perf">
            {perf.map((p) => <div key={p.label}><dt>{p.label}</dt><dd className="mono">{p.value}</dd></div>)}
            <div className="perf__kp"><dt>Poin Pengetahuan kasus ini</dt><dd className="mono">{cs.kp}</dd></div>
          </dl>
        </section>

        <ProgressPanel state={state} compact />

        <div className="btn-row btn-row--wrap result__actions">
          <button type="button" className="btn btn--primary" onClick={onArchive}><Icon name="archive" size={18} /> Kembali ke Arsip</button>
          <button type="button" className="btn btn--ghost" onClick={onRestart}><Icon name="restart" size={18} /> Ulangi kasus</button>
          <button type="button" className="btn btn--ghost" onClick={onMenu}><Icon name="door" size={18} /> Menu utama</button>
        </div>
      </div>
    </main>
  );
}
