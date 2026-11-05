import Icon from './Icon.jsx';
import { chapterStatus } from '../engines/InvestigationEngine.js';

// Bilah atas permainan: identitas kasus, tahap cerita, dan tombol utama.
export default function GameHUD({ caseData, cs, onJournal, onBoard, onPause, onObjectives, active }) {
  const ch = chapterStatus(caseData, cs);
  const unseen = cs.unseen.length;
  return (
    <header className="hud">
      <div className="hud__case">
        <span className="mono hud__id">{caseData.id}</span>
        <span className="hud__title">{caseData.title}</span>
      </div>
      <ol className="stepper" aria-label="Tahap penyelidikan">
        {ch.list.map((c, i) => (
          <li key={c.id} className={`stepper__item ${c.isDone ? 'is-done' : ''} ${i === ch.current ? 'is-current' : ''}`} aria-current={i === ch.current ? 'step' : undefined}>
            <span className="stepper__dot" aria-hidden="true">{c.isDone ? <Icon name="check" size={12} strokeWidth={3} /> : i + 1}</span>
            <span className="stepper__label">{c.label}</span>
            <span className="sr-only">{c.isDone ? ' (selesai)' : i === ch.current ? ' (sedang berjalan)' : ''}</span>
          </li>
        ))}
      </ol>
      <p className="hud__stage-sm mono" aria-hidden="true">Tahap {ch.current + 1}/{ch.list.length} · {ch.list[ch.current].label}</p>
      <nav className="hud__actions" aria-label="Alat penyelidik">
        <button type="button" className={`icon-btn icon-btn--label ${active === 'journal' ? 'is-active' : ''}`} onClick={onJournal}>
          <Icon name="book" /><span>Jurnal</span>
          {unseen ? <span className="dot-count" aria-label={`${unseen} bukti baru`}>{unseen}</span> : null}
        </button>
        <button type="button" className={`icon-btn icon-btn--label ${active === 'board' ? 'is-active' : ''}`} onClick={onBoard}>
          <Icon name="board" /><span>Papan Bukti</span>
        </button>
        {onObjectives ? (
          <button type="button" className="icon-btn icon-btn--label hud__obj-btn" onClick={onObjectives}>
            <Icon name="target" /><span>Tujuan</span>
          </button>
        ) : null}
        <button type="button" className="icon-btn icon-btn--label" onClick={onPause} aria-label="Menu jeda">
          <Icon name="menu" /><span>Menu</span>
        </button>
      </nav>
    </header>
  );
}

export function BottomNav({ active, onExplore, onJournal, onBoard, onObjectives, onPause, unseen }) {
  const items = [
    { id: 'explore', label: 'Jelajah', icon: 'mapPin', on: onExplore },
    { id: 'journal', label: 'Jurnal', icon: 'book', on: onJournal, count: unseen },
    { id: 'board', label: 'Papan', icon: 'board', on: onBoard },
    { id: 'objectives', label: 'Tujuan', icon: 'target', on: onObjectives },
    { id: 'menu', label: 'Menu', icon: 'menu', on: onPause },
  ];
  return (
    <nav className="bottom-nav" aria-label="Navigasi penyelidikan">
      {items.map((it) => (
        <button key={it.id} type="button" className={`bottom-nav__btn ${active === it.id ? 'is-active' : ''}`} onClick={it.on} aria-current={active === it.id ? 'page' : undefined}>
          <Icon name={it.icon} size={22} />
          <span>{it.label}</span>
          {it.count ? <span className="dot-count" aria-label={`${it.count} baru`}>{it.count}</span> : null}
        </button>
      ))}
    </nav>
  );
}
