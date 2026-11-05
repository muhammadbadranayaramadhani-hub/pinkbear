import Icon from './Icon.jsx';
import { getObjectives, isChallengeAvailable, meets, missingRequirements } from '../engines/InvestigationEngine.js';

// Daftar tujuan penyelidikan dengan tombol aksi yang relevan.
export default function ObjectivesList({ caseData, cs, onChallenge, onScreen, onGoLocation }) {
  const list = getObjectives(caseData, cs);
  const main = list.filter((o) => !o.optional);
  const extra = list.filter((o) => o.optional);

  function renderAction(o) {
    if (o.isDone || !o.action) {
      if (!o.isDone && o.where && o.where !== cs.location && cs.unlockedLocations.includes(o.where)) {
        return (
          <button type="button" className="btn btn--small btn--ghost" onClick={() => onGoLocation(o.where)}>
            <Icon name="mapPin" size={16} /> Ke {caseData.locations[o.where].name}
          </button>
        );
      }
      return null;
    }
    if (o.action.challenge) {
      if (!isChallengeAvailable(caseData, cs, o.action.challenge)) return null;
      return (
        <button type="button" className="btn btn--small btn--gold" onClick={() => onChallenge(o.action.challenge)}>
          <Icon name="lightbulb" size={16} /> Kerjakan analisis
        </button>
      );
    }
    if (o.action.screen === 'board') {
      return (
        <button type="button" className="btn btn--small btn--gold" onClick={() => onScreen('board')}>
          <Icon name="board" size={16} /> Buka Papan Bukti
        </button>
      );
    }
    if (o.action.screen === 'resolution') {
      const ready = meets(o.action.requires, cs);
      if (!ready) {
        const missing = missingRequirements(o.action.requires, cs, caseData);
        return (
          <div className="obj__missing">
            <p className="obj__missing-title"><Icon name="lock" size={14} /> Belum bisa diajukan. Masih perlu:</p>
            <ul>{missing.map((m) => <li key={m}>{m}</li>)}</ul>
          </div>
        );
      }
      return (
        <button type="button" className="btn btn--small btn--primary" onClick={() => onScreen('resolution')}>
          <Icon name="gavel" size={16} /> Ajukan kesimpulan
        </button>
      );
    }
    return null;
  }

  const Item = (o) => (
    <li key={o.id} className={`obj ${o.isDone ? 'is-done' : ''}`}>
      <span className="obj__check" aria-hidden="true">{o.isDone ? <Icon name="check" size={14} strokeWidth={3} /> : null}</span>
      <div className="obj__body">
        <p className="obj__text">
          <span className="sr-only">{o.isDone ? 'Selesai: ' : 'Belum selesai: '}</span>
          {o.text}
        </p>
        {o.subject ? <span className="chip chip--subject">{o.subject}</span> : null}
        {renderAction(o)}
      </div>
    </li>
  );

  return (
    <div className="objectives">
      <ol className="obj-list">{main.map(Item)}</ol>
      {extra.length ? (
        <>
          <p className="section-title section-title--sub">Petunjuk tambahan</p>
          <ul className="obj-list obj-list--extra">{extra.map(Item)}</ul>
        </>
      ) : null}
    </div>
  );
}
