import { useId } from 'react';

// Ilustrasi lokasi dibuat dengan SVG agar ringan dan tetap tajam di semua ukuran layar.
// Semua ilustrasi memakai kanvas 1600 × 1000 (16:10). Posisi hotspot di data kasus memakai persen dari kanvas ini.

const C = {
  midnight: '#22243D', night: '#16182B', lavender: '#7776A8', mist: '#A9B8DF', dream: '#E7DDF5',
  paper: '#F4EEDC', rose: '#C8A9C8', sage: '#91B9B4', gold: '#D9AD75',
};

// Generator angka semu yang stabil agar susunan buku selalu sama.
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function Shelf({ x, y, w, h, seed, flip }) {
  const rnd = seeded(seed);
  const rows = Math.floor(h / 112);
  const colors = ['#4b4a7a', '#6b5a7e', '#3d5a63', '#7a6448', '#5c4d6e', '#384369', '#6d6f9e', '#8a7193'];
  const books = [];
  for (let r = 0; r < rows; r += 1) {
    const baseY = y + 100 + r * 112;
    let bx = x + 16;
    while (bx < x + w - 30) {
      const bw = 14 + rnd() * 20;
      const bh = 58 + rnd() * 34;
      const tilt = rnd() > 0.93;
      books.push(
        <rect
          key={`${r}-${bx}`}
          x={bx}
          y={baseY - bh}
          width={bw}
          height={bh}
          fill={colors[Math.floor(rnd() * colors.length)]}
          opacity={0.55 + rnd() * 0.35}
          transform={tilt ? `rotate(${flip ? -8 : 8} ${bx} ${baseY})` : undefined}
        />,
      );
      if (rnd() > 0.82) books.push(<rect key={`g${r}-${bx}`} x={bx + 2} y={baseY - bh + 10} width={bw - 4} height={3} fill={C.gold} opacity="0.5" />);
      bx += bw + 2 + (rnd() > 0.9 ? 26 : 0);
    }
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#171930" />
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="#3a3560" strokeWidth="10" />
      {books}
      {Array.from({ length: rows }).map((_, r) => (
        <rect key={r} x={x} y={y + 100 + r * 112} width={w} height="12" fill="#2d2a4a" />
      ))}
    </g>
  );
}

function Lantern({ x, y, len = 120, color = C.gold, id }) {
  return (
    <g>
      <line x1={x} y1="0" x2={x} y2={y - len * 0.05} stroke="#4a4570" strokeWidth="2" />
      <circle cx={x} cy={y + 30} r="90" fill={`url(#${id}-lamp)`} className="art-flicker" />
      <path d={`M${x - 18} ${y} h36 l8 18 v34 l-8 14 h-36 l-8 -14 v-34 z`} fill="#2a2748" stroke={C.gold} strokeWidth="2.5" />
      <rect x={x - 12} y={y + 18} width="24" height="30" fill={color} opacity="0.85" />
    </g>
  );
}

function Library({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#121427" />
          <stop offset="0.6" stopColor={C.midnight} />
          <stop offset="1" stopColor="#2c2a4c" />
        </linearGradient>
        <radialGradient id={`${id}-win`} cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor={C.dream} stopOpacity="0.9" />
          <stop offset="0.35" stopColor={C.mist} stopOpacity="0.55" />
          <stop offset="1" stopColor={C.lavender} stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.mist} stopOpacity="0.28" />
          <stop offset="1" stopColor={C.mist} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-lamp`}>
          <stop offset="0" stopColor={C.gold} stopOpacity="0.45" />
          <stop offset="1" stopColor={C.gold} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-rug`}>
          <stop offset="0" stopColor={C.lavender} stopOpacity="0.45" />
          <stop offset="1" stopColor={C.lavender} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="1000" fill={`url(#${id}-sky)`} />
      <path d="M620 660 V300 A180 180 0 0 1 980 300 V660 Z" fill={`url(#${id}-win)`} />
      <circle cx="800" cy="270" r="52" fill={C.dream} opacity="0.95" />
      <circle cx="800" cy="270" r="110" fill={C.dream} opacity="0.12" />
      <g stroke="#2f2c52" strokeWidth="10" fill="none">
        <path d="M620 660 V300 A180 180 0 0 1 980 300 V660 Z" />
        <line x1="800" y1="120" x2="800" y2="660" />
        <line x1="620" y1="420" x2="980" y2="420" />
        <line x1="620" y1="545" x2="980" y2="545" />
        <path d="M680 300 A120 120 0 0 1 920 300" />
      </g>
      <path d="M620 660 L980 660 L1180 1000 L420 1000 Z" fill={`url(#${id}-beam)`} />
      <Shelf x={40} y={70} w={520} h={790} seed={7} />
      <Shelf x={1040} y={70} w={520} h={790} seed={19} flip />
      <rect x="0" y="860" width="1600" height="140" fill="#1a1b31" />
      <ellipse cx="800" cy="920" rx="520" ry="70" fill={`url(#${id}-rug)`} />
      <Lantern x={600} y={120} id={id} />
      <Lantern x={1000} y={140} id={id} color={C.mist} />
      <g>
        <rect x="660" y="800" width="280" height="22" fill="#3a2f45" />
        <rect x="690" y="822" width="16" height="90" fill="#2c2438" />
        <rect x="894" y="822" width="16" height="90" fill="#2c2438" />
        <path d="M720 798 q40 -26 80 0 q40 -26 80 0 v-6 q-40 -26 -80 0 q-40 -26 -80 0 z" fill={C.paper} opacity="0.9" />
        <rect x="900" y="760" width="10" height="38" fill={C.dream} />
        <ellipse cx="905" cy="752" rx="6" ry="10" fill={C.gold} className="art-flicker" />
        <circle cx="905" cy="770" r="60" fill={`url(#${id}-lamp)`} className="art-flicker" />
      </g>
    </>
  );
}

