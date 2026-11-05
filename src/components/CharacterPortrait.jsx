import { useId } from 'react';
import { CHARACTERS, EXPRESSION_LABELS } from '../data/characters.js';

// Potret tokoh bergaya ilustrasi datar. Ekspresi mengubah alis, mata, dan mulut.

const INK = '#2B2742';

function Brows({ expr, color }) {
  const d = {
    neutral: ['M120 166 Q133 160 146 165', 'M174 165 Q187 160 200 166'],
    smile: ['M120 163 Q133 156 146 161', 'M174 161 Q187 156 200 163'],
    happy: ['M120 161 Q133 153 146 158', 'M174 158 Q187 153 200 161'],
    worried: ['M120 169 Q134 166 146 158', 'M174 158 Q186 166 200 169'],
    serious: ['M120 162 Q134 164 146 170', 'M174 170 Q186 164 200 162'],
    surprised: ['M120 158 Q133 148 146 155', 'M174 155 Q187 148 200 158'],
    thinking: ['M120 167 Q133 163 146 166', 'M174 158 Q187 150 200 156'],
  }[expr] || ['M120 166 Q133 160 146 165', 'M174 165 Q187 160 200 166'];
  return (
    <g stroke={color} strokeWidth="3.6" strokeLinecap="round" fill="none">
      <path d={d[0]} />
      <path d={d[1]} />
    </g>
  );
}

function Eyes({ expr }) {
  const L = 133;
  const R = 187;
  const Y = 189;
  if (expr === 'smile' || expr === 'happy') {
    return (
      <g stroke={INK} strokeWidth="3.2" strokeLinecap="round" fill="none">
        <path d={`M${L - 11} ${Y + 2} Q${L} ${Y - 7} ${L + 11} ${Y + 2}`} />
        <path d={`M${R - 11} ${Y + 2} Q${R} ${Y - 7} ${R + 11} ${Y + 2}`} />
        <path d={`M${L + 9} ${Y - 1} l4 -3 M${R + 9} ${Y - 1} l4 -3`} strokeWidth="2" />
      </g>
    );
  }
  const big = expr === 'surprised';
  const look = expr === 'thinking' ? 3 : 0;
  const lift = expr === 'thinking' ? -1.5 : 0;
  const open = big ? 9 : expr === 'serious' ? 4.5 : 6.5;
  const eye = (cx) => (
    <g key={cx}>
      <path d={`M${cx - 12} ${Y + 1} Q${cx} ${Y - open - 3} ${cx + 12} ${Y + 1} Q${cx} ${Y + open} ${cx - 12} ${Y + 1} Z`} fill="#fbf6ee" />
      <circle cx={cx + look} cy={Y + lift} r={big ? 6 : 5.3} fill="#3b2f4f" />
      <circle cx={cx + look} cy={Y + lift} r={big ? 3 : 2.6} fill={INK} />
      <circle cx={cx + look + 1.8} cy={Y + lift - 2} r="1.5" fill="#fff" />
      <path d={`M${cx - 13} ${Y + 1} Q${cx} ${Y - open - 4} ${cx + 13} ${Y - 1}`} stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d={`M${cx + 11} ${Y - 1} l4 -3`} stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d={`M${cx - 9} ${Y + open - 1} Q${cx} ${Y + open + 2} ${cx + 9} ${Y + open - 1}`} stroke={INK} strokeWidth="1.2" fill="none" opacity="0.35" />
    </g>
  );
  return <g>{eye(L)}{eye(R)}</g>;
}

function Mouth({ expr }) {
  const c = '#8a4655';
  switch (expr) {
    case 'smile':
      return <path d="M149 230 Q160 238 171 230" stroke={c} strokeWidth="3.2" strokeLinecap="round" fill="none" />;
    case 'happy':
      return <path d="M147 228 Q160 244 173 228 Q160 233 147 228 Z" fill={c} stroke={c} strokeWidth="2" strokeLinejoin="round" />;
    case 'worried':
      return <path d="M151 235 Q160 230 169 235" stroke={c} strokeWidth="3.2" strokeLinecap="round" fill="none" />;
    case 'surprised':
      return <ellipse cx="160" cy="233" rx="5" ry="6.5" fill={c} />;
    case 'thinking':
      return <path d="M153 233 Q161 231 168 234" stroke={c} strokeWidth="3.2" strokeLinecap="round" fill="none" />;
    case 'serious':
      return <path d="M151 233 H169" stroke={c} strokeWidth="3.2" strokeLinecap="round" />;
    default:
      return <path d="M151 231 Q160 235 169 231" stroke={c} strokeWidth="3.2" strokeLinecap="round" fill="none" />;
  }
}

