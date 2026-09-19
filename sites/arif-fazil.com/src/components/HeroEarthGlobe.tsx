import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface DiscoveryWell {
  name: string;
  depth: string;
  play: string;
  lat: number;
  lng: number;
  significance: string;
}

const DISCOVERY_WELLS: DiscoveryWell[] = [
  { name: 'BEKANTAN-1', depth: '1,420m', play: 'Shallow Clastic Group E/H', lat: 5.4, lng: 104.8, significance: 'Shallowest flowing oil discovery in Malay Basin.' },
  { name: 'PUTERI BASEMENT-1', depth: '2,850m', play: 'Fractured Pre-Tertiary Granite', lat: 5.1, lng: 104.9, significance: 'Basement water-bearing; commercial pay in overlying K-5 sands.' },
  { name: 'LEBAH EMAS-1', depth: '3,100m', play: 'Western Hinge Fault Wildcat', lat: 4.8, lng: 103.9, significance: 'Multi-zone pay across 11 intervals in PM6/12.' },
  { name: 'BUNGA TASBIH-1', depth: '2,480m', play: 'Syn-Rift Test / Post-Rift Pay', lat: 6.2, lng: 104.5, significance: 'Post-rift I & J oil, enabling MBR+ Small Field Asset award.' },
];

export function HeroEarthGlobe() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedWell, setSelectedWell] = useState<DiscoveryWell>(DISCOVERY_WELLS[0]);
  const [isRotating, setIsRotating] = useState(true);
  const angleRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      if (isRotating) {
        angleRef.current = (angleRef.current + 0.008) % (2 * Math.PI);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - 24;

      // Glow background
      const grad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.2);
      grad.addColorStop(0, 'rgba(228, 87, 46, 0.12)');
      grad.addColorStop(0.7, 'rgba(17, 24, 39, 0.4)');
      grad.addColorStop(1, 'rgba(10, 11, 13, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Globe circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#06080D';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#E4572E';
      ctx.stroke();

      // Atmospheric limb
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 3, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(228, 87, 46, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Latitudinal rings
      for (let lat = -60; lat <= 60; lat += 30) {
        const y = cy - Math.sin((lat * Math.PI) / 180) * radius;
        const rLat = Math.cos((lat * Math.PI) / 180) * radius;
        ctx.beginPath();
        ctx.ellipse(cx, y, rLat, rLat * 0.25, 0, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Longitudinal lines with rotation
      for (let lon = 0; lon < 360; lon += 45) {
        const effAngle = (lon * Math.PI) / 180 + angleRef.current;
        const xOffset = Math.sin(effAngle) * radius;
        const isVisible = Math.cos(effAngle) > -0.2;
        if (isVisible) {
          ctx.beginPath();
          ctx.ellipse(cx + xOffset * 0.1, cy, Math.abs(xOffset), radius, 0, 0, 2 * Math.PI);
          ctx.strokeStyle = 'rgba(228, 87, 46, 0.12)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Tectonic plate boundary simulation arcs
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4 + angleRef.current * 0.5;
        const px = cx + Math.cos(a) * (radius * 0.85);
        const py = cy + Math.sin(a * 1.5) * (radius * 0.7);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Discovery Wells Markers
      DISCOVERY_WELLS.forEach((w, idx) => {
        // Approximate projection relative to Malay Basin offset
        const baseLon = ((w.lng - 104) * Math.PI) / 30 + angleRef.current + (idx * 0.7);
        const cosLon = Math.cos(baseLon);
        if (cosLon > 0) { // front face
          const wx = cx + Math.sin(baseLon) * (radius * 0.75);
          const wy = cy - Math.sin((w.lat * Math.PI) / 180) * (radius * 0.6) + (idx * 14 - 28);

          const isSel = selectedWell.name === w.name;
          ctx.beginPath();
          ctx.arc(wx, wy, isSel ? 6 : 3.5, 0, 2 * Math.PI);
          ctx.fillStyle = isSel ? '#E4572E' : '#38BDF8';
          ctx.fill();
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = isSel ? 2 : 1;
          ctx.stroke();

          // Pulse ring for selected
          if (isSel) {
            ctx.beginPath();
            ctx.arc(wx, wy, 10, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(228, 87, 46, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isRotating, selectedWell]);

  return (
    <article className="group relative rounded-xl border border-[#1F2733] bg-[#090C12] p-6 hover:border-[#E4572E]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg">
      <div className="absolute top-0 right-0 p-4 font-mono text-[9px] uppercase tracking-widest text-[#E4572E] bg-[#141A24]/70 rounded-bl-lg border-l border-b border-[#1F2733]">
        GEOX · MACROSTRAT
      </div>

      <div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-2">
          <span className="w-2 h-2 rounded-full bg-[#E4572E]" />
          <span>EARTH MODULE · L2</span>
        </div>
        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-2">
          Macrostrat Globe
        </h3>
        <p className="font-sans text-xs text-[#9AA0A8] leading-relaxed mb-4">
          Deep-time stratigraphy, crustal lithology polygons, and physics-anchored discovery wells across the Malay Basin.
        </p>

        {/* 3D Canvas Viewport */}
        <div 
          className="relative w-full aspect-[4/3] rounded-lg bg-[#04060A] border border-[#1F2733] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsRotating(false)}
          onMouseLeave={() => setIsRotating(true)}
        >
          <canvas 
            ref={canvasRef} 
            width={340} 
            height={255} 
            className="w-full h-full object-contain"
          />
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 font-mono text-[8px] text-[#9AA0A8] uppercase tracking-wider backdrop-blur-xs border border-white/5">
            Hover to Freeze · Malay Basin PM304
          </div>
        </div>

        {/* Well Inspector Selector */}
        <div className="mt-4 pt-3 border-t border-[#1F2733]">
          <div className="font-mono text-[9px] uppercase tracking-wider text-[#8A8578] mb-1.5 flex justify-between">
            <span>Flagship Discovery Wells:</span>
            <span className="text-[#E4572E] font-semibold">{selectedWell.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {DISCOVERY_WELLS.map((w) => (
              <button
                key={w.name}
                onClick={() => setSelectedWell(w)}
                className={`px-2 py-1.5 rounded text-left font-mono text-[9px] truncate border transition-colors ${
                  selectedWell.name === w.name
                    ? 'bg-[#E4572E]/15 border-[#E4572E] text-white font-bold'
                    : 'bg-[#10141D] border-[#1F2733] text-[#8A8578] hover:text-white'
                }`}
              >
                {w.name}
              </button>
            ))}
          </div>
          <div className="mt-2.5 p-2 rounded bg-[#06080E] border border-[#1F2733] font-mono text-[9px] text-[#9AA0A8] leading-normal">
            <span className="text-white font-semibold">{selectedWell.play}</span> ({selectedWell.depth}) — {selectedWell.significance}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#1F2733] flex items-center justify-between">
        <Link 
          to="/earth" 
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#E4572E] hover:underline uppercase tracking-wider font-semibold"
        >
          Explore Earth Globe →
        </Link>
        <span className="font-mono text-[9px] text-[#6A7382]">2.5M POLYGONS</span>
      </div>
    </article>
  );
}
export default HeroEarthGlobe;