function Letter({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-desk`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b2340" />
          <stop offset="1" stopColor="#15121f" />
        </linearGradient>
        <radialGradient id={`${id}-candle`} cx="0.2" cy="0.3" r="0.6">
          <stop offset="0" stopColor={C.gold} stopOpacity="0.38" />
          <stop offset="1" stopColor={C.gold} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-moon`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.mist} stopOpacity="0.22" />
          <stop offset="0.6" stopColor={C.mist} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill={`url(#${id}-desk)`} />
      {Array.from({ length: 14 }).map((_, i) => (
        <path key={i} d={`M0 ${70 * i + 20} Q800 ${70 * i + (i % 2 ? 40 : -10)} 1600 ${70 * i + 30}`} stroke="#3a2f52" strokeWidth="2" fill="none" opacity="0.5" />
      ))}
      <rect width="1600" height="1000" fill={`url(#${id}-candle)`} className="art-flicker" />
      <polygon points="1600,0 1100,0 600,1000 1600,1000" fill={`url(#${id}-moon)`} />
      <g transform="rotate(-6 800 520)">
        <rect x="490" y="320" width="620" height="390" fill="#e9e1cc" />
        <rect x="490" y="320" width="620" height="390" fill="none" stroke="#c8b998" strokeWidth="3" />
        <path d="M490 320 L800 540 L1110 320" fill="#efe7d3" stroke="#c8b998" strokeWidth="3" />
        <path d="M490 710 L720 520 M1110 710 L880 520" stroke="#d6caae" strokeWidth="3" />
        <circle cx="800" cy="540" r="54" fill="#a9763f" />
        <circle cx="800" cy="540" r="54" fill="none" stroke="#8a5d2e" strokeWidth="6" strokeDasharray="10 7" />
        <g stroke="#f1cf9c" strokeWidth="5" fill="none" strokeLinecap="round">
          <circle cx="792" cy="524" r="12" />
          <path d="M800 534 L820 560 M812 548 l-8 6 M816 554 l-6 5" />
        </g>
        <text x="540" y="380" fontFamily="Cinzel, Georgia, serif" fontSize="26" fill="#6d6152" letterSpacing="4">UNTUK CALON PENYELIDIK</text>
      </g>
      <g transform="rotate(18 1260 760)">
        <path d="M1180 900 C1250 760 1320 640 1420 560 C1380 660 1300 780 1200 905 Z" fill={C.dream} opacity="0.9" />
        <path d="M1190 905 L1420 560" stroke="#9a8fb8" strokeWidth="3" />
      </g>
      <g>
        <rect x="200" y="660" width="110" height="130" rx="8" fill="#1f1b33" stroke={C.lavender} strokeWidth="3" />
        <rect x="228" y="630" width="54" height="34" fill="#2a2546" stroke={C.lavender} strokeWidth="3" />
        <rect x="350" y="600" width="26" height="160" fill={C.paper} />
        <ellipse cx="363" cy="586" rx="10" ry="18" fill={C.gold} className="art-flicker" />
      </g>
    </>
  );
}

