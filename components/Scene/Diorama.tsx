import Image from "next/image";
import type { TourType } from "@/lib/types";

// Isometric slab geometry shared by every theme (viewBox 600 x 460).
const TOP = "300,110 570,245 300,380 30,245";
const LEFT = "30,245 300,380 300,422 30,287";
const RIGHT = "300,380 570,245 570,287 300,422";

type Palette = { top: string; left: string; right: string; shadow: string };

const palettes: Record<TourType, Palette> = {
  hills: { top: "#8fbf6a", left: "#5b4a36", right: "#47392a", shadow: "#2f4a35" },
  desert: { top: "#e3a06b", left: "#b8673a", right: "#9a522c", shadow: "#6e3a1f" },
  beach: { top: "#ecd9ac", left: "#b99c68", right: "#9c8152", shadow: "#2c5f63" },
  mountain: { top: "#cdb48c", left: "#7c6449", right: "#665139", shadow: "#26394f" },
  backwaters: { top: "#86b65e", left: "#6a5034", right: "#56412a", shadow: "#2f4a24" },
  heritage: { top: "#e9c9ad", left: "#b98767", right: "#9e7052", shadow: "#6b2f37" },
  wildlife: { top: "#bdb867", left: "#7b6338", right: "#66512d", shadow: "#3e4a1c" },
  snow: { top: "#f4f7fb", left: "#a9b8cc", right: "#8fa1b9", shadow: "#27467a" },
};

function Pine({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2" y="-6" width="4" height="10" fill="#5a3d26" />
      <path d="M0 -42 L14 -14 L-14 -14 Z" fill="#2f6b44" />
      <path d="M0 -30 L17 -4 L-17 -4 Z" fill="#285d3b" />
    </g>
  );
}

function DeadTree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#4a2c1a" strokeLinecap="round" fill="none">
      <path d="M0 0 C 0 -20, 2 -34, -2 -52" strokeWidth="5" />
      <path d="M-1 -30 C -10 -38, -18 -40, -26 -52" strokeWidth="3" />
      <path d="M0 -38 C 10 -44, 16 -52, 22 -64" strokeWidth="3" />
      <path d="M-2 -50 C -6 -58, -4 -64, -8 -72" strokeWidth="2" />
    </g>
  );
}

function Palm({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 C 4 -22, 2 -46, 10 -70" stroke="#7a5631" strokeWidth="5" fill="none" strokeLinecap="round" />
      <g fill="#2f8a5b">
        <path d="M10 -70 C -6 -78, -24 -72, -34 -58 C -18 -66, -4 -66, 10 -70 Z" />
        <path d="M10 -70 C 26 -80, 42 -74, 50 -60 C 36 -68, 22 -68, 10 -70 Z" />
        <path d="M10 -70 C 4 -88, 14 -98, 26 -100 C 18 -90, 14 -80, 10 -70 Z" />
        <path d="M10 -70 C -4 -86, -18 -88, -28 -84 C -14 -80, -2 -76, 10 -70 Z" />
      </g>
    </g>
  );
}

function Jeep({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="14" rx="34" ry="7" fill="#000" opacity="0.18" />
      <path d="M-30 4 L-24 -12 L18 -12 L30 0 L30 8 L-30 8 Z" fill={color} />
      <rect x="-20" y="-24" width="30" height="13" rx="2" fill="#efe6d4" />
      <rect x="-16" y="-10" width="14" height="8" rx="1" fill="#9cc6d6" />
      <rect x="0" y="-10" width="12" height="8" rx="1" fill="#9cc6d6" />
      <circle cx="-18" cy="9" r="7" fill="#262626" />
      <circle cx="18" cy="9" r="7" fill="#262626" />
      <circle cx="-18" cy="9" r="3" fill="#8a8a8a" />
      <circle cx="18" cy="9" r="3" fill="#8a8a8a" />
    </g>
  );
}

