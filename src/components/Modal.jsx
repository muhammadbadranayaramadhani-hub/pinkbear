import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

// Dialog modal yang dapat diakses: fokus berpindah ke dalam, Esc menutup, fokus kembali saat ditutup.
// variant: 'drawer' (panel samping di desktop, bottom sheet di ponsel) | 'center' | 'full'
export default function Modal({ title, eyebrow, onClose, children, variant = 'center', labelledBy, className = '', footer, closeLabel = 'Tutup' }) {
  const ref = useRef(null);
  const titleId = labelledBy || `modal-${String(title || 'dialog').replace(/\W+/g, '-').toLowerCase()}`;

  useEffect(() => {
    const prev = document.activeElement;
    const el = ref.current;
    const focusables = () =>
      el.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])');
    const first = focusables()[0];
    (first || el).focus({ preventScroll: true });

    function onKey(e) {
      // Hanya dialog paling atas yang menanggapi papan ketik.
      const dialogs = document.querySelectorAll('.dialog');
      if (dialogs[dialogs.length - 1] !== el) return;
      if (e.key === 'Escape' && onClose) {
        e.stopPropagation();
        onClose();
      } else if (e.key === 'Tab') {
        const list = Array.from(focusables());
        if (!list.length) return;
        const firstEl = list[0];
        const lastEl = list[list.length - 1];
        if (!el.contains(document.activeElement)) {
          e.preventDefault();
          firstEl.focus();
        } else if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (prev && prev.focus) prev.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`overlay overlay--${variant}`} onMouseDown={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
      <div
        ref={ref}
        className={`dialog dialog--${variant} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="dialog__head">
          <div className="dialog__titles">
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h2 id={titleId} className="dialog__title">{title}</h2>
          </div>
          {onClose ? (
            <button type="button" className="icon-btn" onClick={onClose} aria-label={closeLabel}>
              <Icon name="close" />
            </button>
          ) : null}
        </header>
        <div className="dialog__body">{children}</div>
        {footer ? <footer className="dialog__foot">{footer}</footer> : null}
      </div>
    </div>
  );
}
