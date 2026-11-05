import { useState } from 'react';
import Icon from './Icon.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';

function Radios({ legend, name, value, options, onChange, help }) {
  return (
    <fieldset className="setting">
      <legend className="setting__legend">{legend}</legend>
      {help ? <p className="setting__help">{help}</p> : null}
      <div className="seg">
        {options.map((o) => (
          <label key={o.value} className={`seg__opt ${value === o.value ? 'is-on' : ''}`}>
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function Settings({ settings, onChange, onBack, backLabel, onResetAll }) {
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <main className="settings">
      <div className="settings__inner">
        <header className="page-head">
          <button type="button" className="btn btn--ghost" onClick={onBack}><Icon name="arrowLeft" size={18} /> {backLabel}</button>
          <div>
            <p className="eyebrow eyebrow--gold">Ruang Arsip</p>
            <h1 className="page-title">Pengaturan</h1>
          </div>
        </header>

        <div className="settings__card">
          <Radios
            legend="Kecepatan teks dialog"
            name="speed"
            value={settings.textSpeed}
            onChange={(v) => onChange({ textSpeed: v })}
            options={[{ value: 'lambat', label: 'Lambat' }, { value: 'normal', label: 'Normal' }, { value: 'instan', label: 'Langsung' }]}
            help="Teks tidak pernah dilewati otomatis. Kamu selalu menekan Lanjut sendiri."
          />
          <Radios
            legend="Ukuran huruf"
            name="size"
            value={settings.textSize}
            onChange={(v) => onChange({ textSize: v })}
            options={[{ value: 'normal', label: 'Normal' }, { value: 'besar', label: 'Besar' }]}
          />
          <Radios
            legend="Animasi dan gerak"
            name="motion"
            value={settings.motion}
            onChange={(v) => onChange({ motion: v })}
            options={[{ value: 'system', label: 'Ikuti perangkat' }, { value: 'kurangi', label: 'Kurangi gerak' }]}
            help="Pilih Kurangi gerak jika animasi membuatmu pusing."
          />
          <div className="setting setting--danger">
            <p className="setting__legend">Hapus semua progres</p>
            <p className="setting__help">Nama, bukti, lencana, dan pangkat akan dihapus dari perangkat ini.</p>
            <button type="button" className="btn btn--danger" onClick={() => setConfirm(true)}>
              <Icon name="restart" size={18} /> Hapus progres
            </button>
            {done ? <p className="setting__ok" role="status"><Icon name="check" size={16} /> Progres sudah dihapus.</p> : null}
          </div>
        </div>
      </div>
      {confirm ? (
        <ConfirmDialog
          title="Hapus semua progres?"
          message="Tindakan ini tidak bisa dibatalkan. Kamu akan mulai lagi dari surat undangan."
          confirmLabel="Ya, hapus semuanya"
          danger
          onCancel={() => setConfirm(false)}
          onConfirm={() => { setConfirm(false); onResetAll(); setDone(true); }}
        />
      ) : null}
    </main>
  );
}
