import Icon from './Icon.jsx';

// Titik interaktif di atas ilustrasi lokasi.
export default function InteractiveObject({ hotspot, status, onSelect, showLabel }) {
  const stateText = status.done ? (hotspot.kind === 'evidence' ? 'bukti tersimpan' : 'sudah diperiksa') : status.inspected ? 'sudah dilihat, bukti belum disimpan' : 'belum diperiksa';
  return (
    <button
      type="button"
      className={`hotspot hotspot--${hotspot.kind} ${hotspot.x < 16 ? 'hotspot--edge-l' : hotspot.x > 84 ? 'hotspot--edge-r' : ''} ${hotspot.y < 30 ? 'hotspot--edge-t' : ''} ${status.done ? 'is-done' : ''} ${status.inspected ? 'is-seen' : 'is-new'} ${showLabel ? 'show-label' : ''}`}
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      onClick={() => onSelect(hotspot)}
      aria-label={`${hotspot.name}, ${stateText}`}
    >
      <span className="hotspot__ring" aria-hidden="true" />
      <span className="hotspot__core" aria-hidden="true">
        <Icon name={status.done ? 'check' : hotspot.kind === 'interview' ? 'message' : 'search'} size={18} strokeWidth={2.2} />
      </span>
      <span className="hotspot__label" aria-hidden="true">{hotspot.name}</span>
    </button>
  );
}
