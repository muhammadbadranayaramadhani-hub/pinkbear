import Modal from './Modal.jsx';
import Icon from './Icon.jsx';

export default function PauseMenu({ onResume, onArchive, onSettings, onRestart, onMainMenu, inCase }) {
  return (
    <Modal title="Jeda" eyebrow="Progres tersimpan otomatis" onClose={onResume} variant="center" className="pause">
      <nav className="pause__list" aria-label="Menu jeda">
        <button type="button" className="menu-btn menu-btn--compact" onClick={onResume}><Icon name="play" /><span className="menu-btn__label">Lanjutkan</span></button>
        <button type="button" className="menu-btn menu-btn--compact" onClick={onArchive}><Icon name="archive" /><span className="menu-btn__label">Arsip Kasus & Lencana</span></button>
        <button type="button" className="menu-btn menu-btn--compact" onClick={onSettings}><Icon name="sliders" /><span className="menu-btn__label">Pengaturan</span></button>
        {inCase ? (
          <button type="button" className="menu-btn menu-btn--compact" onClick={onRestart}><Icon name="restart" /><span className="menu-btn__label">Ulangi Kasus</span></button>
        ) : null}
        <button type="button" className="menu-btn menu-btn--compact" onClick={onMainMenu}><Icon name="door" /><span className="menu-btn__label">Kembali ke Menu Utama</span></button>
      </nav>
    </Modal>
  );
}