const HEAD = 'M96 172 C96 120 124 94 160 94 C196 94 224 120 224 172 C224 214 204 248 172 262 Q160 267 148 262 C116 248 96 214 96 172 Z';

function Face({ expr, p, browColor }) {
  return (
    <g>
      <path d={HEAD} fill={p.skin} />
      <path d="M102 206 C112 238 134 256 158 263 C128 250 110 230 102 206 Z" fill={p.skinShade} opacity="0.45" />
      <ellipse cx="122" cy="212" rx="11" ry="5" fill="#d98a8a" opacity="0.13" />
      <ellipse cx="198" cy="212" rx="11" ry="5" fill="#d98a8a" opacity="0.13" />
      <path d="M161 198 Q157 210 159 214 Q162 215 165 213" stroke={p.skinShade} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <Brows expr={expr} color={browColor} />
      <Eyes expr={expr} />
      <Mouth expr={expr} />
    </g>
  );
}

function Seruni({ expr, p, gid }) {
  return (
    <g>
      <path d="M70 196 C58 112 104 66 160 66 C216 66 262 112 250 196 C246 262 262 322 252 372 L68 372 C58 322 74 262 70 196 Z" fill={`url(#${gid}-hair)`} />
      <circle cx="214" cy="84" r="30" fill={p.hair} />
      <path d="M232 62 L262 40" stroke="#D9AD75" strokeWidth="5" strokeLinecap="round" />
      <circle cx="266" cy="37" r="7" fill="none" stroke="#D9AD75" strokeWidth="4" />
      <path d="M20 420 C30 334 92 300 160 296 C228 300 290 334 300 420 Z" fill={p.accent} />
      <path d="M118 290 L160 332 L202 290 L210 318 L160 360 L110 318 Z" fill="#5e5d8d" />
      <path d="M134 292 L160 318 L186 292" stroke="#E7DDF5" strokeWidth="8" fill="none" />
      <rect x="146" y="246" width="28" height="52" fill={p.skinShade} />
      <g fill="#D9AD75">
        <circle cx="160" cy="372" r="5" />
        <circle cx="160" cy="398" r="5" />
      </g>
      <path d="M96 330 C120 312 130 306 138 300" stroke="#D9AD75" strokeWidth="3" fill="none" />
      <path d="M224 330 C200 312 190 306 182 300" stroke="#D9AD75" strokeWidth="3" fill="none" />
      <Face expr={expr} p={p} browColor={p.hair} />
      <path d="M90 178 C84 116 122 86 166 88 C206 90 234 120 232 168 C216 132 186 118 150 122 C124 126 104 146 90 178 Z" fill={p.hair} />
      <path d="M92 178 C96 210 92 246 84 282 C76 240 78 206 92 178 Z" fill={p.hair} />
      <g stroke="#D9AD75" strokeWidth="3" fill="#E7DDF5" fillOpacity="0.14">
        <circle cx="133" cy="189" r="19" />
        <circle cx="187" cy="189" r="19" />
        <path d="M152 186 Q160 180 168 186" fill="none" />
      </g>
    </g>
  );
}