function Gate({ id }) {
  const rnd = seeded(31);
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f1124" />
          <stop offset="0.65" stopColor="#2b2b52" />
          <stop offset="1" stopColor="#5b5689" />
        </linearGradient>
        <radialGradient id={`${id}-door`}>
          <stop offset="0" stopColor={C.gold} stopOpacity="0.85" />
          <stop offset="1" stopColor={C.gold} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-mist`}>
          <stop offset="0" stopColor={C.dream} stopOpacity="0.32" />
          <stop offset="1" stopColor={C.dream} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-blue`}>
          <stop offset="0" stopColor={C.mist} stopOpacity="0.7" />
          <stop offset="1" stopColor={C.mist} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="1000" fill={`url(#${id}-sky)`} />
      {Array.from({ length: 70 }).map((_, i) => (
        <circle key={i} cx={rnd() * 1600} cy={rnd() * 420} r={rnd() * 1.8 + 0.4} fill={C.dream} opacity={0.3 + rnd() * 0.6} className={i % 5 === 0 ? 'art-twinkle' : undefined} />
      ))}
      <circle cx="1300" cy="150" r="46" fill={C.dream} />
      <circle cx="1300" cy="150" r="120" fill={C.dream} opacity="0.08" />
      <g fill="#1a1b33">
        <rect x="360" y="330" width="880" height="420" />
        <rect x="300" y="200" width="160" height="550" />
        <polygon points="290,205 380,40 470,205" />
        <rect x="1140" y="200" width="160" height="550" />
        <polygon points="1130,205 1220,40 1310,205" />
        <polygon points="640,330 800,190 960,330" />
      </g>
      <g fill={C.mist} opacity="0.75">
        <rect x="360" y="260" width="40" height="70" rx="20" />
        <rect x="1200" y="260" width="40" height="70" rx="20" />
        {[440, 520, 1020, 1100].map((x) => <rect key={x} x={x} y="420" width="34" height="62" rx="17" opacity="0.6" />)}
      </g>
      <g fill={C.gold} opacity="0.7">
        {[440, 520, 1020, 1100].map((x) => <rect key={x} x={x} y="560" width="34" height="62" rx="17" opacity="0.5" />)}
        <circle cx="800" cy="270" r="26" opacity="0.8" />
      </g>
      <path d="M700 750 V520 A100 100 0 0 1 900 520 V750 Z" fill={C.gold} opacity="0.9" />
      <circle cx="800" cy="610" r="260" fill={`url(#${id}-door)`} className="art-flicker" />
      <path d="M800 750 V520" stroke="#b78d57" strokeWidth="6" />
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={640 - i * 60} y={750 + i * 42} width={320 + i * 120} height="42" fill={i % 2 ? '#282848' : '#24243f'} />
      ))}
      {[[560, 800], [1040, 800], [470, 900], [1130, 900]].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r="70" fill={`url(#${id}-blue)`} className="art-flicker" />
          <rect x={x - 4} y={y} width="8" height="70" fill="#2e2c50" />
          <rect x={x - 12} y={y - 26} width="24" height="28" fill={C.mist} />
        </g>
      ))}
      <ellipse cx="300" cy="930" rx="520" ry="80" fill={`url(#${id}-mist)`} className="art-drift" />
      <ellipse cx="1320" cy="950" rx="560" ry="90" fill={`url(#${id}-mist)`} className="art-drift art-drift--slow" />
    </>
  );
}

