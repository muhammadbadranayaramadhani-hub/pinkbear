// Menampilkan dokumen bukti di atas "kertas": tabel, jadwal, daftar periksa, kesaksian, pengumuman, catatan.

export default function DocumentView({ doc, compact = false }) {
  if (!doc) return null;
  const cls = `paper paper--${doc.kind} ${compact ? 'paper--compact' : ''}`;

  if (doc.kind === 'note') {
    return (
      <div className={cls}>
        {doc.lines.map((l) => <p key={l} className="paper__hand">{l}</p>)}
        <p className="paper__sign paper__hand">{doc.sign}</p>
      </div>
    );
  }

  return (
    <div className={cls}>
      <header className="paper__head">
        <p className="paper__heading">{doc.heading}</p>
        {doc.sub ? <p className="paper__sub">{doc.sub}</p> : null}
        {doc.witness ? <p className="paper__sub">{doc.witness}</p> : null}
      </header>

      {doc.kind === 'table' ? (
        <div className="paper__table-wrap">
          <table className="paper__table">
            <thead><tr>{doc.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
            <tbody>
              {doc.rows.map((r) => (
                <tr key={r.cells.join('|')} className={r.mark ? 'is-marked' : ''}>
                  {r.cells.map((cell, i) => <td key={i} className={i === r.cells.length - 1 ? 'num' : ''}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {doc.kind === 'schedule' ? (
        <div className="paper__sections">
          {doc.sections.map((s) => (
            <section key={s.title} className={`paper__section ${s.mark ? 'is-marked' : ''}`}>
              <p className="paper__section-title">{s.title}</p>
              {s.note ? <p className="paper__note">{s.note}</p> : null}
              <table className="paper__table">
                <tbody>
                  {s.rows.map((r) => (
                    <tr key={r.time}>
                      <td className="mono">{r.time}</td>
                      <td>{r.label}</td>
                      <td className="num">{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      ) : null}

      {doc.kind === 'checklist' ? (
        <ul className="paper__checklist">
          {doc.items.map((it) => (
            <li key={it.text}>
              <span className="paper__tick" aria-hidden="true">✓</span>
              <span><strong>{it.text}</strong><br />{it.result}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {doc.kind === 'statement' ? (
        <ol className="paper__sentences">
          {doc.sentences.map((s, i) => (
            <li key={s}><span className="paper__num mono">({i + 1})</span> {s}</li>
          ))}
        </ol>
      ) : null}

      {doc.kind === 'notice' ? (
        <div className="paper__notice">
          {doc.lines.map((l, i) => <p key={l} className={i === 0 ? 'mono' : ''}>{l}</p>)}
        </div>
      ) : null}

      {doc.note && doc.kind !== 'checklist' ? <p className="paper__note">{doc.note}</p> : null}
      {doc.note && doc.kind === 'checklist' ? <p className="paper__hand paper__margin">{doc.note}</p> : null}
      {doc.sign ? <p className="paper__sign">{doc.sign}</p> : null}
    </div>
  );
}