function HillsScene() {
  return (
    <>
      {/* Kanchenjunga backdrop */}
      <g>
        <path d="M70 250 L190 70 L250 150 L330 30 L430 160 L480 110 L560 250 Z" fill="#b9c8d6" />
        <path d="M190 70 L215 108 L198 104 L182 118 L170 100 Z" fill="#fff" />
        <path d="M330 30 L368 86 L346 80 L330 96 L312 78 L296 82 Z" fill="#fff" />
        <path d="M480 110 L500 138 L486 134 L470 142 L462 132 Z" fill="#fff" />
      </g>
      <polygon points={TOP} fill="#8fbf6a" />
      <clipPath id="clip-hills">
        <polygon points={TOP} />
      </clipPath>
      <g clipPath="url(#clip-hills)">
        {/* tea terraces */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <path
            key={i}
            d={`M20 ${170 + i * 26} C 160 ${130 + i * 26}, 300 ${210 + i * 26}, 590 ${150 + i * 26}`}
            stroke={i % 2 ? "#5f9a48" : "#4f8a3c"}
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />
        ))}
        {/* toy train track */}
        <path d="M60 268 C 180 300, 320 250, 470 300" stroke="#6b5a48" strokeWidth="6" fill="none" />
      </g>
      {/* toy train */}
      <g transform="translate(250 270) rotate(-6)">
        <rect x="-44" y="-16" width="26" height="16" rx="3" fill="#3a6fb0" />
        <rect x="-14" y="-16" width="26" height="16" rx="3" fill="#3a6fb0" />
        <rect x="16" y="-20" width="24" height="20" rx="3" fill="#24476f" />
        <rect x="30" y="-28" width="6" height="9" fill="#24476f" />
        <rect x="-40" y="-12" width="18" height="6" fill="#d8e8f6" />
        <rect x="-10" y="-12" width="18" height="6" fill="#d8e8f6" />
      </g>
      {/* cottage */}
      <g transform="translate(400 222)">
        <rect x="-22" y="-20" width="44" height="26" fill="#f3ead8" />
        <path d="M-28 -18 L0 -40 L28 -18 Z" fill="#c4452f" />
        <rect x="-6" y="-8" width="12" height="14" fill="#6b4a2e" />
      </g>
      <Pine x={150} y={228} s={1.1} />
      <Pine x={178} y={240} s={0.9} />
      <Pine x={470} y={260} s={1} />
      <Pine x={330} y={330} s={0.85} />
      <Pine x={120} y={262} s={0.8} />
    </>
  );
}

function DesertScene() {
  return (
    <>
      {/* golden fort on the horizon */}
      <g transform="translate(360 168)" fill="#c98a4f">
        <rect x="-70" y="-30" width="140" height="40" />
        {[-70, -50, -30, -10, 10, 30, 50].map((x) => (
          <rect key={x} x={x} y="-38" width="10" height="9" />
        ))}
        <rect x="-20" y="-62" width="30" height="34" />
        <rect x="-16" y="-70" width="8" height="9" />
        <rect x="-2" y="-70" width="8" height="9" />
      </g>
      <polygon points={TOP} fill="#e3a06b" />
      <clipPath id="clip-desert">
        <polygon points={TOP} />
      </clipPath>
      <g clipPath="url(#clip-desert)">
        <path d="M20 250 C 120 150, 220 160, 300 240 C 360 300, 420 210, 590 230 L590 400 L20 400 Z" fill="#d78c55" />
        <path d="M120 200 C 170 175, 210 180, 260 222 L 120 260 Z" fill="#f0b884" />
        <path d="M60 330 C 180 260, 300 300, 380 360 L 60 400 Z" fill="#cf7f48" />
        {/* jeep track */}
        <path d="M120 300 C 220 280, 300 330, 420 300" stroke="#c07443" strokeWidth="10" fill="none" strokeDasharray="2 10" />
      </g>
      <DeadTree x={150} y={262} s={1.2} />
      <DeadTree x={470} y={262} s={0.9} />
      <DeadTree x={420} y={320} s={0.7} />
      {/* camels */}
      <g fill="#7a4a26" transform="translate(220 232)">
        <path d="M0 0 C 4 -14, 14 -16, 18 -8 C 22 -16, 30 -14, 32 -4 L 40 -10 L 44 -6 L 36 2 L 34 12 L30 12 L 30 4 L 8 4 L 8 12 L 4 12 Z" />
      </g>
      <Jeep x={318} y={318} color="#d6c6a6" />
    </>
  );
}