function Darto({ expr, p }) {
  return (
    <g>
      <path d="M18 420 C26 334 90 302 160 298 C230 302 294 334 302 420 Z" fill="#56678f" />
      <path d="M124 296 L160 340 L196 296" fill="#4a5a80" stroke="#3d4a6b" strokeWidth="4" />
      <path d="M40 420 C46 360 70 330 104 316 L120 420 Z" fill="#F4EEDC" opacity="0.92" />
      <rect x="196" y="354" width="64" height="24" fill="#F4EEDC" />
      <text x="228" y="371" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="13" fill="#2B2742">DARTO</text>
      <rect x="146" y="246" width="28" height="56" fill={p.skinShade} />
      <ellipse cx="92" cy="186" rx="10" ry="16" fill={p.skinShade} />
      <ellipse cx="228" cy="186" rx="10" ry="16" fill={p.skinShade} />
      <Face expr={expr} p={p} browColor="#3a3640" />
      <path d="M94 160 C92 146 96 136 104 130 L106 172 Z" fill={p.hair} />
      <path d="M226 160 C228 146 224 136 216 130 L214 172 Z" fill={p.hair} />
      <path d="M140 220 C148 211 155 212 160 217 C165 212 172 211 180 220 C172 224 166 224 160 222 C154 224 148 224 140 220 Z" fill="#3a3640" />
      <path d="M84 140 C84 92 120 70 160 70 C200 70 236 92 236 140 Z" fill="#6f9a94" />
      <path d="M82 138 Q160 158 238 138 Q244 150 238 156 Q160 178 82 156 Q76 150 82 138 Z" fill="#5a817b" />
      <circle cx="160" cy="108" r="11" fill="#D9AD75" />
      <path d="M118 250 Q160 266 202 250" stroke={p.skinShade} strokeWidth="2" fill="none" opacity="0.5" />
    </g>
  );
}

function Nadia({ expr, p }) {
  return (
    <g>
      <path d="M22 420 C30 336 88 304 160 300 C232 304 290 336 298 420 Z" fill="#2c3058" />
      <path d="M118 300 L160 360 L202 300" fill="#F4EEDC" />
      <circle cx="232" cy="356" r="10" fill="#D9AD75" />
      <path d="M66 210 C58 118 106 70 160 70 C214 70 262 118 254 210 C252 270 270 300 280 350 L40 350 C50 300 68 270 66 210 Z" fill={p.hair} />
      <path d="M66 210 C58 118 106 70 160 70 C214 70 262 118 254 210" fill="none" stroke="#b292b2" strokeWidth="4" />
      <Face expr={expr} p={p} browColor="#3a2e38" />
      <path d="M92 182 C88 120 124 90 160 90 C196 90 232 120 228 182" fill="none" stroke="#dcc3dc" strokeWidth="16" strokeLinecap="round" />
      <path d="M98 232 C116 274 204 274 222 232 C232 266 248 300 262 352 L58 352 C72 300 88 266 98 232 Z" fill="#b897b8" />
      <path d="M98 232 C116 274 204 274 222 232" fill="none" stroke="#a585a5" strokeWidth="4" />
      <path d="M196 300 C206 286 222 284 230 292 C222 302 208 306 196 300 Z" fill="#91B9B4" />
      <path d="M196 300 L226 290" stroke="#5e8d86" strokeWidth="2" />
    </g>
  );
}

const DRAW = { seruni: Seruni, darto: Darto, nadia: Nadia };

export default function CharacterPortrait({ id, expr = 'neutral', active = true, side = 'left', className = '' }) {
  const raw = useId();
  const gid = `p${raw.replace(/[^a-zA-Z0-9]/g, '')}`;
  const c = CHARACTERS[id];
  const Draw = DRAW[id];
  if (!c || !Draw) return null;
  return (
    <figure
      className={`portrait portrait--${side} ${active ? 'is-speaking' : 'is-listening'} ${className}`}
      data-character={id}
      data-expr={expr}
    >
      <svg viewBox="0 0 320 420" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={`${gid}-aura`} cx="0.5" cy="0.45" r="0.55">
            <stop offset="0" stopColor={c.portrait.accent} stopOpacity="0.45" />
            <stop offset="1" stopColor={c.portrait.accent} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${gid}-hair`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a3561" />
            <stop offset="0.5" stopColor={c.portrait.hair} />
            <stop offset="1" stopColor="#14122a" />
          </linearGradient>
        </defs>
        <circle cx="160" cy="190" r="160" fill={`url(#${gid}-aura)`} />
        <Draw expr={expr} p={c.portrait} gid={gid} />
      </svg>
      <figcaption className="sr-only">{`${c.name} tampak ${EXPRESSION_LABELS[expr] || 'tenang'}`}</figcaption>
    </figure>
  );
}
