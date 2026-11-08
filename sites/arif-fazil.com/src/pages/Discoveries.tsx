import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { discoveries } from '@/data/discoveries';
import { useWebMCP } from '@/hooks/useWebMCP';
import { QuoteCard } from '@/components/QuoteCard';

const discoveriesTools = [
  {
    name: 'get_discoveries_data',
    description: 'Get details of discoveries, regional syntheses, and computational systems (Bekantan-1, Lebah Emas-1, Bunga Tasbih-1, Puteri Basement-1, Malay Basin Synthesis, Sabah Basin, arifOS, GEOX, etc.) with precise attribution, evidence, and structural categories.',
    execute() {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(discoveries, null, 2)
        }]
      };
    }
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Records' },
  { id: 'wells', label: 'Discoveries & Exploration Wells' },
  { id: 'regional', label: 'Regional Basin Work' },
  { id: 'systems', label: 'Computational Systems' }
] as const;

export function Discoveries() {
  useWebMCP(discoveriesTools);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    document.title = 'The Work & The Record — Subsurface & Systems | Arif Fazil';
    document.querySelector('link[rel=canonical]')?.setAttribute('href', 'https://arif-fazil.com/discoveries/');
  }, []);

  const filteredDiscoveries = discoveries.filter(
    (d) => activeCategory === 'all' || d.category === activeCategory
  );

  return (
    <motion.div 
      initial={false}
      animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen"
    >
      {/* ── 3D MACROSTRAT GLOBE HERO ─────────────────────── */}
      <section className="relative border-b-2 border-forge-iron bg-black">
        <div className="site-frame py-3 flex items-center justify-between">
          <div className="section-label !mb-0">Φ GEOX · Live Macrostrat Geologic Map · Plate Boundaries · USGS Quakes</div>
          <a href="/earth/index.html" target="_blank" rel="noreferrer" className="font-mono text-[0.7rem] text-forge-orange hover:text-forge-white transition-colors">
            Open Standalone Globe ↗
          </a>
        </div>
        <div className="w-full h-[640px] relative bg-black border-t border-forge-iron/60">
          <iframe 
            src="/earth/index.html#top" 
            title="Dynamic Macrostrat 3D Earth Globe" 
            className="w-full h-full border-0"
            loading="eager"
          />
        </div>
      </section>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">Subsurface · Φ GEOX · Evidence · Attribution Discipline</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-8">
                The Work<br />& The Record
              </h1>
              <p className="font-body text-xl text-forge-dim leading-relaxed">
                Every claim audit-grade. Discovered wells, regional syntheses, and computational systems—separated by structural layer and verified against physical reality.
              </p>
            </div>
            <div>
              <QuoteCard
                topic="A Pale Blue Dot"
                quote="Look again at that dot. That's here. That's home. That's us. On it everyone you love, everyone you know, everyone you ever heard of, every human being who ever was, lived out their lives... on a mote of dust suspended in a sunbeam."
                author="Carl Sagan"
                source="Pale Blue Dot (1994)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTER ─────────────────────────────── */}
      <section className="border-b border-forge-iron bg-forge-black sticky top-0 z-20 backdrop-blur bg-opacity-95">
        <div className="site-frame py-4 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`font-technical text-[0.72rem] uppercase tracking-wider px-4 py-2 border transition-all ${
                  activeCategory === c.id
                    ? 'border-forge-orange bg-forge-orange text-black font-bold'
                    : 'border-forge-iron text-forge-dim hover:text-forge-white hover:border-forge-dim'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <span className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest">
            Showing {filteredDiscoveries.length} sealed items · F2 TRUTH
          </span>
        </div>
      </section>

      {/* ── LIST ─────────────────────────────────────────── */}
      <section className="py-24">
        <div className="site-frame">
          <div className="space-y-12">
            {filteredDiscoveries.map((d) => (
              <motion.div 
                key={d.id}
                whileInView={{ x: [20, 0], opacity: [0, 1] }}
                viewport={{ once: true }}
                className="brutalist-card group"
              >
                <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
                  {/* Left: Metadata & Role Attribution */}
                  <div className="lg:w-1/3">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-technical text-2xl font-black text-forge-orange">{d.year}</span>
                      <span className="w-full h-[1px] bg-forge-iron"></span>
                    </div>
                    <span className="font-technical text-[0.62rem] text-forge-orange uppercase tracking-widest block mb-1">
                      {d.categoryLabel}
                    </span>
                    <h2 className="text-3xl font-black uppercase italic mb-2 group-hover:text-forge-orange transition-colors tracking-tight">
                      {d.title}
                    </h2>
                    <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-3">
                      {d.location}
                    </p>
                    <div className="inline-block bg-forge-steel border border-forge-iron px-3 py-1.5 mb-6">
                      <span className="font-technical text-[0.62rem] text-forge-dim uppercase block">Attributed Role:</span>
                      <span className="font-technical text-[0.72rem] text-forge-white font-bold">{d.role}</span>
                    </div>
                    
                    {d.link && (
                      <div>
                        <a 
                          href={d.link} 
                          target={d.link.startsWith('http') ? '_blank' : undefined}
                          rel="noreferrer" 
                          className="button-forge text-[0.7rem] py-2 px-4 inline-block"
                        >
                          {d.linkLabel || 'View Dataset →'}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Middle: Summary */}
                  <div className="lg:w-1/3">
                    <div className="section-label !mb-4">Technical Summary & Findings</div>
                    <p className="font-body text-forge-dim leading-relaxed">
                      {d.summary}
                    </p>
                  </div>

                  {/* Right: Evidence */}
                  <div className="lg:w-1/3 bg-forge-steel p-6 border-l-2 border-forge-orange">
                    <div className="section-label !mb-4 text-forge-orange">Audit Evidence & Physical Proof</div>
                    <ul className="space-y-4">
                      {d.evidence.map((e, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="w-1 h-1 bg-forge-orange mt-1.5 shrink-0"></span>
                          <span className="font-technical text-[0.7rem] uppercase leading-tight text-forge-white">
                            {e}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="py-24 bg-forge-steel border-y-2 border-forge-iron">
        <div className="site-frame text-center">
          <p className="font-technical text-forge-dim uppercase tracking-widest mb-4">Explore Subsurface & Governance Architecture</p>
          <h2 className="text-4xl font-black uppercase italic mb-8">Earth Intelligence & Constitutional Systems.</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://geox.arif-fazil.com" target="_blank" rel="noreferrer" className="button-forge button-forge--accent">
              Launch GEOX Surface ↗
            </a>
            <a href="https://arifos.arif-fazil.com" target="_blank" rel="noreferrer" className="button-forge">
              arifOS Observatory ↗
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export const ssgOptions = {
  slug: 'discoveries',
  routeUrl: '/discoveries/',
};

export default Discoveries;
