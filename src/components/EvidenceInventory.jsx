import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import Icon from './Icon.jsx';
import DocumentView from './DocumentView.jsx';
import { isChallengeAvailable, isChallengeSolved } from '../engines/InvestigationEngine.js';

// Jurnal Detektif: semua bukti yang sudah ditemukan, dan slot kosong untuk yang belum.
export default function EvidenceInventory({ caseData, cs, onClose, onChallenge, onMarkSeen, initial }) {
  const firstCollected = caseData.evidenceOrder.find((id) => cs.evidence.includes(id));
  const [selected, setSelected] = useState(initial || cs.unseen[0] || firstCollected || null);
  const [mobileDetail, setMobileDetail] = useState(!!initial);

  useEffect(() => {
    if (selected && cs.unseen.includes(selected)) onMarkSeen(selected);
  }, [selected, cs.unseen, onMarkSeen]);

  const ev = selected ? caseData.evidence[selected] : null;
  const relatedChallenge = ev ? Object.values(caseData.challenges).find((c) => c.evidence === ev.id) : null;

  return (
    <Modal
      title="Jurnal Detektif"
      eyebrow={`${caseData.id} · ${cs.evidence.length}/${caseData.evidenceOrder.length} bukti`}
      onClose={onClose}
      variant="full"
      className="journal"
    >
      <div className={`journal__layout ${mobileDetail ? 'show-detail' : ''}`}>
        <ol className="journal__list" aria-label="Daftar bukti">
          {caseData.evidenceOrder.map((id, i) => {
            const e = caseData.evidence[id];
            const has = cs.evidence.includes(id);
            const locOpen = cs.unlockedLocations.includes(e.location);
            if (!has) {
              return (
                <li key={id} className="journal__slot is-empty">
                  <span className="journal__no mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="journal__slot-text">
                    <span className="journal__slot-title">Belum ditemukan</span>
                    <span className="journal__slot-meta">{locOpen ? `Mungkin ada di ${caseData.locations[e.location].name}` : 'Lokasi belum terbuka'}</span>
                  </span>
                  <Icon name="lock" size={16} />
                </li>
              );
            }
            return (
              <li key={id}>
                <button
                  type="button"
                  className={`journal__slot ${selected === id ? 'is-selected' : ''}`}
                  onClick={() => { setSelected(id); setMobileDetail(true); }}
                  aria-current={selected === id ? 'true' : undefined}
                >
                  <span className="journal__no mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="journal__slot-icon" aria-hidden="true"><Icon name={e.icon} size={20} /></span>
                  <span className="journal__slot-text">
                    <span className="journal__slot-title">{e.title}</span>
                    <span className="journal__slot-meta">{caseData.locations[e.location].name}</span>
                  </span>
                  {cs.unseen.includes(id) ? <span className="new-tag">Baru</span> : <Icon name="chevronRight" size={16} />}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="journal__detail">
          {ev ? (
            <article aria-labelledby="ev-title">
              <button type="button" className="btn btn--ghost btn--small journal__back" onClick={() => setMobileDetail(false)}>
                <Icon name="arrowLeft" size={16} /> Semua bukti
              </button>
              <p className="eyebrow">Bukti · tersimpan</p>
              <h3 id="ev-title" className="journal__title">{ev.title}</h3>
              <p className="journal__summary">{ev.summary}</p>
              <dl className="meta-list meta-list--row">
                <div><dt>Sumber</dt><dd>{ev.source}</dd></div>
                <div><dt>Status</dt><dd><Icon name="check" size={14} /> Sudah dikumpulkan</dd></div>
              </dl>
              <h4 className="section-title">Fakta penting</h4>
              <dl className="facts">
                {ev.facts.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
              </dl>
              <DocumentView doc={ev.doc} />
              {relatedChallenge && isChallengeAvailable(caseData, cs, relatedChallenge.id) && !isChallengeSolved(cs, relatedChallenge.id) ? (
                <button type="button" className="btn btn--gold" onClick={() => onChallenge(relatedChallenge.id)}>
                  <Icon name="lightbulb" size={18} /> Analisis bukti ini: {relatedChallenge.title}
                </button>
              ) : null}
              {relatedChallenge && isChallengeSolved(cs, relatedChallenge.id) ? (
                <p className="done-pill"><Icon name="check" size={16} /> Analisis “{relatedChallenge.title}” selesai</p>
              ) : null}
            </article>
          ) : (
            <div className="empty-note">
              <Icon name="search" size={28} />
              <p>Jurnalmu masih kosong. Periksa objek di lokasi, lalu tekan <strong>Simpan ke Jurnal</strong> saat menemukan bukti.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
