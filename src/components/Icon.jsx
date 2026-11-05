// Ikon garis bergaya Lucide (24×24, stroke). Ditulis langsung agar gim tetap berjalan tanpa jaringan.
// Bisa diganti dengan paket `lucide-react` tanpa mengubah komponen lain.

const PATHS = {
  book: 'M2 5.5A1.5 1.5 0 0 1 3.5 4H9a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5h-6A1.5 1.5 0 0 1 2 16z|M22 5.5A1.5 1.5 0 0 0 20.5 4H15a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5h6a1.5 1.5 0 0 0 1.5-1.5z',
  board: 'M6 6m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0|M18 8m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0|M10 18m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0|M8.4 6.5l7.2 1.1|M6.8 8.4l2.3 7.2|M16.6 10.1l-4.9 5.9',
  target: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0|M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0|M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0',
  menu: 'M4 6h16|M4 12h16|M4 18h16',
  close: 'M6 6l12 12|M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7',
  chevronRight: 'M9 6l6 6-6 6',
  chevronLeft: 'M15 6l-6 6 6 6',
  chevronDown: 'M6 9l6 6 6-6',
  arrowLeft: 'M19 12H5|M11 6l-6 6 6 6',
  arrowRight: 'M5 12h14|M13 6l6 6-6 6',
  lightbulb: 'M9 18h6|M10 21h4|M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z',
  search: 'M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0|M20 20l-4-4',
  droplet: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  fileText: 'M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z|M14 3v5h5|M8.5 12.5h7|M8.5 16h7',
  clipboard: 'M9 3.5h6v3H9z|M15 5h2.5A1.5 1.5 0 0 1 19 6.5v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19.5v-13A1.5 1.5 0 0 1 6.5 5H9|M8.5 13.5l2 2 4-4',
  gauge: 'M12 13m-8.5 0a8.5 8.5 0 1 0 17 0a8.5 8.5 0 1 0-17 0|M12 13l4-4|M12 5.5V7|M5.5 13H7|M17 13h1.5',
  users: 'M9 8m-3.5 0a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0-7 0|M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6|M16 4.6a3.5 3.5 0 0 1 0 6.8|M18 14.3c2.1.7 3.5 2.8 3.5 5.7',
  megaphone: 'M3 10v4a1 1 0 0 0 1 1h3l9 4.5v-15L7 9H4a1 1 0 0 0-1 1z|M19.5 9a4 4 0 0 1 0 6|M7 15l1.5 5h2.5l-1-4.2',
  sprout: 'M12 21v-9|M12 12c0-4-3-6-7-6 0 4 3 6 7 6z|M12 10c0-3.5 2.5-6 7-6 0 4-2.5 6-7 6z',
  sliders: 'M4 7h10|M18 7h2|M16 7m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0|M4 17h4|M12 17h8|M10 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
  archive: 'M3 4h18v4H3z|M5 8v11.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8|M10 12h4',
  play: 'M7 4.5v15l12-7.5z',
  restart: 'M3.5 12a8.5 8.5 0 1 0 2.8-6.3|M3.5 4v5h5',
  lock: 'M5.5 11h13v10h-13z|M8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  award: 'M12 9m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0|M8.5 14l-1.5 7 5-3 5 3-1.5-7',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
  help: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0|M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6|M12 17.2v.1',
  sparkles: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z|M19 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2|M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z|M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
  mapPin: 'M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z|M12 9.5m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',
  key: 'M8 15m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0|M11 12l9-9|M17 6l3 3|M14.5 8.5l2 2',
  wrench: 'M14.7 6.3a4.5 4.5 0 0 0 5.4 5.4l-2.4-2.4 1.4-1.4-2-2-1.4 1.4zM14.7 6.3L4 17a2.1 2.1 0 0 0 3 3l10.7-10.7',
  alert: 'M12 3.5L2.5 20h19z|M12 10v4.5|M12 17.2v.1',
  info: 'M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0|M12 11v6|M12 7.6v.1',
  message: 'M4 5h16v11H9l-5 4z|M8 9.5h8|M8 12.5h5',
  pencil: 'M4 20h4L19 9l-4-4L4 16z|M13.5 6.5l4 4',
  window: 'M5 3h14v18H5z|M12 3v18|M5 12h14',
  toolbox: 'M3 9h18v10.5H3z|M9 9V6h6v3|M3 13.5h18|M10 13.5v2h4v-2',
  feather: 'M20 4C12 4 6 10 6 18l-2 2|M6 18h7c4 0 7-5 7-14|M10 14h5',
  moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  thread: 'M4 18c4 0 4-12 8-12s4 12 8 12',
  x: 'M7 7l10 10|M17 7L7 17',
  scroll: 'M7 4h11a2 2 0 0 1 2 2v1h-4|M7 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-1H9|M9 9h7|M9 13h7',
  door: 'M5 21V4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5V21|M3 21h18|M15 12v.1',
  gavel:'M14 4l6 6|M12 6l6 6|M13 5l-5 5 6 6 5-5|M8 14l-5 5',
};

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.75, title }) {
  const d = PATHS[name] || PATHS.help;
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {d.split('|').map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}
