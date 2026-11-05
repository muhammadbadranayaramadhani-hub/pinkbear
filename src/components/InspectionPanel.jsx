import Modal from './Modal.jsx';
import Icon from './Icon.jsx';
import DocumentView from './DocumentView.jsx';
import { hotspotState, isChallengeAvailable, isChallengeSolved } from '../engines/InvestigationEngine.js';

export default function InspectionPanel({ hotspot, caseData, cs, onClose, onCollect, onChallenge, onInterview }) {
  const status = hotspotState(hotspot, cs);
  const ev = hotspot.evidence ? caseData.evidence[hotspot.evidence] : null;
  const loc = caseData.locations[hotspot.location];
  const act = hotspot.action;
  const actAvailable = act && isChallengeAvailable(caseData, cs, act.challenge);
  const actSolved = act && isChallengeSolved(cs, act.challenge);
  const interviewed = hotspot.kind === 'interview' && (ev ? status.collected : cs.flags.talkedDarto);

  let statusChip = { text: 'Diperiksa', icon: 'eye' };
  if (hotspot.kind === 'evidence') statusChip = status.collected ? { text: 'Bukti tersimpan', icon: 'check' } : { text: 'Bukti dapat diambil', icon: 'fileText' };
  if (hotspot.kind === 'interview') statusChip = interviewed ? { text: 'Sudah diwawancarai', icon: 'check' } : { text: 'Saksi', icon: 'message' };
  if (hotspot.kind === 'info') statusChip = { text: 'Informasi latar', icon: 'info' };

  const footer = (
    <div className="btn-row btn-row--stack-sm">
      {hotspot.kind === 'evidence' && !status.collected ? (
        <button type="button" className="btn btn--primary" onClick={() => onCollect(ev.id)}>
          <Icon name="book" size={18} /> Simpan ke Jurnal
        </button>
      ) : null}
      {hotspot.kind === 'evidence' && status.collected ? (
        <span className="done-pill"><Icon name="check" size={16} /> Tersimpan di Jurnal</span>
      ) : null}
      {hotspot.kind === 'interview' ? (
        <button type="button" className={`btn ${interviewed ? 'btn--ghost' : 'btn--primary'}`} onClick={() => onInterview(hotspot.scene)}>
          <Icon name="message" size={18} /> {interviewed ? 'Bicara lagi' : 'Ajak bicara'}
        </button>
      ) : null}
      {act && actAvailable && !actSolved ? (
        <button type="button" className="btn btn--gold" onClick={() => onChallenge(act.challenge)}>
          <Icon name="lightbulb" size={18} /> {act.label}
        </button>
      ) : null}
      {act && actSolved ? <span className="done-pill"><Icon name="check" size={16} /> Analisis selesai</span> : null}
      <button type="button" className="btn btn--ghost" onClick={onClose}>Kembali menjelajah</button>
    </div>
  );

  return (
    <Modal
      title={hotspot.name}
      eyebrow={`${caseData.id} · ${loc.name}`}
      onClose={onClose}
      variant="drawer"
      className="inspect"
      footer={footer}
    >
      <div className="inspect__lead">
        <span className="inspect__icon" aria-hidden="true"><Icon name={hotspot.icon} size={28} /></span>
        <div>
          <p className="status-chip"><Icon name={statusChip.icon} size={14} /> {statusChip.text}</p>
          <p className="inspect__desc">{hotspot.description}</p>
        </div>
      </div>

      {hotspot.details ? (
        <section className="inspect__section">
          <h3 className="section-title">Yang kamu amati</h3>
          <ul className="observations">
            {hotspot.details.map((d) => <li key={d}>{d}</li>)}
          </ul>
        </section>
      ) : null}

      {hotspot.doc ? <DocumentView doc={hotspot.doc} /> : null}

      {ev && hotspot.kind === 'evidence' ? (
        <section className="inspect__section">
          <DocumentView doc={ev.doc} />
          <h3 className="section-title">Fakta penting</h3>
          <dl className="facts">
            {ev.facts.map((f) => <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
          </dl>
        </section>
      ) : null}

      {hotspot.kind === 'interview' && interviewed && hotspot.doneText ? (
        <p className="inspect__note"><Icon name="info" size={16} /> {hotspot.doneText}</p>
      ) : null}

      {hotspot.verdict ? (
        <aside className="thought">
          <Icon name="lightbulb" size={18} />
          <p><strong>Catatan penyelidik:</strong> {hotspot.verdict}</p>
        </aside>
      ) : null}

      {act && !actAvailable && act.lockedText ? (
        <p className="inspect__note"><Icon name="lock" size={16} /> {act.lockedText}</p>
      ) : null}
    </Modal>
  );
}