function BeachScene() {
  return (
    <>
      <polygon points={TOP} fill="#ecd9ac" />
      <clipPath id="clip-beach">
        <polygon points={TOP} />
      </clipPath>
      <g clipPath="url(#clip-beach)">
        {/* sea */}
        <path d="M300 110 L590 255 L590 420 L300 420 C 360 330, 300 260, 240 190 C 220 160, 260 130, 300 110 Z" fill="#3fb3b5" />
        <path d="M300 110 L590 255 L590 420 L360 420 C 410 330, 350 260, 300 200 C 280 170, 290 130, 300 110 Z" fill="#2a9aa1" />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${250 + i * 16} ${150 + i * 50} C ${290 + i * 16} ${175 + i * 50}, ${280 + i * 16} ${215 + i * 50}, ${320 + i * 16} ${245 + i * 50}`}
            stroke="#e9fbfb"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.85"
          />
        ))}
      </g>
      {/* side faces for water half read as cliff */}
      {/* boat */}
      <g transform="translate(450 262)">
        <path d="M-30 0 L30 0 L22 12 L-22 12 Z" fill="#c4452f" />
        <path d="M0 0 L0 -40 L22 -6 Z" fill="#f6efe2" />
        <rect x="-1" y="-42" width="2" height="42" fill="#5a3d26" />
      </g>
      {/* umbrella */}
      <g transform="translate(150 262)">
        <rect x="-1.5" y="-38" width="3" height="40" fill="#5a3d26" />
        <path d="M-30 -36 C -20 -56, 20 -56, 30 -36 Z" fill="#f08a5d" />
        <path d="M-10 -36 C -6 -50, 6 -50, 10 -36 Z" fill="#fff4e6" />
        <rect x="8" y="-4" width="28" height="6" rx="2" fill="#f6efe2" />
      </g>
      <Palm x={95} y={250} s={1.1} />
      <Palm x={200} y={300} s={0.9} />
      <Palm x={250} y={340} s={0.75} />
    </>
  );
}

function SnowPine({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2" y="-6" width="4" height="10" fill="#5a3d26" />
      <path d="M0 -46 L15 -16 L-15 -16 Z" fill="#2c5546" />
      <path d="M0 -34 L18 -4 L-18 -4 Z" fill="#244a3c" />
      <path d="M0 -46 L7 -32 L-7 -32 Z" fill="#fff" />
      <path d="M-14 -18 L-4 -22 L6 -18 L15 -16 Z" fill="#fff" />
      <path d="M-18 -4 L-6 -9 L8 -6 L18 -4 Z" fill="#fff" />
    </g>
  );
}

function Acacia({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 C 0 -14, -2 -24, -6 -34 M0 -18 C 6 -26, 10 -30, 14 -36" stroke="#5a3d26" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="2" cy="-40" rx="30" ry="10" fill="#5f7a2c" />
      <ellipse cx="-4" cy="-44" rx="18" ry="7" fill="#71903a" />
    </g>
  );
}

function MountainScene() {
  return (
    <>
      <g>
        <path d="M40 250 L150 60 L230 170 L320 20 L420 150 L470 90 L570 250 Z" fill="#8b7b6c" />
        <path d="M150 60 L176 104 L160 98 L146 112 L134 92 Z" fill="#fff" />
        <path d="M320 20 L360 82 L338 76 L322 92 L304 74 L290 78 Z" fill="#fff" />
        <path d="M470 90 L492 124 L476 120 L462 128 L454 118 Z" fill="#fff" />
        <path d="M320 20 L420 150 L470 90 L570 250 L320 250 Z" fill="#000" opacity="0.08" />
      </g>
      <polygon points={TOP} fill="#cdb48c" />
      <clipPath id="clip-mountain">
        <polygon points={TOP} />
      </clipPath>
      <g clipPath="url(#clip-mountain)">
        <path d="M120 180 C 220 160, 260 220, 380 210 L 380 260 L 120 260 Z" fill="#bea078" />
        <path d="M60 300 C 160 250, 260 330, 360 280 S 520 250, 560 260" stroke="#8a7357" strokeWidth="10" fill="none" />
        <path d="M60 300 C 160 250, 260 330, 360 280 S 520 250, 560 260" stroke="#f2e6cf" strokeWidth="1.5" fill="none" strokeDasharray="6 8" />
      </g>
      {/* monastery */}
      <g transform="translate(250 218)">
        <rect x="-50" y="-26" width="100" height="30" fill="#f7f3ea" />
        <rect x="-50" y="-30" width="100" height="6" fill="#9b2f2f" />
        <rect x="-26" y="-56" width="52" height="28" fill="#f7f3ea" />
        <rect x="-26" y="-60" width="52" height="6" fill="#9b2f2f" />
        <path d="M-6 -60 L0 -72 L6 -60 Z" fill="#d4a637" />
        {[-40, -24, -8, 8, 24].map((x) => (
          <rect key={x} x={x} y="-16" width="8" height="10" fill="#5a3d26" />
        ))}
      </g>
      {/* prayer flags */}
      <path d="M330 180 Q 380 200 430 186" stroke="#7a6a5a" strokeWidth="1" fill="none" />
      {["#2f6fb0", "#f7f3ea", "#c4452f", "#2f8a5b", "#e1b12c", "#2f6fb0", "#f7f3ea", "#c4452f"].map((c, i) => (
        <path key={i} d={`M${336 + i * 12} ${184 + Math.sin(i / 2) * 6} l8 2 l-6 8 Z`} fill={c} />
      ))}
      {/* bike */}
      <g transform="translate(400 286)">
        <circle cx="-12" cy="0" r="7" fill="none" stroke="#262626" strokeWidth="3" />
        <circle cx="12" cy="0" r="7" fill="none" stroke="#262626" strokeWidth="3" />
        <path d="M-12 0 L-2 -10 L10 -10 L12 0 M-2 -10 L-6 -16" stroke="#9b2f2f" strokeWidth="4" fill="none" />
        <circle cx="-2" cy="-20" r="4" fill="#262626" />
      </g>
    </>
  );
}

function BackwatersScene() {
  return (
    <>
      <polygon points={TOP} fill="#86b65e" />
      <clipPath id="clip-backwaters">
        <polygon points={TOP} />
      </clipPath>
      <g clipPath="url(#clip-backwaters)">
        <path d="M30 220 C 160 230, 260 320, 420 300 C 500 290, 540 260, 580 250 L 580 300 C 520 330, 460 350, 400 350 C 260 360, 150 280, 30 270 Z" fill="#4f9a95" />
        <path d="M80 236 C 180 250, 260 320, 400 316" stroke="#d6efe9" strokeWidth="3" fill="none" opacity="0.7" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={70 + i * 30} y={150 + i * 12} width="200" height="7" fill="#78a852" opacity="0.6" transform="rotate(26 300 245)" />
        ))}
      </g>
      {/* houseboat */}
      <g transform="translate(300 318)">
        <ellipse cx="0" cy="14" rx="66" ry="7" fill="#000" opacity="0.15" />
        <path d="M-64 0 C -50 14, 50 14, 64 0 L 56 8 C 40 18, -40 18, -56 8 Z" fill="#5a3a22" />
        <path d="M-60 0 L60 0 L56 8 L-56 8 Z" fill="#6e4628" />
        <path d="M-46 0 C -46 -26, 46 -26, 46 0 Z" fill="#c9a35f" />
        <path d="M-30 -2 C -30 -18, 30 -18, 30 -2" stroke="#a5813f" strokeWidth="2" fill="none" />
        <rect x="-20" y="-8" width="10" height="8" fill="#3a2a1a" />
        <rect x="6" y="-8" width="10" height="8" fill="#3a2a1a" />
      </g>
      <Palm x={110} y={232} s={1} />
      <Palm x={170} y={210} s={0.8} />
      <Palm x={430} y={262} s={0.95} />
      <Palm x={490} y={250} s={0.8} />
      <Palm x={260} y={380} s={0.75} />
      {/* hut */}
      <g transform="translate(400 222)">
        <rect x="-18" y="-16" width="36" height="20" fill="#e9dcc0" />
        <path d="M-24 -14 L0 -34 L24 -14 Z" fill="#8a6a3a" />
      </g>
    </>
  );
}

function HeritageScene() {
  const windows = [0, 1, 2, 3, 4, 5, 6];
  return (
    <>
      <polygon points={TOP} fill="#e9c9ad" />
      <clipPath id="clip-heritage">
        <polygon points={TOP} />
      </clipPath>
      <g clipPath="url(#clip-heritage)">
        {/* ghat steps */}
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M30 ${282 + i * 12} L300 ${417 + i * 12}`} stroke="#d4ab8d" strokeWidth="6" />
        ))}
        <path d="M60 230 L330 120 L560 240" stroke="#dcb89b" strokeWidth="2" fill="none" />
      </g>
      {/* palace */}
      <g transform="translate(300 250)">
        <path d="M-120 0 L-120 -70 L120 -70 L120 0 Z" fill="#e48a83" />
        <path d="M-90 -70 L-90 -110 L90 -110 L90 -70 Z" fill="#ec9c93" />
        <path d="M-50 -110 L-50 -138 L50 -138 L50 -110 Z" fill="#f0aaa0" />
        {[-120, -90, -50, 50, 90, 120].map((x) => (
          <path key={x} d={`M${x - 10} ${x === -50 || x === 50 ? -138 : x === -90 || x === 90 ? -110 : -70} c 0 -16, 20 -16, 20 0 Z`} fill="#f6d7c6" />
        ))}
        <path d="M-14 -138 c 0 -26, 28 -26, 28 0 Z" fill="#f6d7c6" />
        <path d="M0 -164 L0 -174" stroke="#c98a2a" strokeWidth="2" />
        {windows.map((i) => (
          <rect key={`a${i}`} x={-108 + i * 32} y="-56" width="14" height="22" rx="7" fill="#b04f50" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={`b${i}`} x={-78 + i * 34} y="-98" width="12" height="18" rx="6" fill="#b04f50" />
        ))}
        {[0, 1, 2].map((i) => (
          <rect key={`c${i}`} x={-36 + i * 30} y="-130" width="10" height="14" rx="5" fill="#b04f50" />
        ))}
        <path d="M-14 0 L-14 -24 C -14 -36, 14 -36, 14 -24 L14 0 Z" fill="#7a2f33" />
      </g>
      <Pine x={120} y={262} s={0.8} />
      <Pine x={480} y={262} s={0.8} />
      {/* diya boats */}
      <circle cx="210" cy="372" r="3" fill="#f2b34a" />
      <circle cx="236" cy="384" r="3" fill="#f2b34a" />
    </>
  );
}