function Garden({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#262848" />
          <stop offset="0.45" stopColor="#5f5c92" />
          <stop offset="0.6" stopColor={C.rose} />
        </linearGradient>
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#334652" />
          <stop offset="1" stopColor="#1b2031" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor={C.mist} stopOpacity="0.5" />
          <stop offset="1" stopColor={C.mist} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1600" height="1000" fill={`url(#${id}-sky)`} />
      <circle cx="1300" cy="120" r="34" fill={C.dream} opacity="0.95" />
      <circle cx="1300" cy="120" r="90" fill={C.dream} opacity="0.1" />
      {/* tembok arkade belakang */}
      <rect x="0" y="360" width="1600" height="210" fill="#36385e" />
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={i} d={`M${330 + i * 140} 560 V450 A50 50 0 0 1 ${430 + i * 140} 450 V560 Z`} fill="#242543" />
      ))}
      <rect x="0" y="352" width="1600" height="14" fill="#47497a" />
      <g fill="#24253f">
        <rect x="120" y="140" width="170" height="430" />
        <polygon points="110,145 205,20 300,145" />
      </g>
      <rect x="188" y="230" width="34" height="60" rx="17" fill={C.gold} opacity="0.75" />
      {/* pagar tanaman */}
      <path d="M0 540 Q80 500 160 540 T320 540 T480 540 T640 540 T800 540 T960 540 T1120 540 T1280 540 T1440 540 T1600 540 V600 H0 Z" fill="#2f4c50" />
      <rect x="0" y="580" width="1600" height="420" fill={`url(#${id}-ground)`} />
      <polygon points="720,590 880,590 1120,1000 480,1000" fill="#4a4868" opacity="0.65" />
      {[640, 700, 780, 870, 970].map((y, i) => (
        <line key={y} x1={800 - 90 - i * 60} y1={y} x2={800 + 90 + i * 60} y2={y} stroke="#2c2b48" strokeWidth="4" opacity="0.6" />
      ))}

      {/* rak alat siram (13%, 63%) */}
      <g>
        <rect x="150" y="530" width="12" height="200" fill="#5b4636" />
        <rect x="262" y="530" width="12" height="200" fill="#5b4636" />
        <rect x="142" y="540" width="140" height="12" fill="#6e5541" />
        <rect x="142" y="650" width="140" height="10" fill="#6e5541" />
        <path d="M168 560 h44 l10 50 h-64 z" fill="#5f7c80" />
        <path d="M222 575 l26 -14" stroke="#5f7c80" strokeWidth="7" strokeLinecap="round" />
        <path d="M226 600 h36 l6 42 h-48 z" fill={C.lavender} />
        <rect x="180" y="664" width="60" height="8" fill={C.sage} />
        <circle cx="244" cy="676" r="3" fill={C.mist} className="art-drip" />
      </g>

      {/* papan jadwal (33%, 42%) */}
      <g>
        <rect x="520" y="470" width="16" height="260" fill="#4f3c2f" />
        <rect x="420" y="320" width="216" height="170" fill="#4f3c2f" />
        <rect x="432" y="332" width="192" height="146" fill={C.paper} />
        <rect x="432" y="332" width="192" height="146" fill={C.mist} opacity="0.12" />
        <text x="528" y="358" textAnchor="middle" fontFamily="Cinzel, Georgia, serif" fontSize="15" fill="#3b3550">JADWAL SIRAM</text>
        {[380, 400, 420, 440, 460].map((y, i) => (
          <line key={y} x1="448" y1={y} x2={i > 2 ? 560 : 600} y2={y} stroke={i > 2 ? '#a0703b' : '#7d7590'} strokeWidth="4" />
        ))}
        <circle cx="440" cy="340" r="5" fill={C.gold} />
        <circle cx="616" cy="340" r="5" fill={C.gold} />
      </g>

      {/* air mancur (52%, 55%) */}
      <g>
        <circle cx="832" cy="520" r="160" fill={`url(#${id}-glow)`} />
        <ellipse cx="832" cy="610" rx="150" ry="34" fill="#4a4a70" />
        <ellipse cx="832" cy="600" rx="130" ry="24" fill={C.mist} opacity="0.55" />
        <rect x="818" y="510" width="28" height="90" fill="#5a5a82" />
        <ellipse cx="832" cy="510" rx="60" ry="14" fill="#5a5a82" />
        <path d="M832 500 C832 440 790 450 780 500 M832 500 C832 440 874 450 884 500" stroke={C.mist} strokeWidth="5" fill="none" className="art-shimmer" />
        <path d="M832 500 V455" stroke={C.dream} strokeWidth="5" className="art-shimmer" />
      </g>

      {/* bedeng tanaman (62%, 84%) */}
      <g>
        <polygon points="830,800 1160,800 1190,910 800,910" fill="#3a2b2a" />
        <polygon points="830,800 1160,800 1165,815 825,815" fill="#5a4436" />
        {Array.from({ length: 13 }).map((_, i) => {
          const x = 850 + i * 25;
          return (
            <g key={i}>
              <path d={`M${x} 805 Q${x - 18} ${770 - (i % 3) * 10} ${x - 6} ${745 - (i % 4) * 8}`} stroke={C.sage} strokeWidth="5" fill="none" />
              <ellipse cx={x - 12} cy={770 - (i % 3) * 8} rx="14" ry="7" fill="#5e8d86" transform={`rotate(-30 ${x - 12} ${770 - (i % 3) * 8})`} />
              <ellipse cx={x + 8} cy={782 - (i % 2) * 6} rx="12" ry="6" fill={C.sage} transform={`rotate(25 ${x + 8} ${782})`} />
              {i % 2 === 0 ? <circle cx={x - 6} cy={742 - (i % 4) * 8} r="9" fill={i % 4 === 0 ? C.rose : C.gold} /> : null}
            </g>
          );
        })}
        <rect x="1130" y="740" width="8" height="70" fill="#6e5541" />
        <rect x="1100" y="730" width="68" height="34" fill={C.paper} />
      </g>

      {/* keran & selang (77%, 62%) */}
      <g>
        <rect x="1226" y="560" width="18" height="170" fill="#6d7898" />
        <path d="M1226 590 h-30 v16 h30" fill="#8d97b3" />
        <rect x="1214" y="566" width="42" height="12" fill={C.gold} />
        <circle cx="1270" cy="610" r="18" fill={C.paper} stroke={C.gold} strokeWidth="4" />
        <line x1="1270" y1="610" x2="1278" y2="600" stroke="#3b3550" strokeWidth="3" />
        <g fill="none" stroke="#5f9187" strokeWidth="10">
          <ellipse cx="1300" cy="730" rx="70" ry="22" />
          <ellipse cx="1300" cy="722" rx="56" ry="16" />
          <path d="M1244 700 Q1250 730 1236 730" />
        </g>
      </g>

      {/* gudang & catatan (91%, 46%) */}
      <g>
        <rect x="1370" y="340" width="240" height="440" fill="#2c2c4a" />
        <polygon points="1350,350 1490,250 1620,350" fill="#24243f" />
        <rect x="1410" y="410" width="110" height="370" fill="#3f3654" stroke="#5b4e72" strokeWidth="5" />
        <circle cx="1505" cy="600" r="6" fill={C.gold} />
        <g transform="rotate(5 1456 460)">
          <rect x="1426" y="430" width="62" height="70" fill={C.paper} />
          <path d="M1434 448 h44 M1434 462 h36 M1434 476 h42" stroke="#9e5550" strokeWidth="3" />
          <rect x="1446" y="424" width="22" height="10" fill={C.mist} opacity="0.7" />
        </g>
      </g>
    </>
  );
}

