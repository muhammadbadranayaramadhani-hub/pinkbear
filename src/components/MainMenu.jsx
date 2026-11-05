import SceneArt from './SceneArt.jsx';
import Icon from './Icon.jsx';
import { getCase } from '../data/cases/index.js';
import { chapterStatus } from '../engines/InvestigationEngine.js';

function saveSummary(state) {
  const s = state.session;
  if (!s) return '';
  if (s.sceneId === 'prologue') return `${state.player.name || 'Penyelidik baru'} · Prolog`;
  const caseId = s.caseId || Object.keys(state.cases)[0];
  const c = caseId ? getCase(caseId) : null;
  const cs = caseId ? state.cases[caseId] : null;
  if (c && cs) {
    if (cs.status === 'solved') return `${state.player.name} · ${c.id} terpecahkan`;
    const ch = chapterStatus(c, cs);
    return `${state.player.name} · ${c.id} · ${ch.list[ch.current].label}`;
  }
  return `${state.player.name} · Ruang Arsip`;
}

export default function MainMenu({ state, canContinue, onContinue, onNew, onArchive, onSettings }) {
  return (
    <main className="menu">
      <div className="menu__bg" aria-hidden="true">
        <SceneArt scene="library" />
        <div className="menu__shade" />
        <div className="motes" />
      </div>

      <div className="menu__content">
        <p className="eyebrow eyebrow--gold">Divisi Penyelidik Arsip</p>
        <h1 className="logo">
          <span className="logo__word">Mysteria</span>
          <span className="logo__sub">The Academy of Hidden Knowledge</span>
        </h1>
        <p className="menu__intro">
          Di balik rak-rak tua Akademi Pengetahuan Tersembunyi, ada map-map kasus yang belum pernah terpecahkan.
          Angka bisa bersaksi. Kalimat bisa menyimpan petunjuk. Malam ini, arsip memanggil penyelidik baru.
        </p>

        <nav className="menu__nav" aria-label="Menu utama">
          <button type="button" className="menu-btn" onClick={onContinue} disabled={!canContinue}>
            <Icon name="play" />
            <span className="menu-btn__text">
              <span className="menu-btn__label">Lanjutkan Cerita</span>
              <span className="menu-btn__meta">{canContinue ? saveSummary(state) : 'Belum ada penyelidikan tersimpan'}</span>
            </span>
          </button>
          <button type="button" className="menu-btn" onClick={onNew}>
            <Icon name="feather" />
            <span className="menu-btn__text">
              <span className="menu-btn__label">Penyelidikan Baru</span>
              <span className="menu-btn__meta">Mulai dari surat undangan</span>
            </span>
          </button>
          <button type="button" className="menu-btn" onClick={onArchive}>
            <Icon name="archive" />
            <span className="menu-btn__text">
              <span className="menu-btn__label">Arsip Kasus</span>
              <span className="menu-btn__meta">Map kasus, pangkat, dan lencana</span>
            </span>
          </button>
          <button type="button" className="menu-btn" onClick={onSettings}>
            <Icon name="sliders" />
            <span className="menu-btn__text">
              <span className="menu-btn__label">Pengaturan</span>
              <span className="menu-btn__meta">Kecepatan teks, ukuran huruf, gerak</span>
            </span>
          </button>
        </nav>

        <p className="menu__foot mono">Arsip v1.0 · Progres tersimpan otomatis di perangkat ini</p>
      </div>
    </main>
  );
}
