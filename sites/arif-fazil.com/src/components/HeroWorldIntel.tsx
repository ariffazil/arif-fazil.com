import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface TacticalNode {
  id: string;
  name: string;
  category: 'chokepoint' | 'energy' | 'macro';
  flow: string;
  status: 'NOMINAL' | 'ALERT' | 'MONITORED';
  x: number; // percentage in SVG radar map
  y: number;
}

const TACTICAL_NODES: TacticalNode[] = [
  { id: 'malacca', name: 'STRAIT OF MALACCA', category: 'chokepoint', flow: '16.5M bpd · 40% World Trade', status: 'MONITORED', x: 74, y: 56 },
  { id: 'hormuz', name: 'STRAIT OF HORMUZ', category: 'chokepoint', flow: '20.8M bpd · Persian Gulf Transit', status: 'ALERT', x: 58, y: 44 },
  { id: 'luconia', name: 'SARAWAK LUCONIA', category: 'energy', flow: 'Kasawari & Jerun · MLNG Feed', status: 'NOMINAL', x: 78, y: 58 },
  { id: 'redsea', name: 'BAB EL-MANDEB', category: 'chokepoint', flow: '8.8M bpd · Suez Route Flow', status: 'ALERT', x: 52, y: 48 },
  { id: 'brent', name: 'BRENT SEABORNE', category: 'macro', flow: '$74.20/bbl · Dated Crude Benchmark', status: 'NOMINAL', x: 42, y: 32 },
];

export function HeroWorldIntel() {
  const [selectedNode, setSelectedNode] = useState<TacticalNode>(TACTICAL_NODES[0]);
  const [radarSweep, setRadarSweep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRadarSweep((s) => (s + 2) % 360);
    }, 40);
    return () => clearInterval(timer);
  }, []);

  return (
    <article className="group relative rounded-xl border border-[#1F2733] bg-[#090C12] p-6 hover:border-[#38BDF8]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg">
      <div className="absolute top-0 right-0 p-4 font-mono text-[9px] uppercase tracking-widest text-[#38BDF8] bg-[#141A24]/70 rounded-bl-lg border-l border-b border-[#1F2733]">
        PALANTIR · OSINT
      </div>

      <div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-2">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
          <span>WORLD MODULE · L2</span>
        </div>
        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-2">
          Palantir Macro Atlas
        </h3>
        <p className="font-sans text-xs text-[#9AA0A8] leading-relaxed mb-4">
          Tactical maritime chokepoints, LNG energy basins, and sovereign commodity flows with zero-latency telemetry.
        </p>

        {/* Palantir Tactical Radar Viewport */}
        <div className="relative w-full aspect-[4/3] rounded-lg bg-[#04060A] border border-[#1F2733] flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full p-2" viewBox="0 0 100 75" preserveAspectRatio="none">
            {/* Dark Grid Lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.5" />
            <line x1="25" y1="0" x2="25" y2="75" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.5" />
            <line x1="50" y1="0" x2="50" y2="75" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.5" />
            <line x1="75" y1="0" x2="75" y2="75" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="0.5" />

            {/* Concentric Radar Circles */}
            <circle cx="50" cy="37.5" r="30" fill="none" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="0.5" />
            <circle cx="50" cy="37.5" r="18" fill="none" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="0.5" />

            {/* Sweep Line */}
            <g transform={`rotate(${radarSweep} 50 37.5)`}>
              <line x1="50" y1="37.5" x2="80" y2="37.5" stroke="#38BDF8" strokeWidth="0.8" opacity="0.6" />
              <polygon points="50,37.5 80,37.5 75,44" fill="rgba(56, 189, 248, 0.15)" />
            </g>

            {/* Nodes */}
            {TACTICAL_NODES.map((node) => {
              const isSel = selectedNode.id === node.id;
              const color = node.status === 'ALERT' ? '#EF4444' : node.status === 'MONITORED' ? '#F59E0B' : '#10B981';

              return (
                <g key={node.id} className="cursor-pointer" onClick={() => setSelectedNode(node)}>
                  {/* Ping animation if selected */}
                  {isSel && (
                    <circle cx={node.x} cy={node.y} r="5" fill="none" stroke={color} strokeWidth="0.6" opacity="0.8" />
                  )}
                  <circle cx={node.x} cy={node.y} r={isSel ? 2.5 : 1.8} fill={color} />
                  <text 
                    x={node.x + 3} 
                    y={node.y + 1.2} 
                    fill={isSel ? '#FFFFFF' : '#8A8578'} 
                    fontSize="3" 
                    fontFamily="monospace"
                    fontWeight={isSel ? 'bold' : 'normal'}
                  >
                    {node.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Top telemetry status */}
          <div className="absolute top-2 left-2 flex items-center gap-2 px-2 py-1 rounded bg-black/70 font-mono text-[8px] text-[#38BDF8] uppercase tracking-wider backdrop-blur-xs border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span>GLOBAL SIGINT ACTIVE</span>
          </div>

          <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 font-mono text-[8px] text-[#9AA0A8] uppercase tracking-wider backdrop-blur-xs border border-white/5">
            Click Node to Query Telemetry
          </div>
        </div>

        {/* Selected Node Telemetry */}
        <div className="mt-4 pt-3 border-t border-[#1F2733]">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider mb-1.5">
            <span className="text-white font-bold">{selectedNode.name}</span>
            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
              selectedNode.status === 'ALERT' ? 'bg-red-950 text-red-400 border border-red-800' :
              selectedNode.status === 'MONITORED' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
              'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>
              {selectedNode.status}
            </span>
          </div>
          <div className="p-2.5 rounded bg-[#06080E] border border-[#1F2733] font-mono text-[10px] text-[#9AA0A8] flex justify-between items-center">
            <span>{selectedNode.flow}</span>
            <span className="text-[#38BDF8] text-[9px]">P ≥ 0.99 OBS</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#1F2733] flex items-center justify-between">
        <Link 
          to="/world" 
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#38BDF8] hover:underline uppercase tracking-wider font-semibold"
        >
          Open World Radar →
        </Link>
        <span className="font-mono text-[9px] text-[#6A7382]">OIL · GAS · GOLD · MACRO</span>
      </div>
    </article>
  );
}
export default HeroWorldIntel;
