import Icon from './Icon.jsx';
import { BADGES } from '../data/progression.js';
import { rankFor, totalKp } from '../engines/ProgressEngine.js';

export default function ProgressPanel({ state, compact = false }) {
  const kp = totalKp(state);
  const rank = rankFor(kp);
  return (
    <section className={`progress-panel ${compact ? 'progress-panel--compact' : ''}`} aria-labelledby="profile-title">
      <div className="profile">
        <div className="profile__seal" aria-hidden="true"><Icon name="key" size={26} /></div>
        <div className="profile__main">
          <p className="eyebrow">Kartu Penyelidik</p>
          <h2 id="profile-title" className="profile__name">{state.player.name || 'Belum terdaftar'}</h2>
          <p className="profile__rank">{rank.current.title}</p>
        </div>
        <div className="profile__kp">
          <span className="profile__kp-num">{kp}</span>
          <span className="profile__kp-label">Poin Pengetahuan</span>
        </div>
      </div>
      <div className="rankbar">
        <div className="rankbar__track" role="progressbar" aria-label="Kemajuan menuju pangkat berikutnya" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(rank.progress * 100)}>
          <span style={{ width: `${Math.round(rank.progress * 100)}%` }} />
        </div>
        <p className="rankbar__label mono">
          {rank.next ? `${rank.next.min - kp} PP lagi menuju ${rank.next.title}` : 'Pangkat tertinggi tercapai'}
        </p>
      </div>
      {!compact ? (
        <div className="badges">
          <h3 className="section-title">Lencana</h3>
          <ul className="badges__grid">
            {BADGES.map((b) => {
              const has = state.progress.badges.includes(b.id);
              return (
                <li key={b.id} className={`badge ${has ? 'is-earned' : 'is-locked'}`}>
                  <span className="badge__icon" aria-hidden="true"><Icon name={has ? b.icon : 'lock'} size={20} /></span>
                  <span className="badge__text">
                    <span className="badge__title">{b.title}</span>
                    <span className="badge__desc">{b.description}</span>
                    <span className="badge__state">{has ? 'Diperoleh' : 'Belum diperoleh'}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