function Maintenance({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f2138" />
          <stop offset="1" stopColor="#30315a" />
        </linearGradient>
        <radialGradient id={`${id}-lamp`} cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor={C.gold} stopOpacity="0.55" />
          <stop offset="1" stopColor={C.gold} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-moon`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.mist} stopOpacity="0.25" />
          <stop offset="1" stopColor={C.mist} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-pipe`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8592b3" />
          <stop offset="1" stopColor="#4c5676" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill={`url(#${id}-wall)`} />
      {Array.from({ length: 13 }).map((_, r) => (
        <g key={r} opacity="0.12">
          <line x1="0" y1={60 * r + 40} x2="1600" y2={60 * r + 40} stroke={C.mist} />
          {Array.from({ length: 14 }).map((__, c) => (
            <line key={c} x1={c * 120 + (r % 2) * 60} y1={60 * r + 40} x2={c * 120 + (r % 2) * 60} y2={60 * r + 100} stroke={C.mist} />
          ))}
        </g>
      ))}
      <rect x="560" y="70" width="210" height="130" fill={C.mist} opacity="0.4" />
      <g stroke="#1d1f36" strokeWidth="6">
        {[600, 640, 680, 720].map((x) => <line key={x} x1={x} y1="70" x2={x} y2="200" />)}
      </g>
      <polygon points="560,200 770,200 1000,780 420,780" fill={`url(#${id}-moon)`} />
      {/* pipa */}
      <rect x="0" y="150" width="1600" height="30" fill={`url(#${id}-pipe)`} />
      <rect x="1166" y="180" width="30" height="120" fill={`url(#${id}-pipe)`} />
      <rect x="1166" y="440" width="30" height="340" fill={`url(#${id}-pipe)`} />
      <rect x="340" y="180" width="24" height="260" fill={`url(#${id}-pipe)`} />
      {[1181, 352].map((x) => <rect key={x} x={x - 22} y="142" width="44" height="46" fill="#6f7a9c" />)}
      {/* pipa tua (8%, 38%) */}
      <g>
        <rect x="104" y="180" width="44" height="600" fill="#6a4a46" />
        <rect x="96" y="290" width="60" height="22" fill="#7d554c" />
        <rect x="96" y="560" width="60" height="22" fill="#7d554c" />
        {[[110, 340, 14], [130, 420, 10], [118, 480, 12], [138, 640, 9]].map(([x, y, r]) => (
          <circle key={y} cx={x} cy={y} r={r} fill="#a0603f" opacity="0.8" />
        ))}
        <rect x="160" y="370" width="54" height="26" fill={C.paper} opacity="0.85" transform="rotate(-4 160 370)" />
      </g>
      {/* meter (74%, 37%) */}
      <g>
        <circle cx="1181" cy="370" r="84" fill="#2a2a46" />
        <circle cx="1181" cy="370" r="74" fill={C.gold} />
        <circle cx="1181" cy="370" r="64" fill={C.paper} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <line key={i} x1={1181 + Math.cos(a) * 52} y1={370 + Math.sin(a) * 52} x2={1181 + Math.cos(a) * 60} y2={370 + Math.sin(a) * 60} stroke="#3b3550" strokeWidth="3" />;
        })}
        <rect x="1141" y="386" width="80" height="22" fill="#2b2742" />
        <text x="1181" y="403" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="16" fill={C.paper}>26860</text>
        <line x1="1181" y1="370" x2="1210" y2="338" stroke="#9e4a46" strokeWidth="4" className="art-needle" />
        <circle cx="1181" cy="370" r="6" fill="#3b3550" />
        <rect x="1278" y="330" width="56" height="74" fill={C.paper} transform="rotate(4 1278 330)" />
      </g>
      {/* papan klip (55%, 36%) */}
      <g>
        <line x1="880" y1="250" x2="880" y2="290" stroke={C.gold} strokeWidth="4" />
        <rect x="830" y="286" width="100" height="140" fill="#6e5541" />
        <rect x="842" y="304" width="76" height="112" fill={C.paper} />
        <rect x="860" y="280" width="40" height="16" fill="#9aa3bd" />
        {[326, 348, 370, 392].map((y) => (
          <g key={y}>
            <path d={`M850 ${y} l4 4 l8 -9`} stroke="#4f7d72" strokeWidth="3" fill="none" />
            <line x1="868" y1={y} x2="910" y2={y} stroke="#7d7590" strokeWidth="3" />
          </g>
        ))}
      </g>
      {/* meja & lampu (32%, 60%) */}
      <g>
        <polygon points="190,420 330,420 430,800 90,800" fill={`url(#${id}-lamp)`} className="art-flicker" />
        <path d="M228 520 L260 440 L300 440 L330 520 Z" fill={C.lavender} />
        <rect x="270" y="520" width="12" height="120" fill="#3c3758" />
        <rect x="160" y="636" width="640" height="26" fill="#5a4436" />
        <rect x="180" y="662" width="600" height="140" fill="#3e3040" />
        <rect x="200" y="690" width="260" height="90" fill="#352a39" stroke="#584658" strokeWidth="3" />
        <rect x="490" y="690" width="270" height="90" fill="#352a39" stroke="#584658" strokeWidth="3" />
        <g transform="rotate(-5 520 610)">
          <rect x="440" y="592" width="150" height="46" fill={C.paper} />
          <rect x="450" y="580" width="150" height="46" fill="#ebe3cc" />
          <rect x="460" y="570" width="130" height="50" fill="#4f6a9e" />
          <rect x="474" y="582" width="70" height="12" fill={C.paper} />
        </g>
        <rect x="660" y="590" width="40" height="46" rx="6" fill={C.dream} />
        <path d="M700 600 q20 4 0 24" stroke={C.dream} strokeWidth="6" fill="none" />
      </g>
      {/* lemari arsip (89%, 62%) */}
      <g>
        <rect x="1350" y="470" width="170" height="330" fill="#3b3d61" stroke="#545783" strokeWidth="4" />
        {[490, 590, 690].map((y, i) => (
          <g key={y}>
            <rect x={i === 1 ? 1350 : 1362} y={y} width={i === 1 ? 170 : 146} height="86" fill={i === 1 ? '#4a4c75' : '#34365a'} stroke="#545783" strokeWidth="3" />
            <rect x="1415" y={y + 36} width="40" height="10" fill={C.gold} />
          </g>
        ))}
        <rect x="1380" y="572" width="110" height="24" fill={C.paper} transform="rotate(-3 1380 572)" />
      </g>
      <rect x="0" y="800" width="1600" height="200" fill="#191a2e" />
      <rect x="0" y="800" width="1600" height="6" fill="#2d2f50" />
      {/* kotak perkakas (63%, 85%) */}
      <g>
        <rect x="940" y="820" width="140" height="70" fill="#7b5a77" />
        <rect x="940" y="820" width="140" height="18" fill="#93708f" />
        <path d="M985 820 v-20 h50 v20" stroke="#5c4459" strokeWidth="8" fill="none" />
        <rect x="1070" y="860" width="90" height="12" fill="#8d97b3" transform="rotate(-12 1070 860)" />
      </g>
    </>
  );
}

