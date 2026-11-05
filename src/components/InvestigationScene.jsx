import { useState } from 'react';
import SceneArt from './SceneArt.jsx';
import Icon from './Icon.jsx';
import InteractiveObject from './InteractiveObject.jsx';
import ObjectivesList from './ObjectivesList.jsx';
import {
  currentObjective, hotspotsAt, hotspotState, isChallengeAvailable, isLocationUnlocked, meets,
} from '../engines/InvestigationEngine.js';

const LOC_ICONS = { maintenance: 'wrench', garden: 'sprout', hallway: 'door' };

export default function InvestigationScene({ caseData, cs, dispatch, onInspect, onChallenge, onScreen }) {
  const [lantern, setLantern] = useState(false);
  const loc = caseData.locations[cs.location];
  const spots = hotspotsAt(caseData, cs.location);
  const found = spots.filter((h) => hotspotState(h, cs).inspected).length;
  const objective = currentObjective(caseData, cs);

  function goLocation(id) {
    dispatch({ type: 'SET_LOCATION', location: id });
  }

  let objectiveAction = null;
  if (objective && objective.action) {
    if (objective.action.challenge && isChallengeAvailable(caseData, cs, objective.action.challenge)) {
      objectiveAction = <button type="button" className="btn btn--small btn--gold" onClick={() => onChallenge(objective.action.challenge)}><Icon name="lightbulb" size={16} /> Kerjakan</button>;
    } else if (objective.action.screen === 'board') {
      objectiveAction = <button type="button" className="btn btn--small btn--gold" onClick={() => onScreen('board')}><Icon name="board" size={16} /> Papan Bukti</button>;
    } else if (objective.action.screen === 'resolution' && meets(objective.action.requires, cs)) {
      objectiveAction = <button type="button" className="btn btn--small btn--primary" onClick={() => onScreen('resolution')}><Icon name="gavel" size={16} /> Ajukan</button>;
    }
  } else if (objective && objective.where && objective.where !== cs.location && isLocationUnlocked(cs, objective.where)) {
    objectiveAction = <button type="button" className="btn btn--small btn--ghost" onClick={() => goLocation(objective.where)}><Icon name="mapPin" size={16} /> Ke sana</button>;
  }

  return (
    <div className="inv">
      <div className="inv__scene-col">
        <nav className="loc-tabs" aria-label="Lokasi penyelidikan">
          {caseData.locationOrder.map((id) => {
            const l = caseData.locations[id];
            const open = isLocationUnlocked(cs, id);
            const all = hotspotsAt(caseData, id);
            const done = all.filter((h) => hotspotState(h, cs).inspected).length;
            return (
              <button
                key={id}
                type="button"
                className={`loc-tab ${cs.location === id ? 'is-current' : ''}`}
                onClick={() => open && goLocation(id)}
                disabled={!open}
                aria-current={cs.location === id ? 'location' : undefined}
                title={!open ? l.lockedHint : undefined}
              >
                <Icon name={open ? LOC_ICONS[id] || 'mapPin' : 'lock'} size={18} />
                <span className="loc-tab__name">{l.name}</span>
                <span className="loc-tab__count mono">{open ? `${done}/${all.length}` : 'Terkunci'}</span>
              </button>
            );
          })}
        </nav>

        {objective ? (
          <div className="objective-banner" role="status">
            <Icon name="target" size={18} />
            <p><span className="objective-banner__label">Tujuan</span> {objective.text}</p>
            {objectiveAction}
          </div>
        ) : null}

        <div className="scene-wrap">
          <div className="scene-scroller" tabIndex={-1}>
            <div className="scene-frame" aria-label={`Lokasi: ${loc.name}. ${spots.length} objek dapat diperiksa.`} role="group">
              <SceneArt scene={loc.art} fit="meet" />
              <div className="scene-frame__glow" aria-hidden="true" />
              {spots.map((h) => (
                <InteractiveObject key={h.id} hotspot={h} status={hotspotState(h, cs)} onSelect={onInspect} showLabel={lantern} />
              ))}
            </div>
          </div>
          <div className="scene-tools">
            <button type="button" className={`chip-btn ${lantern ? 'is-on' : ''}`} onClick={() => setLantern((v) => !v)} aria-pressed={lantern}>
              <Icon name="eye" size={16} /> {lantern ? 'Sembunyikan nama objek' : 'Tampilkan nama objek'}
            </button>
            <p className="swipe-hint"><Icon name="arrowLeft" size={14} /> geser untuk menjelajah <Icon name="arrowRight" size={14} /></p>
          </div>
        </div>

        <section className="object-list" aria-labelledby="obj-list-title">
          <div className="object-list__head">
            <h2 id="obj-list-title" className="section-title">{loc.name}</h2>
            <p className="mono object-list__count">{found}/{spots.length} diperiksa</p>
          </div>
          <p className="object-list__blurb">{loc.blurb}</p>
          <ul className="object-list__grid">
            {spots.map((h) => {
              const st = hotspotState(h, cs);
              return (
                <li key={h.id}>
                  <button type="button" className={`obj-card ${st.done ? 'is-done' : ''} ${st.inspected ? '' : 'is-new'}`} onClick={() => onInspect(h)}>
                    <span className="obj-card__icon" aria-hidden="true"><Icon name={h.icon} size={20} /></span>
                    <span className="obj-card__text">
                      <span className="obj-card__name">{h.name}</span>
                      <span className="obj-card__state">
                        {st.done ? (h.kind === 'evidence' ? '✓ Bukti tersimpan' : '✓ Sudah diperiksa') : st.inspected ? 'Bukti belum disimpan' : 'Belum diperiksa'}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <aside className="inv__side" aria-labelledby="side-obj-title">
        <h2 id="side-obj-title" className="section-title">Tujuan Penyelidikan</h2>
        <ObjectivesList caseData={caseData} cs={cs} onChallenge={onChallenge} onScreen={onScreen} onGoLocation={goLocation} />
      </aside>
    </div>
  );
}
