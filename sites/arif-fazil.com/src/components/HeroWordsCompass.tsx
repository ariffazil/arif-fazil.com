import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface FloorPoint {
  code: string;
  name: string;
  angle: number;
  type: 'HARD' | 'SOFT' | 'SOVEREIGN';
  axiom: string;
}

const CONSTITUTIONAL_FLOORS: FloorPoint[] = [
  { code: 'F1', name: 'AMANAH', angle: 0, type: 'HARD', axiom: 'Reversibility first. What cannot be undone requires human seal.' },
  { code: 'F2', name: 'TRUTH', angle: 27.7, type: 'HARD', axiom: 'Evidence before narrative. P(truth) ≥ 0.99 with epistemic labels.' },
  { code: 'F3', name: 'WITNESS', angle: 55.4, type: 'HARD', axiom: 'Tri-witness consensus: Human × Agent × Earth × Verifier.' },
  { code: 'F4', name: 'CLARITY', angle: 83.1, type: 'HARD', axiom: 'Entropy reduction on every output (ΔS ≤ 0). Zero noise.' },
  { code: 'F5', name: 'PEACE²', angle: 110.8, type: 'SOFT', axiom: 'Non-destructive power. Power used to stabilize, not destroy.' },
  { code: 'F6', name: 'MARUAH', angle: 138.5, type: 'SOFT', axiom: 'Dual-registry bridge. Protect weakest stakeholder & human honor.' },
  { code: 'F7', name: 'HUMILITY', angle: 166.2, type: 'HARD', axiom: 'No fake certainty. The final question stays open (Ω₀ ≤ 0.05).' },
  { code: 'F8', name: 'LINEAGE', angle: 193.8, type: 'HARD', axiom: 'Explicit causality and trace_id across all operations.' },
  { code: 'F9', name: 'PROVENANCE', angle: 221.5, type: 'HARD', axiom: 'Primary source citations only. Hallucination is failure.' },
  { code: 'F10', name: 'ONTOLOGY', angle: 249.2, type: 'HARD', axiom: 'AI is substrate tool; sovereign human has soul. No false sentience.' },
  { code: 'F11', name: 'AUDIT', angle: 276.9, type: 'HARD', axiom: 'Every consequential decision logged in immutable Merkle tree.' },
  { code: 'F12', name: 'DIGNITY', angle: 304.6, type: 'HARD', axiom: 'Human body and sleep preserved. AI serves, never dictates.' },
  { code: 'F13', name: 'SOVEREIGN', angle: 332.3, type: 'SOVEREIGN', axiom: 'Human veto is absolute. Arif owns F13. Ditempa bukan diberi.' },
];

export function HeroWordsCompass() {
  const [selectedFloor, setSelectedFloor] = useState<FloorPoint>(CONSTITUTIONAL_FLOORS[12]); // Default F13
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setRotation(r => (r + 0.3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <article className="group relative rounded-xl border border-[#1F2733] bg-[#090C12] p-6 hover:border-[#C9A227]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg">
      <div className="absolute top-0 right-0 p-4 font-mono text-[9px] uppercase tracking-widest text-forge-gold bg-[#141A24]/70 rounded-bl-lg border-l border-b border-[#1F2733]">
        AAA · CANON
      </div>

      <div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-2">
          <span className="w-2 h-2 rounded-full bg-forge-gold" />
          <span>WORDS MODULE · L2</span>
        </div>
        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-2">
          Constitutional Compass
        </h3>
        <p className="font-sans text-xs text-[#9AA0A8] leading-relaxed mb-4">
          Semantic navigation across 63 essays, 13 constitutional floors, and the holy 8-verb execution chain.
        </p>

        {/* 13-Point Radial Compass UI */}
        <div 
          className="relative w-full aspect-[4/3] rounded-lg bg-[#04060A] border border-[#1F2733] flex items-center justify-center overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <svg className="w-full h-full p-2 max-w-[280px]" viewBox="0 0 280 280">
            {/* Outer Compass Ring */}
            <circle cx="140" cy="140" r="115" fill="none" stroke="#1F2733" strokeWidth="1.5" />
            <circle cx="140" cy="140" r="122" fill="none" stroke="rgba(201, 162, 39, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="140" cy="140" r="85" fill="rgba(9, 12, 18, 0.8)" stroke="#1F2733" strokeWidth="1" />

            {/* Rotating Star Needle */}
            <g transform={`rotate(${rotation} 140 140)`} className="transition-transform duration-75">
              <line x1="140" y1="35" x2="140" y2="245" stroke="rgba(201, 162, 39, 0.25)" strokeWidth="1" />
              <line x1="35" y1="140" x2="245" y2="140" stroke="rgba(201, 162, 39, 0.25)" strokeWidth="1" />
              <polygon points="140,45 145,135 140,140 135,135" fill="#C9A227" />
              <polygon points="140,235 144,145 140,140 136,145" fill="#1F2733" />
            </g>

            {/* 13 Floor Nodes around the circle */}
            {CONSTITUTIONAL_FLOORS.map((f) => {
              const rad = ((f.angle - 90) * Math.PI) / 180;
              const x = 140 + 115 * Math.cos(rad);
              const y = 140 + 115 * Math.sin(rad);
              const isSelected = selectedFloor.code === f.code;

              return (
                <g 
                  key={f.code}
                  className="cursor-pointer"
                  onClick={() => setSelectedFloor(f)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 9 : 6}
                    fill={isSelected ? '#C9A227' : f.type === 'SOVEREIGN' ? '#E4572E' : '#111622'}
                    stroke={isSelected ? '#FFFFFF' : '#C9A227'}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  <text
                    x={x}
                    y={y + 3.5}
                    textAnchor="middle"
                    fill={isSelected ? '#000000' : '#EDEAE2'}
                    fontSize="7"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {f.code.replace('F', '')}
                  </text>
                </g>
              );
            })}

            {/* Center Dial Readout */}
            <circle cx="140" cy="140" r="32" fill="#07090E" stroke="#C9A227" strokeWidth="1.5" />
            <text x="140" y="135" textAnchor="middle" fill="#C9A227" fontSize="12" fontFamily="monospace" fontWeight="bold">
              {selectedFloor.code}
            </text>
            <text x="140" y="148" textAnchor="middle" fill="#EDEAE2" fontSize="7" fontFamily="monospace" letterSpacing="0.08em">
              {selectedFloor.name}
            </text>
          </svg>

          <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 font-mono text-[8px] text-[#9AA0A8] uppercase tracking-wider backdrop-blur-xs border border-white/5">
            Click Node to Inspect Floor
          </div>
        </div>

        {/* Selected Floor Readout */}
        <div className="mt-4 pt-3 border-t border-[#1F2733]">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider mb-1.5">
            <span className="text-white font-bold">{selectedFloor.code} · {selectedFloor.name}</span>
            <span className="text-forge-gold">{selectedFloor.type} FLOOR</span>
          </div>
          <div className="p-2.5 rounded bg-[#06080E] border border-[#1F2733] font-mono text-[10px] text-[#9AA0A8] leading-relaxed">
            "{selectedFloor.axiom}"
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#1F2733] flex items-center justify-between">
        <Link 
          to="/words" 
          className="inline-flex items-center gap-1.5 font-mono text-xs text-forge-gold hover:underline uppercase tracking-wider font-semibold"
        >
          Browse 63 Essays →
        </Link>
        <span className="font-mono text-[9px] text-[#6A7382]">9 SERIES · 13 FLOORS</span>
      </div>
    </article>
  );
}
export default HeroWordsCompass;