function Figure({ x, y, kind }) {
  const s = 1;
  if (kind === 'nadia') {
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx="0" cy="190" rx="60" ry="12" fill="#000" opacity="0.25" />
        <rect x="-16" y="120" width="12" height="70" fill="#2b2a3f" />
        <rect x="6" y="120" width="12" height="70" fill="#2b2a3f" />
        <path d="M-40 20 Q0 0 40 20 L48 130 H-48 Z" fill="#2c3058" />
        <path d="M-30 -60 Q0 -95 30 -60 Q46 -10 34 30 Q0 50 -34 30 Q-46 -10 -30 -60 Z" fill={C.rose} />
        <ellipse cx="0" cy="-38" rx="20" ry="24" fill="#C99472" />
        <rect x="-26" y="40" width="30" height="40" fill={C.sage} transform="rotate(-12)" />
        <circle cx="22" cy="38" r="5" fill={C.gold} />
      </g>
    );
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="190" rx="66" ry="12" fill="#000" opacity="0.25" />
      <rect x="-22" y="110" width="18" height="80" fill="#2f2f45" />
      <rect x="6" y="110" width="18" height="80" fill="#2f2f45" />
      <path d="M-48 10 Q0 -6 48 10 L52 118 H-52 Z" fill="#56678f" />
      <rect x="-48" y="12" width="16" height="70" fill={C.paper} opacity="0.9" />
      <ellipse cx="0" cy="-30" rx="26" ry="30" fill="#A8714E" />
      <path d="M-28 -40 Q0 -78 28 -40 Z" fill="#6f9a94" />
      <rect x="-36" y="-44" width="58" height="8" fill="#5a817b" />
      <rect x="40" y="70" width="56" height="34" fill="#7b5a77" />
    </g>
  );
}

