import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

export function HeroGenesis000() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: Particle[] = [];
    const colors = ['#E4572E', '#C9A227', '#38BDF8', '#FFFFFF', '#A855F7'];

    // Initialize Big Bang particle burst
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 1.8 + 0.3;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2.2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.8 + 0.2,
      });
    }

    const render = () => {
      // Fade trail
      ctx.fillStyle = 'rgba(6, 8, 14, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Central gravitational singularity core
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      coreGrad.addColorStop(0.3, 'rgba(201, 162, 39, 0.6)');
      coreGrad.addColorStop(0.7, 'rgba(228, 87, 46, 0.2)');
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, 2 * Math.PI);
      ctx.fill();

      // Update and draw cosmic particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Gravitational pull back to center if too far
        const dx = cx - p.x;
        const dy = cy - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 120) {
          p.vx += (dx / dist) * 0.08;
          p.vy += (dy / dist) * 0.08;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <article className="group relative rounded-xl border border-[#1F2733] bg-[#090C12] p-6 hover:border-[#D9A62E]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg">
      <div className="absolute top-0 right-0 p-4 font-mono text-[9px] uppercase tracking-widest text-[#D9A62E] bg-[#141A24]/70 rounded-bl-lg border-l border-b border-[#1F2733]">
        GENESIS · ROOT
      </div>

      <div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#9AA0A8] mb-2">
          <span className="w-2 h-2 rounded-full bg-[#D9A62E]" />
          <span>000 MODULE · L2</span>
        </div>
        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white mb-2">
          Cosmic Big Bang
        </h3>
        <p className="font-sans text-xs text-[#9AA0A8] leading-relaxed mb-4">
          Stellar nucleosynthesis and cosmic genesis: the bridge connecting cosmological origins to human biological reality.
        </p>

        {/* Big Bang Particle Simulation Viewport */}
        <div className="relative w-full aspect-[4/3] rounded-lg bg-[#04060A] border border-[#1F2733] flex items-center justify-center overflow-hidden">
          <canvas 
            ref={canvasRef} 
            width={340} 
            height={255} 
            className="w-full h-full object-cover"
          />

          {/* Central Carl Sagan Quote Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none bg-gradient-to-t from-black/80 via-black/30 to-transparent">
            <span className="font-serif italic text-sm sm:text-base text-[#EDEAE2] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] max-w-[240px] leading-snug">
              "We are made of star-stuff. We are a way for the cosmos to know itself."
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-forge-gold mt-2">
              — Carl Sagan · Cosmos (1980)
            </span>
          </div>

          <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 font-mono text-[8px] text-[#9AA0A8] uppercase tracking-wider backdrop-blur-xs border border-white/5">
            Stellar Nucleosynthesis Canvas
          </div>
        </div>

        {/* Conceptual Anchor */}
        <div className="mt-4 pt-3 border-t border-[#1F2733]">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[#8A8578] mb-1.5">
            <span>Cosmic to Biological Bridge:</span>
            <span className="text-forge-gold font-bold">UNCREATED SEED</span>
          </div>
          <div className="p-2.5 rounded bg-[#06080E] border border-[#1F2733] font-mono text-[10px] text-[#9AA0A8] leading-relaxed">
            The nitrogen in human DNA and the iron in our blood were forged in collapsing stellar cores. The DunedinPACE clock tracks elements with a 13.8-billion-year lineage.
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#1F2733] flex items-center justify-between">
        <Link 
          to="/000" 
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#D9A62E] hover:underline uppercase tracking-wider font-semibold"
        >
          Enter 000 Genesis →
        </Link>
        <span className="font-mono text-[9px] text-[#6A7382]">SOVEREIGN ROOT ANCHOR</span>
      </div>
    </article>
  );
}
export default HeroGenesis000;