function WildlifeScene() {
  return (
    <>
      <polygon points={TOP} fill="#bdb867" />
      <clipPath id="clip-wildlife">
        <polygon points={TOP} />
      </clipPath>
      <g clipPath="url(#clip-wildlife)">
        <ellipse cx="400" cy="270" rx="70" ry="28" fill="#5c9aa0" />
        <ellipse cx="400" cy="266" rx="56" ry="20" fill="#6fb0b4" />
        <path d="M60 280 C 180 260, 260 320, 380 330" stroke="#a49a52" strokeWidth="14" fill="none" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <path key={i} d={`M${90 + i * 55} ${200 + (i % 3) * 40} l4 -12 l4 12 l4 -10 l3 10`} stroke="#8e8a3c" strokeWidth="2" fill="none" />
        ))}
      </g>
      <Acacia x={150} y={238} s={1.2} />
      <Acacia x={300} y={190} s={0.9} />
      <Acacia x={490} y={262} s={1} />
      {/* tiger */}
      <g transform="translate(330 270)">
        <ellipse cx="0" cy="12" rx="30" ry="5" fill="#000" opacity="0.15" />
        <path d="M-26 -6 C -26 -16, 18 -18, 22 -8 L 30 -14 C 36 -14, 38 -6, 34 -2 L 26 0 L 24 10 L 18 10 L 16 2 L -14 2 L -16 10 L -22 10 L -22 2 C -32 0, -38 -10, -44 -14" fill="#e08a2e" stroke="#e08a2e" strokeWidth="2" strokeLinejoin="round" />
        {[-14, -6, 2, 10].map((x) => (
          <path key={x} d={`M${x} -15 l2 8`} stroke="#2a1d16" strokeWidth="2.5" strokeLinecap="round" />
        ))}
        <circle cx="31" cy="-9" r="1.5" fill="#2a1d16" />
      </g>
      <Jeep x={190} y={300} color="#5c6b2a" />
    </>
  );
}