function Hallway({ id }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-wallL`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1c1d35" />
          <stop offset="1" stopColor="#34365e" />
        </linearGradient>
        <linearGradient id={`${id}-wallR`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#1c1d35" />
          <stop offset="1" stopColor="#34365e" />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d3b63" />
          <stop offset="1" stopColor="#1a1b30" />
        </linearGradient>
        <radialGradient id={`${id}-end`}>
          <stop offset="0" stopColor={C.dream} stopOpacity="0.85" />
          <stop offset="1" stopColor={C.lavender} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-lamp`}>
          <stop offset="0" stopColor={C.mist} stopOpacity="0.5" />
          <stop offset="1" stopColor={C.mist} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-beam`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.gold} stopOpacity="0.35" />
          <stop offset="1" stopColor={C.gold} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill="#1c1d35" />
      <polygon points="0,0 1600,0 1040,300 560,300" fill="#17182c" />
      <polygon points="0,0 560,300 560,640 0,1000" fill={`url(#${id}-wallL)`} />
      <polygon points="1600,0 1040,300 1040,640 1600,1000" fill={`url(#${id}-wallR)`} />
      <rect x="560" y="300" width="480" height="340" fill="#2b2c4f" />
      <path d="M700 640 V460 A100 100 0 0 1 900 460 V640 Z" fill={`url(#${id}-end)`} />
      <polygon points="0,1000 560,640 1040,640 1600,1000" fill={`url(#${id}-floor)`} />
      {[-560, -320, -120, 80, 280, 520].map((dx) => (
        <line key={dx} x1={800 + dx * 0.43} y1="640" x2={800 + dx * 1.6} y2="1000" stroke="#2a2a48" strokeWidth="3" />
      ))}
      {[700, 780, 880].map((y) => {
        const t = (y - 640) / 360;
        return <line key={y} x1={560 - 560 * t} y1={y} x2={1040 + 560 * t} y2={y} stroke="#2a2a48" strokeWidth="3" />;
      })}
      {/* lengkung kiri & kanan */}
      {[0.15, 0.45, 0.72].map((t) => {
        const xl = 560 * t;
        const xr = 1600 - 560 * t;
        const top = 300 * t;
        const bot = 1000 - 360 * t;
        return (
          <g key={t} stroke="#4b4b7c" strokeWidth={10 - t * 8} fill="none" opacity="0.8">
            <line x1={xl} y1={top} x2={xl} y2={bot} />
            <line x1={xr} y1={top} x2={xr} y2={bot} />
          </g>
        );
      })}
      {[[520, 120], [800, 200], [1080, 120]].map(([x, y], i) => (
        <g key={x}>
          <circle cx={x} cy={y + 30} r={110 - i * 10} fill={`url(#${id}-lamp)`} className="art-flicker" />
          <line x1={x} y1={y - 120} x2={x} y2={y} stroke="#4a4570" strokeWidth="2" />
          <rect x={x - 14} y={y} width="28" height="38" fill={C.mist} opacity="0.85" stroke={C.gold} strokeWidth="2" />
        </g>
      ))}
      {/* papan mading (20%, 40%) */}
      <g>
        <polygon points="210,290 430,350 430,520 210,550" fill="#5a4436" />
        <polygon points="222,306 418,360 418,508 222,532" fill="#7b6a58" />
        <polygon points="236,322 300,338 300,410 236,400" fill={C.paper} />
        <polygon points="316,346 400,366 400,440 316,428" fill={C.sage} />
        <polygon points="240,420 320,432 320,500 240,500" fill={C.dream} />
        <polygon points="336,450 404,458 404,500 336,508" fill={C.rose} />
        <circle cx="358" cy="362" r="5" fill={C.gold} />
      </g>
      {/* jendela (87%, 34%) */}
      <g>
        <polygon points="1330,200 1470,140 1470,520 1330,490" fill={C.gold} opacity="0.55" />
        <polygon points="1330,200 1400,170 1400,505 1330,490" fill={C.rose} opacity="0.35" />
        <polygon points="1400,170 1470,140 1470,520 1400,505" fill={C.mist} opacity="0.35" />
        <polygon points="1330,200 1470,140 1470,520 1330,490" fill="none" stroke="#4b4b7c" strokeWidth="8" />
        <line x1="1330" y1="345" x2="1470" y2="330" stroke="#4b4b7c" strokeWidth="6" />
        <polygon points="1330,490 1470,520 1200,960 900,880" fill={`url(#${id}-beam)`} />
      </g>
      <Figure x={560} y={600} kind="nadia" />
      <Figure x={1136} y={600} kind="darto" />
      {/* tanda lantai basah (55%, 83%) */}
      <g>
        <ellipse cx="880" cy="900" rx="120" ry="22" fill={C.mist} opacity="0.25" className="art-shimmer" />
        <polygon points="850,890 880,780 910,890" fill={C.gold} />
        <polygon points="880,780 900,890 920,880" fill="#b98a52" />
        <text x="878" y="868" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="38" fill={C.midnight}>!</text>
        <rect x="1010" y="760" width="12" height="140" fill="#6e5541" transform="rotate(10 1016 830)" />
        <path d="M980 880 h60 l-8 30 h-44 z" fill="#5a6b8f" />
      </g>
    </>
  );
}

const SCENES = { library: Library, letter: Letter, gate: Gate, garden: Garden, maintenance: Maintenance, hallway: Hallway };

export const SCENE_LABELS = {
  library: 'Ruang Arsip Akademi yang dipenuhi rak buku tinggi dan jendela bulan',
  letter: 'Sebuah meja malam dengan amplop bersegel lilin keemasan',
  gate: 'Gerbang Akademi Pengetahuan Tersembunyi di malam berbintang',
  garden: 'Taman Akademi saat senja',
  maintenance: 'Ruang Pemeliharaan dengan pipa, meter air, dan meja kerja',
  hallway: 'Lorong Akademi berlengkung dengan lentera biru',
};

export default function SceneArt({ scene = 'library', fit = 'slice', className = '' }) {
  const raw = useId();
  const id = `s${raw.replace(/[^a-zA-Z0-9]/g, '')}`;
  const Comp = SCENES[scene] || Library;
  return (
    <svg
      className={`scene-art ${className}`}
      viewBox="0 0 1600 1000"
      preserveAspectRatio={fit === 'meet' ? 'xMidYMid meet' : 'xMidYMid slice'}
      role="img"
      aria-label={SCENE_LABELS[scene]}
    >
      <Comp id={id} />
    </svg>
  );
}
