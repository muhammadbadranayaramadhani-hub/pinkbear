import { useEffect } from 'react';
import Icon from './Icon.jsx';

const ICONS = { evidence: 'fileText', kp: 'sparkles', badge: 'award', info: 'info' };

function Toast({ t, onDone }) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(t.id), 3200);
    return () => clearTimeout(timer);
  }, [t.id, onDone]);
  return (
    <li className={`toast toast--${t.kind}`}>
      <Icon name={ICONS[t.kind] || 'info'} size={18} />
      <span>{t.text}</span>
    </li>
  );
}

export default function Toasts({ toasts, onDismiss }) {
  return (
    <ol className="toasts" aria-live="polite" aria-atomic="false">
      {toasts.slice(-2).map((t) => <Toast key={t.id} t={t} onDone={onDismiss} />)}
    </ol>
  );
}
