import { useState } from 'react';
import Icon from './Icon.jsx';
import SceneArt from './SceneArt.jsx';
import ProgressPanel from './ProgressPanel.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { ARCHIVE_SHELF, getCase } from '../data/cases/index.js';
import { chapterStatus } from '../engines/InvestigationEngine.js';

function Stars({ n }) {
  return (
    <span className="stars" aria-label={`${n} dari 3 bintang`}>
      {[1, 2, 3].map((i) => <Icon key={i} name="star" size={16} className={i <= n ? 'is-on' : ''} />)}
    </span>
  );
}

function CaseFolder({ entry, state, onOpen, onRestart, highlight }) {
  const c = getCase(entry.id);
  const unlocked = state.progress.unlockedCases.includes(entry.id);
  const cs = state.cases[entry.id];
  const best = state.progress.caseBest[entry.id];

  if (!entry.playable) {
    return (
      <li className="folder folder--sealed">
        <div className="folder__tab mono">{entry.id}</div>
        <div className="folder__body">
          <p className="folder__status"><Icon name="lock" size={16} /> Tersegel · segera hadir</p>
          <h3 className="folder__title">{entry.title}</h3>
          <p className="folder__teaser">{entry.teaser}</p>
          <ul className="chips">{entry.subjects.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
        </div>
      </li>
    );
  }

  let status = 'Belum dibuka';
  let action = 'Buka Berkas';
  if (cs && cs.status === 'in-progress') {
    const ch = chapterStatus(c, cs);
    status = `Sedang diselidiki · ${ch.list[ch.current].label} · ${cs.evidence.length}/${c.evidenceOrder.length} bukti`;
    action = 'Lanjutkan Penyelidikan';
  } else if (cs && cs.status === 'solved') {
    status = 'Terpecahkan';
    action = 'Lihat Laporan Kasus';
  }

  return (
    <li className={`folder ${highlight ? 'folder--highlight' : ''} ${!unlocked ? 'folder--locked' : ''}`}>
      <div className="folder__tab mono">{c.id}</div>
      <div className="folder__art" aria-hidden="true"><SceneArt scene="garden" /></div>
      <div className="folder__body">
        <p className="folder__status">
          {cs && cs.status === 'solved' ? <Icon name="check" size={16} /> : <Icon name="fileText" size={16} />}
          {status}
          {best ? <Stars n={best.stars} /> : null}
        </p>
        <h3 className="folder__title">{c.title} <span className="folder__en">· {c.titleEn}</span></h3>
        <p className="folder__teaser">{c.teaser}</p>
        <dl className="meta-list">
          <div><dt>Lokasi</dt><dd>{c.locationLabel}</dd></div>
          <div><dt>Tingkat</dt><dd>{c.difficulty}</dd></div>
          <div><dt>Durasi</dt><dd>{c.duration}</dd></div>
        </dl>
        <ul className="chips">{c.subjects.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
        {unlocked ? (
          <div className="btn-row">
            <button type="button" className="btn btn--primary" onClick={() => onOpen(c.id)}>
              {action} <Icon name="chevronRight" size={18} />
            </button>
            {cs && cs.status !== 'not-started' ? (
              <button type="button" className="btn btn--ghost" onClick={() => onRestart(c.id)}>
                <Icon name="restart" size={18} /> Ulangi Kasus
              </button>
            ) : null}
          </div>
        ) : (
          <p className="folder__locked-note"><Icon name="lock" size={16} /> Selesaikan prolog untuk membuka map ini.</p>
        )}
      </div>
    </li>
  );
}

export default function CaseArchive({ state, onBack, backLabel, onOpenCase, onRestartCase, onNewGame, inGame }) {
  const [confirm, setConfirm] = useState(null);
  const registered = !!state.player.name;
  return (
    <main className="archive">
      <div className="archive__bg" aria-hidden="true"><SceneArt scene="library" /><div className="archive__shade" /></div>
      <div className="archive__inner">
        <header className="page-head">
          <button type="button" className="btn btn--ghost" onClick={onBack}>
            <Icon name="arrowLeft" size={18} /> {backLabel}
          </button>
          <div>
            <p className="eyebrow eyebrow--gold">Ruang Arsip</p>
            <h1 className="page-title">Arsip Kasus</h1>
          </div>
        </header>

        {inGame ? (
          <p className="archive__hint"><Icon name="sparkles" size={16} /> <span>Map MYS-001 terbuka. Pilih <strong>Buka Berkas</strong> untuk memulai kasus pertamamu.</span></p>
        ) : null}

        <div className="archive__grid">
          <div className="archive__shelf">
            <h2 className="section-title">Map Kasus</h2>
            {!registered ? (
              <div className="empty-note">
                <p>Kamu belum terdaftar sebagai penyelidik. Semua map masih tersegel.</p>
                <button type="button" className="btn btn--primary" onClick={onNewGame}>Mulai Penyelidikan Baru</button>
              </div>
            ) : null}
            <ol className="folders">
              {ARCHIVE_SHELF.map((e) => (
                <CaseFolder
                  key={e.id}
                  entry={e}
                  state={state}
                  highlight={inGame && e.id === 'MYS-001'}
                  onOpen={onOpenCase}
                  onRestart={(id) => setConfirm(id)}
                />
              ))}
            </ol>
          </div>
          <ProgressPanel state={state} />
        </div>
      </div>

      {confirm ? (
        <ConfirmDialog
          title="Ulangi kasus dari awal?"
          message="Bukti, jawaban, dan benang merah di kasus ini akan dihapus. Lencana dan skor terbaikmu tetap tersimpan."
          confirmLabel="Ya, ulangi kasus"
          danger
          onCancel={() => setConfirm(null)}
          onConfirm={() => { const id = confirm; setConfirm(null); onRestartCase(id); }}
        />
      ) : null}
    </main>
  );
}