function SnowScene() {
  return (
    <>
      <g>
        <path d="M60 250 L170 90 L250 180 L340 50 L440 170 L490 120 L560 250 Z" fill="#c9d6e6" />
        <path d="M340 50 L440 170 L490 120 L560 250 L340 250 Z" fill="#a9bbd2" />
      </g>
      <polygon points={TOP} fill="#f4f7fb" />
      <clipPath id="clip-snow">
        <polygon points={TOP} />
      </clipPath>
      <g clipPath="url(#clip-snow)">
        <path d="M120 200 C 200 240, 220 300, 300 380" stroke="#dbe4f0" strokeWidth="18" fill="none" />
        <path d="M380 180 C 360 240, 420 300, 480 320" stroke="#dbe4f0" strokeWidth="12" fill="none" />
      </g>
      {/* gondola */}
      <path d="M70 120 L520 300" stroke="#3a4a63" strokeWidth="1.5" />
      <g transform="translate(250 192)">
        <path d="M0 0 L0 10" stroke="#3a4a63" strokeWidth="1.5" />
        <rect x="-12" y="10" width="24" height="20" rx="4" fill="#c4452f" />
        <rect x="-8" y="14" width="16" height="7" rx="1" fill="#d8e8f6" />
      </g>
      {/* chalet */}
      <g transform="translate(410 250)">
        <rect x="-26" y="-22" width="52" height="28" fill="#8a5a36" />
        <path d="M-34 -18 L0 -46 L34 -18 Z" fill="#fff" />
        <path d="M-34 -18 L0 -46 L34 -18 L30 -16 L0 -40 L-30 -16 Z" fill="#c9d6e6" />
        <rect x="-6" y="-10" width="12" height="16" fill="#4a2f1c" />
        <rect x="-20" y="-14" width="8" height="8" fill="#f2c45a" />
      </g>
      <SnowPine x={140} y={240} s={1.1} />
      <SnowPine x={176} y={258} s={0.85} />
      <SnowPine x={500} y={262} s={0.95} />
      <SnowPine x={330} y={340} s={0.8} />
      {/* skier */}
      <g transform="translate(250 300)">
        <path d="M-10 6 L12 0" stroke="#27467a" strokeWidth="2" />
        <path d="M0 2 L2 -10" stroke="#27467a" strokeWidth="4" strokeLinecap="round" />
        <circle cx="3" cy="-14" r="3.5" fill="#c4452f" />
      </g>
    </>
  );
}

const scenes: Record<TourType, () => React.ReactNode> = {
  hills: HillsScene,
  desert: DesertScene,
  beach: BeachScene,
  mountain: MountainScene,
  backwaters: BackwatersScene,
  heritage: HeritageScene,
  wildlife: WildlifeScene,
  snow: SnowScene,
};

export default function Diorama({
  type,
  image,
  alt,
}: {
  type: TourType;
  image?: string;
  alt: string;
}) {
  if (image) {
    return (
      <Image src={image} alt={alt} width={1200} height={920} priority className="h-auto w-full drop-shadow-2xl" />
    );
  }

  const p = palettes[type];
  const Scene = scenes[type];

  return (
    <svg viewBox="0 0 600 460" role="img" aria-label={alt} className="h-auto w-full">
      <ellipse cx="300" cy="430" rx="250" ry="26" fill={p.shadow} opacity="0.18" />
      <polygon points={LEFT} fill={p.left} />
      <polygon points={RIGHT} fill={p.right} />
      <Scene />
    </svg>
  );
}
