import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import useTypewriter from './useTypewriter.js';

// Kotak dialog visual novel: nama tokoh, teks, tombol lanjut, pilihan, dan isian nama.

export function LineBox({ speaker, role, text, onNext, isLast, settings, reduceMotion }) {
  const { shown, done, finish } = useTypewriter(text, settings.textSpeed, reduceMotion);
  const btnRef = useRef(null);
  const handle = () => (done ? onNext() : finish());

  useEffect(() => {
    function onKey(e) {
      if (e.defaultPrevented) return;
      const tag = (e.target && e.target.tagName) || '';
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (document.querySelector('.overlay')) return;
      if (e.key === ' ' || e.key === 'Enter') {
        if (tag === 'BUTTON' || tag === 'A') return; // tombol yang sedang difokus menangani dirinya sendiri
        e.preventDefault();
        handle();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const isNarrator = !speaker;
  return (
    <div className={`vn-box ${isNarrator ? 'vn-box--narrator' : ''}`} onClick={(e) => { if (e.target.closest('button')) return; handle(); }}>
      {!isNarrator ? (
        <div className="vn-box__plate">
          <span className="vn-box__name">{speaker}</span>
          {role ? <span className="vn-box__role">{role}</span> : null}
        </div>
      ) : null}
      <p className="vn-box__text" aria-live="polite">
        <span aria-hidden={!done}>{shown}</span>
        {!done ? <span className="sr-only">{text}</span> : null}
        {!done ? <span className="caret" aria-hidden="true" /> : null}
      </p>
      <div className="vn-box__foot">
        <span className="kbd-hint" aria-hidden="true">Spasi / Enter</span>
        <button ref={btnRef} type="button" className="btn btn--primary btn--next" onClick={handle}>
          {done ? (isLast ? 'Selesai' : 'Lanjut') : 'Tampilkan semua'}
          <Icon name="chevronRight" size={18} />
        </button>
      </div>
    </div>
  );
}

export function ChoiceBox({ prompt, options, onChoose }) {
  useEffect(() => {
    function onKey(e) {
      if (document.querySelector('.overlay')) return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) {
        e.preventDefault();
        onChoose(options[n - 1]);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [options, onChoose]);

  return (
    <div className="vn-box vn-box--choice" role="group" aria-label={prompt || 'Pilih tanggapan'}>
      <p className="vn-box__prompt"><Icon name="sparkles" size={16} /> {prompt || 'Pilih tanggapanmu'}</p>
      <ol className="choices">
        {options.map((o, i) => (
          <li key={o.label}>
            <button type="button" className="choice" onClick={() => onChoose(o)} autoFocus={i === 0}>
              <span className="choice__num" aria-hidden="true">{i + 1}</span>
              <span>{o.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function NameBox({ initial, onSubmit }) {
  const [value, setValue] = useState(initial || '');
  const [error, setError] = useState('');
  const DEFAULT = 'Arsa';

  function submit(name) {
    const clean = name.trim().replace(/\s+/g, ' ');
    if (clean.length < 2) {
      setError('Nama minimal 2 huruf. Atau pakai nama bawaan.');
      return;
    }
    if (clean.length > 18) {
      setError('Nama maksimal 18 huruf.');
      return;
    }
    onSubmit(clean);
  }

  return (
    <form className="vn-box vn-box--name" onSubmit={(e) => { e.preventDefault(); submit(value); }}>
      <label htmlFor="player-name" className="vn-box__prompt"><Icon name="feather" size={16} /> Tuliskan nama penyelidikmu di baris undangan</label>
      <div className="name-row">
        <input
          id="player-name"
          className="field field--ink"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(''); }}
          placeholder="Nama penyelidik"
          maxLength={24}
          autoComplete="off"
          autoFocus
          aria-describedby="name-error"
        />
        <button type="submit" className="btn btn--primary">Tanda tangani</button>
      </div>
      <div className="name-foot">
        <p id="name-error" className="field-error" role="alert">{error}</p>
        <button type="button" className="btn btn--link" onClick={() => submit(DEFAULT)}>Pakai nama bawaan “{DEFAULT}”</button>
      </div>
    </form>
  );
}
